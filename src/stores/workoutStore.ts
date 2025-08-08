import { create } from 'zustand';
import type { EquipmentItem } from '../pages/Create/types';
import type { Training } from '@/types';

/**
 * TODO:
 * - сохранение ошибки в error
 * - добавить в промт muscles: string[]
 */

interface WorkoutState {
  workoutCount: string | null;
  place: string | null;
  equipment: EquipmentItem[];
  workoutPlan: Training[] | null;
  error: string | null;

  setWorkoutData: (data: {
    workoutCount: string | null;
    place: string | null;
    equipment: EquipmentItem[];
  }) => void;

  setWorkoutPlan: (plan: Training[]) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useWorkoutStore = create<WorkoutState>((set) => ({
  workoutCount: null,
  place: null,
  equipment: [],
  workoutPlan: null,
  error: null,

  setWorkoutData: (data) => {
    set({
      workoutCount: data.workoutCount,
      place: data.place,
      equipment: data.equipment
    })
  },

  setWorkoutPlan: (plan) => {
    set({ workoutPlan: plan, error: null });
  },

  setError: (error) => {
    set({ error });
  },

  reset: () => set({
    workoutCount: null,
    place: null,
    equipment: [],
    workoutPlan: null,
    error: null
  })
}));
