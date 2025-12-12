'use client'

import { Trash2 } from 'lucide-react'
import { Card, Button } from '@/components/ui'
import { Flex, Stack } from '@/components/layout'
import { ThemeToggle } from '@/components/theme'

interface ChatHeaderProps {
  onClearChat: () => void
  messageCount: number
}

export function ChatHeader({ onClearChat, messageCount }: ChatHeaderProps) {
  return (
    <Card variant="elevated" className="mb-4 glass-effect">
      <Flex justify="between" align="center">
        <Stack spacing="xs" className="flex-1 text-center">
          <h1 className="text-3xl font-bold text-foreground text-balance">
            AI 聊天助手
          </h1>
          <p className="text-muted-foreground">
            基于 Next.js 15 和 Vercel AI SDK 构建
          </p>
          {messageCount > 0 && (
            <p className="text-sm text-muted-foreground">
              已发送 {messageCount} 条消息
            </p>
          )}
        </Stack>
        
        <Flex gap="sm" align="center">
          <ThemeToggle />
          
          {messageCount > 0 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClearChat}
              className="text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 hover-lift"
              title="清空聊天记录"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          )}
        </Flex>
      </Flex>
    </Card>
  )
}