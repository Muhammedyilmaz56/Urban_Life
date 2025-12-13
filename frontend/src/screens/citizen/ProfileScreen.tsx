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
  Switch,
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
} from "../../api/user";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { launchImageLibrary } from "react-native-image-picker";
import { BASE_URL } from "../../config";

const BG_IMAGE = "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=2070&auto=format&fit=crop";

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

const ProfileScreen = () => {
  const navigation = useNavigation<any>();
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
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const loadUser = async () => {
    try {
      const data = await getCurrentUser();
      setUser(data);
    } catch (err) {
      
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
    setEditTc(user.tc_kimlik_no || "");
    
    if (user.birth_date) {
      const d = new Date(user.birth_date);
      setBirthYear(d.getFullYear().toString());
      setBirthMonth((d.getMonth() + 1).toString().padStart(2, "0"));
      setBirthDay(d.getDate().toString().padStart(2, "0"));
    } else {
      setBirthDay(""); setBirthMonth(""); setBirthYear("");
    }
    setModalType("INFO");
  };

  const handleUpdatePersonalInfo = async () => {
    if (!editName.trim() || !editTc.trim()) {
      Alert.alert("Uyarı", "Ad Soyad ve TC Kimlik zorunludur.");
      return;
    }

    if (editTc.length !== 11) {
      Alert.alert("Uyarı", "TC Kimlik 11 haneli olmalıdır.");
      return;
    }

    const d = parseInt(birthDay);
    const m = parseInt(birthMonth);
    const y = parseInt(birthYear);
    if (!d || !m || !y || d > 31 || m > 12 || y < 1900 || y > new Date().getFullYear()) {
       Alert.alert("Uyarı", "Geçerli bir tarih giriniz.");
       return;
    }

    const formattedDate = `${y}-${m.toString().padStart(2,"0")}-${d.toString().padStart(2,"0")}`;

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
    if (editPhone.length < 10) {
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
    setUser((prev: any) => ({ ...prev, is_name_public: value }));
    try {
      await updateProfile({ is_name_public: value });
    } catch (error) {
      setUser((prev: any) => ({ ...prev, is_name_public: !value }));
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
    await AsyncStorage.removeItem("accessToken");
    navigation.reset({ index: 0, routes: [{ name: "Login" }] });
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#6C63FF" /></View>;
  if (!user) return <View style={styles.center}><Text style={{color: 'white'}}>Kullanıcı yüklenemedi</Text></View>;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ImageBackground source={{ uri: BG_IMAGE }} style={styles.backgroundImage} resizeMode="cover">
        <View style={styles.overlay}>
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{flex:1}}>
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
              </View>

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
                <InfoRow 
                  label="Telefon" 
                  value={user.phone_number || user.phone} 
                  onPress={openPhoneModal} 
                  actionLabel="Değiştir" 
                />
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Ayarlar</Text>
                <View style={styles.rowBetween}>
                  <Text style={styles.label}>İsim Herkese Görünsün</Text>
                  <Switch 
                    value={user.is_name_public ?? true} 
                    onValueChange={toggleVisibility}
                    trackColor={{ false: "#767577", true: "#6C63FF" }}
                    thumbColor={user.is_name_public ? "#fff" : "#f4f3f4"}
                  />
                </View>
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

              <View style={{height: 100}} /> 
            </ScrollView>

            <Modal visible={modalType === "INFO"} transparent animationType="fade">
              <View style={styles.passwordModalOverlay}>
                <View style={styles.passwordModalContainer}>
                  <Text style={styles.passwordModalTitle}>Kimlik Bilgilerini Düzenle</Text>
                  
                  <TextInput style={styles.passwordInput} placeholder="Ad Soyad" placeholderTextColor="#999" value={editName} onChangeText={setEditName} />
                  <TextInput style={styles.passwordInput} placeholder="TC Kimlik No" placeholderTextColor="#999" value={editTc} onChangeText={setEditTc} keyboardType="number-pad" maxLength={11} />
                  
                  <View style={{ flexDirection: "row", gap: 10 }}>
                    <TextInput style={[styles.passwordInput, { flex: 1 }]} placeholder="Gün" placeholderTextColor="#999" value={birthDay} onChangeText={setBirthDay} keyboardType="numeric" maxLength={2} />
                    <TextInput style={[styles.passwordInput, { flex: 1 }]} placeholder="Ay" placeholderTextColor="#999" value={birthMonth} onChangeText={setBirthMonth} keyboardType="numeric" maxLength={2} />
                    <TextInput style={[styles.passwordInput, { flex: 1.5 }]} placeholder="Yıl" placeholderTextColor="#999" value={birthYear} onChangeText={setBirthYear} keyboardType="numeric" maxLength={4} />
                  </View>

                  <View style={styles.passwordButtonsRow}>
                    <TouchableOpacity style={styles.passwordCancelButton} onPress={() => setModalType("NONE")}>
                      <Text style={styles.passwordButtonText}>İptal</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.passwordButton} onPress={handleUpdatePersonalInfo} disabled={isSaving}>
                      {isSaving ? <ActivityIndicator color="#fff" /> : <Text style={styles.passwordButtonText}>Kaydet</Text>}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

            <Modal visible={modalType === "PHONE"} transparent animationType="fade">
              <View style={styles.passwordModalOverlay}>
                <View style={styles.passwordModalContainer}>
                  <Text style={styles.passwordModalTitle}>Telefon Numarası</Text>
                  <Text style={{fontSize: 12, color: '#CCC', marginBottom: 10}}>Numaranızı değiştirdiğinizde doğrulama SMS'i gönderilecektir.</Text>
                  
                  <TextInput 
                    style={styles.passwordInput} 
                    placeholder="5XX XXX XX XX" 
                    placeholderTextColor="#999"
                    value={editPhone} 
                    onChangeText={setEditPhone} 
                    keyboardType="phone-pad" 
                  />

                  <View style={styles.passwordButtonsRow}>
                    <TouchableOpacity style={styles.passwordCancelButton} onPress={() => setModalType("NONE")}>
                      <Text style={styles.passwordButtonText}>İptal</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.passwordButton} onPress={handleUpdatePhone} disabled={isSaving}>
                        {isSaving ? <ActivityIndicator color="#fff" /> : <Text style={styles.passwordButtonText}>Güncelle</Text>}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

            <Modal visible={modalType === "PASSWORD"} transparent animationType="fade">
              <View style={styles.passwordModalOverlay}>
                <View style={styles.passwordModalContainer}>
                  <Text style={styles.passwordModalTitle}>Şifre Değiştir</Text>
                  <TextInput style={styles.passwordInput} placeholder="Mevcut Şifre" placeholderTextColor="#999" secureTextEntry value={passwords.current} onChangeText={(t) => setPasswords(p => ({...p, current: t}))} />
                  <TextInput style={styles.passwordInput} placeholder="Yeni Şifre" placeholderTextColor="#999" secureTextEntry value={passwords.new} onChangeText={(t) => setPasswords(p => ({...p, new: t}))} />
                  <TextInput style={styles.passwordInput} placeholder="Yeni Şifre (Tekrar)" placeholderTextColor="#999" secureTextEntry value={passwords.confirm} onChangeText={(t) => setPasswords(p => ({...p, confirm: t}))} />
                  
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

export default ProfileScreen;