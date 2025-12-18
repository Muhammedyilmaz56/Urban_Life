import { StyleSheet, Platform } from "react-native";

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
    paddingTop: Platform.OS === "ios" ? 58 : 18,
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

  title: { color: "white", fontSize: 16, fontWeight: "900" },
  subtitle: {
    color: "rgba(255,255,255,0.85)",
    marginTop: 2,
    fontSize: 11,
    fontWeight: "700",
  },

  content: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 100 },

  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16 },
  loadingText: { marginTop: 10, fontSize: 14, color: MUTED, fontWeight: "800" },
  errorText: { fontSize: 14, color: TEXT, opacity: 0.9 },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 14,
  },

  card: {
    width: "48%",
    borderRadius: 14,
    padding: 14,
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  cardLabel: { fontSize: 12, color: MUTED, marginBottom: 6, fontWeight: "700" },
  cardValue: { fontSize: 22, fontWeight: "900", color: TEXT },

  section: {
    marginTop: 14,
    borderRadius: 14,
    padding: 14,
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  sectionTitle: { fontSize: 14, fontWeight: "900", color: TEXT, marginBottom: 10 },
  muted: { fontSize: 13, color: MUTED, fontWeight: "700" },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  rowKey: { fontSize: 13, fontWeight: "700", color: TEXT },
  rowVal: { fontSize: 13, fontWeight: "900", color: PRIMARY },
});
