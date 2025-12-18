import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { BASE_URL } from "../../config";
import styles from "../../styles/EmployeeHomeStyles";
import client from "../../api/client";
// Helper: Durum Renkleri
const getStatusTheme = (status: string) => {
  switch (status) {
    case "assigned":
      return { style: styles.status_assigned, textColor: "#1e40af" };
    case "in_progress":
      return { style: styles.status_in_progress, textColor: "#854d0e" };
    case "completed":
      return { style: styles.status_completed, textColor: "#166534" };
    case "resolved":
      return { style: styles.status_completed, textColor: "#15803d" };
    default:
      return { style: {}, textColor: "#64748b" };
  }
};

const statusLabelMap: Record<string, string> = {
  assigned: "Yeni Görev",
  in_progress: "İşlemde",
  completed: "Tamamlandı",
  resolved: "Çözüldü",
};

export default function EmployeeHomeScreen() {
  const navigation = useNavigation<any>();

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // --- Veri Çekme ---
  const loadData = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const res = await client.get(`${BASE_URL}/employee/complaints/assigned`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(res.data || []);

    } catch (e) {
      console.log("Veri çekme hatası:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const unsub = navigation.addListener("focus", loadData);
    loadData();
    return unsub;
  }, [loadData, navigation]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  // --- Liste Elemanı Render ---
  const renderItem = ({ item }: { item: any }) => {
    const c = item.complaint;
    const statusTheme = getStatusTheme(item.assignment_status);

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.7}
        onPress={() =>
          navigation.navigate("EmployeeJobDetail", {
            complaintId: c.id,
            assignmentId: item.assignment_id,
            assignmentStatus: item.assignment_status,
          })
        }
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {c.title || "İsimsiz Şikayet"}
          </Text>
          <View style={[styles.statusBadge, statusTheme.style]}>
            <Text style={[styles.statusText, { color: statusTheme.textColor }]}>
              {statusLabelMap[item.assignment_status] || item.assignment_status}
            </Text>
          </View>
        </View>

        {c.address ? (
           <Text style={styles.addressText} numberOfLines={1}>📍 {c.address}</Text>
        ) : (
           <Text style={[styles.addressText, {opacity:0.5}]}>📍 Konum belirtilmemiş</Text>
        )}

        <Text style={styles.descriptionText} numberOfLines={2}>
          {c.description || "Açıklama girilmemiş."}
        </Text>

        <View style={styles.cardFooter}>
          <Text style={styles.dateText}>
             📅 {c.created_at ? new Date(c.created_at).toLocaleDateString("tr-TR", { day: 'numeric', month: 'long' }) : "-"}
          </Text>
          <View style={styles.detailLink}>
            <Text style={styles.detailLinkText}>İncele</Text>
            <Text style={{color: '#1e3a8a'}}>→</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e3a8a" />

      {/* HEADER: Sadece Yazı Kaldı */}
      <View style={styles.headerContainer}>
           <Text style={styles.welcomeText}>Hoş Geldiniz,</Text>
           <Text style={styles.headerTitle}>Saha Görevleri</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1e3a8a" />
          <Text style={{marginTop: 10, color: '#64748b'}}>Görevler yükleniyor...</Text>
        </View>
      ) : items.length === 0 ? (
        <View style={styles.emptyContainer}>
            <Text style={{fontSize: 40, marginBottom: 10}}>✅</Text>
            <Text style={styles.emptyText}>Üzerinize atanmış aktif görev bulunmuyor.</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => String(item.assignment_id)}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl 
                refreshing={refreshing} 
                onRefresh={onRefresh} 
                tintColor="#1e3a8a" 
            />
          }
        />
      )}
    </View>
  );
}