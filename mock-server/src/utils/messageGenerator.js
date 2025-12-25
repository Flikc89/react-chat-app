import {
  MESSAGE_TEMPLATES,
  DEFAULT_MESSAGE_TEMPLATES,
} from "../config/messageTemplates.js";

const MESSAGE_COUNT_THRESHOLD = 100;
const DAYS_AGO_LARGE = 30;
const DAYS_AGO_SMALL = 7;
const RANDOM_OFFSET_LARGE_MS = 300000;
const RANDOM_OFFSET_SMALL_MS = 60000;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function getMessageTemplates(chatId) {
  return MESSAGE_TEMPLATES[chatId] || DEFAULT_MESSAGE_TEMPLATES;
}

function calculateTimestamp(index, messageCount, now) {
  const daysAgo = messageCount > MESSAGE_COUNT_THRESHOLD ? DAYS_AGO_LARGE : DAYS_AGO_SMALL;
  const daysOffset = Math.floor((index / messageCount) * daysAgo);
  const randomOffset =
    Math.random() * (messageCount > MESSAGE_COUNT_THRESHOLD ? RANDOM_OFFSET_LARGE_MS : RANDOM_OFFSET_SMALL_MS);

  return now - daysOffset * MS_PER_DAY - randomOffset;
}

export function generateMessages(chatId, currentUserId, messageCount) {
  const messages = [];
  const templates = getMessageTemplates(chatId);
  const now = Date.now();

  for (let i = 0; i < messageCount; i++) {
    const templateIndex = i % templates.length;
    const isFromCurrentUser = i % 2 === 0;
    const timestamp = calculateTimestamp(i, messageCount, now);

    messages.push({
      _id: `msg-${chatId}-${i}`,
      senderId: isFromCurrentUser ? currentUserId : chatId,
      receiverId: isFromCurrentUser ? chatId : currentUserId,
      text: templates[templateIndex],
      createdAt: new Date(timestamp).toISOString(),
    });
  }

  return messages.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
}
