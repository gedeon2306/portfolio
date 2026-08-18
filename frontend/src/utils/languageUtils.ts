// languageUtils.ts

/**
 * Mapping des niveaux de langue CECRL vers leurs libellés complets
 */
const LANGUAGE_LEVEL_MAPPING: Record<string, string> = {
  'A1': 'Débutant (A1)',
  'A2': 'Élémentaire (A2)',
  'B1': 'Intermédiaire (B1)',
  'B2': 'Intermédiaire avancé (B2)',
  'C1': 'Avancé (C1)',
  'C2': 'Maîtrise / Bilingue (C2)',
};

/**
 * Formate un niveau de langue
 * @param level - Le niveau (ex: "C1", "B2", etc.)
 * @returns Le niveau formaté ou le niveau original si non trouvé
 */
export function formatLanguageLevel(level: string): string {
  // Nettoyer le niveau (enlever les espaces et mettre en majuscule)
  const cleanLevel = level.trim().toUpperCase();
  
  // Retourner le mapping ou le niveau original
  return LANGUAGE_LEVEL_MAPPING[cleanLevel] || level;
}

/**
 * Tri des langues dans l'ordre : Français, Anglais, Espagnol
 */
export function sortLanguagesByOrder<T extends { langue: string }>(languages: T[]): T[] {
  // Ordre souhaité
  const order = ['français', 'anglais', 'espagnol'];
  
  return [...languages].sort((a, b) => {
    const aLower = a.langue.toLowerCase();
    const bLower = b.langue.toLowerCase();
    
    // Trouver l'index de chaque langue dans l'ordre
    const aIndex = order.findIndex(pref => aLower.includes(pref));
    const bIndex = order.findIndex(pref => bLower.includes(pref));
    
    // Si les deux sont dans la liste d'ordre
    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    }
    
    // Si seulement a est dans la liste d'ordre
    if (aIndex !== -1) return -1;
    
    // Si seulement b est dans la liste d'ordre
    if (bIndex !== -1) return 1;
    
    // Sinon, tri alphabétique
    return aLower.localeCompare(bLower);
  });
}