import React from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ImageBackground, 
  StatusBar, 
  ActivityIndicator,
  Dimensions 
} from "react-native";

const { width, height } = Dimensions.get("window");


const BG_IMAGE = "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=2070&auto=format&fit=crop";

const SplashScreen = () => {
  return (
    <ImageBackground source={{ uri: BG_IMAGE }} style={styles.background} resizeMode="cover">
      {/* Status bar'ı şeffaf yap */}
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* Karartma Katmanı */}
      <View style={styles.overlay}>
        
        {/* Logo Alanı */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>UrbanLife</Text>
          <Text style={styles.tagline}>Şehrin Ritmini Yakala</Text>
        </View>

        {/* Yükleniyor Göstergesi */}
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#4cd137" />
          <Text style={styles.loadingText}>Yükleniyor...</Text>
        </View>

        {/* Alt Bilgi */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Version 1.0.0</Text>
        </View>

      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: width,
    height: height,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingVertical: 50,
  },
  logoContainer: {
    marginTop: height * 0.25, 
    alignItems: 'center',
  },
  logoText: {
    fontSize: 50,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
  },
  tagline: {
    color: '#ccc',
    fontSize: 16,
    marginTop: 5,
    letterSpacing: 1,
    fontWeight: '300',
  },
  loaderContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  loadingText: {
    color: '#rgba(255,255,255,0.7)',
    marginTop: 15,
    fontSize: 14,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
  },
  footerText: {
    color: '#555',
    fontSize: 12,
  },
});

export default SplashScreen;