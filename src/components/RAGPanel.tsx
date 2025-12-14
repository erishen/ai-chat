'use client'

import React, { useState, useEffect } from 'react'
import { DocumentUpload } from './DocumentUpload'
import { DocumentList } from './DocumentList'
import { SearchResults } from './SearchResults'
import { ragManager } from '@/lib/ragManager'
import { Document, RAGContext } from '@/types/rag'

interface RAGPanelProps {
  onDocumentChange?: () => void
  currentQuery?: string
}

export function RAGPanel({ onDocumentChange, currentQuery }: RAGPanelProps) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [ragContext, setRagContext] = useState<RAGContext | null>(null)
  const [isSearching, setIsSearching] = useState(false)

  // 加载文档列表
  const loadDocuments = async () => {
    try {
      setIsLoading(true)
      const docs = await ragManager.getAllDocuments()
      setDocuments(docs)
    } catch (error) {
      console.error('Failed to load documents:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // 初始化加载
  useEffect(() => {
    loadDocuments()
  }, [])

  // 当有新查询时进行搜索
  useEffect(() => {
    if (currentQuery && currentQuery.trim() && documents.length > 0) {
      handleSearch(currentQuery.trim())
    } else {
      setRagContext(null)
    }
  }, [currentQuery, documents.length])

  // 处理文档上传
  const handleUpload = async (file: File) => {
    try {
      setIsUploading(true)
      const document = await ragManager.addDocument(file)
      setDocuments(prev => [document, ...prev])
      onDocumentChange?.()
    } catch (error) {
      console.error('Upload failed:', error)
      throw error
    } finally {
      setIsUploading(false)
    }
  }

  // 处理文档删除
  const handleDelete = async (documentId: string) => {
    try {
      await ragManager.deleteDocument(documentId)
      setDocuments(prev => prev.filter(doc => doc.id !== documentId))
      onDocumentChange?.()
      
      // 如果删除的文档在当前搜索结果中，重新搜索
      if (ragContext && ragContext.results.some(result => result.document.id === documentId)) {
        if (currentQuery) {
          await handleSearch(currentQuery)
        } else {
          setRagContext(null)
        }
      }
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }

  // 处理搜索
  const handleSearch = async (query: string) => {
    if (!query.trim() || documents.length === 0) {
      setRagContext(null)
      return
    }

    try {
      setIsSearching(true)
      const context = await ragManager.search(query.trim(), 5)
      setRagContext(context)
    } catch (error) {
      console.error('Search failed:', error)
      setRagContext(null)
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* 文档上传 */}
      <DocumentUpload
        onUpload={handleUpload}
        isUploading={isUploading}
        acceptedTypes={['.txt', '.md']} // 暂时只支持这两种格式
        maxSize={10}
      />

      {/* 搜索结果 */}
      {(ragContext || isSearching) && (
        <SearchResults
          ragContext={ragContext}
          isSearching={isSearching}
        />
      )}

      {/* 文档列表 */}
      <DocumentList
        documents={documents}
        onDelete={handleDelete}
        onSearch={handleSearch}
        isLoading={isLoading}
      />
    </div>
  )
}