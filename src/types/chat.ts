export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  // 多轮对话相关字段
  conversationId?: string;
  parentMessageId?: string;
  metadata?: {
    tokens?: number;
    model?: string;
    temperature?: number;
    finishReason?: string;
  };
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error?: string;
  // 多轮对话状态
  conversationId?: string;
  contextLength?: number;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  messageCount: number;
}

export interface ChatContextOptions {
  maxMessages?: number; // 最大保留消息数
  maxTokens?: number;   // 最大token数
  includeSystemMessage?: boolean; // 是否包含系统消息
}