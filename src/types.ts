export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export interface ChatHistory {
  messages: Message[];
}

export interface FAQ {
  question: string;
  answer: string;
  category: string;
}