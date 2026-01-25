# Next.js 生产环境镜像
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 安装依赖
COPY package*.json ./

# 临时移除 prepare 脚本以避免 husky 安装问题
RUN sed -i '/"prepare":/d' package.json || true

# 安装依赖
RUN npm ci --omit=dev && npm cache clean --force

# 构建应用
FROM node:22-alpine AS builder
WORKDIR /app

# 安装生产构建所需的依赖（包括 autoprefixer）
RUN apk add --no-cache python3 make g++
COPY --from=deps /app/node_modules ./node_modules
COPY package*.json ./
COPY tsconfig.json ./
# 安装 autoprefixer 和其他构建依赖
RUN npm install autoprefixer postcss tailwindcss --save-dev
# 创建 jsconfig.json 作为备用（有些版本的 Next.js 需要）
RUN cp tsconfig.json jsconfig.json
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# 生产环境
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]

