# USISI NIGHT SIGNAL — 셋업 가이드

## 1) 키 — ✅ 이미 심어져 있음
- `supabase.js` · `overlay/index.html` — Supabase 프로젝트 `njkprtsozcdqssmkpfvo` 연결 완료
- `admin/index.html` — 관리자 비밀번호는 파일 상단 `ADMIN_PASSWORD` (임시 비번 상태 — 소스에 노출되므로 원하면 여기 한 줄만 바꿔서 재배포)

## ⚠ 이번 업데이트: SQL 한 줄 추가 실행 필요
업보 타입에 **메모** 기능이 추가됐어요. Supabase → SQL Editor 에 아래 한 줄 붙여넣고 **Run** 한 번만 하면 끝
(파일로도 있어요: `supabase_추가_업보메모.sql`). 안 돌려도 사이트는 정상이지만 메모 저장이 안 됩니다.
```sql
ALTER TABLE upbo_types ADD COLUMN IF NOT EXISTS memo TEXT;
```

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

## 5-1) admin에서 직접 바꿀 수 있는 것 (이제 코드 수정 불필요)
| 항목 | 위치 |
|---|---|
| 메인 배경 사진 (매달 교체) | 🏠 메인 > 01 |
| **서브 배경 사진 (프로필~옷장 한번에 · NIGHT/DAY 각각)** | 🏠 메인 > 02 |
| 메인 소개 문구 · FREQUENCY | 🏠 메인 > 03 |
| 메인 ▶ 버튼 문구/링크 | 🏠 메인 > 04 |
| 하단 CONTENT · SYMBOL · 흘림체 문구 | 🏠 메인 > 05 |
| 일정·노래책·업보·옷장 페이지 소개 문구 | 🏠 메인 > 06 |
| 프로필 전체 항목 | 🎀 프로필 |
| **프로필 맨 아래 관련 링크 4개** (SOOP·디코·팬카페·팬심) | 🎀 프로필 > 10 |
| 사이트 색상 | 🎨 테마 |

**D-Day / D+ 는 🎀 프로필 > 03 기본정보의 생일·데뷔일 칸에서만 계산됩니다.**
LOG 기록 안에 넣고 싶으면 설명에 `{생일}` `{데뷔}` 를 중괄호째 쓰면 자동 숫자로 바뀝니다.

## 6) 폴더 구조 (이대로 GitHub에 업로드)
```
index.html  supabase.js  supabase_setup.sql  SETUP.md
css/  js/  assets/  .github/
profile/  schedule/  song/  work/  dress/  admin/  overlay/   (각 index.html)
```
