'use client'

import { useState, useEffect, useCallback } from 'react'
import { useChat } from '@ai-sdk/react'
import { Message, Conversation } from '@/types/chat'
import { conversationManager } from '@/lib/conversationManager'

export interface UseMultiTurnChatOptions {
  conversationId?: string
  autoSave?: boolean
}

export function useMultiTurnChat(options: UseMultiTurnChatOptions = {}) {
  const { conversationId: initialConversationId, autoSave = true } = options
  
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  const { 
    messages, 
    input, 
    handleInputChange, 
    handleSubmit: originalHandleSubmit, 
    isLoading, 
    setMessages 
  } = useChat({
    onFinish: (message) => {
      if (autoSave && currentConversationId) {
        // 保存AI回复到对话历史
        const aiMessage: Message = {
          id: message.id,
          role: 'assistant',
          content: message.content,
          timestamp: new Date(),
          conversationId: currentConversationId
        }
        conversationManager.addMessageToConversation(currentConversationId, aiMessage)
        loadConversations()
      }
    }
  })

  // 加载对话列表
  const loadConversations = useCallback(() => {
    const allConversations = conversationManager.getAllConversations()
    setConversations(allConversations)
  }, [])

  // 客户端初始化
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedConversationId = initialConversationId || conversationManager.getCurrentConversationId()
      setCurrentConversationId(savedConversationId)
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
        setMessages(conversation.messages)
      }
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
      setMessages(conversation.messages)
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
  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // 如果没有当前对话，创建新对话
    let conversationId = currentConversationId
    if (!conversationId) {
      const newConversation = createNewConversation()
      conversationId = newConversation.id
    }

    // 保存用户消息
    if (autoSave && conversationId && input.trim()) {
      const userMessage: Message = {
        id: `user_${Date.now()}`,
        role: 'user',
        content: input.trim(),
        timestamp: new Date(),
        conversationId
      }
      conversationManager.addMessageToConversation(conversationId, userMessage)
    }

    // 调用原始提交处理
    originalHandleSubmit(e)
    
    // 重新加载对话列表
    loadConversations()
  }, [currentConversationId, createNewConversation, autoSave, input, originalHandleSubmit, loadConversations])

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