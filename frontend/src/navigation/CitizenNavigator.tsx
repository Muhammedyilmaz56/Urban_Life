// navigation/CitizenNavigator.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/citizen/HomeScreen";
import CreateComplaintScreen from "../screens/citizen/complaints/CreateComplaintScreen";
import MyComplaintsScreen from "../screens/citizen/complaints/MyComplaintsScreen";
import ProfileScreen from "../screens/citizen/ProfileScreen";

const Stack = createNativeStackNavigator();

export default function CitizenNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreateComplaint"
        component={CreateComplaintScreen}
        options={{ title: "Şikayet Oluştur" }}
      />
      <Stack.Screen
        name="MyComplaints"
        component={MyComplaintsScreen}
        options={{ title: "Şikayetlerim" }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "Profil" }}
      />
    </Stack.Navigator>
  );
}
