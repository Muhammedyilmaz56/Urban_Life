import React, { useCallback, useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  ScrollView,
  TextInput,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "react-native-image-picker";

import styles from "../../styles/AdminProfileStyles";
import {
  getCurrentUser,
  updateProfile,
  changePassword,
  uploadAvatar,
  requestEmailChange,
  confirmEmailChange,
} from "../../api/user";
import { AuthContext } from "../../../App";

export default function AdminProfileScreen() {
  const auth = useContext(AuthContext);
  const setUser = auth?.setUser;

  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<any>(null);

  // profile
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  // password
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");

  // email
  const [newEmail, setNewEmail] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [emailStep, setEmailStep] = useState<"idle" | "code">("idle");

  const load = useCallback(async () => {
    try {
      const data = await getCurrentUser();
      setMe(data);
      setFullName(data.full_name || data.name || "");
      setPhone(data.phone_number || "");
    } catch {
      Alert.alert("Hata", "Profil bilgileri alınamadı.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onSaveProfile = async () => {
    try {
      await updateProfile({
        full_name: fullName,
        phone_number: phone,
      });
      Alert.alert("Başarılı", "Profil güncellendi.");
      load();
    } catch {
      Alert.alert("Hata", "Profil güncellenemedi.");
    }
  };

  const onChangePassword = async () => {
    if (!currentPw || !newPw) {
      Alert.alert("Uyarı", "Şifre alanları boş olamaz.");
      return;
    }
    try {
      await changePassword({
        current_password: currentPw,
        new_password: newPw,
      });
      setCurrentPw("");
      setNewPw("");
      Alert.alert("Başarılı", "Şifre değiştirildi.");
    } catch {
      Alert.alert("Hata", "Şifre değiştirilemedi.");
    }
  };

  const onPickAvatar = async () => {
    ImagePicker.launchImageLibrary(
      { mediaType: "photo", quality: 0.8 },
      async (res) => {
        if (res.didCancel || !res.assets?.[0]?.uri) return;
        try {
          await uploadAvatar(res.assets[0].uri);
          Alert.alert("Başarılı", "Profil fotoğrafı güncellendi.");
          load();
        } catch {
          Alert.alert("Hata", "Fotoğraf yüklenemedi.");
        }
      }
    );
  };

  const onRequestEmailChange = async () => {
    if (!newEmail) return;
    try {
      await requestEmailChange(newEmail);
      setEmailStep("code");
      Alert.alert("Kod Gönderildi", "E-postana doğrulama kodu gönderildi.");
    } catch {
      Alert.alert("Hata", "E-posta değişikliği başlatılamadı.");
    }
  };

  const onConfirmEmailChange = async () => {
    try {
      await confirmEmailChange(emailCode);
      setEmailStep("idle");
      setNewEmail("");
      setEmailCode("");
      Alert.alert("Başarılı", "E-posta güncellendi.");
      load();
    } catch {
      Alert.alert("Hata", "Kod doğrulanamadı.");
    }
  };

  const logout = async () => {
    Alert.alert("Çıkış", "Çıkış yapmak istiyor musun?", [
      { text: "Vazgeç", style: "cancel" },
      {
        text: "Çıkış Yap",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("accessToken");
          await AsyncStorage.removeItem("current_user");
          setUser?.(null);
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Profil</Text>

      {/* AVATAR */}
      <TouchableOpacity style={styles.avatarBox} onPress={onPickAvatar}>
        {me.avatar_url ? (
          <Image source={{ uri: me.avatar_url }} style={styles.avatar} />
        ) : (
          <Text>Fotoğraf Seç</Text>
        )}
      </TouchableOpacity>

      {/* PROFILE */}
      <View style={styles.card}>
        <TextInput
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
          placeholder="Ad Soyad"
        />
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="Telefon"
        />
        <TouchableOpacity style={styles.btn} onPress={onSaveProfile}>
          <Text style={styles.btnText}>Profili Güncelle</Text>
        </TouchableOpacity>
      </View>

      {/* PASSWORD */}
      <View style={styles.card}>
        <TextInput
          style={styles.input}
          value={currentPw}
          onChangeText={setCurrentPw}
          placeholder="Mevcut Şifre"
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          value={newPw}
          onChangeText={setNewPw}
          placeholder="Yeni Şifre"
          secureTextEntry
        />
        <TouchableOpacity style={styles.btn} onPress={onChangePassword}>
          <Text style={styles.btnText}>Şifre Değiştir</Text>
        </TouchableOpacity>
      </View>

      {/* EMAIL */}
      <View style={styles.card}>
        {emailStep === "idle" ? (
          <>
            <TextInput
              style={styles.input}
              value={newEmail}
              onChangeText={setNewEmail}
              placeholder="Yeni E-posta"
            />
            <TouchableOpacity style={styles.btn} onPress={onRequestEmailChange}>
              <Text style={styles.btnText}>E-posta Değiştir</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TextInput
              style={styles.input}
              value={emailCode}
              onChangeText={setEmailCode}
              placeholder="Doğrulama Kodu"
            />
            <TouchableOpacity style={styles.btn} onPress={onConfirmEmailChange}>
              <Text style={styles.btnText}>Kodu Onayla</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <TouchableOpacity style={[styles.btn, styles.logout]} onPress={logout}>
        <Text style={styles.btnText}>Çıkış Yap</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
