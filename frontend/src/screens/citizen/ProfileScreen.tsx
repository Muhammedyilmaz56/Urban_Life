import React, { useEffect, useState, useLayoutEffect, useContext } from "react";
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
          : `${BASE_URL}${avatar_url}?t=${refreshKey}`,
      }
    : require("../../../assets/default-avatar.png");

const ProfileScreen = () => {
  const navigation = useNavigation<any>();
  const auth = useContext(AuthContext);

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [avatarRefreshKey, setAvatarRefreshKey] = useState(Date.now());

  const [modalType, setModalType] = useState<"NONE" | "INFO" | "PHONE" | "PASSWORD">("NONE");

  const [editName, setEditName] = useState("");
  const [editTc, setEditTc] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthYear, setBirthYear] = useState("");

  const [editPhone, setEditPhone] = useState("");
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [isSaving, setIsSaving] = useState(false);

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
    launchImageLibrary({ mediaType: "photo", quality: 0.8 }, async (res: any) => {
      if (res?.didCancel || !res?.assets?.[0]?.uri) return;

      try {
        const result = await uploadAvatar(res.assets[0].uri);
        setUser((prev: any) => ({ ...(prev || {}), avatar_url: result.avatar_url }));
        setAvatarRefreshKey(Date.now());
        Alert.alert("Başarılı", "Profil fotoğrafı güncellendi.");
      } catch (err) {
        Alert.alert("Hata", "Fotoğraf yüklenemedi.");
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
    if (!editName.trim() || !editTc.trim()) {
      Alert.alert("Uyarı", "Ad Soyad ve TC Kimlik zorunludur.");
      return;
    }

    if (editTc.trim().length !== 11) {
      Alert.alert("Uyarı", "TC Kimlik 11 haneli olmalıdır.");
      return;
    }

    const d = parseInt(birthDay, 10);
    const m = parseInt(birthMonth, 10);
    const y = parseInt(birthYear, 10);

    if (!d || !m || !y || d > 31 || m > 12 || y < 1900 || y > new Date().getFullYear()) {
      Alert.alert("Uyarı", "Geçerli bir tarih giriniz.");
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
      Alert.alert("Başarılı", "Kimlik bilgileri güncellendi.");
    } catch (err: any) {
      Alert.alert("Hata", err?.response?.data?.detail || "Güncelleme başarısız.");
    } finally {
      setIsSaving(false);
    }
  };

  const openPhoneModal = () => {
    setEditPhone(user?.phone || user?.phone_number || "");
    setModalType("PHONE");
  };

  const handleUpdatePhone = async () => {
    if (editPhone.trim().length < 10) {
      Alert.alert("Uyarı", "Geçerli bir numara giriniz.");
      return;
    }

    try {
      setIsSaving(true);
      await updateProfile({ phone_number: editPhone.trim() });
      await loadUser();
      setModalType("NONE");
      Alert.alert("Başarılı", "Telefon numarası güncellendi.");
    } catch (err: any) {
      Alert.alert("Hata", "Telefon güncellenemedi.");
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
    const { current, new: newPass, confirm } = passwords;

    if (!current || !newPass || !confirm) {
      Alert.alert("Uyarı", "Tüm alanları doldurunuz.");
      return;
    }
    if (newPass !== confirm) {
      Alert.alert("Uyarı", "Yeni şifreler uyuşmuyor.");
      return;
    }

    try {
      setIsSaving(true);
      await changePassword({ current_password: current, new_password: newPass });
      setModalType("NONE");
      setPasswords({ current: "", new: "", confirm: "" });
      Alert.alert("Başarılı", "Şifreniz değiştirildi.");
    } catch (err: any) {
      Alert.alert("Hata", err?.response?.data?.detail || "Şifre değiştirilemedi.");
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

              <View style={styles.modalButtonsRow}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setModalType("NONE")} activeOpacity={0.85}>
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

              <View style={styles.modalButtonsRow}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setModalType("NONE")} activeOpacity={0.85}>
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

              <View style={styles.modalButtonsRow}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setModalType("NONE")} activeOpacity={0.85}>
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
