/**
 * 向量工具函数
 * 提供向量相似度计算和向量操作功能
 */

/**
 * 计算两个向量的余弦相似度
 * @param vecA 向量A
 * @param vecB 向量B
 * @returns 相似度分数 (0-1)
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    console.warn(`Vector length mismatch: vecA=${vecA.length}, vecB=${vecB.length}`)
    
    // 如果向量长度不同，尝试对齐到较短的长度
    const minLength = Math.min(vecA.length, vecB.length)
    if (minLength === 0) {
      return 0
    }
    
    // 截取或填充向量到相同长度
    const alignedVecA = vecA.length > minLength ? vecA.slice(0, minLength) : 
                        [...vecA, ...new Array(minLength - vecA.length).fill(0)]
    const alignedVecB = vecB.length > minLength ? vecB.slice(0, minLength) : 
                        [...vecB, ...new Array(minLength - vecB.length).fill(0)]
    
    return calculateCosineSimilarity(alignedVecA, alignedVecB)
  }

  return calculateCosineSimilarity(vecA, vecB)
}

/**
 * 计算余弦相似度的核心函数
 */
function calculateCosineSimilarity(vecA: number[], vecB: number[]): number {
  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i]
    normA += vecA[i] * vecA[i]
    normB += vecB[i] * vecB[i]
  }

  normA = Math.sqrt(normA)
  normB = Math.sqrt(normB)

  if (normA === 0 || normB === 0) {
    return 0
  }

  return dotProduct / (normA * normB)
}

/**
 * 计算欧几里得距离
 * @param vecA 向量A
 * @param vecB 向量B
 * @returns 距离值
 */
export function euclideanDistance(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    throw new Error('Vectors must have the same length')
  }

  let sum = 0
  for (let i = 0; i < vecA.length; i++) {
    const diff = vecA[i] - vecB[i]
    sum += diff * diff
  }

  return Math.sqrt(sum)
}

/**
 * 将欧几里得距离转换为相似度分数 (0-1)
 * @param distance 欧几里得距离
 * @returns 相似度分数
 */
export function distanceToSimilarity(distance: number): number {
  return 1 / (1 + distance)
}

/**
 * 向量归一化
 * @param vector 输入向量
 * @returns 归一化后的向量
 */
export function normalizeVector(vector: number[]): number[] {
  const norm = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0))
  if (norm === 0) return vector
  return vector.map(val => val / norm)
}

/**
 * 生成简单的文本向量嵌入（基于TF-IDF的简化版本）
 * 这是一个简化的实现，实际应用中应该使用更先进的模型
 * @param text 输入文本
 * @param vocabulary 词汇表
 * @returns 向量嵌入
 */
export function generateSimpleEmbedding(text: string, vocabulary?: string[]): number[] {
  // 简单的文本预处理
  const words = text.toLowerCase()
    .replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s]/g, ' ') // 保留中文、英文、数字
    .split(/\s+/)
    .filter(word => word.length > 1)

  // 如果没有提供词汇表，使用文本中的词汇
  const vocab = vocabulary || [...new Set(words)]
  
  // 生成词频向量
  const vector = new Array(Math.max(vocab.length, 100)).fill(0)
  
  // 计算词频
  const wordCount: { [key: string]: number } = {}
  words.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1
  })

  // 填充向量
  vocab.forEach((word, index) => {
    if (index < vector.length && wordCount[word]) {
      vector[index] = wordCount[word] / words.length // 归一化词频
    }
  })

  // 添加一些基于文本特征的维度
  if (vector.length > vocab.length) {
    const remainingDims = vector.length - vocab.length
    const features = [
      text.length / 1000, // 文本长度特征
      words.length / 100, // 词数特征
      (text.match(/[？！。]/g) || []).length / text.length, // 标点密度
      (text.match(/[\u4e00-\u9fa5]/g) || []).length / text.length, // 中文字符比例
    ]
    
    for (let i = 0; i < Math.min(remainingDims, features.length); i++) {
      vector[vocab.length + i] = features[i] || 0
    }
  }

  return normalizeVector(vector)
}

/**
 * 使用OpenAI API生成向量嵌入（如果可用）
 * @param text 输入文本
 * @returns Promise<向量嵌入>
 */
export async function generateOpenAIEmbedding(text: string): Promise<number[]> {
  try {
    // 优先检查阿里云配置
    const aliApiKey = process.env.ALI_API_KEY
    const aliBaseUrl = process.env.ALI_BASE_URL
    const aliModel = process.env.ALI_EMBEDDING_MODEL
    
    if (aliApiKey && aliBaseUrl && aliModel) {
      try {
        console.log('Using Alibaba Cloud embedding API')
        const aliResponse = await fetch(`${aliBaseUrl}/embeddings`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${aliApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            input: text,
            model: aliModel,
          }),
        })

        if (aliResponse.ok) {
          const aliData = await aliResponse.json()
          return aliData.data[0].embedding
        } else {
          const errorText = await aliResponse.text()
          console.warn(`Alibaba Cloud API error: ${aliResponse.status} - ${errorText}`)
        }
      } catch (aliError) {
        console.warn('Alibaba Cloud embedding failed:', aliError)
      }
    }

    // 回退到 OpenAI/DeepSeek 配置
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      console.warn('No API key found, falling back to simple embedding')
      return generateSimpleEmbedding(text)
    }

    // 检查是否使用DeepSeek API
    const baseUrl = process.env.OPENAI_BASE_URL
    const isDeepSeek = baseUrl && baseUrl.includes('deepseek.com')
    
    if (isDeepSeek) {
      // DeepSeek API 目前可能不支持 embeddings 或模型名称不正确
      // 直接使用本地实现以确保功能正常
      console.warn('Using simple embedding for DeepSeek to ensure functionality')
      return generateSimpleEmbedding(text)
    }
    
    // 使用标准 OpenAI API
    const apiUrl = baseUrl ? `${baseUrl}/v1/embeddings` : 'https://api.openai.com/v1/embeddings'
    const model = process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small'

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: text,
        model: model,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.warn(`OpenAI API error: ${response.status} - ${errorText}`)
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    return data.data[0].embedding
  } catch (error) {
    console.warn('Failed to generate embedding, falling back to simple embedding:', error)
    return generateSimpleEmbedding(text)
  }
}

/**
 * 批量计算向量相似度
 * @param queryVector 查询向量
 * @param vectors 候选向量数组
 * @param method 相似度计算方法
 * @returns 相似度分数数组
 */
export function batchSimilarity(
  queryVector: number[],
  vectors: number[][],
  method: 'cosine' | 'euclidean' = 'cosine'
): number[] {
  return vectors.map(vector => {
    if (method === 'cosine') {
      return cosineSimilarity(queryVector, vector)
    } else {
      const distance = euclideanDistance(queryVector, vector)
      return distanceToSimilarity(distance)
    }
  })
}