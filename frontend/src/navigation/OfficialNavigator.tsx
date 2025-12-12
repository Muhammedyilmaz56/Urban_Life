import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";


import OfficialHomeScreen from "../screens/OfficialHomeScreen";
import OfficialComplaintDetailScreen from "../screens/OfficialComplaintDetailScreen";
import OfficialProfileScreen from "../screens/OfficialProfileScreen";

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
      <Stack.Screen 
        name="OfficialProfile" 
        component={OfficialProfileScreen} 
        options={{ headerShown: false }} 
      />
    </Stack.Navigator>
  );
}