// Централизованные ошибки
export const ERRORS = {
  // Общие ошибки
  COMMON: {
    ERROR: 'Ошибка',
    UNKNOWN_ERROR: 'Неизвестная ошибка',
    REQUIRED_FIELDS: 'Все поля обязательны',
    RATE_LIMIT: 'Превышен лимит запросов. Попробуйте позже.',
    SERVER_ERROR: 'Ошибка сервера',
    NO_CHANGES: 'Нет изменений',
    CHANGES_SAVED: 'Изменения сохранены',
  },

  // Ошибки авторизации
  AUTH: {
    INVALID_CREDENTIALS: 'Неверный email или пароль',
    EMAIL_EXISTS: 'Email уже занят',
    UNAUTHORIZED: 'Необходима авторизация',
  },

  // Ошибки тренировок
  WORKOUTS: {
    LOAD_ERROR: 'Ошибка загрузки тренировок',
    SAVE_ERROR: 'Ошибка сохранения',
    DELETE_ERROR: 'Ошибка удаления',
    NOT_FOUND: 'Тренировка не найдена',
  },

  // Ошибки создания
  CREATE: {
    WEIGHT_ERROR: 'Некорректное значение веса',
  },

  // Ошибки AI сервиса
  AI: {
    MISSING_API_KEY: 'Отсутствует API ключ',
    NO_CONTENT: 'ИИ не вернул содержимое ответа',
    INVALID_API_KEY: 'Неверный API ключ',
    AI_SERVICE_ERROR: (error: string) => `Ошибка при обращении к ИИ-сервису: ${error}`,
  },

  // Ошибки HTTP
  HTTP: {
    BAD_REQUEST: 'Неверный запрос',
    FORBIDDEN: 'Доступ запрещен',
    NOT_FOUND: 'Ресурс не найден',
    CONFLICT: 'Конфликт данных',
    DEFAULT_ERROR: (error: string) => `Ошибка: ${error}`,
  },
} as const;
