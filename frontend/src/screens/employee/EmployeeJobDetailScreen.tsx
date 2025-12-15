import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BASE_URL } from "../../config";
import styles from "../../styles/EmployeeJobDetailStyles";
import { launchImageLibrary } from "react-native-image-picker";

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
  const isString = (v: any): v is string => typeof v === "string" && v.length > 0;

  const parseSolutionUrls = (raw: any): string[] => {
    if (!raw) return [];
  
    
    if (typeof raw === "string") {
     
      if (raw.trim().startsWith("[")) {
        try {
          const arr = JSON.parse(raw);
          if (Array.isArray(arr)) {
            return arr.map((x: any) => resolvePhoto(String(x))).filter(isString);
          }
        } catch {}
      }
  
      
      const one = resolvePhoto(raw);
      return one ? [one] : [];
    }
  
   
    if (Array.isArray(raw)) {
      return raw.map((x: any) => resolvePhoto(String(x))).filter(isString);
    }
  
    return [];
  };
  

  const fetchDetail = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

     
      const res = await axios.get(`${BASE_URL}/employee/assignments/${assignmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

     
      const complaint = res.data?.complaint;
      setItem(complaint);

      const rawSolution = res.data?.solution_photo_url;
      setSolutionUrls(parseSolutionUrls(rawSolution));
    } catch (e: any) {
      const msg = e?.response?.data?.detail || e?.message || "Detay alınamadı.";
      Alert.alert("Hata", String(msg));
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

      await axios.post(
        `${BASE_URL}/employee/assignments/${assignmentId}/start`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert("Başarılı", "İş başlatıldı.");
      fetchDetail();
    } catch (e: any) {
      const msg = e?.response?.data?.detail || e?.message || "Başlatılamadı.";
      Alert.alert("Hata", String(msg));
    } finally {
      setStarting(false);
    }
  };

  const pickSolutionImages = async () => {
    try {
      const result: any = await launchImageLibrary({
        mediaType: "photo",
        quality: 1,
        selectionLimit: 0,
      });

      if (!result || result.didCancel) return;

      if (result.assets && result.assets.length > 0) {
        setSelectedSolutionImages((prev) => [...prev, ...result.assets]);
      }
    } catch (error) {
      Alert.alert("Hata", "Fotoğraf seçerken bir hata oluştu.");
    }
  };

  const uploadSolutionPhotos = async () => {
    if (selectedSolutionImages.length === 0) {
      Alert.alert("Uyarı", "Önce fotoğraf seç.");
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

      const res = await axios.post(
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
        .filter(Boolean);

      setSolutionUrls(urls);
      setSelectedSolutionImages([]);

      Alert.alert("Başarılı", "Çözüm fotoğrafları yüklendi.");
      fetchDetail();
    } catch (e: any) {
      const msg = e?.response?.data?.detail || e?.message || "Foto yüklenemedi.";
      Alert.alert("Hata", String(msg));
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </View>
    );
  }

  if (!item) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>Kayıt bulunamadı.</Text>
      </View>
    );
  }

  const complaintFirstPhoto =
    item?.photos && item.photos.length > 0
      ? resolvePhoto(item.photos[0]?.photo_url)
      : null;

 
  const heroPhoto = solutionUrls.length > 0 ? solutionUrls[0] : complaintFirstPhoto;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
      {heroPhoto ? (
        <Image source={{ uri: heroPhoto }} style={styles.heroImage} />
      ) : (
        <View style={styles.noPhotoBox}>
          <Text style={styles.noPhotoText}>Foto yok</Text>
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.title}>{item.title || `Şikayet #${item.id}`}</Text>
        {!!item.description && <Text style={styles.desc}>{item.description}</Text>}

        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Durum: {item.status || "-"}</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>ID: {item.id}</Text>
          </View>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.actionBtn, starting ? styles.actionBtnDisabled : null]}
            onPress={startJob}
            disabled={starting}
            activeOpacity={0.9}
          >
            <Text style={styles.actionBtnText}>
              {starting ? "Başlatılıyor..." : "İşi Başlat"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.actionBtn, uploading ? styles.actionBtnDisabled : null]}
            onPress={pickSolutionImages}
            disabled={uploading}
            activeOpacity={0.9}
          >
            <Text style={styles.actionBtnText}>+ Çözüm Foto Seç</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionBtn,
              uploading || selectedSolutionImages.length === 0 ? styles.actionBtnDisabled : null,
            ]}
            onPress={uploadSolutionPhotos}
            disabled={uploading || selectedSolutionImages.length === 0}
            activeOpacity={0.9}
          >
            <Text style={styles.actionBtnText}>
              {uploading ? "Yükleniyor..." : "Seçilenleri Yükle"}
            </Text>
          </TouchableOpacity>
        </View>

        {selectedSolutionImages.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.previewRow}>
            {selectedSolutionImages.map((img, index) => (
              <Image
                key={img.uri || index}
                source={{ uri: img.uri }}
                style={styles.previewImage}
              />
            ))}
          </ScrollView>
        )}

        {solutionUrls.length > 0 && (
          <View style={{ marginTop: 12 }}>
            <Text style={styles.sectionTitle}>Yüklenen Çözüm Fotoğrafları</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.previewRow}>
              {solutionUrls.map((u, i) => (
                <Image key={u + i} source={{ uri: u }} style={styles.previewImage} />
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
