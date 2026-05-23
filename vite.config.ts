import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const NGROK_TARGET = 'https://unthread-book-salvation.ngrok-free.dev'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiTarget = env.VITE_API_PROXY_TARGET || NGROK_TARGET

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
          secure: true,
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.setHeader('ngrok-skip-browser-warning', 'true')
              // 백엔드가 Swagger Referer에서만 auth POST를 허용하는 경우 우회
              proxyReq.setHeader(
                'Referer',
                `${apiTarget}/swagger-ui/index.html`,
              )
            })
          },
        },
      },
    },
  }
})
