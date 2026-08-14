import api from './AxiosConfig';
import type {
  DashboardHomeParams,
  DashboardHomeResponse,
  MyInfoResponse,
  MyInfoSavePayload,
  SkillsResponse,
  SkillsSavePayload,
  Project,
  ProjectListResponse,
  ProjectCreatePayload,
  Certificate,
  CertificateListResponse,
  CertificateCreatePayload,
  AnalyticsRange,
  AnalyticsResponse,
} from '../types/Types';
 
// Dashboard
 
export async function fetchDashboardHome(
  params: DashboardHomeParams = {}
): Promise<DashboardHomeResponse> {
  const query: Record<string, string> = {};

  if (params.search) query.search = params.search;
  if (params.device && params.device !== 'all') query.device = params.device;
  if (params.page) query.page = String(params.page);

  const { data } = await api.get<DashboardHomeResponse>('dashboard/home/', {
    params: query,
  });

  return data;
}
 
// MyInfo
 
export async function fetchMyInfo(): Promise<MyInfoResponse> {
  const { data } = await api.get<MyInfoResponse>('myinfo/');
  return data;
}

export async function saveMyInfo(payload: MyInfoSavePayload): Promise<MyInfoResponse> {
  const formData = new FormData();

  Object.entries(payload.fields).forEach(([key, value]) => {
    formData.append(key, value ?? '');
  });

  if (payload.imageFile) formData.append('image', payload.imageFile);
  if (payload.removeImage) formData.append('remove_image', 'true');

  if (payload.cvFile) formData.append('cv', payload.cvFile);
  if (payload.removeCv) formData.append('remove_cv', 'true');

  const langues = Array.isArray(payload.langues) ? payload.langues : [];
  formData.append('langues', JSON.stringify(langues));

  const { data } = await api.post<MyInfoResponse>('myinfo/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return data;
}

// Skills

export async function fetchSkills(): Promise<SkillsResponse> {
  const { data } = await api.get<SkillsResponse>('skills/');
  return data;
}

export async function saveSkills(payload: SkillsSavePayload): Promise<SkillsResponse> {
  const { data } = await api.post<SkillsResponse>('skills/', payload);
  return data;
}

// Projects

/**
 * Récupère la liste paginée des projets avec filtres
 */
export async function fetchProjects(params: {
  page?: number;
  page_size?: number;
  search?: string;
  category?: string;
  status?: string;
  important?: string;
} = {}): Promise<ProjectListResponse> {
  const query: Record<string, string | number> = {};

  if (params.page) query.page = params.page;
  if (params.page_size) query.page_size = params.page_size;
  if (params.search) query.search = params.search;
  if (params.category && params.category !== 'all') query.category = params.category;
  if (params.status && params.status !== 'all') query.status = params.status;
  if (params.important && params.important !== 'all') query.important = params.important;

  const { data } = await api.get<ProjectListResponse>('projects/', { params: query });
  return data;
}

/**
 * Récupère un projet par son ID
 */
export async function fetchProject(id: string): Promise<Project> {
  const { data } = await api.get<Project>(`projects/${id}/`);
  return data;
}

/**
 * Crée un nouveau projet avec support des fichiers
 */
export async function createProject(payload: ProjectCreatePayload): Promise<Project> {
  const formData = new FormData();

  // Champs texte
  if (payload.titre) formData.append('titre', payload.titre);
  if (payload.description) formData.append('description', payload.description);
  if (payload.categorie) formData.append('categorie', payload.categorie);
  if (payload.status !== undefined) formData.append('status', String(payload.status));
  if (payload.important !== undefined) formData.append('important', String(payload.important));
  if (payload.url) formData.append('url', payload.url);
  if (payload.code_source) formData.append('code_source', payload.code_source);

  // Technologies (convertir en JSON)
  if (payload.technologies && payload.technologies.length > 0) {
    formData.append('technologies', JSON.stringify(payload.technologies));
  }

  // Fichiers
  if (payload.image) formData.append('image', payload.image);
  if (payload.doc) formData.append('doc', payload.doc);

  const { data } = await api.post<Project>('projects/create/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return data;
}

/**
 * Met à jour un projet existant (PUT - remplacement complet)
 */
export async function updateProject(id: string, payload: ProjectCreatePayload): Promise<Project> {
  const formData = new FormData();

  // Champs texte
  if (payload.titre) formData.append('titre', payload.titre);
  if (payload.description) formData.append('description', payload.description);
  if (payload.categorie) formData.append('categorie', payload.categorie);
  if (payload.status !== undefined) formData.append('status', String(payload.status));
  if (payload.important !== undefined) formData.append('important', String(payload.important));
  if (payload.url) formData.append('url', payload.url);
  if (payload.code_source) formData.append('code_source', payload.code_source);

  // Technologies (convertir en JSON)
  if (payload.technologies && payload.technologies.length > 0) {
    formData.append('technologies', JSON.stringify(payload.technologies));
  } else if (payload.technologies !== undefined) {
    // Envoyer une liste vide pour supprimer toutes les technologies
    formData.append('technologies', JSON.stringify([]));
  }

  // Fichiers
  if (payload.image) formData.append('image', payload.image);
  if (payload.doc) formData.append('doc', payload.doc);

  const { data } = await api.put<Project>(`projects/${id}/update/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return data;
}

/**
 * Met à jour partiellement un projet (PATCH)
 */
export async function patchProject(id: string, payload: Partial<ProjectCreatePayload>): Promise<Project> {
  const formData = new FormData();

  // Champs texte
  if (payload.titre !== undefined) formData.append('titre', payload.titre);
  if (payload.description !== undefined) formData.append('description', payload.description);
  if (payload.categorie !== undefined) formData.append('categorie', payload.categorie);
  if (payload.status !== undefined) formData.append('status', String(payload.status));
  if (payload.important !== undefined) formData.append('important', String(payload.important));
  if (payload.url !== undefined) formData.append('url', payload.url);
  if (payload.code_source !== undefined) formData.append('code_source', payload.code_source);

  // Technologies (convertir en JSON)
  if (payload.technologies !== undefined) {
    if (payload.technologies.length > 0) {
      formData.append('technologies', JSON.stringify(payload.technologies));
    } else {
      formData.append('technologies', JSON.stringify([]));
    }
  }

  // Fichiers
  if (payload.image) formData.append('image', payload.image);
  if (payload.doc) formData.append('doc', payload.doc);

  const { data } = await api.patch<Project>(`projects/${id}/update/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return data;
}

/**
 * Supprime un projet
 */
export async function deleteProject(id: string): Promise<void> {
  await api.delete(`projects/${id}/delete/`);
}

/**
 * Récupère la liste des catégories disponibles
 */
export async function fetchProjectCategories(): Promise<string[]> {
  const { data } = await api.get<{ categories: string[] }>('projects/categories/');
  return data.categories;
}

/**
 * Récupère la liste des technologies disponibles
 */
export async function fetchProjectTechnologies(): Promise<string[]> {
  const { data } = await api.get<{ technologies: string[] }>('projects/technologies/');
  return data.technologies;
}

// CERTIFICATES

export async function fetchCertificates(params: {
  page?: number;
  page_size?: number;
  search?: string;
  category?: string;
  status?: string;
  important?: string;
} = {}): Promise<CertificateListResponse> {
  const query: Record<string, string | number> = {};

  if (params.page) query.page = params.page;
  if (params.page_size) query.page_size = params.page_size;
  if (params.search) query.search = params.search;
  if (params.category && params.category !== 'all') query.category = params.category;
  if (params.status && params.status !== 'all') query.status = params.status;
  if (params.important && params.important !== 'all') query.important = params.important;

  const { data } = await api.get<CertificateListResponse>('certificates/', { params: query });
  return data;
}

export async function fetchCertificate(id: string): Promise<Certificate> {
  const { data } = await api.get<Certificate>(`certificates/${id}/`);
  return data;
}

export async function createCertificate(payload: CertificateCreatePayload): Promise<Certificate> {
  const formData = new FormData();

  if (payload.titre) formData.append('titre', payload.titre);
  if (payload.description) formData.append('description', payload.description);
  if (payload.categorie) formData.append('categorie', payload.categorie);
  if (payload.organisme) formData.append('organisme', payload.organisme);
  if (payload.date) formData.append('date', payload.date);
  if (payload.url) formData.append('url', payload.url);
  if (payload.status !== undefined) formData.append('status', String(payload.status));
  if (payload.important !== undefined) formData.append('important', String(payload.important));
  if (payload.image) formData.append('image', payload.image);

  const { data } = await api.post<Certificate>('certificates/create/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return data;
}

export async function updateCertificate(id: string, payload: CertificateCreatePayload): Promise<Certificate> {
  const formData = new FormData();

  if (payload.titre) formData.append('titre', payload.titre);
  if (payload.description) formData.append('description', payload.description);
  if (payload.categorie) formData.append('categorie', payload.categorie);
  if (payload.organisme) formData.append('organisme', payload.organisme);
  if (payload.date) formData.append('date', payload.date);
  if (payload.url) formData.append('url', payload.url);
  if (payload.status !== undefined) formData.append('status', String(payload.status));
  if (payload.important !== undefined) formData.append('important', String(payload.important));
  if (payload.image) formData.append('image', payload.image);

  const { data } = await api.put<Certificate>(`certificates/${id}/update/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return data;
}

export async function patchCertificate(id: string, payload: Partial<CertificateCreatePayload>): Promise<Certificate> {
  const formData = new FormData();

  if (payload.titre !== undefined) formData.append('titre', payload.titre);
  if (payload.description !== undefined) formData.append('description', payload.description);
  if (payload.categorie !== undefined) formData.append('categorie', payload.categorie);
  if (payload.organisme !== undefined) formData.append('organisme', payload.organisme);
  if (payload.date !== undefined) formData.append('date', payload.date);
  if (payload.url !== undefined) formData.append('url', payload.url);
  if (payload.status !== undefined) formData.append('status', String(payload.status));
  if (payload.important !== undefined) formData.append('important', String(payload.important));
  if (payload.image) formData.append('image', payload.image);

  const { data } = await api.patch<Certificate>(`certificates/${id}/update/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return data;
}

export async function deleteCertificate(id: string): Promise<void> {
  await api.delete(`certificates/${id}/delete/`);
}

export async function fetchCertificateCategories(): Promise<string[]> {
  const { data } = await api.get<{ categories: string[] }>('certificates/categories/');
  return data.categories;
}

// Analytics

export async function fetchAnalytics(range: AnalyticsRange = '30d'): Promise<AnalyticsResponse> {
  const { data } = await api.get<AnalyticsResponse>('analytics/', {
    params: { range },
  });
  return data;
}