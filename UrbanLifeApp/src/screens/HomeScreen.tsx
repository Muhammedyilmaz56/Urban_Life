// src/screens/HomeScreen.tsx
import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const HomeScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>UrbanLife Ana Sayfa</Text>
      <Button
        title="Şikayet Oluştur"
        onPress={() => navigation.navigate("CreateComplaint")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default HomeScreen;  // 🔥 EN ÖNEMLİ SATIR
