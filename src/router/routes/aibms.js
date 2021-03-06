// AIA
let aibms = {
  path: '/Aibms',
  component: resolve => require(['@/components/common/Home.vue'], resolve),
  meta: { title: 'AIBMS' },
  children: [
    {
      path: '/Aibms',
      component: resolve =>
        require([
          '@/components/Aibms/alarmNotice/index.vue'
           // '@/components/Aibms/BusinessPath/index.vue'
        ], resolve),
      meta: {
        title: '告警通知'
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
      path: '/Aibms/BuinessConfiguration/Alarmrules',
      component: resolve =>
        require([
          '@/components/Aibms/Alarmrules/Alarmrules.vue'
        ], resolve),
      meta: {
        title: '告警规则列表'
      }
    },
    {
      path: '/Aibms/BuinessConfiguration/addRules/:status',
      component: resolve =>
        require([
          '@/components/Aibms/Alarmrules/addRules.vue'
        ], resolve),
      meta: {
        title: '告警规则'
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
      path: '/Aibms/otherConfiguration/timingList',
      component: resolve =>
        require([
          '@/components/Aibms/otherConfiguration/TimingList.vue'
        ], resolve),
      meta: {
        title: '定时任务'
      }
    },
    {
      path: '/Aibms/otherConfiguration/timing/:status',
      component: resolve =>
        require([
          '@/components/Aibms/otherConfiguration/Timing.vue'
        ], resolve),
      meta: {
        title: '操作定时任务'
      }
    },
    {
      path: '/Aibms/otherConfiguration/infoAlter',
      component: resolve =>
        require([
          '@/components/Aibms/otherConfiguration/infoAlter.vue'
        ], resolve),
      meta: {
        title: '待分类告警'
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
      path: '/Aibms/alarmnotice/alarmnoticeDetail',
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
      path: '/Aibms/otherConfiguration/systemOperation',
      component: resolve =>
        require([
          '@/components/Aibms/otherConfiguration/systemOperation.vue'
        ], resolve),
      meta: {
        title: '业务系统配置'
      }
    },

    {
      path: '/Aibms/otherConfiguration/systemOperation/level1',
      component: resolve =>
        require([
          '@/components/Aibms/otherConfiguration/systemconfig/level1.vue'
        ], resolve),
      meta: {
        title: '7*24 设置'
      }
    },

    {
      path: '/Aibms/otherConfiguration/systemOperation/level2',
      component: resolve =>
        require([
          '@/components/Aibms/otherConfiguration/systemconfig/level2.vue'
        ], resolve),
      meta: {
        title: '5*8 设置'
      }
    },
    {
      path: '/Aibms/otherConfiguration/systemOperation/addsystem',
      component: resolve =>
        require([
          '@/components/Aibms/otherConfiguration/systemconfig/addsystem.vue'
        ], resolve),
      meta: {
        title: '全量覆盖业务系统列表'
      }
    },
    {
      path: '/Aibms/otherConfiguration/systemOperation/editsystem',
      component: resolve =>
        require([
          '@/components/Aibms/otherConfiguration/systemconfig/editsystem.vue'
        ], resolve),
      meta: {
        title: '新增系统'
      }
    },

    // {
    //   path: '/Aibms/otherConfiguration/maintaintime/:status',
    //   component: resolve =>
    //     require([
    //       '@/components/Aibms/otherConfiguration/maintaintime.vue'
    //     ], resolve),
    //   meta: {
    //     title: '操作维护窗口'
    //   }
    // },
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
    },
    {
      path: '/Aibms/blackList',
      component: resolve =>
        require([
          '@/components/Aibms/BlackList/index.vue'
        ], resolve),
      meta: {
        title: '黑名单'
      }
    },
    {
      path: '/Aibms/Infoself/selfcheck',
      component: resolve =>
        require([
          '@/components/Aibms/Infoself/selfcheck.vue'
        ], resolve),
      meta: {
        title: '服务自检'
      }
    },
    {
      path: '/Aibms/Infoself/loginlog',
      component: resolve =>
        require([
          '@/components/Aibms/Infoself/loginlog.vue'
        ], resolve),
      meta: {
        title: '平台登陆日志'
      }
    },
    {
      path: '/Aibms/Infoself/statistics',
      component: resolve =>
        require([
          '@/components/Aibms/Infoself/statistics.vue'
        ], resolve),
      meta: {
        title: '告警统计'
      }
    }
  ]
}
module.exports = aibms;
