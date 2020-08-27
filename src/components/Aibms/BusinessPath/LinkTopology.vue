<template>
  <div class="link-topology">
    <!-- <p style="height: 48px;line-height: 48px;background-color: #fff;padding: 0 20px;">链路拓扑</p> -->
    <div class="level-labels">
      <div class="level-label">交易类型</div>
      <div class="level-label">应用</div>
      <div class="level-label">服务</div>
      <div class="level-label">进程</div>
      <div class="level-label">主机</div>
    </div>
    <div class="topology-graph-container">
      <graph-editor :data="graphData" :sessionCfg="sessionCfg" :mouseCfg="mouseCfg" class="editor" ref="graphEditor">
        <template v-slot:tooltip="tooltip">
          <link-topology-tooltip :alerts="tooltip.editorInfo"></link-topology-tooltip>
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
import LinkTopologyTooltip from './LinkTopologyTooltip'
import axios from '@/api'
export default {
  data () {
    return {
      mouseCfg: {zoom: true, move: {x: true, y: false}},
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
          { id: 'nodeC9', text: '\ue663', level: 3 },
          { id: 'nodeC10', text: '\ue663', level: 3 },
          { id: 'nodeC11', text: '\ue663', level: 3 },
          { id: 'nodeC12', text: '\ue663', level: 3 },
          { id: 'nodeC13', text: '\ue663', level: 3 },
          { id: 'nodeC14', text: '\ue663', level: 3 },
          { id: 'nodeC15', text: '\ue663', level: 3 },
          { id: 'nodeC16', text: '\ue663', level: 3 },
          { id: 'nodeC17', text: '\ue663', level: 3 },
          { id: 'nodeC18', text: '\ue663', level: 3 },
          { id: 'nodeC19', text: '\ue663', level: 3 },
          { id: 'nodeC20', text: '\ue663', level: 3 },
          { id: 'nodeC21', text: '\ue663', level: 3 },
          { id: 'nodeC22', text: '\ue663', level: 3 },
          { id: 'nodeC23', text: '\ue663', level: 3 },
          { id: 'nodeC24', text: '\ue663', level: 3 },
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
          // { source: 'nodeA1', target: 'nodeB1' },
          // { source: 'nodeA1', target: 'nodeB2' },

          // { source: 'nodeA2', target: 'nodeB3' },

          // { source: 'nodeB1', target: 'nodeC1' },
          // { source: 'nodeB1', target: 'nodeC2' },

          // { source: 'nodeB2', target: 'nodeC3' },
          // { source: 'nodeB2', target: 'nodeC4' },

          // { source: 'nodeB3', target: 'nodeC5' },
          // { source: 'nodeB3', target: 'nodeC6' },
          // { source: 'nodeB3', target: 'nodeC7' },
          // { source: 'nodeB3', target: 'nodeC8' },

          // { source: 'nodeC1', target: 'nodeD1' },
          // { source: 'nodeC1', target: 'nodeD2' },

          // { source: 'nodeC2', target: 'nodeD3' },
          // { source: 'nodeC2', target: 'nodeD4' },

          // { source: 'nodeC3', target: 'nodeD5' },

          // { source: 'nodeD1', target: 'nodeE1' },
          // { source: 'nodeD1', target: 'nodeE2' },
          // { source: 'nodeD1', target: 'nodeE3' },

          // { source: 'nodeD2', target: 'nodeE4' },

          // { source: 'nodeD4', target: 'nodeE5' }
        ]
      },
      nodeLevelPlugin: [
        { id: 1, name: '交易' },
        { id: 2, name: '应用' },
        { id: 3, name: '服务' },
        { id: 4, name: '进程' },
        { id: 5, name: '主机' }
      ],
      sessionCfg: {
        transparentBg: true,
        renderer: 'canvas',
        // width: width,
        // height: height,
        defaultEdge: {
          type: 'line',
          color: '#000',
          style: {
            stroke: '#0078D7',
            lineAppendWidth: 20,
            // startArrow: true,
            endArrow: {
              // 自定义箭头指向(0, 0)，尾部朝向 x 轴正方向的 path
              path: 'M 0,0 L 8,4 L 8,-4 Z',
              // 箭头的偏移量，负值代表向 x 轴正方向移动
              // d: -10,
              // v3.4.1 后支持各样式属性
              fill: '#0078D7',
              stroke: '#0078D7',
              opacity: 0.8
              // ...
            }
          },
          labelCfg: {
            refY: 10,
            style: {
              fill: '#666',
              fontSize: 12,
              textAlign: 'center'
            },
            autoRotate: true
          }
        },
        nodeStateStyles: {
          hoverNode: {
            stroke: 'purple',
            strokeOpacity: 1
          },
          selected: {
            stroke: 'red',
            strokeOpacity: 1
          },
          active: {
            stroke: 'red',
            strokeOpacity: 1
          },
          warning: {
            stroke: 'red',
          }
        },
        edgeStateStyles: {
          hover: {
            stroke: 'yellow',
            cursor: 'pointer'
          },
          selected: {
            stroke: 'red'
          }
        },
        defaultNode: {
          type: 'iconfontNode',
          fontColor: '#fff',
          style: {
            stroke: '#1AC1FF',
            fill: '#00A8E8'
          },
          labelCfg: {
            style: {
              fill: '#000',
              fontSize: 18
            }
          }
        },
        layout: {
          type: 'level-layout',
          level: 5,
          nodeSpace: 40
          // type: 'dagre',
          // align: 'DL',
          // rankdir: 'BT',
          // ranksep: 20,
          // nodesep: 5,
          // controlPoints: true,
          // workerEnabled: true
        },
        // fitView: true,
        // fitViewPadding: [0, 20, 0, 80],
        modes: {
          default: [
            // 'drag-canvas',
            'drag-node',
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
            // 'hover-node',
            // 'select-edge',
            // 'hover-edge',
            // 'select-node',
            // 'add-edge'
            'contextmenu'
          ],
          move: ['drag-canvas'],
          addEdge: ['add-edge']
        }
      },
      iconMapping: {
        '主机': '\ue60e',
        '进程': '\ue6d8',
        '服务': '\ue663',
        '应用': '\ue650',
        '交易类型': '\ue605'
      },
      levelMapping: {
        '主机': 1,
        '进程': 2,
        '服务': 3,
        '应用': 4,
        '交易类型': 5
      },
      topologyData: [],
      ws: null,
      graph: null
    }
  },
  methods: {
    getData () {
      const route = this.$route
      const { query } = route
      console.log(route)
      axios.getTopologyInfoBySystemId(query.systemId).then(res => {
        console.log(res)
        if (res.data.code === 200) {
          const nodes = res.data.data
          nodes.forEach(node => {
            node.alerts = []
          })
          this.topologyData = nodes
          this.initWebSocket()
        }
      })
    },
    // 初始化websocket
    initWebSocket () {
      const route = this.$route
      const { query } = route
      const url = 'ws://111.231.165.249:8087/ws/topology/ciitem/' + query.systemId
      const ws = new WebSocket(url)
      const me = this
      ws.onopen = () => {
        console.log('拓扑图ws连接成功！')
      }
      ws.onmessage = (event) => {
        let { data } = event
        const nodeList = me.topologyData
        data = data && JSON.parse(data)
        const alertNodes = []
        data.forEach(item => {
          nodeList.forEach(node => {
            // 重置每一个节点告警状态
            const { graph } = me
            const {ciitemId} = node
            if (graph) {
              graph.setItemState(ciitemId, 'warning', false)
            }
            if (ciitemId === item.ciitemId) {
              alertNodes.push(ciitemId)
              node.alerts = item.alertData
            }
          })
        })
        alertNodes.forEach(nodeId => {
          const { graph, topologyData } = me
          // 设置节点为红色
          if (graph) {
            topologyData.forEach(node => {
              if (node.alerts.length > 0) {
                graph.setItemState(nodeId, 'warning', true)
              }
            })
          }
        })
      }
      ws.onclose = () => {
        console.log('拓扑图ws连接关闭！')
        ws.close()
      }
      ws.onerror = () => {
        console.log('拓扑图ws出错了！')
      }

      this.ws = ws
    },
    transfromToGraphData (data) {
      let nodes = []
      let edges = []
      data.forEach(item => {
        // id: 'nodeA1', type: 'iconfontNode', text: '\ue60e'
        let { ciitemId, cigroupName, linkRelationship } = item
        const node = {
          id: ciitemId,
          type: 'iconfontNode',
          text: this.iconMapping[cigroupName],
          level: this.levelMapping[cigroupName],
          businessData: item
        }
        nodes.push(node)

        // edge
        let targets = []
        if (linkRelationship) targets = JSON.parse(linkRelationship)
        console.log(targets)
        targets.forEach(item => {
          let edge = {
            source: ciitemId,
            target: item,
            sourceAnchor: 2,
            targetAnchor: 0
          }
          edges.push(edge)
        })
      })
      return { nodes, edges }
    },
    initGraphListener (graph) {
      if (!graph) return
      graph.on('afteritemstatechange', (item, state, enabled) => {
        if (state !== 'warning' || !enabled) return
        // const group = item.getContainer()
        const model = item.getModel()
        console.log(model)
        // const back1 = group.addShape('circle', {
        //   zIndex: -3,
        //   attrs: {
        //     x: 0,
        //     y: 0,
        //     r,
        //     fill: '#f5222d',
        //     opacity: 0.6
        //   },
        //   // must be assigned in G6 3.3 and later versions. it can be any value you want
        //   name: 'circle-shape1',
        //   draggable: true
        // })
        // // 第一个背景圆逐渐放大，并消失
        // back1.animate({
        //   r: r + 20,
        //   opacity: 0
        // }, {
        //   repeat: true, // 循环
        //   duration: 600,
        //   easing: 'easeCubic',
        //   delay: 0 // 无延迟
        // })
      })
    }
  },
  computed: {
    graphData () {
      const {topologyData, transfromToGraphData} = this
      return transfromToGraphData(topologyData)
    }
  },
  created () {
    this.getData()
  },
  mounted () {
    this.$nextTick(() => {
      const graph = this.$refs.graphEditor
      const instance = graph.getGraphInstance()
      this.graph = instance
      this.initGraphListener(instance)
    })
  },
  components: {
    LinkTopologyTooltip
  },
  activated () {
    console.log('actived: ' + this.$router.route)
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      console.log(vm)
    })
  },
  beforeRouteLeave (to, from, next) {
    console.log('离开了当前路由！')
    const { ws } = this
    if (ws) ws.close()
    next()
  }
}
</script>

<style scoped>
.link-topology {
  flex: 1 1 auto;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
  height: 100%;
  overflow: hidden;
  /* background-color: green; */
}
.level-labels {
  width: 100px;
  min-width: 100px;
  height: 606px;
}
.level-labels .level-label{
  display: flex;
  align-items: center;
  width: 100%;
  height: 20%;
  color: #fff;
  padding: 0 10px;
  box-sizing: border-box;
}
.topology-graph-container {
  flex: 1 1 auto;
  height: 606px;
  /* overflow: hidden; */
}
.editor {
  width: 100%;
  height: 100%;
}
</style>
