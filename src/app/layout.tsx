import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

import ThemeToggle from "@/src/app/components/ThemeToggle";
import LocaleToggle from "@/src/app/components/LocaleToggle";
import SideNav from "@/src/app/components/UI/SideNav";
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

          <SideNav />

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
