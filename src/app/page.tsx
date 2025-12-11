'use client'

import { useChat } from '@ai-sdk/react'
import { ChatHeader } from '@/components/ChatHeader'
import { ChatMessages } from '@/components/ChatMessages'
import { Message } from '@/types/chat'
import { Send, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

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
    <div className="container mx-auto max-w-4xl h-screen flex flex-col p-4">
      <ChatHeader 
        onClearChat={handleClearChat}
        messageCount={messages.length}
      />

      <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col">
        <ChatMessages 
          messages={typedMessages}
          isLoading={isLoading}
        />
        
        {/* 直接使用 useChat 的输入框 */}
        <div className="border-t dark:border-gray-700 p-4">
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <textarea
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="输入您的消息... (Shift + Enter 换行)"
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none min-h-11 max-h-32"
              disabled={isLoading}
              rows={1}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className={cn(
                "px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}