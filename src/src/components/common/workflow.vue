<template>
  <div class="containers" ref="content">
    <div id="div2">
      <div class="canvas" ref="canvas"></div>
      <div
        id="js-properties-panel"
        style="opacity: 0;z-index: -10;height:0; overflow: hidden;width: 300px;    left: 70%;"
        class="panel"
      ></div>
      <div id="div1"></div>
      <div id="bottom">↓</div>
    </div>
    <!-- <div id="js-properties-panel" class="panel"></div> -->
    <ul class="buttons" v-show="false">
      <li>下载</li>
      <li>
        <a ref="saveDiagram" href="javascript:" title="download BPMN diagram">BPMN diagram</a>
      </li>
      <li>
        <a ref="saveSvg" href="javascript:" title="download as SVG image">SVG image</a>
      </li>
    </ul>
  </div>
</template>

<script>
// 引入相关的依赖
import BpmnModeler from 'bpmn-js/lib/Modeler'
import propertiesPanelModule from 'bpmn-js-properties-panel'
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda'
import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda'
import common from '@/utils/commonjs'
export default {
  name: 'Workflow',
  props: {
    activityData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    isShowDialog: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    ID: {
      type: String,
      default: () => {
        return ''
      }
    },
    actNodeName: {
      type: String,
      default: () => {
        return ''
      }
    },
    isDisabled: {
      type: Boolean,
      default: () => {
        return true // true 不可编辑 ，false 可编辑
      }
    }
  },
  data () {
    return {
      // bpmn建模器
      bpmnModeler: null,
      container: null,
      canvas: null,
      xmlStr: null,
      bpmnXmlStr: '',
      // 边框拖拽
      oDiv: null,
      oDiv2: null,
      right: null,
      bottom: null,
      mouseStart: {},
      bottomStart: {},
      showDiaLog: false,
      taskElement: null
    }
  },
  watch: {
    // 实时刷新xml的状态显示
    activityData: {
      handler (newValue, oldValue) {
        this.createNewDiagram(this.bpmnModeler)
      },
      deep: true
    },
    actNodeName: {
      handler (newValue, oldValue) {
        this.exchangeName(newValue)
      },
      deep: true
    },
    isShowDialog: {
      handler (newValue, oldValue) {
        this.showDiaLog = newValue
      },
      deep: true
    }
  },
  methods: {
    // 清除双击输入框
    clearInput () {
      // 这里处理双击产生的元素
      if (
        document.getElementsByClassName('djs-direct-editing-content').length > 0
      ) {
        document
          .getElementsByClassName('djs-direct-editing-content')[0]
          .setAttribute('contenteditable', false)
        document.getElementsByClassName(
          'djs-direct-editing-parent'
        )[0].style.display = 'none'
        let domList = document.getElementsByClassName('djs-shape')
        for (let i = 0; i < domList.length; i++) {
          if (domList[i].className.baseVal.indexOf('djs-label-hidden') > -1) {
            domList[i].className.baseVal = domList[i].className.baseVal.replace(
              'djs-label-hidden',
              ''
            )
          }
        }
      }
    },
    // 替换xml的名称
    exchangeName (nodeName) {
      const setTaskVaule = this.bpmnModeler.get('modeling')
      setTaskVaule.updateProperties(this.taskElement, { name: nodeName })
      // if (this.xmlStr) {
      //   this.xmlStr = common.setxmlname(this.xmlStr, this.ID, name)
      //   this.createNewDiagram(this.bpmnModeler, this.xmlStr)
      //   this.SendActityData(this.xmlStr)
      // } else if (this.activityData.actXml) {
      //   this.activityData.actXml = common.setxmlname(
      //     this.activityData.actXml,
      //     this.ID,
      //     name
      //   )
      //   // 重新绘制
      //   this.createNewDiagram(this.bpmnModeler, this.activityData.actXml)
      //   this.SendActityData(this.activityData.actXml)
      // }
    },
    // 初始化状态图标
    setImageStages () {
      let stagedomlist = document.getElementsByClassName('djs-element'),
        imgUrl = [
          '../../../static/img/exec_success.png',
          '../../../static/img/exec_fail.png',
          '../../../static/img/task/20140524124238403.gif',
          '../../../static/img/t_question.png'
        ]
      for (let i = 0; i < stagedomlist.length; i++) {
        for (let j = 0; j < imgUrl.length; j++) {
          if (
            stagedomlist[i].getAttribute('data-element-id').indexOf('Task') > -1
          ) {
            let xmlns = 'http://www.w3.org/2000/svg',
              svgimg = document.createElementNS(xmlns, 'image')
            svgimg.setAttributeNS(null, 'x', 35)
            svgimg.setAttributeNS(null, 'y', 50)
            svgimg.setAttributeNS(null, 'height', '30px')
            svgimg.setAttributeNS(null, 'width', '30px')
            svgimg.setAttributeNS(null, 'display', 'none')
            svgimg.href.baseVal =
              j === 0
                ? require('../../../static/img/exec_success.png')
                : j === 1
                  ? require('../../../static/img/exec_fail.png')
                  : j === 2
                    ? require('../../../static/img/task/20140524124238403.gif')
                    : '../../../static/img/t_question.png'
            stagedomlist[i].childNodes[0].appendChild(svgimg)
          }
        }
      }
      this.viewxmlstages()
    },
    // xml状态显示
    viewxmlstages () {
      if (
        this.activityData &&
        this.activityData.stages &&
        this.activityData.stages.length > 0
      ) {
        let stagedomlist = document.getElementsByClassName('djs-element')
        // console.log(this.activityData.stages);
        for (var i = 0; i < stagedomlist.length; i++) {
          for (var j = 0; j < this.activityData.stages.length; j++) {
            if (
              this.activityData.stages[j].actNodeId ==
              stagedomlist[i].getAttribute('data-element-id')
            ) {
              if (this.activityData.stages[j].status == 'SUCCESS') {
                stagedomlist[i].childNodes[0].childNodes[0].style.stroke =
                  '#49BC71'
                for (
                  let k = 0;
                  k < stagedomlist[i].childNodes[0].childNodes.length;
                  k++
                ) {
                  if (k > 1) {
                    if (k == 2) {
                      stagedomlist[i].childNodes[0].childNodes[k].setAttributeNS(null, 'display', 'black')
                    } else {
                      stagedomlist[i].childNodes[0].childNodes[k].setAttributeNS(null, 'display', 'none')
                    }
                  }
                }
              } else if (
                this.activityData.stages[j].status == 'FAILURE' ||
                this.activityData.stages[j].status == 'FAILED' ||
                this.activityData.stages[j].status == 'ABORTED'
              ) {
                stagedomlist[i].childNodes[0].childNodes[0].style.stroke = 'red'
                for (
                  let k = 0;
                  k < stagedomlist[i].childNodes[0].childNodes.length;
                  k++
                ) {
                  if (k > 1) {
                    if (k == 3) {
                      stagedomlist[i].childNodes[0].childNodes[k].setAttributeNS(null, 'display', 'black')
                    } else {
                      stagedomlist[i].childNodes[0].childNodes[k].setAttributeNS(null, 'display', 'none')
                    }
                  }
                }
              } else if (this.activityData.stages[j].status == 'UNKNOWN') {
                for (
                  let k = 0;
                  k < stagedomlist[i].childNodes[0].childNodes.length;
                  k++
                ) {
                  if (k > 1) {
                    if (k == 5) {
                      stagedomlist[i].childNodes[0].childNodes[k].setAttributeNS(null, 'display', 'black')
                    } else {
                      stagedomlist[i].childNodes[0].childNodes[k].setAttributeNS(null, 'display', 'none')
                    }
                  }
                }
              } else if (this.activityData.stages[j].status == 'NOTEXECUTED') {
                stagedomlist[i].childNodes[0].childNodes[0].style.fill =
                  '#F2F2F2'
              } else if (
                this.activityData.stages[j].status == 'building' ||
                this.activityData.stages[j].status === 'IN_PROGRESS'
              ) {
                for (
                  let k = 0;
                  k < stagedomlist[i].childNodes[0].childNodes.length;
                  k++
                ) {
                  if (k > 1) {
                    if (k == 4) {
                      stagedomlist[i].childNodes[0].childNodes[k].setAttributeNS(null, 'display', 'black')
                    } else {
                      stagedomlist[i].childNodes[0].childNodes[k].setAttributeNS(null, 'display', 'none')
                    }
                  }
                }
              }
            }
          }
        }
      }
    },

    // 删除左侧不用图标
    deleteimg () {
      document.getElementsByClassName('bjs-powered-by')[0].style.display =
        'none'
      if (document.getElementsByClassName('djs-palette-entries')[0]) {
        let entrieslist = document.getElementsByClassName(
          'djs-palette-entries'
        )[0].childNodes

        for (let i = 0; i < entrieslist.length; i++) {
          if (i == 0) {
            entrieslist[i].childNodes[0].setAttribute('title', '移动')
            entrieslist[i].childNodes[3].setAttribute('title', '连接')
            entrieslist[i].childNodes[1].style.display = 'none'
            entrieslist[i].childNodes[2].style.display = 'none'
          }
          if (i == 1) {
            entrieslist[i].childNodes[0].setAttribute('title', '开始')
            entrieslist[i].childNodes[1].style.display = 'none'
            entrieslist[i].childNodes[2].setAttribute('title', '结束')
          }
          if (i == 2) {
            entrieslist[i].childNodes[0].setAttribute('title', '并行网关')
          }
          if (i == 3) {
            entrieslist[i].childNodes[0].setAttribute('title', '任务')
            entrieslist[i].childNodes[1].style.display = 'none'
          }
          if (i > 3) {
            entrieslist[i].style.display = 'none'
          }
        }
      }
    },
    // 初始化工作流 xml
    createNewDiagram (n, newxml) {
      if (newxml) {
        n.importXML(newxml, function (err) {
          if (err) {
            console.log(err)
          }
        })
      } else {
        let _this = this
        if (this.activityData && this.activityData.actXml) {
          this.bpmnXmlStr = this.activityData.actXml
        } else {
          let timestamp = common.randChar() + new Date().valueOf()
          this.bpmnXmlStr = `'<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:flowable="http://flowable.org/bpmn" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI" typeLanguage="http://www.w3.org/2001/XMLSchema" expressionLanguage="http://www.w3.org/1999/XPath" targetNamespace="http://www.flowable.org/processdef">\n' +
            '  <process id="${timestamp}" name="${timestamp}" isExecutable="true">\n' +
            '    <startEvent id="StartEvent_1" name="开始"/>\n' +
            "  </process>\n" +
            '  <bpmndi:BPMNDiagram id="BPMNDiagram_1">\n' +
            '    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">\n' +
            '      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">\n' +
            '        <omgdc:Bounds height="36.0" width="36.0" x="200.0" y="150.0"/>\n' +
            "      </bpmndi:BPMNShape>\n" +
            "    </bpmndi:BPMNPlane>\n" +
            "  </bpmndi:BPMNDiagram>\n" +
            "</definitions>"`
        }
        // console.log(this.activityData);

        // 将字符串转换成图显示出来
        n.importXML(this.bpmnXmlStr, function (err) {
          if (err) {
            console.log(err)
          }
          _this.addEventBusListener()
          _this.hiddenDom()
          _this.setImageStages()
          _this.deleteimg()
        })
      }
    },
    addEventBusListener () {
      // 监听双击事件，这里做dialog
      const eventBus = this.bpmnModeler.get('eventBus')
      eventBus.on('element.click', event => {
        if (event.element.type === 'bpmn:Task') {
          this.showDiaLog = true
          this.taskElement = event.element
          this.$emit('update:isShowDialog', this.showDiaLog)
          this.$emit('update:ID', event.element.id)
        }
      })
    },
    hiddenDom () {
      if (this.isDisabled) {
        // 详情则不显示左侧工具栏
        document.querySelector('.djs-palette').style.display = 'none'
        // 如果时详情点击元素则不显示右侧的工具
        document.querySelector('.djs-overlay-container').style.display = 'none'
        let domList = document.getElementsByClassName('djs-shape')
        for (let dom of domList) {
          dom.onmouseenter = function () {
            // 如果时详情则不显示右侧的工具
            let spaceNode = document.querySelector('.djs-context-pad')
            let bettwonNode = document.querySelector('.djs-overlay-container')
            if (spaceNode && spaceNode !== '') {
              spaceNode.style.display = 'none'
            }
            if (bettwonNode && bettwonNode !== '') {
              bettwonNode.style.display = 'none'
            }
          }
        }
      }
    },
    // 下载为SVG格式,done是个函数，调用的时候传入的
    saveSVG (done) {
      // 把传入的done再传给bpmn原型的saveSVG函数调用
      this.bpmnModeler.saveSVG(done)
    },
    // 下载为SVG格式,done是个函数，调用的时候传入的
    saveDiagram (done) {
      // 把传入的done再传给bpmn原型的saveXML函数调用
      this.bpmnModeler.saveXML({ format: true }, function (err, xml) {
        done(err, xml)
      })
    },
    // 当图发生改变的时候会调用这个函数，这个data就是图的xml
    setEncoded (link, name, data) {
      // 把xml转换为URI，下载要用到的
      const encodedData = encodeURIComponent(data)
      // 获取到图的xml，保存就是把这个xml提交给后台
      this.xmlStr = data
      // 下载图的具体操作,改变a的属性，className令a标签可点击，href令能下载，download是下载的文件的名字
      if (data) {
        link.className = 'active'
        link.href = 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData
        link.download = name
      }
      this.SendActityData(data)
      // 这里处理xml变化时图片消失
      this.viewxmlstages()
      // 任务框可输入的input 需要的话注释下面方法 ，不需要的话打开下面方法
      this.$nextTick(() => {
        this.clearInput()
      })
    },
    // 这里传递工作流必要数据到组件外部
    SendActityData (xml) {
      // 返回节点数组
      let nodeList = []
      let editdata = ''
      if (xml.indexOf('definitions') > -1) {
        let xmlarrary = xml.split('process')[2].split('<task id="')
        xmlarrary.forEach(item => {
          if (item.indexOf('Task') > -1) {
            let splitarray = item.split('"')
            if (JSON.stringify(nodeList).indexOf(splitarray[0]) == -1) {
              nodeList.push({
                actNodeId: splitarray[0],
                actNodeName:
                  splitarray.length >= 3 && splitarray[1].indexOf('name') > -1
                    ? splitarray[2]
                    : ''
              })
            }
          }
        })
        editdata = {
          actXml: xml,
          nodeList: nodeList
        }
        console.log(editdata)
        this.$emit('confirm', editdata)
      }
    },
    // 渲染
    Rendering () {
      // 获取到属性ref为“content”的dom节点
      this.container = this.$refs.content
      // 获取到属性ref为“canvas”的dom节点
      const canvas = this.$refs.canvas

      // 建模，官方文档这里讲的很详细
      this.bpmnModeler = new BpmnModeler({
        container: canvas,
        // 添加控制板
        propertiesPanel: {
          parent: '#js-properties-panel'
        },
        additionalModules: [
          // 左边工具栏以及节点
          propertiesProviderModule,
          // 右边的工具栏
          propertiesPanelModule
        ],
        moddleExtensions: {
          camunda: camundaModdleDescriptor
        }
      })

      // 下载画图
      let _this = this
      // 获取a标签dom节点
      const downloadLink = this.$refs.saveDiagram
      const downloadSvgLink = this.$refs.saveSvg
      // 给图绑定事件，当图有发生改变就会触发这个事件
      this.bpmnModeler.on('commandStack.changed', function () {
        _this.saveSVG(function (err, svg) {
          _this.setEncoded(downloadSvgLink, 'diagram.svg', err ? null : svg)
        })

        _this.saveDiagram(function (err, xml) {
          _this.setEncoded(downloadLink, 'diagram.bpmn', err ? null : xml)
        })
      })
    },
    // 拖拽初始化
    Drag () {
      let _this = this
      _this.oDiv = document.getElementById('div1')
      _this.oDiv2 = document.getElementById('div2')
      _this.right = document.getElementById('right')
      _this.bottom = document.getElementById('bottom')

      // 往下拽
      _this.bottom.onmousedown = function (ev) {
        var oEvent = ev || event
        _this.mouseStart.x = oEvent.clientX
        _this.mouseStart.y = oEvent.clientY
        _this.bottomStart.y = _this.bottom.offsetTop
        if (_this.bottom.setCapture) {
          _this.bottom.onmousemove = _this.doDrag
          _this.bottom.onmouseup = _this.stopDrag
          _this.bottom.setCapture()
        } else {
          document.addEventListener('mousemove', _this.doDrag, true)
          document.addEventListener('mouseup', _this.stopDrag, true)
        }
      }
    },
    // 开始拖拽
    doDrag (ev) {
      var oEvent = ev || event
      var t = oEvent.clientY - this.mouseStart.y + this.bottomStart.y
      var h = t + this.oDiv.offsetHeight

      if (h < this.oDiv.offsetHeight) {
        h = this.oDiv.offsetHeight
      } else if (
        h >
        document.documentElement.clientHeight - this.oDiv2.offsetTop
      ) {
        h = document.documentElement.clientHeight - this.oDiv2.offsetTop - 2
      }
      this.oDiv2.style.height = h + 'px'
    },
    // 停止拖拽
    stopDrag () {
      if (this.bottom.releaseCapture) {
        this.bottom.onmousemove = null
        this.bottom.onmouseup = null
        this.bottom.releaseCapture()
      } else {
        document.removeEventListener('mousemove', this.doDrag, true)
        document.removeEventListener('mouseup', this.stopDrag, true)
      }
    }
  },
  mounted () {
    this.Drag()
    this.Rendering()
    this.createNewDiagram(this.bpmnModeler)
  }
}
</script>

<style lang="scss" >
/*左边工具栏以及编辑节点的样式*/
@import 'bpmn-js/dist/assets/diagram-js.css';
@import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
@import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
@import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
/*右边工具栏样式*/
@import 'bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css';
.containers {
  background-color: #ffffff;
  /* width: 98.5%; */
  /* display: block; */
}
.canvas {
  width: 100%;
  height: 100%;
}
.buttons {
  bottom: 20px !important;
}
#div2 {
  position: relative;
  height: 300px;
}
#div1 {
  width: 15px;
  height: 15px;
  position: absolute;
  right: 0px;
  bottom: 0px;
  cursor: nw-resize;
  overflow: hidden;
  font-size: 12px;
  text-align: center;
  line-height: 15px;
  float: right;
  z-index: 3;
}
#bottom {
  width: 100%;
  text-align: center;
  height: 15px;
  /* background: #f00; */
  position: absolute;
  left: 0;
  bottom: 0;
  line-height: 10px;
  cursor: n-resize;
  overflow: hidden;
  opacity: 1;
  z-index: 1;
}
</style>
