import axios, { type AxiosInstance } from 'axios';

// Централизованный HTTP клиент
const httpClient: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Единая обработка ошибок
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('HTTP Error:', error);

    if (axios.isAxiosError(error)) {
      const { response } = error;
      
      switch (response?.status) {
        case 400:
          throw new Error(response.data?.message || 'Неверный запрос');
        case 401:
          throw new Error('Необходима авторизация');
        case 403:
          throw new Error('Доступ запрещен');
        case 404:
          throw new Error('Ресурс не найден');
        case 409:
          throw new Error(response.data?.message || 'Конфликт данных');
        case 429:
          throw new Error('Превышен лимит запросов. Попробуйте позже.');
        case 500:
          throw new Error('Ошибка сервера');
        default:
          throw new Error(response?.data?.message || 'Неизвестная ошибка');
      }
    }

    throw new Error(error.message || 'Неизвестная ошибка');
  }
);

export default httpClient;
