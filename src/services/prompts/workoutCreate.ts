import type { EquipmentItem } from '@/pages/Create/types';

//TODO: добавить в промт muscles: string[]

export const workoutCreate = {
  generateWorkoutPrompt: (workoutCount: string, place: string, equipment: EquipmentItem[]): string => {
    const equipmentDescription = equipment.map(item => {
      const unitsDescription = item.units.length > 0
        ? item.units.map(unit => `${unit[0]} × ${unit[1]}кг`).join(', ')
        : 'нет';
      return `${item.name}: ${unitsDescription}`;
    }).join('; ');

    return `Ты профессиональный фитнес-тренер. Составь детальный план тренировок на неделю:

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
  }
};
