import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ThemeProvider } from '@/components/theme'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Chat - 智能聊天助手',
  description: '基于 Next.js 15 和 Vercel AI SDK 构建的智能聊天应用，支持实时对话、流式响应，提供优质的 AI 交互体验',
  keywords: ['AI聊天', '人工智能', 'ChatGPT', '智能助手', 'Next.js', 'React'],
  authors: [{ name: 'AI Chat Team' }],
  creator: 'AI Chat Team',
  publisher: 'AI Chat',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://your-domain.com',
    title: 'AI Chat - 智能聊天助手',
    description: '基于 Next.js 15 和 Vercel AI SDK 构建的智能聊天应用',
    siteName: 'AI Chat',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Chat - 智能聊天助手',
    description: '基于 Next.js 15 和 Vercel AI SDK 构建的智能聊天应用',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="system">
          <ErrorBoundary>
            <div className="min-h-screen gradient-bg">
              {children}
            </div>
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  )
}