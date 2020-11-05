<template>
  <div class="wrapper">
    <v-sidebar class="sidebar"></v-sidebar>
    <div class="content-box" :class="{ 'content-collapse': collapse }">
      <!-- <v-tags></v-tags> -->
      <div class="content">
        <vBreadcrumb />
        <transition
          name="mode"
          transition-mode="out-in"
          v-if="$route.query.mode == 1 && $route.query.code == 1"
        >
          <keep-alive :include="tagsList">
            <BMindex />
          </keep-alive>
        </transition>
        <transition
          name="mode"
          transition-mode="out-in"
          v-if="$route.query.mode == 1 && $route.query.code == 2"
        >
          <keep-alive :include="tagsList">
            <RAindex />
          </keep-alive>
        </transition>
        <transition
          name="mode"
          transition-mode="out-in"
          v-if="$route.query.mode == 1 && $route.query.code == 8"
        >
          <keep-alive :include="tagsList">
            <AIAindex />
          </keep-alive>
        </transition>
        <transition name="mode" transition-mode="out-in ">
          <keep-alive :include="tagsList">
            <router-view />
          </keep-alive>
        </transition>
      </div>
    </div>
  </div>
</template>
<script>
import BMindex from '../BasicManagement/index.vue'
import RAindex from '../ResourceAllocation/index.vue'
import AIAindex from '../Aibms/index.vue'
import vSidebar from './Sidebar.vue'
import vTags from './Tags.vue'
import vBreadcrumb from './Breadcrumb.vue'
import bus from './bus'

export default {
  beforeRouteEnter(to, from, next) {
    const codeMapping = {
      '1': { path: '/BasicManagement', name: '基础管理' },
      '2': { path: '/ResourceAllocation', name: '资源配置管理' },
      '8': { path: '/Aibms', name: 'Aibms' }
    }
    // 权限判断
    let allowList = JSON.parse(localStorage.getItem('allowList')) || []
    const newAllowList = ['/ResourceManagement', '/Aibms']
    const jurisdiction = [...allowList, ...newAllowList]
    const currentRoute = codeMapping[to.query.code]
    if (jurisdiction.indexOf(currentRoute.path) === -1) {
      next('/Unauthorized?system=' + currentRoute.name)
      return
    }
    next()
  },
  data() {
    return {
      tagsList: [],
      collapse: false,
      content_box: false
    }
  },
  components: {
    vBreadcrumb,
    vSidebar,
    vTags,
    BMindex,
    RAindex,
    AIAindex
  },
  created() {
    bus.$on('collapse', msg => {
      this.collapse = msg
    })

    // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
    bus.$on('tags', msg => {
      // console.log(msg)
      let arr = []
      for (let i = 0, len = msg.length; i < len; i++) {
        msg[i].name && arr.push(msg[i].name)
      }
      this.tagsList = arr
    })
  }
}
</script>
<style scoped>
/* .home-wrapper {
  display: flex;
  justify-content: space-between;
}
.home-content-box {
  flex: 1;
} */
</style>
<style>
.mian_box {
  width: 90%;
  line-height: 300px;
  text-align: center;
  margin: 50px auto;
  background: #fff;
}
.fade-enter-active {
  transition: all 1.5s;
  transition-delay: 2s;
}

.fade-leave-active {
  transition: all 2.5s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
