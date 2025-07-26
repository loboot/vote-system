import type { LoginCredentials, RegisterCredentials, User } from '@/types/auth';
import api from './api';
import type { Response } from '@/types/api';

const BASE_URL = '/auth';

export const Login = (data: LoginCredentials): Promise<{ code: number; expired: string; token: string }> =>
  api.post(`${BASE_URL}/login`, data);

export const Register = (data: RegisterCredentials): Promise<{ code: number; message: string }> =>
  api.post(`${BASE_URL}/register`, data);

export const RefreshToken = () => api.post(`${BASE_URL}/refresh`);

export const GetProfile = (): Promise<Response<User>> => api.get(`${BASE_URL}/profile`);
