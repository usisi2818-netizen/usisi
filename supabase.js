/* =============================================
   supabase.js — Supabase 연동 공통 스크립트
   ✅ 이 파일 상단 두 줄만 본인 값으로 교체!
   (키를 넣기 전에도 사이트는 기본값으로 정상 표시됩니다)
   ============================================= */

const SUPABASE_URL  = 'https://njkprtsozcdqssmkpfvo.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qa3BydHNvemNkcXNzbWtwZnZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2MDg3NDUsImV4cCI6MjEwMDE4NDc0NX0.zisu2YFY4RIR94GXqeJ3u4O2T4LGMpduKQ2IwxHtZI8';

// ── Supabase 클라이언트 초기화 (키 미설정/오프라인이어도 죽지 않게) ──
let db = null;
try {
  if (typeof supabase !== 'undefined') {
    const { createClient } = supabase;
    db = createClient(SUPABASE_URL, SUPABASE_ANON);
  } else {
    console.warn('[supabase] 키 미설정 — 기본값 모드로 표시합니다.');
  }
} catch (e) { console.warn('[supabase] 초기화 실패:', e); }

/* =============================================
   CRUD 헬퍼 함수
   ============================================= */

/** 전체 조회 (최신순)  예) const rows = await fetchAll('schedule'); */
async function fetchAll(table, options = {}) {
  if (!db) return [];
  let query = db.from(table).select('*');
  if (options.order)  query = query.order(options.order, { ascending: options.asc ?? false });
  if (options.limit)  query = query.limit(options.limit);
  if (options.filter) query = query.eq(options.filter.col, options.filter.val);
  const { data, error } = await query;
  if (error) { console.error(`fetchAll(${table}) 오류:`, error); return []; }
  return data;
}

/** 단건 삽입  예) await insertRow('songs', { title: '봄날', artist: 'BTS' }); */
async function insertRow(table, row) {
  if (!db) return false;
  const { error } = await db.from(table).insert(row);
  if (error) { console.error(`insertRow(${table}) 오류:`, error); return false; }
  return true;
}

/** 단건 삭제  예) await deleteRow('songs', 3); */
async function deleteRow(table, id) {
  if (!db) return false;
  const { error } = await db.from(table).delete().eq('id', id);
  if (error) { console.error(`deleteRow(${table}) 오류:`, error); return false; }
  return true;
}

/** 단건 수정  예) await updateRow('schedule', 2, { title: '변경된 제목' }); */
async function updateRow(table, id, updates) {
  if (!db) return false;
  const { error } = await db.from(table).update(updates).eq('id', id);
  if (error) { console.error(`updateRow(${table}) 오류:`, error); return false; }
  return true;
}

/* =============================================
   이미지 압축 & 업로드 헬퍼 (이미지는 기본 "링크" 방식 — 업로드는 보조)
   ============================================= */
async function compressImage(file, maxW = 1200, quality = 0.8) {
  if (file.type === 'image/gif') return file;
  try {
    const img = await new Promise((res, rej) => {
      const i = new Image();
      i.onload = () => res(i);
      i.onerror = rej;
      i.src = URL.createObjectURL(file);
    });
    const scale = Math.min(1, maxW / img.width);
    const w = Math.round(img.width * scale);
    const h = Math.round(img.height * scale);
    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    canvas.getContext('2d').drawImage(img, 0, 0, w, h);
    URL.revokeObjectURL(img.src);
    const blob = await new Promise(res => canvas.toBlob(res, 'image/jpeg', quality));
    return blob || file;
  } catch (e) { console.error('compressImage 오류:', e); return file; }
}

async function uploadImage(file, folder = 'uploads') {
  if (!db) return null;
  try {
    const blob = await compressImage(file);
    const rand = Math.random().toString(36).slice(2, 8);
    const path = `${folder}/${Date.now()}_${rand}.jpg`;
    const { error } = await db.storage.from('images').upload(path, blob, {
      upsert: true, contentType: 'image/jpeg'
    });
    if (error) { console.error('uploadImage 오류:', error); return null; }
    const { data } = db.storage.from('images').getPublicUrl(path);
    return data?.publicUrl || null;
  } catch (e) { console.error('uploadImage 예외:', e); return null; }
}

/* ─ 토스트 유틸 ─ */
function showToast(msg, duration = 2500) {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast'; t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), duration);
}

/* ─ iframe 자동 높이 (SOOP 게시글 임베드용) ─ */
function initIframeResize() {
  const send = () =>
    window.parent.postMessage({ type: 'resize', height: document.body.scrollHeight }, '*');
  send();
  new ResizeObserver(send).observe(document.body);
}
function enableIframeAutoHeight() { initIframeResize(); }

/* =============================================
   🎨 색상 팔레트 자동 적용 (NIGHT SIGNAL 매핑)
   admin > 🎨 테마 탭에서 저장한 색을 모든 페이지 CSS 변수에 반영
   ============================================= */
async function applyTheme(){
  if (!db) return;
  try{
    const { data } = await db.from('profile').select('data').eq('id',1).single();
    const p = (data && data.data) || {};
    const map = {
      'theme-ice':  ['--ice','--pf-ice'],        // 밝은 아이스 (포인트 라이트)
      'theme-blue': ['--blue','--pf-acc'],       // 시그널 블루 (액센트)
      'theme-glow': ['--pf-glow'],               // 글로우
      'theme-navy': ['--navy'],                  // 배경 네이비
      'theme-deep': ['--navy-deep']              // 최심 배경
    };
    Object.keys(map).forEach(function(k){
      if(p[k]) map[k].forEach(function(v){ document.documentElement.style.setProperty(v, p[k]); });
    });
  }catch(e){ /* 실패해도 기본 색 유지 */ }
}
applyTheme();
