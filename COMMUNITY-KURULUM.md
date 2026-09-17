# İonenSpiegel Topluluk Sistemi

Bu paket, anket ve haber tartışmasını gerçek ortak veriye taşır.

## 1) Apps Script oluştur

1. Google hesabınla `https://script.google.com/` adresine gir.
2. **New project / Yeni proje** oluştur.
3. `Code.gs` içindeki kodu buradaki `Code.gs` ile tamamen değiştir.
4. `ADMIN_EMAIL` değerine bildirimleri almak istediğin e-posta adresini yaz.
5. Kaydet.

İlk kayıt geldiğinde sistem Google Drive'da bir Google Sheet oluşturur ve yorum/anket verilerini orada tutar.

## 2) Web App olarak yayınla

Apps Script'te:

**Deploy → New deployment → Web app**

Ayarlar:
- Execute as: **Me**
- Who has access: **Anyone**

Deploy sonrası verilen `/exec` URL'sini kopyala.

## 3) Siteye URL'yi ekle

`index.html` içinde şu satırı bul:

```html
<script>window.IONENSPIEGEL_COMMUNITY_API="https://script.google.com/macros/s/AKfycbz7yUeESDgDqSRes_7nRzksc2wBF1nrqqpIGO0u9Kiqk92DjvjzPa7kPjzD-aET6cOGZw/exec";</script>
```

`https://script.google.com/macros/s/AKfycbxU2ouqSRW4q_mqsVd_FjgvZTM9yORAolVrEQ11OrKo95lPcjRvHFKrzHe4_ciiEpwP6Q/exec` yerine Apps Script `/exec` adresini yaz.

Örnek:

```html
<script>window.IONENSPIEGEL_COMMUNITY_API="https://script.google.com/macros/s/AKfycbz7yUeESDgDqSRes_7nRzksc2wBF1nrqqpIGO0u9Kiqk92DjvjzPa7kPjzD-aET6cOGZw/exec";</script>
```

## Sonuç

- Anket oyları ortak olur.
- Yüzdeler tüm ziyaretçilerde aynı görünür.
- Yorumlar tüm ziyaretçilerde görünür.
- Yeni yorum geldiğinde e-posta gönderilir.
- Yeni anket oyu geldiğinde e-posta gönderilir.
- Veriler Google Sheet'te tutulur.

GitHub Pages statik bir hosting olduğu için sunucu tarafı işlemleri doğrudan GitHub Pages üzerinde çalıştırmak yerine Apps Script web app gibi ayrı bir servis gerekir.


## URL bağlantısı
Bu V24 paketi, kullanıcının sağladığı Apps Script Web App `/exec` adresine bağlanmış durumdadır.
