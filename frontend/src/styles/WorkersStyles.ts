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

  addBtn: {
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    alignItems: "center",
    marginBottom: 12,
  },

  addText: {
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

  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },

  name: {
    color: "white",
    fontSize: 16,
    fontWeight: "900",
    flex: 1,
  },

  subText: {
    marginTop: 6,
    color: "#cfcfcf",
  },

  metaText: {
    marginTop: 6,
    color: "#9a9a9a",
    fontSize: 12,
  },

  active: {
    color: "#7CFF7C",
    fontWeight: "800",
  },

  passive: {
    color: "#FF7C7C",
    fontWeight: "800",
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
