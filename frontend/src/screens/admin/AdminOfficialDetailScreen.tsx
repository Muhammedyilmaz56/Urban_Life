import React, { useEffect, useLayoutEffect, useState } from "react";
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
  Switch,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import styles from "../../styles/AdminOfficialDetailStyles";
import { adminApi } from "../../api/admin";

const BG_IMAGE =
  "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=2070&auto=format&fit=crop";

export default function AdminOfficialDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const officialId = route?.params?.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isActive, setIsActive] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const load = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getOfficial(Number(officialId));

      setFullName(data?.full_name ?? "");
      setEmail(data?.email ?? "");
      setPhoneNumber(data?.phone_number ?? "");
      setIsActive(Boolean(data?.is_active));
    } catch (e: any) {
      Alert.alert("Hata", e?.response?.data?.detail || "Detay alınamadı");
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!officialId) {
      Alert.alert("Hata", "Official id yok");
      navigation.goBack();
      return;
    }
    load();
  }, [officialId]);

  const save = async () => {
    const fn = fullName.trim();
    const ph = phoneNumber.trim();

    if (!fn) {
      Alert.alert("Eksik bilgi", "Ad Soyad boş olamaz.");
      return;
    }

    try {
      setSaving(true);
      await adminApi.updateOfficial(Number(officialId), {
        full_name: fn,
        phone_number: ph ? ph : "",
        is_active: isActive,
      });
      Alert.alert("Başarılı", "Güncellendi.");
      await load();
    } catch (e: any) {
      Alert.alert("Hata", e?.response?.data?.detail || "Güncelleme başarısız");
    } finally {
      setSaving(false);
    }
  };

  const confirmToggle = (val: boolean) => {
    Alert.alert(
      "Onay",
      val ? "Bu yöneticiyi aktif etmek istiyor musun?" : "Bu yöneticiyi pasifleştirmek istiyor musun?",
      [
        { text: "İptal", style: "cancel", onPress: () => setIsActive(!val) },
        { text: "Evet", onPress: () => setIsActive(val) },
      ]
    );
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
            <Text style={styles.title}>Yönetici Detay</Text>
            <View style={{ width: 44 }} />
          </View>

          {loading ? (
            <View style={{ paddingTop: 30 }}>
              <ActivityIndicator />
            </View>
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.card}>
                <Text style={styles.label}>E-posta</Text>
                <TextInput
                  style={[styles.input, styles.inputDisabled]}
                  value={email}
                  editable={false}
                />

                <Text style={styles.label}>Ad Soyad</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ad Soyad"
                  placeholderTextColor="#bdbdbd"
                  value={fullName}
                  onChangeText={setFullName}
                />

                <Text style={styles.label}>Telefon</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Telefon"
                  placeholderTextColor="#bdbdbd"
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                />

                <View style={styles.switchRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.switchTitle}>Aktiflik</Text>
                    <Text style={styles.switchSub}>
                      {isActive ? "Hesap aktif" : "Hesap pasif (giriş engellenir)"}
                    </Text>
                  </View>
                  <Switch value={isActive} onValueChange={confirmToggle} />
                </View>

                <TouchableOpacity
                  style={[styles.saveBtn, saving && { opacity: 0.7 }]}
                  onPress={save}
                  disabled={saving}
                  activeOpacity={0.85}
                >
                  {saving ? <ActivityIndicator /> : <Text style={styles.saveTxt}>Kaydet</Text>}
                </TouchableOpacity>
              </View>

              <View style={{ height: 90 }} />
            </ScrollView>
          )}
        </View>
      </ImageBackground>
    </View>
  );
}
