import Vue from 'vue'
import App from './App'
import router from './router' // 引入路由
import axios from 'axios'
// import cookie from 'cookie-js';
import ElementUI from 'element-ui' // 引入element
import VueLogger from 'vuejs-logger'

// import 'element-ui/lib/theme-chalk/index.css' // 默认主题
// import "../static/css/theme-green/index.css"; // 浅绿色主题
import '../static/css/aibms-theme/index.css' // aibms主题
import '../static/css/aibms-theme/conmmon.css' // aibms主题公共css
import './assets/comcss/icon.css'
import './assets/comcss/main.css'
import './assets/comcss/common.css' // 公共的button样式
// 引入阿里图标库中shepherd项目图标
import '../static/fonticon/icon-sets/iconfont.css'
import '../static/css/main.css'

// 全局引入iconfont组件
import IconSvg from '@/components/IconFont'

import 'babel-polyfill'
import Progress from 'vue-multiple-progress' // 组件名称 `vm-progress`
import store from './store'
import Sortable from 'sortablejs'
import moment from 'moment'
// 引入echarts
import echarts from 'echarts'

// 引入图编辑器
import graphEditor from '../static/js/package/graph/eproe-graph-editor.min.js'
// 编辑器样式
import '../static/js/package/graph/iconfont/iconfont.css'
Vue.use(graphEditor)
// 全局注册icon-svg
Vue.component('icon-svg', IconSvg)
Vue.component('vm-progress', Progress) // 可以指定组件名称
Vue.use(Progress)

Vue.prototype.$global = {
  ws: {},
  setWs: function (newWs) {
    Vue.prototype.$global.ws = newWs
  },
  wsdevops: {},
  setWsOps: function (newWs) {
    Vue.prototype.$global.wsdevops = newWs
  },
  wsAibms: {},
  setWsAibms: function (newWs) {
    Vue.prototype.$global.wsAibms = newWs
  }
}
const isProduction = process.env.NODE_ENV === 'production'
const options = {
  isEnabled: true,
  logLevel: isProduction ? 'error' : 'debug',
  stringifyArguments: false,
  showLogLevel: true,
  showMethodName: true,
  separator: '|',
  showConsoleColors: true
}

Vue.use(VueLogger, options)

Vue.filter('dateformat', function (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return moment(dataStr).format(pattern)
})

// Vue.use(Sortable)
Vue.use(ElementUI, { size: 'max' })
// 将axios放在vue实例上
Vue.prototype.$axios = axios
axios.defaults.withCredentials = true

Vue.prototype.$echarts = echarts

Vue.directive('sortable', {
  inserted: function (el, binding) {
    new Sortable(el, binding.value || {})
  }
})
// 使用钩子函数对路由进行权限跳转
Vue.use(router)
Vue.prototype.fromUrl = ''
router.beforeEach((to, from, next) => {
  // to: Route: 即将要进入的目标 路由对象
  // from: Route: 当前导航正要离开的路由
  // next: Function: 一定要调用该方法来 resolve 这个钩子。执行效果依赖 next 方法的调用参数。
  // 全局判断从哪个页面进入
  let id = localStorage.getItem('userId')
  let token = localStorage.getItem('token')
  let isLogin = false
  if (!token && id == null) {
    // 如果未登录（本地存储无用户数据），并且要跳到登录页面
    isLogin = false
  } else if (token && id != null) {
    isLogin = true
  }
  if (Object.keys(to.query).length !== 1) {
    Vue.prototype.fromUrl = from
  }
  console.log('from: ', from, ' to: ', to, ', isLogin: ', isLogin)
  // || (Object.keys(to.query).length === 1 && (to.path.search('add') > -1 || to.path.search('create') > -1))
  if (Vue.prototype.fromUrl.path !== to.path && Object.keys(to.query).length === 1) {
    sessionStorage.removeItem('search')
  }
  if (!isLogin) {
    if (to.path !== '/login') {
      // 如果未登录（本地存储无用户数据），并且要跳到登录页面
      next('/login')
    } else {
      next()
    }
  }
  next()
})
const app = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
export default app
