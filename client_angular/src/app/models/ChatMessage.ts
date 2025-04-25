export interface ChatMessage {
  id?: number;
  sender: string;
  content: string;
  type: 'CHAT' | 'JOIN' | 'LEAVE';
  timestamp?: string;
  receiver: string;
  isPrivate?: boolean;
  }