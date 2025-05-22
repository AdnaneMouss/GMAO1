export interface ChatMessage {
  id?: number;
  sender: string;
  content: string;
  type: 'CHAT' | 'JOIN' | 'LEAVE' | 'FILE';
  timestamp?: string;
  receiver: string;
  isPrivate?: boolean;
  fileUrl?:File
  }