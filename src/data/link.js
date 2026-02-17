import { Action, Role } from '@/constants';
import * as Auth from '@/pages/auth';
import * as Dashboard from '@/pages/dashboard';
import * as Landing from '@/pages/landing';
import * as Model from '@/models';

import { CalendarOutlined, DashboardOutlined, UserOutlined } from '@ant-design/icons';

export const landingLink = [
  {
    label: 'Beranda',
    key: '/',
    element: Landing.Home
  }
];

/**
 * @type {{
 *  label: string;
 *  permissions: [Action, import('@/models/Model').ModelChildren][];
 *  roles: Role[];
 *  children: {
 *   path: string;
 *   label: string;
 *   icon: import('react').ReactNode;
 *   element: import('react').ReactNode;
 *   roles?: Role[];
 *   permissions?: [Action, import('@/models/Model').ModelChildren][];
 *  }[];
 * }[]}
 */
export const dashboardLink = [
  {
    label: 'Overview',
    icon: DashboardOutlined,
    roles: [Role.KONSELI],
    children: [{ path: '/dashboard', label: 'Dashboard', element: Dashboard.KonseliDashboard }]
  },
  {
    label: 'Aktor',
    icon: UserOutlined,
    roles: [Role.ADMIN],
    children: [
      { path: '/dashboard/konseli', label: 'Konselis', element: Dashboard.Konselis, permissions: [[Action.CREATE, Model.Konselis]] },
      { path: '/dashboard/konselor', label: 'Konselor', element: Dashboard.Konselors, permissions: [[Action.CREATE, Model.Konselors]] }
    ]
  },
  {
    label: 'Layanan',
    icon: CalendarOutlined,
    roles: [Role.ADMIN],
    children: [
      { path: '/dashboard/hari_layanan', label: 'Hari Layanan', element: Dashboard.HariLayanans, permissions: [[Action.CREATE, Model.HariLayanans]] },
      { path: '/dashboard/jadwal_konselor', label: 'Jadwal Konselor', element: Dashboard.JadwalKonselors, permissions: [[Action.CREATE, Model.JadwalKonselors]] }
    ]
  }
].map((item) => ({
  ...item,
  permissions: [...(item.permissions || []), ...(item.children?.flatMap((child) => child.permissions || []) ?? [])].filter(Boolean),
  roles: [...(item.roles || []), ...(item.children?.flatMap((child) => child.roles || []) ?? [])].filter(Boolean)
}));

export const authLink = [
  {
    path: '/auth/login',
    element: Auth.Login
  }
];
