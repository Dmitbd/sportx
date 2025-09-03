import { create } from 'zustand';
import type { EquipmentItem } from '../pages/Create/types';
import { INITIAL_ITEMS } from '../pages/Create/constants';

interface GuidedFormState {
  gender: string | null;
  experience: string | null;
  workoutCount: string | null;
  place: string | null;
  hasHomeEquipment: string | null;
  equipmentList: EquipmentItem[];
  muscleSelection: string | null;

  setGender: (gender: string | null) => void;
  setExperience: (experience: string | null) => void;
  setWorkoutCount: (workoutCount: string | null) => void;
  setPlace: (place: string | null) => void;
  setHasHomeEquipment: (hasHomeEquipment: string | null) => void;
  setEquipmentList: (equipmentList: EquipmentItem[]) => void;
  updateEquipmentItem: (updatedItem: EquipmentItem) => void;
  setMuscleSelection: (muscleSelection: string | null) => void;
  
  reset: () => void;
}

/** 
 * Стор для формы создания тренировок
 * Хранит в себе данные выбранные пользователем для генерации
*/
export const useGuidedFormStore = create<GuidedFormState>((set, get) => ({
  gender: null,
  experience: null,
  workoutCount: null,
  place: null,
  hasHomeEquipment: null,
  equipmentList: INITIAL_ITEMS,
  muscleSelection: null,

  setGender: (gender) => set({ gender }),

  setExperience: (experience) => set({ experience }),

  setWorkoutCount: (workoutCount) => set({ workoutCount }),

  setPlace: (place) => set({ place, hasHomeEquipment: null }),

  setHasHomeEquipment: (hasHomeEquipment) => set({ hasHomeEquipment }),

  setEquipmentList: (equipmentList) => set({ equipmentList }),

  updateEquipmentItem: (updatedItem) => {
    const { equipmentList } = get();
    const updatedList = equipmentList.map(item =>
      item.name === updatedItem.name ? updatedItem : item
    );
    set({ equipmentList: updatedList });
  },

  setMuscleSelection: (muscleSelection) => set({ muscleSelection }),

  reset: () => set({
    gender: null,
    experience: null,
    workoutCount: null,
    place: null,
    hasHomeEquipment: null,
    equipmentList: INITIAL_ITEMS,
    muscleSelection: null
  })
}));
