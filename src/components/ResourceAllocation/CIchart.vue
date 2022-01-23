<template>
  <div class="box-wrapper deep-aibms-color-bg">
    <div class="canvas" id="canvas" @click="clearAll">
      <div v-for="(cluster,index) in clusters" :key="index">
        <el-popover
          placement="right"
          trigger="manual"
          v-model="cluster.isclick">
          <ul class="operation-list">
            <li @click="editType(currentId)" v-if="chartType == 'citype' && nodeTypeId != cluster.Id">编辑CI类型关系</li>
            <li @click="editCI(currentId)" v-if="chartType == 'ciitem' || chartType == 'createCI' || chartType == 'editChart'">编辑CI项关系</li>

            <li @click="deleteCI(currentId)" v-if="cluster.Id != nodeTypeId && chartType != 'citype'">删除CI项关系</li>
            <li @click="deleteCI(currentId)" v-if="chartType == 'citype' && cluster.Id != nodeTypeId">删除CI类型关系</li>
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
  </div>
</template>

<script>
import { jsPlumb } from 'jsplumb'
import $ from '../../../static/js/package/jquery/dist/jquery.js'
import { draw } from '../common/chart.js'
import Bus from '../common/bus.js'
import axios from '@/api';
export default {
  name: 'charts',
  data () {
    return {
      tim: 1,
      isshow: true,
      clusters: [],
      connlist: [],
      currentData: {},
      curId: '',
      currentId: ''
    }
  },
  props: ['nodeTypeId', 'chartType'],
  watch: {
    chartType: {
      handler (val) {
        if (val == 'citype') {
          this.getTypeRelationList(this.nodeTypeId)
        } else if (val == 'ciitem') {
          this.createCiRelation(this.nodeTypeId)
        } else if (val == 'createCI') {
          this.createCiRelation(this.nodeTypeId)
        } else if (val == 'editChart') {
          if (this.nodeTypeId) {
            this.createCiRelation(this.nodeTypeId)
          } else {
            this.createCiRelation(this.curId)
          }
        }
      },
      immediate: true
    }
  },
  created () {

  },
  mounted () {
    let _this = this
    Bus.$on('getNewSource', function (val) {
      $('#canvas').find('.jtk-endpoint').remove()
      $('#canvas').find('.jtk-overlay').remove()
      $('#canvas').find('.jtk-connector').remove()
      $('#canvas').find('svg').remove()
      _this.getTypeRelationList(val)
    })

    Bus.$on('createCI', function (id) {
      $('#canvas').find('.jtk-endpoint').remove()
      $('#canvas').find('.jtk-overlay').remove()
      $('#canvas').find('.jtk-connector').remove()
      $('#canvas').find('svg').remove()
      _this.createCiRelation(id)
    })

    Bus.$on('editCIitem', function (id) {
      $('#canvas').find('.jtk-endpoint').remove()
      $('#canvas').find('.jtk-overlay').remove()
      $('#canvas').find('.jtk-connector').remove()
      $('#canvas').find('svg').remove()
      _this.createCiRelation(id)
    })
    // window.addEventListener('mousewheel',this.handleScroll,false)
  },
  destroyed () {
    Bus.$off('getNewSource')
    Bus.$off('createCI')
    Bus.$off('editCIitem')
    Bus.$off('deleteCi')
  },
  methods: {
    clearAll () {
      Bus.$emit('clear')
      this.clusters.forEach(item => {
        item.isclick = false
      })
    },
    editType (id) {
      this.$emit('editType', id)
      this.clusters.forEach(item => {
        item.isclick = false
      })
    },
    change (e, cluster) {
      let canvas = document.getElementById('canvas')
      let topoItem = document.getElementById(cluster.Id)
      let arr = Object.keys(this.currentData)
      if (this.chartType == 'citype') {
        if (arr.length > 0) {
          if (cluster.Id == this.currentData.citypeId) {
            this.currentData.left = parseInt(topoItem.style.left) / canvas.offsetWidth * 100
            this.currentData.top = parseInt(topoItem.style.top) / canvas.offsetHeight * 100
          } else {
            this.currentData.connect.forEach(item => {
              if (item.citypeId == cluster.Id) {
                item.left = parseInt(topoItem.style.left) / canvas.offsetWidth * 100
                item.top = parseInt(topoItem.style.top) / canvas.offsetHeight * 100
              }
            })
          }
          axios.editCItypeRelation(this.currentData).then(result => {
            if (result.data.success) {
              // console.log(result);
            }
          })
        }
      } else {
        if (arr.length > 0) {
          if (cluster.Id == this.currentData.ciitemId) {
            this.currentData.left = parseInt(topoItem.style.left) / canvas.offsetWidth * 100
            this.currentData.top = parseInt(topoItem.style.top) / canvas.offsetHeight * 100
          } else {
            this.currentData.connect.forEach(item => {
              if (item.ciitemId == cluster.Id) {
                item.left = parseInt(topoItem.style.left) / canvas.offsetWidth * 100
                item.top = parseInt(topoItem.style.top) / canvas.offsetHeight * 100
              }
            })
          }
          axios.CiDataDetail(this.currentData.ciitemId).then(res => {
            if (res.data.success) {
              let data = res.data.data.result
              let params = {
                'ciitemId': data.ciitemId,
                'name': data.name,
                'relation': this.currentData
              }
              axios.CiDataEdit(this.currentData.ciitemId, params).then(result => {
                if (result.data.success) {
                  // console.log("位置修改成功！")
                }
              })
            }
          })
        }
      }
    },
    // 删除CI
    deleteCI (id) {
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.clusters.forEach(item => {
            item.isclick = false
          })
          if (this.chartType == 'citype') {
            this.$confirm('此次删除将会影响CI类型关系，是否确认删除？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
              .then(() => {
                let idx
                if (this.currentData) {
                  if (this.currentData.connect) {
                    let count = 0
                    for (let i in this.currentData.connect) {
                      if (this.currentData.connect[i].citypeId == id) {
                        idx = i
                        count += 1
                      }
                    }

                    if (count > 0) {
                      axios.ciTypeDetail(this.currentData.citypeId).then(res => {
                        if (res.data.success) {
                          let newData = res.data.data.result
                          this.currentData.connect.splice(idx, 1)
                          let params = {
                            'citypeId': this.currentData.citypeId,
                            'icon': this.currentData.icon,
                            'name': newData.name,
                            'relation': this.currentData
                          }
                          axios.updateCiTypeDetail(params, this.currentData.citypeId).then(result => {
                            if (result.data.success) {
                              Bus.$emit('deletetype', id)
                              $('#canvas').find('.jtk-endpoint').remove()
                              $('#canvas').find('.jtk-overlay').remove()
                              $('#canvas').find('.jtk-connector').remove()
                              $('#canvas').find('svg').remove()
                              this.getTypeRelationList(this.currentData.citypeId)
                              this.deleteConnectType(id, this.currentData.citypeId)
                              this.$notify({
                                type: 'success',
                                message: '删除成功!'
                              })
                            } else {
                              this.$notify({
                                type: 'error',
                                message: '删除失败!'
                              })
                            }
                          })
                        }
                      })
                    }
                  }
                }
              }).catch(e => {
                this.$notify({
                  message: '取消删除!'
                })
              })
          } else {
            let idx
            for (let key in this.currentData.connect) {
              if (this.currentData.connect[key].ciitemId == id) {
                idx = key
              }
            }
            axios.CiDataDetail(this.currentData.ciitemId).then(res => {
              if (res.data.success) {
                let newData = res.data.data.result
                this.currentData.connect.splice(idx, 1)
                let params = {
                  'ciitemId': this.currentData.ciitemId,
                  'name': newData.name,
                  'relation': this.currentData
                }
                axios.CiDataEdit(this.currentData.ciitemId, params).then(result => {
                  if (result.data.success) {
                    Bus.$emit('deleteCi', this.currentData.ciitemId)
                    $('#canvas').find('.jtk-endpoint').remove()
                    $('#canvas').find('.jtk-overlay').remove()
                    $('#canvas').find('.jtk-connector').remove()
                    $('#canvas').find('svg').remove()
                    this.deleteConnectCI(id, this.currentData.ciitemId)
                    this.createCiRelation(this.currentData.ciitemId)
                    this.$notify({
                      type: 'success',
                      message: '删除成功!'
                    })
                  }
                })
              }
            })
          }
        })
    },

    // 删除关联项
    deleteConnectType (deleteId, currentId) {
      axios.ciTypeDetail(deleteId).then(res => {
        if (res) {
          if (res.data.success) {
            let curData = res.data.data.result
            if (curData.relation) {
              let data = JSON.parse(curData.relation)
              if (data.connect) {
                let count = 0
                let idx
                for (let key in data.connect) {
                  if (data.connect[key].citypeId == currentId) {
                    idx = key
                    count += 1
                  }
                }

                if (count > 0) {
                  data.connect.splice(idx, 1)
                  let params = {
                    'cigroupId': '',
                    'citypeId': deleteId,
                    'createDate': '',
                    'delFlag': '',
                    'extend': '',
                    'icon': curData.icon,
                    'name': curData.name,
                    'relation': data,
                    'remarks': '',
                    'sort': 0,
                    'templateId': '',
                    'updateDate': ''
                  }
                  axios.updateCiTypeDetail(params, deleteId).then(result => {
                    if (result.data.success) {
                      // console.log("关联关系删除")
                    }
                  })
                }
              }
            }
          }
        } else {
          this.$notify({
            type: 'error',
            message: '接口请求失败'
          })
        }
      })
    },

    // 删除CI项的关联项
    deleteConnectCI (deleteId, currentId) {
      axios.CiDataDetail(deleteId).then(res => {
        if (res) {
          if (res.data.success) {
            let curData = res.data.data.result
            if (curData.relation) {
              let data = JSON.parse(curData.relation)
              // let connect = JSON.parse(data).connect;
              if (data.connect) {
                let count = 0
                let idx
                for (let i in data.connect) {
                  if (data.connect[i].ciitemId == currentId) {
                    count += 1
                    idx = i
                  }
                }
                if (count > 0) {
                  data.connect.splice(idx, 1)
                  let params = {
                    'ciitemId': deleteId,
                    'icon': curData.icon,
                    'name': curData.name,
                    'relation': data
                  }

                  axios.CiDataEdit(deleteId, params).then(result => {
                    if (result.data.success) {
                      // console.log('相关项关系删除')
                    }
                  })
                }
              }
            }
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
      this.$emit('createCI', id)
      this.$emit('editCI', id)
    },
    // 获取类型连接关系
    getTypeRelationList (citypeId) {
      this.connlist = []
      this.clusters = []
      let curNode = {}
      axios.ciTypeDetail(citypeId).then(result => {
        if (result) {
          let param = result.data.data.result
          if (param.relation) {
            let conn = JSON.parse(param.relation)
            this.currentData = conn
            if (conn) {
              curNode = {
                top: conn.top,
                left: conn.left,
                name: param.name,
                Id: conn.citypeId,
                icon: conn.icon,
                isclick: false,
                ishouver: false,
                visible: false
              }
              this.clusters.push(curNode)
              if (conn.connect) {
                let arr = []
                conn.connect.forEach(item => {
                  arr.push(axios.ciTypeDetail(item.citypeId))
                })

                Promise.all(arr).then(res => {
                  let nameList = []
                  res.forEach(type => {
                    if (type) {
                      if (type.data.success) {
                        let data = type.data.data.result
                        nameList.push(data.name)
                      }
                    } else {
                      nameList.push('')
                    }
                  })

                  for (let key in conn.connect) {
                    let node = {
                      top: conn.connect[key].top,
                      left: conn.connect[key].left,
                      name: nameList[key],
                      Id: conn.connect[key].citypeId,
                      icon: conn.connect[key].icon,
                      isclick: false,
                      ishouver: false,
                      visible: false
                    }
                    this.clusters.push(node)
                    let expConn = {
                      startNode: '',
                      endNode: [],
                      label: conn.connect[key].label,
                      relation: conn.connect[key].relation
                    }
                    if (conn.connect[key].tag == 'up') {
                      expConn.startNode = conn.connect[key].citypeId
                      expConn.endNode.push(conn.citypeId)
                    } else if (conn.connect[key].tag == 'down') {
                      expConn.startNode = conn.citypeId
                      expConn.endNode.push(conn.connect[key].citypeId)
                    }
                    this.connlist.push(expConn)
                  }
                  setTimeout(() => {
                    draw(this.connlist)
                  }, 400)
                })
              }
            }
          } else {
            curNode = {
              top: 44,
              left: 50,
              name: param.name,
              Id: param.citypeId,
              icon: param.icon,
              isclick: false,
              ishouver: false,
              visible: false
            }
            this.clusters.push(curNode)
            setTimeout(() => {
              draw(this.connlist)
            }, 400)
          }
        } else {
          this.$notify({
            type: 'error',
            message: '接口请求失败'
          })
        }
      })
    },

    // 新增ci
    createCiRelation (ciitemId) {
      this.clusters = []
      this.connlist = []
      // console.log(ciitemId);
      axios.CiDataDetail(ciitemId).then(result => {
        if (result) {
          let data = result.data.data.result
          let curNode = {}

          if (data.relation) {
            let conn = JSON.parse(data.relation)
            this.currentData = conn
            if (conn.left && conn.top) {
              curNode = {
                top: conn.top,
                left: conn.left,
                name: data.name,
                Id: data.ciitemId,
                icon: data.icon,
                isclick: false,
                ishouver: false,
                visible: false
              }
            }
            this.clusters.push(curNode)
            if (conn.connect) {
              let arr = []
              conn.connect.forEach(item => {
                arr.push(axios.CiDataDetail(item.ciitemId))
              })

              Promise.all(arr).then(res => {
                let nameList = []
                res.forEach(ci => {
                  if (ci.data.success) {
                    let data = ci.data.data.result
                    nameList.push(data.name)
                  }
                })
                for (let key in conn.connect) {
                  let node = {
                    top: conn.connect[key].top,
                    left: conn.connect[key].left,
                    name: nameList[key],
                    Id: conn.connect[key].ciitemId,
                    icon: conn.connect[key].icon,
                    isclick: false,
                    ishouver: false,
                    visible: false
                  }
                  this.clusters.push(node)

                  let relationoption = {
                    startNode: '',
                    endNode: [],
                    label: conn.connect[key].label,
                    relation: conn.connect[key].relation
                  }
                  if (conn.connect[key].tag == 'up') {
                    relationoption.startNode = conn.connect[key].ciitemId
                    relationoption.endNode.push(conn.ciitemId)
                  } else {
                    relationoption.startNode = conn.ciitemId
                    relationoption.endNode.push(conn.connect[key].ciitemId)
                  }
                  this.connlist.push(relationoption)
                }
                setTimeout(() => {
                  draw(this.connlist)
                }, 400)
              })
            }
          } else {
            curNode = {
              top: 44,
              left: 50,
              name: data.name,
              Id: data.ciitemId,
              icon: data.icon,
              isclick: false,
              ishouver: false,
              visible: false
            }
            this.clusters.push(curNode)
            setTimeout(() => {
              draw(this.connlist)
            }, 400)
          }
        } else {
          this.$notify({
            type: 'error',
            message: '接口请求失败'
          })
        }
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
      this.tim += 0.1
      if (this.tim >= 2.0) {
        count = 2.0
        this.tim = 2.0
      } else {
        count = this.tim
      }
      this.zoom(count)
    },
    // 缩小
    narrow () {
      let count
      this.tim -= 0.1
      if (this.tim <= 0.4) {
        count = 0.4
        this.tim = 0.4
      } else {
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
      if (value.Id == this.nodeTypeId) {
        value.ishouver = false
      } else {
        value.ishouver = true
      }
    },
    leave (value) {
      value.ishouver = false
    },
    doubleRight (val) {
      this.currentId = val.Id
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
      if (val.Id == this.nodeTypeId) {
        this.clusters.forEach(item => {
          if (item.Id === val.Id) {
            item.isclick = true
          } else {
            item.isclick = false
          }
        })
        val.ishouver = false
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
  height: 550px;
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
    border: 1px solid #436382;
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
    color: #fff;
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
  top: 50px;
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
