import { axiosInstance } from '../../lib/axios';
import type { Chat } from '../../types';
import { getChats } from '../chatService';

jest.mock('../../lib/axios');

const mockAxiosInstance = axiosInstance as jest.Mocked<typeof axiosInstance>;

describe('chatService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getChats', () => {
    it('успешно получает список чатов', async () => {
      const mockChats: Chat[] = [
        {
          _id: 'chat-1',
          fullName: 'Петр Петров',
          username: 'petr_petrov',
          email: 'petr@example.com',
          profilePic: '/avatar.jpg',
        },
        {
          _id: 'chat-2',
          fullName: 'Иван Иванов',
          username: 'ivan_ivanov',
          email: 'ivan@example.com',
        },
      ];

      mockAxiosInstance.get.mockResolvedValue({
        data: mockChats,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      });

      const result = await getChats();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/chats');
      expect(result).toEqual(mockChats);
    });

    it('обрабатывает ошибку при получении чатов', async () => {
      const error = new Error('Ошибка сети');
      mockAxiosInstance.get.mockRejectedValue(error);

      await expect(getChats()).rejects.toThrow('Ошибка сети');
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/chats');
    });

    it('обрабатывает пустой массив чатов', async () => {
      mockAxiosInstance.get.mockResolvedValue({
        data: [],
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      });

      const result = await getChats();

      expect(result).toEqual([]);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/chats');
    });
  });
});
