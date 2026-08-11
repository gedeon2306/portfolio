import api from './AxiosConfig';
import type {
  DashboardHomeParams,
  DashboardHomeResponse,
  MyInfoResponse,
  MyInfoSavePayload,
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
