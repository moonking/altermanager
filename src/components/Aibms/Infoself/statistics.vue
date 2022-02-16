<template>
  <div class="aia-content">

  <el-row>
          <el-select class="w366" v-model="sourceForm.source" @change="changetime">
            <el-option v-for="item in sourcedata"
                    :key="item.id"
                    :label="item.label"
                    :value="item.value"
                    >
            </el-option>
          </el-select>
</el-row>
<el-row class="chart-wrap">
    <el-row>
          <div class="schart-box" v-show="altersum.length !=  0">
          <div class="schart" ref="altersum"></div>
           <!-- <div class="content-title">告警通知汇总（来源）</div> -->

           <!-- <schart class="schart" canvasId="pie" :data="altersum" type="pie" :options="altersumOptions"></schart> -->
           </div>

       <div class="schart-box special-charts" v-show="levelsum.length !=  0">
       <div class="schart" ref="levelsum"></div>
<!--       <div class="content-title">告警通知汇总（级别）</div> -->
          <!-- <schart class="schart" canvasId="ring" :data="levelsum" type="ring" :options="levelsumOptions"></schart> -->
       </div>
      </el-row>
      <el-row>
       <div class="schart-box" v-if="prometheusdata01.length != 0" >
        <div class="schart" ref="prometheusdata01"></div>
           <!-- <div class="content-title">Prometheus</div> -->
           <!-- <schart class="schart" canvasId="prometheusdata01" :data="prometheusdata01" type="pie" :options="Prometheus01" ></schart> -->
       </div>
       <div class="schart-box" v-if="prometheusdata02.length != 0">
       <!-- <div class="content-title">Prometheus</div> -->
       <div class="schart" ref="prometheusdata02"></div>
       <!-- <schart class="schart" canvasId="prometheusdata02" :data="prometheusdata02" type="ring" :options="Prometheus02"></schart> -->
       </div>
      </el-row>
      </el-row>
      <el-row class="chart-wrap">
    <el-row>
       <div class="schart-box" v-if="dtdata01.length != 0">
       <div class="schart" ref="dtdata01"></div>
           <!-- <div class="content-title">DT</div> -->
           <!-- <schart class="schart" canvasId="dtdata01" :data="dtdata01" type="pie" :options="Dt01"></schart> -->
       </div>
       <div class="schart-box"v-if="dtdata02.length != 0">
       <div class="schart" ref="dtdata02"></div>
       <!-- <div class="content-title">DT</div> -->
       <!-- <schart class="schart" canvasId="dtdata02" :data="dtdata02" type="ring" :options="Dt02"></schart> -->
       </div>
      </el-row>
      <el-row>
       <div class="schart-box" v-if="splunkdata01.length != 0">
       <div class="schart" ref="splunkdata01"></div>
           <!-- <div class="content-title">Splunk</div> -->
           <!-- <schart class="schart" canvasId="splunkdata01" :data="splunkdata01" type="pie" :options="splunk01"></schart> -->
       </div>
       <div class="schart-box" v-if="splunkdata02.length != 0">
       <!-- <div class="content-title">Splunk</div> -->
       <div class="schart" ref="splunkdata02"></div>
       <!-- <schart class="schart" canvasId="splunkdata02" :data="splunkdata02" type="ring" :options="splunk02"></schart> -->
       </div>
       </el-row>
       </el-row>
      <el-row>

       <div class="schart-box" v-if="bpcdata01.length != 0">
           <!-- <div class="content-title">Splunk</div> -->
           <div class="schart" ref="bpcdata01"></div>
           <!-- <schart class="schart" canvasId="bpcdata01" :data="bpcdata01" type="pie" :options="bpc01"></schart> -->
       </div>
       <div class="schart-box" v-if="bpcdata02.length != 0">
       <div class="schart" ref="bpcdata02"></div>
       <!-- <div class="content-title">Splunk</div> -->
       <!-- <schart class="schart" canvasId="bpcdata02" :data="bpcdata02" type="ring" :options="bpc02"></schart> -->
       </div>
      </el-row>
      </div>
</div>
</template>

<script>
import axios from '@/api'
import Schart from 'vue-schart'
export default {
  components: {
    Schart
  },
  data: () => ({
    levelsum: [
      // { name: 'Error', value: 1141 },
      // { name: 'Warning', value: 1499 },
      // { name: 'Information', value: 2260 }
    ],
    altersum: [
      // { name: 'Prometheus', value: 1141 },
      // { name: 'DT', value: 1499 },
      // { name: 'BPC', value: 2260 },
      // { name: 'Splunk', value: 1170 },
      // { name: 'ARMS', value: 970 }
    ],

    prometheusdata01: [],

    prometheusdata02: [],
    // Prometheus01: {
    //   title: 'Prometheus 告警分类汇总Top5',
    //   autoWidth: true, // 设置宽高自适应
    //   showValue: true,
    //   bgColor: '#203a48',
    //   titleColor: '#ffffff',
    //   fillColor: '#ffff7f',
    //   contentColor: '#5555ff',
    //   yEqual: 5
    // },
    dtdata01: [],
    dtdata02: [],
    splunkdata01: [],
    splunkdata02: [],
    bpcdata01: [],
    bpcdata02: [],

    Prometheus01: {
      title: 'Prometheus 告警分类汇总Top5',
      bgColor: 'rgba(255,255,255,0)',
      titleColor: '#ffffff',
      legendColor: '#ffffff',
      radius: 120,
      colorList: ['#5500ff', '#00aa7f', '#55ffff', '#00aaff', '#ffaa00']
    },

    Prometheus02: {
      title: 'Prometheus 告警对象汇总Top5',
      bgColor: 'rgba(255,255,255,0)',
      titleColor: '#ffffff',
      legendColor: '#b0ddff',
      radius: 120,
      innerRadius: 80,
      colorList: ['#ff0000', '#ffff00', '#00ff00']
    },
    Dt01: {
      title: 'DT 告警分类汇总Top5',
      bgColor: 'rgba(255,255,255,0)',
      titleColor: '#ffffff',
      legendColor: '#ffffff',
      radius: 120,
      colorList: ['#5500ff', '#00aa7f', '#55ffff', '#00aaff', '#ffaa00']
    },

    Dt02: {
      title: 'DT 告警对象汇总Top5',
      bgColor: 'rgba(255,255,255,0)',
      titleColor: '#ffffff',
      legendColor: '#b0ddff',
      radius: 120,
      innerRadius: 80,
      colorList: ['#ff0000', '#ffff00', '#00ff00']
    },

    splunk01: {
      title: 'Splunk 告警分类汇总Top5',
      bgColor: 'rgba(255,255,255,0)',
      titleColor: '#ffffff',
      legendColor: '#ffffff',
      radius: 120,
      colorList: ['#5500ff', '#00aa7f', '#55ffff', '#00aaff', '#ffaa00']
    },

    splunk02: {
      title: 'Splunk 告警对象汇总Top5',
      bgColor: 'rgba(255,255,255,0)',
      titleColor: '#ffffff',
      legendColor: '#b0ddff',
      radius: 120,
      innerRadius: 80,
      colorList: ['#ff0000', '#ffff00', '#00ff00']
    },

    bpc01: {
      title: 'BPC 告警分类汇总Top5',
      bgColor: 'rgba(255,255,255,0)',
      titleColor: '#ffffff',
      legendColor: '#ffffff',
      radius: 120,
      colorList: ['#5500ff', '#00aa7f', '#55ffff', '#00aaff', '#ffaa00']
    },

    bpc02: {
      title: 'BPC 告警对象汇总Top5',
      bgColor: 'rgba(255,255,255,0)',
      titleColor: '#ffffff',
      legendColor: '#b0ddff',
      radius: 120,
      innerRadius: 80,
      colorList: ['#ff0000', '#ffff00', '#00ff00']
    },

    altersumOptions: {
      title: '告警通知汇总（来源）',
      bgColor: 'rgba(255,255,255,0)',
      titleColor: '#DAF8FF',
      legendColor: '#ffffff',
      radius: 120,
      colorList: ['#5500ff', '#00aa7f', '#55ffff', '#00aaff', '#ffaa00']
    },
    levelsumOptions: {
      title: '告警通知汇总（级别）',
      bgColor: 'rgba(255,255,255,0)',
      titleColor: '#ffffff',
      legendColor: '#b0ddff',
      radius: 120,
      innerRadius: 80,
      colorList: ['#00ff7f', '#ffff00', '#ff0000']
    },
    sourcedata: [
      {
        value: 1,
        label: '最近24小时'
      }, {
        value: 7,
        label: '最近7天'
      }, {

        value: 30,
        label: '最近1个月'
      }
    ],
    ruleForm: {
      source: [
        {
          required: true, message: '请您选择告警来源', trigger: 'change'}]
    },
    sourceForm: {
      source: 1
    },

    datatest: [
      {
        name: 'host1',
        value: 1000
      },
      {
        name: 'host2',
        value: 999
      },
      {
        name: 'host3',
        value: 1005
      }
    ]

  }),
  created() {
    // console.log(this.datatest.sort(function(a,b){return a.value - b.value}))
    this.getSumdata(this.sourceForm.source)
  },
  methods: {

    changetime() {
      console.log(this.sourceForm.source)
      this.getSumdata(this.sourceForm.source)
    },
    // 排序返回指定数目的从大到小
    sortValue(data, num) {
      const result = data.sort(function(a, b) { return b.value - a.value })
      if (result.length > num) {
        return result.slice(0, num)
      } else {
        return result
      }
    },
    getEchartsOptions(data) {
      return {
        color: data.color,
        title: {
          text: data.title,
          padding: [17, 40],
          textStyle: {
            fontSize: 32,
            color: '#DAF8FF'
          }
        },
        legend: {
          y: 580,
          icon: 'circle',
          textStyle: {
            color: '#EDF9FB',
            fontSize: 20
          }
        },
        series: [
          {
            name: data.title,
            type: 'pie', // 设置图表类型为饼图
            radius: '55%', // 饼图的半径，外半径为可视区尺寸（容器高宽中较小一项）的 55% 长度。
            data: data.data,
            label: {
              formatter: '{c} ({d}%)',
              color: '#BFF3FF'
            },
            labelLine: {
              lineStyle: {
                color: '#BFF3FF'
              }
            }
          }
        ]
      }
    },
    // 查询统计数据 ,param :time  单位为天 （1天为1 ）

    getSumdata(time) {
      axios.getSumData(time).then(res => {
        if (res.data.success) {
          console.log(res.data)
          let altersum = []
          let levelsum = []
          let prometheusdata01 = []
          let prometheusdata02 = []
          let dtdata01 = []
          let dtdata02 = []
          let splunkdata01 = []
          let splunkdata02 = []
          let bpcdata01 = []
          let bpcdata02 = []
          res.data.data.forEach(function(data, index) {
            altersum.push({name: data.name, value: Number(data.total)})

            if (data.name == 'Prometheus') {
              data.category.forEach(function(data, index) {
                prometheusdata01.push({name: data.name, value: Number(data.value)})
              })
              data.object.forEach(function(data, index) {
                prometheusdata02.push({name: data.name, value: Number(data.value)})
              })
            }

            if (data.name == 'Dynatrace') {
              data.category.forEach(function(data, index) {
                dtdata01.push({name: data.name, value: Number(data.value)})
              })
              data.object.forEach(function(data, index) {
                dtdata02.push({name: data.name, value: Number(data.value)})
              })
            }

            if (data.name == 'BPC') {
              data.category.forEach(function(data, index) {
                bpcdata01.push({name: data.name, value: Number(data.value)})
              })
              data.object.forEach(function(data, index) {
                bpcdata02.push({name: data.name, value: Number(data.value)})
              })
            }

            if (data.name == 'Splunk') {
              data.category.forEach(function(data, index) {
                splunkdata01.push({name: data.name, value: Number(data.value)})
              })
              data.object.forEach(function(data, index) {
                splunkdata02.push({name: data.name, value: Number(data.value)})
              })
            }
          })
          this.altersum = altersum
          this.prometheusdata01 = this.sortValue(prometheusdata01, 5)
          this.prometheusdata02 = this.sortValue(prometheusdata02, 5)
          this.dtdata01 = this.sortValue(dtdata01, 5)
          this.dtdata02 = this.sortValue(dtdata02, 5)
          this.splunkdata01 = this.sortValue(splunkdata01, 5)
          this.splunkdata02 = this.sortValue(splunkdata02, 5)
          this.bpcdata01 = this.sortValue(bpcdata01, 5)
          this.bpcdata02 = this.sortValue(bpcdata02, 5)

          let myChart = this.$echarts.init(this.$refs.altersum)
          let colorArray = ['#00E5FF', '#4D80D9', '#1D2452 ', '#4AB3D3', '#304074']
          // 如果需要修改颜色，替换该处的颜色值
          myChart.setOption(
            this.getEchartsOptions({
              color: colorArray,
              title: '告警通知汇总（来源）',
              data: this.altersum
            })
          )

          let myChart3 = null
          this.$nextTick(() => {
            if (this.$refs.prometheusdata01) {
              myChart3 = this.$echarts.init(this.$refs.prometheusdata01)
              myChart3.setOption(
                this.getEchartsOptions({
                  color: colorArray,
                  title: 'Prometheus 告警分类汇总Top5',
                  data: this.prometheusdata01
                })
              )
            }
          })
          let myChart4 = null
          this.$nextTick(() => {
            if (this.$refs.prometheusdata02) {
              myChart4 = this.$echarts.init(this.$refs.prometheusdata02)

              myChart4.setOption(
                this.getEchartsOptions({
                  color: colorArray,
                  title: 'Prometheus 告警对象汇总Top5',
                  data: this.prometheusdata02
                })
              )
            }
          })
          let myChart5 = null
          this.$nextTick(() => {
            if (this.$refs.dtdata01) {
              myChart5 = this.$echarts.init(this.$refs.dtdata01)

              myChart5.setOption(
                this.getEchartsOptions({
                  color: colorArray,
                  title: 'DT 告警分类汇总Top5',
                  data: this.dtdata01
                })
              )
            }
          })
          let myChart6 = null
          this.$nextTick(() => {
            if (this.$refs.dtdata02) {
              myChart6 = this.$echarts.init(this.$refs.dtdata02)

              myChart6.setOption(
                this.getEchartsOptions({
                  color: colorArray,
                  title: 'DT 告警对象汇总Top5',
                  data: this.dtdata02
                })
              )
            }
          })
          let myChart7 = null
          this.$nextTick(() => {
            if (this.$refs.splunkdata01) {
              myChart7 = this.$echarts.init(this.$refs.splunkdata01)

              myChart7.setOption(
                this.getEchartsOptions({
                  color: colorArray,
                  title: 'Splunk 告警分类汇总Top5',
                  data: this.splunkdata01
                })
              )
            }
          })
          let myChart8 = null
          this.$nextTick(() => {
            if (this.$refs.splunkdata02) {
              myChart8 = this.$echarts.init(this.$refs.splunkdata02)

              myChart8.setOption(
                this.getEchartsOptions({
                  color: colorArray,
                  title: 'Splunk 告警对象汇总Top5',
                  data: this.splunkdata02
                })
              )
            }
          })
          let myChart9 = null
          this.$nextTick(() => {
            if (this.$refs.bpcdata01) {
              myChart9 = this.$echarts.init(this.$refs.bpcdata01)

              myChart9.setOption(
                this.getEchartsOptions({
                  color: colorArray,
                  title: 'BPC 告警分类汇总Top5',
                  data: this.bpcdata01
                })
              )
            }
          })
          let myChart10 = null
          this.$nextTick(() => {
            if (this.$refs.bpcdata02) {
              myChart10 = this.$echarts.init(this.$refs.bpcdata02)

              myChart10.setOption(
                this.getEchartsOptions({
                  color: colorArray,
                  title: 'BPC 告警对象汇总Top5',
                  data: this.bpcdata02
                })
              )
            }
          })
        }
      })

      axios.getleveSumData(time).then(res => {
        let levelsum = []
        if (res.data.success) {
          console.log(res.data)
          res.data.data.level && res.data.data.level.forEach(function(data, index) {
            levelsum.push({name: data.name, value: Number(data.value)})
          })
        }
        this.levelsum = levelsum
        let myChart2 = this.$echarts.init(this.$refs.levelsum)
        let chartsData2 = this.levelsum.reduce((acc, cur) => {
          console.log(cur.value, 88888)
          return acc + (+cur.value)
        }, 0)
        myChart2.setOption({
          ...this.getEchartsOptions({
            color: [{
              type: 'linear',
              x: 0.5,
              y: 0.5,
              r: 0.5,
              colorStops: [{
                offset: 0, color: '#064368' // 0% 处的颜色
              }, {
                offset: 1, color: '#022037' // 100% 处的颜色
              }],
              global: false // 缺省为 false
            },
            '#304074', '#08E3F6', 'transparent'],
            title: '告警通知汇总（级别）'
          }),
          label: {
            color: '#DAF8FF',
            borderColor: '#DAF8FF'
          },
          series: [
            {
              name: '告警通知汇总（级别）',
              type: 'pie', // 设置图表类型为饼图
              startAngle: 230,
              radius: ['35%', '60%'], // 饼图的半径，外半径为可视区尺寸（容器高宽中较小一项）的 55% 长度。
              data: [...this.levelsum, {
                value: chartsData2 * 0.3,
                name: '',
                tooltip: {formatter: function(a) { return '' }},
                itemStyle: {color: 'transparent'},
                label: {
                  show: false
                },
                labelLine: {
                  show: false
                }
              }],
              label: {
                formatter: '{c} ({d}%)',
                color: '#BFF3FF'
              },
              labelLine: {
                lineStyle: {
                  color: '#BFF3FF'
                }
              }
            }
          ]
        })
      })
    }

  }
}
</script>

<style lang="scss" scoped>
.aia-content {
  position: relative;
  width: 100%;
  height: 94%;
  padding: 10px 10px;
  box-sizing: border-box;
  .search-type {
    .el-button {
      border: 1px solid #436382;
      color: #fff;
      &:link {
        border: 1px solid #436382;
        color: #fff;
      }
      &:visited {
        border: 1px solid #436382;
        color: #fff;
        background-color: transparent !important;
      }
      &:hover {
        background-color: #041c25;
        border: 1px solid #01aef1;
        color: #01aef1;
      }
      &:active {
        border: 1px solid #436382;
        color: #fff;
      }
    }
  }
  .task-btn-box {
    text-align: center;
    .el-link {
      color: #fff;
    }
    // span {
    //   display: inline-block;
    //   background: #fff;
    //   border: 1px solid #0066ff;
    //   line-height: 24px;
    //   padding: 0 4px;
    //   border-radius: 5px;
    //   color: #0066ff;
    //   font-size: 14px;
    //   margin-right: 12px;
    //   cursor: pointer;
    //   margin: 5px 0;
    //   &:hover {
    //     background: #0066ff;
    //   }
    //   &:active {
    //     background: #0066ff;
    //     color: #fff;
    //   }
    // }
  }
  .blank-page {
    .img-content {
      height: 200px;
      padding-top: 15px;
    }
    .empty-text {
      font-size: 18px;
      height: 30px;
      line-height: 30px;
      margin-top: -30px;
      margin-bottom: 10px;
      color: #fff;
    }
  }
}
.special-charts{
  position: relative;
  &:after{
    content: '';
    position: absolute;
    top:240px;
    left: 250px;
    width: 160px;
    height: 160px;
    border-radius: 50%;
    background: radial-gradient(#243C84,#041138);
  }
}
</style>
<!-- <style scoped>
.search-bar {
  display: flex;
  justify-content: space-between;
}
.search-inline-form {
  flex: 1;
}
.search-inline-btn {
  width: 100px;
}
.white-space {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style> -->
<style scoped>
.schart-box{
    display: inline-block;
    margin: 18px;
}
    .schart{
        width: 660px;
        height: 640px;
        background: url("~@/assets/static-bg.png") no-repeat;
        background-size: contain;
    }
    .content-title{
        clear: both;
        font-weight: 400;
        line-height: 50px;
        margin: 10px 0;
        font-size: 22px;
        color: #1f2f3d;
        text-align: center;
    }
.chart-wrap{
  display: flex;
  flex-wrap: wrap;
}
</style>
