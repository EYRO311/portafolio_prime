"use client";

import { createContext, useContext, useEffect, useState } from "react";

/** @type {import('react').Context<{ locale: 'en' | 'es', toggleLocale: () => void } | null>} */
const LocaleContext = createContext(null);

export const LocaleProvider = ({ children }) => {
  const [locale, setLocale] = useState("en");

  useEffect(() => {
    const saved = localStorage.getItem("locale");
    if (saved === "en" || saved === "es") setLocale(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("locale", locale);
    document.documentElement.setAttribute("lang", locale);
  }, [locale]);

  const toggleLocale = () => setLocale((prev) => (prev === "en" ? "es" : "en"));

  return (
    <LocaleContext.Provider value={{ locale, toggleLocale }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale debe usarse dentro de LocaleProvider");
  return ctx;
};
