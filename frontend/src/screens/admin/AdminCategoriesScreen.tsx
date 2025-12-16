import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";

import styles from "../../styles/AdminCategoriesStyles";
import { adminApi } from "../../api/admin";
import type { AdminCategory } from "../../api/admin";

export default function AdminCategoriesScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [items, setItems] = useState<AdminCategory[]>([]);
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await adminApi.listCategories();
      setItems(data || []);
    } catch (e: any) {
      Alert.alert("Hata", e?.message || "Kategoriler alınamadı.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
  };

  const canCreate = useMemo(() => name.trim().length >= 2, [name]);

  const onCreate = async () => {
    const n = name.trim();
    if (n.length < 2) {
      Alert.alert("Uyarı", "Kategori adı en az 2 karakter olmalı.");
      return;
    }

    try {
      setCreating(true);
      const created = await adminApi.createCategory({ name: n });
      setName("");
      setItems((prev) => [created, ...prev]);
    } catch (e: any) {
      Alert.alert("Hata", e?.message || "Kategori eklenemedi.");
    } finally {
      setCreating(false);
    }
  };

  const onDelete = async (id: number) => {
    Alert.alert("Silinsin mi?", "Bu kategoriyi silmek istiyor musun?", [
      { text: "Vazgeç", style: "cancel" },
      {
        text: "Sil",
        style: "destructive",
        onPress: async () => {
          try {
            await adminApi.deleteCategory(id);
            setItems((prev) => prev.filter((x) => x.id !== id));
          } catch (e: any) {
            Alert.alert("Hata", e?.message || "Kategori silinemedi.");
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: AdminCategory }) => {
    return (
      <View style={styles.row}>
        <View style={styles.rowLeft}>
          <Text style={styles.rowTitle}>{item.name}</Text>
          <Text style={styles.rowSub}>ID: {item.id}</Text>
        </View>

        <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.deleteBtn}>
          <Text style={styles.deleteText}>Sil</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kategoriler</Text>

      <View style={styles.createBox}>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Yeni kategori adı..."
          placeholderTextColor="rgba(255,255,255,0.55)"
          style={styles.input}
        />

        <TouchableOpacity
          disabled={!canCreate || creating}
          onPress={onCreate}
          style={[styles.createBtn, (!canCreate || creating) ? styles.btnDisabled : null]}
        >
          <Text style={styles.createText}>{creating ? "Ekleniyor..." : "Ekle"}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        keyExtractor={(x) => String(x.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>Kategori yok.</Text>
          </View>
        }
      />
    </View>
  );
}
