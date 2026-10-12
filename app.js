const CATS=[['agf','🥦 Fruit & veg'],['brood','🥖 Bakery'],['vlees','🥩 Meat, fish & veggie'],['kaas','🧀 Cheese & cold cuts'],['zuivel','🥛 Dairy & eggs'],['pasta','🍝 Pasta, rice & world foods'],['conserven','🥫 Tins, soups & sauces'],['ontbijt','🥣 Breakfast & spreads'],['snoep','🍫 Biscuits, sweets & crisps'],['drank','🧃 Drinks'],['diepvries','🧊 Frozen'],['drogist','🧴 Toiletries & pharmacy'],['huishoud','🧽 Household'],['baby','🍼 Baby'],['dier','🐾 Pets'],['overig','🛒 Other']];
const CATN=Object.fromEntries(CATS);
// "nl / en" synonyms -> category
// AH catalog: ~15k real products (name, price, size, link) from checkjebon (MIT, refreshed daily from ah.nl); aisle = keyword rules
let CAT=null,IDX=[],BYN={};fetch('catalog.json').then(r=>r.json()).then(j=>{CAT=j;IDX=j.p.map(p=>' '+norm(p[0]));j.p.forEach((p,i)=>{(BYN[p[0]]=BYN[p[0]]||[]).push(i)})}).catch(()=>{});
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
 setOn(1)}catch(e){setOn(0)}busy=false;if(dirty)setTimeout(sync,1500)}
function connect(){sync();setInterval(()=>{if(!document.hidden)sync()},4000)}
// ---------- model ----------
function learn(it){if(it.del)return;const n=norm(it.name);const h=S.hist[n]||{n:0};S.hist[n]={name:it.name,c:it.cat,p:it.p||0,s:it.s||'',l:it.l||'',n:h.n+(h.last===it.id?0:1),last:it.id}}
function put(it){it.t=Date.now();S.items[it.id]=it;learn(it);save();pub();render()}
function parse(txt){let m=txt.trim().match(/^(\d+[.,]?\d*\s?(x|kg|g|l|ml|st|pak|zak)?)\s+(.+)$/i)||txt.trim().match(/^(.+?)\s+(\d+[.,]?\d*\s?(x|kg|g|l|ml|st)?)$/i);
if(!m)return{name:txt.trim(),qty:''};return /^\d/.test(m[1])?{name:m[3],qty:m[1]}:{name:m[1],qty:m[2]}}
function add(txt,x){if(!txt.trim())return;const p=parse(txt);x=x||S.hist[norm(p.name)]||{};const name=x.name||p.name.charAt(0).toUpperCase()+p.name.slice(1);
const ex=Object.values(S.items).find(i=>!i.del&&!i.done&&norm(i.name)===norm(name));if(ex){toast(name+' is already on the list');return false}
put({id:Date.now().toString(36)+Math.random().toString(36).slice(2,6),name,qty:p.qty,note:'',nl:x.l?'':nlOf(name),p:x.p||0,s:x.s||'',l:x.l||'',cat:x.c||catOf(name),by:(S.me||"U")[0],done:false,del:false});return true}
// ================= UI =================
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>'&#'+c.charCodeAt(0)+';');
const PEOPLE={P:{n:'Punardeep',c:'#0A84FF'},A:{n:'Aastha',c:'#FF5E9A'},U:{n:'Someone',c:'#8E8E93'}};
const eur=v=>'€'+v.toFixed(2).replace('.',',');
S.col=S.col||{};S.shop=!!S.shop;
function setOn(v){$('#sync').classList.toggle('on',!!v)}
// haptics: Android vibrate; iOS 18+ switch-toggle trick
const hl=$('#hapt');function tap(){try{navigator.vibrate&&navigator.vibrate(8);hl.click()}catch(_){}}
// toast
let undoBuf=null;function toast(msg,undo){$('#tm').textContent=msg;$('#undo').hidden=!undo;undoBuf=undo||null;const t=$('#toast');t.classList.add('s');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('s'),3800)}
$('#undo').onclick=()=>{if(undoBuf){undoBuf.forEach(o=>put(o));undoBuf=null;tap()}$('#toast').classList.remove('s')};
const avatar=b=>`<span class="av" style="background:${PEOPLE[b]?.c||'#888'}">${b==='U'||!PEOPLE[b]?'?':PEOPLE[b].n[0]}</span>`;
function row(i){const sub=[i.nl&&!i.l?'AH: '+esc(i.nl):'',esc(i.s),esc(i.note)].filter(Boolean).join(' · ');
return`<div class="row${i.done?' done':''}" data-id="${i.id}"><div class="sw l">✓</div><div class="sw r">Delete</div><div class="rc">
<button class="ck" aria-label="tick"><svg viewBox="0 0 24 24"><path d="M6 12.5l4 4 8-9"/></svg></button>
<div class="em">${emo(i)}</div><div class="bd"><div class="nm">${i.qty?`<b class="qt">${esc(i.qty)}</b>`:''}${esc(i.name)}</div>${sub?`<div class="sb">${sub}</div>`:''}</div>
<div class="rt"><span class="pr">${i.p?'':'~'}${eur(price(i))}</span>${avatar(i.by)}</div></div></div>`}
function render(){const now=Date.now();for(const[k,v]of Object.entries(S.items))if(v.del&&now-v.t>3*864e5)delete S.items[k];
const live=Object.values(S.items).filter(i=>!i.del),open=live.filter(i=>!i.done),done=live.filter(i=>i.done);
document.body.classList.toggle('shop',S.shop);
const L=$('#list');let h='';
if(!live.length)h=`<div class="empty"><div class="ill">🧺</div><h3>Your list is empty</h3><p>Tap <b>Add item</b> below — search 15,000 AH products in English or Dutch.</p></div>`;
else if(!open.length)h=`<div class="empty sm"><div class="ill">🎉</div><h3>All done!</h3><p>Everything's in the basket.</p></div>`;
CATS.forEach(([c,lab],ix)=>{const g=open.filter(i=>i.cat===c).sort((a,b)=>a.name.localeCompare(b.name));if(!g.length)return;const col=S.col[c];
 const[e,...n]=lab.split(' ');h+=`<section class="sec${col?' col':''}"><header data-c="${c}"><span class="se">${e}</span><span class="sn">${n.join(' ')}</span><span class="cnt">${g.length}</span><svg class="chev" viewBox="0 0 24 24"><path d="M8 10l4 4 4-4"/></svg></header><div class="grp">${g.map(row).join('')}</div></section>`});
if(done.length){const col=S.col._done;h+=`<section class="sec basket${col?' col':''}"><header data-c="_done"><span class="se">🧺</span><span class="sn">In the basket</span><span class="cnt">${done.length}</span><button class="clr" id="clr">Clear</button><svg class="chev" viewBox="0 0 24 24"><path d="M8 10l4 4 4-4"/></svg></header><div class="grp">${done.sort((a,b)=>b.t-a.t).map(row).join('')}</div></section>`}
L.innerHTML=h;if(STP&&STP.k==='l'){const r=L.querySelector(`.row[data-id="${STP.key}"]`),it=S.items[STP.key];if(r&&it&&!it.done){r.classList.add('sel');r.insertAdjacentHTML('afterend',stpHTML(it,1))}else STP=null}
// progress + totals
const tot=live.length,dn=done.length,frac=tot?dn/tot:0;$('#ring').style.strokeDashoffset=(1-frac)*113.1;
$('#prog').textContent=tot?`${dn} of ${tot} in basket`:'Nothing on the list yet';
$('#ptxt').textContent=tot?Math.round(frac*100)+'%':'';
const rest=open.reduce((a,i)=>a+price(i),0),all=live.reduce((a,i)=>a+price(i),0);
$('#total').textContent=eur(all);$('#tsub').textContent=open.length?`${eur(rest)} still to get`+(live.some(i=>!i.p)?' · ~ estimated':''):tot?'All in the basket':'';
$('#store').textContent=S.store||STORES[0];$('#shopb').classList.toggle('on',S.shop);}
// --- list interactions: tap, swipe, collapse ---
const LST=$('#list');
LST.addEventListener('click',e=>{if(e.target.id==='clr'){e.stopPropagation();const d=Object.values(S.items).filter(i=>i.done&&!i.del),old=d.map(i=>({...i}));d.forEach(i=>{i.del=true;i.t=Date.now()});save();pub();render();tap();toast(`Cleared ${d.length} item${d.length>1?'s':''}`,old);return}
 const hd=e.target.closest('header[data-c]');if(hd){const c=hd.dataset.c;S.col[c]=!S.col[c];save();hd.parentNode.classList.toggle('col');return}
 if(stpClick(e))return;const r=e.target.closest('.row');if(!r||r._sw)return;const it=S.items[r.dataset.id];if(e.target.closest('.ck'))return toggle(r,it);if(it.done)return openEd(it);STP=STP&&STP.key===it.id?null:{k:'l',key:it.id};tap();render()});
function toggle(r,it){tap();const old={...it};r.classList.add(it.done?'unpop':'pop');if(!it.done)r.classList.add('done');
 setTimeout(()=>{r.classList.add('out');setTimeout(()=>{put({...it,done:!it.done});if(!it.done)toast(`${it.name} in the basket`,[old])},220)},380)}
let sx=0,sy=0,cur=null,dx=0,lock=0;
LST.addEventListener('touchstart',e=>{const r=e.target.closest('.row');if(!r)return;cur=r;sx=e.touches[0].clientX;sy=e.touches[0].clientY;dx=0;lock=0;r._sw=false},{passive:true});
LST.addEventListener('touchmove',e=>{if(!cur)return;const x=e.touches[0].clientX-sx,y=e.touches[0].clientY-sy;if(!lock)lock=Math.abs(x)>8?1:Math.abs(y)>8?2:0;if(lock!==1)return;
 e.preventDefault();dx=x;cur._sw=true;const c=cur.querySelector('.rc');c.style.transition='none';c.style.transform=`translateX(${x}px)`;cur.classList.toggle('arm',Math.abs(x)>90);cur.dataset.dir=x>0?'l':'r'},{passive:false});
LST.addEventListener('touchend',()=>{if(!cur)return;const r=cur,c=r.querySelector('.rc'),it=S.items[r.dataset.id];cur=null;c.style.transition='';
 if(Math.abs(dx)>90){if(dx>0){c.style.transform='';toggle(r,it)}else{tap();c.style.transform='translateX(-110%)';const old={...it};setTimeout(()=>{put({...it,del:true});toast(it.name+' deleted',[old])},200)}}else c.style.transform='';
 r.classList.remove('arm');setTimeout(()=>r._sw=false,50)});
// --- add sheet ---
const q=$('#q'),sug=$('#sug');let SR=[],STP=null;// STP={k:'r'|'l',key}
let lockY=0;const searching=v=>{const B=document.body;if(v===B.classList.contains('searching'))return;
 if(v){lockY=scrollY;B.style.top=-lockY+'px';B.classList.add('searching')}else{B.classList.remove('searching');B.style.top='';scrollTo(0,lockY)}fit(true)};
let KB=null;// test override for keyboard height
function fit(bottom){const vv=window.visualViewport,H=innerHeight;const vh=KB!=null?H-KB:vv?vv.height:H,top=KB!=null?0:vv?vv.offsetTop:0,kb=Math.max(0,H-vh-top);
 const bar=$('.bar'),R=$('#res');bar.style.transform=kb?`translateY(${-kb}px)`:'';bar.classList.toggle('kb',kb>0);
 const bh=bar.offsetHeight-(kb?parseFloat(getComputedStyle(bar).paddingBottom)-10:0);R.style.top=top+'px';R.style.height=(vh-bh)+'px';
 if(bottom)R.scrollTop=R.scrollHeight}
if(window.visualViewport){visualViewport.addEventListener('resize',()=>fit(true));visualViewport.addEventListener('scroll',()=>fit(false))}addEventListener('resize',()=>fit(true));
q.onfocus=()=>{searching(true);suggest()};
$('#cancel').onclick=()=>{q.value='';STP=null;q.blur();searching(false);render()};
$('#qx').onclick=()=>{q.value='';STP=null;suggest();q.focus()};
document.addEventListener('touchmove',e=>{if(document.body.classList.contains('searching')&&!e.target.closest('#res'))e.preventDefault()},{passive:false});
// ---- quantity helpers + stepper ----
const isN=x=>!x||/^\d+$/.test(String(x).trim());const qOf=i=>/^\d+$/.test(String(i.qty||'').trim())?+i.qty:1;
const findOn=n=>Object.values(S.items).find(i=>!i.del&&!i.done&&norm(i.name)===norm(n));
function setQty(it,n){if(n<=0){const old={...it};put({...it,del:true});tap();toast(it.name+' removed',[old]);STP=null;refresh();return}put({...it,qty:n>1?String(n):''});tap();refresh()}
const VARS=n=>(BYN[n]||[]).map(i=>CAT.p[i]);
function stpHTML(it,edit){const v=it?VARS(it.name):[];const n=it?qOf(it):0;
 return`<div class="stp" data-id="${it?it.id:''}"><div class="sr"><button class="sb1" data-a="-" aria-label="less">${n<=1?'<svg viewBox="0 0 24 24"><path d="M5 7h14M9 7V5h6v2M7 7l1 12h8l1-12"/></svg>':'−'}</button><span class="sn1">${n}</span><button class="sb1" data-a="+" aria-label="more">+</button>
 ${edit?'<button class="ed1" data-a="e">Details</button>':''}</div>${v.length>1?`<div class="vr">${v.map((p,k)=>`<button class="vc${p[2]===it.s?' on':''}" data-v="${k}">${esc(p[2]||'—')}<small>${eur(+p[1])}</small></button>`).join('')}</div>`:''}</div>`}
function stpClick(e){const st=e.target.closest('.stp');if(!st)return false;e.stopPropagation();const it=S.items[st.dataset.id];if(!it)return true;const a=e.target.closest('[data-a]'),v=e.target.closest('[data-v]');
 if(a){const t=a.dataset.a;if(t==='+')setQty(it,qOf(it)+1);else if(t==='-')setQty(it,qOf(it)-1);else{STP=null;openEd(it)}}
 if(v){const p=VARS(it.name)[+v.dataset.v];put({...it,p:p[1],s:p[2],l:p[3]});tap();refresh()}return true}
function refresh(){if(document.body.classList.contains('searching'))suggest();else render()}
const STAPLE=/ (halfvolle|volle|magere|houdbare|scharrel|vrije uitloop|volkoren|bruin|tarwe|mineraalwater|ongezouten|gezouten|langgraan|toiletpapier|keukenpapier)\b/;
const JUNK=/(croissant|spread|speculoos|ragout|bapao|miso|kruidnoot|kruidnoten|muffin|koffieroom|koffiewafel|mousse|blokken|broodje|ijsje|appelflap|stroopwafel|bladerdeeg|doekjes)|\b(chocoladepasta|digestive|hagelslag|rotsjes|pindarotsjes|biscuit|vlokken|flikken|repen|pasta|reep|maaltijd|stamppot|worst|mousse|zakjes|toiletblok|chocolade|choco|creme|crème|vochtig|bonbon|drop|koek|snoep|smaak|ijs|chips|toetje|pudding|dessert|mix|saus|poeder|wafel|reiniger|doekjes|spray|shake)\b/;
function search(v){const sy=CAT.syn;const terms=(sy[v]||v.split(' ').map(w=>sy[w]||w).join(' ')).split(' ').filter(Boolean),hits=[];
 const want=ruleCat(terms.join(' ')),wi=want?CAT.order.indexOf(want):-1;
 for(let i=0;i<IDX.length;i++){const t=IDX[i];let sc=0,ok=true;
  for(const w of terms){const k=t.indexOf(w);if(k<0){ok=false;break}const st=t[k-1]===' ',en=k+w.length===t.length||t[k+w.length]===' ';sc+=st&&en?14:st?5:1;if(t.endsWith(' '+w))sc+=8;if((t+' ').startsWith(' ah '+w+' ')||(t+' ').startsWith(' ah biologisch '+w+' '))sc+=9}
  if(!ok)continue;const p=CAT.p[i],wc=t.trim().split(' ').length;if(t.startsWith(' ah '))sc+=6;sc-=wc*1.8;if(wi>=0&&p[4]===wi)sc+=7;if(STAPLE.test(t))sc+=4;
  if(JUNK.test(t)&&!terms.some(w=>JUNK.test(' '+w+' ')))sc-=16;hits.push([sc,i])}
 hits.sort((a,b)=>b[0]-a[0]);const out=[],sn=new Set();for(const[,i]of hits){const p=CAT.p[i];if(sn.has(p[0]))continue;sn.add(p[0]);out.push({name:p[0],p:p[1],s:p[2],l:p[3],c:CAT.order[p[4]]});if(out.length>=12)break}return out}
function sitem(h,k){const it={...h,cat:h.c};const on=findOn(h.name);const nv=(BYN[h.name]||[]).length;
 return`<button class="si${on?' on':''}" data-k="${k}"><span class="em">${emo(it)}</span><span class="bd"><span class="nm">${esc(h.name)}</span><span class="sb">${[h.free?'Add as typed':'',on&&on.s?on.s:h.s,nv>1?nv+' sizes':'',(CATN[h.c]||'').replace(/^\S+ /,'')].filter(Boolean).map(esc).join(' · ')}</span></span><span class="pr">${h.p?eur(+(on&&on.p||h.p)):''}</span><span class="plus">${on?qOf(on):'+'}</span></button>`+(STP&&STP.k==='r'&&STP.key===h.name&&on?stpHTML(on):'')}
const cap=t=>t.charAt(0).toUpperCase()+t.slice(1);
function grp(title,items,off){return`<div class="sh">${title}</div><div class="gp">`+items.map((h,k)=>sitem(h,k+off)).reverse().join('')+'</div>'}
function suggest(){const raw=parse(q.value).name.trim(),v=norm(raw);let out=[],html='';
 if(!v){const onl=new Set(Object.values(S.items).filter(i=>!i.del&&!i.done).map(i=>norm(i.name)));out=Object.values(S.hist).filter(h=>!onl.has(norm(h.name))).sort((a,b)=>b.n-a.n).slice(0,14);
  SR=out;html=out.length?grp('Frequently bought',out,0):`<div class="hint"><div class="ill">🔎</div>Search in English or Dutch — “milk”, “kipfilet”, “toilet paper”.<br>Start with a number for quantity: “2 milk”.</div>`}
 else{const seen=new Set(),mine=[];for(const h of Object.values(S.hist).sort((a,b)=>b.n-a.n))if(norm(h.name).includes(v)&&mine.length<3){seen.add(norm(h.name));mine.push(h)}
  const prods=CAT&&v.length>1?search(v).filter(h=>!seen.has(norm(h.name))).slice(0,12):[];
  const exact=[...mine,...prods].some(h=>norm(h.name)===v);
  const free=exact?[]:[{name:cap(raw),c:catOf(raw),free:1}];
  SR=[...free,...mine,...prods];
  // DOM top->bottom: products (worst..best), yours, typed item nearest the bar
  html=(prods.length?grp('AH products',prods,free.length+mine.length):'')+(mine.length?grp('Your items',mine,free.length):'')+(free.length?grp(nlOf(raw)?'Your item · AH: '+esc(nlOf(raw)):'Your item',free,0):'')}
 sug.innerHTML=html;fit(true)}
let st;q.oninput=()=>{clearTimeout(st);st=setTimeout(suggest,60)};
sug.onclick=e=>{if(stpClick(e))return;const b=e.target.closest('[data-k]');if(!b)return;const k=+b.dataset.k,p=parse(q.value);
 const h=SR[k],on=findOn(h.name);if(on)setQty(on,qOf(on)+1);else{if(add((p.qty?p.qty+' ':'')+h.name,h.free?{c:h.c}:h)===false)return;tap()}STP={k:'r',key:h.name};suggest()};
$('#f').onsubmit=e=>{e.preventDefault();const v=q.value.trim();if(!v)return;const h=SR[0];if(h&&norm(h.name).includes(norm(parse(v).name))){const on=findOn(h.name);on?setQty(on,qOf(on)+1):add(h.name,h)}else add(v);tap();q.value='';STP=null;suggest()};
// --- edit sheet ---
let ed;$('#ec').innerHTML=CATS.map(([c,l])=>`<option value="${c}">${l}</option>`).join('');
function openEd(it){ed=it;$('#en').value=it.name;$('#eq').value=it.qty||'';$('#eo').value=it.note||'';$('#ec').value=it.cat;
 $('#elink').href=it.l?'https://www.ah.nl/producten/product/'+it.l:'https://www.ah.nl/zoeken?query='+encodeURIComponent(it.nl||it.name);
 $('#einfo').textContent=[it.s,it.p?eur(+it.p)+' each':'price estimated','added by '+(PEOPLE[it.by]?.n||'?')].filter(Boolean).join(' · ');$('#ed').classList.add('s')}
const closeEd=()=>$('#ed').classList.remove('s');$('#ed').onclick=e=>{if(e.target.id==='ed')closeEd()};$('#ecancel').onclick=closeEd;
$('#esave').onclick=()=>{const n=$('#en').value.trim()||ed.name,c=$('#ec').value;put({...ed,name:n,nl:n===ed.name?ed.nl:nlOf(n),...(n===ed.name?{}:{p:0,l:'',s:''}),qty:$('#eq').value.trim(),note:$('#eo').value.trim(),cat:c});if(S.hist[norm(n)]){S.hist[norm(n)].c=c;save()}closeEd()};
$('#edel').onclick=()=>{const old={...ed};put({...ed,del:true});closeEd();toast(ed.name+' deleted',[old])};
// --- who / store / shop mode ---
function setMe(w){S.me=w;save();$('#me').innerHTML=avatar(w?w[0]:'U');$('#who').classList.remove('s')}
document.querySelectorAll('[data-w]').forEach(b=>b.onclick=()=>{tap();setMe(b.dataset.w||null);toast(b.dataset.w?'This phone is now '+b.dataset.w:'This phone is now unnamed')});
let lp;$('#me').addEventListener('click',()=>$('#who').classList.add('s'));
$('#storeb').onclick=()=>{const i=(STORES.indexOf(S.store||STORES[0])+1)%STORES.length;S.store=STORES[i];save();render()};
$('#shopb').onclick=()=>{S.shop=!S.shop;save();tap();render();toast(S.shop?'Shopping mode on — big rows, ticked items hidden':'Shopping mode off')};
{const u=(new URLSearchParams(location.search).get('u')||'').toLowerCase();const M={punardeep:'Punardeep',aastha:'Aastha'};if(M[u]&&S.me!==M[u]){S.me=M[u];save()}}
$('#me').innerHTML=avatar(S.me?S.me[0]:'U');
// --- test hooks (?me=, ?add=, ?demo, ?sheet=, ?theme=) ---
{const u=new URLSearchParams(location.search);if(u.get('theme'))document.documentElement.dataset.theme=u.get('theme');if(u.get('me'))setMe(u.get('me'));if(u.get('kb')){KB=+u.get('kb');document.body.insertAdjacentHTML('beforeend',`<div style="position:fixed;left:0;right:0;bottom:0;height:${KB}px;background:#D1D4DA;z-index:50;display:grid;place-items:center;color:#777;font:15px -apple-system,system-ui">simulated iOS keyboard (${KB}px)</div>`)}
 if(u.has('demo')&&!Object.keys(S.items).length){const D=[['2','AH Halfvolle melk',1.79,'1,5 l','zuivel','P'],['','AH Bananen tros',1.35,'per tros','agf','A'],['','AH Scharrel kipfilet',3.59,'300 g','vlees','P'],['','AH Koriander',1.19,'15 g','agf','A'],['','AH Volkoren brood',2.19,'800 g','brood','P'],['6','AH Vrije uitloop eieren L',2.59,'6 stuks','zuivel','A'],['','AH Toiletpapier 3-laags',5.49,'12 rollen','huishoud','P'],['','AH Basmati rijst',2.49,'1 kg','pasta','A'],['','AH Griekse yoghurt',1.89,'1 kg','zuivel','P']];
  D[5][0]='';D.forEach(([qt,n,p,s,c,b],k)=>S.items['d'+k]={id:'d'+k,name:n,qty:qt,note:k==2?'Free range if possible':'',nl:'',p,s,l:'',cat:c,by:b,done:k==1||k==4,del:false,t:Date.now()-k*1000});save()}
 if(u.get('add'))setTimeout(()=>add(u.get('add')),50);if(u.has('q'))setTimeout(()=>{q.value=u.get('q');searching(true);suggest();fit(true);if(u.has('tap')){for(let t=0;t<+u.get('tap');t++)sug.querySelector('[data-k="'+SR.findIndex(h=>!h.free)+'"]').click()}},800);if(u.has('row'))setTimeout(()=>{LST.querySelector('.row[data-id="'+u.get('row')+'"] .bd').click()},300)}
render();if(!location.search.includes('nosync'))connect();document.addEventListener('visibilitychange',()=>{if(!document.hidden)sync()});
if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js');
