import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import EmployeeHomeScreen from "../screens/employee/EmployeeHomeScreen";
import EmployeeProfileScreen from "../screens/employee/EmployeeProfileScreen";
import EmployeeAnnouncementsScreen from "../screens/employee/EmployeeAnnouncementsScreen";
import EmployeeLogoutScreen from "../screens/employee/EmployeeLogoutScreen";
import EmployeeJobDetailScreen from "../screens/employee/EmployeeJobDetailScreen";
import EmployeeCompletedScreen from "../screens/employee/EmployeeCompletedScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function EmployeeTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarHideOnKeyboard: true }}>
      <Tab.Screen name="EmployeeHome" component={EmployeeHomeScreen} options={{ title: "İşler" }} />
      <Tab.Screen name="EmployeeAnnouncements" component={EmployeeAnnouncementsScreen} options={{ title: "Duyurular" }} />
      <Tab.Screen name="EmployeeProfile" component={EmployeeProfileScreen} options={{ title: "Profil" }} />
      <Tab.Screen name="EmployeeLogout" component={EmployeeLogoutScreen} options={{ title: "Çıkış" }} />
      <Tab.Screen
  name="EmployeeCompleted"
  component={EmployeeCompletedScreen}
  options={{ title: "Tamamlanan" }}
/>

    </Tab.Navigator>
  );
}

export default function EmployeeNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="EmployeeTabs" component={EmployeeTabs} options={{ headerShown: false }} />
      <Stack.Screen
        name="EmployeeJobDetail"
        component={EmployeeJobDetailScreen}
        options={{ title: "İş Detayı" }}
      />
    </Stack.Navigator>
  );
}
