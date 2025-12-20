import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Alert,
  Switch,
  TouchableOpacity,
  Image,
  PermissionsAndroid,
  Platform,
  Linking,
  StatusBar,
  Modal,
  ActivityIndicator,
  FlatList,
} from "react-native";

import MapView, { Marker, MapPressEvent, Region } from "react-native-maps";
import { launchImageLibrary } from "react-native-image-picker";
import { createComplaint, uploadComplaintPhotos } from "../../../api/complaints";
import { CreateComplaintDto } from "../../../types";
import styles from "../../../styles/CreateComplaintStyles";
import { fetchCategories } from "../../../api/categories";

type Category = { id: number; name: string };

const CreateComplaintScreen = ({ navigation }: any) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [pickedLocation, setPickedLocation] = useState<any>(null);
  const [selectedImages, setSelectedImages] = useState<any[]>([]);
  const [isAnonymous, setIsAnonymous] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  // Hata state'leri
  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [locationError, setLocationError] = useState("");

  const mapRef = useRef<MapView | null>(null);
  const hasCenteredOnUser = useRef(false);

  const selectedCategory = categories.find((c) => String(c.id) === String(categoryId));

  const loadCategories = async () => {
    try {
      setCategoriesLoading(true);
      const data = await fetchCategories();
      setCategories(data);
      if (data.length > 0 && !categoryId) {
        setCategoryId(String(data[0].id));
      }
    } catch (e: any) {
      // Sessiz hata
      console.log("Kategori hatası:", e?.response?.data?.detail);
    } finally {
      setCategoriesLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    (async () => {
      if (Platform.OS === "android") {
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );

        if (result !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert(
            "Konum izni gerekli",
            "Haritada bulunduğun konuma otomatik gitmek için konum izni vermen gerekiyor.",
            [
              { text: "Vazgeç", style: "cancel" },
              { text: "Ayarları aç", onPress: () => Linking.openSettings() },
            ]
          );
        }
      }
    })();
  }, []);

  const handleMapPress = (e: MapPressEvent) => {
    const coord = e.nativeEvent.coordinate;
    setPickedLocation(coord);
    setLocationError("");
  };

  const handleUserLocationChange = (e: any) => {
    const coord = e?.nativeEvent?.coordinate;
    if (!coord) return;

    if (!hasCenteredOnUser.current) {
      hasCenteredOnUser.current = true;
      const region: Region = {
        latitude: coord.latitude,
        longitude: coord.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };
      mapRef.current?.animateToRegion(region, 800);
      setPickedLocation(coord);
      setLocationError("");
    }
  };

  const pickImage = async () => {
    try {
      const result: any = await launchImageLibrary({
        mediaType: "photo",
        quality: 1,
        selectionLimit: 0,
      });

      if (!result || result.didCancel) return;

      if (result.assets && result.assets.length > 0) {
        setSelectedImages((prev) => [...prev, ...result.assets]);
      }
    } catch (error) {
      console.log("Fotoğraf seçme hatası:", error);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const clearErrors = () => {
    setTitleError("");
    setDescriptionError("");
    setCategoryError("");
    setLocationError("");
  };

  const handleSubmit = async () => {
    if (submitting) return;

    clearErrors();
    let hasError = false;

    if (!title.trim()) {
      setTitleError("Başlık zorunludur.");
      hasError = true;
    }
    if (!description.trim()) {
      setDescriptionError("Açıklama zorunludur.");
      hasError = true;
    }
    if (!categoryId) {
      setCategoryError("Kategori seçmelisiniz.");
      hasError = true;
    }
    if (!pickedLocation) {
      setLocationError("Haritadan konum seçmelisiniz.");
      hasError = true;
    }

    if (hasError) return;

    const payload: CreateComplaintDto = {
      title: title.trim(),
      description: description.trim(),
      category_id: Number(categoryId),
      latitude: pickedLocation.latitude,
      longitude: pickedLocation.longitude,
      is_anonymous: isAnonymous,
    };

    try {
      setSubmitting(true);

      const res = await createComplaint(payload);

      if (selectedImages.length > 0) {
        await uploadComplaintPhotos(res.id, selectedImages);
      }

      Alert.alert("Başarılı", "Şikayet kaydınız oluşturuldu.", [
        { text: "Tamam", onPress: () => navigation.goBack() },
      ]);

      setTitle("");
      setDescription("");
      setPickedLocation(null);
      setSelectedImages([]);
      setIsAnonymous(false);
    } catch (err: any) {
      Alert.alert("Hata", err?.response?.data?.detail || "Şikayet oluşturulamadı.");
    } finally {
      setSubmitting(false);
    }
  };

  const initialRegion: Region = {
    latitude: 41.01,
    longitude: 28.97,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  // Hata stili
  const errorStyle = {
    color: "#EF4444",
    fontSize: 12,
    fontWeight: "600" as const,
    marginTop: 6,
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B3A6A" />

      {/* TOP BAR */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.85}>
          <Text style={styles.backButtonIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Yeni Şikayet</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {/* INFO */}
        <View style={styles.infoBanner}>
          <Text style={styles.infoTitle}>Bilgilendirme</Text>
          <Text style={styles.infoText}>
            Lütfen şikayet başlığı ve açıklamasını net yazın. Konumu haritadan işaretleyin ve gerekiyorsa fotoğraf ekleyin.
          </Text>
        </View>

        {/* TITLE */}
        <View style={styles.card}>
          <Text style={styles.label}>Başlık</Text>
          <TextInput
            style={[styles.input, titleError ? { borderColor: "#EF4444", borderWidth: 1 } : {}]}
            placeholder="Örn: Yolda çukur var"
            placeholderTextColor="#94A3B8"
            value={title}
            onChangeText={(val) => {
              setTitle(val);
              setTitleError("");
            }}
          />
          {titleError !== "" && <Text style={errorStyle}>{titleError}</Text>}
        </View>

        {/* DESC */}
        <View style={styles.card}>
          <Text style={styles.label}>Açıklama</Text>
          <TextInput
            style={[styles.input, styles.textArea, descriptionError ? { borderColor: "#EF4444", borderWidth: 1 } : {}]}
            placeholder="Detaylı açıklama yazınız..."
            placeholderTextColor="#94A3B8"
            value={description}
            onChangeText={(val) => {
              setDescription(val);
              setDescriptionError("");
            }}
            multiline
          />
          {descriptionError !== "" && <Text style={errorStyle}>{descriptionError}</Text>}
        </View>

        {/* CATEGORY */}
        <View style={styles.card}>
          <Text style={styles.label}>Kategori</Text>

          <TouchableOpacity
            style={[styles.selectButton, categoryError ? { borderColor: "#EF4444", borderWidth: 1 } : {}]}
            onPress={() => {
              setCategoryModalVisible(true);
              setCategoryError("");
            }}
            activeOpacity={0.85}
          >
            <Text style={styles.selectButtonText} numberOfLines={1}>
              {selectedCategory?.name || (categoriesLoading ? "Yükleniyor..." : "Kategori seçiniz")}
            </Text>
            <Text style={styles.selectChevron}>›</Text>
          </TouchableOpacity>

          {categoryError !== "" && <Text style={errorStyle}>{categoryError}</Text>}

          <Text style={styles.helperText}>
            Doğru kategori seçimi, şikayetinizin ilgili birime daha hızlı yönlendirilmesini sağlar.
          </Text>
        </View>

        {/* MAP */}
        <View style={styles.card}>
          <Text style={styles.label}>Konum</Text>
          <View style={[styles.mapContainer, locationError ? { borderColor: "#EF4444", borderWidth: 2 } : {}]}>
            <MapView
              ref={mapRef}
              style={styles.map}
              initialRegion={initialRegion}
              onPress={handleMapPress}
              showsUserLocation={true}
              showsMyLocationButton={true}
              onUserLocationChange={handleUserLocationChange}
            >
              {pickedLocation && <Marker coordinate={pickedLocation} />}
            </MapView>
          </View>

          {locationError !== "" ? (
            <Text style={errorStyle}>{locationError}</Text>
          ) : (
            <Text style={styles.mapHint}>
              {pickedLocation ? "Konum seçildi." : "Konum seçmek için haritaya dokunun."}
            </Text>
          )}
        </View>

        {/* PHOTOS */}
        <View style={styles.card}>
          <Text style={styles.label}>Fotoğraflar</Text>

          <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage} activeOpacity={0.9}>
            <Text style={styles.imagePickerText}>+ Fotoğraf Ekle</Text>
          </TouchableOpacity>

          {selectedImages.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.previewRow}>
              {selectedImages.map((img, index) => (
                <View key={img.uri || String(index)} style={styles.previewWrap}>
                  <Image source={{ uri: img.uri }} style={styles.previewImage} />
                  <TouchableOpacity style={styles.removeImageBtn} onPress={() => removeImage(index)} activeOpacity={0.9}>
                    <Text style={styles.removeImageText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}

          <Text style={styles.helperText}>Fotoğraf eklemek zorunlu değildir. Birden fazla fotoğraf ekleyebilirsiniz.</Text>
        </View>

        {/* ANON */}
        <View style={styles.card}>
          <View style={styles.switchRow}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={styles.switchLabel}>İsim gizlensin</Text>
              <Text style={styles.helperText}>
                Açık olduğunda şikayetiniz diğer kullanıcılara anonim görünebilir.
              </Text>
            </View>
            <Switch
              value={isAnonymous}
              onValueChange={setIsAnonymous}
              trackColor={{ false: "#CBD5E1", true: "#93C5FD" }}
              thumbColor={"#FFFFFF"}
            />
          </View>
        </View>

        {/* SUBMIT */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} activeOpacity={0.9} disabled={submitting}>
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>ŞİKAYETİ GÖNDER</Text>
          )}
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* CATEGORY MODAL */}
      <Modal
        visible={categoryModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCategoryModalVisible(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setCategoryModalVisible(false)}
          style={styles.modalOverlay}
        >
          <TouchableOpacity activeOpacity={1} onPress={() => { }} style={styles.modalCard}>
            <Text style={styles.modalTitle}>Kategori Seç</Text>

            {categoriesLoading ? (
              <View style={styles.modalLoading}>
                <ActivityIndicator />
                <Text style={styles.modalLoadingText}>Kategoriler yükleniyor...</Text>
              </View>
            ) : (
              <FlatList
                data={categories}
                keyExtractor={(it) => String(it.id)}
                style={styles.modalList}
                renderItem={({ item }) => {
                  const selected = String(item.id) === String(categoryId);
                  return (
                    <TouchableOpacity
                      style={[styles.modalItem, selected && styles.modalItemSelected]}
                      onPress={() => {
                        setCategoryId(String(item.id));
                        setCategoryModalVisible(false);
                        setCategoryError("");
                      }}
                      activeOpacity={0.85}
                    >
                      <Text style={[styles.modalItemText, selected && styles.modalItemTextSelected]}>
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
                ListEmptyComponent={<Text style={styles.modalEmpty}>Kategori bulunamadı.</Text>}
              />
            )}

            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setCategoryModalVisible(false)} activeOpacity={0.9}>
              <Text style={styles.modalCloseText}>Kapat</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default CreateComplaintScreen;

