// ionenspiegel V14 service worker
const CACHE_NAME='ionenspiegel-v19';
const CORE_ASSETS=['./','./index.html','./style.css','./script.js','./manifest.json','./icon-192.png','./icon-512.png','./screenshot-home.jpg','./screenshot-match.jpg'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(CORE_ASSETS)).catch(()=>{}));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))));self.clients.claim()});
function tell(type){self.clients.matchAll({type:'window',includeUncontrolled:true}).then(cs=>cs.forEach(c=>c.postMessage({type})))}
self.addEventListener('fetch',e=>{const r=e.request,u=new URL(r.url);if(r.method!=='GET'||u.origin!==self.location.origin)return;if(r.mode==='navigate'||r.destination==='document'){e.respondWith(fetch(r,{cache:'no-store'}).then(res=>{caches.open(CACHE_NAME).then(c=>c.put('./index.html',res.clone())).catch(()=>{});tell('ONLINE');return res}).catch(()=>{tell('OFFLINE');return caches.match('./index.html')}));return}e.respondWith(caches.match(r).then(cached=>cached||fetch(r).then(res=>{caches.open(CACHE_NAME).then(c=>c.put(r,res.clone())).catch(()=>{});return res}).catch(()=>{tell('OFFLINE');throw new Error('offline')})))});
