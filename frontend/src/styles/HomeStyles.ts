import { StyleSheet, Platform } from "react-native";

const PRIMARY = "#0B3A6A"; // kurum mavisi
const PRIMARY_2 = "#1E3A8A"; // alternatif mavi
const BORDER = "#E5E7EB"; // açık gri
const BG = "#F6F8FB"; // arka plan
const TEXT = "#0F172A"; // koyu metin
const MUTED = "#64748B"; // ikincil metin
const CARD = "#FFFFFF";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },

  content: {
    flex: 1,
    backgroundColor: BG,
  },

  // HEADER
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "ios" ? 60 : 20,
    paddingHorizontal: 16,
    paddingBottom: 14,
    backgroundColor: PRIMARY,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.15)",
  },

  glassButton: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.12)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },

  glassButtonIcon: {
    fontSize: 20,
    color: "#FFFFFF",
    fontWeight: "700",
  },

  appTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },

  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.12)",
  },

  profileImage: {
    width: 44,
    height: 44,
  },

  // PROFILE MENU
  profileMenu: {
    position: "absolute",
    top: Platform.OS === "ios" ? 110 : 78,
    right: 16,
    backgroundColor: CARD,
    borderRadius: 12,
    paddingVertical: 6,
    width: 220,
    zIndex: 999,
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },

  profileMenuItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
  },

  profileMenuText: {
    fontSize: 14,
    color: TEXT,
    fontWeight: "600",
  },

  // ÇIKIŞ (EKLENDİ)
  profileMenuLogout: {
    borderTopWidth: 1,
    borderTopColor: BORDER,
    backgroundColor: "rgba(185, 28, 28, 0.06)",
  },

  profileMenuLogoutText: {
    color: "#B91C1C",
    fontWeight: "900",
  },

  // TABS
  tabsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    gap: 10,
    backgroundColor: BG,
  },

  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
  },

  tabButtonActive: {
    borderColor: PRIMARY_2,
    backgroundColor: "#EAF2FF",
  },

  tabText: {
    fontSize: 13,
    fontWeight: "700",
    color: MUTED,
  },

  tabTextActive: {
    color: PRIMARY_2,
  },

  // LIST
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
    paddingTop: 6,
  },

  // CARD
  card: {
    backgroundColor: CARD,
    borderRadius: 14,
    marginBottom: 14,
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
    gap: 10,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: TEXT,
    flex: 1,
    lineHeight: 22,
  },

  // STATUS
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    fontSize: 11,
    fontWeight: "800",
    overflow: "hidden",
    textAlign: "center",
  },

  statusPending: {
    backgroundColor: "#FFF7ED",
    color: "#9A3412",
    borderWidth: 1,
    borderColor: "#FED7AA",
  },

  statusInProgress: {
    backgroundColor: "#EFF6FF",
    color: "#1D4ED8",
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },

  statusResolved: {
    backgroundColor: "#ECFDF5",
    color: "#065F46",
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },

  cardDescription: {
    fontSize: 14,
    color: MUTED,
    lineHeight: 20,
    marginBottom: 12,
  },

  // FOOTER
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cardDate: {
    fontSize: 12,
    color: MUTED,
    fontWeight: "600",
  },

  supportButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEF2FF",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E7FF",
  },

  supportText: {
    fontSize: 13,
    fontWeight: "800",
    color: PRIMARY_2,
    marginLeft: 8,
  },

  // DETAILS
  cardDetails: { marginTop: 10 },

  detailDescription: {
    fontSize: 14,
    color: TEXT,
    lineHeight: 20,
    marginBottom: 12,
  },

  photosContainer: {
    marginBottom: 12,
    height: 190,
  },

  detailImage: {
    width: 260,
    height: 170,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: BORDER,
  },

  mapContainer: {
    height: 180,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 6,
    backgroundColor: "#F8FAFC",
  },

  map: { width: "100%", height: "100%" },

  expandButtonContainer: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    alignItems: "center",
    paddingTop: 10,
  },

  expandButton: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
  },

  expandText: {
    color: PRIMARY_2,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },

  loadingContainer: {
    marginTop: 100,
    alignItems: "center",
  },

  emptyContainer: {
    alignItems: "center",
    marginTop: 100,
  },

  emptyText: {
    color: MUTED,
    fontSize: 14,
    fontWeight: "600",
  },
});
