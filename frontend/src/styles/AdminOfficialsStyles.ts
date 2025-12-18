import { StyleSheet, Platform } from "react-native";

const PRIMARY = "#0B3A6A";
const PRIMARY_2 = "#1E3A8A";
const BG = "#F6F8FB";
const CARD = "#FFFFFF";
const BORDER = "#E5E7EB";
const TEXT = "#0F172A";
const MUTED = "#64748B";

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },

  // TOP BAR
  topBar: {
    backgroundColor: PRIMARY,
    paddingTop: Platform.OS === "ios" ? 58 : 18,
    paddingBottom: 12,
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

  title: { color: "white", fontSize: 16, fontWeight: "900" },
  subtitle: {
    color: "rgba(255,255,255,0.85)",
    marginTop: 2,
    fontSize: 11,
    fontWeight: "700",
  },

  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
  },
  addTxt: { color: "white", fontSize: 22, fontWeight: "900", marginTop: -2 },

  // SEARCH
  searchWrap: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  search: {
    backgroundColor: CARD,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: TEXT,
    borderWidth: 1,
    borderColor: BORDER,
    fontSize: 14,
  },

  // FILTERS
  filterRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 6,
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: "center",
  },
  filterBtnActive: {
    borderColor: PRIMARY_2,
    backgroundColor: "#EAF2FF",
  },
  filterTxt: { color: MUTED, fontWeight: "800", fontSize: 12 },
  filterTxtActive: { color: PRIMARY_2 },

  // LIST
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 120,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 14,
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },

  cardTitle: { color: TEXT, fontSize: 15, fontWeight: "900" },
  cardSub: { color: MUTED, marginTop: 4, fontSize: 12, fontWeight: "700" },

  rightCol: { alignItems: "flex-end", gap: 8 },

  badge: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
  badgeActive: { backgroundColor: "#ECFDF5", borderColor: "#A7F3D0" },
  badgePassive: { backgroundColor: "#FEF2F2", borderColor: "#FECACA" },
  badgeText: { color: TEXT, fontWeight: "900", fontSize: 12 },

  arrow: { color: MUTED, fontWeight: "900", fontSize: 18, marginTop: -2 },

  emptyBox: { paddingTop: 40, alignItems: "center" },
  emptyText: { color: MUTED, fontWeight: "700" },
});
