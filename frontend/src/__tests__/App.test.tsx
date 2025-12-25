import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import App from '../App';
import * as useSocketStoreModule from '../store/useSocketStore';

jest.mock('../store/useSocketStore');
jest.mock('../components/AppBackground', () => ({
  __esModule: true,
  default: () => <div data-testid="app-background">Фон приложения</div>,
}));
jest.mock('../pages/ChatPage', () => ({
  __esModule: true,
  default: () => <div data-testid="chat-page">Страница чата</div>,
}));
jest.mock('react-hot-toast', () => ({
  Toaster: () => <div data-testid="toaster">Уведомления</div>,
}));

const mockConnectSocket = jest.fn();

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(useSocketStoreModule, 'useSocketStore').mockReturnValue({
      connectSocket: mockConnectSocket,
    } as any);
  });

  const renderComponent = (initialEntries = ['/']) => {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <App />
      </MemoryRouter>
    );
  };

  it('подключает сокет при монтировании', () => {
    renderComponent();

    expect(mockConnectSocket).toHaveBeenCalled();
  });

  it('отображает ChatPage на корневом маршруте', () => {
    renderComponent(['/']);

    expect(screen.getByTestId('chat-page')).toBeInTheDocument();
  });

  it('отображает ChatPage на маршруте с chatId', () => {
    renderComponent(['/chat-123']);

    expect(screen.getByTestId('chat-page')).toBeInTheDocument();
  });

  it('отображает AppBackground', () => {
    renderComponent();

    expect(screen.getByTestId('app-background')).toBeInTheDocument();
  });

  it('отображает уведомления', () => {
    renderComponent();

    expect(screen.getByTestId('toaster')).toBeInTheDocument();
  });

  it('вызывает connectSocket только один раз при монтировании', () => {
    const { rerender } = renderComponent();

    expect(mockConnectSocket).toHaveBeenCalledTimes(1);

    rerender(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(mockConnectSocket).toHaveBeenCalledTimes(1);
  });
});

