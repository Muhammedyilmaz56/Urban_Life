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
  KeyboardAvoidingView,
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

const resolveAvatar = (avatar_url?: string | null, refreshKey?: number) => {
  if (!avatar_url) return null;
  const url = avatar_url.startsWith("http") ? avatar_url : `${BASE_URL}${avatar_url}`;
  return refreshKey ? `${url}${url.includes("?") ? "&" : "?"}t=${refreshKey}` : url;
};

// API hatalarını Türkçe anlaşılır mesajlara çevir
const translateError = (error: any, defaultMsg: string): string => {
  const detail = error?.response?.data?.detail || error?.message || "";
  const detailLower = String(detail).toLowerCase();

  if (detailLower.includes("incorrect password") || detailLower.includes("wrong password") || detailLower.includes("current password")) {
    return "Mevcut şifreniz yanlış.";
  }
  if (detailLower.includes("password") && detailLower.includes("weak")) {
    return "Şifre çok zayıf. Daha güçlü bir şifre seçin.";
  }
  if (detailLower.includes("email") && (detailLower.includes("already") || detailLower.includes("exists") || detailLower.includes("registered"))) {
    return "Bu e-posta adresi zaten kayıtlı.";
  }
  if (detailLower.includes("code") && (detailLower.includes("invalid") || detailLower.includes("expired"))) {
    return "Doğrulama kodu geçersiz veya süresi dolmuş.";
  }
  if (detailLower.includes("unauthorized")) {
    return "Oturumunuz sonlanmış. Lütfen tekrar giriş yapın.";
  }

  return detail || defaultMsg;
};

export default function AdminProfileScreen() {
  const navigation = useNavigation<any>();
  const auth = useContext(AuthContext);
  const setUser = auth?.setUser;

  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<any>(null);
  const [avatarRefreshKey, setAvatarRefreshKey] = useState(0);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [emailStep, setEmailStep] = useState<"idle" | "code">("idle");

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [savingEmail, setSavingEmail] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setErrorMessage("");
    setTimeout(() => setSuccessMessage(""), 4000);
  };

  const showError = (msg: string) => {
    setErrorMessage(msg);
    setSuccessMessage("");
    setTimeout(() => setErrorMessage(""), 4000);
  };

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getCurrentUser();
      setMe(data);
      setFullName(data.full_name || data.name || "");
      setPhone(data.phone_number || "");
    } catch (err) {
      showError(translateError(err, "Profil bilgileri alınamadı."));
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
      showError("Ad Soyad boş olamaz.");
      return;
    }

    try {
      setSavingProfile(true);
      await updateProfile({ full_name: fn, phone_number: ph });
      showSuccess("Profil güncellendi.");
      await load();
    } catch (err) {
      showError(translateError(err, "Profil güncellenemedi."));
    } finally {
      setSavingProfile(false);
    }
  };

  const onChangePassword = async () => {
    if (!currentPw || !newPw) {
      showError("Şifre alanları boş olamaz.");
      return;
    }
    if (newPw.length < 6) {
      showError("Yeni şifre en az 6 karakter olmalı.");
      return;
    }
    try {
      setSavingPassword(true);
      await changePassword({ current_password: currentPw, new_password: newPw });
      setCurrentPw("");
      setNewPw("");
      showSuccess("Şifre değiştirildi.");
    } catch (err) {
      showError(translateError(err, "Şifre değiştirilemedi."));
    } finally {
      setSavingPassword(false);
    }
  };

  const onPickAvatar = async () => {
    ImagePicker.launchImageLibrary({ mediaType: "photo", quality: 0.8 }, async (res) => {
      if (res.didCancel || !res.assets?.[0]?.uri) return;

      try {
        const result = await uploadAvatar(res.assets[0].uri);
        setMe((prev: any) => ({ ...(prev || {}), avatar_url: result.avatar_url }));
        setAvatarRefreshKey(Date.now());
        showSuccess("Profil fotoğrafı güncellendi.");
      } catch (err) {
        showError(translateError(err, "Fotoğraf yüklenemedi."));
      }
    });
  };

  const onRequestEmailChange = async () => {
    const em = newEmail.trim().toLowerCase();
    if (!em) return;

    if (!em.includes("@") || !em.includes(".")) {
      showError("Geçerli bir e-posta gir.");
      return;
    }

    try {
      setSavingEmail(true);
      await requestEmailChange(em);
      setEmailStep("code");
      showSuccess("E-postana doğrulama kodu gönderildi.");
    } catch (err) {
      showError(translateError(err, "E-posta değişikliği başlatılamadı."));
    } finally {
      setSavingEmail(false);
    }
  };

  const onConfirmEmailChange = async () => {
    const code = emailCode.trim();
    if (!code) {
      showError("Kod boş olamaz.");
      return;
    }

    try {
      setSavingEmail(true);
      await confirmEmailChange(code);
      setEmailStep("idle");
      setNewEmail("");
      setEmailCode("");
      showSuccess("E-posta güncellendi.");
      await load();
    } catch (err) {
      showError(translateError(err, "Kod doğrulanamadı."));
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

  const avatarUrl = resolveAvatar(me?.avatar_url, avatarRefreshKey);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B3A6A" />

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

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.content, { paddingBottom: 60 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {successMessage !== "" && (
            <View style={{ backgroundColor: "#10B981", paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10, marginBottom: 16 }}>
              <Text style={{ color: "#fff", fontSize: 14, fontWeight: "600", textAlign: "center" }}>
                ✓ {successMessage}
              </Text>
            </View>
          )}

          {errorMessage !== "" && (
            <View style={{ backgroundColor: "#EF4444", paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10, marginBottom: 16 }}>
              <Text style={{ color: "#fff", fontSize: 14, fontWeight: "600", textAlign: "center" }}>
                ✕ {errorMessage}
              </Text>
            </View>
          )}

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

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Profil Bilgileri</Text>
            <Text style={styles.label}>Ad Soyad</Text>
            <TextInput style={styles.input} value={fullName} onChangeText={setFullName} placeholder="Ad Soyad" placeholderTextColor="rgba(100,116,139,0.85)" />
            <Text style={styles.label}>Telefon</Text>
            <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="Telefon" placeholderTextColor="rgba(100,116,139,0.85)" keyboardType={Platform.OS === "ios" ? "number-pad" : "phone-pad"} />
            <TouchableOpacity style={[styles.primaryBtn, savingProfile && { opacity: 0.7 }]} onPress={onSaveProfile} disabled={savingProfile} activeOpacity={0.9}>
              {savingProfile ? <ActivityIndicator /> : <Text style={styles.primaryBtnTxt}>Profili Güncelle</Text>}
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Şifre</Text>
            <Text style={styles.label}>Mevcut Şifre</Text>
            <TextInput style={styles.input} value={currentPw} onChangeText={setCurrentPw} placeholder="Mevcut Şifre" placeholderTextColor="rgba(100,116,139,0.85)" secureTextEntry />
            <Text style={styles.label}>Yeni Şifre</Text>
            <TextInput style={styles.input} value={newPw} onChangeText={setNewPw} placeholder="Yeni Şifre (en az 6)" placeholderTextColor="rgba(100,116,139,0.85)" secureTextEntry />
            <TouchableOpacity style={[styles.primaryBtn, savingPassword && { opacity: 0.7 }]} onPress={onChangePassword} disabled={savingPassword} activeOpacity={0.9}>
              {savingPassword ? <ActivityIndicator /> : <Text style={styles.primaryBtnTxt}>Şifre Değiştir</Text>}
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>E-posta</Text>
            {emailStep === "idle" ? (
              <>
                <Text style={styles.label}>Yeni E-posta</Text>
                <TextInput style={styles.input} value={newEmail} onChangeText={setNewEmail} placeholder="Yeni E-posta" placeholderTextColor="rgba(100,116,139,0.85)" autoCapitalize="none" keyboardType="email-address" />
                <TouchableOpacity style={[styles.primaryBtn, savingEmail && { opacity: 0.7 }]} onPress={onRequestEmailChange} disabled={savingEmail} activeOpacity={0.9}>
                  {savingEmail ? <ActivityIndicator /> : <Text style={styles.primaryBtnTxt}>Kod Gönder</Text>}
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.label}>Doğrulama Kodu</Text>
                <TextInput style={styles.input} value={emailCode} onChangeText={setEmailCode} placeholder="Doğrulama Kodu" placeholderTextColor="rgba(100,116,139,0.85)" />
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <TouchableOpacity style={[styles.primaryBtn, { flex: 1 }, savingEmail && { opacity: 0.7 }]} onPress={onConfirmEmailChange} disabled={savingEmail} activeOpacity={0.9}>
                    {savingEmail ? <ActivityIndicator /> : <Text style={styles.primaryBtnTxt}>Kodu Onayla</Text>}
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.secondaryBtn, { width: 110 }]} onPress={() => { setEmailStep("idle"); setEmailCode(""); }} activeOpacity={0.9}>
                    <Text style={styles.secondaryBtnTxt}>Vazgeç</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>

          <TouchableOpacity style={styles.dangerBtn} onPress={logout} activeOpacity={0.9}>
            <Text style={styles.dangerBtnTxt}>Çıkış Yap</Text>
          </TouchableOpacity>

          <View style={{ height: 50 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
