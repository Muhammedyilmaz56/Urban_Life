import React, { useCallback, useEffect, useMemo, useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  Alert,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import styles from "../../styles/AdminCategoriesStyles";
import { adminApi } from "../../api/admin";
import type { AdminCategory } from "../../api/admin";

export default function AdminCategoriesScreen() {
  const navigation = useNavigation<any>();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [items, setItems] = useState<AdminCategory[]>([]);
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);

  // Inline mesajlar
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setErrorMessage("");
    setTimeout(() => setSuccessMessage(""), 4000);
  };

  const showError = (msg: string) => {
    setErrorMessage(msg);
    setSuccessMessage("");
    setTimeout(() => setErrorMessage(""), 4000);
  };

  const load = useCallback(async (opts?: { silent?: boolean }) => {
    try {
      if (!opts?.silent) setLoading(true);
      const data = await adminApi.listCategories();
      setItems(data || []);
    } catch (e: any) {
      showError(e?.response?.data?.detail || e?.message || "Kategoriler alınamadı.");
    } finally {
      if (!opts?.silent) setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load({ silent: true });
  };

  const canCreate = useMemo(() => name.trim().length >= 2, [name]);

  const onCreate = async () => {
    const n = name.trim();
    if (n.length < 2) {
      showError("Kategori adı en az 2 karakter olmalı.");
      return;
    }

    try {
      setCreating(true);
      const created = await adminApi.createCategory({ name: n });
      setName("");
      setItems((prev) => [created, ...prev]);
      showSuccess(`"${n}" kategorisi başarıyla eklendi.`);
    } catch (e: any) {
      showError(e?.response?.data?.detail || e?.message || "Kategori eklenemedi.");
    } finally {
      setCreating(false);
    }
  };

  const onDelete = async (id: number, categoryName: string) => {
    Alert.alert("Silinsin mi?", `"${categoryName}" kategorisini silmek istiyor musun?`, [
      { text: "Vazgeç", style: "cancel" },
      {
        text: "Sil",
        style: "destructive",
        onPress: async () => {
          try {
            await adminApi.deleteCategory(id);
            setItems((prev) => prev.filter((x) => x.id !== id));
            showSuccess(`"${categoryName}" kategorisi silindi.`);
          } catch (e: any) {
            showError(e?.response?.data?.detail || e?.message || "Kategori silinemedi.");
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: AdminCategory }) => {
    return (
      <View style={styles.row}>
        <View style={styles.rowLeft}>
          <Text style={styles.rowTitle} numberOfLines={1}>
            {item.name}
          </Text>

        </View>

        <TouchableOpacity
          onPress={() => onDelete(item.id, item.name)}
          style={styles.deleteBtn}
          activeOpacity={0.85}
        >
          <Text style={styles.deleteText}>Sil</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <StatusBar barStyle="light-content" backgroundColor="#0B3A6A" />
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B3A6A" />

      {/* TOP BAR */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.85}>
          <Text style={styles.backTxt}>‹</Text>
        </TouchableOpacity>

        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={styles.title}>Kategoriler</Text>
          <Text style={styles.subtitle}>Ekle / Sil</Text>
        </View>

        <TouchableOpacity style={styles.refreshBtn} onPress={() => load()} activeOpacity={0.85}>
          <Text style={styles.refreshTxt}>Yenile</Text>
        </TouchableOpacity>
      </View>

      {/* CREATE */}
      <View style={styles.createCard}>
        {/* Başarı Mesajı */}
        {successMessage !== "" && (
          <View style={{ backgroundColor: "#10B981", paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10, marginBottom: 12 }}>
            <Text style={{ color: "#fff", fontSize: 14, fontWeight: "600", textAlign: "center" }}>
              ✓ {successMessage}
            </Text>
          </View>
        )}

        {/* Hata Mesajı */}
        {errorMessage !== "" && (
          <View style={{ backgroundColor: "#EF4444", paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10, marginBottom: 12 }}>
            <Text style={{ color: "#fff", fontSize: 14, fontWeight: "600", textAlign: "center" }}>
              ✕ {errorMessage}
            </Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>Yeni Kategori</Text>

        <View style={styles.createBox}>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Kategori adı..."
            placeholderTextColor="rgba(100,116,139,0.9)"
            style={styles.input}
            autoCapitalize="words"
          />

          <TouchableOpacity
            disabled={!canCreate || creating}
            onPress={onCreate}
            activeOpacity={0.9}
            style={[
              styles.createBtn,
              (!canCreate || creating) ? styles.btnDisabled : null,
            ]}
          >
            <Text style={styles.createText}>{creating ? "Ekleniyor..." : "Ekle"}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.helperText}>Not: Kategori adı en az 2 karakter olmalıdır.</Text>
      </View>

      {/* LIST */}
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
