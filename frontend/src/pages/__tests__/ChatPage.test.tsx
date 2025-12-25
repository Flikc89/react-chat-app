import { MemoryRouter } from 'react-router';
import { render, screen } from '@testing-library/react';
import * as useChatStoreModule from '../../store/useChatStore';
import type { Chat } from '../../types';
import ChatPage from '../ChatPage';

jest.mock('../../store/useChatStore');
jest.mock('../../components/ChatContainer', () => ({
  __esModule: true,
  default: () => <div data-testid="chat-container">Контейнер чата</div>,
}));
jest.mock('../../components/ChatsList', () => ({
  __esModule: true,
  default: () => <div data-testid="chats-list">Список чатов</div>,
}));
jest.mock('../../components/NoConversationPlaceholder', () => ({
  __esModule: true,
  default: () => <div data-testid="no-conversation">Нет разговора</div>,
}));
jest.mock('../../components/PageContainer', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="page-container">{children}</div>
  ),
}));

const mockLoadChats = jest.fn();
const mockSubscribeToChatList = jest.fn();
const mockUnsubscribeFromChatList = jest.fn();

const mockChat: Chat = {
  _id: 'chat-1',
  fullName: 'Петр Петров',
  username: 'petr_petrov',
  email: 'petr@example.com',
  profilePic: '/avatar.jpg',
};

describe('ChatPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(useChatStoreModule, 'useChatStore').mockReturnValue({
      selectedUser: null,
      chats: [],
      isUsersLoading: false,
      loadChats: mockLoadChats,
      subscribeToChatList: mockSubscribeToChatList,
      unsubscribeFromChatList: mockUnsubscribeFromChatList,
    } as any);
  });

  const renderComponent = (initialEntries = ['/']) => {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <ChatPage />
      </MemoryRouter>
    );
  };

  it('отображает ChatsList и PageContainer', () => {
    renderComponent();

    expect(screen.getByTestId('page-container')).toBeInTheDocument();
    expect(screen.getByTestId('chats-list')).toBeInTheDocument();
  });

  it('загружает чаты при монтировании если список пуст', () => {
    jest.spyOn(useChatStoreModule, 'useChatStore').mockReturnValue({
      selectedUser: null,
      chats: [],
      isUsersLoading: false,
      loadChats: mockLoadChats,
      subscribeToChatList: mockSubscribeToChatList,
      unsubscribeFromChatList: mockUnsubscribeFromChatList,
    } as any);

    renderComponent();

    expect(mockLoadChats).toHaveBeenCalled();
  });

  it('не загружает чаты если они уже есть', () => {
    jest.spyOn(useChatStoreModule, 'useChatStore').mockReturnValue({
      selectedUser: null,
      chats: [mockChat],
      isUsersLoading: false,
      loadChats: mockLoadChats,
      subscribeToChatList: mockSubscribeToChatList,
      unsubscribeFromChatList: mockUnsubscribeFromChatList,
    } as any);

    renderComponent();

    expect(mockLoadChats).not.toHaveBeenCalled();
  });

  it('не загружает чаты если идет загрузка', () => {
    jest.spyOn(useChatStoreModule, 'useChatStore').mockReturnValue({
      selectedUser: null,
      chats: [],
      isUsersLoading: true,
      loadChats: mockLoadChats,
      subscribeToChatList: mockSubscribeToChatList,
      unsubscribeFromChatList: mockUnsubscribeFromChatList,
    } as any);

    renderComponent();

    expect(mockLoadChats).not.toHaveBeenCalled();
  });

  it('подписывается на обновления списка чатов при монтировании', () => {
    renderComponent();

    expect(mockSubscribeToChatList).toHaveBeenCalled();
  });

  it('отписывается от обновлений списка чатов при размонтировании', () => {
    const { unmount } = renderComponent();

    unmount();

    expect(mockUnsubscribeFromChatList).toHaveBeenCalled();
  });

  it('отображает ChatContainer когда выбран пользователь', () => {
    jest.spyOn(useChatStoreModule, 'useChatStore').mockReturnValue({
      selectedUser: mockChat,
      chats: [mockChat],
      isUsersLoading: false,
      loadChats: mockLoadChats,
      subscribeToChatList: mockSubscribeToChatList,
      unsubscribeFromChatList: mockUnsubscribeFromChatList,
    } as any);

    renderComponent();

    expect(screen.getByTestId('chat-container')).toBeInTheDocument();
    expect(screen.queryByTestId('no-conversation')).not.toBeInTheDocument();
  });

  it('отображает NoConversationPlaceholder когда пользователь не выбран', () => {
    jest.spyOn(useChatStoreModule, 'useChatStore').mockReturnValue({
      selectedUser: null,
      chats: [],
      isUsersLoading: false,
      loadChats: mockLoadChats,
      subscribeToChatList: mockSubscribeToChatList,
      unsubscribeFromChatList: mockUnsubscribeFromChatList,
    } as any);

    renderComponent();

    expect(screen.getByTestId('no-conversation')).toBeInTheDocument();
    expect(screen.queryByTestId('chat-container')).not.toBeInTheDocument();
  });

  it('перезагружает чаты при изменении длины массива', () => {
    const { rerender } = renderComponent();

    jest.spyOn(useChatStoreModule, 'useChatStore').mockReturnValue({
      selectedUser: null,
      chats: [],
      isUsersLoading: false,
      loadChats: mockLoadChats,
      subscribeToChatList: mockSubscribeToChatList,
      unsubscribeFromChatList: mockUnsubscribeFromChatList,
    } as any);

    rerender(
      <MemoryRouter>
        <ChatPage />
      </MemoryRouter>
    );

    expect(mockLoadChats).toHaveBeenCalled();
  });
});
