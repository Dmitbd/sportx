import { HttpResponse, delay, http } from 'msw';

type LoginRequest = { email: string; password: string };
type RegisterRequest = { email: string; password: string };

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
  })
];
