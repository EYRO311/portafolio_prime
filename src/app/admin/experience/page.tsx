import Link from "next/link";
import { createClient } from "@/src/lib/supabase/server";
import { createExperience, updateExperience, deleteExperience } from "@/src/app/admin/experience/actions";

const input =
  "w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400";
const label = "mb-1 block text-xs font-semibold uppercase tracking-wide text-white/60";

type ExperienceRow = {
  id: string;
  title_en: string;
  title_es: string;
  company: string;
  location: string;
  start_date: string;
  end_date: string | null;
  featured: boolean;
  highlights_en: string[];
  highlights_es: string[];
};

function Fields({ row }: { row?: ExperienceRow }) {
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={label}>Puesto (EN)</label>
          <input name="title_en" defaultValue={row?.title_en} className={input} required />
        </div>
        <div>
          <label className={label}>Puesto (ES)</label>
          <input name="title_es" defaultValue={row?.title_es} className={input} required />
        </div>
        <div>
          <label className={label}>Empresa</label>
          <input name="company" defaultValue={row?.company} className={input} required />
        </div>
        <div>
          <label className={label}>Ubicación</label>
          <input name="location" defaultValue={row?.location} className={input} />
        </div>
        <div>
          <label className={label}>Inicio (YYYY-MM)</label>
          <input name="start_date" defaultValue={row?.start_date} placeholder="2025-06" className={input} required />
        </div>
        <div>
          <label className={label}>Fin (YYYY-MM, vacío = actual)</label>
          <input name="end_date" defaultValue={row?.end_date ?? ""} placeholder="2026-06" className={input} />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={label}>Logros EN (uno por línea)</label>
          <textarea name="highlights_en" defaultValue={row?.highlights_en?.join("\n")} rows={5} className={input} />
        </div>
        <div>
          <label className={label}>Logros ES (uno por línea)</label>
          <textarea name="highlights_es" defaultValue={row?.highlights_es?.join("\n")} rows={5} className={input} />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-white/70">
        <input type="checkbox" name="featured" defaultChecked={row?.featured ?? true} className="h-4 w-4" />
        Destacado (si no, aparece atenuado en la home)
      </label>
    </>
  );
}

export default async function AdminExperiencePage() {
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("experience")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-16 text-white">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-2xl font-bold">Experiencia laboral</h1>

        <div className="space-y-4">
          {(rows ?? []).map((row: ExperienceRow) => (
            <form
              key={row.id}
              action={updateExperience}
              className="space-y-3 rounded-xl border border-white/10 bg-white/5 p-4"
            >
              <input type="hidden" name="id" value={row.id} />
              <Fields row={row} />
              <div className="flex items-center gap-3">
                <button type="submit" className="rounded-lg bg-cyan-500 px-4 py-1.5 text-sm font-semibold text-black hover:bg-cyan-400">
                  Guardar
                </button>
                <button
                  type="submit"
                  formAction={deleteExperience}
                  className="rounded-lg border border-white/15 px-4 py-1.5 text-sm text-white/60 hover:border-red-400 hover:text-red-400"
                >
                  Eliminar
                </button>
              </div>
            </form>
          ))}
        </div>

        <h2 className="mb-3 mt-10 text-lg font-semibold">Agregar nuevo</h2>
        <form action={createExperience} className="space-y-3 rounded-xl border border-white/10 bg-white/5 p-4">
          <Fields />
          <button type="submit" className="rounded-lg bg-cyan-500 px-4 py-1.5 text-sm font-semibold text-black hover:bg-cyan-400">
            Agregar
          </button>
        </form>

        <Link href="/admin" className="mt-8 inline-block text-sm text-white/50 underline hover:text-white">
          Volver al panel
        </Link>
      </div>
    </main>
  );
}
