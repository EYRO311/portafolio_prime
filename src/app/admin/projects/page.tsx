import Link from "next/link";
import { createClient } from "@/src/lib/supabase/server";
import { createProject, updateProject, deleteProject } from "@/src/app/admin/projects/actions";

const input =
  "w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400";
const label = "mb-1 block text-xs font-semibold uppercase tracking-wide text-white/60";

type ProjectRow = {
  id: string;
  slug: string;
  title_en: string;
  title_es: string;
  description_en: string;
  description_es: string;
  stack: string[];
  repo: string;
  live: string;
  certificate_url: string;
  type: string;
};

function Fields({ row }: { row?: ProjectRow }) {
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={label}>Slug (identificador único)</label>
          <input name="slug" defaultValue={row?.slug} className={input} required />
        </div>
        <div>
          <label className={label}>Tipo</label>
          <select name="type" defaultValue={row?.type ?? "project"} className={input}>
            <option value="work">work</option>
            <option value="project">project</option>
            <option value="teaching">teaching</option>
          </select>
        </div>
        <div>
          <label className={label}>Título (EN)</label>
          <input name="title_en" defaultValue={row?.title_en} className={input} required />
        </div>
        <div>
          <label className={label}>Título (ES)</label>
          <input name="title_es" defaultValue={row?.title_es} className={input} required />
        </div>
      </div>

      <div>
        <label className={label}>Descripción (EN)</label>
        <textarea name="description_en" defaultValue={row?.description_en} rows={3} className={input} />
      </div>
      <div>
        <label className={label}>Descripción (ES)</label>
        <textarea name="description_es" defaultValue={row?.description_es} rows={3} className={input} />
      </div>

      <div>
        <label className={label}>Stack (separado por comas)</label>
        <input name="stack" defaultValue={row?.stack?.join(", ")} className={input} placeholder="Next.js, React, TypeScript" />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label className={label}>Repo (URL)</label>
          <input name="repo" defaultValue={row?.repo} className={input} />
        </div>
        <div>
          <label className={label}>Live / Demo (URL)</label>
          <input name="live" defaultValue={row?.live} className={input} />
        </div>
        <div>
          <label className={label}>Certificado (URL)</label>
          <input name="certificate_url" defaultValue={row?.certificate_url} className={input} />
        </div>
      </div>
    </>
  );
}

export default async function AdminProjectsPage() {
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-16 text-white">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-2xl font-bold">Proyectos</h1>

        <div className="space-y-4">
          {(rows ?? []).map((row: ProjectRow) => (
            <form
              key={row.id}
              action={updateProject}
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
                  formAction={deleteProject}
                  className="rounded-lg border border-white/15 px-4 py-1.5 text-sm text-white/60 hover:border-red-400 hover:text-red-400"
                >
                  Eliminar
                </button>
              </div>
            </form>
          ))}
        </div>

        <h2 className="mb-3 mt-10 text-lg font-semibold">Agregar nuevo</h2>
        <form action={createProject} className="space-y-3 rounded-xl border border-white/10 bg-white/5 p-4">
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
