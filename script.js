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
function openArticle(article){
  if(!articleModal||!article)return;
  const d=articleDataFull(article);
  articleKicker.textContent=d.kicker||d.team||'HABER';
  articleTitle.textContent=d.title;
  const rawDate=(d.kicker||'').split('·')[0].trim();
  articleMeta.textContent=`${d.team||'Futbol'}${rawDate?' · '+rawDate:''}`;
  const img=(d.image||'./local-6.svg').replace(/^\.\.\//,'./');
  articleImage.src=img;
  articleImage.alt=d.title;
  articleImage.onerror=()=>{articleImage.src='./local-6.svg'};
  setSocialImage(img);
  articleBody.innerHTML=d.paragraphs.map((x,i)=>`<p class="${i===0?'article-lead':''}">${x}</p>`).join('');
  articleSource.href=d.source&&d.source!=='#'?d.source:'https://ionenspiegel.github.io/';
  articleSource.textContent=d.source&&d.source!=='#'?'Kaynağı aç ↗':'İonenSpiegel';
  articleModal.classList.add('show');
  document.body.classList.add('modal-open');
  setTimeout(()=>$('#articleClose')?.focus(),30);
}
function closeArticle(){articleModal?.classList.remove('show');document.body.classList.remove('modal-open')}
function bindNewsInteractions(){updateBookmarkButtons();sortNewsByFavorite();}
$('#articleClose')?.addEventListener('click',closeArticle);articleModal?.addEventListener('click',e=>{if(e.target===articleModal)closeArticle()});
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




/* V53: Yaklaşan Maçlar widgetı gerçek fikstür verisine bağlandı. */
(function initUpcomingWidget(){
  const matches=[
    ['18 Eyl','20:00','Kasımpaşa','Konyaspor','Süper Lig'],
    ['19 Eyl','17:00','Kocaelispor','Gaziantep FK','Süper Lig'],
    ['19 Eyl','17:00','Arca Çorum FK','Alanyaspor','Süper Lig'],
    ['19 Eyl','20:00','Trabzonspor','Galatasaray','Süper Lig'],
    ['19 Eyl','20:00','Başakşehir','Gençlerbirliği','Süper Lig'],
    ['20 Eyl','17:00','Fenerbahçe','Eyüpspor','Süper Lig'],
    ['20 Eyl','20:00','Amed Sportif','Beşiktaş','Süper Lig']
  ];
  const box=document.querySelector('#upcomingFixtures');
  const count=document.querySelector('#fixtureCount');
  if(!box)return;
  box.innerHTML=matches.map((m,i)=>`<button class="fixture-card" type="button" data-upcoming-index="${i}">
    <span><b>${m[0]}</b><small>${m[1]}</small></span>
    <strong>${m[2]} <em>vs</em> ${m[3]}</strong>
    <small>${m[4]}</small>
  </button>`).join('');
  if(count)count.textContent=`${matches.length} maç`;
  box.querySelectorAll('[data-upcoming-index]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const target=document.querySelector('#maclar');
      if(target)target.scrollIntoView({behavior:'smooth',block:'start'});
    });
  });
})();

/* V53: Video/Galeri modalları boş kalmasın. */
(function initMedia(){
  const modal=document.querySelector('#mediaModal');
  const content=document.querySelector('#mediaContent');
  const title=document.querySelector('#mediaTitle');
  if(!modal||!content)return;

  const videos=[
    ['Beşiktaş 4-1 Marsilya','Beşiktaş · Avrupa Ligi','https://www.youtube.com/results?search_query=Be%C5%9Fikta%C5%9F+Marsilya+4-1'],
    ['Avrupa Ligi ilk hafta','UEFA Avrupa Ligi','https://www.youtube.com/results?search_query=UEFA+Europa+League+2026+highlights'],
    ['Trabzonspor-Galatasaray','Süper Lig derbisi','https://www.youtube.com/results?search_query=Trabzonspor+Galatasaray+19+Eyl%C3%BCl+2026']
  ];
  const galleries=[
    ['Beşiktaş 4-1 Marsilya','./hero-bjk.jpg'],
    ['İonenSpiegel maç merkezi','./local-7.svg'],
    ['Avrupa kupaları','./local-6.svg']
  ];

  function openMedia(mode){
    title.textContent=mode==='video'?'Video':'Galeri';
    if(mode==='video'){
      content.innerHTML=`<div class="media-grid">${videos.map(v=>`<a class="media-item" href="${v[2]}" target="_blank" rel="noopener"><div class="media-thumb">▶</div><b>${v[0]}</b><small>${v[1]}</small><span>Videoları aç ↗</span></a>`).join('')}</div>`;
    }else{
      content.innerHTML=`<div class="media-grid">${galleries.map(g=>`<div class="media-item gallery-item"><img src="${g[1]}" alt="${g[0]}"><b>${g[0]}</b></div>`).join('')}</div>`;
    }
    modal.classList.add('show');
    document.body.classList.add('modal-open');
  }
  function closeMedia(){modal.classList.remove('show');document.body.classList.remove('modal-open')}
  document.querySelector('#videoCard')?.addEventListener('click',()=>openMedia('video'));
  document.querySelector('#galleryCard')?.addEventListener('click',()=>openMedia('gallery'));
  document.querySelector('#mediaClose')?.addEventListener('click',closeMedia);
  modal.addEventListener('click',e=>{if(e.target===modal)closeMedia()});
  window.ISCloseMedia=closeMedia;
})();

/* V53: Ziyaret sayacı API gelmezse bu cihazda da çalışır. */
(function initVisitorFallback(){
  const totalEl=document.querySelector('#visitorTotal');
  const todayEl=document.querySelector('#visitorToday');
  const totalKey='ionenspiegel-local-total';
  const dayKey='ionenspiegel-local-day';
  const todayKey='ionenspiegel-local-today';
  const now=new Date();
  const day=now.toLocaleDateString('sv-SE',{timeZone:'Europe/Istanbul'});
  let total=Number(localStorage.getItem(totalKey)||0)+1;
  let today=Number(localStorage.getItem(todayKey)||0);
  if(localStorage.getItem(dayKey)!==day){today=1;localStorage.setItem(dayKey,day)}else today+=1;
  localStorage.setItem(totalKey,String(total));
  localStorage.setItem(todayKey,String(today));
  if(totalEl)totalEl.textContent=total.toLocaleString('tr-TR');
  if(todayEl)todayEl.textContent=today.toLocaleString('tr-TR');
})();

/* V53: Anket seçeneklerini her durumda görünür ve tıklanabilir hale getir. */
(function ensurePoll(){
  const box=document.querySelector('#playerPoll');
  if(!box)return;
  if(!box.children.length){
    const poll=[['İlhan Fakılı','Beşiktaş'],['Václav Černý','Beşiktaş'],['Amir Murillo','Beşiktaş'],['Ernest Poku','Beşiktaş']];
    box.innerHTML=poll.map((x,i)=>`<button class="poll-option" type="button" data-poll="${i}"><span>${x[0]}</span><small>${x[1]}</small></button>`).join('');
  }
})();

/* V53: Yorumlar statik sürümde yerel tutulur, sahte e-posta vaadi yok. */
(function localCommentsFallback(){
  const list=document.querySelector('#commentList');
  const add=document.querySelector('#commentAdd');
  if(!list||!add)return;
  const key='ionenspiegel-local-comments';
  function render(){
    let arr=[];try{arr=JSON.parse(localStorage.getItem(key)||'[]')}catch(_){}
    if(!arr.length){list.innerHTML='<small class="muted">Henüz yorum yok. Bu cihazda saklanır.</small>';return}
    list.innerHTML=arr.slice().reverse().map(c=>`<div class="comment-item"><b>${String(c.name).replace(/[&<>"']/g,'')}</b><small>${String(c.date).replace(/[&<>"']/g,'')}</small><p>${String(c.text).replace(/[&<>"']/g,'')}</p></div>`).join('');
  }
  add.addEventListener('click',()=>{
    const n=document.querySelector('#commentName')?.value.trim();
    const t=document.querySelector('#commentText')?.value.trim();
    if(!n||!t)return;
    let arr=[];try{arr=JSON.parse(localStorage.getItem(key)||'[]')}catch(_){}
    arr.push({name:n.slice(0,60),text:t.slice(0,1000),date:new Date().toLocaleDateString('tr-TR')});
    localStorage.setItem(key,JSON.stringify(arr.slice(-30)));
    render();
  },true);
  render();
})();

/* V53: giriş yalnızca "yakında" bilgisini gösterir. */
document.querySelector('#loginBtn')?.addEventListener('click',()=>{
  document.querySelector('#loginModal')?.classList.add('show');
  document.body.classList.add('modal-open');
});
document.querySelector('#loginModal')?.querySelectorAll('[data-close-modal],.close-btn').forEach(b=>b.addEventListener('click',()=>{
  document.querySelector('#loginModal')?.classList.remove('show');
  document.body.classList.remove('modal-open');
}));

/* ---------- OWN JSON NEWS FEED ---------- */
const IONENSPIEGEL_NEWS_FALLBACK=[{"id":"bjk-marseille-result","title":"Beşiktaş, Marsilya'yı 4-1 mağlup etti","description":"Beşiktaş, UEFA Avrupa Ligi'nin ilk haftasında Marsilya'yı 4-1 yenerek turnuvaya galibiyetle başladı.","category":"Beşiktaş","date":"18 Eylül 2026","image":"./photo-bjk.jpg","source":"Anadolu Ajansı","link":"https://mobile.aa.com.tr/tr/spor/besiktas-olimpik-marsilyayi-maglup-etti/4060572"},{"id":"el-matchday1","title":"UEFA Avrupa Ligi'nde ilk hafta maçları sona erdi","description":"İlk haftada 9 karşılaşma oynandı. Beşiktaş 4-1, Juventus 5-0 ve Bournemouth 2-1 kazandı.","category":"Avrupa","date":"18 Eylül 2026","image":"./photo-europa.jpg","source":"Anadolu Ajansı","link":"https://h.aa.com.tr/tr/spor/-uefa-avrupa-liginde-ilk-hafta-maclari-sona-erdi/4060642"},{"id":"trabzon-gs-derbi","title":"Trabzonspor-Galatasaray derbisi yarın","description":"Trabzonspor ile Galatasaray, 19 Eylül Cumartesi saat 20.00'de Papara Park'ta karşılaşacak.","category":"Süper Lig","date":"18 Eylül 2026","image":"./photo-derbi.jpg","source":"Anadolu Ajansı","link":"https://www.aa.com.tr/tr/spor/galatasaray-super-ligde-yarin-trabzonspora-konuk-olacak/4060720"},{"id":"trabzon-gs-randevu","title":"Trabzonspor-Galatasaray rekabetinde 144. randevu","description":"İki takım 19 Eylül'deki mücadeleyle resmi ve özel maçlarda 144. kez karşılaşacak.","category":"Süper Lig","date":"18 Eylül 2026","image":"./photo-derbi.jpg","source":"Anadolu Ajansı","link":"https://www.aa.com.tr/tr/spor/trabzonspor-galatasaray-rekabetinde-144-randevu/4060865"},{"id":"fener-asensio","title":"Fenerbahçe'de Asensio Eyüpspor maçının kadrosunda","description":"Fenerbahçe, Marco Asensio'nun 20 Eylül'deki Eyüpspor karşılaşmasının kadrosunda yer alacağını açıkladı.","category":"Fenerbahçe","date":"17 Eylül 2026","image":"./photo-asensio.jpg","source":"beIN SPORTS Türkiye","link":"https://beinsports.com.tr/haber/fenerbahceden-marco-asensio-aciklamasi"},{"id":"superlig-program","title":"Süper Lig'de 6. haftanın programı","description":"Kasımpaşa-Konyaspor maçı 18 Eylül Cuma saat 20.00'de başlayacak. Trabzonspor-Galatasaray derbisi 19 Eylül'de oynanacak.","category":"Süper Lig","date":"18 Eylül 2026","image":"./photo-superlig.jpg","source":"Anadolu Ajansı","link":"https://www.aa.com.tr/tr/spor/futbolda-haftanin-programi/4060705"},{"id":"juventus-nec","title":"Juventus, NEC Nijmegen'i 5-0 yendi","description":"Juventus, Avrupa Ligi'nin ilk haftasında NEC Nijmegen'i 5-0 mağlup etti.","category":"Avrupa","date":"17 Eylül 2026","image":"./photo-juventus.jpg","source":"Juventus","link":"https://www.juventus.com/en/news/articles/bianconeri-put-five-past-nec-in-the-europa-league"},{"id":"bournemouth-real","title":"Bournemouth, Avrupa macerasına galibiyetle başladı","description":"Bournemouth, Real Sociedad'ı deplasmanda 2-1 mağlup ederek Avrupa Ligi'ne galibiyetle başladı.","category":"Avrupa","date":"17 Eylül 2026","image":"./photo-bournemouth.jpg","source":"Sky Sports","link":"https://www.skysports.com/football/real-sociedad-vs-bournemouth/report/577757"},{"id":"bjk-hoffenheim","title":"Beşiktaş'ın sıradaki Avrupa rakibi Hoffenheim kaybetti","description":"Hoffenheim, 17 Eylül'de OFI Crete'e 2-0 mağlup oldu. Beşiktaş, 15 Ekim'de Hoffenheim'a konuk olacak.","category":"Beşiktaş","date":"18 Eylül 2026","image":"./photo-hoffenheim.jpg","source":"UEFA","link":"https://www.uefa.com/uefaeuropaleague/clubs/2600431/matches/"}];
function renderOwnNewsItems(items, status){
  const feed=document.querySelector('#newsFeed');
  if(!feed) return;
  const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  feed.innerHTML=items.map(item=>{
    const team=liveNewsTeam(item);
    const id=esc(item.id||item.title);
    const img=esc((item.image||'./local-6.svg').replace(/^\.\.\//,'./'));
    const desc=esc(item.description||'Haberin ayrıntıları için kaynak sayfasını aç.');
    const link=esc(item.link||'#');
    const source=esc(item.source||'İonenSpiegel');
    const category=esc(item.category||'FUTBOL');
    const date=esc(item.date||'');
    return `<article class="news-row has-bookmark" data-news-id="${id}" data-team="${esc(team)}" data-search="${esc(item.title+' '+(item.description||''))}"><button class="bookmark-btn" type="button" aria-label="Haberi kaydet" title="Sonra oku">🔖</button><div class="thumb"><img src="${img}" alt="${esc(item.title)}" loading="lazy"></div><div><div class="news-kicker">${date} · ${category}</div><h3>${esc(item.title)}</h3><p>${desc}</p><a href="${link}" target="_blank" rel="noopener noreferrer">${source} ↗</a></div></article>`;
  }).join('');
  sortNewsByFavorite();
  updateBookmarkButtons();
  $$('.news-row.has-bookmark').forEach(function(article){
    article.addEventListener('click',function(e){
      if(e.target.closest('.bookmark-btn') || e.target.closest('a')) return;
      openArticle(article);
    });
  });
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
/* V54: Haber filtreleri */
(function initNewsChips(){
  const chips=document.querySelectorAll('#newsChips .news-chip');
  const feed=document.querySelector('#newsFeed');
  if(!chips.length||!feed)return;
  function apply(filter){
    chips.forEach(c=>{const on=c.dataset.newsFilter===filter;c.classList.toggle('active',on);c.setAttribute('aria-selected',on?'true':'false')});
    feed.querySelectorAll('.news-row').forEach(row=>{
      if(filter==='all'){row.style.display='grid';return}
      const team=(row.dataset.team||'').toLocaleLowerCase('tr-TR');
      const text=(row.dataset.search||row.textContent||'').toLocaleLowerCase('tr-TR');
      let ok=team.includes(filter.toLocaleLowerCase('tr-TR'));
      if(filter==='Avrupa') ok=team==='avrupa' || text.includes('avrupa ligi') || text.includes('şampiyonlar ligi');
      row.style.display=ok?'grid':'none';
    });
  }
  chips.forEach(c=>c.addEventListener('click',()=>apply(c.dataset.newsFilter||'all')));
  apply('all');
})();

document.addEventListener('DOMContentLoaded',()=>loadOwnJsonNews(false));

/* V30 DAILY VERIFIED NEWS FALLBACK: local JSON is the single source for the homepage feed. */


/* V52 FIXTURE FILTER: filters the existing fixture markup without changing the page structure. */
(function(){
  function applyFixtureFilter(filter){
    const root=document.querySelector('#maclar');
    if(!root)return;
    root.querySelectorAll('.fixture-match').forEach(function(match){
      const cats=(match.getAttribute('data-fixture-category')||'').split(/\s+/);
      let show=true;
      const text=(match.textContent||'').toLocaleLowerCase('tr-TR');
      if(filter==='today') show=cats.includes('today') || match.closest('.fixture-day')?.dataset.fixtureDay==='today';
      else if(filter==='turkiye') show=cats.includes('turkiye');
      else if(filter==='avrupa') show=cats.includes('avrupa');
      else if(filter==='bjk') show=cats.includes('bjk') || text.includes('beşiktaş');
      match.style.display=show?'grid':'none';
      match.setAttribute('aria-hidden',show?'false':'true');
    });
    root.querySelectorAll('.fixture-day').forEach(function(day){
      const visible=[...day.querySelectorAll('.fixture-match')].some(function(m){
        return m.style.display!=='none';
      });
      day.style.display=visible?'block':'none';
    });
    root.querySelectorAll('.fixture-filter').forEach(function(btn){
      const active=btn.getAttribute('data-fixture-filter')===filter;
      btn.classList.toggle('active',active);
      btn.setAttribute('aria-selected',active?'true':'false');
    });
  }

  function initFixtureFilters(){
    const root=document.querySelector('#maclar');
    if(!root)return;
    root.querySelectorAll('.fixture-filter').forEach(function(btn){
      btn.addEventListener('click',function(e){
        e.preventDefault();
        e.stopPropagation();
        applyFixtureFilter(btn.getAttribute('data-fixture-filter')||'all');
      });
    });
    applyFixtureFilter('all');
  }

  function removeLegacyMobileStrip(){
    document.querySelectorAll('.mobile-team-strip').forEach(function(el){el.remove();});
  }

  function initV52(){
    initFixtureFilters();
    removeLegacyMobileStrip();
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',initV52);
  else initV52();
  window.ISFilterFixtures=applyFixtureFilter;
})();


/* Daha Fazla: reference-inspired functionality */
(function(){
  const $=s=>document.querySelector(s);
  const body=document.body;

  function applyTheme(){
    const dark=localStorage.getItem("ionenspiegel-theme")==="dark";
    body.classList.toggle("dark",dark);
    const el=$("#themeStatus");if(el)el.textContent=dark?"Aktif":"Kapalı";
  }
  applyTheme();
  $("#darkThemeCard")?.addEventListener("click",()=>{
    localStorage.setItem("ionenspiegel-theme",body.classList.contains("dark")?"light":"dark");
    applyTheme();
  });

  const teams=[
    ["Fenerbahçe","Süper Lig","news-asensio.jpg"],["Galatasaray","Süper Lig","news-derbi.jpg"],
    ["Beşiktaş","Süper Lig","news-bjk.jpg"],["Trabzonspor","Süper Lig","news-derbi.jpg"],
    ["Başakşehir","Süper Lig","news-superlig.jpg"],["Kasımpaşa","Süper Lig","news-superlig.jpg"],
    ["Çaykur Rizespor","Süper Lig","news-superlig.jpg"],["Kocaelispor","Süper Lig","news-superlig.jpg"],
    ["Samsunspor","Süper Lig","news-superlig.jpg"],["Antalyaspor","Süper Lig","news-superlig.jpg"],
    ["Göztepe","Süper Lig","news-superlig.jpg"],["Amed Sportif Faaliyetler","1. Lig","news-superlig.jpg"]
  ];
  const modal=$("#favoriteModal"),picker=$("#teamPicker"),search=$("#teamSearch");
  let pending=localStorage.getItem("ionenspiegel-favorite-team")||"";

  function renderTeams(filter=""){
    if(!picker)return;
    const list=teams.filter(t=>t[0].toLocaleLowerCase("tr-TR").includes(filter.toLocaleLowerCase("tr-TR")));
    picker.innerHTML=list.map(t=>`
      <button class="ref-team ${pending===t[0]?"selected":""}" type="button" data-team="${t[0]}">
        <img src="${t[2]}" alt=""><strong>${t[0]}</strong>
      </button>`).join("") || `<p style="grid-column:1/-1;color:#9da3ac;font-size:11px">Takım bulunamadı.</p>`;
    picker.querySelectorAll("[data-team]").forEach(b=>b.onclick=()=>{
      pending=b.dataset.team;
      picker.querySelectorAll(".ref-team").forEach(x=>x.classList.remove("selected"));
      b.classList.add("selected");
    });
  }
  function updateFavorite(){
    const value=localStorage.getItem("ionenspiegel-favorite-team")||"Seçilmedi";
    const s=$("#favoriteStatus");if(s)s.textContent=value;
  }
  updateFavorite();
  $("#favoriteCard")?.addEventListener("click",()=>{
    pending=localStorage.getItem("ionenspiegel-favorite-team")||"";
    renderTeams(search?.value||"");
    modal?.classList.add("open");
    modal?.setAttribute("aria-hidden","false");
  });
  search?.addEventListener("input",()=>renderTeams(search.value));
  $("#saveFavoriteTeam")?.addEventListener("click",()=>{
    if(pending)localStorage.setItem("ionenspiegel-favorite-team",pending);
    updateFavorite();
    modal?.classList.remove("open");
    modal?.setAttribute("aria-hidden","true");
  });
  $("#favoriteClose")?.addEventListener("click",()=>{
    modal?.classList.remove("open");modal?.setAttribute("aria-hidden","true");
  });
  modal?.addEventListener("click",e=>{if(e.target===modal)$("#favoriteClose").click()});

  function notificationStatus(){
    const s=$("#notificationStatus");if(!s)return;
    if(!("Notification" in window)){s.textContent="Desteklenmiyor";return}
    s.textContent=Notification.permission==="granted"?"Aktif":Notification.permission==="denied"?"Engellendi":"Kapalı";
  }
  notificationStatus();
  $("#notificationCard")?.addEventListener("click",async()=>{
    if(!("Notification" in window)){notificationStatus();return}
    try{
      const p=await Notification.requestPermission();
      notificationStatus();
      if(p==="granted")new Notification("İonenSpiegel",{body:"Bildirimler aktif. Yeni futbol haberlerini kaçırma."});
    }catch(e){notificationStatus()}
  });
})();

/* V58 BUTTON REPAIR
   Visible controls in the current mobile design use newer IDs/classes while
   legacy listeners still target older controls. This layer binds the visible
   controls without removing the existing news/fixture logic.
*/
(function initV58ButtonRepair(){
  const q=(s,r=document)=>r.querySelector(s);
  const qa=(s,r=document)=>[...r.querySelectorAll(s)];
  const say=(m)=>{try{if(typeof toast==='function')toast(m)}catch(e){}};
  const more=q('#daha-fazla');

  // Top and drawer controls.
  q('#mobileMenu')?.addEventListener('click',()=>typeof openDrawer==='function'&&openDrawer(),true);
  q('#menuBtn')?.addEventListener('click',()=>typeof openDrawer==='function'&&openDrawer(),true);
  q('#drawerClose')?.addEventListener('click',()=>typeof closeDrawer==='function'&&closeDrawer(),true);
  q('#drawerBackdrop')?.addEventListener('click',()=>typeof closeDrawer==='function'&&closeDrawer(),true);
  q('#searchOpen')?.addEventListener('click',()=>{q('#searchModal')?.classList.add('show');q('#globalSearch')?.focus()},true);
  q('#globalSearchBtn')?.addEventListener('click',()=>typeof globalSearch==='function'&&globalSearch(),true);
  q('#loginBtn')?.addEventListener('click',()=>q('#loginModal')?.classList.add('show'),true);

  // Visible theme card.
  const theme=q('#darkThemeCard',more);
  function refreshThemeCard(){
    const dark=document.documentElement.classList.contains('dark-theme');
    const status=q('#themeStatus',more);
    const title=theme?.querySelector('strong');
    const sub=theme?.querySelector('small');
    if(status)status.textContent=dark?'Açık':'Kapalı';
    if(title)title.textContent=dark?'Açık Tema':'Koyu Tema';
    if(sub)sub.textContent=dark?'Gündüz okuma görünümü':'Gece okuma görünümü';
  }
  theme?.addEventListener('click',()=>{
    const dark=document.documentElement.classList.contains('dark-theme');
    document.documentElement.classList.toggle('dark-theme',!dark);
    localStorage.setItem('ionenspiegel-theme',dark?'light':'dark');
    q('#themeColorMeta')?.setAttribute('content',dark?'#e50914':'#111419');
    refreshThemeCard();
    say(dark?'Açık tema aktif':'Koyu tema aktif');
  });
  refreshThemeCard();

  // Visible favorite-team modal. The page also contains a legacy picker, so
  // deliberately scope this renderer to the new modal.
  const favModal=q('#favoriteModal');
  const favGrid=q('#teamPicker',favModal);
  const favSearch=q('#teamSearch',favModal);
  const favSave=q('#saveFavoriteTeam',favModal);
  const favClose=q('#favoriteClose',favModal);
  let pending=localStorage.getItem('ionenspiegel-favorite-team')||'';
  const fallbackTeams=['Beşiktaş','Fenerbahçe','Galatasaray','Trabzonspor','Konyaspor','Çorum FK','Başakşehir','Göztepe','Kocaelispor','Samsunspor','Gençlerbirliği','Amed Sportif Faaliyetler','Kasımpaşa','Çaykur Rizespor','Alanyaspor','Eyüpspor'];
  function teamList(){return typeof allTeams!=='undefined'?allTeams:fallbackTeams}
  function renderTeams(){
    if(!favGrid)return;
    const term=(favSearch?.value||'').trim().toLocaleLowerCase('tr-TR');
    const list=teamList().filter(t=>!term||t.toLocaleLowerCase('tr-TR').includes(term));
    favGrid.innerHTML=list.map(t=>'<button type="button" class="team-choice '+(t===pending?'selected':'')+'" data-v58-team="'+t.replace(/"/g,'&quot;')+'"><strong>'+t+'</strong><small>'+(t===pending?'SEÇİLİ':'Favori takım')+'</small></button>').join('');
    qa('[data-v58-team]',favGrid).forEach(b=>b.addEventListener('click',()=>{
      pending=b.dataset.v58Team;
      qa('[data-v58-team]',favGrid).forEach(x=>x.classList.toggle('selected',x===b));
    }));
  }
  function openFavorite(){
    renderTeams();
    favModal?.classList.add('open');
    favModal?.setAttribute('aria-hidden','false');
    document.body.classList.add('modal-open');
    favSearch?.focus();
  }
  function closeFavorite(){
    favModal?.classList.remove('open');
    favModal?.setAttribute('aria-hidden','true');
    document.body.classList.remove('modal-open');
  }
  favSearch?.addEventListener('input',renderTeams);
  favClose?.addEventListener('click',closeFavorite);
  favModal?.addEventListener('click',e=>{if(e.target===favModal)closeFavorite()});
  favSave?.addEventListener('click',()=>{
    if(!pending){say('Önce bir takım seç');return}
    localStorage.setItem('ionenspiegel-favorite-team',pending);
    try{if(typeof applyFavoriteTeam==='function')applyFavoriteTeam(pending)}catch(e){}
    const status=q('#favoriteStatus',more);
    if(status)status.textContent=pending;
    closeFavorite();
    say(pending+' favori takımın olarak kaydedildi');
  });
  qa('#favoriteCard').forEach(b=>b.addEventListener('click',openFavorite));
  const favStatus=q('#favoriteStatus',more);
  if(favStatus)favStatus.textContent=pending||'Seçilmedi';

  // Visible notification card.
  async function notifications(){
    if(!('Notification' in window)){say('Bu tarayıcı bildirimleri desteklemiyor');return}
    try{
      const p=Notification.permission==='default'?await Notification.requestPermission():Notification.permission;
      const status=q('#notificationStatus',more);
      if(status)status.textContent=p==='granted'?'Aktif':p==='denied'?'Engellendi':'Kapalı';
      say(p==='granted'?'Bildirimler açıldı':'Bildirim izni verilmedi');
    }catch(e){say('Bildirim izni alınamadı')}
  }
  qa('#notificationCard').forEach(b=>b.addEventListener('click',notifications));
  const ns=q('#notificationStatus',more);
  if(ns&&'Notification' in window)ns.textContent=Notification.permission==='granted'?'Aktif':Notification.permission==='denied'?'Engellendi':'Kapalı';

  // Visible video/gallery cards are links without legacy IDs.
  const media=q('#mediaModal'), content=q('#mediaContent'), title=q('#mediaTitle');
  function openMedia(mode){
    if(!media||!content)return;
    if(title)title.textContent=mode==='video'?'Video':'Galeri';
    if(mode==='video'){
      const items=[
        ['Beşiktaş 4-1 Marsilya','Beşiktaş · Avrupa Ligi','https://www.youtube.com/results?search_query=Be%C5%9Fikta%C5%9F+Marsilya+4-1'],
        ['Avrupa Ligi ilk hafta','UEFA Avrupa Ligi','https://www.youtube.com/results?search_query=UEFA+Europa+League+2026+highlights'],
        ['Trabzonspor-Galatasaray','Süper Lig derbisi','https://www.youtube.com/results?search_query=Trabzonspor+Galatasaray+19+Eyl%C3%BCl+2026']
      ];
      content.innerHTML='<div class="media-grid">'+items.map(v=>'<a class="media-item" href="'+v[2]+'" target="_blank" rel="noopener"><div class="media-thumb">▶</div><b>'+v[0]+'</b><small>'+v[1]+'</small><span>Videoları aç ↗</span></a>').join('')+'</div>';
    }else{
      const items=[['Beşiktaş 4-1 Marsilya','./hero-bjk.jpg'],['Avrupa kupaları','./photo-europa.jpg'],['Süper Lig','./photo-superlig.jpg']];
      content.innerHTML='<div class="media-grid">'+items.map(v=>'<div class="media-item gallery-item"><img src="'+v[1]+'" alt="'+v[0]+'"><b>'+v[0]+'</b></div>').join('')+'</div>';
    }
    media.classList.add('show');document.body.classList.add('modal-open');
  }
  qa('#daha-fazla .simple-feature').forEach(a=>{
    const t=(a.textContent||'').toLocaleLowerCase('tr-TR');
    if(t.includes('video'))a.addEventListener('click',e=>{e.preventDefault();openMedia('video')});
    if(t.includes('galeri'))a.addEventListener('click',e=>{e.preventDefault();openMedia('gallery')});
  });

  // News chips.
  qa('#newsChips .news-chip').forEach(chip=>chip.addEventListener('click',()=>{
    const f=chip.dataset.newsFilter||'all';
    qa('#newsChips .news-chip').forEach(x=>x.classList.toggle('active',x===chip));
    qa('#newsFeed .news-row').forEach(row=>{
      if(f==='all'){row.style.display='grid';return}
      const team=(row.dataset.team||'').toLocaleLowerCase('tr-TR');
      const text=(row.dataset.search||row.textContent||'').toLocaleLowerCase('tr-TR');
      const key=f.toLocaleLowerCase('tr-TR');
      row.style.display=(team.includes(key)||(f==='Avrupa'&&(text.includes('avrupa ligi')||text.includes('şampiyonlar ligi'))))?'grid':'none';
    });
  }));

  q('#refreshNews')?.addEventListener('click',()=>{if(typeof loadOwnJsonNews==='function')loadOwnJsonNews(true);else say('Haber akışı yenileniyor')});
  q('#backTop')?.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));

  // Bottom navigation and drawer anchors.
  qa('.mobile-nav a[href^="#"],.desktop-nav a[href^="#"],.drawer a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{
    const h=a.getAttribute('href');const target=h&&q(h);
    if(target){e.preventDefault();target.scrollIntoView({behavior:'smooth',block:'start'});if(typeof closeDrawer==='function')closeDrawer()}
  }));

  qa('#daha-fazla button,#daha-fazla a,.mobile-nav button,.mobile-nav a').forEach(el=>{el.style.pointerEvents='auto';el.style.touchAction='manipulation'});
})();
