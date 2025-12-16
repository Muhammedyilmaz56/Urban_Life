import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 30 },

  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16 },
  loadingText: { marginTop: 10, fontSize: 14, opacity: 0.8 },
  errorText: { fontSize: 14, opacity: 0.9, marginBottom: 12 },

  title: { fontSize: 20, fontWeight: "800", marginBottom: 12 },

  card: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  label: { marginTop: 10, fontSize: 12, opacity: 0.7 },
  value: { marginTop: 4, fontSize: 15, fontWeight: "700" },

  btn: {
    marginTop: 16,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  logoutBtn: { borderColor: "rgba(255,80,80,0.35)" },
  btnText: { fontWeight: "800" },


  avatarBox: {
    alignSelf: "center",
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  avatar: { width: 110, height: 110, borderRadius: 55 },

  

  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },

 
  logout: {
    borderColor: "red",
  },
  
});
