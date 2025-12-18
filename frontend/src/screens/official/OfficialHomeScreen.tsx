import React, { useEffect, useState, useCallback, useContext } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Image,
  StatusBar,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchOfficialComplaints, OfficialComplaint } from "../../api/official";
import { getCurrentUser } from "../../api/user";
import { BASE_URL } from "../../config";
import styles from "../../styles/OfficialHomeStyles"; 
import { AuthContext } from "../../../App";


const getStatusTheme = (status: string) => {
  switch (status) {
    case "pending":
      return { style: styles.status_pending, textColor: "#9a3412" };
    case "in_progress":
      return { style: styles.status_in_progress, textColor: "#1e40af" };
    case "assigned":
      return { style: styles.status_assigned, textColor: "#166534" };
    case "resolved":
      return { style: styles.status_resolved, textColor: "#047857" };
    case "rejected":
      return { style: styles.status_rejected, textColor: "#991b1b" };
    default:
      return { style: {}, textColor: "#000" };
  }
};

const statusLabelMap: Record<string, string> = {
  pending: "Beklemede",
  in_progress: "İşlemde",
  assigned: "Ekiplere İletildi", 
  resolved: "Çözüldü",
  rejected: "Reddedildi",
};

const resolveAvatar = (avatar_url?: string | null) =>
  avatar_url
    ? {
        uri: avatar_url.startsWith("http")
          ? avatar_url
          : `${BASE_URL}${avatar_url}?cacheBust=${Date.now()}`,
      }
    : require("../../../assets/default-avatar.png");

const OfficialHomeScreen = () => {
  const [complaints, setComplaints] = useState<OfficialComplaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [menuVisible, setMenuVisible] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [avatarError, setAvatarError] = useState(false);

  const navigation = useNavigation<any>();
  const auth = useContext(AuthContext);

  const loadUser = async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData);
    } catch (error) {}
  };

  const loadComplaints = async () => {
    try {
      setLoading(true);
      const data = await fetchOfficialComplaints();
      setComplaints(data);
    } catch (error) {} finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadComplaints();
    await loadUser();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    loadComplaints();
    loadUser();
  }, []);

  const toggleMenu = () => setMenuVisible(!menuVisible);
  const closeMenu = () => setMenuVisible(false);

  const goToProfile = () => { closeMenu(); navigation.navigate("OfficialProfile"); };
  const goToAnnouncements = () => { closeMenu(); navigation.navigate("OfficialAnnouncements"); };
  const goToCategories = () => { closeMenu(); navigation.navigate("Categories"); };
  const goToWorkers = () => { closeMenu(); navigation.navigate("Workers"); };

  const handleLogout = () => {
    closeMenu();
    Alert.alert("Güvenli Çıkış", "Oturumunuzu sonlandırmak istediğinize emin misiniz?", [
      { text: "Vazgeç", style: "cancel" },
      {
        text: "Çıkış Yap",
        style: "destructive",
        onPress: async () => {
          try { await AsyncStorage.removeItem("token"); } catch (e) {}
          auth?.setUser(null);
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: OfficialComplaint }) => {
    const statusTheme = getStatusTheme(item.status);

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.7}
        onPress={() =>
          navigation.navigate("OfficialComplaintDetail", { complaintId: item.id })
        }
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <View style={[styles.statusBadge, statusTheme.style]}>
            <Text style={[styles.statusText, { color: statusTheme.textColor }]}>
              {statusLabelMap[item.status] || item.status}
            </Text>
          </View>
        </View>

        {/* Kategori ve Adres Bilgileri */}
        <View>
            {item.category && (
            <Text style={styles.categoryText}>📂 {item.category.name}</Text>
            )}
            {item.address && (
            <Text style={styles.addressText} numberOfLines={1}>
                📍 {item.address}
            </Text>
            )}
        </View>

        <Text style={styles.descriptionText} numberOfLines={3}>
          {item.description}
        </Text>

        <View style={styles.cardFooter}>
          <Text style={styles.dateText}>
            📅 {new Date(item.created_at).toLocaleDateString("tr-TR", { day: 'numeric', month: 'long', hour: '2-digit', minute:'2-digit' })}
          </Text>

          {typeof item.support_count === "number" && (
            <View style={styles.supportContainer}>
                <Text>👍</Text>
                <Text style={styles.supportText}>{item.support_count}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const avatarSource =
    !user?.avatar_url || avatarError
      ? require("../../../assets/default-avatar.png")
      : resolveAvatar(user.avatar_url);

  return (
    <View style={styles.container}>
      {/* StatusBar Rengini Header ile uyumlu yapıyoruz */}
      <StatusBar barStyle="light-content" backgroundColor="#1e3a8a" />

      <View style={styles.headerContainer}>
        <View>
             <Text style={[styles.headerTitle, {fontSize: 14, opacity: 0.8, fontWeight: '400'}]}>Hoş Geldiniz,</Text>
             <Text style={styles.headerTitle}>Personel Paneli</Text>
        </View>
       
        <TouchableOpacity onPress={toggleMenu} activeOpacity={0.8}>
          <Image
            source={avatarSource}
            style={styles.avatar}
            onError={() => setAvatarError(true)}
          />
        </TouchableOpacity>
      </View>

      {menuVisible && (
        <TouchableOpacity
          style={styles.menuOverlay}
          activeOpacity={1}
          onPress={closeMenu}
        >
          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuItem} onPress={goToProfile}>
              <Text>👤</Text>
              <Text style={styles.menuItemText}>Profilim</Text>
            </TouchableOpacity>

            

            <TouchableOpacity style={styles.menuItem} onPress={goToCategories}>
               <Text>🏷️</Text>
              <Text style={styles.menuItemText}>Kategori Yönetimi</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.menuItem} onPress={goToWorkers}>
               <Text>👷</Text>
              <Text style={styles.menuItemText}>Personel Listesi</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
               <Text>🚪</Text>
              <Text style={[styles.menuItemText, { color: "#dc2626" }]}>
                Güvenli Çıkış
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1e3a8a" />
          <Text style={styles.loadingText}>Veriler güncelleniyor...</Text>
        </View>
      ) : complaints.length === 0 ? (
        <View style={styles.emptyContainer}>
            <Text style={{fontSize: 40, marginBottom: 10}}>📭</Text>
          <Text style={styles.emptyText}>Şu anda sistemde bekleyen veya işlem gören bir şikayet bulunmamaktadır.</Text>
        </View>
      ) : (
        <FlatList
          data={complaints}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl 
                refreshing={refreshing} 
                onRefresh={onRefresh} 
                tintColor="#1e3a8a" 
                colors={["#1e3a8a"]} 
            />
          }
        />
      )}
    </View>
  );
};

export default OfficialHomeScreen;