
import { Hero } from "@/src/app/components/UI/hero";
import { apiGet } from "@/src/app/components/lib/api";

type ProfileResponse = {
  ok: boolean;
  profile: { name: string; summary?: string };
};

type ProjectsResponse = {
  ok: boolean;
  projects: Array<{ slug: string; title: string; description?: string }>;
};

export default async function Home() {
  const [{ profile }, { projects }] = await Promise.all([
    apiGet<ProfileResponse>("/profile"),
    apiGet<ProjectsResponse>("/projects"),
  ]);

  return (
    <main>
      <Hero
        name={profile.name}
        roles={[
          "Software Developer",
          "Fullstack Engineer",
          "JavaScript Developer",
          "Python Devennnnnnnnnnloper",
        ]}
        description={
          <>
            {profile.summary ?? (
              <>
                Transforming ideas into functional, scalable, and elegant web solutions{" "}
                <span style={{ color: "#168ac8d1", fontWeight: 700 }}>fullstack</span>{" "}
                development.
              </>
            )}
          </>
        }
        tech={[
          "node",
          "html",
          "next",
          "typescript",
          "css",
          "javascript",
          "angular",
          "react",
          "python",
        ]}
        techVelocity={35}
        techCopies={8}
      />

      <section id="projects" className="min-h-screen">
        <h2>Projects</h2>
        {projects.map((p) => (
          <article key={p.slug}>
            <h3>{p.title}</h3>
            {p.description ? <p>{p.description}</p> : null}
          </article>
        ))}
      </section>

      <section id="music" className="min-h-screen">Music...</section>
    </main>
  );
}