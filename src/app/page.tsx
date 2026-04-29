import type { CSSProperties } from 'react'
import profileJson from '../data/profile.json'
import projectsJson from '../data/projects.json'
import skillsJson from '../data/skills.json'

/* ── Types ──────────────────────────────────────────────────────── */
interface Project {
  slug: string
  title: string
  description: string
  stack: string[]
  repo: string
  live: string
  type: string
}

interface Profile {
  name: string
  role: string
  summary: string
  contact: { email: string; phone: string }
  links: { linkedin: string; github: string }
  stack_keywords: string[]
  experience: Array<{
    title: string; company: string; location: string
    start: string; end: string | null; highlights: string[]
  }>
  education: Array<{
    degree: string; institution: string; location: string
    start: string; end: string | null
  }>
}

interface Skills {
  programming_languages: string[]
  frontend: string[]
  backend: string[]
  databases: string[]
  cloud_devops: string[]
  tools: string[]
  integrations: string[]
  certifications: string[]
}

/* ── Static config ──────────────────────────────────────────────── */
const SKILL_BARS = [
  { name: 'React / Next.js', pct: 88 },
  { name: 'TypeScript', pct: 85 },
  { name: 'Node.js / Express', pct: 82 },
  { name: 'SQL / Databases', pct: 80 },
]

const TYPE_COLORS: Record<string, string> = {
  work: '#00e5ff',
  project: '#ff00cc',
  teaching: '#a855f7',
}

const CERT_LINKS: Record<string, string> = {
  'The Full Stack': 'https://coursera.org/verify/RM9BLFYDD0NL',
  'Programming in Python': 'https://coursera.org/verify/5ACDPFELXTKQ',
  'Version Control (Git)': 'https://coursera.org/verify/7WXNWS1T2OOA',
  'Introduction to Back-End Development': 'https://coursera.org/verify/EDZ4PBN5KRX9',
  'HTML and CSS in Depth': 'https://coursera.org/verify/AV7315UHG9HR',
  'Programming with JavaScript': 'https://coursera.org/verify/2RSLGSM52EUF',
  'Introduction to Front-End Development': 'https://coursera.org/verify/6Y8P878NNCJX',
}

/* ── SVG Icons ──────────────────────────────────────────────────── */
const IconHome = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
)
const IconCpu = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="16" height="16" rx="2"/>
    <rect x="9" y="9" width="6" height="6"/>
    <line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/>
    <line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/>
    <line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/>
    <line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/>
  </svg>
)
const IconFolder = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
  </svg>
)
const IconMail = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
)
const IconGithub = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/>
  </svg>
)
const IconContact = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
)
const IconPhone = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81 19.79 19.79 0 0112 .18 2 2 0 0114 2.18v3a2 2 0 01-1.44 1.93 15.04 15.04 0 00-6.49 6.49A2 2 0 0118.92 16.92z"/>
  </svg>
)
const IconLinkedIn = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
)

/* ── CSS ────────────────────────────────────────────────────────── */
const CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── layout ── */
  main { position: relative; z-index: 1; padding-left: 5rem; }

  .section {
    min-height: 100vh;
    display: flex; align-items: center;
    padding: 6rem 3rem 6rem 2rem;
    max-width: 1180px; margin: 0 auto;
    position: relative;
  }

  /* ── sidebar ── */
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

  /* ════════════ HERO ════════════ */
  .hero-inner { display: flex; flex-direction: column; gap: 1.3rem; max-width: 800px; }

  .hero-badge {
    display: inline-flex; align-items: center; gap: 0.5rem;
    font-size: 0.75rem; font-weight: 700; letter-spacing: 2.5px;
    text-transform: uppercase; color: var(--accent1); opacity: 0.82;
  }
  .hero-badge::before {
    content: ''; display: inline-block; width: 28px; height: 1px;
    background: var(--accent1); box-shadow: 0 0 8px var(--accent1);
  }
  .hero-hi { font-size: clamp(1.3rem, 2.5vw, 1.8rem); color: var(--text-muted); font-weight: 400; }

  /* glitch effect */
  .glitch-wrap { position: relative; display: inline-block; }
  .glitch-name {
    font-size: clamp(3.8rem, 9vw, 6.5rem);
    font-weight: 900; letter-spacing: -2px; line-height: 1;
    color: var(--text);
    text-shadow:
      0 0 30px color-mix(in srgb, var(--accent1) 30%, transparent),
      0 0 80px color-mix(in srgb, var(--accent1) 8%, transparent);
    position: relative;
  }
  .glitch-name::before, .glitch-name::after {
    content: attr(data-text);
    position: absolute; inset: 0;
    font-size: inherit; font-weight: inherit;
    letter-spacing: inherit; line-height: inherit;
    pointer-events: none;
  }
  .glitch-name::before { color: var(--glitch-a); animation: ga 4.2s infinite steps(1); }
  .glitch-name::after  { color: var(--glitch-b); animation: gb 4.2s infinite steps(1) 0.14s; }

  @keyframes ga {
    0%,86%,100% { clip-path: inset(100% 0 0 0); transform: none; }
    88% { clip-path: inset(12% 0 74% 0); transform: translate(-3px, 1px); }
    90% { clip-path: inset(58% 0 18% 0); transform: translate(2px, -1px); }
    92% { clip-path: inset(30% 0 48% 0); transform: translate(-4px, 0); }
    94% { clip-path: inset(78% 0 4%  0); transform: translate(3px, 1px); }
    96% { clip-path: inset(5%  0 88% 0); transform: translate(-2px, -1px); }
    98% { clip-path: inset(45% 0 35% 0); transform: translate(2px, 0); }
  }
  @keyframes gb {
    0%,86%,100% { clip-path: inset(100% 0 0 0); transform: none; }
    87% { clip-path: inset(44% 0 38% 0); transform: translate(3px, -1px); }
    89% { clip-path: inset(8%  0 82% 0); transform: translate(-2px, 1px); }
    91% { clip-path: inset(72% 0 12% 0); transform: translate(4px, 0); }
    93% { clip-path: inset(22% 0 62% 0); transform: translate(-3px, -1px); }
    95% { clip-path: inset(88% 0 2%  0); transform: translate(2px, 1px); }
    97% { clip-path: inset(52% 0 32% 0); transform: translate(-1px, -2px); }
    99% { clip-path: inset(18% 0 68% 0); transform: translate(3px, 0); }
  }

  .hero-role {
    font-size: clamp(0.95rem, 2vw, 1.2rem); font-weight: 600;
    color: var(--accent2);
    text-shadow: 0 0 14px color-mix(in srgb, var(--accent2) 35%, transparent);
    letter-spacing: 0.3px;
  }
  .hero-role::before { content: '> '; font-family: monospace; color: var(--accent1); opacity: 0.9; }

  .hero-desc { font-size: 1rem; line-height: 1.78; color: var(--text-muted); max-width: 620px; }

  .hero-tags { display: flex; flex-wrap: wrap; gap: 0.45rem; }
  .htag {
    font-size: 0.71rem; font-weight: 600;
    padding: 0.28rem 0.72rem; border-radius: 20px;
    border: 1px solid color-mix(in srgb, var(--accent1) 20%, transparent);
    color: color-mix(in srgb, var(--accent1) 80%, var(--text));
    background: color-mix(in srgb, var(--accent1) 4%, transparent);
    letter-spacing: 0.3px; transition: all 0.2s;
  }
  .htag:hover {
    border-color: var(--accent2); color: var(--accent2);
    background: color-mix(in srgb, var(--accent2) 4%, transparent);
  }

  .hero-cta { display: flex; gap: 0.85rem; flex-wrap: wrap; margin-top: 0.3rem; }
  .btn-p {
    display: inline-flex; align-items: center; gap: 0.4rem;
    padding: 0.68rem 1.75rem; border-radius: 8px;
    font-size: 0.9rem; font-weight: 700; letter-spacing: 0.4px;
    text-decoration: none; background: var(--grad); color: var(--btn-text); border: none;
    box-shadow: 0 0 22px color-mix(in srgb, var(--accent1) 38%, transparent);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .btn-p:hover { transform: translateY(-2px); box-shadow: 0 0 38px color-mix(in srgb, var(--accent1) 55%, transparent); }
  .btn-s {
    display: inline-flex; align-items: center;
    padding: 0.68rem 1.75rem; border-radius: 8px;
    font-size: 0.9rem; font-weight: 700; letter-spacing: 0.4px;
    text-decoration: none; background: transparent; color: var(--text-muted);
    border: 1.5px solid color-mix(in srgb, var(--accent1) 28%, transparent);
    transition: border-color 0.2s, color 0.2s, box-shadow 0.2s;
  }
  .btn-s:hover {
    border-color: var(--accent2); color: var(--accent2);
    box-shadow: 0 0 18px color-mix(in srgb, var(--accent2) 18%, transparent);
  }

  /* scatter lines (glitch decoration) */
  .scatter {
    position: absolute; height: 2px; border-radius: 2px;
    transform: scaleX(0); transform-origin: left;
    animation: sa 4.5s ease-in-out infinite; pointer-events: none;
  }
  .s1 { width: 90px;  top:18%; right:10%; background:var(--accent1); box-shadow:0 0 8px var(--accent1); animation-delay:0s;   animation-duration:3.8s; opacity:.42; }
  .s2 { width:130px;  top:35%; right: 5%; background:var(--accent2); box-shadow:0 0 8px var(--accent2); animation-delay:1.1s; animation-duration:4.6s; opacity:.32; }
  .s3 { width: 55px;  top:65%; right:15%; background:var(--accent1); box-shadow:0 0 8px var(--accent1); animation-delay:2.4s; animation-duration:3.2s; opacity:.28; }
  .s4 { width:105px;  top:80%; right: 8%; background:var(--accent2); box-shadow:0 0 8px var(--accent2); animation-delay:0.6s; animation-duration:5.1s; opacity:.22; }
  @keyframes sa {
    0%,100% { transform: scaleX(0); opacity: 0; }
    30%,70%  { transform: scaleX(1); }
  }

  /* divider */
  .hr {
    height: 1px;
    background: linear-gradient(90deg, transparent,
      color-mix(in srgb, var(--accent1) 18%, transparent),
      color-mix(in srgb, var(--accent2) 18%, transparent), transparent);
    max-width: 1100px; margin: 0 auto 0 5rem;
  }

  /* section headings */
  .sec-tag {
    font-size: 0.75rem; font-weight: 700; letter-spacing: 3px;
    text-transform: uppercase; color: var(--accent1);
    margin-bottom: 0.5rem; opacity: 0.8;
  }
  .sec-h2 {
    font-size: clamp(2rem, 4vw, 3rem); font-weight: 800;
    margin-bottom: 1rem; line-height: 1.12; color: var(--text);
  }
  .accent-word { color: var(--accent1); text-shadow: 0 0 22px color-mix(in srgb, var(--accent1) 45%, transparent); }
  .sec-body { font-size: 0.97rem; line-height: 1.78; color: var(--text-muted); margin-bottom: 2rem; }

  /* ════════════ SKILLS ════════════ */
  .skills-grid {
    display: grid; grid-template-columns: 1fr 1.15fr;
    gap: 5rem; align-items: start; width: 100%;
  }
  .skills-cats { display: flex; flex-direction: column; gap: 0.85rem; }
  .cat-panel {
    padding: 1.1rem 1.3rem; border-radius: 14px;
    border: 1px solid color-mix(in srgb, var(--accent1) 10%, transparent);
    background: color-mix(in srgb, var(--accent1) 2.5%, transparent);
    backdrop-filter: blur(8px); transition: border-color 0.2s;
  }
  .cat-panel:hover { border-color: color-mix(in srgb, var(--accent1) 28%, transparent); }
  .cat-label {
    font-size: 0.67rem; font-weight: 800; letter-spacing: 2.5px;
    text-transform: uppercase; color: var(--accent2);
    text-shadow: 0 0 10px color-mix(in srgb, var(--accent2) 28%, transparent);
    margin-bottom: 0.62rem;
  }
  .cat-chips { display: flex; flex-wrap: wrap; gap: 0.32rem; }
  .cat-chip {
    font-size: 0.72rem; padding: 0.2rem 0.58rem; border-radius: 6px;
    background: color-mix(in srgb, var(--text) 5%, transparent);
    color: var(--text-muted);
    border: 1px solid color-mix(in srgb, var(--text) 9%, transparent);
  }

  /* skill bars */
  .bar-list { display: flex; flex-direction: column; gap: 1rem; }
  .bar-item { display: flex; flex-direction: column; gap: 0.36rem; }
  .bar-header { display: flex; justify-content: space-between; align-items: center; }
  .bar-name {
    font-size: 0.86rem; font-weight: 600; color: var(--text);
    display: flex; align-items: center; gap: 0.45rem;
  }
  .dot {
    width: 5px; height: 5px; border-radius: 50%;
    background: var(--accent1); box-shadow: 0 0 5px var(--accent1); flex-shrink: 0;
  }
  .bar-pct { font-size: 0.78rem; font-weight: 700; color: var(--accent1); font-family: monospace; }
  .bar-track { height: 4px; background: color-mix(in srgb, var(--accent1) 8%, transparent); border-radius: 20px; overflow: hidden; }
  .bar-fill {
    height: 100%; border-radius: 20px; background: var(--bar-grad);
    box-shadow: 0 0 10px color-mix(in srgb, var(--accent1) 35%, transparent);
    animation: fill 1.6s cubic-bezier(.4,0,.2,1) forwards; width: 0;
  }
  @keyframes fill { from { width: 0; } to { width: var(--w); } }

  /* language chips */
  .lang-chips { display: flex; flex-wrap: wrap; gap: 0.42rem; margin-top: 1.4rem; }
  .lang-chip {
    font-size: 0.72rem; font-weight: 600; padding: 0.26rem 0.68rem; border-radius: 6px;
    border: 1px solid color-mix(in srgb, var(--accent2) 25%, transparent);
    color: color-mix(in srgb, var(--accent2) 85%, var(--text));
    background: color-mix(in srgb, var(--accent2) 4%, transparent); letter-spacing: 0.3px;
  }

  /* certifications */
  .cert-heading {
    font-size: 0.72rem; font-weight: 700; letter-spacing: 2.5px;
    text-transform: uppercase; color: var(--accent2); opacity: 0.8;
    margin-top: 2rem; margin-bottom: 0.75rem;
  }
  .cert-list { display: flex; flex-direction: column; gap: 0.5rem; }
  .cert-card {
    display: flex; justify-content: space-between; align-items: center;
    padding: 0.6rem 1rem; border-radius: 10px; gap: 1rem;
    border: 1px solid color-mix(in srgb, var(--accent2) 18%, transparent);
    background: color-mix(in srgb, var(--accent2) 3%, transparent);
    transition: border-color 0.2s, transform 0.18s;
  }
  .cert-card:hover {
    border-color: color-mix(in srgb, var(--accent2) 40%, transparent);
    transform: translateX(3px);
  }
  .cert-name { font-size: 0.79rem; color: var(--text-muted); line-height: 1.4; flex: 1; }
  .cert-link {
    font-size: 0.66rem; font-weight: 800; letter-spacing: 0.8px; text-transform: uppercase;
    color: var(--accent2); text-decoration: none; flex-shrink: 0;
    padding: 0.18rem 0.58rem; border-radius: 5px;
    border: 1px solid color-mix(in srgb, var(--accent2) 28%, transparent);
    background: color-mix(in srgb, var(--accent2) 6%, transparent);
    transition: all 0.2s; white-space: nowrap;
  }
  .cert-link:hover { background: color-mix(in srgb, var(--accent2) 16%, transparent); }

  /* ════════════ PROJECTS ════════════ */
  .proj-section { display: flex; flex-direction: column; gap: 2.5rem; width: 100%; }
  .proj-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(285px, 1fr)); gap: 1.25rem;
  }
  .proj-card {
    padding: 1.5rem; border-radius: 16px;
    border: 1px solid color-mix(in srgb, var(--accent1) 10%, transparent);
    background: var(--bg-card); backdrop-filter: blur(10px);
    display: flex; flex-direction: column; gap: 0.9rem;
    position: relative; overflow: hidden;
    transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
  }
  .proj-card::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, color-mix(in srgb, var(--accent1) 3%, transparent), transparent 55%);
    pointer-events: none;
  }
  .proj-card:hover {
    border-color: color-mix(in srgb, var(--accent1) 38%, transparent);
    transform: translateY(-4px);
    box-shadow: 0 16px 42px color-mix(in srgb, #000 30%, transparent),
                0 0 28px color-mix(in srgb, var(--accent1) 7%, transparent);
  }
  .proj-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem; }
  .proj-title { font-size: 1rem; font-weight: 700; color: var(--text); line-height: 1.3; }
  .proj-badge {
    font-size: 0.58rem; font-weight: 800; letter-spacing: 1.5px;
    text-transform: uppercase; padding: 0.18rem 0.55rem;
    border-radius: 4px; border: 1px solid; flex-shrink: 0;
  }
  .proj-desc { font-size: 0.86rem; line-height: 1.65; color: var(--text-muted); flex: 1; }
  .proj-stack { display: flex; flex-wrap: wrap; gap: 0.32rem; }
  .proj-tag {
    font-size: 0.67rem; font-weight: 600; padding: 0.18rem 0.5rem; border-radius: 5px;
    background: color-mix(in srgb, var(--accent1) 7%, transparent);
    color: color-mix(in srgb, var(--accent1) 78%, var(--text));
    border: 1px solid color-mix(in srgb, var(--accent1) 14%, transparent);
  }
  .proj-links { display: flex; gap: 0.7rem; }
  .proj-link { font-size: 0.77rem; font-weight: 600; color: var(--text-subtle); text-decoration: none; transition: color 0.2s; }
  .proj-link:hover { color: var(--accent1); }

  /* ════════════ CONTACT ════════════ */
  .contact-wrap { width: 100%; max-width: 780px; }
  .contact-grid {
    display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.1rem; margin-top: 2rem;
  }
  .contact-card {
    padding: 1.3rem 1.4rem; border-radius: 14px;
    border: 1px solid color-mix(in srgb, var(--accent1) 12%, transparent);
    background: var(--bg-card); backdrop-filter: blur(10px);
    display: flex; align-items: center; gap: 1rem;
    transition: border-color 0.22s, transform 0.22s, box-shadow 0.22s;
    text-decoration: none; position: relative; overflow: hidden;
  }
  .contact-card::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, color-mix(in srgb, var(--accent1) 3%, transparent), transparent 60%);
    pointer-events: none;
  }
  .contact-card:hover {
    border-color: color-mix(in srgb, var(--accent1) 40%, transparent);
    transform: translateY(-3px);
    box-shadow: 0 10px 30px color-mix(in srgb, #000 22%, transparent),
                0 0 20px color-mix(in srgb, var(--accent1) 10%, transparent);
  }
  .contact-icon-wrap {
    width: 42px; height: 42px; border-radius: 12px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    background: color-mix(in srgb, var(--accent1) 8%, transparent);
    border: 1px solid color-mix(in srgb, var(--accent1) 18%, transparent);
    color: var(--accent1);
  }
  .contact-label {
    font-size: 0.65rem; font-weight: 700; letter-spacing: 2px;
    text-transform: uppercase; color: var(--text-subtle); margin-bottom: 0.18rem;
  }
  .contact-value {
    font-size: 0.83rem; font-weight: 600; color: var(--text); line-height: 1.35;
    word-break: break-all;
  }

  /* ── footer ── */
  .page-footer {
    position: relative; z-index: 1;
    padding: 2.5rem 3rem 2.5rem 7rem;
    border-top: 1px solid color-mix(in srgb, var(--accent1) 7%, transparent);
    display: flex; justify-content: space-between; align-items: center;
    font-size: 0.8rem; color: var(--text-subtle);
    flex-wrap: wrap; gap: 1rem; max-width: 1180px; margin: 0 auto;
  }
  .footer-links { display: flex; gap: 1.25rem; }
  .footer-links a { color: var(--text-subtle); text-decoration: none; transition: color 0.2s; }
  .footer-links a:hover { color: var(--accent1); }

  /* ── responsive ── */
  @media (max-width: 900px) {
    main { padding-left: 0; }
    .sidebar {
      position: fixed; bottom: 1.25rem; left: 50%; top: auto;
      transform: translateX(-50%);
      flex-direction: row; padding: 0.75rem 1.25rem; border-radius: 20px;
    }
    .section { padding: 5rem 1.5rem 9rem; }
    .skills-grid { grid-template-columns: 1fr; gap: 3rem; }
    .contact-grid { grid-template-columns: 1fr; }
    .hr { margin-left: 0; }
    .page-footer { padding: 2rem 1.5rem; margin: 0; }
    .s1,.s2,.s3,.s4 { display: none; }
  }
`

/* ── Component ──────────────────────────────────────────────────── */
export default function Home() {
  const profile = profileJson as unknown as Profile
  const { projects } = projectsJson as unknown as { projects: Project[] }
  const skills = skillsJson as unknown as Skills

  const firstName = profile.name.split(' ')[0]
  const shortRole = profile.role.split('|')[0].trim()

  return (
    <>
      <style>{CSS}</style>

      {/* ── Sidebar ── */}
      <nav className="sidebar" aria-label="Navigation">
        <a href="#hero"     className="si active" title="Home"><IconHome /></a>
        <a href="#skills"   className="si"        title="Skills"><IconCpu /></a>
        <a href="#projects" className="si"        title="Projects"><IconFolder /></a>
        <a href="#contact"  className="si"        title="Contact"><IconContact /></a>
        <a href={profile.links.github} className="si" title="GitHub" target="_blank" rel="noopener"><IconGithub /></a>
      </nav>

      <main>

        {/* ══════════════════════ HERO ══════════════════════ */}
        <section id="hero" className="section">
          <span className="scatter s1" />
          <span className="scatter s2" />
          <span className="scatter s3" />
          <span className="scatter s4" />

          <div className="hero-inner">
            <span className="hero-badge">Available for work</span>
            <p className="hero-hi">Hi, I&apos;m</p>

            <div className="glitch-wrap">
              <h1 className="glitch-name" data-text={firstName}>{firstName}</h1>
            </div>

            <p className="hero-role">{shortRole}</p>
            <p className="hero-desc">{profile.summary.slice(0, 300)}&hellip;</p>

            <div className="hero-tags">
              {profile.stack_keywords.slice(0, 9).map(k => (
                <span key={k} className="htag">{k}</span>
              ))}
            </div>

            <div className="hero-cta">
              <a href="#projects" className="btn-p">Ver proyectos →</a>
              <a href="#contact"  className="btn-s">Contacto</a>
              <a href={profile.links.github} className="btn-s" target="_blank" rel="noopener">GitHub ↗</a>
            </div>
          </div>
        </section>

        <div className="hr" />

        {/* ══════════════════════ SKILLS ══════════════════════ */}
        <section id="skills" className="section">
          <div className="skills-grid">

            {/* Left — category panels from skills.json */}
            <div className="skills-cats">
              {([
                ['Frontend',       skills.frontend],
                ['Backend',        skills.backend],
                ['Databases',      skills.databases],
                ['Cloud & DevOps', skills.cloud_devops],
                ['Integrations',   skills.integrations],
              ] as [string, string[]][]).map(([label, items]) => (
                <div key={label} className="cat-panel">
                  <p className="cat-label">{label}</p>
                  <div className="cat-chips">
                    {items.map(item => <span key={item} className="cat-chip">{item}</span>)}
                  </div>
                </div>
              ))}
            </div>

            {/* Right — bars + certifications */}
            <div>
              <p className="sec-tag">Tech Stack</p>
              <h2 className="sec-h2">My <span className="accent-word">Skills</span></h2>
              <p className="sec-body">{profile.summary.slice(0, 240)}&hellip;</p>

              <div className="bar-list">
                {SKILL_BARS.map(({ name, pct }) => (
                  <div key={name} className="bar-item">
                    <div className="bar-header">
                      <span className="bar-name"><span className="dot" />{name}</span>
                      <span className="bar-pct">{pct}%</span>
                    </div>
                    <div className="bar-track">
                      <div
                        className="bar-fill"
                        style={{ '--w': `${pct}%` } as CSSProperties & { '--w': string }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="lang-chips">
                {skills.programming_languages.map(l => (
                  <span key={l} className="lang-chip">{l}</span>
                ))}
              </div>

              {/* Certifications with verify links */}
              <p className="cert-heading">Certifications</p>   
              <div className="cert-list">
                {skills.certifications.map(cert => {
                  const link = Object.entries(CERT_LINKS).find(([key]) => cert.includes(key))?.[1]
                  return (
                    <div key={cert} className="cert-card">
                      <span className="cert-name">{cert}</span>
                      {link && (
                        <a href={link} className="cert-link" target="_blank" rel="noopener">
                          Verificar ↗
                        </a>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        <div className="hr" />

        {/* ══════════════════════ PROJECTS ══════════════════════ */}
        <section id="projects" className="section">
          <div className="proj-section">
            <div>
              <p className="sec-tag">Portfolio</p>
              <h2 className="sec-h2">My <span className="accent-word">Projects</span></h2>
            </div>

            <div className="proj-grid">
              {projects.map(p => {
                const accent = TYPE_COLORS[p.type] ?? 'var(--accent1)'
                return (
                  <article key={p.slug} className="proj-card">
                    <div className="proj-top">
                      <h3 className="proj-title">{p.title}</h3>
                      <span
                        className="proj-badge"
                        style={{ color: accent, borderColor: `${accent}45`, background: `${accent}12` }}
                      >
                        {p.type}
                      </span>
                    </div>
                    <p className="proj-desc">{p.description}</p>
                    <div className="proj-stack">
                      {p.stack.map(t => <span key={t} className="proj-tag">{t}</span>)}
                    </div>
                    <div className="proj-links">
                      {p.repo && <a href={p.repo} className="proj-link" target="_blank" rel="noopener">↳ Repo</a>}
                      {p.live && <a href={p.live} className="proj-link" target="_blank" rel="noopener">↳ Live ↗</a>}
                      {!p.repo && !p.live && (
                        <span className="proj-link" style={{ opacity: 0.3, cursor: 'default' }}>Private / Confidential</span>
                      )}
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <div className="hr" />

        {/* ══════════════════════ CONTACT ══════════════════════ */}
        <section id="contact" className="section">
          <div className="contact-wrap">
            <p className="sec-tag">Get in touch</p>
            <h2 className="sec-h2">Contact <span className="accent-word">Me</span></h2>
            <p className="sec-body">
              Open to new opportunities, collaborations and interesting projects.
              Feel free to reach out through any of the channels below.
            </p>

            <div className="contact-grid">
              <a href={`mailto:${profile.contact.email}`} className="contact-card">
                <div className="contact-icon-wrap"><IconMail /></div>
                <div>
                  <p className="contact-label">Email</p>
                  <p className="contact-value">{profile.contact.email}</p>
                </div>
              </a>

              <a href={`tel:${profile.contact.phone.replace(/\s/g, '')}`} className="contact-card">
                <div className="contact-icon-wrap"><IconPhone /></div>
                <div>
                  <p className="contact-label">Teléfono</p>
                  <p className="contact-value">{profile.contact.phone}</p>
                </div>
              </a>

              <a href={`https://${profile.links.linkedin}`} className="contact-card" target="_blank" rel="noopener">
                <div className="contact-icon-wrap"><IconLinkedIn /></div>
                <div>
                  <p className="contact-label">LinkedIn</p>
                  <p className="contact-value">emiliano-yahel-ruiz-oropeza ↗</p>
                </div>
              </a>

              <a href={`https://${profile.links.github}`} className="contact-card" target="_blank" rel="noopener">
                <div className="contact-icon-wrap"><IconGithub /></div>
                <div>
                  <p className="contact-label">GitHub</p>
                  <p className="contact-value">EYRO311 ↗</p>
                </div>
              </a>
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="page-footer">
          <span>{profile.name} &mdash; {profile.contact.email}</span>
          <div className="footer-links">
            <a href={`https://${profile.links.github}`}   target="_blank" rel="noopener">GitHub</a>
            <a href={`https://${profile.links.linkedin}`} target="_blank" rel="noopener">LinkedIn</a>
          </div>
        </footer>

      </main>
    </>
  )
}
