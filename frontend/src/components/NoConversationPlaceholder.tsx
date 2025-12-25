import { MessageCircleIcon } from 'lucide-react';

const NoConversationPlaceholder = () => {
  return (
    <div className="hidden md:block w-full">
      <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <div className="size-20 bg-violet-500/20 rounded-full flex items-center justify-center mb-6">
          <MessageCircleIcon className="size-10 text-violet-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-200 mb-2">
          Выберите чат
        </h3>
        <p className="text-gray-400 max-w-md">
          Выберите чат из списка слева, чтобы начать или продолжить разговор.
        </p>
      </div>
    </div>
  );
};

export default NoConversationPlaceholder;
