import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  bg: { flex: 1 },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.55)" },

  topBar: {
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.14)",
  },
  backTxt: { color: "white", fontSize: 26, marginTop: -2 },
  title: { color: "white", fontSize: 18, fontWeight: "700" },

  search: {
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: "white",
    backgroundColor: "rgba(0,0,0,0.35)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
  },

  filterRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
  },
  filterBtnActive: {
    backgroundColor: "rgba(255,255,255,0.22)",
    borderColor: "rgba(255,255,255,0.28)",
  },
  filterTxt: { color: "rgba(255,255,255,0.85)", fontWeight: "700" },
  filterTxtActive: { color: "white" },

  roleRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  roleBtn: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
  },
  roleBtnActive: {
    backgroundColor: "rgba(255,255,255,0.22)",
    borderColor: "rgba(255,255,255,0.28)",
  },
  roleTxt: { color: "rgba(255,255,255,0.85)", fontWeight: "700", fontSize: 12 },
  roleTxtActive: { color: "white" },

  card: {
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 12,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  cardTitle: { color: "white", fontWeight: "800", fontSize: 15 },
  cardSub: { color: "rgba(255,255,255,0.8)", marginTop: 2 },
  cardMeta: { color: "rgba(255,255,255,0.7)", marginTop: 6, fontSize: 12 },

  badgeWrap: { alignItems: "flex-end" },
  badge: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
  badgeActive: {
    backgroundColor: "rgba(0, 200, 120, 0.18)",
    borderColor: "rgba(0, 200, 120, 0.35)",
  },
  badgePassive: {
    backgroundColor: "rgba(255, 80, 80, 0.16)",
    borderColor: "rgba(255, 80, 80, 0.35)",
  },
  badgeText: { color: "white", fontWeight: "800", fontSize: 12 },
});
