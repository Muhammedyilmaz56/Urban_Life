import React, { useEffect, useState, useLayoutEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Modal,
  TextInput,
  Image,
  Switch,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import styles from "../../styles/ProfileStyles";
import { AuthContext } from "../../../App";

import {
  getCurrentUser,
  changePassword,
  updateProfile,
  uploadAvatar,
} from "../../api/user";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { launchImageLibrary } from "react-native-image-picker";
import { BASE_URL } from "../../config";

const InfoRow = ({ label, value, onPress, actionLabel }: any) => (
  <View style={styles.row}>
    <View style={{ flex: 1 }}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value || "-"}</Text>
    </View>
    {onPress && (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <Text style={styles.actionText}>{actionLabel || "Düzenle"}</Text>
      </TouchableOpacity>
    )}
  </View>
);

const resolveAvatar = (avatar_url?: string | null, refreshKey?: number) =>
  avatar_url
    ? {
      uri: avatar_url.startsWith("http")
        ? avatar_url
        : `${BASE_URL}${avatar_url}${refreshKey ? `?t=${refreshKey}` : ''}`,
    }
    : require("../../../assets/default-avatar.png");

const ProfileScreen = () => {
  const navigation = useNavigation<any>();
  const auth = useContext(AuthContext);

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [avatarRefreshKey, setAvatarRefreshKey] = useState(0);

  const [modalType, setModalType] = useState<"NONE" | "INFO" | "PHONE" | "PASSWORD">("NONE");

  const [editName, setEditName] = useState("");
  const [editTc, setEditTc] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthYear, setBirthYear] = useState("");

  const [editPhone, setEditPhone] = useState("");
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [isSaving, setIsSaving] = useState(false);

  // Hata state'leri
  const [infoError, setInfoError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const loadUser = async () => {
    try {
      const data = await getCurrentUser();
      setUser(data);
    } catch (err) {
      // sessiz
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const handleSelectAvatar = () => {
    console.log("AVATAR: Starting image picker...");
    launchImageLibrary({ mediaType: "photo", quality: 0.8 }, async (res: any) => {
      console.log("AVATAR: Image picker response:", JSON.stringify(res, null, 2));

      if (res?.didCancel) {
        console.log("AVATAR: User cancelled");
        return;
      }

      if (res?.errorCode) {
        console.log("AVATAR: Error code:", res.errorCode, res.errorMessage);
        setSuccessMessage("");
        // Fotoğraf seçim hatası - sessiz
        return;
      }

      if (!res?.assets?.[0]?.uri) {
        console.log("AVATAR: No asset URI found");
        return;
      }

      try {
        console.log("AVATAR: Uploading to server...", res.assets[0].uri);
        const result = await uploadAvatar(res.assets[0].uri);
        console.log("AVATAR: Upload success:", result);
        setUser((prev: any) => ({ ...(prev || {}), avatar_url: result.avatar_url }));
        setAvatarRefreshKey(Date.now());
        setSuccessMessage("Profil fotoğrafı güncellendi.");
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (err: any) {
        console.log("AVATAR: Upload error:", err?.response?.data || err.message);
        setSuccessMessage("");
        // Hata durumunda kullanıcıya gösterilecek mesaj
        setInfoError("Fotoğraf yüklenemedi.");
        setTimeout(() => setInfoError(""), 3000);
      }
    });
  };

  const openInfoModal = () => {
    if (!user) return;
    setEditName(user.full_name || user.name || "");
    setEditTc(user.tc_kimlik_no || "");

    if (user.birth_date) {
      const d = new Date(user.birth_date);
      setBirthYear(d.getFullYear().toString());
      setBirthMonth((d.getMonth() + 1).toString().padStart(2, "0"));
      setBirthDay(d.getDate().toString().padStart(2, "0"));
    } else {
      setBirthDay("");
      setBirthMonth("");
      setBirthYear("");
    }

    setModalType("INFO");
  };

  const handleUpdatePersonalInfo = async () => {
    setInfoError("");

    if (!editName.trim() || !editTc.trim()) {
      setInfoError("Ad Soyad ve TC Kimlik zorunludur.");
      return;
    }

    if (editTc.trim().length !== 11) {
      setInfoError("TC Kimlik 11 haneli olmalıdır.");
      return;
    }

    const d = parseInt(birthDay, 10);
    const m = parseInt(birthMonth, 10);
    const y = parseInt(birthYear, 10);

    if (!d || !m || !y || d > 31 || m > 12 || y < 1900 || y > new Date().getFullYear()) {
      setInfoError("Geçerli bir tarih giriniz.");
      return;
    }

    const formattedDate = `${y}-${m.toString().padStart(2, "0")}-${d.toString().padStart(2, "0")}`;

    try {
      setIsSaving(true);
      await updateProfile({
        full_name: editName.trim(),
        tc_kimlik_no: editTc.trim(),
        birth_date: formattedDate,
      });
      await loadUser();
      setModalType("NONE");
      setSuccessMessage("Kimlik bilgileri güncellendi.");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      setInfoError(err?.response?.data?.detail || "Güncelleme başarısız.");
    } finally {
      setIsSaving(false);
    }
  };

  const openPhoneModal = () => {
    setEditPhone(user?.phone || user?.phone_number || "");
    setModalType("PHONE");
  };

  const handleUpdatePhone = async () => {
    setPhoneError("");

    if (editPhone.trim().length < 10) {
      setPhoneError("Geçerli bir numara giriniz.");
      return;
    }

    try {
      setIsSaving(true);
      await updateProfile({ phone_number: editPhone.trim() });
      await loadUser();
      setModalType("NONE");
      setSuccessMessage("Telefon numarası güncellendi.");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      setPhoneError("Telefon güncellenemedi.");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleVisibility = async (value: boolean) => {
    setUser((prev: any) => ({ ...(prev || {}), is_name_public: value }));
    try {
      await updateProfile({ is_name_public: value });
    } catch (error) {
      setUser((prev: any) => ({ ...(prev || {}), is_name_public: !value }));
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
      setPasswordError(err?.response?.data?.detail || "Şifre değiştirilemedi.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(["token", "accessToken", "user"]);
      auth?.setUser(null);
    } catch (e) {
      console.log("Çıkış hatası:", e);
      auth?.setUser(null);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Kullanıcı yüklenemedi</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B3A6A" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.8}>
          <Text style={styles.backButtonIcon}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Profil</Text>

        <View style={{ width: 44 }} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

          {/* Başarı Mesajı */}
          {successMessage !== "" && (
            <View style={{ backgroundColor: "#10B981", paddingVertical: 12, paddingHorizontal: 16, marginBottom: 12, borderRadius: 10 }}>
              <Text style={{ color: "#fff", fontSize: 14, fontWeight: "600", textAlign: "center" }}>
                ✓ {successMessage}
              </Text>
            </View>
          )}

          {/* TOP CARD */}
          <View style={styles.topCard}>
            <View style={styles.avatarWrap}>
              <Image source={resolveAvatar(user.avatar_url, avatarRefreshKey)} style={styles.avatar} />
              <TouchableOpacity style={styles.avatarEditButton} onPress={handleSelectAvatar} activeOpacity={0.85}>
                <Text style={styles.avatarEditText}>+</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.name}>{user.full_name || user.name || "-"}</Text>
            <Text style={styles.email}>{user.email || "-"}</Text>
          </View>

          {/* SECTIONS */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Kimlik Bilgileri</Text>
            <InfoRow label="Ad Soyad" value={user.full_name} onPress={openInfoModal} />
            <InfoRow label="TC Kimlik No" value={user.tc_kimlik_no} onPress={openInfoModal} />
            <InfoRow
              label="Doğum Tarihi"
              value={user.birth_date ? new Date(user.birth_date).toLocaleDateString("tr-TR") : "-"}
              onPress={openInfoModal}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>İletişim</Text>
            <InfoRow label="Telefon" value={user.phone_number || user.phone} onPress={openPhoneModal} actionLabel="Değiştir" />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ayarlar</Text>
            <View style={styles.rowBetween}>
              <Text style={styles.label}>İsim görünürlüğü</Text>
              <Switch
                value={user.is_name_public ?? true}
                onValueChange={toggleVisibility}
                trackColor={{ false: "#CBD5E1", true: "#93C5FD" }}
                thumbColor={"#FFFFFF"}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Güvenlik</Text>
            <TouchableOpacity style={styles.row} onPress={() => setModalType("PASSWORD")} activeOpacity={0.85}>
              <Text style={styles.label}>Şifre Değiştir</Text>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.9}>
            <Text style={styles.logoutText}>Çıkış Yap</Text>
          </TouchableOpacity>

          <View style={{ height: 30 }} />
        </ScrollView>

        {/* MODALS */}

        {/* INFO */}
        <Modal visible={modalType === "INFO"} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Kimlik Bilgilerini Düzenle</Text>

              <TextInput
                style={styles.input}
                placeholder="Ad Soyad"
                placeholderTextColor="#94A3B8"
                value={editName}
                onChangeText={setEditName}
              />
              <TextInput
                style={styles.input}
                placeholder="TC Kimlik No"
                placeholderTextColor="#94A3B8"
                value={editTc}
                onChangeText={setEditTc}
                keyboardType="number-pad"
                maxLength={11}
              />

              <View style={{ flexDirection: "row", gap: 10 }}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Gün"
                  placeholderTextColor="#94A3B8"
                  value={birthDay}
                  onChangeText={setBirthDay}
                  keyboardType="numeric"
                  maxLength={2}
                />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Ay"
                  placeholderTextColor="#94A3B8"
                  value={birthMonth}
                  onChangeText={setBirthMonth}
                  keyboardType="numeric"
                  maxLength={2}
                />
                <TextInput
                  style={[styles.input, { flex: 1.5 }]}
                  placeholder="Yıl"
                  placeholderTextColor="#94A3B8"
                  value={birthYear}
                  onChangeText={setBirthYear}
                  keyboardType="numeric"
                  maxLength={4}
                />
              </View>

              {/* Hata Mesajı */}
              {infoError !== "" && (
                <Text style={{ color: "#EF4444", fontSize: 13, fontWeight: "600", textAlign: "center", marginTop: 8 }}>
                  {infoError}
                </Text>
              )}

              <View style={styles.modalButtonsRow}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => { setModalType("NONE"); setInfoError(""); }} activeOpacity={0.85}>
                  <Text style={styles.cancelButtonText}>İptal</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.primaryButton} onPress={handleUpdatePersonalInfo} disabled={isSaving} activeOpacity={0.9}>
                  {isSaving ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>Kaydet</Text>}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* PHONE */}
        <Modal visible={modalType === "PHONE"} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Telefon Numarası</Text>
              <Text style={styles.helperText}>Numaranızı güncellediğinizde doğrulama süreci başlatılabilir.</Text>

              <TextInput
                style={styles.input}
                placeholder="5XX XXX XX XX"
                placeholderTextColor="#94A3B8"
                value={editPhone}
                onChangeText={setEditPhone}
                keyboardType="phone-pad"
              />

              {/* Hata Mesajı */}
              {phoneError !== "" && (
                <Text style={{ color: "#EF4444", fontSize: 13, fontWeight: "600", textAlign: "center", marginTop: 8 }}>
                  {phoneError}
                </Text>
              )}

              <View style={styles.modalButtonsRow}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => { setModalType("NONE"); setPhoneError(""); }} activeOpacity={0.85}>
                  <Text style={styles.cancelButtonText}>İptal</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.primaryButton} onPress={handleUpdatePhone} disabled={isSaving} activeOpacity={0.9}>
                  {isSaving ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>Güncelle</Text>}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* PASSWORD */}
        <Modal visible={modalType === "PASSWORD"} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Şifre Değiştir</Text>

              <TextInput
                style={styles.input}
                placeholder="Mevcut Şifre"
                placeholderTextColor="#94A3B8"
                secureTextEntry
                value={passwords.current}
                onChangeText={(t) => setPasswords((p) => ({ ...p, current: t }))}
              />
              <TextInput
                style={styles.input}
                placeholder="Yeni Şifre"
                placeholderTextColor="#94A3B8"
                secureTextEntry
                value={passwords.new}
                onChangeText={(t) => setPasswords((p) => ({ ...p, new: t }))}
              />
              <TextInput
                style={styles.input}
                placeholder="Yeni Şifre (Tekrar)"
                placeholderTextColor="#94A3B8"
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

              <View style={styles.modalButtonsRow}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => { setModalType("NONE"); setPasswordError(""); }} activeOpacity={0.85}>
                  <Text style={styles.cancelButtonText}>İptal</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.primaryButton} onPress={handleChangePassword} disabled={isSaving} activeOpacity={0.9}>
                  {isSaving ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>Değiştir</Text>}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ProfileScreen;
