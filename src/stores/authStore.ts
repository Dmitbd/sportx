
import type { User } from '@/types';
import { create } from 'zustand';

type AuthStore = {
  isAuth: boolean;
  user: User | null;

  setUser: (user: User) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  isAuth: false,
  user: null,

  setUser: (user) => set({ isAuth: true, user }),
  logout: () => set({ isAuth: false, user: null }),
}));
