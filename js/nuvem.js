/* Ligação dos alunos ao Firebase.
   Os alunos entram de forma anónima e invisível: não precisam de conta nem de palavra-passe. */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, addDoc, doc, updateDoc, onSnapshot, serverTimestamp }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const cfg = window.CONFIG && window.CONFIG.firebase;
export const ativo = !!(cfg && cfg.apiKey && !cfg.apiKey.startsWith("COLOCA"));

let auth, db, pronto;
if (ativo) {
  const app = initializeApp(cfg);
  auth = getAuth(app);
  db = getFirestore(app);
  pronto = new Promise((res, rej) => {
    const stop = onAuthStateChanged(auth, u => { if (u) { stop(); res(u); } });
    signInAnonymously(auth).catch(rej);
  });
}

/* Cria o registo do aluno na base de dados e devolve o seu id */
export async function criarRegisto(nome, turma) {
  const u = await pronto;
  const ref = await addDoc(collection(db, "registos"), {
    nome, turma, uid: u.uid, estado: "pendente",
    missoes: {}, cartaz: null, concluido: false,
    criadoEm: serverTimestamp(), atualizadoEm: serverTimestamp()
  });
  return ref.id;
}

/* Guarda campos no registo, por exemplo {"missoes.m1": {done:true, stars:3}} */
export async function guardar(id, campos) {
  await pronto;
  await updateDoc(doc(db, "registos", id), { ...campos, atualizadoEm: serverTimestamp() });
}

/* Avisa quando o professor valida o registo */
export function vigiarRegisto(id, cb) {
  let stop = () => {}, cancel = false;
  pronto.then(() => {
    if (cancel) return;
    stop = onSnapshot(doc(db, "registos", id),
      s => { if (s.exists()) cb(s.data().estado); },
      e => console.warn("Registo indisponível:", e.code));
  });
  return () => { cancel = true; stop(); };
}

/* Avisa quantas missões o professor abriu para a turma */
export function vigiarControlo(turma, cb) {
  let stop = () => {}, cancel = false;
  pronto.then(() => {
    if (cancel) return;
    stop = onSnapshot(doc(db, "controlo", turma),
      s => cb(s.exists() && Number.isInteger(s.data().aberta) ? s.data().aberta : 1),
      e => { console.warn("Controlo indisponível:", e.code); cb(null); });
  });
  return () => { cancel = true; stop(); };
}
