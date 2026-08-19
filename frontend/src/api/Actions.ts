import api from './AxiosConfig';
import type { 
  Settings, 
  AboutData, 
  CertificatesData,
  ProjectsData,
  SkillsData,
} from '../types/Types';

/**
 * Fonction générique pour effectuer une requête GET de manière sécurisée.
 */
async function fetchData<T>(url: string): Promise<T | null> {
  try {
    const resp = await api.get<T>(url);
    return resp.data ?? null;
  } catch {
    return null;
  }
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

const apiService = {
  getSettings,
  getAboutData,
  getSkills,
  getCertificates,
  getCertificatesHighlights,
  getProjects,
  getProjectsHighlights,
};

export default apiService;