<template>
  <div class="container">
    <el-row style="    margin-left: 14px;  margin-right: -34px;">
      <el-col :span="13" class="daytask">
        <el-row>
          <div class="linh44 colorA2 bor2-b">
            <div class="bluespan"></div>
            <span class="posia top4">今日部署任务 {{sysdetail.todayCount}}</span>
          </div>
          <div class="nullstyle" v-if="Number(sysdetail.todayCount)==0">今日无部署任务</div>
          <div class="pad16 scrollstyle" v-if="Number(sysdetail.todayCount)>0">
            <table class="colorA2" v-for="todaylist in sysdetail.todayjobs" :key="todaylist.id">
              <tbody>
                <tr>
                  <td style="width: 12%; text-align: right;">{{todaylist.time[1]}}</td>
                  <td style="    width: 22%; text-align: right;">{{todaylist.name}}</td>
                  <td style="text-align: center;">
                    <span style="    width: 70%;" class="disib">
                      <span
                        class="fl"
                        :class="[todaylist.details.building?'runstyle':todaylist.details.result=='SUCCESS'?'successstyle':todaylist.details.nextBuildNumber==1?'watstyle':'failedstyle']"
                      >{{todaylist.details.building?'正在执行':todaylist.details.result=='SUCCESS'?'执行成功':todaylist.details.nextBuildNumber==1?'等待执行':'执行失败'}}</span>
                      <span class="fr">耗时{{todaylist.duration}}</span>
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style=" text-align: right;"></td>
                  <td style="text-align: right">{{todaylist.taskType | TaskType}}</td>
                  <td>
                    <div style="    width: 70%; margin: 0 auto;">
                      <vm-progress
                        v-if="todaylist.details.building"
                        :percentage="70"
                        :text-inside="true"
                        :stroke-width="18"
                        :striped="striped"
                        status="warning"
                      ></vm-progress>
                      <vm-progress
                        v-if="todaylist.details.result!='SUCCESS'&&!todaylist.details.building&&todaylist.details.nextBuildNumber!=1"
                        :percentage="30"
                        :text-inside="true"
                        :stroke-width="18"
                        status="exception"
                      ></vm-progress>
                      <vm-progress
                        v-if="todaylist.details.result=='SUCCESS'"
                        :percentage="100"
                        :text-inside="true"
                        :stroke-width="18"
                        status="info"
                      ></vm-progress>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style=" text-align: right;"></td>
                  <td style="text-align: right"></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </el-row>
      </el-col>
      <el-col :span="10" class="daytask" style="margin-left: 36px;">
        <el-row>
          <div class="linh44 colorA2 bor2-b">
            <div class="bluespan"></div>
            <span class="posia top4" v-if="showdetail">{{showdetail.name}}</span>
            <span class="posia top4" v-if="!showdetail">今日无部署任务</span>
          </div>
          <div class="nullstyle" v-if="!showdetail">今日无部署任务</div>
          <div class="pad16" v-if="showdetail">
            <el-col :span="8" class="textc">
              <div class="colorA5 mart10b20">
                <span>部署健康率</span>
              </div>
              <div class="marb">
                <el-progress
                  :color="showdetail.color"
                  class="mt20"
                  type="circle"
                  :percentage="Math.round(showdetail.rateMap.health)"
                ></el-progress>
              </div>
            </el-col>
            <el-col :span="8" class="textc">
              <div class="colorA5 mart10b20">
                <span>部署平均时间</span>
              </div>
              <div class="marb">
                <el-progress
                  class="mt20"
                  type="circle"
                  :percentage="100"
                  status="text"
                  color="#8e71c7"
                >{{showdetail.rateMap.avgtime}}</el-progress>
              </div>
            </el-col>
            <el-col :span="8" class="textc">
              <div class="colorA5 mart10b20">
                <span>部署成功率</span>
              </div>
              <div class="marb">
                <el-progress
                  :color="showdetail.color"
                  class="mt20"
                  type="circle"
                  :percentage="Math.round(showdetail.rateMap.successRate)"
                ></el-progress>
              </div>
            </el-col>
          </div>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-row>
        <div class="linh44 colorA2 mar10">
          <div class="bluespan"></div>
          <span class="posia top4">全部部署任务</span>
        </div>
      </el-row>
      <el-row>
        <el-form :inline="true">
          <el-form-item style="    margin-left: 15px;">
            <el-input placeholder="任务名称" v-model="taskname"></el-input>
          </el-form-item>
          <el-form-item class="form-select">
            <el-select v-model="tasktype" placeholder="选择任务类型" :clearable="true">
              <el-option
                v-for="tasks in taskList"
                :label="tasks.lab"
                :value="tasks.val"
                :key="tasks.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="form-select">
            <el-select placeholder="选择状态" v-model="status" :clearable="true">
              <el-option
                v-for="status in statusList"
                :label="status.lab"
                :value="status.val"
                :key="status.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="form-select">
            <el-date-picker
              v-model="time"
              align="right"
              type="date"
              placeholder="创建时间"
              :picker-options="pickerOptions1"
            ></el-date-picker>
          </el-form-item>
          <el-button class="headerIcon searchBtn" @click="searchlist">查找</el-button>
          <el-button style="    width: 140px;" class="headerIcon addBtn" @click="goaddtask">新增部署任务</el-button>
        </el-form>
      </el-row>
      <el-row>
        <el-table
          :data="JobList"
          @cell-click="handdle"
          style="background:#fff;margin-left: 14px;"
          :header-cell-style="{background:'#f5f5f5'}"
          center="true"
        >
          <el-table-column prop="code" label="任务健康率" align="center">
            <template slot-scope="scope">
              <!-- {{Number(scope.row.rateMap.health)+'%'}} -->
              <div :id="'containerh'+scope.row.index" class="lstyle"></div>
            </template>
          </el-table-column>
          <el-table-column prop="code" label="任务成功率" align="center">
            <template slot-scope="scope">
              <!-- {{Number(scope.row.rateMap.successRate)+'%'}} -->
              <!-- <div  style="position: relative;  height: 80px; display: block;">  -->
              <div :id="'containers'+scope.row.index" class="lstyle"></div>
              <!-- </div> -->
            </template>
          </el-table-column>
          <el-table-column prop="code" label="部署平均时间" align="center">
            <template slot-scope="scope">{{scope.row.rateMap.avgtime}}</template>
          </el-table-column>
          <el-table-column prop="code" label="任务名称" align="center">
            <template slot-scope="scope">{{scope.row.name}}</template>
          </el-table-column>
          <el-table-column prop="code" label="状态" align="center">
            <template slot-scope="scope">
              <div>
                <span style="    width: 100%;" class="disib">
                  <span
                    class="fl"
                    :class="[scope.row.details.building?'runstyle':scope.row.details.result=='SUCCESS'?'successstyle':scope.row.details.nextBuildNumber==1?'watstyle':'failedstyle']"
                  >{{scope.row.details.building?'正在执行':scope.row.details.result=='SUCCESS'?'执行成功':scope.row.details.nextBuildNumber==1?'等待执行':'执行失败'}}</span>
                  <span
                    class="fr"
                    v-if="scope.row.details.nextBuildNumber!=1"
                  >耗时{{scope.row.duration}}</span>
                </span>
              </div>
              <div>
                <vm-progress
                  v-if="scope.row.details.building"
                  :percentage="70"
                  :text-inside="true"
                  :stroke-width="18"
                  :striped="striped"
                  status="warning"
                ></vm-progress>
                <vm-progress
                  v-if="scope.row.details.result!='SUCCESS'&&!scope.row.details.building&&scope.row.details.nextBuildNumber!=1"
                  :percentage="30"
                  :text-inside="true"
                  :stroke-width="18"
                  status="exception"
                ></vm-progress>
                <vm-progress
                  v-if="scope.row.details.result=='SUCCESS'"
                  :percentage="100"
                  :text-inside="true"
                  :stroke-width="18"
                  status="info"
                ></vm-progress>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="code" label="任务类型" align="center">
            <template slot-scope="scope">{{scope.row.taskType | TaskType}}</template>
          </el-table-column>
          <el-table-column prop="code" label="操作" align="center" width="350px">
            <template slot-scope="scope">
              <el-button
                type="primary"
                plain
                size="mini"
                v-if="scope.row.details.nextBuildNumber!=1"
                @click="seelog(scope.row,'log')"
              >查看执行日志</el-button>
              <el-button type="primary" plain size="mini" @click="goRegression">备份</el-button>
              <el-button type="primary" plain size="mini" @click=" gobackups">回退</el-button>
              <el-dropdown @command="handleCommand" style="margin-left: 6px;">
                <span class="el-dropdown-link">
                  更多
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="1">查看</el-dropdown-item>
                  <el-dropdown-item command="2">编辑</el-dropdown-item>
                  <el-dropdown-item command="3">删除</el-dropdown-item>
                  <el-dropdown-item command="4" v-if="!scope.row.details.building">一键执行</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <!-- <el-tooltip content="查看" placement="top" effect="light">
                <button class="cm-table-btn cm-watch-btn" @click="showDetail(scope.row.fileId)"></button>
              </el-tooltip>
              <el-tooltip content="编辑" placement="top" effect="light">
                <button
                  class="cm-table-btn cm-edit-btn-light"
                  @click="editScript(scope.row.fileId)"
                ></button>
              </el-tooltip>
              <el-tooltip content="删除" placement="top" effect="light">
                <button
                  class="cm-table-btn cm-delete-btn-light"
                  @click="deleteScript(scope.row.fileId)"
                ></button>
              </el-tooltip>-->
            </template>
          </el-table-column>
        </el-table>
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currPage"
            :page-sizes="[10,30,50]"
            layout="prev, pager, next, sizes, total, jumper"
            :total="total"
            v-if="page"
            style="margin-right:15px;cursor: pointer;"
          ></el-pagination>
        </div>
      </el-row>
    </el-row>
  </div>
</template>
<script>
import echarts from 'echarts'
import 'echarts-liquidfill/src/liquidFill.js'
import moment from 'moment'
import axios from '@/api';
export default {
  data () {
    return {
      currPage: 1,
      showdetail: null,
      isshow: false,
      striped: true,
      timers: null,
      timers2: null,
      sysdetail: '',
      total: 1,
      page: 1,
      size: 10,
      taskname: '',
      tasktype: '',
      status: '',
      timest: '',
      taskList: [
        { val: '0', lab: '常规任务' },
        { val: '1', lab: '定时任务' }
      ],
      statusList: [
        { val: '0', lab: '正在执行' },
        { val: '1', lab: '执行失败' },
        { val: '2', lab: '等待执行' },
        { val: '3', lab: '执行成功' }
      ],
      JobList: [],
      time: '',
      copyrow: {},
      pickerOptions1: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [
          {
            text: '今天',
            onClick (picker) {
              picker.$emit('pick', new Date())
            }
          },
          {
            text: '昨天',
            onClick (picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          },
          {
            text: '一周前',
            onClick (picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', date)
            }
          }
        ]
      },
      value1: '',
      value2: ''
    }
  },
  filters: {
    TaskType (val) {
      if (val) {
        return val == 0 ? '常规任务' : '定时任务'
      } else {
        return ''
      }
    }
  },
  created () {
    console.log(this.$route.query.sysId)
  },
  methods: {
    // 点击row
    handdle (row) {
      this.copyrow = row
      this.showdetail = row
      // console.log(row);
    },
    // 回退
    gobackups () {
      this.$router.push({
        path: '/AutomatedRelease/BackspaceManage',
        query: { code: 3 }
      })
    },
    // 备份
    goRegression () {
      this.$router.push({
        path: '/AutomatedRelease/backupManagement/BackspaceManagelist',
        query: { code: 3 }
      })
    },
    // 查询
    searchlist () {
      var searchPage = 1
      this.findBypage(searchPage)
    },
    // 查看日志
    seelog (row, n) {
      // console.log(row, n);
      this.$router.push({
        path: '/AutomatedRelease/ViewLogs',
        query: {
          code: 3,
          jobName: row.name,
          jobNumber: row.jobNumber,
          jobId: row.jobId
        }
      })
    },
    handleCommand (command) {
      // console.log(this.copyrow)
      //     console.log(typeof command)
      if (command == '1') {
        this.gojobdetail(this.copyrow)
      } else if (command == '2') {
        this.gosetjob(this.copyrow)
      } else if (command == '3') {
        this.deljob(this.copyrow)
      } else if (command == '4') {
        this.buildJob(this.copyrow)
      }
    },
    // 一键执行
    buildJob (row) {
      // console.log(row);
      let jobId = row.jobId
      let jobName = row.name
      axios.buildJob(jobId, jobName)
        .then(res => {
          console.log(res)
          if (res.data.status.index == '200') {
            this.$notify({
              title: '提示',
              message: '一键成功',
              type: 'success'
            })
          }
          this.timers2 = setInterval(() => {
            this.findBypage()
          }, 300)
          setTimeout(() => {
            clearInterval(this.timers2)
          }, 5000)
        })
        .catch()
    },
    // 查看详情
    gojobdetail (row) {
      let jobId = row.jobId
      this.$router.push({
        path: '/AutomatedRelease/Addnewtask',
        query: { code: '3', status: '1', jobid: jobId }
      })
    },
    // 编辑job
    gosetjob (row) {
      // console.log(row);
      let jobId = row.jobId
      this.$router.push({
        path: '/AutomatedRelease/Addnewtask',
        query: { code: '3', status: '2', jobid: jobId }
      })
    },
    // 水波纹球健康率
    getLifull1 (n, num) {
      // console.log(num)
      var myChart = echarts.init(n)
      let newNum = num.toFixed(2)
      let boxColor = ''
      let borcolor = ''
      if (newNum > 0.8) {
        boxColor = '#1E90FF'
        borcolor = '#0000CD'
      } else if (newNum <= 0.8 && newNum >= 0.6) {
        boxColor = '#00FFFF'
        borcolor = '#4169E1'
      } else if (newNum < 0.6 && newNum >= 0.4) {
        boxColor = '#00FF7F'
        borcolor = '#3CB371'
      } else if (newNum < 0.4 && newNum >= 0.2) {
        boxColor = '#FFD700'
        borcolor = '#FFA500'
      } else if (newNum < 0.2) {
        boxColor = '#fd3a84'
        borcolor = '#C71585'
      }
      var option = {
        series: [
          {
            type: 'liquidFill',
            data: [newNum],
            backgroundStyle: {
              borderWidth: 1,
              borderColor: borcolor
            },
            outline: {
              show: false
            },
            label: {
              fontSize: 20,
              color: borcolor
            },
            itemStyle: {
              normal: {
                color: {
                  colorStops: [
                    {
                      offset: 0,
                      color: boxColor // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: borcolor // 100% 处的颜色
                    }
                  ]
                }
              }
            }
          }
        ]
      }
      myChart.setOption(option)

      // var myChart2 = echarts.init(document.getElementById('container3'));
      // let num2 = Math.random();
      // let newNum2 = num2.toFixed(2);
      // let boxColor2 = '';
      // let borcolor2 = '';
      // let midColor2 = '';
      // if (newNum2 > 0.8) {
      //   boxColor2 = '#f5150b';
      //   borcolor2 = '#a6272d';
      // } else if (newNum2 <= 0.8 && newNum2 >= 0.6) {
      //   boxColor2 = '#f5150b';
      //   borcolor2 = '#fbb032';
      // } else if (newNum2 < 0.6 && newNum2 >= 0.4) {
      //   boxColor2 = '#3bcffb';
      //   borcolor2 = '#f146bc';
      // } else if (newNum2 < 0.4 && newNum2 >= 0.2) {
      //   boxColor2 = '#ffde00';
      //   borcolor2 = '#fd3a84';
      // } else if (newNum2 < 0.2) {
      //   boxColor2 = '#fff';
      //   borcolor2 = '#ffde00';
      // }
      // var option2 = {
      //   series: [
      //     {
      //       type: 'liquidFill',
      //       data: [newNum2],
      //       backgroundStyle: {
      //         borderWidth: 1,
      //         borderColor: borcolor2
      //       },
      //       outline: {
      //         show: false
      //       },
      //       label: {
      //         fontSize: 20,
      //         color: borcolor2
      //       },
      //       itemStyle: {
      //         normal: {
      //           color: {
      //             colorStops: [
      //               {
      //                 offset: 0,
      //                 color: boxColor2 // 0% 处的颜色
      //               },
      //               {
      //                 offset: 1,
      //                 color: borcolor2 // 100% 处的颜色
      //               }
      //             ]
      //           }
      //         }
      //       }
      //     }
      //   ]
      // };
      // myChart2.setOption(option2);
    },
    // 任务成功率
    getLifull2 (n2, num) {
      var myChart1 = echarts.init(n2)
      let newNum1 = num.toFixed(2)
      let boxColor1 = ''
      let borcolor1 = ''
      if (newNum1 > 0.8) {
        boxColor1 = '#1E90FF'
        borcolor1 = '#0000CD'
      } else if (newNum1 <= 0.8 && newNum1 >= 0.6) {
        boxColor1 = '#00FFFF'
        borcolor1 = '#4169E1'
      } else if (newNum1 < 0.6 && newNum1 >= 0.4) {
        boxColor1 = '#00FF7F'
        borcolor1 = '#3CB371'
      } else if (newNum1 < 0.4 && newNum1 >= 0.2) {
        boxColor1 = '#FFD700'
        borcolor1 = '#FFA500'
      } else if (newNum1 < 0.2) {
        boxColor1 = '#fd3a84'
        borcolor1 = '#C71585'
      }

      var option1 = {
        series: [
          {
            type: 'liquidFill',
            data: [newNum1],
            backgroundStyle: {
              borderWidth: 1,
              borderColor: borcolor1
            },
            outline: {
              show: false
            },
            label: {
              fontSize: 20,
              color: borcolor1
            },
            itemStyle: {
              normal: {
                color: {
                  colorStops: [
                    {
                      offset: 0,
                      color: boxColor1 // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: borcolor1 // 100% 处的颜色
                    }
                  ]
                }
              }
            }
          }
        ]
      }
      myChart1.setOption(option1)
    },
    // 删除job
    deljob (row) {
      let jobId = row.jobId
      axios.deljob(jobId)
        .then(res => {
          console.log(res)
          if (res.data.code == '200') {
            this.$notify({
              title: '提示',
              message: '删除成功',
              type: 'success'
            })
            this.findBypage()
          }
        })
        .catch()
    },
    // 新增job
    goaddtask () {
      this.$router.push({
        path: '/AutomatedRelease/Addnewtask',
        query: { code: '3' }
      })
    },
    // 任务列表
    findBypage (searchPage) {
      if (searchPage) {
        this.currPage = searchPage
      }
      if (this.time) {
        var time = moment(this.time).format('YYYY-MM-DD')
      }
      let data = {
        systemId: this.$route.query.sysId,
        jobName: this.taskname,
        tasktype: this.tasktype,
        statustype: this.status,
        date: time,
        current: this.currPage,
        size: this.size
      }
      axios.findBypage(data)
        .then(res => {
          // console.log(res);

          this.JobList = res.data.data.records
          this.JobList.forEach((item, index) => {
            item.index = index
          })
          this.JobList.reverse().reverse()
          this.$nextTick(function () {
            // console.log(document.getElementById('containers1'))
            // 此时已经渲染完成
            if (this.JobList) {
              let num
              num = this.JobList.length
              for (var i = 0; i < num; i++) {
                let n = document.getElementById('containerh' + i)
                let n2 = document.getElementById('containers' + i)
                this.getLifull1(
                  n,
                  Math.round(this.JobList[i].rateMap.health / 100)
                )
                this.getLifull2(
                  n2,
                  Math.round(this.JobList[i].rateMap.successRate / 100)
                )
              }
            }
          })

          // setTimeout(()=>{
          // this.getLifull1(this.JobList)
          // },200)
        })
        .catch()
    },
    // 获取系统详情
    Sysdetial () {
      let sysId = this.$route.query.sysId
      this.sysdetail.todayjobs = [
        {
          name: 1,
          time: '124'
        },
        {
          name: 1,
          time: '124'
        }
      ]
      // let sysId = '8dbde715ae7043f8b2861307560545aa'
      axios.Sysdetial(sysId)
        .then(res => {
          if (res.data.status.index == '200') {
            console.log(res.data.Org)
            this.sysdetail = res.data.Org

            // this.sysdetail.todayjobs.forEach((item)=>{
            //   item.time = this.timestring(item.details.timestamp).split(' ')
            // })
            // if (res.data.Org.todayjobs.length > 0) {
            //   this.showdetail = res.data.Org.todayjobs[0];
            //   let val = Math.round(this.showdetail.successRate);
            //   if (val <= 33) {
            //     this.showdetail.color = '#FF1493';
            //   } else if (val <= 67 && val >= 34) {
            //     this.showdetail.color = '#00BFFF';
            //   } else if (val > 67) {
            //     this.showdetail.color = '#50bfff';
            //   }
            // }
          }
        })
        .catch()
    },
    handleSizeChange (val) {
      this.size = val
      this.findBypage()
    },
    handleCurrentChange (val) {
      this.currPage = val
      this.size = 10
      this.findBypage()
    },
    getspanstyle () {
      setTimeout(() => {
        document.getElementsByClassName(
          'searchBtn'
        )[0].children[0].style.marginLeft = '13px'
        document.getElementsByClassName(
          'addBtn'
        )[0].children[0].style.marginLeft = '18px'
      }, 100)
    },
    // 清除计时器
    clearTimers () {
      if (this.timers) {
        // 如果定时器在运行则关闭
        clearInterval(this.timers)
      }
      if (this.timers2) {
        // 如果定时器在运行则关闭
        clearInterval(this.timers)
      }
    }
  },
  beforeMount () {
    this.findBypage()
  },
  mounted () {
    // this.getManagementList()

    this.timers = setInterval(() => {
      this.findBypage()
    }, 30000)
  },
  destroyed () {
    this.clearTimers()
  }
}
</script>
<style scoped>
.container {
  padding: 30px;
  background: none;
  border: none;
  border-radius: 0;
}
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.headerIcon {
  width: 74px;
  height: 36px;
  background-repeat: no-repeat;
  background-size: 60% 60%;
  background-position: -2px;
  margin-left: 8px;
  border: 2px solid #b9b9b9;
  padding: 11px 10px 10px 34px;
}
.addBtn {
  background-image: url('../../../../static/img/task/新增.svg');
  padding: 11px 20px 9px 39px;
  background-position: -48px;
  background-size: 100% 60%;
}
.searchBtn {
  background-image: url('../../../../static/img/task/查询.svg');
}
.daytask {
  border-radius: 3px;
  border: 2px solid #e2e2e2;
  background-color: #fff;
}
.bluespan {
  color: #0167ff;
  background-color: #0167ff;
  width: 8px;
  margin-top: 10px;
  height: 28px;
  margin-left: 16px;
  display: inline-block;
  border-radius: 3px;
  vertical-align: sub;
  /* font-size: 17px; */
  margin-top: 10px;
  margin-right: 20px;
}
.posia {
  position: absolute;
}
.linh44 {
  line-height: 44px;
}
.colorA2 {
  color: #a2a2a2;
}
.colorA5 {
  color: #a5a5a5;
}
.top4 {
  top: 4px;
}
.bor2-b {
  border-bottom: 2px solid #e2e2e2;
}
.pad16 {
  padding: 16px;
  padding-bottom: 10px;
}
.pad16 table {
  width: 100%;
  border: 1.9px solid #f1f1f1;
  border-radius: 2px;
  margin-bottom: 10px;
}
.disib {
  display: inline-block;
}
.fl {
  float: left;
}
.fr {
  float: right;
}
.textc {
  text-align: center;
}
.mart10b20 {
  margin: 10px 0 20px;
}
.marb {
  margin-bottom: 24px;
}
.block {
  text-align: right;
  background: #fff;
  margin-left: 15px;
  width: 99.8%;
  padding: 30px 0;
}
.successstyle {
  color: #0166ff;
}
.failedstyle {
  color: #f14c6f;
}
.watstyle {
  color: #b9b9b9;
}
.runstyle {
  color: #ff9a00;
}
.mar10 {
  margin: 10px 0;
}
.nullstyle {
  padding: 16px;
  padding-bottom: 10px;
  height: 201px;
  text-align: center;
  line-height: 201px;
  color: #666;
  font-size: 30px;
}
.scrollstyle {
  overflow-y: auto;
  overflow-x: auto;
  /* width: 400px; */
  height: 194px;
}
.lstyle {
  width: 80%;
  height: 180px;
  position: absolute;
  margin: auto;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}
</style>
