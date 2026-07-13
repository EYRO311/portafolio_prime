"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

export async function createEducation(formData: FormData) {
  const supabase = await createClient();

  const { count } = await supabase.from("education").select("id", { count: "exact", head: true });

  const { error } = await supabase.from("education").insert({
    degree_en: str(formData, "degree_en"),
    degree_es: str(formData, "degree_es"),
    institution: str(formData, "institution"),
    location: str(formData, "location"),
    start_date: str(formData, "start_date"),
    end_date: str(formData, "end_date") || null,
    sort_order: count ?? 0,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/admin/education");
  redirect("/admin/education");
}

export async function updateEducation(formData: FormData) {
  const supabase = await createClient();
  const id = str(formData, "id");

  const { error } = await supabase
    .from("education")
    .update({
      degree_en: str(formData, "degree_en"),
      degree_es: str(formData, "degree_es"),
      institution: str(formData, "institution"),
      location: str(formData, "location"),
      start_date: str(formData, "start_date"),
      end_date: str(formData, "end_date") || null,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/admin/education");
  redirect("/admin/education");
}

export async function deleteEducation(formData: FormData) {
  const supabase = await createClient();
  const id = str(formData, "id");

  const { error } = await supabase.from("education").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/admin/education");
  redirect("/admin/education");
}
