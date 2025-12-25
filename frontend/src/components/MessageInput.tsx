import {
  ChangeEvent,
  FormEvent,
  forwardRef,
  useImperativeHandle,
  useState,
} from 'react';
import { SendHorizontal } from 'lucide-react';
import { useChatStore } from '../store/useChatStore';

export interface MessageInputHandle {
  setText: (text: string) => void;
}

const MessageInput = forwardRef<MessageInputHandle>((_props, ref) => {
  const [text, setText] = useState('');
  const { sendMessage } = useChatStore();

  useImperativeHandle(ref, () => ({
    setText: (newText: string) => {
      setText(newText);
    },
  }));

  const handleSendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text.trim()) return;

    sendMessage({ text: text.trim() });
    setText('');
  };

  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  return (
    <div className="p-3 md:p-4 border-t border-gray-700/50 sticky bottom-0 bg-gray-900/70">
      <form
        onSubmit={handleSendMessage}
        className="max-w-3xl mx-auto flex gap-2 md:gap-4"
      >
        <input
          type="text"
          value={text}
          onChange={handleTextChange}
          className="flex-1 bg-gray-800/50 border border-gray-700/50 rounded-lg py-2 px-3 md:px-4 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500"
          placeholder="Введите сообщение..."
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="bg-gradient-to-r from-violet-500 to-violet-600 text-white rounded-lg px-4 py-2 font-medium hover:from-violet-600 hover:to-violet-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <SendHorizontal className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
});

export default MessageInput;
