import { StyleSheet, Platform, Dimensions, StatusBar } from "react-native";

const { width } = Dimensions.get("window");

const COLORS = {
  primary: "#1e3a8a",   // Kurumsal Lacivert
  background: "#F8FAFC", // Açık Zemin
  cardBg: "#FFFFFF",
  textDark: "#0f172a",
  textGray: "#64748b",
  success: "#166534",   // Tamamlandı Yeşili
  successBg: "#f0fdf4",
  border: "#e2e8f0",
};

const EmployeeCompletedStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // --- HEADER (Ortak Kimlik) ---
  headerContainer: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 12 : 20,
    paddingBottom: 25,
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#1e3a8a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 15,
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

  // --- LİSTE AYARLARI ---
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textGray,
    textAlign: "center",
  },

  // --- RESİMLİ KART TASARIMI ---
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    // Gölge
    shadowColor: "#64748b",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    overflow: 'hidden', // Resmin köşeleri taşmasın diye
  },

  // Kartın en üstündeki resim
  cardImageCover: {
    width: '100%',
    height: 160,
    backgroundColor: '#cbd5e1', // Resim yüklenene kadar gri
  },

  // Kartın içindeki yazı alanı
  cardBody: {
    padding: 16,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },

  cardTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textDark,
    marginRight: 10,
  },

  // Yeşil Badge (Tamamlandı)
  statusBadge: {
    backgroundColor: COLORS.successBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#dcfce7",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.success,
    textTransform: 'uppercase',
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
    marginBottom: 16,
    lineHeight: 22,
  },

  // Kart Altı (Tarih ve Buton)
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
    fontWeight: '600',
  },
  detailLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLinkText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.primary,
    marginRight: 4,
  },
  status_completed: {
    backgroundColor: COLORS.successBg,
    borderColor: "#dcfce7",
  },
});

export default EmployeeCompletedStyles;