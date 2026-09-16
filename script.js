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
$$('.team-link, .mobile-team-strip button[data-team]').forEach(b=>b.addEventListener('click',()=>filterTeam(b.dataset.team)));
$('#moreTeams')?.addEventListener('click',()=>{openDrawer()});

/* ---------- NEWS BOOKMARKS ---------- */
function articleData(article){const img=article.querySelector('img');const h=article.querySelector('h3');const p=article.querySelector('p');const source=article.querySelector('a');const kicker=article.querySelector('.news-kicker');return{id:article.dataset.newsId,title:h?.textContent.trim()||'Haber',team:article.dataset.team||'',text:p?.textContent.trim()||'',source:source?.href||'#',image:img?.src||'',kicker:kicker?.textContent.trim()||'',savedAt:Date.now()}}
function isSaved(id){return getSaved().some(x=>x.id===id)}
function updateBookmarkButtons(){ $$('.news-row.has-bookmark').forEach(a=>{const b=a.querySelector('.bookmark-btn');if(!b)return;const saved=isSaved(a.dataset.newsId);b.classList.toggle('saved',saved);b.textContent=saved?'🔖':'🔖';b.setAttribute('aria-label',saved?'Kaydedilenlerden çıkar':'Haberi kaydet');})}
function toggleBookmark(article){const id=article.dataset.newsId;let saved=getSaved();if(saved.some(x=>x.id===id)){saved=saved.filter(x=>x.id!==id);toast('Haber kaydedilenlerden çıkarıldı')}else{saved.unshift(articleData(article));toast('Haber “Sonra Oku”ya kaydedildi')}setSaved(saved);updateBookmarkButtons();renderSavedNews()}
$$('.news-row.has-bookmark').forEach(a=>a.querySelector('.bookmark-btn')?.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();toggleBookmark(a)}));

const savedModal=$('#savedModal');
function renderSavedNews(){const box=$('#savedNewsList');if(!box)return;const saved=getSaved();if(!saved.length){box.innerHTML='<div class="saved-empty">🔖<br><br>Henüz kaydedilmiş haber yok.<br><small>Haberlerin sağ üstündeki yer imi düğmesine dokun.</small></div>';return}box.innerHTML=saved.map(x=>`<article class="saved-news-card"><img src="${x.image}" alt=""><div><small>${x.kicker}</small><h3>${x.title}</h3><a href="${x.source}" target="_blank" rel="noopener">Kaynağı aç ↗</a></div><button class="saved-remove" type="button" data-remove-saved="${x.id}" aria-label="Kaydı kaldır">×</button></article>`).join('');$$('[data-remove-saved]').forEach(b=>b.addEventListener('click',()=>{setSaved(getSaved().filter(x=>x.id!==b.dataset.removeSaved));renderSavedNews();updateBookmarkButtons();toast('Kayıt kaldırıldı')}))}
function openSaved(){renderSavedNews();savedModal?.classList.add('show');document.body.classList.add('modal-open');closeDrawer()}
function closeSaved(){savedModal?.classList.remove('show');document.body.classList.remove('modal-open')}
$('#savedNewsMenu')?.addEventListener('click',openSaved);$('#savedCard')?.addEventListener('click',openSaved);$('#savedClose')?.addEventListener('click',closeSaved);savedModal?.addEventListener('click',e=>{if(e.target===savedModal)closeSaved()});

/* ---------- HERO ---------- */
const slides=[
 {title:'Beşiktaş - Marseille maçına saatler kaldı',text:'Siyah-beyazlılar UEFA Avrupa Ligi lig aşamasındaki ilk maçında Marseille ile karşılaşacak.',source:'Beşiktaş JK · 16 Eylül',newsId:'bjk-marseille',bg:'linear-gradient(120deg,#000b,#0003 48%,#000c),url("https://cdn.duhuliye.com/uploads/posts/2026/02/b89c4bcf-ada5-4bcc-b7e9-2b6c32fd05fd.webp") center/cover',link:'https://bjk.com.tr/tr/fikstur/1/1/718/682/5274'},
 {title:'Thomas Reis Trabzonspor için Trabzon\'da',text:'Trabzonspor\'un anlaşmaya vardığı Alman teknik direktör Thomas Reis, 16 Eylül gündeminin öne çıkan gelişmesi oldu.',source:'Anadolu Ajansı · 16 Eylül',newsId:'thomas-reis-ts',bg:'linear-gradient(120deg,#000b,#0003 48%,#000c),url("https://imgs.stargazete.com/imgsdisk/2026/09/16/trabzonsporun-13-yabanci--383_2-41.jpg") center/cover',link:'https://www.aa.com.tr/tr/spor/thomas-reis-trabzonsporun-13-yabanci-teknik-direktoru/4058780'},
 {title:'Galatasaray liderliğini korudu',text:'Kocaelispor\'u 1-0 yenen Galatasaray, 5. hafta sonunda 13 puanla zirvede kaldı.',source:'Anadolu Ajansı · 14 Eylül',newsId:'gs-kocaeli',bg:'linear-gradient(120deg,#000b,#0003 48%,#000c),url("https://web-cdnprod.aa.com.tr/uploads/PhotoGallery/2026/09/13/thumbs_b_41381654f5168b2c208621c8c975a26b.jpg") center/cover',link:'https://www.aa.com.tr/tr/spor/galatasaray-kaptan-abdulkerimin-goluyle-kocaelisporu-1-0-yendi/4056133'},
 {title:'Fenerbahçe, Gaziantep FK deplasmanından 0-0 ile döndü',text:'5. hafta kapanışında taraflar puanları paylaştı.',source:'Anadolu Ajansı · 14 Eylül',newsId:'fb-gaziantep',bg:'linear-gradient(120deg,#000b,#0003 48%,#000c),url("https://web-cdnprod.aa.com.tr/uploads/PhotoGallery/2026/09/14/thumbs_b_08205dec22bbfebd96ecd4decf19414b.jpg") center/cover',link:'https://www.aa.com.tr/tr/spor/gaziantep-fk-ile-fenerbahce-berabere-kaldi/4057102'}
];let slideIndex=0;
function renderSlide(){const s=slides[slideIndex];const media=$('#heroMedia');if(!media)return;$('#heroTitle').textContent=s.title;$('#heroText').textContent=s.text;$('#heroSource').textContent=s.source;media.style.background=s.bg;$('#heroIndex').textContent=slideIndex+1;$('#heroRead').onclick=()=>window.open(s.link,'_blank','noopener');$$('#sliderDots i').forEach((d,i)=>d.classList.toggle('active',i===slideIndex))}
slides.forEach(s=>{const u=s.bg.match(/url\("([^"]+)/)?.[1];if(u){const i=new Image();i.src=u}});
$('#heroNext')?.addEventListener('click',()=>{slideIndex=(slideIndex+1)%slides.length;renderSlide()});$('#heroPrev')?.addEventListener('click',()=>{slideIndex=(slideIndex-1+slides.length)%slides.length;renderSlide()});let sliderTimer=setInterval(()=>$('#heroNext')?.click(),7000);$('#heroMedia')?.addEventListener('mouseenter',()=>clearInterval(sliderTimer));$('#heroMedia')?.addEventListener('mouseleave',()=>sliderTimer=setInterval(()=>$('#heroNext')?.click(),7000));renderSlide();

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
$('#todayBtn')?.addEventListener('click',()=>{document.querySelector('[data-day="16"]')?.scrollIntoView({behavior:'smooth',block:'center'});toast('16 Eylül maçları gösteriliyor')});
$('#refreshNews')?.addEventListener('click',()=>{const feed=$('#newsFeed');feed?.animate([{opacity:.4},{opacity:1}],{duration:450});sortNewsByFavorite();toast(selectedTeam?`${selectedTeam} haberleri öne alındı`:'Son haberler yenilendi')});

/* ---------- THEME: manual + system preference ---------- */
const themeCard=$('#themeCard');
function systemTheme(){return window.matchMedia?.('(prefers-color-scheme: dark)').matches?'dark':'light'}
function applyTheme(theme,save=true){const dark=theme==='dark';document.documentElement.classList.toggle('dark-theme',dark);if(save)localStorage.setItem(STORE.theme,dark?'dark':'light');if(themeCard){themeCard.querySelector('b').textContent=dark?'Açık Tema':'Koyu Tema';themeCard.querySelector('small').textContent=dark?'Gündüz okuma görünümü':'Gece okuma görünümü'}}
const storedTheme=localStorage.getItem(STORE.theme);applyTheme(storedTheme||systemTheme(),false);
themeCard?.addEventListener('click',()=>{const dark=document.documentElement.classList.contains('dark-theme');applyTheme(dark?'light':'dark',true);toast(dark?'Açık tema aktif':'Koyu tema aktif')});
window.matchMedia?.('(prefers-color-scheme: dark)').addEventListener?.('change',e=>{if(!localStorage.getItem(STORE.theme))applyTheme(e.matches?'dark':'light',false)});

/* ---------- LIVE MATCH CENTER · SCHEDULED DEMO ONLY ---------- */
/* Demo maç yalnızca kendi başlangıç-bitiş aralığı içindeyken canlı görünür. Geçmiş maç asla CANLI listesine düşmez. */
const liveMatches=[{id:'demo-live-1',comp:'Demo Süper Lig',home:'Fenerbahçe',away:'Beşiktaş',startAt:'2026-09-16T18:00:00+03:00',durationMin:95,eventsByMinute:{3:{type:'goal',icon:'⚽',title:'Gol - Beşiktaş',desc:'Hızlı hücum sonrası demo gol.'},7:{type:'yellow',icon:'🟨',title:'Sarı kart',desc:'Orta sahada faul sonrası demo kart.'},12:{type:'goal',icon:'⚽',title:'Gol - Fenerbahçe',desc:'Ev sahibi ekip skoru eşitledi.'},18:{type:'sub',icon:'🔄',title:'Oyuncu değişikliği',desc:'Teknik ekip demo değişikliğe gitti.'}}}];
function activeLiveMatches(){const now=Date.now();return liveMatches.filter(m=>{const start=new Date(m.startAt).getTime(),end=start+(m.durationMin||95)*60000;return now>=start&&now<end})}
function liveState(m){const start=new Date(m.startAt).getTime(),elapsed=Math.max(0,Math.floor((Date.now()-start)/60000));const minute=Math.min(m.durationMin||95,elapsed);let homeScore=0,awayScore=0,events=[];Object.entries(m.eventsByMinute||{}).forEach(([min,e])=>{const n=+min;if(n<=minute){if(e.type==='goal'){if(e.title.includes(m.home))homeScore++;else if(e.title.includes(m.away))awayScore++}events.push({...e,minute:n+"'"})}});return{...m,minute,homeScore,awayScore,events:events.sort((a,b)=>b.minute.localeCompare(a.minute))}}
function renderLive(){const list=$('#liveScoreList'),pulse=$('.live-pulse');if(!list)return;const active=activeLiveMatches();if(!active.length){pulse?.classList.add('inactive');list.innerHTML='<div class="no-live-match"><span>⚽</span><strong>Şu anda canlı maç yok</strong><small>Maç başladığında burada otomatik görünecek.</small></div>';return}pulse?.classList.remove('inactive');list.innerHTML=active.map(raw=>{const m=liveState(raw);return `<div class="live-match"><div class="live-match-top"><small>CANLI · ${m.minute}'</small><span class="live-minute">${m.minute}'</span></div><div class="live-teams"><span>${m.home}</span><b class="live-score">${m.homeScore} : ${m.awayScore}</b><span>${m.away}</span></div></div>`}).join('')}
function simulateLive(){renderLive();if($('#timelineModal')?.classList.contains('show'))openTimeline()}
function openTimeline(){const box=$('#matchTimeline'),matchesBox=$('#timelineMatches');if(!box||!matchesBox)return;const active=activeLiveMatches();if(!active.length){$('#timelineKicker').textContent='CANLI MAÇ MERKEZİ';$('#timelineTitle').textContent='Şu anda canlı maç yok';matchesBox.innerHTML=`<div class="live-empty-modal"><span>⚽</span><strong>Şu anda oynanan maç bulunmuyor</strong><small>Bir maç başladığında skor, dakika ve olaylar burada görünecek.</small></div>`;box.innerHTML=''}else{const states=active.map(liveState);const m=states[0];$('#timelineKicker').textContent='CANLI · GÜNCEL';$('#timelineTitle').textContent=`${m.home} ${m.homeScore} - ${m.awayScore} ${m.away}`;matchesBox.innerHTML=states.map(x=>`<div class="live-modal-match"><span>${x.minute}'</span><b>${x.home}</b><strong>${x.homeScore} : ${x.awayScore}</strong><b>${x.away}</b></div>`).join('');box.innerHTML=(m.events||[]).map(e=>`<div class="timeline-event ${e.type||''}"><span class="timeline-time">${e.minute}</span><span class="timeline-icon">${e.icon||'•'}</span><strong>${e.title}</strong><p>${e.desc||''}</p></div>`).join('')||'<div class="live-empty-modal"><span>⏱️</span><strong>Henüz olay yok</strong><small>Maç olayları gerçekleştikçe burada görünecek.</small></div>'}$('#timelineModal')?.classList.add('show');document.body.classList.add('modal-open')}
function closeTimeline(){$('#timelineModal')?.classList.remove('show');document.body.classList.remove('modal-open')}
$('#liveScoreWidget')?.addEventListener('click',openTimeline);$('#liveScoreWidget')?.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' ')openTimeline()});$('#liveScoreCard')?.addEventListener('click',openTimeline);$('#timelineClose')?.addEventListener('click',closeTimeline);$('#timelineModal')?.addEventListener('click',e=>{if(e.target.id==='timelineModal')closeTimeline()});
renderLive();setInterval(simulateLive,1000);

/* ---------- LIVE CLOCK / COUNTDOWN / SCROLL ---------- */
function updateLiveClock(){const el=$('#liveClock');if(el)el.textContent=new Intl.DateTimeFormat('tr-TR',{hour:'2-digit',minute:'2-digit',second:'2-digit'}).format(new Date())}updateLiveClock();setInterval(updateLiveClock,1000);
function countdown(){const target=new Date('2026-09-17T22:00:00+03:00').getTime(),diff=Math.max(0,target-Date.now());$('#cdDays').textContent=String(Math.floor(diff/86400000)).padStart(2,'0');$('#cdHours').textContent=String(Math.floor(diff%86400000/3600000)).padStart(2,'0');$('#cdMins').textContent=String(Math.floor(diff%3600000/60000)).padStart(2,'0');$('#cdSecs').textContent=String(Math.floor(diff%60000/1000)).padStart(2,'0')}countdown();setInterval(countdown,1000);
window.addEventListener('scroll',()=>{const max=document.documentElement.scrollHeight-innerHeight;$('#progress').style.width=(max?scrollY/max*100:0)+'%';$('#backTop').classList.toggle('show',scrollY>500)});$('#backTop')?.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));


/* ---------- V12 ARTICLE DETAIL ---------- */
const articleModal=$('#articleModal'),articleTitle=$('#articleDetailTitle'),articleMeta=$('#articleDetailMeta'),articleImage=$('#articleDetailImage'),articleBody=$('#articleDetailBody'),articleSource=$('#articleSource'),articleKicker=$('#articleDetailKicker');
const articleLongText={
 'thomas-reis-ts':['Alman teknik adam Thomas Reis ile Trabzonspor arasında anlaşmaya varıldığı yönündeki gelişme 16 Eylül gündeminin öne çıkan başlıklarından biri oldu.','Trabzonspor cephesinde teknik direktörlük koltuğu için yapılan görüşmelerin ardından Reis ismi gündemin merkezine yerleşti. Bu demo haber metni, kısa haber kartındaki bilgiyi tam ekran okuma deneyimine dönüştürmek için hazırlanmıştır.','Kulübün sezon içindeki hedefleri, kadro yapısı ve fikstür yoğunluğu yeni teknik ekibin ilk dönemindeki temel başlıklardan olacak. Haber kartındaki kaynak bağlantısı, okuyucunun ilgili dış kaynağa geçebilmesi için ayrıca korunur.'],
 'bjk-marseille':['Beşiktaş, UEFA Avrupa Ligi lig aşamasındaki ilk maçında Marseille ile karşılaşmaya hazırlanıyor. Karşılaşma 17 Eylül saat 22.00’de Tüpraş Stadyumu’nda oynanacak.','Siyah-beyazlıların maç öncesi hazırlıkları sürerken takımın Avrupa Ligi başlangıcı sezon takviminin önemli duraklarından biri olacak. Bu metin demo portalındaki tam haber görünümünü göstermek amacıyla kullanılır.','Maç merkezi, karşılaşma başladığında skor, dakika ve olay akışının ayrı bir arayüzde gösterilebilmesi için hazırlanmıştır.'],
 'gs-kocaeli':['Galatasaray, Kocaelispor karşısında aldığı 1-0’lık galibiyetle beşinci hafta sonunda 13 puana ulaştı ve zirvedeki yerini korudu.','Sezonun ilk haftalarındaki sonuçlar, Galatasaray’ın puan tablosunda üst sırada kalmasını sağladı. Bu demo içerik, haber detay sayfasında uzun okuma düzenini test etmek için kısa kart metninin genişletilmiş versiyonudur.','Haberin kaynak bağlantısı ayrıca sunularak okuyucuya dış kaynağa geçiş imkânı verilir.'],
 'fb-gaziantep':['Fenerbahçe, Süper Lig’in beşinci hafta kapanışında Gaziantep FK ile 0-0 berabere kaldı. Karşılaşmada taraflar birer puan aldı.','Bu sonuçla Fenerbahçe beş maç sonunda 7 puanda kaldı. Takımın lig performansında galibiyetlerin yanı sıra iki mağlubiyet ve bir beraberlik bulunuyor.','Tam haber görünümü, başlık ve kapak görselinin yanında kaynak, paylaşım ve uzun metin alanlarını tek ekranda birleştirmek için tasarlanmıştır.']};
function articleDataFull(a){const d=articleData(a),ps=articleLongText[d.id]||[d.text,'Bu bölüm demo portalındaki uzun haber görünümünü göstermek için kullanılır.','Kaynak bağlantısı ve paylaşım araçları haber detayının altında yer alır.'];return {...d,paragraphs:ps}}
function openArticle(article){if(!articleModal||!article)return;const d=articleDataFull(article);articleKicker.textContent=d.kicker||d.team||'HABER';articleTitle.textContent=d.title;articleMeta.textContent=`${d.team||'Futbol'} · ${new Date().toLocaleDateString('tr-TR',{day:'numeric',month:'long',year:'numeric'})}`;articleImage.src=d.image;articleImage.alt=d.title;articleBody.innerHTML=d.paragraphs.map((x,i)=>`<p class="${i===0?'article-lead':''}">${x}</p>`).join('');articleSource.href=d.source;articleModal.classList.add('show');document.body.classList.add('modal-open');setTimeout(()=>$('#articleClose')?.focus(),30)}
function closeArticle(){articleModal?.classList.remove('show');document.body.classList.remove('modal-open')}
function bindNewsInteractions(){
 $$('.news-row.has-bookmark').forEach(a=>{const b=a.querySelector('.bookmark-btn');b?.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();toggleBookmark(a)});a.addEventListener('click',e=>{if(e.target.closest('.bookmark-btn')||e.target.closest('a'))return;openArticle(a)});});
 updateBookmarkButtons();sortNewsByFavorite();
}
$('#articleClose')?.addEventListener('click',closeArticle);articleModal?.addEventListener('click',e=>{if(e.target===articleModal)closeArticle()});$('#heroRead')?.addEventListener('click',()=>{const id=slides[slideIndex]?.newsId;const a=$(`.news-row[data-news-id="${id}"]`);if(a)openArticle(a)});
const articleShare=$('#articleShare');
articleShare?.addEventListener('click',async()=>{const title=articleTitle?.textContent||'ionenspiegel';const url=location.href.split('#')[0]+'#haberler';try{if(navigator.share)await navigator.share({title,text:`${title} | ionenspiegel`,url});else throw 0;toast('Paylaşım penceresi açıldı')}catch(e){if(e?.name==='AbortError')return;try{await navigator.clipboard.writeText(url);toast('Bağlantı kopyalandı')}catch(_){toast('Bağlantı: '+url)}}});

/* ---------- V12 INSTALL PROMPT ---------- */
let deferredInstall=null;const installCard=$('#installCard');
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredInstall=e;installCard?.removeAttribute('hidden');installCard?.classList.add('ready')});
installCard?.addEventListener('click',async()=>{if(!deferredInstall){toast('Tarayıcı bu cihazda yükleme istemini sunmuyor');return}deferredInstall.prompt();const r=await deferredInstall.userChoice;if(r.outcome==='accepted')toast('Uygulama yükleme başlatıldı');deferredInstall=null;installCard.classList.remove('ready');installCard.setAttribute('hidden','hidden')});
window.addEventListener('appinstalled',()=>{deferredInstall=null;installCard?.classList.remove('ready');installCard?.setAttribute('hidden','hidden');toast('ionenspiegel yüklendi')});

/* ---------- V12 NOTIFICATIONS ---------- */
$('#notificationCard')?.addEventListener('click',async()=>{if(!('Notification' in window)){toast('Bu tarayıcı bildirimleri desteklemiyor');return}let p=Notification.permission;if(p==='default')p=await Notification.requestPermission();if(p==='granted'){toast('Bildirimler açıldı');setTimeout(()=>new Notification('ionenspiegel',{body:'Demo: Yeni futbol gelişmesi var.',icon:'icon-192.png',tag:'ionenspiegel-demo'}),3000)}else toast('Bildirim izni verilmedi')});

/* ---------- V12 OFFLINE ---------- */
const offlineBanner=$('#offlineBanner');function setOnlineState(){const off=!navigator.onLine;offlineBanner?.classList.toggle('show',off)}window.addEventListener('online',setOnlineState);window.addEventListener('offline',setOnlineState);setOnlineState();
navigator.serviceWorker?.addEventListener('message',e=>{if(e.data?.type==='OFFLINE')offlineBanner?.classList.add('show');if(e.data?.type==='ONLINE')offlineBanner?.classList.remove('show')});

/* ---------- V12 SKELETON NEWS ---------- */
function runNewsSkeleton(){const feed=$('#newsFeed');if(!feed)return;const html=feed.innerHTML;feed.classList.add('skeleton-mode');feed.setAttribute('aria-busy','true');feed.innerHTML=`<article class="news-row"><div class="thumb"></div><div><div class="news-kicker">YÜKLENİYOR</div><h3>Haber hazırlanıyor...</h3><p>İçerik yükleniyor.</p></div></article><article class="news-row"><div class="thumb"></div><div><div class="news-kicker">YÜKLENİYOR</div><h3>Haber hazırlanıyor...</h3><p>İçerik yükleniyor.</p></div></article><article class="news-row"><div class="thumb"></div><div><div class="news-kicker">YÜKLENİYOR</div><h3>Haber hazırlanıyor...</h3><p>İçerik yükleniyor.</p></div></article>`;setTimeout(()=>{feed.innerHTML=html;feed.classList.remove('skeleton-mode');feed.setAttribute('aria-busy','false');bindNewsInteractions()},650)}

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
