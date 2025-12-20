import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";


import OfficialHomeScreen from "../screens/official/OfficialHomeScreen";
import OfficialComplaintDetailScreen from "../screens/official/OfficialComplaintDetailScreen";
import OfficialProfileScreen from "../screens/official/OfficialProfileScreen";

import CategoriesScreen from "../screens/official/CategoriesScreen";
import WorkersScreen from "../screens/official/WorkersScreen";
import AddWorkerScreen from "../screens/official/AddWorkerScreen";

const Stack = createNativeStackNavigator();

export default function OfficialNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "fade",
        animationDuration: 200,
      }}
    >
      <Stack.Screen
        name="OfficialHome"
        component={OfficialHomeScreen}
      />
      <Stack.Screen
        name="OfficialComplaintDetail"
        component={OfficialComplaintDetailScreen}
      />
      <Stack.Screen
        name="OfficialProfile"
        component={OfficialProfileScreen}
      />

      <Stack.Screen name="Categories" component={CategoriesScreen} />
      <Stack.Screen name="Workers" component={WorkersScreen} />
      <Stack.Screen name="AddWorker" component={AddWorkerScreen} />

    </Stack.Navigator>
  );
}
