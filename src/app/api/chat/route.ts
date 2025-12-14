import { createOpenAI } from '@ai-sdk/openai'
import { streamText } from 'ai'
import { defaultChatContext } from '@/lib/chatContext'
import { ragManager } from '@/lib/ragManager'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages, enableRAG = true, ragContext: providedRagContext } = await req.json()

    // 优化消息上下文以支持多轮对话
    const optimizedMessages = defaultChatContext.optimizeContext(messages)
    
    // 如果消息过多，生成对话摘要
    let contextSummary = ''
    if (defaultChatContext.needsOptimization(messages)) {
      contextSummary = defaultChatContext.generateConversationSummary(messages)
    }

    // RAG增强：从客户端传递的上下文
    let ragContext = ''
    
    if (providedRagContext && typeof providedRagContext === 'string') {
      ragContext = providedRagContext
    }

    // 检查环境变量
    if (!process.env.OPENAI_API_KEY) {
      return new Response('API key not configured', { status: 500 })
    }

    const openai = createOpenAI({
      baseURL: process.env.OPENAI_BASE_URL,
      apiKey: process.env.OPENAI_API_KEY,
    })

    // 构建系统提示词
    let systemPrompt = `你是一个友善、有帮助的AI助手。请用中文回答用户的问题。

特点：
- 回答要准确、有用
- 语言要自然、友好
- 如果不确定答案，要诚实说明
- 可以提供建议和解决方案
- 保持对话的连贯性和上下文理解
- 能够记住之前的对话内容并基于此进行回答
- 在多轮对话中保持一致的语调和风格

多轮对话指导：
- 仔细阅读整个对话历史
- 理解用户问题与之前对话的关联
- 在回答中适当引用之前的内容
- 保持话题的连续性和逻辑性

RAG增强指导：
- 如果提供了相关文档信息，请优先基于文档内容回答
- 在引用文档内容时，要自然地融入回答中
- 如果文档信息不足以完全回答问题，可以结合你的知识补充
- 明确区分哪些信息来自文档，哪些是你的推理或建议`

    // 如果有对话摘要，添加到系统提示中
    if (contextSummary) {
      systemPrompt += `\n\n对话背景摘要：\n${contextSummary}`
    }

    // 如果有RAG上下文，添加到系统提示中
    if (ragContext) {
      systemPrompt += `\n\n${ragContext}`
    }

    const result = await streamText({
      model: openai(process.env.OPENAI_MODEL || ''),
      messages: optimizedMessages,
      system: systemPrompt,
      temperature: 0.7,
      maxTokens: 2000,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    
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