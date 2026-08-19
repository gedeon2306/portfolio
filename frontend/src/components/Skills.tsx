import { useScrollReveal } from "./useScrollReveal";
import { TechIcon, getTechMeta } from "../utils/techIcons";
import { useQuery } from "@tanstack/react-query";
import { getSkills } from "../api/Actions";
import type { SkillGroup } from "../types/Types";
import "../css/Skills.css";

export default function Skills() {
  const revealRef = useScrollReveal<HTMLDivElement>();

  const { data: skillsData, isLoading, error } = useQuery({
    queryKey: ['skills'],
    queryFn: getSkills,
  });

  if (error) {
    console.error("Erreur lors du chargement des compétences:", error);
  }

  const skillGroups: SkillGroup[] = skillsData?.competences || [];

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
          {isLoading && (
            <div style={{ textAlign: 'center', padding: '40px', gridColumn: '1 / -1' }}>
              <p>Chargement des compétences...</p>
            </div>
          )}

          {!isLoading && (error || skillGroups.length === 0) && (
            <div style={{ textAlign: 'center', padding: '40px', gridColumn: '1 / -1' }}>
              <p>
                {error
                  ? "Impossible de charger les compétences pour le moment."
                  : "Aucune compétence disponible."}
              </p>
            </div>
          )}

          {!isLoading && !error && skillGroups.map((group) => (
            <div key={group.categorie} className="pf-skills-card">
              <div className="pf-skills-card-header">
                <h3>{group.categorie}</h3>
              </div>

              <ul className="pf-skills-list">
                {group.skills.map((skill) => (
                  <li key={skill.id} className="pf-skill-item">
                    <div className="pf-skill-row">
                      <span className="pf-skill-name pf-tech-inline">
                        <TechIcon name={skill.libelle} size={13} />
                        <span>{getTechMeta(skill.libelle).label}</span>
                      </span>
                      <span className="pf-skill-level font-mono">{skill.pourcentage}%</span>
                    </div>
                    <div
                      className="pf-skill-bar"
                      role="progressbar"
                      aria-valuenow={skill.pourcentage}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={skill.libelle}
                    >
                      <div
                        className="pf-skill-bar-fill"
                        style={{ ["--pf-level" as string]: `${skill.pourcentage}%` }}
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