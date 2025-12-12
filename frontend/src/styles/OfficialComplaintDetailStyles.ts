import { StyleSheet } from "react-native";

const OfficialComplaintDetailStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: "#4B5563",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#E5E7EB",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#111827",
  },
  categoryText: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 2,
  },
  addressText: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 12,
  },
  sectionTitle: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#374151",
  },
  rejectText: {
    fontSize: 14,
    color: "#B91C1C",
  },
  metaText: {
    marginTop: 8,
    fontSize: 12,
    color: "#9CA3AF",
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  rejectButton: {
    backgroundColor: "#FEE2E2",
    marginRight: 8,
  },
  assignButton: {
    backgroundColor: "#DBEAFE",
    marginLeft: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  modalCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 10,
  },
  modalInput: {
    minHeight: 80,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 8,
    fontSize: 14,
    textAlignVertical: "top",
    color: "#111827",
  },
  modalButtonsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
  },
  modalButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  modalCancel: {
    backgroundColor: "#E5E7EB",
  },
  modalConfirm: {
    backgroundColor: "#2563EB",
  },
  modalButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  employeeList: {
    maxHeight: 220,
    marginTop: 8,
  },
  employeeItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  employeeItemSelected: {
    backgroundColor: "#DBEAFE",
  },
  employeeName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  employeeEmail: {
    fontSize: 12,
    color: "#6B7280",
  },
  emptyEmployeesText: {
    marginTop: 8,
    fontSize: 13,
    color: "#6B7280",
  },
  photosRow: {
    marginTop: 8,
    marginBottom: 8,
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginRight: 8,
    backgroundColor: "#E5E7EB",
  },
  mapButton: {
    marginTop: 4,
    marginBottom: 12,
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#2563EB",
  },
  mapButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  mapContainer: {
    height: 160,
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: "#E5E7EB",
  },
  map: {
    flex: 1,
  },
  fullImageOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  
  fullImage: {
    width: "100%",
    height: "100%",
  },
  
  fullImageClose: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 10,
    borderRadius: 50,
  },
  
  fullImageCloseText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  
});


export default OfficialComplaintDetailStyles;
