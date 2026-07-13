"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/src/lib/supabase/server";

function lines(value: FormDataEntryValue | null): string[] {
  return String(value ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

const FIELDS = [
  "programming_languages",
  "frontend",
  "backend",
  "databases",
  "cloud_devops",
  "tools",
  "integrations",
  "certifications",
  "languages",
] as const;

export async function updateSkills(_prevState: { error: string } | null, formData: FormData) {
  const supabase = await createClient();

  const payload: Record<string, string[]> = {};
  for (const field of FIELDS) {
    payload[field] = lines(formData.get(field));
  }

  const { error } = await supabase.from("skills").update(payload).eq("id", 1);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/skills");
  return { error: "" };
}
