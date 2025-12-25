class MessageStorage {
  constructor() {
    this.messagesByChatId = new Map();
  }

  getMessages(chatId) {
    return this.messagesByChatId.get(chatId) || [];
  }

  setMessages(chatId, messages) {
    this.messagesByChatId.set(chatId, messages);
  }

  addMessage(chatId, message) {
    const existingMessages = this.getMessages(chatId);
    this.messagesByChatId.set(chatId, [...existingMessages, message]);
  }
}

export default new MessageStorage();
