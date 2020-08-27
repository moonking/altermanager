// AIA
let aibms = {
  path: '/Aibms',
  component: resolve => require(['@/components/common/Home.vue'], resolve),
  meta: { title: 'Aibms' },
  children: [
    {
      path: '/Aibms',
      component: resolve =>
        require([
          '@/components/Aibms/BusinessPath/index.vue'
        ], resolve),
      meta: {
        title: '业务路径'
      }
    },
    {
      path: '/Aibms/BuinessConfiguration/MonitoringSource',
      component: resolve =>
        require([
          '@/components/Aibms/BuinessConfiguration/monitoringSource/MonitoringSource.vue'
        ], resolve),
      meta: {
        title: '监控来源'
      }
    },
    {
      path: '/Aibms/Bconfiguration/Alarmrules',
      component: resolve =>
        require([
          '@/components/Aibms/Alarmrules/Alarmrules.vue'
        ], resolve),
      meta: {
        title: '告警规则'
      }
    },
    {
      path: '/Aibms/Bconfiguration/addRules/:status',
      component: resolve =>
        require([
          '@/components/Aibms/Alarmrules/addRules.vue'
        ], resolve),
      meta: {
        title: '新增告警规则'
      }
    },
    {
      path: '/Aibms/BuinessConfiguration/addSource',
      component: resolve =>
        require([
          '@/components/Aibms/BuinessConfiguration/monitoringSource/addSource.vue'
        ], resolve),
      meta: {
        title: '新增来源'
      }
    },
    {
      path: '/Aibms/otherConfiguration/message',
      component: resolve =>
        require([
          '@/components/Aibms/otherConfiguration/SmsConfiguration.vue'
        ], resolve),
      meta: {
        title: '短信配置'
      }
    },
    {
      path: '/Aibms/otherConfiguration/email',
      component: resolve =>
        require([
          '@/components/Aibms/otherConfiguration/EmailConfiguration.vue'
        ], resolve),
      meta: {
        title: '邮件配置'
      }
    },
    {
      path: '/Aibms/Transaction',
      component: resolve =>
        require([
          '@/components/Aibms/Transaction/Transaction.vue'
        ], resolve),
      meta: {
        title: '交易追踪'
      }
    },
    {
      path: '/Aibms/alarmnotice',
      component: resolve =>
        require([
          '@/components/Aibms/alarmNotice/index.vue'
        ], resolve),
      meta: {
        title: '告警通知'
      }
    },
    {
      path: '/Aibms/alarmnoticeDetail',
      component: resolve =>
        require([
          '@/components/Aibms/alarmNotice/noticeDetail.vue'
        ], resolve),
      meta: {
        title: '通知详情'
      }
    },
    {
      path: '/Aibms/BuinessConfiguration/addClass',
      component: resolve =>
        require([
          '@/components/Aibms/BuinessConfiguration/alarmClass/addClass.vue'
        ], resolve),
      meta: {
        title: '新增分类'
      }
    },
    {
      path: '/Aibms/BuinessConfiguration/alarmclassification',
      component: resolve =>
        require([
          '@/components/Aibms/BuinessConfiguration/alarmClass/index.vue'
        ], resolve),
      meta: {
        title: '告警分类'
      }
    },
    {
      path: '/Aibms/BuinessConfiguration/upgradeAlarm',
      component: resolve =>
        require([
          '@/components/Aibms/BuinessConfiguration/upgradeAlarm/index.vue'
        ], resolve),
      meta: {
        title: '告警升级'
      }
    },
    {
      path: '/Aibms/BuinessConfiguration/addGadeAlarm',
      component: resolve =>
        require([
          '@/components/Aibms/BuinessConfiguration/upgradeAlarm/addGadeAlarm.vue'
        ], resolve),
      meta: {
        title: '新增告警升级'
      }
    },
    {
      path: '/Aibms/otherConfiguration/maintain',
      component: resolve =>
        require([
          '@/components/Aibms/otherConfiguration/maintain/index.vue'
        ], resolve),
      meta: {
        title: '维护窗口'
      }
    },
    {
      path: '/Aibms/otherConfiguration/addMaintain',
      component: resolve =>
        require([
          '@/components/Aibms/otherConfiguration/maintain/addMaintain.vue'
        ], resolve),
      meta: {
        title: '新增维护'
      }
    },
    {
      path: '/Aibms/businessPath',
      component: resolve =>
        require([
          '@/components/Aibms/BusinessPath/index.vue'
        ], resolve),
      meta: {
        title: '业务路径'
      }
    },
    {
      path: '/Aibms/businessPath/linkTopology',
      component: resolve =>
        require([
          '@/components/Aibms/BusinessPath/LinkTopology.vue'
        ], resolve),
      meta: {
        title: '链路拓扑'
      }
    }
  ]
}
module.exports = aibms;
