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


function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; Secure; SameSite=Strict`;
}

export function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Secure; SameSite=Strict`;
}

export function storeAuthTokens(accessToken: string, refreshToken: string, persistDays: number) {
  setCookie('authToken', accessToken, persistDays);
  setCookie('refreshToken', refreshToken, persistDays);
  setAuthToken(accessToken);
}

export function clearAuthTokens() {
  deleteCookie('authToken');
  deleteCookie('refreshToken');
  clearAuthToken();
}

export function setAuthToken(accessToken: string) {
  api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
}

export function clearAuthToken() {
  delete api.defaults.headers.common.Authorization;
}

