import { axiosInstance } from '../../lib/axios';
import type { Message, SendMessageData } from '../../types';
import { getMessages, sendMessage } from '../messageService';

jest.mock('../../lib/axios');

const mockAxiosInstance = axiosInstance as jest.Mocked<typeof axiosInstance>;

describe('messageService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getMessages', () => {
    it('успешно получает сообщения для чата', async () => {
      const chatId = 'chat-1';
      const mockMessages: Message[] = [
        {
          _id: 'msg-1',
          senderId: 'current-user',
          receiverId: chatId,
          text: 'Привет!',
          createdAt: '2024-01-01T12:00:00.000Z',
        },
        {
          _id: 'msg-2',
          senderId: chatId,
          receiverId: 'current-user',
          text: 'Привет! Как дела?',
          createdAt: '2024-01-01T12:01:00.000Z',
        },
      ];

      mockAxiosInstance.get.mockResolvedValue({
        data: mockMessages,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      });

      const result = await getMessages(chatId);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/messages/${chatId}`);
      expect(result).toEqual(mockMessages);
    });

    it('обрабатывает ошибку при получении сообщений', async () => {
      const chatId = 'chat-1';
      const error = new Error('Ошибка сети');
      mockAxiosInstance.get.mockRejectedValue(error);

      await expect(getMessages(chatId)).rejects.toThrow('Ошибка сети');
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/messages/${chatId}`);
    });

    it('обрабатывает пустой массив сообщений', async () => {
      const chatId = 'chat-1';
      mockAxiosInstance.get.mockResolvedValue({
        data: [],
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      });

      const result = await getMessages(chatId);

      expect(result).toEqual([]);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/messages/${chatId}`);
    });
  });

  describe('sendMessage', () => {
    it('успешно отправляет сообщение', async () => {
      const chatId = 'chat-1';
      const messageData: SendMessageData = {
        text: 'Привет!',
      };

      const sentMessage: Message = {
        _id: 'msg-1',
        senderId: 'current-user',
        receiverId: chatId,
        text: 'Привет!',
        createdAt: '2024-01-01T12:00:00.000Z',
      };

      mockAxiosInstance.post.mockResolvedValue({
        data: sentMessage,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      });

      const result = await sendMessage(chatId, messageData);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        `/messages/send/${chatId}`,
        messageData
      );
      expect(result).toEqual(sentMessage);
    });

    it('обрабатывает ошибку при отправке сообщения', async () => {
      const chatId = 'chat-1';
      const messageData: SendMessageData = {
        text: 'Привет!',
      };
      const error = new Error('Ошибка сети');
      mockAxiosInstance.post.mockRejectedValue(error);

      await expect(sendMessage(chatId, messageData)).rejects.toThrow(
        'Ошибка сети'
      );
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        `/messages/send/${chatId}`,
        messageData
      );
    });

    it('отправляет сообщение с правильными параметрами', async () => {
      const chatId = 'chat-1';
      const messageData: SendMessageData = {
        text: 'Тестовое сообщение',
      };

      const sentMessage: Message = {
        _id: 'msg-1',
        senderId: 'current-user',
        receiverId: chatId,
        text: 'Тестовое сообщение',
        createdAt: '2024-01-01T12:00:00.000Z',
      };

      mockAxiosInstance.post.mockResolvedValue({
        data: sentMessage,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      });

      await sendMessage(chatId, messageData);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        `/messages/send/${chatId}`,
        messageData
      );
    });
  });
});
