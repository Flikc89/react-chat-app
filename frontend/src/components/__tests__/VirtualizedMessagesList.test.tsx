import { render, screen } from '@testing-library/react';
import { CURRENT_USER_ID } from '../../constants';
import type { Message } from '../../types';
import VirtualizedMessagesList from '../VirtualizedMessagesList';

const mockGetVirtualItems = jest.fn(() => [
  { key: '0', index: 0, start: 0, size: 68 },
  { key: '1', index: 1, start: 68, size: 68 },
]);
const mockScrollToOffset = jest.fn();
const mockMeasureElement = jest.fn();

jest.mock('@tanstack/react-virtual', () => {
  const actual = jest.requireActual('@tanstack/react-virtual');
  return {
    ...actual,
    useVirtualizer: jest.fn(() => ({
      getVirtualItems: mockGetVirtualItems,
      getTotalSize: () => 136,
      scrollToOffset: mockScrollToOffset,
      measureElement: mockMeasureElement,
    })),
  };
});

const mockMessages: Message[] = [
  {
    _id: '1',
    senderId: CURRENT_USER_ID,
    receiverId: 'other-user',
    text: 'Привет!',
    createdAt: '2024-01-01T12:00:00.000Z',
  },
  {
    _id: '2',
    senderId: 'other-user',
    receiverId: CURRENT_USER_ID,
    text: 'Привет, как дела?',
    createdAt: '2024-01-01T12:01:00.000Z',
  },
];

describe('VirtualizedMessagesList', () => {
  beforeEach(() => {
    mockGetVirtualItems.mockReturnValue([
      { key: '0', index: 0, start: 0, size: 68 },
      { key: '1', index: 1, start: 68, size: 68 },
    ]);
    mockScrollToOffset.mockClear();
    mockMeasureElement.mockClear();
  });

  it('рендерит сообщения', () => {
    render(
      <VirtualizedMessagesList
        messages={mockMessages}
        selectedChatId="chat-1"
      />
    );

    expect(screen.getByText('Привет!')).toBeInTheDocument();
    expect(screen.getByText('Привет, как дела?')).toBeInTheDocument();
  });

  it('не падает при пустом массиве сообщений', () => {
    mockGetVirtualItems.mockReturnValueOnce([]);
    const { container } = render(
      <VirtualizedMessagesList messages={[]} selectedChatId="chat-1" />
    );

    const listContainer = container.querySelector('.relative.w-full.h-full');
    expect(listContainer).toBeInTheDocument();
  });

  it('передает selectedChatId в компонент', () => {
    render(
      <VirtualizedMessagesList
        messages={mockMessages}
        selectedChatId="test-chat-id"
      />
    );

    expect(screen.getByText('Привет!')).toBeInTheDocument();
  });
});
