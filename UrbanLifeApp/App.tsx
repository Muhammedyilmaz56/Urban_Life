// App.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import CreateComplaintScreen from "./src/screens/complaints/CreateComplaintScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: "Giriş Yap" }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "UrbanLife" }}
        />
        <Stack.Screen
          name="CreateComplaint"
          component={CreateComplaintScreen}
          options={{ title: "Şikayet Oluştur" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
