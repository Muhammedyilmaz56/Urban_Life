import React, { useCallback, useEffect, useState, useContext, useLayoutEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  ScrollView,
  TextInput,
  Image,
  StatusBar,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "react-native-image-picker";
import { useNavigation } from "@react-navigation/native";

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
import { BASE_URL } from "../../config";

const resolveAvatar = (avatar_url?: string | null) => {
  if (!avatar_url) return null;
  const url = avatar_url.startsWith("http") ? avatar_url : `${BASE_URL}${avatar_url}`;
  return `${url}${url.includes("?") ? "&" : "?"}cacheBust=${Date.now()}`;
};

export default function AdminProfileScreen() {
  const navigation = useNavigation<any>();
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

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [savingEmail, setSavingEmail] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const load = useCallback(async () => {
    try {
      setLoading(true);
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
    const fn = fullName.trim();
    const ph = phone.trim();

    if (!fn) {
      Alert.alert("Uyarı", "Ad Soyad boş olamaz.");
      return;
    }

    try {
      setSavingProfile(true);
      await updateProfile({
        full_name: fn,
        phone_number: ph,
      });
      Alert.alert("Başarılı", "Profil güncellendi.");
      await load();
    } catch {
      Alert.alert("Hata", "Profil güncellenemedi.");
    } finally {
      setSavingProfile(false);
    }
  };

  const onChangePassword = async () => {
    if (!currentPw || !newPw) {
      Alert.alert("Uyarı", "Şifre alanları boş olamaz.");
      return;
    }
    if (newPw.length < 6) {
      Alert.alert("Uyarı", "Yeni şifre en az 6 karakter olmalı.");
      return;
    }
    try {
      setSavingPassword(true);
      await changePassword({
        current_password: currentPw,
        new_password: newPw,
      });
      setCurrentPw("");
      setNewPw("");
      Alert.alert("Başarılı", "Şifre değiştirildi.");
    } catch {
      Alert.alert("Hata", "Şifre değiştirilemedi.");
    } finally {
      setSavingPassword(false);
    }
  };

  const onPickAvatar = async () => {
    ImagePicker.launchImageLibrary({ mediaType: "photo", quality: 0.8 }, async (res) => {
      if (res.didCancel || !res.assets?.[0]?.uri) return;

      try {
        await uploadAvatar(res.assets[0].uri);
        Alert.alert("Başarılı", "Profil fotoğrafı güncellendi.");
        await load();
      } catch {
        Alert.alert("Hata", "Fotoğraf yüklenemedi.");
      }
    });
  };

  const onRequestEmailChange = async () => {
    const em = newEmail.trim().toLowerCase();
    if (!em) return;

    if (!em.includes("@") || !em.includes(".")) {
      Alert.alert("Uyarı", "Geçerli bir e-posta gir.");
      return;
    }

    try {
      setSavingEmail(true);
      await requestEmailChange(em);
      setEmailStep("code");
      Alert.alert("Kod Gönderildi", "E-postana doğrulama kodu gönderildi.");
    } catch {
      Alert.alert("Hata", "E-posta değişikliği başlatılamadı.");
    } finally {
      setSavingEmail(false);
    }
  };

  const onConfirmEmailChange = async () => {
    const code = emailCode.trim();
    if (!code) {
      Alert.alert("Uyarı", "Kod boş olamaz.");
      return;
    }

    try {
      setSavingEmail(true);
      await confirmEmailChange(code);
      setEmailStep("idle");
      setNewEmail("");
      setEmailCode("");
      Alert.alert("Başarılı", "E-posta güncellendi.");
      await load();
    } catch {
      Alert.alert("Hata", "Kod doğrulanamadı.");
    } finally {
      setSavingEmail(false);
    }
  };

  const logout = async () => {
    Alert.alert("Çıkış", "Çıkış yapmak istiyor musun?", [
      { text: "Vazgeç", style: "cancel" },
      {
        text: "Çıkış Yap",
        style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.removeItem("accessToken");
            await AsyncStorage.removeItem("current_user");
          } finally {
            setUser?.(null);
          }
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

  const avatarUrl = resolveAvatar(me?.avatar_url);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B3A6A" />

      {/* TOP BAR */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backTxt}>‹</Text>
        </TouchableOpacity>

        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={styles.title}>Profil / Ayarlar</Text>
          <Text style={styles.subtitle}>Şifre · Foto · E-posta · Çıkış</Text>
        </View>

        <TouchableOpacity style={styles.logoutTopBtn} onPress={logout} activeOpacity={0.9}>
          <Text style={styles.logoutTopTxt}>Çıkış</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* AVATAR */}
        <TouchableOpacity style={styles.avatarBox} onPress={onPickAvatar} activeOpacity={0.9}>
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarPlaceholderTxt}>Fotoğraf Seç</Text>
            </View>
          )}
          <Text style={styles.avatarHint}>Fotoğrafı değiştirmek için dokun</Text>
        </TouchableOpacity>

        {/* PROFILE */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Profil Bilgileri</Text>

          <Text style={styles.label}>Ad Soyad</Text>
          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            placeholder="Ad Soyad"
            placeholderTextColor="rgba(100,116,139,0.85)"
          />

          <Text style={styles.label}>Telefon</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="Telefon"
            placeholderTextColor="rgba(100,116,139,0.85)"
            keyboardType={Platform.OS === "ios" ? "number-pad" : "phone-pad"}
          />

          <TouchableOpacity
            style={[styles.primaryBtn, savingProfile && { opacity: 0.7 }]}
            onPress={onSaveProfile}
            disabled={savingProfile}
            activeOpacity={0.9}
          >
            {savingProfile ? <ActivityIndicator /> : <Text style={styles.primaryBtnTxt}>Profili Güncelle</Text>}
          </TouchableOpacity>
        </View>

        {/* PASSWORD */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Şifre</Text>

          <Text style={styles.label}>Mevcut Şifre</Text>
          <TextInput
            style={styles.input}
            value={currentPw}
            onChangeText={setCurrentPw}
            placeholder="Mevcut Şifre"
            placeholderTextColor="rgba(100,116,139,0.85)"
            secureTextEntry
          />

          <Text style={styles.label}>Yeni Şifre</Text>
          <TextInput
            style={styles.input}
            value={newPw}
            onChangeText={setNewPw}
            placeholder="Yeni Şifre (en az 6)"
            placeholderTextColor="rgba(100,116,139,0.85)"
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.primaryBtn, savingPassword && { opacity: 0.7 }]}
            onPress={onChangePassword}
            disabled={savingPassword}
            activeOpacity={0.9}
          >
            {savingPassword ? <ActivityIndicator /> : <Text style={styles.primaryBtnTxt}>Şifre Değiştir</Text>}
          </TouchableOpacity>
        </View>

        {/* EMAIL */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>E-posta</Text>

          {emailStep === "idle" ? (
            <>
              <Text style={styles.label}>Yeni E-posta</Text>
              <TextInput
                style={styles.input}
                value={newEmail}
                onChangeText={setNewEmail}
                placeholder="Yeni E-posta"
                placeholderTextColor="rgba(100,116,139,0.85)"
                autoCapitalize="none"
                keyboardType="email-address"
              />

              <TouchableOpacity
                style={[styles.primaryBtn, savingEmail && { opacity: 0.7 }]}
                onPress={onRequestEmailChange}
                disabled={savingEmail}
                activeOpacity={0.9}
              >
                {savingEmail ? <ActivityIndicator /> : <Text style={styles.primaryBtnTxt}>Kod Gönder</Text>}
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.label}>Doğrulama Kodu</Text>
              <TextInput
                style={styles.input}
                value={emailCode}
                onChangeText={setEmailCode}
                placeholder="Doğrulama Kodu"
                placeholderTextColor="rgba(100,116,139,0.85)"
              />

              <View style={{ flexDirection: "row", gap: 10 }}>
                <TouchableOpacity
                  style={[styles.primaryBtn, { flex: 1 }, savingEmail && { opacity: 0.7 }]}
                  onPress={onConfirmEmailChange}
                  disabled={savingEmail}
                  activeOpacity={0.9}
                >
                  {savingEmail ? <ActivityIndicator /> : <Text style={styles.primaryBtnTxt}>Kodu Onayla</Text>}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.secondaryBtn, { width: 110 }]}
                  onPress={() => {
                    setEmailStep("idle");
                    setEmailCode("");
                  }}
                  activeOpacity={0.9}
                >
                  <Text style={styles.secondaryBtnTxt}>Vazgeç</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

        {/* ALT ÇIKIŞ */}
        <TouchableOpacity style={styles.dangerBtn} onPress={logout} activeOpacity={0.9}>
          <Text style={styles.dangerBtnTxt}>Çıkış Yap</Text>
        </TouchableOpacity>

        <View style={{ height: 50 }} />
      </ScrollView>
    </View>
  );
}
