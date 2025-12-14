import { Conversation, Message } from '@/types/chat'

/**
 * 对话历史管理器
 * 负责保存、加载和管理对话历史
 */
export class ConversationManager {
  private storageKey = 'ai-chat-conversations'
  private currentConversationKey = 'ai-chat-current-conversation'

  /**
   * 检查是否在客户端环境
   */
  private isClient(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined'
  }

  /**
   * 保存对话到本地存储
   */
  saveConversation(conversation: Conversation): void {
    if (!this.isClient()) return

    try {
      const conversations = this.getAllConversations()
      const existingIndex = conversations.findIndex(c => c.id === conversation.id)
      
      if (existingIndex >= 0) {
        conversations[existingIndex] = conversation
      } else {
        conversations.push(conversation)
      }

      // 只保留最近的50个对话
      const sortedConversations = conversations
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 50)

      localStorage.setItem(this.storageKey, JSON.stringify(sortedConversations))
    } catch (error) {
      console.error('Failed to save conversation:', error)
    }
  }

  /**
   * 获取所有对话
   */
  getAllConversations(): Conversation[] {
    if (!this.isClient()) return []

    try {
      const stored = localStorage.getItem(this.storageKey)
      if (!stored) return []
      
      const conversations = JSON.parse(stored) as Conversation[]
      return conversations.map(conv => ({
        ...conv,
        createdAt: new Date(conv.createdAt),
        updatedAt: new Date(conv.updatedAt),
        messages: conv.messages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      }))
    } catch (error) {
      console.error('Failed to load conversations:', error)
      return []
    }
  }

  /**
   * 获取特定对话
   */
  getConversation(id: string): Conversation | null {
    const conversations = this.getAllConversations()
    return conversations.find(c => c.id === id) || null
  }

  /**
   * 删除对话
   */
  deleteConversation(id: string): void {
    if (!this.isClient()) return

    try {
      const conversations = this.getAllConversations()
      const filtered = conversations.filter(c => c.id !== id)
      localStorage.setItem(this.storageKey, JSON.stringify(filtered))
    } catch (error) {
      console.error('Failed to delete conversation:', error)
    }
  }

  /**
   * 创建新对话
   */
  createConversation(firstMessage?: Message): Conversation {
    const now = new Date()
    const conversation: Conversation = {
      id: this.generateId(),
      title: this.generateTitle(firstMessage?.content || '新对话'),
      messages: firstMessage ? [firstMessage] : [],
      createdAt: now,
      updatedAt: now,
      messageCount: firstMessage ? 1 : 0
    }

    this.saveConversation(conversation)
    this.setCurrentConversation(conversation.id)
    return conversation
  }

  /**
   * 更新对话
   */
  updateConversation(id: string, updates: Partial<Conversation>): void {
    const conversation = this.getConversation(id)
    if (!conversation) return

    const updatedConversation: Conversation = {
      ...conversation,
      ...updates,
      updatedAt: new Date(),
      messageCount: updates.messages?.length || conversation.messageCount
    }

    this.saveConversation(updatedConversation)
  }

  /**
   * 添加消息到对话
   */
  addMessageToConversation(conversationId: string, message: Message): void {
    const conversation = this.getConversation(conversationId)
    if (!conversation) return

    const updatedMessages = [...conversation.messages, message]
    this.updateConversation(conversationId, {
      messages: updatedMessages,
      title: conversation.messages.length === 0 ? this.generateTitle(message.content) : conversation.title
    })
  }

  /**
   * 设置当前对话
   */
  setCurrentConversation(id: string): void {
    if (!this.isClient()) return

    try {
      localStorage.setItem(this.currentConversationKey, id)
    } catch (error) {
      console.error('Failed to set current conversation:', error)
    }
  }

  /**
   * 获取当前对话ID
   */
  getCurrentConversationId(): string | null {
    if (!this.isClient()) return null

    try {
      return localStorage.getItem(this.currentConversationKey)
    } catch (error) {
      console.error('Failed to get current conversation:', error)
      return null
    }
  }

  /**
   * 生成对话ID
   */
  private generateId(): string {
    return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * 生成对话标题
   */
  generateTitle(content: string): string {
    const cleanContent = content.trim().replace(/\n/g, ' ')
    if (cleanContent.length <= 20) return cleanContent
    return cleanContent.substring(0, 20) + '...'
  }

  /**
   * 清空所有对话
   */
  clearAllConversations(): void {
    if (!this.isClient()) return

    try {
      localStorage.removeItem(this.storageKey)
      localStorage.removeItem(this.currentConversationKey)
    } catch (error) {
      console.error('Failed to clear conversations:', error)
    }
  }
}

/**
 * 默认的对话管理器实例
 */
export const conversationManager = new ConversationManager()