import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  StatusBar,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BG_IMAGE =
  "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=2070&auto=format&fit=crop";

const SplashScreen = () => {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      {/* Show loading overlay until image is loaded */}
      {!imageLoaded && (
        <View style={[styles.loadingOverlay, { backgroundColor: "#1a1a2e" }]}>
          <ActivityIndicator size="large" color="#4cd137" />
        </View>
      )}

      <ImageBackground
        source={{ uri: BG_IMAGE }}
        style={[styles.background, { width, height }]}
        resizeMode="cover"
        onLoadEnd={() => setImageLoaded(true)}
      >
        {/* Karartma Katmanı */}
        <View style={styles.overlay}>
          {/* Logo Alanı */}
          <View style={[styles.logoContainer, { marginTop: height * 0.25 }]}>
            <Text style={styles.logoText}>UrbanLife</Text>
            <Text style={styles.tagline}>Şehrin Ritmini Yakala</Text>
          </View>

          {/* Yükleniyor Göstergesi */}
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#4cd137" />
            <Text style={styles.loadingText}>Yükleniyor...</Text>
          </View>

          {/* Alt Bilgi */}
          <View style={[styles.footer, { bottom: 30 + insets.bottom }]}>
            <Text style={styles.footerText}>Version 1.1.0</Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 50,
  },
  logoContainer: {
    alignItems: "center",
  },
  logoText: {
    fontSize: 50,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: 2,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
  },
  tagline: {
    color: "#ccc",
    fontSize: 16,
    marginTop: 5,
    letterSpacing: 1,
    fontWeight: "300",
  },
  loaderContainer: {
    alignItems: "center",
    marginBottom: 50,
  },
  loadingText: {
    color: "rgba(255,255,255,0.7)",
    marginTop: 15,
    fontSize: 14,
  },
  footer: {
    position: "absolute",
  },
  footerText: {
    color: "#555",
    fontSize: 12,
  },
});

export default SplashScreen;