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

