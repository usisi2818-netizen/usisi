-- ═══════════════════════════════════════════════════════════
--  업보 타입 "메모" 기능 추가 (이미 SQL을 한 번 돌린 프로젝트용)
--  Supabase → SQL Editor 에 붙여넣고 Run 한 번만 하면 됩니다.
--  (새로 설치하는 경우엔 supabase_setup.sql 안에 이미 포함돼 있어요)
-- ═══════════════════════════════════════════════════════════

ALTER TABLE upbo_types ADD COLUMN IF NOT EXISTS memo TEXT;
