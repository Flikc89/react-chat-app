import toast from 'react-hot-toast';
import { act, renderHook, waitFor } from '@testing-library/react';
import * as chatService from '../../services/chatService';
import * as messageService from '../../services/messageService';
import type { Chat, Message } from '../../types';
import { useChatStore } from '../useChatStore';

jest.mock('react-hot-toast');
jest.mock('../../services/chatService');
jest.mock('../../services/messageService');
jest.mock('../useSocketStore', () => ({
  useSocketStore: {
    getState: () => ({
      socket: null,
    }),
  },
}));

const mockGetChats = chatService.getChats as jest.MockedFunction<
  typeof chatService.getChats
>;
const mockGetMessages = messageService.getMessages as jest.MockedFunction<
  typeof messageService.getMessages
>;
const mockSendMessage = messageService.sendMessage as jest.MockedFunction<
  typeof messageService.sendMessage
>;

describe('useChatStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useChatStore.setState({
      chats: [],
      messagesByChatId: {},
      selectedUser: null,
      isUsersLoading: false,
      isMessagesLoading: {},
    });
  });

  describe('setSelectedUser', () => {
    it('устанавливает выбранного пользователя', () => {
      const { result } = renderHook(() => useChatStore());

      const chat: Chat = {
        _id: 'chat-1',
        fullName: 'Петр Петров',
        username: 'petr_petrov',
        email: 'petr@example.com',
        profilePic: '/avatar.svg',
      };

      act(() => {
        result.current.setSelectedUser(chat);
      });

      expect(result.current.selectedUser).toEqual(chat);
    });

    it('сбрасывает выбранного пользователя при передаче null', () => {
      const { result } = renderHook(() => useChatStore());

      const chat: Chat = {
        _id: 'chat-1',
        fullName: 'Петр Петров',
        username: 'petr_petrov',
        email: 'petr@example.com',
        profilePic: '/avatar.svg',
      };

      act(() => {
        result.current.setSelectedUser(chat);
      });

      act(() => {
        result.current.setSelectedUser(null);
      });

      expect(result.current.selectedUser).toBeNull();
    });
  });

  describe('loadChats', () => {
    it('загружает чаты успешно', async () => {
      const mockChats: Chat[] = [
        {
          _id: 'chat-1',
          fullName: 'Петр Петров',
          username: 'petr_petrov',
          email: 'petr@example.com',
          profilePic: '/avatar.svg',
        },
      ];

      mockGetChats.mockResolvedValue(mockChats);

      const { result } = renderHook(() => useChatStore());

      await act(async () => {
        await result.current.loadChats();
      });

      expect(result.current.chats).toEqual(mockChats);
      expect(result.current.isUsersLoading).toBe(false);
    });

    it('загружает чаты если они уже загружены один раз', async () => {
      const existingChats: Chat[] = [
        {
          _id: 'chat-1',
          fullName: 'Петр Петров',
          username: 'petr_petrov',
          email: 'petr@example.com',
          profilePic: '/avatar.svg',
        },
      ];

      useChatStore.setState({ chats: existingChats });

      const { result } = renderHook(() => useChatStore());

      await act(async () => {
        await result.current.loadChats();
      });

      expect(mockGetChats).toHaveBeenCalled();
    });

    it('обрабатывает ошибку при загрузке чатов', async () => {
      const error = new Error('Ошибка сети');
      mockGetChats.mockRejectedValue(error);

      const { result } = renderHook(() => useChatStore());

      await act(async () => {
        await result.current.loadChats();
      });

      expect(toast.error).toHaveBeenCalled();
      expect(result.current.isUsersLoading).toBe(false);
    });
  });

  describe('getMessagesByUserId', () => {
    it('загружает сообщения успешно', async () => {
      const mockMessages: Message[] = [
        {
          _id: '1',
          senderId: 'current-user',
          receiverId: 'chat-1',
          text: 'Привет!',
          createdAt: '2024-01-01T12:00:00.000Z',
        },
      ];

      mockGetMessages.mockResolvedValue(mockMessages);

      const { result } = renderHook(() => useChatStore());

      await act(async () => {
        await result.current.getMessagesByUserId('chat-1');
      });

      expect(result.current.messagesByChatId['chat-1']).toEqual(mockMessages);
      expect(result.current.isMessagesLoading['chat-1']).toBe(false);
    });

    it('использует кеш если сообщения уже загружены', async () => {
      const cachedMessages: Message[] = [
        {
          _id: '1',
          senderId: 'current-user',
          receiverId: 'chat-1',
          text: 'Привет!',
          createdAt: '2024-01-01T12:00:00.000Z',
        },
      ];

      useChatStore.setState({
        messagesByChatId: { 'chat-1': cachedMessages },
      });

      const { result } = renderHook(() => useChatStore());

      await act(async () => {
        await result.current.getMessagesByUserId('chat-1');
      });

      expect(mockGetMessages).toHaveBeenCalled();
    });

    it('обрабатывает ошибку при загрузке сообщений', async () => {
      const error = new Error('Ошибка сети');
      mockGetMessages.mockRejectedValue(error);

      useChatStore.setState({
        selectedUser: {
          _id: 'chat-1',
          fullName: 'Петр Петров',
          username: 'petr_petrov',
          email: 'petr@example.com',
          profilePic: '/avatar.svg',
        },
      });

      const { result } = renderHook(() => useChatStore());

      await act(async () => {
        await result.current.getMessagesByUserId('chat-1');
      });

      expect(toast.error).toHaveBeenCalled();
      expect(result.current.isMessagesLoading['chat-1']).toBe(false);
    });
  });

  describe('sendMessage', () => {
    it('отправляет сообщение с оптимистичным обновлением', async () => {
      const chat: Chat = {
        _id: 'chat-1',
        fullName: 'Петр Петров',
        username: 'petr_petrov',
        email: 'petr@example.com',
        profilePic: '/avatar.svg',
      };

      const sentMessage: Message = {
        _id: 'real-msg-id',
        senderId: 'current-user',
        receiverId: 'chat-1',
        text: 'Привет!',
        createdAt: '2024-01-01T12:00:00.000Z',
      };

      useChatStore.setState({
        selectedUser: chat,
        chats: [chat],
        messagesByChatId: {},
      });

      mockSendMessage.mockResolvedValue(sentMessage);

      const { result } = renderHook(() => useChatStore());

      await act(async () => {
        await result.current.sendMessage({ text: 'Привет!' });
      });

      const messages = result.current.messagesByChatId['chat-1'];
      expect(messages).toBeDefined();
      expect(messages?.some((msg) => msg._id === 'real-msg-id')).toBe(true);
    });

    it('откатывает оптимистичное обновление при ошибке', async () => {
      const chat: Chat = {
        _id: 'chat-1',
        fullName: 'Петр Петров',
        username: 'petr_petrov',
        email: 'petr@example.com',
        profilePic: '/avatar.svg',
      };

      const existingMessages: Message[] = [
        {
          _id: '1',
          senderId: 'current-user',
          receiverId: 'chat-1',
          text: 'Старое сообщение',
          createdAt: '2024-01-01T11:00:00.000Z',
        },
      ];

      useChatStore.setState({
        selectedUser: chat,
        chats: [chat],
        messagesByChatId: { 'chat-1': existingMessages },
      });

      const error = new Error('Ошибка сети');
      mockSendMessage.mockRejectedValue(error);

      const { result } = renderHook(() => useChatStore());

      await act(async () => {
        await result.current.sendMessage({ text: 'Новое сообщение' });
      });

      await waitFor(() => {
        const messages = result.current.messagesByChatId['chat-1'];
        expect(messages).toEqual(existingMessages);
      });

      expect(toast.error).toHaveBeenCalled();
    });

    it('не отправляет сообщение если нет выбранного пользователя', async () => {
      useChatStore.setState({
        selectedUser: null,
      });

      const { result } = renderHook(() => useChatStore());

      await act(async () => {
        await result.current.sendMessage({ text: 'Привет!' });
      });

      expect(mockSendMessage).not.toHaveBeenCalled();
    });
  });
});
