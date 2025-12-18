import { StyleSheet, Platform } from "react-native";

const PRIMARY_COLOR = "#4F46E5";

export const ModernForgotPasswordStyles = StyleSheet.create({
  background: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: 0,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    padding: 24,
    paddingTop: Platform.OS === "ios" ? 80 : 60,
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
  },

  headerContainer: {
    marginBottom: 30,
    alignItems: "center",
  },
  appTitle: {
    fontSize: 40,
    fontWeight: "900",
    color: "#ffffff",
    letterSpacing: 1,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 10,
  },
  appSubtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    marginTop: 5,
    fontWeight: "500",
  },

  glassFormContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 30,
    paddingVertical: 36,
    paddingHorizontal: 28,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.3,
    shadowRadius: 25,
    elevation: 10,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
    textAlign: "center",
  },
  infoText: {
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    marginBottom: 24,
    fontSize: 14,
    lineHeight: 20,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 16,
    marginBottom: 20,
    paddingHorizontal: 16,
    minHeight: 56,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  inputIcon: {
    fontSize: 20,
    marginRight: 12,
    color: "rgba(255,255,255,0.8)",
  },
  input: {
    flex: 1,
    color: "#ffffff",
    fontSize: 16,
    paddingVertical: 16,
  },

  submitButton: {
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 16,
    minHeight: 56,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  submitButtonDisabled: {
    backgroundColor: "#6b7280",
    opacity: 0.7,
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 1,
  },

  backButton: {
    marginTop: 20,
    marginBottom: 10,
    alignItems: "center",
    padding: 10,
  },
  backButtonText: {
    color: "#ddd",
    fontSize: 14,
    fontWeight: "500",
    textDecorationLine: "underline",
  },
  backButtonAbsolute: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 40,
    left: 20,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.4)",
    width: 45,
    height: 45,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  backButtonIcon: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "300",
    marginTop: -4,
    marginLeft: -2,
  },

  // Loading overlay for image preload
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#1a1a2e",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
});