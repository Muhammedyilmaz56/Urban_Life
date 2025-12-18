import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  FlatList,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../../config";
import styles from "../../styles/AddWorkerStyles";
import client from "../../api/client";
type Category = { id: number; name: string };

const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

export default function AddWorkerScreen({ navigation }: any) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [categoryName, setCategoryName] = useState<string>("Seçiniz");

  const [pickerOpen, setPickerOpen] = useState(false);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const canSave = useMemo(() => {
    return (
      fullName.trim().length >= 3 &&
      email.trim().length >= 5 &&
      password.trim().length >= 4 &&
      !!categoryId &&
      !saving
    );
  }, [fullName, email, password, categoryId, saving]);

  const loadCategories = useCallback(async () => {
    try {
      const headers = await getAuthHeaders();
      const res = await client.get(`${BASE_URL}/official/categories`, { headers });

      const list: Category[] = res.data || [];
      setCategories(list);

      if (list.length) {
        setCategoryId(list[0].id);
        setCategoryName(list[0].name);
      } else {
        setCategoryName("Kategori Yok");
      }
    } catch (e: any) {
      Alert.alert("Hata", e?.response?.data?.detail ?? "Kategoriler yüklenirken hata oluştu.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const selectCategory = (c: Category) => {
    setCategoryId(c.id);
    setCategoryName(c.name);
    setPickerOpen(false);
  };

  const onSave = async () => {
    if (!canSave) return;

    setSaving(true);
    try {
      const headers = await getAuthHeaders();
      await client.post(
        `${BASE_URL}/workers`,
        {
          full_name: fullName.trim(),
          phone: phone.trim() || null,
          email: email.trim(),
          password: password.trim(),
          category_id: categoryId,
        },
        { headers }
      );

      Alert.alert("Başarılı", "Yeni personel sisteme eklendi.", [
          { text: "Tamam", onPress: () => navigation.goBack() }
      ]);
    } catch (e: any) {
      Alert.alert("Hata", e?.response?.data?.detail ?? "İşlem başarısız oldu.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1e3a8a" />
        <Text style={styles.loadingText}>Form hazırlanıyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : undefined} 
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
            
            <Text style={styles.headerTitle}>Yeni Personel</Text>
            <Text style={styles.headerSubtitle}>Sisteme yeni bir saha personeli ekleyin.</Text>

            <View style={styles.formContainer}>
                <Text style={styles.label}>Ad Soyad</Text>
                <TextInput
                    value={fullName}
                    onChangeText={setFullName}
                    placeholder="Örn: Ahmet Yılmaz"
                    placeholderTextColor="#94a3b8"
                    style={styles.input}
                />

                <Text style={styles.label}>Telefon (Opsiyonel)</Text>
                <TextInput
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="05xxxxxxxxx"
                    placeholderTextColor="#94a3b8"
                    style={styles.input}
                    keyboardType="phone-pad"
                />

                <Text style={styles.label}>E-Posta Adresi</Text>
                <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="personel@belediye.bel.tr"
                    placeholderTextColor="#94a3b8"
                    style={styles.input}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />

                <Text style={styles.label}>Giriş Şifresi</Text>
                <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="En az 4 karakter"
                    placeholderTextColor="#94a3b8"
                    style={styles.input}
                    secureTextEntry
                />

                <Text style={styles.label}>Görev Kategorisi</Text>
                <TouchableOpacity style={styles.selectBtn} onPress={() => setPickerOpen(true)} activeOpacity={0.7}>
                    <Text style={styles.selectText}>{categoryName}</Text>
                    <Text style={styles.selectIcon}>▼</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.saveBtn, !canSave && styles.saveBtnDisabled]}
                    onPress={onSave}
                    disabled={!canSave}
                    activeOpacity={0.8}
                >
                    {saving ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text style={styles.saveText}>Personeli Kaydet</Text>
                    )}
                </TouchableOpacity>
            </View>

        </ScrollView>
      </KeyboardAvoidingView>

      {/* KATEGORİ SEÇİM MODALI */}
      <Modal visible={pickerOpen} transparent animationType="fade" onRequestClose={() => setPickerOpen(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setPickerOpen(false)}>
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <Text style={styles.modalTitle}>Kategori Seçiniz</Text>

            <FlatList
              data={categories}
              keyExtractor={(it) => String(it.id)}
              contentContainerStyle={styles.modalListContent}
              renderItem={({ item }) => (
                <TouchableOpacity 
                    style={[styles.modalItem, categoryId === item.id && styles.modalItemSelected]} 
                    onPress={() => selectCategory(item)}
                >
                  <Text style={[styles.modalItemText, categoryId === item.id && styles.modalItemTextSelected]}>
                      {item.name}
                  </Text>
                  {categoryId === item.id && <Text style={{color: '#1e3a8a'}}>✓</Text>}
                </TouchableOpacity>
              )}
              ListEmptyComponent={<Text style={styles.emptyText}>Tanımlı kategori bulunamadı.</Text>}
            />

            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setPickerOpen(false)}>
              <Text style={styles.modalCloseText}>Kapat</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}