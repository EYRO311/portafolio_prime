"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function csv(formData: FormData, key: string): string[] {
  return str(formData, key)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function createProject(formData: FormData) {
  const supabase = await createClient();

  const { count } = await supabase.from("projects").select("id", { count: "exact", head: true });

  const { error } = await supabase.from("projects").insert({
    slug: str(formData, "slug"),
    title_en: str(formData, "title_en"),
    title_es: str(formData, "title_es"),
    description_en: str(formData, "description_en"),
    description_es: str(formData, "description_es"),
    stack: csv(formData, "stack"),
    repo: str(formData, "repo"),
    live: str(formData, "live"),
    certificate_url: str(formData, "certificate_url"),
    type: str(formData, "type") || "project",
    sort_order: count ?? 0,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}

export async function updateProject(formData: FormData) {
  const supabase = await createClient();
  const id = str(formData, "id");

  const { error } = await supabase
    .from("projects")
    .update({
      slug: str(formData, "slug"),
      title_en: str(formData, "title_en"),
      title_es: str(formData, "title_es"),
      description_en: str(formData, "description_en"),
      description_es: str(formData, "description_es"),
      stack: csv(formData, "stack"),
      repo: str(formData, "repo"),
      live: str(formData, "live"),
      certificate_url: str(formData, "certificate_url"),
      type: str(formData, "type") || "project",
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}

export async function deleteProject(formData: FormData) {
  const supabase = await createClient();
  const id = str(formData, "id");

  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}
