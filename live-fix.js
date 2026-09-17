/* İonenSpiegel V32: UEFA Avrupa Ligi canlı skor düzeltmesi */
(function(){
  const LEAGUE='uefa.europa';
  const API='https://site.api.espn.com/apis/site/v2/sports/soccer/'+LEAGUE+'/scoreboard';

  function ymd(){
    const d=new Date();
    return d.getFullYear()+String(d.getMonth()+1).padStart(2,'0')+String(d.getDate()).padStart(2,'0');
  }

  function isBjkMarseille(e){
    const c=e?.competitions?.[0]?.competitors||[];
    const names=[e?.name||'',...c.map(x=>x?.team?.displayName||x?.team?.shortDisplayName||'')]
      .join(' ').toLocaleLowerCase('tr-TR');
    return (names.includes('beşiktaş')||names.includes('besiktas')) && names.includes('marseille');
  }

  function normalize(e){
    const c=e?.competitions?.[0]?.competitors||[];
    const home=c.find(x=>x.homeAway==='home')||c[0]||{};
    const away=c.find(x=>x.homeAway==='away')||c[1]||{};
    const status=e?.status||{};
    return {
      id:String(e.id),
      league:'Avrupa Ligi', leagueSlug:LEAGUE,
      home:home?.team?.displayName||home?.team?.shortDisplayName||'Beşiktaş',
      away:away?.team?.displayName||away?.team?.shortDisplayName||'Marseille',
      homeScore:home?.score ?? '0', awayScore:away?.score ?? '0',
      homeLogo:home?.team?.logo||'', awayLogo:away?.team?.logo||'',
      minute:status.displayClock||'CANLI',
      status:status.type?.shortDetail||status.type?.detail||'Canlı',
      state:status.type?.state||'', date:e?.date||'',
      venue:e?.competitions?.[0]?.venue?.fullName||''
    };
  }

  async function refresh(){
    try{
      const r=await fetch(API+'?dates='+ymd()+'&_='+Date.now(),{cache:'no-store'});
      if(!r.ok) throw new Error('HTTP '+r.status);
      const data=await r.json();
      const events=(data.events||[]).filter(isBjkMarseille);
      const live=events.filter(e=>(e?.status?.type?.state||'')==='in');

      // ESPN etkinliği kısa süreliğine pre döndürürse, başlama saatinden sonra da göster.
      const now=Date.now();
      const tolerant=events.filter(e=>{
        const state=e?.status?.type?.state||'';
        const start=Date.parse(e?.date||'');
        return state==='pre' && Number.isFinite(start) && start<=now && now-start<12*60*1000;
      });

      const matches=(live.length?live:tolerant).map(normalize);
      if(typeof liveData!=='undefined'){
        liveData=liveData.filter(m=>m?.leagueSlug!==LEAGUE);
        liveData.push(...matches);
        if(typeof renderLive==='function') renderLive();
        if(document.querySelector('#timelineModal.show') && typeof openTimeline==='function') openTimeline();
      }
    }catch(err){
      console.warn('Avrupa Ligi canlı skor alınamadı:',err);
    }
  }

  refresh();
  setInterval(refresh,10000);
})();
