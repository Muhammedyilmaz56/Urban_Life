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

  refreshBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.14)",
  },
  refreshTxt: { color: "white", fontSize: 18 },

  card: {
    marginBottom: 10,
    padding: 12,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  row: { flexDirection: "row", justifyContent: "space-between", gap: 10 },
  action: { color: "white", fontWeight: "800", flex: 1 },
  time: { color: "rgba(255,255,255,0.75)", fontSize: 12 },

  meta: { color: "rgba(255,255,255,0.85)", marginTop: 6, fontSize: 12 },
  detail: { color: "white", marginTop: 8 },
});
