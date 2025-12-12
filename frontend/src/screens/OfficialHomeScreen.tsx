import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Image,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { fetchOfficialComplaints, OfficialComplaint } from "../api/official";
import { getCurrentUser } from "../api/user";
import { BASE_URL } from "../config";
import styles from "../styles/OfficialHomeStyles";

const getStatusStyle = (status: string) => {
  switch (status) {
    case "pending":
      return styles.status_pending;
    case "in_progress":
      return styles.status_in_progress;
    case "assigned":
      return styles.status_assigned;
    case "resolved":
      return styles.status_resolved;
    case "rejected":
      return styles.status_rejected;
    default:
      return {};
  }
};

const statusLabelMap: Record<string, string> = {
  pending: "Beklemede",
  in_progress: "İşlemde",
  assigned: "İşçiye Atandı",
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
    : require("../../assets/default-avatar.png");

const OfficialHomeScreen = () => {
  const [complaints, setComplaints] = useState<OfficialComplaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const [menuVisible, setMenuVisible] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [avatarError, setAvatarError] = useState(false);

  const navigation = useNavigation<any>();

  const loadUser = async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.log("User load error:", error);
    }
  };

  const loadComplaints = async () => {
    try {
      setLoading(true);
      const data = await fetchOfficialComplaints();
      setComplaints(data);
    } catch (error) {
      console.log("Official complaints fetch error:", error);
    } finally {
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

  const goToProfile = () => {
    closeMenu();
    navigation.navigate("OfficialProfile"); 
  };

  const goToAnnouncements = () => {
    closeMenu();
    navigation.navigate("OfficialAnnouncements");
  };

  const renderItem = ({ item }: { item: OfficialComplaint }) => {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate("OfficialComplaintDetail", { complaintId: item.id })
        }
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.title}
          </Text>

          <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
            <Text style={styles.statusText}>
              {statusLabelMap[item.status] || item.status}
            </Text>
          </View>
        </View>

        {item.category && (
          <Text style={styles.categoryText}>Kategori: {item.category.name}</Text>
        )}

        {item.address && (
          <Text style={styles.addressText} numberOfLines={1}>
            {item.address}
          </Text>
        )}

        <Text style={styles.descriptionText} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.cardFooter}>
          <Text style={styles.dateText}>
            {new Date(item.created_at).toLocaleString("tr-TR")}
          </Text>

          {typeof item.support_count === "number" && (
            <Text style={styles.supportText}>👍 {item.support_count} destek</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const avatarSource = !user?.avatar_url || avatarError
    ? require("../../assets/default-avatar.png")
    : resolveAvatar(user.avatar_url);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Personel Paneli</Text>
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
              <Text style={styles.menuItemText}>👤 Profilim</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.menuItem} onPress={goToAnnouncements}>
              <Text style={styles.menuItemText}>📢 Duyurular</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" />
          <Text style={styles.loadingText}>Şikayetler yükleniyor...</Text>
        </View>
      ) : complaints.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Henüz görüntülenecek şikayet yok.</Text>
        </View>
      ) : (
        <FlatList
          data={complaints}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
};

export default OfficialHomeScreen;