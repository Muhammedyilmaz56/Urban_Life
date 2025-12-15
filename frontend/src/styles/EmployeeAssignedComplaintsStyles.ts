import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  listContent: { padding: 16, paddingBottom: 24 },

  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  loadingText: { marginTop: 10, color: "#444", fontWeight: "700" },

  card: {
    backgroundColor: "#0f0f0f",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#222",
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  title: { color: "white", fontWeight: "900", fontSize: 15, flex: 1 },

  badge: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  badgeText: { color: "white", fontWeight: "900", fontSize: 12 },

  category: { marginTop: 10, color: "rgba(255,255,255,0.85)", fontWeight: "700" },
  address: { marginTop: 6, color: "rgba(255,255,255,0.7)" },
  desc: { marginTop: 10, color: "rgba(255,255,255,0.85)", lineHeight: 19 },

  footer: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  date: { color: "rgba(255,255,255,0.6)", fontWeight: "700", fontSize: 12 },
  support: { color: "rgba(255,255,255,0.9)", fontWeight: "900", fontSize: 12 },

  emptyBox: {
    paddingVertical: 40,
    alignItems: "center",
  },
  emptyText: { color: "#555", fontWeight: "800" },
});

