/* İonenSpiegel V62
   Haber görselleri + Avrupa takımları + gereksiz bölümlerin kaldırılması.
   Bu dosya mevcut script.js'nin üzerine yazmaz, onunla birlikte çalışır.
*/
(function(){
  'use strict';

  const NEWS_IMAGES = {
    'bjk-marseille-result':'./photo-bjk.jpg',
    'el-matchday1':'./photo-europa.jpg',
    'trabzon-gs-derbi':'./photo-derbi.jpg',
    'trabzon-gs-randevu':'./photo-derbi.jpg',
    'fener-asensio':'./photo-asensio.jpg',
    'superlig-program':'./photo-superlig.jpg',
    'juventus-nec':'./photo-juventus.jpg',
    'bournemouth-real':'./photo-bournemouth.jpg',
    'bjk-hoffenheim':'./photo-hoffenheim.jpg',
    'ucl-fener-roma':'./photo-europa.jpg',
    'ucl-gs-sporting':'./photo-europa.jpg',
    'ucl-matchday1':'./photo-europa.jpg'
  };

  const EURO_TEAMS = {
    bjk:{
      name:'Beşiktaş', comp:'UEFA Avrupa Ligi',
      source:'https://www.uefa.com/uefaeuropaleague/clubs/50157/matches/',
      matches:[
        ['17 Eylül','Beşiktaş','4 - 1','Marseille','TAMAMLANDI','done'],
        ['15 Ekim','Hoffenheim','vs','Beşiktaş','SIRADAKİ','next'],
        ['22 Ekim','Beşiktaş','vs','Crystal Palace',''],
        ['5 Kasım','Celtic','vs','Beşiktaş',''],
        ['26 Kasım','Beşiktaş','vs','H. Beer-Sheva',''],
        ['10 Aralık','Leverkusen','vs','Beşiktaş',''],
        ['21 Ocak 2027','Beşiktaş','vs','Union SG',''],
        ['28 Ocak 2027','Omonia','vs','Beşiktaş','']
      ]
    },
    gs:{
      name:'Galatasaray', comp:'UEFA Şampiyonlar Ligi',
      source:'https://www.uefa.com/uefachampionsleague/clubs/50067/matches/',
      matches:[
        ['9 Eylül','Sporting CP','3 - 1','Galatasaray','TAMAMLANDI','done'],
        ['13 Ekim','Galatasaray','vs','Barcelona','SIRADAKİ','next'],
        ['21 Ekim','Lille','vs','Galatasaray',''],
        ['3 Kasım','Galatasaray','vs','Stuttgart',''],
        ['24 Kasım','Galatasaray','vs','Aston Villa',''],
        ['8 Aralık','AEK Athens','vs','Galatasaray',''],
        ['19 Ocak 2027','Galatasaray','vs','Feyenoord',''],
        ['27 Ocak 2027','Paris Saint-Germain','vs','Galatasaray','']
      ]
    },
    fb:{
      name:'Fenerbahçe', comp:'UEFA Şampiyonlar Ligi',
      source:'https://www.uefa.com/uefachampionsleague/clubs/52692--/matches/',
      matches:[
        ['10 Eylül','Fenerbahçe','1 - 1','Roma','TAMAMLANDI','done'],
        ['14 Ekim','Aston Villa','vs','Fenerbahçe','SIRADAKİ','next'],
        ['20 Ekim','Fenerbahçe','vs','Slavia Praha',''],
        ['4 Kasım','Fenerbahçe','vs','Liverpool',''],
        ['25 Kasım','Shakhtar Donetsk','vs','Fenerbahçe',''],
        ['9 Aralık','LASK','vs','Fenerbahçe',''],
        ['20 Ocak 2027','Fenerbahçe','vs','Villarreal',''],
        ['27 Ocak 2027','Atlético de Madrid','vs','Fenerbahçe','']
      ]
    },
    ts:{
      name:'Trabzonspor', comp:'UEFA Konferans Ligi',
      source:'https://www.uefa.com/uefaconferenceleague/clubs/52731--trabzonspor/matches/',
      matches:[
        ['15 Ekim','KuPS Kuopio','vs','Trabzonspor','SIRADAKİ','next'],
        ['22 Ekim','Trabzonspor','vs','Hearts',''],
        ['5 Kasım','Trabzonspor','vs','Freiburg',''],
        ['26 Kasım','CSKA Sofia','vs','Trabzonspor',''],
        ['10 Aralık','Trabzonspor','vs','Jablonec',''],
        ['17 Aralık','Crvena Zvezda','vs','Trabzonspor','']
      ]
    }
  };

  function esc(v){
    return String(v ?? '').replace(/[&<>"']/g,function(m){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m];
    });
  }

  function sourceLink(article){
    return article.querySelector('.news-source-link') ||
           article.querySelector('a[href^="http"]');
  }

  function fixNewsRows(){
    document.querySelectorAll('.news-row.has-bookmark').forEach(function(row){
      const id=row.dataset.newsId || '';
      const image=NEWS_IMAGES[id];
      const img=row.querySelector('.thumb img, .news-thumb-link img');
      const source=sourceLink(row);
      if(!img) return;

      if(image) img.src=image;
      img.loading='lazy';
      img.decoding='async';
      img.alt=(row.querySelector('h3')?.textContent || 'Futbol haberi').trim();

      if(source){
        source.classList.add('news-source-link');
        const href=source.getAttribute('href');
        if(href && href!=='#'){
          let thumb=row.querySelector('.news-thumb-link');
          if(!thumb){
            const old=row.querySelector('.thumb');
            if(old){
              thumb=document.createElement('a');
              thumb.className='thumb news-thumb-link';
              while(old.firstChild) thumb.appendChild(old.firstChild);
              old.replaceWith(thumb);
            }
          }
          if(thumb){
            thumb.href=href;
            thumb.target='_blank';
            thumb.rel='noopener noreferrer';
            thumb.setAttribute('aria-label','Haber için tıkla: '+(row.querySelector('h3')?.textContent || 'Haber').trim());
            if(!thumb.querySelector('.news-thumb-label')){
              const label=document.createElement('span');
              label.className='news-thumb-label';
              label.textContent='Haber için tıkla';
              thumb.appendChild(label);
            }
          }
        }
      }
    });
  }

  function removeUnwantedSections(){
    ['#gundem','#extras','.more-ref','#daha-fazla','#playerPoll','#pollResult','#commentList'].forEach(function(sel){
      document.querySelectorAll(sel).forEach(function(el){
        const section=el.matches('section') ? el : el.closest('section');
        if(section) section.remove();
      });
    });
    document.querySelectorAll('.ref-other').forEach(el=>{
      const section=el.closest('section');
      if(section) section.remove();
      else el.remove();
    });
  }

  function roadmapHTML(key){
    const t=EURO_TEAMS[key];
    if(!t) return '';
    return `
      <section class="section content-section v62-europe-section" id="bjk-avrupa">
        <div class="section-head">
          <div>
            <h2><span class="red-line"></span> Avrupa'daki Türk Takımları</h2>
            <p class="section-subtitle">2026/27 Avrupa kupaları · takımını seç</p>
          </div>
          <a class="text-link" href="${t.source}" target="_blank" rel="noopener">UEFA ↗</a>
        </div>
        <div class="v62-euro-tabs" role="tablist" aria-label="Avrupa'da oynayan Türk takımları">
          <button type="button" class="v62-euro-tab active" data-v62-team="bjk">Beşiktaş</button>
          <button type="button" class="v62-euro-tab" data-v62-team="gs">Galatasaray</button>
          <button type="button" class="v62-euro-tab" data-v62-team="fb">Fenerbahçe</button>
          <button type="button" class="v62-euro-tab" data-v62-team="ts">Trabzonspor</button>
        </div>
        <div class="v62-euro-panel-wrap">
          ${Object.keys(EURO_TEAMS).map(function(k){
            const x=EURO_TEAMS[k];
            return `<div class="v62-euro-panel" data-v62-panel="${k}" ${k==='bjk'?'':'hidden'}>
              <div class="v62-euro-panel-head">
                <div><strong>${esc(x.name)}</strong><span>${esc(x.comp)}</span></div>
                <a href="${x.source}" target="_blank" rel="noopener">Fikstürü aç ↗</a>
              </div>
              <div class="v62-roadmap-grid">
                ${x.matches.map(function(m){
                  return `<article class="v62-roadmap-card ${m[5]||''}">
                    ${m[4]?`<span class="v62-status">${esc(m[4])}</span>`:''}
                    <small>${esc(m[0])}</small>
                    <strong><span>${esc(m[1])}</span> <em>${esc(m[2])}</em> <span>${esc(m[3])}</span></strong>
                    <label>${esc(x.comp)}</label>
                  </article>`;
                }).join('')}
              </div>
            </div>`;
          }).join('')}
        </div>
      </section>`;
  }

  function replaceRoadmap(){
    const old=document.querySelector('#bjk-avrupa');
    if(!old || old.dataset.v62Done) return;
    const wrapper=document.createElement('div');
    wrapper.innerHTML=roadmapHTML('bjk');
    const fresh=wrapper.firstElementChild;
    old.replaceWith(fresh);

    fresh.querySelectorAll('.v62-euro-tab').forEach(function(btn){
      btn.addEventListener('click',function(){
        const key=btn.dataset.v62Team;
        fresh.querySelectorAll('.v62-euro-tab').forEach(b=>{
          const active=b===btn;
          b.classList.toggle('active',active);
          b.setAttribute('aria-selected',active?'true':'false');
        });
        fresh.querySelectorAll('.v62-euro-panel').forEach(panel=>{
          panel.hidden=panel.dataset.v62Panel!==key;
        });
        const selected=EURO_TEAMS[key];
        const link=fresh.querySelector('.section-head .text-link');
        if(link && selected) link.href=selected.source;
      });
    });
  }

  function cleanOldFixStyles(){
    document.querySelectorAll('style').forEach(function(s){
      if(/^v45-|^v50-/.test(s.id||'')) return;
    });
  }

  function run(){
    removeUnwantedSections();
    replaceRoadmap();
    fixNewsRows();
    cleanOldFixStyles();
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',run);
  else run();

  const observer=new MutationObserver(function(){
    run();
  });
  observer.observe(document.body,{subtree:true,childList:true});
  setTimeout(run,300);
  setTimeout(run,1000);
  setTimeout(run,2500);
})();
