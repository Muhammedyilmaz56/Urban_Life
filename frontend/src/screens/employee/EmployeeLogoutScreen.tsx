import React, { useEffect } from "react";
import { View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function EmployeeLogoutScreen({ navigation }: any) {
  useEffect(() => {
    (async () => {
      await AsyncStorage.removeItem("token");
      navigation.reset({ index: 0, routes: [{ name: "Login" }] });
    })();
  }, [navigation]);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Çıkış yapılıyor...</Text>
    </View>
  );
}
