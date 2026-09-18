İONENSPIEGEL V62
=================

Bu paket GitHub sitesine doğrudan yazma yapmadan hazırlanmış V62 çekirdek değişiklik paketidir.

V62'DE YAPILANLAR
1. Son Dakika kartlarındaki local-*.svg yarım/placeholder görselleri gerçek photo-*.jpg dosyalarına yönlendirildi.
2. Haber görselleri kaynak bağlantısına tıklanabilir hale getirildi.
3. Mobil haber başlıklarının taşması ve kesilmesi düzeltildi.
4. "Haftanın oyuncusu kim?" anketi kaldırıldı.
5. "Haber tartışması" bölümü kaldırıldı.
6. "Daha Fazla" bölümleri kaldırıldı.
7. Menüdeki "Diğer" akordeonu kaldırıldı.
8. Avrupa bölümü Beşiktaş'a bağlı olmaktan çıkarıldı.
9. Avrupa bölümüne Beşiktaş, Galatasaray, Fenerbahçe ve Trabzonspor seçimi eklendi.
10. Seçilen kulübün Avrupa fikstürü aynı bölümde gösteriliyor.
11. Service Worker önbelleği V62'ye yükseltildi.
12. HTML sayfalarının CSS sürüm sorguları V62'ye yükseltildi.

YÜKLEME
--------
ZIP içeriğini mevcut GitHub Pages deposunun köküne çıkar ve aynı isimli dosyaların üzerine yükle.

Önemli:
- photo-*.jpg, news-*.jpg, logo.png, icon*.png, manifest.json ve diğer mevcut site varlıklarını silme.
- Bu paket mevcut görsel varlıkların yerine geçmek için değil, onları kullanan çekirdek dosyaları güncellemek için hazırlanmıştır.
- data klasöründeki JSON dosyalarını da aynı klasör yapısıyla yükle.
- GitHub'a ben bağlanmıyorum. Yükleme senin kontrolünde.

İÇERİK
-------
index.html
style.css
script.js
sw.js
video.html
galeri.html
kaydedilenler.html
news.json
daily-news.json
data/news.json
data/daily-news.json
v62-modern.css
v62-fixes.js
V62-KURULUM.txt
V62-ASSETLERI-KORU.txt
