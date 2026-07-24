// src/shared/stores/auth-store.ts
import { create } from 'zustand';

export interface User {
  id: number;
  email: string;
  firstName: string;
  role: string;
  permissions: string[];
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;

  setUser: (user: User) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  loading: true,
  error: null,

  setUser: (user) => {
    set({
      user,
      isAuthenticated: true,
      error: null,
    });
  },

  clearUser: () => {
    set({
      user: null,
      isAuthenticated: false,
    });
  },

  setLoading: (loading) => {
    set({ loading });
  },

  setError: (error) => {
    set({ error });
  },

  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
      error: null,
    });
  },
}));
