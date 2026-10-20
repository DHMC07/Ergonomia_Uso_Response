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
    apiKey: "COLOCA_AQUI",
    authDomain: "COLOCA_AQUI.firebaseapp.com",
    projectId: "COLOCA_AQUI",
    storageBucket: "COLOCA_AQUI.appspot.com",
    messagingSenderId: "COLOCA_AQUI",
    appId: "COLOCA_AQUI"
  },
  turmas: [
    { id: "4A", nome: "4.º A" },
    { id: "4B", nome: "4.º B" },
    { id: "4C", nome: "4.º C" },
    { id: "4D", nome: "4.º D" }
  ]
};
