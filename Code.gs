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
  const result = { ok: true, comments: comments, votes: votes };
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

    return reply_({ ok: false, error: 'Bilinmeyen işlem.' });
  } catch (err) {
    return reply_({ ok: false, error: String(err) });
  }
}

function reply_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function esc_(v) {
  return String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
