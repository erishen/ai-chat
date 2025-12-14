import { Document, DocumentChunk, SearchResult, VectorStore } from '@/types/rag'

/**
 * 基于 localStorage 的向量存储实现
 * 提供持久化存储，比内存存储更可靠
 */
export class LocalStorageVectorStore implements VectorStore {
  private documentsKey = 'rag-documents'
  private chunksKey = 'rag-chunks'

  constructor() {
    this.initStorage()
  }

  private initStorage(): void {
    if (typeof window === 'undefined') return
    
    // 确保存储键存在
    if (!localStorage.getItem(this.documentsKey)) {
      localStorage.setItem(this.documentsKey, JSON.stringify({}))
    }
    if (!localStorage.getItem(this.chunksKey)) {
      localStorage.setItem(this.chunksKey, JSON.stringify({}))
    }
  }

  async addDocument(document: Document, chunks: DocumentChunk[]): Promise<void> {
    if (typeof window === 'undefined') {
      return
    }

    try {
      // 存储文档
      const documents = this.getDocuments()
      documents[document.id] = document
      localStorage.setItem(this.documentsKey, JSON.stringify(documents))
      
      // 存储文档块
      const allChunks = this.getChunks()
      for (const chunk of chunks) {
        allChunks[chunk.id] = chunk
      }
      localStorage.setItem(this.chunksKey, JSON.stringify(allChunks))
      
    } catch (error) {
      throw error
    }
  }

  async search(query: string, topK: number = 5): Promise<SearchResult[]> {
    if (typeof window === 'undefined') {
      return []
    }

    const documents = this.getDocuments()
    const chunks = this.getChunks()
    
    try {
      // 尝试使用向量搜索
      return await this.performVectorSearch(query, documents, chunks, topK)
    } catch (error) {
      console.warn('Vector search failed, falling back to keyword search:', error)
      // 回退到关键词搜索
      return this.performKeywordSearch(query, documents, chunks, topK)
    }
  }

  /**
   * 执行向量搜索
   */
  private async performVectorSearch(
    query: string, 
    documents: { [key: string]: Document }, 
    chunks: { [key: string]: DocumentChunk }, 
    topK: number
  ): Promise<SearchResult[]> {
    // 动态导入向量工具函数
    const { cosineSimilarity, generateSimpleEmbedding } = await import('@/lib/vectorUtils')
    
    // 生成查询向量
    const queryEmbedding = generateSimpleEmbedding(query)
    const results: SearchResult[] = []
    
    for (const [chunkId, chunk] of Object.entries(chunks)) {
      const document = documents[chunk.documentId]
      if (!document || !chunk.embedding) continue
      
      try {
        // 计算向量相似度
        const similarity = cosineSimilarity(queryEmbedding, chunk.embedding)
        
        if (similarity > 0.1) { // 设置最小相似度阈值
          results.push({
            chunk,
            document,
            score: similarity,
            relevance: similarity > 0.7 ? 'high' : similarity > 0.4 ? 'medium' : 'low'
          })
        }
      } catch (error) {
        console.warn('Failed to calculate similarity for chunk:', chunkId, error)
      }
    }
    
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
  }

  /**
   * 执行关键词搜索（回退方案）
   */
  private performKeywordSearch(
    query: string, 
    documents: { [key: string]: Document }, 
    chunks: { [key: string]: DocumentChunk }, 
    topK: number
  ): SearchResult[] {
    // 改进中文分词处理
    const queryWords = query.toLowerCase()
      .replace(/[，。！？；：""''（）【】]/g, ' ') // 替换中文标点
      .split(/\s+/) // 按空格分割
      .filter(w => w.length > 0)
    
    const results: SearchResult[] = []
    
    for (const [chunkId, chunk] of Object.entries(chunks)) {
      const document = documents[chunk.documentId]
      if (!document) continue
      
      // 改进的关键词匹配
      const chunkContent = chunk.content.toLowerCase()
      let matchCount = 0
      let totalMatches = 0
      
      for (const queryWord of queryWords) {
        if (queryWord.length < 2) continue // 忽略太短的词
        
        // 检查是否包含查询词
        if (chunkContent.includes(queryWord)) {
          matchCount++
          totalMatches++
        }
        
        // 也检查文档标题
        if (document.title.toLowerCase().includes(queryWord)) {
          matchCount++
          totalMatches++
        }
      }
      
      // 如果没有具体关键词，尝试模糊匹配
      if (queryWords.length === 0 || totalMatches === 0) {
        // 对于"这份文档讲了啥"这类问题，返回所有文档
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
          score: Math.max(score, 0.1), // 确保有最小分数
          relevance: score > 0.7 ? 'high' : score > 0.3 ? 'medium' : 'low'
        })
      }
    }
    
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
  }

  async deleteDocument(documentId: string): Promise<void> {
    if (typeof window === 'undefined') {
      return
    }

    try {
      // 删除文档
      const documents = this.getDocuments()
      delete documents[documentId]
      localStorage.setItem(this.documentsKey, JSON.stringify(documents))
      
      // 删除相关的文档块
      const chunks = this.getChunks()
      const updatedChunks: { [key: string]: DocumentChunk } = {}
      
      for (const [chunkId, chunk] of Object.entries(chunks)) {
        if (chunk.documentId !== documentId) {
          updatedChunks[chunkId] = chunk
        }
      }
      
      localStorage.setItem(this.chunksKey, JSON.stringify(updatedChunks))
      
    } catch (error) {
      throw error
    }
  }

  async getDocumentCount(): Promise<number> {
    if (typeof window === 'undefined') return 0
    
    const documents = this.getDocuments()
    return Object.keys(documents).length
  }

  // 辅助方法
  private getDocuments(): { [key: string]: Document } {
    try {
      const stored = localStorage.getItem(this.documentsKey)
      return stored ? JSON.parse(stored) : {}
    } catch (error) {
      return {}
    }
  }

  private getChunks(): { [key: string]: DocumentChunk } {
    try {
      const stored = localStorage.getItem(this.chunksKey)
      return stored ? JSON.parse(stored) : {}
    } catch (error) {
      return {}
    }
  }

  // 调试方法
  getAllDocuments(): Document[] {
    const documents = this.getDocuments()
    return Object.values(documents)
  }

  getAllChunks(): DocumentChunk[] {
    const chunks = this.getChunks()
    return Object.values(chunks)
  }

  // 清空所有数据
  clearAll(): void {
    if (typeof window === 'undefined') return
    
    localStorage.removeItem(this.documentsKey)
    localStorage.removeItem(this.chunksKey)
    this.initStorage()
  }
}

export const localStorageVectorStore = new LocalStorageVectorStore()