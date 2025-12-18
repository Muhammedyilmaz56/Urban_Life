import { StyleSheet, Platform } from "react-native";

const PRIMARY = "#0B3A6A";
const PRIMARY_2 = "#1E3A8A";
const BG = "#F6F8FB";
const CARD = "#FFFFFF";
const BORDER = "#E5E7EB";
const TEXT = "#0F172A";
const MUTED = "#64748B";
const DANGER = "#B91C1C";
const DANGER_BG = "#FEF2F2";
const DANGER_BORDER = "#FECACA";

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

  refreshBtn: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
  },
  refreshTxt: { color: "white", fontSize: 12, fontWeight: "900" },

  // LOADING
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16 },
  loadingText: { marginTop: 10, fontSize: 13, color: MUTED, fontWeight: "800" },

  // CREATE CARD
  createCard: {
    margin: 16,
    marginBottom: 10,
    padding: 14,
    borderRadius: 14,
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },

  sectionTitle: {
    color: TEXT,
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 10,
  },

  createBox: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: TEXT,
    backgroundColor: "#F8FAFC",
  },

  createBtn: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: PRIMARY_2,
    borderWidth: 1,
    borderColor: PRIMARY_2,
  },

  btnDisabled: { opacity: 0.55 },

  createText: { fontWeight: "900", color: "white", fontSize: 13 },

  helperText: {
    marginTop: 10,
    color: MUTED,
    fontSize: 12,
    fontWeight: "700",
  },

  // LIST
  listContent: { paddingHorizontal: 16, paddingBottom: 120, paddingTop: 6 },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: CARD,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },

  rowLeft: { flex: 1, paddingRight: 10 },

  rowTitle: { fontSize: 14, fontWeight: "900", color: TEXT },

  rowSub: { fontSize: 12, color: MUTED, marginTop: 4, fontWeight: "700" },

  deleteBtn: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: DANGER_BORDER,
    backgroundColor: DANGER_BG,
  },

  deleteText: { fontWeight: "900", color: DANGER, fontSize: 12 },

  emptyBox: { padding: 20, alignItems: "center" },
  emptyText: { color: MUTED, fontWeight: "800" },
});
