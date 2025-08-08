import type { Training } from '@/types';
import axios from 'axios';

export interface SaveWorkoutRequest {
  workouts: Training[];
}

export const saveWorkout = async (workouts: Training[]): Promise<void> => {
  try {
    const response = await axios.post(
      `/api/workouts/create/confirm`,
      { workouts } as SaveWorkoutRequest,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }
    );

    // Просто проверяем, что запрос прошел успешно
    if (response.status !== 201) {
      throw new Error('Ошибка сохранения тренировки');
    }
  } catch (error: unknown) {
    console.error('Ошибка сохранения тренировки:', error);

    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Необходима авторизация');
      }
      if (error.response?.status === 400) {
        throw new Error('Неверные данные тренировки');
      }
      if (error.response?.status === 500) {
        throw new Error('Ошибка сервера');
      }

      throw new Error(`Ошибка сохранения: ${error.response?.data?.message || error.message}`);
    }

    if (error instanceof Error) {
      throw new Error(`Ошибка при сохранении тренировки: ${error.message}`);
    }

    throw new Error('Неизвестная ошибка при сохранении тренировки');
  }
};
