import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Alert,
  Switch,
  TouchableOpacity,
  Image,
  PermissionsAndroid,
  Platform,
  Linking,
} from "react-native";

import MapView, { Marker, MapPressEvent, Region } from "react-native-maps";
import { launchImageLibrary } from "react-native-image-picker";

import { createComplaint, uploadComplaintPhotos } from "../../api/complaints";

import { CreateComplaintDto } from "../../types";

const CreateComplaintScreen = () => {
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
            "Haritada bulunduğun yere otomatik gitmek için konum izni vermen ve telefonu konum açık kullanman gerekiyor.",
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

    console.log("Canlı konum:", coord);

   
    if (!hasCenteredOnUser.current) {
      hasCenteredOnUser.current = true;

      const region: Region = {
        latitude: coord.latitude,
        longitude: coord.longitude,
        latitudeDelta: 0.0009,
        longitudeDelta: 0.0009,
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
      console.log("Image pick error:", error);
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
  
      Alert.alert("Başarılı", `Şikayet oluşturuldu (ID: ${res.id})`);
  
      setTitle("");
      setDescription("");
      setCategoryId("1");
      setPickedLocation(null);
      setSelectedImages([]);
      setIsAnonymous(false);
    } catch (err: any) {
      console.log("Şikayet oluşturma hatası:", err?.response?.data || err);
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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.header}>Yeni Şikayet</Text>

      {/* BAŞLIK */}
      <View style={styles.card}>
        <Text style={styles.label}>Başlık</Text>
        <TextInput
          style={styles.input}
          placeholder="Örn: Sokak lambası yanmıyor"
          value={title}
          onChangeText={setTitle}
        />
      </View>

      {/* AÇIKLAMA */}
      <View style={styles.card}>
        <Text style={styles.label}>Açıklama</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Şikayetinizi detaylı açıklayın..."
          value={description}
          onChangeText={setDescription}
          multiline
        />
      </View>

      {/* KATEGORİ */}
      <View style={styles.card}>
        <Text style={styles.label}>Kategori (geçici)</Text>
        <TextInput
          style={styles.input}
          value={categoryId}
          onChangeText={setCategoryId}
          keyboardType="numeric"
        />
      </View>

      {/* HARİTA */}
      <View style={styles.card}>
        <Text style={styles.label}>Konum Seç (Haritaya Dokunun)</Text>

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

      
      <View style={styles.card}>
        <Text style={styles.label}>Fotoğraflar (İstediğin kadar)</Text>

        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>Fotoğraf Ekle</Text>
        </TouchableOpacity>

        {selectedImages.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.previewRow}
          >
            {selectedImages.map((img, index) => (
              <Image
                key={img.uri || index}
                source={{ uri: img.uri }}
                style={styles.preview}
              />
            ))}
          </ScrollView>
        )}
      </View>


      <View style={styles.cardRow}>
        <Text style={styles.label}>İsmim gizlensin</Text>
        <Switch value={isAnonymous} onValueChange={setIsAnonymous} />
      </View>

 
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Şikayet Oluştur</Text>
      </TouchableOpacity>

      <View style={{ height: 50 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 14,
    backgroundColor: "#f6f6f6",
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
    marginLeft: 4,
  },
  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  cardRow: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 6,
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#fafafa",
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  map: {
    width: "100%",
    height: 250,
    borderRadius: 12,
    marginTop: 10,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  previewRow: {
    marginTop: 10,
  },
  preview: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginRight: 8,
  },
  submitButton: {
    backgroundColor: "#28a745",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 4,
  },
  submitText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
  },
});

export default CreateComplaintScreen;
