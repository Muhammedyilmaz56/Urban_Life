import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { BASE_URL } from "../../config";
import { RegisterStyles as styles } from "../../styles/RegisterStyles";
import client from "../../api/client";

const BG_IMAGE =
  "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=2000&auto=format&fit=crop";

export default function RegisterScreen({ navigation }: any) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Hata state'leri
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const clearErrors = () => {
    setNameError("");
    setEmailError("");
    setPasswordError("");
    setGeneralError("");
  };

  const handleRegister = async () => {
    clearErrors();
    setSuccessMessage("");
    let hasError = false;

    if (!name.trim()) {
      setNameError("Ad Soyad zorunludur.");
      hasError = true;
    }
    if (!email.trim()) {
      setEmailError("Email adresi zorunludur.");
      hasError = true;
    }
    if (!password.trim()) {
      setPasswordError("Şifre zorunludur.");
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);
    try {
      await client.post(`${BASE_URL}/auth/register`, {
        name,
        email,
        password,
        role: "citizen",
      });

      setSuccessMessage("Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...");
      setTimeout(() => {
        setLoading(false);
        navigation.navigate("Login");
      }, 1500);
    } catch (err: any) {
      setLoading(false);
      const detail = err.response?.data?.detail || err.response?.data?.message || "";
      const detailLower = String(detail).toLowerCase();

      // E-posta hataları
      if (detailLower.includes("email") && (detailLower.includes("already") || detailLower.includes("exists") || detailLower.includes("kayıtlı") || detailLower.includes("registered"))) {
        setEmailError("Bu e-posta adresi zaten kayıtlı.");
      } else if (detailLower.includes("email") && (detailLower.includes("invalid") || detailLower.includes("geçersiz"))) {
        setEmailError("Geçerli bir e-posta adresi girin.");
      }
      // Şifre hataları
      else if (detailLower.includes("password") && (detailLower.includes("short") || detailLower.includes("kısa"))) {
        setPasswordError("Şifre en az 6 karakter olmalı.");
      } else if (detailLower.includes("password") && (detailLower.includes("weak") || detailLower.includes("zayıf"))) {
        setPasswordError("Şifre çok zayıf. Daha güçlü bir şifre seçin.");
      }
      // İsim hataları
      else if (detailLower.includes("name") && (detailLower.includes("short") || detailLower.includes("kısa"))) {
        setNameError("Ad Soyad en az 2 karakter olmalı.");
      }
      // Genel hatalar
      else if (detail) {
        setGeneralError(detail);
      } else {
        setGeneralError("Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.");
      }
    }
  };

  // Hata stili
  const errorStyle = {
    color: "#EF4444",
    fontSize: 12,
    fontWeight: "600" as const,
    marginTop: 4,
    marginLeft: 4,
  };

  const successStyle = {
    color: "#10B981",
    fontSize: 13,
    fontWeight: "600" as const,
    textAlign: "center" as const,
    marginBottom: 8,
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#1a1a2e" }}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      {/* Loading overlay while image loads */}
      {imageLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
      )}

      <ImageBackground
        source={{ uri: BG_IMAGE }}
        style={styles.background}
        resizeMode="cover"
        onLoadEnd={() => setImageLoading(false)}
      >
        <TouchableOpacity
          style={styles.backButtonAbsolute}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonIcon}>‹</Text>
        </TouchableOpacity>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            bounces={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.overlay}>
              <View style={styles.headerContainer}>
                <Text style={styles.appTitle}>CityFlow</Text>
                <Text style={styles.appSubtitle}>Aramıza Katılın.</Text>
              </View>

              <View style={styles.glassFormContainer}>
                <Text style={styles.formTitle}>Yeni Hesap Oluştur</Text>

                {/* Success Message */}
                {successMessage !== "" && (
                  <Text style={successStyle}>{successMessage}</Text>
                )}

                {/* General Error */}
                {generalError !== "" && (
                  <Text style={{
                    color: "#EF4444",
                    fontSize: 13,
                    fontWeight: "600",
                    textAlign: "center",
                    marginBottom: 8,
                  }}>
                    {generalError}
                  </Text>
                )}

                <View style={styles.inputWrapper}>
                  <Text style={styles.inputIcon}>👤</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Ad Soyad"
                    placeholderTextColor="rgba(255,255,255,0.6)"
                    value={name}
                    onChangeText={(val) => {
                      setName(val);
                      setNameError("");
                    }}
                  />
                </View>
                {nameError !== "" && <Text style={errorStyle}>{nameError}</Text>}

                <View style={styles.inputWrapper}>
                  <Text style={styles.inputIcon}>✉️</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Email Adresi"
                    placeholderTextColor="rgba(255,255,255,0.6)"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={(val) => {
                      setEmail(val);
                      setEmailError("");
                    }}
                  />
                </View>
                {emailError !== "" && <Text style={errorStyle}>{emailError}</Text>}

                <View style={styles.inputWrapper}>
                  <Text style={styles.inputIcon}>🔒</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Şifre"
                    placeholderTextColor="rgba(255,255,255,0.6)"
                    secureTextEntry
                    value={password}
                    onChangeText={(val) => {
                      setPassword(val);
                      setPasswordError("");
                    }}
                  />
                </View>
                {passwordError !== "" && <Text style={errorStyle}>{passwordError}</Text>}

                <TouchableOpacity
                  style={[
                    styles.registerButton,
                    loading && styles.registerButtonDisabled,
                  ]}
                  onPress={handleRegister}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.registerButtonText}>KAYIT OL</Text>
                  )}
                </TouchableOpacity>

                <View style={styles.loginLinkContainer}>
                  <Text style={styles.loginLinkText}>
                    Zaten hesabın var mı?{" "}
                  </Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("Login")}
                  >
                    <Text style={styles.loginLink}>Giriş Yap</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </View>
  );
}
