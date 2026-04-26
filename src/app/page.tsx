const TECH = [
  "Node.js", "HTML5", "CSS3",
  "JavaScript", "TypeScript", "Next.js",
  "Angular", "React", "Python",
];


export default function Home() {
  return (
    <>
      {/* ── estilos dark/light sin JS ──────────────────────────────────────── */}
      <style>{`
        .h-card {
          background: rgba(255,255,255,0.55);
          border: 1px solid rgba(30,139,198,0.18);
          box-shadow: 0 20px 70px rgba(0,0,0,0.10);
        }
        html.dark .h-card {
          background: rgba(0,0,0,0.22);
          border: 1px solid rgba(30,139,198,0.22);
          box-shadow: 0 20px 70px rgba(0,0,0,0.35);
        }
        .h-name { color: #0a0a0a; }
        html.dark .h-name { color: #ffffff; }
        .h-desc { color: rgba(0,0,0,0.68); }
        html.dark .h-desc { color: rgba(255,255,255,0.78); }
        .h-chip {
          border: 1px solid rgba(0,0,0,0.09);
          background: rgba(0,0,0,0.04);
          color: rgba(0,0,0,0.76);
        }
        html.dark .h-chip {
          border: 1px solid rgba(255,255,255,0.10);
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.80);
        }
        .h-chip:hover { border-color: #1e8bc6; color: #1e8bc6; }
        .h-btn-sec {
          border: 1.5px solid rgba(0,0,0,0.20);
          color: rgba(0,0,0,0.80);
        }
        html.dark .h-btn-sec {
          border: 1.5px solid rgba(255,255,255,0.25);
          color: rgba(255,255,255,0.88);
        }
        .h-btn-sec:hover { border-color: #1e8bc6; color: #1e8bc6; }
        .h-section {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 7rem 2rem 4rem;
          position: relative;
          z-index: 1;
        }
        .h-grid {
          width: 100%;
          max-width: 1100px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
          padding: 3rem;
          border-radius: 20px;
          backdrop-filter: blur(4px);
        }
        .h-left { display: flex; flex-direction: column; gap: 1.1rem; }
        .h-label {
          font-size: 0.80rem;
          font-weight: 600;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #1e8bc6;
          margin: 0;
        }
        .h-title {
          font-size: clamp(2.8rem, 5vw, 4.2rem);
          font-weight: 800;
          margin: 0;
          line-height: 1.1;
          letter-spacing: -1px;
        }
        .h-role {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1e8bc6;
        }
        .h-desc { font-size: 1.05rem; line-height: 1.7; margin: 0; max-width: 480px; }
        .h-actions { display: flex; gap: 0.9rem; flex-wrap: wrap; margin-top: 0.3rem; }
        .h-btn-pri {
          display: inline-flex; align-items: center;
          padding: 0.65rem 1.5rem; border-radius: 8px;
          font-size: 0.92rem; font-weight: 600; text-decoration: none;
          background: #1e8bc6; color: #fff; border: none;
          transition: background 0.2s;
        }
        .h-btn-pri:hover { background: #166fa0; }
        .h-btn-sec {
          display: inline-flex; align-items: center;
          padding: 0.65rem 1.5rem; border-radius: 8px;
          font-size: 0.92rem; font-weight: 600; text-decoration: none;
          background: transparent;
          transition: border-color 0.2s, color 0.2s;
        }
        .h-right { display: flex; flex-direction: column; gap: 1rem; }
        .h-tech-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.6rem; }
        .h-chip {
          padding: 0.6rem 0.85rem; border-radius: 10px;
          font-size: 0.80rem; font-weight: 500;
          transition: border-color 0.2s, color 0.2s;
          cursor: default;
        }
        @media (max-width: 768px) {
          .h-grid { grid-template-columns: 1fr; gap: 2.5rem; padding: 2rem 1.5rem; }
          .h-title { font-size: clamp(2.2rem, 8vw, 3rem); }
        }
      `}</style>

      <main>
        <section id="hero" className="h-section">
          <div className="h-grid h-card">

            {/* Izquierda */}
            <div className="h-left">
              <p className="h-label">Software Developer</p>
              <h1 className="h-title h-name">Emiliano Ruiz</h1>
              <p className="h-role">Fullstack Engineer</p>
              <p className="h-desc h-desc">
                Transforming ideas into functional, scalable, and elegant web solutions via{" "}
                <strong style={{ color: "#1e8bc6" }}>fullstack</strong> development.
              </p>
              <div className="h-actions">
                <a href="#projects" className="h-btn-pri">Ver proyectos</a>
                <a href="/music" className="h-btn-sec">Ver música</a>
              </div>
            </div>

            {/* Derecha — stack */}
            <div className="h-right">
              <p className="h-label" style={{ letterSpacing: "2.5px", opacity: 0.85 }}>
                Stack tecnológico
              </p>
              <div className="h-tech-grid">
                {TECH.map((name) => (
                  <div key={name} className="h-chip">{name}</div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="projects" style={{ minHeight: "100vh", padding: "5rem 2rem", maxWidth: 1100, margin: "0 auto" }}>
          <h2 className="h-name" style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "2rem" }}>
            Projects
          </h2>
        </section>

        <section id="music" style={{ minHeight: "10vh" }} />
      </main>
    </>
  );
}
