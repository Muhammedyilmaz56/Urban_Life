import { StyleSheet, Platform, StatusBar } from "react-native";

const PRIMARY = "#0B3A6A";
const PRIMARY_2 = "#1E3A8A";
const BG = "#F6F8FB";
const CARD = "#FFFFFF";
const BORDER = "#E5E7EB";
const TEXT = "#0F172A";
const MUTED = "#64748B";
const DANGER_BG = "#FEF2F2";
const DANGER_BORDER = "#FECACA";
const DANGER_TEXT = "#B91C1C";

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
  subtitle: { color: "rgba(255,255,255,0.85)", marginTop: 2, fontSize: 11, fontWeight: "700" },

  logoutTopBtn: {
    height: 44,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
  },
  logoutTopTxt: { color: "white", fontWeight: "900", fontSize: 12 },

  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 24 },

  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16 },

  // AVATAR
  avatarBox: { alignItems: "center", marginBottom: 14 },
  avatar: { width: 110, height: 110, borderRadius: 55, backgroundColor: "#F1F5F9" },

  avatarPlaceholder: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarPlaceholderTxt: { color: PRIMARY_2, fontWeight: "900" },
  avatarHint: { marginTop: 8, color: MUTED, fontSize: 12, fontWeight: "700" },

  // CARD
  card: {
    backgroundColor: CARD,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  cardTitle: { color: TEXT, fontWeight: "900", fontSize: 14, marginBottom: 8 },

  label: { color: MUTED, marginTop: 10, marginBottom: 6, fontWeight: "800", fontSize: 12 },

  input: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: TEXT,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: BORDER,
    fontSize: 14,
  },

  // BUTTONS
  primaryBtn: {
    marginTop: 14,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EAF2FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  primaryBtnTxt: { color: PRIMARY_2, fontWeight: "900" },

  secondaryBtn: {
    marginTop: 14,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: BORDER,
  },
  secondaryBtnTxt: { color: MUTED, fontWeight: "900" },

  dangerBtn: {
    marginTop: 6,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: DANGER_BG,
    borderWidth: 1,
    borderColor: DANGER_BORDER,
  },
  dangerBtnTxt: { color: DANGER_TEXT, fontWeight: "900" },
});
