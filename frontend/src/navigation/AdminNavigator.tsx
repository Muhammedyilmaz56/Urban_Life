import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AdminHomeScreen from "../screens/admin/AdminHomeScreen";
import AdminOfficialsScreen from "../screens/admin/AdminOfficialsScreen";
import AdminCreateOfficialScreen from "../screens/admin/AdminCreateOfficialScreen";
import AdminOfficialDetailScreen from "../screens/admin/AdminOfficialDetailScreen";
import AdminCategoriesScreen from "../screens/admin/AdminCategoriesScreen";
import AdminStatsScreen from "../screens/admin/AdminStatsScreen";
import AdminAuditScreen from "../screens/admin/AdminAuditScreen";
import AdminUsersScreen from "../screens/admin/AdminUsersScreen";
import AdminProfileScreen from "../screens/admin/AdminProfileScreen";

const Stack = createNativeStackNavigator();

export default function AdminNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "fade",
        animationDuration: 200,
      }}
    >
      <Stack.Screen
        name="AdminHome"
        component={AdminHomeScreen}
      />

      <Stack.Screen
        name="AdminOfficials"
        component={AdminOfficialsScreen}
      />

      <Stack.Screen
        name="AdminCreateOfficial"
        component={AdminCreateOfficialScreen}
      />

      <Stack.Screen
        name="AdminOfficialDetail"
        component={AdminOfficialDetailScreen}
      />

      <Stack.Screen
        name="AdminCategories"
        component={AdminCategoriesScreen}
      />

      <Stack.Screen
        name="AdminStats"
        component={AdminStatsScreen}
      />

      <Stack.Screen
        name="AdminAudit"
        component={AdminAuditScreen}
      />

      <Stack.Screen
        name="AdminUsers"
        component={AdminUsersScreen}
      />

      <Stack.Screen
        name="AdminProfile"
        component={AdminProfileScreen}
      />
    </Stack.Navigator>
  );
}
