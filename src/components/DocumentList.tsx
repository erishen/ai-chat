'use client'

import React, { useState, useEffect } from 'react'
import { FileText, Trash2, Calendar, FileIcon, Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Document } from '@/types/rag'

interface DocumentListProps {
  documents: Document[]
  onDelete: (documentId: string) => Promise<void>
  onSearch?: (query: string) => void
  isLoading?: boolean
}

export function DocumentList({ 
  documents, 
  onDelete, 
  onSearch,
  isLoading = false 
}: DocumentListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>(documents)
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    let filtered = documents.filter(doc => 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.metadata?.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // 排序
    filtered.sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case 'name':
          comparison = a.title.localeCompare(b.title)
          break
        case 'date':
          comparison = new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime()
          break
        case 'size':
          comparison = a.size - b.size
          break
      }
      
      return sortOrder === 'asc' ? comparison : -comparison
    })

    setFilteredDocuments(filtered)
  }, [documents, searchQuery, sortBy, sortOrder])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    onSearch?.(query)
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date))
  }

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf':
        return <FileIcon className="w-5 h-5 text-red-600" />
      case 'md':
        return <FileText className="w-5 h-5 text-blue-600" />
      case 'txt':
        return <FileText className="w-5 h-5 text-gray-600" />
      case 'docx':
        return <FileIcon className="w-5 h-5 text-blue-800" />
      default:
        return <FileText className="w-5 h-5 text-gray-600" />
    }
  }

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="ml-2">加载文档列表...</span>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* 标题和搜索 */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5" />
            文档库 ({documents.length})
          </h3>
        </div>

        {/* 搜索和过滤 */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="搜索文档..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-')
              setSortBy(field as 'name' | 'date' | 'size')
              setSortOrder(order as 'asc' | 'desc')
            }}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm"
          >
            <option value="date-desc">最新上传</option>
            <option value="date-asc">最早上传</option>
            <option value="name-asc">名称 A-Z</option>
            <option value="name-desc">名称 Z-A</option>
            <option value="size-desc">大小 大-小</option>
            <option value="size-asc">大小 小-大</option>
          </select>
        </div>

        {/* 文档列表 */}
        {filteredDocuments.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            {documents.length === 0 ? (
              <div>
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>还没有上传任何文档</p>
                <p className="text-sm mt-1">上传文档后，AI将能够基于文档内容回答问题</p>
              </div>
            ) : (
              <div>
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>没有找到匹配的文档</p>
                <p className="text-sm mt-1">尝试使用不同的关键词搜索</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredDocuments.map((document) => (
              <div
                key={document.id}
                className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                {/* 文件图标 */}
                <div className="flex-shrink-0">
                  {getFileIcon(document.fileType)}
                </div>

                {/* 文档信息 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                      {document.title}
                    </h4>
                    <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded uppercase">
                      {document.fileType}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(document.uploadedAt)}
                    </span>
                    <span>{formatFileSize(document.size)}</span>
                    {document.filename !== document.title && (
                      <span className="truncate">{document.filename}</span>
                    )}
                  </div>

                  {document.metadata?.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                      {document.metadata.description}
                    </p>
                  )}
                </div>

                {/* 操作按钮 */}
                <div className="flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(document.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}