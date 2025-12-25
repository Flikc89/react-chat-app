import { axiosInstance } from '../lib/axios';
import type { Chat } from '../types';

/**
 * Сервис для работы с чатами
 */

/**
 * Получить список чатов с последними сообщениями
 * @returns {Promise<Chat[]>} Массив чатов
 */
export const getChats = async (): Promise<Chat[]> => {
  const response = await axiosInstance.get<Chat[]>('/chats');
  return response.data;
};
