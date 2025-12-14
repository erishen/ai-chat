import { NextRequest } from 'next/server'
import { cosineSimilarity, generateSimpleEmbedding, generateOpenAIEmbedding } from '@/lib/vectorUtils'

export async function POST(req: NextRequest) {
  try {
    const { query, documents, chunks, topK = 5 } = await req.json()

    if (!query || typeof query !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Query is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (!documents || !chunks || documents.length === 0 || chunks.length === 0) {
      return new Response(
        JSON.stringify({ 
          query,
          results: [],
          totalResults: 0,
          searchTime: 0
        }),
        { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    const startTime = Date.now()

    try {
      // 使用向量搜索
      const results = await performVectorSearch(query, documents, chunks, topK)
      
      const searchTime = Date.now() - startTime

      return new Response(
        JSON.stringify({
          query,
          results,
          totalResults: results.length,
          searchTime
        }),
        { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    } catch (vectorError) {
      console.warn('Vector search failed, falling back to keyword search:', vectorError)
      
      // 如果向量搜索失败，回退到关键词搜索
      const results = performKeywordSearch(query, documents, chunks, topK)
      
      const searchTime = Date.now() - startTime

      return new Response(
        JSON.stringify({
          query,
          results,
          totalResults: results.length,
          searchTime
        }),
        { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: 'Search failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

/**
 * 执行向量搜索
 */
async function performVectorSearch(query: string, documents: any[], chunks: any[], topK: number) {
  // 生成查询向量
  let queryEmbedding: number[]
  try {
    queryEmbedding = await generateOpenAIEmbedding(query)
  } catch (error) {
    queryEmbedding = generateSimpleEmbedding(query)
  }

  const results = []

  for (const chunk of chunks) {
    const document = documents.find((d: any) => d.id === chunk.documentId)
    if (!document || !chunk.embedding) continue

    try {
      // 检查向量维度
      if (!Array.isArray(chunk.embedding) || chunk.embedding.length === 0) {
        continue
      }
      
      // 计算向量相似度
      const similarity = cosineSimilarity(queryEmbedding, chunk.embedding)
      
      // 对于负相似度，我们需要特殊处理
      const adjustedSimilarity = similarity < 0 ? 0 : similarity
      
      if (adjustedSimilarity > 0.01 || similarity > -0.1) { // 更宽松的阈值，包括小的负值
        results.push({
          chunk,
          document,
          score: Math.max(adjustedSimilarity, 0.01), // 确保分数为正
          relevance: adjustedSimilarity > 0.3 ? 'high' : adjustedSimilarity > 0.1 ? 'medium' : 'low'
        })
      }
    } catch (error) {
      // 忽略计算错误，继续处理下一个块
    }
  }

  // 按相似度排序并返回前topK个结果
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
}

/**
 * 执行关键词搜索（回退方案）
 */
function performKeywordSearch(query: string, documents: any[], chunks: any[], topK: number) {
  const queryWords = query.toLowerCase()
    .replace(/[，。！？；：""''（）【】]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 0)

  const results = []

  for (const chunk of chunks) {
    const document = documents.find((d: any) => d.id === chunk.documentId)
    if (!document) continue

    const chunkContent = chunk.content.toLowerCase()
    let matchCount = 0
    let totalMatches = 0

    for (const queryWord of queryWords) {
      if (queryWord.length < 2) continue

      if (chunkContent.includes(queryWord)) {
        matchCount++
        totalMatches++
      }

      if (document.title.toLowerCase().includes(queryWord)) {
        matchCount++
        totalMatches++
      }
    }

    // 处理通用查询
    if (queryWords.length === 0 || totalMatches === 0) {
      if (query.includes('文档') || query.includes('讲') || query.includes('内容') || query.includes('啥') || query.includes('什么')) {
        matchCount = 1
        totalMatches = 1
      }
    }

    const score = queryWords.length > 0 ? matchCount / Math.max(queryWords.length, 1) : 0.5

    if (score > 0 || totalMatches > 0) {
      results.push({
        chunk,
        document,
        score: Math.max(score, 0.1),
        relevance: score > 0.7 ? 'high' : score > 0.3 ? 'medium' : 'low'
      })
    }
  }

  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
}