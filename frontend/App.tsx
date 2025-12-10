// App.tsx

import React, { useState, useEffect, createContext } from "react";
import { NavigationContainer } from "@react-navigation/native";

import SplashScreen from "./src/components/SplashScreen";

import AuthNavigator from "./navigation/AuthNavigator";
import CitizenNavigator from "./navigation/CitizenNavigator";
import OfficialNavigator from "./navigation/OfficialNavigator";
import EmployeeNavigator from "./navigation/EmployeeNavigator";

// 🔥 AuthContext: LoginScreen buradan setUser çağıracak
export const AuthContext = createContext<{
  user: any;
  setUser: (u: any) => void;
} | null>(null);

// Deep linking
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
  const [user, setUser] = useState<any>(null); // sadece RAM'de
  const [splash, setSplash] = useState(true);

  // Splash animasyonu
  useEffect(() => {
    const timer = setTimeout(() => setSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // 🔥 OTOMATİK LOGIN YOK: AsyncStorage'tan hiç user/token okumuyoruz
  // İstersen, her açılışta eski token'ı da silebilirsin:
  /*
  useEffect(() => {
    const clearCreds = async () => {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
    };
    clearCreds();
  }, []);
  */

  if (splash) {
    return <SplashScreen />;
  }

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <NavigationContainer linking={linking}>
        {!user ? (
          // 🔥 Uygulama açıldığında user her zaman null → Login ekranı
          <AuthNavigator />
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
  );
}
