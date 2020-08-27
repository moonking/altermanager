<template>
  <div id="app">
    <keep-alive>
      <v-head v-if="iSshow" />
    </keep-alive>
    <router-view v-if="isRouterAlive" />
  </div>
</template>
<style>
/* @import "../static/css/color-dark.css";     深色主题 */
@import "../static/css/theme-green/color-green.css";
/* @import "./assets/font-awesome/css/font-awesome.min.css"; */
/*浅绿色主题*/
</style>
<script>
import vHead from './components/common/Header.vue'
import { 
  websocketurl,
  devopswebsocketurl,
  aibmsWebsocketurl
  } from './config'
export default {
  provide () {
    return {
      reload: this.reload
    }
  },
  data () {
    return {
      iSshow: true,
      isRouterAlive: true,
      timer: null,
      timerAibms: null,
      number: 0,
      devopsnumber: 0,
      aibmsNum: 0
    }
  },
  name: 'App',
  components: {
    vHead
  },
  created() {
    // 页面刚进入时开启长连接
    // this.localSocket()
  },
  mounted() {
    // this.$nextTick(() => {
    //   this.getAibmsWebsocket()
    // })
  },
  methods: {
    reload() {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    },
    cleartime() {
      if (this.number > 7 || this.devopsnumber > 7 || this.aibmsNum > 7) {
        let tit = ''
        if (this.number > 7) {
          clearInterval(this.timer)
          tit = 'websocket连接超时！'
        }
        if (this.devopsnumber > 7) {
          clearInterval(this.timerdev)
          tit = 'websocket连接超时！！'
        }
        if (this.aibmsNum > 7) {
          clearInterval(this.timerAibms)
          tit = 'websocket连接超时！'
        }
        this.$notify({
          title: '提示',
          message: tit,
          type: 'error'
        })
        // localStorage.removeItem('userId');
        // localStorage.removeItem('userName');
        // localStorage.removeItem('userPhoto');
        // localStorage.removeItem('token');
        // window.location.hash = '/login';
      }
    },
    // 连接 devops websocket
    upwebsocket() {
      this.$global.ws = new WebSocket(websocketurl)
      this.$global.setWs(this.$global.ws)
      this.$global.ws.onopen = () => {
        console.log('devops websocket已连接...')
        if (!localStorage.getItem('userId')) {
          clearInterval(this.timer)
        }

        if (this.timer) {
          clearInterval(this.timer)
        }
      }
    },
    // 链接aibms websocket
    upAibmsWebsocket() {
      this.$global.wsAibms = new WebSocket(aibmsWebsocketurl)
      this.$global.setWsAibms(this.$global.wsAibms)
      this.$global.wsAibms.onopen = () => {
        console.log('aibms websocket已连接...')
        if (!localStorage.getItem('userId')) {
          clearInterval(this.timerAibms)
        }
        if (this.timerAibms) {
          clearInterval(this.timerAibms)
        }
      }
    },
    // 接受aibms websocket数据
    getAibmsWebsocket() {
      const vm = this
      this.$global.wsAibms.onmessage = res => {
        const notify = this.$notify({
          title: '告警',
          dangerouslyUseHTMLString: true,
          message: '<p>有一条新告警产生，请前往<span style="color:#0066ff;cursor:pointer">查看</span></p>',
          type: 'warning',
        })
        notify.$el.querySelector('span').onclick = () => {
          vm.getAlarmNoiceDetail(res.data)
          notify.close()
        }
      }
    },
    getAlarmNoiceDetail(id) {
      this.$router.push({
        path: '/Aibms/alarmnoticeDetail',
        query: {
          code: 8,
          id: id
        }
      })
    },
    upwebsocketdev(type) {
      if (!type) {
        setTimeout(() => {
          this.upwebsocket()
        }, 0)
      }

      this.cleartime()
      this.$global.wsdevops = new WebSocket(devopswebsocketurl)
      this.$global.setWsOps(this.$global.wsdevops)
      this.$global.wsdevops.onopen = () => {
        console.log('websocket已连接...devops')
        if (!localStorage.getItem('userId')) {
          clearInterval(this.timerdev)
        }

        if (this.timerdev) {
          clearInterval(this.timerdev)
        }
      }
    },
    localSocket() {
      if ('WebSocket' in window) {
        this.upwebsocketdev()
        this.upAibmsWebsocket()
        this.$global.ws.onclose = res => {
          // 关闭 websocket
          console.log('连接已关闭...', res)
          this.timer = setInterval(() => {
            this.number++
            this.upwebsocket()
          }, 3000)
        }
        this.$global.wsAibms.onclose = res => {
          // 关闭 websocket
          console.log('连接已关闭...', res)
          this.timerAibms = setInterval(() => {
            this.aibmsNum++
            this.upAibmsWebsocket()
          }, 3000)
        }
        this.$global.wsdevops.onclose = res => {
          // 关闭 websocket
          console.log('连接已关闭...devops', res)
          this.timerdev = setInterval(() => {
            this.devopsnumber++
            this.upwebsocketdev('Reconnect')
          }, 3000)
        }
      } else {
        // 浏览器不支持 WebSocket
        console.log('您的浏览器不支持 WebSocket!')
      }
    }
  },
  watch: {
    $route(e) {
      //  console.log(this.$route);
      if (e.path == '/login' || e.path == '/err') {
        this.iSshow = false
      } else {
        this.iSshow = true
      }
    }
  }
}
</script>
<style>
#app {
  color: #585858;
  font-family: "PingFang SC";
}
.el-submenu__title:hover {
 background-color: #00A8E8 !important;
}
.el-submenu__title:focus, .el-submenu__title:hover {
    background-color: #00A8E8 !important;
}

ul li {
  list-style: none;
}
</style>
