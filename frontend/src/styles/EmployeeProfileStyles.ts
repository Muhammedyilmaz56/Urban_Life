import { StyleSheet, Platform, Dimensions, StatusBar } from "react-native";

const { width } = Dimensions.get("window");

const COLORS = {
  primary: "#1e3a8a",   // Kurumsal Lacivert
  secondary: "#bfdbfe", // Açık Mavi (Vurgular için)
  background: "#F8FAFC", // Ana Zemin
  cardBg: "#FFFFFF",
  textDark: "#0f172a",
  textGray: "#64748b",
  border: "#e2e8f0",
  danger: "#ef4444",    // Çıkış butonu vb. için
};

const EmployeeProfileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // --- ÜST BAŞLIK ALANI (LACİVERT) ---
  headerBackground: {
    backgroundColor: COLORS.primary,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 16,
    paddingBottom: 25,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    alignItems: 'center',
    shadowColor: "#1e3a8a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    zIndex: 1,
  },

  headerTopRow: {
    width: '100%',
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 6,
  },

  backButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
  },
  backButtonIcon: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginTop: -4, // İkonu ortalamak için ince ayar
  },

  // --- AVATAR ALANI ---
  avatarContainer: {
    alignItems: 'center',
    marginTop: 4,
  },
  avatarWrap: {
    position: 'relative',
    padding: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 45,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: '#cbd5e1',
  },
  editIconBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  editIconText: {
    fontSize: 18,
    color: COLORS.primary,
    fontWeight: 'bold',
    marginTop: -2,
  },

  nameText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 12,
  },
  roleText: {
    fontSize: 14,
    color: COLORS.secondary,
    marginTop: 4,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  // --- İÇERİK (SCROLL) ---
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },

  // --- BİLGİ KARTLARI (SECTIONS) ---
  sectionCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#64748b",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 15,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Satır (Row) Yapısı
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  infoLabel: {
    fontSize: 13,
    color: COLORS.textGray,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textDark,
  },
  actionText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 13,
  },

  // --- BUTONLAR ---
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  menuText: {
    fontSize: 15,
    color: COLORS.textDark,
    fontWeight: '500',
  },

  logoutButton: {
    backgroundColor: '#fee2e2',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fecaca',
    marginTop: 10,
  },
  logoutText: {
    color: COLORS.danger,
    fontWeight: '700',
    fontSize: 15,
  },

  // --- MODAL STİLLERİ (Temiz Beyaz) ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // Karartma
    justifyContent: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.textDark,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 12,
  },

  // Modal Butonları
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: COLORS.textGray,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
});

export default EmployeeProfileStyles;