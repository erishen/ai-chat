# AI Chat - 智能聊天助手

一个基于 Next.js 15 和 Vercel AI SDK 构建的现代化智能聊天应用，支持多轮对话、RAG 文档检索、Markdown 渲染等功能。

## ✨ 特性

### 🎯 核心功能
- **智能对话**: 基于 OpenAI GPT 模型的智能聊天
- **多轮对话**: 支持完整的对话历史管理和持久化
- **实时流式响应**: 支持流式数据传输，实时显示 AI 回复
- **RAG 文档检索**: 支持文档上传、向量化和智能检索
- **Markdown 支持**: 完整的 Markdown 渲染，包括代码高亮
- **代码复制**: 一键复制代码块功能
- **主题切换**: 支持浅色/深色/跟随系统主题

### 🗂️ 对话管理
- **对话历史**: 自动保存和管理多个对话会话
- **智能标题**: 基于对话内容自动生成对话标题
- **数据持久化**: 使用 localStorage 实现客户端数据持久化
- **对话切换**: 支持在不同对话间快速切换
- **对话删除**: 支持删除不需要的对话记录

### 📚 RAG 文档系统
- **文档上传**: 支持 TXT、MD 格式文档上传
- **智能分块**: 自动将文档分割为语义块
- **向量存储**: 本地向量数据库存储和检索
- **上下文增强**: 基于文档内容增强 AI 回复质量
- **文档管理**: 完整的文档增删改查功能

### 🎨 设计系统
- **组件化架构**: 完整的 UI 组件库
- **响应式设计**: 适配各种屏幕尺寸
- **现代化 UI**: 基于 Tailwind CSS 4 的设计系统
- **动画效果**: 流畅的交互动画
- **无障碍支持**: 符合 WCAG 标准

### 🛠️ 技术特性
- **TypeScript**: 完整的类型安全
- **错误边界**: 优雅的错误处理
- **单元测试**: 完整的测试覆盖
- **性能优化**: React.memo、懒加载等优化
- **SEO 友好**: 完善的元数据配置

## 🛠️ 技术栈

### 前端框架
- **Next.js 15**: React 全栈框架
- **React 19**: 用户界面库
- **TypeScript**: 类型安全的 JavaScript

### 样式系统
- **Tailwind CSS 4**: 原子化 CSS 框架
- **CSS Variables**: 动态主题系统
- **PostCSS**: CSS 后处理器

### AI 集成
- **Vercel AI SDK**: AI 应用开发工具包
- **OpenAI GPT**: 大语言模型
- **流式响应**: 实时数据传输
- **RAG 系统**: 检索增强生成

### 向量处理
- **@xenova/transformers**: 客户端向量化
- **本地向量存储**: 基于 localStorage 的向量数据库
- **语义搜索**: 余弦相似度计算
- **文档分块**: 智能文本分割

### Markdown 渲染
- **react-markdown**: Markdown 渲染器
- **react-syntax-highlighter**: 代码语法高亮
- **remark-gfm**: GitHub Flavored Markdown
- **rehype-raw**: HTML 标签支持

### 开发工具
- **ESLint**: 代码质量检查
- **Jest**: 单元测试框架
- **Testing Library**: React 测试工具

## 🚀 快速开始

### 1. 克隆项目

\`\`\`bash
git clone <your-repo-url>
cd ai-chat
\`\`\`

### 2. 安装依赖

\`\`\`bash
npm install
# 或
yarn install
# 或
pnpm install
\`\`\`

### 3. 环境配置

复制环境变量模板文件：

\`\`\`bash
cp .env.example .env.local
\`\`\`

在 \`.env.local\` 文件中配置你的 OpenAI API 密钥：

\`\`\`env
OPENAI_API_KEY=your_openai_api_key_here
\`\`\`

### 4. 启动开发服务器

\`\`\`bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
\`\`\`

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

## 📁 项目结构

\`\`\`
ai-chat/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API 路由
│   │   │   ├── chat/          # 聊天 API
│   │   │   ├── documents/     # 文档管理 API
│   │   │   ├── embeddings/    # 向量化 API
│   │   │   └── rag/           # RAG 搜索 API
│   │   ├── globals.css        # 全局样式
│   │   ├── layout.tsx         # 根布局
│   │   └── page.tsx           # 主页面
│   ├── components/            # React 组件
│   │   ├── ui/                # 基础 UI 组件
│   │   │   ├── Button.tsx     # 按钮组件
│   │   │   ├── Card.tsx       # 卡片组件
│   │   │   ├── Input.tsx      # 输入组件
│   │   │   └── Avatar.tsx     # 头像组件
│   │   ├── layout/            # 布局组件
│   │   │   ├── Container.tsx  # 容器组件
│   │   │   └── Stack.tsx      # 堆栈组件
│   │   ├── theme/             # 主题组件
│   │   │   ├── ThemeProvider.tsx
│   │   │   └── ThemeToggle.tsx
│   │   ├── ChatMessage.tsx    # 聊天消息组件
│   │   ├── ChatMessages.tsx   # 消息列表组件
│   │   ├── ChatHeader.tsx     # 聊天头部组件
│   │   ├── ChatInput.tsx      # 聊天输入组件
│   │   ├── ConversationSidebar.tsx # 对话侧边栏
│   │   ├── DocumentUpload.tsx # 文档上传组件
│   │   ├── DocumentList.tsx   # 文档列表组件
│   │   ├── RAGPanel.tsx       # RAG 管理面板
│   │   ├── SearchResults.tsx  # 搜索结果组件
│   │   ├── MarkdownRenderer.tsx # Markdown 渲染器
│   │   └── ErrorBoundary.tsx  # 错误边界
│   ├── hooks/                 # React Hooks
│   │   └── useMultiTurnChat.ts # 多轮对话 Hook
│   ├── lib/                   # 工具库
│   │   ├── utils.ts           # 工具函数
│   │   ├── conversationManager.ts # 对话管理器
│   │   ├── documentProcessor.ts # 文档处理器
│   │   ├── ragManager.ts      # RAG 管理器
│   │   ├── vectorStore.ts     # 向量存储接口
│   │   ├── localStorageVectorStore.ts # localStorage 向量存储
│   │   ├── memoryVectorStore.ts # 内存向量存储
│   │   └── vectorUtils.ts     # 向量工具函数
│   ├── types/                 # TypeScript 类型定义
│   │   ├── chat.ts            # 聊天相关类型
│   │   └── rag.ts             # RAG 相关类型
│   └── __tests__/             # 测试文件
├── types/                     # 全局类型声明
├── public/                    # 静态资源
├── next.config.js             # Next.js 配置
├── tailwind.config.js         # Tailwind 配置
├── jest.config.js             # Jest 配置
└── package.json               # 项目配置
\`\`\`

## 🎯 主要功能

### 💬 聊天功能
- **实时 AI 对话**: 基于 OpenAI GPT 模型的智能对话
- **流式响应显示**: 实时显示 AI 回复过程
- **多轮对话**: 支持上下文连续对话
- **消息时间戳**: 显示消息发送时间
- **消息复制功能**: 一键复制消息内容

### 📚 RAG 文档系统
- **文档上传**: 支持 TXT、MD 格式文档
- **智能分块**: 自动将文档分割为语义块
- **向量检索**: 基于语义相似度的文档检索
- **上下文增强**: 结合文档内容生成更准确的回复
- **文档管理**: 完整的文档增删改查功能

### 🗂️ 对话管理
- **对话历史**: 自动保存所有对话记录
- **智能标题**: 基于对话内容自动生成标题
- **对话切换**: 在多个对话间快速切换
- **数据持久化**: 页面刷新后数据不丢失
- **对话删除**: 删除不需要的对话记录

### 🎨 界面功能
- **响应式设计**: 适配桌面和移动设备
- **明暗主题切换**: 支持浅色/深色主题
- **平滑动画效果**: 流畅的交互体验
- **消息自动滚动**: 自动滚动到最新消息
- **侧边栏管理**: 可折叠的对话历史侧边栏

### ⚙️ 管理功能
- **清空聊天记录**: 一键清空当前对话
- **消息计数显示**: 实时显示消息数量
- **加载状态指示**: 清晰的加载状态反馈
- **错误处理**: 优雅的错误提示和恢复

## 🔧 自定义配置

### 修改 AI 模型

在 \`src/app/api/chat/route.ts\` 中修改模型配置：

\`\`\`typescript
const result = await streamText({
  model: openai('gpt-4'), // 改为 GPT-4 或其他模型
  messages,
  // ...其他配置
})
\`\`\`

### 自定义样式

项目使用 Tailwind CSS，你可以在以下文件中自定义样式：
- \`tailwind.config.js\` - Tailwind 配置
- \`src/app/globals.css\` - 全局样式和 CSS 变量

### 添加新功能

1. 在 \`src/components/\` 中创建新组件
2. 在 \`src/types/\` 中定义相关类型
3. 在 \`src/lib/\` 中添加工具函数

## 🚀 部署

### Vercel 部署 (推荐)

1. 将代码推送到 GitHub
2. 在 [Vercel](https://vercel.com) 中导入项目
3. 配置环境变量 \`OPENAI_API_KEY\`
4. 点击部署

### 其他平台

项目支持部署到任何支持 Node.js 的平台：

\`\`\`bash
npm run build
npm start
\`\`\`

## 📝 开发说明

### 环境要求
- Node.js 18.0.0 或更高版本
- npm、yarn 或 pnpm

### 开发命令
- \`npm run dev\` - 启动开发服务器
- \`npm run build\` - 构建生产版本
- \`npm run start\` - 启动生产服务器
- \`npm run lint\` - 运行 ESLint 检查
- \`npm run test\` - 运行单元测试

## 🔧 核心架构

### 多轮对话系统
- **useMultiTurnChat Hook**: 统一管理对话状态和逻辑
- **ConversationManager**: 处理对话的增删改查和持久化
- **localStorage 持久化**: 客户端数据持久化存储

### RAG 检索系统
- **混合架构**: 客户端向量化 + 服务端语义搜索
- **文档处理流程**: 上传 → 分块 → 向量化 → 存储
- **智能检索**: 基于余弦相似度的语义搜索
- **上下文生成**: 动态生成相关文档上下文

### 向量存储
- **LocalStorageVectorStore**: 基于 localStorage 的向量数据库
- **MemoryVectorStore**: 内存向量存储（开发调试用）
- **向量工具**: 余弦相似度计算、向量归一化等

## 🎨 使用指南

### 基本聊天
1. 在输入框中输入问题
2. 按 Enter 或点击发送按钮
3. 查看 AI 的实时回复

### 多轮对话
1. 点击侧边栏的"新建对话"创建新会话
2. 在不同对话间切换
3. 每个对话都有独立的上下文

### 文档上传与检索
1. 点击"显示文档管理"按钮
2. 上传 TXT 或 MD 格式的文档
3. 文档会自动分块并向量化
4. 在聊天中提问时会自动检索相关文档内容

### 主题切换
1. 点击右上角的主题切换按钮
2. 选择浅色、深色或跟随系统主题

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 🔗 相关链接

### 技术分享文章
- **思否文章**：[从零到一：打造一个支持 RAG 的智能聊天应用](https://segmentfault.com/a/1190000047472293)
- **掘金文章**：[从零到一：打造一个支持 RAG 的智能聊天应用](https://juejin.cn/post/7583344281734676526)

### 项目资源
- **在线演示**：[Live Demo](https://ai-chat-eight-phi.vercel.app)

## 📄 许可证

MIT License

## 🙏 致谢

- [Next.js](https://nextjs.org/) - React 全栈框架
- [Vercel AI SDK](https://sdk.vercel.ai/) - AI 集成工具包
- [Tailwind CSS](https://tailwindcss.com/) - 原子化 CSS 框架
- [Lucide React](https://lucide.dev/) - 现代图标库
- [OpenAI](https://openai.com/) - AI 模型提供商
- [@xenova/transformers](https://huggingface.co/docs/transformers.js/) - 客户端机器学习
- [react-markdown](https://github.com/remarkjs/react-markdown) - Markdown 渲染器
- [TypeScript](https://www.typescriptlang.org/) - 类型安全的 JavaScript