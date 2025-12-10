import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";


import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import HomeScreen from "./src/screens/HomeScreen";
import CreateComplaintScreen from "./src/screens/complaints/CreateComplaintScreen";
import ForgotPasswordScreen from "./src/screens/ForgotPasswordScreen";
import ResetPasswordScreen from "./src/screens/ResetPasswordScreen";
import MyComplaintsScreen from "./src/screens/complaints/MyComplaintsScreen";
import SplashScreen from "./src/components/SplashScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
const Stack = createNativeStackNavigator();


const linking = {
  
  prefixes: ["cityflow://"], 
  config: {
    screens: {
      ResetPassword: "reset-password/:token",
      Login: "login",
    },
  },
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
   
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator initialRouteName="Login">

        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: "Giriş Yap", headerShown: false }} 
        />

<Stack.Screen 
    name="Register" 
    component={RegisterScreen} 
    options={{ headerShown: false }} 
  />

  
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
          name="ForgotPassword"
          component={ForgotPasswordScreen}
          options={{ title: "Şifremi Unuttum", headerTransparent: false, headerTintColor: '#fff' }} 
        />

        <Stack.Screen
          name="ResetPassword"
          component={ResetPasswordScreen}
          options={{ title: "Şifre Sıfırla", headerTransparent: false, headerTintColor: '#fff' }} 
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
    </NavigationContainer>
  );
}