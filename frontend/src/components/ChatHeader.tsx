import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { XIcon } from 'lucide-react';
import { DEFAULT_AVATAR } from '../constants';
import { useChatStore } from '../store/useChatStore';

function ChatHeader() {
  const navigate = useNavigate();
  const { selectedUser, setSelectedUser } = useChatStore();

  const handleClose = () => {
    setSelectedUser(null);
    navigate('/');
  };

  const status = selectedUser?.isOnline
    ? { text: 'В сети', className: 'text-green-400' }
    : { text: 'Не в сети', className: 'text-gray-400' };

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [selectedUser, handleClose]);

  if (!selectedUser) return null;

  return (
    <div className="sticky top-0 z-10 flex justify-between items-center bg-gray-900/70 border-b border-gray-700/50 max-h-[84px] px-4 md:px-6 py-3">
      <div className="flex items-center space-x-3 min-w-0">
        <div className="shrink-0 w-10 md:w-12 h-10 md:h-12 rounded-full overflow-hidden">
          <img
            src={selectedUser.profilePic || DEFAULT_AVATAR}
            alt={selectedUser.fullName}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="min-w-0">
          <h3 className="text-gray-200 font-medium truncate">
            {selectedUser.fullName}
          </h3>
          <p className={`text-sm ${status.className}`}>{status.text}</p>
        </div>
      </div>
      <button onClick={handleClose} className="p-1" aria-label="Закрыть чат">
        <XIcon className="w-5 h-5 text-gray-400 hover:text-gray-200 transition-colors cursor-pointer" />
      </button>
    </div>
  );
}

export default ChatHeader;
