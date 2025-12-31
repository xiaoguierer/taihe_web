import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  // 开发服务器配置
  server: {
    host: '0.0.0.0', // 允许局域网访问
    port: 3000,      // 指定端口
    open: true,      // 自动打开浏览器
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
       // target: 'http://47.84.2.177:8080',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, '/api') // 保留完整路径
        //rewrite: (path) => path.replace(/^\/api/, '') // 保留完整路径
      }
    },
    // 热更新配置
    hmr: {
      overlay: false // 禁用错误覆盖层
    },
    watch: {
      usePolling: true,  // 使用轮询替代文件系统事件
      interval: 1000     // 轮询间隔1秒
    }
  },

  // 解析配置
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // 可以添加更多别名
      '#': fileURLToPath(new URL('./types', import.meta.url))
    },
    // 扩展名配置
    extensions: ['.js', '.vue', '.json']
  },

  // 环境变量配置
  define: {
    'process.env': process.env,
    // 解决某些库的全局变量问题
    __VUE_I18N_FULL_INSTALL__: true,
    __VUE_I18N_LEGACY_API__: false
  },

  // 构建配置
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    commonjsOptions: {
      include: [/node_modules/]
    },
    // 分块策略
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.message.includes('Comments in CSS')) return
        warn(warning)
      },
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString()
          }
        },
      }
    }
  },

  // CSS 预处理器配置
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/assets/styles/variables.scss";`
      }
    }
  },

  // 优化依赖
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      'pinia',
      'axios'
    ],
    exclude: ['vue-demi']
  }
})
