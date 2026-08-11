// Dashboard
export type DeviceType = 'desktop' | 'mobile' | 'tablet' | 'bot' | 'other';
 
export interface PageView {
  id: string;
  path: string;
  method: string;
  referrer: string | null;
  ip_address: string | null;
  user_agent: string | null;
  device_type: DeviceType;
  timestamp: string;
}
 
export interface JournalEntry {
  id: string;
  action: string;
  created_at: string;
}
 
export interface StatValue {
  value: number;
  trend: string;
}
 
export interface DashboardStats {
  projects: StatValue;
  visits: StatValue;
  skills: StatValue;
  certificates: StatValue;
}
 
export interface PaginatedPageViews {
  count: number;
  next: string | null;
  previous: string | null;
  results: PageView[];
}
 
export interface DashboardHomeResponse {
  stats: DashboardStats;
  recent_activity: JournalEntry[];
  page_views: PaginatedPageViews;
}
 
export interface DashboardHomeParams {
  search?: string;
  device?: DeviceType | 'all';
  page?: number;
}
 
// MyInfo 
 
export type NiveauChoice = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
 
export interface LangueItem {
  id: string;
  langue: string;
  niveau: NiveauChoice;
}
 
// Langue envoyée au serveur : id absent ou temporaire (nouvelle) = création,
// id correspondant à un UUID existant = mise à jour
export interface LangueInput {
  id?: string;
  langue: string;
  niveau: NiveauChoice;
}
 
export interface MyInfoData {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  localisation: string;
  profession: string;
  description1: string;
  description2: string;
  image: string | null; // URL absolue renvoyée par Django (ImageField)
  cv: string | null;    // URL absolue renvoyée par Django (FileField)
  formation: string;
  experience: string;
  passions: string;
  github: string | null;
  linkedin: string | null;
  instagram: string | null;
  twitter_x: string | null;
  tik_tok: string | null;
}
 
export interface MyInfoResponse {
  info: MyInfoData | null;
  langues: LangueItem[];
}
 
// Champs texte uniquement (image/cv gérés séparément en fichiers)
export interface MyInfoTextFields {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  localisation: string;
  profession: string;
  description1: string;
  description2: string;
  formation: string;
  experience: string;
  passions: string;
  github: string;
  linkedin: string;
  instagram: string;
  twitter_x: string;
  tik_tok: string;
}
 
export interface MyInfoSavePayload {
  fields: MyInfoTextFields;
  imageFile?: File | null;
  removeImage?: boolean;
  cvFile?: File | null;
  removeCv?: boolean;
  langues: LangueInput[];
}
