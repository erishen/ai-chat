# AI Chat - 智能聊天助手

一个基于 Next.js 15、React 19 和 Vercel AI SDK 构建的现代化 AI 聊天应用。

## ✨ 特性

- 🚀 **最新技术栈**: Next.js 15 + React 19 + TypeScript
- 🤖 **AI 集成**: 使用 Vercel AI SDK 和 OpenAI GPT-3.5-turbo
- 🎨 **现代 UI**: 基于 Tailwind CSS 的响应式设计
- 🌙 **主题切换**: 支持明暗主题切换
- 💬 **实时聊天**: 流式响应，实时显示 AI 回复
- 📱 **移动友好**: 完全响应式设计，支持移动设备
- 🔄 **消息管理**: 支持复制消息、清空聊天记录
- ⚡ **性能优化**: 使用 React 19 的最新特性

## 🛠️ 技术栈

- **前端框架**: Next.js 15 (App Router)
- **UI 库**: React 19
- **样式**: Tailwind CSS
- **AI SDK**: Vercel AI SDK
- **AI 模型**: OpenAI GPT-3.5-turbo
- **图标**: Lucide React
- **语言**: TypeScript
- **部署**: Vercel (推荐)

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
│   │   ├── api/
│   │   │   └── chat/
│   │   │       └── route.ts    # AI 聊天 API 路由
│   │   ├── globals.css         # 全局样式
│   │   ├── layout.tsx          # 根布局
│   │   └── page.tsx            # 主页面
│   ├── components/             # React 组件
│   │   ├── ChatHeader.tsx      # 聊天头部组件
│   │   ├── ChatInput.tsx       # 消息输入组件
│   │   ├── ChatMessage.tsx     # 单条消息组件
│   │   └── ChatMessages.tsx    # 消息列表组件
│   ├── lib/
│   │   └── utils.ts            # 工具函数
│   └── types/
│       └── chat.ts             # TypeScript 类型定义
├── public/                     # 静态资源
├── .env.example               # 环境变量模板
├── next.config.js             # Next.js 配置
├── tailwind.config.js         # Tailwind CSS 配置
├── tsconfig.json              # TypeScript 配置
└── package.json               # 项目依赖
\`\`\`

## 🎯 主要功能

### 聊天功能
- 实时 AI 对话
- 流式响应显示
- 消息时间戳
- 消息复制功能

### 界面功能
- 响应式设计
- 明暗主题切换
- 平滑动画效果
- 消息自动滚动

### 管理功能
- 清空聊天记录
- 消息计数显示
- 加载状态指示

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

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🙏 致谢

- [Next.js](https://nextjs.org/) - React 框架
- [Vercel AI SDK](https://sdk.vercel.ai/) - AI 集成工具
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [Lucide React](https://lucide.dev/) - 图标库
- [OpenAI](https://openai.com/) - AI 模型提供商