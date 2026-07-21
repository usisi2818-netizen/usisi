# USISI NIGHT SIGNAL — 셋업 가이드

## 1) 키 — ✅ 이미 심어져 있음
- `supabase.js` · `overlay/index.html` — Supabase 프로젝트 `njkprtsozcdqssmkpfvo` 연결 완료
- `admin/index.html` — 관리자 비밀번호는 파일 상단 `ADMIN_PASSWORD` (임시 비번 상태 — 소스에 노출되므로 원하면 여기 한 줄만 바꿔서 재배포)

## 2) Supabase
1. New project 생성 (⚠ 한 프로젝트 = 우시시 전용)
2. SQL Editor → `supabase_setup.sql` 전체 붙여넣기 → Run (아직 안 했다면 필수!)

## 3) GitHub + Cloudflare Pages
1. 이 폴더 전체를 레포에 업로드 (assets/·css/·js/ 포함)
2. Cloudflare Pages → Connect to Git → Framework **None** → Deploy
3. 레포 Settings > Secrets and variables > Actions 에
   `SUPABASE_URL` = `https://njkprtsozcdqssmkpfvo.supabase.co`, `SUPABASE_ANON` = anon 키
   → `.github/workflows/keep-alive.yml` 이 월·목 자동 핑 (무료 티어 절전 방지)

## 4) SOOP 게시글 임베드
```html
<iframe height="2400" scrolling="no" src="배포주소" style="width:100%;border:0;display:block;"></iframe>
```
(높이는 픽셀값, % 금지 — 페이지가 높이를 postMessage로 자동 보고)

## 5) OBS 오버레이
브라우저 소스 → `배포주소/overlay/` → 700×120.
admin(`배포주소/admin/`) > 🎵 노래 탭 > "OBS 오버레이" 카드에서 곡/표시 여부 저장.

## 6) 폴더 구조 (이대로 GitHub에 업로드)
```
index.html  supabase.js  supabase_setup.sql  SETUP.md
css/  js/  assets/  .github/
profile/  schedule/  song/  work/  dress/  admin/  overlay/   (각 index.html)
```
