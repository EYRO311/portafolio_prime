"use client";

import { useActionState } from "react";
import Link from "next/link";
import { updateSkills } from "@/src/app/admin/skills/actions";

type SkillsRow = {
  programming_languages: string[];
  frontend: string[];
  backend: string[];
  databases: string[];
  cloud_devops: string[];
  tools: string[];
  integrations: string[];
  certifications: string[];
  languages: string[];
};

const FIELDS: { key: keyof SkillsRow; label: string }[] = [
  { key: "programming_languages", label: "Lenguajes de programación" },
  { key: "frontend", label: "Frontend" },
  { key: "backend", label: "Backend" },
  { key: "databases", label: "Bases de datos" },
  { key: "cloud_devops", label: "Cloud & DevOps" },
  { key: "tools", label: "Herramientas" },
  { key: "integrations", label: "Integraciones" },
  { key: "certifications", label: "Certificaciones" },
  { key: "languages", label: "Idiomas" },
];

const input =
  "w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white outline-none focus:border-cyan-400";
const label = "mb-1 block text-xs font-semibold uppercase tracking-wide text-white/60";

export default function SkillsForm({ skills }: { skills: SkillsRow }) {
  const [state, formAction, pending] = useActionState(updateSkills, null);

  return (
    <form action={formAction} className="space-y-6">
      <p className="text-sm text-white/40">Un elemento por línea en cada lista.</p>

      <div className="grid gap-4 sm:grid-cols-2">
        {FIELDS.map(({ key, label: fieldLabel }) => (
          <div key={key}>
            <label className={label}>{fieldLabel}</label>
            <textarea
              name={key}
              defaultValue={skills[key].join("\n")}
              rows={5}
              className={input}
            />
          </div>
        ))}
      </div>

      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
      {state && !state.error && <p className="text-sm text-emerald-400">Guardado.</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-cyan-500 px-5 py-2 font-semibold text-black transition hover:bg-cyan-400 disabled:opacity-50"
        >
          {pending ? "Guardando…" : "Guardar cambios"}
        </button>
        <Link href="/admin" className="text-sm text-white/50 underline hover:text-white">
          Volver al panel
        </Link>
      </div>
    </form>
  );
}
