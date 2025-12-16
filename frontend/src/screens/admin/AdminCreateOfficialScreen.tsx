import React, { useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  StatusBar,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import styles from "../../styles/AdminCreateOfficialStyles";
import { adminApi } from "../../api/admin";

const BG_IMAGE =
  "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=2070&auto=format&fit=crop";

export default function AdminCreateOfficialScreen() {
  const navigation = useNavigation<any>();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const submit = async () => {
    const fn = fullName.trim();
    const em = email.trim().toLowerCase();
    const ph = phoneNumber.trim();
    const pw = password;

    if (!fn || !em || !pw) {
      Alert.alert("Eksik bilgi", "Ad Soyad, E-posta ve Şifre zorunludur.");
      return;
    }
    if (!em.includes("@") || !em.includes(".")) {
      Alert.alert("Hatalı e-posta", "Geçerli bir e-posta gir.");
      return;
    }
    if (pw.length < 6) {
      Alert.alert("Zayıf şifre", "Şifre en az 6 karakter olmalı.");
      return;
    }

    try {
      setLoading(true);

      await adminApi.createOfficial({
        full_name: fn,
        email: em,
        password: pw,
        phone_number: ph ? ph : undefined,
      });

      Alert.alert("Başarılı", "Yönetici oluşturuldu.", [
        {
          text: "Tamam",
          onPress: () => {
            navigation.goBack();
          },
        },
      ]);
    } catch (e: any) {
      Alert.alert("Hata", e?.response?.data?.detail || "Oluşturma başarısız");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ImageBackground source={{ uri: BG_IMAGE }} style={styles.bg} resizeMode="cover">
        <View style={styles.overlay}>
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Text style={styles.backTxt}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Yönetici Ekle</Text>
            <View style={{ width: 44 }} />
          </View>

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{ flex: 1 }}
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.card}>
                <Text style={styles.label}>Ad Soyad</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Örn: Ahmet Yılmaz"
                  placeholderTextColor="#bdbdbd"
                  value={fullName}
                  onChangeText={setFullName}
                />

                <Text style={styles.label}>E-posta</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Örn: ahmet@belediye.com"
                  placeholderTextColor="#bdbdbd"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                />

                <Text style={styles.label}>Telefon (opsiyonel)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Örn: 05xx..."
                  placeholderTextColor="#bdbdbd"
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                />

                <Text style={styles.label}>Şifre</Text>
                <TextInput
                  style={styles.input}
                  placeholder="En az 6 karakter"
                  placeholderTextColor="#bdbdbd"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />

                <TouchableOpacity
                  style={[styles.submitBtn, loading && { opacity: 0.7 }]}
                  onPress={submit}
                  disabled={loading}
                  activeOpacity={0.85}
                >
                  {loading ? (
                    <ActivityIndicator />
                  ) : (
                    <Text style={styles.submitTxt}>Oluştur</Text>
                  )}
                </TouchableOpacity>

                <Text style={styles.hint}>
                  * Oluşturulan yönetici hesabı “official” rolü ile açılır.
                </Text>
              </View>

              <View style={{ height: 90 }} />
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </ImageBackground>
    </View>
  );
}
