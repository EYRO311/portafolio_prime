"use client";

import { ThemeProvider } from "@/src/app/components/utils/ThemeContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}