import api from './AxiosConfig';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ConfirmLoginPayload {
  uid: string;
  token: string;
  code: string;
}

export async function loginUser(payload: LoginPayload) {
  const response = await api.post('auth/login/', payload);
  return response.data;
}

export async function confirmLogin(payload: ConfirmLoginPayload) {
  const response = await api.post('auth/confirm-login/', payload);
  return response.data;
}

export function setAuthToken(accessToken: string) {
  api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
}

export function clearAuthToken() {
  delete api.defaults.headers.common.Authorization;
}

