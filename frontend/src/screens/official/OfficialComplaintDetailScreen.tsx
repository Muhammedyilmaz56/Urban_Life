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
  StatusBar,
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
  assigned: "Ekiplere İletildi",
  resolved: "Çözüldü",
  rejected: "Reddedildi",
};

const getStatusTheme = (status: string) => {
  switch (status) {
    case "pending":
      return { bg: "#fff7ed", text: "#9a3412", border: "#ffedd5" };
    case "in_progress":
      return { bg: "#eff6ff", text: "#1e40af", border: "#dbeafe" };
    case "assigned":
      return { bg: "#f0fdf4", text: "#166534", border: "#dcfce7" };
    case "resolved":
      return { bg: "#ecfdf5", text: "#047857", border: "#d1fae5" };
    case "rejected":
      return { bg: "#fef2f2", text: "#991b1b", border: "#fee2e2" };
    default:
      return { bg: "#f3f4f6", text: "#1f2937", border: "#e5e7eb" };
  }
};

export default function OfficialComplaintDetailScreen() {
  const [fullImageVisible, setFullImageVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const route = useRoute<RouteProp<DetailRouteParams, "OfficialComplaintDetail">>();
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
      Alert.alert("Hata", "Personel listesi alınamadı.");
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
      Alert.alert("Uyarı", "Lütfen red için geçerli bir sebep girin.");
      return;
    }
    try {
      setActionLoading(true);
      const updated = await rejectComplaint(complaintId, rejectReason.trim());
      setComplaint(updated);
      setRejectModalVisible(false);
      setRejectReason("");
      Alert.alert("İşlem Başarılı", "Şikayet kaydı reddedildi.");
    } catch (error) {
      Alert.alert("Hata", "İşlem sırasında bir hata oluştu.");
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
      Alert.alert("Uyarı", "Lütfen bir personel seçin.");
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
      Alert.alert("Atama Başarılı", "Şikayet ilgili personele iletildi.");
    } catch (error) {
      Alert.alert("Hata", "Atama işlemi başarısız oldu.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading || !complaint) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1e3a8a" />
        <Text style={styles.loadingText}>Veriler yükleniyor...</Text>
      </View>
    );
  }

  const statusTheme = getStatusTheme(complaint.status);
  const statusLabel = statusLabelMap[complaint.status] || complaint.status;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        <View style={styles.headerSection}>
            <View style={styles.headerRow}>
                <Text style={styles.title}>{complaint.title}</Text>
                <View style={[styles.statusBadge, { backgroundColor: statusTheme.bg, borderColor: statusTheme.border }]}>
                    <Text style={[styles.statusText, { color: statusTheme.text }]}>{statusLabel}</Text>
                </View>
            </View>

            {complaint.category && (
            <Text style={styles.categoryText}>📂 {complaint.category.name}</Text>
            )}

            {complaint.address && (
            <Text style={styles.addressText}>📍 {complaint.address}</Text>
            )}
        </View>

        {typeof complaint.latitude === "number" &&
          typeof complaint.longitude === "number" && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Konum Bilgisi</Text>

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
                activeOpacity={0.7}
                onPress={() =>
                  Linking.openURL(
                    `http://maps.google.com/?q=${complaint.latitude},${complaint.longitude}`
                  )
                }
              >
                <Text style={styles.mapButtonText}>🗺️ Haritada Görüntüle</Text>
              </TouchableOpacity>
            </View>
          )}

        <View style={styles.card}>
            <Text style={styles.sectionTitle}>Vatandaş Açıklaması</Text>
            <Text style={styles.description}>{complaint.description}</Text>

            {complaint.reject_reason && (
                <View style={styles.rejectContainer}>
                    <Text style={styles.rejectLabel}>⚠️ Reddedilme Sebebi:</Text>
                    <Text style={styles.rejectText}>{complaint.reject_reason}</Text>
                </View>
            )}

            <View style={styles.metaContainer}>
                <Text style={styles.metaText}>
                    📅 {new Date(complaint.created_at).toLocaleString("tr-TR")}
                </Text>
                {typeof complaint.support_count === "number" && (
                    <Text style={styles.metaText}>👍 {complaint.support_count} Destek</Text>
                )}
            </View>
        </View>

        {complaint.photos && complaint.photos.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Eklenen Fotoğraflar</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.photosRow}
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
          </View>
        )}

        {complaint.resolution_photos &&
          complaint.resolution_photos.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>✅ Çözüm Kanıtları</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.photosRow}
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
            </View>
          )}

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.actionButton, styles.rejectButton, 
                (complaint.status === "rejected" || complaint.status === "resolved") && { opacity: 0.5 }
            ]}
            onPress={() => setRejectModalVisible(true)}
            disabled={complaint.status === "rejected" || complaint.status === "resolved"}
          >
            <Text style={styles.rejectButtonText}>❌ Reddet</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.assignButton,
                (complaint.status === "resolved" || complaint.status === "rejected") && { opacity: 0.5 }
            ]}
            onPress={openAssignModal}
            disabled={complaint.status === "resolved" || complaint.status === "rejected"}
          >
            <Text style={styles.assignButtonText}>👷 Personel Ata</Text>
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
            <Text style={styles.modalTitle}>Şikayeti Reddet</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Lütfen red gerekçesini detaylıca belirtiniz..."
              placeholderTextColor="#94a3b8"
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
                <Text style={styles.modalCancelText}>Vazgeç</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalConfirm, { backgroundColor: '#dc2626' }]}
                onPress={handleReject}
                disabled={actionLoading}
              >
                <Text style={styles.modalConfirmText}>
                  {actionLoading ? "İşleniyor..." : "Onayla ve Reddet"}
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
            <Text style={styles.modalTitle}>Görevli Personel Seçimi</Text>

            {workers.length === 0 ? (
              <Text style={styles.emptyEmployeesText}>
                Uygun durumda personel bulunamadı.
              </Text>
            ) : (
              <ScrollView style={styles.employeeList} showsVerticalScrollIndicator={true}>
                {workers.map((w) => (
                  <TouchableOpacity
                    key={w.id}
                    style={[
                      styles.employeeItem,
                      selectedWorker?.id === w.id && styles.employeeItemSelected,
                    ]}
                    onPress={() => setSelectedWorker(w)}
                  >
                    <View style={styles.employeeAvatarPlaceholder}>
                        <Text style={styles.employeeInitials}>
                            {w.full_name ? w.full_name.charAt(0).toUpperCase() : "?"}
                        </Text>
                    </View>
                    <View style={styles.employeeInfo}>
                        <Text style={styles.employeeName}>{w.full_name}</Text>
                        <Text style={styles.employeeEmail}>ID: {w.user_id}</Text>
                    </View>
                    {selectedWorker?.id === w.id && <Text>✅</Text>}
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
                <Text style={styles.modalCancelText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalConfirm]}
                onPress={handleAssign}
                disabled={actionLoading || !selectedWorker}
              >
                <Text style={styles.modalConfirmText}>
                  {actionLoading ? "Atanıyor..." : "Görevi Ata"}
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
            <Text style={styles.fullImageCloseText}>Kapat ✕</Text>
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