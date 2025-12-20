import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BASE_URL } from "../../config";
import styles from "../../styles/EmployeeJobDetailStyles";
import { launchImageLibrary } from "react-native-image-picker";
import client from "../../api/client";
// Fotoğraf URL'sini tam adrese çeviren fonksiyon
const resolvePhoto = (url?: string | null) => {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `${BASE_URL}${url}`;
};

export default function EmployeeJobDetailScreen({ route, navigation }: any) {
  const { complaintId, assignmentId } = route.params;

  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState<any>(null);

  const [starting, setStarting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [selectedSolutionImages, setSelectedSolutionImages] = useState<any[]>([]);
  const [solutionUrls, setSolutionUrls] = useState<string[]>([]);

  // Mesaj state'leri
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Çözüm fotoğraflarını parse etme
  const parseSolutionUrls = (raw: any): string[] => {
    if (!raw) return [];
    const isString = (v: any): v is string => typeof v === "string" && v.length > 0;

    if (typeof raw === "string") {
      if (raw.trim().startsWith("[")) {
        try {
          const arr = JSON.parse(raw);
          if (Array.isArray(arr)) {
            return arr.map((x: any) => resolvePhoto(String(x))).filter(isString);
          }
        } catch { }
      }
      const one = resolvePhoto(raw);
      return one ? [one] : [];
    }
    if (Array.isArray(raw)) {
      return raw.map((x: any) => resolvePhoto(String(x))).filter(isString);
    }
    return [];
  };

  // ✅ Yeni: Şikayete ait fotoğrafları GET ile çek
  const fetchComplaintPhotos = async (token: string) => {
    try {
      const res = await client.get(`${BASE_URL}/complaints/${complaintId}/photos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data || []; // [{id, photo_url, created_at}, ...]
    } catch (e) {
      return [];
    }
  };

  const fetchDetail = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      // 1) Assignment detayını çek
      const res = await client.get(`${BASE_URL}/employee/assignments/${assignmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const complaint = res.data?.complaint;

      // 2) ✅ Fotoğrafları ayrı endpoint’ten çek (hepsi gelir)
      const photos = await fetchComplaintPhotos(token);

      // 3) Complaint içine photos'u ekle
      setItem({
        ...complaint,
        photos, // artık item.photos dolu
      });

      const rawSolution = res.data?.solution_photo_url;
      setSolutionUrls(parseSolutionUrls(rawSolution));
    } catch (e: any) {
      const msg = e?.response?.data?.detail || e?.message || "Detay alınamadı.";
      setErrorMessage(String(msg));
      setTimeout(() => setErrorMessage(""), 4000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, []);

  const startJob = async () => {
    try {
      setStarting(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      await client.post(
        `${BASE_URL}/employee/assignments/${assignmentId}/start`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccessMessage("İş süreci başlatıldı.");
      setTimeout(() => setSuccessMessage(""), 4000);
      fetchDetail();
    } catch (e: any) {
      setErrorMessage("Bu iş zaten başlatılmış veya işlemde.");
      setTimeout(() => setErrorMessage(""), 4000);
    } finally {
      setStarting(false);
    }
  };

  const pickSolutionImages = async () => {
    try {
      const result: any = await launchImageLibrary({
        mediaType: "photo",
        quality: 0.8,
        selectionLimit: 0,
      });

      if (!result || result.didCancel) return;

      if (result.assets && result.assets.length > 0) {
        setSelectedSolutionImages((prev) => [...prev, ...result.assets]);
      }
    } catch (error) {
      setErrorMessage("Fotoğraf seçerken bir hata oluştu.");
      setTimeout(() => setErrorMessage(""), 4000);
    }
  };

  const uploadSolutionPhotos = async () => {
    if (selectedSolutionImages.length === 0) {
      setErrorMessage("Lütfen önce galeriden fotoğraf seçin.");
      setTimeout(() => setErrorMessage(""), 4000);
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      setUploading(true);

      const form = new FormData();
      selectedSolutionImages.forEach((asset: any, idx: number) => {
        if (!asset?.uri) return;
        form.append("files", {
          uri: asset.uri,
          name: asset.fileName || `solution_${idx}.jpg`,
          type: asset.type || "image/jpeg",
        } as any);
      });

      const res = await client.post(
        `${BASE_URL}/employee/assignments/${assignmentId}/solution-photos`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const urls = (res.data?.solution_photo_urls || [])
        .map((x: string) => resolvePhoto(x))
        .filter(Boolean) as string[];

      setSolutionUrls(urls);
      setSelectedSolutionImages([]);

      setSuccessMessage("Çözüm fotoğrafları sisteme yüklendi. İş tamamlandı!");
      setTimeout(() => setSuccessMessage(""), 4000);
      fetchDetail();
    } catch (e: any) {
      const msg = e?.response?.data?.detail || "Fotoğraf yüklenemedi.";
      setErrorMessage(String(msg));
      setTimeout(() => setErrorMessage(""), 4000);
    } finally {
      setUploading(false);
    }
  };

  const openMap = () => {
    const lat = parseFloat(item?.latitude);
    const lng = parseFloat(item?.longitude);

    if (lat && lng) {
      const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
      Linking.canOpenURL(url).then((supported) => {
        if (supported) Linking.openURL(url);
        else {
          setErrorMessage("Harita uygulaması açılamadı.");
          setTimeout(() => setErrorMessage(""), 4000);
        }
      });
    } else {
      const query = item?.address ? encodeURIComponent(item.address) : "";
      if (query) {
        Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`);
      } else {
        setErrorMessage("Konum bilgisi (koordinat veya adres) mevcut değil.");
        setTimeout(() => setErrorMessage(""), 4000);
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1e3a8a" />
        <Text style={styles.loadingText}>İş detayları yükleniyor...</Text>
      </View>
    );
  }

  if (!item) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#64748b" }}>Kayıt bulunamadı.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* Başarı Mesajı */}
      {successMessage !== "" && (
        <View style={{ backgroundColor: "#10B981", paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10, marginBottom: 16 }}>
          <Text style={{ color: "#fff", fontSize: 14, fontWeight: "600", textAlign: "center" }}>
            ✓ {successMessage}
          </Text>
        </View>
      )}

      {/* Hata Mesajı */}
      {errorMessage !== "" && (
        <View style={{ backgroundColor: "#EF4444", paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10, marginBottom: 16 }}>
          <Text style={{ color: "#fff", fontSize: 14, fontWeight: "600", textAlign: "center" }}>
            ✕ {errorMessage}
          </Text>
        </View>
      )}

      <View style={styles.headerSection}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{item.title || "Başlıksız Şikayet"}</Text>
          <View style={styles.idBadge}>
            <Text style={styles.idText}>#{item.id}</Text>
          </View>
        </View>

        <View style={styles.addressRow}>
          <Text>📍</Text>
          <Text style={styles.addressText}>
            {item.address || "Adres bilgisi girilmemiş."}
          </Text>
        </View>
      </View>

      <View style={styles.descriptionCard}>
        <Text style={styles.descLabel}>VATANDAŞ AÇIKLAMASI:</Text>
        <Text style={styles.descText}>{item.description || "Açıklama yok."}</Text>
      </View>

      <View style={styles.mapCard}>
        <Text style={styles.descLabel}>KONUM İŞLEMLERİ</Text>
        <TouchableOpacity style={styles.mapButton} onPress={openMap}>
          <Text>🗺️</Text>
          <Text style={styles.mapButtonText}>Haritada Yol Tarifi Al</Text>
        </TouchableOpacity>
      </View>

      {/* ✅ VATANDAŞ FOTOĞRAFLARI (GET /complaints/{id}/photos) */}
      <Text style={styles.sectionTitle}>Şikayet Fotoğrafları</Text>
      <View style={styles.photosContainer}>
        {item.photos && item.photos.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {item.photos.map((p: any, index: number) => {
              const url = resolvePhoto(p.photo_url);
              if (!url) return null;

              return (
                <TouchableOpacity key={p.id || index} activeOpacity={0.9}>
                  <Image
                    source={{ uri: url as string }}
                    style={styles.photo}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        ) : (
          <Text style={styles.noPhotoText}>Vatandaş fotoğraf yüklememiş.</Text>
        )}
      </View>

      <View style={styles.actionSection}>
        <TouchableOpacity
          style={[styles.primaryBtn, starting && styles.disabledBtn]}
          onPress={startJob}
          disabled={starting}
        >
          <Text style={styles.primaryBtnText}>
            {starting ? "Başlatılıyor..." : "🚀 İşi Başlat / Konuma Vardım"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.secondaryBtn, uploading && styles.disabledBtn]}
          onPress={pickSolutionImages}
          disabled={uploading}
        >
          <Text style={styles.secondaryBtnText}>📸 Çözüm Fotoğrafı Seç</Text>
        </TouchableOpacity>

        {selectedSolutionImages.length > 0 && (
          <TouchableOpacity
            style={[styles.primaryBtn, { backgroundColor: "#16a34a", marginTop: 10 }]}
            onPress={uploadSolutionPhotos}
            disabled={uploading}
          >
            {uploading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryBtnText}>✅ Seçilenleri Yükle ve Bitir</Text>
            )}
          </TouchableOpacity>
        )}
      </View>

      {selectedSolutionImages.length > 0 && (
        <View style={styles.solutionPreviewContainer}>
          <Text style={styles.previewTitle}>
            Yüklenecek Fotoğraflar ({selectedSolutionImages.length})
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {selectedSolutionImages.map((img, index) => (
              <Image key={index} source={{ uri: img.uri }} style={styles.previewImage} />
            ))}
          </ScrollView>
        </View>
      )}

      {solutionUrls.length > 0 && (
        <View
          style={[
            styles.solutionPreviewContainer,
            { backgroundColor: "#fff", borderColor: "#e2e8f0", marginTop: 20 },
          ]}
        >
          <Text style={[styles.previewTitle, { color: "#1e3a8a" }]}>
            Tamamlanan İş Fotoğrafları
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {solutionUrls.map((u, i) => (
              <Image key={i} source={{ uri: u }} style={styles.previewImage} />
            ))}
          </ScrollView>
        </View>
      )}
    </ScrollView>
  );
}
