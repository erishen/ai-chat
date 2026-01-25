#!/bin/bash
set -e

# 检查必需的环境变量
check_required_vars() {
    local missing_vars=()
    
    if [[ -z "${OPENAI_API_KEY}" ]]; then
        missing_vars+=("OPENAI_API_KEY")
    fi
    if [[ -z "${ALI_API_KEY}" ]]; then
        missing_vars+=("ALI_API_KEY")
    fi
    
    if [[ ${#missing_vars[@]} -gt 0 ]]; then
        echo "❌ 错误: 以下必需的环境变量未设置:"
        printf '   %s\n' "${missing_vars[@]}"
        echo ""
        echo "请通过以下方式之一设置:"
        echo "1. 导出环境变量: export OPENAI_API_KEY=your_key"
        echo "2. 创建 .env.production 文件并设置 CI/CD 环境变量"
        echo "3. 修改 docker-compose.yml 添加环境变量"
        echo ""
        echo "注意: API keys 绝不应提交到代码仓库!"
        exit 1
    fi
}

echo "Stopping existing container..."
docker stop ai-chat || true
docker rm ai-chat || true

# 加载 .env.production 文件（如果存在）
if [[ -f ".env.production" ]]; then
    while IFS='=' read -r key value; do
        # 跳过注释和空行
        [[ -z "$key" || "$key" =~ ^# ]] && continue
        # 去除值两端的引号和空格
        value=$(echo "$value" | sed -e 's/^[[:space:]]*"//' -e 's/"[[:space:]]*$//' -e 's/^[[:space:]]*'\''//' -e 's/'\''[[:space:]]*$//')
        export "$key=$value"
    done < <(grep -v '^#' .env.production)
fi

# 检查环境变量
check_required_vars

echo "Starting container..."
docker run -d \
  --name ai-chat \
  -p 3000:3000 \
  -e PORT=3000 \
  -e OPENAI_API_KEY=${OPENAI_API_KEY} \
  -e OPENAI_BASE_URL=${OPENAI_BASE_URL:-https://api.deepseek.com} \
  -e OPENAI_MODEL=${OPENAI_MODEL:-deepseek-chat} \
  -e OPENAI_EMBEDDING_MODEL=${OPENAI_EMBEDDING_MODEL:-deepseek-embedding} \
  -e ALI_API_KEY=${ALI_API_KEY} \
  -e ALI_BASE_URL=${ALI_BASE_URL:-https://dashscope.aliyuncs.com/compatible-mode/v1} \
  -e ALI_EMBEDDING_MODEL=${ALI_EMBEDDING_MODEL:-text-embedding-v4} \
  ai-chat

echo "✅ Container started successfully!"
echo "🌐 Access at: http://localhost:3000"
echo "🔐 Environment variables loaded from host machine"
