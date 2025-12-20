import { StyleSheet, Platform, StatusBar } from "react-native";

const PRIMARY = "#0B3A6A";
const PRIMARY_2 = "#1E3A8A";
const BG = "#F6F8FB";
const CARD = "#FFFFFF";
const BORDER = "#E5E7EB";
const TEXT = "#0F172A";
const MUTED = "#64748B";
const SOFT = "#F1F5F9";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },

  // HEADER
  header: {
    backgroundColor: PRIMARY,
    paddingTop: Platform.OS === "ios" ? 60 : (StatusBar.currentHeight || 24) + 12,
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
    fontWeight: "900",
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

  // CONTENT
  contentContainer: {
    padding: 16,
    paddingBottom: 30,
  },

  // INFO BANNER
  infoBanner: {
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },

  infoTitle: {
    color: PRIMARY_2,
    fontWeight: "900",
    marginBottom: 6,
  },

  infoText: {
    color: "#1F2937",
    fontWeight: "600",
    lineHeight: 20,
    fontSize: 13,
  },

  // CARD
  card: {
    backgroundColor: CARD,
    borderRadius: 14,
    marginBottom: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },

  label: {
    fontSize: 12,
    fontWeight: "900",
    color: PRIMARY_2,
    letterSpacing: 0.4,
    textTransform: "uppercase",
    marginBottom: 10,
  },

  input: {
    backgroundColor: SOFT,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    padding: 12,
    color: TEXT,
    fontSize: 15,
    fontWeight: "700",
  },

  textArea: {
    minHeight: 110,
    textAlignVertical: "top",
  },

  helperText: {
    marginTop: 8,
    color: MUTED,
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 18,
  },

  // SELECT
  selectButton: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
  },

  selectButtonText: {
    color: TEXT,
    fontWeight: "800",
    flex: 1,
    paddingRight: 10,
  },

  selectChevron: {
    color: MUTED,
    fontSize: 20,
    fontWeight: "900",
    marginTop: -2,
  },

  // MAP
  mapContainer: {
    height: 250,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "#FFFFFF",
  },

  map: {
    width: "100%",
    height: "100%",
  },

  mapHint: {
    fontSize: 12,
    color: MUTED,
    marginTop: 8,
    textAlign: "center",
    fontWeight: "700",
  },

  // IMAGES
  imagePickerButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EFF6FF",
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#BFDBFE",
    marginBottom: 10,
  },

  imagePickerText: {
    color: PRIMARY_2,
    fontWeight: "900",
    fontSize: 14,
  },

  previewRow: {
    flexDirection: "row",
    marginTop: 6,
  },

  previewWrap: {
    position: "relative",
    marginRight: 10,
  },

  previewImage: {
    width: 104,
    height: 104,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "#E2E8F0",
  },

  removeImageBtn: {
    position: "absolute",
    top: -8,
    right: -8,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#0F172A",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },

  removeImageText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
    marginTop: -2,
  },

  // SWITCH
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  switchLabel: {
    fontSize: 14,
    color: TEXT,
    fontWeight: "900",
  },

  // SUBMIT
  submitButton: {
    backgroundColor: PRIMARY_2,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 4,
  },

  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 0.8,
  },

  // MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.55)",
    justifyContent: "center",
    padding: 16,
  },

  modalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: BORDER,
  },

  modalTitle: {
    color: TEXT,
    fontWeight: "900",
    fontSize: 15,
    marginBottom: 10,
  },

  modalLoading: {
    paddingVertical: 16,
    alignItems: "center",
  },

  modalLoadingText: {
    marginTop: 8,
    color: MUTED,
    fontWeight: "700",
  },

  modalList: {
    marginTop: 10,
    maxHeight: 360,
  },

  modalItem: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 10,
    backgroundColor: "#FFFFFF",
  },

  modalItemSelected: {
    borderColor: "#93C5FD",
    backgroundColor: "#EFF6FF",
  },

  modalItemText: {
    color: TEXT,
    fontWeight: "800",
  },

  modalItemTextSelected: {
    color: PRIMARY_2,
    fontWeight: "900",
  },

  modalEmpty: {
    color: MUTED,
    paddingVertical: 12,
    fontWeight: "700",
  },

  modalCloseBtn: {
    marginTop: 6,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: BORDER,
  },

  modalCloseText: {
    color: TEXT,
    fontWeight: "900",
  },
});
