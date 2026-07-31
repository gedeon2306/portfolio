import type { RouteObject } from 'react-router-dom';
import Login from './pages/login/Login';
import DashboardLayout from './components/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import MyInfo from './pages/myInfo/MyInfo';
import Skills from './pages/skills/Skills';
import Projects from './pages/projects/Projects';

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
        element: <MyInfo />,
      },
      {
        path: 'skills',
        element: <Skills />,
      },
      {
        path: 'projects',
        element: <Projects />,
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