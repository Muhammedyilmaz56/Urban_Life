import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1020",
  },
  bg: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingHorizontal: 16,
    paddingTop: 60,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  pageTitle: {
    color: "white",
    fontSize: 28,
    fontWeight: "800",
  },
  pageSubtitle: {
    color: "#d0d0d0",
    marginTop: 6,
    marginBottom: 18,
  },
  sectionTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 18,
    marginBottom: 10,
  },

  statGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  statCard: {
    width: "48%",
    backgroundColor: "rgba(255,255,255,0.10)",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  statValue: {
    color: "white",
    fontSize: 22,
    fontWeight: "800",
  },
  statTitle: {
    color: "#d0d0d0",
    marginTop: 6,
    fontSize: 12,
  },

  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  menuCard: {
    width: "48%",
    backgroundColor: "rgba(255,255,255,0.10)",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  menuTitle: {
    color: "white",
    fontSize: 15,
    fontWeight: "800",
  },
  menuSubtitle: {
    color: "#d0d0d0",
    fontSize: 12,
    marginTop: 6,
    lineHeight: 16,
  },
});
