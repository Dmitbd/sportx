import { create } from 'zustand';

type User = { id: number; email: string; };

type AuthStore = {
  isAuth: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  isAuth: false,
  user: null,

  // Авторизация (только передача данных)
  login: async (email, password) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    const user = await response.json();
    set({ isAuth: true, user });
  },

  // Регистрация (только передача данных)
  register: async (email, password) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    const user = await response.json();
    set({ isAuth: true, user });
  },

  // Выход
  logout: () => set({ isAuth: false, user: null }),
}));
