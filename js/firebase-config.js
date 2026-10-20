/* =====================================================================
   CONFIGURAÇÃO — este é o único ficheiro que precisas de editar.
   1) Cola aqui os dados do teu projeto Firebase
      (Consola Firebase > ⚙️ Definições do projeto > As tuas apps > Web).
   2) Ajusta a lista de turmas.
   Estes dados não são secretos: quem protege a base de dados são as
   regras do ficheiro firestore.rules.
   ===================================================================== */
window.CONFIG = {
  firebase: {
    apiKey: "AIzaSyDCh3x2jgkEhSawdowgd-xkMg3GFeQ6e4M",
    authDomain: "ergonomia-4ano.firebaseapp.com",
    projectId: "ergonomia-4ano",
    storageBucket: "ergonomia-4ano.firebasestorage.app",
    messagingSenderId: "884289135836",
    appId: "1:884289135836:web:371be971fa65130cf88019"
  },
  turmas: [
    { id: "4A", nome: "4.º A" },
    { id: "4B", nome: "4.º B" },
    { id: "4C", nome: "4.º C" },
    { id: "4D", nome: "4.º D" },
    { id: "4E", nome: "4.º E" },
    { id: "4F", nome: "4.º F" },
    { id: "4G", nome: "4.º G" },
    { id: "4H", nome: "4.º H" },
    { id: "4I", nome: "4.º I" }
  ]
};
