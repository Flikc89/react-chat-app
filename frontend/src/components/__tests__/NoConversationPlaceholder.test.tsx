import { render, screen } from '@testing-library/react';
import NoConversationPlaceholder from '../NoConversationPlaceholder';

jest.mock('lucide-react', () => ({
  MessageSquareIcon: () => <svg data-testid="message-icon" />,
}));

describe('NoConversationPlaceholder', () => {
  it('отображает заголовок', () => {
    render(<NoConversationPlaceholder />);

    expect(screen.getByText('Выберите чат')).toBeInTheDocument();
  });

  it('отображает описание', () => {
    render(<NoConversationPlaceholder />);

    expect(
      screen.getByText(
        'Выберите чат из списка слева, чтобы начать или продолжить разговор.'
      )
    ).toBeInTheDocument();
  });

  it('отображает иконку сообщения', () => {
    render(<NoConversationPlaceholder />);

    expect(screen.getByTestId('message-icon')).toBeInTheDocument();
  });

  it('скрыт на мобильных устройствах (hidden md:block)', () => {
    const { container } = render(<NoConversationPlaceholder />);

    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass('hidden', 'md:block');
  });

  it('имеет правильную структуру разметки', () => {
    const { container } = render(<NoConversationPlaceholder />);

    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass('hidden', 'md:block', 'w-full');
  });
});
