// types/Types.ts - Ajouter les interfaces pour les certifications

export interface Settings {
  id?: string;
  titre_app?: string;
  mode_maintenance: boolean;
  notification_email: boolean;
}

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

// Types pour les compétences
export interface SkillGroup {
  categorie: string;
  skills: {
    id: string;
    libelle: string;
    pourcentage: number;
  }[];
}

export interface SkillsData {
  competences: SkillGroup[];
}

// Types pour les certifications
export interface Certificate {
  id: string;
  categorie: string;
  titre: string;
  description: string;
  organisme: string;
  date: string; // Format: DD/MM/YYYY
  credentialId: string;
  url: string | null;
  image: string | null;
  important: boolean;
}

export interface CertificatesData {
  certificats: Certificate[];
}

// Types pour les projets
export interface Project {
  id: string;
  categorie: string;
  titre: string;
  description: string;
  image: string | null;
  url: string | null;
  codeSource: string | null;
  important: boolean;
  date: string; // Format: DD/MM/YYYY
  technologies: string[];
}

export interface ProjectsData {
  projets: Project[];
}