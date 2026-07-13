import { createClient } from "@/src/lib/supabase/server";
import SkillsForm from "@/src/app/admin/skills/SkillsForm";

export default async function AdminSkillsPage() {
  const supabase = await createClient();
  const { data: skills, error } = await supabase
    .from("skills")
    .select("*")
    .eq("id", 1)
    .single();

  if (error || !skills) {
    return (
      <main className="min-h-screen bg-zinc-950 px-4 py-16 text-white">
        <p className="text-red-400">No se pudieron cargar las skills: {error?.message}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-16 text-white">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-2xl font-bold">Editar skills</h1>
        <SkillsForm skills={skills} />
      </div>
    </main>
  );
}
