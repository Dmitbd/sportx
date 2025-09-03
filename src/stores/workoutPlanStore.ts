import { create } from 'zustand';
import type { Training } from '@/types';

interface WorkoutPlanState {
  workoutPlan: Training[] | null;
  error: string | null;

  setWorkoutPlan: (plan: Training[]) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

/** Стор сгенерированного плана тренировок */
export const useWorkoutPlanStore = create<WorkoutPlanState>((set) => ({
  workoutPlan: null,
  error: null,

  setWorkoutPlan: (plan) => {
    set({ workoutPlan: plan, error: null });
  },

  setError: (error) => {
    set({ error });
  },

  reset: () => set({
    workoutPlan: null,
    error: null
  })
}));
