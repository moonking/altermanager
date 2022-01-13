let home = [
  {
    path: '/',
    redirect: {
      path: '/Aibms/alarmnotice',
      query: {
        code: 2
      }
    },
    component: resolve => require(['@/components/BasicManagement/index.vue'], resolve)
  },
  {
    path: '/AutomaticOperation',
    component: resolve => require(['@/components/common/Home.vue'], resolve),
    meta: {
      title: '大屏统一监控'
    }
  },
  {
    path: '/login',
    component: resolve => require(['@/components/page/Login.vue'], resolve)
  },
  {
    path: '/tabs',
    component: resolve => require(['@/components/page/Tabs.vue'], resolve)
  },
  {
    path: '/edit',
    component: resolve => require(['@/components/page/edit.vue'], resolve)
  },
  {
    path: '/ChangePassword',
    component: resolve =>
      require(['@/components/page/ChangePassword.vue'], resolve)
  },
  {
    path: '/BaseCharts',
    component: resolve =>
      require(['@/components/page/BaseCharts.vue'], resolve)
  },
  {
    path: '/BaseTable',
    component: resolve =>
      require(['@/components/page/BaseTable.vue'], resolve)
  },
  {
    path: '/VueEditor',
    component: resolve =>
      require(['@/components/page/VueEditor.vue'], resolve)
  },
  {
    path: '/Unauthorized',
    component: resolve =>
      require(['@/components/common/Unauthorized.vue'], resolve)
  }
]
module.exports = home;
