import { useCallback, useEffect, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useChatStore } from '../store/useChatStore';
import ChatHeader from './ChatHeader';
import MessageInput, { type MessageInputHandle } from './MessageInput';
import MessagesLoadingSkeleton from './MessagesLoadingSkeleton';
import NoChatHistoryPlaceholder from './NoChatHistoryPlaceholder';
import VirtualizedMessagesList from './VirtualizedMessagesList';

function ChatContainer() {
  const {
    selectedUser,
    messagesByChatId,
    isMessagesLoading,
    getMessagesByUserId,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore(
    useShallow((state) => ({
      selectedUser: state.selectedUser,
      messagesByChatId: state.messagesByChatId,
      isMessagesLoading: state.isMessagesLoading,
      getMessagesByUserId: state.getMessagesByUserId,
      subscribeToMessages: state.subscribeToMessages,
      unsubscribeFromMessages: state.unsubscribeFromMessages,
    }))
  );

  const messageInputRef = useRef<MessageInputHandle>(null);

  const handleQuickMessage = useCallback((text: string) => {
    messageInputRef.current?.setText(text);
  }, []);

  const chatId = selectedUser?._id;
  const messages = chatId ? messagesByChatId[chatId] || [] : [];
  const isLoading = chatId ? isMessagesLoading[chatId] || false : false;

  useEffect(() => {
    const currentUserId = selectedUser?._id;
    if (!currentUserId) return;

    getMessagesByUserId(currentUserId);
    subscribeToMessages();

    return () => {
      if (chatId) {
        unsubscribeFromMessages(chatId);
      }
    };
  }, [chatId]);

  return (
    <>
      <ChatHeader />
      <div className="bg-gray-800/70 flex-1 min-h-0">
        {isLoading && messages.length === 0 ? (
          <MessagesLoadingSkeleton />
        ) : messages.length > 0 ? (
          <VirtualizedMessagesList
            messages={messages}
            isMessagesLoading={isLoading}
            selectedChatId={selectedUser?._id}
          />
        ) : selectedUser ? (
          <NoChatHistoryPlaceholder
            name={selectedUser.fullName}
            onQuickMessage={handleQuickMessage}
          />
        ) : null}
      </div>

      <MessageInput ref={messageInputRef} />
    </>
  );
}

export default ChatContainer;
