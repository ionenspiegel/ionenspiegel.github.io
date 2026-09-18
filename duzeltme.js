
/* İonenSpiegel V59 düzeltmeleri
   Bu dosyayı index.html'de script.js'den sonra yükle.
   GitHub'a otomatik değişiklik uygulamaz.
*/
(function(){
  'use strict';

  function esc(v){
    return String(v ?? '').replace(/[&<>"']/g, function(m){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m];
    });
  }

  function sourceLink(article){
    return article.querySelector('.news-source-link') ||
           article.querySelector('.news-info a') ||
           article.querySelector('a[href^="http"]');
  }

  function articleDataFixed(article){
    const title = article.querySelector('h3')?.textContent?.trim() || '';
    const desc = article.querySelector('p')?.textContent?.trim() || '';
    const kicker = article.querySelector('.news-kicker')?.textContent?.trim() || '';
    const img = article.querySelector('img')?.getAttribute('src') || '';
    const sourceEl = sourceLink(article);
    const link = sourceEl?.getAttribute('href') || '#';
    const source = sourceEl?.textContent?.replace('↗','').trim() || 'Kaynak';
    return {
      id: article.dataset.newsId || title,
      title, description: desc, kicker, image: img, link, source
    };
  }

  function makeThumb(article){
    const oldThumb = article.querySelector('.thumb');
    const source = article.querySelector('.news-source-link') || article.querySelector('div > a[href^="http"]');
    if(!oldThumb || !source) return;

    const link = source.getAttribute('href');
    if(!link || link === '#') return;

    const img = oldThumb.querySelector('img');
    if(!img) return;

    const a = document.createElement('a');
    a.className = 'thumb news-thumb-link';
    a.href = link;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.setAttribute('aria-label', 'Haber için tıkla: ' + (img.alt || 'haber'));
    a.innerHTML = img.outerHTML + '<span>Haber için tıkla</span>';
    oldThumb.replaceWith(a);
  }

  function repairRows(){
    document.querySelectorAll('.news-row.has-bookmark').forEach(function(article){
      makeThumb(article);
    });
  }

  function repairSourceClasses(){
    document.querySelectorAll('.news-row.has-bookmark').forEach(function(article){
      const links = article.querySelectorAll('a[href^="http"]');
      links.forEach(function(a){
        if(!a.classList.contains('news-thumb-link')){
          a.classList.add('news-source-link');
        }
      });
    });
  }

  function repairFixtureText(){
    document.querySelectorAll('#maclar .fixture-match .fixture-team b').forEach(function(el){
      el.textContent = el.textContent.replace(/^[⚫⚪🔵🔴🟡🟢🟣🟠⚽🏳️‍🌈]+\s*/u,'').trim();
    });
  }

  function repair(){
    repairSourceClasses();
    repairRows();
    repairFixtureText();
  }

  function savePatch(){
    // Ana script'in articleData fonksiyonu varsa, kaynak bağlantısını
    // yanlışlıkla görsel linki olarak almaması için güvenli bir yardımcı sağlar.
    window.ionenSpiegelArticleDataFixed = articleDataFixed;
  }

  savePatch();
  repair();

  const observer = new MutationObserver(function(){
    repairSourceClasses();
    repairRows();
    repairFixtureText();
  });
  observer.observe(document.body, {childList:true, subtree:true});

  window.addEventListener('load', repair);
})();
