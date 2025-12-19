import { StyleSheet, Platform, StatusBar } from "react-native";

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
    paddingTop: Platform.OS === "ios" ? 58 : (StatusBar.currentHeight || 24) + 12,
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

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 16,
  },

  card: {
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

  sectionTitle: {
    color: TEXT,
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 10,
  },

  label: {
    color: TEXT,
    marginTop: 10,
    marginBottom: 6,
    fontWeight: "800",
    fontSize: 12,
  },

  input: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 11,
    color: TEXT,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: BORDER,
    fontSize: 14,
  },

  submitBtn: {
    marginTop: 16,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: PRIMARY_2,
    borderWidth: 1,
    borderColor: PRIMARY_2,
    shadowColor: PRIMARY_2,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 4,
  },

  btnDisabled: { opacity: 0.7 },

  submitTxt: { color: "white", fontWeight: "900", fontSize: 14, letterSpacing: 0.3 },

  infoBox: {
    marginTop: 12,
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#EEF2FF",
    borderWidth: 1,
    borderColor: "#E0E7FF",
  },

  infoTitle: { color: PRIMARY_2, fontWeight: "900", marginBottom: 6, fontSize: 12 },

  hint: { color: MUTED, fontSize: 12, lineHeight: 16, fontWeight: "700" },
});
