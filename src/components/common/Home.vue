<template>
  <div class="wrapper">
    <v-sidebar class="sidebar" v-if="!full"></v-sidebar>
    <div   :class="[collapse?'content-collapse':'', full?'linkstyle':'content-box']">
      <!-- <v-tags></v-tags> -->
      <div :class="[full?'linkstyle':'content']">
        <vBreadcrumb v-if="!full" />
        <transition
          name="mode"
          transition-mode="out-in"
          v-if="$route.query.mode == 1 && $route.query.code == 0"
        >
          <keep-alive :include="tagsList">
            <BMindex />
          </keep-alive>
        </transition>
        <transition
          name="mode"
          transition-mode="out-in"
          v-if="$route.query.mode == 1 && $route.query.code == 1"
        >
          <keep-alive :include="tagsList">
            <RAindex />
          </keep-alive>
        </transition>
        <transition
          name="mode"
          transition-mode="out-in"
          v-if="$route.query.mode == 1 && $route.query.code == 2"
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
import common from '@/utils/commonjs'
export default {
  beforeRouteEnter(to, from, next) {
    console.log(to, from.next)
    const codeMapping = {
      '0': { path: '/BasicManagement', name: '基础管理' },
      '1': { path: '/ResourceAllocation', name: '资源配置管理' },
      '2': { path: '/Aibms', name: 'Aibms' }
    }
    // 权限判断
    let allowList = JSON.parse(localStorage.getItem('allowList')) || []
    const newAllowList = ['/ResourceManagement', '/Aibms']
    const jurisdiction = [...allowList, ...newAllowList]
    const currentRoute = codeMapping[to.query.code]
    console.log(jurisdiction, currentRoute)
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
      content_box: false,
      full: false
    }
  },
  computed: {

  },
  components: {
    vBreadcrumb,
    vSidebar,
    vTags,
    BMindex,
    RAindex,
    AIAindex
  },
  methods: {
    // 全屏
    fullBool() {
      let that = this
      document.addEventListener('webkitfullscreenchange', function () {
        // const el = document.getElementsByClassName('editor')[0]
        // const style = window.getComputedStyle(el)
        // const { width, height } = style
        // console.log(width, height)
        if (document.webkitIsFullScreen) {
          // 全屏后要执行的代码
          that.full = true
          that.$store.dispatch('setIsfull', true);
        } else {
          // 退出全屏后执行的代码
          that.full = false
          that.$store.dispatch('setIsfull', false);
        }
      }, false);
    },
    // 获取tags列表
    getTagsList() {
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
  },
  created() {
    bus.$on('collapse', msg => {
      this.collapse = msg
    })
    common.fullScreen()
    this.getTagsList()
    this.fullBool()
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
.linkstyle {
  height: 100%;
}
</style>
