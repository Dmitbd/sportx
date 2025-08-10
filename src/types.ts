export type AIMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export type AIResponse = {
  choices: {
    message: {
      content: string;
    };
  }[];
}

/** Упражнение */
export type Exercise = {
  /** Название упражнения */
  name: string;
  /** Описание упражнения */
  description: string;
  /** sets.length - количество подходов, элемент массива - [вес, повторы] */
  sets: number[][];
  /** Мускулы которые работают */
  muscles: string[];
}

/** Тренировка */
export type Training = {
  /** Название тренировки */
  name: string;
  /** Упражнения в тренировке */
  exercises: Exercise[];
}

export type AIWorkoutResponse = {
  workouts: Training[];
}

export interface User {
  id: number;
  email: string;
  name?: string;
}

/** Тип тренировки для списка тренировок */
export interface Workout {
  id: string;
  title: string;
  exercises: string[];
  createdAt: Date;
}

/** Для обновления значений [вес, повторы] в подходах */
export type UpdateWorkoutSets = {
  exercises: Pick<Exercise, 'name' | 'sets'>[];
}
