export const RU = {
  ACTIONS: {
    BACK: 'Назад',
    CONTINUE: 'Продолжить',
    SAVE: 'Сохранить',
    CANCEL: 'Отмена',
    DELETE: 'Удалить',
    RETRY: 'Попробовать снова',
    LOGIN: 'Войти',
    REGISTER: 'Регистрация',
  },

  AUTH: {
    TITLES: {
      LOGIN: 'Вход в систему',
      REGISTER: 'Регистрация',
    },
    LABELS: {
      EMAIL: 'Email',
      PASSWORD: 'Пароль',
      CONFIRM_PASSWORD: 'Подтвердите пароль',
    },
    CONTENT: {
      LOGIN_DESCRIPTION: 'Войдите в свой аккаунт для доступа к тренировкам',
      REGISTER_DESCRIPTION: 'Создайте аккаунт для начала работы с приложением',
    }
  },

  CREATE: {
    TITLES: {
      GUIDED: 'Создание программы тренировок',
      CONFIRM: 'Предлагаемый план тренировок',
    },
    CONTENT: {
      EXERCISES_COUNT: (count: string) => `Упражнений в тренировке: ${count}`,
      SETS_AND_REPS: (counts: string[]) => `${counts[0]} подходов х ${counts[1]} повторений`,
    },
    SECTIONS: {
      GENDER: 'Ваш пол',
      EXPERIENCE: 'Ваш уровень подготовки',
      WORKOUT_COUNT: 'Сколько тренировок в неделю?',
      MUSCLE_SELECTION: 'Какие мышцы хотите тренировать?',
      PLACE: 'Где вы планируете тренироваться?',
      HOME_EQUIPMENT: 'Есть ли у вас домашний инвентарь?',
      OUTDOOR_EQUIPMENT: 'Какой есть инвентарь на улице?',
    },
    LABELS: {
      WEIGHT: 'Укажите вес в кг.',
      WEIGHT_HELP: 'Для грамм указывайте (0.1)',
      TECHNIQUE: 'Техника выполнения',
      MUSCLES: 'Мышцы',
    },
    EXPERIENCE_LEVELS: {
      NOVICE: {
        TITLE: 'Новичок',
        DESCRIPTION: 'Тренируюсь меньше 6 месяцев или не тренируюсь совсем. Осваиваю базовые упражнения.',
      },
      INTERMEDIATE: {
        TITLE: 'Средний',
        DESCRIPTION: 'Тренируюсь от 6 месяцев до 2 лет. Знаю базовую технику, готов к умеренным нагрузкам.',
      },
      ADVANCED: {
        TITLE: 'Продвинутый',
        DESCRIPTION: 'Тренируюсь 2+ года. Владею техникой, хочу сложные комплексы и высокую интенсивность.',
      },
    },
    MESSAGES: {
      GYM_EQUIPMENT: 'Для этих тренировок будет учитываться инвентарь зала. При отсутствии инвентаря в зале, упражнения можно будет заменить на аналогичные.',
      OUTDOOR_DEVELOPMENT: 'Функция в разработке',
    },
    EQUIPMENT: {
      BARBELL: 'Гриф для штанги',
      DUMBBELL_BAR: 'Гриф для гантели',
      DUMBBELLS: 'Гантели',
      PLATES: 'Блины',
      RESISTANCE_BANDS: 'Резинки',
    },
    OPTIONS: {
      ACCEPT: ['Да', 'Нет'],
      GENDERS: ['Мужской', 'Женский'],
      PLACES: ['Дома', 'В зале', 'На улице'],
      TRAINING_DAYS: [1, 2, 3, 4, 5, 6, 7],
      SELECTION: {
        FULL_BODY: 'Все тело',
        SELECT_MUSCLES: 'Выбрать мышцы',
      },
    },
  },

  WORKOUTS: {
    TITLES: {
      LIST: 'Мои тренировки:',
      NEW_WORKOUT: 'Новая тренировка',
    },
    CONTENT: {
      CREATED: (date: string) => `Создано: ${date}`,
    },
    LABELS: {
      WEIGHT: 'вес в кг.',
      TECHNIQUE: 'Техника выполнения',
    },
    PLURALIZATION: {
      SETS_COUNT: 'Подходов',
      REPS_COUNT: 'повторов',
    },
    MESSAGES: {
      NO_WORKOUTS: 'У вас пока нет тренировок',
      UNSAVED_CHANGES: 'Есть несохраненные изменения',
      DELETE_CONFIRM: (name: string) => `Вы уверены, что хотите удалить ${name}?`,
      DELETE_CONFIRM_DESCRIPTION: 'Это действие нельзя отменить'
    },
  }
};
