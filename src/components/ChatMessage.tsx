'use client'

import { useState } from 'react'
import { Message } from '@/types/chat'
import { cn } from '@/lib/utils'
import { Bot, User, Copy, Check } from 'lucide-react'
import { MarkdownRenderer } from './MarkdownRenderer'

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
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shrink-0 mt-1">
          <Bot className="w-5 h-5 text-white" />
        </div>
      )}
      
      <div className="relative max-w-xs lg:max-w-2xl xl:max-w-3xl">
        <div
          className={cn(
            "px-4 py-3 rounded-lg relative",
            message.role === 'user'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white'
          )}
        >
          {message.role === 'assistant' ? (
            <MarkdownRenderer 
              content={message.content}
              className="prose-sm"
            />
          ) : (
            <p className="whitespace-pre-wrap">{message.content}</p>
          )}
          
          {/* Copy button */}
          <button
            onClick={copyToClipboard}
            className={cn(
              "absolute top-2 right-2 p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10",
              message.role === 'user'
                ? 'hover:bg-blue-600 text-white'
                : 'hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300'
            )}
            title={copied ? '已复制!' : '复制消息'}
          >
            {copied ? (
              <Check className="w-3 h-3" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </button>
        </div>
        
        <div className="text-xs text-gray-500 mt-1 px-1">
          {message.timestamp.toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>

      {message.role === 'user' && (
        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shrink-0 mt-1">
          <User className="w-5 h-5 text-white" />
        </div>
      )}
    </div>
  )
}