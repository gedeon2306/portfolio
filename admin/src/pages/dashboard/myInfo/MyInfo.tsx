import React, { useRef, useState } from 'react';
import { FiPlus, FiTrash2, FiSave } from 'react-icons/fi';
import { Spinner } from '../../../components/Spinner';
import './MyInfo.css';

type MyInfoForm = {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  localisation: string;
  profession: string;
  description1: string;
  description2: string;
  image: string;
  cv: string;
  formation: string;
  experience: string;
  passions: string;
  github: string;
  linkedin: string;
  instagram: string;
  twitter_x: string;
  tik_tok: string;
};

type LanguageItem = {
  id: string;
  langue: string;
  niveau: string;
};

const initialData: MyInfoForm = {
  nom: 'Dupont',
  prenom: 'Jean',
  email: 'jean.dupont@example.com',
  telephone: '+33 6 12 34 56 78',
  localisation: 'Paris, France',
  profession: 'Développeur Fullstack',
  description1: 'Développeur passionné par le web et les interfaces élégantes.',
  description2: 'Expérience sur React, Django et déploiement cloud.',
  image: '',
  cv: '',
  formation: 'Master Informatique',
  experience: '5 ans',
  passions: 'Musique, photographie',
  github: 'https://github.com/jeandupont',
  linkedin: 'https://www.linkedin.com/in/jeandupont',
  instagram: '',
  twitter_x: '',
  tik_tok: '',
};

export default function MesInfo() {
  const [form, setForm] = useState<MyInfoForm>(initialData);
  const [saving, setSaving] = useState(false);
  const [languages, setLanguages] = useState<LanguageItem[]>([
    { id: 'lang-1', langue: 'Français', niveau: 'C2' },
    { id: 'lang-2', langue: 'Anglais', niveau: 'B2' },
  ]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cvInputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value } as MyInfoForm));
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((s) => ({ ...s, image: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleCvClick = () => {
    cvInputRef.current?.click();
  };

  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((s) => ({ ...s, cv: file.name }));
  };

  const handleAddLanguage = () => {
    setLanguages((prev) => [
      ...prev,
      { id: `lang-${Date.now()}`, langue: '', niveau: '' },
    ]);
  };

  const handleRemoveLanguage = (id: string) => {
    setLanguages((prev) => prev.filter((item) => item.id !== id));
  };

  const handleLanguageChange = (id: string, field: keyof Omit<LanguageItem, 'id'>, value: string) => {
    setLanguages((prev) => prev.map((item) => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      // Ici on simule l'enregistrement: remplacer par appel API réel plus tard
      await new Promise((r) => setTimeout(r, 700));
      // eslint-disable-next-line no-console
      console.log('Saved MyInfo (test):', { ...form, languages });
      alert('Informations enregistrées (test)');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mesinfo-page">
      <div className="panel-card">
        <div className="panel-header">
          <div>
            <p className="panel-eyebrow">Profil</p>
            <h3>Mes infos</h3>
          </div>

          <div className="panel-actions">
            <button type="button" className="btn btn-primary" onClick={() => handleSubmit()} disabled={saving}>
              {saving ? <Spinner /> : <FiSave className="btn-icon" />}
              {saving ? 'Enregistrement…' : 'Enregistrer'}
            </button>
          </div>
        </div>

        <form className="mesinfo-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="profile-header">
              <div className="avatar-field">
                <span>Photo</span>
                <button type="button" className="avatar-uploader" onClick={handlePhotoClick}>
                  {form.image ? (
                    <img src={form.image} alt="Photo de profil" />
                  ) : (
                    <div className="avatar-placeholder">
                      <span>Glisser ici</span>
                      <small>ou cliquer pour ajouter</small>
                    </div>
                  )}
                </button>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="avatar-input"
                  onChange={handlePhotoChange}
                />
              </div>

              <div className="contact-fields">
                <label className="field">
                  <span>Nom</span>
                  <input name="nom" value={form.nom} onChange={handleChange} />
                </label>
                <label className="field">
                  <span>Prénom</span>
                  <input name="prenom" value={form.prenom} onChange={handleChange} />
                </label>
                <label className="field">
                  <span>Email</span>
                  <input name="email" value={form.email} onChange={handleChange} />
                </label>
                <label className="field">
                  <span>Téléphone</span>
                  <input name="telephone" value={form.telephone} onChange={handleChange} />
                </label>
              </div>
            </div>

            <div className="cv-section">
              <div className="cv-box">
                <span>CV</span>
                <button type="button" className="cv-uploader" onClick={handleCvClick}>
                  {form.cv ? form.cv : 'Ajouter un CV'}
                </button>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  ref={cvInputRef}
                  className="cv-input"
                  onChange={handleCvChange}
                />
              </div>

              <div className="cv-info-fields">
                <label className="field">
                  <span>Formation</span>
                  <input name="formation" value={form.formation} onChange={handleChange} />
                </label>
                <label className="field">
                  <span>Expérience</span>
                  <input name="experience" value={form.experience} onChange={handleChange} />
                </label>
                <label className="field">
                  <span>Passions</span>
                  <input name="passions" value={form.passions} onChange={handleChange} />
                </label>
              </div>
            </div>

            <label className="field field-full">
              <span>Description 1</span>
              <textarea name="description1" value={form.description1} onChange={handleChange} />
            </label>
            <label className="field field-full">
              <span>Description 2</span>
              <textarea name="description2" value={form.description2} onChange={handleChange} />
            </label>
            <label className="field">
              <span>GitHub</span>
              <input name="github" value={form.github} onChange={handleChange} />
            </label>
            <label className="field">
              <span>LinkedIn</span>
              <input name="linkedin" value={form.linkedin} onChange={handleChange} />
            </label>
            <label className="field">
              <span>Instagram</span>
              <input name="instagram" value={form.instagram} onChange={handleChange} />
            </label>
            <label className="field">
              <span>Twitter / X</span>
              <input name="twitter_x" value={form.twitter_x} onChange={handleChange} />
            </label>
            <label className="field">
              <span>TikTok</span>
              <input name="tik_tok" value={form.tik_tok} onChange={handleChange} />
            </label>

            <div className="languages-section">
              <div className="languages-header">
                <div>
                  <p className="panel-eyebrow">Langues</p>
                  <h4>Compétences linguistiques</h4>
                </div>
                <button type="button" className="btn btn-secondary btn-icon-text" onClick={handleAddLanguage}>
                  <FiPlus className="btn-icon" /> Ajouter
                </button>
              </div>

              <div className="languages-list">
                {languages.map((language) => (
                  <div key={language.id} className="language-row">
                    <div className="language-fields">
                      <label className="field">
                        <span>Langue</span>
                        <input
                          value={language.langue}
                          onChange={(e) => handleLanguageChange(language.id, 'langue', e.target.value)}
                        />
                      </label>
                      <label className="field">
                        <span>Niveau</span>
                        <input
                          value={language.niveau}
                          onChange={(e) => handleLanguageChange(language.id, 'niveau', e.target.value)}
                        />
                      </label>
                    </div>
                    <button
                      type="button"
                      className="btn btn-danger btn-icon-only"
                      onClick={() => handleRemoveLanguage(language.id)}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
