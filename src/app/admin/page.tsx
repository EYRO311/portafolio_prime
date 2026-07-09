import { createClient } from "@/src/lib/supabase/server";
import { signOut } from "@/src/app/admin/actions";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-16 text-white">
      <div className="mx-auto max-w-xl">
        <h1 className="mb-1 text-2xl font-bold">Panel de admin</h1>
        <p className="mb-8 text-white/50">Sesión activa como {user?.email}</p>

        <p className="mb-8 text-sm text-white/40">
          La edición de perfil, proyectos y skills se agrega en la siguiente fase.
        </p>

        <form action={signOut}>
          <button
            type="submit"
            className="rounded-lg border border-white/15 px-4 py-2 text-sm font-semibold transition hover:border-red-400 hover:text-red-400"
          >
            Cerrar sesión
          </button>
        </form>
      </div>
    </main>
  );
}
