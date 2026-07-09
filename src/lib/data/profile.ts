import { createClient } from "@/src/lib/supabase/server";

export interface Profile {
  name: string;
  role: string;
  location: string;
  summary: string;
  contact: { email: string; phone: string };
  links: { linkedin: string; github: string };
  technical_focus: string[];
  stack_keywords: string[];
  experience: Array<{
    title: string;
    company: string;
    location: string;
    start: string;
    end: string | null;
    highlights: string[];
  }>;
  education: Array<{
    degree: string;
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
    role: profile.role,
    location: profile.location,
    summary: profile.summary,
    contact: { email: profile.email, phone: profile.phone },
    links: { linkedin: profile.linkedin, github: profile.github },
    technical_focus: profile.technical_focus ?? [],
    stack_keywords: profile.stack_keywords ?? [],
    experience: (experience ?? []).map((e) => ({
      title: e.title,
      company: e.company,
      location: e.location,
      start: e.start_date,
      end: e.end_date,
      highlights: e.highlights ?? [],
    })),
    education: (education ?? []).map((e) => ({
      degree: e.degree,
      institution: e.institution,
      location: e.location,
      start: e.start_date,
      end: e.end_date,
    })),
  };
}
