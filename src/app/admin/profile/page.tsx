import { createClient } from "@/src/lib/supabase/server";
import ProfileForm from "@/src/app/admin/profile/ProfileForm";

export default async function AdminProfilePage() {
  const supabase = await createClient();
  const { data: profile, error } = await supabase
    .from("profile")
    .select("*")
    .eq("id", 1)
    .single();

  if (error || !profile) {
    return (
      <main className="min-h-screen bg-zinc-950 px-4 py-16 text-white">
        <p className="text-red-400">No se pudo cargar el perfil: {error?.message}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-16 text-white">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-2xl font-bold">Editar perfil</h1>
        <ProfileForm profile={profile} />
      </div>
    </main>
  );
}
