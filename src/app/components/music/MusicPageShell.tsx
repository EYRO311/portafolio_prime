import { ReactNode } from "react";

type MusicPageShellProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
};

export default function MusicPageShell({
  title,
  description,
  actions,
  children,
}: MusicPageShellProps) {
  return (
    <main className="min-h-screen p-6">
      <section className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">{title}</h1>
            {description ? <p className="opacity-70">{description}</p> : null}
          </div>

          {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
        </div>

        {children}
      </section>
    </main>
  );
}