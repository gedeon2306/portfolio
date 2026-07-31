import type { RouteObject } from 'react-router-dom';
import Login from './pages/login/Login';
import DashboardLayout from './components/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import MesInfo from './pages/dashboard/MesInfo';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/connexion',
    element: <Login />,
  },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <DashboardHome />,
      },
        {
          path: 'myinfo',
          element: <MesInfo />,
        },
      {
        path: 'content',
        element: <div className="dashboard-placeholder">Contenus à venir</div>,
      },
      {
        path: 'analytics',
        element: <div className="dashboard-placeholder">Statistiques à venir</div>,
      },
      {
        path: 'settings',
        element: <div className="dashboard-placeholder">Paramètres à venir</div>,
      },
    ],
  },
];