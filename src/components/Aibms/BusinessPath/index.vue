<template>
  <div class="business-path">
    <!-- <p style="height: 48px;line-height: 48px;background-color: #fff;padding: 0 20px;" @click="goLinkTopology">业务路径</p> -->
    <div class="business-path-wrapper">
      <!-- graphData -->
      <!-- tempData -->
      <graph-editor
        :data.sync="graphData"
        :sessionCfg="sessionCfg"
        :mouseCfg="mouseCfg"
        class="editor"
        ref="graphEditor"
      >
        <template v-slot:tooltip="tooltip">
          <business-path-tooltip
            v-if="tooltip.editorInfo"
            :alerts="tooltip.editorInfo"
          ></business-path-tooltip>
        </template>
      </graph-editor>
    </div>
    <!-- <div>
      <button @click="save">保存</button>
    </div> -->
    <!-- <div class="notify-list" v-if="notifyList.length > 0">
      <div class="notify-list-title">
        <div class="notify-list-title-text">
          告警信息
          <el-button @click="notifyAlert" size="mini">测试</el-button>
        </div>
      </div>
      <div class="notify-list-content">
        <div
          class="item-wrapper"
          v-for="(notify, index) in notifyList"
          :key="notify.id"
        >
          <div class="notify-list-item">
            <div class="notify-list-icon">
              <icon-svg
                style="font-size: 18px; vertical-align: sub; margin-left: 10px"
                icon-class="bj"
                :class="notify.level | iconLevelFilter"
              />
            </div>
            <div class="list-item-detail">
              <div class="notify-list-item-time">时间：{{ notify.time }}</div>
              <div class="notify-list-item-name">对象：{{ notify.host }}</div>
            </div>
            <div class="notify-close" @click="closeNotify(index)">
              <i class="el-icon-close"></i>
            </div>
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
// import processSvg from '../../../../static/img/graph-icons/jincheng.svg'
// import hostSvg from '../../../../static/img/graph-icons/yunzhuji.svg'
// import transactionSvg from '../../../../static/img/graph-icons/jiaoyi.svg'
// import serviceSvg from '../../../../static/img/graph-icons/quanqiu.svg'
// import appSvg from '../../../../static/img/graph-icons/yingyong.svg'
import BusinessPathTooltip from './BusinessPathTooltip'
import moment from 'moment'
import common from '@/utils/commonjs';
import axios from '@/api'
export default {
  filters: {
    iconLevelFilter: level => {
      const iconMap = {
        '1': 's1-color',
        '2': 's2-color',
        '3': 's3-color'
      };
      return iconMap[level]
    }
  },
  data() {
    return {

      notifyList: [
        // {
        //   id: 0,
        //   name: 'CNZHAPWRPA010:9182',
        //   time: '2020-08-13 05:24:01',
        //   level: 'critical'
        // },
        // {
        //   id: 1,
        //   name: 'CNZHAPWRPA010:9182',
        //   time: '2020-08-13 05:24:01',
        //   level: 'information'
        // },
        // {
        //   id: 2,
        //   name: 'CNZHAPWRPA010:9182',
        //   time: '2020-08-13 05:24:01',
        //   level: 'warning'
        // }
      ],
      // mock 的图数据
      tempData: {
        // 点集
        nodes: [
          // 主机
          { id: 'nodeA1', text: '\ue60e', level: 1 },
          { id: 'nodeA2', text: '\ue60e', level: 1 },
          // 进程
          { id: 'nodeB1', text: '\ue6d8', level: 2 },
          { id: 'nodeB2', text: '\ue6d8', level: 2 },
          { id: 'nodeB3', text: '\ue6d8', level: 2 },
          // 服务
          { id: 'nodeC1', text: '\ue663', level: 3 },
          { id: 'nodeC2', text: '\ue663', level: 3 },
          { id: 'nodeC3', text: '\ue663', level: 3 },
          { id: 'nodeC4', text: '\ue663', level: 3 },
          { id: 'nodeC5', text: '\ue663', level: 3 },
          { id: 'nodeC6', text: '\ue663', level: 3 },
          { id: 'nodeC7', text: '\ue663', level: 3 },
          { id: 'nodeC8', text: '\ue663', level: 3 },
          // 应用
          { id: 'nodeD1', text: '\ue650', level: 4 },
          { id: 'nodeD2', text: '\ue650', level: 4 },
          { id: 'nodeD3', text: '\ue650', level: 4 },
          { id: 'nodeD4', text: '\ue650', level: 4 },
          { id: 'nodeD5', text: '\ue650', level: 4 },
          // 交易
          { id: 'nodeE1', text: '\ue605', level: 5 },
          { id: 'nodeE2', text: '\ue605', level: 5 },
          { id: 'nodeE3', text: '\ue605', level: 5 },
          { id: 'nodeE4', text: '\ue605', level: 5 },
          { id: 'nodeE5', text: '\ue605', level: 5 }
        ],
        // 边集
        edges: [
          { source: 'nodeA1', target: 'nodeB1' },
          { source: 'nodeA1', target: 'nodeB2' },

          { source: 'nodeA2', target: 'nodeB3' },

          { source: 'nodeB1', target: 'nodeC1' },
          { source: 'nodeB1', target: 'nodeC2' },

          { source: 'nodeB2', target: 'nodeC3' },
          { source: 'nodeB2', target: 'nodeC4' },

          { source: 'nodeB3', target: 'nodeC5' },
          { source: 'nodeB3', target: 'nodeC6' },
          { source: 'nodeB3', target: 'nodeC7' },
          { source: 'nodeB3', target: 'nodeC8' },

          { source: 'nodeC1', target: 'nodeD1' },
          { source: 'nodeC1', target: 'nodeD2' },

          { source: 'nodeC2', target: 'nodeD3' },
          { source: 'nodeC2', target: 'nodeD4' },

          { source: 'nodeC3', target: 'nodeD5' },

          { source: 'nodeD1', target: 'nodeE1' },
          { source: 'nodeD1', target: 'nodeE2' },
          { source: 'nodeD1', target: 'nodeE3' },

          { source: 'nodeD2', target: 'nodeE4' },

          { source: 'nodeD4', target: 'nodeE5' }
        ]
      },
      // 图配置项
      mouseCfg: { zoom: true, move: true },
      // tooltip 信息
      alerts: { name: 'test' },
      // graph 实例配置
      sessionCfg: {
        // 是否透明背景
        transparentBg: true,
        // 渲染引擎
        renderer: 'canvas',
        // 配合tofront 提示层级
        groupByTypes: false,
        // 默认边配置
        defaultEdge: {
          type: 'line',
          // type: 'circle-running',
          // type: 'line-dash',
          // type: 'line-arrow',
          // color: '#000',
          style: {
            // stroke: '#23bbd6',
            stroke: '#00a8e8',
            lineWidth: 2,
            lineAppendWidth: 20,
            // startArrow: true,
            endArrow: true
          },
          labelCfg: {
            refY: 0,
            style: {
              fill: '#000',
              fontSize: 16
            }
          }
          // type: 'cubic-horizontal'
          // controlPoints: [{ x: 20, y: 20 }, { x: 120, y: 20 }]
        },
        // 节点状态样式配置
        nodeStateStyles: {
          warning: {
            stroke: 'red',
            strokeOpacity: 1
          },
          hover: {
            stroke: 'blue',
            strokeOpacity: 1
          },
          actived: {
            stroke: '#ff6766',
            lineWidth: 2,
            strokeOpacity: 1
          },
          selected: {
            stroke: '#ff6766',
            lineWidth: 2,
            strokeOpacity: 1
          }
          // active: {
          //   stroke: 'yellow',
          //   strokeOpacity: 1
          // },
        },
        // 边状态样式配置
        edgeStateStyles: {
          hover: {
            stroke: 'yellow',
            cursor: 'pointer'
          },
          actived: {
            stroke: '#ff6766',
            // stroke: '#19b868',
            lineWidth: 4
          },
          selected: {
            stroke: '#ff6766',
            // stroke: '#19b868',
            lineWidth: 4
          },
          warning: {
            stroke: 'red'
          }
        },
        // 默认节点配置
        defaultNode: {
          // type: 'iconCircle',
          type: 'businessPathNode',
          labelColor: '#fff',
          style: {
            stroke: 'transparent',
            fill: '#16161693',
            // fill: '#50505099',
            shadowColor: '#333',
            shadowBlur: 5
          },
          colors: {
            warning: 'orange',
            error: 'red'
          }
          // labelCfg: {
          //   style: {
          //     fill: 'red',
          //     fontSize: 18
          //   }
          // }
        },
        layout: {
          // Object，可选，布局的方法及其配置项，默认为 random 布局。
          type: 'grid',
          // type: 'topology-layout',
          // type: 'gForce',
          preventOverlap: true,
          nodeSize: 30
          // ...                    // 其他配置
        },
        // layout: {
        //   type: 'fruchterman',
        //   gravity: 5,
        //   speed: 5
        // },
        // 布局配置
        // layout: {
        //   type: 'topology-layout',
        //   level: 5,
        //   nodeSize: [160, 72],
        //   nodeSpace: 60

        //   // type: 'dagre',
        //   // rankdir: 'BT',
        //   // ranksep: 50,
        //   // nodesep: 30,
        //   // controlPoints: true,
        //   // workerEnabled: true

        //   // type: 'force',
        //   // linkDistance: 200, // 可选，边长
        //   // preventOverlap: true,
        //   // nodeSize: 60, // 可选

        //   // type: 'fruchterman',
        //   // gravity: 1, // 可选
        //   // speed: 1, // 可选

        //   // type: 'concentric',
        //   // nodeSize: [160, 72],
        //   // preventOverlap: true,
        //   // minNodeSpacing: 40,
        //   // workerEnabled: true
        // },
        // fitView: true, // 适应画布
        // fitViewPadding: [10],
        // 模式配置
        modes: {
          default: [
            // 'drag-canvas',
            'drag-node',
            'contextmenu'
            // 'brush-select',
            // 'click-select',
            // {
            //   type: 'tooltip', // 提示框
            //   formatText (model) {
            //     // 提示框文本内容
            //     const text = 'label: ' + model.label + '<br/> ip: ' + model.ip
            //     return text
            //   }
            // },
            // 'hover-node'
            // 'select-edge',
            // 'hover-edge',
            // 'select-node',
            // 'add-edge'
          ],
          move: ['drag-canvas'],
          addEdge: ['add-edge']
        }
      },
      // 系统列表
      systemList: [],
      // 当前推送 websocket 实例
      ws: null,
      // websocket 数据
      wsData: {},
      // 当前 graph 对象
      graph: null
    }
  },
  computed: {
    // 图数据
    graphData() {
      const { systemList, tranformToGraphData } = this
      // console.log(tranformToGraphData(systemList))
      return tranformToGraphData(systemList)
    }
  },
  methods: {
    closeNotify(index) {
      this.notifyList.splice(index, 1)
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
    },
    // 初始化自定义图事件监听器
    initCustomGraphListener(graph) {
      // 监听鼠标点击节点事件，点击借条跳转到拓扑层级图页面
      graph.on('node:click', (e) => {
        const { item } = e
        const model = item.getModel()
        const { systemId } = model.businessData || {}
        this.goLinkTopology(systemId)
      })

      // 监听鼠标滑动到节点上事件，鼠滑动到节点上则高亮相关联的节点和边
      graph.on('node:mouseenter', e => {
        const item = e.item
        const { graph } = this

        this.setHighlightItem(item, true, graph)
      })

      // 监听鼠标滑动到边上事件，鼠滑动到边上则高亮相关联的节点和边
      graph.on('edge:mouseenter', e => {
        const item = e.item
        const { graph } = this

        this.setHighlightItem(item, true, graph)
      })

      // 监听鼠标滑出节点事件，鼠滑出节点后取消高亮相关联的节点和边
      graph.on('node:mouseleave', e => {
        const { graph } = this
        this.clearItemHighlight(graph)
      })

      // 监听鼠标滑出边事件，鼠滑出边后取消高亮相关联的节点和边
      graph.on('edge:mouseleave', e => {
        const { graph } = this
        this.clearItemHighlight(graph)
      })
    },
    // 清楚高亮节点和边
    clearItemHighlight(graph) {
      const state = 'actived'
      // 置空所有节点和边的高亮状态
      const nodes = graph.getNodes()
      const edges = graph.getEdges()

      nodes.forEach(node => {
        graph.setItemState(node, state, false)
        node.toBack();
      })
      edges.forEach(edge => {
        graph.setItemState(edge, state, false)
        edge.toBack();
      })
      // 注意：必须调用以根据新的层级顺序重绘
      graph.paint();
    },
    // 设置高亮节点和边
    setHighlightItem(item, highlight, graph, sourceId, type = 'all') {
      const isNode = item.getType() === 'node'
      const isEdge = item.getType() === 'edge'
      const state = 'actived'

      if (isNode) {
        // 设置节点自身高亮
        graph.setItemState(item, state, highlight)
        // 将节点提前。
        item.toFront();
        // 递归遍历节点树
        const edges = item.getInEdges()
        const allEdges = item.getEdges()
        let targetEdges = []
        let edgesList = edges.map(item => item._cfg.id);
        allEdges.forEach((e) => {
          if (!edgesList.includes(e._cfg.id)) {
            targetEdges.push(e)
          }
        })
        if (edges.length > 0 && (type === 'source' || type === 'all')) {
          edges.forEach(edge => {
            graph.setItemState(edge, state, highlight)
            if ('getSource' in edge) {
              if (edge._cfg.model.target === item._cfg.model.id && edge._cfg.model.source !== sourceId) {
                const source = edge.getSource()
                this.setHighlightItem(source, highlight, graph, item._cfg.id, 'source')
              }
            }
          })
        }
        if (targetEdges.length > 0 && (type === 'target' || type === 'all')) {
          targetEdges.forEach((targetE) => {
            graph.setItemState(targetE, state, highlight)
            const target = targetE.getTarget()
            if (targetE._cfg.model.source === item._cfg.model.id && targetE._cfg.model.target !== sourceId) {
              this.setHighlightItem(target, highlight, graph, item._cfg.id, 'target')
            }
          })
        }
      }

      if (isEdge) {
        // const target = item.getTarget()
        // graph.setItemState(target, state, highlight)
        graph.setItemState(item, state, highlight)
        const source = item.getSource()
        this.setHighlightItem(source, highlight, graph)
      }
      // 更改层级后需要重新绘制图
      graph.paint();
    },
    // 将后台业务数据转换为可渲染的图数据结构
    // 即 data =  { nodes: [], edges: [] }
    tranformToGraphData(data) {
      const nodes = []
      const edges = []
      data.forEach(system => {
        const { name, systemId, callNodes } = system
        // id: 'nodeA1', nodeName: 'testName', label: 'user', ip: '127.0.0.1', img: hostSvg
        let node = {
          id: systemId,
          label: name,
          businessData: system
        }
        nodes.push(node)

        // edge
        if (callNodes) {
          const calls = JSON.parse(callNodes)
          calls.forEach(system => {
            const edge = {
              source: systemId,
              target: system.systemId
            }
            edges.push(edge)
          })
        }
      })
      return {
        nodes, edges
      }
    },
    // 获取系统列表
    getSystemList() {
      // const param = {
      //   name: '',
      //   current: 1,
      //   size: 100000
      // }
      axios.getTopologySystems().then(res => {
        if (res.data.code == 200) {
          this.systemList = res.data.data
        }
      })
    },
    // 跳转到层级拓扑图页面
    goLinkTopology(systemId) {
      this.$router.push({
        path: '/Aibms/businessPath/linkTopology',
        query: {
          code: 2,
          systemId
        }
      })
    },
    setSystemAlertStyle(systemId) {
      const { graph, systemList } = this
      if (!graph) return
      // 重置所有系统告警状态
      systemList.forEach(system => {
        // graph.setItemState(system.systemId, 'warning', false)

        const node = graph.findById(system.systemId)
        const keyShape = node.getKeyShape()
        keyShape.attr('stroke', '#1890ff')
        // node.setState('warning', true)
      })

      // 设置有告警信息系统的告警状态
      // graph.setItemState(systemId, 'warning', true)

      const node = graph.findById(systemId)
      const keyShape = node.getKeyShape()
      keyShape.attr('stroke', 'red')
      // node.setState('warning', true)

      console.log(node.getStates())
      console.log('warning style: ', node.getStateStyle())
    },
    initWebSocket() {
      // let url = config.wsTopology.replace('ciitem', 'system').substring(0, config.wsTopology.length - 1)
      // const ws = new WebSocket(url)

      // ws.onopen = () => {
      //   console.log('业务系统ws连接成功！')
      // }
      this.$global.wsAibms.onmessage = (event) => {
        let data = common.evil(event.data);

        const { systemList } = this
        if (data) {
          if (data.aelrtList && data.aelrtList.length > 0) {
            this.notifyList = data.aelrtList
            this.notifyList.forEach((item) => {
              item.time = moment(item.startTime).format('YYYY-MM-DD hh:mm:ss')
            })
            this.notifyAlert(data.alert)
          } else {
            this.wsData = data
            let alertsList = []
            data.forEach(item => {
              const { systemId } = item
              systemList.forEach((system, index) => {
                if (systemId === system.systemId) {
                  // system = item
                  // 重置每一个节点告警状态
                  const { graph } = this
                  const { systemId } = system
                  if (graph) {
                    graph.setItemState(systemId, 'warning', false)
                  }
                  const nodeList = item.hierarchicalCount.systemLinkLevelList
                  let alertFlag = false
                  nodeList.forEach(node => {
                    if (node.alertNum > 0) {
                      alertFlag = true
                    }
                  })
                  if (alertFlag) {
                    system.hierarchicalCount = item.hierarchicalCount
                    alertsList.push(systemId)
                    // this.$set(systemList, index, item)
                  }
                }
              })
            })
            alertsList.forEach(systemId => {
              const { graph } = this
              // 设置节点为红色
              if (graph) {
                // systemList.forEach(node => {
                //   if (node.alerts.length > 0) {

                //   }
                // })
                graph.setItemState(systemId, 'warning', true)
              }
            })
          }

          // this.systemList = JSON.parse(data)
        }
      }
      //   ws.onmessage
      //   ws.onclose = () => {
      //     console.log('业务系统ws连接关闭！')
      //     ws.close()
      //   }
      //   ws.onerror = () => {
      //     console.log('业务系统ws出错了！')
      //   }

      //   this.ws = ws
    }
    // save() {
    //   // console.log(this.graph.save())
    //   // console.log(JSON.stringify(this.graph.save()))
    //   setTimeout(() => {
    //     this.graph.data(this.tempData);
    //     this.graph.render();
    //   }, 10)
    // }
  },
  created() {
    this.getSystemList()
    this.initWebSocket()
  },
  mounted() {
    this.$nextTick(() => {
      const graph = this.$refs.graphEditor
      const instance = graph.getGraphInstance()
      this.graph = instance
      // 初始化自定义图事件监听器
      this.initCustomGraphListener(instance)
    })
  },
  components: {
    BusinessPathTooltip
  },
  beforeRouteLeave(to, from, next) {
    console.log('离开了当前路由！')
    const { ws } = this
    if (ws) ws.close()
    next()
  },
  activated() {
    console.log('业务路径组件被激活了')
  },
  deactivated() {
    console.log('业务路径组件被失活了')
  }
}
</script>

<style scoped>
.business-path {
  flex: 1 1 auto;
  width: 100%;
  height: 606px;
  box-sizing: border-box;
  position: relative;
  /* background-color: green; */
}
.business-path-wrapper {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  /* padding: 0 360px 0 0; */
}
.editor {
  width: 100%;
  height: 100%;
}
.temp {
  border: 1px solid #ddd;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  background-color: #23bbd6;
}
.notify-list {
  width: 360px;
  position: absolute;
  right: 0;
  bottom: 0;
  background-color: #161616b3;
  box-shadow: 0 0 10px #000;
  z-index: 100;
}
.notify-list-title {
  padding: 10px 16px 4px;
}
.notify-list-title-text {
  font-size: 14px;
  font-weight: bold;
  border-bottom: 1px dashed #ddd;
  color: #fff;
  padding-bottom: 12px;
}
.notify-list-content {
  height: 224px;
  overflow-y: auto;
  padding: 10px 0;
}
.item-wrapper {
  padding: 0 16px;
}
.notify-list-item {
  /* width: 100%; */
  font-size: 14px;
  color: #fff;
  /* border-bottom: 1px dashed #ddd; */
  padding: 10px 10px 10px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.notify-list-icon {
  text-align: left;
  margin-right: 16px;
}
.list-item-detail {
  flex: 1;
  font-size: 12px;
}
.notify-list-item:hover {
  box-shadow: 0 0 10px #000;
}
.notify-list-item-name {
  display: block;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.notify-list-item-time {
  display: block;
  width: 100%;
  margin-bottom: 4px;
}
.notify-close:hover {
  cursor: pointer;
}
.notify-close:hover i {
  color: #1890ff;
}

/* 等级颜色 */
.s1-color {
  color: #ff0000 !important;
  fill: #ff0000 !important;
}
.s2-color {
  color: #ff9900 !important;
  fill: #ff9900 !important;
}
.s3-color {
  color: #ffcc00 !important;
  fill: #ffcc00 !important;
}
.s4-color {
  color: #ffff00 !important;
  fill: #ffff00 !important;
}
.s5-color {
  color: #ffff88 !important;
  fill: #ffff88 !important;
}

/* 滚动条样式 */
/*css主要部分的样式*/
/*定义滚动条宽高及背景，宽高分别对应横竖滚动条的尺寸*/

::-webkit-scrollbar {
  width: 8px; /*对垂直流动条有效*/
  height: 8px; /*对水平流动条有效*/
}

/*定义滚动条的轨道颜色、内阴影及圆角*/
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #444;
  border-radius: 3px;
}

/*定义滑块颜色、内阴影及圆角*/
::-webkit-scrollbar-thumb {
  border-radius: 7px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #666;
}

/*定义两端按钮的样式*/
::-webkit-scrollbar-button {
  /* background-color:cyan; */
}

/*定义右下角汇合处的样式*/
::-webkit-scrollbar-corner {
  /* background:khaki; */
}
</style>
<style>
.notify-style {
  width: 360px;
  height: 160px;
  background-color: #161616b3 !important;
  border-radius: 5px;
  border: none;
  color: #fff;
  box-shadow: 0 0 10px #000 !important;
}
.notify-title {
  font-size: 14px;
  font-weight: bold;
  color: #fff;
  padding-bottom: 10px;
  border-bottom: 1px dashed #ddd;
}
.notify-content {
  margin-top: 16px;
  font-size: 14px;
  color: #fff;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
.notify-item {
  margin-bottom: 4px;
}
.notify-item:last-child {
  margin-bottom: 0;
}
</style>
