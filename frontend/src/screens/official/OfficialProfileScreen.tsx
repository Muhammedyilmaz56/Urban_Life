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
  ImageBackground,
  StatusBar,
} from "react-native";
import styles from "../../styles/ProfileStyles";
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

const BG_IMAGE =
  "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop";

const InfoRow = ({ label, value, onPress, actionLabel }: any) => (
  <View style={styles.row}>
    <View style={{ flex: 1 }}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value || "-"}</Text>
    </View>
    {onPress && (
      <TouchableOpacity onPress={onPress}>
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

const OfficialProfileScreen = () => {
  const navigation = useNavigation<any>();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [avatarRefreshKey, setAvatarRefreshKey] = useState(Date.now());

  const [modalType, setModalType] = useState<
    "NONE" | "INFO" | "PASSWORD" | "EMAIL"
  >("NONE");

  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });

 
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
        Alert.alert("Başarılı", "Profil fotoğrafı güncellendi.");
      } catch (err) {
        Alert.alert("Hata", "Fotoğraf yüklenemedi.");
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
    if (!editName.trim()) {
      Alert.alert("Uyarı", "Ad Soyad boş bırakılamaz.");
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
      Alert.alert("Başarılı", "Bilgileriniz güncellendi.");
    } catch (err: any) {
      Alert.alert("Hata", err?.response?.data?.detail || "Güncelleme başarısız.");
    } finally {
      setIsSaving(false);
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

  
  const openEmailModal = () => {
    setNewEmail(user?.email || "");
    setEmailCode("");
    setEmailStep("INPUT");
    setModalType("EMAIL");
  };

  const handleRequestEmailChange = async () => {
    if (!newEmail.trim()) {
      Alert.alert("Uyarı", "Yeni e-posta giriniz.");
      return;
    }

    try {
      setIsSaving(true);
      await requestEmailChange(newEmail.trim());
      setEmailStep("CODE");
      Alert.alert("Başarılı", "Doğrulama kodu yeni e-postaya gönderildi.");
    } catch (err: any) {
      Alert.alert("Hata", err?.response?.data?.detail || "Kod gönderilemedi.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmEmailChange = async () => {
    if (!emailCode.trim() || emailCode.trim().length !== 6) {
      Alert.alert("Uyarı", "6 haneli kod giriniz.");
      return;
    }

    try {
      setIsSaving(true);
      await confirmEmailChange(emailCode.trim());
      await loadUser();
      setModalType("NONE");
      Alert.alert("Başarılı", "E-posta güncellendi.");
    } catch (err: any) {
      Alert.alert("Hata", err?.response?.data?.detail || "Kod doğrulanamadı.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert("Çıkış Yap", "Uygulamadan çıkmak istediğinize emin misiniz?", [
      { text: "İptal", style: "cancel" },
      {
        text: "Çıkış Yap",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("accessToken");
          navigation.reset({ index: 0, routes: [{ name: "Login" }] });
        },
      },
    ]);
  };

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );

  if (!user)
    return (
      <View style={styles.center}>
        <Text>Kullanıcı yüklenemedi</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ImageBackground source={{ uri: BG_IMAGE }} style={styles.backgroundImage} resizeMode="cover">
        <View style={styles.overlay}>
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                  <Text style={styles.backButtonIcon}>‹</Text>
                </TouchableOpacity>

                <View style={styles.avatarWrap}>
                  <Image source={resolveAvatar(user.avatar_url, avatarRefreshKey)} style={styles.avatar} />
                  <TouchableOpacity style={styles.avatarEditButton} onPress={handleSelectAvatar}>
                    <Text style={styles.avatarEditText}>+</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.name}>{user.full_name || user.name}</Text>
                <Text style={styles.email}>{user.email}</Text>

                <Text style={{ color: "#ccc", fontSize: 12, marginTop: 4 }}>
                  {user.role === "admin" ? "Yönetici" : "Belediye Personeli"}
                </Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Personel Bilgileri</Text>

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
                  actionLabel="Değiştir"
                />
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Güvenlik</Text>
                <TouchableOpacity style={styles.row} onPress={() => setModalType("PASSWORD")}>
                  <Text style={styles.label}>Şifre Değiştir</Text>
                  <Text style={styles.arrow}>{">"}</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Çıkış Yap</Text>
              </TouchableOpacity>

              <View style={{ height: 100 }} />
            </ScrollView>

          
            <Modal visible={modalType === "INFO"} transparent animationType="fade">
              <View style={styles.passwordModalOverlay}>
                <View style={styles.passwordModalContainer}>
                  <Text style={styles.passwordModalTitle}>Bilgileri Düzenle</Text>

                  <Text style={{ fontSize: 12, color: "#666", marginBottom: 5, marginLeft: 2 }}>
                    Ad Soyad
                  </Text>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Ad Soyad"
                    placeholderTextColor="#999"
                    value={editName}
                    onChangeText={setEditName}
                  />

                  <Text style={{ fontSize: 12, color: "#666", marginBottom: 5, marginLeft: 2, marginTop: 10 }}>
                    Telefon
                  </Text>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Telefon"
                    placeholderTextColor="#999"
                    value={editPhone}
                    onChangeText={setEditPhone}
                    keyboardType="phone-pad"
                  />

                  <View style={styles.passwordButtonsRow}>
                    <TouchableOpacity style={styles.passwordCancelButton} onPress={() => setModalType("NONE")}>
                      <Text style={styles.passwordButtonText}>İptal</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.passwordButton} onPress={handleUpdateInfo} disabled={isSaving}>
                      {isSaving ? <ActivityIndicator color="#fff" /> : <Text style={styles.passwordButtonText}>Kaydet</Text>}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

           
            <Modal visible={modalType === "EMAIL"} transparent animationType="fade">
              <View style={styles.passwordModalOverlay}>
                <View style={styles.passwordModalContainer}>
                  <Text style={styles.passwordModalTitle}>E-Posta Değiştir</Text>

                  {emailStep === "INPUT" ? (
                    <>
                      <TextInput
                        style={styles.passwordInput}
                        placeholder="Yeni e-posta"
                        placeholderTextColor="#999"
                        value={newEmail}
                        onChangeText={setNewEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                      />

                      <View style={styles.passwordButtonsRow}>
                        <TouchableOpacity style={styles.passwordCancelButton} onPress={() => setModalType("NONE")}>
                          <Text style={styles.passwordButtonText}>İptal</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.passwordButton} onPress={handleRequestEmailChange} disabled={isSaving}>
                          {isSaving ? <ActivityIndicator color="#fff" /> : <Text style={styles.passwordButtonText}>Kodu Gönder</Text>}
                        </TouchableOpacity>
                      </View>
                    </>
                  ) : (
                    <>
                      <Text style={{ color: "white", marginBottom: 10 }}>
                        {newEmail} adresine gönderilen 6 haneli kodu gir.
                      </Text>

                      <TextInput
                        style={styles.passwordInput}
                        placeholder="Doğrulama Kodu (6 hane)"
                        placeholderTextColor="#999"
                        value={emailCode}
                        onChangeText={setEmailCode}
                        keyboardType="number-pad"
                        maxLength={6}
                      />

                      <View style={styles.passwordButtonsRow}>
                        <TouchableOpacity
                          style={styles.passwordCancelButton}
                          onPress={() => {
                            setEmailStep("INPUT");
                            setEmailCode("");
                          }}
                        >
                          <Text style={styles.passwordButtonText}>Geri</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.passwordButton} onPress={handleConfirmEmailChange} disabled={isSaving}>
                          {isSaving ? <ActivityIndicator color="#fff" /> : <Text style={styles.passwordButtonText}>Onayla</Text>}
                        </TouchableOpacity>
                      </View>

                      <TouchableOpacity
                        style={{ marginTop: 12, alignSelf: "center" }}
                        onPress={handleRequestEmailChange}
                        disabled={isSaving}
                      >
                        <Text style={styles.actionText}>Kodu yeniden gönder</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
            </Modal>

           
            <Modal visible={modalType === "PASSWORD"} transparent animationType="fade">
              <View style={styles.passwordModalOverlay}>
                <View style={styles.passwordModalContainer}>
                  <Text style={styles.passwordModalTitle}>Şifre Değiştir</Text>

                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Mevcut Şifre"
                    placeholderTextColor="#999"
                    secureTextEntry
                    value={passwords.current}
                    onChangeText={(t) => setPasswords((p) => ({ ...p, current: t }))}
                  />
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Yeni Şifre"
                    placeholderTextColor="#999"
                    secureTextEntry
                    value={passwords.new}
                    onChangeText={(t) => setPasswords((p) => ({ ...p, new: t }))}
                  />
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Yeni Şifre (Tekrar)"
                    placeholderTextColor="#999"
                    secureTextEntry
                    value={passwords.confirm}
                    onChangeText={(t) => setPasswords((p) => ({ ...p, confirm: t }))}
                  />

                  <View style={styles.passwordButtonsRow}>
                    <TouchableOpacity style={styles.passwordCancelButton} onPress={() => setModalType("NONE")}>
                      <Text style={styles.passwordButtonText}>İptal</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.passwordButton} onPress={handleChangePassword} disabled={isSaving}>
                      {isSaving ? <ActivityIndicator color="#fff" /> : <Text style={styles.passwordButtonText}>Değiştir</Text>}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </KeyboardAvoidingView>
        </View>
      </ImageBackground>
    </View>
  );
};

export default OfficialProfileScreen;
