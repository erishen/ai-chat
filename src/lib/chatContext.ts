import { Message, ChatContextOptions } from '@/types/chat'

/**
 * 聊天上下文管理工具
 * 用于优化多轮对话的上下文处理
 */
export class ChatContextManager {
  private maxMessages: number
  private maxTokens: number
  private includeSystemMessage: boolean

  constructor(options: ChatContextOptions = {}) {
    this.maxMessages = options.maxMessages ?? 20
    this.maxTokens = options.maxTokens ?? 4000
    this.includeSystemMessage = options.includeSystemMessage ?? true
  }

  /**
   * 估算消息的token数量（简单估算）
   */
  private estimateTokens(content: string): number {
    // 简单估算：中文字符约1.5个token，英文单词约1个token
    const chineseChars = (content.match(/[\u4e00-\u9fff]/g) || []).length
    const englishWords = content.split(/\s+/).filter(word => /[a-zA-Z]/.test(word)).length
    return Math.ceil(chineseChars * 1.5 + englishWords)
  }

  /**
   * 优化消息列表以适应上下文限制
   */
  optimizeContext(messages: Message[]): Message[] {
    if (messages.length === 0) return messages

    // 按时间排序（最新的在后面）
    const sortedMessages = [...messages].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    )

    let optimizedMessages: Message[] = []
    let totalTokens = 0
    let messageCount = 0

    // 从最新的消息开始向前添加
    for (let i = sortedMessages.length - 1; i >= 0; i--) {
      const message = sortedMessages[i]
      const messageTokens = this.estimateTokens(message.content)

      // 检查是否超出限制
      if (messageCount >= this.maxMessages || 
          totalTokens + messageTokens > this.maxTokens) {
        break
      }

      optimizedMessages.unshift(message)
      totalTokens += messageTokens
      messageCount++
    }

    return optimizedMessages
  }

  /**
   * 生成对话摘要（用于长对话的上下文压缩）
   */
  generateConversationSummary(messages: Message[]): string {
    if (messages.length === 0) return ''

    const topics = new Set<string>()
    const keyPoints: string[] = []

    messages.forEach(message => {
      if (message.role === 'user') {
        // 提取用户问题的关键词
        const keywords = this.extractKeywords(message.content)
        keywords.forEach(keyword => topics.add(keyword))
      } else if (message.role === 'assistant') {
        // 提取助手回答的要点
        const points = this.extractKeyPoints(message.content)
        keyPoints.push(...points)
      }
    })

    const summary = [
      `对话涉及的主要话题：${Array.from(topics).join('、')}`,
      `关键讨论点：${keyPoints.slice(0, 3).join('；')}`
    ].join('\n')

    return summary
  }

  /**
   * 提取关键词（简单实现）
   */
  private extractKeywords(content: string): string[] {
    // 简单的关键词提取逻辑
    const words = content.split(/[\s，。！？；：、]/g)
      .filter(word => word.length > 1)
      .slice(0, 5)
    return words
  }

  /**
   * 提取要点（简单实现）
   */
  private extractKeyPoints(content: string): string[] {
    // 简单的要点提取逻辑
    const sentences = content.split(/[。！？]/)
      .filter(sentence => sentence.trim().length > 10)
      .slice(0, 2)
    return sentences
  }

  /**
   * 检查是否需要上下文优化
   */
  needsOptimization(messages: Message[]): boolean {
    if (messages.length <= this.maxMessages) return false

    const totalTokens = messages.reduce((sum, msg) => 
      sum + this.estimateTokens(msg.content), 0
    )

    return totalTokens > this.maxTokens
  }
}

/**
 * 默认的聊天上下文管理器实例
 */
export const defaultChatContext = new ChatContextManager({
  maxMessages: 20,
  maxTokens: 4000,
  includeSystemMessage: true
})