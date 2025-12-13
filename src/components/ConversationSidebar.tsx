'use client'

import { useState } from 'react'
import { Conversation } from '@/types/chat'
import { Card, Button } from '@/components/ui'
import { Stack, Flex } from '@/components/layout'
import { MessageSquare, Trash2, Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ConversationSidebarProps {
  conversations: Conversation[]
  currentConversationId: string | null
  onSelectConversation: (id: string) => void
  onDeleteConversation: (id: string) => void
  onCreateNew: () => void
  className?: string
}

export function ConversationSidebar({
  conversations,
  currentConversationId,
  onSelectConversation,
  onDeleteConversation,
  onCreateNew,
  className
}: ConversationSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffTime = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return '今天'
    if (diffDays === 1) return '昨天'
    if (diffDays < 7) return `${diffDays}天前`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
  }

  const groupedConversations = conversations.reduce((groups, conv) => {
    const date = formatDate(conv.updatedAt)
    if (!groups[date]) groups[date] = []
    groups[date].push(conv)
    return groups
  }, {} as Record<string, Conversation[]>)

  if (isCollapsed) {
    return (
      <div className={cn('w-12 border-r border-border bg-background/50', className)}>
        <Stack spacing="sm" className="p-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(false)}
            title="展开侧边栏"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onCreateNew}
            title="新建对话"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </Stack>
      </div>
    )
  }

  return (
    <Card 
      variant="outline" 
      padding="none" 
      className={cn('w-80 h-full overflow-hidden flex flex-col', className)}
    >
      {/* 头部 */}
      <div className="p-4 border-b border-border">
        <Flex justify="between" align="center">
          <h2 className="font-semibold text-foreground">对话历史</h2>
          <Flex gap="xs">
            <Button
              variant="ghost"
              size="icon"
              onClick={onCreateNew}
              title="新建对话"
            >
              <Plus className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(true)}
              title="收起侧边栏"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </Flex>
        </Flex>
      </div>

      {/* 对话列表 */}
      <div className="flex-1 overflow-y-auto">
        {Object.keys(groupedConversations).length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">暂无对话历史</p>
            <Button
              variant="outline"
              size="sm"
              onClick={onCreateNew}
              className="mt-2"
            >
              开始新对话
            </Button>
          </div>
        ) : (
          <Stack spacing="none">
            {Object.entries(groupedConversations).map(([date, convs]) => (
              <div key={date}>
                <div className="px-4 py-2 text-xs font-medium text-muted-foreground bg-muted/30">
                  {date}
                </div>
                <Stack spacing="xs" className="p-2">
                  {convs.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={cn(
                        'group relative rounded-lg p-3 cursor-pointer transition-colors',
                        'hover:bg-accent/50',
                        currentConversationId === conversation.id
                          ? 'bg-accent text-accent-foreground'
                          : 'text-foreground'
                      )}
                      onClick={() => onSelectConversation(conversation.id)}
                    >
                      <Flex justify="between" align="start" gap="sm">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm truncate">
                            {conversation.title}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            {conversation.messageCount} 条消息
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            onDeleteConversation(conversation.id)
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </Flex>
                    </div>
                  ))}
                </Stack>
              </div>
            ))}
          </Stack>
        )}
      </div>
    </Card>
  )
}