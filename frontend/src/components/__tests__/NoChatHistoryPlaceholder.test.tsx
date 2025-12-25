import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NoChatHistoryPlaceholder from '../NoChatHistoryPlaceholder';

jest.mock('lucide-react', () => ({
  MessageCircleIcon: () => <svg data-testid="message-icon" />,
}));

describe('NoChatHistoryPlaceholder', () => {
  const mockOnQuickMessage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('отображает имя пользователя', () => {
    render(
      <NoChatHistoryPlaceholder
        name="Петр Петров"
        onQuickMessage={mockOnQuickMessage}
      />
    );

    expect(
      screen.getByText(/Начните разговор с Петр Петров/)
    ).toBeInTheDocument();
  });

  it('отображает описание', () => {
    render(
      <NoChatHistoryPlaceholder
        name="Петр Петров"
        onQuickMessage={mockOnQuickMessage}
      />
    );

    expect(
      screen.getByText(
        /Это начало вашего разговора. Отправьте сообщение, чтобы начать общение!/
      )
    ).toBeInTheDocument();
  });

  it('отображает иконку сообщения', () => {
    render(
      <NoChatHistoryPlaceholder
        name="Петр Петров"
        onQuickMessage={mockOnQuickMessage}
      />
    );

    expect(screen.getByTestId('message-icon')).toBeInTheDocument();
  });

  it('отображает все три кнопки быстрых сообщений', () => {
    render(
      <NoChatHistoryPlaceholder
        name="Петр Петров"
        onQuickMessage={mockOnQuickMessage}
      />
    );

    expect(screen.getByText('👋 Привет')).toBeInTheDocument();
    expect(screen.getByText('🤝 Как дела?')).toBeInTheDocument();
    expect(screen.getByText('📅 Встретимся?')).toBeInTheDocument();
  });

  it('вызывает onQuickMessage с "Привет" при клике на первую кнопку', async () => {
    const user = userEvent.setup();
    render(
      <NoChatHistoryPlaceholder
        name="Петр Петров"
        onQuickMessage={mockOnQuickMessage}
      />
    );

    const button = screen.getByText('👋 Привет');
    await user.click(button);

    expect(mockOnQuickMessage).toHaveBeenCalledWith('Привет');
    expect(mockOnQuickMessage).toHaveBeenCalledTimes(1);
  });

  it('вызывает onQuickMessage с "Как дела?" при клике на вторую кнопку', async () => {
    const user = userEvent.setup();
    render(
      <NoChatHistoryPlaceholder
        name="Петр Петров"
        onQuickMessage={mockOnQuickMessage}
      />
    );

    const button = screen.getByText('🤝 Как дела?');
    await user.click(button);

    expect(mockOnQuickMessage).toHaveBeenCalledWith('Как дела?');
    expect(mockOnQuickMessage).toHaveBeenCalledTimes(1);
  });

  it('вызывает onQuickMessage с "Встретимся?" при клике на третью кнопку', async () => {
    const user = userEvent.setup();
    render(
      <NoChatHistoryPlaceholder
        name="Петр Петров"
        onQuickMessage={mockOnQuickMessage}
      />
    );

    const button = screen.getByText('📅 Встретимся?');
    await user.click(button);

    expect(mockOnQuickMessage).toHaveBeenCalledWith('Встретимся?');
    expect(mockOnQuickMessage).toHaveBeenCalledTimes(1);
  });

  it('корректно работает с разными именами', () => {
    render(
      <NoChatHistoryPlaceholder
        name="Иван Иванов"
        onQuickMessage={mockOnQuickMessage}
      />
    );

    expect(
      screen.getByText(/Начните разговор с Иван Иванов/)
    ).toBeInTheDocument();
  });

  it('мемоизирован (memo)', () => {
    const { rerender } = render(
      <NoChatHistoryPlaceholder
        name="Петр Петров"
        onQuickMessage={mockOnQuickMessage}
      />
    );

    const firstRender = screen.getByText(/Начните разговор с Петр Петров/);

    rerender(
      <NoChatHistoryPlaceholder
        name="Петр Петров"
        onQuickMessage={mockOnQuickMessage}
      />
    );

    const secondRender = screen.getByText(/Начните разговор с Петр Петров/);
    expect(firstRender).toBe(secondRender);
  });
});
