// Configuration simple pour le site
// Valeurs par défaut issues des variables d'environnement
export const MAINTENANCE_FALLBACK: boolean = (import.meta.env.VITE_MAINTENANCE === 'true') || false;

import { getSettings } from './api/Actions';

export interface SiteSettings {
	modeMaintenance: boolean;
	notificationEmail: boolean;
}

// Récupère les paramètres depuis le backend via l'action `getSettings`.
// Retourne les valeurs ou les valeurs de repli (env) en cas d'erreur.
export async function loadSiteSettings(): Promise<SiteSettings> {
	try {
		const settings = await getSettings();
		if (!settings) {
			return {
				modeMaintenance: MAINTENANCE_FALLBACK,
				notificationEmail: true,
			};
		}

		return {
			modeMaintenance: !!settings.mode_maintenance,
			notificationEmail: !!settings.notification_email,
		};
	} catch (e) {
		// En cas d'erreur réseau ou autre, revenir aux valeurs par défaut
		// eslint-disable-next-line no-console
		console.error('Erreur lors du chargement des paramètres:', e);
		return {
			modeMaintenance: MAINTENANCE_FALLBACK,
			notificationEmail: true,
		};
	}
}
