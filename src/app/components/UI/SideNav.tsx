"use client"

import { usePathname } from 'next/navigation'
import { useLocale } from '@/src/app/components/utils/LocaleContext'

const LABELS = {
  en: { home: 'Home', skills: 'Skills', projects: 'Projects', contact: 'Contact', music: 'Music', github: 'GitHub', linkedin: 'LinkedIn', email: 'Email' },
  es: { home: 'Inicio', skills: 'Habilidades', projects: 'Proyectos', contact: 'Contacto', music: 'Música', github: 'GitHub', linkedin: 'LinkedIn', email: 'Correo' },
}

const IconHome = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
)
const IconCpu = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <rect x="9" y="9" width="6" height="6" />
    <line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" />
    <line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" />
    <line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" />
    <line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" />
  </svg>
)
const IconFolder = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
  </svg>
)
const IconContact = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)
const IconMusic = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
)
const IconGithub = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
  </svg>
)
const IconLinkedIn = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)
const IconMail = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
)

const CSS = `
  .sidebar {
    position: fixed; left: 1.25rem; top: 50%; z-index: 100;
    transform: translateY(-50%);
    display: flex; flex-direction: column; gap: 1rem;
    background: var(--sidebar-bg);
    border: 1px solid color-mix(in srgb, var(--accent1) 14%, transparent);
    border-radius: 20px; padding: 1.25rem 0.75rem;
    backdrop-filter: blur(16px);
    transition: background 0.3s, border-color 0.3s;
  }
  .sidebar .si-divider {
    height: 1px; background: color-mix(in srgb, var(--accent1) 16%, transparent);
    margin: 0.15rem 0.35rem;
  }
  .si {
    width: 36px; height: 36px;
    display: flex; align-items: center; justify-content: center;
    border-radius: 10px; color: var(--text-subtle);
    text-decoration: none; border: 1px solid transparent;
    transition: all 0.2s;
  }
  .si:hover, .si.active {
    color: var(--accent1);
    border-color: color-mix(in srgb, var(--accent1) 30%, transparent);
    background: color-mix(in srgb, var(--accent1) 8%, transparent);
    box-shadow: 0 0 14px color-mix(in srgb, var(--accent1) 20%, transparent);
  }
  @media (max-width: 900px) {
    .sidebar {
      position: fixed; bottom: 1.25rem; left: 50%; top: auto;
      transform: translateX(-50%);
      flex-direction: row; flex-wrap: wrap; justify-content: center;
      max-width: min(92vw, 280px);
      gap: 0.5rem; padding: 0.65rem 0.85rem; border-radius: 20px;
    }
    .sidebar .si-divider { display: none; }
    .si { width: 34px; height: 34px; }
  }
  @media (max-width: 480px) {
    .sidebar { max-width: min(90vw, 240px); gap: 0.4rem; padding: 0.55rem 0.7rem; }
    .si { width: 32px; height: 32px; }
  }
`

export default function SideNav() {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const isMusic = pathname.startsWith('/music')
  const { locale } = useLocale()
  const t = LABELS[locale]

  const sectionHref = (id: string) => (isHome ? `#${id}` : `/#${id}`)

  return (
    <>
      <style>{CSS}</style>
      <nav className="sidebar" aria-label="Navigation">
        <a href={sectionHref('hero')} className={`si${isHome ? ' active' : ''}`} title={t.home}><IconHome /></a>
        <a href={sectionHref('skills')} className="si" title={t.skills}><IconCpu /></a>
        <a href={sectionHref('projects')} className="si" title={t.projects}><IconFolder /></a>
        <a href={sectionHref('contact')} className="si" title={t.contact}><IconContact /></a>
        <a href="/music" className={`si${isMusic ? ' active' : ''}`} title={t.music}><IconMusic /></a>
        <div className="si-divider" />
        <a href="https://github.com/EYRO311" className="si" title={t.github} target="_blank" rel="noopener"><IconGithub /></a>
        <a href="https://www.linkedin.com/in/emiliano-yahel-ruiz-oropeza-3a473a320/" className="si" title={t.linkedin} target="_blank" rel="noopener"><IconLinkedIn /></a>
        <a href="mailto:ruiz.oropeza.emiliano.yahel@gmail.com" className="si" title={t.email}><IconMail /></a>
      </nav>
    </>
  )
}
