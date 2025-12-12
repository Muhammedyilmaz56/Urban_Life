import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
  ImageBackground,
  StatusBar,
  Modal,
  Linking,
  Dimensions,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import MapView, { Marker } from "react-native-maps";

import { getFeed, toggleSupport } from "../api/complaints";
import { Complaint } from "../types";
import HomeScreenStyles from "../styles/HomeStyles";
import { getCurrentUser } from "../api/user";
import { BASE_URL } from "../config";

type Props = NativeStackScreenProps<any, "Home">;

const BG_IMAGE = "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=2070&auto=format&fit=crop";

const resolveAvatar = (avatar_url?: string | null, refreshKey?: number) =>
  avatar_url
    ? {
        uri: avatar_url.startsWith("http")
          ? avatar_url
          : `${BASE_URL}${avatar_url}?cacheBust=${Date.now()}`,
      }
    : require("../../assets/default-avatar.png");

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [sort, setSort] = useState<"newest" | "popular">("newest");
  const [profileMenuVisible, setProfileMenuVisible] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [avatarError, setAvatarError] = useState(false);
  const [expandedIds, setExpandedIds] = useState<number[]>([]);
  
  const [fullImageVisible, setFullImageVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const toggleProfileMenu = () => setProfileMenuVisible((prev) => !prev);
  const closeProfileMenu = () => setProfileMenuVisible(false);

  const goToProfile = () => { closeProfileMenu(); navigation.navigate("Profile"); };
  const goToAnnouncements = () => { closeProfileMenu(); navigation.navigate("Announcements"); };
  const goToMyComplaints = () => { closeProfileMenu(); navigation.navigate("MyComplaints"); };

  const goToCreateComplaint = () => {
    if (!user?.profile_completed) {
      Alert.alert("Profil Eksik", "Şikayet oluşturmak için profili tamamla.", [
        { text: "Tamamla", onPress: () => { closeProfileMenu(); navigation.navigate("Profile"); } },
        { text: "Kapat", style: "cancel" },
      ]);
      return;
    }
    closeProfileMenu();
    navigation.navigate("CreateComplaint");
  };

  const loadFeed = async (selectedSort: "newest" | "popular" = sort) => {
    try {
      setLoading(true);
      const data = await getFeed(selectedSort);
      setComplaints(data);
    } catch (err: any) {
      console.log("FEED_ERROR:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadUser = async () => {
    try {
      const data = await getCurrentUser();
      setUser(data);
    } catch (err) { console.log("USER_ERROR:", err); }
  };

  useEffect(() => { loadFeed(sort); }, [sort]);
  useEffect(() => { loadUser(); }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadFeed(sort);
  }, [sort]);

  const handleSupport = async (id: number) => {
    try {
      const res = await toggleSupport(id);
      setComplaints((prev) =>
        prev.map((c) => (c.id === id ? { ...c, support_count: res.support_count } : c))
      );
    } catch (err) { Alert.alert("Hata", "İşlem başarısız."); }
  };

  const renderStatus = (status: Complaint["status"]) => {
    switch (status) {
      case "pending": return "Beklemede";
      case "in_progress": return "İşlemde";
      case "resolved": return "Çözüldü";
      default: return status;
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const renderItem = ({ item }: { item: Complaint }) => {
    const expanded = expandedIds.includes(item.id);

    return (
      <View style={HomeScreenStyles.card}>
        <View style={HomeScreenStyles.cardHeader}>
          
          <Text style={HomeScreenStyles.cardTitle} numberOfLines={2}>
            {item.title ? item.title : "Şikayet"}
          </Text>
          
          <Text
            style={[
              HomeScreenStyles.statusBadge,
              item.status === "pending" && HomeScreenStyles.statusPending,
              item.status === "in_progress" && HomeScreenStyles.statusInProgress,
              item.status === "resolved" && HomeScreenStyles.statusResolved,
            ]}
          >
            {renderStatus(item.status)}
          </Text>
        </View>

        {!expanded && (
            <Text style={HomeScreenStyles.cardDescription} numberOfLines={3}>
              {item.description}
            </Text>
        )}

        <View style={HomeScreenStyles.cardFooter}>
          <Text style={HomeScreenStyles.cardDate}>
            {new Date(item.created_at).toLocaleDateString("tr-TR", { day: 'numeric', month: 'long', hour:'2-digit', minute:'2-digit' })}
          </Text>

          <TouchableOpacity
            style={HomeScreenStyles.supportButton}
            onPress={() => handleSupport(item.id)}
            activeOpacity={0.7}
          >
            <Text style={{fontSize:16}}>👍</Text>
            <Text style={HomeScreenStyles.supportText}>{item.support_count ?? 0}</Text>
          </TouchableOpacity>
        </View>

        {expanded && (
          <View style={HomeScreenStyles.cardDetails}>
            <Text style={HomeScreenStyles.detailDescription}>{item.description}</Text>

            {item.photos && item.photos.length > 0 && (
              <View style={HomeScreenStyles.photosContainer}>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingRight: 20 }}
                >
                  {item.photos.map((p) => {
                    const fullUrl = p.photo_url.startsWith("http") ? p.photo_url : `${BASE_URL}${p.photo_url}`;
                    return (
                      <TouchableOpacity 
                        key={p.id} 
                        onPress={() => {
                            setSelectedImage(fullUrl);
                            setFullImageVisible(true);
                        }}
                      >
                          <Image
                            source={{ uri: fullUrl }}
                            style={HomeScreenStyles.detailImage}
                            resizeMode="cover"
                          />
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            )}

            {typeof (item as any).latitude === "number" && typeof (item as any).longitude === "number" && (
              <View style={HomeScreenStyles.mapContainer}>
                <MapView
                  style={HomeScreenStyles.map}
                  scrollEnabled={false}
                  initialRegion={{
                    latitude: (item as any).latitude,
                    longitude: (item as any).longitude,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                  }}
                >
                  <Marker
                    coordinate={{
                      latitude: (item as any).latitude,
                      longitude: (item as any).longitude,
                    }}
                  />
                </MapView>
                
                <TouchableOpacity 
                    style={{
                        position: 'absolute',
                        bottom: 10,
                        right: 10,
                        backgroundColor: 'rgba(108, 99, 255, 0.9)',
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                        borderRadius: 20,
                        zIndex: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        elevation: 5,
                    }}
                    onPress={() => {
                        const lat = (item as any).latitude;
                        const lon = (item as any).longitude;
                        const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
                        Linking.openURL(url);
                    }}
                >
                    <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 12}}>📍 Haritada Aç</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        <TouchableOpacity 
          style={HomeScreenStyles.expandButtonContainer} 
          onPress={() => toggleExpand(item.id)}
          activeOpacity={0.7}
        >
           <View style={HomeScreenStyles.expandButton}>
              <Text style={HomeScreenStyles.expandText}>
                {expanded ? "Gizle" : "Detayları Göster"}
              </Text>
           </View>
        </TouchableOpacity>
      </View>
    );
  };

  const avatarSource = !user?.avatar_url || avatarError
    ? require("../../assets/default-avatar.png")
    : { uri: user.avatar_url.startsWith("http") ? user.avatar_url : `${BASE_URL}${user.avatar_url}?cacheBust=${Date.now()}` };

  return (
    <View style={HomeScreenStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <ImageBackground
        source={{ uri: BG_IMAGE }} 
        style={HomeScreenStyles.backgroundImage}
        resizeMode="cover"
      >
        <View style={HomeScreenStyles.overlay}>

          <View style={HomeScreenStyles.header}>
            <TouchableOpacity 
              style={HomeScreenStyles.glassButton} 
              onPress={toggleProfileMenu} 
              activeOpacity={0.7}
            >
              <Text style={HomeScreenStyles.glassButtonIcon}>‹</Text> 
            </TouchableOpacity>

            <Text style={HomeScreenStyles.appTitle}>UrbanLife</Text>

            <TouchableOpacity style={HomeScreenStyles.profileButton} onPress={toggleProfileMenu} activeOpacity={0.8}>
              <Image source={avatarSource} style={HomeScreenStyles.profileImage} onError={() => setAvatarError(true)} />
            </TouchableOpacity>
          </View>

          {profileMenuVisible && (
            <View style={HomeScreenStyles.profileMenu}>
              <TouchableOpacity style={HomeScreenStyles.profileMenuItem} onPress={goToProfile}>
                <Text style={HomeScreenStyles.profileMenuText}>👤 Profil</Text>
              </TouchableOpacity>
              <TouchableOpacity style={HomeScreenStyles.profileMenuItem} onPress={goToAnnouncements}>
                <Text style={HomeScreenStyles.profileMenuText}>📢 Duyurular</Text>
              </TouchableOpacity>
              <TouchableOpacity style={HomeScreenStyles.profileMenuItem} onPress={goToMyComplaints}>
                <Text style={HomeScreenStyles.profileMenuText}>📂 Şikayetlerim</Text>
              </TouchableOpacity>
              <TouchableOpacity style={HomeScreenStyles.profileMenuItem} onPress={goToCreateComplaint}>
                <Text style={HomeScreenStyles.profileMenuText}>✏️ Şikayet Oluştur</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={HomeScreenStyles.tabsRow}>
            <TouchableOpacity
              style={[HomeScreenStyles.tabButton, sort === "newest" && HomeScreenStyles.tabButtonActive]}
              onPress={() => setSort("newest")}
            >
              <Text style={[HomeScreenStyles.tabText, sort === "newest" && HomeScreenStyles.tabTextActive]}>🔥 En Yeniler</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[HomeScreenStyles.tabButton, sort === "popular" && HomeScreenStyles.tabButtonActive]}
              onPress={() => setSort("popular")}
            >
              <Text style={[HomeScreenStyles.tabText, sort === "popular" && HomeScreenStyles.tabTextActive]}>⭐ Popüler</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={HomeScreenStyles.loadingContainer}><ActivityIndicator size="large" color="#6C63FF" /></View>
          ) : (
            <FlatList
              data={complaints}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderItem}
              contentContainerStyle={HomeScreenStyles.listContent}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />}
              ListEmptyComponent={
                <View style={HomeScreenStyles.emptyContainer}>
                  <Text style={HomeScreenStyles.emptyText}>Henüz şikayet yok.</Text>
                </View>
              }
            />
          )}

        </View>
      </ImageBackground>

      <Modal
        visible={fullImageVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setFullImageVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity 
                style={{ position: 'absolute', top: 40, right: 20, zIndex: 10, padding: 10 }}
                onPress={() => setFullImageVisible(false)}
            >
                <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>✕</Text>
            </TouchableOpacity>
            
            {selectedImage && (
                <Image
                    source={{ uri: selectedImage }}
                    style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height * 0.8 }}
                    resizeMode="contain"
                />
            )}
        </View>
      </Modal>

    </View>
  );
};

export default HomeScreen;