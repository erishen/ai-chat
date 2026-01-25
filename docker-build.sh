#!/bin/bash
set -e

echo "Building Docker image for ${PROJECT_PATH}..."

# Get the directory where this script is located (this is the project directory)
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Change to project directory
cd "$PROJECT_DIR"

# Build with network=host to avoid DNS resolution issues with mirror
# Also enable BuildKit for better performance
export DOCKER_BUILDKIT=1

# Build the image
docker build --network=host -t ${IMAGE_NAME:-ai-chat:latest} .

if [ $? -eq 0 ]; then
    echo "✅ Docker image built successfully!"
    echo "Image: ${IMAGE_NAME:-ai-chat:latest}"
else
    echo "❌ Docker build failed!"
    exit 1
fi
