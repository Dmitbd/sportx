import { RU } from "@/locales";
import type { EquipmentItem, MuscleGroups } from "./types";

const {
  CREATE: {
    EQUIPMENT: {
      BARBELL,
      DUMBBELL_BAR,
      DUMBBELLS,
      PLATES,
      RESISTANCE_BANDS,
    }
  }
} = RU;

// Группы мышц
export const MUSCLE_GROUPS = {
  BACK: {
    NAME: 'Спина',
    LATISSIMUS: {
      NAME: 'Широчайшие мышцы спины',
      PARTS: ['Верхняя часть', 'Средняя часть', 'Нижняя часть'],
    },
    TRAPEZIUS: {
      NAME: 'Трапециевидные',
      PARTS: ['Верхние пучки', 'Средние пучки', 'Нижние пучки'],
    },
    RHOMBOIDS: {
      NAME: 'Ромбовидные',
      PARTS: ['Большая ромбовидная', 'Малая ромбовидная'],
    },
    TERES_MAJOR: {
      NAME: 'Большая круглая',
      PARTS: ['Верхняя часть', 'Нижняя часть'],
    },
  },
  CHEST: {
    NAME: 'Грудь',
    PECTORALIS_MAJOR: {
      NAME: 'Большая грудная',
      PARTS: ['Верхняя часть', 'Средняя часть', 'Нижняя часть'],
    },
    PECTORALIS_MINOR: {
      NAME: 'Малая грудная',
      PARTS: ['Верхние пучки', 'Нижние пучки'],
    },
    SERRATUS_ANTERIOR: {
      NAME: 'Передняя зубчатая',
      PARTS: ['Верхние зубцы', 'Нижние зубцы'],
    },
  },
  LEGS: {
    NAME: 'Ноги',
    QUADRICEPS: {
      NAME: 'Квадрицепс',
      PARTS: ['Прямая мышца бедра', 'Латеральная широкая', 'Медиальная широкая', 'Промежуточная широкая'],
    },
    HAMSTRINGS: {
      NAME: 'Бицепс бедра',
      PARTS: ['Длинная головка', 'Короткая головка'],
    },
    GLUTES: {
      NAME: 'Ягодичные',
      PARTS: ['Большая ягодичная', 'Средняя ягодичная', 'Малая ягодичная'],
    },
    CALVES: {
      NAME: 'Икры',
      PARTS: ['Икроножная', 'Камбаловидная'],
    },
  },
  ARMS: {
    NAME: 'Руки',
    BICEPS: {
      NAME: 'Бицепс',
      PARTS: ['Длинная головка', 'Короткая головка'],
    },
    TRICEPS: {
      NAME: 'Трицепс',
      PARTS: ['Длинная головка', 'Латеральная головка', 'Медиальная головка'],
    },
    FOREARMS: {
      NAME: 'Предплечья',
      PARTS: ['Сгибатели', 'Разгибатели', 'Пронаторы', 'Супинаторы'],
    },
  },
  CORE: {
    NAME: 'Кор',
    ABS: {
      NAME: 'Пресс',
      PARTS: ['Прямая мышца живота', 'Поперечная мышца живота'],
    },
    OBLIQUES: {
      NAME: 'Косые мышцы',
      PARTS: ['Наружные косые', 'Внутренние косые'],
    },
    LOWER_BACK: {
      NAME: 'Поясница',
      PARTS: ['Разгибатели спины', 'Квадратная мышца поясницы'],
    },
  },
} as const;

const {
  BACK,
  CHEST,
  LEGS,
  ARMS,
  CORE
} = MUSCLE_GROUPS;

const BACK_MUSCLES: MuscleGroups = {
  name: BACK.NAME,
  groups: [
    {
      name: BACK.LATISSIMUS.NAME,
      parts: [...BACK.LATISSIMUS.PARTS],
    },
    {
      name: BACK.TRAPEZIUS.NAME,
      parts: [...BACK.TRAPEZIUS.PARTS],
    },
    {
      name: BACK.RHOMBOIDS.NAME,
      parts: [...BACK.RHOMBOIDS.PARTS],
    },
    {
      name: BACK.TERES_MAJOR.NAME,
      parts: [...BACK.TERES_MAJOR.PARTS],
    }
  ]
};

const CHEST_MUSCLES: MuscleGroups = {
  name: CHEST.NAME,
  groups: [
    {
      name: CHEST.PECTORALIS_MAJOR.NAME,
      parts: [...CHEST.PECTORALIS_MAJOR.PARTS],
    },
    {
      name: CHEST.PECTORALIS_MINOR.NAME,
      parts: [...CHEST.PECTORALIS_MINOR.PARTS],
    },
    {
      name: CHEST.SERRATUS_ANTERIOR.NAME,
      parts: [...CHEST.SERRATUS_ANTERIOR.PARTS],
    },
  ]
};

const LEGS_MUSCLES: MuscleGroups = {
  name: LEGS.NAME,
  groups: [
    {
      name: LEGS.QUADRICEPS.NAME,
      parts: [...LEGS.QUADRICEPS.PARTS],
    },
    {
      name: LEGS.HAMSTRINGS.NAME,
      parts: [...LEGS.HAMSTRINGS.PARTS],
    },
    {
      name: LEGS.GLUTES.NAME,
      parts: [...LEGS.GLUTES.PARTS],
    },
    {
      name: LEGS.CALVES.NAME,
      parts: [...LEGS.CALVES.PARTS],
    },
  ]
};

const ARMS_MUSCLES: MuscleGroups = {
  name: ARMS.NAME,
  groups: [
    {
      name: ARMS.BICEPS.NAME,
      parts: [...ARMS.BICEPS.PARTS],
    },
    {
      name: ARMS.TRICEPS.NAME,
      parts: [...ARMS.TRICEPS.PARTS],
    },
    {
      name: ARMS.FOREARMS.NAME,
      parts: [...ARMS.FOREARMS.PARTS],
    },
  ]
};

const CORE_MUSCLES: MuscleGroups = {
  name: CORE.NAME,
  groups: [
    {
      name: CORE.ABS.NAME,
      parts: [...CORE.ABS.PARTS],
    },
    {
      name: CORE.OBLIQUES.NAME,
      parts: [...CORE.OBLIQUES.PARTS],
    },
    {
      name: CORE.LOWER_BACK.NAME,
      parts: [...CORE.LOWER_BACK.PARTS],
    },
  ]
};

// Группы мышц и их детализация
export const MUSCLE_SELECTOR: MuscleGroups[] = [
  BACK_MUSCLES,
  CHEST_MUSCLES,
  LEGS_MUSCLES,
  ARMS_MUSCLES,
  CORE_MUSCLES
];

// Начальные данные оборудования
export const INITIAL_ITEMS: EquipmentItem[] = [
  { name: BARBELL, units: [] },
  { name: DUMBBELL_BAR, units: [] },
  { name: DUMBBELLS, units: [] },
  { name: PLATES, units: [] },
  { name: RESISTANCE_BANDS, units: [] }
];
