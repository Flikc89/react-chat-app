import { MessageCircleIcon } from 'lucide-react';

function NoChatsFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
      <div className="w-16 h-16 bg-violet-500/10 rounded-full flex items-center justify-center">
        <MessageCircleIcon className="w-8 h-8 text-violet-400" />
      </div>
      <div>
        <h4 className="text-gray-200 font-medium mb-1">Пока нет чатов</h4>
        <p className="text-gray-400 text-sm px-6">У вас нет доступных чатов</p>
      </div>
    </div>
  );
}
export default NoChatsFound;
