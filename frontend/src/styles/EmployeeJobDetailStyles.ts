import { StyleSheet, Dimensions, Platform, StatusBar } from "react-native";

const COLORS = {
  primary: "#1e3a8a", // Kurumsal Lacivert
  background: "#F8FAFC", // Açık Gri Zemin
  cardBg: "#FFFFFF",
  textDark: "#0f172a",
  textGray: "#64748b",
  border: "#e2e8f0",
  green: "#16a34a",
  orange: "#ea580c",
};

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 12 : 20,
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 10,
    color: COLORS.textGray,
  },

  // --- ÜST BAŞLIK BİLGİLERİ ---
  headerSection: {
    marginBottom: 20,
  },

  titleRow: {
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
    marginRight: 10,
    lineHeight: 28,
  },

  idBadge: {
    backgroundColor: "#eff6ff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dbeafe",
  },

  idText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.primary,
  },

  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  addressText: {
    fontSize: 14,
    color: COLORS.textGray,
    fontStyle: "italic",
    marginLeft: 6,
    flex: 1,
  },

  descriptionCard: {
    backgroundColor: COLORS.cardBg,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 20,
  },

  descLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textGray,
    marginBottom: 4,
    textTransform: "uppercase",
  },

  descText: {
    fontSize: 15,
    color: COLORS.textDark,
    lineHeight: 22,
  },

  // --- KONUM KARTI ---
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textDark,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 4,
  },

  mapCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 20,
    shadowColor: "#64748b",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f9ff',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },

  mapButtonText: {
    color: COLORS.primary,
    fontWeight: "700",
    fontSize: 14,
    marginLeft: 8,
  },

  // --- FOTOĞRAFLAR ---
  photosContainer: {
    marginBottom: 24,
  },

  photo: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginRight: 10,
    backgroundColor: "#e2e8f0",
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  noPhotoText: {
    color: COLORS.textGray,
    fontStyle: 'italic',
    marginLeft: 4,
  },

  // --- AKSİYON BUTONLARI ---
  actionSection: {
    marginTop: 10,
  },

  primaryBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },

  primaryBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  secondaryBtn: {
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  secondaryBtnText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: "700",
  },

  disabledBtn: {
    backgroundColor: "#94a3b8",
    borderColor: "#94a3b8",
    shadowOpacity: 0,
    elevation: 0,
  },

  // --- ÇÖZÜM ÖNİZLEME ---
  solutionPreviewContainer: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "#f0fdf4",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },

  previewTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#15803d",
    marginBottom: 8,
  },

  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#86efac",
  },
});