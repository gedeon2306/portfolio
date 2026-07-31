import type { RouteObject } from 'react-router-dom';
import Login from './pages/login/Login';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/connexion',
    element: <Login />,
  },
];