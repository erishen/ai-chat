'use client'

import React, { useState, useRef } from 'react'
import { Upload, File, X, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

interface DocumentUploadProps {
  onUpload: (file: File) => Promise<void>
  isUploading?: boolean
  acceptedTypes?: string[]
  maxSize?: number // in MB
}

export function DocumentUpload({ 
  onUpload, 
  isUploading = false,
  acceptedTypes = ['.txt', '.md', '.pdf', '.docx'],
  maxSize = 10
}: DocumentUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = async (file: File) => {
    setError(null)

    // 验证文件类型
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
    if (!acceptedTypes.includes(fileExtension)) {
      setError(`不支持的文件类型。支持的格式：${acceptedTypes.join(', ')}`)
      return
    }

    // 验证文件大小
    if (file.size > maxSize * 1024 * 1024) {
      setError(`文件大小超过限制。最大支持 ${maxSize}MB`)
      return
    }

    try {
      await onUpload(file)
      // 清空文件输入
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : '上传失败')
    }
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Upload className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">上传文档</h3>
        </div>

        <div
          className={`
            relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
            ${dragActive 
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' 
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
            }
            ${isUploading ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept={acceptedTypes.join(',')}
            onChange={handleChange}
            disabled={isUploading}
          />

          <div className="space-y-4">
            <div className="mx-auto w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <File className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </div>
            
            <div>
              <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {isUploading ? '正在上传...' : '点击或拖拽文件到此处'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                支持 {acceptedTypes.join(', ')} 格式，最大 {maxSize}MB
              </p>
            </div>

            {!isUploading && (
              <Button variant="outline" size="sm">
                选择文件
              </Button>
            )}
          </div>

          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm font-medium">处理中...</span>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setError(null)}
              className="ml-auto p-1 h-auto text-red-600 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}

        <div className="text-xs text-gray-500 dark:text-gray-400">
          <p>• 文档将被自动分析和索引，用于增强AI回答</p>
          <p>• 支持中英文文档，建议使用结构化的文档格式</p>
          <p>• 上传的文档仅在本地存储，不会上传到服务器</p>
        </div>
      </div>
    </Card>
  )
}