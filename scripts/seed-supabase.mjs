// Script de un solo uso: migra src/data/*.json a Supabase.
// Uso: node --env-file=.env.local scripts/seed-supabase.mjs

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "..", "src", "data");

function readJSON(name) {
  return JSON.parse(readFileSync(path.join(dataDir, name), "utf-8"));
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local"
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

async function seedProfile() {
  const profile = readJSON("profile.json");

  const { error: profileError } = await supabase.from("profile").upsert({
    id: 1,
    name: profile.name,
    role: profile.role,
    location: profile.location,
    summary: profile.summary,
    email: profile.contact.email,
    phone: profile.contact.phone,
    linkedin: profile.links.linkedin,
    github: profile.links.github,
    technical_focus: profile.technical_focus ?? [],
    stack_keywords: profile.stack_keywords ?? [],
  });
  if (profileError) throw profileError;
  console.log("✓ profile");

  await supabase.from("education").delete().not("id", "is", null);
  const educationRows = (profile.education ?? []).map((e, i) => ({
    degree: e.degree,
    institution: e.institution,
    location: e.location,
    start_date: e.start,
    end_date: e.end,
    sort_order: i,
  }));
  if (educationRows.length) {
    const { error } = await supabase.from("education").insert(educationRows);
    if (error) throw error;
  }
  console.log(`✓ education (${educationRows.length})`);

  await supabase.from("experience").delete().not("id", "is", null);
  const experienceRows = (profile.experience ?? []).map((e, i) => ({
    title: e.title,
    company: e.company,
    location: e.location,
    start_date: e.start,
    end_date: e.end,
    highlights: e.highlights ?? [],
    sort_order: i,
  }));
  if (experienceRows.length) {
    const { error } = await supabase.from("experience").insert(experienceRows);
    if (error) throw error;
  }
  console.log(`✓ experience (${experienceRows.length})`);
}

async function seedProjects() {
  const { projects } = readJSON("projects.json");

  await supabase.from("projects").delete().not("id", "is", null);
  const rows = projects.map((p, i) => ({
    slug: p.slug,
    title: p.title,
    description: p.description,
    stack: p.stack ?? [],
    repo: p.repo ?? "",
    live: p.live ?? "",
    type: p.type,
    sort_order: i,
  }));
  const { error } = await supabase.from("projects").insert(rows);
  if (error) throw error;
  console.log(`✓ projects (${rows.length})`);
}

async function seedSkills() {
  const skills = readJSON("skills.json");
  const { error } = await supabase.from("skills").upsert({ id: 1, ...skills });
  if (error) throw error;
  console.log("✓ skills");
}

await seedProfile();
await seedProjects();
await seedSkills();

console.log("\nMigración completa.");
