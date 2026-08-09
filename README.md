# AI Chat

A modern intelligent chat application built with Next.js 15 and Vercel AI SDK, supporting multi-turn conversations, RAG document retrieval, and Markdown rendering.

## ✨ Features

### 🎯 Core
- **Smart Chat** — OpenAI GPT-based conversations
- **Multi-Turn** — Full conversation history with persistence
- **Streaming** — Real-time streaming AI responses
- **RAG** — Document upload, vectorization, and retrieval
- **Markdown** — Full Markdown rendering with syntax highlighting
- **Code Copy** — One-click code block copying
- **Theme** — Light / Dark / System theme switching

### 🗂️ Conversation Management
- **History** — Auto-save and manage multiple sessions
- **Smart Titles** — Auto-generated titles from conversation content
- **Persistence** — Client-side data via localStorage
- **Quick Switch** — Navigate between conversations
- **Delete** — Remove unwanted conversations

### 📚 RAG Document System
- **Upload** — Supports TXT and MD files
- **Chunking** — Automatic semantic document segmentation
- **Vector Store** — Local vector database for storage and retrieval
- **Context Enhancement** — Enriched AI responses with document context
- **CRUD** — Full document management

### 🎨 Design System
- **Component-Based** — Complete UI component library
- **Responsive** — Adapts to all screen sizes
- **Modern UI** — Tailwind CSS 4 design system
- **Animations** — Smooth interaction effects
- **Accessibility** — WCAG compliant

### 🛠️ Technical
- **TypeScript** — Full type safety
- **Error Boundaries** — Graceful error handling
- **Unit Tests** — Complete test coverage
- **Optimization** — React.memo, lazy loading, and more
- **SEO** — Complete metadata configuration

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** — React full-stack framework
- **React 19** — UI library
- **TypeScript** — Type-safe JavaScript

### Styling
- **Tailwind CSS 4** — Utility-first CSS
- **CSS Variables** — Dynamic theme system
- **PostCSS** — CSS post-processor

### AI Integration
- **Vercel AI SDK** — AI application toolkit
- **OpenAI GPT** — Large language model
- **Streaming** — Real-time data transfer
- **RAG** — Retrieval-Augmented Generation

### Vector Processing
- **@xenova/transformers** — Client-side vectorization
- **Local Vector Store** — localStorage-based vector DB
- **Semantic Search** — Cosine similarity calculation
- **Document Chunking** — Intelligent text segmentation

### Markdown
- **react-markdown** — Markdown renderer
- **react-syntax-highlighter** — Code syntax highlighting
- **remark-gfm** — GitHub Flavored Markdown
- **rehype-raw** — HTML tag support

### Development
- **ESLint** — Code quality
- **Jest** — Unit testing
- **Testing Library** — React testing utilities

## 🚀 Quick Start

### 1. Install

```bash
git clone <your-repo-url>
cd ai-chat
npm install
```

### 2. Environment

```bash
cp .env.example .env.local
```

Configure your OpenAI API key in `.env.local`:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Start Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 📁 Project Structure

```
ai-chat/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── chat/          # Chat API
│   │   │   ├── documents/     # Document management
│   │   │   ├── embeddings/    # Vectorization API
│   │   │   └── rag/           # RAG search API
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Main page
│   ├── components/            # React components
│   │   ├── ui/                # Base UI components
│   │   ├── layout/            # Layout components
│   │   ├── theme/             # Theme components
│   │   ├── ChatMessage.tsx
│   │   ├── ChatMessages.tsx
│   │   ├── ChatHeader.tsx
│   │   ├── ChatInput.tsx
│   │   ├── ConversationSidebar.tsx
│   │   ├── DocumentUpload.tsx
│   │   ├── DocumentList.tsx
│   │   ├── RAGPanel.tsx
│   │   ├── SearchResults.tsx
│   │   ├── MarkdownRenderer.tsx
│   │   └── ErrorBoundary.tsx
│   ├── hooks/                 # React hooks
│   │   └── useMultiTurnChat.ts
│   ├── lib/                   # Utilities
│   │   ├── utils.ts
│   │   ├── conversationManager.ts
│   │   ├── documentProcessor.ts
│   │   ├── ragManager.ts
│   │   ├── vectorStore.ts
│   │   ├── localStorageVectorStore.ts
│   │   ├── memoryVectorStore.ts
│   │   └── vectorUtils.ts
│   ├── types/                 # TypeScript types
│   └── __tests__/             # Test files
├── types/                     # Global type declarations
├── public/                    # Static assets
├── next.config.js             # Next.js config
├── tailwind.config.js         # Tailwind config
├── jest.config.js             # Jest config
└── package.json
```

## 🔧 Configuration

### AI Model

Edit `src/app/api/chat/route.ts`:

```typescript
const result = await streamText({
  model: openai('gpt-4'),
  messages,
})
```

### Custom Styling

- `tailwind.config.js` — Tailwind configuration
- `src/app/globals.css` — Global styles and CSS variables

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Configure `OPENAI_API_KEY` environment variable
4. Deploy

### Other Platforms

```bash
npm run build
npm start
```

## Development

### Requirements

- Node.js 18.0.0+
- npm, yarn, or pnpm

### Commands

- `npm run dev` — Start dev server
- `npm run build` — Build for production
- `npm run start` — Start production server
- `npm run lint` — ESLint
- `npm run test` — Unit tests

## Architecture

### Multi-Turn Chat
- **useMultiTurnChat Hook** — Unified conversation state management
- **ConversationManager** — CRUD and persistence
- **localStorage** — Client-side persistent storage

### RAG System
- **Hybrid Architecture** — Client-side vectorization + server-side search
- **Pipeline** — Upload → Chunk → Vectorize → Store
- **Smart Retrieval** — Cosine similarity search
- **Context Generation** — Dynamic document context assembly

## Links

- **Live Demo**: https://chat.erishen.cn
- **Articles**: [SegmentFault](https://segmentfault.com/a/1190000047472293) | [Juejin](https://juejin.cn/post/7583344281734676526)

---

## Related Articles

- English: [Building a RAG Smart Chat App](https://erishen.cn/building-rag-smart-chat-app/)
- 中文: [从零打造支持 RAG 的智能聊天应用](https://erishen.cn/building-rag-smart-chat-app-cn/)

## License

MIT License
