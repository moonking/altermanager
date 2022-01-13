// 资源配置管理
let cmdb = {
  path: '/ResourceAllocation',
  component: resolve => require(['@/components/common/Home.vue'], resolve),
  meta: { title: '资源配置管理' },
  children: [
    {
      path: '/ResourceAllocation/ResourceType',

      component: resolve =>
        require([
          '@/components/ResourceAllocation/ResourceType.vue'
        ], resolve),
      meta: {
        title: '资源类型管理'
      }
    },
    {
      path: '/ResourceAllocation/CIlistData',

      component: resolve =>
        require([
          '@/components/ResourceAllocation/CIlistData.vue'
        ], resolve),
      meta: {
        title: 'CI列表'
      }
    },
    {
      path: '/ResourceAllocation/CIrelationship',

      component: resolve =>
        require([
          '@/components/ResourceAllocation/CIRelation/CIrelationship.vue'
        ], resolve),
      meta: {
        title: 'CI关系'
      }
    },
    {
      path: '/ResourceAllocation/CIrelationPage/:status',
      component: resolve =>
        require([
          '@/components/ResourceAllocation/CIRelation/RelationPage.vue'
        ], resolve),
      meta: {
        title: 'CI关系操作'
      }
    },
    {
      path: '/ResourceAllocation/CIlistData/edit',

      component: resolve =>
        require([
          '@/components/ResourceAllocation/CIlistData/edit.vue'
        ], resolve),
      meta: {
        title: '编辑CI'
      }
    },
    {
      path: '/ResourceAllocation/CIlistData/toview',

      component: resolve =>
        require([
          '@/components/ResourceAllocation/CIlistData/toview.vue'
        ], resolve),
      meta: {
        title: '查看CI'
      }
    },
    {
      path: '/ResourceAllocation/Configuration',

      component: resolve =>
        require([
          '@/components/ResourceAllocation/Voucher/Configuration.vue'
        ], resolve),
      meta: {
        title: '凭证管理'
      }
    },
    {
      path: '/ResourceAllocation/VoucherPage/:status',
      component: resolve =>
        require([
          '@/components/ResourceAllocation/Voucher/VoucherPage.vue'
        ], resolve),
      meta: {
        title: '凭证相关操作'
      }
    },
    {
      path: '/ResourceAllocation/manage_ciType',

      component: resolve =>
        require([
          '@/components/ResourceAllocation/manage_ciType.vue'
        ], resolve),
      meta: {
        title: '管理CI类型'
      }
    },
    {
      path: '/ResourceAllocation/creatci',

      component: resolve =>
        require(['@/components/ResourceAllocation/createci.vue'], resolve),
      meta: {
        title: '创建CI项'
      }
    },
    {
      path: '/ResourceAllocation/creatci/getFromServer',
      component: resolve =>
        require([
          '@/components/ResourceAllocation/GetFromServer.vue'
        ], resolve),
      meta: {
        title: '从服务端获取'
      }
    },
    {
      path: '/ResourceAllocation/OtherConfiguration',
      component: resolve =>
        require([
          '@/components/ResourceAllocation/OtherConfiguration.vue'
        ], resolve),
      meta: {
        title: '业务系统'
      }
    },
    {
      path: '/ResourceAllocation/SystemPage/:status',
      component: resolve =>
        require([
          '@/components/ResourceAllocation/Configuration/SystemPage.vue'
        ], resolve),
      meta: {
        title: '业务系统相关操作'
      }
    },
    {
      path: '/ResourceAllocation/EnvirmentPage/:status',
      component: resolve =>
        require([
          '@/components/ResourceAllocation/Configuration/EnvirmentPage.vue'
        ], resolve),
      meta: {
        title: '环境相关操作'
      }
    },
    {
      path: '/ResourceAllocation/ResourceTopology',
      component: resolve =>
        require([
          '@/components/ResourceAllocation/ResourceTopology.vue'
        ], resolve),

      meta: {
        title: '查询及资源拓扑'
      }
    },
    // CI类型
    {
      path: '/ResourceAllocation/CIType',
      component: resolve =>
        require(['@/components/ResourceAllocation/CIType.vue'], resolve),

      meta: {
        title: 'CI类型'
      }
    },
    {
      path: '/ResourceAllocation/Excel',
      component: resolve =>
        require(['@/components/ResourceAllocation/Excel.vue'], resolve),

      meta: {
        title: 'CI类型'
      }
    },
    {
      path: '/ResourceAllocation/Template',
      component: resolve =>
        require(['@/components/ResourceAllocation/Template.vue'], resolve),

      meta: {
        title: '模板管理'
      }
    },
    {
      path: '/ResourceAllocation/relation',
      component: resolve =>
        require(['@/components/ResourceAllocation/relation.vue'], resolve),

      meta: {
        title: '关系管理'
      }
    },
    {
      path: '/ResourceAllocation/BusinessGroup.',
      component: resolve =>
        require([
          '@/components/ResourceAllocation/BusinessGroup.vue'
        ], resolve),

      meta: {
        title: '业务组管理'
      }
    },
    {
      path: '/ResourceAllocation/environment',
      component: resolve =>
        require([
          '@/components/ResourceAllocation/environment.vue'
        ], resolve),

      meta: {
        title: '环境管理'
      }
    }
  ]
}
module.exports = cmdb;
