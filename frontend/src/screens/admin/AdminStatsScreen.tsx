import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  Alert,
} from "react-native";

import styles from "../../styles/AdminStatsStyles";
import { adminApi } from "../../api/admin";
import type { AdminStatsDetail } from "../../api/admin";

const formatKey = (k: string) => k.replace(/_/g, " ").toUpperCase();

export default function AdminStatsScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<AdminStatsDetail | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await adminApi.statsDetail();
      setStats(data);
    } catch (e: any) {
      Alert.alert("Hata", e?.message || "İstatistikler alınamadı.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </View>
    );
  }

  if (!stats) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Veri bulunamadı.</Text>
      </View>
    );
  }

  const roleRows: [string, number][] = Object.entries(stats.users_by_role ?? {}).map(
    ([k, v]) => [k, Number(v)]
  );
  roleRows.sort((a, b) => b[1] - a[1]);

  const statusRows: [string, number][] = Object.entries(stats.complaints_by_status ?? {}).map(
    ([k, v]) => [k, Number(v)]
  );
  statusRows.sort((a, b) => b[1] - a[1]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={styles.title}>Admin İstatistikleri</Text>

      <View style={styles.grid}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Toplam Kullanıcı</Text>
          <Text style={styles.cardValue}>{stats.total_users}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Toplam Şikayet</Text>
          <Text style={styles.cardValue}>{stats.total_complaints}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Son 7 Gün Şikayet</Text>
          <Text style={styles.cardValue}>{stats.complaints_last_7_days}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Rol Dağılımı</Text>
        {roleRows.length === 0 ? (
          <Text style={styles.muted}>Veri yok</Text>
        ) : (
          roleRows.map(([role, count]) => (
            <View key={role} style={styles.row}>
              <Text style={styles.rowKey}>{formatKey(role)}</Text>
              <Text style={styles.rowVal}>{count}</Text>
            </View>
          ))
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Şikayet Durumları</Text>
        {statusRows.length === 0 ? (
          <Text style={styles.muted}>Veri yok</Text>
        ) : (
          statusRows.map(([st, count]) => (
            <View key={st} style={styles.row}>
              <Text style={styles.rowKey}>{formatKey(st)}</Text>
              <Text style={styles.rowVal}>{count}</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}
