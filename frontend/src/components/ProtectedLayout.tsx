// ProtectedLayout.tsx
import useAuthStore from '@/store/AuthContext';
import { Outlet, Navigate } from 'react-router';

const ProtectedLayout = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedLayout;
