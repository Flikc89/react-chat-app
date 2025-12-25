import { act, renderHook } from '@testing-library/react';
import { io } from 'socket.io-client';
import { API_URL } from '../../constants';
import { useSocketStore } from '../useSocketStore';

jest.mock('socket.io-client');

const mockIo = io as jest.MockedFunction<typeof io>;
const mockSocket = {
  connect: jest.fn(),
  disconnect: jest.fn(),
  connected: true,
  on: jest.fn(),
  off: jest.fn(),
  emit: jest.fn(),
  once: jest.fn(),
} as any;

describe('useSocketStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useSocketStore.setState({ socket: null });
    mockIo.mockReturnValue(mockSocket);
  });

  describe('connectSocket', () => {
    it('создает и подключает сокет при первом вызове', () => {
      const { result } = renderHook(() => useSocketStore());

      act(() => {
        result.current.connectSocket();
      });

      expect(mockIo).toHaveBeenCalledWith(API_URL, {
        withCredentials: true,
      });
      expect(mockSocket.connect).toHaveBeenCalled();
      expect(result.current.socket).toBe(mockSocket);
    });

    it('не создает новый сокет если он уже существует', () => {
      const { result } = renderHook(() => useSocketStore());

      act(() => {
        result.current.connectSocket();
      });

      const firstCallCount = mockIo.mock.calls.length;

      act(() => {
        result.current.connectSocket();
      });

      expect(mockIo.mock.calls.length).toBe(firstCallCount);
      expect(mockSocket.connect).toHaveBeenCalledTimes(1);
    });

    it('сохраняет сокет в store', () => {
      const { result } = renderHook(() => useSocketStore());

      act(() => {
        result.current.connectSocket();
      });

      expect(result.current.socket).toBe(mockSocket);
    });
  });

  describe('disconnectSocket', () => {
    it('отключает сокет если он подключен', () => {
      const { result } = renderHook(() => useSocketStore());

      act(() => {
        result.current.connectSocket();
      });

      act(() => {
        result.current.disconnectSocket();
      });

      expect(mockSocket.disconnect).toHaveBeenCalled();
    });

    it('не вызывает disconnect если сокет не подключен', () => {
      const disconnectedSocket = {
        ...mockSocket,
        connected: false,
      };

      useSocketStore.setState({ socket: disconnectedSocket });

      const { result } = renderHook(() => useSocketStore());

      act(() => {
        result.current.disconnectSocket();
      });

      expect(disconnectedSocket.disconnect).not.toHaveBeenCalled();
    });

    it('не вызывает ошибку если сокет отсутствует', () => {
      useSocketStore.setState({ socket: null });

      const { result } = renderHook(() => useSocketStore());

      act(() => {
        result.current.disconnectSocket();
      });

      expect(mockSocket.disconnect).not.toHaveBeenCalled();
    });
  });

  describe('интеграция connect/disconnect', () => {
    it('корректно работает последовательность подключения и отключения', () => {
      const { result } = renderHook(() => useSocketStore());

      act(() => {
        result.current.connectSocket();
      });

      expect(result.current.socket).toBe(mockSocket);

      act(() => {
        result.current.disconnectSocket();
      });

      expect(mockSocket.disconnect).toHaveBeenCalled();
    });
  });
});
