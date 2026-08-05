import type { RouteObject } from 'react-router-dom';
import Login from './pages/login/Login';
import DashboardLayout from './components/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import MyInfo from './pages/myInfo/MyInfo';
import Skills from './pages/skills/Skills';
import Projects from './pages/projects/Projects';
import Certificates from './pages/certificates/Certificates';
import Analytics from './pages/analytics/Analytics';
import Settings from './pages/settings/Settings';

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
        path: 'certificates',
        element: <Certificates />,
      },
      {
        path: 'analytics',
        element: <Analytics />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
    ],
  },
];