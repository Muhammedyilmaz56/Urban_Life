import React, { useEffect, useState, useCallback, useLayoutEffect } from "react";
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
  StatusBar,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import MapView, { Marker } from "react-native-maps";

import { getMyComplaints, deleteComplaint, deleteComplaintPhoto } from "../../../api/complaints";
import { Complaint } from "../../../types";
import styles from "../../../styles/MyComplaintsStyles";
import { BASE_URL } from "../../../config";

type Props = NativeStackScreenProps<any, "MyComplaints">;

const formatDateTR = (value: any) => {
  try {
    return new Date(value).toLocaleString("tr-TR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return String(value ?? "");
  }
};

const resolvePhotoUrl = (url: string) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${BASE_URL}${url}`;
};

const MyComplaintsScreen: React.FC<Props> = ({ navigation }) => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [expandedIds, setExpandedIds] = useState<number[]>([]);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const loadComplaints = async () => {
    try {
      const data = await getMyComplaints();
      setComplaints(data);
    } catch (err: any) {
      console.log("GET_MY_COMPLAINTS_ERROR:", err?.response?.data || err?.message || err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadComplaints();
  }, []);

  const renderStatus = (status: Complaint["status"]) => {
    switch (status) {
      case "pending":
        return "İnceleniyor";
      case "in_progress":
        return "İşlem Yapılıyor";
      case "resolved":
        return "Sonuçlandı";
      default:
        return String(status);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleDeleteComplaint = (id: number) => {
    Alert.alert("Şikayet Kaydını Sil", "Bu kaydı kalıcı olarak silmek istiyor musunuz?", [
      { text: "Vazgeç", style: "cancel" },
      {
        text: "Sil",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteComplaint(id);
            setComplaints((prev) => prev.filter((c) => c.id !== id));
          } catch (err: any) {
            console.log("DELETE_COMPLAINT_ERROR:", err?.response?.data || err);
            Alert.alert("Hata", "Şikayet silinirken bir hata oluştu.");
          }
        },
      },
    ]);
  };

  const handleDeletePhoto = (complaintId: number, photoId: number) => {
    Alert.alert("Fotoğrafı Sil", "Bu fotoğrafı silmek istiyor musunuz?", [
      { text: "Vazgeç", style: "cancel" },
      {
        text: "Sil",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteComplaintPhoto(photoId);
            setComplaints((prev) =>
              prev.map((c) =>
                c.id === complaintId
                  ? { ...c, photos: c.photos?.filter((p) => p.id !== photoId) || [] }
                  : c
              )
            );
          } catch (err: any) {
            console.log("DELETE_PHOTO_ERROR:", err?.response?.data || err);
            Alert.alert("Hata", "Fotoğraf silinirken bir hata oluştu.");
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: Complaint }) => {
    const expanded = expandedIds.includes(item.id);

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title} numberOfLines={2}>
              {item.title || "Başlıksız Şikayet"}
            </Text>

            <View
              style={[
                styles.statusPill,
                item.status === "pending" && styles.statusPending,
                item.status === "in_progress" && styles.statusInProgress,
                item.status === "resolved" && styles.statusResolved,
              ]}
            >
              <Text
                style={[
                  styles.statusPillText,
                  item.status === "pending" && styles.statusTextPending,
                  item.status === "in_progress" && styles.statusTextInProgress,
                  item.status === "resolved" && styles.statusTextResolved,
                ]}
              >
                {renderStatus(item.status)}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.description} numberOfLines={expanded ? undefined : 2}>
          {item.description}
        </Text>

        <View style={styles.cardFooter}>
          <Text style={styles.dateText}>{formatDateTR(item.created_at)}</Text>
          <View style={styles.supportPill}>
            <Text style={styles.supportText}>👍 {item.support_count ?? 0}</Text>
          </View>
        </View>

        {expanded && (
          <View style={styles.detailsContainer}>
            {item.photos && item.photos.length > 0 && (
              <View style={styles.photosContainer}>
                <Text style={styles.sectionMiniTitle}>Eklenen Fotoğraflar</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {item.photos.map((p) => {
                    const fullUrl = resolvePhotoUrl(p.photo_url);
                    return (
                      <View key={p.id} style={styles.photoWrapper}>
                        <Image source={{ uri: fullUrl }} style={styles.detailImage} />
                        <TouchableOpacity
                          style={styles.photoDeleteButton}
                          onPress={() => handleDeletePhoto(item.id, p.id)}
                          activeOpacity={0.85}
                        >
                          <Text style={styles.photoDeleteText}>KALDIR</Text>
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </ScrollView>
              </View>
            )}

            {typeof (item as any).latitude === "number" && typeof (item as any).longitude === "number" && (
              <View style={styles.mapBlock}>
                <Text style={styles.sectionMiniTitle}>Konum</Text>
                <View style={styles.mapContainer}>
                  <MapView
                    style={styles.map}
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
                </View>
              </View>
            )}

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteComplaint(item.id)}
              activeOpacity={0.9}
            >
              <Text style={styles.deleteButtonText}>Şikayet Kaydını Sil</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={styles.expandButtonContainer}
          onPress={() => toggleExpand(item.id)}
          activeOpacity={0.85}
        >
          <View style={styles.expandButton}>
            <Text style={styles.expandText}>{expanded ? "Detayı Kapat" : "Detayı Gör"}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B3A6A" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.85}>
          <Text style={styles.backButtonIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Şikayetlerim</Text>
        <View style={{ width: 44 }} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0B3A6A" />
          <Text style={styles.loadingText}>Yükleniyor...</Text>
        </View>
      ) : (
        <FlatList
          data={complaints}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0B3A6A" />}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>Kayıt Bulunamadı</Text>
              <Text style={styles.emptyText}>Henüz bir şikayet kaydınız bulunmuyor.</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

export default MyComplaintsScreen;
