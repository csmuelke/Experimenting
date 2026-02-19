import apiClient from './client';
import { LoginCredentials, RegisterData, User, AuthTokens } from '../../types';

export const authApi = {
  login: async (credentials: LoginCredentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data as { user: User; tokens: AuthTokens };
  },

  register: async (data: RegisterData) => {
    const response = await apiClient.post('/auth/register', data);
    return response.data as { user: User; tokens: AuthTokens };
  },

  verifyToken: async (token: string) => {
    const response = await apiClient.get('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data as User;
  },

  refreshToken: async (refreshToken: string) => {
    const response = await apiClient.post('/auth/refresh', { refreshToken });
    return response.data as AuthTokens;
  },

  logout: async () => {
    await apiClient.post('/auth/logout');
  },
};
