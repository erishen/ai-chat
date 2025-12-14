// RAG相关的类型定义

export interface Document {
  id: string;
  title: string;
  content: string;
  filename: string;
  fileType: 'pdf' | 'txt' | 'md' | 'docx';
  size: number;
  uploadedAt: Date;
  metadata?: {
    author?: string;
    tags?: string[];
    description?: string;
  };
}

export interface DocumentChunk {
  id: string;
  documentId: string;
  content: string;
  chunkIndex: number;
  startIndex: number;
  endIndex: number;
  embedding?: number[];
  metadata?: {
    title?: string;
    section?: string;
  };
}

export interface SearchResult {
  chunk: DocumentChunk;
  document: Document;
  score: number;
  relevance: 'high' | 'medium' | 'low';
}

export interface RAGContext {
  query: string;
  results: SearchResult[];
  totalResults: number;
  searchTime: number;
}

export interface VectorStore {
  addDocument(document: Document, chunks: DocumentChunk[]): Promise<void>;
  search(query: string, topK?: number): Promise<SearchResult[]>;
  deleteDocument(documentId: string): Promise<void>;
  getDocumentCount(): Promise<number>;
}

export interface DocumentProcessor {
  extractText(file: File): Promise<string>;
  chunkDocument(content: string, options?: ChunkOptions): DocumentChunk[];
  generateEmbedding(text: string): Promise<number[]>;
}

export interface ChunkOptions {
  maxChunkSize?: number;
  overlap?: number;
  preserveParagraphs?: boolean;
}

export interface RAGConfig {
  maxDocuments?: number;
  maxChunkSize?: number;
  chunkOverlap?: number;
  searchTopK?: number;
  embeddingModel?: string;
  vectorDimension?: number;
}