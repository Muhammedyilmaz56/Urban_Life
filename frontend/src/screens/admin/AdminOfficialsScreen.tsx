import React, { useLayoutEffect, useMemo, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  StatusBar,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import styles from "../../styles/AdminOfficialsStyles";
import { adminApi } from "../../api/admin";

type OfficialItem = {
  id: number;
  full_name: string;
  email: string;
  is_active: boolean;
  created_at?: string;
  phone_number?: string | null;
};

export default function AdminOfficialsScreen() {
  const navigation = useNavigation<any>();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filter, setFilter] = useState<"ALL" | "ACTIVE" | "PASSIVE">("ALL");

  const [items, setItems] = useState<OfficialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const load = async (opts?: { silent?: boolean }) => {
    try {
      if (!opts?.silent) setLoading(true);

      const params: any = {};
      const q = debouncedSearch.trim();
      if (q) params.q = q;

      if (filter === "ACTIVE") params.is_active = true;
      if (filter === "PASSIVE") params.is_active = false;

      const data = await adminApi.listOfficials(params);
      setItems(Array.isArray(data) ? data : []);
    } catch (e: any) {
      Alert.alert("Hata", e?.response?.data?.detail || "Yöneticiler alınamadı");
    } finally {
      if (!opts?.silent) setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [debouncedSearch, filter]);

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await load({ silent: true });
    } finally {
      setRefreshing(false);
    }
  };

  const filtered = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    return items.filter((u) => {
      const match =
        !q ||
        (u.full_name || "").toLowerCase().includes(q) ||
        (u.email || "").toLowerCase().includes(q);

      const matchFilter =
        filter === "ALL" ||
        (filter === "ACTIVE" && u.is_active) ||
        (filter === "PASSIVE" && !u.is_active);

      return match && matchFilter;
    });
  }, [items, debouncedSearch, filter]);

  const renderItem = ({ item }: { item: OfficialItem }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("AdminOfficialDetail", { id: item.id })}
      activeOpacity={0.9}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.full_name}
        </Text>
        <Text style={styles.cardSub} numberOfLines={1}>
          {item.email}
        </Text>
      </View>

      <View style={styles.rightCol}>
        <View style={[styles.badge, item.is_active ? styles.badgeActive : styles.badgePassive]}>
          <Text style={styles.badgeText}>{item.is_active ? "Aktif" : "Pasif"}</Text>
        </View>
        <Text style={styles.arrow}>›</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B3A6A" />

      {/* TOP BAR */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backTxt}>‹</Text>
        </TouchableOpacity>

        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={styles.title}>Yöneticiler</Text>
          <Text style={styles.subtitle}>Ekle / Düzenle / Pasifleştir</Text>
        </View>

        <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate("AdminCreateOfficial")}>
          <Text style={styles.addTxt}>+</Text>
        </TouchableOpacity>
      </View>

      {/* SEARCH */}
      <View style={styles.searchWrap}>
        <TextInput
          style={styles.search}
          placeholder="İsim veya e-posta ara..."
          placeholderTextColor="rgba(100,116,139,0.85)"
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
        />
      </View>

      {/* FILTERS */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterBtn, filter === "ALL" && styles.filterBtnActive]}
          onPress={() => setFilter("ALL")}
        >
          <Text style={[styles.filterTxt, filter === "ALL" && styles.filterTxtActive]}>Tümü</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterBtn, filter === "ACTIVE" && styles.filterBtnActive]}
          onPress={() => setFilter("ACTIVE")}
        >
          <Text style={[styles.filterTxt, filter === "ACTIVE" && styles.filterTxtActive]}>Aktif</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterBtn, filter === "PASSIVE" && styles.filterBtnActive]}
          onPress={() => setFilter("PASSIVE")}
        >
          <Text style={[styles.filterTxt, filter === "PASSIVE" && styles.filterTxtActive]}>Pasif</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={{ paddingTop: 28 }}>
          <ActivityIndicator size="large" />
        </View>
      ) : null}

      <FlatList
        data={filtered}
        keyExtractor={(x) => String(x.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>Sonuç bulunamadı</Text>
          </View>
        }
      />
    </View>
  );
}
