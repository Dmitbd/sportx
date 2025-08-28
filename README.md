# Sportx

## Локальный запуск

- npm: 10.9.2
- node: 22.17.0

```bash
# Установка зависимостей
npm install

# Запросы в сервисы и ЛЛМ заменяются моками MSW, не требует api ключей моделей
npm run dev:proxy

# Запросы в сервисы и ЛЛМ не заменяются моками MSW, требует `.env` файл с переменными окружения
# VITE_OPENROUTER_API_KEY
# VITE_OPENROUTER_API_KEY_SECOND
npm run dev
```

## Стек проекта:
- React 18+ с TypeScript
- State management: Zustand
- Маршрутизация: React Router v6
- UI библиотека: Chakra UI
- Формы: React Hook Form + Yup
- API клиент: Axios
- Backend: имитация через Mock Service Worker (MSW)
- Функциональная библиотека: Remeda
- Структура папок feature-based
- Сборщик: Vite
