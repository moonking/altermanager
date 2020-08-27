// 基础管理
let bms = {
  path: '/BasicManagement',
  component: resolve => require(['@/components/common/Home.vue'], resolve),
  meta: { title: '基础管理' },
  children: [
    // 查看用户的操作记录
    {
      path: '/BasicManagement/moreOperation',
      component: resolve =>
        require([
          '@/components/BasicManagement/moreOperation.vue'
        ], resolve),
      meta: {
        title: '操作记录'
      }
    },
    {
      path: '/BasicManagement/organization',
      component: resolve =>
        require([
          '@/components/BasicManagement/organization.vue'
        ], resolve),
      meta: {
        title: '组织管理'
      }
    },
    {
      path: '/BasicManagement/role',
      component: resolve =>
        require(['@/components/BasicManagement/role.vue'], resolve),
      meta: {
        title: '角色管理'
      }
    },
    {
      path: '/BasicManagement/department',
      component: resolve =>
        require(['@/components/BasicManagement/department/department.vue'], resolve),
      meta: {
        title: '部门管理'
      }
    },
    {
      path: '/BasicManagement/license',

      component: resolve =>
        require(['@/components/BasicManagement/LicenseInfo.vue'], resolve),
      meta: {
        title: 'license信息'
      }
    },
    {
      path: '/BasicManagement/Systemconfig',
      component: resolve => require(['@/components/BasicManagement/Systemconfig/index.vue'], resolve),
      meta: { title: '高危设置' },
      children: [
        {
          path: '/BasicManagement/Systemconfig/Highriskconf',
          component: resolve =>
            require([
              '@/components/BasicManagement/Systemconfig/Highriskconf.vue'
            ], resolve),
          meta: { title: '高危语句管理' }
        },
        {
          path: '/BasicManagement/Systemconfig/Configpage',
          component: resolve =>
            require([
              '@/components/BasicManagement/Systemconfig/Configpage.vue'
            ], resolve),
          meta: { title: '高危语句配置' }
        }
      ]
    },
    {
      path: '/BasicManagement/permissions',
      component: resolve =>
        require(['@/components/BasicManagement/permissions.vue'], resolve),
      meta: {
        title: '菜单管理'
      }
    },
    {
      path: '/BasicManagement/user',
      component: resolve =>
        require(['@/components/BasicManagement/user.vue'], resolve),
      meta: {
        title: '用户管理'
      }
    },
    {
      path: '/BasicManagement/permissions/addSystem',
      component: resolve =>
        require([
          '@/components/BasicManagement/permissions/addSystem.vue'
        ], resolve),
      meta: {
        title: '添加系统'
      }
    },
    {
      path: '/BasicManagement/permissions/editSystem',
      component: resolve =>
        require([
          '@/components/BasicManagement/permissions/editSystem.vue'
        ], resolve),
      meta: {
        title: '修改系统'
      }
    },
    {
      path: '/BasicManagement/system',
      component: resolve =>
        require(['@/components/BasicManagement/system.vue'], resolve),
      meta: {
        title: '统一认证'
      }
    },
    {
      path: '/BasicManagement/microService',
      component: resolve =>
        require([
          '@/components/BasicManagement/microService.vue'
        ], resolve),
      meta: {
        title: '微服务管理'
      }
    },
    {
      // 富文本编辑器组件
      path: '/BasicManagement/logInformation',

      component: resolve =>
        require([
          '@/components/BasicManagement/logInformation.vue'
        ], resolve),
      meta: {
        title: '日志信息管理'
      }
    },
    {
      // 富文本编辑器组件

      path: '/tree',

      component: resolve =>
        require(['@/components/BasicManagement/tree.vue'], resolve),
      meta: {
        title: '组件'
      }
    },
    {
      // markdown组件
      path: '/BasicManagement/workflow',

      component: resolve =>
        require(['@/components/BasicManagement/workflow.vue'], resolve),
      meta: {
        title: '工作流管理'
      }
    },
    {
      // 图片上传组件
      path: '/BasicManagement/mailTemplate',

      component: resolve =>
        require([
          '@/components/BasicManagement/mailTemplate.vue'
        ], resolve),
      meta: {
        title: '邮件模板管理'
      }
    },
    {
      // vue-schart组件
      path: '/BasicManagement/textTemplate',

      component: resolve =>
        require([
          '@/components/BasicManagement/textTemplate.vue'
        ], resolve),
      meta: {
        title: '短信模板管理'
      }
    },
    {
      // vue-schart组件
      path: '/BasicManagement/addRole',

      component: resolve =>
        require(['@/components/BasicManagement/addRole.vue'], resolve),
      meta: {
        title: '新增角色'
      }
    },
    {
      // 权限页面
      path: '/permission',

      component: resolve =>
        require(['@/components/page/Permission.vue'], resolve),
      meta: {
        title: '权限测试',
        permission: true
      }
    }
  ]
}

module.exports = bms;
