import { useState } from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
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
    title: 'Frontend',
    skills: [
      { id: 'skill-1', libelle: 'React', pourcentage: 85 },
      { id: 'skill-2', libelle: 'HTML/CSS', pourcentage: 92 },
    ],
  },
  {
    id: 'cat-2',
    title: 'Backend',
    skills: [
      { id: 'skill-3', libelle: 'Django', pourcentage: 80 },
      { id: 'skill-4', libelle: 'Node.js', pourcentage: 74 },
    ],
  },
];

export default function Skills() {
  const [categories, setCategories] = useState<SkillCategory[]>(initialCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategoryTitle, setNewCategoryTitle] = useState('');

  const addCategory = () => {
    if (!newCategoryTitle.trim()) return;
    setCategories((prev) => [
      ...prev,
      { id: `cat-${Date.now()}`, title: newCategoryTitle.trim(), skills: [] },
    ]);
    setNewCategoryTitle('');
    setIsModalOpen(false);
  };

  const addSkill = (categoryId: string) => {
    setCategories((prev) => prev.map((category) => {
      if (category.id !== categoryId) return category;
      return {
        ...category,
        skills: [
          ...category.skills,
          { id: `skill-${Date.now()}`, libelle: '', pourcentage: 50 },
        ],
      };
    }));
  };

  const updateSkill = (categoryId: string, skillId: string, field: keyof Omit<SkillItem, 'id'>, value: string | number) => {
    setCategories((prev) => prev.map((category) => {
      if (category.id !== categoryId) return category;
      return {
        ...category,
        skills: category.skills.map((skill) => {
          if (skill.id !== skillId) return skill;
          if (field === 'libelle') {
            return { ...skill, libelle: String(value) };
          }
          return { ...skill, pourcentage: Number(value) };
        }),
      };
    }));
  };

  const removeSkill = (categoryId: string, skillId: string) => {
    setCategories((prev) => prev.map((category) => {
      if (category.id !== categoryId) return category;
      return {
        ...category,
        skills: category.skills.filter((skill) => skill.id !== skillId),
      };
    }));
  };

  const updateCategoryTitle = (categoryId: string, title: string) => {
    setCategories((prev) => prev.map((category) => {
      if (category.id !== categoryId) {
        return category;
      }
      return { ...category, title };
    }));
  };

  return (
    <div className="skills-page">
      <div className="section-header">
        <div>
          <p className="section-eyebrow">Compétences</p>
          <h2>Skills</h2>
        </div>
        <button className="btn btn-primary btn-icon-text" type="button" onClick={() => setIsModalOpen(true)}>
          <FiPlus className="btn-icon" /> Ajouter une catégorie
        </button>
      </div>

      <div className="skills-grid">
        {categories.map((category) => (
          <section key={category.id} className="skill-card">
            <div className="skill-card-header">
              <div>
                <p className="skill-card-title">{category.title || 'Nouvelle catégorie'}</p>
                <input
                  type="text"
                  value={category.title}
                  onChange={(e) => updateCategoryTitle(category.id, e.target.value)}
                  className="skill-title-input"
                  placeholder="Titre de la catégorie"
                />
              </div>
              <button className="btn btn-secondary btn-icon-text" type="button" onClick={() => addSkill(category.id)}>
                <FiPlus className="btn-icon" /> Ajouter
              </button>
            </div>

            <div className="skills-list">
              {category.skills.length === 0 ? (
                <p className="skills-empty">Aucune compétence. Ajoutez en une.</p>
              ) : (
                category.skills.map((skill) => (
                  <div key={skill.id} className="skill-row">
                    <div className="skill-inputs">
                      <label className="field">
                        <span>Nom</span>
                        <input
                          value={skill.libelle}
                          onChange={(e) => updateSkill(category.id, skill.id, 'libelle', e.target.value)}
                          placeholder="Nom de la compétence"
                        />
                      </label>
                      <label className="field range-field">
                        <span>Pourcentage</span>
                        <div className="range-row">
                          <input
                            type="range"
                            min={0}
                            max={100}
                            value={skill.pourcentage}
                            onChange={(e) => updateSkill(category.id, skill.id, 'pourcentage', Number(e.target.value))}
                          />
                          <output>{skill.pourcentage}%</output>
                        </div>
                      </label>
                    </div>
                    <button type="button" className="btn btn-danger btn-icon-only" onClick={() => removeSkill(category.id, skill.id)}>
                      <FiTrash2 />
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal-overlay" aria-modal="true" role="dialog">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Ajouter une catégorie</h3>
            </div>
            <div className="modal-body">
              <label className="field">
                <span>Titre de la catégorie</span>
                <input
                  value={newCategoryTitle}
                  onChange={(e) => setNewCategoryTitle(e.target.value)}
                  placeholder="Frontend, Backend, Design..."
                />
              </label>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                Annuler
              </button>
              <button type="button" className="btn btn-primary btn-icon-text" onClick={addCategory}>
                <FiPlus className="btn-icon" /> Ajouter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
