'use client'

import { Trash2, Menu, X } from 'lucide-react'
import { Card, Button } from '@/components/ui'
import { Flex, Stack } from '@/components/layout'
import { ThemeToggle } from '@/components/theme'

interface ChatHeaderProps {
  onClearChat: () => void
  messageCount: number
  conversationTitle?: string
  onToggleSidebar?: () => void
  showSidebar?: boolean
}

export function ChatHeader({ 
  onClearChat, 
  messageCount, 
  conversationTitle,
  onToggleSidebar,
  showSidebar = true
}: ChatHeaderProps) {
  return (
    <Card variant="elevated" className="mb-4 glass-effect">
      <Flex justify="between" align="center">
        {/* 左侧：侧边栏切换按钮 */}
        <Flex gap="sm" align="center">
          {onToggleSidebar && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleSidebar}
              title={showSidebar ? "隐藏侧边栏" : "显示侧边栏"}
            >
              {showSidebar ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          )}
        </Flex>

        {/* 中间：标题区域 */}
        <Stack spacing="xs" className="flex-1 text-center">
          <h1 className="text-2xl font-bold text-foreground text-balance">
            {conversationTitle || 'AI 聊天助手'}
          </h1>
          <p className="text-muted-foreground text-sm">
            基于 Next.js 15 和 Vercel AI SDK 构建 • 支持多轮对话
          </p>
          {messageCount > 0 && (
            <p className="text-xs text-muted-foreground">
              当前对话 {messageCount} 条消息
            </p>
          )}
        </Stack>
        
        {/* 右侧：操作按钮 */}
        <Flex gap="sm" align="center">
          <ThemeToggle />
          
          {messageCount > 0 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClearChat}
              className="text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 hover-lift"
              title="清空当前对话"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          )}
        </Flex>
      </Flex>
    </Card>
  )
}