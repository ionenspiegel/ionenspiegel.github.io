// İonenSpiegel Google Analytics 4
// Measurement ID: G-PVPMSV7J1F
(function() {
  var id = "G-PVPMSV7J1F";
  if (!document.querySelector('script[data-ionen-ga4]')) {
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
    s.dataset.ionenGa4 = '1';
    document.head.appendChild(s);
  }
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;
  gtag('js', new Date());
  gtag('config', id, {
    anonymize_ip: true,
    page_title: document.title,
    page_location: window.location.href
  });
})();
