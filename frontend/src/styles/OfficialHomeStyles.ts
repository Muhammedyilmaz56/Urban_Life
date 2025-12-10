import { StyleSheet } from "react-native";

const OfficialHomeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  listContent: {
    padding: 16,
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
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#FFFFFF",
  },
  emptyText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  cardTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#111827",
  },
  // Duruma göre renkler
  status_pending: {
    backgroundColor: "#FEF3C7",
  },
  status_in_progress: {
    backgroundColor: "#DBEAFE",
  },
  status_assigned: {
    backgroundColor: "#E0F2FE",
  },
  status_resolved: {
    backgroundColor: "#DCFCE7",
  },
  status_rejected: {
    backgroundColor: "#FEE2E2",
  },
  categoryText: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 2,
  },
  addressText: {
    fontSize: 13,
    color: "#4B5563",
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateText: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  supportText: {
    fontSize: 12,
    color: "#6B7280",
  },
});

export default OfficialHomeStyles;
