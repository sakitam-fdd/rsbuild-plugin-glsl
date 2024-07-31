import { lazy } from 'react';
import { useRoutes, Navigate } from 'react-router-dom';
import Layout from '../layouts/Layout';

const Index = lazy(() => import('../pages/Index/index'));

const asyncRoutes = [
  {
    path: '/',
    element: <Navigate to="/index" />,
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/index',
        index: true,
        // lazy: async () => ({
        //   Component: (await import('@/views/Home')).default,
        // }),
        element: <Index />,
      },
      {
        path: '*',
        element: <Navigate to="/index" />,
      },
    ],
  },
];

const errorRoutes = [
  {
    path: '*',
    element: <Navigate to="/index" />,
  },
];

const routes = [...asyncRoutes, ...errorRoutes];

// eslint-disable-next-line @typescript-eslint/no-shadow
const RouterList = ({ routes }) => useRoutes(routes);

export { routes, RouterList };
