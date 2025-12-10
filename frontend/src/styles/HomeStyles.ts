import { StyleSheet, Platform, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

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
    backgroundColor: "rgba(0,0,0,0.75)", // Arka planı biraz daha kararttık (yazılar netleşsin)
  },

  // --- HEADER (Üst Kısım) ---
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 60 : 45,
    paddingHorizontal: 20,
    paddingBottom: 20,
    zIndex: 10,
  },
  
  // SOL ÜSTTEKİ YUVARLAK CAM BUTON (İsteğin Üzerine Eklendi)
  glassButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.1)", // Hafif beyaz şeffaflık
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    // Hafif gölge
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },

  glassButtonIcon: {
    fontSize: 28,
    color: "#FFFFFF",
    fontWeight: "300",
    marginTop: -4, // Ortalamak için ince ayar
    marginLeft: -2
  },
  
  appTitle: {
    fontSize: 28, // Biraz küçülttük ki sığsın
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 1,
    textShadowColor: "rgba(0, 0, 0, 0.9)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },

  // SAĞDAKİ PROFİL RESMİ
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  
  profileImage: {
    width: 44,
    height: 44,
  },

  // --- SEKMELER (TABS) ---
  tabsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    gap: 12,
  },
  
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  
  tabButtonActive: {
    backgroundColor: "#6C63FF",
    borderColor: "#6C63FF",
    shadowColor: "#6C63FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#AAAAAA",
  },
  
  tabTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  // --- LİSTE ---
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },

  // --- KART TASARIMI ---
  card: {
    backgroundColor: "rgba(35, 35, 35, 0.85)", // Daha koyu ve net kart
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
  
  cardTitle: {
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

  cardDescription: {
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
  },
  
  cardDate: {
    fontSize: 13,
    color: "#888",
    fontWeight: "500",
  },
  
  supportButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  
  supportText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
    marginLeft: 6,
  },

  // DETAY BUTONU
  expandButtonContainer: {
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    paddingTop: 10,
  },
  
  expandButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5,
    width: "100%", // Tıklama alanı geniş
  },
  
  expandText: {
    color: "#6C63FF",
    fontSize: 12,
    fontWeight: "700",
    marginRight: 4,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  
  expandIcon: {
    fontSize: 16,
    color: "#6C63FF",
    fontWeight: "bold",
    marginTop: -2,
  },

  // --- DETAYLAR ---
  cardDetails: {
    marginTop: 15,
  },
  detailDescription: {
    fontSize: 15,
    color: "#E0E0E0",
    lineHeight: 24,
    marginBottom: 20,
  },
  photosContainer: {
    marginBottom: 20,
    height: 200,
  },
  detailImage: {
    width: 280,
    height: 180,
    borderRadius: 16,
    marginRight: 15,
    backgroundColor: "#2C2C2C",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  mapContainer: {
    height: 180,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    marginBottom: 10,
  },
  map: {
    width: "100%",
    height: "100%",
  },

  // PROFİL MENÜSÜ
  profileMenu: {
    position: "absolute",
    top: Platform.OS === "ios" ? 110 : 90,
    right: 20,
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    paddingVertical: 5,
    width: 200,
    zIndex: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 15,
  },
  profileMenuItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  profileMenuText: {
    fontSize: 15,
    color: "#E0E0E0",
    fontWeight: "500",
  },
  
  loadingContainer: { marginTop: 100 },
  emptyContainer: { alignItems: "center", marginTop: 100 },
  emptyText: { color: "#888", fontSize: 16 },
});