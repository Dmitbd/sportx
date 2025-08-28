import type { AIMessage, AIWorkoutResponse } from '@/types';
import axios from 'axios';
import { ERRORS } from '@/locales';

// TODO избавиться от не нужных обработок ошибки, пока надо все упростить
// TODO подумать над обработкой ошибок в запросе

export const askAI = async (messages: AIMessage[]): Promise<AIWorkoutResponse> => {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY_SECOND;

  if (!apiKey) {
    throw new Error(ERRORS.AI.MISSING_API_KEY);
  }

  // проксируем на наши моки
  const baseURL = import.meta.env.MODE === 'proxy'
    ? '/api/v1/chat/completions'
    : 'https://openrouter.ai/api/v1/chat/completions';

  try {
    const response = await axios.post(
      baseURL,
      {
        model: 'deepseek/deepseek-r1:free',
        messages,
        response_format: { type: 'json_object' },
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    // Извлекаем содержимое ответа
    const content = response.data.choices[0]?.message?.content;

    if (!content) {
      throw new Error(ERRORS.AI.NO_CONTENT);
    }

    return JSON.parse(content);
  } catch (error: unknown) {
    console.error(error);

    if (axios.isAxiosError(error)) {
      console.error('Response data:', error.response?.data);

      if (error.response?.status === 429) {
        throw new Error(ERRORS.COMMON.RATE_LIMIT);
      }
      if (error.response?.status === 401) {
        throw new Error(ERRORS.AI.INVALID_API_KEY);
      }

      throw new Error(ERRORS.COMMON.SERVER_ERROR);
    }

    if (error instanceof Error) {
      throw new Error(ERRORS.AI.AI_SERVICE_ERROR(error.message));
    }

    throw new Error(ERRORS.COMMON.UNKNOWN_ERROR);
  }
};
