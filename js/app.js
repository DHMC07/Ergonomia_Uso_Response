
/* ---------------- armazenamento ---------------- */
const LS='tic-super-herois-4ano-v1';
let S={name:'',turma:'',prog:{},docId:null};
function load(){try{const d=JSON.parse(localStorage.getItem(LS));if(d&&typeof d==='object')S=Object.assign(S,d)}catch(e){}}
function save(){try{localStorage.setItem(LS,JSON.stringify(S))}catch(e){}}
load();

const $=s=>document.querySelector(s);
function show(id){document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('on',s.id===id));window.scrollTo(0,0)}
function setAcc(n){document.documentElement.style.setProperty('--acc',`var(--m${n})`);document.documentElement.style.setProperty('--accs',`var(--m${n}s)`)}

/* ---------------- som e festa ---------------- */
let actx=null;
function beep(f=660,d=.15){try{actx=actx||new (window.AudioContext||window.webkitAudioContext)();const o=actx.createOscillator(),g=actx.createGain();o.frequency.value=f;o.connect(g);g.connect(actx.destination);g.gain.setValueAtTime(.15,actx.currentTime);g.gain.exponentialRampToValueAtTime(.001,actx.currentTime+d);o.start();o.stop(actx.currentTime+d)}catch(e){}}
function confetti(){
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const c=$('#confetti'),cols=['#179C8C','#D99400','#6D5BD0','#E0614F','#2F7FC1','#2E9A4F'];
  for(let i=0;i<70;i++){const s=document.createElement('span');s.style.left=Math.random()*100+'vw';s.style.background=cols[i%cols.length];s.style.animationDelay=Math.random()*.6+'s';s.style.animationDuration=(1.8+Math.random()*1.4)+'s';c.appendChild(s)}
  setTimeout(()=>c.innerHTML='',3600);
}
function modal(html){$('#modalRoot').innerHTML=`<div class="modal" role="dialog" aria-modal="true"><div class="box">${html}</div></div>`;const b=$('#modalRoot button');b&&b.focus()}
function closeModal(){$('#modalRoot').innerHTML=''}

/* ---------------- missões ---------------- */
const MISSIONS=[
 {id:'m1',n:1,name:'Detetive da Postura',desc:'Descobre os erros e arranja o super-herói',min:'20 min',steps:[]},
 {id:'m2',n:2,name:'Pausa 20-20-20',desc:'Descansa os olhos e mexe o corpo',min:'10 min',steps:[]},
 {id:'m3',n:3,name:'Detetives Digitais',desc:'Ecrã ou mundo real? Seguro ou perigo?',min:'5 min',steps:[]},
 {id:'m4',n:4,name:'O nosso cartaz',desc:'Manual da Internet Saudável, em grupo',min:'30 min',steps:[]},
 {id:'m5',n:5,name:'Compromisso Digital',desc:'A promessa do super-herói',min:'5 min',steps:[]}
];
let cur=null; // {m, step, ok:Set, d:{}}

/* aberta = n.º de missões abertas pelo professor (vem do Firebase); null = sem ligação */
let aberta=null;
function prevDone(i){return i===0||(S.prog[MISSIONS[i-1].id]||{}).done}
function unlocked(i){return prevDone(i)&&(aberta===null||i<aberta)}
function starTxt(n,max=3){return '★'.repeat(n)+'☆'.repeat(max-n)}
function totalStars(){return MISSIONS.reduce((a,m)=>a+((S.prog[m.id]||{}).stars||0),0)}

function renderMap(){
  setAcc(5);
  $('#mapPixel').innerHTML=pixel('ola');
  const next=MISSIONS.find((m,i)=>unlocked(i)&&!(S.prog[m.id]||{}).done);
  const waiting=!next&&MISSIONS.some((m,i)=>prevDone(i)&&!(S.prog[m.id]||{}).done);
  $('#mapSay').textContent=next?`Olá, ${S.name}! A tua próxima missão é “${next.name}”. Quando acabares, espera pelo professor.`
    :waiting?`Muito bem, ${S.name}! ✋ Espera que o professor abra a próxima missão.`
    :`Parabéns, ${S.name}! Fizeste todas as missões. És um super-herói digital!`;
  $('#totalStars').textContent='⭐ '+totalStars();
  $('#path').innerHTML=MISSIONS.map((m,i)=>{const p=S.prog[m.id]||{},lock=!unlocked(i);
    return `<li><button class="stop ${lock?'lock':''} ${p.done?'done':''}" data-i="${i}" style="--c:var(--m${m.n});--cs:var(--m${m.n}s)" ${lock?'aria-disabled="true"':''}>
      <span class="num">${lock?'🔒':m.n}</span>
      <span class="txt"><b>${m.name}<span class="min">${m.min}</span></b><small>${m.desc}</small></span>
      <span class="st">${S.cur&&S.cur.i===i&&!p.done&&!lock?'<span class="min" style="font-size:15px">▶ Continuar</span>':m.id==='m5'?(p.done?'🏅':''):starTxt(p.stars||0)}</span></button></li>`}).join('');
  $('#path').querySelectorAll('.stop').forEach(b=>b.onclick=()=>{const i=+b.dataset.i;if(!unlocked(i)){b.animate&&b.animate([{transform:'translateX(-6px)'},{transform:'translateX(6px)'},{transform:'none'}],{duration:250});return}openMission(i)});
  show('map');
}

function openMission(i){
  const m=MISSIONS[i];cur={m,i,step:0,ok:new Set(),d:{}};setAcc(m.n);
  const g=S.cur;if(g&&g.i===i){cur.step=Math.min(g.step||0,m.steps.length-1);cur.ok=new Set(g.ok||[]);cur.d=g.d||{}}
  $('#mTitle').textContent=`Missão ${m.n} · ${m.name}`;
  renderStep();show('mission');
}
function stepDone(){cur.ok.add(cur.step);updNav();guardarMeio()}
/* guarda a missão a meio, para o aluno continuar se a página fechar */
function guardarMeio(){if(!cur||!S.name||(S.prog[cur.m.id]||{}).done)return;try{S.cur={i:cur.i,step:cur.step,ok:[...cur.ok],d:JSON.parse(JSON.stringify(cur.d))};save()}catch(e){}}
setInterval(()=>{if($('#mission').classList.contains('on'))guardarMeio()},1500);
addEventListener('pagehide',()=>{if($('#mission').classList.contains('on'))guardarMeio()});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&$('#mission').classList.contains('on'))guardarMeio()});
function resumir(){const g=S.cur;if(g&&MISSIONS[g.i]&&unlocked(g.i)&&!(S.prog[MISSIONS[g.i].id]||{}).done)openMission(g.i)}
function updNav(){
  const st=cur.m.steps;
  $('#dots').innerHTML=st.map((_,k)=>`<i class="${k===cur.step?'on':cur.ok.has(k)?'ok':''}"></i>`).join('');
  $('#prevBtn').style.visibility=cur.step>0?'visible':'hidden';
  const last=cur.step===st.length-1;
  $('#nextBtn').textContent=last?'Terminar missão ✅':'Próximo ▶';
  $('#nextBtn').disabled=!cur.ok.has(cur.step);
}
function renderStep(){
  const stage=$('#stage');stage.innerHTML='';
  clearInterval(cur.timer);
  cur.m.steps[cur.step](stage);updNav();window.scrollTo(0,0);guardarMeio();
}
$('#prevBtn').onclick=()=>{if(cur.step>0){cur.step--;renderStep()}};
$('#nextBtn').onclick=()=>{if(!cur.ok.has(cur.step))return;if(cur.step<cur.m.steps.length-1){cur.step++;renderStep()}else finishMission()};
$('#toMap').onclick=()=>{clearInterval(cur&&cur.timer);guardarMeio();renderMap()};

function finishMission(){
  const m=cur.m,stars=Math.max(1,Math.min(3,cur.d.stars??3));
  const old=S.prog[m.id]||{};delete S.cur;
  S.prog[m.id]={done:true,stars:Math.max(stars,old.stars||0)};save();confetti();beep(880,.25);
  const campos={['missoes.'+m.id]:S.prog[m.id]};
  if(m.id==='m4'&&cur.d.p){const p=cur.d.p,T=THEMES[p.theme];campos.cartaz={theme:p.theme,title:p.title,rules:p.rules,own:p.own,col:p.col,stk:p.stk,group:p.group,textos:p.rules.map(i=>T.rules[i])}}
  if(m.id==='m5')campos.concluido=true;
  sync(campos);
  if(m.id==='m5'){renderMap();return}
  modal(`<div class="pixel">${pixel('festa')}</div><h2>Missão concluída!</h2>
   <div class="stars" aria-label="${stars} estrelas">${starTxt(stars)}</div>
   <p style="font-weight:800">Muito bem, ${esc(S.name)}! ✋ Agora espera pelo professor antes de começares a próxima missão.</p>
   <div class="row"><button class="btn" id="mOk">Voltar ao mapa</button></div>`);
  $('#mOk').onclick=()=>{closeModal();renderMap()};
}
function head(t,p){return `<div class="step-head"><h2>${t}</h2><p>${p}</p></div>`}

/* ===== MISSÃO 1: Detetive da Postura ===== */
const ERRS={
 costas:['Costas curvadas!','A coluna não é uma banana. Encosta as costas à cadeira.'],
 pes:['Pés no ar!','Os pés ficam no chão ou num apoio.'],
 ecra:['Ecrã muito perto!','O ecrã fica à distância de um braço.'],
 pescoco:['Pescoço dobrado!','Os olhos ficam na linha do ecrã.']};
MISSIONS[0].steps=[
 // 1a encontrar os erros
 el=>{
  const d=cur.d;d.found=d.found||[];d.wrong=d.wrong||0;
  el.innerHTML=head('🔍 Encontra os 4 erros','O Tomás está mal sentado. Clica em cada erro que encontrares no desenho.')+
   `<div class="two"><div class="panel" id="figBox"></div><div><ul class="found" id="foundList"></ul><div class="toast" id="toast"></div></div></div>`;
  const bad={costas:0,pes:0,dist:0,alt:0};
  function draw(){
    $('#figBox').innerHTML=figure(bad,{hotspots:true,found:d.found});
    $('#foundList').innerHTML=Object.keys(ERRS).map(k=>d.found.includes(k)?`<li class="yes"><b>${ERRS[k][0]}</b>${ERRS[k][1]}</li>`:`<li>❓ Erro por descobrir</li>`).join('');
    const svg=$('#figBox svg');
    svg.addEventListener('click',e=>{
      const k=e.target.dataset&&e.target.dataset.k;
      if(k){if(!d.found.includes(k)){d.found.push(k);beep(760);$('#toast').textContent='Boa, detetive! 🔍'}}
      else{d.wrong++;$('#toast').textContent='Aqui está tudo bem. Procura outra vez!'}
      draw();
      if(d.found.length===4){$('#toast').textContent='Encontraste os 4 erros! 🎉 Clica em “Próximo”.';stepDone()}
    });
  }
  draw();if(d.found.length===4)stepDone();
 },
 // 1b arranjar o super-herói
 el=>{
  const d=cur.d;d.fix=d.fix||{costas:0,pes:0,dist:0,alt:0};
  const C=[
   ['costas','🪑 Costas',['Curvadas','No encosto'],1],
   ['pes','🦶 Pés',['No ar','No apoio'],1],
   ['dist','📏 Distância do ecrã',['Muito perto','Um braço','Muito longe'],1],
   ['alt','👀 Altura do ecrã',['Muito baixo','Na linha dos olhos','Muito alto'],1]];
  el.innerHTML=head('🛠️ Arranja o super-herói','Muda as opções até o Tomás ficar bem sentado. A linha dos olhos fica verde quando estiver tudo certo.')+
   `<div class="two"><div class="panel" id="figBox"></div><div class="panel" id="ctrls"></div></div><div class="toast" id="toast"></div>`;
  function draw(){
    $('#figBox').innerHTML=figure(d.fix);
    $('#ctrls').innerHTML=C.map(([k,t,opts,good])=>`<div class="ctrl"><h3>${t}<span>${d.fix[k]===good?'✅':'❌'}</span></h3>
      <div class="seg">${opts.map((o,v)=>`<button data-k="${k}" data-v="${v}" class="${d.fix[k]===v?'on':''}">${o}</button>`).join('')}</div></div>`).join('');
    $('#ctrls').querySelectorAll('button').forEach(b=>b.onclick=()=>{d.fix[b.dataset.k]=+b.dataset.v;beep(520,.08);draw();check()});
  }
  function check(){const ok=C.every(([k,,,g])=>d.fix[k]===g);
    $('#toast').textContent=ok?'Perfeito! O Tomás está sentado como um super-herói. 🦸':'';
    if(ok&&!cur.ok.has(cur.step)){confetti();stepDone()}}
  draw();check();
 },
 // 1c o meu posto
 el=>{
  const d=cur.d;d.chk=d.chk||[];
  const items=[['💪','Estica o braço: tocas no ecrã com a ponta dos dedos?'],['🪑','Encosta bem as costas à cadeira.'],['🦶','Põe os pés bem assentes no chão.'],['👀','Ajusta o ecrã: os olhos ficam à altura do topo do ecrã.'],['🤝','O meu colega confirmou que estou bem sentado.']];
  el.innerHTML=head('🪑 Agora és tu!','Arranja o teu lugar a sério. Faz cada coisa e depois clica para marcar.')+`<div class="checks" id="cl"></div><div class="toast" id="toast"></div>`;
  function draw(){
    $('#cl').innerHTML=items.map(([em,t],k)=>`<button class="check ${d.chk.includes(k)?'on':''}" data-k="${k}"><span class="bx">${d.chk.includes(k)?'✓':''}</span><span class="em">${em}</span><span>${t}</span></button>`).join('');
    $('#cl').querySelectorAll('.check').forEach(b=>b.onclick=()=>{const k=+b.dataset.k;d.chk=d.chk.includes(k)?d.chk.filter(x=>x!==k):[...d.chk,k];beep(600,.08);draw()});
    if(d.chk.length===items.length){$('#toast').textContent='O teu posto está pronto! 👏';stepDone()}else{$('#toast').textContent=''}
  }
  draw();
 },
 // 1d onde dói
 el=>{
  const d=cur.d;d.pain=d.pain||[];
  const parts=[['pescoco','🦒 Pescoço'],['costas','🔙 Costas'],['pulsos','✋ Pulsos'],['olhos','👀 Olhos'],['pernas','🦵 Pernas']];
  el.innerHTML=head('😣 Onde é que dói?','Senta-te mal como o Tomás durante 10 segundos. Depois escolhe onde sentiste desconforto.')+
   `<div class="panel" style="text-align:center"><button class="btn big" id="tBtn">⏱️ Experimentar 10 segundos</button><div class="fred" id="tCount" style="font-size:48px;color:var(--acc);min-height:60px;margin-top:8px"></div>
   <div class="chips" id="pc" style="justify-content:center"></div><div id="tip" style="margin-top:14px"></div></div>`;
  $('#tBtn').onclick=()=>{let n=10;$('#tBtn').disabled=true;$('#tCount').textContent=n;clearInterval(cur.timer);
    cur.timer=setInterval(()=>{n--;$('#tCount').textContent=n>0?n:'Já podes endireitar-te! 😌';if(n<=0){clearInterval(cur.timer);beep(880,.3);$('#tBtn').disabled=false}},1000)};
  function draw(){
    $('#pc').innerHTML=parts.map(([k,t])=>`<button class="chip ${d.pain.includes(k)?'on':''}" data-k="${k}">${t}</button>`).join('');
    $('#pc').querySelectorAll('.chip').forEach(b=>b.onclick=()=>{const k=b.dataset.k;d.pain=d.pain.includes(k)?d.pain.filter(x=>x!==k):[...d.pain,k];draw()});
    if(d.pain.length){$('#tip').innerHTML=`<div class="feedback good" style="margin:0 auto">Quando estamos mal sentados, o <b>pescoço</b>, as <b>costas</b>, os <b>pulsos</b> e os <b>olhos</b> são os que mais sofrem. Por isso é que as 4 regras de ouro são tão importantes!</div>`;
      d.stars=3-Math.min(2,Math.floor((d.wrong||0)/3));stepDone()}
    else $('#tip').innerHTML='';
  }
  draw();
 }
];

/* ===== MISSÃO 2: Pausa 20-20-20 ===== */
const EXS=[['👀','Olha para longe','Olha pela janela ou para o ponto mais longe da sala. Pisca os olhos muitas vezes.'],
 ['🔄','Roda os ombros','Roda os ombros devagar para trás.'],
 ['🙌','Estica os braços','Estica os braços bem alto, para o céu.'],
 ['↔️','Olha para os lados','Vira a cabeça devagar para a esquerda e para a direita.']];
MISSIONS[1].steps=[
 el=>{
  const d=cur.d;
  el.innerHTML=head('⏱️ A regra 20-20-20','Os nossos olhos também se cansam. Esta regra ajuda-os a descansar.')+
   `<div class="trio"><div class="tile"><div class="em">💻</div><b>20</b><span>minutos de ecrã…</span></div>
    <div class="tile"><div class="em">🔭</div><b>6</b><span>metros: olha para longe (20 pés)…</span></div>
    <div class="tile"><div class="em">⏳</div><b>20</b><span>segundos de descanso!</span></div></div>
   <div class="scale-items" style="margin-top:18px"><div class="card-q">De quantos em quantos minutos devo fazer uma pausa?</div>
   <div class="chips" id="qa" style="justify-content:center"></div><div id="fb"></div></div>`;
  const opts=[['5',0],['20',1],['60',0]];
  $('#qa').innerHTML=opts.map(([t,c])=>`<button class="chip" data-c="${c}">${t} minutos</button>`).join('');
  $('#qa').querySelectorAll('.chip').forEach(b=>b.onclick=()=>{
    if(b.dataset.c==='1'){b.classList.add('good');$('#fb').innerHTML='<div class="feedback good">Certo! A cada 20 minutos, faz uma pausa de 20 segundos. 👏</div>';beep(760);stepDone()}
    else{b.classList.add('wrong');d.miss=true;$('#fb').innerHTML='<div class="feedback wrong">Ainda não. Olha outra vez para os números lá em cima!</div>'}});
 },
 el=>{
  const d=cur.d;
  el.innerHTML=head('🏃 Treino dos super-heróis','Levanta-te! O computador vai dizer-te o que fazer. Cada exercício dura 20 segundos.')+
   `<div class="panel timer" id="tm"></div>`;
  const R=100,CIRC=2*Math.PI*R;
  function idle(){
    $('#tm').innerHTML=`<div class="big-em">🦸</div><h3>Pronto para o treino?</h3>
     <div class="ex-list">${EXS.map(e=>`<span>${e[0]} ${e[1]}</span>`).join('')}</div>
     <button class="btn big" id="go" style="margin-top:14px">▶ Começar treino</button>`;
    $('#go').onclick=()=>run(0);
  }
  function run(i){
    if(i>=EXS.length){
      $('#tm').innerHTML=`<div class="pixel" style="width:140px">${pixel('festa')}</div><h3>Treino concluído!</h3><p style="font-weight:800">Os teus olhos e o teu corpo agradecem. Podes sentar-te.</p><button class="btn ghost" id="again">🔁 Repetir treino</button>`;
      $('#again').onclick=()=>run(0);d.stars=d.miss?2:3;confetti();beep(880,.3);stepDone();return}
    const [em,t,txt]=EXS[i];let n=20;beep(660,.2);
    $('#tm').innerHTML=`<div class="big-em">${em}</div><h3>${t}</h3><p style="font-weight:800;margin:0;max-width:460px">${txt}</p>
     <div class="ringwrap"><svg viewBox="0 0 230 230" width="230" height="230"><circle cx="115" cy="115" r="${R}" fill="none" stroke="var(--line)" stroke-width="16"/>
     <circle id="arc" cx="115" cy="115" r="${R}" fill="none" stroke="var(--acc)" stroke-width="16" stroke-linecap="round" stroke-dasharray="${CIRC}" stroke-dashoffset="0"/></svg><div class="count" id="cnt">20</div></div>
     <div class="ex-list">${EXS.map((e,k)=>`<span class="${k<i?'ok':k===i?'on':''}">${e[0]} ${e[1]}</span>`).join('')}</div>`;
    clearInterval(cur.timer);
    cur.timer=setInterval(()=>{n--;const c=$('#cnt'),a=$('#arc');if(!c){clearInterval(cur.timer);return}
      c.textContent=n;a.setAttribute('stroke-dashoffset',CIRC*(1-n/20));if(n<=3&&n>0)beep(440,.08);
      if(n<=0){clearInterval(cur.timer);run(i+1)}},1000);
  }
  idle();
 },
 el=>{
  el.innerHTML=head('⏰ Leva a regra para casa','Escolhe como te vais lembrar de fazer a pausa quando usares o computador ou o tablet.')+
   `<div class="chips" id="rem" style="justify-content:center"></div><div class="scale-items"><div id="fb"></div></div>`;
  const o=['⏰ Pedir a um adulto um alarme de 20 minutos','📝 Pôr um papel ao lado do ecrã a dizer 20-20-20','👫 Combinar com um amigo lembrarmo-nos um ao outro'];
  $('#rem').innerHTML=o.map((t,k)=>`<button class="chip" data-k="${k}">${t}</button>`).join('');
  $('#rem').querySelectorAll('.chip').forEach(b=>b.onclick=()=>{$('#rem').querySelectorAll('.chip').forEach(x=>x.classList.remove('on'));b.classList.add('on');
    $('#fb').innerHTML='<div class="feedback good">Boa ideia! Assim os teus olhos ficam sempre descansados. 👀</div>';stepDone()});
 }
];

/* ===== MISSÃO 3: Detetives Digitais ===== */
const BAL=[['📺','Ver vídeos',0],['⚽','Jogar futebol',1],['🎮','Jogar no tablet',0],['😴','Dormir bem',1],['💬','Mandar mensagens',0],['🍽️','Jantar com a família',1],['🚲','Andar de bicicleta',1],['🧒','Brincar com amigos no recreio',1]];
const SIT=[
 ['Um jogador que não conheço pergunta em que escola ando.',0,'🔐 Dados pessoais','Nunca digas a tua escola, morada ou telefone a desconhecidos.'],
 ['Invento uma password secreta e só a conto aos meus pais.',1,'🔐 Dados pessoais','Muito bem! A password é como a chave de casa.'],
 ['Um colega publica uma foto de outro colega para gozar com ele.',0,'😊 Amabilidade','Isso magoa. Online tratamos os outros como na escola.'],
 ['Escrevo “Boa jogada!” a um amigo num jogo online.',1,'😊 Amabilidade','Ser simpático online é ser um super-herói!'],
 ['A minha mãe diz que o tempo acabou e eu desligo logo o tablet.',1,'⏰ O limite','Saber parar sem birras é uma super-força!'],
 ['Fico a jogar escondido debaixo dos lençóis à noite.',0,'⏰ O limite','O sono é muito importante. À noite, os ecrãs descansam.'],
 ['Um site pede a minha morada para ganhar um prémio.',0,'🔐 Dados pessoais','Cuidado, pode ser uma armadilha! Pergunta sempre a um adulto.'],
 ['Recebo uma mensagem má e conto logo a um adulto.',1,'😊 Amabilidade','Fizeste muito bem. Os adultos estão lá para ajudar.']];
function scaleSVG(l,r){const ang=Math.max(-14,Math.min(14,(r-l)*4));
  return `<svg viewBox="0 0 320 170" style="max-width:420px" role="img" aria-label="Balança: ecrãs ${l}, mundo real ${r}">
   <rect x="150" y="40" width="20" height="110" rx="6" fill="#8A97A8"/><rect x="110" y="148" width="100" height="12" rx="6" fill="#8A97A8"/>
   <g transform="rotate(${ang} 160 40)" style="transition:transform .4s">
    <rect x="40" y="34" width="240" height="10" rx="5" fill="#5E6B7A"/>
    <line x1="60" y1="44" x2="60" y2="80" stroke="#5E6B7A" stroke-width="3"/><line x1="260" y1="44" x2="260" y2="80" stroke="#5E6B7A" stroke-width="3"/>
    <path d="M20 80 h80 q-6 24 -40 24 q-34 0 -40 -24z" fill="#6D5BD0"/><path d="M220 80 h80 q-6 24 -40 24 q-34 0 -40 -24z" fill="#2E9A4F"/>
    <text x="60" y="76" text-anchor="middle" font-size="20">📱${l}</text><text x="260" y="76" text-anchor="middle" font-size="20">🌳${r}</text>
   </g></svg>`}
MISSIONS[2].steps=[
 el=>{
  const d=cur.d;d.bi=d.bi||0;d.bl=d.bl||0;d.br=d.br||0;
  el.innerHTML=head('⚖️ A balança do tempo','Cada atividade vai para que lado: ecrã ou mundo real?')+`<div class="scale-items" id="bx"></div>`;
  function draw(fb=''){
    if(d.bi>=BAL.length){
      $('#bx').innerHTML=scaleSVG(d.bl,d.br)+`<div class="feedback good">Uma balança saudável tem um bocadinho de ecrã e muito mundo real: brincar, dormir, estar com a família. 🌳</div>
       <div class="card-q" style="font-size:19px">O que acontece se a balança cair toda para os ecrãs? Escolhe 3.</div><div class="chips" id="cons" style="justify-content:center"></div><div id="cfb"></div>`;
      const cons=[['😫 Cansaço',1],['😠 Mau humor',1],['🌙 Dormir mal',1],['💪 Ficamos mais fortes',0]];d.cs=d.cs||[];
      const drawC=()=>{$('#cons').innerHTML=cons.map(([t,c],k)=>`<button class="chip ${d.cs.includes(k)?(c?'good':'wrong'):''}" data-k="${k}">${t}</button>`).join('');
        $('#cons').querySelectorAll('.chip').forEach(b=>b.onclick=()=>{const k=+b.dataset.k;if(!d.cs.includes(k))d.cs.push(k);drawC()});
        const good=d.cs.filter(k=>cons[k][1]).length;
        if(d.cs.includes(3))$('#cfb').innerHTML='<div class="feedback wrong">Ficar muito tempo sentado ao ecrã não nos deixa mais fortes. Escolhe as outras!</div>';
        if(good===3){$('#cfb').innerHTML='<div class="feedback good">Exato! Por isso é importante equilibrar a balança. ⚖️</div>';stepDone()}};
      drawC();return}
    const [em,t,side]=BAL[d.bi];
    $('#bx').innerHTML=scaleSVG(d.bl,d.br)+`<div class="card-q"><span class="em">${em}</span>${t}</div>
     <div class="two-btn"><button class="btn" style="background:var(--m3)" data-s="0">📱 Ecrã</button><button class="btn okb" data-s="1">🌳 Mundo real</button></div>${fb}`;
    $('#bx').querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{
      if(+b.dataset.s===side){side?d.br++:d.bl++;d.bi++;beep(700,.1);draw()}
      else draw(`<div class="feedback wrong">Pensa outra vez: “${t}” precisa de um ecrã?</div>`)});
  }
  draw();
 },
 el=>{
  const d=cur.d;d.si=d.si||0;d.right=d.right||0;
  el.innerHTML=head('🕵️ Seguro ou perigo?','Lê cada situação e decide. Lembra-te dos 3 sinais de alerta!')+`<div class="scale-items" id="sx"></div>`;
  function draw(){
    if(d.si>=SIT.length){
      d.stars=d.right>=8?3:d.right>=6?2:1;
      $('#sx').innerHTML=`<div class="pixel" style="width:140px">${pixel(d.right>=6?'festa':'pensar')}</div><div class="card-q">Acertaste ${d.right} em ${SIT.length}!</div>
       <div class="feedback good">Os 3 sinais de alerta: 🔐 protege os teus dados, 😊 sê amável e ⏰ sabe parar.</div>`;stepDone();return}
    const [t,safe,tag]=SIT[d.si];
    $('#sx').innerHTML=`<div style="font-weight:900;color:var(--muted)">Situação ${d.si+1} de ${SIT.length}</div><div class="card-q">${t}</div>
     <div class="two-btn"><button class="btn okb big" data-a="1">🟢 Seguro</button><button class="btn badb big" data-a="0">🔴 Perigo</button></div>`;
    $('#sx').querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>{
      const good=+b.dataset.a===safe;if(good){d.right++;beep(760)}else beep(220,.2);
      $('#sx').querySelector('.two-btn').outerHTML=`<div class="feedback ${good?'good':'wrong'}"><span class="tag">${tag}</span><br>${good?'Certo! ':'Hum… era '+(safe?'seguro':'perigo')+'. '}${SIT[d.si][3]}</div>
        <button class="btn" id="nx">Próxima situação ▶</button>`;
      $('#nx').onclick=()=>{d.si++;draw()};$('#nx').focus()});
  }
  draw();
 }
];

/* ===== MISSÃO 4: O nosso cartaz ===== */
MISSIONS[3].steps=[
 el=>{
  const d=cur.d;d.p=d.p||{theme:'',title:'',rules:[],own:'',col:0,stk:[],group:''};
  el.innerHTML=head('🎨 Escolham o tema','Trabalham em grupo. Escolham um tema e escrevam os vossos nomes.')+
   `<div class="themes" id="th"></div><label class="lbl" for="grp">Nomes do grupo</label><input class="inp" id="grp" maxlength="80" placeholder="Por exemplo: Ana, Rui e Inês" value="${esc(d.p.group)}">`;
  function draw(){
    $('#th').innerHTML=Object.entries(THEMES).map(([k,t])=>`<button class="theme ${d.p.theme===k?'on':''}" data-k="${k}"><span class="em">${t.em}</span><b>${t.name}</b>${t.desc}</button>`).join('');
    $('#th').querySelectorAll('.theme').forEach(b=>b.onclick=()=>{if(d.p.theme!==b.dataset.k){d.p.theme=b.dataset.k;d.p.title=THEMES[d.p.theme].title;d.p.rules=[];d.p.stk=[]}draw()});
    check();
  }
  function check(){if(d.p.theme&&d.p.group.trim().length>=2)stepDone();else{cur.ok.delete(cur.step);updNav()}}
  $('#grp').oninput=e=>{d.p.group=e.target.value;check()};
  draw();
 },
 el=>{
  const p=cur.d.p,T=THEMES[p.theme];
  el.innerHTML=head('✏️ Façam o cartaz','Escolham as regras, a cor e os autocolantes. O cartaz aparece ao lado.')+
   `<div class="poster-wrap"><div class="panel">
     <label class="lbl" for="ttl" style="margin-top:0">1. Título</label><input class="inp" id="ttl" maxlength="50" value="${esc(p.title)}">
     <span class="lbl">2. Escolham 3 ou 4 regras</span><div class="chips" id="rl"></div>
     <label class="lbl" for="own">3. Escrevam uma regra vossa (se quiserem)</label><input class="inp" id="own" maxlength="45" placeholder="A nossa regra…" value="${esc(p.own)}">
     <span class="lbl">4. Cor do cartaz</span><div class="swatches" id="sw"></div>
     <span class="lbl">5. Autocolantes (até 4)</span><div class="chips" id="sk"></div>
     <ul class="reqs" id="reqs"></ul>
    </div><div><div id="pv"></div>
     <div class="row" style="display:flex;gap:10px;flex-wrap:wrap;margin-top:14px;justify-content:center">
      <button class="btn ghost" id="fsBtn">🖥️ Ecrã inteiro</button><button class="btn ghost hidden" id="dlBtn">💾 Guardar cartaz</button><button class="btn ghost" id="prBtn">🖨️ Imprimir</button></div>
     <div class="toast" id="toast" style="text-align:center"></div></div></div>`;
  function upd(){
    $('#pv').innerHTML=posterHTML(p,'live');
    $('#rl').innerHTML=T.rules.map((r,i)=>`<button class="chip ${p.rules.includes(i)?'on':''}" data-i="${i}">${r}</button>`).join('');
    $('#sw').innerHTML=COLORS.map((c,i)=>`<button class="sw ${p.col===i?'on':''}" data-i="${i}" style="background:${c[0]}" aria-label="${c[2]}"></button>`).join('');
    $('#sk').innerHTML=[...T.stk,'⭐','💻'].filter((v,i,a)=>a.indexOf(v)===i).map(s=>`<button class="chip ${p.stk.includes(s)?'on':''}" data-s="${s}" style="font-size:24px;padding:6px 12px">${s}</button>`).join('');
    $('#rl').querySelectorAll('.chip').forEach(b=>b.onclick=()=>{const i=+b.dataset.i;if(p.rules.includes(i))p.rules=p.rules.filter(x=>x!==i);else if(p.rules.length<4)p.rules.push(i);else $('#toast').textContent='Já têm 4 regras. Tirem uma para escolher outra.';upd()});
    $('#sw').querySelectorAll('.sw').forEach(b=>b.onclick=()=>{p.col=+b.dataset.i;upd()});
    $('#sk').querySelectorAll('.chip').forEach(b=>b.onclick=()=>{const s=b.dataset.s;if(p.stk.includes(s))p.stk=p.stk.filter(x=>x!==s);else if(p.stk.length<4)p.stk.push(s);upd()});
    const req=[[p.title.trim().length>2,'Tem um título'],[p.rules.length>=3,'Tem pelo menos 3 regras'],[p.stk.length>=1,'Tem pelo menos 1 autocolante']];
    $('#reqs').innerHTML=req.map(([ok,t])=>`<li class="${ok?'ok':''}">${t}</li>`).join('');
    if(req.every(r=>r[0])){if(!cur.ok.has(cur.step)){$('#toast').textContent='O cartaz está pronto! 🎉';beep(880,.2)}stepDone()}else{cur.ok.delete(cur.step);updNav()}
  }
  $('#ttl').oninput=e=>{p.title=e.target.value;$('#pv').innerHTML=posterHTML(p,'live');upd()};
  $('#own').oninput=e=>{p.own=e.target.value;$('#pv').innerHTML=posterHTML(p,'live')};
  $('#fsBtn').onclick=()=>{const f=document.createElement('div');f.id='fs';f.innerHTML=posterHTML(p)+'<button class="btn">✕ Fechar</button>';document.body.appendChild(f);f.querySelector('button').onclick=()=>f.remove();f.querySelector('button').focus()};
  $('#prBtn').onclick=()=>{const live=$('#pv .poster');live.classList.add('printme');try{window.print()}catch(e){$('#toast').textContent='Não foi possível imprimir aqui. Usa o ecrã inteiro para mostrar o cartaz.'}setTimeout(()=>live.classList.remove('printme'),500)};
  $('#dlBtn').classList.remove('hidden');
  $('#dlBtn').onclick=()=>{
    const css=[...document.styleSheets].map(sh=>{try{return [...sh.cssRules].map(r=>r.cssText).join('\n')}catch(e){return ''}}).join('\n');
    const html=`<!doctype html><html lang="pt-PT"><head><meta charset="utf-8"><title>${esc(p.title)}</title><link href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@600;700;800;900&display=swap" rel="stylesheet"><style>${css}body{background:#fff;padding:20px}.poster{max-width:700px;margin:0 auto}</style></head><body>${posterHTML(p)}</body></html>`;
    const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([html],{type:'text/html'}));
    a.download='cartaz-'+(p.group.trim().split(/[ ,]+/)[0]||'grupo').toLowerCase()+'.html';document.body.appendChild(a);a.click();a.remove();
    $('#toast').textContent='Cartaz guardado! 💾'};
  upd();
 }
];

/* ===== MISSÃO 5: Compromisso Digital ===== */
const OATH=['Prometo cuidar da minha coluna,','descansar os meus olhos,','proteger a minha privacidade','e lembrar-me de que o mundo real é tão divertido quanto o mundo digital!'];
MISSIONS[4].steps=[
 el=>{
  const d=cur.d;d.ol=d.ol||0;
  el.innerHTML=head('✋ O juramento do aluno digital','Levanta-te e lê em voz alta com a turma. Clica em cada frase depois de a dizeres.')+
   `<div class="oath" id="oa"></div><div style="text-align:center;margin-top:16px"><button class="btn big" id="ob"></button></div><div id="ct"></div>`;
  function draw(){
    $('#oa').innerHTML=OATH.map((t,k)=>`<p class="${k<=d.ol?'on':''}">${t}</p>`).join('');
    const done=d.ol>=OATH.length;
    $('#ob').textContent=done?'🏅 Prometo!':'Já disse ▶';$('#ob').classList.toggle('hidden',!!d.certified);
    $('#ob').onclick=()=>{if(!done){d.ol++;beep(600,.1);draw()}else{d.certified=true;confetti();beep(880,.3);cert();draw();stepDone()}};
  }
  function cert(){
    const date=new Date().toLocaleDateString('pt-PT');
    $('#ct').innerHTML=`<div class="cert"><div class="pixel" style="width:110px;margin:0 auto">${pixel('festa')}</div><h2>Super-Herói Digital</h2>
     <div class="nm">${esc(S.name)}</div><div style="font-weight:800">cumpriu as missões e fez o juramento do aluno digital.</div>
     <table>${MISSIONS.slice(0,4).map(m=>`<tr><td>${m.name}</td><td>${starTxt((S.prog[m.id]||{}).stars||0)}</td></tr>`).join('')}</table>
     <div style="font-weight:800;color:var(--muted)">TIC · 4.º ano · ${date}</div></div>`;
  }
  draw();if(d.certified){cert();stepDone()}
 }
];

/* ---------------- ligação ao Firebase ---------------- */
let nuvem=null, paraRegisto=null, paraControlo=null, criando=null;
import('./nuvem.js').then(m=>{if(m.ativo){nuvem=m;ligar()}}).catch(e=>console.warn('Sem ligação ao Firebase:',e));

async function sync(campos){
  if(!nuvem||!S.name)return;
  try{
    if(!S.docId){
      const quem=S;criando=criando||nuvem.criarRegisto(S.name,S.turma);
      const id=await criando;criando=null;
      if(quem!==S)return; // entretanto entrou outro aluno
      S.docId=id;save();vigiar();
    }
    if(campos)await nuvem.guardar(S.docId,campos);
  }catch(e){console.warn('Não foi possível guardar no Firebase:',e)}
}
function vigiar(){
  if(!nuvem)return;
  paraRegisto&&paraRegisto();paraControlo&&paraControlo();paraRegisto=paraControlo=null;
  if(S.docId)paraRegisto=nuvem.vigiarRegisto(S.docId,estado=>{
    if(estado==='validado'){ // o professor validou: apaga tudo deste computador
      S={name:'',turma:'',prog:{},docId:null};save();aberta=null;
      paraRegisto&&paraRegisto();paraControlo&&paraControlo();paraRegisto=paraControlo=null;
      closeModal();$('#nameIn').value='';setAcc(5);show('home');
      $('#homeMsg').innerHTML='<span style="color:var(--ok)">✅ O teu trabalho foi validado pelo professor. Obrigado!</span>';
    }});
  if(S.turma)paraControlo=nuvem.vigiarControlo(S.turma,n=>{
    aberta=n;if($('#map').classList.contains('on'))renderMap()});
}
function ligar(){if(S.name){sync(null);vigiar()}}

/* ---------------- início ---------------- */
$('#homePixel').innerHTML=pixel('ola');
$('#turmaIn').innerHTML='<option value="">Escolhe a turma</option>'+(window.CONFIG?.turmas||[]).map(t=>`<option value="${esc(t.id)}">${esc(t.nome)}</option>`).join('');
$('#nameIn').value=S.name||'';$('#turmaIn').value=S.turma||'';
function start(){
  const n=$('#nameIn').value.trim(),t=$('#turmaIn').value;
  if(n.length<2){$('#homeMsg').textContent='Escreve o teu nome para começar.';$('#nameIn').focus();return}
  if(!t){$('#homeMsg').textContent='Escolhe a tua turma.';$('#turmaIn').focus();return}
  if(n.toLowerCase()!==(S.name||'').toLowerCase()||t!==S.turma){
    paraRegisto&&paraRegisto();paraControlo&&paraControlo();paraRegisto=paraControlo=null;
    S={name:n,turma:t,prog:{},docId:null};aberta=null;
  }else S.name=n;
  save();renderMap();ligar();resumir();
}
$('#goBtn').onclick=start;
$('#nameIn').onkeydown=e=>{if(e.key==='Enter')start()};
$('#exitBtn').onclick=()=>{$('#nameIn').value='';$('#homeMsg').textContent='';show('home');setAcc(5);$('#nameIn').focus()};
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeModal();const f=$('#fs');f&&f.remove()}});
