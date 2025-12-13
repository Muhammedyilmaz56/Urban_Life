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
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../../config";
import styles from "../../styles/AddWorkerStyles";

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
  const [categoryName, setCategoryName] = useState<string>("Kategori seç");

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
      const res = await axios.get(`${BASE_URL}/official/categories`, { headers });

      const list: Category[] = res.data || [];
      setCategories(list);

      if (list.length) {
        setCategoryId(list[0].id);
        setCategoryName(list[0].name);
      }
    } catch (e: any) {
      Alert.alert("Hata", e?.response?.data?.detail ?? "Kategoriler alınamadı.");
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
      await axios.post(
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

      Alert.alert("Başarılı", "İşçi eklendi.");
      navigation.goBack();
    } catch (e: any) {
      Alert.alert("Hata", e?.response?.data?.detail ?? "İşçi eklenemedi.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>İşçi Ekle</Text>

      <Text style={styles.label}>Ad Soyad</Text>
      <TextInput
        value={fullName}
        onChangeText={setFullName}
        placeholder="Örn: Ali Veli"
        placeholderTextColor="#7a7a7a"
        style={styles.input}
      />

      <Text style={styles.label}>Telefon (opsiyonel)</Text>
      <TextInput
        value={phone}
        onChangeText={setPhone}
        placeholder="05xx..."
        placeholderTextColor="#7a7a7a"
        style={styles.input}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>E-posta</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="ali@site.com"
        placeholderTextColor="#7a7a7a"
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Text style={styles.label}>Şifre</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="En az 4 karakter"
        placeholderTextColor="#7a7a7a"
        style={styles.input}
        secureTextEntry
      />

      <Text style={styles.label}>Kategori</Text>
      <TouchableOpacity style={styles.selectBtn} onPress={() => setPickerOpen(true)}>
        <Text style={styles.selectText}>{categoryName}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.saveBtn, !canSave && styles.saveBtnDisabled]}
        onPress={onSave}
        disabled={!canSave}
      >
        <Text style={styles.saveText}>{saving ? "Kaydediliyor..." : "Kaydet"}</Text>
      </TouchableOpacity>

     
      <Modal visible={pickerOpen} transparent animationType="fade" onRequestClose={() => setPickerOpen(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setPickerOpen(false)}>
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <Text style={styles.modalTitle}>Kategori Seç</Text>

            <FlatList
              data={categories}
              keyExtractor={(it) => String(it.id)}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.modalItem} onPress={() => selectCategory(item)}>
                  <Text style={styles.modalItemText}>{item.name}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={<Text style={styles.emptyText}>Kategori yok.</Text>}
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
