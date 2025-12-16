
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 30 },

  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16 },
  loadingText: { marginTop: 10, fontSize: 14, opacity: 0.8 },
  errorText: { fontSize: 14, opacity: 0.9 },

  title: { fontSize: 20, fontWeight: "700", marginBottom: 12 },

  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  card: {
    width: "48%",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  cardLabel: { fontSize: 12, opacity: 0.75, marginBottom: 8 },
  cardValue: { fontSize: 22, fontWeight: "800" },

  section: { marginTop: 18, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: "rgba(255,255,255,0.12)" },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginBottom: 10 },
  muted: { fontSize: 13, opacity: 0.75 },

  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.08)" },
  rowKey: { fontSize: 13, fontWeight: "600", opacity: 0.9 },
  rowVal: { fontSize: 13, fontWeight: "800" },
});
