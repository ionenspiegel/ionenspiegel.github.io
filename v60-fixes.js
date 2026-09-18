/* İonenSpiegel V60 */
(function(){
  function initEuropeanTeams(){
    const buttons=[...document.querySelectorAll('.euro-team-btn')];
    const panels=[...document.querySelectorAll('.euro-team-panel')];
    if(!buttons.length)return;
    buttons.forEach(btn=>{
      btn.addEventListener('click',()=>{
        const team=btn.dataset.euroTeam;
        buttons.forEach(b=>{
          const active=b===btn;
          b.classList.toggle('active',active);
          b.setAttribute('aria-selected',active?'true':'false');
        });
        panels.forEach(panel=>{
          panel.hidden=panel.dataset.euroPanel!==team;
        });
      });
    });
  }

  function fixAnchors(){
    document.querySelectorAll('a[href^="#"]').forEach(a=>{
      if(a.dataset.v60Bound)return;
      const target=document.querySelector(a.getAttribute('href'));
      if(!target)return;
      a.dataset.v60Bound='1';
      a.addEventListener('click',e=>{
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth',block:'start'});
      });
    });
  }

  function removeDuplicateRefSection(){
    const duplicate=document.querySelector('#daha-fazla.more-ref');
    if(duplicate)duplicate.remove();
    ['favoriteCard','notificationCard','themeCard','teamPicker','saveFavoriteTeam'].forEach(id=>{
      const nodes=[...document.querySelectorAll('#'+id)];
      nodes.slice(1).forEach(node=>node.remove());
    });
  }

  function fix(){
    removeDuplicateRefSection();
    initEuropeanTeams();
    fixAnchors();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',fix);
  else fix();
})();
