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
  ImageBackground,
  StatusBar,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import MapView, { Marker } from "react-native-maps";

import {
  getMyComplaints,
  deleteComplaint,
  deleteComplaintPhoto,
} from "../../api/complaints";
import { Complaint } from "../../types";
import MyComplaintsStyles from "../../styles/MyComplaintsStyles";
import { BASE_URL } from "../../config";

type Props = NativeStackScreenProps<any, "MyComplaints">;

const BG_IMAGE = "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=2070&auto=format&fit=crop";

const MyComplaintsScreen: React.FC<Props> = ({ navigation }) => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [expandedIds, setExpandedIds] = useState<number[]>([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const loadComplaints = async () => {
    try {
      const data = await getMyComplaints();
      setComplaints(data);
    } catch (err: any) {
      console.log(
        "GET_MY_COMPLAINTS_ERROR:",
        err?.response?.data || err.message
      );
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
        return "Beklemede";
      case "in_progress":
        return "İşlemde";
      case "resolved":
        return "Çözüldü";
      default:
        return status;
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleDeleteComplaint = (id: number) => {
    Alert.alert(
      "Şikayeti sil",
      "Bu şikayeti kalıcı olarak silmek istediğine emin misin?",
      [
        { text: "Vazgeç", style: "cancel" },
        {
          text: "Sil",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteComplaint(id);
              setComplaints((prev) => prev.filter((c) => c.id !== id));
            } catch (err: any) {
              console.log(
                "DELETE_COMPLAINT_ERROR:",
                err?.response?.data || err
              );
              Alert.alert("Hata", "Şikayet silinirken bir hata oluştu.");
            }
          },
        },
      ]
    );
  };

  const handleDeletePhoto = (complaintId: number, photoId: number) => {
    Alert.alert(
      "Fotoğrafı sil",
      "Bu fotoğrafı silmek istediğine emin misin?",
      [
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
                    ? {
                        ...c,
                        photos: c.photos?.filter((p) => p.id !== photoId) || [],
                      }
                    : c
                )
              );
            } catch (err: any) {
              console.log(
                "DELETE_PHOTO_ERROR:",
                err?.response?.data || err
              );
              Alert.alert("Hata", "Fotoğraf silinirken bir hata oluştu.");
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Complaint }) => {
    const expanded = expandedIds.includes(item.id);

    return (
      <View style={MyComplaintsStyles.card}>
        <View style={MyComplaintsStyles.cardHeader}>
          <View style={{ flex: 1 }}>
            <Text style={MyComplaintsStyles.title}>
              {item.title || "Başlıksız şikayet"}
            </Text>
            <Text
              style={[
                MyComplaintsStyles.statusBadge,
                item.status === "pending" && MyComplaintsStyles.statusPending,
                item.status === "in_progress" &&
                  MyComplaintsStyles.statusInProgress,
                item.status === "resolved" &&
                  MyComplaintsStyles.statusResolved,
              ]}
            >
              {renderStatus(item.status)}
            </Text>
          </View>
        </View>

        <Text
          style={MyComplaintsStyles.description}
          numberOfLines={expanded ? undefined : 2}
        >
          {item.description}
        </Text>

        <View style={MyComplaintsStyles.cardFooter}>
          <Text style={MyComplaintsStyles.dateText}>
            {new Date(item.created_at).toLocaleString()}
          </Text>
          <Text style={MyComplaintsStyles.supportText}>
            👍 {item.support_count ?? 0}
          </Text>
        </View>

        {expanded && (
          <View style={MyComplaintsStyles.detailsContainer}>
            {item.photos && item.photos.length > 0 && (
              <View style={MyComplaintsStyles.photosContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {item.photos.map((p) => {
                    const rawUrl = p.photo_url;
                    const fullUrl = rawUrl.startsWith("http")
                      ? rawUrl
                      : `${BASE_URL}${rawUrl}`;
                    return (
                      <View key={p.id} style={MyComplaintsStyles.photoWrapper}>
                        <Image
                          source={{ uri: fullUrl }}
                          style={MyComplaintsStyles.detailImage}
                        />
                        <TouchableOpacity
                          style={MyComplaintsStyles.photoDeleteButton}
                          onPress={() =>
                            handleDeletePhoto(item.id, p.id)
                          }
                        >
                          <Text style={MyComplaintsStyles.photoDeleteText}>
                            SİL
                          </Text>
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </ScrollView>
              </View>
            )}

            {typeof (item as any).latitude === "number" &&
              typeof (item as any).longitude === "number" && (
                <View style={MyComplaintsStyles.mapContainer}>
                  <MapView
                    style={MyComplaintsStyles.map}
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
              )}

            <TouchableOpacity
              style={MyComplaintsStyles.deleteButton}
              onPress={() => handleDeleteComplaint(item.id)}
            >
              <Text style={MyComplaintsStyles.deleteButtonText}>
                🗑️ Şikayeti Sil
              </Text>
            </TouchableOpacity>
          </View>
        )}
        
        <TouchableOpacity 
          style={MyComplaintsStyles.expandButtonContainer} 
          onPress={() => toggleExpand(item.id)}
          activeOpacity={0.7}
        >
           <View style={MyComplaintsStyles.expandButton}>
              <Text style={MyComplaintsStyles.expandText}>
                {expanded ? "Gizle" : "Detaylar"}
              </Text>
           </View>
        </TouchableOpacity>

      </View>
    );
  };

  return (
    <View style={MyComplaintsStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ImageBackground
        source={{ uri: BG_IMAGE }}
        style={MyComplaintsStyles.backgroundImage}
        resizeMode="cover"
      >
        <View style={MyComplaintsStyles.overlay}>
          
          <View style={MyComplaintsStyles.header}>
            <TouchableOpacity 
              style={MyComplaintsStyles.backButton} 
              onPress={() => navigation.goBack()}
            >
              <Text style={MyComplaintsStyles.backButtonIcon}>‹</Text>
            </TouchableOpacity>
            <Text style={MyComplaintsStyles.headerTitle}>Şikayetlerim</Text>
          </View>

          {loading ? (
            <View style={MyComplaintsStyles.loadingContainer}>
              <ActivityIndicator size="large" color="#6C63FF" />
              <Text style={MyComplaintsStyles.loadingText}>
                Yükleniyor...
              </Text>
            </View>
          ) : (
             <FlatList
              data={complaints}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderItem}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />
              }
              contentContainerStyle={MyComplaintsStyles.listContent}
              ListEmptyComponent={
                <View style={MyComplaintsStyles.emptyContainer}>
                  <Text style={MyComplaintsStyles.emptyText}>
                    Henüz bir şikayetiniz yok.
                  </Text>
                </View>
              }
            />
          )}
        </View>
      </ImageBackground>
    </View>
  );
};

export default MyComplaintsScreen;