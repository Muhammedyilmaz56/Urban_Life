import React, { useState, useLayoutEffect } from "react";
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
import { ModernForgotPasswordStyles as styles } from "../../styles/ModernForgotPasswordStyles";
import client from "../../api/client";

const BG_IMAGE =
  "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=2000&auto=format&fit=crop";

type Props = NativeStackScreenProps<any, "ForgotPassword">;

const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Inline mesajlar
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const handleForgotPassword = async () => {
    setSuccessMessage("");
    setErrorMessage("");

    if (!email.trim()) {
      setErrorMessage("Lütfen e-posta adresinizi girin.");
      return;
    }

    // Basit e-posta formatı kontrolü
    if (!email.includes("@") || !email.includes(".")) {
      setErrorMessage("Geçerli bir e-posta adresi girin.");
      return;
    }

    try {
      setLoading(true);
      await client.post(`${BASE_URL}/auth/forgot-password`, { email });

      setSuccessMessage("Şifre sıfırlama linki e-posta adresinize gönderildi. Lütfen gelen kutunuzu kontrol edin.");
      setTimeout(() => {
        navigation.navigate("Login" as never);
      }, 3000);
    } catch (err: any) {
      const detail = err.response?.data?.detail || err.response?.data?.message || "";
      const detailLower = String(detail).toLowerCase();

      if (detailLower.includes("not found") || detailLower.includes("bulunamadı") || detailLower.includes("does not exist")) {
        setErrorMessage("Bu e-posta adresi ile kayıtlı bir hesap bulunamadı.");
      } else if (detailLower.includes("invalid") || detailLower.includes("geçersiz")) {
        setErrorMessage("Geçersiz e-posta formatı.");
      } else if (detailLower.includes("too many") || detailLower.includes("limit")) {
        setErrorMessage("Çok fazla deneme yaptınız. Lütfen birkaç dakika bekleyin.");
      } else if (detail) {
        setErrorMessage(detail);
      } else {
        setErrorMessage("İşlem başarısız oldu. Lütfen tekrar deneyin.");
      }
    } finally {
      setLoading(false);
    }
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
                <Text style={styles.appSubtitle}>Hesap Erişimi</Text>
              </View>

              <View style={styles.glassFormContainer}>
                <Text style={styles.formTitle}>Şifremi Unuttum</Text>

                <Text style={styles.infoText}>
                  Kayıtlı e-posta adresinizi girin. Size şifrenizi sıfırlamanız
                  için güvenli bir bağlantı göndereceğiz.
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

                <View style={styles.inputWrapper}>
                  <Text style={styles.inputIcon}>✉️</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="E-posta Adresi"
                    placeholderTextColor="rgba(255,255,255,0.6)"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={(val) => {
                      setEmail(val);
                      setErrorMessage("");
                    }}
                  />
                </View>

                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    loading && styles.submitButtonDisabled,
                  ]}
                  onPress={handleForgotPassword}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.submitButtonText}>LİNK GÖNDER</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => navigation.navigate("Login" as never)}
                >
                  <Text style={styles.backButtonText}>Giriş Ekranına Dön</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </View>
  );
};

export default ForgotPasswordScreen;