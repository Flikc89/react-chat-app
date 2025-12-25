import { DELAY_CONFIG } from "../config/delayConfig.js";
import messageStorage from "../storage/messageStorage.js";
import { InvalidParameterError } from "../utils/errors.js";

export async function sendMessage(chatId, currentUserId, text) {
  if (!chatId || typeof chatId !== "string") {
    throw new InvalidParameterError("chatId", chatId);
  }
  if (!currentUserId || typeof currentUserId !== "string") {
    throw new InvalidParameterError("currentUserId", currentUserId);
  }
  if (!text || typeof text !== "string" || text.trim().length === 0) {
    throw new InvalidParameterError("text", text);
  }

  await new Promise((resolve) => setTimeout(resolve, DELAY_CONFIG.sendMessage));

  const newMessage = {
    _id: `msg-${chatId}-${Date.now()}`,
    senderId: currentUserId,
    receiverId: chatId,
    text,
    createdAt: new Date().toISOString(),
  };

  messageStorage.addMessage(chatId, newMessage);
  console.log(
    `[Storage] Saved sent message to ${chatId}, total: ${messageStorage.getMessages(chatId).length}`
  );

  return newMessage;
}
