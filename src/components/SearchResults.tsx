'use client'

import React, { useState, useEffect } from 'react'
import { Database, Search, Clock, TrendingUp } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { SearchResult, RAGContext } from '@/types/rag'

interface SearchResultsProps {
  ragContext: RAGContext | null
  isSearching?: boolean
}

export function SearchResults({ ragContext, isSearching = false }: SearchResultsProps) {
  if (isSearching) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="ml-2">正在搜索相关文档...</span>
        </div>
      </Card>
    )
  }

  if (!ragContext || ragContext.results.length === 0) {
    return null
  }

  const getRelevanceColor = (relevance: 'high' | 'medium' | 'low') => {
    switch (relevance) {
      case 'high':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'low':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
    }
  }

  const getRelevanceText = (relevance: 'high' | 'medium' | 'low') => {
    switch (relevance) {
      case 'high':
        return '高相关'
      case 'medium':
        return '中等相关'
      case 'low':
        return '低相关'
    }
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* 搜索统计 */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Search className="w-5 h-5 text-blue-600" />
            搜索结果
          </h3>
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Database className="w-4 h-4" />
              {ragContext.totalResults} 个结果
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {ragContext.searchTime}ms
            </span>
          </div>
        </div>

        {/* 查询信息 */}
        <div className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <span className="font-medium">查询：</span>"{ragContext.query}"
          </p>
        </div>

        {/* 搜索结果列表 */}
        <div className="space-y-3">
          {ragContext.results.map((result, index) => (
            <div
              key={result.chunk.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              {/* 结果头部 */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      #{index + 1}
                    </span>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      {result.document.title}
                    </h4>
                  </div>
                  
                  {result.chunk.metadata?.title && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      章节：{result.chunk.metadata.title}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRelevanceColor(result.relevance)}`}>
                    {getRelevanceText(result.relevance)}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <TrendingUp className="w-3 h-3" />
                    {(result.score * 100).toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* 内容预览 */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {result.chunk.content.length > 300 
                    ? result.chunk.content.substring(0, 300) + '...'
                    : result.chunk.content
                  }
                </p>
              </div>

              {/* 元数据 */}
              <div className="flex items-center justify-between mt-3 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-4">
                  <span>块 {result.chunk.chunkIndex + 1}</span>
                  <span>位置 {result.chunk.startIndex}-{result.chunk.endIndex}</span>
                  <span className="uppercase">{result.document.fileType}</span>
                </div>
                <span>
                  {new Intl.DateTimeFormat('zh-CN', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }).format(new Date(result.document.uploadedAt))}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 使用提示 */}
        <div className="text-xs text-gray-500 dark:text-gray-400 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p>💡 这些文档片段将作为上下文信息，帮助AI更准确地回答您的问题。</p>
        </div>
      </div>
    </Card>
  )
}