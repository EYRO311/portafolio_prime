-- Migracion 004: link de certificado opcional para proyectos tipo hackathon.
-- Ejecutar en Supabase -> SQL Editor.

alter table projects
  add column if not exists certificate_url text not null default '';
