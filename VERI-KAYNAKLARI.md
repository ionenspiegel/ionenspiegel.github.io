# İonenSpiegel veri altyapısı

## Veri kesim tarihi

Uygulamanın yayın kesim tarihi `2026-11-05T23:59:59+03:00` olarak tanımlıdır. Bu tarihten sonraki kayıtlar istemci tarafından gösterilmez.

## Kullanılan kaynaklar

- [TFF puan, fikstür ve sonuçlar](https://www.tff.org/?pageID=198)
- [TFF 10. hafta detayları](https://www.tff.org/Default.aspx?hafta=10&pageId=198)
- [LigAnaliz 10. hafta genel görünüm](https://liganaliz.com/genel-durum/10)
- [canlıskor.org Süper Lig](https://canliskor.org/en/league/super-lig)
- [LigAnaliz asist istatistikleri](https://liganaliz.com/istatistikler/asist)

TFF sayfası bağlantıları kaynak listesinde korunmuştur. Alınan sayfa içeriğinde ayrıntı görünmeyen alanlar için yalnızca LigAnaliz/canlıskor.org üzerinde görünen kayıtlar kullanılmıştır.

## Güvenlik ve doğrulama

- `data/football-data.json` 5 Kasım 2026 kesim tarihli, kaynak metadatası bulunan kayıtları içerir.
- `football-data.js`, yalnızca `verified: true` olan, HTTPS kaynak bağlantısı ve geçerli yayın tarihi bulunan haberleri işler.
- Puan durumu, 10. hafta sonuçları, 11. hafta fikstürü, Çorum FK özeti ve iki doğrulanabilen golcü gösterilir.
- API anahtarı JavaScript dosyalarına yazılmamalıdır. GitHub Pages tarafında anahtar saklanamayacağı için futbol API'si Google Apps Script, Cloudflare Worker veya başka bir sunucu tarafı proxy üzerinden sunulmalıdır.

## Şu anda çalışan özellikler

- Kaynaklı veri yoksa eski statik haber, skor, fikstür, puan ve transfer içeriklerini yayınlamama.
- Veri kesim tarihi ve veri durumu bildirimi.
- Her veri panelinde kaynak bağlantısı ve 5 Kasım 2026 güncelleme tarihi.
- Yerel doğrulanmış JSON veya `window.IONEN_DATA_ENDPOINT` ile tanımlanan HTTPS uç noktasından veri yükleme.

## Henüz etkin olmayan özellikler

Kaynak sayfalarında doğrulanamadığı için aşağıdakiler yayınlanmıyor veya eksik bırakılıyor:

- 1. Lig puan tablosu
- İlk 20 golcü ve asist sıralamasının doğrulanamayan satırları
- Canlı skorlar
- Fenerbahçe-Liverpool, Galatasaray-Stuttgart ve Çorum FK hazırlıkları haberleri
- 11. hafta hakemleri

LigAnaliz asist sayfasında Ernest Muçi 5 asist olarak göründüğü için kullanıcı tarafından belirtilen 6 asist değeri bu kaynaklarla doğrulanamadı; asist tablosu boş bırakıldı. Gençlerbirliği ve Alanyaspor maç sayıları 9 olarak korunmuştur.
