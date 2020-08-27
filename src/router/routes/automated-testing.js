// 自动化测试
let automatedTesting = {
  path: '/AutomatedTesting',
  component: resolve => require(['@/components/common/Home.vue'], resolve),
  meta: {
    title: '自动化测试'
  }
}
module.exports = automatedTesting;
