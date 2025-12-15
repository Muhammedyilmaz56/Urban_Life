import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BASE_URL } from "../../config";
import styles from "../../styles/EmployeeHomeStyles";

type Complaint = {
  id: number;
  title?: string | null;
  description?: string | null;
  status?: string;
  photos?: { id: number; photo_url: string }[];
};

type CompletedItem = {
  assignment_id: number;
  assignment_status: string;
  solution_photo_url?: string | null;
  complaint: Complaint;
};

const resolvePhoto = (url?: string | null) => {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `${BASE_URL}${url}`;
};

export default function EmployeeCompletedScreen({ navigation }: any) {
  const [items, setItems] = useState<CompletedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCompleted = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        setItems([]);
        return;
      }

      const res = await axios.get(`${BASE_URL}/employee/complaints/completed`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setItems(res.data || []);
    } catch (e: any) {
      const msg = e?.response?.data?.detail || e?.message || "Tamamlanan işler alınamadı.";
      Alert.alert("Hata", String(msg));
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
    fetchCompleted().finally(() => setRefreshing(false));
  };

  const renderItem = ({ item }: { item: CompletedItem }) => {
    const c = item.complaint;

    const firstPhoto =
      c.photos && c.photos.length > 0 ? resolvePhoto(c.photos[0]?.photo_url) : null;

    const solutionPhoto = resolvePhoto(item.solution_photo_url || null);

    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("EmployeeJobDetail", {
            complaintId: c.id,
            assignmentId: item.assignment_id,
            assignmentStatus: item.assignment_status,
          })
        }
        style={styles.card}
        activeOpacity={0.9}
      >
        {solutionPhoto ? (
          <Image source={{ uri: solutionPhoto }} style={styles.cardImage} resizeMode="cover" />
        ) : firstPhoto ? (
          <Image source={{ uri: firstPhoto }} style={styles.cardImage} resizeMode="cover" />
        ) : (
          <View style={styles.noPhotoBox}>
            <Text style={styles.noPhotoText}>Foto yok</Text>
          </View>
        )}

        <View style={styles.cardBody}>
          <Text style={styles.title}>{c.title ? c.title : `Şikayet #${c.id}`}</Text>

          {!!c.description && (
            <Text style={styles.desc} numberOfLines={2}>
              {c.description}
            </Text>
          )}

          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Görev: {item.assignment_status}</Text>
            </View>

            <View style={styles.badge}>
              <Text style={styles.badgeText}>ID: {c.id}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tamamlanan İşler</Text>

      <FlatList
        data={items}
        keyExtractor={(x) => String(x.assignment_id)}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyText}>Tamamlanan iş yok.</Text>
          </View>
        }
      />
    </View>
  );
}
