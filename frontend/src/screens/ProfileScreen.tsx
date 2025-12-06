import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  Modal,
  TextInput,
} from "react-native";
import styles from "../styles/ProfileStyles";
import { getCurrentUser, changePassword, updateProfile } from "../api/user";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { launchImageLibrary } from "react-native-image-picker";
import { uploadAvatar } from "../api/user";
import Image from "react-native-fast-image"; 
const ProfileScreen = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<any>();

  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  const loadUser = async () => {
    try {
      setLoading(true);
      const data = await getCurrentUser();
      setUser(data);
    } catch (err: any) {
      Alert.alert("Hata", "Kullanıcı bilgileri alınamadı.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("accessToken");
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (err) {
      Alert.alert("Hata", "Çıkış yapılırken bir hata oluştu.");
    }
  };

  const handleOpenPasswordModal = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setPasswordModalVisible(true);
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      Alert.alert("Uyarı", "Tüm alanları doldurmalısın.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      Alert.alert("Uyarı", "Yeni şifreler birbiriyle uyuşmuyor.");
      return;
    }

    try {
      setChangingPassword(true);
      await changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });
      Alert.alert("Başarılı", "Şifren güncellendi.");
      setPasswordModalVisible(false);
    } catch (err: any) {
      const message =
        err?.response?.data?.detail || "Şifre değiştirilirken bir hata oluştu.";
      Alert.alert("Hata", String(message));
    } finally {
      setChangingPassword(false);
    }
  };

  const handleOpenEditModal = () => {
    const displayName = user?.full_name || user?.name || "";
    const phone = user?.phone || user?.phone_number || "";
    setEditName(displayName);
    setEditPhone(phone);
    setEditModalVisible(true);
  };

  const handleSaveProfile = async () => {
    if (!editName.trim()) {
      Alert.alert("Uyarı", "Ad soyad boş olamaz.");
      return;
    }

    try {
      setSavingProfile(true);
      await updateProfile({
        full_name: editName.trim(),
        phone: editPhone.trim() || undefined,
      });
      await loadUser();
      setEditModalVisible(false);
      Alert.alert("Başarılı", "Profil güncellendi.");
    } catch (err: any) {
      const message =
        err?.response?.data?.detail || "Profil güncellenirken bir hata oluştu.";
      Alert.alert("Hata", String(message));
    } finally {
      setSavingProfile(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  if (loading) {
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

  if (!user) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text>Profil yüklenemedi</Text>
      </View>
    );
  }

  const displayName = user.full_name || user.name || "Kullanıcı";
  const phone = user.phone || user.phone_number || "-";

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
        <View style={styles.avatarWrap}>
  <Image
    source={
      user.avatar_url
        ? { uri: user.avatar_url }
        : require("../assets/default-avatar.png")
    }
    style={styles.avatar}
  />

  <TouchableOpacity
    style={styles.avatarEditButton}
    onPress={handleSelectAvatar}
  >
    <Text style={styles.avatarEditText}>+</Text>
  </TouchableOpacity>
</View>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hesap Bilgileri</Text>

          <View style={styles.row}>
            <Text style={styles.rowText}>Ad Soyad: {displayName}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowText}>Email: {user.email}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowText}>Telefon: {phone}</Text>
          </View>

          {user.role && (
            <View style={styles.row}>
              <Text style={styles.rowText}>Rol: {user.role}</Text>
            </View>
          )}

          <TouchableOpacity style={styles.row} onPress={handleOpenEditModal}>
            <Text style={styles.rowText}>Profili Düzenle</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Güvenlik</Text>

          <TouchableOpacity style={styles.row} onPress={handleOpenPasswordModal}>
            <Text style={styles.rowText}>Şifre Değiştir</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Çıkış Yap</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={passwordModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPasswordModalVisible(false)}
      >
        <View style={styles.passwordModalOverlay}>
          <View style={styles.passwordModalContainer}>
            <Text style={styles.passwordModalTitle}>Şifre Değiştir</Text>

            <TextInput
              style={styles.passwordInput}
              placeholder="Mevcut şifre"
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
            <TextInput
              style={styles.passwordInput}
              placeholder="Yeni şifre"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TextInput
              style={styles.passwordInput}
              placeholder="Yeni şifre tekrar"
              secureTextEntry
              value={confirmNewPassword}
              onChangeText={setConfirmNewPassword}
            />

            <View style={styles.passwordButtonsRow}>
              <TouchableOpacity
                style={styles.passwordCancelButton}
                onPress={() => setPasswordModalVisible(false)}
                disabled={changingPassword}
              >
                <Text style={styles.passwordButtonText}>İptal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.passwordButton}
                onPress={handleChangePassword}
                disabled={changingPassword}
              >
                {changingPassword ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.passwordButtonText}>Kaydet</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={editModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.passwordModalOverlay}>
          <View className="passwordModalContainer" style={styles.passwordModalContainer}>
            <Text style={styles.passwordModalTitle}>Profili Düzenle</Text>

            <TextInput
              style={styles.passwordInput}
              placeholder="Ad Soyad"
              value={editName}
              onChangeText={setEditName}
            />
            <TextInput
              style={styles.passwordInput}
              placeholder="Telefon"
              keyboardType="phone-pad"
              value={editPhone}
              onChangeText={setEditPhone}
            />

            <View style={styles.passwordButtonsRow}>
              <TouchableOpacity
                style={styles.passwordCancelButton}
                onPress={() => setEditModalVisible(false)}
                disabled={savingProfile}
              >
                <Text style={styles.passwordButtonText}>İptal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.passwordButton}
                onPress={handleSaveProfile}
                disabled={savingProfile}
              >
                {savingProfile ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.passwordButtonText}>Kaydet</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default ProfileScreen;
