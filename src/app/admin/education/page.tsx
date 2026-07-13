import Link from "next/link";
import { createClient } from "@/src/lib/supabase/server";
import { createEducation, updateEducation, deleteEducation } from "@/src/app/admin/education/actions";

const input =
  "w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400";
const label = "mb-1 block text-xs font-semibold uppercase tracking-wide text-white/60";

type EducationRow = {
  id: string;
  degree_en: string;
  degree_es: string;
  institution: string;
  location: string;
  start_date: string;
  end_date: string | null;
};

function Fields({ row }: { row?: EducationRow }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div>
        <label className={label}>Título (EN)</label>
        <input name="degree_en" defaultValue={row?.degree_en} className={input} required />
      </div>
      <div>
        <label className={label}>Título (ES)</label>
        <input name="degree_es" defaultValue={row?.degree_es} className={input} required />
      </div>
      <div>
        <label className={label}>Institución</label>
        <input name="institution" defaultValue={row?.institution} className={input} required />
      </div>
      <div>
        <label className={label}>Ubicación</label>
        <input name="location" defaultValue={row?.location} className={input} />
      </div>
      <div>
        <label className={label}>Inicio (YYYY-MM)</label>
        <input name="start_date" defaultValue={row?.start_date} placeholder="2023-02" className={input} required />
      </div>
      <div>
        <label className={label}>Fin (YYYY-MM, vacío = en curso)</label>
        <input name="end_date" defaultValue={row?.end_date ?? ""} placeholder="2022-12" className={input} />
      </div>
    </div>
  );
}

export default async function AdminEducationPage() {
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("education")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-16 text-white">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-2xl font-bold">Educación</h1>

        <div className="space-y-4">
          {(rows ?? []).map((row: EducationRow) => (
            <form
              key={row.id}
              action={updateEducation}
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
                  formAction={deleteEducation}
                  className="rounded-lg border border-white/15 px-4 py-1.5 text-sm text-white/60 hover:border-red-400 hover:text-red-400"
                >
                  Eliminar
                </button>
              </div>
            </form>
          ))}
        </div>

        <h2 className="mb-3 mt-10 text-lg font-semibold">Agregar nuevo</h2>
        <form action={createEducation} className="space-y-3 rounded-xl border border-white/10 bg-white/5 p-4">
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
