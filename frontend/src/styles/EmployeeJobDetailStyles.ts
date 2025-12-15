import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0b1220" },

  heroImage: { width: "100%", height: 240 },

  noPhotoBox: {
    height: 160,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0b1220",
    borderBottomWidth: 1,
    borderBottomColor: "#1f2937",
  },
  noPhotoText: { color: "#9ca3af" },

  card: {
    margin: 14,
    padding: 12,
    backgroundColor: "#111827",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1f2937",
  },

  title: { color: "white", fontSize: 18, fontWeight: "800" },
  desc: { color: "#cbd5e1", marginTop: 8, lineHeight: 20 },

  badgeRow: { flexDirection: "row", gap: 10, marginTop: 12 },
  badge: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "#0b1220",
    borderWidth: 1,
    borderColor: "#1f2937",
  },
  badgeText: { color: "#e5e7eb", fontSize: 12 },

  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  loadingText: { marginTop: 10, color: "white" },
  emptyText: { color: "#9ca3af" },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  
  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: "#0b1220",
    borderWidth: 1,
    borderColor: "#1f2937",
    alignItems: "center",
    justifyContent: "center",
  },
  
  actionBtnDisabled: {
    opacity: 0.6,
  },
  
  actionBtnText: {
    color: "white",
    fontWeight: "700",
    fontSize: 13,
  },
  previewRow: { marginTop: 10 },
previewImage: { width: 90, height: 90, borderRadius: 12, marginRight: 10 },
sectionTitle: { color: "white", fontWeight: "800", marginTop: 6, marginBottom: 6 },

});
