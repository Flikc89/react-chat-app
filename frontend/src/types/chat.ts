import type { LastMessage } from './message';

/**
 * Чат (диалог) с пользователем
 */
export interface Chat {
  _id: string;
  fullName: string;
  username: string;
  email: string;
  profilePic?: string;
  lastMessage?: LastMessage;
  isOnline?: boolean;
}
