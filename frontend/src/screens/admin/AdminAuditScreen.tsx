import React, { useEffect, useLayoutEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StatusBar,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import styles from "../../styles/AdminAuditStyles";
import { adminApi } from "../../api/admin";

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

  const load = useCallback(async (opts?: { silent?: boolean }) => {
    try {
      if (!opts?.silent) setLoading(true);
      const data = await adminApi.audit(100);
      setItems(Array.isArray(data) ? data : []);
    } catch (e: any) {
      Alert.alert("Hata", e?.response?.data?.detail || "Denetim kayıtları alınamadı");
    } finally {
      if (!opts?.silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

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
        <View style={styles.rowTop}>
          <View style={{ flex: 1 }}>
            <Text style={styles.action} numberOfLines={2}>
              {item.action}
            </Text>
            <Text style={styles.time}>{formatDateTR(item.created_at)}</Text>
          </View>

          <View style={styles.badge}>
            <Text style={styles.badgeText}>{who}</Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Hedef</Text>
          <Text style={styles.metaValue}>{target}</Text>
        </View>

        {item.detail ? (
          <Text style={styles.detail} numberOfLines={4}>
            {item.detail}
          </Text>
        ) : null}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B3A6A" />

      {/* Kurumsal TopBar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.85}>
          <Text style={styles.backTxt}>‹</Text>
        </TouchableOpacity>

        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={styles.title}>Denetim Kayıtları</Text>
          <Text style={styles.subtitle}>Son 100 işlem</Text>
        </View>

        <TouchableOpacity style={styles.refreshBtn} onPress={() => load()} activeOpacity={0.85}>
          <Text style={styles.refreshTxt}>Yenile</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Yükleniyor...</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(x) => String(x.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyText}>Kayıt bulunamadı.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}
