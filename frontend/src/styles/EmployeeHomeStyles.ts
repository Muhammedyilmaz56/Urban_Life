import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 14,
    backgroundColor: "#0b1220",
  },

  header: {
    color: "white",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 12,
  },

  card: {
    backgroundColor: "#111827",
    marginBottom: 12,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#1f2937",
  },

  cardImage: {
    width: "100%",
    height: 180,
  },

  noPhotoBox: {
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0b1220",
  },

  noPhotoText: {
    color: "#9ca3af",
  },

  cardBody: {
    padding: 12,
  },

  title: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },

  desc: {
    color: "#cbd5e1",
    marginTop: 6,
  },

  badgeRow: {
    flexDirection: "row",
    marginTop: 10,
    gap: 10,
  },

  badge: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "#0b1220",
    borderWidth: 1,
    borderColor: "#1f2937",
  },

  badgeText: {
    color: "#e5e7eb",
    fontSize: 12,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 10,
  },

  emptyWrap: {
    paddingTop: 40,
    alignItems: "center",
  },

  emptyText: {
    color: "#9ca3af",
  },
});

export default styles;
