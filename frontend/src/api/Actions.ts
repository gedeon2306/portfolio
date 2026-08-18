import api from './AxiosConfig';
import type { Settings, AboutData, CertificatesData } from '../types/Types';

export async function getSettings(): Promise<Settings | null> {
	const resp = await api.get('settings/public/');
	// L'API renvoie { settings: ... } ou { settings: null }
	return resp.data?.settings ?? null;
}

export async function getAboutData(): Promise<AboutData | null> {
	try {
		const resp = await api.get('frontend/about/');
		return resp.data ?? null;
	} catch (error) {
		console.error('Erreur lors de la récupération des données About:', error);
		return null;
	}
}

/**
 * Récupère les compétences triées par pourcentage décroissant
 */
export async function getSkills() {
  try {
    const resp = await api.get('frontend/skills/');
    return resp.data ?? null;
  } catch (error) {
    console.error('Erreur lors de la récupération des compétences:', error);
    return null;
  }
}
/**
 * Récupère toutes les certifications actives (status=True)
 * Tri : important d'abord, puis par date décroissante
 */
export async function getCertificates(): Promise<CertificatesData | null> {
  try {
    const resp = await api.get('frontend/certificates/');
    return resp.data ?? null;
  } catch (error) {
    console.error('Erreur lors de la récupération des certifications:', error);
    return null;
  }
}

/**
 * Récupère uniquement les certifications mises en avant (important=True et status=True)
 * pour le composant d'accueil
 */
export async function getCertificatesHighlights(): Promise<CertificatesData | null> {
  try {
    const resp = await api.get('frontend/certificates/highlights/');
    return resp.data ?? null;
  } catch (error) {
    console.error('Erreur lors de la récupération des certifications en avant:', error);
    return null;
  }
}

export default {
  getSettings,
  getAboutData,
  getSkills,
  getCertificates,
  getCertificatesHighlights,
};