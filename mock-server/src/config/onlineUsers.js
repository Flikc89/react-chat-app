import { CHAT_CONFIG } from "./chatConfig.js";

export const getOnlineUsers = () => {
  return Object.entries(CHAT_CONFIG.chats)
    .filter(([username, config]) => config.hasWebSocket === true)
    .map(([username]) => username);
};

