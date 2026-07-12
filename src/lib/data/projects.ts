import { createClient } from "@/src/lib/supabase/server";
import type { Localized } from "@/src/lib/data/profile";

export interface Project {
  slug: string;
  title: Localized<string>;
  description: Localized<string>;
  stack: string[];
  repo: string;
  live: string;
  type: string;
}

export async function getProjects(): Promise<Project[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw error;

  return (data ?? []).map((p) => ({
    slug: p.slug,
    title: { en: p.title_en, es: p.title_es },
    description: { en: p.description_en, es: p.description_es },
    stack: p.stack ?? [],
    repo: p.repo ?? "",
    live: p.live ?? "",
    type: p.type,
  }));
}
