import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { getFeed, toggleSupport } from "../api/complaints";
import { Complaint } from "../types";
import FeedScreenStyles from "../styles/FeedScreenStyles";

export default function FeedScreen() {
  const [data, setData] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFeed = async () => {
    try {
      const res = await getFeed("newest");
      setData(res);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSupport = async (id: number) => {
    const res = await toggleSupport(id);

   
    setData((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, support_count: res.support_count } : c
      )
    );
  };

  useEffect(() => {
    loadFeed();
  }, []);

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;

  return (
    <View style={FeedScreenStyles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={FeedScreenStyles.card}>
            <Text style={FeedScreenStyles.title}>{item.title}</Text>
            <Text style={FeedScreenStyles.desc}>{item.description}</Text>

            <TouchableOpacity
              onPress={() => handleSupport(item.id)}
              style={FeedScreenStyles.supportBtn}
            >
              <Text style={FeedScreenStyles.supportText}>👍 {item.support_count}</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
