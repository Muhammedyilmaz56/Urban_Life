import { StyleSheet, Platform } from "react-native";

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

  // LIST
  listContent: {
    padding: 16,
    paddingBottom: 24,
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

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },

  title: {
    fontSize: 16,
    fontWeight: "900",
    color: TEXT,
    lineHeight: 22,
  },

  // STATUS PILL
  statusPill: {
    alignSelf: "flex-start",
    marginTop: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
  },

  statusPillText: {
    fontSize: 11,
    fontWeight: "900",
  },

  statusPending: {
    backgroundColor: "#FFF7ED",
    borderColor: "#FDBA74",
  },
  statusTextPending: {
    color: "#9A3412",
  },

  statusInProgress: {
    backgroundColor: "#EFF6FF",
    borderColor: "#93C5FD",
  },
  statusTextInProgress: {
    color: "#1D4ED8",
  },

  statusResolved: {
    backgroundColor: "#ECFDF5",
    borderColor: "#86EFAC",
  },
  statusTextResolved: {
    color: "#166534",
  },

  description: {
    fontSize: 14,
    color: "#1F2937",
    lineHeight: 20,
    marginBottom: 10,
    fontWeight: "600",
  },

  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },

  dateText: {
    fontSize: 12,
    color: MUTED,
    fontWeight: "700",
  },

  supportPill: {
    backgroundColor: SOFT,
    borderWidth: 1,
    borderColor: BORDER,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
  },

  supportText: {
    fontSize: 12,
    fontWeight: "900",
    color: TEXT,
  },

  // DETAILS
  detailsContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },

  sectionMiniTitle: {
    color: PRIMARY_2,
    fontWeight: "900",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginBottom: 10,
  },

  photosContainer: {
    marginBottom: 14,
  },

  photoWrapper: {
    position: "relative",
    marginRight: 10,
  },

  detailImage: {
    width: 220,
    height: 150,
    borderRadius: 12,
    backgroundColor: "#E2E8F0",
    borderWidth: 1,
    borderColor: BORDER,
  },

  photoDeleteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#B91C1C",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
  },

  photoDeleteText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.2,
  },

  mapBlock: {
    marginTop: 6,
    marginBottom: 12,
  },

  mapContainer: {
    height: 180,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "#FFFFFF",
  },

  map: {
    width: "100%",
    height: "100%",
  },

  deleteButton: {
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FCA5A5",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  deleteButtonText: {
    color: "#B91C1C",
    fontWeight: "900",
    fontSize: 13,
    letterSpacing: 0.2,
  },

  // EXPAND
  expandButtonContainer: {
    marginTop: 8,
    alignItems: "center",
  },

  expandButton: {
    width: "100%",
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: SOFT,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: "center",
  },

  expandText: {
    color: PRIMARY_2,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.4,
  },

  // LOADING / EMPTY
  loadingContainer: {
    marginTop: 80,
    alignItems: "center",
  },

  loadingText: {
    marginTop: 10,
    color: MUTED,
    fontWeight: "800",
  },

  emptyContainer: {
    alignItems: "center",
    marginTop: 120,
    paddingHorizontal: 20,
  },

  emptyTitle: {
    color: TEXT,
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 8,
  },

  emptyText: {
    color: MUTED,
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 18,
  },
});
