import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { getMyComplaints } from "../../api/complaints";
import { Complaint } from "../../types";
import MyComplaintsStyles from "../../styles/MyComplaintsStyles";

type Props = NativeStackScreenProps<any, "MyComplaints">;

const MyComplaintsScreen: React.FC<Props> = ({ navigation }) => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const loadComplaints = async () => {
    try {
      const data = await getMyComplaints();
      setComplaints(data);
    } catch (err: any) {
      console.log("GET_MY_COMPLAINTS_ERROR:", err?.response?.data || err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadComplaints();
  }, []);

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
        style={MyComplaintsStyles.card}
      
        activeOpacity={0.8}
      >
        <View style={MyComplaintsStyles.cardHeader}>
          <Text style={MyComplaintsStyles.title}>
            {item.title || "Başlıksız şikayet"}
          </Text>
          <Text
            style={[
              MyComplaintsStyles.statusBadge,
              item.status === "pending" && MyComplaintsStyles.statusPending,
              item.status === "in_progress" && MyComplaintsStyles.statusInProgress,
              item.status === "resolved" && MyComplaintsStyles.statusResolved,
            ]}
          >
            {renderStatus(item.status)}
          </Text>
        </View>

        <Text style={MyComplaintsStyles.description} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={MyComplaintsStyles.cardFooter}>
          <Text style={MyComplaintsStyles.dateText}>
            {new Date(item.created_at).toLocaleString()}
          </Text>
          <Text style={MyComplaintsStyles.supportText}>
            👍 {item.support_count ?? 0}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={MyComplaintsStyles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={MyComplaintsStyles.loadingText}>Şikayetleriniz yükleniyor...</Text>
      </View>
    );
  }

  if (!loading && complaints.length === 0) {
    return (
      <View style={MyComplaintsStyles.emptyContainer}>
        <Text style={MyComplaintsStyles.emptyText}>
          Henüz bir şikayet oluşturmamışsınız.
        </Text>
      </View>
    );
  }

  return (
    <View style={MyComplaintsStyles.container}>
      <FlatList
        data={complaints}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={MyComplaintsStyles.listContent}
      />
    </View>
  );
};

export default MyComplaintsScreen;
