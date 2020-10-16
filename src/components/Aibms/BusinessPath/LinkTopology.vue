<template>
  <div class="link-topology">
    <!-- <p style="height: 48px;line-height: 48px;background-color: #fff;padding: 0 20px;">链路拓扑</p> -->
    <!-- <div>
      <el-input placeholder="请输入内容" v-model="blackListValue" class="input-with-select">
        <el-select v-model="blackListType" slot="prepend" placeholder="请选择类型" style="width: 120px;">
          <el-option label="交易类型" value="1"></el-option>
          <el-option label="应用" value="2"></el-option>
          <el-option label="服务" value="3"></el-option>
          <el-option label="进程" value="4"></el-option>
          <el-option label="主机" value="5"></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="addBlackList"></el-button>
      </el-input>
    </div> -->
    <div class="link-topology-wrapper">
      <div class="level-labels">
        <div :class="['level-label', { noData: levelCount[5] === 0 }]">
          <p class="level-label-text"><i class="iconfont icon-jiaoyi"></i> 交易类型</p>
          <p><i class="iconfont icon-bianzu"></i></p>
        </div>
        <div :class="['level-label', { noData: levelCount[4] === 0 }]">
          <p class="level-label-text"><i class="iconfont icon-yingyong"></i> 应用</p>
          <p><i class="iconfont icon-bianzu"></i></p>
        </div>
        <div :class="['level-label', { noData: levelCount[3] === 0 }]">
          <p class="level-label-text"><i class="iconfont icon-quanqiu"></i> 服务</p>
          <p><i class="iconfont icon-bianzu"></i></p>
        </div>
        <div :class="['level-label', { noData: levelCount[2] === 0 }]">
          <p class="level-label-text"><i class="iconfont icon-jincheng"></i> 进程</p>
          <p><i class="iconfont icon-bianzu"></i></p>
        </div>
        <div :class="['level-label', { noData: levelCount[1] === 0 }]">
          <p class="level-label-text"><i class="iconfont icon-yunzhuji"></i> 主机</p>
          <p><i class="iconfont icon-bianzu"></i></p>
        </div>
      </div>
      <div class="topology-graph-container">
        <div class="bgs">
          <div v-for="item in 5" :key="item" class="level-bg"></div>
        </div>
        <graph-editor :data="graphData" :sessionCfg="sessionCfg" :mouseCfg="mouseCfg" class="editor" ref="graphEditor">
          <template v-slot:tooltip="tooltip">
            <link-topology-tooltip :alerts="tooltip.editorInfo"></link-topology-tooltip>
          </template>
        </graph-editor>
      </div>
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
import config from '@/config/index.js'
export default {
  data () {
    return {
      levelCount: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0
      },
      blackListType: 1,
      blackListValue: '',
      mouseCfg: {zoom: true, move: {x: true, y: false}},
      tempData: {
        // 点集
        nodes: [
          // 主机
          { id: 'nodeA1', text: '\ue60e', level: 1, status: 's3' },
          { id: 'nodeA2', text: '\ue60e', level: 1 },
          // 进程
          { id: 'nodeB1', text: '\ue6d8', level: 2 },
          { id: 'nodeB2', text: '\ue6d8', level: 2 },
          { id: 'nodeB3', text: '\ue6d8', level: 2 },
          // 服务
          { id: 'nodeC1', text: '\ue663', level: 3, status: 's3' },
          { id: 'nodeC2', text: '\ue663', level: 3 },
          { id: 'nodeC3', text: '\ue663', level: 3 },
          { id: 'nodeC4', text: '\ue663', level: 3 },
          { id: 'nodeC5', text: '\ue663', level: 3 },
          { id: 'nodeC6', text: '\ue663', level: 3 },
          { id: 'nodeC7', text: '\ue663', level: 3 },
          { id: 'nodeC8', text: '\ue663', level: 3 },
          { id: 'nodeC9', text: '\ue663', level: 3, status: 's3' },
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
          { id: 'nodeE5', text: '\ue605', level: 5, status: 's1' }
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
          { source: 'nodeB3', target: 'nodeC9' },
          { source: 'nodeB3', target: 'nodeC10' },
          { source: 'nodeB3', target: 'nodeC11' },
          { source: 'nodeB3', target: 'nodeC12' },
          { source: 'nodeB3', target: 'nodeC13' },
          { source: 'nodeB3', target: 'nodeC14' },
          { source: 'nodeB3', target: 'nodeC15' },
          { source: 'nodeB3', target: 'nodeC16' },
          { source: 'nodeB3', target: 'nodeC17' },
          { source: 'nodeB3', target: 'nodeC18' },
          { source: 'nodeB3', target: 'nodeC19' },
          { source: 'nodeB3', target: 'nodeC20' },
          { source: 'nodeB3', target: 'nodeC21' },
          { source: 'nodeB3', target: 'nodeC22' },
          { source: 'nodeB3', target: 'nodeC23' },
          { source: 'nodeB3', target: 'nodeC24' },

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
          type: 'cubic-vertical',
          color: '#000',
          style: {
            stroke: '#666',
            lineAppendWidth: 20,
            // startArrow: true,
            endArrow: true
            // endArrow: {
            //   // 自定义箭头指向(0, 0)，尾部朝向 x 轴正方向的 path
            //   path: 'M 0,0 L 8,4 L 8,-4 Z',
            //   // 箭头的偏移量，负值代表向 x 轴正方向移动
            //   // d: -10,
            //   // v3.4.1 后支持各样式属性
            //   fill: '#0078D7',
            //   stroke: '#0078D7',
            //   opacity: 0.8
            //   // ...
            // }
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
          hover: {
            stroke: '#1890ff',
            lineWidth: 2,
            strokeOpacity: 1
          },
          selected: {
            stroke: '#1890ff',
            strokeOpacity: 1
          },
          active: {
            stroke: 'red',
            strokeOpacity: 1
          },
          warning: {
            fill: 'orange',
            fontColor: '#fff',
            'iconfont-icon': { fill: '#fff' }
          },
          error: { fill: 'red', fontColor: '#fff' }
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
          fontColor: '#ddd',
          r: 12,
          fontSize: 12,
          style: {
            stroke: '#ddd',
            lineWidth: 1,
            fill: '#4c4c4c'
          },
          colors: {
            s1: { fill: '#ff0000', fontColor: '#fff' },
            s2: { fill: '#ff9900', fontColor: '#fff' },
            s3: { fill: '#ffcc00', fontColor: '#fff' },
            s4: { fill: '#ffff00', fontColor: '#fff' },
            s5: { fill: '#ffff88', fontColor: '#fff' }
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
          nodeSpace: (node, count) => {
            const base = 6
            const baseCount = 30
            const delta = baseCount / count
            return delta > 1 ? delta * base * 3 : base
          }
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
            // 'drag-node',
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
      colorMap: {
        '1': '#ff0000',
        '2': '#ff9900',
        '3': '#ffcc00',
        '4': '#ffff00',
        '5': '#ffff88'
      },
      topologyData: [],
      ws: null,
      graph: null
    }
  },
  methods: {
    addBlackList () {
      let value = this.blackListValue
      const type = this.blackListType
      const systemId = this.$route.query.systemId
      if (!value || value === '') {
        this.$notify({
          title: '提示',
          message: '黑名单不能为空',
          type: 'error'
        })
        return
      } else {
        value = value.split(',')
        value.forEach((val, index) => {
          value[index] = val.trim()
          // val = val.trim()
        })
      }
      console.log(value)
      axios.getEditSystemList({
        type,
        blackList: value
      }, systemId).then(res => {
        console.log(res)
      })
    },
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
      const url = config.wsTopology + query.systemId
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
            // 挂载告警数据
            if (ciitemId === item.ciitemId) {
              alertNodes.push(ciitemId)
              node.alerts = item.alertData
              node.status = item.level ? `s${item.level}` : 's1'
            }
          })
        })
        const temp = JSON.parse(JSON.stringify(nodeList))
        let normalNodes = temp.filter(node => node.alerts.length === 0)
        let warningNodes = temp.filter(node => node.alerts.length > 0)
        me.topologyData = warningNodes.concat(normalNodes)

        // })
        // const { graph, topologyData } = me
        // 设置节点为红色
        // if (graph) {
        //   topologyData.forEach(node => {
        //     if (node.alerts.length > 0) {
        //       graph.setItemState(node.ciitemId, 'warning', true)
        //     }
        //   })
        // }
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
        let { ciitemId, cigroupName, linkRelationship, status } = item
        const level = this.levelMapping[cigroupName]
        this.levelCount[level]++
        const node = {
          id: ciitemId,
          type: 'iconfontNode',
          text: this.iconMapping[cigroupName],
          level: level,
          businessData: item,
          status
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
      graph.on('node:click', e => {
        console.log('test event: ', e)
        const state = 'selected'
        const item = e.item
        const { graph } = this

        // 置空已经选择的节点状态
        const nodes = graph.getNodes()
        const edges = graph.getEdges()
        // const prevHighlightNode = this.prevHighlightNode
        // if (prevHighlightNode) {

        // }
        console.log(nodes)
        // reset highlight nodes and edges
        nodes.forEach(node => {
          graph.setItemState(node, state, false)
        })
        edges.forEach(edge => {
          this.clearEdgeAnimate(edge)
        })

        graph.setItemState(item, state, true)

        if (item.hasState(state)) {
          graph.setItemState(item, state, true)
          this.setHighlightItem(item, true, graph)
        }
        // if (item.hasState(state)) {
        //   graph.setItemState(item, state, false)
        //   this.setHighlightItem(item, false, graph)
        // } else {
        //   graph.setItemState(item, state, true)
        //   this.setHighlightItem(item, true, graph)
        // }
      })
    },
    setHighlightItem (item, highlight, graph) {
      const isNode = item.getType() === 'node'
      if (isNode) {
        const edges = item.getInEdges()
        edges.forEach(edge => {
          this.setEdgeAnimate(edge, highlight)
          const source = edge.getSource()
          graph.setItemState(source, 'selected', highlight)
          this.setHighlightItem(source, highlight, graph)
        })
      }
    },
    setEdgeAnimate (edge, animate) {
      const lineDash = [4, 2, 1, 2]
      const group = edge.getContainer()
      const shape = group.get('children')[0]
      let index = 0;
      // Define the animation
      if (animate) {
        shape.animate(
          () => {
            index++;
            if (index > 9) {
              index = 0
            }
            const res = {
              stroke: '#1890ff',
              lineDash,
              lineDashOffset: -index
            }
            // returns the modified configurations here, lineDash and lineDashOffset here
            return res
          },
          {
            repeat: true, // whether executes the animation repeatly
            duration: 3000 // the duration for executing once
          }
        )
      } else {
        this.clearEdgeAnimate(edge)
      }
    },
    clearEdgeAnimate (edge) {
      const group = edge.getContainer()
      const shape = group.get('children')[0]
      shape.stopAnimate()
      // 清空 lineDash
      shape.attr('lineDash', null)
      shape.attr('stroke', '#666')
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
  /* flex: 1 1 auto;
  display: flex;
  flex-direction: row;
  justify-content: space-around; */
  width: 100%;
  height: 100%;
  /* overflow: hidden; */
  /* background-color: green; */
}
.link-topology-wrapper {
  flex: 1 1 auto;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
  height: 100%;
}
.level-labels {
  width: 140px;
  min-width: 100px;
  height: 806px;
}
.level-labels .level-label{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 20%;
  color: #cbcbcb;
  padding: 0 10px;
  box-sizing: border-box;
}
.level-label:nth-child(odd) {
  background-color: #242424;
}
.level-label:nth-child(even) {
  background-color: #353535;
}
.level-label-text {
  width: 100%;
  text-align-last: left;
  margin-bottom: 6px;
  padding-left: 10px;
}
.topology-graph-container {
  flex: 1 1 auto;
  height: 806px;
  /* overflow: hidden; */

  position: relative;
}
.editor {
  width: 100%;
  height: 100%;
}
.bgs {
  position: absolute;
  top: 0;
  left: 0;

  width: 100%;
  height: 100%;
}
.level-bg {
  width: 100%;
  height: 20%;
}
.level-bg:nth-child(odd) {
  background-color: #242424;
}
.level-bg:nth-child(even) {
  background-color: #353535;
}
.level-labels .noData {
  color: #797979 !important;
}
</style>
