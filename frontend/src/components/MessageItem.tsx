import type { Message } from '../types';

type MessageContentProps = {
  message: Message;
  authUserId: string;
};

function MessageContent({ message, authUserId }: MessageContentProps) {
  const isFromCurrentUser = message.senderId === authUserId;

  return (
    <div
      className={`chat ${isFromCurrentUser ? 'chat-end' : 'chat-start'} px-3 md:px-6`}
    >
      <div
        className={`chat-bubble relative max-w-[85%] md:max-w-[75%] break-words text-gray-200 rounded-tl-xl rounded-tr-xl ${
          isFromCurrentUser
            ? 'bg-violet-600 rounded-bl-xl'
            : 'bg-gray-900/80 rounded-br-xl'
        }`}
      >
        {message.text && <p>{message.text}</p>}
        <p className="text-xs mt-1 opacity-75 flex items-center gap-1">
          {message.isOptimistic ? (
            <span className="italic text-gray-300 animate-pulse">
              Отправка...
            </span>
          ) : (
            new Date(message.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })
          )}
        </p>
      </div>
    </div>
  );
}

export type MessageItemProps = {
  message: Message;
  authUserId: string;
};

export default function MessageItem({ message, authUserId }: MessageItemProps) {
  return <MessageContent message={message} authUserId={authUserId} />;
}
