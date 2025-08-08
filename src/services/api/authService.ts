import type { User } from '@/types';
import httpClient from './httpClient';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export const authService = {
  login: async (data: LoginRequest): Promise<User> => {
    const response = await httpClient.post('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<User> => {
    const response = await httpClient.post('/auth/register', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await httpClient.post('/auth/logout');
  }
};
