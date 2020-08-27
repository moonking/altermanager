import Vue from 'vue'
import Router from 'vue-router'
import aibms from './routes/aibms'
import automatedTesting from './routes/automated-testing'
import automaticOperation from './routes/automatic-operation'
import bms from './routes/bms'
import cmdb from './routes/cmdb'
import delivery from './routes/delivery'
import home from './routes/home'
import intelligentOperation from './routes/intelligent-operation'
import resourceManagement from './routes/resource-management'
import screenMonitor from './routes/screen-monitor'
home.push(aibms, automatedTesting, automaticOperation, bms, cmdb, delivery, intelligentOperation, resourceManagement, screenMonitor)
Vue.use(Router)
export default new Router({
  routes: home
})
