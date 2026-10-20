import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, query, where, onSnapshot, doc, setDoc, updateDoc, deleteDoc, writeBatch, serverTimestamp }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const $ = s => document.querySelector(s);
const cfg = window.CONFIG.firebase, TURMAS = window.CONFIG.turmas;
const MISS = ["Postura", "20-20-20", "Digitais", "Cartaz", "Juramento"];
const show = id => document.querySelectorAll(".screen").forEach(s => s.classList.toggle("on", s.id === id));
const stars = n => n ? "★".repeat(n) + "☆".repeat(3 - n) : "—";

if (!cfg.apiKey || cfg.apiKey.startsWith("COLOCA")) {
  $("#loginMsg").textContent = "Falta configurar o Firebase no ficheiro js/firebase-config.js.";
  $("#loginBtn").disabled = true;
  throw new Error("Firebase por configurar");
}
const app = initializeApp(cfg), auth = getAuth(app), db = getFirestore(app);

/* ---------- entrar / sair ---------- */
async function entrar() {
  $("#loginMsg").textContent = "";
  try { await signInWithEmailAndPassword(auth, $("#email").value.trim(), $("#pass").value); }
  catch (e) { $("#loginMsg").textContent = "Email ou palavra-passe errados."; }
}
$("#loginBtn").onclick = entrar;
$("#pass").onkeydown = e => { if (e.key === "Enter") entrar(); };
$("#logoutBtn").onclick = () => signOut(auth);

let stopRows = () => {}, stopCtl = () => {}, linhas = [];
onAuthStateChanged(auth, u => {
  if (u && !u.isAnonymous) { $("#who").textContent = u.email; show("panelScr"); abrirTurma(); }
  else { stopRows(); stopCtl(); show("loginScr"); }
});

/* ---------- turma ---------- */
$("#turmaSel").innerHTML = TURMAS.map(t => `<option value="${esc(t.id)}">${esc(t.nome)}</option>`).join("");
try { $("#turmaSel").value = localStorage.getItem("prof-turma") || TURMAS[0].id; } catch (e) {}
$("#turmaSel").onchange = () => { try { localStorage.setItem("prof-turma", $("#turmaSel").value); } catch (e) {} abrirTurma(); };
$("#showVal").onchange = desenhar;

function abrirTurma() {
  const t = $("#turmaSel").value;
  stopRows(); stopCtl();
  stopCtl = onSnapshot(doc(db, "controlo", t), s => desenharAbertas(s.exists() ? s.data().aberta : 1), erro);
  stopRows = onSnapshot(query(collection(db, "registos"), where("turma", "==", t)), snap => {
    linhas = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      .sort((a, b) => a.nome.localeCompare(b.nome, "pt"));
    desenhar();
  }, erro);
}
function erro(e) {
  console.error(e);
  $("#rows").innerHTML = `<tr><td colspan="8" class="empty-row">Esta conta não tem acesso aos dados. Confirma o UID no ficheiro firestore.rules.</td></tr>`;
}

/* ---------- missões abertas ---------- */
function desenharAbertas(n) {
  $("#openSeg").innerHTML = MISS.map((m, i) =>
    `<button class="${i < n ? "on" : ""}" data-n="${i + 1}" title="Abrir até à missão ${i + 1}">${i + 1}. ${m}</button>`).join("");
  $("#openSeg").querySelectorAll("button").forEach(b => b.onclick = () =>
    setDoc(doc(db, "controlo", $("#turmaSel").value), { aberta: +b.dataset.n, atualizadoEm: serverTimestamp() }).catch(erro));
}

/* ---------- tabela ---------- */
function desenhar() {
  const ver = $("#showVal").checked ? linhas : linhas.filter(l => l.estado !== "validado");
  const term = linhas.filter(l => l.concluido).length, pend = linhas.filter(l => l.estado !== "validado").length;
  $("#stats").innerHTML = `<span>👧 ${linhas.length} registos</span><span>🏅 ${term} terminaram</span><span>⏳ ${pend} por validar</span>`;
  if (!ver.length) { $("#rows").innerHTML = `<tr><td colspan="8" class="empty-row">Ainda não há trabalhos por validar nesta turma.</td></tr>`; return; }
  $("#rows").innerHTML = ver.map(l => {
    const m = l.missoes || {}, val = l.estado === "validado";
    return `<tr class="${val ? "val" : ""}">
      <td><b>${esc(l.nome)}</b></td>
      <td class="st">${stars(m.m1?.stars)}</td><td class="st">${stars(m.m2?.stars)}</td><td class="st">${stars(m.m3?.stars)}</td>
      <td>${l.cartaz ? `<button class="btn ghost sm" data-ver="${l.id}">👁️ Ver</button>` : "—"}</td>
      <td>${l.concluido ? "🏅" : "—"}</td>
      <td>${val ? `<span class="pill ok">Validado</span>` : `<span class="pill pend">Pendente</span>`}</td>
      <td>${val ? "" : `<button class="btn okb sm" data-val="${l.id}">Validar</button>`}
          <button class="btn ghost sm" data-del="${l.id}" title="Apagar registo">🗑️</button></td></tr>`;
  }).join("");
  $("#rows").querySelectorAll("[data-val]").forEach(b => b.onclick = () => validar([b.dataset.val]));
  $("#rows").querySelectorAll("[data-del]").forEach(b => b.onclick = () => apagar(b.dataset.del));
  $("#rows").querySelectorAll("[data-ver]").forEach(b => b.onclick = () => verCartaz(b.dataset.ver));
}

async function validar(ids) {
  if (!ids.length) return;
  const batch = writeBatch(db);
  ids.forEach(id => batch.update(doc(db, "registos", id), { estado: "validado", validadoEm: serverTimestamp() }));
  await batch.commit().catch(erro);
}
$("#valAll").onclick = () => {
  const ids = linhas.filter(l => l.estado !== "validado" && l.concluido).map(l => l.id);
  if (!ids.length) { alert("Nenhum aluno terminou as missões ainda."); return; }
  if (confirm(`Validar ${ids.length} aluno(s) que terminaram todas as missões?`)) validar(ids);
};
async function apagar(id) {
  const l = linhas.find(x => x.id === id);
  if (confirm(`Apagar o registo de ${l.nome}? Esta ação não pode ser desfeita.`)) await deleteDoc(doc(db, "registos", id)).catch(erro);
}

/* ---------- cartaz ---------- */
function verCartaz(id) {
  const l = linhas.find(x => x.id === id), p = l.cartaz;
  $("#modalRoot").innerHTML = `<div class="modal"><div class="box" style="max-width:560px">
    <h2 style="color:var(--m4)">Cartaz de ${esc(l.nome)}</h2>${posterHTML(p, "printme")}
    <div class="row"><button class="btn ghost" id="pr">🖨️ Imprimir</button><button class="btn" id="cl">Fechar</button></div></div></div>`;
  $("#cl").onclick = () => $("#modalRoot").innerHTML = "";
  $("#pr").onclick = () => window.print();
}

/* ---------- CSV ---------- */
$("#csvBtn").onclick = () => {
  const turma = TURMAS.find(t => t.id === $("#turmaSel").value).nome;
  const q = v => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const head = ["Aluno", "Turma", ...MISS.slice(0, 4).map(m => m + " (estrelas)"), "Juramento", "Grupo do cartaz", "Estado", "Data"];
  const rows = linhas.map(l => {
    const m = l.missoes || {};
    return [l.nome, turma, m.m1?.stars, m.m2?.stars, m.m3?.stars, m.m4?.stars, l.concluido ? "Sim" : "Não",
      l.cartaz?.group, l.estado, l.criadoEm?.toDate?.().toLocaleString("pt-PT")].map(q).join(";");
  });
  const blob = new Blob(["\ufeff" + [head.map(q).join(";"), ...rows].join("\n")], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `super-herois-${$("#turmaSel").value}-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
};
