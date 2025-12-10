'use client'

import { useState } from 'react'
import { Message } from '@/types/chat'
import { cn } from '@/lib/utils'
import { Bot, User, Copy, Check } from 'lucide-react'

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className={cn(
        "flex items-start space-x-3 animate-slide-up group",
        message.role === 'user' ? 'justify-end' : 'justify-start'
      )}
    >
      {message.role === 'assistant' && (
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
          <Bot className="w-5 h-5 text-white" />
        </div>
      )}
      
      <div className="relative">
        <div
          className={cn(
            "max-w-xs lg:max-w-md px-4 py-2 rounded-lg relative",
            message.role === 'user'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white'
          )}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
          
          {/* Copy button */}
          <button
            onClick={copyToClipboard}
            className={cn(
              "absolute top-2 right-2 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity",
              message.role === 'user'
                ? 'hover:bg-blue-600'
                : 'hover:bg-gray-200 dark:hover:bg-gray-600'
            )}
          >
            {copied ? (
              <Check className="w-3 h-3" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </button>
        </div>
        
        <div className="text-xs text-gray-500 mt-1">
          {message.timestamp.toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>

      {message.role === 'user' && (
        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
          <User className="w-5 h-5 text-white" />
        </div>
      )}
    </div>
  )
}