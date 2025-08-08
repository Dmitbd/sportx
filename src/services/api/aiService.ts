import type { AIMessage, AIWorkoutResponse } from '@/types';
import axios from 'axios';

// TODO избавиться от не нужных обработок ошибки, пока надо все упростить
// TODO подумать над обработкой ошибок в запросе

export const askAI = async (messages: AIMessage[]): Promise<AIWorkoutResponse> => {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY_SECOND;

  if (!apiKey) {
    throw new Error('OpenRouter API key is missing');
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
      throw new Error('ИИ не вернул содержимое ответа');
    }

    return JSON.parse(content);
  } catch (error: unknown) {
    console.error(error);

    if (axios.isAxiosError(error)) {
      console.error('Response data:', error.response?.data);

      if (error.response?.status === 429) {
        throw new Error('Превышен лимит запросов. Попробуйте позже.');
      }
      if (error.response?.status === 401) {
        throw new Error('Неверный API ключ');
      }

      throw new Error(`Ошибка сервера: ${error.response?.status}`);
    }

    if (error instanceof Error) {
      throw new Error(`Ошибка при обращении к ИИ-сервису: ${error.message}`);
    }

    throw new Error('Неизвестная ошибка при обращении к ИИ-сервису');
  }
};
