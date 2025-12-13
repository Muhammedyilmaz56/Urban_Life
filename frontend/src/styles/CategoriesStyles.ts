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

  createBox: {
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    backgroundColor: "#141414",
    marginBottom: 14,
  },

  sectionTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 12,
    padding: 12,
    color: "white",
    marginBottom: 10,
  },

  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  switchLabel: {
    color: "white",
    fontWeight: "700",
  },

  saveBtn: {
    marginTop: 12,
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

  card: {
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    backgroundColor: "#141414",
    marginBottom: 10,
  },

  cardTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "900",
  },

  cardDescription: {
    color: "#cfcfcf",
    marginTop: 6,
  },

  active: {
    marginTop: 6,
    color: "#7CFF7C",
  },

  passive: {
    marginTop: 6,
    color: "#FF7C7C",
  },

  deleteBtn: {
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#3a1b1b",
    alignItems: "center",
  },

  deleteText: {
    color: "white",
    fontWeight: "900",
  },

  emptyText: {
    color: "#bdbdbd",
    textAlign: "center",
    marginTop: 30,
  },
});
