import { useNavigate } from 'react-router';
import { useShallow } from 'zustand/react/shallow';
import { DEFAULT_AVATAR } from '../constants';
import { useChatStore } from '../store/useChatStore';
import NoChatsFound from './NoChatsFound';
import UsersLoadingSkeleton from './UsersLoadingSkeleton';

function ChatsList() {
  const navigate = useNavigate();
  const { chats, isUsersLoading, setSelectedUser } = useChatStore(
    useShallow((state) => ({
      chats: state.chats,
      isUsersLoading: state.isUsersLoading,
      setSelectedUser: state.setSelectedUser,
    }))
  );

  if (isUsersLoading) return <UsersLoadingSkeleton />;
  if (chats.length === 0)
    return (
      <div className="h-full flex items-center justify-center">
        <NoChatsFound />
      </div>
    );

  return (
    <>
      {chats.map((chat) => (
        <div
          key={chat._id}
          className="bg-violet-500/10 p-3 md:p-4 rounded-lg cursor-pointer hover:bg-violet-500/20 transition-colors"
          onClick={() => {
            setSelectedUser(chat);
            navigate(`/${chat._id}`);
          }}
        >
          <div className="flex items-center gap-3">
            <div>
              <div className="size-10 md:size-12 rounded-full">
                <img
                  src={chat.profilePic || DEFAULT_AVATAR}
                  alt={chat.fullName}
                />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-gray-200 font-medium truncate">
                {chat.fullName}
              </h4>
              {chat.lastMessage && (
                <p className="text-sm text-gray-400 truncate mt-1">
                  {chat.lastMessage.text}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
export default ChatsList;
