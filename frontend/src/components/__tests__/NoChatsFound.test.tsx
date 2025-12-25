import { render, screen } from '@testing-library/react';
import NoChatsFound from '../NoChatsFound';

jest.mock('lucide-react', () => ({
  MessageCircleIcon: () => <svg data-testid="message-icon" />,
}));

describe('NoChatsFound', () => {
  it('отображает заголовок', () => {
    render(<NoChatsFound />);

    expect(screen.getByText('Пока нет чатов')).toBeInTheDocument();
  });

  it('отображает описание', () => {
    render(<NoChatsFound />);

    expect(screen.getByText('У вас нет доступных чатов')).toBeInTheDocument();
  });

  it('отображает иконку сообщения', () => {
    render(<NoChatsFound />);

    expect(screen.getByTestId('message-icon')).toBeInTheDocument();
  });

  it('имеет правильную структуру разметки', () => {
    const { container } = render(<NoChatsFound />);

    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center');
  });
});

