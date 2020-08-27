// 资源环境管理
let rManagement = {
  path: '/ResourceManagement',
  component: resolve => require(['@/components/common/Home.vue'], resolve),
  meta: {
    title: '资源环境管理'
  },
  children: [
    {
      path: '/ResourceManagement/vcenterManage',
      component: resolve =>
        require([
          '@/components/ResourceManagement/VcenterManage.vue'
        ], resolve),
      meta: {
        title: 'Vcenter管理'
      }
    },
    {
      path: '/ResourceManagement/addVCenter',
      component: resolve =>
        require([
          '@/components/ResourceManagement/AddVcenter.vue'
        ], resolve),
      meta: {
        title: '添加Vcenter'
      }
    },
    {
      path: '/ResourceManagement/editVcenter',
      component: resolve =>
        require([
          '@/components/ResourceManagement/AddVcenter.vue'
        ], resolve),
      meta: {
        title: '编辑Vcenter'
      }
    },
    {
      path: '/ResourceManagement/hostManage',
      component: resolve =>
        require([
          '@/components/ResourceManagement/HostManage.vue'
        ], resolve),
      meta: {
        title: '主机管理'
      }
    },
    {
      path: '/ResourceManagement/instanceManage',
      component: resolve =>
        require([
          '@/components/ResourceManagement/InstanceManage.vue'
        ], resolve),
      meta: {
        title: '实例管理'
      }
    },
    {
      path: '/ResourceManagement/templateManage',
      component: resolve =>
        require([
          '@/components/ResourceManagement/TemplateManage.vue'
        ], resolve),
      meta: {
        title: '模板管理'
      }
    }
  ]
}
module.exports = rManagement
