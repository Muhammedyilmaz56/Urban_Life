import { StyleSheet, Platform } from "react-native";

const PRIMARY = "#0B3A6A";
const PRIMARY_2 = "#1E3A8A";
const BG = "#F6F8FB";
const CARD = "#FFFFFF";
const BORDER = "#E5E7EB";
const TEXT = "#0F172A";
const MUTED = "#64748B";
const DANGER = "#B91C1C";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },

  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: BG,
  },

  errorText: {
    color: TEXT,
    fontWeight: "700",
  },

  // HEADER (TOP BAR)
  header: {
    backgroundColor: PRIMARY,
    paddingTop: Platform.OS === "ios" ? 60 : 18,
    paddingBottom: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.15)",
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0.2,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.12)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },

  backButtonIcon: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "700",
    marginTop: -2,
  },

  // TOP CARD
  topCard: {
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 14,
  },

  avatarWrap: {
    width: 92,
    height: 92,
    borderRadius: 46,
    position: "relative",
    borderWidth: 2,
    borderColor: "#EAF2FF",
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46, 
    borderWidth: 2,   
    borderColor: "#EAF2FF",
  },

  avatarEditButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: PRIMARY_2,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },

  avatarEditText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
    marginTop: -1,
  },

  name: {
    fontSize: 16,
    fontWeight: "900",
    color: TEXT,
    textAlign: "center",
  },

  email: {
    fontSize: 13,
    color: MUTED,
    fontWeight: "600",
    marginTop: 4,
    textAlign: "center",
  },

  // SECTION
  section: {
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: "900",
    color: PRIMARY_2,
    letterSpacing: 0.4,
    textTransform: "uppercase",
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#EEF2F7",
  },

  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#EEF2F7",
  },

  label: {
    fontSize: 13,
    fontWeight: "800",
    color: TEXT,
  },

  value: {
    fontSize: 13,
    fontWeight: "600",
    color: MUTED,
    marginTop: 3,
  },

  actionText: {
    fontSize: 13,
    fontWeight: "900",
    color: PRIMARY_2,
  },

  arrow: {
    fontSize: 20,
    color: MUTED,
    fontWeight: "900",
    marginTop: -2,
  },

  // LOGOUT
  logoutButton: {
    marginTop: 6,
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  logoutText: {
    color: DANGER,
    fontSize: 14,
    fontWeight: "900",
  },

  // MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.55)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },

  modalContainer: {
    width: "100%",
    maxWidth: 520,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 16,
  },

  modalTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: TEXT,
    marginBottom: 12,
  },

  helperText: {
    fontSize: 12,
    color: MUTED,
    fontWeight: "600",
    marginBottom: 10,
  },

  input: {
    height: 46,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: "#F8FAFC",
    color: TEXT,
    fontWeight: "700",
    marginBottom: 10,
  },

  modalButtonsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 6,
  },

  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "#FFFFFF",
    minWidth: 110,
    alignItems: "center",
  },

  cancelButtonText: {
    color: MUTED,
    fontWeight: "900",
  },

  primaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: PRIMARY_2,
    minWidth: 110,
    alignItems: "center",
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "900",
  },
});
