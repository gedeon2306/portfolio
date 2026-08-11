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