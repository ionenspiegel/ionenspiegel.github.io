/* İonenSpiegel görsel + maç kartı düzeltmesi */
(function(){
  'use strict';

  const q=(s,r=document)=>r.querySelector(s);
  const qa=(s,r=document)=>Array.from(r.querySelectorAll(s));

  function imageForRow(row){
    const text=(row.innerText||'').toLocaleLowerCase('tr-TR');
    if(text.includes('beşiktaş')) return './photo-bjk.jpg';
    if(text.includes('fenerbahçe') || text.includes('asensio')) return './photo-asensio.jpg';
    if(text.includes('trabzonspor') || text.includes('galatasaray')) return './photo-derbi.jpg';
    if(text.includes('avrupa') || text.includes('şampiyonlar ligi') || text.includes('uefa')) return './photo-europa.jpg';
    return './photo-superlig.jpg';
  }

  function fixNewsRows(root=document){
    qa('.news-row',root).forEach(row=>{
      const thumb=row.querySelector('.thumb');
      if(!thumb) return;

      let source=row.querySelector(':scope > div:last-child > a[href]');
      if(!source){
        const links=qa('a[href]',row).filter(a=>a.getAttribute('href') && a.getAttribute('href')!=='#');
        source=links[0];
      }
      const href=source?.getAttribute('href') || row.dataset.link || '#';
      if(href==='#') return;

      const img=thumb.querySelector('img');
      if(img){
        const current=img.getAttribute('src')||'';
        if(!current || current.includes('local-') || current.includes('news-')){
          img.src=imageForRow(row);
        }
        img.loading='lazy';
        img.alt=(row.querySelector('h3')?.textContent||'Futbol haberi').trim();
      }

      if(thumb.tagName.toLowerCase()==='a'){
        thumb.href=href;
        thumb.target='_blank';
        thumb.rel='noopener noreferrer';
        thumb.classList.add('news-thumb-link');
      }else{
        const link=document.createElement('a');
        link.className=thumb.className+' news-thumb-link';
        link.href=href;
        link.target='_blank';
        link.rel='noopener noreferrer';
        link.setAttribute('aria-label','Haber için tıkla: '+(row.querySelector('h3')?.textContent||'Haber').trim());
        while(thumb.firstChild) link.appendChild(thumb.firstChild);
        thumb.replaceWith(link);
      }

      const link=row.querySelector('.news-thumb-link');
      if(link && !link.querySelector('.news-thumb-label')){
        const label=document.createElement('span');
        label.className='news-thumb-label';
        label.textContent='Haber için tıkla';
        link.appendChild(label);
      }
    });
  }

  function fixFixtures(root=document){
    qa('.fixture-match .fixture-team b',root).forEach(el=>{
      el.textContent=el.textContent.replace(/⚫⚪|⚪⚫|🟡🔴|🟡🔵|🔵🔴|🟢🔴|🔴⚪/g,'').trim();
    });
    qa('.fixture-vs',root).forEach(el=>{
      el.style.whiteSpace='nowrap';
      el.style.wordBreak='normal';
      el.style.overflow='visible';
      el.style.minWidth='max-content';
    });
  }

  function run(){
    fixNewsRows();
    fixFixtures();
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',run);
  else run();

  const observer=new MutationObserver(()=>run());
  observer.observe(document.body,{subtree:true,childList:true});

  /* Sayfa ilk açıldıktan sonra dinamik haberler de düzeltilsin. */
  setTimeout(run,500);
  setTimeout(run,1500);
  setTimeout(run,3000);
})();
