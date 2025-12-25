import { memo } from 'react';
import { MessageSquareIcon } from 'lucide-react';

interface NoChatHistoryPlaceholderProps {
  name: string;
  onQuickMessage: (text: string) => void;
}

const NoChatHistoryPlaceholder = memo(
  ({ name, onQuickMessage }: NoChatHistoryPlaceholderProps) => {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <div className="w-16 h-16 bg-violet-500/20 rounded-full flex items-center justify-center mb-5">
          <MessageSquareIcon className="size-8 text-violet-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-200 mb-3">
          Начните разговор с {name}
        </h3>
        <div className="flex flex-col space-y-3 max-w-md mb-5">
          <p className="text-gray-400 text-sm">
            Это начало вашего разговора. Отправьте сообщение, чтобы начать
            общение!
          </p>
          <div className="h-px w-32 bg-gradient-to-r from-transparent via-violet-500/30 to-transparent mx-auto"></div>
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => onQuickMessage('Привет')}
            className="px-4 py-2 text-xs font-medium text-violet-400 bg-violet-500/10 rounded-full hover:bg-violet-500/20 transition-colors"
          >
            👋 Привет
          </button>
          <button
            onClick={() => onQuickMessage('Как дела?')}
            className="px-4 py-2 text-xs font-medium text-violet-400 bg-violet-500/10 rounded-full hover:bg-violet-500/20 transition-colors"
          >
            🤝 Как дела?
          </button>
          <button
            onClick={() => onQuickMessage('Встретимся?')}
            className="px-4 py-2 text-xs font-medium text-violet-400 bg-violet-500/10 rounded-full hover:bg-violet-500/20 transition-colors"
          >
            📅 Встретимся?
          </button>
        </div>
      </div>
    );
  }
);

NoChatHistoryPlaceholder.displayName = 'NoChatHistoryPlaceholder';

export default NoChatHistoryPlaceholder;
