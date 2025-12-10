
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import OfficialHomeScreen from "../src/screens/OfficialHomeScreen";
import OfficialComplaintDetailScreen from "../src/screens/OfficialComplaintDetailScreen";

const Stack = createNativeStackNavigator();

export default function OfficialNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="OfficialHome"
        component={OfficialHomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OfficialComplaintDetail"
        component={OfficialComplaintDetailScreen}
        options={{ title: "Şikayet Detayı" }}
      />
    </Stack.Navigator>
  );
}
