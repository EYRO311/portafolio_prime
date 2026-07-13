"use client";

import { useActionState } from "react";
import Link from "next/link";
import { updateProfile } from "@/src/app/admin/profile/actions";

type ProfileRow = {
  name: string;
  role_en: string;
  role_es: string;
  location: string;
  summary_en: string;
  summary_es: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  technical_focus_en: string[];
  technical_focus_es: string[];
  stack_keywords: string[];
};

const input =
  "w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white outline-none focus:border-cyan-400";
const label = "mb-1 block text-xs font-semibold uppercase tracking-wide text-white/60";

export default function ProfileForm({ profile }: { profile: ProfileRow }) {
  const [state, formAction, pending] = useActionState(updateProfile, null);

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label}>Nombre</label>
          <input name="name" defaultValue={profile.name} className={input} required />
        </div>
        <div>
          <label className={label}>Ubicación</label>
          <input name="location" defaultValue={profile.location} className={input} />
        </div>
        <div>
          <label className={label}>Rol (EN)</label>
          <input name="role_en" defaultValue={profile.role_en} className={input} />
        </div>
        <div>
          <label className={label}>Rol (ES)</label>
          <input name="role_es" defaultValue={profile.role_es} className={input} />
        </div>
        <div>
          <label className={label}>Email</label>
          <input name="email" type="email" defaultValue={profile.email} className={input} />
        </div>
        <div>
          <label className={label}>Teléfono</label>
          <input name="phone" defaultValue={profile.phone} className={input} />
        </div>
        <div>
          <label className={label}>LinkedIn (URL completa)</label>
          <input name="linkedin" defaultValue={profile.linkedin} className={input} />
        </div>
        <div>
          <label className={label}>GitHub (URL completa)</label>
          <input name="github" defaultValue={profile.github} className={input} />
        </div>
      </div>

      <div>
        <label className={label}>Resumen / Summary (EN)</label>
        <textarea name="summary_en" defaultValue={profile.summary_en} rows={5} className={input} />
      </div>
      <div>
        <label className={label}>Resumen (ES)</label>
        <textarea name="summary_es" defaultValue={profile.summary_es} rows={5} className={input} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label}>Foco técnico EN (una frase por línea)</label>
          <textarea
            name="technical_focus_en"
            defaultValue={profile.technical_focus_en.join("\n")}
            rows={6}
            className={input}
          />
        </div>
        <div>
          <label className={label}>Foco técnico ES (una frase por línea)</label>
          <textarea
            name="technical_focus_es"
            defaultValue={profile.technical_focus_es.join("\n")}
            rows={6}
            className={input}
          />
        </div>
      </div>

      <div>
        <label className={label}>Stack keywords (uno por línea — mismo para ambos idiomas)</label>
        <textarea
          name="stack_keywords"
          defaultValue={profile.stack_keywords.join("\n")}
          rows={6}
          className={input}
        />
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
