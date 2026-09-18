
/* İonenSpiegel V62. Görsel, bağlantı ve Avrupa bölümü düzeltmeleri. */
(function(){
  'use strict';

  const IMAGE_MAP = [
    {keys:['beşiktaş','marseille'], file:'photo-bjk.jpg'},
    {keys:['beşiktaş'], file:'photo-bjk.jpg'},
    {keys:['fenerbahçe','asensio'], file:'photo-asensio.jpg'},
    {keys:['fenerbahçe'], file:'photo-asensio.jpg'},
    {keys:['trabzonspor','galatasaray'], file:'photo-derbi.jpg'},
    {keys:['galatasaray'], file:'photo-derbi.jpg'},
    {keys:['juventus'], file:'photo-juventus.jpg'},
    {keys:['bournemouth'], file:'photo-bournemouth.jpg'},
    {keys:['hoffenheim'], file:'photo-hoffenheim.jpg'},
    {keys:['avrupa ligi','europa league','avrupa'], file:'photo-europa.jpg'},
    {keys:['süper lig'], file:'photo-superlig.jpg'}
  ];

  function wantedImage(text){
    const t=(text||'').toLocaleLowerCase('tr-TR');
    const hit=IMAGE_MAP.find(x=>x.keys.some(k=>t.includes(k)));
    return hit ? hit.file : 'photo-superlig.jpg';
  }

  function fixNewsRows(root=document){
    root.querySelectorAll('.news-row').forEach(row=>{
      const img=row.querySelector('.thumb img');
      if(!img) return;
      const source=row.querySelector('a[href^="http"]');
      const title=row.querySelector('h3')?.textContent||row.textContent||'';
      const file=wantedImage(title);
      if(!img.getAttribute('src') || /local-\d+\.svg/i.test(img.getAttribute('src'))){
        img.src='./'+file;
      }
      img.loading='lazy';
      img.decoding='async';

      const thumb=img.closest('.thumb');
      if(!thumb || !source || source.getAttribute('href')==='#') return;
      let link=thumb.querySelector('.v62-image-link');
      if(!link){
        link=document.createElement('a');
        link.className='v62-image-link';
        link.target='_blank';
        link.rel='noopener noreferrer';
        link.setAttribute('aria-label','Haberi kaynağında aç');
        thumb.insertBefore(link,img);
        link.appendChild(img);
      }
      link.href=source.href;
    });
  }

  function initEuropeTabs(){
    const root=document.querySelector('.v62-europe-section');
    if(!root || root.dataset.v62Tabs==='1') return;
    root.dataset.v62Tabs='1';
    const tabs=[...root.querySelectorAll('.v62-europe-tab')];
    const panels=[...root.querySelectorAll('.v62-europe-panel')];
    function select(team){
      tabs.forEach(tab=>{
        const active=tab.dataset.europeTeam===team;
        tab.classList.toggle('active',active);
        tab.setAttribute('aria-selected',active?'true':'false');
      });
      panels.forEach(panel=>{
        const active=panel.dataset.europePanel===team;
        panel.classList.toggle('active',active);
        panel.hidden=!active;
      });
    }
    tabs.forEach(tab=>tab.addEventListener('click',()=>select(tab.dataset.europeTeam)));
    select(tabs.find(t=>t.classList.contains('active'))?.dataset.europeTeam || 'besiktas');
  }

  function removeUnwanted(){
    document.querySelectorAll('#extras,#daha-fazla,.extras,.more-ref,.ref-other').forEach(el=>el.remove());

    document.querySelectorAll('section').forEach(section=>{
      const h=section.querySelector('h2');
      const text=(h?.textContent||'').trim().toLocaleLowerCase('tr-TR');
      if(text==='gündem ve etkileşim' || section.querySelector('.poll-card,.comments-card')){
        section.remove();
      }
    });

    document.querySelectorAll('.drawer-link.accordion-btn').forEach(btn=>{
      if((btn.textContent||'').toLocaleLowerCase('tr-TR').includes('diğer')){
        btn.nextElementSibling?.remove();
        btn.remove();
      }
    });
  }

  function boot(){
    removeUnwanted();
    initEuropeTabs();
    fixNewsRows();
    setTimeout(()=>fixNewsRows(),250);
    setTimeout(()=>fixNewsRows(),1000);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot);
  else boot();

  const observer=new MutationObserver(mutations=>{
    let changed=false;
    for(const m of mutations){
      if(m.addedNodes?.length) changed=true;
    }
    if(!changed) return;
    initEuropeTabs();
    fixNewsRows();
  });
  observer.observe(document.documentElement,{childList:true,subtree:true});
})();
