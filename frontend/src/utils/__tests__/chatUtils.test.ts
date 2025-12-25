import { CURRENT_USER_ID } from '../../constants';
import type { Chat, LastMessage, Message } from '../../types';
import {
  createLastMessage,
  createOptimisticMessage,
  getChatIdFromMessage,
  updateChatLastMessage,
} from '../chatUtils';

describe('chatUtils', () => {
  describe('createLastMessage', () => {
    it('создает lastMessage из Message', () => {
      const message: Message = {
        _id: '1',
        senderId: CURRENT_USER_ID,
        receiverId: 'other-user',
        text: 'Привет!',
        createdAt: '2024-01-01T12:00:00.000Z',
      };

      const lastMessage = createLastMessage(message);

      expect(lastMessage).toEqual({
        text: 'Привет!',
        createdAt: '2024-01-01T12:00:00.000Z',
        senderId: CURRENT_USER_ID,
      });
    });
  });

  describe('updateChatLastMessage', () => {
    it('обновляет lastMessage для указанного чата', () => {
      const chats: Chat[] = [
        {
          _id: 'chat-1',
          fullName: 'Пользователь 1',
          username: 'user1',
          email: 'user1@example.com',
          profilePic: '/avatar.svg',
        },
        {
          _id: 'chat-2',
          fullName: 'Пользователь 2',
          username: 'user2',
          email: 'user2@example.com',
          profilePic: '/avatar.svg',
        },
      ];

      const lastMessage: LastMessage = {
        text: 'Новое сообщение',
        createdAt: '2024-01-01T12:00:00.000Z',
        senderId: CURRENT_USER_ID,
      };

      const updatedChats = updateChatLastMessage({
        chats,
        chatId: 'chat-1',
        lastMessage,
      });

      expect(updatedChats[0]?.lastMessage).toEqual(lastMessage);
      expect(updatedChats[1]?.lastMessage).toBeUndefined();
    });

    it('не изменяет другие чаты', () => {
      const chats: Chat[] = [
        {
          _id: 'chat-1',
          fullName: 'Пользователь 1',
          username: 'user1',
          email: 'user1@example.com',
          profilePic: '/avatar.svg',
        },
      ];

      const lastMessage: LastMessage = {
        text: 'Новое сообщение',
        createdAt: '2024-01-01T12:00:00.000Z',
        senderId: CURRENT_USER_ID,
      };

      const updatedChats = updateChatLastMessage({
        chats,
        chatId: 'chat-1',
        lastMessage,
      });

      expect(updatedChats[0]?.fullName).toBe('Пользователь 1');
      expect(updatedChats[0]?.username).toBe('user1');
    });
  });

  describe('createOptimisticMessage', () => {
    it('создает оптимистичное сообщение с правильными полями', () => {
      const message = createOptimisticMessage({
        receiverId: 'other-user',
        text: 'Оптимистичное сообщение',
      });

      expect(message.senderId).toBe(CURRENT_USER_ID);
      expect(message.receiverId).toBe('other-user');
      expect(message.text).toBe('Оптимистичное сообщение');
      expect(message.isOptimistic).toBe(true);
      expect(message._id).toMatch(/^temp-/);
      expect(message.createdAt).toBeDefined();
    });
  });

  describe('getChatIdFromMessage', () => {
    it('возвращает receiverId если сообщение от текущего пользователя', () => {
      const message: Message = {
        _id: '1',
        senderId: CURRENT_USER_ID,
        receiverId: 'other-user',
        text: 'Привет!',
        createdAt: '2024-01-01T12:00:00.000Z',
      };

      const chatId = getChatIdFromMessage(message);

      expect(chatId).toBe('other-user');
    });

    it('возвращает senderId если сообщение от другого пользователя', () => {
      const message: Message = {
        _id: '1',
        senderId: 'other-user',
        receiverId: CURRENT_USER_ID,
        text: 'Привет!',
        createdAt: '2024-01-01T12:00:00.000Z',
      };

      const chatId = getChatIdFromMessage(message);

      expect(chatId).toBe('other-user');
    });
  });
});
