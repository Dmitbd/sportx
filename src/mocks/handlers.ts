import { HttpResponse, delay, http } from 'msw';
import aiResponse from './aiResponse.json';
import type { Training } from '@/types';

type LoginRequest = { email: string; password: string };
type RegisterRequest = { email: string; password: string };
type SaveWorkoutRequest = { workouts: Training[] };

export const handlers = [
  // Авторизация
  http.post('/api/auth/login', async ({ request }) => {
    const { email, password } = await request.json() as LoginRequest;
    await delay(200);

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
    await delay(200);

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
    await delay(100);
    return HttpResponse.json({ success: true }, { status: 200 });
  }),

  // Запрос к LLM
  http.post('/api/v1/chat/completions', async () => {
    await delay(1000);
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
    await delay(500);

    // Валидация данных
    if (!workouts || !Array.isArray(workouts) || workouts.length === 0) {
      return HttpResponse.json(
        { message: 'Неверные данные тренировки' },
        { status: 400 }
      );
    }

    // Успешное сохранение
    return new HttpResponse(null, { status: 201 });
  })
];
