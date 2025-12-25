import toast from 'react-hot-toast';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { getChats } from '../services';
import {
  getMessages,
  sendMessage as sendMessageService,
} from '../services/messageService';
import type {
  Chat,
  ChatStore,
  LastMessage,
  Message,
  SendMessageData,
} from '../types';
import {
  createLastMessage,
  createOptimisticMessage,
  findChatById,
  getChatIdFromMessage,
  replaceTemporaryMessage,
  updateChatLastMessage,
} from '../utils/chatUtils';
import { getErrorMessage } from '../utils/errorUtils';
import { useSocketStore } from './useSocketStore';

export const useChatStore = create<ChatStore>()(
  devtools(
    (set, get) => ({
      chats: [],
      messagesByChatId: {},
      selectedUser: null,
      isUsersLoading: false,
      isMessagesLoading: {},

      setSelectedUser: (selectedUser: Chat | null) => {
        set({ selectedUser });
      },

      loadChats: async (initialChatId) => {
        const { isUsersLoading, chats } = get();
        if (isUsersLoading || chats.length > 0) {
          return;
        }

        set({ isUsersLoading: true });
        try {
          const chatsData = await getChats();
          set({ chats: chatsData });

          if (initialChatId) {
            const chat = findChatById(chatsData, initialChatId);
            set({ selectedUser: chat });
          }
        } catch (error: unknown) {
          const errorMessage = getErrorMessage(error);
          toast.error(errorMessage || 'Ошибка загрузки чатов');
        }
        set({ isUsersLoading: false });
      },

      getMessagesByUserId: async (userId: string) => {
        const { messagesByChatId } = get();

        const hasCache = (messagesByChatId[userId]?.length ?? 0) > 0;
        if (!hasCache) {
          set((state) => ({
            messagesByChatId: { ...state.messagesByChatId, [userId]: [] },
            isMessagesLoading: { ...state.isMessagesLoading, [userId]: true },
          }));
        }

        try {
          const messagesData = await getMessages(userId);
          set((state) => ({
            messagesByChatId: {
              ...state.messagesByChatId,
              [userId]: messagesData,
            },
            isMessagesLoading: { ...state.isMessagesLoading, [userId]: false },
          }));
        } catch (error: unknown) {
          const currentSelectedUser = get().selectedUser;
          if (currentSelectedUser?._id === userId) {
            const errorMessage = getErrorMessage(error);
            toast.error(errorMessage || 'Что-то пошло не так');
          }
          set((state) => ({
            isMessagesLoading: { ...state.isMessagesLoading, [userId]: false },
          }));
        }
      },

      sendMessage: async (messageData: SendMessageData) => {
        const { selectedUser, messagesByChatId, chats } = get();
        if (!selectedUser) return;

        const chatId = selectedUser._id;
        const currentMessages = messagesByChatId[chatId] || [];

        const optimisticMessage = createOptimisticMessage({
          receiverId: selectedUser._id,
          text: messageData.text,
        });
        const tempId = optimisticMessage._id;

        set((state) => ({
          messagesByChatId: {
            ...state.messagesByChatId,
            [chatId]: [...currentMessages, optimisticMessage],
          },
          chats: updateChatLastMessage({
            chats: state.chats,
            chatId,
            lastMessage: createLastMessage(optimisticMessage),
          }),
        }));

        try {
          const sentMessage = await sendMessageService(
            selectedUser._id,
            messageData
          );

          const updatedMessages = get().messagesByChatId[chatId] || [];
          set((state) => ({
            messagesByChatId: {
              ...state.messagesByChatId,
              [chatId]: replaceTemporaryMessage({
                messages: updatedMessages,
                tempId,
                realMessage: sentMessage,
              }),
            },
            chats: updateChatLastMessage({
              chats: state.chats,
              chatId,
              lastMessage: createLastMessage(sentMessage),
            }),
          }));
        } catch (error: unknown) {
          const previousLastMessage = findChatById(chats, chatId)?.lastMessage;
          const errorMessage = getErrorMessage(error);
          toast.error(errorMessage || 'Не удалось отправить сообщение');
          set((state) => ({
            messagesByChatId: {
              ...state.messagesByChatId,
              [chatId]: currentMessages,
            },
            chats: updateChatLastMessage({
              chats: state.chats,
              chatId,
              lastMessage: previousLastMessage,
            }),
          }));
        }
      },

      subscribeToChatList: () => {
        const socket = useSocketStore.getState().socket;
        if (!socket) return;

        const setupSubscription = () => {
          socket.off('chatListUpdate');
          socket.on(
            'chatListUpdate',
            (data: {
              chatId: string;
              lastMessage: LastMessage;
              updatedAt: string;
            }) => {
              set((state) => ({
                chats: updateChatLastMessage({
                  chats: state.chats,
                  chatId: data.chatId,
                  lastMessage: data.lastMessage,
                }),
              }));
            }
          );
        };

        if (socket.connected) {
          setupSubscription();
        } else {
          socket.once('connect', () => {
            setupSubscription();
          });
        }
      },

      unsubscribeFromChatList: () => {
        const socket = useSocketStore.getState().socket;
        if (!socket) return;

        socket.off('chatListUpdate');
      },

      subscribeToMessages: () => {
        const socket = useSocketStore.getState().socket;
        if (!socket || !socket.connected) return;

        const { selectedUser } = get();
        if (!selectedUser?._id) return;

        socket.off('newMessage');
        socket.emit('subscribeToChat', selectedUser._id);
        socket.on('newMessage', (newMessage: Message) => {
          const { messagesByChatId, selectedUser: currentSelectedUser } = get();

          if (!currentSelectedUser?._id) return;

          const chatId = getChatIdFromMessage(newMessage);
          if (chatId === currentSelectedUser._id) {
            const currentMessages = messagesByChatId[chatId] || [];
            set((state) => ({
              messagesByChatId: {
                ...state.messagesByChatId,
                [chatId]: [...currentMessages, newMessage],
              },
              chats: updateChatLastMessage({
                chats: state.chats,
                chatId,
                lastMessage: createLastMessage(newMessage),
              }),
            }));
          }
        });
      },

      unsubscribeFromMessages: (chatId: string) => {
        const socket = useSocketStore.getState().socket;
        if (!socket) return;

        if (chatId) {
          socket.emit('unsubscribeFromChat', chatId);
        }

        socket.off('newMessage');
      },
    }),
    { name: 'ChatStore' }
  )
);
