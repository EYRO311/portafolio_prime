"use client";

import { useActionState } from "react";
import { signIn } from "@/src/app/admin/actions";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(signIn, null);

  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
      <form
        action={formAction}
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md"
      >
        <h1 className="mb-1 text-xl font-bold text-white">Admin</h1>
        <p className="mb-6 text-sm text-white/50">Acceso restringido</p>

        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/60">
          Email
        </label>
        <input
          type="email"
          name="email"
          required
          autoComplete="username"
          className="mb-4 w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white outline-none focus:border-cyan-400"
        />

        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/60">
          Contraseña
        </label>
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          className="mb-4 w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white outline-none focus:border-cyan-400"
        />

        {state?.error && (
          <p className="mb-4 text-sm text-red-400">{state.error}</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-cyan-500 py-2 font-semibold text-black transition hover:bg-cyan-400 disabled:opacity-50"
        >
          {pending ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </main>
  );
}
