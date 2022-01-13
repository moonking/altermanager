<template>
  <div class="terminal">
    <div class="term" :id="uuid" style="width: 100%;height: 200px;"></div>
  </div>
</template>
<script>
// 初始化终端
import { Terminal } from 'xterm'
import 'xterm/css/xterm.css'
export default {
  name: 'terminal',
  data () {
    return {
      term: '',
      uuid: this.getUUID()
    }
  },
  props: {
    printString: {
      type: String,
      default: ''
    }
  },
  watch: {
    printString: {
      handler (val) {
        this.term.reset()
        let str = this.handleString(val)
        this.term.write(str)
      },
      deep: true
    }
  },
  mounted () {
    // 初始化terminal
    this.term = new Terminal()
    // 将term挂砸到dom节点上
    this.term.open(document.getElementById(this.uuid))
    if (this.printString) {
      this.term.reset()
      let str = this.handleString(this.printString)
      this.term.write(str)
    }
  },
  methods: {
    // 生成唯一id
    getUUID () {
      return `a${new Date().getTime()}${Math.floor(Math.random() * 100)}`
    },
    // 处理获取的字符串
    handleString (str) {
      // 处理br及部分\n
      let reg = /\n/gm
      let reg2 = /<br\/>/gm
      let reg3 = /<\/br>/gm
      let newStr = str.replace(reg, '\n\r')
      let lastStr = newStr.replace(reg2, '\n\r')
      let finalyStr = lastStr.replace(reg3, '\n\r')
      return finalyStr
    }
  }
}
</script>
<style scoped>
.terminal {
  width: 100%;
  height: 400px;
  overflow: hidden;
}
.term,
#term /deep/ .xterm {
  width: 100% !important;
  height: 400px !important;
}
.term /deep/ .xterm .xterm-screen {
  width: 100% !important;
  height: 400px !important;
  /* overflow-y: auto !important; */
}
/* .term /deep/ .xterm .xterm-screen canvas{
  width: 100% !important;
} */
</style>
