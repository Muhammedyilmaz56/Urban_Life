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
    <Stack.Navigator>
      <Stack.Screen
        name="AdminHome"
        component={AdminHomeScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="AdminOfficials"
        component={AdminOfficialsScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="AdminCreateOfficial"
        component={AdminCreateOfficialScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="AdminOfficialDetail"
        component={AdminOfficialDetailScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="AdminCategories"
        component={AdminCategoriesScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="AdminStats"
        component={AdminStatsScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="AdminAudit"
        component={AdminAuditScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="AdminUsers"
        component={AdminUsersScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="AdminProfile"
        component={AdminProfileScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
