import Vue from 'vue'
import Router from 'vue-router'
import aibms from './routes/aibms'
import bms from './routes/bms'
import cmdb from './routes/cmdb'
import home from './routes/home'
home.push(aibms, bms, cmdb)
Vue.use(Router)
export default new Router({
  routes: home
})
