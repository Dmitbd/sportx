import axios, { type AxiosInstance } from 'axios';
import { ERRORS } from '@/locales';

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
          throw new Error(response.data?.message || ERRORS.HTTP.BAD_REQUEST);
        case 401:
          throw new Error(ERRORS.AUTH.UNAUTHORIZED);
        case 403:
          throw new Error(ERRORS.HTTP.FORBIDDEN);
        case 404:
          throw new Error(ERRORS.HTTP.NOT_FOUND);
        case 409:
          throw new Error(response.data?.message || ERRORS.HTTP.CONFLICT);
        case 429:
          throw new Error(ERRORS.COMMON.RATE_LIMIT);
        case 500:
          throw new Error(ERRORS.COMMON.SERVER_ERROR);
        default:
          throw new Error(ERRORS.HTTP.DEFAULT_ERROR(response?.data?.message ?? ERRORS.COMMON.UNKNOWN_ERROR));
      }
    }

    throw new Error(ERRORS.HTTP.DEFAULT_ERROR(error.message));
  }
);

export default httpClient;
