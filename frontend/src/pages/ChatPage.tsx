import { useEffect } from 'react';
import { useParams } from 'react-router';
import { useShallow } from 'zustand/react/shallow';
import ChatContainer from '../components/ChatContainer';
import ChatsList from '../components/ChatsList';
import NoConversationPlaceholder from '../components/NoConversationPlaceholder';
import PageContainer from '../components/PageContainer';
import { useChatStore } from '../store/useChatStore';

const ChatPage = () => {
  const { chatId } = useParams<{ chatId?: string }>();
  const {
    selectedUser,
    chats,
    loadChats,
    isUsersLoading,
    subscribeToChatList,
    unsubscribeFromChatList,
  } = useChatStore(
    useShallow((state) => ({
      selectedUser: state.selectedUser,
      chats: state.chats,
      loadChats: state.loadChats,
      setSelectedUser: state.setSelectedUser,
      isUsersLoading: state.isUsersLoading,
      subscribeToChatList: state.subscribeToChatList,
      unsubscribeFromChatList: state.unsubscribeFromChatList,
    }))
  );

  useEffect(() => {
    if (chats.length === 0 && !isUsersLoading) {
      loadChats(chatId);
    }
  }, [chats.length, isUsersLoading]);

  useEffect(() => {
    subscribeToChatList();
    return () => {
      unsubscribeFromChatList();
    };
  }, []);

  return (
    <div className="relative w-full md:max-w-6xl max-w-full h-[calc(100dvh-2rem)] md:h-[800px] px-2 md:px-0 m-auto">
      <PageContainer>
        <div
          className={`bg-gray-900/70 flex flex-col min-h-0 relative isolate z-0 w-80 md:w-96
            ${selectedUser ? 'hidden md:flex' : ''}`}
        >
          <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-2 min-h-0 w-full">
            <ChatsList />
          </div>
        </div>

        <div
          className={`min-h-0 relative isolate border-l border-gray-700/50
            ${
              selectedUser
                ? 'flex flex-1 flex-col'
                : 'hidden md:flex md:flex-1 md:flex-col md:justify-center'
            }`}
        >
          {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
        </div>
      </PageContainer>
    </div>
  );
};

export default ChatPage;
