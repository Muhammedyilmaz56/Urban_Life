
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/citizen/HomeScreen";
import CreateComplaintScreen from "../screens/citizen/complaints/CreateComplaintScreen";
import MyComplaintsScreen from "../screens/citizen/complaints/MyComplaintsScreen";
import ProfileScreen from "../screens/citizen/ProfileScreen";

const Stack = createNativeStackNavigator();

export default function CitizenNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
      />
      <Stack.Screen
        name="CreateComplaint"
        component={CreateComplaintScreen}
      />
      <Stack.Screen
        name="MyComplaints"
        component={MyComplaintsScreen}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
      />
    </Stack.Navigator>
  );
}
