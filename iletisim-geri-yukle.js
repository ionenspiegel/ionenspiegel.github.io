/* İonenSpiegel İletişim geri yükleme
   Mevcut Google Apps Script bağlantısını kullanır. */
(function(){
  const api='https://script.google.com/macros/s/AKfycbxoTMojRbXgNWBkFqSvYXULBRkT1C30nOZdh4luZmLqe_FZ55U3Vv1O2CExgoumeaFy_Q/exec';
  function addContactLink(){
    const lists=document.querySelectorAll('.ref-list');
    for(const list of lists){
      if(list.querySelector('a[href="iletisim.html"]')) return;
      const a=document.createElement('a');
      a.href='iletisim.html';
      a.innerHTML='<span>✉</span><div><strong>İletişim</strong><small>Görüş ve önerilerin için</small></div><b>›</b>';
      list.appendChild(a);
      return;
    }
    const extras=document.querySelector('.extras-grid');
    if(extras && !extras.querySelector('[data-contact-restore]')){
      const a=document.createElement('a');
      a.href='iletisim.html'; a.dataset.contactRestore='1';
      a.className='feature-card simple-feature';
      a.innerHTML='<span>✉</span><b>İletişim</b><small>Görüş ve önerilerin için</small>';
      extras.appendChild(a);
    }
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',addContactLink); else addContactLink();
})();
