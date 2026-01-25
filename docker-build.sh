#!/bin/bash
set -e

echo "Building Docker image..."
docker build -t ai-chat .
echo "Build completed!"
