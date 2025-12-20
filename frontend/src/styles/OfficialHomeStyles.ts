import { StyleSheet, Platform, Dimensions, StatusBar } from "react-native";

const { width } = Dimensions.get("window");


const COLORS = {
  primary: "#1e3a8a",
  background: "#F8FAFC",
  cardBg: "#FFFFFF",
  textDark: "#0f172a",
  textGray: "#64748b",
  border: "#e2e8f0",


  status: {
    pending: { bg: "#fff7ed", text: "#9a3412", border: "#ffedd5" },
    in_progress: { bg: "#eff6ff", text: "#1e40af", border: "#dbeafe" },
    assigned: { bg: "#f0fdf4", text: "#166534", border: "#dcfce7" },
    resolved: { bg: "#ecfdf5", text: "#047857", border: "#d1fae5" },
    rejected: { bg: "#fef2f2", text: "#991b1b", border: "#fee2e2" },
  }
};

const OfficialHomeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },


  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 12 : 20,
    paddingBottom: 25,
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.8)',
  },

  menuOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
    zIndex: 20,
  },
  menuContainer: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 100 : 75,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    width: 200,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 15,
    zIndex: 25,
  },
  menuItem: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 15,
    color: COLORS.textDark,
    fontWeight: '600',
    marginLeft: 10,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: 0,
  },


  listContent: {
    padding: 20,
    paddingTop: 15,
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
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textGray,
    textAlign: "center",
    lineHeight: 24,
  },


  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
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
    marginBottom: 12,
  },
  cardTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.textDark,
    marginRight: 10,
    lineHeight: 22,
  },


  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: 'uppercase',
  },

  status_pending: {
    backgroundColor: COLORS.status.pending.bg,
    borderColor: COLORS.status.pending.border,
  },
  status_in_progress: {
    backgroundColor: COLORS.status.in_progress.bg,
    borderColor: COLORS.status.in_progress.border,
  },
  status_assigned: {
    backgroundColor: COLORS.status.assigned.bg,
    borderColor: COLORS.status.assigned.border,
  },
  status_resolved: {
    backgroundColor: COLORS.status.resolved.bg,
    borderColor: COLORS.status.resolved.border,
  },
  status_rejected: {
    backgroundColor: COLORS.status.rejected.bg,
    borderColor: COLORS.status.rejected.border,
  },


  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoryText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '600',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 13,
    color: COLORS.textGray,
    marginBottom: 10,
    fontStyle: 'italic',
  },
  descriptionText: {
    fontSize: 14,
    color: "#334155",
    marginBottom: 12,
    lineHeight: 20,
  },


  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  dateText: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: '500',
  },
  supportContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  supportText: {
    fontSize: 12,
    color: COLORS.textDark,
    fontWeight: '600',
    marginLeft: 4,
  },
});

export default OfficialHomeStyles;