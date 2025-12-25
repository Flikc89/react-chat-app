import { axiosInstance } from '../lib/axios';
import type { Message, SendMessageData } from '../types';

/**
 * Сервис для работы с сообщениями
 */

/**
 * Получить сообщения для конкретного чата
 * @param {string} chatId - ID чата
 * @returns {Promise<Message[]>} Массив сообщений
 */
export const getMessages = async (chatId: string): Promise<Message[]> => {
  const response = await axiosInstance.get<Message[]>(`/messages/${chatId}`);
  return response.data;
};

/**
 * Отправить сообщение в чат
 * @param {string} chatId - ID чата
 * @param {SendMessageData} messageData - Данные сообщения
 * @returns {Promise<Message>} Отправленное сообщение
 */
export const sendMessage = async (
  chatId: string,
  messageData: SendMessageData
): Promise<Message> => {
  const response = await axiosInstance.post<Message>(
    `/messages/send/${chatId}`,
    messageData
  );
  return response.data;
};
