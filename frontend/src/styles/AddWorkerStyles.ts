import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#0f0f0f",
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0f0f0f",
  },

  loadingText: {
    marginTop: 10,
    color: "#bdbdbd",
  },

  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 14,
  },

  label: {
    color: "#d9d9d9",
    fontWeight: "700",
    marginTop: 10,
    marginBottom: 6,
  },

  input: {
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 12,
    padding: 12,
    color: "white",
    backgroundColor: "#141414",
  },

  pickerBox: {
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#141414",
  },

  picker: {
    color: "white",
  },

  saveBtn: {
    marginTop: 18,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#1f3b1f",
    alignItems: "center",
  },

  saveBtnDisabled: {
    backgroundColor: "#1a1a1a",
  },

  saveText: {
    color: "white",
    fontWeight: "900",
  },
  selectBtn: {
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#141414",
  },

  selectText: {
    color: "white",
    fontWeight: "800",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    padding: 16,
    justifyContent: "center",
  },

  modalCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    backgroundColor: "#141414",
    padding: 12,
    maxHeight: "70%",
  },

  modalTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 10,
  },

  modalItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
  },

  modalItemText: {
    color: "white",
    fontWeight: "700",
  },

  modalCloseBtn: {
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    alignItems: "center",
  },

  modalCloseText: {
    color: "white",
    fontWeight: "900",
  },
  emptyText: {
    color: "#bdbdbd",
    textAlign: "center",
    marginTop: 20,
  },
  

});
