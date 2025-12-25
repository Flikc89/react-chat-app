import { CHAT_CONFIG } from "../config/chatConfig.js";
import messageStorage from "../storage/messageStorage.js";
import { getMessageTemplates } from "../utils/messageGenerator.js";

class WebSocketHandler {
  constructor() {
    this.messageIntervals = new Map();
    this.io = null;
  }

  initialize(io, currentUserId) {
    this.io = io;

    Object.keys(CHAT_CONFIG.chats).forEach((chatId) => {
      const chatConfig = CHAT_CONFIG.chats[chatId];
      if (chatConfig && chatConfig.hasWebSocket) {
        this.startMessageInterval(chatId, currentUserId);
      }
    });
  }

  startMessageInterval(chatId, currentUserId) {
    const chatConfig = CHAT_CONFIG.chats[chatId];
    if (!chatConfig || !chatConfig.hasWebSocket) {
      console.log(`WebSocket messages disabled for ${chatId}, skipping`);
      return;
    }

    if (this.messageIntervals.has(chatId)) {
      return;
    }

    if (!this.io) {
      return;
    }

    const { min, max } = CHAT_CONFIG.websocketInterval;
    console.log(
      `Starting message interval for ${chatId} (random interval: ${min}-${max}ms)`
    );

    const sendNextMessage = () => {
      if (!this.io) return;

      const templates = getMessageTemplates(chatId);
      const randomTemplate =
        templates[Math.floor(Math.random() * templates.length)];

      const newMessage = {
        _id: `msg-${chatId}-${Date.now()}`,
        senderId: chatId,
        receiverId: currentUserId,
        text: randomTemplate,
        createdAt: new Date().toISOString(),
      };

      messageStorage.addMessage(chatId, newMessage);
      console.log(
        `[Storage] Saved message to ${chatId}, total: ${messageStorage.getMessages(chatId).length}`
      );

      const lastMessage = {
        text: newMessage.text,
        createdAt: newMessage.createdAt,
        senderId: newMessage.senderId,
      };

      this.io.to("chatList").emit("chatListUpdate", {
        chatId,
        lastMessage,
        updatedAt: newMessage.createdAt,
      });
      console.log(`[WebSocket] Sent chatListUpdate for ${chatId} to all clients`);

      this.io.to(`chat-${chatId}`).emit("newMessage", newMessage);
      console.log(
        `[WebSocket] Sent newMessage to ${chatId} for subscribed clients`
      );

      const randomInterval = Math.floor(Math.random() * (max - min + 1) + min);

      const timeoutId = setTimeout(() => {
        sendNextMessage();
      }, randomInterval);

      this.messageIntervals.set(chatId, timeoutId);
    };

    const initialDelay = Math.floor(Math.random() * (max - min + 1) + min);
    const timeoutId = setTimeout(() => {
      sendNextMessage();
    }, initialDelay);

    this.messageIntervals.set(chatId, timeoutId);
  }
}

export default new WebSocketHandler();
