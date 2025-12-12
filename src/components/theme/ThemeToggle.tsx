'use client'

import { Button } from '@/components/ui'
import { useTheme } from './ThemeProvider'
import { Sun, Moon, Monitor } from 'lucide-react'

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark')
    } else if (theme === 'dark') {
      setTheme('system')
    } else {
      setTheme('light')
    }
  }

  const getIcon = () => {
    if (theme === 'system') {
      return <Monitor className="h-4 w-4" />
    }
    return resolvedTheme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />
  }

  const getLabel = () => {
    if (theme === 'system') return '跟随系统'
    return resolvedTheme === 'dark' ? '深色模式' : '浅色模式'
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      title={getLabel()}
      className="hover-lift"
    >
      {getIcon()}
      <span className="sr-only">{getLabel()}</span>
    </Button>
  )
}

export function ThemeSelect() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant={theme === 'light' ? 'primary' : 'ghost'}
        size="sm"
        onClick={() => setTheme('light')}
        className="flex items-center space-x-2"
      >
        <Sun className="h-4 w-4" />
        <span>浅色</span>
      </Button>
      <Button
        variant={theme === 'dark' ? 'primary' : 'ghost'}
        size="sm"
        onClick={() => setTheme('dark')}
        className="flex items-center space-x-2"
      >
        <Moon className="h-4 w-4" />
        <span>深色</span>
      </Button>
      <Button
        variant={theme === 'system' ? 'primary' : 'ghost'}
        size="sm"
        onClick={() => setTheme('system')}
        className="flex items-center space-x-2"
      >
        <Monitor className="h-4 w-4" />
        <span>系统</span>
      </Button>
    </div>
  )
}