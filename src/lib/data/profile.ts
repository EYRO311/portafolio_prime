import { createClient } from "@/src/lib/supabase/server";

export interface Localized<T> {
  en: T;
  es: T;
}

export interface Profile {
  name: string;
  role: Localized<string>;
  location: string;
  summary: Localized<string>;
  contact: { email: string; phone: string };
  links: { linkedin: string; github: string };
  technical_focus: Localized<string[]>;
  stack_keywords: string[];
  experience: Array<{
    title: Localized<string>;
    company: string;
    location: string;
    start: string;
    end: string | null;
    featured: boolean;
    highlights: Localized<string[]>;
  }>;
  education: Array<{
    degree: Localized<string>;
    institution: string;
    location: string;
    start: string;
    end: string | null;
  }>;
}

export async function getProfile(): Promise<Profile> {
  const supabase = await createClient();

  const [{ data: profile, error: profileError }, { data: experience, error: experienceError }, { data: education, error: educationError }] =
    await Promise.all([
      supabase.from("profile").select("*").eq("id", 1).single(),
      supabase.from("experience").select("*").order("sort_order", { ascending: true }),
      supabase.from("education").select("*").order("sort_order", { ascending: true }),
    ]);

  if (profileError) throw profileError;
  if (experienceError) throw experienceError;
  if (educationError) throw educationError;

  return {
    name: profile.name,
    role: { en: profile.role_en, es: profile.role_es },
    location: profile.location,
    summary: { en: profile.summary_en, es: profile.summary_es },
    contact: { email: profile.email, phone: profile.phone },
    links: { linkedin: profile.linkedin, github: profile.github },
    technical_focus: { en: profile.technical_focus_en ?? [], es: profile.technical_focus_es ?? [] },
    stack_keywords: profile.stack_keywords ?? [],
    experience: (experience ?? []).map((e) => ({
      title: { en: e.title_en, es: e.title_es },
      company: e.company,
      location: e.location,
      start: e.start_date,
      end: e.end_date,
      featured: e.featured,
      highlights: { en: e.highlights_en ?? [], es: e.highlights_es ?? [] },
    })),
    education: (education ?? []).map((e) => ({
      degree: { en: e.degree_en, es: e.degree_es },
      institution: e.institution,
      location: e.location,
      start: e.start_date,
      end: e.end_date,
    })),
  };
}
