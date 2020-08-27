// 自动化运维
let aOperation = {
  path: '/AutomaticOperation',
  component: resolve => require(['@/components/common/Home.vue'], resolve),
  meta: {
    title: '自动化运维'
  },
  // redirect: "/AutomaticOperation/Workbench",
  children: [
    {
      path: '/AutomaticOperation/OperationWorkOrder',
      component: resolve =>
        require([
          '@/components/AutomaticOperation/WorkOrderManagement/OperationWorkOrder.vue'
        ], resolve),
      meta: {
        title: '运维工单'
      }
    },
    {
      path: '/AutomaticOperation/Workbench',
      component: resolve =>
        require(['@/components/AutomaticOperation/index.vue'], resolve),
      meta: {
        title: '我的工作台'
      }
    },
    {
      path: '/AutomaticOperation/examineAndApproveDetail',
      component: resolve =>
        require([
          '@/components/AutomaticOperation/Workbench/ExamineAndApproveDetail.vue'
        ], resolve),
      meta: {
        title: '审批详情'
      }
    },
    {
      path: '/AutomaticOperation/examineAndApprove',
      component: resolve =>
        require([
          '@/components/AutomaticOperation/Workbench/ExamineAndApprove.vue'
        ], resolve),
      meta: {
        title: '我的审批'
      }
    },

    {
      path: '/AutomaticOperation/ExecutionLog',
      component: resolve =>
        require([
          '@/components/AutomaticOperation/WorkOrderManagement/ExecutionLog.vue'
        ], resolve),
      meta: {
        title: '执行日志'
      }
    },
    {
      path: '/AutomaticOperation/healthConfig',
      component: resolve =>
        require([
          '@/components/AutomaticOperation/HealthExamination/HealthConfig.vue'
        ], resolve),
      meta: {
        title: '健康配置'
      }
    },
    {
      path: '/AutomaticOperation/healthIndex',
      component: resolve =>
        require([
          '@/components/AutomaticOperation/HealthExamination/HealthStart.vue'
        ], resolve),
      meta: {
        title: '健康检查报告'
      }
    },
    {
      path: '/AutomaticOperation/healthResult',
      component: resolve =>
        require([
          '@/components/AutomaticOperation/HealthExamination/HealthResult.vue'
        ], resolve),
      meta: {
        title: '健康检查报告'
      }
    },
    {
      path: '/AutomaticOperation/WorkOrderInfo',
      component: resolve =>
        require([
          '@/components/AutomaticOperation/WorkOrderManagement/WorkOrderInfo.vue'
        ], resolve),
      meta: {
        title: '工单信息'
      }
    },
    {
      path: '/AutomaticOperation/ExecuteWorkOrder',
      component: resolve =>
        require([
          '@/components/AutomaticOperation/WorkOrderManagement/ExecuteWorkOrder.vue'
        ], resolve),
      meta: {
        title: '执行工单'
      }
    },
    {
      path: '/AutomaticOperation/ExecutePipeLine',
      component: resolve =>
        require([
          '@/components/AutomaticOperation/WorkOrderManagement/ExecuteWorkOrder.vue'
        ], resolve),
      meta: {
        title: '执行流水线'
      }
    },
    {
      path: '/AutomaticOperation/ExecuteTemplate',
      component: resolve =>
        require([
          '@/components/AutomaticOperation/WorkOrderManagement/ExecuteWorkOrder.vue'
        ], resolve),
      meta: {
        title: '执行公共模板'
      }
    },
    {
      path: '/AutomaticOperation/OperatingPipeline',
      component: resolve =>
        require([
          '@/components/AutomaticOperation/OperatingPipelineManagement/OperatingPipeline.vue'
        ], resolve),
      meta: {
        title: '操作流水线'
      }
    },
    {
      path: '/AutomaticOperation/Newpipeline',
      component: resolve =>
        require([
          '@/components/AutomaticOperation/OperatingPipelineManagement/Newpipeline.vue'
        ], resolve),
      meta: {
        title: '新增流水线'
      }
    },
    {
      path: '/AutomaticOperation/Editpipeline',
      component: resolve =>
        require([
          '@/components/AutomaticOperation/OperatingPipelineManagement/Newpipeline.vue'
        ], resolve),
      meta: {
        title: '编辑流水线'
      }
    },
    {
      path: '/AutomaticOperation/PerformLog',
      component: resolve =>
        require([
          '@/components/AutomaticOperation/PipelineManagement/PerformLog.vue'
        ], resolve),
      meta: {
        title: '执行日志'
      }
    },
    {
      path: '/AutomaticOperation/ResourceManage',
      component: resolve =>
        require([
          '@/components/AutomaticOperation/ResourceManagement/ResourceManage.vue'
        ], resolve),
      meta: {
        title: '资源管理'
      }
    },
    {
      path: '/AutomaticOperation/ResourceManage/:status',
      component: resolve =>
        require([
          '@/components/AutomaticOperation/ResourceManagement/ResourceAdd.vue'
        ], resolve),
      meta: {
        title: '新增资源'
      }
    },
    {
      path: '/AutomaticOperation/Toolkit',
      component: resolve =>
        require([
          '@/components/AutomaticOperation/Toolkit/List.vue'
        ], resolve),
      meta: {
        title: '工具集管理'
      }
    },
    {
      path: '/AutomaticOperation/SetToolkit/:status',
      component: resolve =>
        require([
          '@/components/AutomaticOperation/Toolkit/configurateToolkit.vue'
        ], resolve),
      meta: {
        title: '工具配置'
      }
    },
    {
      path: '/AutomaticOperation/LogDetail',
      component: resolve =>
        require([
          '@/components/AutomaticOperation/WorkOrderManagement/Detail.vue'
        ], resolve),
      meta: {
        title: '工单执行详情'
      }
    },
    {
      path: '/AutomaticOperation/PipelineLogDetail',
      component: resolve =>
        require([
          '@/components/AutomaticOperation/WorkOrderManagement/Detail.vue'
        ], resolve),
      meta: {
        title: '流水线执行详情'
      }
    },
    {
      path: '/AutomaticOperation/ScriptList',
      component: resolve =>
        require([
          '@/components/AutomaticOperation/ScriptManage/List.vue'
        ], resolve),
      meta: {
        title: '脚本管理'
      }
    },
    {
      path: '/AutomaticOperation/ScripOperate',
      component: resolve =>
        require([
          '@/components/AutomaticOperation/ScriptManage/AddTool.vue'
        ], resolve),
      meta: {
        title: '脚本相关操作'
      }
    },
    {
      path: '/AutomaticOperation/WatchScript',
      component: resolve =>
        require([
          '@/components/AutomaticOperation/ScriptManage/WatchTool.vue'
        ], resolve),
      meta: {
        title: '查看脚本'
      }
    },
    {
      path: '/AutomaticOperation/ExcuteScript',
      component: resolve =>
        require([
          '@/components/AutomaticOperation/ScriptManage/Excute.vue'
        ], resolve),
      meta: {
        title: '执行脚本'
      }
    }
  ]
}
module.exports = aOperation;
