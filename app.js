const CATS=[['agf','🥦 Fruit & veg'],['brood','🥖 Bakery'],['vlees','🥩 Meat, fish & veggie'],['kaas','🧀 Cheese & cold cuts'],['zuivel','🥛 Dairy & eggs'],['pasta','🍝 Pasta, rice & world foods'],['conserven','🥫 Tins, soups & sauces'],['ontbijt','🥣 Breakfast & spreads'],['snoep','🍫 Biscuits, sweets & crisps'],['drank','🧃 Drinks'],['diepvries','🧊 Frozen'],['drogist','🧴 Toiletries & pharmacy'],['huishoud','🧽 Household'],['baby','🍼 Baby'],['dier','🐾 Pets'],['overig','🛒 Other']];
const CATN=Object.fromEntries(CATS);
// "nl / en" synonyms -> category
// AH catalog: ~15k real products (name, price, size, link) from checkjebon (MIT, refreshed daily from ah.nl); aisle = keyword rules
let CAT=null,IDX=[];fetch('catalog.json').then(r=>r.json()).then(j=>{CAT=j;IDX=j.p.map(p=>' '+norm(p[0]))}).catch(()=>{});
function ruleCat(n){if(!CAT)return null;const t=' '+norm(n)+' ';for(const[c,ks]of CAT.rules)for(const k0 of ks){const k=norm(k0);if(t.includes(' '+k)||(k.length>3&&t.includes(k)))return c}return null}
const norm=s=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();
const SYN=()=>CAT?CAT.syn:{};
function nlOf(name){const n=norm(name);const sy=SYN();if(sy[n])return sy[n];const w=n.split(' ').map(x=>sy[x]||'');return w.some(Boolean)?n.split(' ').map((x,i)=>w[i]||x).join(' '):''}
function catOf(name){const n=norm(name);const h=S.hist[n];if(h&&h.c)return h.c;return ruleCat(nlOf(name)||name)||ruleCat(name)||'overig'}
const PRICE={melk:1.29,havermelk:2.29,yoghurt:1.59,kwark:1.79,boter:2.99,roomboter:2.99,eieren:3.29,kaas:5.49,'geraspte kaas':2.49,mozzarella:1.19,feta:2.19,brood:2.39,croissants:2.49,stokbrood:1.39,wraps:1.99,bananen:1.89,appels:2.49,tomaten:1.99,komkommer:0.89,paprika:1.79,ui:1.19,knoflook:0.99,aardappelen:2.79,avocado:1.39,broccoli:1.49,spinazie:1.99,kipfilet:6.49,gehakt:4.49,zalm:5.99,tofu:2.29,pasta:1.39,spaghetti:1.39,rijst:2.49,'basmati rijst':3.49,tomatenblokjes:0.79,passata:1.29,koffie:6.99,thee:2.49,pindakaas:2.99,hagelslag:2.79,chips:1.99,chocolade:1.99,water:0.89,cola:2.19,bier:6.99,wijn:6.99,'wc-papier':5.99,keukenrol:2.99,afwasmiddel:1.99,vaatwastabletten:6.99,wasmiddel:9.99,tandpasta:2.49,shampoo:3.49};
const CATP={agf:1.79,brood:2.19,vlees:4.99,kaas:3.49,zuivel:1.69,pasta:1.89,conserven:1.49,ontbijt:3.29,snoep:2.09,drank:2.29,diepvries:3.49,drogist:3.99,huishoud:3.99,overig:2.50};
const EMO={melk:'🥛',havermelk:'🥛',yoghurt:'🥣',kaas:'🧀',eieren:'🥚',boter:'🧈',brood:'🍞',croissants:'🥐',stokbrood:'🥖',bananen:'🍌',appels:'🍎',peren:'🍐',citroen:'🍋',druiven:'🍇',aardbeien:'🍓',tomaten:'🍅',komkommer:'🥒',paprika:'🫑',ui:'🧅',knoflook:'🧄',aardappelen:'🥔',wortel:'🥕',broccoli:'🥦',avocado:'🥑',mango:'🥭',ananas:'🍍',champignons:'🍄',kipfilet:'🍗',gehakt:'🥩',biefstuk:'🥩',zalm:'🐟',garnalen:'🦐',pasta:'🍝',spaghetti:'🍝',rijst:'🍚',koffie:'☕',thee:'🍵',honing:'🍯',chips:'🥔',chocolade:'🍫',koekjes:'🍪',water:'💧',bier:'🍺',wijn:'🍷',cola:'🥤',ijs:'🍨','wc-papier':'🧻',keukenrol:'🧻',pizza:'🍕'};
const CATE={baby:'🍼',dier:'🐾',agf:'🥬',brood:'🍞',vlees:'🥩',kaas:'🧀',zuivel:'🥛',pasta:'🍝',conserven:'🥫',ontbijt:'🥣',snoep:'🍫',drank:'🧃',diepvries:'🧊',drogist:'🧴',huishoud:'🧽',overig:'🛒'};
function key(n){n=norm(n);if(PRICE[n]||EMO[n])return n;const k=Object.keys({...PRICE,...EMO}).sort((a,b)=>b.length-a.length).find(k=>n.includes(k));return k||n}
function qn(q){const m=String(q||'').match(/^(\d+[.,]?\d*)\s*(x|st|pak|zak)?$/i);return m?parseFloat(m[1].replace(',','.')):1}
const price=i=>i.p?i.p*qn(i.qty):(PRICE[key(i.nl||i.name)]||CATP[i.cat]||2.5)*qn(i.qty);
const emo=i=>EMO[key(i.nl||i.name)]||CATE[i.cat];
const STORES=['AH Amstelveen – Aletta Jacobslaan (1187 PZ)','AH Amstelveen Stadshart','AH Amstelveen Westwijk','Other AH'];
const $=s=>document.querySelector(s);const K='ahlist1';
const S=Object.assign({me:null,items:{},hist:{}},JSON.parse(localStorage[K]||'{}'));
const CID=Math.random().toString(36).slice(2);const save=()=>localStorage[K]=JSON.stringify(S);
// ---------- sync: textdb.online keyless KV (one JSON doc), poll + last-write-wins per item ----------
const KEY=(location.hash.slice(1)||window.AH_KEY);const R='https://textdb.online/'+KEY,W='https://api.textdb.online/update/';
let busy=false,dirty=false,dt;
function pub(){dirty=true;clearTimeout(dt);dt=setTimeout(sync,400)}
function merge(arr){let ch=false;for(const it of arr){const o=S.items[it.id];if(!o||it.t>o.t){S.items[it.id]=it;ch=true;learn(it)}}if(ch){save();render()}}
async function sync(){if(busy)return;busy=true;try{
 const r=await fetch(R+'?_='+Date.now(),{cache:'no-store'});let remote={};if(r.ok){const t=await r.text();try{remote=JSON.parse(t).items||{}}catch(_){}}
 merge(Object.values(remote));
 const need=dirty||Object.values(S.items).some(i=>!remote[i.id]||remote[i.id].t<i.t);
 if(need){const now=Date.now();const out={};for(const[k,v]of Object.entries(S.items))if(!(v.del&&now-v.t>14*864e5))out[k]=v;
  const w=await fetch(W,{method:'POST',body:new URLSearchParams({key:KEY,value:JSON.stringify({v:1,items:out})})});if(!(await w.json()).status)throw 0;dirty=false}
 $('#dot').classList.add('on')}catch(e){$('#dot').classList.remove('on')}busy=false;if(dirty)setTimeout(sync,1500)}
function connect(){sync();setInterval(()=>{if(!document.hidden)sync()},4000)}
// ---------- model ----------
function learn(it){if(it.del)return;const n=norm(it.name);const h=S.hist[n]||{n:0};S.hist[n]={name:it.name,c:it.cat,p:it.p||0,s:it.s||'',l:it.l||'',n:h.n+(h.last===it.id?0:1),last:it.id}}
function put(it){it.t=Date.now();S.items[it.id]=it;learn(it);save();pub();render()}
function parse(txt){let m=txt.trim().match(/^(\d+[.,]?\d*\s?(x|kg|g|l|ml|st|pak|zak)?)\s+(.+)$/i)||txt.trim().match(/^(.+?)\s+(\d+[.,]?\d*\s?(x|kg|g|l|ml|st)?)$/i);
if(!m)return{name:txt.trim(),qty:''};return /^\d/.test(m[1])?{name:m[3],qty:m[1]}:{name:m[1],qty:m[2]}}
function add(txt,x){if(!txt.trim())return;const p=parse(txt);x=x||S.hist[norm(p.name)]||{};const name=x.name||p.name.charAt(0).toUpperCase()+p.name.slice(1);
const ex=Object.values(S.items).find(i=>!i.del&&!i.done&&norm(i.name)===norm(name));if(ex){toast(name+' is already on the list');return}
put({id:Date.now().toString(36)+Math.random().toString(36).slice(2,6),name,qty:p.qty,note:'',nl:x.l?'':nlOf(name),p:x.p||0,s:x.s||'',l:x.l||'',cat:x.c||catOf(name),by:(S.me||"P")[0],done:false,del:false})}
// ---------- UI ----------
let last=null;function toast(msg,undo){$('#tm').textContent=msg;$('#undo').style.display=undo?'':'none';last=undo;const t=$('#toast');t.classList.add('s');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('s'),3500)}
$('#undo').onclick=()=>{if(last){last.forEach(o=>put(o));last=null}$('#toast').classList.remove('s')};
const esc=s=>String(s).replace(/[&<>"]/g,c=>'&#'+c.charCodeAt(0)+';');
function render(){const now=Date.now();for(const[k,v]of Object.entries(S.items))if(v.del&&now-v.t>3*864e5)delete S.items[k];
const live=Object.values(S.items).filter(i=>!i.del);const L=$('#list');
if(!live.length){L.innerHTML='<div class="empty"><b>🛒</b>List is empty.<br>Type above what you need.</div>'}else{
let h='';for(const[c,lab]of CATS){const g=live.filter(i=>i.cat===c&&!i.done).sort((a,b)=>a.name.localeCompare(b.name));if(!g.length)continue;h+=`<h2>${lab} <span style="float:right">aisle ~${CATS.findIndex(x=>x[0]===c)+1}</span></h2><div class="grp">${g.map(row).join('')}</div>`}
const d=live.filter(i=>i.done).sort((a,b)=>b.t-a.t);if(d.length)h+=`<h2>✓ In the basket (${d.length})</h2><div class="grp">${d.map(row).join('')}</div>`;L.innerHTML=h}
const open=live.filter(i=>!i.done);$('#tot').innerHTML=open.length?`Est. <b>€${open.reduce((a,i)=>a+price(i),0).toFixed(2)}</b> · ${open.length} items · ${esc(S.store||STORES[0])}`:esc(S.store||STORES[0]);
$('#clr').style.display=live.some(i=>i.done)?'':'none';
const onList=new Set(live.filter(i=>!i.done).map(i=>norm(i.name)));
const fav=Object.values(S.hist).filter(h=>!onList.has(norm(h.name))).sort((a,b)=>b.n-a.n).slice(0,12);
$('#chips').innerHTML=fav.map(f=>`<button class="chip" data-n="${esc(f.name)}">+ ${esc(f.name)}</button>`).join('')}
function row(i){return`<div class="item ${i.done?'done':''}" data-id="${i.id}"><div class="ck">${i.done?'✓':''}</div><div class="pic">${emo(i)}</div><div class="bd"><div class="nm">${i.qty?`<span class="q">${esc(i.qty)}</span>`:''}${esc(i.name)}</div><div class="meta">${i.nl?'<i>AH: '+esc(i.nl)+'</i> · ':''}${i.note?esc(i.note)+' · ':''}${i.s?esc(i.s)+' · ':''}${i.p?'':'~'}€${price(i).toFixed(2)} · <a href="${i.l?'https://www.ah.nl/producten/product/'+i.l:'https://www.ah.nl/zoeken?query='+encodeURIComponent(i.nl||i.name)}" target="_blank" onclick="event.stopPropagation()">ah.nl</a></div></div><span class="who ${i.by}">${i.by==='P'?'Punardeep':'Aastha'}</span></div>`}
$('#list').addEventListener('click',e=>{const r=e.target.closest('.item');if(!r)return;const it=S.items[r.dataset.id];
if(e.target.closest('.ck')||e.target.closest('.nm')&&false){}
if(e.target.closest('.bd')&&!e.target.closest('.ck')&&!press){return openEd(it)}
const old={...it};put({...it,done:!it.done});if(navigator.vibrate)navigator.vibrate(10);toast(it.done?'':`${it.name} ticked off`,[old])});
let press=false;
$('#chips').onclick=e=>{const b=e.target.closest('.chip');if(b)add(b.dataset.n)};
$('#clr').onclick=()=>{const d=Object.values(S.items).filter(i=>i.done&&!i.del);const old=d.map(i=>({...i}));d.forEach(i=>put({...i,del:true}));toast(d.length+' items cleared',old)};
// autocomplete
const q=$('#q'),sug=$('#sug');
let SR=[];
function suggest(){const raw=parse(q.value).name,v=norm(raw);if(!v){sug.style.display='none';return}const out=[],seen=new Set();
for(const h of Object.values(S.hist).sort((a,b)=>b.n-a.n))if(norm(h.name).includes(v)&&out.length<3){seen.add(norm(h.name));out.push(h)}
if(CAT&&v.length>1){const sy=CAT.syn;const terms=(sy[v]||v.split(' ').map(w=>sy[w]||w).join(' ')).split(' ').filter(Boolean);const hits=[];
 for(let i=0;i<IDX.length;i++){const t=IDX[i];let sc=0,ok=true;for(const w of terms){const k=t.indexOf(w);if(k<0){ok=false;break}sc+=t[k-1]===' '?10:3;if(t.endsWith(' '+w))sc+=8;else if(t.includes(' '+w+' '))sc+=3}
  if(ok){if(t.startsWith(' ah '))sc+=6;sc-=t.length/12;hits.push([sc,i])}}
 if(!hits.length&&terms.join(' ')!==v){q.dataset.f=1}hits.sort((a,b)=>b[0]-a[0]);for(const[,i]of hits.slice(0,8)){const p=CAT.p[i];if(seen.has(norm(p[0])))continue;out.push({name:p[0],p:p[1],s:p[2],l:p[3],c:CAT.order[p[4]]})}}
SR=out.slice(0,7);sug.innerHTML=SR.map((h,k)=>`<div data-k="${k}"><span>${h.l&&!h.n?'':'★ '}${esc(h.name)}${h.s?` <small>· ${esc(h.s)}</small>`:''}</span><small>${h.p?'€'+(+h.p).toFixed(2)+' ':''}${(CATN[h.c]||'').split(' ')[0]}</small></div>`).join('');sug.style.display=SR.length?'block':'none'}
q.oninput=suggest;sug.addEventListener('mousedown',e=>e.preventDefault());
sug.onclick=e=>{const d=e.target.closest('[data-k]');if(!d)return;const h=SR[+d.dataset.k];const p=parse(q.value);add((p.qty?p.qty+' ':'')+h.name,h);q.value='';sug.style.display='none';q.focus()};
$('#f').onsubmit=e=>{e.preventDefault();add(q.value);q.value='';sug.style.display='none'};q.onblur=()=>setTimeout(()=>sug.style.display='none',100);
// editor
let cur;$('#ec').innerHTML=CATS.map(([c,l])=>`<option value="${c}">${l}</option>`).join('');
function openEd(it){cur=it;$('#en').value=it.name;$('#eq').value=it.qty||'';$('#eo').value=it.note||'';$('#ec').value=it.cat;$('#ed').classList.add('s')}
$('#ed').onclick=e=>{if(e.target.id==='ed')$('#ed').classList.remove('s')};
$('#esave').onclick=()=>{const n=$('#en').value.trim()||cur.name;const c=$('#ec').value;put({...cur,name:n,nl:n===cur.name?cur.nl:nlOf(n),...(n===cur.name?{}:{p:0,l:'',s:''}),qty:$('#eq').value.trim(),note:$('#eo').value.trim(),cat:c});S.hist[norm(n)]&&(S.hist[norm(n)].c=c,save());$('#ed').classList.remove('s')};
$('#edel').onclick=()=>{const old={...cur};put({...cur,del:true});$('#ed').classList.remove('s');toast(cur.name+' removed',[old])};
// who
function setMe(w){S.me=w;save();$('#me').textContent=w;$('#who').classList.remove('s')}
document.querySelectorAll('[data-w]').forEach(b=>b.onclick=()=>setMe(b.dataset.w));$('#me').onclick=()=>$('#who').classList.add('s');
if(S.me)$('#me').textContent=S.me;else $('#who').classList.add('s');
$('#store').innerHTML=STORES.map(x=>`<option>${x}</option>`).join('');$('#store').value=S.store||STORES[0];$('#store').onchange=e=>{S.store=e.target.value;save();render()};
{const u=new URLSearchParams(location.search);if(u.get('me'))setMe(u.get('me'));if(u.get('add'))setTimeout(()=>add(u.get('add')),50)}
render();if(!location.search.includes("nosync"))connect();document.addEventListener('visibilitychange',()=>{if(!document.hidden)sync()});
if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js');
