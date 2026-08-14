import { useEffect, useState } from 'react';
import {
  LuPlus,
  LuTrash2,
  LuSearch,
  LuSparkles,
  LuFolderPlus,
  LuX,
  LuLayers,
  LuSave,
  LuLoaderCircle,
} from 'react-icons/lu';
import { useToast } from '../../context/ToastContext';
import { fetchSkills, saveSkills } from '../../api/Actions';
import type { SkillCategory, SkillItem, SkillsSavePayload } from '../../types/Types';
import './Skills.css';

// Les éléments créés côté client portent un id temporaire préfixé par
// "temp-" tant qu'ils n'ont pas été enregistrés (pas encore de vrai UUID).
const isTempId = (id: string) => id.startsWith('temp-');

function toSkillsSavePayload(categories: SkillCategory[]): SkillsSavePayload {
  return {
    categories: categories.map((c) => ({
      ...(isTempId(c.id) ? {} : { id: c.id }),
      title: c.title,
      skills: c.skills.map((s) => ({
        ...(isTempId(s.id) ? {} : { id: s.id }),
        libelle: s.libelle,
        pourcentage: s.pourcentage,
      })),
    })),
  };
}

export default function Skills() {
  const toast = useToast();
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryTitle, setNewCategoryTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // --- Chargement initial depuis le backend ---
  useEffect(() => {
    let ignore = false;

    const loadSkills = async () => {
      setIsLoading(true);
      try {
        const data = await fetchSkills();
        if (!ignore) setCategories(data.categories ?? []);
      } catch (err) {
        if (!ignore) {
          const message = err instanceof Error ? err.message : 'Impossible de charger vos compétences.';
          toast.error('Erreur', message);
        }
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };

    loadSkills();
    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      id: `temp-cat-${Date.now()}`,
      title: newCategoryTitle.trim(),
      skills: [],
    };
    setCategories((prev) => [...prev, newCat]);
    setIsDirty(true);
    setNewCategoryTitle('');
    setIsCategoryModalOpen(false);
    toast.success('Catégorie ajoutée', `Catégorie "${newCat.title}" créée. Pensez à enregistrer.`);
  };

  const handleRemoveCategory = (catId: string, title: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== catId));
    setIsDirty(true);
    toast.info('Catégorie supprimée', `La catégorie "${title}" a été retirée. Pensez à enregistrer.`);
  };

  const handleUpdateCategoryTitle = (catId: string, title: string) => {
    setCategories((prev) => prev.map((c) => (c.id === catId ? { ...c, title } : c)));
    setIsDirty(true);
  };

  const handleAddSkill = (catId: string) => {
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id !== catId) return c;
        return {
          ...c,
          skills: [
            ...c.skills,
            { id: `temp-skill-${Date.now()}`, libelle: 'Nouvelle compétence', pourcentage: 70 },
          ],
        };
      })
    );
    setIsDirty(true);
    toast.info('Compétence ajoutée', 'Renseignez l’intitulé et le niveau.');
  };

  const handleUpdateSkill = (
    catId: string,
    skillId: string,
    field: keyof Omit<SkillItem, 'id'>,
    value: string | number
  ) => {
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id !== catId) return c;
        return {
          ...c,
          skills: c.skills.map((s) => (s.id === skillId ? { ...s, [field]: value } : s)),
        };
      })
    );
    setIsDirty(true);
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
    setIsDirty(true);
    toast.info('Compétence retirée', `"${name || 'Compétence'}" a été supprimée. Pensez à enregistrer.`);
  };

  // --- Sauvegarde vers le backend ---
  const handleSaveAll = async () => {
    if (!isDirty || isSaving) return;

    setIsSaving(true);
    try {
      const data = await saveSkills(toSkillsSavePayload(categories));
      setCategories(data.categories ?? []);
      setIsDirty(false);
      toast.success('Compétences enregistrées', 'Toutes vos modifications ont été sauvegardées.');
    } catch (err) {
      const message = err instanceof Error ? err.message : "Impossible d'enregistrer vos compétences.";
      toast.error('Erreur', message);
    } finally {
      setIsSaving(false);
    }
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
            className="btn btn-secondary"
            onClick={handleSaveAll}
            disabled={!isDirty || isSaving}
            title={isDirty ? 'Enregistrer les modifications' : 'Aucune modification à enregistrer'}
          >
            {isSaving ? (
              <LuLoaderCircle className="btn-icon spin" />
            ) : (
              <LuSave className="btn-icon" />
            )}
            {isSaving ? 'Enregistrement...' : 'Enregistrer'}
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setIsCategoryModalOpen(true)}
          >
            <LuFolderPlus className="btn-icon" /> Ajouter une catégorie
          </button>
        </div>
      </div>

      {/* État de chargement initial */}
      {isLoading ? (
        <div className="skills-empty-box">
          <LuLoaderCircle className="empty-icon spin" />
          <p>Chargement de vos compétences...</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="skills-empty-box">
          <LuSparkles className="empty-icon" />
          <p>Aucune catégorie de compétence pour le moment.</p>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => setIsCategoryModalOpen(true)}
          >
            <LuFolderPlus className="btn-icon" /> Créer une catégorie
          </button>
        </div>
      ) : (
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
                      onChange={(e) => handleUpdateCategoryTitle(category.id, e.target.value)}
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
      )}

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