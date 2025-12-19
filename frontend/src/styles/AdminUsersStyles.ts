import { StyleSheet, Platform, StatusBar } from "react-native";

const PRIMARY = "#0B3A6A";
const BG = "#F6F8FB";
const CARD = "#FFFFFF";
const BORDER = "#E5E7EB";
const TEXT = "#0F172A";
const MUTED = "#64748B";

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },

  // TOP BAR - Matches AdminHomeStyles
  topBar: {
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

  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
  },
  backTxt: { color: "white", fontSize: 28, marginTop: -2, fontWeight: "700" },

  titleWrapper: { flex: 1, alignItems: "center" },
  title: { color: "white", fontSize: 16, fontWeight: "900" },
  subtitle: {
    color: "rgba(255,255,255,0.85)",
    marginTop: 2,
    fontSize: 11,
    fontWeight: "700",
  },

  // LOGOUT
  logoutBtn: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,80,80,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,80,80,0.30)",
  },
  logoutTxt: { color: "white", fontSize: 18, fontWeight: "900" },

  // SEARCH
  search: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 10,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: TEXT,
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
    fontSize: 14,
    fontWeight: "600",
  },

  // FILTER ROW
  filterRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
  },
  filterBtnActive: {
    backgroundColor: "#EAF2FF",
    borderColor: "#1E3A8A",
  },
  filterTxt: { color: MUTED, fontWeight: "800", fontSize: 13 },
  filterTxtActive: { color: "#1E3A8A" },

  // ROLE ROW
  roleRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  roleBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
  },
  roleBtnActive: {
    backgroundColor: "#EAF2FF",
    borderColor: "#1E3A8A",
  },
  roleTxt: { color: MUTED, fontWeight: "800", fontSize: 12 },
  roleTxtActive: { color: "#1E3A8A" },

  // CARDS
  listContent: { paddingHorizontal: 16, paddingBottom: 100 },

  card: {
    marginBottom: 10,
    padding: 14,
    borderRadius: 14,
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  cardTitle: { color: TEXT, fontWeight: "900", fontSize: 14 },
  cardSub: { color: MUTED, marginTop: 2, fontSize: 13, fontWeight: "600" },
  cardMeta: { color: MUTED, marginTop: 6, fontSize: 12, fontWeight: "700" },

  badgeWrap: { alignItems: "flex-end" },
  badge: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
  badgeActive: {
    backgroundColor: "#ECFDF5",
    borderColor: "#A7F3D0",
  },
  badgePassive: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
  },
  badgeText: { fontWeight: "900", fontSize: 11 },
  badgeTextActive: { color: "#065F46" },
  badgeTextPassive: { color: "#B91C1C" },

  // LOADING / EMPTY
  loadingWrap: { paddingTop: 28, alignItems: "center" },
  emptyWrap: { paddingTop: 40, alignItems: "center" },
  emptyText: { color: MUTED, fontWeight: "700" },
});
