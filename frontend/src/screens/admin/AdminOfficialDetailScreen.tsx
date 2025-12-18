import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Alert,
  ActivityIndicator,
  ScrollView,
  Switch,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import styles from "../../styles/AdminOfficialDetailStyles";
import { adminApi } from "../../api/admin";

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
      Alert.alert("Hata", "Yönetici ID bulunamadı");
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
      Alert.alert("Başarılı", "Bilgiler güncellendi.");
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
      val
        ? "Bu yöneticiyi aktif etmek istiyor musun?"
        : "Bu yöneticiyi pasifleştirmek istiyor musun?",
      [
        { text: "Vazgeç", style: "cancel", onPress: () => setIsActive(!val) },
        { text: "Evet", onPress: () => setIsActive(val) },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B3A6A" />

      {/* TOP BAR */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backTxt}>‹</Text>
        </TouchableOpacity>

        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={styles.title}>Yönetici Detay</Text>
          <Text style={styles.subtitle}>Bilgileri düzenle / pasifleştir</Text>
        </View>

        <View style={{ width: 44 }} />
      </View>

      {loading ? (
        <View style={{ paddingTop: 40 }}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Hesap Bilgileri</Text>

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
              placeholderTextColor="rgba(100,116,139,0.9)"
              value={fullName}
              onChangeText={setFullName}
            />

            <Text style={styles.label}>Telefon</Text>
            <TextInput
              style={styles.input}
              placeholder="05xx xxx xx xx"
              placeholderTextColor="rgba(100,116,139,0.9)"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />

            <View style={styles.switchRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.switchTitle}>Hesap Durumu</Text>
                <Text style={styles.switchSub}>
                  {isActive ? "Hesap aktif" : "Hesap pasif (giriş engellenir)"}
                </Text>
              </View>
              <Switch value={isActive} onValueChange={confirmToggle} />
            </View>

            <TouchableOpacity
              style={[styles.saveBtn, saving && styles.btnDisabled]}
              onPress={save}
              disabled={saving}
              activeOpacity={0.9}
            >
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveTxt}>Kaydet</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={{ height: 90 }} />
        </ScrollView>
      )}
    </View>
  );
}
