import type { User } from '@/types/auth';
import { create } from 'zustand';

interface AuthState {
  token: string | null;
  user: User | null;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const getInitialToken = () => localStorage.getItem('token');
const getInitialUser = () => {
  const user = localStorage.getItem('user');
  return user ? (JSON.parse(user) as User) : null;
};

const useAuthStore = create<AuthState>((set) => ({
  user: getInitialUser(),
  token: getInitialToken(),
  setAuth: (user, token) => {
    localStorage.setItem('token', token);
    // localStorage.setItem('user', JSON.stringify(user));
    set({ user, token });
  },
  clearAuth: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null });
  },
  login: (user, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, token });
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null });
  },
  isAuthenticated: !!getInitialToken(),
}));

export default useAuthStore;
