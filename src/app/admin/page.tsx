import Link from "next/link";
import { createClient } from "@/src/lib/supabase/server";
import { signOut } from "@/src/app/admin/actions";

const SECTIONS = [
  { href: "/admin/profile", label: "Perfil", desc: "Nombre, rol, resumen, contacto, links, stack" },
  { href: "/admin/education", label: "Educación", desc: "Estudios y certificaciones académicas" },
  { href: "/admin/experience", label: "Experiencia laboral", desc: "Trabajos, fechas, logros por puesto" },
  { href: "/admin/projects", label: "Proyectos", desc: "Proyectos, hackathones, repos y demos" },
  { href: "/admin/skills", label: "Skills", desc: "Lenguajes, frontend, backend, bases de datos, certificaciones..." },
];

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-16 text-white">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-1 text-2xl font-bold">Panel de admin</h1>
        <p className="mb-8 text-white/50">Sesión activa como {user?.email}</p>

        <div className="mb-8 grid gap-3 sm:grid-cols-2">
          {SECTIONS.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-cyan-400/50 hover:bg-white/10"
            >
              <p className="font-semibold text-cyan-400">{s.label}</p>
              <p className="mt-1 text-sm text-white/50">{s.desc}</p>
            </Link>
          ))}
        </div>

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
