import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");
const PRIMARY_COLOR = "#4F46E5"; 

export const ModernForgotPasswordStyles = StyleSheet.create({
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
    paddingBottom: 50, // DÜZELTME: Ekranı aşağı uzattık
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
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
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
    marginBottom: 12,
    textAlign: 'center',
  },
  infoText: {
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    marginBottom: 24,
    fontSize: 14,
    lineHeight: 20,
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 16,
    marginBottom: 20,
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

  submitButton: {
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 16,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#6b7280',
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
    marginBottom: 10, //  DÜZELTME: Altına boşluk eklendi
    alignItems: 'center',
    padding: 10, // Tıklama alanını genişlettik
  },
  backButtonText: {
    color: '#ddd',
    fontSize: 14,
    fontWeight: '500',
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
  //  GÜNCELLENMİŞ İKON STİLİ:
  backButtonIcon: {
    color: '#fff',
    fontSize: 32, // İkonu büyüttük
    fontWeight: '300', // Daha ince ve modern bir görünüm için
    marginTop: -4, // Dikeyde tam ortalamak için küçük bir ayar
    marginLeft: -2, // Yatayda tam ortalamak için küçük bir ayar
  }
});