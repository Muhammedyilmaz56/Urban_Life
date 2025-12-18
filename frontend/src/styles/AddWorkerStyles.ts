import { StyleSheet, Dimensions } from "react-native";

const COLORS = {
  primary: "#1e3a8a", // Kurumsal Lacivert
  background: "#F8FAFC", // Açık Gri Zemin
  cardBg: "#FFFFFF",
  textDark: "#0f172a",
  textGray: "#64748b",
  border: "#e2e8f0",
  inputBg: "#FFFFFF",
};

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.background,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
  },

  loadingText: {
    marginTop: 12,
    color: COLORS.textGray,
    fontWeight: "500",
  },

  // --- BAŞLIK ALANI ---
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.textDark,
    marginBottom: 8,
    textAlign: "center",
    marginTop: 10,
  },
  
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textGray,
    textAlign: "center",
    marginBottom: 30,
  },

  // --- FORM ELEMANLARI ---
  formContainer: {
    backgroundColor: COLORS.background,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textDark,
    marginBottom: 8,
    marginLeft: 4,
  },

  input: {
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: COLORS.textDark,
    marginBottom: 20,
    shadowColor: "#64748b",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  // --- KATEGORİ SEÇİCİ ---
  selectBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 30,
    shadowColor: "#64748b",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  selectText: {
    fontSize: 15,
    fontWeight: "500",
    color: COLORS.textDark,
  },
  
  selectIcon: {
    fontSize: 12,
    color: COLORS.textGray,
  },

  // --- KAYDET BUTONU ---
  saveBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 10,
  },

  saveBtnDisabled: {
    backgroundColor: "#94a3b8", // Pasif Gri
    shadowOpacity: 0,
    elevation: 0,
  },

  saveText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  // --- MODAL (KATEGORİ SEÇİMİ) ---
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.6)", // Koyu lacivert transparan
    padding: 20,
    justifyContent: "center",
  },

  modalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    maxHeight: "60%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 16,
    textAlign: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    paddingBottom: 12,
  },

  modalListContent: {
    paddingBottom: 10,
  },

  modalItem: {
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  modalItemText: {
    fontSize: 15,
    color: COLORS.textDark,
    fontWeight: "500",
  },
  
  modalItemSelected: {
    backgroundColor: "#eff6ff",
    borderRadius: 8,
  },
  
  modalItemTextSelected: {
    color: COLORS.primary,
    fontWeight: "700",
  },

  modalCloseBtn: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
  },

  modalCloseText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textGray,
  },

  emptyText: {
    textAlign: "center",
    color: COLORS.textGray,
    marginTop: 20,
  },
});