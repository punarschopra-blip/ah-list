# Builds catalog.json from checkjebon (MIT) daily AH data. Run: python3 tools/build.py
import json,urllib.request,unicodedata,re
R=json.load(open('tools/rules.json'))
def norm(s):return unicodedata.normalize('NFD',s.lower()).encode('ascii','ignore').decode()
def cat(n):
  t=' '+norm(n)+' '
  for c,kws in R['rules']:
    for k in kws:
      k=norm(k)
      if (' '+k) in t or (len(k)>3 and k in t):return c
  return 'overig'
d=json.load(urllib.request.urlopen('https://raw.githubusercontent.com/supermarkt/checkjebon/main/data/supermarkets.json'))
ah=[s for s in d if s['n']=='ah'][0]['d']
O=R['order'];out=[];seen=set()
for p in ah:
  n=p['n'].strip()
  k=(n,p.get('s',''))
  if not n or k in seen:continue
  seen.add(k);m=re.match(r'(wi\d+)',p.get('l',''))
  out.append([n,p.get('p'),p.get('s',''),p.get('l',''),O.index(cat(n))])
json.dump({'order':O,'rules':R['rules'],'syn':R['syn'],'p':out},open('catalog.json','w'),ensure_ascii=False,separators=(',',':'))
from collections import Counter;print(len(out),Counter(O[x[4]] for x in out))
