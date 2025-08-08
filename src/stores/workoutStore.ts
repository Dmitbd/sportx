import { create } from 'zustand';
import type { EquipmentItem } from '../pages/Create/types';
import { askAI } from '@/services/aiService';
import { saveWorkout } from '@/services/workoutService';
import type { AIMessage, Training } from '@/types';
import axios from 'axios';

/**
 * TODO:
 * - переосмыслить useWorkoutStore
 * - сохранение ошибки в error
 * - вынести prompt (подумать о prompt)
 * - все упростить
 * - подумать над обработкой ошибок в запросе
 * - добавить в промт muscles: string[]
 */

interface WorkoutState {
  workoutCount: string | null;
  place: string | null;
  equipment: EquipmentItem[];
  workoutPlan: Training[] | null;
  isLoading: boolean;
  error: string | null;
  setWorkoutData: (data: {
    workoutCount: string | null;
    place: string | null;
    equipment: EquipmentItem[];
  }) => void;
  generateWorkoutPlan: (data: {
    workoutCount: string | null;
    place: string | null;
    equipment: EquipmentItem[];
  }) => Promise<void>;
  saveWorkoutPlan: () => Promise<void>;
  reset: () => void;
}

export const useWorkoutStore = create<WorkoutState>((set) => ({
  workoutCount: null,
  place: null,
  equipment: [],
  workoutPlan: null,
  isLoading: false,
  error: null,

  setWorkoutData: (data) => {
    set({
      workoutCount: data.workoutCount,
      place: data.place,
      equipment: data.equipment
    })
  },

  generateWorkoutPlan: async (data) => {
    set({ isLoading: true, error: null });

    try {
      const { workoutCount, place, equipment } = data;

      // Формируем оборудование в читаемом виде
      const equipmentDescription = equipment.map(item => {
        const unitsDescription = item.units.length > 0
          ? item.units.map(unit => `${unit[0]} × ${unit[1]}кг`).join(', ')
          : 'нет';
        return `${item.name}: ${unitsDescription}`;
      }).join('; ');

      // Формируем промпт с четкими инструкциями
      const prompt = `Ты профессиональный фитнес-тренер. Составь детальный план тренировок на неделю:
    
### Параметры:
- Количество тренировок: ${workoutCount}
- Количество упражнений: ${1}
- Место тренировок: ${place}
- Оборудование: ${equipmentDescription}

### Требования:
1. Количество тренировок: ровно ${workoutCount}
2. Учитывай место тренировки: ${place}
3. Используй только доступное оборудование
4. Для каждого упражнения укажи:
   - Название
   - Описание техники
   - Количество подходов (sets)
   - Количество повторений (reps)

### Формат ответа (только JSON):
  "workouts": [
    {
      "name": "Название тренировки",
      "exercises": [
        {
          "name": "Название упражнения",
          "description": "Техника выполнения",
          "sets": 3,
          "reps": 12
        }
      ]
    },
  ]

Важно:
- Верни строго JSON без дополнительного текста
- Всегда возвращай массив тренировок
- Количество объектов в массиве должно быть равно ${workoutCount}`;

      const messages: AIMessage[] = [{ role: 'user', content: prompt }];
      const aiResponse = await askAI(messages);

      set({ workoutPlan: aiResponse.workouts, isLoading: false })
    } catch (error: unknown) {
      console.error('Ошибка генерации плана тренировок:', error);

      let errorMessage = 'Не удалось сгенерировать план тренировок';

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message;
      }

      set({
        error: errorMessage,
        isLoading: false
      });
    }
  },

  saveWorkoutPlan: async () => {
    set({ isLoading: true, error: null });

    try {
      const currentState = useWorkoutStore.getState();

      if (!currentState.workoutPlan || currentState.workoutPlan.length === 0) {
        throw new Error('Нет данных для сохранения');
      }

      await saveWorkout(currentState.workoutPlan);

      set({ isLoading: false });
    } catch (error: unknown) {
      console.error('Ошибка сохранения тренировки:', error);

      let errorMessage = 'Не удалось сохранить тренировку';

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message;
      }

      set({
        error: errorMessage,
        isLoading: false
      });

      throw error;
    }
  },

  reset: () => set({
    workoutCount: null,
    place: null,
    equipment: [],
    workoutPlan: null,
    isLoading: false,
    error: null
  })
}));
