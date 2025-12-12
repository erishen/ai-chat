'use client'

import { useState } from 'react'
import { Message } from '@/types/chat'
import { cn } from '@/lib/utils'
import { Bot, User, Copy, Check } from 'lucide-react'
import { MarkdownRenderer } from './MarkdownRenderer'
import { Avatar, AvatarFallback, Button } from '@/components/ui'

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
        "chat-message",
        message.role === 'user' ? 'chat-message-user' : 'chat-message-assistant'
      )}
    >
      {message.role === 'assistant' && (
        <Avatar className="chat-avatar chat-avatar-assistant">
          <AvatarFallback>
            <Bot className="w-5 h-5 text-white" />
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className="relative max-w-xs lg:max-w-2xl xl:max-w-3xl">
        <div
          className={cn(
            "chat-bubble",
            message.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-assistant'
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
          <Button
            variant="ghost"
            size="icon"
            onClick={copyToClipboard}
            className={cn(
              "absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity z-10",
              message.role === 'user'
                ? 'hover:bg-white/20 text-white'
                : 'hover:bg-black/10 dark:hover:bg-white/10'
            )}
            title={copied ? '已复制!' : '复制消息'}
          >
            {copied ? (
              <Check className="w-3 h-3" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground mt-1 px-1">
          {message.timestamp.toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>

      {message.role === 'user' && (
        <Avatar className="chat-avatar chat-avatar-user">
          <AvatarFallback>
            <User className="w-5 h-5 text-white" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}