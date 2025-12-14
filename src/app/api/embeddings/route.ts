import { NextRequest, NextResponse } from 'next/server'
import { generateOpenAIEmbedding } from '@/lib/vectorUtils'

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json()
    
    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      )
    }

    const embedding = await generateOpenAIEmbedding(text)

    return NextResponse.json({
      embedding,
      dimension: embedding.length
    })
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Failed to generate embedding',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}