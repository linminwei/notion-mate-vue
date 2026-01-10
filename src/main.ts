import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
// 导入Ant Design全部组件
import Antd from 'ant-design-vue'
// 导入Ant Design全局样式
import 'ant-design-vue/dist/reset.css'

const app = createApp(App)
// 全局注册Ant Design
app.use(Antd)
app.mount('#app')
