import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Alert,
  TouchableOpacity,
  Modal,
  TextInput,
  Image,
  Linking,
} from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import {
  fetchOfficialComplaintDetail,
  rejectComplaint,
  fetchWorkers,
  assignComplaintToEmployee,
  OfficialComplaint,
  Worker,
} from "../../api/official";
import styles from "../../styles/OfficialComplaintDetailStyles";
import { BASE_URL } from "../../config";
import MapView, { Marker } from "react-native-maps";

type DetailRouteParams = {
  OfficialComplaintDetail: {
    complaintId: number;
  };
};

const statusLabelMap: Record<string, string> = {
  pending: "Beklemede",
  in_progress: "İşlemde",
  assigned: "İşçiye Atandı",
  resolved: "Çözüldü",
  rejected: "Reddedildi",
};

export default function OfficialComplaintDetailScreen() {
  const [fullImageVisible, setFullImageVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const route =
    useRoute<RouteProp<DetailRouteParams, "OfficialComplaintDetail">>();
  const navigation = useNavigation<any>();

  const complaintId = route.params?.complaintId;

  const [complaint, setComplaint] = useState<OfficialComplaint | null>(null);
  const [loading, setLoading] = useState(true);

  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);

  const [actionLoading, setActionLoading] = useState(false);

  const loadComplaint = async () => {
    try {
      setLoading(true);
      const data = await fetchOfficialComplaintDetail(complaintId);
      setComplaint(data);
    } catch (error) {
      Alert.alert("Hata", "Şikayet detayı yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const loadWorkers = async () => {
    try {
      const list = await fetchWorkers();
      setWorkers(list.filter((w) => w.is_active));
    } catch (error) {
      Alert.alert("Hata", "İşçi listesi alınamadı.");
    }
  };

  useEffect(() => {
    if (!complaintId) {
      Alert.alert("Hata", "Şikayet bulunamadı.");
      navigation.goBack();
      return;
    }
    loadComplaint();
  }, [complaintId]);

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      Alert.alert("Uyarı", "Lütfen red sebebini girin.");
      return;
    }
    try {
      setActionLoading(true);
      const updated = await rejectComplaint(complaintId, rejectReason.trim());
      setComplaint(updated);
      setRejectModalVisible(false);
      setRejectReason("");
      Alert.alert("Başarılı", "Şikayet reddedildi.");
    } catch (error) {
      Alert.alert("Hata", "Şikayet reddedilirken bir hata oluştu.");
    } finally {
      setActionLoading(false);
    }
  };

  const openAssignModal = async () => {
    setSelectedWorker(null);
    await loadWorkers();
    setAssignModalVisible(true);
  };

  const handleAssign = async () => {
    if (!selectedWorker) {
      Alert.alert("Uyarı", "Lütfen bir işçi seçin.");
      return;
    }
    try {
      setActionLoading(true);
      const updated = await assignComplaintToEmployee(
        complaintId,
        selectedWorker.user_id
      );
      setComplaint(updated);
      setAssignModalVisible(false);
      setSelectedWorker(null);
      Alert.alert("Başarılı", "Şikayet işçiye atandı.");
    } catch (error) {
      Alert.alert("Hata", "Şikayet atanırken bir hata oluştu.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading || !complaint) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator />
        <Text style={styles.loadingText}>Şikayet detayı yükleniyor...</Text>
      </View>
    );
  }

  const statusLabel = statusLabelMap[complaint.status] || complaint.status;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>{complaint.title}</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{statusLabel}</Text>
          </View>
        </View>

        {complaint.category && (
          <Text style={styles.categoryText}>
            Kategori: {complaint.category.name}
          </Text>
        )}

        {complaint.address && (
          <Text style={styles.addressText}>Adres: {complaint.address}</Text>
        )}

        {typeof complaint.latitude === "number" &&
          typeof complaint.longitude === "number" && (
            <>
              <Text style={styles.sectionTitle}>Konum</Text>

              <View style={styles.mapContainer}>
                <MapView
                  style={styles.map}
                  scrollEnabled={false}
                  zoomEnabled={false}
                  initialRegion={{
                    latitude: complaint.latitude,
                    longitude: complaint.longitude,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                  }}
                >
                  <Marker
                    coordinate={{
                      latitude: complaint.latitude,
                      longitude: complaint.longitude,
                    }}
                  />
                </MapView>
              </View>

              <TouchableOpacity
                style={styles.mapButton}
                onPress={() =>
                  Linking.openURL(
                    `http://maps.google.com/maps?q=${complaint.latitude},${complaint.longitude}`
                  )
                }
              >
                <Text style={styles.mapButtonText}>Haritada Aç</Text>
              </TouchableOpacity>
            </>
          )}

        <Text style={styles.sectionTitle}>Açıklama</Text>
        <Text style={styles.description}>{complaint.description}</Text>

        {complaint.reject_reason && (
          <>
            <Text style={styles.sectionTitle}>Red Sebebi</Text>
            <Text style={styles.rejectText}>{complaint.reject_reason}</Text>
          </>
        )}

        <Text style={styles.metaText}>
          Oluşturulma: {new Date(complaint.created_at).toLocaleString("tr-TR")}
        </Text>

        {typeof complaint.support_count === "number" && (
          <Text style={styles.metaText}>
            Destek Sayısı: {complaint.support_count}
          </Text>
        )}

        {complaint.photos && complaint.photos.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Şikayet Fotoğrafları</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.photosRow}
              contentContainerStyle={{ paddingRight: 20 }}
            >
              {complaint.photos.map((p: any) => {
                const rawUrl = p.photo_url || p.url;
                const fullUrl = rawUrl?.startsWith("http")
                  ? rawUrl
                  : `${BASE_URL}${rawUrl}`;

                return (
                  <TouchableOpacity
                    key={p.id}
                    onPress={() => {
                      setSelectedImage(fullUrl);
                      setFullImageVisible(true);
                    }}
                    activeOpacity={0.8}
                  >
                    <Image
                      source={{ uri: fullUrl }}
                      style={styles.photo}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </>
        )}

        {complaint.resolution_photos &&
          complaint.resolution_photos.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Çözüm Fotoğrafları</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.photosRow}
                contentContainerStyle={{ paddingRight: 20 }}
              >
                {complaint.resolution_photos.map((p: any) => {
                  const rawUrl = p.photo_url || p.url;
                  const fullUrl = rawUrl?.startsWith("http")
                    ? rawUrl
                    : `${BASE_URL}${rawUrl}`;

                  return (
                    <TouchableOpacity
                      key={p.id}
                      onPress={() => {
                        setSelectedImage(fullUrl);
                        setFullImageVisible(true);
                      }}
                      activeOpacity={0.8}
                    >
                      <Image
                        source={{ uri: fullUrl }}
                        style={styles.photo}
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </>
          )}

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.actionButton, styles.rejectButton]}
            onPress={() => setRejectModalVisible(true)}
            disabled={
              complaint.status === "rejected" || complaint.status === "resolved"
            }
          >
            <Text style={styles.actionButtonText}>Reddet</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.assignButton]}
            onPress={openAssignModal}
            disabled={complaint.status === "resolved" || complaint.status === "rejected"}
          >
            <Text style={styles.actionButtonText}>İşçiye Ata</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={rejectModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setRejectModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Red Sebebi</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Örn: Uygunsuz içerik, yanlış bilgi..."
              placeholderTextColor="#9CA3AF"
              multiline
              value={rejectReason}
              onChangeText={setRejectReason}
            />
            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancel]}
                onPress={() => setRejectModalVisible(false)}
                disabled={actionLoading}
              >
                <Text style={styles.modalButtonText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalConfirm]}
                onPress={handleReject}
                disabled={actionLoading}
              >
                <Text style={styles.modalButtonText}>
                  {actionLoading ? "Gönderiliyor..." : "Onayla"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={assignModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setAssignModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>İşçi Seç</Text>

            {workers.length === 0 ? (
              <Text style={styles.emptyEmployeesText}>
                Atanabilir işçi bulunamadı.
              </Text>
            ) : (
              <ScrollView style={styles.employeeList}>
                {workers.map((w) => (
                  <TouchableOpacity
                    key={w.id}
                    style={[
                      styles.employeeItem,
                      selectedWorker?.id === w.id && styles.employeeItemSelected,
                    ]}
                    onPress={() => setSelectedWorker(w)}
                  >
                    <Text style={styles.employeeName}>{w.full_name}</Text>
                    <Text style={styles.employeeEmail}>
                      user_id: {w.user_id}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancel]}
                onPress={() => setAssignModalVisible(false)}
                disabled={actionLoading}
              >
                <Text style={styles.modalButtonText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalConfirm]}
                onPress={handleAssign}
                disabled={actionLoading || !selectedWorker}
              >
                <Text style={styles.modalButtonText}>
                  {actionLoading ? "Atanıyor..." : "Ata"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={fullImageVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setFullImageVisible(false)}
      >
        <View style={styles.fullImageOverlay}>
          <TouchableOpacity
            style={styles.fullImageClose}
            onPress={() => setFullImageVisible(false)}
          >
            <Text style={styles.fullImageCloseText}>✕</Text>
          </TouchableOpacity>

          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              style={styles.fullImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
    </View>
  );
}
