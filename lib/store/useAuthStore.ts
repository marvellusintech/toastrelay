import { create } from 'zustand';
import {mockCurrentUser} from '../mock_data';
import { User } from '../types/response';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: mockCurrentUser,
  isAuthenticated: false,
  isLoading: true, // Defaults to true while checking initial session status
  
  // Set user data when they log in or session initializes
  setAuth: (user) => set({ 
    user, 
    isAuthenticated: !!user, 
    isLoading: false 
  }),
  
  // Toggle loading state manually during heavy requests
  setLoading: (loading) => set({ isLoading: loading }),
  
  // Clear the state upon user sign out
  logout: () => set({ 
    user: null, 
    isAuthenticated: false, 
    isLoading: false 
  }),
}));