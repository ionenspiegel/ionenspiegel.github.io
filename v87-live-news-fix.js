/* İonenSpiegel 27 Ekim 2026 güncel içerik sabitlemesi.
   Ana script ve JSON akışı korunur; yalnızca ana manşet ve kaynağı güncellenir. */
(function () {
  const applyHero = function () {
    const title = document.getElementById("heroTitle");
    const body = document.getElementById("heroText");
    const source = document.getElementById("heroSource");
    const read = document.getElementById("heroRead");
    const media = document.getElementById("heroMedia");
    if (title) title.textContent = "9. hafta tamamlandı: Galatasaray liderliğini korudu";
    if (body) body.textContent = "Galatasaray, 26 Ekim derbisinde Fenerbahçe'yi 2-1 mağlup etti. Sarı-kırmızılılar 22 puanla lider; Amed Sportif 20, Trabzonspor 19 puanda.";
    if (source) source.textContent = "Anadolu Ajansı / TFF · 27 Ekim 2026";
    if (read) read.onclick = function () { window.open("https://www.star.com.tr/spor/super-ligde-9-hafta-sona-erdi-iste-sonuclar-haber-2049332/", "_blank", "noopener"); };
    if (media) media.style.background = "linear-gradient(125deg,#17191e 0%,#22252b 68%,#352127 100%)";
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", applyHero, {once:true});
  else applyHero();
})();
