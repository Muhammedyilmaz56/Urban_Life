import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Switch,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../../config";
import styles from "../../styles/CategoriesStyles";

type Category = {
  id: number;
  name: string;
  description?: string | null;
  is_active: boolean;
};

const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

export default function CategoriesScreen() {
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const canSave = useMemo(
    () => name.trim().length >= 2 && !saving,
    [name, saving]
  );

  const load = useCallback(async () => {
    try {
      const headers = await getAuthHeaders();
      const res = await axios.get(`${BASE_URL}/official/categories`, { headers });
      setItems(res.data);
    } catch (e: any) {
      Alert.alert("Hata", e?.response?.data?.detail ?? "Kategoriler alınamadı.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const onCreate = async () => {
    if (!canSave) return;
    setSaving(true);
    try {
      const headers = await getAuthHeaders();
      await axios.post(
        `${BASE_URL}/official/categories`,
        {
          name: name.trim(),
          description: description.trim() || null,
          is_active: isActive,
        },
        { headers }
      );
      setName("");
      setDescription("");
      setIsActive(true);
      await load();
    } catch (e: any) {
      Alert.alert("Hata", e?.response?.data?.detail ?? "Kategori oluşturulamadı.");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = (cat: Category) => {
    Alert.alert(
      "Kategori silinsin mi?",
      `"${cat.name}" silinecek.`,
      [
        { text: "Vazgeç", style: "cancel" },
        {
          text: "Sil",
          style: "destructive",
          onPress: async () => {
            try {
              const headers = await getAuthHeaders();
              await axios.delete(`${BASE_URL}/official/categories/${cat.id}`, { headers });
              await load();
            } catch (e: any) {
              Alert.alert("Hata", e?.response?.data?.detail ?? "Kategori silinemedi.");
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Category }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.name}</Text>

      {!!item.description && (
        <Text style={styles.cardDescription}>{item.description}</Text>
      )}

      <Text style={item.is_active ? styles.active : styles.passive}>
        {item.is_active ? "Aktif" : "Pasif"}
      </Text>

      <TouchableOpacity style={styles.deleteBtn} onPress={() => onDelete(item)}>
        <Text style={styles.deleteText}>Sil</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={styles.loadingText}>Kategoriler yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
     
      <View style={styles.createBox}>
        <Text style={styles.sectionTitle}>Yeni Kategori</Text>

        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Kategori adı"
          placeholderTextColor="#7a7a7a"
          style={styles.input}
        />

        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Açıklama (opsiyonel)"
          placeholderTextColor="#7a7a7a"
          style={styles.input}
        />

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Aktif</Text>
          <Switch value={isActive} onValueChange={setIsActive} />
        </View>

        <TouchableOpacity
          style={[styles.saveBtn, !canSave && styles.saveBtnDisabled]}
          onPress={onCreate}
          disabled={!canSave}
        >
          <Text style={styles.saveText}>
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        keyExtractor={(it) => String(it.id)}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>Henüz kategori yok.</Text>
        }
      />
    </View>
  );
}
