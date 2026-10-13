// ===== Local natural-language list parser (EN / NL / ES) + voice input =====
const NUMW={a:1,an:1,one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10,twelve:12,couple:2,dozen:12,
een:1,'één':1,twee:2,drie:3,vier:4,vijf:5,zes:6,zeven:7,acht:8,negen:9,tien:10,twaalf:12,
un:1,uno:1,una:1,dos:2,tres:3,cuatro:4,cinco:5,seis:6,siete:7,ocho:8,nueve:9,diez:10,doce:12,docena:12};
const SOME=/^(some|a few|a bit of|a little|wat|een paar|een beetje|wat meer|algo de|algo|unos|unas|un poco de|poco de)\s+/;
const HALF=/^(half a kilo( of)?|half a kg( of)?|halve kilo|een halve kilo|pond|medio kilo( de)?)\s+/;
const UNIT=/^(packs?|packets?|pakken|pakjes?|pak|paquetes?|bottles?|flessen|fles|botellas?|cans?|tins?|blikken|blikjes?|blik|latas?|bags?|zakken|zakjes?|zak|bolsas?|boxes?|dozen|doos|cajas?|jars?|potten|pot|botes?|tarros?|bunch(es)?|bossen|bos|manojos?|loaves|loaf|broden|kilos?|kg|kilo's|grams?|gram|gramos?|g|liters?|litres?|l|litros?|stuks?|pieces?|piezas?|cartons?|liter)\s+((of|de|met)\s+)?/;
const FILL=[/^(ok(ay)?|so|um+|uh+|also|and|plus|oh)\s+/,/\b(we|i)\s+(still\s+)?(need|want|have to buy|should buy|gotta get|must buy|need to (buy|get))( to (buy|get))?\b/g,/\b(please\s+)?(buy|get|grab|pick up|add)\b/g,/\b(don'?t forget|remember)( to (buy|get))?\b/g,
/\b(we|ik)\s+(hebben|heb|moeten|moet)\s+(nog\s+)?(ook\s+)?/g,/\b(nodig|kopen|halen|graag|alsjeblieft|nog|ook)\b/g,/\b(koop|haal)\b/g,/\bvergeet niet\b/g,
/\b(necesitamos|necesito|hay que comprar|tenemos que comprar|compra|comprar|comprad|falta|faltan|nos falta|nos faltan|por favor|tambien|también)\b/g,/\bon the list\b|\bop de lijst\b|\ben la lista\b/g];
const SPLIT=/\s*(?:,|;|\n|\.\s|\band also\b|\bas well as\b|\ben ook\b|\by tambien\b|\band\b|\ben\b|\by\b|\be\b|\bplus\b|&|\+)\s*/;
const ES={leche:'melk','leche semidesnatada':'halfvolle melk','leche entera':'volle melk',huevos:'eieren',huevo:'eieren',pan:'brood',mantequilla:'roomboter',queso:'kaas','queso rallado':'geraspte kaas',yogur:'yoghurt',yogures:'yoghurt',nata:'slagroom',
pollo:'kip','pechuga de pollo':'kipfilet','pechugas de pollo':'kipfilet',carne:'vlees','carne picada':'gehakt',ternera:'rundvlees',cerdo:'varkensvlees',jamon:'ham',salmon:'zalm',pescado:'vis',gambas:'garnalen',atun:'tonijn',tocino:'spekjes',salchichas:'worst',
manzana:'appel',manzanas:'appels',platano:'banaan',platanos:'bananen',banana:'banaan',bananas:'bananen',naranja:'sinaasappel',naranjas:'sinaasappels',limon:'citroen',limones:'citroen',lima:'limoen',uvas:'druiven',fresas:'aardbeien',pera:'peer',peras:'peren',pina:'ananas',sandia:'watermeloen',melon:'meloen',mango:'mango',kiwi:'kiwi',
aguacate:'avocado',aguacates:'avocado',tomate:'tomaat',tomates:'tomaten',pepino:'komkommer',pimiento:'paprika',pimientos:'paprika',cebolla:'ui',cebollas:'uien',ajo:'knoflook',ajos:'knoflook',jengibre:'gember',patata:'aardappel',patatas:'aardappelen',zanahoria:'wortel',zanahorias:'wortels',lechuga:'sla',espinacas:'spinazie',brocoli:'broccoli',coliflor:'bloemkool',champinones:'champignons',setas:'paddenstoelen',calabacin:'courgette',berenjena:'aubergine',cilantro:'koriander',perejil:'peterselie',albahaca:'basilicum',maiz:'mais',judias:'bonen',
arroz:'rijst',pasta:'pasta',espaguetis:'spaghetti',harina:'bloem',azucar:'suiker',sal:'zout',pimienta:'peper',aceite:'olie','aceite de oliva':'olijfolie',vinagre:'azijn',garbanzos:'kikkererwten',lentejas:'linzen',tomate_frito:'tomatenblokjes',
cafe:'koffie',te:'thee',agua:'water','agua con gas':'bruisend water',zumo:'sap','zumo de naranja':'sinaasappelsap',cerveza:'bier',cervezas:'bier',vino:'wijn','vino tinto':'rode wijn','vino blanco':'witte wijn',refresco:'frisdrank',
galletas:'koekjes',chocolate:'chocolade',patatas_fritas:'chips',helado:'ijs',cereales:'ontbijtgranen',avena:'havermout',miel:'honing',mermelada:'jam',
'papel higienico':'toiletpapier','papel de cocina':'keukenpapier',jabon:'zeep',champu:'shampoo','pasta de dientes':'tandpasta',detergente:'wasmiddel',lavavajillas:'afwasmiddel','bolsas de basura':'afvalzakken',panales:'luiers',pilas:'batterijen'};
const nrm=s=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[!?¿¡"“”]/g,'').trim();
function toNL(name){const sy=Object.assign({},CAT?CAT.syn:{},ES);const tries=[name,name.replace(/(es|s)$/,''),name.replace(/s$/,'')];
 for(const t of tries)if(sy[t])return sy[t];
 const w=name.split(' ').map(x=>sy[x]||sy[x.replace(/(es|s)$/,'')]||sy[x.replace(/s$/,'')]||null);return w.some(Boolean)?name.split(' ').map((x,i)=>w[i]||x).filter(x=>!/^(de|of|la|el|los|las|het|the)$/.test(x)).join(' '):''}
function parseList(text){let t=' '+nrm(text)+' ';for(const f of FILL)t=t.replace(f,' ');t=t.replace(/\s+/g,' ');
 const out=[];for(let ph of t.split(SPLIT)){ph=ph.trim().replace(/^(the|some|de|het|el|la|los|las)\s+/,'');if(!ph||ph.length<2)continue;let qty='';
  let m;if((m=ph.match(HALF))){qty='500 g';ph=ph.slice(m[0].length)}
  else if((m=ph.match(/^(\d+(?:[.,]\d+)?)\s*/))){qty=m[1];ph=ph.slice(m[0].length)}
  else{const w=ph.split(' ')[0];if(NUMW[w]&&ph.split(' ').length>1){qty=String(NUMW[w]);ph=ph.slice(w.length).trim()}else if((m=ph.match(SOME)))ph=ph.slice(m[0].length)}
  if((m=ph.match(UNIT))&&ph.length>m[0].length){const u=m[1];if(/^(kilos?|kg|kilo's)$/.test(u))qty=(qty||1)+' kg';else if(/^(grams?|gram|gramos?|g)$/.test(u))qty=(qty||'')+' g';else if(/^(liters?|litres?|l|litros?|liter)$/.test(u))qty=(qty||1)+' l';ph=ph.slice(m[0].length)}
  ph=ph.replace(/^(of|de|met)\s+/,'').trim();if(!ph)continue;if(qty==='1')qty='';
  const nl=toNL(ph),term=nl||ph;let prod=null;
  if(CAT){const ws=nrm(term).split(' ');prod=search(nrm(term)).find(p=>{const T=' '+nrm(p.name)+' ';return ws.every(w=>T.includes(' '+w+' ')||T.includes(' '+w.replace(/s$/,'')+' '))})||null}
  out.push({qty:qty.trim(),raw:ph,name:prod?prod.name:ph.charAt(0).toUpperCase()+ph.slice(1),nl,h:prod})}
 const m=[];for(const x of out){const d=m.find(y=>y.name===x.name);if(d&&/^\d*$/.test(d.qty)&&/^\d*$/.test(x.qty))d.qty=String((parseInt(d.qty)||1)+(parseInt(x.qty)||1));else if(!d)m.push(x)}return m}
window.parseList=parseList;
// ===== confirmation sheet =====
let NL=[];
function openNlp(items){NL=items;drawNlp();$('#nlp').classList.add('s')}
function drawNlp(){$('#nlpt').textContent=`Add ${NL.length} item${NL.length==1?'':'s'}`;$('#nlpadd').textContent=`Add all (${NL.length})`;$('#nlpadd').disabled=!NL.length;
 $('#nlpl').innerHTML=NL.map((x,k)=>{const it={name:x.name,nl:x.nl,cat:x.h?x.h.c:catOf(x.nl||x.raw)};return`<div class="nr" data-k="${k}"><span class="em">${emo(it)}</span><div class="bd"><input class="nn" value="${esc(x.name)}"><span class="sb">${x.h?[x.h.s,x.h.p?eur(+x.h.p):''].filter(Boolean).map(esc).join(' · '):'As typed'+(x.nl?' · AH: '+esc(x.nl):'')}</span></div>
 <div class="nq"><button data-a="-">−</button><input class="qv" value="${esc(x.qty||'1')}" inputmode="text"><button data-a="+">+</button></div><button class="nx" data-a="x" aria-label="remove">✕</button></div>`}).join('')||'<p class="hint">Nothing left to add.</p>'}
$('#nlpl').addEventListener('click',e=>{const r=e.target.closest('.nr'),a=e.target.closest('[data-a]');if(!r||!a)return;const x=NL[+r.dataset.k];const n=parseInt(x.qty)||1;
 if(a.dataset.a==='x')NL.splice(+r.dataset.k,1);else if(/^\d*$/.test(x.qty||'')){x.qty=String(Math.max(1,n+(a.dataset.a==='+'?1:-1)))}tap();drawNlp()});
$('#nlpl').addEventListener('change',e=>{const r=e.target.closest('.nr');if(!r)return;const x=NL[+r.dataset.k];if(e.target.classList.contains('qv'))x.qty=e.target.value.trim();if(e.target.classList.contains('nn')&&e.target.value.trim()!==x.name){x.name=e.target.value.trim();x.h=null;x.nl=nlOf(x.name);drawNlp()}});
$('#nlpadd').onclick=()=>{let n=0;for(const x of NL){const qty=x.qty&&x.qty!=='1'?x.qty+' ':'';const on=findOn(x.name);if(on&&/^\d*$/.test(x.qty||'')){put({...on,qty:String(qOf(on)+(parseInt(x.qty)||1))});n++}else if(add(qty+x.name,x.h||{c:catOf(x.nl||x.raw)})!==false)n++}
 tap();$('#nlp').classList.remove('s');q.value='';STP=null;q.blur();searching(false);render();toast(`Added ${n} item${n==1?'':'s'}`)};
$('#nlpc').onclick=()=>$('#nlp').classList.remove('s');$('#nlp').onclick=e=>{if(e.target.id==='nlp')$('#nlp').classList.remove('s')};
// multi-item detection in search
const isMulti=v=>/,|;|\n| and | en | y | plus |&/.test(' '+nrm(v)+' ')&&parseList(v).length>1;
const _sg=suggest;suggest=function(){_sg();const v=q.value;if(v&&isMulti(v)){const n=parseList(v).length;sug.innerHTML='';sug.insertAdjacentHTML('beforeend',`<button class="multi" id="multi">✨ Add ${n} items from “${esc(v.length>40?v.slice(0,40)+'…':v)}”</button>`);fit(true)}};
sug.addEventListener('click',e=>{if(e.target.closest('#multi')){e.stopImmediatePropagation();openNlp(parseList(q.value))}},true);
$('#f').addEventListener('submit',e=>{if(q.value&&isMulti(q.value)){e.stopImmediatePropagation();e.preventDefault();openNlp(parseList(q.value))}},true);
q.addEventListener('paste',()=>setTimeout(()=>{if(isMulti(q.value))suggest()},0));
// ===== voice =====
const LANGS=[['nl-NL','NL'],[/^en-GB/i.test(navigator.language)?'en-GB':'en-US','EN'],['es-ES','ES']];
if(!S.lang){const l=(navigator.language||'nl').slice(0,2);S.lang=(LANGS.find(x=>x[0].startsWith(l))||LANGS[0])[0]}
const lb=$('#lang');const showLang=()=>lb.textContent=(LANGS.find(x=>x[0]===S.lang)||LANGS[0])[1];showLang();
lb.onclick=()=>{const i=LANGS.findIndex(x=>x[0]===S.lang);S.lang=LANGS[(i+1)%LANGS.length][0];save();showLang();tap();toast('Voice language: '+({NL:'Nederlands',EN:'English',ES:'Español'})[lb.textContent])};
const SR_=window.SpeechRecognition||window.webkitSpeechRecognition;const STANDALONE=navigator.standalone||matchMedia('(display-mode: standalone)').matches;
let rec=null,voiceOK=!!SR_;
function dictHint(){q.focus();searching(true);toast('Tap the 🎤 on your keyboard and say e.g. “milk, two avocados and chicken”')}
$('#mic').onclick=()=>{tap();if(rec){rec.stop();return}if(!voiceOK)return dictHint();
 try{rec=new SR_();rec.lang=S.lang;rec.interimResults=true;rec.continuous=false;rec.maxAlternatives=1;let fin='';
  rec.onstart=()=>{document.body.classList.add('listening');searching(true);q.value='';q.placeholder='Listening…'};
  rec.onresult=e=>{let s='';for(const r of e.results)s+=r[0].transcript;fin=s;q.value=s;suggest()};
  rec.onerror=e=>{if(/not-allowed|service-not-allowed|audio-capture/.test(e.error)){voiceOK=false;dictHint()}else toast('Didn’t catch that — try again')};
  rec.onend=()=>{document.body.classList.remove('listening');q.placeholder='Search or add — milk, kipfilet…';rec=null;const it=fin?parseList(fin):[];if(it.length)openNlp(it)};
  rec.start()}catch(_){voiceOK=false;rec=null;dictHint()}};
// test hook
{const u=new URLSearchParams(location.search);if(u.get('say'))setTimeout(()=>{if(u.get('lang')){S.lang=u.get('lang');showLang()}document.querySelector('#nlp .pan').style.transition='none';document.querySelector('#nlp').style.transition='none';openNlp(parseList(u.get('say')))},900)}
