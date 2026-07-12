import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

import ThemeToggle from "@/src/app/components/ThemeToggle";
import LocaleToggle from "@/src/app/components/LocaleToggle";
import { Navbar } from "@/src/app/components/UI/NavBar";
import BackgroundSelector from "@/src/app/components/UI/BackgroundSelector";

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
              { type: "section", id: "hero",     label: "Home" },
              { type: "section", id: "skills",   label: "Skills" },
              { type: "section", id: "projects", label: "Projects" },
              { type: "section", id: "contact",  label: "Contact" },
              {
                type: "dropdown",
                label: "Music",
                href: "/music",
                children: [
                  { href: "/music",              label: "🎵 Dashboard" },
                  { href: "/music/top-artists",  label: "🎤 Top Artists" },
                  { href: "/music/top-tracks",   label: "🎶 Top Tracks" },
                  { href: "/music/history",      label: "📻 History" },
                  { href: "/music/discover",     label: "🎲 Discover" },
                ],
              },
            ]}
            socials={[
              { type: "external", href: "https://github.com/EYRO311",                              label: "GitHub",   icon: "github"   },
              { type: "external", href: "https://linkedin.com/in/emiliano-yahel-ruiz-oropeza",    label: "LinkedIn", icon: "linkedin" },
              { type: "external", href: "mailto:ruiz.oropeza.emiliano.yahel@gmail.com",            label: "Email",    icon: "mail"     },
            ]}
            spy
          />

          {children}

          <footer style={{ padding: 20, textAlign: "center", opacity: 0.7 }}>
            © 2025 EYRO. Hecho con Next.
          </footer>

          <ThemeToggle />
          <LocaleToggle />
        </Providers>
      </body>
    </html>
  );
}
