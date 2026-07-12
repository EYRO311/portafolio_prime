-- Migracion 002: soporte bilingue (ES/EN) para el contenido narrativo.
-- Ejecutar completo en Supabase -> SQL Editor, DESPUES de supabase/schema.sql.
-- Los nombres de tecnologias, empresas e instituciones no se duplican (son iguales en ambos idiomas).

-- ── profile ───────────────────────────────────────────────────────────────
alter table profile
  add column role_en text,
  add column role_es text,
  add column summary_en text,
  add column summary_es text,
  add column technical_focus_en text[] not null default '{}',
  add column technical_focus_es text[] not null default '{}';

alter table profile drop column role;
alter table profile drop column summary;
alter table profile drop column technical_focus;

-- ── education ─────────────────────────────────────────────────────────────
alter table education
  add column degree_en text,
  add column degree_es text;

alter table education drop column degree;

-- ── experience ────────────────────────────────────────────────────────────
alter table experience
  add column title_en text,
  add column title_es text,
  add column highlights_en text[] not null default '{}',
  add column highlights_es text[] not null default '{}',
  add column featured boolean not null default true;

alter table experience drop column title;
alter table experience drop column highlights;

-- ── projects ──────────────────────────────────────────────────────────────
alter table projects
  add column title_en text,
  add column title_es text,
  add column description_en text,
  add column description_es text;

alter table projects drop column title;
alter table projects drop column description;
