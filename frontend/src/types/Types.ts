// Types de base & utilitaires
export type DateString = string; // Format attendu: DD/MM/YYYY

interface BaseEntity {
  id: string;
  categorie: string;
  titre: string;
  description: string;
  image: string | null;
  url: string | null;
  important: boolean;
}

// Settings
export interface Settings {
  id?: string;
  titre_app?: string;
  mode_maintenance: boolean;
  linkedin?: string | null;
}

// About / Profil
export interface AboutLanguage {
  id: string;
  langue: string;
  niveau: string;
}

export interface AboutData {
  nom: string;
  prenom: string;
  description1: string;
  description2: string;
  photo: string | null;
  cv: string | null;
  langues: AboutLanguage[];
}

// Compétences
export interface Skill {
  id: string;
  libelle: string;
  pourcentage: number;
}

export interface SkillGroup {
  categorie: string;
  skills: Skill[];
}

export interface SkillsData {
  competences: SkillGroup[];
}

// Certifications
export interface Certificate extends BaseEntity {
  organisme: string;
  date: DateString;
  credentialId: string;
}

export interface CertificatesData {
  certificats: Certificate[];
}

// Projets
export interface Project extends BaseEntity {
  codeSource: string | null;
  date: DateString;
  technologies: string[];
}

export interface ProjectsData {
  projets: Project[];
}

// Contact
export interface ContactData {
  profession: string;
  email: string;
  localisation: string;
  telephone: string;
  github: string | null;
  linkedin: string | null;
  instagram: string | null;
  twitter_x: string | null;
  tik_tok: string | null;
}