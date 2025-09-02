import { HttpResponse, delay, http } from 'msw';
import aiResponse from './aiResponse.json';
import type { Training, UpdateWorkoutSets } from '@/types';

type LoginRequest = { email: string; password: string };
type RegisterRequest = { email: string; password: string };
type SaveWorkoutRequest = { workouts: Training[] };
type Workout = {
  id: string;
  title: string;
  exercises: string[];
  createdAt: Date;
};

const DELAY_TIMER = 1000;

export const handlers = [
  // Авторизация
  http.post('/api/auth/login', async ({ request }) => {
    const { email, password } = await request.json() as LoginRequest;
    await delay(DELAY_TIMER);

    // Валидация данных
    if (email === 'user@test.com' && password === '12345') {
      return HttpResponse.json(
        { id: 1, email, name: 'Тестовый Пользователь' },
        { status: 200 }
      );
    }

    return HttpResponse.json(
      { message: 'Неверный email или пароль' },
      { status: 401 }
    );
  }),

  // Регистрация
  http.post('/api/auth/register', async ({ request }) => {
    const { email, password } = await request.json() as RegisterRequest;
    await delay(DELAY_TIMER);

    // Валидация данных
    if (!email || !password) {
      return HttpResponse.json(
        { message: 'Все поля обязательны' },
        { status: 400 }
      );
    }

    // Проверка уникальности email (имитация)
    if (email === 'exists@test.com') {
      return HttpResponse.json(
        { message: 'Email уже занят' },
        { status: 409 }
      );
    }

    // Успешная регистрация
    return HttpResponse.json(
      { id: Date.now(), email },
      { status: 201 }
    );
  }),

  // Выход
  http.post('/api/auth/logout', async () => {
    await delay(DELAY_TIMER);
    return HttpResponse.json({ success: true }, { status: 200 });
  }),

  // Запрос к LLM
  http.post('/api/v1/chat/completions', async () => {
    await delay(DELAY_TIMER);
    return HttpResponse.json({
      choices: [
        {
          message: {
            content: JSON.stringify(aiResponse)
          }
        }
      ]
    }, { status: 200 });
  }),

  // Сохранение тренировки
  http.post('/api/workouts/create/confirm', async ({ request }) => {
    const { workouts } = await request.json() as SaveWorkoutRequest;
    await delay(DELAY_TIMER);

    // Валидация данных
    if (!workouts || !Array.isArray(workouts) || workouts.length === 0) {
      return HttpResponse.json(
        { message: 'Неверные данные тренировки' },
        { status: 400 }
      );
    }

    // Успешное сохранение
    return new HttpResponse(null, { status: 201 });
  }),

  // Получение тренировок пользователя
  http.get('/api/workouts', async () => {
    await delay(DELAY_TIMER);

    // Имитация данных тренировок
    const mockWorkouts: Workout[] = [
      {
        id: '1',
        title: 'Силовая тренировка',
        exercises: ['Жим лёжа', 'Приседания', 'Тяга'],
        createdAt: new Date('2023-05-15')
      },
      {
        id: '2',
        title: 'Кардио сессия',
        exercises: ['Бег', 'Велосипед'],
        createdAt: new Date('2023-05-10')
      },
      {
        id: '3',
        title: 'Домашняя тренировка с резинкой',
        exercises: ['Приседания с резинкой', 'Отведение бедра', 'Разведение рук'],
        createdAt: new Date('2023-05-08')
      },
      {
        id: '4',
        title: 'Тренировка 4',
        exercises: ['Смеяться', 'Прыгать', 'Плакать'],
        createdAt: new Date('2023-05-08')
      },
      {
        id: '5',
        title: 'Тренировка 5',
        exercises: ['Драться', 'Крутиться', 'Вертеться'],
        createdAt: new Date('2023-05-08')
      }
    ];

    return HttpResponse.json(mockWorkouts, { status: 200 });
  }),

  // Получение тренировки по id
  http.get('/api/workouts/:id', async ({ params }) => {
    await delay(DELAY_TIMER);
    const { id } = params;
    const mockTrainings: Training[] = [
      {
        name: 'Силовая тренировка',
        exercises: [
          { name: 'Жим лёжа', description: 'Жим штанги лёжа', sets: [[0, 8], [0, 8], [0, 8], [0, 8]], muscles: ['грудные', 'трицепс'] },
          { name: 'Приседания', description: 'Классические приседания', sets: [[0, 10], [0, 10], [0, 10], [0, 10]], muscles: ['квадрицепс', 'ягодицы'] },
        ]
      },
      {
        name: 'Кардио сессия',
        exercises: [
          { name: 'Бег', description: 'Бег на дорожке', sets: [[0, 30]], muscles: ['сердце', 'ноги'] },
        ]
      },
      {
        name: 'Домашняя тренировка с резинкой',
        exercises: [
          { name: 'Приседания с резинкой', description: 'Приседания с эспандером', sets: [[0, 12], [0, 12], [0, 12], [0, 12]], muscles: ['ягодицы', 'бедра'] },
        ]
      }
    ];
    const idx = ['1', '2', '3'].indexOf(id as string);
    const training = mockTrainings[idx];
    if (!training) {
      return HttpResponse.json({ message: 'Тренировка не найдена' }, { status: 404 });
    }
    return HttpResponse.json(training, { status: 200 });
  }),

  // Сохранение изменений в подходах упражнения
  http.patch('/api/workouts/:id/sets', async ({ request, params }) => {
    await delay(DELAY_TIMER);
    const { id } = params;

    const body = await request.json() as UpdateWorkoutSets;

    if (!id || !body || !Array.isArray(body.exercises)) {
      return HttpResponse.json({ message: 'Неверные данные' }, { status: 400 });
    }

    // Возвращаем обновленные данные, как должен делать реальный бэкенд
    return HttpResponse.json({
      exercises: body.exercises
    }, { status: 200 });
  }),

  // Удаление тренировки
  http.delete('/api/workouts/:id', async ({ params }) => {
    await delay(DELAY_TIMER);
    const { id } = params;

    if (!id) {
      return HttpResponse.json({ message: 'ID тренировки не указан' }, { status: 400 });
    }

    // Проверяем существование тренировки (имитация)
    const validIds = ['1', '2', '3'];
    if (!validIds.includes(id as string)) {
      return HttpResponse.json({ message: 'Тренировка не найдена' }, { status: 404 });
    }

    // Успешное удаление
    return HttpResponse.json({ message: 'Тренировка удалена' }, { status: 200 });
  })
];
