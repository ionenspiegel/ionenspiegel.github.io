(function(){
  function addContactCard(){
    const grids=document.querySelectorAll('.extras-grid');
    grids.forEach(grid=>{
      if(grid.querySelector('a[href="iletisim.html"]')) return;
      const a=document.createElement('a');
      a.className='feature-card';
      a.href='iletisim.html';
      a.setAttribute('aria-label','İletişim sayfasını aç');
      a.innerHTML='<span aria-hidden="true">✉</span><b>İletişim</b><small>Görüş, öneri ve mesajlarını gönder</small>';
      grid.appendChild(a);
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',addContactCard);
  else addContactCard();
})();
