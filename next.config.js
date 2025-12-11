/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['openai'],
  
  // 性能优化
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  
  // 压缩配置
  compress: true,
  
  // 图片优化
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  
  // 安全头部
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig