import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Alert,
  Linking,
  StatusBar,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../../config";
import styles from "../../styles/WorkersStyles";
import client from "../../api/client";
type Worker = {
  id: number;
  full_name: string;
  phone?: string | null;
  email?: string | null;
  category_id: number;
  is_active: boolean;
  user_id: number;
};

const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

export default function WorkersScreen({ navigation }: any) {
  const [items, setItems] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const headers = await getAuthHeaders();
      const res = await client.get(`${BASE_URL}/workers`, { headers });
      setItems(res.data);
    } catch (e: any) {
      Alert.alert("Hata", e?.response?.data?.detail ?? "Personel listesi alınamadı.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const goAdd = () => navigation.navigate("AddWorker");

  const onDelete = (w: Worker) => {
    Alert.alert(
      "Personel Silinecek",
      `"${w.full_name}" adlı personeli silmek istediğinize emin misiniz?`,
      [
        { text: "Vazgeç", style: "cancel" },
        {
          text: "Sil",
          style: "destructive",
          onPress: async () => {
            try {
              const headers = await getAuthHeaders();
              await axios.delete(`${BASE_URL}/workers/${w.id}`, { headers });
              await load();
            } catch (e: any) {
              Alert.alert("Hata", e?.response?.data?.detail ?? "Silme işlemi başarısız.");
            }
          },
        },
      ]
    );
  };

  // İsimden baş harfleri çıkaran yardımcı fonksiyon (Ahmet Yılmaz -> AY)
  const getInitials = (name: string) => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Telefon arama veya Mail atma
  const handleLink = (type: 'phone' | 'email', value?: string | null) => {
    if (!value) return;
    const url = type === 'phone' ? `tel:${value}` : `mailto:${value}`;
    Linking.canOpenURL(url).then(supported => {
      if (supported) Linking.openURL(url);
      else Alert.alert("Hata", "Bu işlem cihazınızda desteklenmiyor.");
    });
  };

  const renderItem = ({ item }: { item: Worker }) => (
    <View style={styles.card}>
      {/* Üst Kısım: Avatar ve İsim */}
      <View style={styles.cardHeader}>
        <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{getInitials(item.full_name)}</Text>
        </View>
        <View style={styles.headerInfo}>
            <Text style={styles.name}>{item.full_name}</Text>
            <View style={styles.statusContainer}>
                <View style={item.is_active ? styles.activeBadge : styles.passiveBadge}>
                    <Text style={item.is_active ? styles.activeText : styles.passiveText}>
                        {item.is_active ? "AKTİF PERSONEL" : "PASİF"}
                    </Text>
                </View>
            </View>
        </View>
      </View>

      {/* İletişim Bilgileri */}
      <View style={styles.contactContainer}>
        {item.email ? (
             <TouchableOpacity style={styles.contactRow} onPress={() => handleLink('email', item.email)}>
                <Text style={styles.contactLabel}>E-Posta:</Text>
                <Text style={[styles.contactValue, styles.clickableText]}>{item.email}</Text>
             </TouchableOpacity>
        ) : (
            <View style={styles.contactRow}>
                 <Text style={styles.contactLabel}>E-Posta:</Text>
                 <Text style={[styles.contactValue, {color: '#94a3b8', fontStyle: 'italic'}]}>Belirtilmemiş</Text>
            </View>
        )}

        {item.phone ? (
            <TouchableOpacity style={styles.contactRow} onPress={() => handleLink('phone', item.phone)}>
                <Text style={styles.contactLabel}>Telefon:</Text>
                <Text style={[styles.contactValue, styles.clickableText]}>{item.phone}</Text>
            </TouchableOpacity>
        ) : (
            <View style={styles.contactRow}>
                <Text style={styles.contactLabel}>Telefon:</Text>
                <Text style={[styles.contactValue, {color: '#94a3b8', fontStyle: 'italic'}]}>Belirtilmemiş</Text>
           </View>
        )}
      </View>

      <View style={styles.cardFooter}>
  <TouchableOpacity style={styles.deleteBtn} onPress={() => onDelete(item)}>
    <Text style={styles.deleteText}>🗑 Sil</Text>
  </TouchableOpacity>
</View>

    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#1e3a8a" />
        <Text style={styles.loadingText}>Personel listesi yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      
      <TouchableOpacity style={styles.addBtn} activeOpacity={0.8} onPress={goAdd}>
        <Text style={styles.addText}>+ Yeni Personel Ekle</Text>
      </TouchableOpacity>

      <FlatList
        data={items}
        keyExtractor={(it) => String(it.id)}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#1e3a8a" />
        }
        ListEmptyComponent={
            <Text style={styles.emptyText}>Sistemde kayıtlı personel bulunmamaktadır.</Text>
        }
      />
    </View>
  );
}