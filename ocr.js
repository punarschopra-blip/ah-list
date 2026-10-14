// ===== Photo to list: in-browser OCR (Tesseract.js, lazy) + Live Text scan sheet =====
Object.assign(ES,{'vanilla essence':'vanille aroma','vanilla extract':'vanille aroma',vanilla:'vanille',essence:'aroma','esencia de vainilla':'vanille aroma',vainilla:'vanille',miel:'honing',aceite:'olie',honey:'honing',oil:'zonnebloemolie',butter:'roomboter'});
function lev(a,b){if(a===b)return 0;const m=a.length,n=b.length;if(!m||!n)return m||n;let p=Array.from({length:n+1},(_,j)=>j);for(let i=1;i<=m;i++){const c=[i];for(let j=1;j<=n;j++)c[j]=Math.min(p[j]+1,c[j-1]+1,p[j-1]+(a[i-1]===b[j-1]?0:1));p=c}return p[n]}
let VOC=null;function vocab(){if(VOC)return VOC;const f={};const addw=(w,k=5)=>{if(w.length>2&&/^[a-z-]+$/.test(w))f[w]=(f[w]||0)+k};
 for(const k of Object.keys(Object.assign({},CAT?CAT.syn:{},ES)))k.split(/[ _]/).forEach(w=>addw(w,50));for(const v of Object.values(Object.assign({},CAT?CAT.syn:{},ES)))v.split(' ').forEach(w=>addw(w,30));
 if(CAT)for(const p of CAT.p)nrm(p[0]).split(' ').forEach(w=>addw(w,1));VOC=Object.entries(f).filter(([w,c])=>c>=3).map(([w,c])=>[w,c]);return VOC}
function fixWord(w){const V=vocab();if(w.length<3||V.some(([x])=>x===w))return w;let best=w,bd=99,bc=0;const tol=w.length<=4?1:w.length<=7?2:3;
 for(const[x,c]of V){if(Math.abs(x.length-w.length)>tol)continue;const d=lev(w,x);if(d<bd||(d===bd&&c>bc)){bd=d;best=x;bc=c}}return bd<=tol?best:w}
function cleanOCR(txt){return txt.split(/\n+/).map(l=>nrm(l).replace(/[^a-z0-9 ,.'-]/g,' ').replace(/\s+/g,' ').trim()).filter(l=>l.replace(/[^a-z]/g,'').length>=2)
 .map(l=>l.split(' ').map(w=>/^\d/.test(w)?w:fixWord(w.replace(/[^a-z-]/g,''))).filter(Boolean).join(' '))}
window.cleanOCR=cleanOCR;
function loadScript(src){return new Promise((ok,no)=>{const s=document.createElement('script');s.src=src;s.onload=ok;s.onerror=no;document.head.appendChild(s)})}
async function prep(file){const img=await createImageBitmap(file,{imageOrientation:'from-image'}).catch(()=>createImageBitmap(file));const M=1400,sc=Math.min(1,M/Math.max(img.width,img.height));
 const W=img.width*sc|0,H=img.height*sc|0,c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');x.drawImage(img,0,0,W,H);const d=x.getImageData(0,0,W,H),a=d.data;
 const g=new Float32Array(W*H);for(let i=0,j=0;i<a.length;i+=4,j++)g[j]=.299*a[i]+.587*a[i+1]+.114*a[i+2];
 // grayscale contrast-stretched copy
 const gc=document.createElement('canvas');gc.width=W;gc.height=H;const gx=gc.getContext('2d'),gd=gx.createImageData(W,H);
 const srt=Float32Array.from(g).sort(),lo=srt[(g.length*.02)|0],hi=srt[(g.length*.98)|0],sp=Math.max(1,hi-lo);
 for(let j=0;j<g.length;j++){const v=Math.max(0,Math.min(255,(g[j]-lo)*255/sp));gd.data[j*4]=gd.data[j*4+1]=gd.data[j*4+2]=v;gd.data[j*4+3]=255}gx.putImageData(gd,0,0);
 // Bradley adaptive threshold (handles glare / uneven light)
 const I=new Float64Array((W+1)*(H+1));for(let y=0;y<H;y++){let r=0;for(let xx=0;xx<W;xx++){r+=g[y*W+xx];I[(y+1)*(W+1)+xx+1]=I[y*(W+1)+xx+1]+r}}
 const s2=Math.max(8,(Math.max(W,H)/12)|0),T=.18;let dark=0;
 for(let y=0;y<H;y++)for(let xx=0;xx<W;xx++){const x1=Math.max(0,xx-s2),x2=Math.min(W-1,xx+s2),y1=Math.max(0,y-s2),y2=Math.min(H-1,y+s2),cnt=(x2-x1+1)*(y2-y1+1);
  const sum=I[(y2+1)*(W+1)+x2+1]-I[y1*(W+1)+x2+1]-I[(y2+1)*(W+1)+x1]+I[y1*(W+1)+x1];const v=g[y*W+xx]*cnt<sum*(1-T)?0:255;const k=(y*W+xx)*4;a[k]=a[k+1]=a[k+2]=v;if(!v)dark++}
 if(dark>W*H/2)for(let k=0;k<a.length;k+=4)a[k]=a[k+1]=a[k+2]=255-a[k];
 x.putImageData(d,0,0);return [c,gc]}
let worker=null;
async function ocrFile(file){toast('Reading photo… (first time downloads ~10 MB OCR data)');
 if(!window.Tesseract)await loadScript('https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js');
 if(!worker){worker=await Tesseract.createWorker(['eng','nld','spa'],1);}
 const cs=await prep(file);let best=null;
 for(const cv of cs){for(const psm of ['6','4']){await worker.setParameters({tessedit_pageseg_mode:psm});const {data}=await worker.recognize(cv);
  const good=(data.lines||[]).filter(l=>l.confidence>=35&&/[a-z]{2}/i.test(l.text));const sc=good.reduce((s,l)=>s+l.confidence*l.text.replace(/[^a-z]/gi,'').length,0);
  if(!best||sc>best.sc)best={sc,text:good.map(l=>l.text).join('\n'),raw:data.text,conf:data.confidence};if(best.sc>0&&data.confidence>80)break}if(best&&best.conf>80)break}
 window.LAST_OCR=best.raw;const lines=cleanOCR(best.text);return {raw:best.raw,kept:best.text,lines,conf:best.conf}}
window.ocrFile=ocrFile;
async function handleImage(file){if(!file)return;try{const r=await ocrFile(file);const items=r.lines.flatMap(l=>parseList(l));
 if(!items.length){toast('Couldn’t read any items — try Scan Text instead');return openScan()}openNlp(items);$('#nlpt').textContent=`${items.length} items from photo`}catch(e){console.error(e);toast('OCR failed — try Scan Text instead');openScan()}}
// camera button → small chooser
$('#cam').onclick=()=>{tap();$('#camsheet').classList.add('s')};
$('#camsheet').onclick=e=>{if(e.target.id==='camsheet')$('#camsheet').classList.remove('s')};
$('#camphoto').onclick=()=>{$('#camsheet').classList.remove('s');$('#camfile').click()};
$('#camfile').onchange=e=>{handleImage(e.target.files[0]);e.target.value=''};
$('#camscan').onclick=()=>{$('#camsheet').classList.remove('s');openScan()};
function openScan(){$('#scan').classList.add('s');$('#scant').value='';setTimeout(()=>$('#scant').focus(),300)}
$('#scanc').onclick=()=>$('#scan').classList.remove('s');
$('#scango').onclick=()=>{const t=$('#scant').value;const it=t.split(/\n+/).flatMap(l=>parseList(l));$('#scan').classList.remove('s');if(it.length)openNlp(it);else toast('Nothing to add')};
// multi-line paste / Live Text into the single-line search field
q.addEventListener('beforeinput',e=>{const t=(e.dataTransfer&&e.dataTransfer.getData('text/plain'))||e.data||'';if(/\n/.test(t)){e.preventDefault();const it=t.split(/\n+/).flatMap(l=>parseList(l));if(it.length)openNlp(it)}});
q.addEventListener('paste',e=>{const t=e.clipboardData&&e.clipboardData.getData('text');if(t&&/\n/.test(t)){e.preventDefault();e.stopImmediatePropagation();const it=t.split(/\n+/).flatMap(l=>parseList(l));if(it.length)openNlp(it)}},true);
// test hook: ?ocr=url
{const u=new URLSearchParams(location.search);if(u.get('ocr'))setTimeout(async()=>{const b=await (await fetch(u.get('ocr'))).blob();const r=await ocrFile(b);document.title='OCR:'+JSON.stringify(r);
 document.querySelector('#nlp .pan').style.transition='none';handleImage(b)},1200)}
