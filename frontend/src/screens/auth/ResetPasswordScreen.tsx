import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BASE_URL } from "../../config";
import client from "../../api/client";

import { ModernResetPasswordStyles as styles } from "../../styles/ModernResetPasswordStyles";


const BG_IMAGE = "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=2070&auto=format&fit=crop";

type Props = NativeStackScreenProps<any, "ResetPassword">;

const ResetPasswordScreen: React.FC<Props> = ({ navigation, route }) => {
  const deepLinkToken = route.params?.token;

  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Inline mesajlar
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (deepLinkToken) {
      setToken(deepLinkToken);
    }
  }, [deepLinkToken]);

  const handleResetPassword = async () => {
    setSuccessMessage("");
    setErrorMessage("");
    setPasswordError("");

    if (!token) {
      setErrorMessage("Token bulunamadı. Lütfen e-postanızdaki linke tekrar tıklayın veya kodu manuel girin.");
      return;
    }
    if (!newPassword || !confirmPassword) {
      setErrorMessage("Lütfen tüm alanları doldurun.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("Şifre en az 6 karakter olmalı.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Girdiğiniz şifreler birbiriyle eşleşmiyor.");
      return;
    }

    try {
      setLoading(true);
      await client.post(`${BASE_URL}/auth/reset-password`, {
        token: token,
        new_password: newPassword,
      });

      setSuccessMessage("Şifreniz başarıyla güncellendi! Giriş sayfasına yönlendiriliyorsunuz...");
      setTimeout(() => {
        navigation.navigate("Login" as never);
      }, 2500);
    } catch (err: any) {
      const detail = err.response?.data?.detail || err.response?.data?.message || "";
      const detailLower = String(detail).toLowerCase();

      if (detailLower.includes("expired") || detailLower.includes("süresi dolmuş")) {
        setErrorMessage("Şifre sıfırlama linki süresi dolmuş. Lütfen yeni bir link talep edin.");
      } else if (detailLower.includes("invalid") && detailLower.includes("token")) {
        setErrorMessage("Geçersiz sıfırlama kodu. Lütfen e-postanızdaki linki kontrol edin.");
      } else if (detailLower.includes("not found") || detailLower.includes("bulunamadı")) {
        setErrorMessage("Sıfırlama kodu bulunamadı. Lütfen yeni bir şifre sıfırlama linki talep edin.");
      } else if (detailLower.includes("password") && (detailLower.includes("weak") || detailLower.includes("zayıf"))) {
        setPasswordError("Şifre çok zayıf. Daha güçlü bir şifre seçin.");
      } else if (detail) {
        setErrorMessage(detail);
      } else {
        setErrorMessage("Şifre sıfırlama işlemi başarısız oldu. Lütfen tekrar deneyin.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground source={{ uri: BG_IMAGE }} style={styles.background} resizeMode="cover">
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <TouchableOpacity
        style={styles.backButtonAbsolute}
        onPress={() => navigation.goBack()}
      >

        <Text style={styles.backButtonIcon}>‹</Text>
      </TouchableOpacity>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

          <View style={styles.overlay}>

            <View style={styles.headerContainer}>
              <Text style={styles.appTitle}>CityFlow</Text>
              <Text style={styles.appSubtitle}>Hesabını Kurtar</Text>
            </View>


            <View style={styles.glassFormContainer}>
              <Text style={styles.formTitle}>Yeni Şifre Belirle</Text>

              <Text style={styles.infoText}>
                {deepLinkToken
                  ? "Kimliğiniz doğrulandı. Lütfen güçlü bir şifre belirleyin."
                  : "Lütfen e-postanızdaki güvenlik kodunu girin."}
              </Text>

              {/* Başarı Mesajı */}
              {successMessage !== "" && (
                <View style={{ backgroundColor: "#10B981", paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10, marginBottom: 12 }}>
                  <Text style={{ color: "#fff", fontSize: 13, fontWeight: "600", textAlign: "center" }}>
                    ✓ {successMessage}
                  </Text>
                </View>
              )}

              {/* Hata Mesajı */}
              {errorMessage !== "" && (
                <View style={{ backgroundColor: "#EF4444", paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10, marginBottom: 12 }}>
                  <Text style={{ color: "#fff", fontSize: 13, fontWeight: "600", textAlign: "center" }}>
                    ✕ {errorMessage}
                  </Text>
                </View>
              )}


              {!deepLinkToken && (
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputIcon}>🔑</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Güvenlik Kodu"
                    placeholderTextColor="rgba(255,255,255,0.6)"
                    value={token}
                    onChangeText={(val) => {
                      setToken(val);
                      setErrorMessage("");
                    }}
                    autoCapitalize="none"
                  />
                </View>
              )}


              <View style={styles.inputWrapper}>
                <Text style={styles.inputIcon}>🔒</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Yeni Şifre (en az 6 karakter)"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  secureTextEntry
                  value={newPassword}
                  onChangeText={(val) => {
                    setNewPassword(val);
                    setPasswordError("");
                  }}
                />
              </View>


              <View style={styles.inputWrapper}>
                <Text style={styles.inputIcon}>🔐</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Yeni Şifre (Tekrar)"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={(val) => {
                    setConfirmPassword(val);
                    setPasswordError("");
                  }}
                />
              </View>

              {/* Şifre Hatası */}
              {passwordError !== "" && (
                <Text style={{ color: "#EF4444", fontSize: 12, fontWeight: "600", marginTop: -4, marginBottom: 8, marginLeft: 4 }}>
                  {passwordError}
                </Text>
              )}


              <TouchableOpacity
                style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                onPress={handleResetPassword}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>ŞİFREYİ GÜNCELLE</Text>
                )}
              </TouchableOpacity>


              <TouchableOpacity style={{ marginTop: 20 }} onPress={() => navigation.navigate("Login" as never)}>
                <Text style={{ color: '#ccc', textAlign: 'center' }}>Giriş Ekranına Dön</Text>
              </TouchableOpacity>

            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default ResetPasswordScreen;