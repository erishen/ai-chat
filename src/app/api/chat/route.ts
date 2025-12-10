import { createOpenAI } from '@ai-sdk/openai'
import { streamText } from 'ai'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    // 检查环境变量
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not set')
      return new Response('API key not configured', { status: 500 })
    }

    const openai = createOpenAI({
      baseURL: process.env.OPENAI_BASE_URL,
      apiKey: process.env.OPENAI_API_KEY,
    })

    const result = await streamText({
      model: openai('deepseek-chat'),
      messages,
      system: `你是一个友善、有帮助的AI助手。请用中文回答用户的问题。
      
      特点：
      - 回答要准确、有用
      - 语言要自然、友好
      - 如果不确定答案，要诚实说明
      - 可以提供建议和解决方案
      - 保持对话的连贯性`,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error('Chat API error:', error)
    
    // 更详细的错误信息
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}