import api from './AxiosConfig';
import type { 
  Settings, 
  AboutData, 
  CertificatesData,
  ProjectsData,
  SkillsData,
  ContactData,
} from '../types/Types';

/**
 * Fonction générique pour effectuer une requête GET de manière sécurisée.
 */
async function fetchData<T>(url: string): Promise<T | null> {
    const resp = await api.get<T>(url);
    return resp.data ?? null;
}

export async function getSettings(): Promise<Settings | null> {
  try {
    const resp = await api.get<{ settings: Settings | null }>('settings/public/');
    return resp.data?.settings ?? null;
  } catch {
    return null;
  }
}

export async function getAboutData(): Promise<AboutData | null> {
  return fetchData<AboutData>('frontend/about/');
}

/**
 * Récupère les compétences triées par pourcentage décroissant.
 */
export async function getSkills(): Promise<SkillsData | null> {
  return fetchData<SkillsData>('frontend/skills/');
}

/**
 * Récupère toutes les certifications actives (status=True).
 * Tri : important d'abord, puis par date décroissante.
 */
export async function getCertificates(): Promise<CertificatesData | null> {
  return fetchData<CertificatesData>('frontend/certificates/');
}

/**
 * Récupère uniquement les certifications mises en avant (important=True et status=True)
 * pour le composant d'accueil.
 */
export async function getCertificatesHighlights(): Promise<CertificatesData | null> {
  return fetchData<CertificatesData>('frontend/certificates/highlights/');
}

/**
 * Récupère tous les projets actifs (status=True).
 * Tri : important d'abord, puis par date décroissante.
 */
export async function getProjects(): Promise<ProjectsData | null> {
  return fetchData<ProjectsData>('frontend/projects/');
}

/**
 * Récupère uniquement les projets mis en avant (important=True et status=True)
 * pour le composant d'accueil.
 */
export async function getProjectsHighlights(): Promise<ProjectsData | null> {
  return fetchData<ProjectsData>('frontend/projects/highlights/');
}

/**
 * Récupère les informations de contact publiques.
 */
export async function getContact(): Promise<ContactData | null> {
  return fetchData<ContactData>('frontend/contact/');
}

/**
 * Envoie un message de contact via le formulaire.
 */
export async function sendContactMessage(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
  apiKey: string;
}): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const resp = await api.post<{ success: string }>('frontend/contact/send/', data);
    return { success: true, message: resp.data.success };
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || 'Erreur lors de l\'envoi du message';
    return { success: false, error: errorMessage };
  }
}

const apiService = {
  getSettings,
  getAboutData,
  getSkills,
  getCertificates,
  getCertificatesHighlights,
  getProjects,
  getProjectsHighlights,
  getContact,
  sendContactMessage,
};

export default apiService;