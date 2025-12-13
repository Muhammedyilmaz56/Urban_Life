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
       
      <Stack.Screen name="Categories" component={CategoriesScreen} options={{ title: "Kategoriler" }} />
      <Stack.Screen name="Workers" component={WorkersScreen} options={{ title: "İşçiler" }} />
      <Stack.Screen name="AddWorker" component={AddWorkerScreen} options={{ title: "İşçi Ekle" }} />

    </Stack.Navigator>
  );
}