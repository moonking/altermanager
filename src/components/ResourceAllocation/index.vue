<template>
  <div class="bg aibms-color-bg">
    <ul class="topBox clear-fix">
      <li>
        <img src="../../../static/img/ci/top6.png" alt srcset />
        <span>CI类型</span>
        <p>{{cigGroupNum}}</p>
      </li>
      <li>
        <img src="../../../static/img/ci/top7.png" alt srcset />
        <span>业务组</span>
        <p>{{systemNum}}</p>
      </li>
      <li>
        <img src="../../../static/img/ci/top8.png" alt srcset />
        <span>关系</span>
        <p>{{cirelationNum}}</p>
      </li>
      <li>
        <img src="../../../static/img/ci/top9.png" alt srcset />
        <span>CI项</span>
        <p>{{citypeNum}}</p>
      </li>
      <!-- <li>
        <img src="../../../static/img/ci/top10.png" alt srcset />
        <span>凭证</span>
        <p>{{configNum}}</p>
      </li> -->
    </ul>
    <!-- 快捷入口 -->
    <div class="quickentry aibms-color-bg">
      <!-- <div class="top">
        <span></span>快捷入口
      </div>-->
      <div class="item-block-title otherState">
        <div class="item-block-title-mark"></div>
        <span class="item-block-title-font">快捷入口</span>
      </div>
      <ul>
        <li>
          <router-link to="/ResourceAllocation/CIlistData?code=1">
            <a>CI列表</a>
          </router-link>
        </li>
        <li>
          <router-link to="/ResourceAllocation/creatci?code=1">
            <a>创建CI项</a>
          </router-link>
        </li>
        <li>
          <router-link to="/ResourceAllocation/manage_ciType?code=1">
            <a>管理CI类型</a>
          </router-link>
        </li>
        <li>
          <router-link to="/ResourceAllocation/CIType?code=1">
            <a>编辑CI类型</a>
          </router-link>
        </li>
        <!-- <li>
          <router-link to="/ResourceAllocation/Configuration?code=1">
            <a>凭证管理</a>
          </router-link>
        </li> -->
        <li>
          <router-link to="/ResourceAllocation/OtherConfiguration?code=1">
            <a>业务系统</a>
          </router-link>
        </li>
        <li>
          <router-link to="/ResourceAllocation/CIrelationship?code=1">
            <a>CI关系</a>
          </router-link>
        </li>
        <!-- <li>
          <router-link to="/ResourceAllocation/Template?code=1">
            <a>模块管理</a>
          </router-link>
        </li> -->
      </ul>
    </div>
    <!-- CI项录入统计 -->
    <el-row :gutter="20" style="padding:0 10px">
      <el-col :span="8">
        <div class="grid-content bg-purple spansty aibms-color-bg" style="height:248px">
          <!-- <div class="top" style="padding-top:12px">
           <span></span>CI项录入统计
          </div>-->
          <div class="item-block-title">
            <div class="item-block-title-mark"></div>
            <span class="item-block-title-font">CI项录入统计</span>
          </div>
          <el-row>
            <el-col :span="24">
              <div class="bg-purple white-color" style="background-color:transparent">
                <p class="recordstyle">记录统计</p>
                <ul class="recode">
                  <!-- <li>
                    <span class="circle"></span>
                    <span style="cirtitle">导入Excel</span>
                    <span class="recodeNum white-color">{{manuallyAdd}}条记录</span>
                  </li> -->
                  <!-- <li>
                    <span>导入CSV</span>
                    <span class="recodeNum">66条记录</span>
                  </li>-->
                  <li>
                    <span class="circle"></span>
                    <span style="cirtitle">服务器获取</span>
                    <span class="recodeNum white-color">{{serverFetch}}条记录</span>
                  </li>
                  <li>
                    <span class="circle"></span>
                    <span style="cirtitle">手动输入</span>
                    <span class="recodeNum white-color">{{importData}}条记录</span>
                  </li>
                </ul>
              </div>
            </el-col>
            <!-- <el-col :span="12">
              <div id="main3" style="width:200px;height:200px;margin-bottom:20px"></div>
            </el-col>-->
          </el-row>
        </div>
      </el-col>
      <el-col :span="16">
        <div class="bg-purple-light grid-content aibms-color-bg" style="width:100%;overflow-y: auto;">
          <!-- <div class="top">
            <span></span>近期操作记录
          </div>-->
          <div class="item-block-title">
            <div class="item-block-title-mark"></div>
            <span class="item-block-title-font">近期操作记录</span>
          </div>
          <el-row>
            <el-col :span="24">
              <div class="bg-purple aibms-color-bg aibms-table">
                <!-- <el-table :data="OperationLogListData" style="width: 100%;font-size:0.6rem;">
                  <el-table-column prop="userName" label="操作人"></el-table-column>
                  <el-table-column prop="logname" label="操作内容"></el-table-column>
                  <el-table-column prop="createtime" label="操作时间"></el-table-column>
                </el-table>-->
                <table class="table table-bordered" style="width:100%">
                  <thead>
                    <tr>
                      <td style="width:20%">操作人</td>
                      <td>操作内容</td>
                      <td style="width:30%">时间</td>
                    </tr>
                  </thead>
                  <tbody style="text-align: left">
                    <tr
                      v-for="(person,index) in OperationLogListData"
                      :key="index"
                      style="text-align: left"
                    >
                      <td contenteditable="true" readonly="22" onselectstart="return false">
                        {{person.userName}}
                        <!-- <input type="text" disabled v-model="person.userName"> -->
                      </td>
                      <td
                        contenteditable="true"
                        style="text-align: center"
                        onselectstart="return false"
                        disabled
                      >
                        {{person.logname}}
                        <!-- <input type="text" disabled v-model="person.logname"> -->
                      </td>
                      <td contenteditable="true" disabled onselectstart="return false">
                        {{person.createtime}}
                        <!-- <input type="text" disabled v-model="person.createtime"> -->
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <!-- 分系统的主机统计 -->
    <el-row :gutter="20" style="margin-top:25px;padding:0 10px">
      <el-col :span="13">
        <div class="grid-content bg-purple spansty aibms-color-bg" style="height:302px">
          <!-- <div class="top" style="padding-top:10px">
           <span></span>分系统的主机统计
          </div>-->
          <div class="item-block-title">
            <div class="item-block-title-mark"></div>
            <span class="item-block-title-font">分系统的主机统计</span>
          </div>
          <el-row>
            <!-- 分系统的主机统计 -->
            <el-col :span="14">
              <div class="bg-purple" style="color: #ffffff;font-size:0.8rem;padding-left:30px;background: transparent">
                <div id="main" style="width:280px;height:280px;margin-bottom:20px"></div>
              </div>
            </el-col>
            <el-col :span="10">
              <div class="bg-purple" style="background: transparent;color: #fff">
                <ul class="statisticalNum">
                  <li v-for="(item,index) in ciGroupBySysdata" :key="index" class="chart">
                    <!-- background:#dd3d3c -->
                    <span
                      style="display:inline-block; border-radius: 100%;width: 8px;height: 8px;background:#dd3d3c;"
                    ></span>
                    <span>{{item.currentColumn}}</span>
                    <span style="display:inline-block;float:right" class="chartnum">{{item.number}}</span>
                  </li>
                </ul>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="11">
        <div class="grid-content bg-purple-light aibms-color-bg" style="height:320px">
          <!-- <div class="top">
           <span></span>CI类型配置的CI项
          </div>-->
          <div class="item-block-title">
            <div class="item-block-title-mark"></div>
            <span class="item-block-title-font">CI类型配置的CI项</span>
          </div>
          <div
            id="main1"
            style="height:250px;width:100%;margin-bottom:0 0 10px 50px,background: none"
          ></div>
        </div>
      </el-col>
    </el-row>

    <!-- 系统总览 -->
    <!-- <el-row :gutter="20">
      <el-col :span="24">
        <div class="grid-content bg-purple-light">
          <div class="top">
            <img src="../../../static/img/ci/icontitle.png" alt srcset>
            <i>系统总览</i>
          </div>
          <div id="main2" style="height:300px;width:100%;"></div>
        </div>
      </el-col>
    </el-row>-->
  </div>
</template>

<script>
import echarts from 'echarts'
import axios from '@/api';
// 导入chart组件
export default {
  beforeRouteEnter (to, from, next) {
    // const allowList = JSON.parse(localStorage.getItem('allowList'));
    // if(allowList.indexOf('/ResourceAllocation') === -1) {
    //   console.log('ssss')
    //   next('/Unauthorized')
    //   return
    // }
    next()
  },
  data () {
    return {
      topResultData: '',
      cigGroupNum: '',
      systemNum: '',
      cirelationNum: '',
      citypeNum: '',
      configNum: '',
      OperationLogListData: '',
      manuallyAdd: '',
      importData: '',
      serverFetch: '',
      ciGroupBySysName: [],
      options: '',
      ciGroupBySysdata: '',
      ciGroupByCitypeData: '',
      ciTypedataAxis: [],
      CIchartdata: []
    }
  },
  mounted () {
    this.getTopResultData()
    this.getOperationLogListData()
    this.getCiGroupBydata()
    this.getHostData()

    this.getciGroupByCitypeData()
  },
  // created() {
  //   this.getTopResultData();
  //   this.getOperationLogListData();
  //   this.getCiGroupBydata();
  //   this.getHostData();

  //   this.getciGroupByCitypeData();
  // },
  methods: {
    // 获取顶部统计数量
    getTopResultData () {
      axios.getTopResult().then(res => {
        if (res.data.code == 200) {
          this.cigGroupNum = res.data.data[0].cigGroupNum
          this.systemNum = res.data.data[1].systemNum
          this.cirelationNum = res.data.data[2].cirelationNum
          this.citypeNum = res.data.data[3].citypeNum
          this.configNum = res.data.data[4].configNum
        } else {
          this.$notify({
            title: '提示',
            message: res.data.message,
            type: 'warning'
          })
        }
      })
    },
    // 获取操作记录
    getOperationLogListData () {
      axios.getOperationLogList().then(res => {
        if (res.data.code == 200) {
          this.OperationLogListData = res.data.data
        } else {
          this.$notify({
            title: '提示',
            message: res.data.message,
            type: 'warning'
          })
        }
      })
    },
    // CI录入统计
    getCiGroupBydata () {
      axios.getCiGroupBydata().then(res => {
        if (res.data.code == 200) {
          if (res.data.data[0]) {
            this.importData = res.data.data[0].number
          } else {
            this.importData = '0'
          }
          if (res.data.data[2]) {
            this.serverFetch = res.data.data[2].number
          } else {
            this.serverFetch = '0'
          }
          if (res.data.data[1]) {
            this.manuallyAdd = res.data.data[1].number
          } else {
            this.manuallyAdd = '0'
          }
        } else {
          this.$notify({
            title: '提示',
            message: res.data.message,
            type: 'warning'
          })
        }
      })
    },
    // 分系统的主机统计
    getHostData () {
      var newoptions = []
      axios.getciGroupBySysdata()
        .then(res => {
          if (res.data.code == 200) {
            this.options = res.data.data

            if (res.data.data.length > 5) {
              this.ciGroupBySysdata = this.options.slice(0, 5)
            } else {
              this.ciGroupBySysdata = res.data.data
            }
            this.area = this.options.map(v => {
              this.ciGroupBySysName.push(v.currentColumn)
              var newoption = {
                value: parseInt(v.number),
                name: v.currentColumn
              }
              newoptions.push(newoption)
            })

            this.options = newoptions
            let dd = {
              a: this.ciGroupBySysName,
              b: this.options
            }
            return dd
          } else {
            this.$notify({
              title: '提示',
              message: res.data.message,
              type: 'warning'
            })
          }
        })
        .then(res => {
          // console.log(222)
          // console.log(res)
          // console.log(777)
          this.getEchatData(res)
        })
    },
    getEchatData (aa) {
      /* ECharts图表 */
      var i = 0
      var colors = ['#131b3e', 'red']
      var myChart = echarts.init(document.getElementById('main'))
      myChart.setOption({
        color: ['#dd3d3c', '#1cb4ed', '#0da7ff', '#4158fb', '#ec1ef9'],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          x: 'bottom',
          data: aa.a
        },

        calculable: true,
        series: [
          {
            name: '',
            type: 'pie',
            radius: ['55%', '75%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center',
                color: function () {
                  return colors[i++]
                },
                label: {
                  show: false
                },
                labelLine: {
                  show: false
                }
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '10',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: aa.b
          }
        ]
      })
    },
    // CI类型配置的CI项
    getciGroupByCitypeData () {
      axios.getciGroupByCitype()
        .then(res => {
          if (res.data.code == 200) {
            this.ciGroupByCitypeData = res.data.data
            this.area = this.ciGroupByCitypeData.map(v => {
              this.ciTypedataAxis.push(v.currentColumn)
              this.CIchartdata.push(parseInt(v.number))
            })
            let dd = {
              a: this.ciTypedataAxis,
              b: this.CIchartdata
            }
            return dd
          }
        })
        .then(res => {
          this.getCIchartData(res)
        })
    },
    getCIchartData (aa) {
      var myChart = echarts.init(document.getElementById('main1'))
      var dataAxis = aa.a
      var data = aa.b
      // var yMax = 100;
      var dataShadow = []

      myChart.setOption({
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          // name: "CI类型名称",
          data: dataAxis,
          axisLabel: {
            inside: false,
            textStyle: {
              color: '#fff',
              // background: transparent,
              // color: transparent,
              fontSize: '12px'
            }
          },
          axisTick: {
            show: true
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#fff'
            }
          },
          z: 10
        },
        yAxis: {
          axisLine: {
            show: true,
            lineStyle: {
              color: '#fff'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            name: '1111',
            textStyle: {
              color: '#fff'
            }
          }
        },
        dataZoom: [
          {
            type: 'inside'
          }
        ],
        series: [
          {
            // For shadow
            type: 'bar',
            itemStyle: {
              normal: { color: 'rgba(0,0,0,0.05)' }
            },
            barGap: '-100%',
            barCategoryGap: '40%',
            data: dataShadow,
            animation: false
          },
          {
            type: 'bar',
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#3e3be4' },
                  { offset: 0.5, color: '#9f43bd' },
                  { offset: 1, color: '#ff4b95' }
                ])
              },
              emphasis: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#3e3be4' },
                  { offset: 0.5, color: '#9f43bd' },
                  { offset: 1, color: '#ff4b95' }
                ])
              }
            },
            data: data
          }
        ]
      })
    }
    // 系统总览
  }
}
</script>

<style scoped>
.spansty {
  padding-left: 0px !important;
}
.bg {
  margin: 10px;
  padding: 10px 10px 20px 10px;
  background: white;
}
.grid-content img {
  width: 100%;
}
.topBox li {
  float: left;
  display: inline;
  width: 25%;
  position: relative;
}
.topBox li img {
  width: 100%;
}
.topBox li span {
  position: absolute;
  right: 22%;
  top: 30%;
  font-size: 1rem;
  color: #fff;
}
.topBox li p {
  position: absolute;
  right: 25%;
  top: 48%;
  font-size: 1.5rem;
  color: #fff;
}
.quickentry {
  background: white;
  color: #fff;
  font-size: 0.8rem;
  margin-bottom: 25px;
  padding: 0 10px;
}
.top {
  color: #585858;
  font-size: 18px;
  padding: 20px 0 0;
  background-color: #fff;
  zoom: 1;
}
.top span {
  display: inline-block;
  width: 6px;
  border-radius: 10px;
  margin-right: 20px;
  height: 24px;
  background: #0280ff;
  vertical-align: middle;
}
/* .top { */
/* font-size: 0.8rem; */
/* color: #fff; */
/* overflow: hidden; */
/* } */
.top img {
  width: 13px;
  height: 13px;
  float: left;
  padding: 10px;
}
.top i {
  float: left;
  padding: 10px 0 0 0;
}
.quickentry ul {
  padding: 20px;
}
.quickentry ul li {
  font-size: 1rem;
  display: inline-block;
  text-align: center;
  padding: 10px;
  margin-right: 15px;
  margin-bottom: 5px;
  background-color: white;
  border-radius: 4px;
  border: solid 1px #eee;
}
.quickentry ul li a {
  color: #585858;
}
.grid-content {
  /* background-color: #2a2f55; */
  background-color: white;
  border-radius: 6px;
}
.recode li {
  list-style: disc;
  list-style: none;
  margin: 25px 0px 0 10px;
  position: relative;
}
.recode li .recodeNum {
  display: inline-block;
  float: right;
  /* color: #ffffff; */
  color: #585858;
  opacity: 0.6;
  /* position: absolute;
  top: 47%;
  right: 0px; */
}
.el-table th {
  /* background-color: #22274d !important; */
  background-color: #fff;
}
.el-table tr {
  /* background-color: #2a2f55 !important; */
  background-color: #fff;
}
.el-table td {
  border-bottom: none;
}
.el-table tr:hover > td {
  background-color: #22274d !important;
}
.el-table th,
.el-table tr {
  background: red;
}

.yuan {
  width: 190px;
  height: 190px;
  margin: 0 auto;
  box-sizing: border-box;
  padding-top: 20px;
  text-align: center;
  background-color: #131b3e;
  border-radius: 50%;
  position: relative;
}
.yuan_bl1,
.yuan_bl2,
.yuan_bl3,
.yuan_bl4 {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  position: absolute;
  left: 0;
  top: 0;
}
.yuan_bl1,
.yuan_bl2 {
  background: linear-gradient(119deg, #3f3cf4 0%, #19fcff 100%);
}
.yuan_bl3,
.yuan_bl4 {
  background-color: #131b3e;
}
.yuan_bl1,
.yuan_bl3 {
  clip: rect(-150px 150px 300px 0px);
}
.yuan_bl2,
.yuan_bl4 {
  clip: rect(50px 100px 200px 0);
}
.yuan_text {
  width: 150px;
  height: 150px;
  line-height: 150px;
  box-sizing: border-box;
  padding-left: 10px;
  margin: 0 auto;
  color: #fff;
  font-size: 36px;
  font-family: "PingFangSC-Thin", "sans-serif", "STHeitiSC-Light", "微软雅黑",
    "Microsoft YaHei";
  background-color: #2a2f55;
  border-radius: 50%;
  position: relative;
}
.statisticalNum {
  margin-top: 20px;
}
.statisticalNum li {
  padding: 10px;
}
table tr td {
  text-align: center;
  /* border-bottom: 1px solid #151a3c; */
  border-bottom: 1px solid transparent;
  font-size: 0.8rem;
  color: #585858;
  opacity: 0.6;
  padding: 5px 0;
}
.btn-info {
  margin-left: 5px;
}
td:focus {
  outline: none;
}
input {
  background: #2a2f55;
}
input {
  outline: none;
  border: none;
  color: #fff;
}
.el-table th,
.el-table tr {
  background: #2a2f55;
  /* background-color: #fff; */
}
.el-table tr {
  background-color: #2a2f55;
}
.bg-purple {
  color: #585858;
  font-size: 0.8rem;
  padding: 10px;
  /* border-right:1px solid #151a3c; */
  height: 200px;
  background-color: #fff;
  /* background-color: transparent; */
  /* z-index: -9999; */
}
.main1 {
  background-color: #fff;
}
.circle {
  display: inline-block;
  border-radius: 100%;
  width: 8px;
  height: 8px;
  background: #00A8E8;
  margin-right: 10px;
}
.recordstyle {
  font-size: 16px;
  padding-left: 20px;
}
.chart {
  position: relative;
}
.chartnum {
  position: absolute;
  top: 31%;
  right: 10px;
}
.otherState {
  width: 100%;
}
</style>
