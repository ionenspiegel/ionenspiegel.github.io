/* İonenSpiegel V45 merkezi yapılandırma */
const COMMUNITY_API='https://script.google.com/macros/s/AKfycbxoTMojRbXgNWBkFqSvYXULBRkT1C30nOZdh4luZmLqe_FZ55U3Vv1O2CExgoumeaFy_Q/exec';
const REQUEST_TIMEOUT=7000;
async function fetchWithTimeout(input,options={}){const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),options.timeout||REQUEST_TIMEOUT);try{return await fetch(input,{...options,signal:controller.signal})}finally{clearTimeout(timer)}}
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const toast=(msg)=>{const t=$('#toast');if(!t)return;t.textContent=msg;t.classList.add('show');clearTimeout(window._toast);window._toast=setTimeout(()=>t.classList.remove('show'),2200)};

/* ---------- APP STATE ---------- */
const STORE={theme:'ionenspiegel-theme',favorite:'ionenspiegel-favorite-team',saved:'ionenspiegel-saved-news'};
const teamStyles={
  'Fenerbahçe':'fenerbahce','Galatasaray':'galatasaray','Beşiktaş':'besiktas','Trabzonspor':'trabzonspor','Konyaspor':'konyaspor','Çorum FK':'corum-fk','Arca Çorum FK':'corum-fk','Gaziantep FK':'gaziantep-fk','Göztepe':'goztepe','Kocaelispor':'kocaelispor','Samsunspor':'samsunspor','Gençlerbirliği':'genclerbirligi','Amed Sportif Faaliyetler':'amed-sportif-faaliyetler','Kasımpaşa':'kasimpasa','Çaykur Rizespor':'caykur-rizespor','Corendon Alanyaspor':'alanyaspor','Alanyaspor':'alanyaspor','İstanbul Başakşehir':'basaksehir','Başakşehir':'basaksehir','Erzurumspor FK':'erzurumspor-fk','Eyüpspor':'eyupspor'
};
const allTeams=['Fenerbahçe','Galatasaray','Beşiktaş','Trabzonspor','Amed Sportif Faaliyetler','Kasımpaşa','Çaykur Rizespor','Kocaelispor','Gaziantep FK','Corendon Alanyaspor','Arca Çorum FK','Gençlerbirliği','İstanbul Başakşehir','Samsunspor','Erzurumspor FK','TÜMOSAN Konyaspor','Eyüpspor','Göztepe'];

function getSaved(){try{return JSON.parse(localStorage.getItem(STORE.saved)||'[]')}catch(e){return []}}
function setSaved(v){localStorage.setItem(STORE.saved,JSON.stringify(v))}
function currentFavorite(){return localStorage.getItem(STORE.favorite)||''}

/* ---------- DRAWER ---------- */
const drawer=$('#drawer'), backdrop=$('#drawerBackdrop');
function openDrawer(){drawer?.classList.add('open');backdrop?.classList.add('show');drawer?.setAttribute('aria-hidden','false')}
function closeDrawer(){drawer?.classList.remove('open');backdrop?.classList.remove('show');drawer?.setAttribute('aria-hidden','true')}
$('#menuBtn')?.addEventListener('click',openDrawer);$('#mobileMenu')?.addEventListener('click',openDrawer);$('#drawerClose')?.addEventListener('click',closeDrawer);backdrop?.addEventListener('click',closeDrawer);
$$('.drawer-link[href^="#"]').forEach(a=>a.addEventListener('click',closeDrawer));
$$('.accordion-btn').forEach(btn=>btn.addEventListener('click',()=>{btn.nextElementSibling.classList.toggle('open');btn.querySelector('span').textContent=btn.nextElementSibling.classList.contains('open')?'⌃':'⌄'}));

/* ---------- MODALS / SEARCH ---------- */
const searchModal=$('#searchModal');
$('#searchOpen')?.addEventListener('click',()=>{searchModal?.classList.add('show');setTimeout(()=>$('#globalSearch')?.focus(),50)});
$$('[data-close-modal]').forEach(b=>b.addEventListener('click',()=>b.closest('.modal-backdrop')?.classList.remove('show')));
$('#loginBtn')?.addEventListener('click',()=>$('#loginModal')?.classList.add('show'));
$$('.modal-backdrop').forEach(m=>m.addEventListener('click',e=>{if(e.target===m)m.classList.remove('show')}));
function globalSearch(){const q=($('#globalSearch')?.value||'').trim().toLowerCase(),box=$('#globalResults');if(!box)return;if(!q){box.innerHTML='';return}const rows=$$('.news-row,.transfer-grid article,.euro-card');const hits=rows.filter(x=>x.innerText.toLowerCase().includes(q));box.innerHTML=hits.length?hits.map(x=>`<div class="search-hit"><b>${$('h3',x)?.innerText||$('b',x)?.innerText||'Haber'}</b><small>${x.innerText.slice(0,180)}</small></div>`).join(''):'<p>Sonuç bulunamadı.</p>'}
$('#globalSearchBtn')?.addEventListener('click',globalSearch);$('#globalSearch')?.addEventListener('keydown',e=>{if(e.key==='Enter')globalSearch()});
$$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const target=$(a.getAttribute('href'));if(target){e.preventDefault();target.scrollIntoView({behavior:'smooth',block:'start'})}}));
$$('[data-scroll]').forEach(b=>b.addEventListener('click',()=>$(b.dataset.scroll)?.scrollIntoView({behavior:'smooth'})));

/* ---------- FAVORITE TEAM + PERSONALIZATION ---------- */
const setupModal=$('#setupModal'), teamPicker=$('#teamPicker');
let selectedTeam=currentFavorite();
function slugTeam(team){return teamStyles[team]||team.toLowerCase().replaceAll('ı','i').replaceAll('ğ','g').replaceAll('ş','s').replaceAll('ü','u').replaceAll('ö','o').replaceAll('ç','c').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
function applyFavoriteTeam(team){document.body.classList.forEach(c=>{if(c.startsWith('team-'))document.body.classList.remove(c)});if(team){document.body.classList.add('team-'+slugTeam(team));const label=$('#editionLabel');if(label)label.textContent=team.toUpperCase();}else{const label=$('#editionLabel');if(label)label.textContent='SPOR'};selectedTeam=team||'';localStorage.setItem(STORE.favorite,selectedTeam);sortNewsByFavorite()}
function renderTeamPicker(){if(!teamPicker)return;teamPicker.innerHTML=allTeams.map(t=>`<button type="button" class="team-choice ${t===selectedTeam?'selected':''}" data-pick-team="${t}"><strong>${t}</strong><small>${t===selectedTeam?'SEÇİLİ':'Favori takım'}</small></button>`).join('');$$('[data-pick-team]').forEach(b=>b.addEventListener('click',()=>{selectedTeam=b.dataset.pickTeam;$$('.team-choice').forEach(x=>x.classList.toggle('selected',x===b));}))}
function openSetup(){renderTeamPicker();setupModal?.classList.add('show');document.body.classList.add('modal-open')}
function closeSetup(){setupModal?.classList.remove('show');document.body.classList.remove('modal-open')}
function sortNewsByFavorite(){const feed=$('#newsFeed');if(!feed)return;const rows=$$('.news-row',feed);rows.sort((a,b)=>{if(!selectedTeam)return 0;return (b.dataset.team===selectedTeam)-(a.dataset.team===selectedTeam)}).forEach(r=>feed.appendChild(r));}
$('#saveFavoriteTeam')?.addEventListener('click',()=>{if(!selectedTeam){toast('Önce bir takım seç');return}applyFavoriteTeam(selectedTeam);closeSetup();toast(`${selectedTeam} favori takımın olarak kaydedildi`)});
$('#setupClose')?.addEventListener('click',closeSetup);setupModal?.addEventListener('click',e=>{if(e.target===setupModal)closeSetup()});
$('#favoriteTeamMenu')?.addEventListener('click',()=>{closeDrawer();openSetup()});$('#favoriteCard')?.addEventListener('click',openSetup);

/* Team quick filters: favoriyi sıralar, diğerlerini filtreler only if explicitly clicked */
function filterTeam(team){$$('.news-row').forEach(row=>row.style.display=(!team||row.dataset.team===team)?'grid':'none');$('#haberler')?.scrollIntoView({behavior:'smooth'});toast(team?`${team} haberleri gösteriliyor`:'Tüm haberler');closeDrawer()}
$$('.team-link').forEach(b=>b.addEventListener('click',()=>filterTeam(b.dataset.team)));
$('#moreTeams')?.addEventListener('click',()=>{openDrawer()});

/* ---------- NEWS BOOKMARKS ---------- */
function articleData(article){const img=article.querySelector('img');const h=article.querySelector('h3');const p=article.querySelector('p');const source=article.querySelector('a');const kicker=article.querySelector('.news-kicker');return{id:article.dataset.newsId,title:h?.textContent.trim()||'Haber',team:article.dataset.team||'',text:p?.textContent.trim()||'',source:source?.href||'#',image:img?.src||'',kicker:kicker?.textContent.trim()||'',savedAt:Date.now()}}
function isSaved(id){return getSaved().some(x=>x.id===id)}
function updateBookmarkButtons(){ $$('.news-row.has-bookmark').forEach(a=>{const b=a.querySelector('.bookmark-btn');if(!b)return;const saved=isSaved(a.dataset.newsId);b.classList.toggle('saved',saved);b.textContent=saved?'🔖':'🔖';b.setAttribute('aria-label',saved?'Kaydedilenlerden çıkar':'Haberi kaydet');})}
function toggleBookmark(article){const id=article.dataset.newsId;let saved=getSaved();if(saved.some(x=>x.id===id)){saved=saved.filter(x=>x.id!==id);toast('Haber kaydedilenlerden çıkarıldı')}else{saved.unshift(articleData(article));toast('Haber “Sonra Oku”ya kaydedildi')}setSaved(saved);updateBookmarkButtons();renderSavedNews()}

const savedModal=$('#savedModal');
function renderSavedNews(){const box=$('#savedNewsList');if(!box)return;const saved=getSaved();if(!saved.length){box.innerHTML='<div class="saved-empty">🔖<br><br>Henüz kaydedilmiş haber yok.<br><small>Haberlerin sağ üstündeki yer imi düğmesine dokun.</small></div>';return}box.innerHTML=saved.map(x=>`<article class="saved-news-card"><img src="${x.image}" alt=""><div><small>${x.kicker}</small><h3>${x.title}</h3><a href="${x.source}" target="_blank" rel="noopener">Kaynağı aç ↗</a></div><button class="saved-remove" type="button" data-remove-saved="${x.id}" aria-label="Kaydı kaldır">×</button></article>`).join('');$$('[data-remove-saved]').forEach(b=>b.addEventListener('click',()=>{setSaved(getSaved().filter(x=>x.id!==b.dataset.removeSaved));renderSavedNews();updateBookmarkButtons();toast('Kayıt kaldırıldı')}))}
function openSaved(){renderSavedNews();savedModal?.classList.add('show');document.body.classList.add('modal-open');closeDrawer()}
function closeSaved(){savedModal?.classList.remove('show');document.body.classList.remove('modal-open')}
$('#savedNewsMenu')?.addEventListener('click',openSaved);$('#savedCard')?.addEventListener('click',openSaved);$('#savedClose')?.addEventListener('click',closeSaved);savedModal?.addEventListener('click',e=>{if(e.target===savedModal)closeSaved()});

/* ---------- HERO ---------- */
const HERO_BJK_PHOTO='./hero-bjk.jpg';
const HERO_STATIC={title:"Beşiktaş, Marsilya'yı 4-1 mağlup etti",text:"Beşiktaş, UEFA Avrupa Ligi lig aşamasındaki ilk maçında Marsilya'yı 4-1 yenerek turnuvaya galibiyetle başladı.",source:'Anadolu Ajansı · 17 Eylül',newsId:'bjk-marseille-result',bg:`linear-gradient(90deg,rgba(0,0,0,.86),rgba(0,0,0,.30)),url("${HERO_BJK_PHOTO}") center/cover`,link:'https://m.aa.com.tr/tr/pg/foto-galeri/besiktas-olimpik-marsilyayi-maglup-etti/167578'};
function setSocialImage(src){const abs=new URL(src,location.href).href;['og:image','twitter:image'].forEach(n=>{const m=document.querySelector(`meta[property="${n}"],meta[name="${n}"]`);if(m)m.setAttribute('content',abs)})}
function renderStaticHero(){const s=HERO_STATIC,media=$('#heroMedia');if(!media)return;$('#heroTitle').textContent=s.title;$('#heroText').textContent=s.text;$('#heroSource').textContent=s.source;media.style.background=s.bg;$('#heroIndex').textContent='1';const dots=$('#sliderDots');if(dots)dots.innerHTML='';const a=$(`.news-row[data-news-id="${s.newsId}"]`);setSocialImage(a?.querySelector('img')?.getAttribute('src')||'./hero-bjk.jpg');$('#heroRead').onclick=()=>window.open(s.link,'_blank','noopener')}
renderStaticHero();

/* ---------- LEAGUE TABS ---------- */
$$('.table-tabs button').forEach(btn=>btn.addEventListener('click',()=>{
  $$('.table-tabs button').forEach(x=>x.classList.remove('active'));
  btn.classList.add('active');
  ['standings','results','fixtures','goals','assists'].forEach(id=>$('#'+id+'Panel')?.classList.remove('show'));
  const panel=$('#'+btn.dataset.table+'Panel');
  panel?.classList.add('show');
  $('#puan')?.scrollIntoView({behavior:'smooth',block:'start'});
  panel?.animate([{opacity:.35,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:320,easing:'cubic-bezier(.2,.8,.2,1)'});
  if(btn.dataset.table==='fixtures') renderUpcomingFixtures();
}));
$$('.transfer-tabs button').forEach(btn=>btn.addEventListener('click',()=>{$$('.transfer-tabs button').forEach(x=>x.classList.remove('active'));btn.classList.add('active');const type=btn.dataset.transfer;$$('#transferGrid article').forEach(a=>a.style.display=(type==='all'||a.dataset.type===type)?'block':'none')}));
$$('.match-filters button').forEach(btn=>btn.addEventListener('click',()=>{$$('.match-filters button').forEach(x=>x.classList.remove('active'));btn.classList.add('active');const day=btn.dataset.day;$$('.match-row').forEach(r=>r.style.display=(day==='all'||r.dataset.day===day)?'grid':'none')}));
$('#todayBtn')?.addEventListener('click',()=>{document.querySelector('[data-fixture-day="today"]')?.scrollIntoView({behavior:'smooth',block:'center'});toast('17 Eylül maç sonucu gösteriliyor')});
function liveNewsImage(item){const t=(item.title+' '+item.category).toLocaleLowerCase('tr-TR');if(t.includes('galatasaray'))return './local-3.svg';if(t.includes('fenerbahçe'))return './local-4.svg';if(t.includes('beşiktaş'))return './local-2.svg';if(t.includes('trabzonspor'))return './local-1.svg';return './local-6.svg'}
function liveNewsTeam(item){const t=(item.title+' '+item.description).toLocaleLowerCase('tr-TR');for(const team of Object.keys(teamStyles)){if(t.includes(team.toLocaleLowerCase('tr-TR')))return team}return ''}
function liveNewsDate(value){if(!value)return 'Şimdi';const d=new Date(value);if(Number.isNaN(d.getTime()))return value;return new Intl.DateTimeFormat('tr-TR',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}).format(d)}
function loadLiveNews(showToast=false){
  const feed=$('#newsFeed');const api=COMMUNITY_API;if(!feed||!/^https:\/\//.test(api))return;
  const status=$('#newsStatus');if(status)status.textContent='Güncelleniyor…';
  const cb='ionenspiegelNews_'+Date.now();let script;
  const cleanup=()=>{try{script?.remove()}catch(e){}try{delete window[cb]}catch(e){}};
  window[cb]=(data)=>{
    cleanup();
    const items=Array.isArray(data?.items)?data.items:[];
    if(!items.length){if(status)status.textContent='Otomatik akışta yeni futbol haberi bulunamadı.';if(showToast)toast('Yeni haber bulunamadı');return}
    const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
    feed.innerHTML=items.map((item,i)=>{const team=liveNewsTeam(item);const id='live-'+i+'-'+Math.abs((item.link||item.title).split('').reduce((a,c)=>((a<<5)-a)+c.charCodeAt(0)|0,0));const img=liveNewsImage(item);const desc=item.description||'Haberin ayrıntıları için kaynak sayfasını aç.';return `<article class="news-row has-bookmark live-news-row" data-news-id="${esc(id)}" data-team="${esc(team)}" data-search="${esc(item.title+' '+desc)}"><button class="bookmark-btn" type="button" aria-label="Haberi kaydet" title="Sonra oku">🔖</button><div class="thumb"><img src="${img}" alt="Futbol haberi"></div><div><div class="news-kicker">${esc(liveNewsDate(item.pubDate))} · ${esc(item.category||'FUTBOL')}</div><h3>${esc(item.title)}</h3><p>${esc(desc)}</p><a href="${esc(item.link)}" target="_blank" rel="noopener noreferrer">${esc(item.source||'Kaynak')} ↗</a></div></article>`}).join('');
    sortNewsByFavorite();
    if(status)status.textContent=`Otomatik akış · ${items.length} futbol haberi · ${liveNewsDate(data.updatedAt)}`;
    if(showToast)toast(`${items.length} güncel haber yüklendi`);
  };
  script=document.createElement('script');script.src=api+(api.includes('?')?'&':'?')+'action=haberler&callback='+cb+'&t='+Date.now();script.onerror=()=>{cleanup();if(status)status.textContent='Otomatik haber akışına şu anda ulaşılamıyor.';if(showToast)toast('Haber akışı alınamadı')};document.head.appendChild(script);
}
$('#refreshNews')?.addEventListener('click',()=>{loadOwnJsonNews(true)});

/* ---------- NEWS EVENT DELEGATION ---------- */
const newsFeedRoot=$('#newsFeed');
newsFeedRoot?.addEventListener('click',e=>{
  const bookmark=e.target.closest('.bookmark-btn');
  const row=e.target.closest('.news-row');
  if(!row||!newsFeedRoot.contains(row))return;
  if(bookmark){e.preventDefault();e.stopPropagation();toggleBookmark(row);return;}
  if(e.target.closest('a'))return;
  openArticle(row);
});

/* ---------- MOBILE NAV + SCROLL UX ---------- */
const mobileNav=$('.mobile-nav');
let lastScrollY=Math.max(0,window.scrollY),navTick=false;
function updateMobileNav(){
  navTick=false;
  const y=Math.max(0,window.scrollY);
  if(mobileNav){
    if(y>120 && y>lastScrollY+4) mobileNav.classList.add('nav-hidden');
    else if(y<lastScrollY-4 || y<60) mobileNav.classList.remove('nav-hidden');
  }
  lastScrollY=y;
}
window.addEventListener('scroll',()=>{if(!navTick){navTick=true;requestAnimationFrame(updateMobileNav)}},{passive:true});
const navLinks=$$('.mobile-nav a[href^="#"]');
const sectionObserver=('IntersectionObserver' in window)?new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){navLinks.forEach(a=>a.classList.toggle('active',a.getAttribute('href')===`#${entry.target.id}`))}})},{rootMargin:'-35% 0px -55% 0px',threshold:0}):null;
navLinks.forEach(a=>{const id=a.getAttribute('href')?.slice(1),target=id&&document.getElementById(id);if(target&&sectionObserver)sectionObserver.observe(target)});

/* ---------- THEME: manual + system preference ---------- */
const themeCard=$('#themeCard');
function systemTheme(){return window.matchMedia?.('(prefers-color-scheme: dark)').matches?'dark':'light'}
function applyTheme(theme,save=true){const dark=theme==='dark';document.documentElement.classList.toggle('dark-theme',dark);if(save)localStorage.setItem(STORE.theme,dark?'dark':'light');const meta=document.getElementById('themeColorMeta');if(meta)meta.setAttribute('content',dark?'#111419':'#e50914');if(themeCard){themeCard.querySelector('b').textContent=dark?'Açık Tema':'Koyu Tema';themeCard.querySelector('small').textContent=dark?'Gündüz okuma görünümü':'Gece okuma görünümü'}}
const storedTheme=localStorage.getItem(STORE.theme);applyTheme(storedTheme||systemTheme(),false);
themeCard?.addEventListener('click',()=>{const dark=document.documentElement.classList.contains('dark-theme');applyTheme(dark?'light':'dark',true);toast(dark?'Açık tema aktif':'Koyu tema aktif')});
window.matchMedia?.('(prefers-color-scheme: dark)').addEventListener?.('change',e=>{if(!localStorage.getItem(STORE.theme))applyTheme(e.matches?'dark':'light',false)});


window.addEventListener('scroll',()=>{const max=document.documentElement.scrollHeight-innerHeight;$('#progress').style.width=(max?scrollY/max*100:0)+'%';$('#backTop').classList.toggle('show',scrollY>500)});$('#backTop')?.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));


/* ---------- V12 ARTICLE DETAIL ---------- */
const articleModal=$('#articleModal'),articleTitle=$('#articleDetailTitle'),articleMeta=$('#articleDetailMeta'),articleImage=$('#articleDetailImage'),articleBody=$('#articleDetailBody'),articleSource=$('#articleSource'),articleKicker=$('#articleDetailKicker');
const articleLongText={
 'bjk-marseille-result':['Beşiktaş, UEFA Avrupa Ligi lig aşamasındaki ilk maçında Marsilya\'yı 4-1 mağlup etti.','Siyah-beyazlı ekip, Tüpraş Stadyumu\'ndaki karşılaşmada dört gol buldu ve Avrupa Ligi\'ne galibiyetle başladı.','Karşılaşmanın sonucu ve Avrupa Ligi fikstürüyle ilgili ayrıntılar kaynak bağlantısında yer alıyor.'],
 'bjk-marseille':["Beşiktaş, UEFA Avrupa Ligi lig aşamasındaki ilk maçında Marsilya'yı 4-1 mağlup etti.","Siyah-beyazlı ekip, Tüpraş Stadyumu'ndaki karşılaşmada dört gol buldu ve Avrupa Ligi'ne galibiyetle başladı.","Karşılaşmanın sonucu ve Avrupa Ligi fikstürüyle ilgili ayrıntılar kaynak bağlantısında yer alıyor."],
 'gs-kocaeli':['Galatasaray, Kocaelispor karşısında aldığı 1-0’lık galibiyetle beşinci hafta sonunda 13 puana ulaştı ve zirvedeki yerini korudu.','Sezonun ilk haftalarındaki sonuçlar, Galatasaray’ın puan tablosunda üst sırada kalmasını sağladı. Haberin ayrıntıları ve kaynak bağlantısı tam ekran okuma görünümünde sunulur.','Haberin kaynak bağlantısı ayrıca sunularak okuyucuya dış kaynağa geçiş imkânı verilir.'],
 'fb-gaziantep':['Fenerbahçe, Süper Lig’in beşinci hafta kapanışında Gaziantep FK ile 0-0 berabere kaldı. Karşılaşmada taraflar birer puan aldı.','Bu sonuçla Fenerbahçe beş maç sonunda 7 puanda kaldı. Takımın lig performansında galibiyetlerin yanı sıra iki mağlubiyet ve bir beraberlik bulunuyor.','Tam haber görünümü, başlık ve kapak görselinin yanında kaynak, paylaşım ve uzun metin alanlarını tek ekranda birleştirmek için tasarlanmıştır.']};
function articleDataFull(a){const d=articleData(a),ps=articleLongText[d.id]||[d.text,'Haberin ayrıntıları ve kaynak bağlantısı tam ekran okuma görünümünde sunulur.','Kaynak bağlantısı ve paylaşım araçları haber detayının altında yer alır.'];return {...d,paragraphs:ps}}
function openArticle(article){if(!articleModal||!article)return;const d=articleDataFull(article);articleKicker.textContent=d.kicker||d.team||'HABER';articleTitle.textContent=d.title;articleMeta.textContent=`${d.team||'Futbol'} · ${new Date().toLocaleDateString('tr-TR',{day:'numeric',month:'long',year:'numeric'})}`;articleImage.src=d.image;articleImage.alt=d.title;setSocialImage(d.image);articleBody.innerHTML=d.paragraphs.map((x,i)=>`<p class="${i===0?'article-lead':''}">${x}</p>`).join('');articleSource.href=d.source;articleModal.classList.add('show');document.body.classList.add('modal-open');setTimeout(()=>$('#articleClose')?.focus(),30)}
function closeArticle(){articleModal?.classList.remove('show');document.body.classList.remove('modal-open')}
function bindNewsInteractions(){updateBookmarkButtons();sortNewsByFavorite();}
$('#articleClose')?.addEventListener('click',closeArticle);articleModal?.addEventListener('click',e=>{if(e.target===articleModal)closeArticle()});$('#heroRead')?.addEventListener('click',()=>{const id=slides[slideIndex]?.newsId;const a=$(`.news-row[data-news-id="${id}"]`);if(a)openArticle(a)});
const articleShare=$('#articleShare');
articleShare?.addEventListener('click',async()=>{const title=articleTitle?.textContent||'ionenspiegel';const url=location.href.split('#')[0]+'#haberler';const metaImg=document.querySelector('meta[property="og:image"]')?.content;try{if(navigator.share){let data={title,text:`${title} | İonenSpiegel`,url};if(metaImg&&navigator.canShare){try{const r=await fetch(metaImg,{cache:'no-store'});const b=await r.blob();const ext=b.type.includes('svg')?'svg':'png';const file=new File([b],`ionenspiegel-${Date.now()}.${ext}`,{type:b.type||'image/svg+xml'});if(navigator.canShare({files:[file]}))data.files=[file]}catch(_){}}await navigator.share(data)}else throw 0;toast('Paylaşım penceresi açıldı')}catch(e){if(e?.name==='AbortError')return;try{await navigator.clipboard.writeText(url);toast('Bağlantı kopyalandı')}catch(_){toast('Bağlantı: '+url)}}});

/* ---------- V12 INSTALL PROMPT ---------- */
let deferredInstall=null;const installCard=$('#installCard');
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredInstall=e;installCard?.removeAttribute('hidden');installCard?.classList.add('ready')});
installCard?.addEventListener('click',async()=>{if(!deferredInstall){toast('Tarayıcı bu cihazda yükleme istemini sunmuyor');return}deferredInstall.prompt();const r=await deferredInstall.userChoice;if(r.outcome==='accepted')toast('Uygulama yükleme başlatıldı');deferredInstall=null;installCard.classList.remove('ready');installCard.setAttribute('hidden','hidden')});
window.addEventListener('appinstalled',()=>{deferredInstall=null;installCard?.classList.remove('ready');installCard?.setAttribute('hidden','hidden');toast('ionenspiegel yüklendi')});

/* ---------- V12 NOTIFICATIONS ---------- */
$('#notificationCard')?.addEventListener('click',async()=>{if(!('Notification' in window)){toast('Bu tarayıcı bildirimleri desteklemiyor');return}let p=Notification.permission;if(p==='default')p=await Notification.requestPermission();if(p==='granted'){toast('Bildirimler açıldı');setTimeout(()=>new Notification('ionenspiegel',{body:'Yeni futbol gelişmesi var.',icon:'icon-192.png',tag:'ionenspiegel-news'}),3000)}else toast('Bildirim izni verilmedi')});
/* ---------- V12 SKELETON NEWS ---------- */
function runNewsSkeleton(){const feed=$('#newsFeed');if(!feed)return;const html=feed.innerHTML;feed.classList.add('skeleton-mode');feed.setAttribute('aria-busy','true');feed.innerHTML=`<article class="news-row"><div class="thumb"></div><div><div class="news-kicker">YÜKLENİYOR</div><h3>Haber hazırlanıyor...</h3><p>İçerik yükleniyor.</p></div></article><article class="news-row"><div class="thumb"></div><div><div class="news-kicker">YÜKLENİYOR</div><h3>Haber hazırlanıyor...</h3><p>İçerik yükleniyor.</p></div></article><article class="news-row"><div class="thumb"></div><div><div class="news-kicker">YÜKLENİYOR</div><h3>Haber hazırlanıyor...</h3><p>İçerik yükleniyor.</p></div></article>`;setTimeout(()=>{feed.innerHTML=html;feed.classList.remove('skeleton-mode');feed.setAttribute('aria-busy','false');bindNewsInteractions()},420)}

/* ---------- V12 FOCUS TRAP ---------- */
const modalNodes=()=>$$('.modal-backdrop.show,.timeline-backdrop.show,.media-modal-backdrop.show,.article-backdrop.show');
function focusables(root){return $$('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])',root).filter(x=>x.offsetParent!==null)}
window.addEventListener('keydown',e=>{const open=modalNodes().at(-1);if(!open)return;if(e.key==='Tab'){const fs=focusables(open),first=fs[0],last=fs[fs.length-1];if(!first)return;if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});

/* ---------- INITIALIZE ---------- */
applyFavoriteTeam(currentFavorite());updateBookmarkButtons();renderSavedNews();
if(!currentFavorite())setTimeout(openSetup,650);

window.addEventListener('keydown',e=>{if(e.key==='/'&&document.activeElement?.tagName!=='INPUT'){e.preventDefault();searchModal?.classList.add('show');setTimeout(()=>$('#globalSearch')?.focus(),50)}if(e.key==='Escape'){closeDrawer();closeSetup();closeSaved();closeTimeline();closeMedia();closeArticle();$$('.modal-backdrop').forEach(m=>m.classList.remove('show'))}});


/* V13: stats tab row always starts from the left on mobile */
document.addEventListener('DOMContentLoaded',()=>{$('.stats-tabs')?.scrollTo({left:0,behavior:'instant'})});


/* ---------- V20 ETKILESIM / YEREL VERI ---------- */
(function initV20(){
  const upcoming=[
    ['18 Eyl','20:00','Kasımpaşa','Konyaspor','Süper Lig'],['19 Eyl','17:00','Kocaelispor','Gaziantep FK','Süper Lig'],['19 Eyl','17:00','Çorum FK','Alanyaspor','Süper Lig'],['19 Eyl','20:00','Başakşehir','Gençlerbirliği','Süper Lig'],['19 Eyl','20:00','Trabzonspor','Galatasaray','Süper Lig'],['20 Eyl','17:00','Erzurumspor','Samsunspor','Süper Lig'],['20 Eyl','17:00','Fenerbahçe','Eyüpspor','Süper Lig'],['20 Eyl','20:00','Göztepe','Rizespor','Süper Lig'],['20 Eyl','20:00','Amed Sportif','Beşiktaş','Süper Lig']
  ];
  const list=$('#upcomingMainList');
  if(list){ list.innerHTML=upcoming.map((m,i)=>`<button class="fixture-card" data-match="${i}"><span><b>${m[0]}</b><small>${m[1]}</small></span><strong>${m[2]} <em>vs</em> ${m[3]}</strong><small>${m[4]}</small></button>`).join(''); $('#fixtureCount')?.replaceChildren(document.createTextNode(upcoming.length+' maç')); }
  const details=[
    ['Kasımpaşa','Konyaspor','Süper Lig','18 Eylül 2026 · 20:00'],['Kocaelispor','Gaziantep FK','Süper Lig','19 Eylül 2026 · 17:00'],['Çorum FK','Alanyaspor','Süper Lig','19 Eylül 2026 · 17:00'],['Başakşehir','Gençlerbirliği','Süper Lig','19 Eylül 2026 · 20:00'],['Trabzonspor','Galatasaray','Süper Lig','19 Eylül 2026 · 20:00'],['Erzurumspor','Samsunspor','Süper Lig','20 Eylül 2026 · 17:00'],['Fenerbahçe','Eyüpspor','Süper Lig','20 Eylül 2026 · 17:00'],['Göztepe','Rizespor','Süper Lig','20 Eylül 2026 · 20:00'],['Amed Sportif','Beşiktaş','Süper Lig','20 Eylül 2026 · 20:00']
  ];
  function openMatch(i){const m=details[i]||details[0]; let modal=$('#matchDetailModal'); if(!modal){modal=document.createElement('div');modal.className='modal-backdrop show';modal.id='matchDetailModal';modal.innerHTML='<div class="match-detail-modal"><button class="close-btn" id="matchClose">×</button><span class="tag news">MAÇ DETAYI</span><h2 id="matchTitle"></h2><p id="matchMeta"></p><div class="match-tabs"><b>Muhtemel 11</b><b>İstatistikler</b><b>Olaylar</b></div><div class="match-detail-body"><div><strong>Ev sahibi</strong><p>Muhtemel kadro bilgisi resmi kulüp açıklamasıyla güncellenir.</p></div><div><strong>Deplasman</strong><p>Muhtemel kadro bilgisi resmi kulüp açıklamasıyla güncellenir.</p></div><div class="match-stats"><span>Topa sahip olma <b>-- / --</b></span><span>Şut <b>-- / --</b></span><span>Korner <b>-- / --</b></span></div></div></div>';document.body.appendChild(modal);$('#matchClose').onclick=()=>modal.remove();modal.onclick=e=>{if(e.target===modal)modal.remove()};}
    $('#matchTitle').textContent=m[0]+' - '+m[1]; $('#matchMeta').textContent=m[3]+' · '+m[2]; modal.classList.add('show'); }
  $$('.fixture-card').forEach(b=>b.addEventListener('click',()=>openMatch(Number(b.dataset.match))));

  const poll=[['İlhan Fakılı','Beşiktaş'],['Václav Černý','Beşiktaş'],['Amir Murillo','Beşiktaş'],['Ernest Poku','Beşiktaş']];
  const pollBox=$('#playerPoll'), pollResult=$('#pollResult');
  const COMMUNITY_API = window.IONENSPIEGEL_COMMUNITY_API || 'https://script.google.com/macros/s/AKfycbxPYzzN6tk-EuyrPMwU_cxr4cXH5W6nSqCQj2MVEh40t0sh9Erl5P0P_Cads9lZDKzCCQ/exec';
  const VOTED_KEY='ionenspiegel-v23-voted';
  let communityData={comments:[],votes:{}};

  function renderCommunity(data){
    communityData=data||{comments:[],votes:{}};
    if(pollResult){
      const v=communityData.votes||{}, total=Object.values(v).reduce((a,b)=>a+Number(b||0),0);
      pollResult.innerHTML=poll.map((x,i)=>{const n=Number(v[i]||0),p=total?Math.round(n/total*100):0;return `<div class="poll-line"><span>${x[0]}</span><b>${p}%</b><i style="width:${p}%"></i></div>`}).join('');
    }
    if(cList){
      const arr=Array.isArray(communityData.comments)?communityData.comments:[];
      cList.innerHTML=arr.length?arr.map(c=>`<div class="comment-item"><b>${esc(c.name)}</b><small>${esc(c.date)}</small><p>${esc(c.text)}</p></div>`).join(''):'<small class="muted">Henüz yorum yok.</small>';
    }
  }

  function loadCommunity(){
    if(!/^https:\/\//.test(COMMUNITY_API)) return;
    const cb='ionenspiegelCommunity_'+Date.now();
    window[cb]=(data)=>{renderCommunity(data);delete window[cb];script.remove()};
    const script=document.createElement('script');
    script.src=COMMUNITY_API+(COMMUNITY_API.includes('?')?'&':'?')+'callback='+cb;
    script.onerror=()=>{delete window[cb];script.remove()};
    document.head.appendChild(script);
  }

  if(pollBox){
    pollBox.innerHTML=poll.map((x,i)=>`<button class="poll-option" data-poll="${i}"><span>${x[0]}</span><small>${x[1]}</small></button>`).join('');
    const alreadyVoted=localStorage.getItem(VOTED_KEY)==='1';
    $$('.poll-option',pollBox).forEach(b=>{
      b.disabled=alreadyVoted;
      b.onclick=()=>{
        if(localStorage.getItem(VOTED_KEY)==='1') return toast('Bu cihazdan zaten oy verdin');
        const body='action=anket&choice='+encodeURIComponent(b.dataset.poll);
        if(/^https:\/\//.test(COMMUNITY_API)){
          fetch(COMMUNITY_API,{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'},body}).catch(()=>{});
          localStorage.setItem(VOTED_KEY,'1');
          $$('.poll-option',pollBox).forEach(x=>x.disabled=true);
          toast('Oyun kaydediliyor');
          setTimeout(loadCommunity,1200);
        }else toast('Topluluk sistemi henüz bağlanmadı');
      };
    });
  }

  const cList=$('#commentList');
  function esc(v){return String(v||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
  $('#commentAdd')?.addEventListener('click',()=>{
    const n=$('#commentName')?.value.trim(),t=$('#commentText')?.value.trim();
    if(!n||!t)return toast('Ad ve yorum yazmalısın');
    if(n.length>60||t.length>1000)return toast('Yorum çok uzun');
    if(!/^https:\/\//.test(COMMUNITY_API))return toast('Topluluk sistemi henüz bağlanmadı');
    const body='action=yorum&name='+encodeURIComponent(n)+'&text='+encodeURIComponent(t);
    fetch(COMMUNITY_API,{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'},body}).catch(()=>{});
    $('#commentName').value='';$('#commentText').value='';toast('Yorum gönderiliyor');setTimeout(loadCommunity,1200);
  });
  loadCommunity();

  const readsKey='ionenspiegel-v20-reads';
  const visitorApi = COMMUNITY_API;
  const visitorTotal = $('#visitorTotal');
  const visitorToday = $('#visitorToday');

  function renderVisitors(v){
    if(!v) return;
    if(visitorTotal) visitorTotal.textContent = Number(v.total||0).toLocaleString('tr-TR');
    if(visitorToday) visitorToday.textContent = Number(v.today||0).toLocaleString('tr-TR');
  }

  function countSharedVisit(){
    if(!/^https:\/\//.test(visitorApi)) return;

    // Aynı tarayıcı aynı gün içinde sayfayı yenileyerek sayacı şişirmesin.
    const key = 'ionenspiegel-visit-day';
    const today = new Date().toLocaleDateString('sv-SE', {timeZone:'Europe/Istanbul'});
    if(localStorage.getItem(key) === today) return;

    localStorage.setItem(key, today);
    fetch(visitorApi,{
      method:'POST',
      mode:'no-cors',
      headers:{'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'},
      body:'action=ziyaret'
    }).catch(()=>{});

    // Kısa süre sonra ortak sayacı tekrar oku.
    setTimeout(loadCommunity, 1200);
  }

  countSharedVisit();
  $$('.news-row,.content-card,.world-card').forEach(card=>{card.addEventListener('click',()=>{const key=(card.innerText||'').slice(0,80),r=JSON.parse(localStorage.getItem(readsKey)||'{}');r[key]=(r[key]||0)+1;localStorage.setItem(readsKey,JSON.stringify(r))},{once:false})});
})();



/* ---------- OWN JSON NEWS FEED ---------- */
const IONENSPIEGEL_NEWS_FALLBACK=[{"id":"bjk-marseille-result","title":"Beşiktaş, Marsilya'yı 4-1 mağlup etti","description":"Beşiktaş, UEFA Avrupa Ligi lig aşamasındaki ilk maçında Marsilya'yı 4-1 yenerek turnuvaya galibiyetle başladı.","category":"Beşiktaş","date":"18 Eylül 2026","image":"../local-2.svg","source":"Anadolu Ajansı","link":"https://www.theguardian.com/football/live/2026/sep/17/real-sociedad-v-bournemouth-crystal-palace-v-lech-poznan-and-more-europa-league-live"},{"id":"ucl-fener-roma","title":"Fenerbahçe, Roma ile 1-1 berabere kaldı","description":"Fenerbahçe, 2026/27 UEFA Şampiyonlar Ligi lig aşamasının ilk maçında Roma ile 1-1 berabere kaldı.","category":"Şampiyonlar Ligi","date":"10 Eylül 2026","image":"../local-7.svg","source":"UEFA","link":"https://www.uefa.com/uefachampionsleague/news/02a8-2174c9e9019d-f909a77bd77a-1000--2026-27-champions-league-all-the-league-phase-fixtures/"},{"id":"ucl-gs-sporting","title":"Galatasaray, Sporting CP karşısında 3-1 kaybetti","description":"Galatasaray, Şampiyonlar Ligi lig aşamasının ilk maçında Sporting CP'ye 3-1 mağlup oldu.","category":"Şampiyonlar Ligi","date":"9 Eylül 2026","image":"../local-7.svg","source":"UEFA","link":"https://www.uefa.com/uefachampionsleague/news/02a8-2174c9e9019d-f909a77bd77a-1000--2026-27-champions-league-all-the-league-phase-fixtures/"},{"id":"ucl-matchday1","title":"Şampiyonlar Ligi'nde ilk hafta sonuçlandı","description":"İlk haftada Barcelona Feyenoord'u 5-1, PSG Slovan Bratislava'yı 6-1, Bayern Münih ise Bodø/Glimt'i 5-0 yendi.","category":"Şampiyonlar Ligi","date":"10 Eylül 2026","image":"../local-7.svg","source":"UEFA","link":"https://www.uefa.com/uefachampionsleague/news/02a8-2174c9e9019d-f909a77bd77a-1000--2026-27-champions-league-all-the-league-phase-fixtures/"},{"id":"el-matchday1","title":"Avrupa Ligi'nde ilk hafta tamamlandı","description":"Beşiktaş'ın 4-1'lik galibiyetinin yanında Juventus 5-0, Crystal Palace 4-0 ve Bournemouth 2-1'lik galibiyetler aldı.","category":"Avrupa Ligi","date":"18 Eylül 2026","image":"../local-7.svg","source":"UEFA","link":"https://www.uefa.com/uefaeuropaleague/news/02a9-219ba00d8c3a-2fc9c36259e8-1000--europa-league-matchday-1-highlights-and-round-up-benfica-/"},{"id":"fener-asensio","title":"Fenerbahçe'de Asensio Eyüpspor maçının kadrosunda","description":"Fenerbahçe, sakatlığını atlatan Marco Asensio'nun 20 Eylül'deki Eyüpspor karşılaşmasının kadrosunda yer alacağını açıkladı.","category":"Fenerbahçe","date":"18 Eylül 2026","image":"../local-4.svg","source":"beIN SPORTS Türkiye","link":"https://beinsports.com.tr/haber/fenerbahceden-marco-asensio-aciklamasi"},{"id":"bjk-next","title":"Beşiktaş'ın sıradaki lig maçı Amedspor deplasmanında","description":"Beşiktaş, 20 Eylül Pazar günü saat 20.00'de Amed Sportif Faaliyetler ile karşılaşacak.","category":"Beşiktaş","date":"18 Eylül 2026","image":"../local-2.svg","source":"Anadolu Ajansı","link":"https://www.aa.com.tr/tr/spor/super-ligde-6-haftanin-perdesi-yarin-acilacak/4059611"},{"id":"superlig-6-hafta","title":"Süper Lig'de 6. hafta bugün başlıyor","description":"6. haftanın açılışında Kasımpaşa ile Konyaspor 18 Eylül Cuma günü saat 20.00'de karşılaşacak.","category":"Süper Lig","date":"18 Eylül 2026","image":"../local-6.svg","source":"Anadolu Ajansı","link":"https://www.aa.com.tr/tr/spor/super-ligde-6-haftanin-perdesi-yarin-acilacak/4059611"},{"id":"trabzon-gs-derbi","title":"Trabzonspor-Galatasaray derbisi yarın","description":"Trabzonspor ile Galatasaray, Süper Lig'in 6. haftasında 19 Eylül Cumartesi günü saat 20.00'de Papara Park'ta karşılaşacak.","category":"Süper Lig","date":"18 Eylül 2026","image":"../local-1.svg","source":"Anadolu Ajansı","link":"https://www.aa.com.tr/tr/spor/super-ligde-6-haftanin-perdesi-yarin-acilacak/4059611"},{"id":"europa-ilk-gece","title":"Avrupa Ligi'nde ilk hafta tamamlandı","description":"2026/27 UEFA Avrupa Ligi'nin ilk maç gününde karşılaşmalar tamamlandı ve sonuçlar netleşti.","category":"Avrupa","date":"18 Eylül 2026","image":"../local-7.svg","source":"UEFA","link":"https://www.uefa.com/uefaeuropaleague/news/02a9-219ba00d8c3a-2fc9c36259e8-1000--europa-league-matchday-1-highlights-and-round-up-benfica-/"},{"id":"barcelona-racing","title":"Barcelona, Racing'i 7-2 yendi","description":"Barcelona, LaLiga'da Racing Santander'i 7-2 mağlup etti. Raphinha hat-trick yaparken Barcelona sezonun altıncı lig maçında da yenilmedi.","category":"Dünya","date":"17 Eylül 2026","image":"../local-6.svg","source":"Reuters","link":"https://www.reuters.com/sports/soccer/flick-sets-record-barcelona-breeze-past-racing-with-raphinha-hat-trick-2026-09-16/"},{"id":"fb-eyupspor","title":"Fenerbahçe-Eyüpspor maçı 20 Eylül'de","description":"Fenerbahçe, Süper Lig'in 6. haftasında Eyüpspor'u 20 Eylül Pazar günü saat 17.00'de ağırlayacak.","category":"Fenerbahçe","date":"18 Eylül 2026","image":"../local-4.svg","source":"Anadolu Ajansı","link":"https://www.aa.com.tr/tr/spor/super-ligde-6-haftanin-perdesi-yarin-acilacak/4059611"},{"id":"europe-bournemouth","title":"Bournemouth Avrupa Ligi'ne galibiyetle başladı","description":"Bournemouth, kulüp tarihindeki ilk Avrupa maçında Real Sociedad'ı deplasmanda 2-1 mağlup etti.","category":"Avrupa","date":"17 Eylül 2026","image":"../local-7.svg","source":"Anadolu Ajansı","link":"https://www.theguardian.com/football/live/2026/sep/17/real-sociedad-v-bournemouth-crystal-palace-v-lech-poznan-and-more-europa-league-live"}];
function renderOwnNewsItems(items, status){
  const feed=document.querySelector('#newsFeed');
  if(!feed) return;
  const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  feed.innerHTML=items.map(item=>{
    const team=liveNewsTeam(item);
    const id=esc(item.id||item.title);
    const img=esc(item.image||'./local-6.svg');
    const desc=esc(item.description||'Haberin ayrıntıları için kaynak sayfasını aç.');
    const link=esc(item.link||'#');
    const source=esc(item.source||'İonenSpiegel');
    const category=esc(item.category||'FUTBOL');
    const date=esc(item.date||'');
    return `<article class="news-row has-bookmark" data-news-id="${id}" data-team="${esc(team)}" data-search="${esc(item.title+' '+(item.description||''))}"><button class="bookmark-btn" type="button" aria-label="Haberi kaydet" title="Sonra oku">🔖</button><div class="thumb"><img src="${img}" alt="${esc(item.title)}" loading="lazy"></div><div><div class="news-kicker">${date} · ${category}</div><h3>${esc(item.title)}</h3><p>${desc}</p><a href="${link}" target="_blank" rel="noopener noreferrer">${source} ↗</a></div></article>`;
  }).join('');
  sortNewsByFavorite();
  updateBookmarkButtons();
  if(status) status.textContent=`Kendi JSON haber akışı · ${items.length} haber`;
}


async function loadOwnJsonNews(showToast=false){
  const feed=$('#newsFeed');
  if(!feed)return;
  const status=$('#newsStatus');
  try{
    if(status)status.textContent='Haberler yükleniyor…';
    const response=await fetchWithTimeout('./data/news.json?v='+Date.now(),{cache:'no-store'});
    if(!response.ok)throw new Error('news.json yüklenemedi');
    const items=await response.json();
    if(!Array.isArray(items))throw new Error('Geçersiz haber verisi');
    renderOwnNewsItems(items,status);
    if(showToast)toast(`${items.length} haber yenilendi`);
  }catch(error){
    console.warn('Yerel haber JSON alınamadı, gömülü haber verisi kullanılıyor.',error);
    renderOwnNewsItems(IONENSPIEGEL_NEWS_FALLBACK,status);
    if(status)status.textContent=`Yerel haber akışı · ${IONENSPIEGEL_NEWS_FALLBACK.length} haber`;
    if(showToast)toast('Yerel haberler yüklendi');
  }
}
document.addEventListener('DOMContentLoaded',()=>loadOwnJsonNews(false));

/* V30 DAILY VERIFIED NEWS FALLBACK: local JSON is the single source for the homepage feed. */
