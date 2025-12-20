import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  StatusBar,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { BASE_URL } from "../../config";
import styles from "../../styles/EmployeeCompletedStyles";
import client from "../../api/client";
// --- TİP TANIMLARI ---
type Complaint = {
  id: number;
  title?: string | null;
  description?: string | null;
  address?: string | null;
  created_at?: string;
  photos?: { id: number; photo_url: string }[];
};

type CompletedItem = {
  assignment_id: number;
  assignment_status: string;
  solution_photo_url?: string | null;
  complaint: Complaint;
};

// --- YARDIMCI FONKSİYONLAR ---
const resolvePhoto = (url?: string | null) => {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `${BASE_URL}${url}`;
};

export default function EmployeeCompletedScreen() {
  const navigation = useNavigation<any>();

  const [items, setItems] = useState<CompletedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // --- VERİ ÇEKME ---
  const fetchCompleted = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        setItems([]);
        return;
      }

      const res = await client.get(`${BASE_URL}/employee/complaints/completed`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setItems(res.data || []);
    } catch (e: any) {
      console.log("Hata:", e);
      // Sessiz hata yönetimi veya Alert
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const unsub = navigation.addListener("focus", fetchCompleted);
    fetchCompleted();
    return unsub;
  }, [fetchCompleted, navigation]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCompleted();
  };

  // --- KART RENDER ---
  const renderItem = ({ item }: { item: CompletedItem }) => {
    const c = item.complaint;

    // Fotoğraf Önceliği: 1. Çözüm Fotosu, 2. Şikayet Fotosu, 3. Yok
    const displayPhoto = resolvePhoto(item.solution_photo_url) ||
      (c.photos && c.photos.length > 0 ? resolvePhoto(c.photos[0]?.photo_url) : null);

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate("EmployeeJobDetail", {
            complaintId: c.id,
            assignmentId: item.assignment_id,
            assignmentStatus: item.assignment_status,
          })
        }
      >
        {/* Görsel Alanı (Bulanık Arka Plan) */}
        {displayPhoto && (
          <View style={{ position: 'relative' }}>
            <Image
              source={{ uri: displayPhoto }}
              style={styles.cardImageCover}
              resizeMode="cover"
              blurRadius={3}
            />
            {/* Karartma Overlay */}
            <View style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.25)',
            }} />
          </View>
        )}

        {/* Kart İçeriği */}
        <View style={{ padding: 16 }}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {c.title || `Şikayet #${c.id}`}
            </Text>
            {/* Yeşil Badge (Completed) */}
            <View style={[styles.statusBadge, styles.status_completed]}>
              <Text style={[styles.statusText, { color: "#166534" }]}>
                TAMAMLANDI
              </Text>
            </View>
          </View>

          {c.address ? (
            <Text style={styles.addressText} numberOfLines={1}>📍 {c.address}</Text>
          ) : null}

          <Text style={styles.descriptionText} numberOfLines={2}>
            {c.description || "Açıklama yok."}
          </Text>

          <View style={styles.cardFooter}>
            <Text style={styles.dateText}>
              ✔️ {item.assignment_status === 'resolved' ? 'Başarıyla Çözüldü' : 'Başarıyla Tamamlandı'}
            </Text>
            <View style={styles.detailLink}>
              <Text style={styles.detailLinkText}>Detaylar</Text>
              <Text style={{ color: '#1e3a8a' }}>→</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e3a8a" />

      {/* HEADER: Ortak Tasarım */}
      <View style={styles.headerContainer}>
        <Text style={styles.welcomeText}>Geçmiş İşlemler</Text>
        <Text style={styles.headerTitle}>Tamamlananlar</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1e3a8a" />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => String(item.assignment_id)}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#1e3a8a" />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={{ fontSize: 40, marginBottom: 10 }}>📂</Text>
              <Text style={styles.emptyText}>Henüz tamamlanmış bir göreviniz yok.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}