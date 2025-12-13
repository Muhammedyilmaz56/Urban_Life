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
  ImageBackground,
  StatusBar,
} from "react-native";

import MapView, { Marker, MapPressEvent, Region } from "react-native-maps";
import { launchImageLibrary } from "react-native-image-picker";
import { createComplaint, uploadComplaintPhotos } from "../../../api/complaints";
import { CreateComplaintDto } from "../../../types";
import CreateComplaintStyles from "../../../styles/CreateComplaintStyles";

const BG_IMAGE = "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=2070&auto=format&fit=crop";

const CreateComplaintScreen = ({ navigation }: any) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("1");
  const [pickedLocation, setPickedLocation] = useState<any>(null);
  const [selectedImages, setSelectedImages] = useState<any[]>([]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const mapRef = useRef<MapView | null>(null);
  const hasCenteredOnUser = useRef(false);

  useEffect(() => {
    (async () => {
      if (Platform.OS === "android") {
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );

        if (result !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert(
            "Konum izni gerekli",
            "Haritada bulunduğun yere otomatik gitmek için konum izni vermen gerekiyor.",
            [
              { text: "Vazgeç", style: "cancel" },
              {
                text: "Ayarları aç",
                onPress: () => {
                  Linking.openSettings();
                },
              },
            ]
          );
        }
      }
    })();
  }, []);

  const handleMapPress = (e: MapPressEvent) => {
    const coord = e.nativeEvent.coordinate;
    setPickedLocation(coord);
  };

  const handleUserLocationChange = (e: any) => {
    const coord = e.nativeEvent.coordinate;
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
    }
  };

  const pickImage = async () => {
    try {
      const result: any = await launchImageLibrary({
        mediaType: "photo",
        quality: 1,
        selectionLimit: 0,
      });

      if (!result || result.didCancel) {
        return;
      }

      if (result.assets && result.assets.length > 0) {
        setSelectedImages((prev) => [...prev, ...result.assets]);
      }
    } catch (error) {
      Alert.alert("Hata", "Fotoğraf seçerken bir hata oluştu.");
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) return Alert.alert("Hata", "Başlık zorunludur.");
    if (!description.trim()) return Alert.alert("Hata", "Açıklama zorunludur.");
    if (!pickedLocation)
      return Alert.alert("Hata", "Haritadan konum seçmelisiniz.");

    const payload: CreateComplaintDto = {
      title,
      description,
      category_id: Number(categoryId),
      latitude: pickedLocation.latitude,
      longitude: pickedLocation.longitude,
      is_anonymous: isAnonymous,
    };

    try {
      const res = await createComplaint(payload);

      if (selectedImages.length > 0) {
        await uploadComplaintPhotos(res.id, selectedImages);
      }

      Alert.alert("Başarılı", "Şikayetiniz oluşturuldu!", [
        { text: "Tamam", onPress: () => navigation.goBack() }
      ]);

      setTitle("");
      setDescription("");
      setCategoryId("1");
      setPickedLocation(null);
      setSelectedImages([]);
      setIsAnonymous(false);
    } catch (err: any) {
      Alert.alert(
        "Hata",
        err?.response?.data?.detail || "Şikayet oluşturulamadı"
      );
    }
  };

  const initialRegion: Region = {
    latitude: 41.01,
    longitude: 28.97,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  return (
    <View style={CreateComplaintStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ImageBackground
        source={{ uri: BG_IMAGE }}
        style={CreateComplaintStyles.backgroundImage}
        resizeMode="cover"
      >
        <View style={CreateComplaintStyles.overlay}>
          <View style={CreateComplaintStyles.header}>
            <TouchableOpacity
              style={CreateComplaintStyles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={CreateComplaintStyles.backButtonIcon}>‹</Text>
            </TouchableOpacity>
            <Text style={CreateComplaintStyles.headerTitle}>Yeni Şikayet</Text>
          </View>

          <ScrollView
            contentContainerStyle={CreateComplaintStyles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={CreateComplaintStyles.card}>
              <Text style={CreateComplaintStyles.label}>Başlık</Text>
              <TextInput
                style={CreateComplaintStyles.input}
                placeholder="Örn: Çukur var"
                placeholderTextColor="#999"
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <View style={CreateComplaintStyles.card}>
              <Text style={CreateComplaintStyles.label}>Açıklama</Text>
              <TextInput
                style={[CreateComplaintStyles.input, CreateComplaintStyles.textArea]}
                placeholder="Detaylı açıklama yazınız..."
                placeholderTextColor="#999"
                value={description}
                onChangeText={setDescription}
                multiline
              />
            </View>

            <View style={CreateComplaintStyles.card}>
              <Text style={CreateComplaintStyles.label}>Konum</Text>
              <View style={CreateComplaintStyles.mapContainer}>
                <MapView
                  ref={mapRef}
                  style={CreateComplaintStyles.map}
                  initialRegion={initialRegion}
                  onPress={handleMapPress}
                  showsUserLocation={true}
                  showsMyLocationButton={true}
                  onUserLocationChange={handleUserLocationChange}
                >
                  {pickedLocation && <Marker coordinate={pickedLocation} />}
                </MapView>
              </View>
              <Text style={CreateComplaintStyles.mapHint}>
                {pickedLocation ? "Konum seçildi" : "Konum seçmek için haritaya dokunun"}
              </Text>
            </View>

            <View style={CreateComplaintStyles.card}>
              <Text style={CreateComplaintStyles.label}>Fotoğraflar</Text>
              <TouchableOpacity style={CreateComplaintStyles.imagePickerButton} onPress={pickImage}>
                <Text style={CreateComplaintStyles.imagePickerText}>+ Fotoğraf Ekle</Text>
              </TouchableOpacity>

              {selectedImages.length > 0 && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={CreateComplaintStyles.previewRow}>
                  {selectedImages.map((img, index) => (
                    <Image
                      key={img.uri || index}
                      source={{ uri: img.uri }}
                      style={CreateComplaintStyles.previewImage}
                    />
                  ))}
                </ScrollView>
              )}
            </View>

            <View style={CreateComplaintStyles.card}>
              <View style={CreateComplaintStyles.switchRow}>
                <Text style={CreateComplaintStyles.switchLabel}>İsmim Gizlensin</Text>
                <Switch
                  value={isAnonymous}
                  onValueChange={setIsAnonymous}
                  trackColor={{ false: "#767577", true: "#6C63FF" }}
                  thumbColor={isAnonymous ? "#fff" : "#f4f3f4"}
                />
              </View>
            </View>

            <TouchableOpacity style={CreateComplaintStyles.submitButton} onPress={handleSubmit}>
              <Text style={CreateComplaintStyles.submitButtonText}>ŞİKAYETİ GÖNDER</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </ImageBackground>
    </View>
  );
};

export default CreateComplaintScreen;