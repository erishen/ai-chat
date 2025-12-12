'use client'

import { useChat } from '@ai-sdk/react'
import { ChatHeader } from '@/components/ChatHeader'
import { ChatMessages } from '@/components/ChatMessages'
import { Message } from '@/types/chat'
import { Send } from 'lucide-react'
import { Container } from '@/components/layout'
import { Card, Button, Textarea } from '@/components/ui'

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat()

  const handleClearChat = () => {
    setMessages([])
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  // Convert messages to our Message type
  const typedMessages: Message[] = messages.map(msg => ({
    id: msg.id,
    role: msg.role as 'user' | 'assistant',
    content: msg.content,
    timestamp: new Date()
  }))

  return (
    <Container size="lg" className="h-screen flex flex-col py-4">
      <ChatHeader 
        onClearChat={handleClearChat}
        messageCount={messages.length}
      />

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
  )
}