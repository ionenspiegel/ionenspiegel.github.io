const CONFIG = {
  ADMIN_EMAIL: 'topcuyusuf254@gmail.com',
  SHEET_NAME: 'İonenSpiegel Topluluk Verileri'
};

const NEWS_SOURCES = [
  {name:'Anadolu Ajansı', url:'https://www.aa.com.tr/rss/ajansguncel.xml'}
];

function getAdminEmail_() {
  return CONFIG.ADMIN_EMAIL;
}

function getSheet_() {
  const props = PropertiesService.getScriptProperties();
  let id = props.getProperty('SHEET_ID');
  if (id) return SpreadsheetApp.openById(id).getSheets()[0];
  const ss = SpreadsheetApp.create(CONFIG.SHEET_NAME);
  const sh = ss.getSheets()[0];
  sh.setName('Veriler');
  sh.appendRow(['Tarih','Tür','Ad','Yorum','Seçim']);
  props.setProperty('SHEET_ID', ss.getId());
  return sh;
}

function cleanText_(s) {
  return String(s || '').replace(/<!\[CDATA\[|\]\]>/g,'').replace(/<[^>]*>/g,' ')
    .replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'")
    .replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/\s+/g,' ').trim();
}

function parseRss_(xml, sourceName) {
  const out=[];
  const doc=XmlService.parse(xml);
  const root=doc.getRootElement();
  let items=[];
  const channel=root.getChild('channel');
  if(channel) items=channel.getChildren('item');
  else {
    const atomEntries=root.getChildren('entry', root.getNamespace());
    items=atomEntries.map(e=>e);
  }
  items.forEach(item=>{
    const get=(tag)=>{
      let e=item.getChild(tag);
      if(!e) e=item.getChild(tag, item.getNamespace());
      return e ? cleanText_(e.getText()) : '';
    };
    let title=get('title');
    let desc=get('description') || get('summary') || get('content');
    let link=get('link');
    if(!link){
      const le=item.getChild('link', item.getNamespace());
      if(le) link=le.getAttribute('href') ? le.getAttribute('href').getValue() : le.getText();
    }
    const pub=get('pubDate') || get('published') || get('updated');
    if(!title || !link) return;
    const hay=(title+' '+desc).toLocaleLowerCase('tr-TR');
    const football=/(futbol|süper lig|uefa|şampiyonlar ligi|avrupa ligi|transfer|fenerbahçe|galatasaray|beşiktaş|trabzonspor|samsunspor|başakşehir|kasımpaşa|konyaspor|göztepe|rizespor|gaziantep|eyüpspor|amed|kocaelispor|çorum fk|gençlerbirliği|alanyaspor)/i.test(hay);
    if(!football) return;
    out.push({
      title:title.slice(0,220),
      summary:(desc||'Güncel futbol haberi.').slice(0,360),
      source:sourceName,
      link:link,
      published:pub
    });
  });
  return out;
}

function getNews_() {
  let all=[];
  NEWS_SOURCES.forEach(src=>{
    try {
      const r=UrlFetchApp.fetch(src.url,{muteHttpExceptions:true,followRedirects:true});
      if(r.getResponseCode()>=200 && r.getResponseCode()<300)
        all=all.concat(parseRss_(r.getContentText(),src.name));
    } catch(e) {}
  });
  const seen={};
  all=all.filter(n=>{
    const k=n.link||n.title;
    if(seen[k]) return false; seen[k]=true; return true;
  });
  return all.slice(0,30);
}

function doGet(e) {
  const callback=String((e&&e.parameter&&e.parameter.callback)||'');
  const sh=getSheet_(), values=sh.getDataRange().getValues();
  const comments=[], votes={'0':0,'1':0,'2':0,'3':0};
  let total=Number(PropertiesService.getScriptProperties().getProperty('VISITOR_TOTAL')||0);
  let today=Number(PropertiesService.getScriptProperties().getProperty('VISITOR_TODAY')||0);
  for(let i=1;i<values.length;i++){
    const row=values[i], type=String(row[1]||'');
    if(type==='yorum') comments.push({name:String(row[2]||'Ziyaretçi'),text:String(row[3]||''),date:row[0] instanceof Date?row[0].toLocaleString('tr-TR'):String(row[0]||'')});
    if(type==='anket'){const c=String(row[4]||'');if(Object.prototype.hasOwnProperty.call(votes,c))votes[c]++;}
  }
  comments.reverse(); comments.splice(50);
  const result={ok:true,comments:comments,votes:votes,visitors:{total:total,today:today},news:getNews_()};
  const json=JSON.stringify(result);
  if(callback && /^[A-Za-z_$][\w$\.]*$/.test(callback))
    return ContentService.createTextOutput(callback+'('+json+')').setMimeType(ContentService.MimeType.JAVASCRIPT);
  return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e){
  try{
    const p=(e&&e.parameter)||{}, action=String(p.action||''), sh=getSheet_();
    if(action==='ziyaret'){
      const lock=LockService.getScriptLock(); lock.waitLock(5000);
      try{
        const props=PropertiesService.getScriptProperties();
        const key=Utilities.formatDate(new Date(),Session.getScriptTimeZone(),'yyyy-MM-dd');
        let total=Number(props.getProperty('VISITOR_TOTAL')||0)+1;
        let today=Number(props.getProperty('VISITOR_TODAY')||0);
        if(props.getProperty('VISITOR_TODAY_KEY')!==key){today=0;props.setProperty('VISITOR_TODAY_KEY',key);}
        today++;
        props.setProperties({VISITOR_TOTAL:String(total),VISITOR_TODAY:String(today)});
      } finally {lock.releaseLock();}
      return reply_({ok:true});
    }
    if(action==='yorum'){
      const name=String(p.name||'').trim().slice(0,60), text=String(p.text||'').trim().slice(0,1000);
      if(!name||!text)return reply_({ok:false,error:'Ad ve yorum gerekli.'});
      sh.appendRow([new Date(),'yorum',name,text,'']);
      MailApp.sendEmail({to:getAdminEmail_(),subject:'İonenSpiegel: Yeni yorum',htmlBody:'<h2>Yeni İonenSpiegel yorumu</h2><p><b>Ad:</b> '+esc_(name)+'</p><p><b>Yorum:</b><br>'+esc_(text).replace(/\n/g,'<br>')+'</p>'});
      return reply_({ok:true});
    }
    if(action==='anket'){
      const choice=String(p.choice||'');
      if(!/^[0-3]$/.test(choice))return reply_({ok:false,error:'Geçersiz seçim.'});
      sh.appendRow([new Date(),'anket','','',choice]);
      const labels=['Victor Osimhen','Orkun Kökçü','Fred','Thomas Müller'];
      MailApp.sendEmail({to:getAdminEmail_(),subject:'İonenSpiegel: Yeni anket oyu',htmlBody:'<h2>Yeni anket oyu</h2><p><b>Seçim:</b> '+esc_(labels[Number(choice)])+'</p>'});
      return reply_({ok:true});
    }
    return reply_({ok:false,error:'Bilinmeyen işlem.'});
  }catch(err){return reply_({ok:false,error:String(err)});}
}
function reply_(obj){return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);}
function esc_(v){return String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
