import { useEffect, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { CURRENT_USER_ID } from '../constants';
import type { Message } from '../types';
import MessageItem from './MessageItem';

export interface VirtualizedMessagesListProps {
  messages: Message[];
  isMessagesLoading?: boolean;
  selectedChatId?: string | null;
}

export default function VirtualizedMessagesList({
  messages,
  selectedChatId,
}: VirtualizedMessagesListProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const prevMessagesLengthRef = useRef<number>(0);

  const virtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 1000,
    overscan: 10,
    initialOffset: Number.MAX_SAFE_INTEGER,
    paddingStart: 16,
    paddingEnd: 16,
  });

  useEffect(() => {
    if (selectedChatId && messages.length > 0) {
      virtualizer.scrollToOffset(Number.MAX_SAFE_INTEGER, {
        behavior: 'auto',
      });
    }
    prevMessagesLengthRef.current = messages.length;
  }, [selectedChatId]);

  useEffect(() => {
    if (messages.length > prevMessagesLengthRef.current) {
      virtualizer.scrollToOffset(Number.MAX_SAFE_INTEGER, {
        behavior: 'smooth',
      });
    }
    prevMessagesLengthRef.current = messages.length;
  }, [messages.length, virtualizer]);

  return (
    <div ref={parentRef} className="relative w-full h-full overflow-auto">
      <div
        className="relative w-full"
        style={{
          height: `${virtualizer.getTotalSize()}px`,
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            data-index={virtualItem.index}
            ref={(el) => {
              if (el) {
                virtualizer.measureElement(el);
              }
            }}
            className="absolute w-full top-0 left-0"
            style={{
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            <MessageItem
              message={messages[virtualItem.index]!}
              authUserId={CURRENT_USER_ID}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
