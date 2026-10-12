const CATS=[['agf','🥦 Fruit & veg'],['brood','🥖 Bakery'],['vlees','🥩 Meat, fish & veggie'],['kaas','🧀 Cheese & cold cuts'],['zuivel','🥛 Dairy & eggs'],['pasta','🍝 Pasta, rice & world foods'],['conserven','🥫 Tins, soups & sauces'],['ontbijt','🥣 Breakfast & spreads'],['snoep','🍫 Biscuits, sweets & crisps'],['drank','🧃 Drinks'],['diepvries','🧊 Frozen'],['drogist','🧴 Toiletries & pharmacy'],['huishoud','🧽 Household'],['overig','🛒 Other']];
const CATN=Object.fromEntries(CATS);
// "nl / en" synonyms -> category
const DICT={agf:'appels apple,bananen banana,peren pear,sinaasappels orange,mandarijnen,citroen lemon,limoen lime,druiven grapes,aardbeien strawberries,blauwe bessen blueberries,frambozen raspberries,mango,ananas pineapple,kiwi,avocado,watermeloen watermelon,tomaten tomato,komkommer cucumber,paprika bell pepper,ui onion,rode ui red onion,knoflook garlic,gember ginger,aardappelen potatoes,zoete aardappel sweet potato,wortel carrots,broccoli,bloemkool cauliflower,spinazie spinach,sla lettuce,rucola,courgette zucchini,aubergine eggplant,champignons mushrooms,prei leek,sperziebonen green beans,maïs corn,koriander coriander,peterselie parsley,basilicum basil,munt mint,spitskool,boerenkool kale,groene chili chili,lente-ui spring onion,taugé,salademix salad',
brood:'brood bread,volkoren brood,croissants,stokbrood baguette,krentenbollen,pistolets,wraps tortilla,naan,beschuiten,pita,bagels,roti',
vlees:'kipfilet chicken breast,kippendijen chicken thighs,gehakt mince,rundergehakt beef mince,biefstuk steak,varkenshaas pork,spekjes bacon,worst sausage,zalm salmon,garnalen shrimp,kabeljauw cod,tonijn tuna steak,tofu,vegaburger veggie burger,vegetarische stukjes,falafel,lamsvlees lamb,paneer',
kaas:'kaas cheese,jonge kaas,oude kaas,geraspte kaas grated cheese,mozzarella,feta,parmezaan parmesan,brie,halloumi,ham,kipfilet beleg,salami,roomkaas cream cheese,hummus',
zuivel:'melk milk,halfvolle melk,havermelk oat milk,yoghurt,griekse yoghurt greek yogurt,kwark quark,boter butter,roomboter,eieren eggs,slagroom cream,kookroom cooking cream,crème fraîche,vla,karnemelk buttermilk,margarine',
pasta:'pasta,spaghetti,penne,rijst rice,basmati rijst,noedels noodles,couscous,quinoa,linzen lentils,kikkererwten chickpeas,kokosmelk coconut milk,currypasta curry paste,sojasaus soy sauce,taco shells,meel flour,suiker sugar,olijfolie olive oil,zonnebloemolie oil,azijn vinegar,zout salt,peper pepper,kruiden spices,garam masala,komijn cumin,kurkuma turmeric',
conserven:'tomatenblokjes chopped tomatoes,passata,tomatenpuree tomato paste,bonen beans,kidneybonen,mais blik,soep soup,bouillon stock,pesto,ketchup,mayonaise mayo,mosterd mustard,sambal,pastasaus pasta sauce,tonijn blik tuna',
ontbijt:'havermout oats,cornflakes cereal,muesli,granola,pindakaas peanut butter,jam,hagelslag sprinkles,honing honey,nutella,koffie coffee,koffiebonen coffee beans,thee tea,koffiecups coffee pods',
snoep:'chips crisps,koekjes cookies,chocolade chocolate,noten nuts,stroopwafels,snoep candy,popcorn,crackers,rijstwafels rice cakes,ontbijtkoek',
drank:'water,bruiswater sparkling water,cola,sinaasappelsap orange juice,appelsap apple juice,bier beer,wijn wine,rode wijn red wine,witte wijn white wine,frisdrank soda,ice tea,energy drink',
diepvries:'ijs ice cream,diepvriespizza pizza,diepvriesgroente frozen vegetables,erwten peas,friet fries,spinazie diepvries,diepvriesfruit frozen fruit,ijsblokjes ice',
drogist:'tandpasta toothpaste,tandenborstel toothbrush,shampoo,conditioner,douchegel shower gel,deodorant,scheermesjes razors,zeep soap,handzeep hand soap,maandverband pads,tampons,paracetamol,pleisters plasters,zonnebrand sunscreen,wattenschijfjes,bodylotion',
huishoud:'wc-papier toilet paper,keukenrol paper towels,afwasmiddel dish soap,vaatwastabletten dishwasher tablets,wasmiddel detergent,wasverzachter softener,vuilniszakken bin bags,schoonmaakmiddel cleaner,sponsjes sponges,aluminiumfolie foil,vershoudfolie cling film,bakpapier baking paper,batterijen batteries,kaarsen candles'};
const ADJ=/^(rode|witte|halfvolle|griekse|zoete|blauwe|groene|jonge|oude|geraspte|volkoren|vegetarische|kipfilet|spinazie|tonijn|mais|basmati)$/;
const LEX=[];for(const[c,s]of Object.entries(DICT))for(const e of s.split(',')){const w=e.trim().split(' ');const k=w.length>1&&ADJ.test(w[0])?2:1;const nl=w.slice(0,k).join(' '),en=w.slice(k).join(' ');LEX.push({nl,en,all:e.trim(),c,disp:(en||nl).replace(/^./,m=>m.toUpperCase())})}
const norm=s=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();
function nlOf(name){const n=norm(name);const x=LEX.find(x=>norm(x.disp)===n||norm(x.nl)===n||norm(x.en)===n);return x&&norm(x.nl)!==n?x.nl:''}
function lexOf(name){const n=norm(name);return LEX.find(x=>norm(x.disp)===n||norm(x.nl)===n||norm(x.en)===n)}
function catOf(name){const n=norm(name);const h=S.hist[n];if(h&&h.c)return h.c;const ex=lexOf(name);if(ex)return ex.c;let best=null,bl=0;for(const x of LEX){for(const t of norm(x.all).split(/\s+/).concat([norm(x.nl),norm(x.en)])){if(t.length>2&&(n===t||n.includes(t)||t.includes(n)&&n.length>3)&&t.length>bl){best=x.c;bl=t.length}}}return best||'overig'}

// ---- estimates (NOT live AH data: AH API is bot-protected & has no CORS) ----
const PRICE={melk:1.29,havermelk:2.29,yoghurt:1.59,kwark:1.79,boter:2.99,roomboter:2.99,eieren:3.29,kaas:5.49,'geraspte kaas':2.49,mozzarella:1.19,feta:2.19,brood:2.39,croissants:2.49,stokbrood:1.39,wraps:1.99,bananen:1.89,appels:2.49,tomaten:1.99,komkommer:0.89,paprika:1.79,ui:1.19,knoflook:0.99,aardappelen:2.79,avocado:1.39,broccoli:1.49,spinazie:1.99,kipfilet:6.49,gehakt:4.49,zalm:5.99,tofu:2.29,pasta:1.39,spaghetti:1.39,rijst:2.49,'basmati rijst':3.49,tomatenblokjes:0.79,passata:1.29,koffie:6.99,thee:2.49,pindakaas:2.99,hagelslag:2.79,chips:1.99,chocolade:1.99,water:0.89,cola:2.19,bier:6.99,wijn:6.99,'wc-papier':5.99,keukenrol:2.99,afwasmiddel:1.99,vaatwastabletten:6.99,wasmiddel:9.99,tandpasta:2.49,shampoo:3.49};
const CATP={agf:1.79,brood:2.19,vlees:4.99,kaas:3.49,zuivel:1.69,pasta:1.89,conserven:1.49,ontbijt:3.29,snoep:2.09,drank:2.29,diepvries:3.49,drogist:3.99,huishoud:3.99,overig:2.50};
const EMO={melk:'🥛',havermelk:'🥛',yoghurt:'🥣',kaas:'🧀',eieren:'🥚',boter:'🧈',brood:'🍞',croissants:'🥐',stokbrood:'🥖',bananen:'🍌',appels:'🍎',peren:'🍐',citroen:'🍋',druiven:'🍇',aardbeien:'🍓',tomaten:'🍅',komkommer:'🥒',paprika:'🫑',ui:'🧅',knoflook:'🧄',aardappelen:'🥔',wortel:'🥕',broccoli:'🥦',avocado:'🥑',mango:'🥭',ananas:'🍍',champignons:'🍄',kipfilet:'🍗',gehakt:'🥩',biefstuk:'🥩',zalm:'🐟',garnalen:'🦐',pasta:'🍝',spaghetti:'🍝',rijst:'🍚',koffie:'☕',thee:'🍵',honing:'🍯',chips:'🥔',chocolade:'🍫',koekjes:'🍪',water:'💧',bier:'🍺',wijn:'🍷',cola:'🥤',ijs:'🍨','wc-papier':'🧻',keukenrol:'🧻',pizza:'🍕'};
const CATE={agf:'🥬',brood:'🍞',vlees:'🥩',kaas:'🧀',zuivel:'🥛',pasta:'🍝',conserven:'🥫',ontbijt:'🥣',snoep:'🍫',drank:'🧃',diepvries:'🧊',drogist:'🧴',huishoud:'🧽',overig:'🛒'};
function key(n){n=norm(n);if(PRICE[n]||EMO[n])return n;const k=Object.keys({...PRICE,...EMO}).sort((a,b)=>b.length-a.length).find(k=>n.includes(k));return k||n}
function qn(q){const m=String(q||'').match(/^(\d+[.,]?\d*)\s*(x|st|pak|zak)?$/i);return m?parseFloat(m[1].replace(',','.')):1}
const price=i=>(PRICE[key(i.nl||i.name)]||CATP[i.cat]||2.5)*qn(i.qty);
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
function learn(it){if(it.del)return;const n=norm(it.name);const h=S.hist[n]||{n:0};S.hist[n]={name:it.name,c:it.cat,n:h.n+(h.last===it.id?0:1),last:it.id}}
function put(it){it.t=Date.now();S.items[it.id]=it;learn(it);save();pub();render()}
function parse(txt){let m=txt.trim().match(/^(\d+[.,]?\d*\s?(x|kg|g|l|ml|st|pak|zak)?)\s+(.+)$/i)||txt.trim().match(/^(.+?)\s+(\d+[.,]?\d*\s?(x|kg|g|l|ml|st)?)$/i);
if(!m)return{name:txt.trim(),qty:''};return /^\d/.test(m[1])?{name:m[3],qty:m[1]}:{name:m[1],qty:m[2]}}
function add(txt){if(!txt.trim())return;const p=parse(txt);const lx=lexOf(p.name);const name=lx?lx.disp:p.name.charAt(0).toUpperCase()+p.name.slice(1);
const ex=Object.values(S.items).find(i=>!i.del&&!i.done&&norm(i.name)===norm(name));if(ex){toast(name+' is already on the list');return}
put({id:Date.now().toString(36)+Math.random().toString(36).slice(2,6),name,qty:p.qty,note:'',nl:nlOf(name),cat:catOf(name),by:(S.me||"P")[0],done:false,del:false})}
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
function row(i){return`<div class="item ${i.done?'done':''}" data-id="${i.id}"><div class="ck">${i.done?'✓':''}</div><div class="pic">${emo(i)}</div><div class="bd"><div class="nm">${i.qty?`<span class="q">${esc(i.qty)}</span>`:''}${esc(i.name)}</div><div class="meta">${i.nl?'<i>AH: '+esc(i.nl)+'</i> · ':''}${i.note?esc(i.note)+' · ':''}~€${price(i).toFixed(2)} · <a href="https://www.ah.nl/zoeken?query=${encodeURIComponent(i.nl||i.name)}" target="_blank" onclick="event.stopPropagation()">ah.nl</a></div></div><span class="who ${i.by}">${i.by==='P'?'Punardeep':'Aastha'}</span></div>`}
$('#list').addEventListener('click',e=>{const r=e.target.closest('.item');if(!r)return;const it=S.items[r.dataset.id];
if(e.target.closest('.ck')||e.target.closest('.nm')&&false){}
if(e.target.closest('.bd')&&!e.target.closest('.ck')&&!press){return openEd(it)}
const old={...it};put({...it,done:!it.done});if(navigator.vibrate)navigator.vibrate(10);toast(it.done?'':`${it.name} ticked off`,[old])});
let press=false;
$('#chips').onclick=e=>{const b=e.target.closest('.chip');if(b)add(b.dataset.n)};
$('#clr').onclick=()=>{const d=Object.values(S.items).filter(i=>i.done&&!i.del);const old=d.map(i=>({...i}));d.forEach(i=>put({...i,del:true}));toast(d.length+' items cleared',old)};
// autocomplete
const q=$('#q'),sug=$('#sug');
function suggest(){const v=norm(q.value);if(v.length<1){sug.style.display='none';return}const seen=new Set(),out=[];
for(const h of Object.values(S.hist).sort((a,b)=>b.n-a.n))if(norm(h.name).includes(v)&&!seen.has(norm(h.name))){seen.add(norm(h.name));out.push([h.name,h.c,'★'])}
for(const x of LEX)if(norm(x.all).split(' ').some(w=>w.startsWith(v))&&!seen.has(norm(x.disp))){seen.add(norm(x.disp));out.push([x.disp,x.c,'',norm(x.nl)!==norm(x.disp)?'AH: '+x.nl:''])}
const r=out.slice(0,6);sug.innerHTML=r.map(([n,c,s,en])=>`<div data-n="${esc(n)}"><span>${s} ${esc(n)}${en?` <small>· ${esc(en)}</small>`:''}</span><small>${CATN[c].split(' ')[0]}</small></div>`).join('');sug.style.display=r.length?'block':'none'}
q.oninput=suggest;sug.addEventListener('mousedown',e=>e.preventDefault());
sug.onclick=e=>{const d=e.target.closest('[data-n]');if(!d)return;const p=parse(q.value);add((p.qty&&/^\d/.test(q.value)?p.qty+' ':'')+d.dataset.n);q.value='';sug.style.display='none';q.focus()};
$('#f').onsubmit=e=>{e.preventDefault();add(q.value);q.value='';sug.style.display='none'};q.onblur=()=>setTimeout(()=>sug.style.display='none',100);
// editor
let cur;$('#ec').innerHTML=CATS.map(([c,l])=>`<option value="${c}">${l}</option>`).join('');
function openEd(it){cur=it;$('#en').value=it.name;$('#eq').value=it.qty||'';$('#eo').value=it.note||'';$('#ec').value=it.cat;$('#ed').classList.add('s')}
$('#ed').onclick=e=>{if(e.target.id==='ed')$('#ed').classList.remove('s')};
$('#esave').onclick=()=>{const n=$('#en').value.trim()||cur.name;const c=$('#ec').value;put({...cur,name:n,nl:n===cur.name?cur.nl:nlOf(n),qty:$('#eq').value.trim(),note:$('#eo').value.trim(),cat:c});S.hist[norm(n)]&&(S.hist[norm(n)].c=c,save());$('#ed').classList.remove('s')};
$('#edel').onclick=()=>{const old={...cur};put({...cur,del:true});$('#ed').classList.remove('s');toast(cur.name+' removed',[old])};
// who
function setMe(w){S.me=w;save();$('#me').textContent=w;$('#who').classList.remove('s')}
document.querySelectorAll('[data-w]').forEach(b=>b.onclick=()=>setMe(b.dataset.w));$('#me').onclick=()=>$('#who').classList.add('s');
if(S.me)$('#me').textContent=S.me;else $('#who').classList.add('s');
$('#store').innerHTML=STORES.map(x=>`<option>${x}</option>`).join('');$('#store').value=S.store||STORES[0];$('#store').onchange=e=>{S.store=e.target.value;save();render()};
{const u=new URLSearchParams(location.search);if(u.get('me'))setMe(u.get('me'));if(u.get('add'))setTimeout(()=>add(u.get('add')),50)}
render();if(!location.search.includes("nosync"))connect();document.addEventListener('visibilitychange',()=>{if(!document.hidden)sync()});
if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js');
