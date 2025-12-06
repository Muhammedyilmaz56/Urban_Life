import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ImageBackground,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import axios from "axios";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BASE_URL } from "../config";
import { ModernForgotPasswordStyles as styles } from "../styles/ModernForgotPasswordStyles";

const BG_IMAGE = "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=2000&auto=format&fit=crop";

type Props = NativeStackScreenProps<any, "ForgotPassword">;

const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      Alert.alert("Eksik Bilgi", "Lütfen e-posta adresinizi girin.");
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${BASE_URL}/auth/forgot-password`, { email });

      Alert.alert(
        "Bağlantı Gönderildi 🚀",
        "E-posta adresinize şifre sıfırlama linki gönderildi.",
        [{ text: "Tamam", onPress: () => navigation.navigate("Login" as never) }]
      );
    } catch (err: any) {
      console.error(err);
      Alert.alert("Hata", "İşlem başarısız. Lütfen e-posta adresinizi kontrol edin.");
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
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardView}
      >
        <ScrollView 
            contentContainerStyle={styles.scrollContainer} 
            showsVerticalScrollIndicator={false}
            bounces={false}
        >
          <View style={styles.overlay}>

            <View style={styles.headerContainer}>
              <Text style={styles.appTitle}>CityFlow</Text>
              <Text style={styles.appSubtitle}>Hesap Erişimi</Text>
            </View>

            <View style={styles.glassFormContainer}>
              <Text style={styles.formTitle}>Şifremi Unuttum</Text>
              
              <Text style={styles.infoText}>
                Kayıtlı e-posta adresinizi girin. Size şifrenizi sıfırlamanız için güvenli bir bağlantı göndereceğiz.
              </Text>

              <View style={styles.inputWrapper}>
                <Text style={styles.inputIcon}>✉️</Text>
                <TextInput
                  style={styles.input}
                  placeholder="E-posta Adresi"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              <TouchableOpacity 
                style={[styles.submitButton, loading && styles.submitButtonDisabled]} 
                onPress={handleForgotPassword} 
                disabled={loading}
              >
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>LİNK GÖNDER</Text>}
              </TouchableOpacity>

              <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Login" as never)}>
                <Text style={styles.backButtonText}>Giriş Ekranına Dön</Text>
              </TouchableOpacity>

            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default ForgotPasswordScreen;