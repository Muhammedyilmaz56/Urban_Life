import { StyleSheet, Platform } from "react-native";

const PRIMARY = "#0B3A6A";
const PRIMARY_2 = "#1E3A8A";
const BG = "#F6F8FB";
const CARD = "#FFFFFF";
const BORDER = "#E5E7EB";
const TEXT = "#0F172A";
const MUTED = "#64748B";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },

  // TOP BAR
  topBar: {
    backgroundColor: PRIMARY,
    paddingTop: Platform.OS === "ios" ? 58 : 18,
    paddingBottom: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.15)",
  },

  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
  },
  backTxt: {
    color: "white",
    fontSize: 28,
    marginTop: -2,
    fontWeight: "700",
  },

  title: {
    color: "white",
    fontSize: 16,
    fontWeight: "900",
  },
  subtitle: {
    color: "rgba(255,255,255,0.85)",
    marginTop: 2,
    fontSize: 11,
    fontWeight: "700",
  },

  refreshBtn: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
  },
  refreshTxt: {
    color: "white",
    fontSize: 12,
    fontWeight: "900",
  },

  // LIST
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 120,
    paddingTop: 12,
  },

  // CARD
  card: {
    marginBottom: 12,
    padding: 14,
    borderRadius: 14,
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },

  rowTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
  },

  action: {
    color: TEXT,
    fontWeight: "900",
    fontSize: 14,
    lineHeight: 18,
  },

  time: {
    color: MUTED,
    fontSize: 12,
    fontWeight: "700",
    marginTop: 6,
  },

  badge: {
    backgroundColor: "#EEF2FF",
    borderWidth: 1,
    borderColor: "#E0E7FF",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    maxWidth: 120,
  },

  badgeText: {
    color: PRIMARY_2,
    fontWeight: "900",
    fontSize: 12,
  },

  metaRow: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },

  metaLabel: {
    color: MUTED,
    fontSize: 12,
    fontWeight: "800",
    width: 50,
  },

  metaValue: {
    color: TEXT,
    fontSize: 12,
    fontWeight: "800",
    flex: 1,
  },

  detail: {
    marginTop: 10,
    color: TEXT,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
  },

  // LOADING / EMPTY
  loadingWrap: {
    marginTop: 90,
    alignItems: "center",
  },

  loadingText: {
    marginTop: 10,
    color: MUTED,
    fontWeight: "800",
  },

  emptyWrap: {
    paddingTop: 60,
    alignItems: "center",
  },

  emptyText: {
    color: MUTED,
    fontWeight: "800",
  },
});
