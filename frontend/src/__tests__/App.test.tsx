import { MemoryRouter } from 'react-router';
import { act, render, screen } from '@testing-library/react';
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

  const renderComponent = async (initialEntries = ['/']) => {
    let component: ReturnType<typeof render>;
    await act(async () => {
      component = render(
        <MemoryRouter initialEntries={initialEntries}>
          <App />
        </MemoryRouter>
      );
    });
    return component!;
  };

  it('подключает сокет при монтировании', async () => {
    await renderComponent();

    expect(mockConnectSocket).toHaveBeenCalledTimes(1);
  });

  it('отображает ChatPage на корневом маршруте', async () => {
    await renderComponent(['/']);

    expect(screen.getByTestId('chat-page')).toBeInTheDocument();
  });

  it('отображает ChatPage на маршруте с chatId', async () => {
    await renderComponent(['/chat-123']);

    expect(screen.getByTestId('chat-page')).toBeInTheDocument();
  });

  it('отображает AppBackground', async () => {
    await renderComponent();

    expect(screen.getByTestId('app-background')).toBeInTheDocument();
  });

  it('отображает уведомления', async () => {
    await renderComponent();

    expect(screen.getByTestId('toaster')).toBeInTheDocument();
  });

  it('вызывает connectSocket только один раз при монтировании', async () => {
    const { rerender } = await renderComponent();

    expect(mockConnectSocket).toHaveBeenCalledTimes(1);

    await act(async () => {
      rerender(
        <MemoryRouter>
          <App />
        </MemoryRouter>
      );
    });

    expect(mockConnectSocket).toHaveBeenCalledTimes(1);
  });
});
