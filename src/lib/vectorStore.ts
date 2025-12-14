import { Document, DocumentChunk, SearchResult, VectorStore, ChunkOptions } from '@/types/rag'

/**
 * 本地向量存储实现
 * 使用浏览器的 IndexedDB 存储向量数据
 */
export class LocalVectorStore implements VectorStore {
  private dbName = 'ai-chat-vector-store'
  private dbVersion = 1
  private db: IDBDatabase | null = null

  constructor() {
    if (typeof window !== 'undefined') {
      this.initDB()
    }
  }

  private async initDB(): Promise<void> {
    if (typeof window === 'undefined' || typeof indexedDB === 'undefined') {
      console.warn('IndexedDB not available (running on server)')
      return Promise.resolve()
    }
    
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion)
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        
        // 创建文档存储
        if (!db.objectStoreNames.contains('documents')) {
          const documentStore = db.createObjectStore('documents', { keyPath: 'id' })
          documentStore.createIndex('filename', 'filename', { unique: false })
          documentStore.createIndex('uploadedAt', 'uploadedAt', { unique: false })
        }
        
        // 创建文档块存储
        if (!db.objectStoreNames.contains('chunks')) {
          const chunkStore = db.createObjectStore('chunks', { keyPath: 'id' })
          chunkStore.createIndex('documentId', 'documentId', { unique: false })
          chunkStore.createIndex('chunkIndex', 'chunkIndex', { unique: false })
        }
      }
    })
  }

  async addDocument(document: Document, chunks: DocumentChunk[]): Promise<void> {
    if (typeof window === 'undefined') {
      console.warn('VectorStore: Cannot add document on server side')
      return
    }
    
    if (!this.db) await this.initDB()
    
    if (!this.db) {
      console.warn('VectorStore: Database not initialized')
      return
    }
    
    console.log('VectorStore: Adding document to IndexedDB:', document.id)
    
    const transaction = this.db!.transaction(['documents', 'chunks'], 'readwrite')
    const documentStore = transaction.objectStore('documents')
    const chunkStore = transaction.objectStore('chunks')
    
    // 存储文档
    await new Promise<void>((resolve, reject) => {
      const request = documentStore.put(document)
      request.onsuccess = () => {
        console.log('VectorStore: Document stored successfully')
        resolve()
      }
      request.onerror = () => {
        console.error('VectorStore: Failed to store document:', request.error)
        reject(request.error)
      }
    })
    
    // 存储文档块
    for (const chunk of chunks) {
      await new Promise<void>((resolve, reject) => {
        const request = chunkStore.put(chunk)
        request.onsuccess = () => {
          console.log('VectorStore: Chunk stored:', chunk.id)
          resolve()
        }
        request.onerror = () => {
          console.error('VectorStore: Failed to store chunk:', request.error)
          reject(request.error)
        }
      })
    }
    
    console.log('VectorStore: All chunks stored successfully')
  }

  async search(query: string, topK: number = 5): Promise<SearchResult[]> {
    if (typeof window === 'undefined') {
      console.warn('VectorStore: Cannot search on server side')
      return []
    }
    
    if (!this.db) await this.initDB()
    
    if (!this.db) {
      console.warn('VectorStore: Database not initialized')
      return []
    }
    
    console.log('VectorStore: Searching for query:', query)
    
    // 获取查询的嵌入向量
    const queryEmbedding = await this.generateEmbedding(query)
    
    // 获取所有文档块
    const chunks = await this.getAllChunks()
    const documents = await this.getAllDocuments()
    
    console.log('VectorStore: Found chunks:', chunks.length, 'documents:', documents.length)
    
    // 计算相似度并排序
    const results: SearchResult[] = []
    
    for (const chunk of chunks) {
      if (!chunk.embedding) {
        console.log('VectorStore: Chunk missing embedding:', chunk.id)
        continue
      }
      
      const similarity = this.cosineSimilarity(queryEmbedding, chunk.embedding)
      const document = documents.find(d => d.id === chunk.documentId)
      
      console.log('VectorStore: Chunk similarity:', similarity, 'for chunk:', chunk.id)
      
      if (document && similarity > 0.1) { // 降低相似度阈值用于调试
        results.push({
          chunk,
          document,
          score: similarity,
          relevance: similarity > 0.7 ? 'high' : similarity > 0.5 ? 'medium' : 'low'
        })
      }
    }
    
    console.log('VectorStore: Total results before sorting:', results.length)
    
    // 按相似度排序并返回前K个结果
    const sortedResults = results
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
    
    console.log('VectorStore: Final results:', sortedResults.length)
    return sortedResults
  }

  async deleteDocument(documentId: string): Promise<void> {
    if (typeof window === 'undefined') {
      console.warn('VectorStore: Cannot delete document on server side')
      return
    }
    
    if (!this.db) await this.initDB()
    
    if (!this.db) {
      console.warn('VectorStore: Database not initialized')
      return
    }
    
    const transaction = this.db!.transaction(['documents', 'chunks'], 'readwrite')
    const documentStore = transaction.objectStore('documents')
    const chunkStore = transaction.objectStore('chunks')
    
    // 删除文档
    await new Promise<void>((resolve, reject) => {
      const request = documentStore.delete(documentId)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
    
    // 删除相关的文档块
    const chunkIndex = chunkStore.index('documentId')
    const chunkRequest = chunkIndex.openCursor(IDBKeyRange.only(documentId))
    
    await new Promise<void>((resolve, reject) => {
      chunkRequest.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result
        if (cursor) {
          cursor.delete()
          cursor.continue()
        } else {
          resolve()
        }
      }
      chunkRequest.onerror = () => reject(chunkRequest.error)
    })
  }

  async getDocumentCount(): Promise<number> {
    if (typeof window === 'undefined') {
      console.warn('VectorStore: Cannot get document count on server side')
      return 0
    }
    
    if (!this.db) await this.initDB()
    
    if (!this.db) {
      console.warn('VectorStore: Database not initialized')
      return 0
    }
    
    const transaction = this.db!.transaction(['documents'], 'readonly')
    const store = transaction.objectStore('documents')
    
    return new Promise((resolve, reject) => {
      const request = store.count()
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  private async getAllChunks(): Promise<DocumentChunk[]> {
    if (typeof window === 'undefined' || !this.db) {
      return []
    }
    
    const transaction = this.db!.transaction(['chunks'], 'readonly')
    const store = transaction.objectStore('chunks')
    
    return new Promise((resolve, reject) => {
      const request = store.getAll()
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  private async getAllDocuments(): Promise<Document[]> {
    if (typeof window === 'undefined' || !this.db) {
      return []
    }
    
    const transaction = this.db!.transaction(['documents'], 'readonly')
    const store = transaction.objectStore('documents')
    
    return new Promise((resolve, reject) => {
      const request = store.getAll()
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  private async generateEmbedding(text: string): Promise<number[]> {
    // 这里使用简单的TF-IDF向量化作为示例
    // 在实际应用中，应该使用真正的嵌入模型
    const words = text.toLowerCase().split(/\W+/).filter(w => w.length > 0)
    const wordCount: { [key: string]: number } = {}
    
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1
    })
    
    // 创建固定长度的向量（这里使用100维）
    const vector = new Array(100).fill(0)
    Object.keys(wordCount).forEach((word, index) => {
      if (index < 100) {
        vector[index] = wordCount[word] / words.length
      }
    })
    
    return vector
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0
    
    let dotProduct = 0
    let normA = 0
    let normB = 0
    
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i]
      normA += a[i] * a[i]
      normB += b[i] * b[i]
    }
    
    if (normA === 0 || normB === 0) return 0
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
  }
}

export const localVectorStore = new LocalVectorStore()