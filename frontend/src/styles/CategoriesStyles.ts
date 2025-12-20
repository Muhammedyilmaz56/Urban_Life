import { StyleSheet, Platform, StatusBar } from "react-native";

const COLORS = {
  primary: "#1e3a8a", // Kurumsal Lacivert
  background: "#F8FAFC", // Açık Gri Zemin
  cardBg: "#FFFFFF",
  textDark: "#0f172a",
  textGray: "#64748b",
  border: "#e2e8f0",
  danger: "#ef4444", // Kırmızı
  success: "#22c55e", // Yeşil
};

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 12 : 20,
    backgroundColor: COLORS.background,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
  },

  loadingText: {
    marginTop: 12,
    color: COLORS.textGray,
    fontWeight: "500",
  },

  // --- OLUŞTURMA FORMU ---
  createBox: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: COLORS.cardBg,
    marginBottom: 20,
    // Hafif Gölge
    shadowColor: "#64748b",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  sectionTitle: {
    color: COLORS.textDark,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 16,
    letterSpacing: 0.5,
  },

  input: {
    backgroundColor: "#F1F5F9", // Hafif gri input zemini
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 14,
    color: COLORS.textDark,
    fontSize: 15,
    marginBottom: 12,
  },

  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingHorizontal: 4,
  },

  switchLabel: {
    color: COLORS.textDark,
    fontSize: 15,
    fontWeight: "600",
  },

  saveBtn: {
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },

  saveBtnDisabled: {
    backgroundColor: "#cbd5e1", // Pasif gri
    shadowOpacity: 0,
    elevation: 0,
  },

  saveText: {
    color: "white",
    fontSize: 15,
    fontWeight: "700",
  },

  // --- LİSTE ELEMANLARI ---
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    backgroundColor: COLORS.cardBg,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  cardContent: {
    flex: 1,
    marginRight: 10,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },

  cardTitle: {
    color: COLORS.textDark,
    fontSize: 16,
    fontWeight: "700",
  },

  cardDescription: {
    color: COLORS.textGray,
    fontSize: 13,
    marginTop: 2,
    lineHeight: 18,
  },

  statusBadge: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },

  statusText: {
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
  },

  activeBadge: {
    backgroundColor: "#dcfce7", // Açık yeşil zemin
  },
  activeText: {
    color: "#166534", // Koyu yeşil yazı
  },

  passiveBadge: {
    backgroundColor: "#fee2e2", // Açık kırmızı zemin
  },
  passiveText: {
    color: "#991b1b", // Koyu kırmızı yazı
  },

  deleteBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#fee2e2",
    alignItems: "center",
    justifyContent: "center",
  },

  deleteText: {
    color: COLORS.danger,
    fontSize: 12,
    fontWeight: "700",
  },

  emptyText: {
    color: COLORS.textGray,
    textAlign: "center",
    marginTop: 40,
    fontSize: 15,
  },
});