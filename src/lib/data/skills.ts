import { createClient } from "@/src/lib/supabase/server";

export interface Skills {
  programming_languages: string[];
  frontend: string[];
  backend: string[];
  databases: string[];
  cloud_devops: string[];
  tools: string[];
  integrations: string[];
  certifications: string[];
  languages: string[];
}

export async function getSkills(): Promise<Skills> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .eq("id", 1)
    .single();

  if (error) throw error;

  return {
    programming_languages: data.programming_languages ?? [],
    frontend: data.frontend ?? [],
    backend: data.backend ?? [],
    databases: data.databases ?? [],
    cloud_devops: data.cloud_devops ?? [],
    tools: data.tools ?? [],
    integrations: data.integrations ?? [],
    certifications: data.certifications ?? [],
    languages: data.languages ?? [],
  };
}
