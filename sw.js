/* Service worker cho Trợ thủ Tiến Lên: đặt cạnh file HTML (cùng thư mục) trên https để chạy offline.
   Chiến lược: có cache thì trả ngay, đồng thời tải bản mới ngầm cho lần mở sau. */
const C='tro-thu-tien-len-v1';
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(clients.claim()));
self.addEventListener('fetch',e=>{
 const q=e.request;if(q.method!='GET'||new URL(q.url).origin!=location.origin)return;
 e.respondWith(caches.open(C).then(async c=>{
  const hit=await c.match(q,{ignoreSearch:true});
  const net=fetch(q).then(r=>{if(r.ok)c.put(q,r.clone());return r}).catch(()=>hit);
  return hit||net}))});
