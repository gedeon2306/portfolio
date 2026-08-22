import type { ComponentType } from "react";
import {
  FiCode,
  FiDatabase,
  FiServer,
  FiCloud,
  FiTool,
  FiCpu,
  FiLayers,
  FiMonitor,
  FiLock,
  FiTerminal,
  FiFigma,
  FiLayout,
} from "react-icons/fi";
import {
  SiReact,
  SiTypescript,
  SiNextdotjs,
  SiJavascript,
  SiHtml5,
  SiNodedotjs,
  SiExpress,
  SiPython,
  SiDjango,
  SiPostgresql,
  SiMongodb,
  SiRedis,
  SiFirebase,
  SiVuedotjs,
  SiNuxt,
  SiInertia,
  SiLaravel,
  SiAdonisjs,
  SiSupabase,
  SiMariadb,
  SiSqlite,
  SiPhp,
  SiC,
  SiBootstrap,
  SiPostman,
  SiFlutter,
  SiGit,
  SiDocker,
  SiVite,
  SiVercel,
  SiGraphql,
  SiTailwindcss,
  SiPrisma,
  SiRedux,
  SiD3,
  SiStripe,
  SiGithub,
  SiGnubash,
  SiGitlab,
  SiFastapi,
  SiGoland,
  SiLivewire,
} from "react-icons/si";
import { 
    FaCss3,
    FaAws,
    FaSwift,
    FaAngular,
} from "react-icons/fa";
import { 
  TbBrandReactNative, 
  TbBrandVscode, 
  TbBrandAdobeXd,
  TbBrandKotlin,
  TbBrandMysql,
} from "react-icons/tb";
import { GrOracle } from "react-icons/gr";
import { BiBraille } from "react-icons/bi";
import { RiJavaLine } from "react-icons/ri";
import { AiFillApi } from "react-icons/ai";


export type TechMeta = {
  label: string;
  icon: ComponentType<{ size?: number; color?: string; className?: string }>;
  color: string;
};

export const TECHNOLOGIES: Record<string, TechMeta> = {
  // --- FRONTEND ---
  Vue: { label: "Vue.js", icon: SiVuedotjs, color: "#4FC08D" },
  "Vue.js": { label: "Vue.js", icon: SiVuedotjs, color: "#4FC08D" },
  "Nuxt.js": { label: "Nuxt.js", icon: SiNuxt, color: "#00DC82" },
  "Inertia.js": { label: "Inertia.js", icon: SiInertia, color: "#9553E9" },
  Livewire: { label: "Livewire", icon: SiLivewire, color: "#FB70A9" },
  React: { label: "React", icon: SiReact, color: "#61DAFB" },
  "React 19": { label: "React 19", icon: SiReact, color: "#61DAFB" },
  "Next.js": { label: "Next.js", icon: SiNextdotjs, color: "#000000" },
  "React Native": { label: "React Native", icon: TbBrandReactNative, color: "#61DAFB" },
  Angular: { label: "Angular", icon: FaAngular, color: "#7a0404" },

  // --- BACKEND ---
  "Node.js": { label: "Node.js", icon: SiNodedotjs, color: "#5FA04E" },
  Express: { label: "Express", icon: SiExpress, color: "#000000" },
  "Node.js & Express": { label: "Node.js & Express", icon: SiNodedotjs, color: "#5FA04E" },
  "Node.js / Express.js": { label: "Node.js / Express.js", icon: SiNodedotjs, color: "#5FA04E" },
  Laravel: { label: "Laravel", icon: SiLaravel, color: "#FF2D20" },
  Django: { label: "Django", icon: SiDjango, color: "#0C4B33" },
  "Python / Django": { label: "Python / Django", icon: SiDjango, color: "#0C4B33" },
  Adonis: { label: "Adonis", icon: SiAdonisjs, color: "#5A45FF" },
  SupaBase: { label: "SupaBase", icon: SiSupabase, color: "#3ECF8E" },
  "API REST": { label: "API REST", icon: AiFillApi, color: "#0096D6" },
  "FastApi": { label: "FastApi", icon: SiFastapi, color: "#0096D6" },

  // --- BASE DE DONNÉES ---
  MySQL: { label: "MySQL", icon: TbBrandMysql, color: "#4479A1" },
  PostgreSQL: { label: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" },
  MariaDB: { label: "Mariadb", icon: SiMariadb, color: "#003545" },
  Oracle: { label: "Oracle", icon: GrOracle, color: "#F80000" },
  SQLite: { label: "Sqlite", icon: SiSqlite, color: "#003B57" },
  SQLServer: { label: "Sqlserver", icon: FiDatabase, color: "#CC292B" },
  MongoDB: { label: "MongoDB", icon: SiMongodb, color: "#47A248" },
  Redis: { label: "Redis", icon: SiRedis, color: "#DC382D" },
  Firebase: { label: "Firebase", icon: SiFirebase, color: "#FFCA28" },

  // --- OUTILS ---
  "Git / GitHub": { label: "Git / GitHub", icon: SiGithub, color: "#716f6f" },
  Git: { label: "Git", icon: SiGit, color: "#f43513" },
  GitHub: { label: "GitHub", icon: SiGithub, color: "#716f6f" },
  Gitlab: { label: "Gitlab", icon: SiGitlab, color: "#f2842b" },
  "Git & Workflow GitHub": { label: "Git & GitHub", icon: SiGithub, color: "#716f6f" },
  "VS Code": { label: "VS Code", icon: TbBrandVscode, color: "#007ACC" },
  Figma: { label: "Figma", icon: FiFigma, color: "#F24E1E" },
  AdobeXD: { label: "AdobeXD", icon: TbBrandAdobeXd, color: "#FF61F6" },
  PostMan: { label: "PostMan", icon: SiPostman, color: "#FF6C37" },
  Terminal: { label: "Terminal", icon: FiTerminal, color: "#716f6f" },
  Bash: { label: "Bash", icon: SiGnubash, color: "#716f6f" },
  Docker: { label: "Docker", icon: SiDocker, color: "#2496ED" },
  "Vite / Webpack / Tooling": { label: "Vite / Tooling", icon: SiVite, color: "#646CFF" },
  Vite: { label: "Vite", icon: SiVite, color: "#646CFF" },
  Webpack: { label: "Webpack", icon: FiTool, color: "#8DD6F9" },
  AWS: { label: "AWS", icon: FaAws, color: "#FF9900" },
  Vercel: { label: "Vercel", icon: SiVercel, color: "#000000" },

  // --- LANGUAGES ---
  PHP: { label: "PHP", icon: SiPhp, color: "#777BB4" },
  Python: { label: "Python", icon: SiPython, color: "#3776AB" },
  C: { label: "C", icon: SiC, color: "#A8B9CC" },
  JavaScript: { label: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
  Java: { label: "Java", icon: RiJavaLine, color: "#007396" },
  TypeScript: { label: "TypeScript", icon: SiTypescript, color: "#3178C6" },
  Goland: { label: "Goland", icon: SiGoland, color: "#21b6c3" },

  // --- BASIQUE & DESIGN ---
  HTML: { label: "HTML5", icon: SiHtml5, color: "#E34F26" },
  HTML5: { label: "HTML5", icon: SiHtml5, color: "#E34F26" },
  CSS: { label: "CSS3", icon: FaCss3, color: "#1572B6" },
  CSS3: { label: "CSS3", icon: FaCss3, color: "#1572B6" },
  "CSS / Design Systems": { label: "CSS / Design Systems", icon: FaCss3, color: "#1572B6" },
  Bootstrap: { label: "Bootstrap", icon: SiBootstrap, color: "#7952B3" },
  TailwindCSS: { label: "Tailwind css", icon: SiTailwindcss, color: "#06B6D4" },
  "Tailwind css": { label: "Tailwind css", icon: SiTailwindcss, color: "#06B6D4" },
  "Responsive Design": { label: "Responsive Design", icon: FiLayout, color: "#8B5CF6" },
  "Responsive & Touch UI": { label: "Responsive UI", icon: FiMonitor, color: "#8B5CF6" },
  "UI/UX": { label: "UI/UX", icon: FiMonitor, color: "#8B5CF6" },
  "Micro-animations": { label: "Micro-animations", icon: BiBraille, color: "#d244dc" },

  // --- MOBILE ---
  "PWA (Progressive Web Apps)": { label: "PWA", icon: FiMonitor, color: "#7C3AED" },
  Flutter: { label: "Flutter", icon: SiFlutter, color: "#02569B" },
  Swift: { label: "Swift", icon: FaSwift, color: "#ffaa00" },
  Kotlin: { label: "Kotlin", icon: TbBrandKotlin, color: "#a3ab09" },
  "Mobile & Cross-Platform": { label: "Mobile", icon: TbBrandReactNative, color: "#61DAFB" },

  // --- AUTRES / LIBS ---
  GraphQL: { label: "GraphQL", icon: SiGraphql, color: "#E10098" },
  Prisma: { label: "Prisma", icon: SiPrisma, color: "#2D3748" },
  "Redux Toolkit": { label: "Redux Toolkit", icon: SiRedux, color: "#764ABC" },
  "D3.js": { label: "D3.js", icon: SiD3, color: "#F9A03F" },
  WebSockets: { label: "WebSockets", icon: FiServer, color: "#7C3AED" },
  "Stripe API": { label: "Stripe", icon: SiStripe, color: "#635BFF" },
  Stripe: { label: "Stripe", icon: SiStripe, color: "#635BFF" },
  "APIs RESTful & GraphQL": { label: "APIs", icon: AiFillApi, color: "#8B5CF6" },
  "Authentification & Sécurité": { label: "Sécurité", icon: FiLock, color: "#F59E0B" },
  Microservices: { label: "Microservices", icon: FiLayers, color: "#10B981" },
  "CI/CD & Déploiement": { label: "CI/CD", icon: FiCloud, color: "#22C55E" },
  "Design Tokens": { label: "Design Tokens", icon: FiCpu, color: "#A78BFA" },
  "CSS Variables": { label: "CSS Variables", icon: FiDatabase, color: "#22C55E" },
  "Database Administrator & Data Modeling": { label: "Database", icon: FiDatabase, color: "#3B82F6" },
  "Full-Stack": { label: "Full-Stack", icon: FiCode, color: "#8B5CF6" },
  Frontend: { label: "Frontend", icon: FiMonitor, color: "#8B5CF6" },
  Backend: { label: "Backend", icon: FiServer, color: "#10B981" },
  "Cloud computing": { label: "Cloud", icon: FiCloud, color: "#38BDF8" },
  "Software engineering": { label: "Engineering", icon: FiCpu, color: "#C084FC" },
};

const normalizeTechName = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const TECH_ALIASES: Record<string, string> = {
  "vue js": "Vue.js",
  "nuxt js": "Nuxt.js",
  "inertia js": "Inertia.js",
  "node js express js": "Node.js / Express.js",
  "node js express": "Node.js / Express.js",
  "api rest": "API REST",
  "sql server": "SQLServer",
  "sqlserver": "SQLServer",
  "git github": "Git / GitHub",
  "vs code": "VS Code",
  "vscode": "VS Code",
  "adobe xd": "AdobeXD",
  "adobexd": "AdobeXD",
  "postman": "PostMan",
  "html5": "HTML5",
  "css3": "CSS3",
  "tailwind css": "Tailwind css",
  "tailwindcss": "Tailwind css",
  "responsive design": "Responsive Design",
  "react 19": "React 19",
  "reactnative": "React Native",
  "next js": "Next.js",
  "nodejs": "Node.js",
  "node js": "Node.js",
  "css design systems": "CSS / Design Systems",
  "redux toolkit": "Redux Toolkit",
  "d3 js": "D3.js",
  "websockets": "WebSockets",
  "stripe api": "Stripe API",
  "git workflow github": "Git & Workflow GitHub",
  "vite webpack tooling": "Vite / Webpack / Tooling",
  "pwa progressive web apps": "PWA (Progressive Web Apps)",
  "responsive touch ui": "Responsive & Touch UI",
  "apis restful graphql": "APIs RESTful & GraphQL",
  "ci cd deploiement": "CI/CD & Déploiement",
  "design tokens": "Design Tokens",
  "css variables": "CSS Variables",
};

export function getTechMeta(name: string): TechMeta {
  const normalized = normalizeTechName(name);
  const directKey = TECH_ALIASES[normalized] ?? Object.keys(TECHNOLOGIES).find((key) => normalizeTechName(key) === normalized);

  if (directKey) return TECHNOLOGIES[directKey];

  const fallback = Object.keys(TECHNOLOGIES).find((key) => {
    const techNormalized = normalizeTechName(key);
    return techNormalized.includes(normalized) || normalized.includes(techNormalized);
  });

  if (fallback) return TECHNOLOGIES[fallback];

  return { label: name.trim() || "Tech", icon: FiCode, color: "#A78BFA" };
}

export function TechIcon({
  name,
  size = 14,
  className = "",
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const meta = getTechMeta(name);
  const Icon = meta.icon;

  return <Icon size={size} color={meta.color} className={className} />;
}