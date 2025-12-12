// App.tsx

import React, { useState, useEffect, createContext } from "react";
import { NavigationContainer } from "@react-navigation/native";

import SplashScreen from "./src/components/SplashScreen";

import AuthNavigator from "./src/navigation/AuthNavigator";
import CitizenNavigator from "./src/navigation/CitizenNavigator";
import OfficialNavigator from "./src/navigation/OfficialNavigator";
import EmployeeNavigator from "./src/navigation/EmployeeNavigator";


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

export default function App() {
  const [user, setUser] = useState<any>(null); 
  const [splash, setSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);



  if (splash) {
    return <SplashScreen />;
  }

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <NavigationContainer linking={linking}>
        {!user ? (
         
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
