export class ChatNotFoundError extends Error {
  constructor(chatId) {
    super(`Chat ${chatId} not found`);
    this.name = "ChatNotFoundError";
    this.chatId = chatId;
  }
}

export class InvalidParameterError extends Error {
  constructor(parameterName, value) {
    super(`Invalid parameter: ${parameterName} = ${value}`);
    this.name = "InvalidParameterError";
    this.parameterName = parameterName;
    this.value = value;
  }
}

