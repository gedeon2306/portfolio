// Dashboard
export type DeviceType = 'desktop' | 'mobile' | 'tablet' | 'bot' | 'other';
 
export interface PageView {
  id: string;
  path: string;
  method: string;
  referrer: string | null;
  source: string | null;
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

// Skills

export interface SkillItem {
  id: string;
  libelle: string;
  pourcentage: number;
}

export interface SkillCategory {
  id: string;
  title: string;
  skills: SkillItem[];
}

export interface SkillsResponse {
  categories: SkillCategory[];
}

// Compétence/catégorie envoyée au serveur : id absent ou temporaire (nouvelle)
// = création, id correspondant à un UUID existant = mise à jour
export interface SkillItemInput {
  id?: string;
  libelle: string;
  pourcentage: number;
}

export interface SkillCategoryInput {
  id?: string;
  title: string;
  skills: SkillItemInput[];
}

export interface SkillsSavePayload {
  categories: SkillCategoryInput[];
}

// Projects
export interface Technology {
  id: string;
  libelle: string;
  pourcentage: number;
}

export interface Project {
  id: string;
  titre: string;
  categorie: string;
  status: boolean;
  important: boolean;
  description: string;
  image: string | null;
  url: string | null;
  code_source: string | null;
  created_at: string;
  updated_at: string;
  technologies: Technology[] | string[];
}

export interface ProjectListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Project[];
}

export interface ProjectCreatePayload {
  titre: string;
  description: string;
  categorie: string;
  status?: boolean;
  important?: boolean;
  url?: string;
  code_source?: string;
  technologies?: string[];
  image?: File | null;
  doc?: File | null;
}

// CERTIFICATES
export interface Certificate {
  id: string;
  titre: string;
  description: string;
  categorie: string;
  organisme: string | null;
  date: string | null;
  url: string | null;
  image: string | null;
  status: boolean;
  important: boolean;
  created_at: string;
  updated_at: string;
}

export interface CertificateListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Certificate[];
}

export interface CertificateFormData {
  id?: string;
  titre: string;
  description: string;
  categorie: string;
  organisme?: string;
  date?: string;
  url?: string;
  status: boolean;
  important: boolean;
}

export interface CertificateCreatePayload {
  titre: string;
  description: string;
  categorie: string;
  organisme?: string;
  date?: string;
  url?: string;
  status?: boolean;
  important?: boolean;
  image?: File | null;
}

// Analytics

export type AnalyticsRange = '7d' | '30d' | '1y';

export interface AnalyticsKpiTrend {
  value: number;
  trend_pct: number;
}

export interface AnalyticsDurationKpi {
  value_seconds: number;
  trend_seconds: number;
}

export interface AnalyticsBounceKpi {
  value_pct: number;
  trend_pct: number;
}

export interface AnalyticsKpis {
  total_visits: AnalyticsKpiTrend;
  unique_visitors: AnalyticsKpiTrend;
  avg_session_duration: AnalyticsDurationKpi;
  bounce_rate: AnalyticsBounceKpi;
}

export interface WeeklyTrafficPoint {
  day: string;
  date: string;
  visits: number;
}

export interface TopPageStat {
  path: string;
  views: number;
  pct: number;
}

export interface TopCountryStat {
  country: string;
  code: string | null;
  pct: number;
}

export interface AnalyticsResponse {
  range: AnalyticsRange;
  kpis: AnalyticsKpis;
  weekly_traffic: WeeklyTrafficPoint[];
  top_pages: TopPageStat[];
  top_countries: TopCountryStat[];
}

// Settings

// Settings

export interface SettingsData {
  id: number;
  titre_app: string;
  mode_maintenance: boolean;
  notification_email: boolean;
}

export interface SettingsResponse {
  settings: SettingsData | null;
}

export interface SettingsUpdatePayload {
  titre_app: string;
  mode_maintenance: boolean;
  notification_email: boolean;
}

export interface SecurityResponse {
  two_factor_auth: boolean;
}

export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
}