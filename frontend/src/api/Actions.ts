import api from './AxiosConfig';
import type { Settings, AboutData } from '../types/Types';

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

export default {
	getSettings,
	getAboutData,
};
