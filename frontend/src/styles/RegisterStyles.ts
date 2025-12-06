import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");
const PRIMARY_COLOR = "#4F46E5"; 

export const RegisterStyles = StyleSheet.create({
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
    paddingBottom: 50, // 🔥 DÜZELTME: Alttan boşluk bıraktık ki buton yapışmasın
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)', 
    justifyContent: "center",
    padding: 24,
  },
  
  headerContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 40,
    fontWeight: "900",
    color: "#ffffff",
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 10,
  },
  appSubtitle: {
    fontSize: 18,
    color: "rgba(255,255,255,0.85)",
    marginTop: 5,
    fontWeight: '500',
  },

  glassFormContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
    borderRadius: 30,
    paddingVertical: 36,
    paddingHorizontal: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)', 
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
    marginBottom: 24,
    textAlign: 'center',
  },

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

  registerButton: {
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 16,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  registerButtonDisabled: {
    backgroundColor: '#6b7280', 
    opacity: 0.7,
  },
  registerButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 1,
  },

  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 28,
    marginBottom: 10, // 🔥 DÜZELTME: Altına biraz daha pay verildi
  },
  loginLinkText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 15,
  },
  loginLink: {
    color: '#fff', 
    fontSize: 15,
    fontWeight: '900',
    marginLeft: 5,
    textDecorationLine: 'underline',
  },
  backButtonAbsolute: {
    position: 'absolute',
    top: 50, // Çentik (Notch) payı
    left: 20,
    zIndex: 10,
    // Biraz daha koyu ve şeffaf bir arka plan
    backgroundColor: 'rgba(0,0,0,0.4)', 
    width: 45, // Biraz daha büyük bir daire
    height: 45,
    borderRadius: 25, // Tam daire olması için
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1, // İnce bir çerçeve ekleyerek daha belirgin yapalım
    borderColor: 'rgba(255,255,255,0.2)',
  },
  // 🔥 GÜNCELLENMİŞ İKON STİLİ:
  backButtonIcon: {
    color: '#fff',
    fontSize: 32, // İkonu büyüttük
    fontWeight: '300', // Daha ince ve modern bir görünüm için
    marginTop: -4, // Dikeyde tam ortalamak için küçük bir ayar
    marginLeft: -2, // Yatayda tam ortalamak için küçük bir ayar
  }
});