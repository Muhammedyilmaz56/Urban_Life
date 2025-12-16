import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: "800", marginBottom: 12 },

  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16 },
  loadingText: { marginTop: 10, fontSize: 14, opacity: 0.8 },

  createBox: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginBottom: 14,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  createBtn: {
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  btnDisabled: { opacity: 0.5 },
  createText: { fontWeight: "800" },

  listContent: { paddingBottom: 20 },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    marginBottom: 10,
  },
  rowLeft: { flex: 1, paddingRight: 10 },
  rowTitle: { fontSize: 15, fontWeight: "800" },
  rowSub: { fontSize: 12, opacity: 0.7, marginTop: 4 },

  deleteBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,80,80,0.35)",
  },
  deleteText: { fontWeight: "800" },

  emptyBox: { padding: 20, alignItems: "center" },
  emptyText: { opacity: 0.75 },
});
