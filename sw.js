// İonenSpiegel V53 service worker
const CACHE_NAME='ionenspiegel-v53';
self.addEventListener('install',e=>e.waitUntil(self.skipWaiting()));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=='GET'||u.origin!==self.location.origin)return;
  const fresh=r.mode==='navigate'||r.destination==='document'||['script','style','json'].includes(r.destination)||u.pathname.endsWith('.json')||u.pathname.endsWith('.html');
  if(fresh){
    e.respondWith(fetch(r,{cache:'no-store'}).then(res=>{const c=res.clone();caches.open(CACHE_NAME).then(x=>x.put(r,c));return res}).catch(()=>caches.match(r).then(x=>x||caches.match('./index.html'))));
    return;
  }
  e.respondWith(caches.match(r).then(c=>c||fetch(r).then(res=>{const x=res.clone();caches.open(CACHE_NAME).then(k=>k.put(r,x));return res})));
});
