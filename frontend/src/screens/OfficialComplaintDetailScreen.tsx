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
  fetchEmployees,
  assignComplaintToEmployee,
  OfficialComplaint,
  EmployeeUser,
} from "../api/official";
import styles from "../styles/OfficialComplaintDetailStyles";
import { BASE_URL } from "../config";
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

const resolvePhotoUrl = (url: string) =>
  url.startsWith("http") ? url : `${BASE_URL}${url}`;

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
  const [employees, setEmployees] = useState<EmployeeUser[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeUser | null>(
    null
  );
  const [actionLoading, setActionLoading] = useState(false);

  const loadComplaint = async () => {
    try {
      setLoading(true);
      const data = await fetchOfficialComplaintDetail(complaintId);
      console.log("COMPLAINT DETAIL:", data);
      setComplaint(data);
    } catch (error) {
      console.log("Complaint detail error:", error);
      Alert.alert("Hata", "Şikayet detayı yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const loadEmployees = async () => {
    try {
      const list = await fetchEmployees();
      setEmployees(list);
    } catch (error) {
      console.log("Employees fetch error:", error);
      Alert.alert("Hata", "Çalışan listesi alınamadı.");
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
      console.log("Reject error:", error);
      Alert.alert("Hata", "Şikayet reddedilirken bir hata oluştu.");
    } finally {
      setActionLoading(false);
    }
  };

  const openAssignModal = async () => {
    await loadEmployees();
    setAssignModalVisible(true);
  };

  const handleAssign = async () => {
    if (!selectedEmployee) {
      Alert.alert("Uyarı", "Lütfen bir çalışan seçin.");
      return;
    }
    try {
      setActionLoading(true);
      const updated = await assignComplaintToEmployee(
        complaintId,
        selectedEmployee.id
      );
      setComplaint(updated);
      setAssignModalVisible(false);
      setSelectedEmployee(null);
      Alert.alert("Başarılı", "Şikayet çalışana atandı.");
    } catch (error) {
      console.log("Assign error:", error);
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

              {/* Küçük harita */}
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
          Oluşturulma:{" "}
          {new Date(complaint.created_at).toLocaleString("tr-TR")}
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
                const fullUrl = p.photo_url.startsWith("http")
                  ? p.photo_url
                  : `${BASE_URL}${p.photo_url}`;

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
                  const fullUrl = p.photo_url.startsWith("http")
                    ? p.photo_url
                    : `${BASE_URL}${p.photo_url}`;

                  return (
                    <Image
                      key={p.id}
                      source={{ uri: fullUrl }}
                      style={styles.photo}
                      resizeMode="cover"
                    />
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
            disabled={
              complaint.status === "resolved" || complaint.status === "rejected"
            }
          >
            <Text style={styles.actionButtonText}>Çalışana Ata</Text>
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
            <Text style={styles.modalTitle}>Çalışan Seç</Text>

            {employees.length === 0 ? (
              <Text style={styles.emptyEmployeesText}>
                Atanabilir çalışan bulunamadı.
              </Text>
            ) : (
              <ScrollView style={styles.employeeList}>
                {employees.map((emp) => (
                  <TouchableOpacity
                    key={emp.id}
                    style={[
                      styles.employeeItem,
                      selectedEmployee?.id === emp.id &&
                        styles.employeeItemSelected,
                    ]}
                    onPress={() => setSelectedEmployee(emp)}
                  >
                    <Text style={styles.employeeName}>{emp.name}</Text>
                    <Text style={styles.employeeEmail}>{emp.email}</Text>
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
                disabled={actionLoading || !selectedEmployee}
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