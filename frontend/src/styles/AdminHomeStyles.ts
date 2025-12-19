import { StyleSheet, Platform, StatusBar } from "react-native";

const PRIMARY = "#0B3A6A";
const PRIMARY_2 = "#1E3A8A";
const BG = "#F6F8FB";
const CARD = "#FFFFFF";
const BORDER = "#E5E7EB";
const TEXT = "#0F172A";
const MUTED = "#64748B";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },

  // ÜST BAR
  header: {
    backgroundColor: PRIMARY,
    paddingTop: Platform.OS === "ios" ? 58 : (StatusBar.currentHeight || 24) + 12,
    paddingBottom: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.15)",
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 0.2,
  },

  headerSubtitle: {
    color: "rgba(255,255,255,0.85)",
    marginTop: 4,
    fontSize: 12,
    fontWeight: "600",
  },

  headerRightBtn: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
  },

  headerRightBtnText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 13,
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 16,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  sectionTitle: {
    color: TEXT,
    fontSize: 16,
    fontWeight: "900",
    marginTop: 18,
    marginBottom: 10,
  },

  loadingChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "#EEF2FF",
    borderWidth: 1,
    borderColor: "#E0E7FF",
  },

  loadingChipText: {
    color: PRIMARY_2,
    fontWeight: "800",
    fontSize: 12,
  },

  // İSTATİSTİK KARTLARI
  statGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },

  statCard: {
    width: "48%",
    backgroundColor: CARD,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },

  statValue: {
    color: TEXT,
    fontSize: 22,
    fontWeight: "900",
  },

  statTitle: {
    color: MUTED,
    marginTop: 6,
    fontSize: 12,
    fontWeight: "700",
  },

  // MENÜ KARTLARI
  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },

  menuCard: {
    width: "48%",
    backgroundColor: CARD,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    position: "relative",
    minHeight: 96,
  },

  menuTitle: {
    color: TEXT,
    fontSize: 14,
    fontWeight: "900",
  },

  menuSubtitle: {
    color: MUTED,
    fontSize: 12,
    marginTop: 6,
    lineHeight: 16,
    fontWeight: "600",
    paddingRight: 18,
  },

  menuArrow: {
    position: "absolute",
    right: 12,
    top: 12,
    color: PRIMARY_2,
    fontSize: 20,
    fontWeight: "900",
  },
  headerProfileBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.1)",
  },

  headerProfileImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});
