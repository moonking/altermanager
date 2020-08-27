// 持续交付
let delivery = {
  path: '/AutomatedRelease',
  component: resolve => require(['@/components/common/Home.vue'], resolve),
  meta: {
    title: '持续交付'
  },
  children: [
    // 需求管理
    {
      path: '/AutomatedRelease/demandManagement',
      component: resolve =>
        require([
          '@/components/AutomatedRelease/DemandManagement/DemandDashboard.vue'
        ], resolve),
      meta: {
        title: '需求管理'
      }
    }, {
      path: '/AutomatedRelease/demandList',
      component: resolve =>
        require([
          '@/components/AutomatedRelease/DemandManagement/DemandList.vue'
        ], resolve),
      meta: {
        title: '需求列表'
      }
    },
    {
      path: '/AutomatedRelease/demandComparison',
      component: resolve =>
        require([
          '@/components/AutomatedRelease/DemandManagement/DemandComparison.vue'
        ], resolve),
      meta: {
        title: '需求对比'
      }
    }, {
      path: '/AutomatedRelease/demandDetail',
      component: resolve =>
        require([
          '@/components/AutomatedRelease/DemandManagement/DemandDetail.vue'
        ], resolve),
      meta: {
        title: '需求查看'
      }
    },
    {
      path: '/AutomatedRelease/examineAndApproveDetail',
      component: resolve =>
        require([
          '@/components/AutomatedRelease/workbench/ExamineAndApproveDetail.vue'
        ], resolve),
      meta: {
        title: '审批详情'
      }
    },
    {
      path: '/AutomatedRelease/crontabList',
      component: resolve =>
        require([
          '@/components/AutomatedRelease/Crontab/CrontabList.vue'
        ], resolve),
      meta: {
        title: '定时发布'
      }
    },
    {
      path: '/AutomatedRelease/examineAndApprove',
      component: resolve =>
        require([
          '@/components/AutomatedRelease/workbench/ExamineAndApprove.vue'
        ], resolve),
      meta: {
        title: '我的审批'
      }
    },
    {
      path: '/AutomatedRelease/NodeManage',
      component: resolve =>
        require([
          '@/components/AutomatedRelease/NodeManage/NodeManage.vue'
        ], resolve),
      meta: {
        title: '节点管理'
      }
    },
    {
      path: '/AutomatedRelease/ResourceManagement/ClusterManage',
      component: resolve =>
        require([
          '@/components/AutomatedRelease/ResourceManagement/ClusterManage.vue'
        ], resolve),
      meta: {
        title: '集群管理'
      }
    },
    {
      path: '/AutomatedRelease/NodeAdd',
      component: resolve =>
        require([
          '@/components/AutomatedRelease/NodeManage/NodeAdd.vue'
        ], resolve),
      meta: {
        title: '新增节点'
      }
    },
    {
      path: '/AutomatedRelease/editNode/:status',
      component: resolve =>
        require([
          '@/components/AutomatedRelease/NodeManage/NodeEdit.vue'
        ], resolve),
      meta: {
        title: '编辑节点'
      }
    },
    {
      path: '/AutomatedRelease/DeployPlanManage',
      component: resolve =>
        require([
          '@/components/AutomatedRelease/DeployPlanManage/DeployPlanManage.vue'
        ], resolve),
      meta: {
        title: '部署方案管理'
      }
    },
    {
      path: '/AutomatedRelease/DeployPlanManage/AddDeployPlan',
      component: resolve =>
        require([
          '@/components/AutomatedRelease/DeployPlanManage/AddDeployPlan.vue'
        ], resolve),
      meta: {
        title: '新增部署方案'
      }
    },
    {
      path: '/AutomatedRelease/TaskDeployment',
      component: resolve =>
        require([
          '@/components/AutomatedRelease/TaskDeployment/TaskDeployment.vue'
        ], resolve),
      meta: {
        title: '部署任务管理'
      }
    },
    {
      path: '/AutomatedRelease/fastDeploy',
      component: resolve =>
        require([
          '@/components/AutomatedRelease/TaskDeployment/FastDeploy.vue'
        ], resolve),
      meta: {
        title: '一键执行'
      }
    },
    {
      path: '/AutomatedRelease/deployLog',
      component: resolve =>
        require([
          '@/components/AutomatedRelease/TaskDeployment/DeployLog.vue'
        ], resolve),
      meta: {
        title: '执行日志'
      }
    },
    {
      path: '/AutomatedRelease/logDetail',
      component: resolve =>
        require([
          '@/components/AutomatedRelease/TaskDeployment/logDetail.vue'
        ], resolve),
      meta: {
        title: '执行日志详情'
      }
    },
    {
      path: '/AutomatedRelease/ViewLogs',
      component: resolve =>
        require([
          '@/components/AutomatedRelease/TaskDeployment/ViewLogs.vue'
        ], resolve),
      meta: {
        title: '日志信息'
      }
    },
    {
      path: '/AutomatedRelease/AddDeploytask',
      component: resolve =>
        require([
          '@/components/AutomatedRelease/TaskDeployment/AddDeployTask.vue'
        ], resolve),
      meta: {
        title: '新增部署任务'
      }
    },
    {
      path: '/AutomatedRelease/ExecuteTask',
      component: resolve =>
        require([
          '@/components/AutomatedRelease/TaskDeployment/ExecuteTask.vue'
        ], resolve),
      meta: {
        title: '任务执行'
      }
    },
    {
      path: '/AutomatedRelease/taskDeploymentList',
      component: resolve =>
        require([
          '@/components/AutomatedRelease/TaskDeployment/TaskDeploymentList.vue'
        ], resolve),
      meta: {
        title: '部署任务列表'
      }
    },
    {
      path: '/AutomatedRelease/ResourceManagement/nodeAdd',
      component: resolve =>
        require([
          '@/components/AutomatedRelease/ResourceManagement/nodeAdd.vue'
        ], resolve),
      meta: {
        title: '新增节点'
      }
    },
    {
      path: '/AutomatedRelease/ResourceManagement/NewCluster',
      component: resolve =>
        require([
          '@/components/AutomatedRelease/ResourceManagement/NewCluster.vue'
        ], resolve),
      meta: {
        title: '新增集群'
      }
    },
    {
      path: '/AutomatedRelease/BackspaceManage',
      component: resolve =>
        require([
          '@/components/AutomatedRelease/backspaceManage/BackspaceManage.vue'
        ], resolve),
      meta: {
        title: '备份'
      }
    },
    {
      path: '/AutomatedRelease/Deploy',
      component: resolve =>
        require([
          '@/components/AutomatedRelease/DeploymentManagement/Deploy.vue'
        ], resolve),
      meta: {
        title: '部署'
      }
    },
    {
      path: '/AutomatedRelease/Newscheme',
      component: resolve =>
        require(['@/components/AutomatedRelease/Newscheme.vue'], resolve),
      meta: {
        title: '新增方案'
      }
    },
    {
      path: '/AutomatedRelease/Technology',
      component: resolve =>
        require([
          '@/components/AutomatedRelease/DeploymentManagement/Technology.vue'
        ], resolve),
      meta: {
        title: '科技验证'
      }
    },
    {
      path: '/AutomatedRelease/Pipelinemanagement',
      component: resolve =>
        require([
          '@/components/AutomatedRelease/Pipelinemanagement/Pipelinemanagement.vue'
        ], resolve),
      meta: {
        title: '流水线管理'
      }
    },
    {
      path: '/AutomatedRelease/AddPipeline',
      component: resolve =>
        require([
          '@/components/AutomatedRelease/Pipelinemanagement/AddPipeline.vue'
        ], resolve),
      meta: {
        title: '新增流水线'
      }
    },
    {
      path: '/AutomatedRelease/BackspaceAdd',
      component: resolve =>
        require([
          '@/components/AutomatedRelease/backspaceManage/BackspaceAdd.vue'
        ], resolve),
      meta: {
        title: '新增回退方案'
      }
    },
    {
      path: '/AutomatedRelease/backupManagement',
      component: resolve =>
        require([
          '@/components/AutomatedRelease/backupManagement/backupManagement.vue'
        ], resolve),
      meta: {
        title: '回退'
      }
    },

    {
      path: '/AutomatedRelease/backupManagement/addbackup',
      component: resolve =>
        require([
          '@/components/AutomatedRelease/backupManagement/addbackup.vue'
        ], resolve),
      meta: {
        title: '新增备份方案管理'
      }
    },
    {
      path: '/AutomatedRelease/backupManagement/editBackup',
      component: resolve =>
        require([
          '@/components/AutomatedRelease/backupManagement/editBackup.vue'
        ], resolve),
      meta: {
        title: '编辑备份方案管理'
      }
    },

    {
      path: '/AutomatedRelease/ReleasePlanManage',
      component: resolve =>
        require([
          '@/components/AutomatedRelease/ReleasePlanManage.vue'
        ], resolve),
      meta: {
        title: '发布计划管理'
      }
    },
    {
      path: '/AutomatedRelease/ReleasePlanLog',
      component: resolve =>
        require([
          '@/components/AutomatedRelease/ReleasePlanLog.vue'
        ], resolve),
      meta: {
        title: '发布计划日志'
      }
    },
    {
      path: '/AutomatedRelease/approval',
      component: resolve =>
        require(['@/components/AutomatedRelease/Approval.vue'], resolve),
      meta: { title: '审批' }
    },
    {
      path: '/AutomatedRelease/ReleasePlanAdd',
      component: resolve =>
        require([
          '@/components/AutomatedRelease/ReleasePlanAdd.vue'
        ], resolve),
      meta: {
        title: '新增发布计划'
      }
    },
    {
      path: '/AutomatedRelease/ToolsList',
      component: resolve =>
        require([
          '@/components/AutomatedRelease/ToolsManagement/List.vue'
        ], resolve),
      meta: { title: '脚本管理' }
    },
    {
      path: '/AutomatedRelease/releaseTasklist',
      component: resolve =>
        require([
          '@/components/AutomatedRelease/ReleaseManagement/releaseTasklist.vue'
        ], resolve),
      meta: { title: '发布管理' }
    },
    {
      path: '/AutomatedRelease/releaseLog',
      component: resolve =>
        require([
          '@/components/AutomatedRelease/ReleaseManagement/ReleaseLog.vue'
        ], resolve),
      meta: { title: '执行日志' }
    },
    {
      path: '/AutomatedRelease/Excute',
      component: resolve =>
        require([
          '@/components/AutomatedRelease/ToolsManagement/Excute.vue'
        ], resolve),
      meta: { title: '执行发布脚本' }
    },
    {
      path: '/AutomatedRelease/AddTool',
      component: resolve =>
        require([
          '@/components/AutomatedRelease/ToolsManagement/AddTool.vue'
        ], resolve),
      meta: { title: '脚本操作' }
    },
    {
      path: '/AutomatedRelease/WatchTool',
      component: resolve =>
        require([
          '@/components/AutomatedRelease/ToolsManagement/WatchTool.vue'
        ], resolve),
      meta: { title: '查看脚本' }
    },
    {
      path: '/AutomatedRelease/BuildReleaseTask/:status',
      component: resolve =>
        require([
          '@/components/AutomatedRelease/ReleaseManagement/BuildReleaseTask.vue'
        ], resolve),
      meta: {
        title: '构建发布任务'
      },
      props: true
    },
    {
      path: '/AutomatedRelease/DeployReleaseTask/:status',
      component: resolve =>
        require([
          '@/components/AutomatedRelease/ReleaseManagement/DeployReleaseTask.vue'
        ], resolve),
      meta: {
        title: '部署发布任务'
      },
      props: true
    },
    {
      path: '/AutomatedRelease/CronPage/:status',
      component: resolve =>
        require([
          '@/components/AutomatedRelease/Crontab/CrontabPage.vue'
        ], resolve),
      meta: {
        title: '操作定时任务'
      }
    },
    {
      path: '/AutomatedRelease/productPackage',
      component: resolve =>
        require([
          '@/components/AutomatedRelease/product/ProductPackage.vue'
        ], resolve),
      meta: {
        title: '制品包管理'
      }
    },
    {
      path: '/AutomatedRelease/configurationPackage',
      component: resolve =>
        require([
          '@/components/AutomatedRelease/product/ConfigurationPackage.vue'
        ], resolve),
      meta: {
        title: '配置包管理'
      }
    },
    {
      path: '/AutomatedRelease/warehouse',
      component: resolve =>
        require([
          '@/components/AutomatedRelease/product/Warehouse.vue'
        ], resolve),
      meta: {
        title: '仓库管理'
      }
    },
    {
      path: '/AutomatedRelease/warehouse/:status',
      component: resolve =>
        require([
          '@/components/AutomatedRelease/product/WarehouseAdd.vue'
        ], resolve),
      meta: {
        title: '新增仓库'
      }
    },
    {
      path: '/AutomatedRelease/warehouseOpen',
      component: resolve =>
        require([
          '@/components/AutomatedRelease/product/warehouseOpen.vue'
        ], resolve),
      meta: {
        title: '打开仓库'
      }
    },
    {
      path: '/AutomatedRelease/ProductPackage/:status',
      component: resolve =>
        require([
          '@/components/AutomatedRelease/product/ProductPackageAdd.vue'
        ], resolve),
      meta: {
        title: '新增制品包'
      }
    },
    {
      path: '/AutomatedRelease/ConfigurationPackage/:status',
      component: resolve =>
        require([
          '@/components/AutomatedRelease/product/ConfigurationPackageAdd.vue'
        ], resolve),
      meta: {
        title: '新增配置包'
      }
    },
    {
      path: '/AutomatedRelease/jenkinsConfig',
      component: resolve =>
        require([
          '@/components/AutomatedRelease/configManagement/JenkinsConfig.vue'
        ], resolve),
      meta: {
        title: 'Jenkins配置'
      }
    },
    {
      path: '/AutomatedRelease/addJenkinsConfig',
      component: resolve =>
        require([
          '@/components/AutomatedRelease/configManagement/AddJenkinsConfig.vue'
        ], resolve),
      meta: {
        title: '新增Jenkins配置'
      }
    },
    {
      path: '/AutomatedRelease/editJenkinsConfig/:id',
      component: resolve =>
        require([
          '@/components/AutomatedRelease/configManagement/AddJenkinsConfig.vue'
        ], resolve),
      meta: {
        title: '编辑Jenkins配置'
      }
    },
    {
      path: '/AutomatedRelease/ProductConfig',
      component: resolve =>
        require([
          '@/components/AutomatedRelease/product-config/ProductConfig.vue'
        ], resolve),
      meta: {
        title: '制品库配置'
      }
    },
    {
      path: '/AutomatedRelease/addProductConfig',
      component: resolve =>
        require([
          '@/components/AutomatedRelease/product-config/AddProductConfig.vue'
        ], resolve),
      meta: {
        title: '新增制品库'
      }
    },
    {
      path: '/AutomatedRelease/editProductConfig/:id',
      component: resolve =>
        require([
          '@/components/AutomatedRelease/product-config/AddProductConfig.vue'
        ], resolve),
      meta: {
        title: '编辑制品库'
      }
    }
  ]
}
module.exports = delivery;
