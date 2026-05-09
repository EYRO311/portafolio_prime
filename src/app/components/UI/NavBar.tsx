"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/src/app/components/lib/utils";

import { motion, AnimatePresence } from "framer-motion";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

import { useTheme } from "@/src/app/components/utils/ThemeContext";

function HamburgerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="3" y1="7" x2="21" y2="7"/>
      <line x1="3" y1="12" x2="21" y2="12"/>
      <line x1="3" y1="17" x2="21" y2="17"/>
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}

type DropdownChild = {
  href: string;
  label: string;
};

type NavItem =
  | {
      type: "section";
      id: string;
      label: string;
    }
  | {
      type: "route";
      href: string;
      label: string;
    }
  | {
      type: "external";
      href: string;
      label: string;
      icon?: "github" | "linkedin" | "mail";
    }
  | {
      type: "dropdown";
      label: string;
      href?: string;
      children: DropdownChild[];
    };

const navbarVariants = cva("sticky top-0 z-[1000] w-full py-4", {
  variants: {
    density: {
      default: "",
      compact: "py-3",
    },
  },
  defaultVariants: {
    density: "default",
  },
});

const linkBase =
  "text-[15px] transition-colors duration-200 nav-link";
const activeLink = "nav-link-active";

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
  socials?: NavItem[];
  spy?: boolean;
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

  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null);
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleDropdownEnter = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenDropdown(label);
  };

  const handleDropdownLeave = () => {
    closeTimer.current = setTimeout(() => setOpenDropdown(null), 150);
  };

  // ===== Scrollspy =====
  const sectionItems = React.useMemo(
    () =>
      items.filter((i) => i.type === "section") as Extract<
        NavItem,
        { type: "section" }
      >[],
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
          .sort(
            (a, b) =>
              (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0)
          )[0];
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
        <Link
          className={cn(linkBase, isActive && activeLink)}
          href={item.href}
        >
          {item.label}
        </Link>
      );
    }

    // DROPDOWN
    if (item.type === "dropdown") {
      const isOpen = openDropdown === item.label;
      const isActive = item.children.some((c) => pathname.startsWith(c.href)) ||
        (item.href && pathname.startsWith(item.href));

      return (
        <div
          className="relative"
          onMouseEnter={() => handleDropdownEnter(item.label)}
          onMouseLeave={handleDropdownLeave}
        >
          {item.href ? (
            <Link
              href={item.href}
              className={cn(
                linkBase,
                "flex items-center gap-1",
                isActive && activeLink
              )}
            >
              {item.label}
              <span
                style={{
                  display: "inline-block",
                  transition: "transform 0.2s",
                  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  fontSize: "10px",
                  opacity: 0.7,
                  marginTop: "1px",
                }}
              >
                ▾
              </span>
            </Link>
          ) : (
            <button
              className={cn(
                linkBase,
                "flex items-center gap-1 bg-transparent border-0 cursor-pointer p-0",
                isActive && activeLink
              )}
            >
              {item.label}
              <span
                style={{
                  display: "inline-block",
                  transition: "transform 0.2s",
                  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  fontSize: "10px",
                  opacity: 0.7,
                  marginTop: "1px",
                }}
              >
                ▾
              </span>
            </button>
          )}

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                style={{
                  position: "absolute",
                  top: "calc(100% + 10px)",
                  left: "50%",
                  transform: "translateX(-50%)",
                  minWidth: "170px",
                  borderRadius: "14px",
                  padding: "6px",
                  zIndex: 9999,
                  backdropFilter: "blur(12px)",
                  border:
                    theme === "dark"
                      ? "1px solid rgba(255,255,255,0.12)"
                      : "1px solid rgba(0,0,0,0.10)",
                  background:
                    theme === "dark"
                      ? "rgba(10,10,10,0.85)"
                      : "rgba(255,255,255,0.92)",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.28)",
                }}
                onMouseEnter={() => handleDropdownEnter(item.label)}
                onMouseLeave={handleDropdownLeave}
              >
                {item.children.map((child) => {
                  const childActive = pathname === child.href || pathname.startsWith(child.href + "/");
                  return (
                    <Link
                      key={child.href}
                      href={child.href}
                      style={{
                        display: "block",
                        padding: "8px 14px",
                        borderRadius: "9px",
                        fontSize: "14px",
                        fontWeight: childActive ? 700 : 500,
                        color: childActive
                          ? "#0077cc"
                          : theme === "dark"
                          ? "rgba(255,255,255,0.9)"
                          : "rgba(0,0,0,0.85)",
                        background: childActive
                          ? theme === "dark"
                            ? "rgba(0,119,204,0.15)"
                            : "rgba(0,119,204,0.08)"
                          : "transparent",
                        textDecoration: "none",
                        transition: "background 0.15s, color 0.15s",
                        whiteSpace: "nowrap",
                      }}
                      onMouseEnter={(e) => {
                        if (!childActive) {
                          (e.currentTarget as HTMLElement).style.background =
                            theme === "dark"
                              ? "rgba(255,255,255,0.07)"
                              : "rgba(0,0,0,0.05)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!childActive) {
                          (e.currentTarget as HTMLElement).style.background =
                            "transparent";
                        }
                      }}
                    >
                      {child.label}
                    </Link>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }

    // EXTERNAL
    const isMail = item.href.startsWith("mailto:");
    return (
      <a
        className={cn(
          "text-[18px] ml-4 transition-all duration-200 hover:-translate-y-[1px] nav-link",
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

  const mobileMenuBg = theme === "dark"
    ? "rgba(8,8,24,0.97)"
    : "rgba(255,255,255,0.98)";
  const mobileMenuBorder = theme === "dark"
    ? "1px solid rgba(255,255,255,0.10)"
    : "1px solid rgba(0,0,0,0.08)";

  return (
    <nav className={cn(navbarVariants({ density }), className)} {...props}>
      <div
        className={cn(
          "mx-auto w-[92%] max-w-[1200px] rounded-[60px] p-[10px] border",
          "backdrop-blur-md transition-all duration-300",
          theme === "dark"
            ? "bg-black/20 border-[#1e8bc6]/60 shadow-[0_10px_40px_rgba(0,0,0,0.55)]"
            : "bg-white/35 border-[#1e8bc6]/60 shadow-[0_10px_40px_rgba(0,0,0,0.18)]"
        )}
      >
        <div
          className={cn(
            "w-full rounded-[48px] px-4 md:px-8 py-4 flex items-center justify-between gap-6 border",
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
            <Link
              className="no-underline"
              style={{ color: "var(--nav-accent)" }}
              href={brand.href ?? "/"}
            >
              {brand.label}
            </Link>
          </motion.div>

          <ul className="hidden md:flex list-none items-center gap-12 m-0 p-0">
            {items.map((item, idx) => (
              <li key={`${item.type}-${idx}`} style={{ position: "relative" }}>
                {renderItem(item)}
              </li>
            ))}
          </ul>

          <div className="hidden md:flex items-center">
            {socials.map((s, idx) => (
              <React.Fragment key={`social-${idx}`}>
                {renderItem(s)}
              </React.Fragment>
            ))}
          </div>

          {/* Hamburger button — mobile only */}
          <button
            className="flex md:hidden items-center justify-center w-9 h-9 rounded-lg border-0 cursor-pointer transition-colors"
            style={{
              color: "var(--nav-accent)",
              background: "transparent",
            }}
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <CloseIcon /> : <HamburgerIcon />}
          </button>
        </div>

        {/* Mobile dropdown menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              style={{
                marginTop: "8px",
                borderRadius: "20px",
                padding: "12px 8px",
                border: mobileMenuBorder,
                background: mobileMenuBg,
                backdropFilter: "blur(16px)",
                boxShadow: "0 8px 30px rgba(0,0,0,0.28)",
              }}
            >
              {items.map((item, idx) => {
                if (item.type === "section") {
                  const href = isHome ? `#${item.id}` : `/#${item.id}`;
                  const isActive = isHome && activeSection === item.id;
                  return (
                    <a
                      key={idx}
                      href={href}
                      onClick={() => setMobileMenuOpen(false)}
                      style={{
                        display: "block",
                        padding: "10px 16px",
                        borderRadius: "12px",
                        fontSize: "15px",
                        fontWeight: isActive ? 700 : 500,
                        color: isActive
                          ? "var(--nav-accent)"
                          : theme === "dark"
                          ? "rgba(255,255,255,0.88)"
                          : "rgba(0,0,0,0.80)",
                        textDecoration: "none",
                        background: isActive
                          ? theme === "dark"
                            ? "rgba(0,229,255,0.08)"
                            : "rgba(124,58,237,0.06)"
                          : "transparent",
                        transition: "background 0.15s",
                      }}
                    >
                      {item.label}
                    </a>
                  );
                }
                if (item.type === "route") {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={idx}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      style={{
                        display: "block",
                        padding: "10px 16px",
                        borderRadius: "12px",
                        fontSize: "15px",
                        fontWeight: isActive ? 700 : 500,
                        color: isActive
                          ? "var(--nav-accent)"
                          : theme === "dark"
                          ? "rgba(255,255,255,0.88)"
                          : "rgba(0,0,0,0.80)",
                        textDecoration: "none",
                        background: isActive
                          ? theme === "dark"
                            ? "rgba(0,229,255,0.08)"
                            : "rgba(124,58,237,0.06)"
                          : "transparent",
                      }}
                    >
                      {item.label}
                    </Link>
                  );
                }
                if (item.type === "dropdown") {
                  const isActive = item.children.some((c) => pathname.startsWith(c.href)) ||
                    !!(item.href && pathname.startsWith(item.href));
                  return (
                    <div key={idx}>
                      <p
                        style={{
                          padding: "10px 16px 4px",
                          fontSize: "11px",
                          fontWeight: 800,
                          letterSpacing: "2px",
                          textTransform: "uppercase",
                          color: isActive ? "var(--nav-accent)" : theme === "dark" ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.35)",
                          margin: 0,
                        }}
                      >
                        {item.label}
                      </p>
                      {item.children.map((child) => {
                        const childActive = pathname === child.href || pathname.startsWith(child.href + "/");
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setMobileMenuOpen(false)}
                            style={{
                              display: "block",
                              padding: "9px 16px 9px 28px",
                              borderRadius: "10px",
                              fontSize: "14px",
                              fontWeight: childActive ? 700 : 400,
                              color: childActive
                                ? "var(--nav-accent)"
                                : theme === "dark"
                                ? "rgba(255,255,255,0.75)"
                                : "rgba(0,0,0,0.65)",
                              textDecoration: "none",
                              background: childActive
                                ? theme === "dark"
                                  ? "rgba(0,229,255,0.08)"
                                  : "rgba(124,58,237,0.06)"
                                : "transparent",
                            }}
                          >
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  );
                }
                return null;
              })}

              {/* Socials in mobile menu */}
              {socials.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    padding: "12px 16px 4px",
                    borderTop: theme === "dark"
                      ? "1px solid rgba(255,255,255,0.07)"
                      : "1px solid rgba(0,0,0,0.06)",
                    marginTop: "8px",
                  }}
                >
                  {socials.map((s, idx) => {
                    if (s.type !== "external") return null;
                    return (
                      <a
                        key={idx}
                        href={s.href}
                        target={s.href.startsWith("mailto:") ? undefined : "_blank"}
                        rel="noreferrer"
                        aria-label={s.label}
                        style={{
                          fontSize: "20px",
                          color: theme === "dark" ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)",
                          transition: "color 0.2s",
                        }}
                      >
                        {s.icon && <SocialIcon icon={s.icon} />}
                      </a>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

export { navbarVariants };
