import { StyleSheet, Platform, Dimensions } from "react-native";

const COLORS = {
  primary: "#1e3a8a", // Kurumsal Lacivert
  background: "#F1F5F9", // Zemin Rengi (Daha belirgin gri)
  cardBg: "#FFFFFF",
  textDark: "#0f172a",
  textGray: "#64748b",
  border: "#e2e8f0",
  danger: "#dc2626",
};

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  // --- HEADER (MAVİ ALAN) ---
  // Artık ekranı kaplamıyor, sadece üst bar görevi görüyor.
  headerBackground: {
    backgroundColor: COLORS.primary,
    paddingTop: Platform.OS === "ios" ? 50 : 20, // Çentik payı
    paddingBottom: 20, // Alt boşluk
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1, // Üstte kalsın ama kartı ezmesin
  },
  
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  // --- PROFİL KARTI ---
  // marginTop: 20 diyerek mavi alandan AŞAĞI itiyoruz (önceden -60 idi)
  profileCard: {
    marginTop: 20, 
    marginHorizontal: 20,
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: "center",
    // Gölge ayarları
    shadowColor: "#64748b",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  // --- AVATAR ---
  // Artık kartın dışına taşmıyor.
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
    // marginTop değerini sildik, normal akışta duracak.
  },
  
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "#f8fafc",
  },
  
  editIconBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: COLORS.cardBg,
  },
  
  editIconText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: -2,
  },

  userName: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.textDark,
    marginBottom: 4,
    textAlign: "center",
  },
  
  userRole: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: "700",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    backgroundColor: "#eff6ff",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    overflow: "hidden",
  },

  userEmail: {
    fontSize: 14,
    color: COLORS.textGray,
    textAlign: "center",
  },

  // --- BİLGİ KARTLARI ---
  sectionContainer: {
    paddingHorizontal: 20,
    marginTop: 20, // Kartlar arası boşluk
  },
  
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textGray,
    marginBottom: 8,
    textTransform: "uppercase",
    marginLeft: 4,
  },

  infoCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 0, // Row'lar padding verecek
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden", // Köşelerden taşmasın
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  
  rowLabel: {
    fontSize: 14,
    color: COLORS.textGray,
    fontWeight: "500",
    flex: 1,
  },
  
  rowValue: {
    fontSize: 15,
    color: COLORS.textDark,
    fontWeight: "600",
    flex: 2,
    textAlign: "right",
  },

  actionButton: {
    marginLeft: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#f0f9ff",
    borderRadius: 8,
  },
  
  actionText: {
    color: COLORS.primary,
    fontWeight: "600",
    fontSize: 12,
  },

  // --- MENÜ VE ÇIKIŞ ---
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.cardBg,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 20,
  },
  
  menuText: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textDark,
  },

  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff1f2",
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: "#fecdd3",
    marginTop: 10,
  },
  
  logoutText: {
    color: COLORS.danger,
    fontSize: 15,
    fontWeight: "700",
  },

  // --- DİĞER (MODAL VS) ---
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  
  modalContainer: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
  },
  
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.textDark,
    marginBottom: 8,
    textAlign: "center",
  },
  
  modalSubtitle: {
    fontSize: 14,
    color: COLORS.textGray,
    textAlign: "center",
    marginBottom: 20,
  },

  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textDark,
    marginBottom: 6,
    marginLeft: 4,
  },
  
  input: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.textDark,
    marginBottom: 16,
  },

  modalButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 10,
  },
  
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
  },
  
  modalCancelText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textGray,
  },
  
  modalConfirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    alignItems: "center",
  },
  
  modalConfirmText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  
  resendLink: {
    alignSelf: 'center',
    marginTop: 16,
    padding: 8,
  },
});