"use client";

import { ThemeProvider } from "@/src/app/components/utils/ThemeContext";
import { LocaleProvider } from "@/src/app/components/utils/LocaleContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LocaleProvider>{children}</LocaleProvider>
    </ThemeProvider>
  );
}
