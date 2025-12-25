import { BrowserRouter } from 'react-router';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DEFAULT_AVATAR } from '../../constants';
import * as useChatStoreModule from '../../store/useChatStore';
import type { Chat } from '../../types';
import ChatsList from '../ChatsList';

jest.mock('../../store/useChatStore');
jest.mock('../NoChatsFound', () => ({
  __esModule: true,
  default: () => <div data-testid="no-chats-found">Нет чатов</div>,
}));
jest.mock('../UsersLoadingSkeleton', () => ({
  __esModule: true,
  default: () => <div data-testid="loading-skeleton">Загрузка...</div>,
}));

const mockNavigate = jest.fn();
const mockSetSelectedUser = jest.fn();

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockNavigate,
}));

const mockChats: Chat[] = [
  {
    _id: 'chat-1',
    fullName: 'Петр Петров',
    username: 'petr_petrov',
    email: 'petr@example.com',
    profilePic: '/avatar1.jpg',
    lastMessage: {
      text: 'Последнее сообщение',
      createdAt: '2024-01-01T12:00:00.000Z',
    },
  },
  {
    _id: 'chat-2',
    fullName: 'Иван Иванов',
    username: 'ivan_ivanov',
    email: 'ivan@example.com',
    lastMessage: {
      text: 'Другое сообщение',
      createdAt: '2024-01-01T11:00:00.000Z',
    },
  },
  {
    _id: 'chat-3',
    fullName: 'Мария Сидорова',
    username: 'maria_sidorova',
    email: 'maria@example.com',
  },
];

describe('ChatsList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <ChatsList />
      </BrowserRouter>
    );
  };

  it('отображает скелетон загрузки когда isUsersLoading = true', () => {
    jest.spyOn(useChatStoreModule, 'useChatStore').mockReturnValue({
      chats: [],
      isUsersLoading: true,
      setSelectedUser: mockSetSelectedUser,
    } as any);

    renderComponent();

    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
  });

  it('отображает NoChatsFound когда список чатов пуст', () => {
    jest.spyOn(useChatStoreModule, 'useChatStore').mockReturnValue({
      chats: [],
      isUsersLoading: false,
      setSelectedUser: mockSetSelectedUser,
    } as any);

    renderComponent();

    expect(screen.getByTestId('no-chats-found')).toBeInTheDocument();
  });

  it('отображает список чатов', () => {
    jest.spyOn(useChatStoreModule, 'useChatStore').mockReturnValue({
      chats: mockChats,
      isUsersLoading: false,
      setSelectedUser: mockSetSelectedUser,
    } as any);

    renderComponent();

    expect(screen.getByText('Петр Петров')).toBeInTheDocument();
    expect(screen.getByText('Иван Иванов')).toBeInTheDocument();
    expect(screen.getByText('Мария Сидорова')).toBeInTheDocument();
  });

  it('отображает последнее сообщение для чата', () => {
    jest.spyOn(useChatStoreModule, 'useChatStore').mockReturnValue({
      chats: mockChats,
      isUsersLoading: false,
      setSelectedUser: mockSetSelectedUser,
    } as any);

    renderComponent();

    expect(screen.getByText('Последнее сообщение')).toBeInTheDocument();
    expect(screen.getByText('Другое сообщение')).toBeInTheDocument();
  });

  it('не отображает последнее сообщение если его нет', () => {
    jest.spyOn(useChatStoreModule, 'useChatStore').mockReturnValue({
      chats: [mockChats[2]],
      isUsersLoading: false,
      setSelectedUser: mockSetSelectedUser,
    } as any);

    renderComponent();

    expect(screen.getByText('Мария Сидорова')).toBeInTheDocument();
    expect(screen.queryByText('Последнее сообщение')).not.toBeInTheDocument();
  });

  it('использует кастомный аватар если он есть', () => {
    jest.spyOn(useChatStoreModule, 'useChatStore').mockReturnValue({
      chats: [mockChats[0]],
      isUsersLoading: false,
      setSelectedUser: mockSetSelectedUser,
    } as any);

    renderComponent();

    const avatar = screen.getByAltText('Петр Петров');
    expect(avatar).toHaveAttribute('src', '/avatar1.jpg');
  });

  it('использует DEFAULT_AVATAR если profilePic отсутствует', () => {
    jest.spyOn(useChatStoreModule, 'useChatStore').mockReturnValue({
      chats: [mockChats[1]],
      isUsersLoading: false,
      setSelectedUser: mockSetSelectedUser,
    } as any);

    renderComponent();

    const avatar = screen.getByAltText('Иван Иванов');
    expect(avatar).toHaveAttribute('src', DEFAULT_AVATAR);
  });

  it('выбирает чат и навигирует при клике', async () => {
    const user = userEvent.setup();
    jest.spyOn(useChatStoreModule, 'useChatStore').mockReturnValue({
      chats: mockChats,
      isUsersLoading: false,
      setSelectedUser: mockSetSelectedUser,
    } as any);

    renderComponent();

    const chatElement = screen.getByText('Петр Петров').closest('div');
    if (chatElement) {
      await user.click(chatElement);
    }

    expect(mockSetSelectedUser).toHaveBeenCalledWith(mockChats[0]);
    expect(mockNavigate).toHaveBeenCalledWith('/chat-1');
  });
});
