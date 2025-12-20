import { StyleSheet, Dimensions, Platform, StatusBar } from "react-native";

const { width } = Dimensions.get("window");

const COLORS = {
  primary: "#1e3a8a",
  background: "#F8FAFC",
  cardBg: "#FFFFFF",
  textDark: "#0f172a",
  textGray: "#64748b",
  border: "#e2e8f0",
  danger: "#dc2626",
  success: "#16a34a",
};

const OfficialComplaintDetailStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 12 : 20,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: COLORS.textGray,
    fontWeight: "500",
  },

  headerSection: {
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.textDark,
    lineHeight: 28,
    marginRight: 10,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  categoryText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "600",
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: COLORS.textGray,
    fontStyle: "italic",
  },

  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#64748b",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  description: {
    fontSize: 15,
    color: "#334155",
    lineHeight: 24,
  },

  rejectContainer: {
    backgroundColor: "#FEF2F2",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FECACA",
    marginTop: 8,
  },
  rejectLabel: {
    color: "#991b1b",
    fontWeight: "bold",
    fontSize: 13,
    marginBottom: 4,
  },
  rejectText: {
    fontSize: 14,
    color: "#7f1d1d",
  },

  metaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  metaText: {
    fontSize: 13,
    color: "#94a3b8",
    fontWeight: "500",
  },

  mapContainer: {
    height: 180,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
  },
  map: {
    flex: 1,
  },
  mapButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    backgroundColor: "#eff6ff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dbeafe",
  },
  mapButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "600",
  },

  photosRow: {
    marginVertical: 4,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 30,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rejectButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: COLORS.danger,
  },
  rejectButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.danger,
  },
  assignButton: {
    backgroundColor: COLORS.primary,
  },
  assignButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  modalCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.textDark,
    marginBottom: 16,
    textAlign: "center",
  },
  modalInput: {
    minHeight: 100,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    textAlignVertical: "top",
    color: COLORS.textDark,
    marginBottom: 20,
  },

  employeeList: {
    maxHeight: 250,
    marginBottom: 20,
  },
  employeeItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "transparent",
  },
  employeeItemSelected: {
    backgroundColor: "#eff6ff",
    borderColor: COLORS.primary,
  },
  employeeAvatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e2e8f0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  employeeInitials: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.textGray,
  },
  employeeInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textDark,
  },
  employeeEmail: {
    fontSize: 12,
    color: COLORS.textGray,
  },
  emptyEmployeesText: {
    textAlign: "center",
    color: COLORS.textGray,
    padding: 20,
  },

  modalButtonsRow: {
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  modalCancel: {
    backgroundColor: "#f1f5f9",
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textDark,
  },
  modalConfirm: {
    backgroundColor: COLORS.primary,
  },
  modalConfirmText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  fullImageOverlay: {
    flex: 1,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: {
    width: width,
    height: "80%",
  },
  fullImageClose: {
    position: "absolute",
    top: Platform.OS === "android" ? 50 : 50,
    right: 20,
    zIndex: 10,
    backgroundColor: "rgba(255,255,255,0.3)",
    padding: 8,
    borderRadius: 20,
  },
  fullImageCloseText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default OfficialComplaintDetailStyles;