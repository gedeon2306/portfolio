import axios from 'axios';

const api = axios.create({
  baseURL: (import.meta.env.VITE_PUBLIC_API_URL) + 'api/',
});

// Normalise les erreurs pour retrouver directement error.message côté appelant
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error ?? "Une erreur est survenue, réessayez plus tard.";
    return Promise.reject(new Error(message));
  }
);

export default api;