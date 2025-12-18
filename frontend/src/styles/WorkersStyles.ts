import { StyleSheet, Dimensions, Platform } from "react-native";

const { width } = Dimensions.get("window");

const COLORS = {
  primary: "#1e3a8a", // Kurumsal Lacivert
  background: "#F8FAFC", // Açık Gri Zemin
  cardBg: "#FFFFFF",
  textDark: "#0f172a",
  textGray: "#64748b",
  border: "#e2e8f0",
  danger: "#ef4444",
  success: "#22c55e",
  secondary: "#3b82f6",
};

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  
  loadingText: {
    marginTop: 12,
    color: COLORS.textGray,
    fontWeight: "500",
  },

  // --- ÜST EKLEME BUTONU ---
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    margin: 16,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  
  addText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  emptyText: {
    textAlign: "center",
    color: COLORS.textGray,
    marginTop: 40,
    fontSize: 15,
  },

  // --- KART TASARIMI ---
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#64748b",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  // Kartın üst kısmı (Avatar + İsim + Durum)
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#eff6ff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#dbeafe",
    marginRight: 12,
  },
  
  avatarText: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primary,
  },

  headerInfo: {
    flex: 1,
  },

  name: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 4,
  },

  // Durum Rozetleri
  statusContainer: {
    flexDirection: 'row',
  },
  
  activeBadge: {
    backgroundColor: "#dcfce7",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  
  activeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#166534",
    textTransform: "uppercase",
  },
  
  passiveBadge: {
    backgroundColor: "#fee2e2",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  
  passiveText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#991b1b",
    textTransform: "uppercase",
  },

  // --- İLETİŞİM BİLGİLERİ ---
  contactContainer: {
    marginTop: 4,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },

  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },

  contactLabel: {
    fontSize: 13,
    color: COLORS.textGray,
    width: 60, 
  },

  contactValue: {
    fontSize: 13,
    color: COLORS.textDark,
    fontWeight: "500",
  },
  
  clickableText: {
    color: COLORS.secondary,
    textDecorationLine: 'underline',
  },

  // --- ALT BİLGİ (ID'ler ve Sil) ---
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },

  systemTags: {
    flexDirection: 'row',
    gap: 8,
  },

  tag: {
    fontSize: 10,
    color: "#94a3b8",
    backgroundColor: "#f8fafc",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },

  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#fef2f2",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#fee2e2",
  },
  
  deleteText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.danger,
  },
});