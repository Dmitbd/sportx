import type {  Training, UpdateWorkoutSets, Workout } from '@/types';
import httpClient from './httpClient';

export const workoutService = {
  getWorkouts: async (): Promise<Workout[]> => {
    const { data } = await httpClient.get<Workout[]>('/workouts');
    return data;
  },

  saveWorkout: async (workouts: Training[]): Promise<void> => {
    await httpClient.post('/workouts/create/confirm', { workouts });
  },

  getWorkout: async (id: string): Promise<Training> => {
    const { data } = await httpClient.get<Training>(`/workouts/${id}`);
    return data;
  },

  updateWorkoutSets: async (id: string, payload: UpdateWorkoutSets): Promise<UpdateWorkoutSets> => {
    const { data } = await httpClient.patch<UpdateWorkoutSets>(`/workouts/${id}/sets`, payload);
    return data;
  },
};
