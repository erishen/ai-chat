import { Document, DocumentChunk, SearchResult, VectorStore } from '@/types/rag'

/**
 * 简单的内存向量存储实现
 * 用于调试和测试
 */
export class MemoryVectorStore implements VectorStore {
  private documents: Map<string, Document> = new Map()
  private chunks: Map<string, DocumentChunk> = new Map()

  async addDocument(document: Document, chunks: DocumentChunk[]): Promise<void> {
    console.log('MemoryVectorStore: Adding document:', document.id, document.title)
    
    // 存储文档
    this.documents.set(document.id, document)
    
    // 存储文档块
    for (const chunk of chunks) {
      this.chunks.set(chunk.id, chunk)
      console.log('MemoryVectorStore: Added chunk:', chunk.id, 'content length:', chunk.content.length)
    }
    
    console.log('MemoryVectorStore: Total documents:', this.documents.size, 'Total chunks:', this.chunks.size)
  }

  async search(query: string, topK: number = 5): Promise<SearchResult[]> {
    console.log('MemoryVectorStore: Searching for:', query)
    console.log('MemoryVectorStore: Available chunks:', this.chunks.size)
    
    // 改进中文分词处理
    const queryWords = query.toLowerCase()
      .replace(/[，。！？；：""''（）【】]/g, ' ') // 替换中文标点
      .split(/\s+/) // 按空格分割
      .filter(w => w.length > 0)
    
    console.log('MemoryVectorStore: Query words:', queryWords)
    
    const results: SearchResult[] = []
    
    for (const [chunkId, chunk] of this.chunks.entries()) {
      const document = this.documents.get(chunk.documentId)
      if (!document) continue
      
      console.log('MemoryVectorStore: Checking chunk:', chunkId, 'content preview:', chunk.content.substring(0, 100))
      
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
          console.log('MemoryVectorStore: Found match for word:', queryWord, 'in chunk:', chunkId)
        }
        
        // 也检查文档标题
        if (document.title.toLowerCase().includes(queryWord)) {
          matchCount++
          totalMatches++
          console.log('MemoryVectorStore: Found match for word:', queryWord, 'in title:', document.title)
        }
      }
      
      // 如果没有具体关键词，尝试模糊匹配
      if (queryWords.length === 0 || totalMatches === 0) {
        // 对于"这份文档讲了啥"这类问题，返回所有文档
        if (query.includes('文档') || query.includes('讲') || query.includes('内容') || query.includes('啥')) {
          matchCount = 1
          totalMatches = 1
          console.log('MemoryVectorStore: Generic document query, including chunk:', chunkId)
        }
      }
      
      const score = queryWords.length > 0 ? matchCount / Math.max(queryWords.length, 1) : 0.5
      console.log('MemoryVectorStore: Chunk', chunkId, 'score:', score, 'matches:', totalMatches)
      
      if (score > 0 || totalMatches > 0) {
        results.push({
          chunk,
          document,
          score: Math.max(score, 0.1), // 确保有最小分数
          relevance: score > 0.7 ? 'high' : score > 0.3 ? 'medium' : 'low'
        })
      }
    }
    
    const sortedResults = results
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
    
    console.log('MemoryVectorStore: Found', sortedResults.length, 'results')
    sortedResults.forEach((result, index) => {
      console.log(`Result ${index + 1}:`, result.document.title, 'score:', result.score)
    })
    
    return sortedResults
  }

  async deleteDocument(documentId: string): Promise<void> {
    console.log('MemoryVectorStore: Deleting document:', documentId)
    
    this.documents.delete(documentId)
    
    // 删除相关的文档块
    for (const [chunkId, chunk] of this.chunks.entries()) {
      if (chunk.documentId === documentId) {
        this.chunks.delete(chunkId)
      }
    }
  }

  async getDocumentCount(): Promise<number> {
    return this.documents.size
  }

  // 调试方法
  getAllDocuments(): Document[] {
    console.log('MemoryVectorStore: getAllDocuments called, count:', this.documents.size)
    return Array.from(this.documents.values())
  }

  getAllChunks(): DocumentChunk[] {
    console.log('MemoryVectorStore: getAllChunks called, count:', this.chunks.size)
    return Array.from(this.chunks.values())
  }

  // 调试信息
  debugInfo(): void {
    console.log('=== MemoryVectorStore Debug Info ===')
    console.log('Documents:', this.documents.size)
    console.log('Chunks:', this.chunks.size)
    
    for (const [docId, doc] of this.documents.entries()) {
      console.log(`Document ${docId}: ${doc.title}`)
    }
    
    for (const [chunkId, chunk] of this.chunks.entries()) {
      console.log(`Chunk ${chunkId}: ${chunk.content.substring(0, 50)}...`)
    }
    console.log('=====================================')
  }
}

export const memoryVectorStore = new MemoryVectorStore()