import React, { useLayoutEffect, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Alert,
  Image, // Image eklendi
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import styles from "../../styles/AdminHomeStyles";
import { adminApi } from "../../api/admin";
import { getCurrentUser } from "../../api/user"; // Kullanıcı bilgisini çekmek için
import { BASE_URL } from "../../config"; // Fotoğraf URL'si için

// --- YARDIMCI BİLEŞENLER ---
const StatCard = ({ title, value }: any) => (
  <View style={styles.statCard}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statTitle}>{title}</Text>
  </View>
);

const MenuCard = ({ title, subtitle, onPress }: any) => (
  <TouchableOpacity style={styles.menuCard} onPress={onPress} activeOpacity={0.85}>
    <Text style={styles.menuTitle}>{title}</Text>
    <Text style={styles.menuSubtitle}>{subtitle}</Text>
    <Text style={styles.menuArrow}>›</Text>
  </TouchableOpacity>
);

// --- HELPER: FOTOĞRAF URL ÇÖZÜCÜ ---
const resolveAvatar = (avatar_url?: string | null) =>
  avatar_url
    ? {
        uri: avatar_url.startsWith("http")
          ? avatar_url
          : `${BASE_URL}${avatar_url}`,
      }
    : require("../../../assets/default-avatar.png"); // Varsayılan görselin yolu doğru olmalı

export default function AdminHomeScreen() {
  const navigation = useNavigation<any>();

  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminUser] = useState<any>(null); // Admin bilgisi state'i
  const [stats, setStats] = useState({
    total: "-",
    open: "-",
    in_progress: "-",
    resolved: "-",
  });

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  // Verileri Yükle
  const loadAllData = async () => {
    try {
      setLoading(true);
      
      // 1. İstatistikleri çek
      const statsData = await adminApi.statsOverview();
      setStats({
        total: String(statsData?.total ?? "-"),
        open: String(statsData?.open ?? "-"),
        in_progress: String(statsData?.in_progress ?? "-"),
        resolved: String(statsData?.resolved ?? "-"),
      });

      // 2. Admin Profil Bilgisini çek
      const userData = await getCurrentUser();
      setAdminUser(userData);

    } catch (e: any) {
      // Hata olsa bile ekranı patlatma, sadece logla veya alert ver
      console.log("Veri çekme hatası:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Sayfaya her gelindiğinde verileri tazele (Profil fotosu değişmiş olabilir)
    const unsubscribe = navigation.addListener('focus', loadAllData);
    loadAllData();
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B3A6A" />

      {/* Kurumsal Header */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
        <Text style={styles.headerTitle}>Admin Paneli</Text>
          <Text style={styles.headerSubtitle}>Sistemi yönet, istatistikleri izle.</Text>
        </View>

        
        <TouchableOpacity
          style={styles.headerProfileBtn} 
          onPress={() => navigation.navigate("AdminProfile")}
          activeOpacity={0.85}
        >
          <Image 
            source={resolveAvatar(adminUser?.avatar_url)} 
            style={styles.headerProfileImage} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* İstatistikler */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Genel Durum</Text>
          {loading && (
            <View style={styles.loadingChip}>
              <ActivityIndicator size="small" color="#0B3A6A" />
              <Text style={styles.loadingChipText}>Yükleniyor...</Text>
            </View>
          )}
        </View>

        <View style={styles.statGrid}>
          <StatCard title="Toplam Şikayet" value={stats.total} />
          <StatCard title="Açık" value={stats.open} />
          <StatCard title="İşlemde" value={stats.in_progress} />
          <StatCard title="Çözülen" value={stats.resolved} />
        </View>

        {/* Yönetim */}
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

        {/* Raporlama */}
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
  );
}