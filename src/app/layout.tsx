import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

import { useTheme } from "@/src/app/components/utils/ThemeContext";
import ThemeToggle from "@/src/app/components/ThemeToggle";
import { Navbar } from "@/src/app/components/UI/NavBar";
import ParticlesBackground from "@/src/app/components/UI/ParticlesBackground";

export const metadata: Metadata = {
  title: "EYRO | Portfolio",
  description: "Software Developer Portfolio",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <Providers>
          <ParticlesBackground />

          <Navbar
            brand={{ label: "EYRO", href: "/" }}
            items={[
              { type: "section", id: "hero", label: "Home" },
              { type: "section", id: "projects", label: "Projects" },
              { type: "section", id: "music", label: "Music" },
            ]}
            socials={[
              { type: "external", href: "https://github.com/tuusuario", label: "GitHub", icon: "github" },
              { type: "external", href: "https://linkedin.com/in/tuusuario", label: "LinkedIn", icon: "linkedin" },
              { type: "external", href: "mailto:tuemail@dominio.com", label: "Email", icon: "mail" },
            ]}
            spy
          />

          {children}

          <footer style={{ padding: 20, textAlign: "center", opacity: 0.7 }}>
            © 2025 EYRO. Hecho con Next.
          </footer>

          <ThemeToggle />
        </Providers>
      </body>
    </html>
  );
}