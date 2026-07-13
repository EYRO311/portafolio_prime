"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function lines(formData: FormData, key: string): string[] {
  return str(formData, key)
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

export async function createExperience(formData: FormData) {
  const supabase = await createClient();

  const { count } = await supabase.from("experience").select("id", { count: "exact", head: true });

  const { error } = await supabase.from("experience").insert({
    title_en: str(formData, "title_en"),
    title_es: str(formData, "title_es"),
    company: str(formData, "company"),
    location: str(formData, "location"),
    start_date: str(formData, "start_date"),
    end_date: str(formData, "end_date") || null,
    featured: formData.get("featured") === "on",
    highlights_en: lines(formData, "highlights_en"),
    highlights_es: lines(formData, "highlights_es"),
    sort_order: count ?? 0,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/admin/experience");
  redirect("/admin/experience");
}

export async function updateExperience(formData: FormData) {
  const supabase = await createClient();
  const id = str(formData, "id");

  const { error } = await supabase
    .from("experience")
    .update({
      title_en: str(formData, "title_en"),
      title_es: str(formData, "title_es"),
      company: str(formData, "company"),
      location: str(formData, "location"),
      start_date: str(formData, "start_date"),
      end_date: str(formData, "end_date") || null,
      featured: formData.get("featured") === "on",
      highlights_en: lines(formData, "highlights_en"),
      highlights_es: lines(formData, "highlights_es"),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/admin/experience");
  redirect("/admin/experience");
}

export async function deleteExperience(formData: FormData) {
  const supabase = await createClient();
  const id = str(formData, "id");

  const { error } = await supabase.from("experience").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/admin/experience");
  redirect("/admin/experience");
}
