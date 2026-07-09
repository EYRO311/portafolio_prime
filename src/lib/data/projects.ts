import { createClient } from "@/src/lib/supabase/server";

export interface Project {
  slug: string;
  title: string;
  description: string;
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
    title: p.title,
    description: p.description,
    stack: p.stack ?? [],
    repo: p.repo ?? "",
    live: p.live ?? "",
    type: p.type,
  }));
}
