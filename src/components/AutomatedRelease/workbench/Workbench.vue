<template>
  <div class="panel">
    <el-row :gutter="24">
      <el-col :span="11">
        <div class="workbench-box">
          <div class="workbench-box_item">
            <div class="workbench-box_title">
              待发布任务
              <button class="cm-btn-more" @click="gotoRelease">查看更多</button>
            </div>
            <ul>
              <li
                class="cursor"
                v-for="(task,index) of taskList"
                :key="index"
                @click="gotoReleaseDetail(task.manageId, task.taskType)"
              >
                <div class="workbench-list_content">{{task.name}}</div>
                <div class="workbench-list_date">{{task.planStartTime}}</div>
              </li>
            </ul>
            <div class="block">
              <el-pagination
                @current-change="handleTaskCurrentChange"
                :current-page="task.current"
                :page-size="pageSize"
                layout="prev, pager, next, total"
                :total="task.total"
                :pager-count="5"
                v-if="task.total"
                style="cursor: pointer;"
              ></el-pagination>
            </div>
          </div>
          <div class="workbench-box_item">
            <div class="workbench-box_title">
              待审批信息
              <button class="cm-btn-more" @click="goExamineAndAprove">查看更多</button>
            </div>
            <ul>
              <li
                class="cursor"
                v-for="(item,index)   in examineList"
                @click="goExamineAndAproveDetail(item)"
                :key="index"
              >
                <div class="workbench-list_content">{{ item.businessName }}</div>
                <div class="workbench-list_date">{{ item.createDate }}</div>
              </li>
            </ul>
            <div class="block">
              <el-pagination
                @current-change="handleCurrentChange"
                :current-page="approve.current"
                :page-size="pageSize"
                layout="prev, pager, next, total"
                :total="approve.total"
                :pager-count="5"
                v-if="approve.total"
                style="cursor: pointer;"
              ></el-pagination>
            </div>
          </div>
          <div class="workbench-box_item">
            <div class="workbench-box_title">
              发布动态
              <button class="cm-btn-more" @click="gotoRelease">查看更多</button>
            </div>
            <ul>
              <li
                class="cursor"
                v-for="(dy,index) of dynamicList"
                :key="index"
                @click="gotoReleaseDetail(dy.manageId, dy.taskType)"
              >
                <div class="workbench-list_content">{{dy.name}}</div>
                <div class="workbench-list_date" v-if="dy.taskStatus === 'SUCCESS'">
                  <img class="bg-img" src="/static/img/icon/execute_success.png" alt />
                  <span class="font-more successState">执行成功</span>
                </div>
                <div class="workbench-list_date" v-if="dy.taskStatus === 'FAILURE'">
                  <img class="bg-img" src="/static/img/icon/execute_error.png" alt />
                  <span class="font errorState">执行失败</span>
                </div>
                <div class="workbench-list_date" v-if="dy.taskStatus === 'building'">
                  <img class="bg-img" src="/static/img/icon/execute_wait.png" alt />
                  <span class="font-more waitState">执行中</span>
                </div>
              </li>
            </ul>
            <div class="block">
              <el-pagination
                @current-change="handleDynamicCurrentChange"
                :current-page="dynamic.current"
                :page-size="pageSize"
                layout="prev, pager, next, total"
                :total="dynamic.total"
                :pager-count="5"
                v-if="dynamic.total"
                style="cursor: pointer;"
              ></el-pagination>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="13">
        <div class="workbench-box">
          <div class="workbench-box_item">
            <div class="workbench-box_title">
              发布统计
              <el-select
                class="workbench-select"
                size="mini"
                @change="getpublishCount"
                v-model="Statistics"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in totalBy"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
            <div class="workbench-box_tchart">
              发布成功率统计
              <el-select
                class="workbench-select"
                size="mini"
                @change="getpublishCount"
                v-model="StatisticsTime"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in totalTime"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
            <div class="workbench-box_chart" id="main"></div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import echarts from 'echarts'
import axios from '@/api';
import moment from 'moment'
export default {
  name: 'Workbench',
  data () {
    return {
      Statistics: '2',
      StatisticsTime: '0',
      examineList: [],
      totalBy: [
        {
          label: '按最长发布时间统计',
          value: '2'
        },
        {
          label: '按最高发布频率统计',
          value: '1'
        },
        {
          label: '按最高发布成功率统计',
          value: '3'
        }
      ],
      totalTime: [
        {
          label: '最近一周',
          value: '0'
        },
        {
          label: '最近半个月',
          value: '1'
        },
        {
          label: '最近一个月',
          value: '2'
        }
      ],
      value: '',
      taskList: [],
      listSearchData: {
        systemId: null,
        jobName: '',
        buildStatus: '',
        tasktype: '',
        date: '',
        current: 1,
        size: 10
      },
      approve: {
        current: 1,
        total: 0
      },
      dynamic: {
        current: 1,
        total: 0
      },
      task: {
        current: 1,
        total: 0
      },
      showChart: false,
      pageSize: 5,
      dynamicList: []
      // 发布状态 NULL 执行中：building 成功：SUCCESS 失败：FAILURE 手动结束：ABORTED
    }
  },
  mounted () {
    this.getpublishCount()
    this.getAuditLogList()
    this.handleTaskCurrentChange(this.task.current)
    this.handleDynamicCurrentChange(this.task.current)
  },
  methods: {
    // 跳转到发布详情页
    gotoReleaseDetail (id, type) {
      if (type === 1) {
        this.$router.push({
          path: '/AutomatedRelease/BuildReleaseTask/read',
          query: {
            code: 3,
            id: id
          }
        })
      } else {
        this.$router.push({
          path: '/AutomatedRelease/DeployReleaseTask/read',
          query: {
            code: 3,
            id: id
          }
        })
      }
    },
    // 跳转到发布列表页
    gotoRelease () {
      this.$router.push({
        path: '/AutomatedRelease/releaseTasklist',
        query: {
          code: 3
        }
      })
    },
    handleTaskCurrentChange (page) {
      this.task.current = page
      let params = {
        current: this.task.current,
        size: this.pageSize,
        pageState: 1 // 1代表的是待发布  2代表的是发布动态
      }
      this.getTaskDynamicInfo(params)
    },
    handleCurrentChange (page) {
      this.approve.current = page
      this.getAuditLogList()
    },
    handleDynamicCurrentChange (page) {
      this.dynamic.current = page
      let params = {
        current: this.dynamic.current,
        size: this.pageSize,
        pageState: 2 // 1代表的是待发布  2代表的是发布动态
      }
      this.getTaskDynamicInfo(params)
    },
    // 待发布任务和发布发布动态
    getTaskDynamicInfo (option) {
      axios.taskDynamic(option).then(res => {
        if (res.data.code == 200) {
          if (option.pageState === 1) {
            this.taskList = res.data.data.records
            this.task.total = res.data.data.total * 1
          } else {
            this.dynamicList = res.data.data.records
            this.dynamic.total = res.data.data.total * 1
          }
        } else {
          this.$notify({
            type: 'error',
            message: res.data.message
          })
        }
      })
    },
    // 查看我的审批的看板
    getAuditLogList () {
      let searchData = {
        current: this.approve.current,
        size: this.pageSize,
        createDate: moment().format('YYYY-MM-DD HH:mm:ss'),
        pageStates: '0'
      }
      axios.getAuditLogList(searchData).then(data => {
        if (data.data.code === 200) {
          this.examineList = data.data.data.records
          this.approve.total = data.data.data.total * 1
        } else {
          this.$notify({
            title: '提示',
            message: data.data.message,
            type: 'error'
          })
        }
      })
    },
    goExamineAndAprove () {
      this.$router.push({
        path: '/AutomatedRelease/examineAndApprove',
        query: {
          code: 3
        }
      })
    },
    goExamineAndAproveDetail (data) {
      this.$router.push({
        path: '/AutomatedRelease/examineAndApprove',
        query: {
          code: 3,
          businessId: data.businessId,
          businessType: data.businessType
        }
      })
    },
    // 我的工作台发布统计
    getpublishCount () {
      let day =
        this.StatisticsTime == '0'
          ? '7'
          : this.StatisticsTime == '1'
            ? '30'
            : '180'
      let data = {
        days: day,
        pageSate: this.Statistics
      }
      axios.publishCount(data)
        .then(res => {
          if (res.data.data) {
            this.showChart = true
            this.initChart(res)
          } else {
            this.showChart = false
          }
        })
        .catch()
    },

    initChart (res) {
      //                                 var dataAxis = ['点', '击', '柱', '子','啊'];
      // var data = [10, 30, 70, 40,50];
      //    {
      //   label: '按最长发布时间统计',
      //   value: '2'
      // },
      // {
      //   label: '按最高发布频率统计',
      //   value: '1'
      // },
      // {
      //   label: '按最高发布成功率统计',
      //   value: '3'
      // }
      let dataAxis = []
      let data = []
      let subtitile
      if (this.showChart) {
        subtitile =
          this.Statistics == '1'
            ? '次数/次'
            : this.Statistics == '2'
              ? '时间/min'
              : '成功率/%'
      } else {
        subtitile = ''
      }
      res.data.data.forEach(item => {
        dataAxis.push(item.name)
        if (this.Statistics == '1') {
          data.push(item.countMumber)
        }
        if (this.Statistics == '2') {
          data.push((item.countMumber / 60).toFixed(2))
        }
        if (this.Statistics == '3') {
          data.push(
            ((item.sucessCount / item.countMumber / 100) * 10000).toFixed(2)
          )
        }
      })
      let myChart = echarts.init(document.getElementById('main'))
      var yMax = Math.max.apply(null, data)
      var dataShadow = []

      for (var i = 0; i < data.length; i++) {
        dataShadow.push(yMax)
      }

      var option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: function (params) {
            var tar
            tar = params[1]
            return (
              tar.name +
              '<br/>' +
              subtitile.split('/')[0] +
              ' : ' +
              tar.value +
              subtitile.split('/')[1]
            )
          }
        },
        title: {
          // text: '特性示例：渐变色 阴影 点击缩放',
          subtext: subtitile
        },
        xAxis: {
          data: dataAxis,
          type: 'category',
          name: this.showChart ? '任务名称' : '',
          color: '#6d6d6d',
          axisLabel: {
            rotate: -20,
            textStyle: {
              color: '#6d6d6d'
            }
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          z: 10
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: '#999'
            }
          }
        },
        dataZoom: [
          {
            type: 'inside',
            startValue: 0,
            endValue: dataAxis.length > 10 ? 9 : dataAxis.length - 1
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
            barCategoryGap: '60%',
            data: dataShadow,
            animation: false,
            label: {
              normal: {
                color: '#6d6d6d',
                show: true,
                position: 'top',
                formatter: '{c}' + subtitile.split('/')[1]
              }
            }
          },
          {
            type: 'bar',
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#83bff6' },
                  { offset: 0.5, color: '#188df0' },
                  { offset: 1, color: '#188df0' }
                ])
              },
              emphasis: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#2378f7' },
                  { offset: 0.7, color: '#2378f7' },
                  { offset: 1, color: '#83bff6' }
                ])
              }
            },
            data: data
          }
        ]
      }
      myChart.setOption(option)
    }
  }
}
</script>

<style scoped>
.cm-btn-more {
  margin-top: 8px;
  border: 1px solid #d3d3d3;
  float: right;
  color: #a1a1a2 !important;
  background: #fff;
  border-radius: 3px;
  outline: none;
  font-size: 12px;
  padding: 3px 10px 3px 30px;
  background: url('../../../../static/img/search02.png') no-repeat 10px center;
  background-size: 12px 12px;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.08);
  cursor: pointer;
}
.cm-btn-more:hover {
  background: url('/static/img/icon/watch_hover.png') no-repeat 10px center !important;
  background-size: 12px !important;
  color: #0066ff !important;
}
.workbench-box_tchart .el-input__inner {
  line-height: 24px !important;
  height: 24px !important;
}
.panel {
  padding: 10px;
}
.workbench-box {
  /*background: #fff;*/
}
.workbench-box_item {
  background: #fff;
  border: 1px solid #d3d3d3;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.08);
  border-radius: 5px;
  min-height: 200px;
}
.workbench-box_item + .workbench-box_item {
  margin-top: 20px;
}
.workbench-box_title {
  line-height: 40px;
  color: #777777;
  padding: 0 10px;
  border-bottom: 1px solid #d3d3d3;
  position: relative;
}
.workbench-box_item ul {
  padding: 10px;
  min-height: 100px;
  max-height: 220px;
}
.workbench-box_item ul li {
  color: #777777;
  font-size: 14px;
  line-height: 30px;
  min-height: 30px;
}
.workbench-box_item ul li + li {
  border-top: 1px solid #eee;
}

.workbench-box_item ul .workbench-list_content {
  max-width: 200px;
  overflow: hidden;
  text-wrap: none;
  white-space: nowrap;
  text-overflow: ellipsis;
  float: left;
}
.workbench-box_item ul .workbench-list_date {
  float: right;
  color: #d0d0d0;
  font-size: 13px;
  position: relative;
}
.workbench-box_chart {
  height: 300px;
  width: 100%;
}
.workbench-box_tchart {
  text-align: center;
  font-size: 14px;
  line-height: 30px;
  color: #777777;
  padding-top: 10px;
  position: relative;
}
.workbench-box_tchart .workbench-select {
  width: 100px;
  position: absolute;
  right: 20%;
  top: 10px;
}
.workbench-box_title .workbench-select {
  width: 180px;
  position: absolute;
  left: 50%;
  transform: translate(-50%);
  top: 0;
}
.cursor {
  cursor: pointer;
}
.block {
  text-align: center;
}
.successState {
  color: #0066ff;
}
.bg-img {
  width: 60px !important;
  height: 20px !important;
}
.font {
  font-size: 10px !important;
  position: absolute;
  top: -4px;
  left: 2px;
}
.font-more {
  font-size: 9px !important;
  position: absolute;
  top: -4px;
  left: 2px;
}
.errorState {
  color: #ff0000;
}
.waitState {
  color: #ff9b00;
}
</style>
