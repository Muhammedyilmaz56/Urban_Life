import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  StatusBar,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import styles from "../../styles/AdminAuditStyles";
import { adminApi } from "../../api/admin";

const BG_IMAGE =
  "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=2070&auto=format&fit=crop";

type AuditItem = {
  id: number;
  actor_user_id?: number | null;
  action: string;
  target_type?: string | null;
  target_id?: number | null;
  detail?: string | null;
  created_at: string;
};

const formatDateTR = (iso: string) => {
  try {
    const d = new Date(iso);
    return d.toLocaleString("tr-TR");
  } catch {
    return iso;
  }
};

export default function AdminAuditScreen() {
  const navigation = useNavigation<any>();

  const [items, setItems] = useState<AuditItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const load = async (opts?: { silent?: boolean }) => {
    try {
      if (!opts?.silent) setLoading(true);
      const data = await adminApi.audit(100);
      setItems(Array.isArray(data) ? data : []);
    } catch (e: any) {
      Alert.alert("Hata", e?.response?.data?.detail || "Audit kayıtları alınamadı");
    } finally {
      if (!opts?.silent) setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await load({ silent: true });
    } finally {
      setRefreshing(false);
    }
  };

  const renderItem = ({ item }: { item: AuditItem }) => {
    const who = item.actor_user_id ? `#${item.actor_user_id}` : "Sistem";
    const target =
      item.target_type && item.target_id ? `${item.target_type} #${item.target_id}` : "-";

    return (
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.action}>{item.action}</Text>
          <Text style={styles.time}>{formatDateTR(item.created_at)}</Text>
        </View>

        <Text style={styles.meta}>Yapan: {who}</Text>
        <Text style={styles.meta}>Hedef: {target}</Text>

        {item.detail ? <Text style={styles.detail}>{item.detail}</Text> : null}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ImageBackground source={{ uri: BG_IMAGE }} style={styles.bg} resizeMode="cover">
        <View style={styles.overlay}>
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Text style={styles.backTxt}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Denetim Kayıtları</Text>
            <TouchableOpacity style={styles.refreshBtn} onPress={() => load()}>
              <Text style={styles.refreshTxt}>⟲</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={{ paddingTop: 28 }}>
              <ActivityIndicator />
            </View>
          ) : null}

          <FlatList
            data={items}
            keyExtractor={(x) => String(x.id)}
            renderItem={renderItem}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120, paddingTop: 6 }}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            ListEmptyComponent={
              <View style={{ paddingTop: 40 }}>
                <Text style={{ color: "white", textAlign: "center" }}>
                  Kayıt bulunamadı
                </Text>
              </View>
            }
          />
        </View>
      </ImageBackground>
    </View>
  );
}
