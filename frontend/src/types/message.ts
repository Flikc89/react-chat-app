/**
 * Сообщение в чате
 */
export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  text: string;
  createdAt: string;
  isOptimistic?: boolean;
}

/**
 * Последнее сообщение в чате (используется в списке чатов)
 */
export interface LastMessage {
  text: string;
  createdAt: string;
  senderId: string;
}

/**
 * Данные для отправки нового сообщения
 */
export interface SendMessageData {
  text: string;
}
