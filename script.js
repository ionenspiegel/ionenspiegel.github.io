const newsData=[
 {id:1,cat:"Beşiktaş",title:"Beşiktaş 4-1 Marseille: Avrupa'da unutulmaz gece",date:"17 Eylül 2026",body:"Beşiktaş, Avrupa Ligi'ndeki karşılaşmada Marseille karşısında 4-1'lik galibiyet aldı. Siyah-beyazlı ekip, taraftarının önünde etkili bir futbol ortaya koydu.",image:"hero-bjk.jpg"},
 {id:2,cat:"Fenerbahçe",title:"Fenerbahçe'de transfer gündemi hareketli",date:"18 Eylül 2026",body:"Fenerbahçe'de transfer ve kadro planlamasıyla ilgili yeni gelişmeler gündemin öne çıkan başlıkları arasında.",image:"local-1.svg"},
 {id:3,cat:"Galatasaray",title:"Galatasaray'da derbi hazırlıkları sürüyor",date:"18 Eylül 2026",body:"Galatasaray, ligdeki kritik mücadele öncesinde hazırlıklarını sürdürüyor.",image:"local-2.svg"},
 {id:4,cat:"Avrupa",title:"Avrupa Ligi'nde ilk hafta heyecanı",date:"18 Eylül 2026",body:"Avrupa Ligi'nde ilk hafta karşılaşmaları tamamlanırken takımların performansları dikkat çekti.",image:"local-3.svg"},
 {id:5,cat:"Türkiye",title:"Süper Lig'de haftanın programı belli oldu",date:"18 Eylül 2026",body:"Süper Lig'de yeni haftada oynanacak karşılaşmalar futbolseverleri bekliyor.",image:"local-4.svg"},
 {id:6,cat:"Beşiktaş",title:"Siyah-beyazlılarda sıradaki Avrupa maçı",date:"18 Eylül 2026",body:"Beşiktaş'ın Avrupa takvimindeki bir sonraki karşılaşması için hazırlıklar başladı.",image:"local-5.svg"}
];

const matches=[
 {date:"17 Eyl",time:"22:00",league:"Avrupa",home:"Beşiktaş",away:"Marseille",score:"4 - 1",status:"MS"},
 {date:"17 Eyl",time:"19:45",league:"Avrupa",home:"Milan",away:"Benfica",score:"0 - 2",status:"MS"},
 {date:"17 Eyl",time:"22:00",league:"Avrupa",home:"Leverkusen",away:"Celje",score:"2 - 0",status:"MS"},
 {date:"18 Eyl",time:"20:00",league:"Türkiye",home:"Kasımpaşa",away:"Konyaspor",score:"20:00",status:"VS"},
 {date:"18 Eyl",time:"20:00",league:"Türkiye",home:"Kocaelispor",away:"Gaziantep FK",score:"20:00",status:"VS"},
 {date:"19 Eyl",time:"20:00",league:"Türkiye",home:"Trabzonspor",away:"Galatasaray",score:"20:00",status:"VS"},
 {date:"20 Eyl",time:"20:00",league:"Türkiye",home:"Fenerbahçe",away:"Eyüpspor",score:"20:00",status:"VS"},
 {date:"21 Eyl",time:"20:00",league:"Türkiye",home:"Amed",away:"Beşiktaş",score:"20:00",status:"VS"},
 {date:"25 Eyl",time:"22:00",league:"Avrupa",home:"Beşiktaş",away:"OFI",score:"22:00",status:"VS"}
];

const standings={
 super:[
 ["Galatasaray",5,5,0,0,12,15],["Fenerbahçe",5,4,1,0,9,13],["Beşiktaş",5,4,0,1,7,12],["Trabzonspor",5,3,1,1,5,10],["Başakşehir",5,3,1,1,3,10],["Samsunspor",5,2,2,1,2,8],["Kasımpaşa",5,2,1,2,0,7],["Göztepe",5,1,3,1,1,6]
 ],
 premier:[
 ["Manchester City",5,4,1,0,9,13],["Arsenal",5,4,0,1,7,12],["Liverpool",5,3,1,1,5,10],["Chelsea",5,3,1,1,3,10],["Manchester United",5,2,2,1,2,8],["Aston Villa",5,2,1,2,0,7]
 ]
};

const qs=s=>document.querySelector(s);
const qsa=s=>[...document.querySelectorAll(s)];

function renderBreaking(){
 const items=["Beşiktaş 4-1 Marseille","Fenerbahçe'de transfer gündemi hareketli","Trabzonspor-Galatasaray derbisi 19 Eylül'de"];
 qs("#breakingList").innerHTML=items.map(x=>`<a href="#haberler"><b>${x}</b></a>`).join("");
}

let newsFilter="Tümü";
function renderNews(){
 const cats=["Tümü","Beşiktaş","Fenerbahçe","Galatasaray","Avrupa","Türkiye"];
 qs("#newsFilters").innerHTML=cats.map(c=>`<button class="chip ${c===newsFilter?"active":""}" data-news="${c}">${c}</button>`).join("");
 const list=newsFilter==="Tümü"?newsData:newsData.filter(n=>n.cat===newsFilter);
 qs("#newsGrid").innerHTML=list.map(n=>`
  <article class="news-card" data-id="${n.id}">
   <div class="news-thumb" style="background-image:url('${n.image}')"></div>
   <div class="news-info"><span>${n.cat.toUpperCase()}</span><h3>${n.title}</h3><p>${n.date}</p></div>
  </article>`).join("");
 qsa("[data-news]").forEach(b=>b.onclick=()=>{newsFilter=b.dataset.news;renderNews()});
 qsa(".news-card").forEach(c=>c.onclick=e=>{if(e.target.closest("button"))return;openNews(+c.dataset.id)});
 qs("#headlineList").innerHTML=newsData.slice(0,5).map(n=>`<li>${n.title}</li>`).join("");
}

function openNews(id){
 const n=newsData.find(x=>x.id===id);if(!n)return;
 qs("#modalCategory").textContent=n.cat;
 qs("#modalTitle").textContent=n.title;
 qs("#modalDate").textContent=n.date;
 qs("#modalBody").textContent=n.body;
 const img=qs("#modalImage");img.src=n.image;img.alt=n.title;img.hidden=false;
 qs("#modalSource").href="https://ionenspiegel.github.io/";
 qs("#newsModal").classList.add("open");qs("#newsModal").setAttribute("aria-hidden","false");
}
qsa("[data-close]").forEach(b=>b.onclick=()=>{const m=qs("#"+b.dataset.close);m.classList.remove("open");m.setAttribute("aria-hidden","true")});
qs("#newsModal").addEventListener("click",e=>{if(e.target.id==="newsModal")e.currentTarget.classList.remove("open")});

function renderMatches(filter="all"){
 let list=matches;
 if(filter==="today")list=matches.filter(m=>m.date==="18 Eyl");
 if(filter==="turkey")list=matches.filter(m=>m.league==="Türkiye");
 if(filter==="europe")list=matches.filter(m=>m.league==="Avrupa");
 if(filter==="besiktas")list=matches.filter(m=>m.home==="Beşiktaş"||m.away==="Beşiktaş");
 qs("#matchGrid").innerHTML=list.map(m=>`
  <article class="match-card">
   <div class="match-meta"><span>${m.date} · ${m.time}</span><b>${m.league}</b></div>
   <div class="match-teams"><strong>${m.home}</strong><span class="match-score">${m.score}<small>${m.status}</small></span><strong>${m.away}</strong></div>
  </article>`).join("");
}
qsa("#matchFilters .chip").forEach(b=>b.onclick=()=>{qsa("#matchFilters .chip").forEach(x=>x.classList.remove("active"));b.classList.add("active");renderMatches(b.dataset.filter)});

function renderStandings(league="super"){
 const data=standings[league];
 qs("#tableTitle").textContent=league==="super"?"Trendyol Süper Lig":"Premier League";
 qs("#standingsBody").innerHTML=data.map((r,i)=>`<tr><td>${i+1}</td><td><strong>${r[0]}</strong></td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td>${r[4]}</td><td>${r[5]}</td><td><strong>${r[6]}</strong></td></tr>`).join("");
}
qsa(".league-tab").forEach(b=>b.onclick=()=>{qsa(".league-tab").forEach(x=>x.classList.remove("active"));b.classList.add("active");renderStandings(b.dataset.league)});

function renderCalendar(){
 const upcoming=matches.filter(m=>m.status==="VS").slice(0,6);
 qs("#calendarGrid").innerHTML=upcoming.map(m=>`<article class="calendar-card"><div class="date">${m.date} · ${m.time}</div><h3>${m.home} - ${m.away}</h3><p>${m.league} · Maç saati ${m.time}</p></article>`).join("");
}

function renderPoll(){
 const players=["İlhan Fakılı","Václav Černý","Amir Murillo","Ernest Poku"];
 qs("#pollOptions").innerHTML=players.map((p,i)=>`<label class="poll-option"><input type="radio" name="player" value="${p}" ${i===0?"checked":""}>${p}</label>`).join("");
 qs("#voteBtn").onclick=()=>{
  const selected=qs('input[name="player"]:checked')?.value;
  if(selected){localStorage.setItem("ionenspiegel-poll",selected);qs("#pollStatus").textContent=`Seçimin kaydedildi: ${selected}`;qs("#playerOfWeek").textContent=selected}
 };
 const saved=localStorage.getItem("ionenspiegel-poll");if(saved)qs("#playerOfWeek").textContent=saved;
}

qs("#menuBtn").onclick=()=>qs("#mobileMenu").classList.toggle("open");
renderBreaking();renderNews();renderMatches();renderStandings();renderCalendar();renderPoll();
