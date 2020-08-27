<template>
  <div class="box-wrapper aibms-bg">
    <div class="canvas" id="canvas" @click="handleChart">
      <div v-for="(cluster,index) in clusters" :key="index">
        <el-popover
          placement="right"
          trigger="manual"
          v-model="cluster.isclick">
          <ul class="operation-list">
            <li @click="getCIDetail(cluster.Id)">查看CI项</li>
            <li @click="editCI(cluster.Id)">编辑CI项</li>
            <!-- <li @click="deleteCI(cluster.Id)">删除CI项</li> -->
          </ul>
          <div slot="reference" class="window" :id="cluster.Id" @mouseover.stop="getDetail(cluster)" @mouseleave.stop="leave(cluster)"
            :class="{'houver': cluster.ishouver}" @click.stop="change($event,cluster)"
            :style="{ left: cluster.left + '%', top: cluster.top + '%' }"
            @contextmenu.prevent="doubleRight(cluster)">
            <span>
              <img :src="cluster.icon" v-if="cluster.icon" />
              {{cluster.name}}
            </span>
          </div>
        </el-popover>
      </div>
    </div>

    <div class="progress">
      <span>
        <i class="el-icon-zoom-in" style="font-size: 28px;color: #fff" @click="amplification"></i>
        <!-- <img src="../../../static/img/amplification.png" alt="放大" @click="amplification"> -->
      </span>
      <el-slider
        v-model="sliderValue"
        vertical
        :min=20
        :step='step'
        height="100px">
      </el-slider>
      <span>
        <i class="el-icon-zoom-in" style="font-size: 28px;color: #fff" @click="narrow"></i>
        <!-- <img src="../../../static/img/narrow.png" alt="缩小" @click="narrow"> -->
      </span>
    </div>
  </div>
</template>

<script>
import { jsPlumb } from 'jsplumb'
import $ from '../../../static/js/package/jquery/dist/jquery.js'
import { draw } from '../common/chart.js'
import axios from '@/api';
import Bus from '../common/bus.js'

export default {
  name: 'CIlistcharts',
  data () {
    return {
      tim: 1,
      isshow: true,
      clusters: [],
      connlist: [],
      currentData: {},
      curId: '',
      sliderValue: 50,
      step: 10,
      nodeArr: [],
      connectArr: [],
      curData: {},
      newConnect: []
    }
  },
  props: ['selectOption'],
  created () {
    // let option = {
    //   "citypeId":"",
    //   "dataFrom": "",
    //   "environment":"",
    //   "keyword":"",
    //   "systemId": ""
    // }
    // this.getAllList(option);
  },
  mounted () {
    let option = {
      citypeId: this.selectOption.citypeId,
      dataFrom: this.selectOption.dataFrom,
      environment: this.selectOption.environment,
      keyword: this.selectOption.keyword,
      systemId: this.selectOption.systemId,
      level: this.selectOption.level
    }
    this.clearLine()
    this.getAllList(option)
    // window.addEventListener('mousewheel',this.handleScroll,false)
    let _this = this
    Bus.$on('drawAgin', function (val) {
      let options = {
        citypeId: val.citypeId,
        dataFrom: val.dataFrom,
        environment: val.environment,
        keyword: val.keyword,
        systemId: val.systemId,
        level: val.level
      }
      _this.clearLine()
      _this.getAllList(options)
    })
  },
  watch: {
    sliderValue: {
      handler (val) {
        if (val <= 100 && val > 0) {
          this.zoom(parseFloat((val * 2) / 100).toFixed(1))
        }
      },
      deep: true
    }
  },
  methods: {
    clearLine () {
      $('#canvas').find('.jtk-endpoint').remove()
      $('#canvas').find('.jtk-overlay').remove()
      $('#canvas').find('.jtk-connector').remove()
      $('#canvas').find('svg').remove()
      $('#canvas').empty()
    },
    handleChart () {
      this.clusters.forEach(item => {
        item.isclick = false
      })
    },
    getAllList (option) {
      // this.$emit('clear', false);
      this.clusters = []
      this.connlist = []
      this.nodeArr = []
      this.connectArr = []
      let params = {
        'citypeId': option.citypeId,
        'dataFrom': option.dataFrom,
        'environment': option.environment,
        'keyword': option.keyword,
        'systemId': option.systemId,
        'level': option.level
      }
      this.clearLine()
      let _this = this
      axios.getAllRelation(params).then(result => {
        if (result) {
          let data = result.data.data
          // 获取的数据初步处理为节点和关系
          if (data.length > 0) {
            for (let key of data) {
              this.handleConnect(key)
            }
          }
          // 节点去重
          let temp = []
          let len = this.nodeArr.length
          for (let i = 0; i < len; i++) {
            let tag = true
            for (let y = 0; y < temp.length; y++) {
              if (this.nodeArr[i].Id === temp[y].Id) {
                tag = false
              }
            }
            if (tag) {
              temp.push(this.nodeArr[i])
            }
          }
          // 链接关系去重
          let temp2 = []
          let len2 = this.connectArr.length
          for (let m = 0; m < len2; m++) {
            let flag = true
            for (let n = 0; n < temp2.length; n++) {
              if (this.connectArr[m].startNode === temp2[n].startNode) {
                if (Array.isArray(this.connectArr[m].endNode[0])) {
                  let node = [].concat(this.connectArr[m].endNode[0])
                  temp2[n].endNode = [...new Set(node.concat(temp2[n].endNode))]
                } else {
                  temp2[n].endNode = [...new Set(this.connectArr[m].endNode.concat(temp2[n].endNode))]
                }

                flag = false
              }
            }
            if (flag) {
              temp2.push(this.connectArr[m])
            }
          }
          // var result = [], hash = {};

          let arr = []
          temp.forEach(i => {
            arr.push(axios.CiDataDetail(i.Id))
          })
          let nameList = []
          Promise.all(arr).then(res => {
            res.forEach(it => {
              if (it) {
                let data = it.data.data.result
                if (data.name) {
                  nameList.push(data.name)
                }
              } else {
                nameList.push('')
              }
            })
            let newNode = []
            for (let key in temp) {
              temp[key].name = nameList[key]
              newNode.push(temp[key])
            }
            this.clusters = temp
            this.connlist = temp2

            if (this.connlist.length > 0) {
              setTimeout(() => {
                draw(_this.connlist)
              }, 400)
            }
            _this.$emit('clear', true)
          })
        } else {
          this.$notify({
            type: 'error',
            message: '接口请求失败'
          })
        }
      })
    },
    handleConnect (source) {
      this.getConnectSource(source)
    },
    // 递归处理
    getConnectSource (source) {
      if (source.connect && source.connect.length > 0) {
        let single = {
          Id: source.ciitemId,
          name: source.name,
          top: source.top,
          left: source.left,
          label: source.label ? source.label : ' ',
          relation: source.relation ? source.relation : ' ',
          icon: source.icon,
          tag: source.tag ? source.tag : '',
          isclick: false,
          ishouver: false,
          visible: false
        }
        this.nodeArr.push(single)
        for (let sin of source.connect) {
          if (sin.tag) {
            let connectRelation = {
              startNode: '',
              endNode: [],
              label: sin.label,
              relation: sin.relation
            }
            if (sin.ciitemId != source.ciitemId) {
              if (sin.tag === 'up') {
                connectRelation.startNode = sin.ciitemId
                connectRelation.endNode.push(source.ciitemId)
              } else if (sin.tag === 'down') {
                connectRelation.startNode = source.ciitemId
                connectRelation.endNode.push(sin.ciitemId)
              }
              this.connectArr.push(connectRelation)
              this.getConnectSource(sin)
            }
          }
        }
      } else {
        let single = {
          Id: source.ciitemId,
          name: source.name,
          top: source.top,
          left: source.left,
          label: source.label ? source.label : ' ',
          relation: source.relation ? source.relation : ' ',
          icon: source.icon,
          tag: source.tag ? source.tag : '',
          isclick: false,
          ishouver: false,
          visible: false
        }
        this.nodeArr.push(single)
      }
    },
    // 删除
    // deleteCI (id) {
    //   checkdelCiDelete(id).then(res => {
    //     if (res) {
    //       if (res.data.code === 200) {
    //         this.$confirm('确认删除?', '提示', {
    //           confirmButtonText: '确定',
    //           cancelButtonText: '取消',
    //           type: 'warning'
    //         })
    //           .then(() => {
    //             this.deleteCI(id);
    //           })
    //           .catch(() => {
    //             this.$notify({
    //               type: 'info',
    //               message: '已取消删除'
    //             });
    //           });
    //       } else if (res.data.code === 500) {
    //         this.$confirm(res.data.message, '提示', {
    //           confirmButtonText: '确定',
    //           cancelButtonText: '取消',
    //           type: 'warning'
    //         })
    //           .then(() => {
    //             this.deleteCI(id);
    //           })
    //           .catch(() => {
    //             this.$notify({
    //               type: 'info',
    //               message: '已取消删除'
    //             });
    //           });
    //       }
    //     } else {
    //       this.$notify({
    //         type: 'error',
    //         message: '接口请求失败'
    //       });
    //     }
    //   });
    // },

    // 删除
    deleteCI (id) {
      axios.CiDataDelete(id).then(res => {
        if (res) {
          if (res.data.code === 200) {
            this.$notify({
              type: 'success',
              message: '删除成功!'
            })
            this.clearLine()
            this.getAllList(this.curData)
          } else {
            this.$notify({
              title: '提示',
              message: res.data.message,
              type: 'warning'
            })
          }
        } else {
          this.$notify({
            type: 'error',
            message: '接口请求失败'
          })
        }
      })
    },

    // 详情
    getCIDetail (id) {
      this.curId = id
      this.$router.push({
        path: '/ResourceAllocation/CIlistData/toview?code=2',
        query: { ciitemId: id }
      })
    },
    // 拖动
    change (e, cluster) {
      let canvas = document.getElementById('canvas')
      let topoItem = document.getElementById(cluster.Id)
      let left = parseFloat(parseInt(topoItem.style.left) / canvas.offsetWidth * 100).toFixed(1)
      let top = parseFloat(parseInt(topoItem.style.top) / canvas.offsetHeight * 100).toFixed(1)
      axios.CiDataDetail(cluster.Id).then(res => {
        if (res) {
          if (res.data.success) {
            let data = res.data.data.result

            // let rel = JSON.parse(data.relation);
            // rel.connect.forEach(item => {
            //   if()
            // })
            let obj = {
              top: top,
              left: left,
              ciitemId: cluster.Id,
              label: cluster.label,
              relation: cluster.relation,
              icon: cluster.icon,
              tag: cluster.tag,
              name: data.name
            }

            axios.changeLocation(cluster.Id, obj).then(res => {
              // console.log(res);
            })
          }
        } else {
          this.$notify({
            type: 'error',
            message: '接口请求失败'
          })
        }
      })
    },
    // 编辑
    editCI (id) {
      this.curId = id
      this.$router.push({
        path: '/ResourceAllocation/CIlistData/edit?code=2',
        query: { ciitemId: id }
      })
    },
    zoom (scale) {
      $('#canvas').css({
        '-webkit-transform': `scale(${scale})`,
        '-moz-transform': `scale(${scale})`,
        '-ms-transform': `scale(${scale})`,
        '-o-transform': `scale(${scale})`,
        'transform': `scale(${scale})`
      })
      jsPlumb.setZoom(0.5)
    },
    // 放大
    amplification () {
      let count
      this.tim += 0.2
      if (this.tim >= 2.0) {
        count = 2.0
        this.tim = 2.0
        this.sliderValue = 100
      } else {
        this.sliderValue = (this.tim * 100 / 2)
        count = this.tim
      }
      this.zoom(count)
    },
    // 缩小
    narrow () {
      let count
      this.tim -= 0.2
      if (this.tim <= 0.4) {
        this.sliderValue = 20
        count = 0.4
        this.tim = 0.4
      } else {
        this.sliderValue = this.tim * 100 / 2
        count = this.tim
      }
      this.zoom(count)
    },
    // handleScroll(e){
    //     e = e || window.event;
    //     if (e.wheelDelta) {  //判断浏览器IE，谷歌滑轮事件
    //         if (e.wheelDelta > 0) { //当滑轮向上滚动时
    //             this.narrow();
    //         }
    //         if (e.wheelDelta < 0) { //当滑轮向下滚动时
    //             this.amplification();
    //         }
    //     } else if (e.detail) {  //Firefox滑轮事件
    //         if (e.detail> 0) { //当滑轮向上滚动时
    //             this.narrow();
    //         }
    //         if (e.detail< 0) { //当滑轮向下滚动时
    //             this.amplification();
    //         }
    //     }
    // },
    getDetail (value) {
      value.ishouver = true
    },
    leave (value) {
      value.ishouver = false
    },
    doubleRight (val) {
      if (this.chartType != 'ciitem') {
        this.clusters.forEach(item => {
          if (item.Id === val.Id) {
            item.isclick = true
          } else {
            item.isclick = false
          }
        })
        val.ishouver = true
        val.visible = !val.visible
      }
    },
    hiddenTip () {
      this.isshow = true
    }
  }
}
</script>

<style scoped>
.box-wrapper{
  width: 100%;
  height: 600px;
  overflow: hidden;
  margin: 0 auto;
  position: relative;
  background-color: #fff;
}
.canvas {
  width: 100%;
  height: 100%;
  position: relative;
}
.canvas .window {
    border: 1px solid #346789;
    /* box-shadow: 2px 2px 19px #aaa;
    -o-box-shadow: 2px 2px 19px #aaa;
    -webkit-box-shadow: 2px 2px 19px #aaa;
    -moz-box-shadow: 2px 2px 19px #aaa; */
    -moz-border-radius: 50%;
    border-radius: 50%;
    opacity: 0.8;
    filter: alpha(opacity=80);
    text-align: center;
    position: absolute;
    color: black;
    font-family: helvetica;
    font-size: 0.7em;
    line-height: 30px;
    width: 70px !important;
    height: 70px !important;
}
.canvas .window:hover {
    box-shadow: 2px 2px 19px #444;
    -o-box-shadow: 2px 2px 19px #444;
    -webkit-box-shadow: 2px 2px 19px #444;
    -moz-box-shadow: 2px 2px 19px #444;
    opacity: 0.6;
    filter: alpha(opacity=60);
}
.canvas .window span{
  width: 70px;
  height: 70px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.canvas .window span img{
  width: 26px;
  height: 26px;
}
.canvas .active {
    border: 1px dotted green;
}
.canvas .hover {
    border: 1px dotted red;
}

.canvas .aLabel{
  color: blue;
  font-size: 14px;
  background-color: #fff;
}
.dragHover{
  background-color: #ccc;
  box-shadow: 0 0 5px coral;
}
.progress{
  position: absolute;
  width: 30px;
  height: 60px;
  right: 20px;
  top: 50%;
  font-size: 14px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
}
.progress span img{
  width: 26px;
  height: 26px;
  cursor: pointer;
}
.houver{
  border: 2px solid red !important;
  box-shadow: 0 0 10px #FF6347 !important;
}
.click{
  background-color:rgb(226, 137, 137) !important;
  box-shadow: 0 0 10px rgb(216, 84, 84) !important;
}
.clickIt{
  /* border-radius: 50%;
  border: 1px solid #358deb; */
  /* box-shadow: 0 0 20px #358deb; */
  background-color: #358deb !important;
  opacity: 0.5 !important;
}
.operation-list{
  padding: 0;
  margin: 0;
}
.operation-list li{
  list-style: none;
    line-height: 36px;
    padding: 0 40px;
    margin: 0;
    font-size: 14px;
    color: #606266;
    cursor: pointer;
    outline: none;
}
.operation-list li:hover{
  background-color: #358deb;
  color: #fff;
  border-radius: 3px;
}
.el-popover{
  padding: 0;
}
</style>
