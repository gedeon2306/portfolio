import { useScrollReveal } from "./useScrollReveal";
import { TechIcon, getTechMeta } from "../utils/techIcons";
import "../css/Skills.css";

interface SkillItem {
  name: string;
  level: number;
}

interface SkillGroup {
  title: string;
  skills: SkillItem[];
}

const SKILL_GROUPS: SkillGroup[] = [
  {
    title: "Frontend & UI Engineering",
    skills: [
      { name: "React (React 19)", level: 95 },
      { name: "TypeScript", level: 90 },
      { name: "Next.js", level: 92 },
      { name: "CSS / Design Systems", level: 94 },
      { name: "Vue.js", level: 82 },
    ],
  },
  {
    title: "Backend & Architectures",
    skills: [
      { name: "Node.js & Express", level: 90 },
      { name: "Python / Django", level: 86 },
      { name: "APIs RESTful & GraphQL", level: 88 },
      { name: "Laravel", level: 85 },
      { name: "Microservices", level: 78 },
    ],
  },
  {
    title: "Bases de Données & Stockage",
    skills: [
      { name: "PostgreSQL", level: 88 },
      { name: "MongoDB", level: 84 },
      { name: "MySQL", level: 80 },
      { name: "Redis", level: 76 },
      { name: "Oracle", level: 82 },
    ],
  },
  {
    title: "Mobile & Cross-Platform",
    skills: [
      { name: "React Native", level: 85 },
      { name: "PWA (Progressive Web Apps)", level: 88 },
      { name: "Flutter", level: 68 },
      { name: "Swift", level: 95 },
      { name: "Kotlin", level: 95 },
    ],
  },
  {
    title: "DevOps, Cloud & Outillage",
    skills: [
      { name: "Git & Workflow GitHub", level: 95 },
      { name: "Docker & Conteneurs", level: 82 },
      { name: "Bash", level: 90 },
      { name: "CI/CD & Déploiement", level: 78 },
      { name: "AWS & Vercel", level: 80 },
    ],
  },
  {
    title: "Language de programmation",
    skills: [
      { name: "Python", level: 95 },
      { name: "PHP", level: 82 },
      { name: "Java", level: 90 },
      { name: "C", level: 78 },
      { name: "JavaScript", level: 80 },
    ],
  },
];

export default function Skills() {
  const revealRef = useScrollReveal<HTMLDivElement>();

  return (
    <section id="competences" className="pf-skills">
      <div className="pf-container">
        <div className="pf-section-header">
          <span className="pf-eyebrow">Expertise & Maîtrise</span>
          <h2 className="pf-section-title">Compétences Techniques</h2>
          <p className="pf-section-subtitle">
            Un panorama des technologies et méthodologies que j'utilise au quotidien pour concevoir des logiciels durables et fiables.
          </p>
        </div>

        <div ref={revealRef} className="pf-skills-grid pf-reveal">
          {SKILL_GROUPS.map((group) => (
            <div key={group.title} className="pf-skills-card">
              <div className="pf-skills-card-header">
                <h3>{group.title}</h3>
              </div>

              <ul className="pf-skills-list">
                {group.skills.map((skill) => (
                  <li key={skill.name} className="pf-skill-item">
                    <div className="pf-skill-row">
                      <span className="pf-skill-name pf-tech-inline">
                        <TechIcon name={skill.name} size={13} />
                        <span>{getTechMeta(skill.name).label}</span>
                      </span>
                      <span className="pf-skill-level font-mono">{skill.level}%</span>
                    </div>
                    <div
                      className="pf-skill-bar"
                      role="progressbar"
                      aria-valuenow={skill.level}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={skill.name}
                    >
                      <div
                        className="pf-skill-bar-fill"
                        style={{ ["--pf-level" as string]: `${skill.level}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}