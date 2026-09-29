/* V85.2: deterministic Super Lig tabs, even when older handlers fail. */
(function(){
  const root=document.querySelector('.table-tabs[data-tablist], .table-tabs.stats-tabs');
  if(!root)return;
  const keys=['standings','results','fixtures','goals','assists'];
  function activate(key){
    if(!keys.includes(key))return;
    root.querySelectorAll('button[data-table]').forEach(button=>{
      const active=button.dataset.table===key;
      button.classList.toggle('active',active);
      button.setAttribute('aria-selected',active?'true':'false');
      button.tabIndex=active?0:-1;
    });
    keys.forEach(name=>{
      const panel=document.getElementById(name+'Panel');
      if(!panel)return;
      const active=name===key;
      panel.hidden=!active;
      panel.classList.toggle('show',active);
      panel.setAttribute('aria-hidden',active?'false':'true');
    });
  }
  root.addEventListener('click',event=>{
    const button=event.target.closest('button[data-table]');
    if(!button||!root.contains(button))return;
    event.preventDefault();
    event.stopImmediatePropagation();
    activate(button.dataset.table);
  },true);
  root.addEventListener('keydown',event=>{
    const buttons=[...root.querySelectorAll('button[data-table]')];
    const index=buttons.indexOf(event.target.closest('button[data-table]'));
    if(index<0)return;
    let next=-1;
    if(event.key==='ArrowRight')next=(index+1)%buttons.length;
    if(event.key==='ArrowLeft')next=(index-1+buttons.length)%buttons.length;
    if(event.key==='Home')next=0;
    if(event.key==='End')next=buttons.length-1;
    if(next>=0){event.preventDefault();buttons[next].focus();activate(buttons[next].dataset.table)}
  });
  const selected=root.querySelector('button[data-table].active')||root.querySelector('button[data-table]');
  if(selected)activate(selected.dataset.table);
})();

/* Header theme switch stays synchronized with the existing menu switch. */
(function(){
  const button=document.getElementById('themeToggleButton');
  if(!button)return;
  const html=document.documentElement;
  function sync(){
    const dark=html.classList.contains('dark-theme');
    button.textContent=dark?'☀':'☾';
    button.setAttribute('aria-label',dark?'Açık temaya geç':'Koyu temaya geç');
    button.title=dark?'Açık tema':'Koyu tema';
  }
  button.addEventListener('click',()=>{
    const dark=html.classList.contains('dark-theme');
    html.classList.toggle('dark-theme',!dark);
    try{localStorage.setItem('ionenspiegel-theme',dark?'light':'dark')}catch(e){}
    document.getElementById('themeColorMeta')?.setAttribute('content',dark?'#f3f0ea':'#111419');
    sync();
  });
  new MutationObserver(sync).observe(html,{attributes:true,attributeFilter:['class']});
  sync();
})();
