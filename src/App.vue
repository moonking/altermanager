<template>
  <div id="app">
    <keep-alive>
      <v-head v-if="iSshow && !full" />
    </keep-alive>
    <router-view v-if="isRouterAlive" />
  </div>
</template>
<style>
/* @import "../static/css/color-dark.css";     深色主题 */
@import '../static/css/theme-green/color-green.css';
/* @import "./assets/font-awesome/css/font-awesome.min.css"; */
/*浅绿色主题*/
</style>
<script>
import vHead from './components/common/Header.vue'
import config from '@/config/index.js'
import moment from 'moment'
import common from '@/utils/commonjs';
export default {
  provide() {
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      iSshow: true,
      isRouterAlive: true,
      timer: null,
      timerAibms: null,
      number: 0,
      devopsnumber: 0,
      aibmsNum: 0,
      full: false
    }
  },
  name: 'App',
  components: {
    vHead
  },
  created() {
    // 页面刚进入时开启长连接
    this.localSocket()
    common.fullScreen()
    this.fullBool()
  },
  mounted() {
    // this.$nextTick(() => {
    //   this.getAibmsWebsocket()
    // })
    // this.$nextTick(() => {
    //   setInterval(() => {
    //     this.playAudio()
    //   }, 5000)
    // })
  },
  methods: {
    reload() {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    },
    fullBool() {
      let that = this
      document.addEventListener('webkitfullscreenchange', function () {
        if (document.webkitIsFullScreen) {
          // 全屏后要执行的代码
          that.full = true
          that.iSshow = false
        } else {
          // 退出全屏后执行的代码
          that.full = false
          that.iSshow = true
        }
      }, false);
    },
    cleartime() {
      if (this.aibmsNum > 7) {
        // let tit = ''
        clearInterval(this.timerAibms)
        // tit = 'websocket连接超时！'
        // this.$notify({
        //   title: '提示',
        //   message: tit,
        //   type: 'error'
        // })
        // localStorage.removeItem('userId');
        // localStorage.removeItem('userName');
        // localStorage.removeItem('userPhoto');
        // localStorage.removeItem('token');
        // window.location.hash = '/login';
      }
    },
    // 播放音频
    playAudio() {
      if (!!window.ActiveXObject || 'ActiveXObject' in window) {
        // IE内核浏览器
        var OSPlayer = new ActiveXObject('WMPLayer.OCX');
        OSPlayer.url = '../static/music.mp3';
        OSPlayer.controls.play();
      } else {
        // 非IE内核浏览器
        var strAudio = document.createElement('audio');
        strAudio.src = '../static/music.mp3'
        strAudio.hidden = true
        strAudio.id = 'audioPlay'
        // strAudio.muted = true
        // strAudio.autoplay = 'autoplay'

        if (!document.body.contains(document.getElementsByTagName('audio')[0])) { document.body.append(strAudio); }
        var audio = document.getElementById('audioPlay');
        audio.play().catch((err) => {
          console.log(err)
        })
        // 浏览器支持 audio
        // audio.click(() => {
        // audio.play()
        // })
      }
    },
    // 链接aibms websocket
    upAibmsWebsocket() {
      let url = config.wsTopology.replace('ciitem', 'system').substring(0, config.wsTopology.length - 1)
      this.$global.wsAibms = new WebSocket(url)
      this.$global.setWsAibms(this.$global.wsAibms)
      // console.log(this.$global.wsAibms)
      this.$global.wsAibms.onopen = () => {
        console.log('aibms websocket已连接...')
        if (!localStorage.getItem('userId')) {
          clearInterval(this.timerAibms)
        }
        if (this.timerAibms) {
          clearInterval(this.timerAibms)
        }
      }
      this.$global.wsAibms.onerror = () => {
        if (this.timerAibms) {
          console.log('业务系统ws出错了！')
        }
      }
      this.$global.wsAibms.onclose = () => {
        console.log('业务系统ws关闭了！')
      }
    },
    // 接受aibms websocket数据
    getAibmsWebsocket() {
      this.$global.wsAibms.onmessage = res => {
        let data = common.evil(res.data);
        if (data) {
          if (data.aelrtList && data.aelrtList.length > 0) {
            this.notifyList = data.aelrtList
            this.notifyList.forEach((item) => {
              item.time = moment(item.startTime).format('YYYY-MM-DD hh:mm:ss')
            })

            this.notifyAlert(data.alert)
          }
        }
      }
    },
    notifyAlert(alert) {
      let { host, time, description, level } = alert
      const iconMap = {
        '1': '#ff0000',
        '2': '#ff9900',
        '3': '#ffcc00'
      };
      const levelMap = {
        '1': 'critical',
        '2': 'warning',
        '3': 'information'
      };
      time = moment(time).format('YYYY-MM-DD hh:mm:ss')
      this.$notify({
        customClass: 'notify-style',
        dangerouslyUseHTMLString: true,
        message: `
          <p class="notify-title">
            有新的<span style="color:${iconMap[level]};font-weight: bold;"> ${levelMap[level]} </span>告警
          </p>
          <div class="notify-content">
            <div class="notify-item"><span>对象：</span>${host}</div>
            <div class="notify-item"><span>时间：</span>${time}</div>
            <div class="notify-item"><span>详情：</span>${description}</div>
          </div>
          `,
        duration: 7500
      });
      this.playAudio()
    },
    getAlarmNoiceDetail(id) {
      this.$router.push({
        path: '/Aibms/alarmnotice/alarmnoticeDetail',
        query: {
          code: 2,
          id: id
        }
      })
    },

    localSocket() {
      if ('WebSocket' in window) {
        this.upAibmsWebsocket()
        this.getAibmsWebsocket()
        this.$global.wsAibms.onclose = res => {
          // 关闭 websocket
          console.log('连接已关闭...', res)
          this.timerAibms = setInterval(() => {
            this.aibmsNum++
            this.upAibmsWebsocket()
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
  font-family: 'PingFang SC';
}
.el-submenu__title:hover {
  background-color: #00a8e8 !important;
}
.el-submenu__title:focus,
.el-submenu__title:hover {
  background-color: #00a8e8 !important;
}

ul li {
  list-style: none;
}
</style>
