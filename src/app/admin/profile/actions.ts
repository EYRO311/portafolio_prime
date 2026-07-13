"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/src/lib/supabase/server";

function lines(value: FormDataEntryValue | null): string[] {
  return String(value ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

export async function updateProfile(_prevState: { error: string } | null, formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("profile")
    .update({
      name: String(formData.get("name") ?? ""),
      role_en: String(formData.get("role_en") ?? ""),
      role_es: String(formData.get("role_es") ?? ""),
      location: String(formData.get("location") ?? ""),
      summary_en: String(formData.get("summary_en") ?? ""),
      summary_es: String(formData.get("summary_es") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      linkedin: String(formData.get("linkedin") ?? ""),
      github: String(formData.get("github") ?? ""),
      technical_focus_en: lines(formData.get("technical_focus_en")),
      technical_focus_es: lines(formData.get("technical_focus_es")),
      stack_keywords: lines(formData.get("stack_keywords")),
    })
    .eq("id", 1);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/profile");
  return { error: "" };
}
