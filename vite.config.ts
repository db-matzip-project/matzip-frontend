import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const DEFAULT_API_TARGET = 'http://localhost:8080'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiTarget = env.VITE_API_PROXY_TARGET || DEFAULT_API_TARGET
  const isNgrok = apiTarget.includes('ngrok')

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
          // ngrok HTTPS: 백엔드 권장값 (자체 서명/프록시 이슈 방지)
          secure: false,
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              if (isNgrok) {
                proxyReq.setHeader('ngrok-skip-browser-warning', 'true')
                proxyReq.setHeader(
                  'Referer',
                  `${apiTarget.replace(/\/$/, '')}/swagger-ui/index.html`,
                )
              }
            })
          },
        },
      },
    },
  }
})
