# Next.js 生产环境镜像
FROM node:20-alpine3.20 AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 安装依赖
COPY package*.json ./
# 删除 prepare 脚本以避免 husky 安装错误
RUN sed -i '/"prepare":/d' package.json || true
RUN HUSKY=0 npm ci --omit=dev && npm cache clean --force

# 构建应用
FROM node:20-alpine3.20 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package*.json ./
COPY tsconfig.json ./
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm install autoprefixer postcss tailwindcss --save-dev
RUN apk add --no-cache python3 make g++
RUN npm run build

# 生产环境
FROM node:20-alpine3.20 AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]

