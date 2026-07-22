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
  function fill(scope){
    Array.prototype.forEach.call((scope||document).querySelectorAll('.fl[data-w]'),function(f){
      if(f.dataset.done)return;
      f.dataset.done=1;
      setTimeout(function(){ f.style.width=f.dataset.w+'%'; f.classList.add('on'); },120);
    });
  }
  SG.fill=fill;
  /* 화면 밖 카드까지 전부 채움 — iframe 임베드처럼 스크롤이 없는 환경 대비 */
  SG.fillAll=function(){ fill(document); };
  SG.revealAll=function(){ $$('.rv').forEach(function(el){el.classList.add('in')}); fill(document); };
  SG.reveal=function(){
    var rvs=$$('.rv');
    /* 문서가 스크롤되지 않는 상황(짧은 페이지·고정높이 iframe)에선 관찰해도 영영 안 뜬다 → 즉시 표시 */
    if(document.documentElement.scrollHeight<=window.innerHeight+4){ SG.revealAll(); return; }
    if('IntersectionObserver' in window){
      var io=new IntersectionObserver(function(es){es.forEach(function(en){
        if(en.isIntersecting){en.target.classList.add('in');fill(en.target);io.unobserve(en.target);}
      })},{threshold:.14,rootMargin:'220px 0px'});
      rvs.forEach(function(el){if(!el.classList.contains('in'))io.observe(el)});
    }else SG.revealAll();
  };
  SG.reveal();

  /* ---- 서브페이지 공통 배경 교체 (프로필~옷장 한 번에) ---- */
  SG.applyBg=function(p){
    if(!p)return;
    [['sub-bg-night','--sub-bg-night'],['sub-bg-day','--sub-bg-day']].forEach(function(pair){
      var v=p[pair[0]];
      if(v==null||typeof v==='object')return;
      v=String(v).trim(); if(!v)return;
      document.documentElement.style.setProperty(pair[1],'url("'+v.replace(/"/g,'%22')+'")');
    });
  };

  /* ---- 서브페이지 공용: profile.data의 값으로 [data-hook] 채우기 ---- */
  SG.applyHooks=async function(){
    try{
      if(typeof db==='undefined'||!db)return;
      var res=await db.from('profile').select('data').eq('id',1).single();
      var p=res&&res.data&&res.data.data; if(!p)return;
      SG.applyBg(p);
      $$('[data-href]').forEach(function(el){
        var u=p[el.getAttribute('data-href')];
        if(u==null||typeof u==='object')return;
        u=String(u).trim(); if(u) el.setAttribute('href',u);
      });
      $$('[data-hook]').forEach(function(el){
        var v=p[el.getAttribute('data-hook')];
        if(v==null||typeof v==='object')return;      /* 타입 방어: [object Object] 금지 */
        var t=String(v); if(!t.trim())return;
        el.innerHTML=t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>');
      });
    }catch(e){}
  };

  /* ---- FOUC 게이트 ---- */
  SG.ready=function(){
    document.body.classList.add('ready');
    $$('.rv').forEach(function(el){var r=el.getBoundingClientRect();
      if(r.top<window.innerHeight*0.9){el.classList.add('in');fill(el);}});
    if(!SG._net){ SG._net=1; setTimeout(SG.revealAll,3000); }   /* 안전망 */
  };
  if(document.readyState==='complete')SG.ready();
  else window.addEventListener('load',SG.ready);
  setTimeout(SG.ready,1600);
})();
