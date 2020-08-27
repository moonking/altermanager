// 智能化运维
let intelligentOperation = {
  path: '/IntelligentOperation',
  component: resolve => require(['@/components/common/Home.vue'], resolve),
  meta: {
    title: '智能化运维'
  },
  children: [
    {
      path: '/Intelligent0peration/OperationalLog',
      component: resolve =>
        require([
          '@/components/Intelligent0peration/OperationalLog.vue'
        ], resolve),
      meta: {
        title: '运维日志'
      }
    },
    {
      path: '/Intelligent0peration/DataAcquisition',

      component: resolve =>
        require([
          '@/components/Intelligent0peration/DataAcquisition.vue'
        ], resolve),
      meta: {
        title: '数据采集配置'
      }
    },
    {
      path: '/Intelligent0peration/RealTimeReports',
      component: resolve =>
        require([
          '@/components/Intelligent0peration/RealTimeReports.vue'
        ], resolve),

      meta: {
        title: '实时报表及仪表盘'
      }
    },
    {
      path: '/Intelligent0peration/FailureAnalysis',
      component: resolve =>
        require([
          '@/components/Intelligent0peration/FailureAnalysis.vue'
        ], resolve),
      meta: {
        title: '故障关联性分析'
      }
    }
  ]
}
module.exports = intelligentOperation;
