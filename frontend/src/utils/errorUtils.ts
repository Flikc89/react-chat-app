import type { AxiosError } from 'axios';

interface ApiErrorResponse {
  error?: string;
}

/**
 * Извлекает сообщение об ошибке из объекта ошибки
 * Поддерживает axios ошибки (с response.data.error) и обычные Error объекты
 */
export function getErrorMessage(error: unknown): string | undefined {
  if (!error || typeof error !== 'object') {
    return undefined;
  }

  if ('response' in error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    return axiosError.response?.data?.error;
  }

  if ('message' in error && typeof error.message === 'string') {
    return error.message;
  }

  return undefined;
}
