// App.tsx

import React, { useState, useEffect, createContext, useRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View, ActivityIndicator, Text, StyleSheet, StatusBar } from "react-native";

import SplashScreen from "./src/components/SplashScreen";

import AuthNavigator from "./src/navigation/AuthNavigator";
import CitizenNavigator from "./src/navigation/CitizenNavigator";
import OfficialNavigator from "./src/navigation/OfficialNavigator";
import EmployeeNavigator from "./src/navigation/EmployeeNavigator";
import AdminNavigator from "./src/navigation/AdminNavigator";

export const AuthContext = createContext<{
  user: any;
  setUser: (u: any) => void;
} | null>(null);


const linking = {
  prefixes: ["cityflow://"],
  config: {
    screens: {
      ResetPassword: "reset-password/:token",
      Login: "login",
    },
  },
};

// Giriş sonrası loading ekranı
const TransitionLoading = () => (
  <View style={transitionStyles.container}>
    <StatusBar barStyle="light-content" backgroundColor="#0B3A6A" />
    <View style={transitionStyles.content}>
      <ActivityIndicator size="large" color="#fff" />
      <Text style={transitionStyles.text}>Yükleniyor...</Text>
      <Text style={transitionStyles.subtext}>Panel hazırlanıyor</Text>
    </View>
  </View>
);

const transitionStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B3A6A",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
  },
  subtext: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    marginTop: 8,
  },
});

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [splash, setSplash] = useState(true);
  const [transitioning, setTransitioning] = useState(false);
  const prevUserRef = useRef<any>(null);

  useEffect(() => {
    const timer = setTimeout(() => setSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Login sonrası geçiş loading'i
  useEffect(() => {
    // Sadece login olduğunda (null -> user) geçiş göster
    if (prevUserRef.current === null && user !== null) {
      setTransitioning(true);
      const timer = setTimeout(() => setTransitioning(false), 1500);
      return () => clearTimeout(timer);
    }
    prevUserRef.current = user;
  }, [user]);

  if (splash) {
    return (
      <SafeAreaProvider>
        <SplashScreen />
      </SafeAreaProvider>
    );
  }

  if (transitioning && user) {
    return (
      <SafeAreaProvider>
        <TransitionLoading />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <AuthContext.Provider value={{ user, setUser }}>
        <NavigationContainer linking={linking}>
          {!user ? (

            <AuthNavigator />

          )
            : user.role === "admin" ? (
              <AdminNavigator />
            ) : user.role === "citizen" ? (
              <CitizenNavigator />
            ) : user.role === "official" ? (
              <OfficialNavigator />
            ) : user.role === "employee" ? (
              <EmployeeNavigator />
            ) : (
              <CitizenNavigator />
            )}
        </NavigationContainer>
      </AuthContext.Provider>
    </SafeAreaProvider>
  );
}
