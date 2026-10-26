/* Service worker cho Trợ thủ Tiến Lên: đặt cạnh index.html (cùng thư mục) trên https.
   Lưu sẵn toàn bộ app lúc cài để mở lại không cần mạng. Có bản mới thì đổi số V bên dưới
   (trang ~5MB nên không tải lại mỗi lần mở). */
const V='tro-thu-tien-len-v2';
const CORE=['./','./index.html'];
const MORE=['./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-maskable-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(async c=>{
 await c.addAll(CORE);                                   /* thiếu file lõi thì báo lỗi cài đặt */
 await Promise.all(MORE.map(u=>c.add(u).catch(()=>{})))   /* icon/manifest lỗi lặt vặt không chặn cài */
}).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 const q=e.request;if(q.method!=='GET'||new URL(q.url).origin!==location.origin)return;
 e.respondWith(caches.match(q,{ignoreSearch:true}).then(hit=>hit||fetch(q).then(r=>{
   if(r.ok)caches.open(V).then(c=>c.put(q,r.clone()));return r
  }).catch(()=>q.mode==='navigate'?caches.match('./index.html'):Response.error())))});
