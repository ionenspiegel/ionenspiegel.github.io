
/* İonenSpiegel V59 düzeltme katmanı */
(function(){
  function cleanDuplicateUI(){
    const duplicate = document.querySelector('#daha-fazla.more-ref');
    if(duplicate) duplicate.remove();
    const ids = ['favoriteCard','notificationCard','themeCard','teamPicker','saveFavoriteTeam'];
    ids.forEach(id=>{
      const nodes=[...document.querySelectorAll('#'+id)];
      if(nodes.length>1) nodes.slice(1).forEach(n=>n.remove());
    });
  }

  function fixHero(){
    const title=document.querySelector('#heroTitle');
    const text=document.querySelector('#heroText');
    const kicker=document.querySelector('.hero-copy .category');
    if(kicker) kicker.textContent='AVRUPA LİGİ · MAÇ SONUCU';
    if(title) title.textContent="Beşiktaş, Marsilya'yı 4-1 mağlup etti";
    if(text) text.textContent="Beşiktaş, UEFA Avrupa Ligi lig aşamasının ilk maçında Marsilya'yı 4-1 yenerek turnuvaya 3 puanla başladı.";
  }

  function fixNavigation(){
    document.querySelectorAll('a[href^="#"]').forEach(a=>{
      if(a.dataset.v59Bound) return;
      a.dataset.v59Bound='1';
      a.addEventListener('click',e=>{
        const id=a.getAttribute('href');
        if(!id || id==='#') return;
        const target=document.querySelector(id);
        if(!target) return;
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth',block:'start'});
      });
    });
  }

  function fixFixtureFilters(){
    const root=document.querySelector('#maclar');
    if(!root || root.dataset.v59Fixture) return;
    root.dataset.v59Fixture='1';
    root.addEventListener('click',e=>{
      const btn=e.target.closest('.fixture-filter');
      if(!btn) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      const filter=btn.dataset.fixtureFilter || 'all';
      root.querySelectorAll('.fixture-filter').forEach(x=>x.classList.toggle('active',x===btn));
      root.querySelectorAll('.fixture-day').forEach(day=>{
        let visible=0;
        day.querySelectorAll('.fixture-match').forEach(match=>{
          const cats=(match.dataset.fixtureCategory||'').split(/\s+/);
          const show=filter==='all' || (filter==='bjk' ? cats.includes('bjk') || /beşiktaş/i.test(match.textContent) :
            filter==='today' ? cats.includes('today') :
            cats.includes(filter));
          match.style.display=show?'grid':'none';
          if(show) visible++;
        });
        day.style.display=visible?'block':'none';
      });
    },true);
  }

  function run(){
    cleanDuplicateUI();
    fixHero();
    fixNavigation();
    fixFixtureFilters();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',run);
  else run();
})();
