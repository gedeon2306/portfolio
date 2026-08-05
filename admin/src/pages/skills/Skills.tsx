import { useState } from 'react';
import {
  LuPlus,
  LuTrash2,
  LuSearch,
  LuSparkles,
  LuFolderPlus,
  LuX,
  LuLayers
} from 'react-icons/lu';
import { useToast } from '../../context/ToastContext';
import './Skills.css';

type SkillItem = {
  id: string;
  libelle: string;
  pourcentage: number;
};

type SkillCategory = {
  id: string;
  title: string;
  skills: SkillItem[];
};

const initialCategories: SkillCategory[] = [
  {
    id: 'cat-1',
    title: 'Frontend & UI Engineering',
    skills: [
      { id: 'skill-1', libelle: 'React 19 & Next.js', pourcentage: 92 },
      { id: 'skill-2', libelle: 'TypeScript / JavaScript (ESNext)', pourcentage: 90 },
      { id: 'skill-3', libelle: 'HTML5 / CSS3 / Animations', pourcentage: 95 },
      { id: 'skill-4', libelle: 'Vite & Webpack Tooling', pourcentage: 85 },
    ],
  },
  {
    id: 'cat-2',
    title: 'Backend & APIs',
    skills: [
      { id: 'skill-5', libelle: 'Python / Django REST Framework', pourcentage: 88 },
      { id: 'skill-6', libelle: 'Node.js & Express', pourcentage: 80 },
      { id: 'skill-7', libelle: 'Bases de données SQL (PostgreSQL)', pourcentage: 84 },
    ],
  },
  {
    id: 'cat-3',
    title: 'DevOps & Tooling',
    skills: [
      { id: 'skill-8', libelle: 'Git & GitHub Actions', pourcentage: 88 },
      { id: 'skill-9', libelle: 'Docker & CI/CD Pipelines', pourcentage: 75 },
    ],
  },
];

export default function Skills() {
  const toast = useToast();
  const [categories, setCategories] = useState<SkillCategory[]>(initialCategories);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryTitle, setNewCategoryTitle] = useState('');

  const getLevelLabel = (pct: number) => {
    if (pct >= 90) return 'Expert';
    if (pct >= 75) return 'Avancé';
    if (pct >= 50) return 'Intermédiaire';
    return 'Notions';
  };

  const handleAddCategory = () => {
    if (!newCategoryTitle.trim()) {
      toast.error('Erreur', 'Veuillez saisir un nom pour la catégorie.');
      return;
    }
    const newCat: SkillCategory = {
      id: `cat-${Date.now()}`,
      title: newCategoryTitle.trim(),
      skills: [],
    };
    setCategories((prev) => [...prev, newCat]);
    setNewCategoryTitle('');
    setIsCategoryModalOpen(false);
    toast.success('Catégorie ajoutée', `Catégorie "${newCat.title}" créée.`);
  };

  const handleRemoveCategory = (catId: string, title: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== catId));
    toast.info('Catégorie supprimée', `La catégorie "${title}" a été retirée.`);
  };

  const handleAddSkill = (catId: string) => {
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id !== catId) return c;
        return {
          ...c,
          skills: [...c.skills, { id: `skill-${Date.now()}`, libelle: 'Nouvelle compétence', pourcentage: 70 }],
        };
      })
    );
    toast.info('Compétence ajoutée', 'Renseignez l’intitulé et le niveau.');
  };

  const handleUpdateSkill = (catId: string, skillId: string, field: keyof Omit<SkillItem, 'id'>, value: string | number) => {
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id !== catId) return c;
        return {
          ...c,
          skills: c.skills.map((s) => (s.id === skillId ? { ...s, [field]: value } : s)),
        };
      })
    );
  };

  const handleRemoveSkill = (catId: string, skillId: string, name: string) => {
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id !== catId) return c;
        return {
          ...c,
          skills: c.skills.filter((s) => s.id !== skillId),
        };
      })
    );
    toast.info('Compétence retirée', `"${name || 'Compétence'}" a été supprimée.`);
  };

  return (
    <div className="skills-page">
      <div className="section-header">
        <div>
          <p className="section-eyebrow">Expertise & Maîtrise Technique</p>
          <h2>Gestion des Compétences</h2>
        </div>

        <div className="header-actions">
          <div className="search-input-wrap">
            <LuSearch className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher une techno..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setIsCategoryModalOpen(true)}
          >
            <LuFolderPlus className="btn-icon" /> Ajouter une catégorie
          </button>
        </div>
      </div>

      {/* Grille des Catégories */}
      <div className="skills-categories-grid">
        {categories.map((category) => {
          const filteredSkills = category.skills.filter((skill) =>
            skill.libelle.toLowerCase().includes(searchQuery.toLowerCase())
          );

          if (searchQuery && filteredSkills.length === 0) return null;

          return (
            <section key={category.id} className="panel-card category-card">
              <div className="panel-header category-header">
                <div className="category-title-wrap">
                  <LuLayers className="category-icon" />
                  <input
                    type="text"
                    value={category.title}
                    onChange={(e) =>
                      setCategories((prev) =>
                        prev.map((c) => (c.id === category.id ? { ...c, title: e.target.value } : c))
                      )
                    }
                    className="category-title-input"
                  />
                </div>

                <div className="category-actions">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleAddSkill(category.id)}
                  >
                    <LuPlus className="btn-icon" /> Compétence
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-icon-only"
                    onClick={() => handleRemoveCategory(category.id, category.title)}
                    title="Supprimer la catégorie"
                  >
                    <LuTrash2 />
                  </button>
                </div>
              </div>

              <div className="skills-list">
                {filteredSkills.length === 0 ? (
                  <div className="skills-empty-box">
                    <LuSparkles className="empty-icon" />
                    <p>Aucune compétence dans cette catégorie.</p>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => handleAddSkill(category.id)}
                    >
                      <LuPlus className="btn-icon" /> En ajouter une
                    </button>
                  </div>
                ) : (
                  filteredSkills.map((skill) => (
                    <div key={skill.id} className="skill-item-card">
                      <div className="skill-top-row">
                        <div className="skill-name-field">
                          <input
                            type="text"
                            value={skill.libelle}
                            onChange={(e) =>
                              handleUpdateSkill(category.id, skill.id, 'libelle', e.target.value)
                            }
                            placeholder="Nom de la techno..."
                          />
                        </div>

                        <div className="skill-badges-wrap">
                          <span className="badge badge-accent">{getLevelLabel(skill.pourcentage)}</span>
                          <span className="skill-pct-tag font-mono">{skill.pourcentage}%</span>
                          <button
                            type="button"
                            className="btn btn-ghost btn-icon-only delete-skill-btn"
                            onClick={() => handleRemoveSkill(category.id, skill.id, skill.libelle)}
                            title="Supprimer"
                          >
                            <LuTrash2 />
                          </button>
                        </div>
                      </div>

                      {/* Slider et barre de progression visuelle */}
                      <div className="skill-slider-row">
                        <div className="progress-bar-bg">
                          <div
                            className="progress-bar-fill"
                            style={{ width: `${skill.pourcentage}%` }}
                          />
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={skill.pourcentage}
                          onChange={(e) =>
                            handleUpdateSkill(category.id, skill.id, 'pourcentage', Number(e.target.value))
                          }
                          className="skill-range-input"
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          );
        })}
      </div>

      {/* Modal d'ajout de catégorie */}
      {isCategoryModalOpen && (
        <div className="modal-overlay" onClick={() => setIsCategoryModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Nouvelle Catégorie de Compétences</h3>
              <button
                type="button"
                className="btn btn-ghost btn-icon-only"
                onClick={() => setIsCategoryModalOpen(false)}
              >
                <LuX />
              </button>
            </div>
            <div className="modal-body">
              <div className="field">
                <label htmlFor="catTitle">Nom de la catégorie</label>
                <input
                  id="catTitle"
                  type="text"
                  placeholder="Ex: Mobile App Development, Design UI/UX, Cloud..."
                  value={newCategoryTitle}
                  onChange={(e) => setNewCategoryTitle(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsCategoryModalOpen(false)}
              >
                Annuler
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAddCategory}
              >
                Créer la catégorie
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
