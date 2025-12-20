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

  // Inline mesajlar
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setErrorMessage("");
    setTimeout(() => setSuccessMessage(""), 4000);
  };

  const showError = (msg: string) => {
    setErrorMessage(msg);
    setSuccessMessage("");
    setTimeout(() => setErrorMessage(""), 4000);
  };

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

  const handleDeleteComplaint = (id: number, title?: string) => {
    Alert.alert(
      "Şikayeti Sil",
      `"${title || 'Bu şikayet'}" kaydını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`,
      [
        { text: "Vazgeç", style: "cancel" },
        {
          text: "Evet, Sil",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteComplaint(id);
              setComplaints((prev) => prev.filter((c) => c.id !== id));
              showSuccess("Şikayet kaydı başarıyla silindi.");
            } catch (err: any) {
              const detail = err?.response?.data?.detail || "";
              if (detail.includes("yetki") || detail.includes("permission")) {
                showError("Bu şikayeti silme yetkiniz yok.");
              } else if (detail.includes("bulunamadı") || detail.includes("not found")) {
                showError("Şikayet bulunamadı, zaten silinmiş olabilir.");
              } else {
                showError("Şikayet silinirken bir hata oluştu. Lütfen tekrar deneyin.");
              }
            }
          },
        },
      ]
    );
  };

  const handleDeletePhoto = (complaintId: number, photoId: number) => {
    Alert.alert(
      "Fotoğrafı Sil",
      "Bu fotoğrafı silmek istediğinize emin misiniz?",
      [
        { text: "Vazgeç", style: "cancel" },
        {
          text: "Evet, Sil",
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
              showSuccess("Fotoğraf başarıyla silindi.");
            } catch (err: any) {
              const detail = err?.response?.data?.detail || "";
              if (detail.includes("yetki") || detail.includes("permission")) {
                showError("Bu fotoğrafı silme yetkiniz yok.");
              } else if (detail.includes("bulunamadı") || detail.includes("not found")) {
                showError("Fotoğraf bulunamadı, zaten silinmiş olabilir.");
              } else {
                showError("Fotoğraf silinirken bir hata oluştu. Lütfen tekrar deneyin.");
              }
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Complaint }) => {
    const expanded = expandedIds.includes(item.id);

    // İlk fotoğrafı arka plan olarak kullan
    const displayPhoto = item.photos && item.photos.length > 0
      ? resolvePhotoUrl(item.photos[0].photo_url)
      : null;

    return (
      <View style={styles.card}>
        {/* Bulanık Arka Plan Resmi */}
        {displayPhoto && (
          <View style={{ position: 'relative' }}>
            <Image
              source={{ uri: displayPhoto }}
              style={{ width: '100%', height: 120, borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
              resizeMode="cover"
              blurRadius={3}
            />
            {/* Karartma Overlay */}
            <View style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
            }} />
          </View>
        )}

        {/* Kart İçeriği */}
        <View style={{ padding: 16 }}>
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

            {/* Çözüm Fotoğrafları */}
            {(item as any).resolution_photos && (item as any).resolution_photos.length > 0 && (
              <View style={[styles.photosContainer, { marginTop: 12 }]}>
                <Text style={[styles.sectionMiniTitle, { color: "#047857" }]}>✅ Çözüm Kanıtları</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {(item as any).resolution_photos.map((p: any) => {
                    const rawUrl = p.photo_url || p.url;
                    const fullUrl = resolvePhotoUrl(rawUrl);
                    return (
                      <View key={p.id} style={styles.photoWrapper}>
                        <Image
                          source={{ uri: fullUrl }}
                          style={[styles.detailImage, { borderWidth: 2, borderColor: "#10b981" }]}
                        />
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
              onPress={() => handleDeleteComplaint(item.id, item.title || undefined)}
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

      {/* Başarı Mesajı */}
      {successMessage !== "" && (
        <View style={{ backgroundColor: "#10B981", paddingVertical: 12, paddingHorizontal: 16, marginHorizontal: 16, marginTop: 12, borderRadius: 10 }}>
          <Text style={{ color: "#fff", fontSize: 14, fontWeight: "600", textAlign: "center" }}>
            ✓ {successMessage}
          </Text>
        </View>
      )}

      {/* Hata Mesajı */}
      {errorMessage !== "" && (
        <View style={{ backgroundColor: "#EF4444", paddingVertical: 12, paddingHorizontal: 16, marginHorizontal: 16, marginTop: 12, borderRadius: 10 }}>
          <Text style={{ color: "#fff", fontSize: 14, fontWeight: "600", textAlign: "center" }}>
            ✕ {errorMessage}
          </Text>
        </View>
      )}

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
