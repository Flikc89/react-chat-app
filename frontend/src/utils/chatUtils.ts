import { CURRENT_USER_ID } from '../constants';
import type { Chat, LastMessage, Message } from '../types';

/**
 * Создает объект lastMessage из объекта Message
 */
export function createLastMessage(message: Message): LastMessage {
  return {
    text: message.text,
    createdAt: message.createdAt,
    senderId: message.senderId,
  };
}

export interface UpdateChatLastMessageParams {
  chats: Chat[];
  chatId: string;
  lastMessage: LastMessage | undefined;
}

/**
 * Обновляет lastMessage для чата в массиве чатов
 */
export function updateChatLastMessage({
  chats,
  chatId,
  lastMessage,
}: UpdateChatLastMessageParams): Chat[] {
  return chats.map((chat) =>
    chat._id === chatId ? { ...chat, lastMessage } : chat
  );
}

export interface CreateOptimisticMessageParams {
  receiverId: string;
  text: string;
}

/**
 * Создает оптимистичное сообщение для немедленного отображения в UI
 */
export function createOptimisticMessage({
  receiverId,
  text,
}: CreateOptimisticMessageParams): Message {
  const now = new Date();
  return {
    _id: `temp-${now.getTime()}`,
    senderId: CURRENT_USER_ID,
    receiverId,
    text,
    createdAt: now.toISOString(),
    isOptimistic: true,
  };
}

/**
 * Определяет ID чата на основе сообщения и текущего пользователя
 */
export function getChatIdFromMessage(message: Message): string {
  return message.senderId === CURRENT_USER_ID
    ? message.receiverId
    : message.senderId;
}

export interface ReplaceTemporaryMessageParams {
  messages: Message[];
  tempId: string;
  realMessage: Message;
}

/**
 * Заменяет временное сообщение на реальное в массиве сообщений
 */
export function replaceTemporaryMessage({
  messages,
  tempId,
  realMessage,
}: ReplaceTemporaryMessageParams): Message[] {
  return messages.filter((msg) => msg._id !== tempId).concat(realMessage);
}
