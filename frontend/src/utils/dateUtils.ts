// utils/dateUtils.ts

/**
 * Formate une date pour l'affichage (mois/année)
 * @param date - La date au format "DD/MM/YYYY"
 * @returns La date formatée en "Mois Année" (ex: "Mars 2025")
 */
export function formatCertDate(date: string): string {
  if (!date) return '';
  
  try {
    const parts = date.split('/');
    if (parts.length !== 3) return date;
    
    const day = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1;
    const year = parseInt(parts[2]);
    
    const dateObj = new Date(year, month, day);
    
    if (isNaN(dateObj.getTime())) {
      return date;
    }
    
    const months = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    
    return `${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
  } catch (error) {
    console.error('Erreur de formatage de date:', error);
    return date;
  }
}

/**
 * Extrait l'année d'une date au format DD/MM/YYYY
 */
export function extractYear(date: string): string {
  if (!date) return '';
  
  try {
    const parts = date.split('/');
    if (parts.length !== 3) return '';
    return parts[2];
  } catch (error) {
    console.error('Erreur d\'extraction de l\'année:', error);
    return '';
  }
}

/**
 * Génère les années disponibles à partir d'une liste de certificats
 */
export function getAvailableYears(certificates: any[]): string[] {
  if (!certificates || certificates.length === 0) return [];
  
  const years = new Set<string>();
  
  certificates.forEach(cert => {
    const year = extractYear(cert.date);
    if (year) {
      years.add(year);
    }
  });
  
  return Array.from(years).sort((a, b) => parseInt(b) - parseInt(a));
}