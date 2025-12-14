import { NextRequest, NextResponse } from 'next/server'
import { ragManager } from '@/lib/ragManager'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // 添加文档到RAG系统
    const document = await ragManager.addDocument(file)

    return NextResponse.json({
      success: true,
      document: {
        id: document.id,
        title: document.title,
        fileType: document.fileType,
        size: document.size,
        uploadedAt: document.uploadedAt
      }
    })
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Failed to process document',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}