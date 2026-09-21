import { create } from 'zustand';
import { User } from '../../types/response';
import { hasAuthToken, removeAuthToken } from '../auth-cookies';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
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
