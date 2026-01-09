import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

/**
 * ================================
 * Pinterest Click ID（epik）捕获
 * 位置说明：
 * - 必须在 Vue 应用 mount 之前执行
 * - 确保 SPA / 路由跳转前已存储
 * 一定要放在这个位置（你只记住一句）
 * Click ID 必须在 Vue 启动前抓到
 * 否则首屏路由、自动跳转可能直接把 epik 吃掉。
 * ================================
 */
const params = new URLSearchParams(window.location.search)
const epik = params.get('epik')

if (epik) {
    localStorage.setItem('pinterest_epik', epik)
    console.log('📌 Pinterest epik captured:', epik)
}
// 按顺序注册插件（你原来的顺序是正确的）
const app = createApp(App)
app.use(pinia)    // 先注册状态管理
app.use(router)   // 再注册路由
app.use(ElementPlus) // 最后注册UI组件
app.mount('#app')
console.log('🚀 Vue应用已启动')
