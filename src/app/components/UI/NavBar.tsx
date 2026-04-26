"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/src/app/components/lib/utils";

import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

// Si ya tienes ThemeContext, úsalo:
import { useTheme } from "@/src/app/components/utils/ThemeContext";

type NavItem =
  | {
      type: "section";
      id: string; // "hero" | "projects" | "music" ...
      label: string;
    }
  | {
      type: "route";
      href: string; // "/skills"
      label: string;
    }
  | {
      type: "external";
      href: string; // "https://..."
      label: string;
      icon?: "github" | "linkedin" | "mail";
    };

const navbarVariants = cva(
  "sticky top-0 z-[1000] w-full py-4",
  {
    variants: {
      density: {
        default: "",
        compact: "py-3",
      },
    },
    defaultVariants: {
      density: "default",
    },
  }
);

const containerVariants = cva(
  [
    "mx-auto w-[90%] max-w-[1100px]",
    "rounded-[40px] px-6 py-3",
    "backdrop-blur-md",
    "flex items-center justify-between gap-6",
    "transition-all duration-300",
    "border shadow-[0_8px_30px_rgba(0,0,0,0.35)]",
  ].join(" "),
  {
    variants: {
      theme: {
        dark: "bg-black/45 border-[#004080]/60 text-white",
        light: "bg-white/55 border-[#608ab4]/60 text-zinc-900",
      },
    },
    defaultVariants: {
      theme: "dark",
    },
  }
);

const linkBase =
  "text-[15px] transition-colors duration-200 hover:text-[#0077cc]";

const activeLink =
  "text-[#0077cc] font-extrabold";

function SocialIcon({ icon }: { icon: "github" | "linkedin" | "mail" }) {
  if (icon === "github") return <FaGithub />;
  if (icon === "linkedin") return <FaLinkedin />;
  return <FaEnvelope />;
}

export interface NavbarProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof navbarVariants> {
  brand?: { label: string; href?: string };
  items: NavItem[];
  /** íconos a la derecha (externos) */
  socials?: NavItem[]; // usa type:"external" + icon
  /** true = activa scrollspy en Home para items type:"section" */
  spy?: boolean;
  /** Ajuste fino si tu navbar tapa las secciones */
  spyRootMargin?: string;
}

export function Navbar({
  className,
  brand = { label: "EYRO", href: "/" },
  items,
  socials = [],
  spy = true,
  spyRootMargin = "-120px 0px -60% 0px",
  density,
  ...props
}: NavbarProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { darkMode } = useTheme();

  const theme = darkMode ? "dark" : "light";

  // ===== Scrollspy (solo sections + solo en Home) =====
  const sectionItems = React.useMemo(
    () => items.filter((i) => i.type === "section") as Extract<NavItem, { type: "section" }>[],
    [items]
  );

  const [activeSection, setActiveSection] = React.useState<string>(
    sectionItems[0]?.id ?? "hero"
  );

  React.useEffect(() => {
    if (!spy || !isHome) return;
    if (!sectionItems.length) return;

    const els = sectionItems
      .map((s) => document.getElementById(s.id))
      .filter(Boolean) as HTMLElement[];

    if (!els.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];

        if (visible?.target?.id) setActiveSection(visible.target.id);
      },
      {
        root: null,
        rootMargin: spyRootMargin,
        threshold: [0.15, 0.25, 0.35, 0.5, 0.65],
      }
    );

    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [spy, isHome, sectionItems, spyRootMargin]);

  const renderItem = (item: NavItem) => {
    // SECTION
    if (item.type === "section") {
      const href = isHome ? `#${item.id}` : `/#${item.id}`;
      const isActive = isHome && activeSection === item.id;

      // en Home: anchor normal. fuera de Home: Link a "/#id"
      if (href.startsWith("#")) {
        return (
          <a className={cn(linkBase, isActive && activeLink)} href={href}>
            {item.label}
          </a>
        );
      }

      return (
        <Link className={cn(linkBase, isActive && activeLink)} href={href}>
          {item.label}
        </Link>
      );
    }

    // ROUTE
    if (item.type === "route") {
      const isActive = pathname === item.href;
      return (
        <Link className={cn(linkBase, isActive && activeLink)} href={item.href}>
          {item.label}
        </Link>
      );
    }

    // EXTERNAL
    const isMail = item.href.startsWith("mailto:");
    return (
      <a
        className={cn(
          "text-[18px] ml-4 transition-all duration-200 hover:-translate-y-[1px] hover:text-[#168ac8]",
          theme === "dark" ? "text-white/90" : "text-zinc-900/85"
        )}
        href={item.href}
        target={isMail ? undefined : "_blank"}
        rel={isMail ? undefined : "noreferrer"}
        aria-label={item.label}
        title={item.label}
      >
        {item.icon ? <SocialIcon icon={item.icon} /> : item.label}
      </a>
    );
  };

return (
  <nav className={cn(navbarVariants({ density }), className)} {...props}>
    {/* Outer pill */}
    <div
      className={cn(
        "mx-auto w-[92%] max-w-[1200px] rounded-[60px] p-[10px] border",
        "backdrop-blur-md transition-all duration-300",
        theme === "dark"
          ? "bg-black/20 border-[#1e8bc6]/60 shadow-[0_10px_40px_rgba(0,0,0,0.55)]"
          : "bg-white/35 border-[#1e8bc6]/60 shadow-[0_10px_40px_rgba(0,0,0,0.18)]"
      )}
    >
      {/* Inner pill */}
      <div
        className={cn(
          "w-full rounded-[48px] px-8 py-4 flex items-center justify-between gap-6 border",
          theme === "dark"
            ? "bg-black/45 border-white/15 text-white"
            : "bg-white/70 border-black/15 text-zinc-900"
        )}
      >
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="font-extrabold text-[20px] tracking-[0.5px]"
        >
          <Link className="text-[#1e8bc6d1] no-underline" href={brand.href ?? "/"}>
            {brand.label}
          </Link>
        </motion.div>

        <ul className="hidden md:flex list-none items-center gap-12 m-0 p-0">
          {items.map((item, idx) => (
            <li key={`${item.type}-${idx}`}>{renderItem(item)}</li>
          ))}
        </ul>

        <div className="hidden md:flex items-center">
          {socials.map((s, idx) => (
            <React.Fragment key={`social-${idx}`}>{renderItem(s)}</React.Fragment>
          ))}
        </div>
      </div>
    </div>

    <style jsx>{`
      @media (max-width: 768px) {
        nav {
          display: none;
        }
      }
    `}</style>
  </nav>
);
}

export { navbarVariants };