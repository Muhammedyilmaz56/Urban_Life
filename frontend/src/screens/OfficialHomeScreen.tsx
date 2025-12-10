// src/screens/OfficialHomeScreen.tsx
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { fetchOfficialComplaints, OfficialComplaint } from "../api/official";
import styles from "../styles/OfficialHomeStyles";
const getStatusStyle = (status: string) => {
    switch (status) {
      case "pending":
        return styles.status_pending;
      case "in_progress":
        return styles.status_in_progress;
      case "assigned":
        return styles.status_assigned;
      case "resolved":
        return styles.status_resolved;
      case "rejected":
        return styles.status_rejected;
      default:
        return {};
    }
  };
const statusLabelMap: Record<string, string> = {
  pending: "Beklemede",
  in_progress: "İşlemde",
  assigned: "İşçiye Atandı",
  resolved: "Çözüldü",
  rejected: "Reddedildi",
};

const OfficialHomeScreen = () => {
  const [complaints, setComplaints] = useState<OfficialComplaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<any>();

  const loadComplaints = async () => {
    try {
      setLoading(true);
      const data = await fetchOfficialComplaints();
      setComplaints(data);
    } catch (error) {
      console.log("Official complaints fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadComplaints();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    loadComplaints();
  }, []);

  const renderItem = ({ item }: { item: OfficialComplaint }) => {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate("OfficialComplaintDetail", { complaintId: item.id })
        }
      >
        <View style={styles.cardHeader}>
  <Text style={styles.cardTitle} numberOfLines={1}>
    {item.title}
  </Text>

  <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
    <Text style={styles.statusText}>
      {statusLabelMap[item.status] || item.status}
    </Text>
  </View>
</View>


        {item.category && (
          <Text style={styles.categoryText}>Kategori: {item.category.name}</Text>
        )}

        {item.address && (
          <Text style={styles.addressText} numberOfLines={1}>
            {item.address}
          </Text>
        )}

        <Text style={styles.descriptionText} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.cardFooter}>
          <Text style={styles.dateText}>
            {new Date(item.created_at).toLocaleString("tr-TR")}
          </Text>

          {typeof item.support_count === "number" && (
            <Text style={styles.supportText}>👍 {item.support_count} destek</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" />
        <Text style={styles.loadingText}>Şikayetler yükleniyor...</Text>
      </View>
    );
  }

  if (!loading && complaints.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Henüz görüntülenecek şikayet yok.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={complaints}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

export default OfficialHomeScreen;
