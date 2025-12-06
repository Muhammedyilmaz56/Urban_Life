import { StyleSheet, Dimensions, Platform } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  // Tüm ekranı kaplayan arka plan görseli
  backgroundImage: {
    flex: 1,
    width: width,
    height: '100%',
  },
  // Arka planı karartan katman
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)', 
  },
  // Ana içerik alanı
  container: {
    flex: 1,
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  // Başlık alanı
  headerContainer: {
    marginBottom: 25,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#ccc",
    marginTop: 5,
  },
  
  // ✨ Glassmorphism (Buzlu Cam) Kartları
  glassCard: {
    backgroundColor: 'rgba(40, 40, 40, 0.7)', // Yarı saydam koyu gri
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)', // İnce beyaz çerçeve
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  
  // Satır halindeki kartlar (Switch vb. için)
  glassCardRow: {
    backgroundColor: 'rgba(40, 40, 40, 0.7)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  
  // Etiketler (Label)
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#bbb",
    marginBottom: 8,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  labelRow: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  subLabelRow: {
    fontSize: 13,
    color: "#aaa",
    marginTop: 2,
  },
  
  // Input Alanları
  input: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: "#fff",
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  
  // Konum başlığı ve butonu arasındaki hizalama
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  
  // "Konumumu Bul" butonu
  locateButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  locateButtonText: {
    color: '#4cd137',
    fontWeight: '600',
    fontSize: 12,
  },
  
  // Harita Kutusu
  mapContainer: {
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    height: 250,
    position: 'relative',
  },
  map: {
    width: "100%",
    height: "100%",
  },
  // Haritada konum seçilmediyse çıkan uyarı
  mapOverlayPlaceholder: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  mapPlaceholderText: {
    color: '#fff',
    fontWeight: 'bold',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 8,
  },
  
  // Fotoğraf Önizleme
  previewRow: {
    marginBottom: 15,
  },
  previewImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  
  // Kesikli çizgiye sahip fotoğraf ekleme butonu
  photoButtonOutline: {
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    borderStyle: 'dashed',
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: 'center',
  },
  photoButtonText: {
    color: "#ddd",
    fontWeight: "600",
    fontSize: 15,
  },
  
  // Ana Gönder Butonu
  submitButton: {
    backgroundColor: "#4cd137", // Neon Yeşil
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#4cd137",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 10,
  },
  submitButtonDisabled: {
    backgroundColor: '#2e8526',
    opacity: 0.7
  },
  submitText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 18,
    letterSpacing: 0.5,
  },
});