## V31 Günlük Haber Güncellemesi
- 17 Eylül 2026 doğrulanmış futbol haberleri günlük veri dosyasına işlendi.
- Fenerbahçe, Galatasaray, Beşiktaş, Trabzonspor, Süper Lig ve Avrupa futbolu kapsandı.
- Kaynak bağlantıları gerçek haber sayfalarına bağlandı.
- Apps Script canlı akışı başarısız veya eski kalırsa `daily-news.json` otomatik yedek olarak gösterilir.

İonenSpiegel V16 • Canlı Skor + Ziyaret Sayacı

V10 altyapısına haber detayları, Web Share, PWA install prompt, demo canlı maç simülasyonu, Notification API, skeleton loading, OG/Twitter meta, focus trap, offline banner ve manifest shortcuts/screenshots eklendi. Tüm maç/istatistik verileri demo amaçlıdır; gerçek API bağlantısı yoktur.


V13: Süper Lig sekmeleri mobilde 5 sütunlu sabit düzene alındı; yatay kayma/ilk sekmenin kırpılması düzeltildi.


## V14 istatistik güncellemesi
16 Eylül 2026 itibarıyla Gol Krallığı ve Asist Krallığı sekmeleri güncellendi. Gol sıralamasında Victor Osimhen ve Gift Orban 6 golle, ardından Mohamed Salah, Adrian Benedyczak, Eldor Shomurodov, Juan ve Dušan Vlahović 4 golle yer alıyor. Asist tarafında ilk 10 oyuncunun tamamı 2 asist seviyesinde. Veriler web üzerinden 16 Eylül 2026 tarihinde kontrol edildi.


## V15
- Gerçek canlı skor entegrasyonu: ESPN skor tahtası üzerinden Süper Lig, Premier League, LaLiga, Serie A, Bundesliga, Ligue 1 ve Şampiyonlar Ligi.
- Canlı skorlar 30 saniyede bir yenilenir; demo/fake canlı maç kaldırıldı.
- Footer'a toplam ziyaret ve bugün ziyaret sayacı eklendi (iCount).
- Marka görünümü İonenSpiegel olarak güncellendi.


## V17
- Instagram ve YouTube sosyal bağlantıları güncellendi; X kaldırıldı.
- Service Worker cache sürümü V17 olarak yenilendi.
- CSS/JS asset sürümleri V17 olarak güncellendi.
- Görünen marka adı İonenSpiegel olarak güncellendi.

- V18: 16 Eylül 2026 güncel dünya futbol haberleri için yatay kaydırmalı haber akışı, kaynak bağlantıları ve açıklamalı kartlar eklendi.

## V19
- Dünya gündemi için ikinci yatay kaydırma akışı eklendi.
- 16 Eylül 2026 güncel UEFA, Avrupa ve transfer başlıkları kaynak bağlantılarıyla eklendi.
- Avrupa Gecesi seçili maç kartları eklendi.
- Resmi haber / medya haberi / transfer iddiası ayrımı için kaynak etiketi rehberi eklendi.
- Mobil yatay kaydırma ve karanlık tema desteği korundu.


## V20
Transfer ve basketbol bölümleri dolduruldu; yaklaşan maç fikstürü, maç detay modalı, localStorage yorum/anket/okuma sayaçları ve ziyaretçi istatistikleri eklendi.


V22 düzeltmeleri: koyu tema uyumluluğu, güncel 16 Eylül 2026 içerikleri, offline uyarısının kaldırılması, harici haber görsellerinin yerel varlıklara alınması, gerçek hesap sistemi olmadığı bilgisinin netleştirilmesi ve Service Worker cache v22.


## V25
Toplam ziyaret ve bugünkü ziyaret sayacı Apps Script üzerinden ortak olarak tutulur. Aynı tarayıcı aynı gün içinde tekrar yüklenerek sayacı artırmaz.


## V26 Otomatik Haber Akışı
Son Dakika bölümü Apps Script üzerinden Anadolu Ajansı RSS akışını alır; başlık, tarih, kategori ve kaynak bağlantısını otomatik yeniler. İçerik metni kopyalanmaz, kullanıcı kaynak sayfasına yönlendirilir. Apps Script `Code.gs` dosyasını V26 ile güncelleyip Web App dağıtımını yeni sürüm olarak yayınlamak gerekir.
