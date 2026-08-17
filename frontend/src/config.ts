// Configuration simple pour le site
// Activer le mode maintenance via la variable d'environnement VITE_MAINTENANCE=true
export const MAINTENANCE: boolean = (import.meta.env.VITE_MAINTENANCE === 'true') || false;
