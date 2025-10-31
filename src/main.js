import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './store'
// UI组件库（以Element Plus为例）
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
const app = createApp(App)
app.use(router)
app.use(pinia)
app.use(ElementPlus)
app.mount('#app')
