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
  StatusBar,
  Keyboard,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../../config";
import styles from "../../styles/CategoriesStyles";
import client from "../../api/client";
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

  // Kaydet butonu aktiflik kontrolü
  const canSave = useMemo(
    () => name.trim().length >= 2 && !saving,
    [name, saving]
  );

  const load = useCallback(async () => {
    try {
      const headers = await getAuthHeaders();
      const res = await client.get(`${BASE_URL}/official/categories`, { headers });
      setItems(res.data);
    } catch (e: any) {
      Alert.alert("Hata", e?.response?.data?.detail ?? "Kategoriler yüklenirken sorun oluştu.");
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
    
    // Klavyeyi kapat
    Keyboard.dismiss();
    setSaving(true);
    
    try {
      const headers = await getAuthHeaders();
      await client.post(
        `${BASE_URL}/official/categories`,
        {
          name: name.trim(),
          description: description.trim() || null,
          is_active: isActive,
        },
        { headers }
      );
      
      // Formu sıfırla
      setName("");
      setDescription("");
      setIsActive(true);
      
      Alert.alert("Başarılı", "Yeni kategori sisteme eklendi.");
      await load();
    } catch (e: any) {
      Alert.alert("Hata", e?.response?.data?.detail ?? "Kategori oluşturulamadı.");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = (cat: Category) => {
    Alert.alert(
      "Kategori Silinecek",
      `"${cat.name}" kategorisini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`,
      [
        { text: "Vazgeç", style: "cancel" },
        {
          text: "Evet, Sil",
          style: "destructive",
          onPress: async () => {
            try {
              const headers = await getAuthHeaders();
              await axios.delete(`${BASE_URL}/official/categories/${cat.id}`, { headers });
              await load();
            } catch (e: any) {
              Alert.alert("Hata", e?.response?.data?.detail ?? "Silme işlemi başarısız.");
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Category }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <View style={[styles.statusBadge, item.is_active ? styles.activeBadge : styles.passiveBadge]}>
                <Text style={[styles.statusText, item.is_active ? styles.activeText : styles.passiveText]}>
                    {item.is_active ? "AKTİF" : "PASİF"}
                </Text>
            </View>
        </View>
        
        {item.description ? (
          <Text style={styles.cardDescription} numberOfLines={2}>
            {item.description}
          </Text>
        ) : (
           <Text style={[styles.cardDescription, { fontStyle: 'italic', opacity: 0.7 }]}>
            Açıklama yok
          </Text>
        )}
      </View>

      <TouchableOpacity 
        style={styles.deleteBtn} 
        activeOpacity={0.7}
        onPress={() => onDelete(item)}
      >
        <Text style={styles.deleteText}>Sil</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1e3a8a" />
        <Text style={styles.loadingText}>Veriler hazırlanıyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      
      <FlatList
        data={items}
        keyExtractor={(it) => String(it.id)}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#1e3a8a" />
        }
        ListHeaderComponent={
            <View style={styles.createBox}>
                <Text style={styles.sectionTitle}>📂 Kategori Yönetimi</Text>
        
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Kategori Adı (Örn: Park ve Bahçeler)"
                  placeholderTextColor="#94a3b8"
                  style={styles.input}
                />
        
                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Kısa açıklama (Opsiyonel)"
                  placeholderTextColor="#94a3b8"
                  style={[styles.input, { minHeight: 60, textAlignVertical: 'top' }]}
                  multiline
                />
        
                <View style={styles.switchRow}>
                  <Text style={styles.switchLabel}>Durum: {isActive ? "Aktif" : "Pasif"}</Text>
                  <Switch 
                    value={isActive} 
                    onValueChange={setIsActive} 
                    trackColor={{ false: "#e2e8f0", true: "#bfdbfe" }}
                    thumbColor={isActive ? "#1e3a8a" : "#94a3b8"}
                  />
                </View>
        
                <TouchableOpacity
                  style={[styles.saveBtn, !canSave && styles.saveBtnDisabled]}
                  onPress={onCreate}
                  disabled={!canSave}
                  activeOpacity={0.8}
                >
                  <Text style={styles.saveText}>
                    {saving ? "İşleniyor..." : "Kategoriyi Kaydet"}
                  </Text>
                </TouchableOpacity>
              </View>
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>Sistemde kayıtlı kategori bulunmamaktadır.</Text>
        }
      />
    </View>
  );
}