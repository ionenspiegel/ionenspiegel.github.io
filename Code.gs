const CONFIG = {
  ADMIN_EMAIL: 'topcuyusuf254@gmail.com',
  SHEET_NAME: 'İonenSpiegel Topluluk Verileri'
};

function getAdminEmail_() {
  return CONFIG.ADMIN_EMAIL && CONFIG.ADMIN_EMAIL.indexOf('@') > 0
    ? CONFIG.ADMIN_EMAIL
    : Session.getEffectiveUser().getEmail();
}

function getSheet_() {
  const props = PropertiesService.getScriptProperties();
  let id = props.getProperty('SHEET_ID');
  if (id) return SpreadsheetApp.openById(id).getSheets()[0];

  const ss = SpreadsheetApp.create(CONFIG.SHEET_NAME);
  const sh = ss.getSheets()[0];
  sh.setName('Veriler');
  sh.appendRow(['Tarih', 'Tür', 'Ad', 'Yorum', 'Seçim']);
  props.setProperty('SHEET_ID', ss.getId());
  return sh;
}

function doGet(e) {
  const callback = String((e && e.parameter && e.parameter.callback) || '');
  const action = String((e && e.parameter && e.parameter.action) || '');
  if (action === 'haberler') {
    const news = getNews_();
    const newsJson = JSON.stringify(news);
    if (callback && /^[A-Za-z_$][\w$\.]*$/.test(callback)) {
      return ContentService.createTextOutput(callback + '(' + newsJson + ')').setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    return ContentService.createTextOutput(newsJson).setMimeType(ContentService.MimeType.JSON);
  }
  const sh = getSheet_();
  const values = sh.getDataRange().getValues();
  const comments = [];
  const votes = { '0': 0, '1': 0, '2': 0, '3': 0 };

  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    const type = String(row[1] || '');
    if (type === 'yorum') {
      comments.push({ name: String(row[2] || 'Ziyaretçi'), text: String(row[3] || ''), date: row[0] instanceof Date ? row[0].toLocaleString('tr-TR') : String(row[0] || '') });
    } else if (type === 'anket') {
      const choice = String(row[4] || '');
      if (Object.prototype.hasOwnProperty.call(votes, choice)) votes[choice]++;
    }
  }

  comments.reverse();
  comments.splice(50);

  const props = PropertiesService.getScriptProperties();
  const visitorTotal = Number(props.getProperty('VISITOR_TOTAL') || 0);
  const todayKey = Utilities.formatDate(new Date(), 'Europe/Istanbul', 'yyyy-MM-dd');
  const visitorToday = Number(
    props.getProperty('VISITOR_TODAY_KEY') === todayKey
      ? props.getProperty('VISITOR_TODAY') || 0
      : 0
  );

  const result = {
    ok: true,
    comments: comments,
    votes: votes,
    visitors: {
      total: visitorTotal,
      today: visitorToday
    }
  };
  const json = JSON.stringify(result);

  if (callback && /^[A-Za-z_$][\w$\.]*$/.test(callback)) {
    return ContentService.createTextOutput(callback + '(' + json + ')')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const p = (e && e.parameter) || {};
    const action = String(p.action || '');
    const sh = getSheet_();

    if (action === 'yorum') {
      const name = String(p.name || '').trim().slice(0, 60);
      const text = String(p.text || '').trim().slice(0, 1000);
      if (!name || !text) return reply_({ ok: false, error: 'Ad ve yorum gerekli.' });
      sh.appendRow([new Date(), 'yorum', name, text, '']);
      const email = getAdminEmail_();
      if (email) MailApp.sendEmail({
        to: email,
        subject: 'İonenSpiegel: Yeni yorum',
        htmlBody: '<h2>Yeni İonenSpiegel yorumu</h2><p><b>Ad:</b> ' + esc_(name) + '</p><p><b>Yorum:</b><br>' + esc_(text).replace(/\n/g, '<br>') + '</p>'
      });
      return reply_({ ok: true });
    }

    if (action === 'anket') {
      const choice = String(p.choice || '');
      if (!/^[0-3]$/.test(choice)) return reply_({ ok: false, error: 'Geçersiz seçim.' });
      sh.appendRow([new Date(), 'anket', '', '', choice]);
      const labels = ['Victor Osimhen', 'Orkun Kökçü', 'Fred', 'Thomas Müller'];
      const email = getAdminEmail_();
      if (email) MailApp.sendEmail({
        to: email,
        subject: 'İonenSpiegel: Yeni anket oyu',
        htmlBody: '<h2>Yeni anket oyu</h2><p><b>Seçim:</b> ' + esc_(labels[Number(choice)]) + '</p>'
      });
      return reply_({ ok: true });
    }

    if (action === 'ziyaret') {
      const props = PropertiesService.getScriptProperties();
      const lock = LockService.getScriptLock();
      lock.waitLock(5000);

      try {
        const todayKey = Utilities.formatDate(new Date(), 'Europe/Istanbul', 'yyyy-MM-dd');
        const total = Number(props.getProperty('VISITOR_TOTAL') || 0) + 1;
        let today = Number(props.getProperty('VISITOR_TODAY') || 0);

        if (props.getProperty('VISITOR_TODAY_KEY') !== todayKey) {
          today = 0;
          props.setProperty('VISITOR_TODAY_KEY', todayKey);
        }

        today += 1;
        props.setProperty('VISITOR_TOTAL', String(total));
        props.setProperty('VISITOR_TODAY', String(today));

        return reply_({
          ok: true,
          visitors: { total: total, today: today }
        });
      } finally {
        lock.releaseLock();
      }
    }

    return reply_({ ok: false, error: 'Bilinmeyen işlem.' });
  } catch (err) {
    return reply_({ ok: false, error: String(err) });
  }
}



/* ---------- OTOMATİK HABER AKIŞI ---------- */
const NEWS_CONFIG = {
  maxItems: 12,
  cacheSeconds: 300,
  feeds: [
    { name: 'Anadolu Ajansı', url: 'https://www.aa.com.tr/rss/ajansguncel.xml' }
  ],
  footballKeywords: [
    'futbol','futbolcu','süper lig','şampiyonlar ligi','avrupa ligi','konferans ligi',
    'galatasaray','fenerbahçe','beşiktaş','trabzonspor','başakşehir','konyaspor',
    'gaziantep','göztepe','rizespor','eyüpspor','kocaelispor','samsunspor','gençlerbirliği',
    'amed','kasimpaşa','kasımpaşa','alanyaspor','erzurumspor','transfer','uefa','tff',
    'premier lig','la liga','serie a','bundesliga','ligue 1','champions league','europa league'
  ]
};

function getNews_() {
  const cache = CacheService.getScriptCache();
  const cached = cache.get('IONENSPIEGEL_NEWS_V26');
  if (cached) return JSON.parse(cached);

  let items = [];
  NEWS_CONFIG.feeds.forEach(function(feed) {
    try {
      const xml = UrlFetchApp.fetch(feed.url, {
        muteHttpExceptions: true,
        followRedirects: true,
        headers: { 'User-Agent': 'Mozilla/5.0 İonenSpiegel/26' }
      }).getContentText('UTF-8');
      items = items.concat(parseNewsFeed_(xml, feed.name));
    } catch (err) {
      console.log('RSS hatası: ' + feed.name + ' / ' + err);
    }
  });

  const unique = {};
  items = items.filter(function(item) {
    const key = item.link || item.title;
    if (!key || unique[key]) return false;
    unique[key] = true;
    return true;
  });

  items.sort(function(a,b) {
    return new Date(b.pubDate || 0).getTime() - new Date(a.pubDate || 0).getTime();
  });

  let football = items.filter(function(item) {
    const text = (item.title + ' ' + item.description).toLocaleLowerCase('tr-TR');
    return NEWS_CONFIG.footballKeywords.some(function(k) { return text.indexOf(k) !== -1; });
  });

  if (football.length < 4) {
    football = football.concat(fetchAaFootballFallback_());
    const seenFallback = {};
    football = football.filter(function(item) {
      const key = item.link || item.title;
      if (!key || seenFallback[key]) return false;
      seenFallback[key] = true;
      return true;
    });
  }

  const result = {
    ok: true,
    source: 'Anadolu Ajansı RSS',
    updatedAt: new Date().toISOString(),
    items: football.slice(0, NEWS_CONFIG.maxItems)
  };
  cache.put('IONENSPIEGEL_NEWS_V26', JSON.stringify(result), NEWS_CONFIG.cacheSeconds);
  return result;
}


function fetchAaFootballFallback_() {
  const out = [];
  try {
    const html = UrlFetchApp.fetch('https://www.aa.com.tr/tr/futbol/', {
      muteHttpExceptions: true,
      followRedirects: true,
      headers: { 'User-Agent': 'Mozilla/5.0 İonenSpiegel/26' }
    }).getContentText('UTF-8');
    const re = /<a[^>]+href=["'](\/tr\/futbol\/[^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
    let m;
    while ((m = re.exec(html)) && out.length < NEWS_CONFIG.maxItems) {
      const title = cleanNewsText_(m[2]);
      if (!title || title.length < 18) continue;
      const lower = title.toLocaleLowerCase('tr-TR');
      if (!NEWS_CONFIG.footballKeywords.some(function(k) { return lower.indexOf(k) !== -1; })) continue;
      out.push({
        title: title,
        description: 'Anadolu Ajansı futbol sayfasındaki güncel haber.',
        link: 'https://www.aa.com.tr' + m[1],
        pubDate: new Date().toISOString(),
        source: 'Anadolu Ajansı',
        category: newsCategory_(title)
      });
    }
  } catch (err) {
    console.log('AA futbol yedek akışı hatası: ' + err);
  }
  return out;
}

function parseNewsFeed_(xmlText, sourceName) {
  const out = [];
  try {
    const doc = XmlService.parse(xmlText);
    const root = doc.getRootElement();
    const channel = root.getName() === 'rss' ? root.getChild('channel') : null;
    const nodes = channel ? channel.getChildren('item') : root.getChildren('entry');

    nodes.forEach(function(node) {
      const title = xmlText_(node, 'title');
      let link = xmlText_(node, 'link');
      if (!link) {
        const linkEl = node.getChild('link');
        if (linkEl) link = linkEl.getAttribute('href') ? linkEl.getAttribute('href').getValue() : '';
      }
      const description = cleanNewsText_(xmlText_(node, 'description') || xmlText_(node, 'summary') || '');
      const pubDate = xmlText_(node, 'pubDate') || xmlText_(node, 'published') || xmlText_(node, 'updated') || '';
      if (!title || !link) return;
      out.push({
        title: cleanNewsText_(title),
        description: description.slice(0, 240),
        link: link,
        pubDate: pubDate,
        source: sourceName,
        category: newsCategory_(title + ' ' + description)
      });
    });
  } catch (err) {
    console.log('XML parse hatası: ' + err);
  }
  return out;
}

function xmlText_(node, name) {
  const child = node.getChild(name);
  return child ? child.getText() : '';
}

function cleanNewsText_(value) {
  return String(value || '')
    .replace(/<!\[CDATA\[|\]\]>/g, '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function newsCategory_(text) {
  const t = String(text).toLocaleLowerCase('tr-TR');
  if (t.indexOf('transfer') !== -1) return 'TRANSFER';
  if (t.indexOf('uefa') !== -1 || t.indexOf('şampiyonlar ligi') !== -1 || t.indexOf('avrupa ligi') !== -1) return 'AVRUPA';
  if (t.indexOf('galatasaray') !== -1) return 'GALATASARAY';
  if (t.indexOf('fenerbahçe') !== -1) return 'FENERBAHÇE';
  if (t.indexOf('beşiktaş') !== -1) return 'BEŞİKTAŞ';
  if (t.indexOf('trabzonspor') !== -1) return 'TRABZONSPOR';
  return 'FUTBOL';
}

function reply_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function esc_(v) {
  return String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
