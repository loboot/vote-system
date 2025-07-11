import type { LoginCredentials, RegisterCredentials } from '@/types/auth';
import api from './api';

export const login = (data: LoginCredentials) => api.post('/login', data);

export const register = (data: RegisterCredentials) => api.post('/register', data);
