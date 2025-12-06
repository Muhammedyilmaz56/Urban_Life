import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { getFeed, toggleSupport } from "../api/complaints";
import { Complaint } from "../types";
import HomeScreenStyles from "../styles/HomeStyles";

type Props = NativeStackScreenProps<any, "Home">;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [sort, setSort] = useState<"newest" | "popular">("newest");

  const loadFeed = async (selectedSort: "newest" | "popular" = sort) => {
    try {
      setLoading(true);
      const data = await getFeed(selectedSort);
      setComplaints(data);
    } catch (err: any) {
      console.log("FEED_ERROR:", err?.response?.data || err.message);
      Alert.alert("Hata", "Şikayet listesi yüklenemedi.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadFeed(sort);
  }, [sort]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadFeed(sort);
  }, [sort]);

  const handleSupport = async (id: number) => {
    try {
      const res = await toggleSupport(id);

      setComplaints((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, support_count: res.support_count } : c
        )
      );
    } catch (err: any) {
      console.log("SUPPORT_ERROR:", err?.response?.data || err.message);
      Alert.alert("Hata", "Destek verirken bir hata oluştu.");
    }
  };

  const renderStatus = (status: Complaint["status"]) => {
    switch (status) {
      case "pending":
        return "Beklemede";
      case "in_progress":
        return "İşlemde";
      case "resolved":
        return "Çözüldü";
      default:
        return status;
    }
  };

  const renderItem = ({ item }: { item: Complaint }) => {
    return (
      <TouchableOpacity
        style={HomeScreenStyles.card}
        activeOpacity={0.85}
       
      >
        <View style={HomeScreenStyles.cardHeader}>
          <Text style={HomeScreenStyles.cardTitle}>
            {item.title || "Başlıksız şikayet"}
          </Text>
          <Text
            style={[
              HomeScreenStyles.statusBadge,
              item.status === "pending" && HomeScreenStyles.statusPending,
              item.status === "in_progress" && HomeScreenStyles.statusInProgress,
              item.status === "resolved" && HomeScreenStyles.statusResolved,
            ]}
          >
            {renderStatus(item.status)}
          </Text>
        </View>

        <Text style={HomeScreenStyles.cardDescription} numberOfLines={3}>
          {item.description}
        </Text>

        <View style={HomeScreenStyles.cardFooter}>
          <Text style={HomeScreenStyles.cardDate}>
            {new Date(item.created_at).toLocaleString()}
          </Text>

          <TouchableOpacity
            style={HomeScreenStyles.supportButton}
            onPress={() => handleSupport(item.id)}
          >
            <Text style={HomeScreenStyles.supportText}>
              👍 {item.support_count ?? 0}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={HomeScreenStyles.container}>
      {/* Üst butonlar */}
      <View style={HomeScreenStyles.topButtonsRow}>
        <TouchableOpacity
          style={[HomeScreenStyles.topButton, HomeScreenStyles.topButtonPrimary]}
          onPress={() => navigation.navigate("CreateComplaint")}
        >
          <Text style={HomeScreenStyles.topButtonText}>Şikayet Oluştur</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            HomeScreenStyles.topButton,
            HomeScreenStyles.topButtonSecondary,
          ]}
          onPress={() => navigation.navigate("MyComplaints")}
        >
          <Text style={HomeScreenStyles.topButtonText}>Şikayetlerim</Text>
        </TouchableOpacity>

        {/* 👉 YENİ: Profil butonu */}
        <TouchableOpacity
          style={[
            HomeScreenStyles.topButton,
            HomeScreenStyles.topButtonSecondary,
          ]}
          onPress={() => navigation.navigate("Profile")}
        >
          <Text style={HomeScreenStyles.topButtonText}>Profil</Text>
        </TouchableOpacity>
      </View>

      {/* Sıralama sekmeleri */}
      <View style={HomeScreenStyles.tabsRow}>
        <TouchableOpacity
          style={[
            HomeScreenStyles.tabButton,
            sort === "newest" && HomeScreenStyles.tabButtonActive,
          ]}
          onPress={() => setSort("newest")}
        >
          <Text
            style={[
              HomeScreenStyles.tabText,
              sort === "newest" && HomeScreenStyles.tabTextActive,
            ]}
          >
            En Yeniler
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            HomeScreenStyles.tabButton,
            sort === "popular" && HomeScreenStyles.tabButtonActive,
          ]}
          onPress={() => setSort("popular")}
        >
          <Text
            style={[
              HomeScreenStyles.tabText,
              sort === "popular" && HomeScreenStyles.tabTextActive,
            ]}
          >
            En Çok Desteklenenler
          </Text>
        </TouchableOpacity>
      </View>

      {/* Liste */}
      {loading ? (
        <View style={HomeScreenStyles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={complaints}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={HomeScreenStyles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={HomeScreenStyles.emptyContainer}>
              <Text style={HomeScreenStyles.emptyText}>
                Gösterilecek şikayet bulunamadı.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};

export default HomeScreen;
