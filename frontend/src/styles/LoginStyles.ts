import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");
const PRIMARY_COLOR = "#4F46E5"; // Modern Mor/Mavi

const LoginStyles = StyleSheet.create({
  background: {
    flex: 1,
    width: width,
    height: height,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  // Arka plan karartma
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)', 
    justifyContent: "center",
    padding: 24,
  },
  
  // Başlık
  headerContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 48,
    fontWeight: "900",
    color: "#ffffff",
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
  },
  appSubtitle: {
    fontSize: 18,
    color: "rgba(255,255,255,0.85)",
    marginTop: 5,
    fontWeight: '500',
  },

  // ✨ Glass Form
  glassFormContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
    borderRadius: 30,
    paddingVertical: 36,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 30,
    elevation: 10,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 24,
    textAlign: 'center',
  },

  // Inputlar
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 60,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  inputIcon: {
    fontSize: 20,
    marginRight: 12,
    color: 'rgba(255,255,255,0.8)'
  },
  input: {
    flex: 1,
    color: "#ffffff",
    fontSize: 16,
    height: '100%',
    paddingTop: 0, 
    paddingBottom: 0,
  },

  // Linkler
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    fontWeight: '600',
  },

  // Buton
  loginButton: {
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 16,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 8,
  },
  loginButtonDisabled: {
    backgroundColor: '#6b7280',
    opacity: 0.8,
  },
  loginButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 1,
  },

  // Alt Kısım
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 28,
  },
  registerText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 15,
  },
  registerLink: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '900',
    marginLeft: 5,
    textDecorationLine: 'underline',
  },
});

export default LoginStyles;