import React from 'react';
import { BrowserRouter } from 'react-router';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as useChatStoreModule from '../../store/useChatStore';
import type { Chat, Message } from '../../types';
import ChatContainer from '../ChatContainer';

jest.mock('../../store/useChatStore');
jest.mock('../ChatHeader', () => ({
  __esModule: true,
  default: () => <div data-testid="chat-header">Заголовок чата</div>,
}));
jest.mock('../MessageInput', () => ({
  __esModule: true,
  default: React.forwardRef(() => (
    <div data-testid="message-input">Поле ввода</div>
  )),
}));
jest.mock('../VirtualizedMessagesList', () => ({
  __esModule: true,
  default: ({ messages }: { messages: Message[] }) => (
    <div data-testid="messages-list">
      {messages.map((msg) => (
        <div key={msg._id}>{msg.text}</div>
      ))}
    </div>
  ),
}));
jest.mock('../MessagesLoadingSkeleton', () => ({
  __esModule: true,
  default: () => <div data-testid="loading-skeleton">Загрузка...</div>,
}));
jest.mock('../NoChatHistoryPlaceholder', () => ({
  __esModule: true,
  default: ({
    name,
    onQuickMessage,
  }: {
    name: string;
    onQuickMessage: (text: string) => void;
  }) => (
    <div data-testid="no-history">
      <div>Нет истории для {name}</div>
      <button onClick={() => onQuickMessage('Привет')}>
        Быстрое сообщение
      </button>
    </div>
  ),
}));

const mockGetMessagesByUserId = jest.fn();
const mockSubscribeToMessages = jest.fn();
const mockUnsubscribeFromMessages = jest.fn();

const mockChat: Chat = {
  _id: 'chat-1',
  fullName: 'Петр Петров',
  username: 'petr_petrov',
  email: 'petr@example.com',
  profilePic: '/avatar.jpg',
};

const mockMessages: Message[] = [
  {
    _id: 'msg-1',
    senderId: 'current-user',
    receiverId: 'chat-1',
    text: 'Привет!',
    createdAt: '2024-01-01T12:00:00.000Z',
  },
  {
    _id: 'msg-2',
    senderId: 'chat-1',
    receiverId: 'current-user',
    text: 'Привет! Как дела?',
    createdAt: '2024-01-01T12:01:00.000Z',
  },
];

describe('ChatContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(useChatStoreModule, 'useChatStore').mockReturnValue({
      selectedUser: mockChat,
      messagesByChatId: {},
      isMessagesLoading: {},
      getMessagesByUserId: mockGetMessagesByUserId,
      subscribeToMessages: mockSubscribeToMessages,
      unsubscribeFromMessages: mockUnsubscribeFromMessages,
    } as any);
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <ChatContainer />
      </BrowserRouter>
    );
  };

  it('отображает ChatHeader и MessageInput', () => {
    renderComponent();

    expect(screen.getByTestId('chat-header')).toBeInTheDocument();
    expect(screen.getByTestId('message-input')).toBeInTheDocument();
  });

  it('загружает сообщения при монтировании', () => {
    renderComponent();

    expect(mockGetMessagesByUserId).toHaveBeenCalledWith('chat-1');
  });

  it('подписывается на сообщения при монтировании', () => {
    renderComponent();

    expect(mockSubscribeToMessages).toHaveBeenCalled();
  });

  it('отписывается от сообщений при размонтировании', () => {
    const { unmount } = renderComponent();

    unmount();

    expect(mockUnsubscribeFromMessages).toHaveBeenCalledWith('chat-1');
  });

  it('отображает скелетон загрузки когда сообщения загружаются и список пуст', () => {
    jest.spyOn(useChatStoreModule, 'useChatStore').mockReturnValue({
      selectedUser: mockChat,
      messagesByChatId: {},
      isMessagesLoading: { 'chat-1': true },
      getMessagesByUserId: mockGetMessagesByUserId,
      subscribeToMessages: mockSubscribeToMessages,
      unsubscribeFromMessages: mockUnsubscribeFromMessages,
    } as any);

    renderComponent();

    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
  });

  it('отображает список сообщений когда они загружены', () => {
    jest.spyOn(useChatStoreModule, 'useChatStore').mockReturnValue({
      selectedUser: mockChat,
      messagesByChatId: { 'chat-1': mockMessages },
      isMessagesLoading: { 'chat-1': false },
      getMessagesByUserId: mockGetMessagesByUserId,
      subscribeToMessages: mockSubscribeToMessages,
      unsubscribeFromMessages: mockUnsubscribeFromMessages,
    } as any);

    renderComponent();

    expect(screen.getByTestId('messages-list')).toBeInTheDocument();
    expect(screen.getByText('Привет!')).toBeInTheDocument();
    expect(screen.getByText('Привет! Как дела?')).toBeInTheDocument();
  });

  it('отображает NoChatHistoryPlaceholder когда сообщений нет', () => {
    jest.spyOn(useChatStoreModule, 'useChatStore').mockReturnValue({
      selectedUser: mockChat,
      messagesByChatId: { 'chat-1': [] },
      isMessagesLoading: { 'chat-1': false },
      getMessagesByUserId: mockGetMessagesByUserId,
      subscribeToMessages: mockSubscribeToMessages,
      unsubscribeFromMessages: mockUnsubscribeFromMessages,
    } as any);

    renderComponent();

    expect(screen.getByTestId('no-history')).toBeInTheDocument();
    expect(screen.getByText(/Нет истории для Петр Петров/)).toBeInTheDocument();
  });

  it('передает handleQuickMessage в NoChatHistoryPlaceholder', async () => {
    const user = userEvent.setup();
    jest.spyOn(useChatStoreModule, 'useChatStore').mockReturnValue({
      selectedUser: mockChat,
      messagesByChatId: { 'chat-1': [] },
      isMessagesLoading: { 'chat-1': false },
      getMessagesByUserId: mockGetMessagesByUserId,
      subscribeToMessages: mockSubscribeToMessages,
      unsubscribeFromMessages: mockUnsubscribeFromMessages,
    } as any);

    renderComponent();

    const quickMessageButton = screen.getByText('Быстрое сообщение');
    await user.click(quickMessageButton);
  });

  it('не загружает сообщения если selectedUser отсутствует', () => {
    jest.spyOn(useChatStoreModule, 'useChatStore').mockReturnValue({
      selectedUser: null,
      messagesByChatId: {},
      isMessagesLoading: {},
      getMessagesByUserId: mockGetMessagesByUserId,
      subscribeToMessages: mockSubscribeToMessages,
      unsubscribeFromMessages: mockUnsubscribeFromMessages,
    } as any);

    renderComponent();

    expect(mockGetMessagesByUserId).not.toHaveBeenCalled();
    expect(mockSubscribeToMessages).not.toHaveBeenCalled();
  });

  it('перезагружает сообщения при смене selectedUser', () => {
    const { rerender } = renderComponent();

    const newChat: Chat = {
      _id: 'chat-2',
      fullName: 'Иван Иванов',
      username: 'ivan_ivanov',
      email: 'ivan@example.com',
    };

    jest.spyOn(useChatStoreModule, 'useChatStore').mockReturnValue({
      selectedUser: newChat,
      messagesByChatId: {},
      isMessagesLoading: {},
      getMessagesByUserId: mockGetMessagesByUserId,
      subscribeToMessages: mockSubscribeToMessages,
      unsubscribeFromMessages: mockUnsubscribeFromMessages,
    } as any);

    rerender(
      <BrowserRouter>
        <ChatContainer />
      </BrowserRouter>
    );

    expect(mockGetMessagesByUserId).toHaveBeenCalledWith('chat-2');
  });
});
