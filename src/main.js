import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './store'

// UI组件库（以Element Plus为例）
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)

// 按顺序注册插件（推荐顺序）
app.use(pinia)    // 先注册状态管理
app.use(router)   // 再注册路由
app.use(ElementPlus) // 最后注册UI组件

app.mount('#app')

console.log('🚀 Vue应用已启动')
