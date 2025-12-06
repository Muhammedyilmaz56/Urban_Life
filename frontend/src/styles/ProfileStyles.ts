import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },

  header: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "white",
    marginBottom: 10,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 50,
    backgroundColor: "#ddd",
    marginBottom: 15,
  },

  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },

  email: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },

  section: {
    backgroundColor: "white",
    padding: 15,
    marginHorizontal: 15,
    borderRadius: 10,
    marginBottom: 15,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },

  row: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  rowText: {
    fontSize: 16,
    color: "#444",
  },

  logoutButton: {
    padding: 15,
    backgroundColor: "#e74c3c",
    marginHorizontal: 15,
    borderRadius: 10,
    marginTop: 10,
  },

  logoutText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  passwordModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },

  passwordModalContainer: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },

  passwordModalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },

  passwordInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
    fontSize: 15,
  },

  passwordButtonsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },

  passwordButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#3498db",
    marginLeft: 10,
  },

  passwordCancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#bdc3c7",
  },

  passwordButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  avatarWrap: {
    width: 90,
    height: 90,
    marginBottom: 15,
  },

  avatarEditButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#3498db",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  avatarEditText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
