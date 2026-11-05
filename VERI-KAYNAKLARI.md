# İonenSpiegel veri altyapısı

## Veri kesim tarihi

Uygulamanın yayın kesim tarihi `2026-11-05T23:59:59+03:00` olarak tanımlıdır. Bu tarihten sonraki kayıtlar istemci tarafından gösterilmez.

## Kullanılan kaynaklar

- Haber RSS akışı için Google Apps Script'teki `NEWS_FEEDS` listesi: ASpor, ASpor Süper Lig, Habertürk Spor ve A Haber Spor.
- RSS kayıtlarında yayın tarihi ve HTTPS kaynak bağlantısı zorunludur.
- TFF ve UEFA bağlantıları, futbol verisi sağlayıcısının ekleyeceği kayıtların kaynak bağlantısı olarak kullanılabilir; bu depoda doğrulanmamış yeni sonuç, puan veya oyuncu istatistiği eklenmemiştir.

## Güvenlik ve doğrulama

- `data/football-data.json` başlangıçta `verified: false` ve boş veri listeleriyle gelir.
- `football-data.js`, yalnızca `verified: true` olan, HTTPS kaynak bağlantısı ve geçerli yayın tarihi bulunan haberleri işler.
- Puan durumu, fikstür, sonuç, gol krallığı, asist krallığı ve takım istatistikleri doğrulanmış veri gelene kadar gizlenir.
- API anahtarı JavaScript dosyalarına yazılmamalıdır. GitHub Pages tarafında anahtar saklanamayacağı için futbol API'si Google Apps Script, Cloudflare Worker veya başka bir sunucu tarafı proxy üzerinden sunulmalıdır.

## Şu anda çalışan özellikler

- Doğrulanmış veri yoksa eski statik haber, skor, fikstür, puan ve transfer içeriklerini yayınlamama.
- Veri kesim tarihi ve veri durumu bildirimi.
- RSS uç noktasında tarih filtresi, kaynak bağlantısı ve son güncelleme alanı.
- Yerel doğrulanmış JSON veya `window.IONEN_DATA_ENDPOINT` ile tanımlanan HTTPS uç noktasından veri yükleme.

## Henüz etkin olmayan özellikler

5 Kasım 2026 itibarıyla doğrulanabilir bir futbol API çıktısı depoya sağlanmadığından aşağıdakiler canlı/veri dolu olarak yayınlanmıyor:

- Süper Lig ve 1. Lig puan tabloları
- Yaklaşan maçlar ve sonuçlar
- Canlı skorlar
- İlk 20 golcü ve asist sıralaması
- Takım kadro ve oyuncu istatistikleri

Bir sağlayıcı bağlandığında çıktı `data/football-data.json` şemasına uymalı; `verified: true`, `updatedAt`, `provider`, kaynak bağlantıları ve kesim tarihinden eski kayıtlar bulunmalıdır. Canlı skor yalnızca sağlayıcı gerçek zamanlı veri veriyorsa etkinleştirilmelidir.
git add .
git commit -m "Doğrulanabilir futbol veri altyapısını güncelle"
git push origin main