import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as useChatStoreModule from '../../store/useChatStore';
import MessageInput from '../MessageInput';

jest.mock('lucide-react', () => ({
  SendHorizontal: () => <svg data-testid="send-horizontal" />,
}));
jest.mock('../../store/useChatStore');
const mockSendMessage = jest.fn();

beforeEach(() => {
  jest.spyOn(useChatStoreModule, 'useChatStore').mockReturnValue({
    sendMessage: mockSendMessage,
  } as any);
  mockSendMessage.mockClear();
});

describe('MessageInput', () => {
  it('отображает поле ввода и кнопку отправки', () => {
    render(<MessageInput />);

    expect(
      screen.getByPlaceholderText('Введите сообщение...')
    ).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('кнопка отправки изначально неактивна при пустом поле', () => {
    render(<MessageInput />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('активирует кнопку при вводе текста', async () => {
    const user = userEvent.setup();
    render(<MessageInput />);

    const input = screen.getByPlaceholderText('Введите сообщение...');
    await user.type(input, 'Тестовое сообщение');

    const button = screen.getByRole('button');
    expect(button).not.toBeDisabled();
  });

  it('отправляет сообщение при нажатии кнопки', async () => {
    const user = userEvent.setup();
    render(<MessageInput />);

    const input = screen.getByPlaceholderText('Введите сообщение...');
    await user.type(input, 'Тестовое сообщение');

    const button = screen.getByRole('button');
    await user.click(button);

    expect(mockSendMessage).toHaveBeenCalledWith({
      text: 'Тестовое сообщение',
    });
  });

  it('очищает поле ввода после отправки', async () => {
    const user = userEvent.setup();
    render(<MessageInput />);

    const input = screen.getByPlaceholderText(
      'Введите сообщение...'
    ) as HTMLInputElement;
    await user.type(input, 'Тестовое сообщение');

    const button = screen.getByRole('button');
    await user.click(button);

    await waitFor(() => {
      expect(input.value).toBe('');
    });
  });

  it('отправляет сообщение при нажатии Enter', async () => {
    const user = userEvent.setup();
    render(<MessageInput />);

    const input = screen.getByPlaceholderText('Введите сообщение...');
    await user.type(input, 'Тестовое сообщение{Enter}');

    expect(mockSendMessage).toHaveBeenCalledWith({
      text: 'Тестовое сообщение',
    });
  });

  it('не отправляет пустое сообщение', async () => {
    const user = userEvent.setup();
    render(<MessageInput />);

    const input = screen.getByPlaceholderText('Введите сообщение...');
    await user.type(input, '   ');
    await user.keyboard('{Enter}');

    expect(mockSendMessage).not.toHaveBeenCalled();
  });
});
