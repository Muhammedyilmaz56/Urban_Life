import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B1020" },
  bg: { flex: 1 },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingTop: 54,
    paddingHorizontal: 16,
  },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  backTxt: { color: "white", fontSize: 22, fontWeight: "900" },
  title: { flex: 1, color: "white", fontSize: 18, fontWeight: "800" },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  addTxt: { color: "white", fontSize: 22, fontWeight: "900" },

  search: {
    backgroundColor: "rgba(255,255,255,0.10)",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "white",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    marginBottom: 10,
  },

  filterRow: { flexDirection: "row", gap: 10, marginBottom: 12 },
  filterBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
  },
  filterBtnActive: {
    backgroundColor: "rgba(255,255,255,0.16)",
  },
  filterTxt: { color: "#d0d0d0", fontWeight: "700" },
  filterTxtActive: { color: "white" },

  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    marginBottom: 10,
  },
  cardTitle: { color: "white", fontSize: 15, fontWeight: "800" },
  cardSub: { color: "#d0d0d0", marginTop: 4 },

  badgeWrap: { alignItems: "flex-end", gap: 8 },
  badge: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  badgeActive: { backgroundColor: "rgba(34,197,94,0.22)" },
  badgePassive: { backgroundColor: "rgba(239,68,68,0.22)" },
  badgeText: { color: "white", fontWeight: "800", fontSize: 12 },

  arrow: { color: "white", fontWeight: "900" },
});
