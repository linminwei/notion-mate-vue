import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import './styles/neo-table.css'
import App from './App.vue'
import router from './router'
import { permission, role } from './directives/permission'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// 1. 引入所有实心图标 (Solid)
import { fas } from '@fortawesome/free-solid-svg-icons'

// 2. 引入所有常规/空心图标 (Regular)
import { far } from '@fortawesome/free-regular-svg-icons'

// 3. 引入所有品牌图标 (Brands)
import { fab } from '@fortawesome/free-brands-svg-icons'

const app = createApp(App)
// 4. 将它们全部添加到库中
//这会将数千个图标打包进你的项目
library.add(fas, far, fab)

app.component('font-awesome-icon', FontAwesomeIcon)

app.use(createPinia())
app.use(router)
app.use(Antd)

// 注册权限指令
app.directive('permission', permission)
app.directive('role', role)

app.mount('#app')
