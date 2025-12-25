import { BrowserRouter } from 'react-router';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DEFAULT_AVATAR } from '../../constants';
import * as useChatStoreModule from '../../store/useChatStore';
import type { Chat } from '../../types';
import ChatHeader from '../ChatHeader';

jest.mock('lucide-react', () => ({
  XIcon: () => <svg data-testid="x-icon" />,
}));
jest.mock('../../store/useChatStore');

const mockNavigate = jest.fn();
const mockSetSelectedUser = jest.fn();

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockNavigate,
}));

const mockChat: Chat = {
  _id: 'chat-1',
  fullName: 'Петр Петров',
  username: 'petr_petrov',
  email: 'petr@example.com',
  profilePic: '/custom-avatar.jpg',
  isOnline: true,
};

const mockChatOffline: Chat = {
  _id: 'chat-2',
  fullName: 'Иван Иванов',
  username: 'ivan_ivanov',
  email: 'ivan@example.com',
  isOnline: false,
};

describe('ChatHeader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(useChatStoreModule, 'useChatStore').mockReturnValue({
      selectedUser: mockChat,
      setSelectedUser: mockSetSelectedUser,
    } as any);
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <ChatHeader />
      </BrowserRouter>
    );
  };

  it('не отображается если нет выбранного пользователя', () => {
    jest.spyOn(useChatStoreModule, 'useChatStore').mockReturnValue({
      selectedUser: null,
      setSelectedUser: mockSetSelectedUser,
    } as any);

    const { container } = renderComponent();
    expect(container.firstChild).toBeNull();
  });

  it('отображает информацию о пользователе', () => {
    renderComponent();

    expect(screen.getByText('Петр Петров')).toBeInTheDocument();
    expect(screen.getByText('В сети')).toBeInTheDocument();
  });

  it('отображает статус "Не в сети" для офлайн пользователя', () => {
    jest.spyOn(useChatStoreModule, 'useChatStore').mockReturnValue({
      selectedUser: mockChatOffline,
      setSelectedUser: mockSetSelectedUser,
    } as any);

    renderComponent();

    expect(screen.getByText('Не в сети')).toBeInTheDocument();
  });

  it('отображает кастомный аватар если он есть', () => {
    renderComponent();

    const avatar = screen.getByAltText('Петр Петров');
    expect(avatar).toHaveAttribute('src', '/custom-avatar.jpg');
  });

  it('использует DEFAULT_AVATAR если profilePic отсутствует', () => {
    jest.spyOn(useChatStoreModule, 'useChatStore').mockReturnValue({
      selectedUser: mockChatOffline,
      setSelectedUser: mockSetSelectedUser,
    } as any);

    renderComponent();

    const avatar = screen.getByAltText('Иван Иванов');
    expect(avatar).toHaveAttribute('src', DEFAULT_AVATAR);
  });

  it('закрывает чат при клике на кнопку закрытия', async () => {
    const user = userEvent.setup();
    renderComponent();

    const closeButton = screen.getByLabelText('Закрыть чат');
    await user.click(closeButton);

    expect(mockSetSelectedUser).toHaveBeenCalledWith(null);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('закрывает чат при нажатии Escape', async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.keyboard('{Escape}');

    expect(mockSetSelectedUser).toHaveBeenCalledWith(null);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('удаляет обработчик Escape при размонтировании', async () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    const { unmount } = renderComponent();

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'keydown',
      expect.any(Function)
    );

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'keydown',
      expect.any(Function)
    );

    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });
});
