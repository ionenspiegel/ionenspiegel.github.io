/* İonenSpiegel V33 - doğrudan canlı skor düzeltmesi */
(function(){
  'use strict';
  const API='https://site.api.espn.com/apis/site/v2/sports/soccer/uefa.europa/scoreboard';
  let current=null;

  function ymd(){
    const d=new Date();
    return d.getFullYear()+String(d.getMonth()+1).padStart(2,'0')+String(d.getDate()).padStart(2,'0');
  }
  function tr(s){
    return String(s||'').toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  }
  function isMatch(e){
    const c=e?.competitions?.[0]?.competitors||[];
    const names=[e?.name||'',...c.map(x=>x?.team?.displayName||x?.team?.shortDisplayName||'')].join(' ');
    const n=tr(names);
    return (n.includes('besiktas')) && n.includes('marseille');
  }
  function getMatch(e){
    const c=e?.competitions?.[0]?.competitors||[];
    const home=c.find(x=>x.homeAway==='home')||c[0]||{};
    const away=c.find(x=>x.homeAway==='away')||c[1]||{};
    const s=e?.status||{};
    return {
      home:home?.team?.displayName||'Beşiktaş', away:away?.team?.displayName||'Marseille',
      hs:home?.score ?? '0', as:away?.score ?? '0',
      clock:s.displayClock||'', detail:s.type?.shortDetail||s.type?.detail||'Canlı',
      state:s.type?.state||'', date:e?.date||'', id:String(e?.id||''),
      homeLogo:home?.team?.logo||'', awayLogo:away?.team?.logo||''
    };
  }
  function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
  function img(src,alt){return src?'<img src="'+esc(src)+'" alt="'+esc(alt)+'" loading="lazy">':'';}

  function render(m){
    current=m||null;
    const list=document.getElementById('liveScoreList');
    const clock=document.getElementById('liveClock');
    if(!list)return;
    const pulse=document.querySelector('.live-pulse');
    if(!m){
      pulse?.classList.add('inactive');
      if(clock) clock.textContent='--:--';
      list.innerHTML='<div class="no-live-match"><span>⚽</span><strong>Şu anda canlı maç yok</strong><small>Oynanan maçlar burada otomatik listelenecek.</small></div>';
      return;
    }
    pulse?.classList.remove('inactive');
    if(clock) clock.textContent=m.clock||'CANLI';
    list.innerHTML='<div class="live-match-card">'+
      '<div class="live-league"><span>● CANLI</span><small>UEFA AVRUPA LİGİ</small></div>'+
      '<div class="live-teams">'+
        '<div class="live-team">'+img(m.homeLogo,m.home)+'<b>'+esc(m.home)+'</b></div>'+ 
        '<div class="live-score"><strong>'+esc(m.hs)+' - '+esc(m.as)+'</strong><span>'+esc(m.clock||m.detail||'CANLI')+'</span></div>'+ 
        '<div class="live-team">'+img(m.awayLogo,m.away)+'<b>'+esc(m.away)+'</b></div>'+ 
      '</div>'+ 
      '<small class="live-status">'+esc(m.detail||'Canlı')+'</small>'+ 
    '</div>';
  }

  function renderModal(){
    const box=document.getElementById('timelineMatches');
    const title=document.getElementById('timelineTitle');
    const timeline=document.getElementById('matchTimeline');
    if(!box||!timeline)return;
    if(!current){
      if(title) title.textContent='Canlı Maçlar';
      box.innerHTML='<div class="no-live-match"><span>⚽</span><strong>Maç verisi alınamadı</strong><small>Canlı skor servisi yanıt verdiğinde burada görünecek.</small></div>';
      timeline.innerHTML='';
      return;
    }
    if(title) title.textContent=current.home+' - '+current.away;
    box.innerHTML='<div class="live-match-card modal-live-card">'+
      '<div class="live-league"><span>● CANLI</span><small>UEFA AVRUPA LİGİ</small></div>'+
      '<div class="live-teams">'+
        '<div class="live-team">'+img(current.homeLogo,current.home)+'<b>'+esc(current.home)+'</b></div>'+ 
        '<div class="live-score"><strong>'+esc(current.hs)+' - '+esc(current.as)+'</strong><span>'+esc(current.clock||current.detail||'CANLI')+'</span></div>'+ 
        '<div class="live-team">'+img(current.awayLogo,current.away)+'<b>'+esc(current.away)+'</b></div>'+ 
      '</div>'+ 
      '<small class="live-status">'+esc(current.detail||'Canlı')+'</small>'+ 
    '</div>';
    timeline.innerHTML='<div class="timeline-empty">Maç olayları ESPN verisi geldiğinde burada gösterilecek.</div>';
  }

  function updateCountdown(){
    const target=new Date('2026-09-17T22:00:00+03:00').getTime();
    if(Date.now()>=target && current){
      const card=document.querySelector('.countdown');
      if(card){
        const grid=card.querySelector('.count-grid');
        if(grid) grid.innerHTML='<div style="grid-column:1/-1"><b style="font-size:28px">CANLI</b><small>BEŞİKTAŞ - MARSEILLE</small></div>';
      }
    }
  }

  async function refresh(){
    try{
      const r=await fetch(API+'?dates='+ymd()+'&_='+Date.now(),{cache:'no-store',credentials:'omit'});
      if(!r.ok) throw new Error('HTTP '+r.status);
      const data=await r.json();
      const e=(data.events||[]).find(isMatch);
      if(!e){ render(null); return; }
      const m=getMatch(e);
      const start=Date.parse(m.date||'');
      const now=Date.now();
      if(m.state==='in' || (m.state==='pre' && Number.isFinite(start) && start<=now && now-start<3*60*60*1000)) render(m);
      else render(null);
      renderModal();
      updateCountdown();
    }catch(err){
      console.warn('İonenSpiegel canlı skor:',err);
    }
  }

  document.addEventListener('click',function(ev){
    const w=ev.target.closest('#liveScoreWidget');
    if(w){setTimeout(renderModal,30);}
  });
  const modal=document.getElementById('timelineModal');
  if(modal){new MutationObserver(()=>{if(modal.classList.contains('show')) renderModal();}).observe(modal,{attributes:true,attributeFilter:['class']});}
  refresh();
  setInterval(refresh,10000);
})();
