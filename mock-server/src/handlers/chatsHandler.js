import { CHAT_LIST } from "../config/chatList.js";
import { CHAT_CONFIG } from "../config/chatConfig.js";
import { DELAY_CONFIG } from "../config/delayConfig.js";
import messageStorage from "../storage/messageStorage.js";
import { generateMessages } from "../utils/messageGenerator.js";
import { getOnlineUsers } from "../config/onlineUsers.js";
import { InvalidParameterError } from "../utils/errors.js";

function getLastMessageFromStorage(messages) {
  if (messages.length === 0) return null;
  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  const lastMsg = sortedMessages[sortedMessages.length - 1];
  return {
    text: lastMsg.text,
    createdAt: lastMsg.createdAt,
    senderId: lastMsg.senderId,
  };
}

function getLastMessageFromGenerated(chatId, currentUserId, initialMessageCount) {
  const generatedMessages = generateMessages(chatId, currentUserId, initialMessageCount);
  if (generatedMessages.length === 0) return null;
  const lastMsg = generatedMessages[generatedMessages.length - 1];
  return {
    text: lastMsg.text,
    createdAt: lastMsg.createdAt,
    senderId: lastMsg.senderId,
  };
}

function getLastMessageForChat(chat, currentUserId) {
  const messages = messageStorage.getMessages(chat.username);
  const lastMessageFromStorage = getLastMessageFromStorage(messages);
  
  if (lastMessageFromStorage) {
    return lastMessageFromStorage;
  }

  const chatConfig = CHAT_CONFIG.chats[chat.username];
  if (chatConfig && chatConfig.initialMessageCount > 0) {
    return getLastMessageFromGenerated(
      chat.username,
      currentUserId,
      chatConfig.initialMessageCount
    );
  }

  return null;
}

export async function getChats(currentUserId) {
  if (!currentUserId || typeof currentUserId !== "string") {
    throw new InvalidParameterError("currentUserId", currentUserId);
  }

  await new Promise((resolve) => setTimeout(resolve, DELAY_CONFIG.getChats));

  const chats = CHAT_LIST.filter(
    (chat) => CHAT_CONFIG.chats[chat.username] !== undefined
  );

  const onlineUsers = getOnlineUsers();

  return chats.map((chat) => {
    const lastMessage = getLastMessageForChat(chat, currentUserId);

    return {
      ...chat,
      lastMessage: lastMessage || undefined,
      isOnline: onlineUsers.includes(chat.username),
    };
  });
}
