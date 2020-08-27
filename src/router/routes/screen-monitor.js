// 大屏监控
let screenMonitor = {
  path: '/ScreenMonitor',
  component: resolve => require(['@/components/common/Home.vue'], resolve),
  meta: {
    title: '大屏监控'
  },
  children: [
    {
      path: '/ScreenMonitor/largeScreen',
      component: resolve =>
        require(['@/components/ScreenMonitor/largeScreen.vue'], resolve),
      meta: {
        title: '大屏显示'
      }
    },
    {
      path: '/ScreenMonitor/AlarmManagement',

      component: resolve =>
        require([
          '@/components/ScreenMonitor/AlarmManagement.vue'
        ], resolve),
      meta: {
        title: '告警管理'
      }
    },
    {
      path: '/ScreenMonitor/BusinessTrack',
      component: resolve =>
        require(['@/components/ScreenMonitor/BusinessTrack.vue'], resolve),

      meta: {
        title: '业务追踪'
      }
    },
    {
      path: '/ScreenMonitor/MonitorConfiguration',
      component: resolve =>
        require([
          '@/components/ScreenMonitor/MonitorConfiguration.vue'
        ], resolve),
      meta: {
        title: '监控配置管理'
      }
    }
  ]
}
module.exports = screenMonitor;
