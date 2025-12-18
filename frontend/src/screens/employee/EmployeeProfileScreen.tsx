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
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import styles from "../../styles/EmployeeProfileStyles";
import { AuthContext } from "../../../App";

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

// Yardımcı Bileşen: Bilgi Satırı
const InfoRow = ({ label, value, onPress, actionLabel, lastItem }: any) => (
  <View style={[styles.infoRow, lastItem && { borderBottomWidth: 0 }]}>
    <View style={{ flex: 1 }}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value || "-"}</Text>
    </View>
    {onPress && (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
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

export default function EmployeeProfileScreen() {
  const navigation = useNavigation<any>();
  const auth = useContext(AuthContext);

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [avatarRefreshKey, setAvatarRefreshKey] = useState(Date.now());

  // Modal State
  const [modalType, setModalType] = useState<
    "NONE" | "INFO" | "PHONE" | "PASSWORD" | "EMAIL"
  >("NONE");

  // Form States
  const [editName, setEditName] = useState("");
  const [editTc, setEditTc] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthYear, setBirthYear] = useState("");

  const [editPhone, setEditPhone] = useState("");

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [newEmail, setNewEmail] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [emailStep, setEmailStep] = useState<"INPUT" | "CODE">("INPUT");

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

  // --- ACTIONS ---

  const handleSelectAvatar = () => {
    launchImageLibrary(
      { mediaType: "photo", quality: 0.8 },
      async (res: any) => {
        if (res?.didCancel || !res?.assets?.[0]?.uri) return;

        try {
          const result = await uploadAvatar(res.assets[0].uri);
          setUser((prev: any) => ({ ...(prev || {}), avatar_url: result.avatar_url }));
          setAvatarRefreshKey(Date.now());
          Alert.alert("Başarılı", "Profil fotoğrafı güncellendi.");
        } catch (err) {
          Alert.alert("Hata", "Fotoğraf yüklenemedi.");
        }
      }
    );
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
    if (!editName.trim() || !editTc.trim())
      return Alert.alert("Uyarı", "Ad ve TC zorunludur.");

    const formattedDate =
      birthYear && birthMonth && birthDay
        ? `${birthYear}-${birthMonth}-${birthDay}`
        : null;

    try {
      setIsSaving(true);
      await updateProfile({
        full_name: editName.trim(),
        tc_kimlik_no: editTc.trim(),
        ...(formattedDate ? { birth_date: formattedDate } : {}),
      });
      await loadUser();
      setModalType("NONE");
      Alert.alert("Başarılı", "Bilgiler güncellendi.");
    } catch (err: any) {
      Alert.alert("Hata", err?.response?.data?.detail || "Güncelleme başarısız.");
    } finally {
      setIsSaving(false);
    }
  };

  const openPhoneModal = () => {
    setEditPhone(user?.phone_number || user?.phone || "");
    setModalType("PHONE");
  };

  const handleUpdatePhone = async () => {
    try {
      setIsSaving(true);
      await updateProfile({ phone_number: editPhone.trim() });
      await loadUser();
      setModalType("NONE");
      Alert.alert("Başarılı", "Telefon güncellendi.");
    } catch (err) {
      Alert.alert("Hata", "İşlem başarısız.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    const { current, new: newPass, confirm } = passwords;
    if (newPass !== confirm)
      return Alert.alert("Uyarı", "Yeni şifreler uyuşmuyor.");

    try {
      setIsSaving(true);
      await changePassword({ current_password: current, new_password: newPass });
      setModalType("NONE");
      setPasswords({ current: "", new: "", confirm: "" });
      Alert.alert("Başarılı", "Şifre değiştirildi.");
    } catch (err: any) {
      Alert.alert("Hata", err?.response?.data?.detail || "Şifre değiştirilemedi.");
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
    try {
      setIsSaving(true);
      await requestEmailChange(newEmail.trim());
      setEmailStep("CODE");
      Alert.alert("Bilgi", "Doğrulama kodu gönderildi.");
    } catch (err: any) {
      Alert.alert("Hata", "Kod gönderilemedi.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmEmailChange = async () => {
    try {
      setIsSaving(true);
      await confirmEmailChange(emailCode.trim());
      await loadUser();
      setModalType("NONE");
      Alert.alert("Başarılı", "E-posta güncellendi.");
    } catch (err: any) {
      Alert.alert("Hata", "Kod geçersiz.");
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

  // --- GUARD: user null iken crash olmasın ---
  if (loading || !user) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e3a8a" />

      {/* HEADER */}
      <View style={styles.headerBackground}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonIcon}>‹</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.avatarContainer}>
          <View style={styles.avatarWrap}>
            <Image
              source={resolveAvatar(user?.avatar_url, avatarRefreshKey)}
              style={styles.avatar}
            />
            <TouchableOpacity
              style={styles.editIconBadge}
              onPress={handleSelectAvatar}
            >
              <Text style={styles.editIconText}>+</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.nameText}>{user?.full_name || user?.name || "-"}</Text>
          {!!user?.role && (
            <Text style={styles.roleText}>{String(user.role)}</Text>
          )}
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* KART 1 */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Kimlik Bilgileri</Text>
            <InfoRow label="Ad Soyad" value={user?.full_name} onPress={openInfoModal} />
            <InfoRow label="TC Kimlik No" value={user?.tc_kimlik_no} onPress={openInfoModal} />
            <InfoRow
              lastItem
              label="Doğum Tarihi"
              value={
                user?.birth_date
                  ? new Date(user.birth_date).toLocaleDateString("tr-TR")
                  : "-"
              }
              onPress={openInfoModal}
            />
          </View>

          {/* KART 2 */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>İletişim</Text>
            <InfoRow
              label="E-posta"
              value={user?.email}
              onPress={openEmailModal}
              actionLabel="Değiştir"
            />
            <InfoRow
              lastItem
              label="Telefon"
              value={user?.phone_number || user?.phone}
              onPress={openPhoneModal}
              actionLabel="Güncelle"
            />
          </View>

          {/* KART 3 */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Güvenlik</Text>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => setModalType("PASSWORD")}
            >
              <Text style={styles.menuText}>🔒 Şifre Değiştir</Text>
              <Text style={{ color: "#94a3b8" }}>→</Text>
            </TouchableOpacity>
          </View>

          {/* ÇIKIŞ */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Çıkış Yap</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* MODALS */}

      {/* INFO MODAL */}
      <Modal visible={modalType === "INFO"} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Bilgileri Düzenle</Text>

            <TextInput
              style={styles.input}
              placeholder="Ad Soyad"
              value={editName}
              onChangeText={setEditName}
              placeholderTextColor="#94a3b8"
            />
            <TextInput
              style={styles.input}
              placeholder="TC Kimlik"
              value={editTc}
              onChangeText={setEditTc}
              keyboardType="number-pad"
              maxLength={11}
              placeholderTextColor="#94a3b8"
            />

            <View style={{ flexDirection: "row", gap: 10 }}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Gün"
                value={birthDay}
                onChangeText={setBirthDay}
                keyboardType="numeric"
                maxLength={2}
                placeholderTextColor="#94a3b8"
              />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Ay"
                value={birthMonth}
                onChangeText={setBirthMonth}
                keyboardType="numeric"
                maxLength={2}
                placeholderTextColor="#94a3b8"
              />
              <TextInput
                style={[styles.input, { flex: 1.5 }]}
                placeholder="Yıl"
                value={birthYear}
                onChangeText={setBirthYear}
                keyboardType="numeric"
                maxLength={4}
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalType("NONE")}
              >
                <Text style={styles.cancelButtonText}>İptal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleUpdatePersonalInfo}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.confirmButtonText}>Kaydet</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* PHONE MODAL */}
      <Modal visible={modalType === "PHONE"} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Telefon Numarası</Text>
            <TextInput
              style={styles.input}
              placeholder="5XX..."
              value={editPhone}
              onChangeText={setEditPhone}
              keyboardType="phone-pad"
              placeholderTextColor="#94a3b8"
            />
            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalType("NONE")}
              >
                <Text style={styles.cancelButtonText}>İptal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleUpdatePhone}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.confirmButtonText}>Güncelle</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* PASSWORD MODAL */}
      <Modal visible={modalType === "PASSWORD"} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Şifre Değiştir</Text>

            <TextInput
              style={styles.input}
              placeholder="Mevcut Şifre"
              secureTextEntry
              value={passwords.current}
              onChangeText={(t) => setPasswords((p) => ({ ...p, current: t }))}
              placeholderTextColor="#94a3b8"
            />
            <TextInput
              style={styles.input}
              placeholder="Yeni Şifre"
              secureTextEntry
              value={passwords.new}
              onChangeText={(t) => setPasswords((p) => ({ ...p, new: t }))}
              placeholderTextColor="#94a3b8"
            />
            <TextInput
              style={styles.input}
              placeholder="Yeni Şifre (Tekrar)"
              secureTextEntry
              value={passwords.confirm}
              onChangeText={(t) => setPasswords((p) => ({ ...p, confirm: t }))}
              placeholderTextColor="#94a3b8"
            />

            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalType("NONE")}
              >
                <Text style={styles.cancelButtonText}>İptal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleChangePassword}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.confirmButtonText}>Değiştir</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* EMAIL MODAL */}
      <Modal visible={modalType === "EMAIL"} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>E-posta Değiştir</Text>

            {emailStep === "INPUT" ? (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Yeni E-posta"
                  value={newEmail}
                  onChangeText={setNewEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  placeholderTextColor="#94a3b8"
                />

                <View style={styles.modalButtonRow}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setModalType("NONE")}
                  >
                    <Text style={styles.cancelButtonText}>İptal</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={handleRequestEmailChange}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.confirmButtonText}>Kod Gönder</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <Text style={{ textAlign: "center", marginBottom: 15, color: "#64748b" }}>
                  Lütfen e-postanıza gelen kodu girin.
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="Doğrulama Kodu"
                  value={emailCode}
                  onChangeText={setEmailCode}
                  keyboardType="number-pad"
                  maxLength={6}
                  placeholderTextColor="#94a3b8"
                />

                <View style={styles.modalButtonRow}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => {
                      setEmailStep("INPUT");
                      setEmailCode("");
                    }}
                  >
                    <Text style={styles.cancelButtonText}>Geri</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={handleConfirmEmailChange}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.confirmButtonText}>Onayla</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}
