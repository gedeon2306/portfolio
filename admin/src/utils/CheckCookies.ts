import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../api/Auth';

interface CheckCookiesOptions {
  redirectIfAuthenticated?: string;
  redirectIfNotAuthenticated?: string;
}

export function useCheckCookies({
  redirectIfAuthenticated,
  redirectIfNotAuthenticated,
}: CheckCookiesOptions) {
  const navigate = useNavigate();

  useEffect(() => {
    const existingToken = getCookie('authToken');

    if (existingToken && redirectIfAuthenticated) {
      navigate(redirectIfAuthenticated, { replace: true });
      return;
    }

    if (!existingToken && redirectIfNotAuthenticated) {
      navigate(redirectIfNotAuthenticated, { replace: true });
    }
  }, []);
}