import AuthPage from '@/components/Auth';
import AppLayout from '@/components/Auth';
import { createBrowserRouter } from 'react-router';

export const router = createBrowserRouter([
  {
    path: '/login',
    Component: AuthPage,
  },
  {
    path: '/',
    Component: AppLayout,
  },
]);
