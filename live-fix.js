/* İonenSpiegel canlı skor düzeltmesi: UEFA Avrupa Ligi */
(function(){
  async function refreshEuropaLive(){
    try{
      const d=new Date();
      const ymd=d.getFullYear()+String(d.getMonth()+1).padStart(2,'0')+String(d.getDate()).padStart(2,'0');
      const url='https://site.api.espn.com/apis/site/v2/sports/soccer/uefa.europa/scoreboard?dates='+ymd;
      const r=await fetch(url,{cache:'no-store'});
      if(!r.ok) throw new Error('HTTP '+r.status);
      const data=await r.json();
      const now=Date.now();

      const events=(data.events||[]).filter(e=>{
        const state=e?.status?.type?.state||'';
        if(state==='in') return true;

        // ESPN kısa süreliğine "pre" döndürürse, 10 dakikalık başlangıç toleransı.
        const start=Date.parse(e?.date||'');
        const name=((e?.name||'')+' '+JSON.stringify(e?.competitions?.[0]?.competitors||[])).toLocaleLowerCase('tr-TR');
        return state==='pre' &&
          Number.isFinite(start) &&
          start<=now &&
          now-start<10*60*1000 &&
          (name.includes('beşiktaş') || name.includes('marseille') || name.includes('olympique de marseille'));
      });

      const matches=events.map(e=>{
        const c=e?.competitions?.[0]?.competitors||[];
        const home=c.find(x=>x.homeAway==='home')||c[0]||{};
        const away=c.find(x=>x.homeAway==='away')||c[1]||{};
        return {
          id:String(e.id),
          league:'Avrupa Ligi',
          leagueSlug:'uefa.europa',
          home:home?.team?.displayName||home?.team?.shortDisplayName||'Ev Sahibi',
          away:away?.team?.displayName||away?.team?.shortDisplayName||'Deplasman',
          homeScore:home?.score??'0',
          awayScore:away?.score??'0',
          homeLogo:home?.team?.logo||'',
          awayLogo:away?.team?.logo||'',
          minute:e?.status?.displayClock||'CANLI',
          status:e?.status?.type?.shortDetail||e?.status?.type?.detail||'Canlı',
          state:e?.status?.type?.state||'',
          date:e?.date||'',
          venue:e?.competitions?.[0]?.venue?.fullName||''
        };
      });

      liveData=liveData.filter(m=>m.leagueSlug!=='uefa.europa');
      liveData.push(...matches);
      renderLive();

      if(document.querySelector('#timelineModal.show')) openTimeline();
    }catch(err){
      console.warn('Avrupa Ligi canlı skor alınamadı',err);
    }
  }

  refreshEuropaLive();
  setInterval(refreshEuropaLive,15000);
})();
