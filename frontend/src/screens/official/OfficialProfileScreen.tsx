import React, { useEffect, useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  Modal,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import styles from "../../styles/OfficialProfileStyles";
import {
  getCurrentUser,
  changePassword,
  updateProfile,
  uploadAvatar,
  requestEmailChange,
  confirmEmailChange,
} from "../../api/user";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { launchImageLibrary } from "react-native-image-picker";
import { BASE_URL } from "../../config";

const resolveAvatar = (avatar_url?: string | null, refreshKey?: number) =>
  avatar_url
    ? {
      uri: avatar_url.startsWith("http")
        ? avatar_url
        : `${BASE_URL}${avatar_url}${refreshKey ? `?t=${refreshKey}` : ''}`,
    }
    : require("../../../assets/default-avatar.png");

const InfoRow = ({ label, value, onPress, actionLabel }: any) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowValue} numberOfLines={1}>{value || "-"}</Text>
    {onPress && (
      <TouchableOpacity onPress={onPress} style={styles.actionButton}>
        <Text style={styles.actionText}>{actionLabel || "✎"}</Text>
      </TouchableOpacity>
    )}
  </View>
);

// API hatalarını Türkçe anlaşılır mesajlara çevir
const translateError = (error: any, defaultMsg: string): string => {
  const detail = error?.response?.data?.detail || error?.message || "";
  const detailLower = String(detail).toLowerCase();

  // Şifre hataları
  if (detailLower.includes("incorrect password") || detailLower.includes("wrong password") || detailLower.includes("current password")) {
    return "Mevcut şifreniz yanlış.";
  }
  if (detailLower.includes("password") && detailLower.includes("weak")) {
    return "Şifre çok zayıf. Daha güçlü bir şifre seçin.";
  }
  if (detailLower.includes("password") && detailLower.includes("short")) {
    return "Şifre çok kısa. En az 6 karakter olmalı.";
  }

  // E-posta hataları
  if (detailLower.includes("email") && (detailLower.includes("already") || detailLower.includes("exists") || detailLower.includes("registered"))) {
    return "Bu e-posta adresi zaten kayıtlı.";
  }
  if (detailLower.includes("invalid email") || detailLower.includes("email format")) {
    return "Geçersiz e-posta formatı.";
  }
  if (detailLower.includes("code") && (detailLower.includes("invalid") || detailLower.includes("expired"))) {
    return "Doğrulama kodu geçersiz veya süresi dolmuş.";
  }

  // Genel hatalar
  if (detailLower.includes("unauthorized") || detailLower.includes("not authenticated")) {
    return "Oturumunuz sonlanmış. Lütfen tekrar giriş yapın.";
  }
  if (detailLower.includes("not found")) {
    return "Kayıt bulunamadı.";
  }

  // API'den gelen mesaj varsa onu göster, yoksa default mesaj
  return detail || defaultMsg;
};

const OfficialProfileScreen = () => {
  const navigation = useNavigation<any>();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [avatarRefreshKey, setAvatarRefreshKey] = useState(0);

  const [modalType, setModalType] = useState<"NONE" | "INFO" | "PASSWORD" | "EMAIL">("NONE");

  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });

  const [newEmail, setNewEmail] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [emailStep, setEmailStep] = useState<"INPUT" | "CODE">("INPUT");

  const [isSaving, setIsSaving] = useState(false);

  // Hata ve başarı state'leri
  const [infoError, setInfoError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const loadUser = async () => {
    try {
      const data = await getCurrentUser();
      setUser(data);
    } catch (err) {
      console.log("User load error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const handleSelectAvatar = () => {
    launchImageLibrary({ mediaType: "photo", quality: 0.8 }, async (res: any) => {
      if (res?.didCancel || !res?.assets?.[0]?.uri) return;

      try {
        const result = await uploadAvatar(res.assets[0].uri);
        setUser((prev: any) => ({ ...prev, avatar_url: result.avatar_url }));
        setAvatarRefreshKey(Date.now());
        setSuccessMessage("Profil fotoğrafı güncellendi.");
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (err) {
        setInfoError("Fotoğraf yüklenemedi.");
        setTimeout(() => setInfoError(""), 3000);
      }
    });
  };

  const openInfoModal = () => {
    if (!user) return;
    setEditName(user.full_name || user.name || "");
    setEditPhone(user.phone_number || user.phone || "");
    setModalType("INFO");
  };

  const handleUpdateInfo = async () => {
    setInfoError("");
    if (!editName.trim()) {
      setInfoError("Ad Soyad boş bırakılamaz.");
      return;
    }

    try {
      setIsSaving(true);
      await updateProfile({
        full_name: editName.trim(),
        phone_number: editPhone.trim(),
      });
      await loadUser();
      setModalType("NONE");
      setSuccessMessage("Bilgileriniz güncellendi.");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      setInfoError(err?.response?.data?.detail || "Güncelleme başarısız.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError("");
    const { current, new: newPass, confirm } = passwords;
    if (!current || !newPass || !confirm) {
      setPasswordError("Tüm alanları doldurunuz.");
      return;
    }
    if (newPass !== confirm) {
      setPasswordError("Yeni şifreler uyuşmuyor.");
      return;
    }

    try {
      setIsSaving(true);
      await changePassword({ current_password: current, new_password: newPass });
      setModalType("NONE");
      setPasswords({ current: "", new: "", confirm: "" });
      setSuccessMessage("Şifreniz değiştirildi.");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      setPasswordError(translateError(err, "Şifre değiştirilemedi."));
    } finally {
      setIsSaving(false);
    }
  };

  const openEmailModal = () => {
    setNewEmail(user?.email || "");
    setEmailCode("");
    setEmailStep("INPUT");
    setModalType("EMAIL");
  };

  const handleRequestEmailChange = async () => {
    setEmailError("");
    if (!newEmail.trim()) {
      setEmailError("Yeni e-posta giriniz.");
      return;
    }

    try {
      setIsSaving(true);
      await requestEmailChange(newEmail.trim());
      setEmailStep("CODE");
      setSuccessMessage("Doğrulama kodu gönderildi.");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      setEmailError(translateError(err, "Kod gönderilemedi."));
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmEmailChange = async () => {
    setEmailError("");
    if (!emailCode.trim() || emailCode.trim().length !== 6) {
      setEmailError("6 haneli kod giriniz.");
      return;
    }

    try {
      setIsSaving(true);
      await confirmEmailChange(emailCode.trim());
      await loadUser();
      setModalType("NONE");
      setSuccessMessage("E-posta güncellendi.");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      setEmailError(translateError(err, "Kod doğrulanamadı."));
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
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

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1e3a8a" />
      </View>
    );

  if (!user)
    return (
      <View style={styles.center}>
        <Text style={{ color: '#64748b' }}>Kullanıcı bilgileri yüklenemedi.</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      {/* Header Rengi ile Status Bar Rengi Aynı Olsun */}
      <StatusBar barStyle="light-content" backgroundColor="#1e3a8a" />

      {/* ÜST MAVİ BAŞLIK - Artık Kartın Arkasına Geçmiyor */}
      <View style={styles.headerBackground}>
        <Text style={styles.headerTitle}>Hesap Bilgileri</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 40 }}
        >

          {/* Başarı Mesajı */}
          {successMessage !== "" && (
            <View style={{ backgroundColor: "#10B981", paddingVertical: 12, paddingHorizontal: 16, marginHorizontal: 16, marginTop: 12, borderRadius: 10 }}>
              <Text style={{ color: "#fff", fontSize: 14, fontWeight: "600", textAlign: "center" }}>
                ✓ {successMessage}
              </Text>
            </View>
          )}

          {/* PROFİL KARTI - Mavi Alandan Sonra Başlıyor */}
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <Image source={resolveAvatar(user.avatar_url, avatarRefreshKey)} style={styles.avatar} />
              <TouchableOpacity style={styles.editIconBadge} onPress={handleSelectAvatar}>
                <Text style={styles.editIconText}>+</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.userName}>{user.full_name || user.name}</Text>
            <Text style={styles.userRole}>{user.role === "admin" ? "Yönetici" : "Belediye Personeli"}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Kişisel Bilgiler</Text>
            <View style={styles.infoCard}>
              <InfoRow label="Ad Soyad" value={user.full_name} onPress={openInfoModal} />
              <InfoRow
                label="E-Posta"
                value={user.email}
                onPress={openEmailModal}
                actionLabel="Değiştir"
              />
              <InfoRow
                label="Telefon"
                value={user.phone_number || user.phone}
                onPress={openInfoModal}
                actionLabel="Düzenle"
              />
            </View>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Güvenlik</Text>
            <TouchableOpacity style={styles.menuItem} onPress={() => setModalType("PASSWORD")}>
              <Text style={styles.menuText}>🔒 Şifre Değiştir</Text>
              <Text style={{ color: '#94a3b8' }}>❯</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Güvenli Çıkış</Text>
          </TouchableOpacity>

        </ScrollView>

        {/* --- MODALLAR --- */}
        <Modal visible={modalType === "INFO"} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Bilgileri Düzenle</Text>
              <Text style={styles.modalSubtitle}>Profil bilgilerinizi güncelleyin</Text>

              <Text style={styles.inputLabel}>Ad Soyad</Text>
              <TextInput
                style={styles.input}
                placeholder="Ad Soyad"
                value={editName}
                onChangeText={setEditName}
              />

              <Text style={styles.inputLabel}>Telefon</Text>
              <TextInput
                style={styles.input}
                placeholder="Telefon Numarası"
                value={editPhone}
                onChangeText={setEditPhone}
                keyboardType="phone-pad"
              />

              {/* Hata Mesajı */}
              {infoError !== "" && (
                <Text style={{ color: "#EF4444", fontSize: 13, fontWeight: "600", textAlign: "center", marginTop: 8 }}>
                  {infoError}
                </Text>
              )}

              <View style={styles.modalButtonRow}>
                <TouchableOpacity style={styles.modalCancelButton} onPress={() => { setModalType("NONE"); setInfoError(""); }}>
                  <Text style={styles.modalCancelText}>Vazgeç</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalConfirmButton} onPress={handleUpdateInfo} disabled={isSaving}>
                  {isSaving ? <ActivityIndicator color="#fff" /> : <Text style={styles.modalConfirmText}>Kaydet</Text>}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal visible={modalType === "EMAIL"} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>E-Posta Değişikliği</Text>

              {emailStep === "INPUT" ? (
                <>
                  <Text style={styles.modalSubtitle}>Yeni e-posta adresinizi giriniz</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="ornek@belediye.gov.tr"
                    value={newEmail}
                    onChangeText={setNewEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />

                  {/* Hata Mesajı */}
                  {emailError !== "" && (
                    <Text style={{ color: "#EF4444", fontSize: 13, fontWeight: "600", textAlign: "center", marginTop: 8 }}>
                      {emailError}
                    </Text>
                  )}

                  <View style={styles.modalButtonRow}>
                    <TouchableOpacity style={styles.modalCancelButton} onPress={() => { setModalType("NONE"); setEmailError(""); }}>
                      <Text style={styles.modalCancelText}>İptal</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.modalConfirmButton} onPress={handleRequestEmailChange} disabled={isSaving}>
                      {isSaving ? <ActivityIndicator color="#fff" /> : <Text style={styles.modalConfirmText}>Kod Gönder</Text>}
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <>
                  <Text style={styles.modalSubtitle}>
                    {newEmail} adresine gönderilen kodu giriniz.
                  </Text>

                  <TextInput
                    style={[styles.input, { textAlign: 'center', letterSpacing: 5, fontSize: 18 }]}
                    placeholder="______"
                    value={emailCode}
                    onChangeText={setEmailCode}
                    keyboardType="number-pad"
                    maxLength={6}
                  />

                  {/* Hata Mesajı */}
                  {emailError !== "" && (
                    <Text style={{ color: "#EF4444", fontSize: 13, fontWeight: "600", textAlign: "center", marginTop: 8 }}>
                      {emailError}
                    </Text>
                  )}

                  <View style={styles.modalButtonRow}>
                    <TouchableOpacity
                      style={styles.modalCancelButton}
                      onPress={() => {
                        setEmailStep("INPUT");
                        setEmailCode("");
                        setEmailError("");
                      }}
                    >
                      <Text style={styles.modalCancelText}>Geri</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.modalConfirmButton} onPress={handleConfirmEmailChange} disabled={isSaving}>
                      {isSaving ? <ActivityIndicator color="#fff" /> : <Text style={styles.modalConfirmText}>Doğrula</Text>}
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </View>
        </Modal>

        <Modal visible={modalType === "PASSWORD"} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Şifre Güncelle</Text>
              <Text style={styles.modalSubtitle}>Güvenliğiniz için güçlü bir şifre seçin</Text>

              <TextInput
                style={styles.input}
                placeholder="Mevcut Şifre"
                secureTextEntry
                value={passwords.current}
                onChangeText={(t) => setPasswords((p) => ({ ...p, current: t }))}
              />
              <TextInput
                style={styles.input}
                placeholder="Yeni Şifre"
                secureTextEntry
                value={passwords.new}
                onChangeText={(t) => setPasswords((p) => ({ ...p, new: t }))}
              />
              <TextInput
                style={styles.input}
                placeholder="Yeni Şifre (Tekrar)"
                secureTextEntry
                value={passwords.confirm}
                onChangeText={(t) => setPasswords((p) => ({ ...p, confirm: t }))}
              />

              {/* Hata Mesajı */}
              {passwordError !== "" && (
                <Text style={{ color: "#EF4444", fontSize: 13, fontWeight: "600", textAlign: "center", marginTop: 8 }}>
                  {passwordError}
                </Text>
              )}

              <View style={styles.modalButtonRow}>
                <TouchableOpacity style={styles.modalCancelButton} onPress={() => { setModalType("NONE"); setPasswordError(""); }}>
                  <Text style={styles.modalCancelText}>Vazgeç</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalConfirmButton} onPress={handleChangePassword} disabled={isSaving}>
                  {isSaving ? <ActivityIndicator color="#fff" /> : <Text style={styles.modalConfirmText}>Güncelle</Text>}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

      </KeyboardAvoidingView>
    </View>
  );
};

export default OfficialProfileScreen;