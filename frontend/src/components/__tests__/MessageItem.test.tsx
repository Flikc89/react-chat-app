import { render, screen } from '@testing-library/react';
import { CURRENT_USER_ID } from '../../constants';
import type { Message } from '../../types';
import MessageItem from '../MessageItem';

describe('MessageItem', () => {
  const mockMessageFromCurrentUser: Message = {
    _id: '1',
    senderId: CURRENT_USER_ID,
    receiverId: 'other-user',
    text: 'Привет, это я!',
    createdAt: new Date().toISOString(),
  };

  const mockMessageFromOther: Message = {
    _id: '2',
    senderId: 'other-user',
    receiverId: CURRENT_USER_ID,
    text: 'Привет, это другой пользователь!',
    createdAt: new Date().toISOString(),
  };

  it('отображает сообщение от текущего пользователя', () => {
    render(
      <MessageItem
        message={mockMessageFromCurrentUser}
        authUserId={CURRENT_USER_ID}
      />
    );

    expect(screen.getByText('Привет, это я!')).toBeInTheDocument();
  });

  it('отображает сообщение от другого пользователя', () => {
    render(
      <MessageItem
        message={mockMessageFromOther}
        authUserId={CURRENT_USER_ID}
      />
    );

    expect(
      screen.getByText('Привет, это другой пользователь!')
    ).toBeInTheDocument();
  });

  it('отображает статус "Отправка..." для оптимистичного сообщения', () => {
    const optimisticMessage: Message = {
      ...mockMessageFromCurrentUser,
      isOptimistic: true,
    };

    render(
      <MessageItem message={optimisticMessage} authUserId={CURRENT_USER_ID} />
    );

    expect(screen.getByText('Отправка...')).toBeInTheDocument();
  });

  it('отображает время для обычного сообщения', () => {
    render(
      <MessageItem
        message={mockMessageFromCurrentUser}
        authUserId={CURRENT_USER_ID}
      />
    );

    const timeElement = screen.getByText(/\d{2}:\d{2}/);
    expect(timeElement).toBeInTheDocument();
  });
});
