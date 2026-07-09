-- Fundacion del CMS del portafolio: perfil, educacion, experiencia, proyectos y skills.
-- Ejecutar completo en Supabase -> SQL Editor.

create extension if not exists "pgcrypto";

-- ── updated_at trigger helper ────────────────────────────────────────────
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ── profile (fila unica) ─────────────────────────────────────────────────
create table profile (
  id bigint primary key default 1,
  name text not null,
  role text not null,
  location text not null,
  summary text not null,
  email text not null,
  phone text not null,
  linkedin text not null,
  github text not null,
  technical_focus text[] not null default '{}',
  stack_keywords text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profile_singleton check (id = 1)
);

create trigger profile_set_updated_at
  before update on profile
  for each row execute function set_updated_at();

-- ── education ─────────────────────────────────────────────────────────────
create table education (
  id uuid primary key default gen_random_uuid(),
  degree text not null,
  institution text not null,
  location text not null,
  start_date text not null,
  end_date text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger education_set_updated_at
  before update on education
  for each row execute function set_updated_at();

-- ── experience ────────────────────────────────────────────────────────────
create table experience (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  company text not null,
  location text not null,
  start_date text not null,
  end_date text,
  highlights text[] not null default '{}',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger experience_set_updated_at
  before update on experience
  for each row execute function set_updated_at();

-- ── projects ──────────────────────────────────────────────────────────────
create table projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  stack text[] not null default '{}',
  repo text not null default '',
  live text not null default '',
  type text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger projects_set_updated_at
  before update on projects
  for each row execute function set_updated_at();

-- ── skills (fila unica) ──────────────────────────────────────────────────
create table skills (
  id bigint primary key default 1,
  programming_languages text[] not null default '{}',
  frontend text[] not null default '{}',
  backend text[] not null default '{}',
  databases text[] not null default '{}',
  cloud_devops text[] not null default '{}',
  tools text[] not null default '{}',
  integrations text[] not null default '{}',
  certifications text[] not null default '{}',
  languages text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint skills_singleton check (id = 1)
);

create trigger skills_set_updated_at
  before update on skills
  for each row execute function set_updated_at();

-- ── Row Level Security ───────────────────────────────────────────────────
alter table profile enable row level security;
alter table education enable row level security;
alter table experience enable row level security;
alter table projects enable row level security;
alter table skills enable row level security;

-- Lectura publica en las 5 tablas
create policy "public read profile"    on profile    for select using (true);
create policy "public read education"  on education  for select using (true);
create policy "public read experience" on experience for select using (true);
create policy "public read projects"   on projects   for select using (true);
create policy "public read skills"     on skills     for select using (true);

-- Escritura solo para el admin autenticado (un solo usuario, sin chequeo de ownership)
create policy "admin write profile"
  on profile for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "admin write education"
  on education for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "admin write experience"
  on experience for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "admin write projects"
  on projects for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "admin write skills"
  on skills for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
