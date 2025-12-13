import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../../config";
import styles from "../../styles/WorkersStyles";

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
      const res = await axios.get(`${BASE_URL}/workers`, { headers });
      setItems(res.data);
    } catch (e: any) {
      Alert.alert("Hata", e?.response?.data?.detail ?? "İşçiler alınamadı.");
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
      "İşçi silinsin mi?",
      `${w.full_name} silinecek.`,
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
              Alert.alert("Hata", e?.response?.data?.detail ?? "İşçi silinemedi.");
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Worker }) => (
    <View style={styles.card}>
      <View style={styles.rowBetween}>
        <Text style={styles.name}>{item.full_name}</Text>
        <Text style={item.is_active ? styles.active : styles.passive}>
          {item.is_active ? "Aktif" : "Pasif"}
        </Text>
      </View>

      {!!item.email && <Text style={styles.subText}>{item.email}</Text>}
      {!!item.phone && <Text style={styles.subText}>{item.phone}</Text>}

      
      <Text style={styles.metaText}>user_id: {item.user_id}</Text>
      <Text style={styles.metaText}>category_id: {item.category_id}</Text>

      <TouchableOpacity style={styles.deleteBtn} onPress={() => onDelete(item)}>
        <Text style={styles.deleteText}>Sil</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={styles.loadingText}>İşçiler yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addBtn} onPress={goAdd}>
        <Text style={styles.addText}>+ İşçi Ekle</Text>
      </TouchableOpacity>

      <FlatList
        data={items}
        keyExtractor={(it) => String(it.id)}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<Text style={styles.emptyText}>Henüz işçi yok.</Text>}
      />
    </View>
  );
}
