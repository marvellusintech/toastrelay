import { create } from 'zustand';
import { User } from '../../types/response';
import { AUTH_COOKIE_NAME } from '@/lib/constants';
import { removeAuthToken } from '../auth-cookies';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}


function hasAuthToken(): boolean {
  if (typeof document === "undefined") return false;
  const match = document.cookie.match(new RegExp(`(?:^|; )${AUTH_COOKIE_NAME}=([^;]*)`));
  return !!match && match[1] !== "";
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
isAuthenticated: hasAuthToken(),
  isLoading: true,
  
  setAuth: (user) => set({ 
    user, 
    isAuthenticated: hasAuthToken() || !!user, 
    isLoading: false 
  }),

  // setUser: (user) =>set({user})
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  logout: () => {
    removeAuthToken();
    
    set({ 
      user: null, 
      isAuthenticated: false, 
      isLoading: false 
    });
  },
}));
