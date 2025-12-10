'use client'

import { useState } from 'react'
import { Moon, Sun, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatHeaderProps {
  onClearChat: () => void
  messageCount: number
}

export function ChatHeader({ onClearChat, messageCount }: ChatHeaderProps) {
  const [isDark, setIsDark] = useState(false)

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-4">
      <div className="flex items-center justify-between">
        <div className="text-center flex-1">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            AI 聊天助手
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            基于 Next.js 15 和 Vercel AI SDK 构建
          </p>
          {messageCount > 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              已发送 {messageCount} 条消息
            </p>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="切换主题"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            )}
          </button>
          
          {messageCount > 0 && (
            <button
              onClick={onClearChat}
              className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400"
              title="清空聊天记录"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}