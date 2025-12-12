import React, { useState, useContext } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BASE_URL } from "../config";

import LoginStyles from "../styles/LoginStyles";
import { AuthContext } from "../../App"; 

const BG_IMAGE =
  "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=2070&auto=format&fit=crop";

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const auth = useContext(AuthContext); 

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Uyarı", "Lütfen email ve şifrenizi giriniz.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, {
        email,
        password,
      });

      const token = response.data.access_token;
      await AsyncStorage.setItem("token", token);

      const meResponse = await axios.get(`${BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userData = meResponse.data;

      await AsyncStorage.setItem("user", JSON.stringify(userData));


      auth?.setUser(userData);
      console.log("Login başarılı, kullanıcı:", userData);

      setLoading(false);

 

    } catch (err: any) {
      setLoading(false);
      console.error("LOGIN ERROR:", err?.response?.data || err.message);
      Alert.alert("Giriş Başarısız", "Email veya şifre hatalı.");
    }
  };

  return (
    <ImageBackground
      source={{ uri: BG_IMAGE }}
      style={LoginStyles.background}
      resizeMode="cover"
    >
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={LoginStyles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={LoginStyles.scrollContainer}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={LoginStyles.overlay}>
            <View style={LoginStyles.headerContainer}>
              <Text style={LoginStyles.appTitle}>CityFlow</Text>
              <Text style={LoginStyles.appSubtitle}>
                Şehrin kontrolü sende.
              </Text>
            </View>

            <View style={LoginStyles.glassFormContainer}>
              <Text style={LoginStyles.formTitle}>Giriş Yap</Text>

              <View style={LoginStyles.inputWrapper}>
                <Text style={LoginStyles.inputIcon}>✉️</Text>
                <TextInput
                  style={LoginStyles.input}
                  placeholder="Email Adresi"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              <View style={LoginStyles.inputWrapper}>
                <Text style={LoginStyles.inputIcon}>🔒</Text>
                <TextInput
                  style={LoginStyles.input}
                  placeholder="Şifre"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>

              <TouchableOpacity
                style={LoginStyles.forgotPasswordContainer}
                onPress={() => navigation.navigate("ForgotPassword" as never)}
              >
                <Text style={LoginStyles.forgotPasswordText}>
                  Şifremi unuttum?
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  LoginStyles.loginButton,
                  loading && LoginStyles.loginButtonDisabled,
                ]}
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={LoginStyles.loginButtonText}>GİRİŞ YAP</Text>
                )}
              </TouchableOpacity>

              <View style={LoginStyles.registerContainer}>
                <Text style={LoginStyles.registerText}>
                  Hesabın yok mu?{" "}
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Register")}
                >
                  <Text style={LoginStyles.registerLink}>Kayıt Ol</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
