import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import EmployeeHomeScreen from "../screens/employee/EmployeeHomeScreen";
import EmployeeProfileScreen from "../screens/employee/EmployeeProfileScreen";
import EmployeeJobDetailScreen from "../screens/employee/EmployeeJobDetailScreen";
import EmployeeCompletedScreen from "../screens/employee/EmployeeCompletedScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// --- TAB İKONU ---
const TabIcon = ({ focused, icon }: { focused: boolean; icon: string }) => {
  return (
    <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
      <Text style={[styles.iconText, focused && styles.iconTextActive]}>{icon}</Text>
    </View>
  );
};

function EmployeeTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: true,

        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarActiveTintColor: "#1e3a8a",
        tabBarInactiveTintColor: "#94a3b8",
      }}
    >
      <Tab.Screen
        name="EmployeeHome"
        component={EmployeeHomeScreen}
        options={{
          title: "İşler",
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="📋" />,
        }}
      />

      <Tab.Screen
        name="EmployeeCompleted"
        component={EmployeeCompletedScreen}
        options={{
          title: "Tamamlanan",
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="✅" />,
        }}
      />

      <Tab.Screen
        name="EmployeeProfile"
        component={EmployeeProfileScreen}
        options={{
          title: "Profil",
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="👤" />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function EmployeeNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "fade",
        animationDuration: 200,
      }}
    >
      <Stack.Screen name="EmployeeTabs" component={EmployeeTabs} />
      <Stack.Screen
        name="EmployeeJobDetail"
        component={EmployeeJobDetailScreen}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: Platform.OS === "ios" ? 24 : 18,

    backgroundColor: "#ffffff",
    borderRadius: 22,
    height: 70,

    borderTopWidth: 0,

    elevation: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.10,
    shadowRadius: 12,

    paddingBottom: 8,
    paddingTop: 8,
  },

  tabLabel: {
    fontSize: 10,
    fontWeight: "700",
    marginTop: -4,
  },

  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  iconContainerActive: {
    backgroundColor: "#eff6ff",
  },

  iconText: {
    fontSize: 22,
    opacity: 0.5,
  },

  iconTextActive: {
    opacity: 1,
  },
});
