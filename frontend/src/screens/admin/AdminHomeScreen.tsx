import React, { useLayoutEffect, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  StatusBar,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import styles from "../../styles/AdminHomeStyles";
import { adminApi } from "../../api/admin";

const BG_IMAGE =
  "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=2070&auto=format&fit=crop";

const StatCard = ({ title, value }: any) => (
  <View style={styles.statCard}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statTitle}>{title}</Text>
  </View>
);

const MenuCard = ({ title, subtitle, onPress }: any) => (
  <TouchableOpacity style={styles.menuCard} onPress={onPress}>
    <Text style={styles.menuTitle}>{title}</Text>
    <Text style={styles.menuSubtitle}>{subtitle}</Text>
  </TouchableOpacity>
);

export default function AdminHomeScreen() {
  const navigation = useNavigation<any>();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: "-",
    open: "-",
    in_progress: "-",
    resolved: "-",
  });

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const data = await adminApi.statsOverview();

        setStats({
          total: String(data?.total ?? "-"),
          open: String(data?.open ?? "-"),
          in_progress: String(data?.in_progress ?? "-"),
          resolved: String(data?.resolved ?? "-"),
        });
      } catch (e: any) {
        Alert.alert("Hata", e?.response?.data?.detail || "İstatistik alınamadı");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ImageBackground source={{ uri: BG_IMAGE }} style={styles.bg} resizeMode="cover">
        <View style={styles.overlay}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <Text style={styles.pageTitle}>Admin Paneli</Text>
            <Text style={styles.pageSubtitle}>Sistemi yönet, istatistikleri izle.</Text>

            {loading ? (
              <View style={{ paddingVertical: 16 }}>
                <ActivityIndicator />
              </View>
            ) : null}

            <View style={styles.statGrid}>
              <StatCard title="Toplam Şikayet" value={stats.total} />
              <StatCard title="Açık" value={stats.open} />
              <StatCard title="İşlemde" value={stats.in_progress} />
              <StatCard title="Çözülen" value={stats.resolved} />
            </View>

            <Text style={styles.sectionTitle}>Yönetim</Text>
            <View style={styles.menuGrid}>
              <MenuCard
                title="Yöneticiler"
                subtitle="Ekle / Güncelle / Pasifleştir"
                onPress={() => navigation.navigate("AdminOfficials")}
              />
              <MenuCard
                title="Kategoriler"
                subtitle="Kategori ekle / düzenle"
                onPress={() => navigation.navigate("AdminCategories")}
              />
              <MenuCard
                title="Kullanıcılar"
                subtitle="Read-only kullanıcı listesi"
                onPress={() => navigation.navigate("AdminUsers")}
              />
              <MenuCard
                title="Denetim Kayıtları"
                subtitle="Kim ne yaptı?"
                onPress={() => navigation.navigate("AdminAudit")}
              />
            </View>

            <Text style={styles.sectionTitle}>Raporlama</Text>
            <View style={styles.menuGrid}>
              <MenuCard
                title="İstatistikler"
                subtitle="Tarih aralığına göre rapor"
                onPress={() => navigation.navigate("AdminStats")}
              />
              <MenuCard
                title="Profil / Ayarlar"
                subtitle="Şifre / foto / çıkış"
                onPress={() => navigation.navigate("AdminProfile")}
              />
            </View>

            <View style={{ height: 90 }} />
          </ScrollView>
        </View>
      </ImageBackground>
    </View>
  );
}
