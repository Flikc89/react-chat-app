import { io } from 'socket.io-client';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { API_URL } from '../constants';
import type { SocketStore } from '../types';

export const useSocketStore = create<SocketStore>()(
  devtools(
    (set, get) => ({
      socket: null,

      connectSocket: () => {
        if (get().socket) return;

        const socket = io(API_URL, {
          withCredentials: true,
        });

        socket.connect();
        set({ socket });
      },

      disconnectSocket: () => {
        const socket = get().socket;
        if (socket?.connected) {
          socket.disconnect();
        }
      },
    }),
    { name: 'SocketStore' }
  )
);
