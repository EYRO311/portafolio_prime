import type { Metadata } from "next";
import dynamic from "next/dynamic";
import "./globals.css";
import Providers from "./providers";

import ThemeToggle from "@/src/app/components/ThemeToggle";
import ModeToggle from "@/src/app/components/ModeToggle";
import { Navbar } from "@/src/app/components/UI/NavBar";

const BackgroundSelector = dynamic(
  () => import("@/src/app/components/UI/BackgroundSelector"),
  { ssr: false }
);

export const metadata: Metadata = {
  title: "EYRO | Portfolio",
  description: "Software Developer Portfolio",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <Providers>
          <BackgroundSelector />

          <Navbar
            brand={{ label: "EYRO", href: "/" }}
            items={[
              { type: "section", id: "hero", label: "Home" },
              { type: "section", id: "projects", label: "Projects" },
              {
                type: "dropdown",
                label: "Music",
                href: "/music",
                children: [
                  { href: "/music", label: "🎵 Dashboard" },
                  { href: "/music/top-artists", label: "🎤 Top Artists" },
                  { href: "/music/top-tracks", label: "🎶 Top Tracks" },
                  { href: "/music/history", label: "📻 History" },
                  { href: "/music/discover", label: "🎲 Discover" },
                ],
              },
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
          <ModeToggle />
        </Providers>
      </body>
    </html>
  );
}
