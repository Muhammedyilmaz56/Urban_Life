import { StyleSheet, Platform, Dimensions } from "react-native";

export default StyleSheet.create({
  // --- ANA KAPLAYICI ---
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)", // Biraz daha koyu olsun ki içerik net görünsün
  },

  // --- HEADER ---
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // Başlığı ortala
    paddingTop: Platform.OS === "ios" ? 60 : 45,
    paddingHorizontal: 20,
    paddingBottom: 20,
    zIndex: 10,
    position: "relative",
  },

  // GERİ BUTONU (SOLDAKİ CAM BUTON)
  backButton: {
    position: "absolute",
    left: 20,
    bottom: 20, // Padding bottom ile hizalamak için
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },

  backButtonIcon: {
    fontSize: 28,
    color: "#FFFFFF",
    fontWeight: "300",
    marginTop: -4,
    marginLeft: -2,
  },
  
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 1,
    textShadowColor: "rgba(0, 0, 0, 0.9)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },

  // --- LİSTE ---
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 50,
  },

  // --- KART TASARIMI ---
  card: {
    backgroundColor: "rgba(35, 35, 35, 0.85)",
    borderRadius: 24,
    marginBottom: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 8,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  
  title: {
    fontSize: 19,
    fontWeight: "700",
    color: "#FFFFFF",
    flex: 1,
    marginRight: 10,
    lineHeight: 26,
  },

  // STATUS BADGES
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
    overflow: "hidden",
    alignSelf: "flex-start",
    marginTop: 5,
    textAlign: "center",
  },
  statusPending: {
    backgroundColor: "rgba(255, 165, 0, 0.15)",
    color: "#FFB347",
    borderWidth: 1,
    borderColor: "rgba(255, 165, 0, 0.3)",
  },
  statusInProgress: {
    backgroundColor: "rgba(52, 152, 219, 0.15)",
    color: "#5DADE2",
    borderWidth: 1,
    borderColor: "rgba(52, 152, 219, 0.3)",
  },
  statusResolved: {
    backgroundColor: "rgba(46, 204, 113, 0.15)",
    color: "#58D68D",
    borderWidth: 1,
    borderColor: "rgba(46, 204, 113, 0.3)",
  },

  description: {
    fontSize: 15,
    color: "#CCCCCC",
    lineHeight: 22,
    marginBottom: 16,
  },

  // FOOTER
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.05)",
  },
  
  dateText: {
    fontSize: 13,
    color: "#888",
    fontWeight: "500",
  },
  
  supportText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    overflow: "hidden",
  },

  // --- DETAYLAR ---
  detailsContainer: {
    marginTop: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.05)",
  },

  // FOTOĞRAFLAR
  photosContainer: {
    marginBottom: 20,
    height: 160,
  },
  photoWrapper: {
    position: "relative",
    marginRight: 15,
  },
  detailImage: {
    width: 220,
    height: 150,
    borderRadius: 16,
    backgroundColor: "#2C2C2C",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  
  // FOTO SİL BUTONU
  photoDeleteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(220, 38, 38, 0.9)", // Koyu Kırmızı
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  photoDeleteText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },

  // HARİTA
  mapContainer: {
    height: 180,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    marginBottom: 20,
  },
  map: {
    width: "100%",
    height: "100%",
  },

  // SİLME BUTONU (ŞİKAYET)
  deleteButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(220, 38, 38, 0.15)", // Şeffaf Kırmızı Arka Plan
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(220, 38, 38, 0.5)",
    marginBottom: 10,
  },
  deleteButtonText: {
    color: "#EF4444", // Parlak Kırmızı Yazı
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  // AÇ/KAPA BUTONU
  expandButtonContainer: {
    alignItems: "center",
    paddingTop: 5,
  },
  expandButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5,
    width: "100%",
  },
  expandText: {
    color: "#6C63FF",
    fontSize: 12,
    fontWeight: "700",
    marginRight: 4,
    textTransform: "uppercase",
  },
  expandIcon: {
    fontSize: 16,
    color: "#6C63FF",
    fontWeight: "bold",
    marginTop: -2,
  },

  // YÜKLENİYOR / BOŞ
  loadingContainer: { marginTop: 100, alignItems: "center" },
  loadingText: { color: "#AAA", marginTop: 10 },
  emptyContainer: { alignItems: "center", marginTop: 150 },
  emptyText: { color: "#888", fontSize: 16 },
});