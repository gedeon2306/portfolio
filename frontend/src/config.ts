export const MAINTENANCE_FALLBACK: boolean = (import.meta.env.VITE_MAINTENANCE === 'true') || false;
export const LINKEDIN_FALLBACK: string = import.meta.env.VITE_LINKEDIN_URL || 'https://linkedin.com/';

import { getSettings } from './api/Actions';

export interface SiteSettings {
	modeMaintenance: boolean;
	linkedin: string | null;
}

export async function loadSiteSettings(): Promise<SiteSettings> {
	try {
		const settings = await getSettings();
		if (!settings) {
			return {
				modeMaintenance: MAINTENANCE_FALLBACK,
				linkedin: LINKEDIN_FALLBACK,
			};
		}

		return {
			modeMaintenance: !!settings.mode_maintenance,
			linkedin: settings.linkedin || LINKEDIN_FALLBACK,
		};
	} catch (e) {
		console.error('Erreur lors du chargement des paramètres:', e);
		return {
			modeMaintenance: MAINTENANCE_FALLBACK,
			linkedin: LINKEDIN_FALLBACK,
		};
	}
}