"use client";

import { ThemeProvider } from "@/src/app/components/utils/ThemeContext";
import { ModeProvider } from "@/src/app/components/utils/ModeContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ModeProvider>{children}</ModeProvider>
    </ThemeProvider>
  );
}