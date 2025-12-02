import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { createComplaint } from "../../api/complaints";
import { CreateComplaintDto } from "../../types";

const CreateComplaintScreen = () => {
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  const handleSubmit = async () => {
    if (!description.trim()) {
      Alert.alert("Hata", "Açıklama zorunludur");
      return;
    }

    const payload: CreateComplaintDto = {
      description,
      latitude: latitude ? parseFloat(latitude) : undefined,
      longitude: longitude ? parseFloat(longitude) : undefined,
      photo_url: photoUrl || undefined,
    };

    try {
      const res = await createComplaint(payload);
      Alert.alert("Başarılı", `Şikayet oluşturuldu. ID: ${res.id}`);
      setDescription("");
      setLatitude("");
      setLongitude("");
      setPhotoUrl("");
    } catch (err: any) {
      console.error(err);
      Alert.alert("Hata", "Şikayet oluşturulamadı");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Açıklama</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Şikayetinizi yazın..."
        multiline
      />

      <Text style={styles.label}>Enlem (opsiyonel)</Text>
      <TextInput
        style={styles.input}
        value={latitude}
        onChangeText={setLatitude}
        placeholder="41.0082"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Boylam (opsiyonel)</Text>
      <TextInput
        style={styles.input}
        value={longitude}
        onChangeText={setLongitude}
        placeholder="28.9784"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Fotoğraf URL (opsiyonel)</Text>
      <TextInput
        style={styles.input}
        value={photoUrl}
        onChangeText={setPhotoUrl}
        placeholder="http://..."
      />

      <Button title="Şikayet Oluştur" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  label: {
    marginTop: 12,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    marginTop: 4,
  },
});

export default CreateComplaintScreen;
