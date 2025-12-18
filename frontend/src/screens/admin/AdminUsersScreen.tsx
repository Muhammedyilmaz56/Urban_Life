import React, { useEffect, useLayoutEffect, useMemo, useState, useContext } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";

import styles from "../../styles/AdminUsersStyles";
import { adminApi } from "../../api/admin";
import { AuthContext } from "../../../App";

type UserItem = {
  id: number;
  full_name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
};

export default function AdminUsersScreen() {
  const navigation = useNavigation<any>();

  const auth = useContext(AuthContext);
  const setUser = auth?.setUser;

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<
    "ALL" | "citizen" | "employee" | "official" | "admin"
  >("ALL");
  const [activeFilter, setActiveFilter] = useState<"ALL" | "ACTIVE" | "PASSIVE">("ALL");

  const [items, setItems] = useState<UserItem[]>([]);
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

      if (roleFilter !== "ALL") params.role = roleFilter;

      if (activeFilter === "ACTIVE") params.is_active = true;
      if (activeFilter === "PASSIVE") params.is_active = false;

      const data = await adminApi.listUsers(params);
      setItems(Array.isArray(data) ? data : []);
    } catch (e: any) {
      Alert.alert("Hata", e?.response?.data?.detail || "Kullanıcılar alınamadı");
    } finally {
      if (!opts?.silent) setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, roleFilter, activeFilter]);

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

      const matchRole = roleFilter === "ALL" || u.role === roleFilter;

      const matchActive =
        activeFilter === "ALL" ||
        (activeFilter === "ACTIVE" && u.is_active) ||
        (activeFilter === "PASSIVE" && !u.is_active);

      return match && matchRole && matchActive;
    });
  }, [items, debouncedSearch, roleFilter, activeFilter]);

  const logout = () => {
    Alert.alert("Çıkış", "Çıkış yapmak istiyor musun?", [
      { text: "Vazgeç", style: "cancel" },
      {
        text: "Çıkış Yap",
        style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.removeItem("accessToken");
            await AsyncStorage.removeItem("current_user");
          } finally {
            setUser?.(null);
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: UserItem }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{item.full_name}</Text>
        <Text style={styles.cardSub}>{item.email}</Text>
        <Text style={styles.cardMeta}>Rol: {item.role}</Text>
      </View>

      <View style={styles.badgeWrap}>
        <View style={[styles.badge, item.is_active ? styles.badgeActive : styles.badgePassive]}>
          <Text
            style={[
              styles.badgeText,
              item.is_active ? styles.badgeTextActive : styles.badgeTextPassive,
            ]}
          >
            {item.is_active ? "Aktif" : "Pasif"}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B3A6A" />

      {/* TOP BAR - Corporate Style */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.85}
        >
          <Text style={styles.backTxt}>‹</Text>
        </TouchableOpacity>

        <View style={styles.titleWrapper}>
          <Text style={styles.title}>Kullanıcılar</Text>
          <Text style={styles.subtitle}>Tüm kullanıcı listesi</Text>
        </View>

        {/* LOGOUT BUTTON */}
        <TouchableOpacity style={styles.logoutBtn} onPress={logout} activeOpacity={0.85}>
          <Text style={styles.logoutTxt}>⎋</Text>
        </TouchableOpacity>
      </View>

      {/* SEARCH */}
      <TextInput
        style={styles.search}
        placeholder="İsim veya e-posta ara..."
        placeholderTextColor="#94A3B8"
        value={search}
        onChangeText={setSearch}
        autoCapitalize="none"
      />

      {/* ACTIVE/PASSIVE FILTER */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterBtn, activeFilter === "ALL" && styles.filterBtnActive]}
          onPress={() => setActiveFilter("ALL")}
        >
          <Text style={[styles.filterTxt, activeFilter === "ALL" && styles.filterTxtActive]}>
            Tümü
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterBtn, activeFilter === "ACTIVE" && styles.filterBtnActive]}
          onPress={() => setActiveFilter("ACTIVE")}
        >
          <Text style={[styles.filterTxt, activeFilter === "ACTIVE" && styles.filterTxtActive]}>
            Aktif
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterBtn, activeFilter === "PASSIVE" && styles.filterBtnActive]}
          onPress={() => setActiveFilter("PASSIVE")}
        >
          <Text style={[styles.filterTxt, activeFilter === "PASSIVE" && styles.filterTxtActive]}>
            Pasif
          </Text>
        </TouchableOpacity>
      </View>

      {/* ROLE FILTER */}
      <View style={styles.roleRow}>
        {(["ALL", "citizen", "employee", "official", "admin"] as const).map((r) => (
          <TouchableOpacity
            key={r}
            style={[styles.roleBtn, roleFilter === r && styles.roleBtnActive]}
            onPress={() => setRoleFilter(r)}
          >
            <Text style={[styles.roleTxt, roleFilter === r && styles.roleTxtActive]}>
              {r === "ALL" ? "Hepsi" : r}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* LOADING */}
      {loading && (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#0B3A6A" />
        </View>
      )}

      {/* LIST */}
      <FlatList
        data={filtered}
        keyExtractor={(x) => String(x.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyText}>Sonuç bulunamadı</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}
