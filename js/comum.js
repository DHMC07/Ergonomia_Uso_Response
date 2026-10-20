/* Funções partilhadas entre a página dos alunos e o painel do professor */
const esc=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* ---------------- mascote Pixel ---------------- */
function pixel(mood='ola'){
  const eyes={ola:'<circle cx="47" cy="40" r="5"/><circle cx="73" cy="40" r="5"/>',
    pensar:'<circle cx="45" cy="37" r="5"/><circle cx="71" cy="37" r="5"/>',
    festa:'<path d="M41 41q6-8 12 0M67 41q6-8 12 0" fill="none" stroke="#233041" stroke-width="4" stroke-linecap="round"/>',
    uau:'<circle cx="47" cy="40" r="6"/><circle cx="73" cy="40" r="6"/>'}[mood];
  const mouth={ola:'<path d="M48 54q12 10 24 0" fill="none" stroke="#233041" stroke-width="4" stroke-linecap="round"/>',
    pensar:'<path d="M53 57h14" stroke="#233041" stroke-width="4" stroke-linecap="round"/>',
    festa:'<path d="M45 52q15 16 30 0z" fill="#233041"/>',
    uau:'<ellipse cx="60" cy="57" rx="7" ry="8" fill="#233041"/>'}[mood];
  const armL=mood==='festa'?'<path d="M17 48 L4 22" />':'<path d="M17 52 L5 70" />';
  const armR=mood==='ola'?'<path class="arm-w" d="M103 52 L116 28" />':mood==='festa'?'<path d="M103 48 L116 22" />':mood==='pensar'?'<path d="M103 54 L92 64" />':'<path d="M103 52 L115 70" />';
  const extra=mood==='festa'?'<text x="2" y="16" font-size="16">⭐</text><text x="100" y="14" font-size="14">✨</text>':mood==='pensar'?'<text x="98" y="16" font-size="18">💭</text>':'';
  return `<svg viewBox="0 0 120 130" role="img" aria-label="Pixel, a mascote">
    <g stroke="#2F7FC1" stroke-width="7" stroke-linecap="round" fill="none">${armL}${armR}</g>
    <rect x="52" y="78" width="16" height="16" rx="3" fill="#2F7FC1"/>
    <ellipse cx="60" cy="100" rx="28" ry="7" fill="#2F7FC1"/>
    <rect x="15" y="10" width="90" height="70" rx="18" fill="#2F7FC1"/>
    <rect x="24" y="19" width="72" height="52" rx="12" fill="#E8F6FF"/>
    <circle cx="36" cy="52" r="5" fill="#FFB3B3" opacity=".8"/><circle cx="84" cy="52" r="5" fill="#FFB3B3" opacity=".8"/>
    <g fill="#233041">${eyes}</g>${mouth}
    <path d="M30 116 q30 10 60 0" stroke="#179C8C" stroke-width="0" fill="none"/>
    ${extra}</svg>`;
}

/* ---------------- figura do posto de trabalho ---------------- */
// st: costas 0 curvadas/1 encosto · pes 0 no ar/1 apoio · dist 0 perto/1 braço/2 longe · alt 0 baixo/1 olhos/2 alto
function figure(st,{hotspots=false,found=[]}={}){
  const mc=[212,250,288][st.dist], mt=[108,78,44][st.alt];
  const S=st.costas?{x:70,y:105}:{x:122,y:108};
  const H=st.costas?{x:78,y:163}:{x:88,y:163};
  let hc={x:S.x+(st.costas?4:16),y:S.y-(st.costas?26:18)};
  if(st.alt===0){hc.x+=4;hc.y+=6} if(st.alt===2){hc.x-=3;hc.y-=2}
  const E={x:hc.x+9,y:hc.y-2};
  const torso=st.costas?`M${H.x} ${H.y} L${S.x} ${S.y}`:`M${H.x} ${H.y} Q100 120 ${S.x} ${S.y}`;
  const ank=st.pes?{x:136,y:220}:{x:126,y:221};
  const ok=st.costas&&st.pes&&st.dist===1&&st.alt===1;
  let svg=`<svg viewBox="0 0 320 250" role="img" aria-label="Aluno sentado ao computador">
  <line x1="8" y1="240" x2="312" y2="240" stroke="#9AA6B2" stroke-width="3" stroke-linecap="round"/>
  <rect x="175" y="148" width="137" height="8" rx="3" fill="#C99A6B"/>
  <rect x="181" y="156" width="6" height="84" fill="#B5865A"/><rect x="300" y="156" width="6" height="84" fill="#B5865A"/>
  <rect x="${mc-12}" y="145" width="24" height="4" rx="2" fill="#3A4556"/>
  <rect x="${mc-3}" y="${mt+34}" width="6" height="${148-(mt+34)}" fill="#3A4556"/>
  <rect x="${mc-23}" y="${mt}" width="46" height="34" rx="4" fill="#3A4556"/>
  <rect x="${mc-19}" y="${mt+4}" width="38" height="26" rx="2" fill="#9FD8FF"/>
  <rect x="176" y="143" width="24" height="5" rx="2" fill="#6B7787"/>
  <rect x="85" y="177" width="7" height="52" fill="#7D8A9B"/>
  <line x1="60" y1="232" x2="120" y2="232" stroke="#7D8A9B" stroke-width="6" stroke-linecap="round"/>
  <circle cx="62" cy="237" r="4" fill="#4E5A69"/><circle cx="118" cy="237" r="4" fill="#4E5A69"/>
  <rect x="46" y="95" width="11" height="80" rx="5" fill="#8A97A8"/>
  <rect x="50" y="168" width="80" height="9" rx="4" fill="#8A97A8"/>
  ${st.pes?'<rect x="120" y="224" width="46" height="16" rx="3" fill="#C99A6B"/>':''}
  <g stroke-linecap="round" fill="none">
    <path d="M${H.x} ${H.y} L132 166 L${ank.x} ${ank.y}" stroke="#2F3E55" stroke-width="15" stroke-linejoin="round"/>
    <path d="M${ank.x} ${ank.y+2} l17 1" stroke="#1F2733" stroke-width="9"/>
    <path d="${torso}" stroke="#3C7DD9" stroke-width="20"/>
    <path d="M${S.x} ${S.y} L${hc.x-2} ${hc.y+10}" stroke="#F0B68E" stroke-width="9"/>
    <path d="M${S.x} ${S.y+4} L${S.x+20} 141 L178 144" stroke="#3C7DD9" stroke-width="9" stroke-linejoin="round"/>
    <path d="M168 144 L180 144" stroke="#F0B68E" stroke-width="8"/>
  </g>
  <circle cx="${hc.x}" cy="${hc.y}" r="15" fill="#F0B68E"/>
  <path d="M${hc.x-15} ${hc.y-1} a15 15 0 0 1 26 -10 q-10 2 -14 10 z" fill="#3B2A20"/>
  <circle cx="${E.x}" cy="${E.y}" r="2.2" fill="#233041"/>
  <line x1="${E.x+3}" y1="${E.y}" x2="${mc-23}" y2="${mt+10}" stroke="${ok?'#2E9A4F':'#D9453F'}" stroke-width="2" stroke-dasharray="4 4"/>`;
  if(hotspots){
    const spots={costas:[100,135,24],pes:[138,220,20],ecra:[212,125,26],pescoco:[134,98,20]};
    for(const k in spots){const [x,y,r]=spots[k];
      if(found.includes(k)) svg+=`<circle class="ring" cx="${x}" cy="${y}" r="${r}"/>`;
      svg+=`<circle class="hs" data-k="${k}" cx="${x}" cy="${y}" r="${r}"><title>Erro?</title></circle>`}
  }
  return svg+'</svg>';
}


/* ---------------- cartaz ---------------- */
const THEMES={
 A:{em:'🪑',name:'A postura certa',desc:'Certo e errado, com desenhos',title:'Senta-te como um super-herói!',
    rules:['Costas no encosto','Pés bem assentes no chão','Ecrã à distância de um braço','Olhos na linha do ecrã','Pausa 20-20-20','Pulsos direitos no teclado'],stk:['🦸','🪑','🦶','👀','💪','⭐']},
 B:{em:'⏰',name:'O tempo de ecrã',desc:'Quando usar e quando desligar',title:'O nosso contrato do tempo de ecrã',
    rules:['Ecrã só depois dos trabalhos de casa','Desligo quando um adulto avisa','Sem ecrãs à mesa','Sem ecrãs antes de dormir','Brincar ao ar livre todos os dias','Mais tempo com a família'],stk:['⏰','🌳','⚽','😴','🍽️','🚲']},
 C:{em:'🛡️',name:'Seguros e amigos',desc:'Segurança e amizade online',title:'Seguros e amigos na internet',
    rules:['Protege a tua password','Não digas a tua morada nem a escola','Trata todos com amabilidade','Não fales com desconhecidos','Se algo te assustar, conta a um adulto','Pensa antes de publicar'],stk:['🔐','🛡️','😊','💬','👍','❤️']}};
const COLORS=[['#2F7FC1','#E0EEF9','Azul'],['#179C8C','#DDF3EF','Verde-água'],['#D99400','#FFF2CF','Amarelo'],['#D9456A','#FBE2E9','Framboesa'],['#6D5BD0','#ECE8FB','Roxo']];
function posterHTML(p,cls=''){
  const T=THEMES[p.theme];const col=COLORS[p.col];
  const rules=[...p.rules.map(i=>T.rules[i]),...(p.own.trim()?[p.own.trim()]:[])];
  const pos=[['3%','auto','auto','3%'],['3%','3%','auto','auto'],['auto','auto','3%','3%'],['auto','3%','3%','auto']];
  const stk=p.stk.map((s,k)=>`<span class="stk" aria-hidden="true" style="top:${pos[k][0]};right:${pos[k][1]};bottom:${pos[k][2]};left:${pos[k][3]}">${s}</span>`).join('');
  const figs=p.theme==='A'?`<div class="figs"><div class="x">${figure({costas:0,pes:0,dist:0,alt:0})}❌ Errado</div><div class="v">${figure({costas:1,pes:1,dist:1,alt:1})}✅ Certo</div></div>`:'';
  return `<div class="poster ${cls}" style="--pc:${col[0]};--pcs:${col[1]}"><div class="ph">${esc(p.title||'Escreve um título')}</div>
   <div class="pb">${figs}${rules.length?rules.map(r=>`<div class="rule"><i>✔</i>${esc(r)}</div>`).join(''):'<div class="empty">Escolhe as regras do teu cartaz</div>'}</div>
   <div class="pf">${p.group.trim()?esc(p.group.trim())+' · ':''}Manual da Internet Saudável · 4.º ano</div>${stk}</div>`;
}
