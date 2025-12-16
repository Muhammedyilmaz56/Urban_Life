import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  ImageBackground,
  StatusBar,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import styles from "../../styles/AdminUsersStyles";
import { adminApi } from "../../api/admin";

const BG_IMAGE =
  "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=2070&auto=format&fit=crop";

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

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"ALL" | "citizen" | "employee" | "official" | "admin">("ALL");
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

  const renderItem = ({ item }: { item: UserItem }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{item.full_name}</Text>
        <Text style={styles.cardSub}>{item.email}</Text>
        <Text style={styles.cardMeta}>Rol: {item.role}</Text>
      </View>

      <View style={styles.badgeWrap}>
        <View style={[styles.badge, item.is_active ? styles.badgeActive : styles.badgePassive]}>
          <Text style={styles.badgeText}>{item.is_active ? "Aktif" : "Pasif"}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ImageBackground source={{ uri: BG_IMAGE }} style={styles.bg} resizeMode="cover">
        <View style={styles.overlay}>
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Text style={styles.backTxt}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Kullanıcılar</Text>
            <View style={{ width: 44 }} />
          </View>

          <TextInput
            style={styles.search}
            placeholder="İsim veya e-posta ara..."
            placeholderTextColor="#bdbdbd"
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
          />

          <View style={styles.filterRow}>
            <TouchableOpacity
              style={[styles.filterBtn, activeFilter === "ALL" && styles.filterBtnActive]}
              onPress={() => setActiveFilter("ALL")}
            >
              <Text style={[styles.filterTxt, activeFilter === "ALL" && styles.filterTxtActive]}>Tümü</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterBtn, activeFilter === "ACTIVE" && styles.filterBtnActive]}
              onPress={() => setActiveFilter("ACTIVE")}
            >
              <Text style={[styles.filterTxt, activeFilter === "ACTIVE" && styles.filterTxtActive]}>Aktif</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterBtn, activeFilter === "PASSIVE" && styles.filterBtnActive]}
              onPress={() => setActiveFilter("PASSIVE")}
            >
              <Text style={[styles.filterTxt, activeFilter === "PASSIVE" && styles.filterTxtActive]}>Pasif</Text>
            </TouchableOpacity>
          </View>

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

          {loading ? (
            <View style={{ paddingTop: 28 }}>
              <ActivityIndicator />
            </View>
          ) : null}

          <FlatList
            data={filtered}
            keyExtractor={(x) => String(x.id)}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 120 }}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            ListEmptyComponent={
              <View style={{ paddingTop: 40 }}>
                <Text style={{ color: "white", textAlign: "center" }}>Sonuç bulunamadı</Text>
              </View>
            }
          />
        </View>
      </ImageBackground>
    </View>
  );
}
