import { StyleSheet, Platform } from "react-native";

export default StyleSheet.create({
  
  container: {
    flex: 1,
    backgroundColor: "#F2F4F8", 
  },
  
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F2F4F8",
  },

  
  header: {
    paddingVertical: 30,
    alignItems: "center",
    backgroundColor: "white",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 20,
  },

  avatarWrap: {
    width: 100,
    height: 100,
    marginBottom: 15,
    position: "relative",
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#E1E4E8",
    borderWidth: 3,
    borderColor: "white",
  },

  avatarEditButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#3498db",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },

  avatarEditText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: -2,
  },

  name: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937", 
    marginBottom: 4,
  },

  email: {
    fontSize: 15,
    color: "#6B7280", 
  },

  
  section: {
    backgroundColor: "white",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
   
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#9CA3AF", 
    textTransform: "uppercase",
    marginBottom: 12,
    letterSpacing: 0.5,
  },


  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },

  rowBetween: { 
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },

 
  label: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 2,
  },

  value: {
    fontSize: 16,
    color: "#111827",
    fontWeight: "500",
  },

  actionText: {
    fontSize: 14,
    color: "#3498db", 
    fontWeight: "600",
  },

  arrow: {
    fontSize: 18,
    color: "#9CA3AF",
    fontWeight: "bold",
  },

 
  logoutButton: {
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: "#FEE2E2", 
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FECACA",
  },

  logoutText: {
    color: "#DC2626", 
    fontSize: 16,
    fontWeight: "600",
  },


  passwordModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", 
    justifyContent: "center",
    alignItems: "center",
  },

  passwordModalContainer: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
   
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },

  passwordModalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 20,
    textAlign: "center",
  },

  passwordInput: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 12,
    color: "#374151",
  },

  passwordButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between", 
    marginTop: 20,
    gap: 12, 
  },

  passwordCancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
  },

  passwordButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#3498db",
    alignItems: "center",
    
    shadowColor: "#3498db",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },

  passwordButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937", 
  },
});