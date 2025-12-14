'use client'

import { useState, useEffect, useCallback } from 'react'
import { useChat } from '@ai-sdk/react'
import { Message, Conversation } from '@/types/chat'
import { conversationManager } from '@/lib/conversationManager'
import { ragManager } from '@/lib/ragManager'

export interface UseMultiTurnChatOptions {
  conversationId?: string
  autoSave?: boolean
}

export function useMultiTurnChat(options: UseMultiTurnChatOptions = {}) {
  const { conversationId: initialConversationId, autoSave = true } = options
  
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  const [ragContextState, setRagContextState] = useState('')

  const { 
    messages, 
    input, 
    handleInputChange, 
    handleSubmit: originalHandleSubmit, 
    isLoading, 
    setMessages 
  } = useChat({
    body: {
      ragContext: ragContextState
    }
  })

  // 加载对话列表
  const loadConversations = useCallback(() => {
    const allConversations = conversationManager.getAllConversations()
    setConversations(allConversations)
  }, [])

  // 监听messages变化并自动保存
  useEffect(() => {
    if (!currentConversationId || messages.length === 0) return
    
    // 转换为我们的消息格式
    const formattedMessages = messages.map(msg => ({
      id: msg.id,
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
      timestamp: new Date(),
      conversationId: currentConversationId
    }))
    
    // 获取当前对话信息
    const currentConversation = conversationManager.getConversation(currentConversationId)
    
    // 更新对话，保留现有标题或生成新标题
    const updateData: any = {
      messages: formattedMessages
    }
    
    // 标题生成逻辑
    if (!currentConversation?.title || currentConversation.title === '新对话') {
      const firstUserMessage = formattedMessages.find(msg => msg.role === 'user')
      if (firstUserMessage) {
        updateData.title = conversationManager.generateTitle(firstUserMessage.content)
      }
    }
    
    try {
      conversationManager.updateConversation(currentConversationId, updateData)
      
      // 重新加载对话列表以更新UI
      const allConversations = conversationManager.getAllConversations()
      setConversations(allConversations)
    } catch (error) {
      console.error('Failed to save conversation:', error)
    }
  }, [messages, currentConversationId])

  // 客户端初始化
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 检查是否是首次使用（没有任何对话数据）
      const allConversations = conversationManager.getAllConversations()
      const savedConversationId = initialConversationId || conversationManager.getCurrentConversationId()
      
      // 如果没有对话且没有当前对话ID，创建一个新对话
      if (allConversations.length === 0 && !savedConversationId) {
        const newConversation = conversationManager.createConversation()
        setCurrentConversationId(newConversation.id)
      } else {
        setCurrentConversationId(savedConversationId)
      }
      
      setIsInitialized(true)
    }
  }, [initialConversationId])

  // 初始化加载
  useEffect(() => {
    if (!isInitialized) return

    loadConversations()
    
    // 如果有当前对话ID，加载对话内容
    if (currentConversationId) {
      const conversation = conversationManager.getConversation(currentConversationId)
      if (conversation) {
        // 确保消息格式正确
        const formattedMessages = conversation.messages.map(msg => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          createdAt: msg.timestamp || new Date()
        }))
        
        setMessages(formattedMessages)
      } else {
        setMessages([])
      }
    } else {
      setMessages([])
    }
  }, [currentConversationId, setMessages, loadConversations, isInitialized])

  // 创建新对话
  const createNewConversation = useCallback(() => {
    const newConversation = conversationManager.createConversation()
    setCurrentConversationId(newConversation.id)
    setMessages([])
    loadConversations()
    return newConversation
  }, [setMessages, loadConversations])

  // 切换对话
  const switchConversation = useCallback((conversationId: string) => {
    const conversation = conversationManager.getConversation(conversationId)
    if (conversation) {
      setCurrentConversationId(conversationId)
      conversationManager.setCurrentConversation(conversationId)
      
      // 确保消息格式正确
      const formattedMessages = conversation.messages.map(msg => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        createdAt: msg.timestamp || new Date()
      }))
      
      setMessages(formattedMessages)
    }
  }, [setMessages])

  // 删除对话
  const deleteConversation = useCallback((conversationId: string) => {
    conversationManager.deleteConversation(conversationId)
    
    // 如果删除的是当前对话，创建新对话
    if (conversationId === currentConversationId) {
      createNewConversation()
    }
    
    loadConversations()
  }, [currentConversationId, createNewConversation, loadConversations])

  // 清空当前对话
  const clearCurrentConversation = useCallback(() => {
    if (currentConversationId) {
      conversationManager.updateConversation(currentConversationId, {
        messages: [],
        messageCount: 0
      })
      setMessages([])
      loadConversations()
    }
  }, [currentConversationId, setMessages, loadConversations])

  // 增强的提交处理
  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // 如果没有当前对话，创建新对话
    let conversationId = currentConversationId
    if (!conversationId) {
      const newConversation = createNewConversation()
      conversationId = newConversation.id
    }

    // 生成RAG上下文（在客户端）
    if (input.trim()) {
      try {
        const ragContext = await ragManager.generateChatContext(input.trim(), 3)
        
        // 设置RAG上下文状态
        setRagContextState(ragContext)
        
        // 等待状态更新后再提交
        setTimeout(() => {
          originalHandleSubmit(e)
        }, 50)
        
        return
      } catch (error) {
        // 忽略RAG错误，继续正常聊天
      }
    }
    
    // 如果没有输入或RAG生成失败，直接提交
    setRagContextState('')
    originalHandleSubmit(e)
  }, [currentConversationId, createNewConversation, input, originalHandleSubmit])

  // 获取当前对话
  const currentConversation = currentConversationId 
    ? conversations.find(c => c.id === currentConversationId)
    : null

  return {
    // 基础聊天功能
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    
    // 多轮对话功能
    conversations,
    currentConversation,
    currentConversationId,
    createNewConversation,
    switchConversation,
    deleteConversation,
    clearCurrentConversation,
    
    // 工具方法
    loadConversations,
    isInitialized
  }
}