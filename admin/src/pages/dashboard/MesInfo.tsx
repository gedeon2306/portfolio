import React, { useState } from 'react';
import './MesInfo.css';

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value } as MyInfoForm));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      // Ici on simule l'enregistrement: remplacer par appel API réel plus tard
      await new Promise((r) => setTimeout(r, 700));
      // eslint-disable-next-line no-console
      console.log('Saved MyInfo (test):', form);
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
              {saving ? 'Enregistrement…' : 'Enregistrer'}
            </button>
          </div>
        </div>

        <form className="mesinfo-form" onSubmit={handleSubmit}>
          <div className="form-grid">
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
            <label className="field">
              <span>Localisation</span>
              <input name="localisation" value={form.localisation} onChange={handleChange} />
            </label>
            <label className="field">
              <span>Profession</span>
              <input name="profession" value={form.profession} onChange={handleChange} />
            </label>
            <label className="field field-full">
              <span>Description 1</span>
              <textarea name="description1" value={form.description1} onChange={handleChange} />
            </label>
            <label className="field field-full">
              <span>Description 2</span>
              <textarea name="description2" value={form.description2} onChange={handleChange} />
            </label>
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
            <label className="field">
              <span>Image (URL / base64)</span>
              <input name="image" value={form.image} onChange={handleChange} />
            </label>
            <label className="field">
              <span>CV (URL / base64)</span>
              <input name="cv" value={form.cv} onChange={handleChange} />
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
          </div>
        </form>
      </div>
    </div>
  );
}
