import React, { useEffect, useRef, useState } from 'react';
import {
  LuPlus,
  LuTrash2,
  LuSave,
  LuUpload,
  LuUser,
  LuFileText,
  LuShare2,
  LuLanguages,
  LuGithub,
  LuLinkedin,
  LuInstagram,
  LuTwitter
} from 'react-icons/lu';
import { useToast } from '../../context/ToastContext';
import { fetchMyInfo, saveMyInfo } from '../../api/Actions';
import type { LangueItem, MyInfoTextFields, NiveauChoice } from '../../types/Types';
import './MyInfo.css';

type MyInfoForm = MyInfoTextFields & {
  image: string; // URL (existante) ou aperçu local (dataURL) affiché à l'écran
  cv: string;    // nom de fichier affiché (existant ou nouvellement choisi)
};

export const NIVEAUX_OPTIONS: { value: NiveauChoice; label: string }[] = [
  { value: 'A1', label: 'A1 - Élémentaire (Débutant)' },
  { value: 'A2', label: 'A2 - Élémentaire (Usuel)' },
  { value: 'B1', label: 'B1 - Indépendant (Intermédiaire)' },
  { value: 'B2', label: 'B2 - Indépendant (Avancé)' },
  { value: 'C1', label: 'C1 - Expérimenté (Autonome)' },
  { value: 'C2', label: 'C2 - Expérimenté (Maternelle / Bilingue)' },
];

export const LANGUES_PRESETS = [
  'Français',
  'Anglais',
  'Espagnol',
  'Allemand',
  'Italien',
  'Arabe',
  'Chinois',
  'Japonais',
  'Portugais',
  'Russe',
  'Autre...',
];

const emptyForm: MyInfoForm = {
  nom: '',
  prenom: '',
  email: '',
  telephone: '',
  localisation: '',
  profession: '',
  description1: '',
  description2: '',
  image: '',
  cv: '',
  formation: '',
  experience: '',
  passions: '',
  github: '',
  linkedin: '',
  instagram: '',
  twitter_x: '',
  tik_tok: '',
};

function extractFileName(url: string): string {
  try {
    return decodeURIComponent(url.split('/').pop() || url);
  } catch {
    return url;
  }
}

export default function MyInfo() {
  const toast = useToast();
  const [form, setForm] = useState<MyInfoForm>(emptyForm);
  const [languages, setLanguages] = useState<LangueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'bio' | 'social' | 'languages'>('general');

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [removeImageFlag, setRemoveImageFlag] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cvInputRef = useRef<HTMLInputElement | null>(null);

  // Chargement initial des informations existantes
  useEffect(() => {
    let cancelled = false;

    async function loadMyInfo() {
      setLoading(true);
      try {
        const data = await fetchMyInfo();
        if (cancelled) return;

        if (data.info) {
          const { image, cv, ...rest } = data.info;
          setForm({
            ...rest,
            github: rest.github ?? '',
            linkedin: rest.linkedin ?? '',
            instagram: rest.instagram ?? '',
            twitter_x: rest.twitter_x ?? '',
            tik_tok: rest.tik_tok ?? '',
            image: image ?? '',
            cv: cv ? extractFileName(cv) : '',
          });
        }
        setLanguages(data.langues);
      } catch (err) {
        if (!cancelled) {
          toast.error('Erreur', err instanceof Error ? err.message : 'Impossible de charger vos informations.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadMyInfo();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value } as MyInfoForm));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setRemoveImageFlag(false);
    const reader = new FileReader();
    reader.onload = () => {
      setForm((s) => ({ ...s, image: reader.result as string }));
      toast.success('Photo mise à jour', 'Le nouvel avatar est prêt à être sauvegardé.');
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setForm((s) => ({ ...s, image: '' }));
    setImageFile(null);
    setRemoveImageFlag(true);
  };

  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCvFile(file);
    setForm((s) => ({ ...s, cv: file.name }));
    toast.success('CV sélectionné', `Fichier "${file.name}" attaché.`);
  };

  const handleAddLanguage = () => {
    const newId = `lang-${Date.now()}`;
    setLanguages((prev) => [...prev, { id: newId, langue: 'Anglais', niveau: 'B2' }]);
    toast.info('Nouvelle langue', 'Sélectionnez la langue et son niveau de référence CECRL.');
  };

  const handleRemoveLanguage = (id: string) => {
    setLanguages((prev) => prev.filter((item) => item.id !== id));
    toast.info('Langue retirée', 'La compétence a été supprimée de la liste.');
  };

  const handleLanguageChange = (id: string, field: keyof Omit<LangueItem, 'id'>, value: string) => {
    setLanguages((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const { image, cv, ...textFields } = form;

      const response = await saveMyInfo({
        fields: textFields,
        imageFile,
        removeImage: removeImageFlag,
        cvFile,
        langues: languages.map(({ id, langue, niveau }) => ({ id, langue, niveau })),
      });

      if (response.info) {
        const { image: newImage, cv: newCv, ...rest } = response.info;
        setForm({
          ...rest,
          github: rest.github ?? '',
          linkedin: rest.linkedin ?? '',
          instagram: rest.instagram ?? '',
          twitter_x: rest.twitter_x ?? '',
          tik_tok: rest.tik_tok ?? '',
          image: newImage ?? '',
          cv: newCv ? extractFileName(newCv) : '',
        });
      }
      setLanguages(response.langues);
      setImageFile(null);
      setCvFile(null);
      setRemoveImageFlag(false);

      toast.success('Modifications enregistrées !', 'Vos informations de profil sont désormais à jour.');
    } catch (err) {
      toast.error('Erreur', err instanceof Error ? err.message : "Impossible d'enregistrer le profil.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="myinfo-page">
        <div className="section-header">
          <div>
            <p className="section-eyebrow">Profil public & coordonnées</p>
            <h2>Mes Informations</h2>
          </div>
        </div>
        <p>Chargement de vos informations...</p>
      </div>
    );
  }

  return (
    <div className="myinfo-page">
      {/* Sub-header de navigation interne */}
      <div className="section-header">
        <div>
          <p className="section-eyebrow">Profil public & coordonnées</p>
          <h2>Mes Informations</h2>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => handleSubmit()}
          disabled={saving}
        >
          {saving ? <span className="spinner" /> : <LuSave className="btn-icon" />}
          <span>{saving ? 'Enregistrement…' : 'Enregistrer les modifications'}</span>
        </button>
      </div>

      {/* Onglets de sections */}
      <div className="myinfo-tabs">
        <button
          type="button"
          className={`tab-btn ${activeTab === 'general' ? 'active' : ''}`}
          onClick={() => setActiveTab('general')}
        >
          <LuUser /> Identité Générale
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'bio' ? 'active' : ''}`}
          onClick={() => setActiveTab('bio')}
        >
          <LuFileText /> Bio, CV & Expériences
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'social' ? 'active' : ''}`}
          onClick={() => setActiveTab('social')}
        >
          <LuShare2 /> Réseaux Sociaux
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'languages' ? 'active' : ''}`}
          onClick={() => setActiveTab('languages')}
        >
          <LuLanguages /> Langues & Niveaux
        </button>
      </div>

      <form className="myinfo-form" onSubmit={handleSubmit}>
        {/* TAB 1: IDENTITE GENERALE */}
        {activeTab === 'general' && (
          <section className="panel-card tab-content">
            <div className="panel-header">
              <div>
                <p className="panel-eyebrow">Informations personnelles</p>
                <h3>Photo de profil & Identité</h3>
              </div>
            </div>

            <div className="profile-identity-grid">
              {/* Uploader Avatar */}
              <div className="avatar-uploader-card">
                <span>Photo de profil</span>
                <div
                  className="avatar-preview-box"
                  onClick={() => fileInputRef.current?.click()}
                  title="Cliquer pour changer la photo"
                >
                  {form.image ? (
                    <img src={form.image} alt="Avatar" />
                  ) : (
                    <div className="avatar-placeholder-content">
                      <LuUpload className="upload-icon" />
                      <p>Glisser ou cliquer</p>
                      <span>JPG, PNG max 5Mo</span>
                    </div>
                  )}
                </div>
                {form.image && (
                  <button
                    type="button"
                    className="btn btn-ghost btn-xs"
                    onClick={handleRemovePhoto}
                  >
                    Supprimer la photo
                  </button>
                )}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handlePhotoChange}
                />
              </div>

              {/* Champs texte */}
              <div className="identity-fields-grid">
                <div className="field">
                  <label htmlFor="prenom">Prénom</label>
                  <input id="prenom" name="prenom" value={form.prenom} onChange={handleChange} />
                </div>
                <div className="field">
                  <label htmlFor="nom">Nom</label>
                  <input id="nom" name="nom" value={form.nom} onChange={handleChange} />
                </div>
                <div className="field">
                  <label htmlFor="profession">Profession / Titre principal</label>
                  <input id="profession" name="profession" value={form.profession} onChange={handleChange} />
                </div>
                <div className="field">
                  <label htmlFor="localisation">Localisation</label>
                  <input id="localisation" name="localisation" value={form.localisation} onChange={handleChange} />
                </div>
                <div className="field">
                  <label htmlFor="email">Adresse Email Pro</label>
                  <input id="email" name="email" type="email" value={form.email} onChange={handleChange} />
                </div>
                <div className="field">
                  <label htmlFor="telephone">Téléphone</label>
                  <input id="telephone" name="telephone" value={form.telephone} onChange={handleChange} />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* TAB 2: BIO, CV & EXPERIENCES */}
        {activeTab === 'bio' && (
          <section className="panel-card tab-content">
            <div className="panel-header">
              <div>
                <p className="panel-eyebrow">Présentation</p>
                <h3>Biographie & Fichier CV</h3>
              </div>
            </div>

            <div className="bio-cv-grid">
              <div className="cv-upload-box">
                <p className="field-title">Fichier CV téléchargeable</p>
                <div className="cv-dropzone" onClick={() => cvInputRef.current?.click()}>
                  <LuFileText className="cv-icon" />
                  <div className="cv-info">
                    <p className="cv-filename">{form.cv || 'Aucun CV attaché'}</p>
                    <span className="cv-sub">PDF, DOCX acceptés (max 10Mo)</span>
                  </div>
                  <button type="button" className="btn btn-secondary btn-sm">
                    {form.cv ? 'Remplacer' : 'Choisir'}
                  </button>
                </div>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  ref={cvInputRef}
                  style={{ display: 'none' }}
                  onChange={handleCvChange}
                />
              </div>

              <div className="field">
                <label htmlFor="formation">Formation principale</label>
                <input id="formation" name="formation" value={form.formation} onChange={handleChange} />
              </div>
              <div className="field">
                <label htmlFor="experience">Années d’expérience</label>
                <input id="experience" name="experience" value={form.experience} onChange={handleChange} />
              </div>
              <div className="field">
                <label htmlFor="passions">Centre d'intérêts / Passions</label>
                <input id="passions" name="passions" value={form.passions} onChange={handleChange} />
              </div>

              <div className="field field-full">
                <div className="label-counter-row">
                  <label htmlFor="description1">Description principale (Accroche)</label>
                  <span className="char-count">{form.description1.length}/300</span>
                </div>
                <textarea
                  id="description1"
                  name="description1"
                  value={form.description1}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              <div className="field field-full">
                <div className="label-counter-row">
                  <label htmlFor="description2">Description complémentaire (Détails techniques)</label>
                  <span className="char-count">{form.description2.length}/500</span>
                </div>
                <textarea
                  id="description2"
                  name="description2"
                  value={form.description2}
                  onChange={handleChange}
                  rows={4}
                />
              </div>
            </div>
          </section>
        )}

        {/* TAB 3: RESEAUX SOCIAUX */}
        {activeTab === 'social' && (
          <section className="panel-card tab-content">
            <div className="panel-header">
              <div>
                <p className="panel-eyebrow">Liens externes</p>
                <h3>Réseaux Sociaux & Dépôts</h3>
              </div>
            </div>

            <div className="social-fields-grid">
              <div className="field">
                <label htmlFor="github">GitHub</label>
                <div className="input-icon-wrap">
                  <LuGithub className="input-icon" />
                  <input id="github" name="github" value={form.github} onChange={handleChange} />
                </div>
              </div>

              <div className="field">
                <label htmlFor="linkedin">LinkedIn</label>
                <div className="input-icon-wrap">
                  <LuLinkedin className="input-icon" />
                  <input id="linkedin" name="linkedin" value={form.linkedin} onChange={handleChange} />
                </div>
              </div>

              <div className="field">
                <label htmlFor="twitter_x">Twitter / X</label>
                <div className="input-icon-wrap">
                  <LuTwitter className="input-icon" />
                  <input id="twitter_x" name="twitter_x" value={form.twitter_x} onChange={handleChange} />
                </div>
              </div>

              <div className="field">
                <label htmlFor="instagram">Instagram</label>
                <div className="input-icon-wrap">
                  <LuInstagram className="input-icon" />
                  <input id="instagram" name="instagram" value={form.instagram} onChange={handleChange} />
                </div>
              </div>

              <div className="field">
                <label htmlFor="tik_tok">TikTok</label>
                <div className="input-icon-wrap">
                  <LuShare2 className="input-icon" />
                  <input id="tik_tok" name="tik_tok" value={form.tik_tok} onChange={handleChange} />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* TAB 4: LANGUES (Basé sur le modèle Django `Langues`) */}
        {activeTab === 'languages' && (
          <section className="panel-card tab-content">
            <div className="panel-header">
              <div>
                <p className="panel-eyebrow">Modèle Django Langues</p>
                <h3>Langues & Niveaux (CECRL Choices A1 → C2)</h3>
              </div>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleAddLanguage}
              >
                <LuPlus className="btn-icon" /> Ajouter une langue
              </button>
            </div>

            <div className="languages-list">
              {languages.length === 0 ? (
                <p className="text-secondary">Aucune langue enregistrée pour le moment.</p>
              ) : (
                languages.map((item) => (
                  <div key={item.id} className="language-item-row">
                    {/* Sélection de la langue via liste déroulante */}
                    <div className="field flex-1">
                      <label>Langue</label>
                      <select
                        value={LANGUES_PRESETS.includes(item.langue) ? item.langue : 'Autre...'}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val !== 'Autre...') {
                            handleLanguageChange(item.id, 'langue', val);
                          }
                        }}
                        className="field-select"
                      >
                        {LANGUES_PRESETS.map((lang) => (
                          <option key={lang} value={lang}>{lang}</option>
                        ))}
                      </select>

                      {(!LANGUES_PRESETS.includes(item.langue) || item.langue === 'Autre...') && (
                        <input
                          type="text"
                          placeholder="Précisez la langue..."
                          value={item.langue === 'Autre...' ? '' : item.langue}
                          onChange={(e) => handleLanguageChange(item.id, 'langue', e.target.value)}
                          style={{ marginTop: '6px' }}
                        />
                      )}
                    </div>

                    {/* Sélection du Niveau (Django NIVEAUX_CHOICES A1, A2, B1, B2, C1, C2) */}
                    <div className="field flex-1">
                      <label>Niveau (Django Choices)</label>
                      <select
                        value={item.niveau}
                        onChange={(e) => handleLanguageChange(item.id, 'niveau', e.target.value as NiveauChoice)}
                        className="field-select"
                      >
                        {NIVEAUX_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="button"
                      className="btn btn-ghost btn-icon-only remove-lang-btn"
                      onClick={() => handleRemoveLanguage(item.id)}
                      title="Supprimer la langue"
                    >
                      <LuTrash2 />
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>
        )}
      </form>
    </div>
  );
}