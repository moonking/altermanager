<template>
  <div class="business-path">
    <!-- <p style="height: 48px;line-height: 48px;background-color: #fff;padding: 0 20px;" @click="goLinkTopology">业务路径</p> -->
    <div class="business-path-wrapper">
      <graph-editor :data="tempData" :sessionCfg="sessionCfg" :mouseCfg="mouseCfg" class="editor" ref="graphEditor">
        <template v-slot:tooltip="tooltip">
          <business-path-tooltip :alerts="tooltip.editorInfo"></business-path-tooltip>
        </template>
      </graph-editor>
    </div>
  </div>
</template>

<script>
// import processSvg from '../../../../static/img/graph-icons/jincheng.svg'
// import hostSvg from '../../../../static/img/graph-icons/yunzhuji.svg'
// import transactionSvg from '../../../../static/img/graph-icons/jiaoyi.svg'
// import serviceSvg from '../../../../static/img/graph-icons/quanqiu.svg'
// import appSvg from '../../../../static/img/graph-icons/yingyong.svg'
import BusinessPathTooltip from './BusinessPathTooltip'
import axios from '@/api'
export default {
  data () {
    return {
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
      mouseCfg: {zoom: true, move: true},
      alerts: {name: 'test'},
      sessionCfg: {
        transparentBg: true,
        renderer: 'canvas',
        // width: width,
        // height: height,
        defaultEdge: {
          type: 'line',
          // color: '#000',
          style: {
            stroke: '#A8D4FF',
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
        nodeStateStyles: {
          warning: {
            stroke: 'red',
            strokeOpacity: 1
          },
          hover: {
            // stroke: 'blue',
            // strokeOpacity: 1
            cursor: 'pointer'
          }
          // selected: {
          //   stroke: 'red',
          //   strokeOpacity: 1
          // },
          // active: {
          //   stroke: 'yellow',
          //   strokeOpacity: 1
          // },
        },
        edgeStateStyles: {
          hover: {
            stroke: 'yellow',
            cursor: 'pointer'
          },
          selected: {
            stroke: 'red'
          },
          warning: {
            stroke: 'red'
          }
        },
        defaultNode: {
          type: 'businessPathNode',
          labelColor: '#fff',
          // type: 'iconCircle',
          style: {
            stroke: '#1AC1FF',
            fill: '#00A8E8'
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
          type: 'topology-layout',
          level: 5,
          nodeSize: [160, 72],
          nodeSpace: 60

          // type: 'dagre',
          // rankdir: 'BT',
          // ranksep: 50,
          // nodesep: 30,
          // controlPoints: true,
          // workerEnabled: true

          // type: 'force',
          // linkDistance: 200, // 可选，边长
          // preventOverlap: true,
          // nodeSize: 60, // 可选

          // type: 'fruchterman',
          // gravity: 1, // 可选
          // speed: 1, // 可选

          // type: 'concentric',
          // nodeSize: [160, 72],
          // preventOverlap: true,
          // minNodeSpacing: 40,
          // workerEnabled: true
        },
        fitView: true,
        fitViewPadding: [10],
        modes: {
          default: [
            // 'drag-canvas',
            'drag-node',
            'contextmenu',
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
            'hover-node',
            // 'select-edge',
            // 'hover-edge',
            // 'select-node',
            // 'add-edge'
          ],
          move: ['drag-canvas'],
          addEdge: ['add-edge']
        }
      },
      systemList: [],
      ws: null,
      wsData: {},
      graph: null,
      editorCfg: {
        transparentBg: true
      }
    }
  },
  computed: {
    graphData () {
      const {systemList, tranformToGraphData} = this
      return tranformToGraphData(systemList)
    }
  },
  methods: {
    initCustomGraphListener (graph) {
      graph.on('node:click', (e) => {
        const { item } = e
        const model = item.getModel()
        const { systemId } = model.businessData || {}
        console.log('hello node: ', model)
        this.goLinkTopology(systemId)
      })
      graph.on('afteritemstatechange', (e) => {
        const { item, state, enabled } = e
        const model = item.getModel()
        if (state === 'warning') {
          if (enabled) {
            console.log(model.id + 'warning 设置为 true')
          } else {
            console.log(model.id + 'warning 设置为 false')
          }
        }
      })
    },
    tranformToGraphData (data) {
      const nodes = []
      const edges = []
      data.forEach(system => {
        const {name, systemId, callNodes} = system
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
    getSystemList () {
      // const param = {
      //   name: '',
      //   current: 1,
      //   size: 100000
      // }
      axios.getTopologySystems().then(res => {
        console.log(res)
        if (res.data.code == 200) {
          this.systemList = res.data.data
        }
      })
    },
    goLinkTopology (systemId) {
      this.$router.push({
        path: '/Aibms/businessPath/linkTopology',
        query: {
          code: 8,
          systemId
        }
      })
    },
    setSystemAlertStyle (systemId) {
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
    initWebSocket () {
      const url = 'ws://111.231.165.249:8087/ws/topology/system'
      const ws = new WebSocket(url)

      ws.onopen = () => {
        console.log('业务系统ws连接成功！')
      }
      ws.onmessage = (event) => {
        let { data } = event
        // console.log(data)
        const { systemList } = this
        if (data) {
          data = JSON.parse(data)
          console.log(data)
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
                    console.log('nnmm')
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
          // this.systemList = JSON.parse(data)
        }
      }
      ws.onclose = () => {
        console.log('业务系统ws连接关闭！')
        ws.close()
      }
      ws.onerror = () => {
        console.log('业务系统ws出错了！')
      }

      this.ws = ws
    }
  },
  created () {
    this.getSystemList()
    this.initWebSocket()
  },
  mounted () {
    this.$nextTick(() => {
      const graph = this.$refs.graphEditor
      const instance = graph.getGraphInstance()
      this.graph = instance
      this.initCustomGraphListener(instance)
    })
  },
  components: {
    BusinessPathTooltip
  },
  beforeRouteLeave (to, from, next) {
    console.log('离开了当前路由！')
    const { ws } = this
    if (ws) ws.close()
    next()
  },
  activated () {
    console.log('业务路径组件被激活了')
  },
  deactivated () {
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
}
</style>
