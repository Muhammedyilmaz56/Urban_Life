import React, { useCallback, useEffect, useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  Alert,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import styles from "../../styles/AdminStatsStyles";
import { adminApi } from "../../api/admin";
import type { AdminStatsDetail } from "../../api/admin";

// Rol isimlerini Türkçe'ye çevir
const roleTranslations: Record<string, string> = {
  citizen: "Vatandaş",
  official: "Yetkili",
  admin: "Yönetici",
  employee: "Saha Personeli",
};

// Durum isimlerini Türkçe'ye çevir
const statusTranslations: Record<string, string> = {
  pending: "Beklemede",
  in_progress: "İşlemde",
  assigned: "Atandı",
  resolved: "Çözüldü",
  rejected: "Reddedildi",
  completed: "Tamamlandı",
};

const translateRole = (key: string) => roleTranslations[key.toLowerCase()] || key.replace(/_/g, " ").toUpperCase();
const translateStatus = (key: string) => statusTranslations[key.toLowerCase()] || key.replace(/_/g, " ").toUpperCase();

export default function AdminStatsScreen() {
  const navigation = useNavigation<any>();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<AdminStatsDetail | null>(null);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

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

  const roleRows: [string, number][] = Object.entries(
    stats?.users_by_role ?? {}
  ).map(([k, v]) => [k, Number(v)]);

  const statusRows: [string, number][] = Object.entries(
    stats?.complaints_by_status ?? {}
  ).map(([k, v]) => [k, Number(v)]);

  roleRows.sort((a, b) => b[1] - a[1]);
  statusRows.sort((a, b) => b[1] - a[1]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B3A6A" />

      {/* TOP BAR - Matching AdminHomeScreen style */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.85}
        >
          <Text style={styles.backTxt}>‹</Text>
        </TouchableOpacity>

        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={styles.title}>İstatistikler</Text>
          <Text style={styles.subtitle}>Detaylı rapor</Text>
        </View>

        <View style={{ width: 44 }} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#0B3A6A" />
          <Text style={styles.loadingText}>Yükleniyor...</Text>
        </View>
      ) : !stats ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>Veri bulunamadı.</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* ÖZET */}
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
              <Text style={styles.cardLabel}>Son 7 Gün</Text>
              <Text style={styles.cardValue}>{stats.complaints_last_7_days}</Text>
            </View>
          </View>

          {/* ROLLER */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Rol Dağılımı</Text>
            {roleRows.length === 0 ? (
              <Text style={styles.muted}>Veri yok</Text>
            ) : (
              roleRows.map(([role, count]) => (
                <View key={role} style={styles.row}>
                  <Text style={styles.rowKey}>{translateRole(role)}</Text>
                  <Text style={styles.rowVal}>{count}</Text>
                </View>
              ))
            )}
          </View>

          {/* DURUMLAR */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Şikayet Durumları</Text>
            {statusRows.length === 0 ? (
              <Text style={styles.muted}>Veri yok</Text>
            ) : (
              statusRows.map(([st, count]) => (
                <View key={st} style={styles.row}>
                  <Text style={styles.rowKey}>{translateStatus(st)}</Text>
                  <Text style={styles.rowVal}>{count}</Text>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
}
