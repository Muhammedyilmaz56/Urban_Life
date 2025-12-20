import { StyleSheet, Platform, StatusBar } from "react-native";

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
    paddingTop: Platform.OS === "ios" ? 60 : (StatusBar.currentHeight || 24) + 12,
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

  // SIDEBAR MENU
  menuOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 998,
  },

  sidebarMenu: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: 280,
    backgroundColor: CARD,
    zIndex: 999,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 15,
  },

  sidebarHeader: {
    backgroundColor: PRIMARY,
    paddingTop: Platform.OS === "ios" ? 60 : (StatusBar.currentHeight || 24) + 20,
    paddingBottom: 24,
    paddingHorizontal: 20,
    alignItems: "center",
  },

  sidebarAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.3)",
    marginBottom: 12,
  },

  sidebarName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
  },

  sidebarEmail: {
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
    marginTop: 4,
    textAlign: "center",
  },

  sidebarContent: {
    flex: 1,
    paddingTop: 12,
  },

  sidebarMenuItem: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },

  sidebarMenuText: {
    fontSize: 16,
    color: TEXT,
    fontWeight: "600",
  },

  sidebarLogout: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    backgroundColor: "rgba(220, 38, 38, 0.06)",
  },

  sidebarLogoutText: {
    fontSize: 16,
    color: "#DC2626",
    fontWeight: "700",
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
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: "#64748b",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    overflow: 'hidden',
  },

  // Kartın en üstündeki resim
  cardImageCover: {
    width: '100%',
    height: 160,
    backgroundColor: '#cbd5e1',
  },

  // Kart içerik alanı
  cardBody: {
    padding: 16,
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

  addressText: {
    fontSize: 13,
    color: MUTED,
    marginBottom: 10,
    fontStyle: 'italic',
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

  supportButtonActive: {
    backgroundColor: "#ECFDF5",
    borderColor: "#A7F3D0",
  },

  supportText: {
    fontSize: 13,
    fontWeight: "800",
    color: PRIMARY_2,
    marginLeft: 8,
  },

  supportTextActive: {
    color: "#065F46",
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
