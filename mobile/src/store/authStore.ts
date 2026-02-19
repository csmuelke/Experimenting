import { create } from 'zustand';
import { User, AuthTokens } from '../types';
import * as SecureStore from 'expo-secure-store';
import { authApi } from '../services/api/auth';

interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  loadStoredAuth: () => Promise<void>;
  updateUser: (user: User) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.login({ email, password });
      
      // Store tokens securely
      await SecureStore.setItemAsync('accessToken', response.tokens.accessToken);
      await SecureStore.setItemAsync('refreshToken', response.tokens.refreshToken);
      
      set({
        user: response.user,
        tokens: response.tokens,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Login failed',
        isLoading: false,
      });
      throw error;
    }
  },

  register: async (data: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.register(data);
      
      await SecureStore.setItemAsync('accessToken', response.tokens.accessToken);
      await SecureStore.setItemAsync('refreshToken', response.tokens.refreshToken);
      
      set({
        user: response.user,
        tokens: response.tokens,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Registration failed',
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      await SecureStore.deleteItemAsync('accessToken');
      await SecureStore.deleteItemAsync('refreshToken');
      
      set({
        user: null,
        tokens: null,
        isAuthenticated: false,
        error: null,
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  loadStoredAuth: async () => {
    set({ isLoading: true });
    try {
      const accessToken = await SecureStore.getItemAsync('accessToken');
      const refreshToken = await SecureStore.getItemAsync('refreshToken');
      
      if (accessToken && refreshToken) {
        // Verify token and get user data
        const user = await authApi.verifyToken(accessToken);
        set({
          user,
          tokens: { accessToken, refreshToken },
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Load stored auth error:', error);
      set({ isLoading: false });
    }
  },

  updateUser: (user: User) => {
    set({ user });
  },

  clearError: () => {
    set({ error: null });
  },
}));
