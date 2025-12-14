import { Document, DocumentChunk, SearchResult, RAGContext } from '@/types/rag'
import { localVectorStore } from './vectorStore'
import { memoryVectorStore } from './memoryVectorStore'
import { localStorageVectorStore } from './localStorageVectorStore'
import { documentProcessor } from './documentProcessor'

/**
 * RAG管理器
 * 负责协调文档处理、向量存储和检索功能
 */
export class RAGManager {
  private documents: Map<string, Document> = new Map()
  private useLocalStorage = true // 使用localStorage存储，提供持久化
  private useMemoryStore = false // 不再使用内存存储

  /**
   * 添加文档到RAG系统
   */
  async addDocument(file: File): Promise<Document> {
    try {
      // 提取文本内容
      const content = await documentProcessor.extractText(file)
      
      // 创建文档对象
      const document: Document = {
        id: this.generateDocumentId(),
        title: this.extractTitle(file.name, content),
        content,
        filename: file.name,
        fileType: this.getFileType(file.name),
        size: file.size,
        uploadedAt: new Date(),
        metadata: {
          description: this.generateDescription(content)
        }
      }

      // 分块处理
      const chunks = documentProcessor.chunkDocument(content, {
        maxChunkSize: 1000,
        overlap: 200,
        preserveParagraphs: true
      })

      // 为每个块设置文档ID并生成嵌入向量
      const processedChunks: DocumentChunk[] = []
      for (const chunk of chunks) {
        chunk.documentId = document.id
        chunk.embedding = await documentProcessor.generateEmbedding(chunk.content)
        processedChunks.push(chunk)
      }

      // 存储到向量数据库
      const vectorStore = this.useLocalStorage ? localStorageVectorStore :
                         this.useMemoryStore ? memoryVectorStore : localVectorStore
      await vectorStore.addDocument(document, processedChunks)
      
      // 缓存文档
      this.documents.set(document.id, document)

      return document
    } catch (error) {
      throw new Error(`Failed to process document: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * 搜索相关文档 - 使用服务器端API
   */
  async search(query: string, topK: number = 5): Promise<RAGContext> {
    const startTime = Date.now()
    
    try {
      // 获取所有文档和块数据
      const documents = await this.getAllDocuments()
      const chunks = this.useLocalStorage ? (localStorageVectorStore as any).getAllChunks() : []
      
      if (documents.length === 0 || chunks.length === 0) {
        return {
          query,
          results: [],
          totalResults: 0,
          searchTime: Date.now() - startTime
        }
      }

      // 调用服务器端搜索API
      const response = await fetch('/api/rag/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          documents,
          chunks,
          topK
        })
      })

      if (!response.ok) {
        throw new Error(`Search API failed: ${response.status}`)
      }

      const result = await response.json()
      
      return result
    } catch (error) {
      return {
        query,
        results: [],
        totalResults: 0,
        searchTime: Date.now() - startTime
      }
    }
  }

  /**
   * 删除文档
   */
  async deleteDocument(documentId: string): Promise<void> {
    try {
      const vectorStore = this.useLocalStorage ? localStorageVectorStore :
                         this.useMemoryStore ? memoryVectorStore : localVectorStore
      await vectorStore.deleteDocument(documentId)
      this.documents.delete(documentId)
    } catch (error) {
      throw error
    }
  }

  /**
   * 获取所有文档
   */
  async getAllDocuments(): Promise<Document[]> {
    if (this.useLocalStorage) {
      // 从localStorage获取
      return (localStorageVectorStore as any).getAllDocuments()
    } else if (this.useMemoryStore) {
      // 从内存存储获取
      return (memoryVectorStore as any).getAllDocuments()
    } else {
      // 如果缓存为空，从向量存储中加载
      if (this.documents.size === 0) {
        await this.loadDocumentsFromStore()
      }
      
      return Array.from(this.documents.values())
    }
  }

  /**
   * 获取文档数量
   */
  async getDocumentCount(): Promise<number> {
    const vectorStore = this.useLocalStorage ? localStorageVectorStore :
                       this.useMemoryStore ? memoryVectorStore : localVectorStore
    return await vectorStore.getDocumentCount()
  }

  /**
   * 为聊天生成增强上下文
   */
  async generateChatContext(query: string, maxResults: number = 3): Promise<string> {
    const ragContext = await this.search(query, maxResults)
    
    if (ragContext.results.length === 0) {
      return ''
    }

    let context = '基于以下相关文档信息回答用户问题：\n\n'
    
    ragContext.results.forEach((result, index) => {
      context += `文档${index + 1}：${result.document.title}\n`
      context += `内容：${result.chunk.content}\n`
      context += `相关性：${result.relevance}\n\n`
    })

    context += '请基于上述文档内容回答用户问题，如果文档中没有相关信息，请说明并提供一般性建议。'
    
    return context
  }

  private generateDocumentId(): string {
    return `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private extractTitle(filename: string, content: string): string {
    // 首先尝试从文件名提取标题
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, '')
    if (nameWithoutExt && nameWithoutExt !== 'untitled') {
      return nameWithoutExt
    }

    // 然后尝试从内容中提取标题
    const lines = content.split('\n').slice(0, 10) // 只检查前10行
    for (const line of lines) {
      const trimmed = line.trim()
      if (trimmed.startsWith('#')) {
        return trimmed.replace(/^#+\s*/, '')
      }
      if (trimmed.length > 5 && trimmed.length < 100 && !trimmed.includes('\t')) {
        return trimmed
      }
    }

    // 最后使用内容的前50个字符
    return content.slice(0, 50).trim() + '...'
  }

  private generateDescription(content: string): string {
    // 生成文档描述（前200个字符）
    const cleaned = content.replace(/\s+/g, ' ').trim()
    return cleaned.length > 200 ? cleaned.slice(0, 200) + '...' : cleaned
  }

  private getFileType(filename: string): 'pdf' | 'txt' | 'md' | 'docx' {
    const extension = filename.split('.').pop()?.toLowerCase()
    
    switch (extension) {
      case 'pdf':
        return 'pdf'
      case 'md':
      case 'markdown':
        return 'md'
      case 'docx':
        return 'docx'
      default:
        return 'txt'
    }
  }

  private async loadDocumentsFromStore(): Promise<void> {
    // 这里需要从向量存储中加载文档列表
    // 由于我们的简单实现没有直接的文档列表API，这里暂时留空
    // 在实际应用中，应该实现一个获取所有文档的方法
  }
}

export const ragManager = new RAGManager()