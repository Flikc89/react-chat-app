import type { Socket } from 'socket.io-client';
import type { Chat } from './chat';
import type { Message, SendMessageData } from './message';

/**
 * Store для управления WebSocket подключением
 */
export interface SocketStore {
  socket: Socket | null;
  connectSocket: () => void;
  disconnectSocket: () => void;
}

/**
 * Store для управления чатами и сообщениями
 */
export interface ChatStore {
  chats: Chat[];
  messagesByChatId: Record<string, Message[]>;
  selectedUser: Chat | null;
  isUsersLoading: boolean;
  isMessagesLoading: Record<string, boolean>;
  setSelectedUser: (selectedUser: Chat | null) => void;
  loadChats: (chatId?: string) => Promise<void>;
  getMessagesByUserId: (userId: string) => Promise<void>;
  sendMessage: (messageData: SendMessageData) => Promise<void>;
  subscribeToChatList: () => void;
  unsubscribeFromChatList: () => void;
  subscribeToMessages: () => void;
  unsubscribeFromMessages: (chatId: string) => void;
}
