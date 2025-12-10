import React, { useState, useEffect } from "react";
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


import { ModernResetPasswordStyles as styles } from "../styles/ModernResetPasswordStyles";


const BG_IMAGE = "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=2070&auto=format&fit=crop";

type Props = NativeStackScreenProps<any, "ResetPassword">;

const ResetPasswordScreen: React.FC<Props> = ({ navigation, route }) => {
  const deepLinkToken = route.params?.token;

  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (deepLinkToken) {
      setToken(deepLinkToken);
    }
  }, [deepLinkToken]);

  const handleResetPassword = async () => {
    if (!token) {
      Alert.alert("Eksik Bilgi", "Token bulunamadı. Lütfen e-postanızdaki linke tekrar tıklayın veya token'ı manuel girin.");
      return;
    }
    if (!newPassword || !confirmPassword) {
      Alert.alert("Uyarı", "Lütfen tüm alanları doldurun.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Hata", "Girdiğiniz şifreler birbiriyle eşleşmiyor.");
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${BASE_URL}/auth/reset-password`, {
        token: token,
        new_password: newPassword,
      });

      Alert.alert("Başarılı", "Şifreniz başarıyla güncellendi.", [
        {
          text: "Giriş Yap",
          onPress: () => navigation.navigate("Login" as never),
        },
      ]);
    } catch (err: any) {
      console.error("RESET PASSWORD ERROR:", err.response?.data || err.message);
      Alert.alert("Hata", err.response?.data?.detail || "Şifre sıfırlama işlemi başarısız oldu.");
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
                  : "Lütfen e-postanızdaki güvenlik kodunu (token) girin."}
              </Text>

              
              {!deepLinkToken && (
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputIcon}>🔑</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Güvenlik Token'ı"
                    placeholderTextColor="rgba(255,255,255,0.6)"
                    value={token}
                    onChangeText={setToken}
                    autoCapitalize="none"
                  />
                </View>
              )}

             
              <View style={styles.inputWrapper}>
                <Text style={styles.inputIcon}>🔒</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Yeni Şifre"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  secureTextEntry
                  value={newPassword}
                  onChangeText={setNewPassword}
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
                  onChangeText={setConfirmPassword}
                />
              </View>

             
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
              
              
              <TouchableOpacity style={{marginTop: 20}} onPress={() => navigation.navigate("Login" as never)}>
                  <Text style={{color: '#ccc', textAlign: 'center'}}>Giriş Ekranına Dön</Text>
              </TouchableOpacity>

            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default ResetPasswordScreen;