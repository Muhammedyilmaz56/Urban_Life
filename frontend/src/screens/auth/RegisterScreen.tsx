import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { BASE_URL } from "../../config";
import { RegisterStyles as styles } from "../../styles/RegisterStyles";

const BG_IMAGE = "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=2000&auto=format&fit=crop";

export default function RegisterScreen({ navigation }: any) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Uyarı", "Lütfen tüm alanları doldurun.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${BASE_URL}/auth/register`, {
        name,
        email,
        password,
        role: "citizen",
      });

      Alert.alert("Başarılı!", "Kayıt işleminiz tamamlandı. Lütfen giriş yapın.");
      setTimeout(() => {
          setLoading(false);
          navigation.navigate("Login");
      }, 500);

    } catch (err: any) {
      setLoading(false);
      const errorMessage = err.response?.data?.message || err.response?.data?.detail || "Kayıt sırasında bir hata oluştu.";
      Alert.alert("Hata", errorMessage);
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
              <Text style={styles.appSubtitle}>Aramıza Katılın.</Text>
            </View>

            <View style={styles.glassFormContainer}>
              <Text style={styles.formTitle}>Yeni Hesap Oluştur</Text>
              
              <View style={styles.inputWrapper}>
                <Text style={styles.inputIcon}>👤</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ad Soyad"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  value={name}
                  onChangeText={setName}
                />
              </View>

              <View style={styles.inputWrapper}>
                <Text style={styles.inputIcon}>✉️</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Email Adresi"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              <View style={styles.inputWrapper}>
                <Text style={styles.inputIcon}>🔒</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Şifre"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>

              <TouchableOpacity 
                style={[styles.registerButton, loading && styles.registerButtonDisabled]} 
                onPress={handleRegister}
                disabled={loading}
              >
                 {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.registerButtonText}>KAYIT OL</Text>}
              </TouchableOpacity>

              <View style={styles.loginLinkContainer}>
                <Text style={styles.loginLinkText}>Zaten hesabın var mı? </Text>
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                  <Text style={styles.loginLink}>Giriş Yap</Text>
                </TouchableOpacity>
              </View>

            </View> 
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}