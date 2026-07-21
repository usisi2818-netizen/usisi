/* ============================================================
   signal.js — NIGHT SIGNAL 공통 동작
   낮밤 모드 · 별밭 · 클릭 ✦ · D-Day · SEND SIGNAL 모달(실전송) ·
   페이지 전환 커버 · 스크롤 리빌 · FOUC 게이트
   로드 순서: supabase.js 뒤, 페이지 스크립트 앞 권장
   ============================================================ */
(function(){
  var $=function(s){return document.querySelector(s)};
  var $$=function(s){return Array.prototype.slice.call(document.querySelectorAll(s))};
  var SG=window.SG={};

  /* ---- 낮/밤 모드 (localStorage 'usisi-mode') ---- */
  var modeBtn=$('#pfMode');
  function syncMode(){
    if(!modeBtn)return;
    var d=document.body.classList.contains('day');
    var mi=modeBtn.querySelector('.mi'),mt=modeBtn.querySelector('.mt');
    if(mi)mi.textContent=d?'☀':'☾';
    if(mt)mt.textContent=d?'DAY':'NIGHT';
  }
  syncMode();
  if(modeBtn)modeBtn.addEventListener('click',function(){
    document.body.classList.toggle('day');
    localStorage.setItem('usisi-mode',document.body.classList.contains('day')?'day':'night');
    syncMode();
  });

  /* ---- D-Day ---- */
  SG.dday=function(md){var n=new Date(),p=md.split('-'),m=+p[0],d=+p[1];
    var today=new Date(n.getFullYear(),n.getMonth(),n.getDate());
    var t=new Date(n.getFullYear(),m-1,d);
    if(t<today)t=new Date(n.getFullYear()+1,m-1,d);
    return Math.round((t-today)/864e5);};
  SG.dplus=function(iso){var p=iso.split('-'),s=new Date(+p[0],+p[1]-1,+p[2]);
    var n=new Date(),today=new Date(n.getFullYear(),n.getMonth(),n.getDate());
    return Math.floor((today-s)/864e5);};
  var bd=SG.dday('06-01'),dp=SG.dplus('2026-04-10');
  $$('[data-dday]').forEach(function(e){e.textContent=(bd===0?'TODAY ✦':'D-'+bd)});
  $$('[data-dday-num]').forEach(function(e){e.textContent=bd});
  $$('[data-debut]').forEach(function(e){e.textContent='D+'+dp});

  /* ---- 별밭 ---- */
  var stars=$('#pfStars');
  if(stars)for(var i=0;i<30;i++){var st=document.createElement('i');var z=Math.random();
    st.style.left=(Math.random()*100)+'%';st.style.top=(Math.random()*100)+'%';
    st.style.width=st.style.height=(z*2+0.8)+'px';
    st.style.animationDuration=(2.6+Math.random()*3)+'s';
    st.style.animationDelay=(Math.random()*3)+'s';
    stars.appendChild(st);}

  /* ---- 클릭 ✦ ---- */
  function pop(x,y,n){var fx=$('#pfFx');if(!fx)return;
    for(var i=0;i<n;i++){var p=document.createElement('span');
      p.className='pf-pop';p.textContent='✦';
      p.style.left=(x+(Math.random()*30-15))+'px';p.style.top=(y+(Math.random()*12-6))+'px';
      fx.appendChild(p);(function(q){setTimeout(function(){q.remove()},900)})(p);}}
  SG.pop=pop;
  SG.bump=function(el){el.classList.remove('pf-bump');void el.offsetWidth;el.classList.add('pf-bump');};
  document.addEventListener('click',function(e){
    if(e.target.closest('button, a, textarea, input, select, #pfSig'))return;
    pop(e.clientX,e.clientY,1);
  });

  /* ---- SEND SIGNAL 모달 (Supabase 실전송) ---- */
  var mask=$('#pfMask'),M=$('#pfSig');
  function openSig(){if(!M)return;mask.classList.add('on');M.classList.add('on');M.classList.remove('ok');var t=$('#pfTa');if(t)t.value='';}
  function closeSig(){if(!M)return;mask.classList.remove('on');M.classList.remove('on');}
  SG.openAsk=openSig;
  if(M){
    $$('[data-ask]').forEach(function(b){b.addEventListener('click',openSig)});
    var ab=$('#pfAskBtn');if(ab)ab.addEventListener('click',openSig);
    mask.addEventListener('click',closeSig);
    var cb=$('#pfClose');if(cb)cb.addEventListener('click',closeSig);
    var sb=$('#pfSend');if(sb)sb.addEventListener('click',function(){
      var t=$('#pfTa'),v=(t&&t.value||'').trim();
      if(!v){alert('내용을 입력해 주세요!');return;}
      if(typeof insertRow!=='function'){alert('서버 연결 전이에요 — 키 설정 후 전송할 수 있어요.');return;}
      sb.disabled=true;
      insertRow('inquiries',{message:v}).then(function(ok){
        sb.disabled=false;
        if(ok){M.classList.add('ok');setTimeout(closeSig,1500);}
        else alert('전송에 실패했어요. 잠시 후 다시 시도해 주세요.');
      });
    });
    document.addEventListener('keydown',function(e){if(e.key==='Escape')closeSig()});
  }

  /* ---- 페이지 전환 커버 ---- */
  var cover=document.createElement('div');
  cover.id='sgCover';
  cover.innerHTML='<div class="in"><i></i>CONNECTING…</div>';
  document.body.appendChild(cover);
  var noMotion=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.addEventListener('click',function(e){
    var a=e.target.closest('a[href]');
    if(!a||noMotion)return;
    var href=a.getAttribute('href');
    if(!href||a.target==='_blank'||href.charAt(0)==='#')return;
    if(/^(https?:|mailto:|tel:)/i.test(href))return;      /* 외부 링크 제외 */
    e.preventDefault();
    cover.classList.add('on');
    setTimeout(function(){location.href=href;},240);
  });

  /* ---- 스크롤 리빌 + 게이지 ---- */
  function fill(scope){Array.prototype.forEach.call(scope.querySelectorAll('.fl[data-w]'),function(f){
    if(!f.dataset.done){f.dataset.done=1;setTimeout(function(){f.style.width=f.dataset.w+'%';},120);}});}
  SG.reveal=function(){
    var rvs=$$('.rv');
    if('IntersectionObserver' in window){
      var io=new IntersectionObserver(function(es){es.forEach(function(en){
        if(en.isIntersecting){en.target.classList.add('in');fill(en.target);io.unobserve(en.target);}
      })},{threshold:.14});
      rvs.forEach(function(el){if(!el.classList.contains('in'))io.observe(el)});
    }else rvs.forEach(function(el){el.classList.add('in');fill(el)});
  };
  SG.reveal();

  /* ---- FOUC 게이트 ---- */
  SG.ready=function(){
    document.body.classList.add('ready');
    $$('.rv').forEach(function(el){var r=el.getBoundingClientRect();
      if(r.top<window.innerHeight*0.9){el.classList.add('in');fill(el);}});
  };
  if(document.readyState==='complete')SG.ready();
  else window.addEventListener('load',SG.ready);
  setTimeout(SG.ready,1600);
})();
