import { StyleSheet, Platform, Dimensions } from "react-native";

const COLORS = {
  primary: "#1e3a8a", // Kurumsal Lacivert
  background: "#F8FAFC", // Açık Gri Zemin
  cardBg: "#FFFFFF",
  textDark: "#0f172a",
  textGray: "#64748b",
  border: "#e2e8f0",
  
  // Durum Renkleri
  status: {
    assigned: { bg: "#eff6ff", text: "#1e40af", border: "#dbeafe" }, // Mavi
    in_progress: { bg: "#fefce8", text: "#854d0e", border: "#fef9c3" }, // Sarı
    completed: { bg: "#f0fdf4", text: "#166534", border: "#dcfce7" }, // Yeşil
  }
};

const EmployeeHomeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  // --- HEADER (SADE) ---
  headerContainer: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 50 : 20,
    paddingBottom: 25,
    backgroundColor: COLORS.primary, 
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#1e3a8a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 10,
    justifyContent: 'center',
  },
  
  welcomeText: {
    fontSize: 14, 
    color: '#bfdbfe', 
    fontWeight: '500',
    marginBottom: 4,
  },
  
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },

  // --- LİSTE ---
  listContent: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: 100, // Alt menü payı
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textGray,
    textAlign: "center",
    lineHeight: 24,
  },

  // --- KART TASARIMI ---
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#64748b",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
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
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: 'uppercase',
  },
  
  // Durum stilleri
  status_assigned: {
    backgroundColor: COLORS.status.assigned.bg,
    borderColor: COLORS.status.assigned.border,
  },
  status_in_progress: {
    backgroundColor: COLORS.status.in_progress.bg,
    borderColor: COLORS.status.in_progress.border,
  },
  status_completed: {
    backgroundColor: COLORS.status.completed.bg,
    borderColor: COLORS.status.completed.border,
  },

  addressText: {
    fontSize: 13,
    color: COLORS.textGray,
    marginBottom: 8,
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
  
  detailLink: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  
  detailLinkText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.primary,
    marginRight: 4,
  },
});

export default EmployeeHomeStyles;