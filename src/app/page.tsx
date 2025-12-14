'use client'

import { useState } from 'react'
import { ChatHeader } from '@/components/ChatHeader'
import { ChatMessages } from '@/components/ChatMessages'
import { ConversationSidebar } from '@/components/ConversationSidebar'
import { RAGPanel } from '@/components/RAGPanel'
import { useMultiTurnChat } from '@/hooks/useMultiTurnChat'
import { Message } from '@/types/chat'
import { Send, Database } from 'lucide-react'
import { Container, Flex } from '@/components/layout'
import { Card, Button, Textarea } from '@/components/ui'

export default function Home() {
  const [showSidebar, setShowSidebar] = useState(true)
  const [showRAGPanel, setShowRAGPanel] = useState(false)
  
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    conversations,
    currentConversation,
    currentConversationId,
    createNewConversation,
    switchConversation,
    deleteConversation,
    clearCurrentConversation,
    isInitialized
  } = useMultiTurnChat()

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      // 创建一个模拟的表单提交事件
      const form = e.currentTarget.closest('form')
      if (form) {
        const submitEvent = new Event('submit', { bubbles: true, cancelable: true }) as any
        submitEvent.preventDefault = () => e.preventDefault()
        handleSubmit(submitEvent)
      }
    }
  }

  // Convert messages to our Message type
  const typedMessages: Message[] = messages.map(msg => ({
    id: msg.id,
    role: msg.role as 'user' | 'assistant',
    content: msg.content,
    timestamp: new Date(),
    conversationId: currentConversationId || undefined
  }))

  // 等待客户端初始化完成
  if (!isInitialized) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">正在加载...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex">
      {/* 侧边栏 */}
      {showSidebar && (
        <ConversationSidebar
          conversations={conversations}
          currentConversationId={currentConversationId}
          onSelectConversation={switchConversation}
          onDeleteConversation={deleteConversation}
          onCreateNew={createNewConversation}
          className="border-r"
        />
      )}

      {/* 主聊天区域 */}
      <div className="flex-1 flex flex-col">
        <Container size="full" className="h-full flex flex-col py-4">
          <ChatHeader 
            onClearChat={clearCurrentConversation}
            messageCount={messages.length}
            conversationTitle={currentConversation?.title}
            onToggleSidebar={() => setShowSidebar(!showSidebar)}
            showSidebar={showSidebar}
          />

          {/* RAG面板切换按钮 */}
          <div className="mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowRAGPanel(!showRAGPanel)}
              className="flex items-center gap-2"
            >
              <Database className="w-4 h-4" />
              {showRAGPanel ? '隐藏文档管理' : '显示文档管理'}
            </Button>
          </div>

          {/* RAG面板 */}
          {showRAGPanel && (
            <div className="mb-4">
              <RAGPanel 
                currentQuery={input.trim()}
                onDocumentChange={() => {
                  // 文档变化时可以做一些处理，比如重新搜索
                }}
              />
            </div>
          )}

          <Card variant="elevated" padding="none" className="flex-1 overflow-hidden flex flex-col glass-effect">
            <ChatMessages 
              messages={typedMessages}
              isLoading={isLoading}
            />
            
            {/* Chat Input */}
            <div className="border-t border-border p-4">
              <form onSubmit={handleSubmit} className="flex space-x-2">
                <Textarea
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="输入您的消息... (Shift + Enter 换行)"
                  className="flex-1 min-h-11 max-h-32 focus-ring"
                  disabled={isLoading}
                  rows={1}
                />
                <Button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  loading={isLoading}
                  className="hover-lift"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </form>
            </div>
          </Card>
        </Container>
      </div>
    </div>
  )
}