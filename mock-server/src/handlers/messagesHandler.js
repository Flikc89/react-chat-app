import { CHAT_CONFIG } from "../config/chatConfig.js";
import { DELAY_CONFIG } from "../config/delayConfig.js";
import messageStorage from "../storage/messageStorage.js";
import { generateMessages } from "../utils/messageGenerator.js";
import { ChatNotFoundError, InvalidParameterError } from "../utils/errors.js";

const INITIAL_MESSAGE_THRESHOLD = 10000;

function hasInitialMessages(messages) {
  return messages.some((msg) => {
    if (!msg._id) return false;
    const match = msg._id.match(/^msg-[^-]+-(\d+)$/);
    if (!match) return false;
    const number = parseInt(match[1], 10);
    return number < INITIAL_MESSAGE_THRESHOLD;
  });
}

function mergeAndSortMessages(initialMessages, existingMessages) {
  const allMessages = [...initialMessages, ...existingMessages];
  return allMessages.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
}

function ensureInitialMessages(chatId, currentUserId, chatConfig, existingMessages) {
  if (hasInitialMessages(existingMessages)) {
    return null;
  }

  if (!chatConfig || chatConfig.initialMessageCount <= 0) {
    return null;
  }

  const initialMessages = generateMessages(
    chatId,
    currentUserId,
    chatConfig.initialMessageCount
  );

  if (existingMessages.length > 0) {
    const sortedMessages = mergeAndSortMessages(initialMessages, existingMessages);
    messageStorage.setMessages(chatId, sortedMessages);
    return sortedMessages;
  }

  messageStorage.setMessages(chatId, initialMessages);
  return initialMessages;
}

export async function getMessages(chatId, currentUserId) {
  if (!chatId || typeof chatId !== "string") {
    throw new InvalidParameterError("chatId", chatId);
  }
  if (!currentUserId || typeof currentUserId !== "string") {
    throw new InvalidParameterError("currentUserId", currentUserId);
  }

  await new Promise((resolve) => setTimeout(resolve, DELAY_CONFIG.getMessages));

  const chatConfig = CHAT_CONFIG.chats[chatId];
  const existingMessages = messageStorage.getMessages(chatId);

  const mergedMessages = ensureInitialMessages(
    chatId,
    currentUserId,
    chatConfig,
    existingMessages
  );

  if (mergedMessages) {
    return mergedMessages;
  }

  if (existingMessages.length > 0) {
    return existingMessages;
  }

  return [];
}
