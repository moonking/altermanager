<template>
  <div class="mian">
    <div class="top deep-aibms-color-bg">
      <icon-svg icon-class="duo" class="gray-icon-color whiteness-icon-color" />
      <div style="float:left;margin:0 10px;">
        <span style="margin-right:20px">{{ systemName }}</span>
        <span v-if="logDetailData.buildStatus =='SUCCESS'" class="success2">执行成功</span>
        <span
          v-if="logDetailData.buildStatus =='FAILURE' || logDetailData.buildStatus =='ABORTED'"
          class="falie"
        >执行失败</span>
        <span v-if="logDetailData.buildStatus =='building'" class="runing">正在执行</span>
        <span v-if="logDetailData.buildStatus =='PAUSED_PENDING_INPUT'" class="waiting">等待执行</span>
      </div>
      <div class="step" v-if="isShow">
        <StepProgress :present="step" :name="stepName" />
      </div>
      <div style="float:left;margin-left:20px;color:#777" class="white-color">
        <span>执行人：</span>
        <span>{{ logDetailData.createByName }}</span>
        <span style="margin-left:10px;display:inline-block">共执行时间：</span>
        <span>{{ logDetailData.duration | filterTime }}</span>
        <el-select
          v-if="$route.query.hisId"
          @change="getNewLog"
          v-model="value"
          placeholder="请选择"
          style="margin-left: 10px;"
        >
          <el-option
            v-for="(item, index) in pipelineOptions"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="clear"></div>
    </div>
    <div class="block-content" style="overflow: visible">
      <div style="border: 1px solid #ccc;position: relative; ">
        <Workflow
          @task-id="getTaskId"
          :activityData="activityData"
          :currentJobId="currentJobId"
          :builedId="builedId"
          :planType="planType"
          :pipelineList="pipelineList"
          :sysId="sysId"
        />
      </div>
      <div class="execute-btns">
        <el-button
          type="primary"
          v-show="planType!=='1'"
          size="small"
          @click="centerDialogVisible = true"
        >控制台输出</el-button>
        <el-button
          type="primary"
          :disabled="logDetailData.buildStatus === 'IN_PROGRESS'"
          @click="goExecute"
          size="small"
        >
          重新开始&nbsp;&nbsp;
          <i class="el-icon-refresh" />
        </el-button>
        <el-button
          type="danger"
          :disabled="logDetailData.buildStatus !== 'IN_PROGRESS'"
          @click="stopJob"
          size="small"
        >
          终止&nbsp;&nbsp;
          <i class="el-icon-caret-right" />
        </el-button>
      </div>
    </div>
    <el-dialog title="控制台输出" :visible.sync="centerDialogVisible" width="50%" center>
      <el-button
        icon="el-icon-download"
        type="primary"
        size="small"
        @click="downlod"
        class="downbtn"
      >下载日志</el-button>
      <span class="consolespan" v-html="this.consoleData"></span>
    </el-dialog>

    <div class="logdetail">
      <el-tabs v-model="tabvalue" @tab-click="handleClick">
        <el-tab-pane v-for="(item,index) in stagesList" :name="index+''" :key="index">
          <div slot="label">
            <span style="padding: 0 10px;">
              <span style="padding: 0px 10px 0 0;">{{ item.name?item.name:item.actNodeName }}</span>
              <img style="width: 26px;vertical-align: middle;" :src="returnImgSrc(item.status)" />
            </span>
          </div>
          <div class="inner_content">
            <div ref="log" v-if="item.stageNodes" class="logstyle">
              <Terminal :printString.sync="item.stageNodes" />
            </div>
            <div v-else style="text-align: center;" class="logstyle">
              <img src="../../../../static/img/task/20140524124238403.gif" />
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import axios from '@/api'
import common from '@/utils/commonjs'
import StepProgress from './StepProgress.vue'
import Workflow from '../ReleaseWorkflow.vue'
import Terminal from '../../common/Terminal'
export default {
  data () {
    return {
      value: '',
      // 发布管理及流水线下拉
      pipelineOptions: [],
      builedId: '',
      tabvalue: '0',
      consoleData: '',
      centerDialogVisible: false,
      step: 0,
      stepName: '',
      logDetailData: '',
      systemName: '',
      runUser: '',
      stages: '',
      isShow: false,
      activityData: {},
      buildId: '',
      socketdata: [],
      urldata: {
        urls: []
      },
      pipelineList: [],
      isClick: false,
      currentJenkinsId: '',
      planType: '',
      sysId: '',
      copyLog: [],
      stagesList: [],
      findTaskIndex: 0,
      flowList: [],
      implementPage: false, // 判断是否是点击执行进入的页面
      firstPush: true
    }
  },
  components: {
    StepProgress,
    Workflow,
    Terminal
  },
  created () {
    this.currentJobId = this.$route.query.jobId
    this.builedId = this.$route.query.builedId
    this.currentJenkinsId = this.$route.query.jenkinsId
    if (this.$route.query.hisId) {
      this.getReleaseLogDetail('first')
    } else {
      this.getJobbuildinfo()
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.handdleMsg('msg')
    })
  },
  filters: {
    filterTime: timeStr => common.timer(timeStr * 1000)
  },
  methods: {
    // 获取流水线
    getPipelineList (id) {
      this.pipelineList = []
      axios.findByStemId(id).then(res => {
        if (res.data.code === 200) {
          res.data.data.forEach(item => {
            this.pipelineList.push({
              value: item.jobId,
              label: item.name
            })
          })
        }
      })
    },
    // 获取发布管理日志详情
    getReleaseLogDetail (type) {
      this.pipelineOptions = []
      let data = {
        hisId: this.$route.query.hisId,
        manageId: this.$route.query.manageId
      }
      axios.releaseLogDetail(data).then(res => {
        const resultData = res.data.data
        this.sysId = resultData.releaseManageHis[0].systemId
        this.flowList = resultData.releaseNodeparamHis
        this.getPipelineList(this.sysId)
        this.pipelineOptions[0] = {
          value: resultData.releaseManageHis[0].manageId,
          label: resultData.releaseManageHis[0].name
        }
        if (resultData.releaseNodeparamHis && resultData.releaseNodeparamHis.length) {
          resultData.releaseNodeparamHis.forEach(item => {
            this.pipelineOptions.push({
              value: item.jobTaskId,
              label: item.actNodeName
            })
          })
          resultData.releaseManageHis[0].jobtaskBuiled.forEach((item, index) => {
            this.pipelineOptions[index + 1].builedId = item.builedId
            this.pipelineOptions[index + 1].jenkinsId = item.jenkinsId
            this.pipelineOptions[index + 1].jobId = item.jobId
          })
        }
        // 首次进入页面调用这个方法，单条流水线默认显示流水线
        if (type === 'first') {
          // 多条流水线进入发布日志
          if (this.flowList.length > 1) {
            if (this.$route.query.builedId) {
              this.getJobbuildinfo()
              this.value = this.$route.query.jobId
            }
          } else if (this.flowList.length == 1) {
            this.planType = '2'
            // 从任务列表直接进入，说明点击的是执行进入这里，但是执行不能直接在详情获取，执行从websocket接收数据
            if (this.fromUrl.path != '/AutomatedRelease/releaseTasklist') {
              this.value = this.pipelineOptions[1].value
              this.builedId = this.pipelineOptions[1].builedId
              this.currentJenkinsId = this.pipelineOptions[1].jenkinsId
              this.currentJobId = this.pipelineOptions[1].currentJobId
              this.getJobbuildinfo()
            } else {
              this.implementPage = true
            }
          }
        }
        if (this.fromUrl.path != '/AutomatedRelease/releaseTasklist' || this.implementPage) {
          this.collatingData(
            res.data.data.releaseManageHis[0],
            res.data.data.duration,
            res.data.data.releaseNodeparamHis
          )
        }
      })
    },
    // 下拉切换
    getNewLog () {
      let num = 0
      this.tabvalue = '0'
      this.implementPage = true
      this.pipelineOptions.forEach((item, index) => {
        if (item.value === this.value) {
          num = index
        }
      })
      if (num === 0) {
        this.getReleaseLogDetail()
        this.planType = '1'
      } else {
        this.builedId = this.pipelineOptions[num].builedId
        this.currentJenkinsId = this.pipelineOptions[num].jenkinsId
        this.currentJobId = this.pipelineOptions[num].currentJobId
        this.planType = '2'
        this.getJobbuildinfo()
      }
    },
    // 获取任务信息
    getJobbuildinfo () {
      this.isShow = false
      var buildId = this.builedId
      axios.getJobbuildinfo(buildId).then(res => {
        this.logDetailData = res.data.data
        this.$set(this.activityData, 'actXml', this.logDetailData.jobTask.actXml)
        if (
          this.logDetailData.jobTask.stages.stages &&
          this.logDetailData.jobTask.stages.stages.length
        ) {
          this.activityData.stages = this.logDetailData.jobTask.stages.stages
        }
        this.systemName = this.logDetailData.jobTask.name
        this.consoleData = this.logDetailData.consoleLog
        this.logDetailData.jobTask.stages = this.logDetailData.jobTask.stages
        let log = this.logDetailData.jobTask.stages.stages
        this.isShow = true
        let total = this.logDetailData.jobTask.stages.stageSize || 0
        let size = 0

        if (log && log.length) {
          log.forEach((item, index) => {
            if (item.status === 'SUCCESS') {
              size += 1
            }
          })
          this.step = (size / total) * 100
          this.stepName = log[size === 0 ? 0 : size - 1].name
        }
        this.stages = []
        this.stagesList = []
        this.stages = log
        if (this.stages != undefined) {
          this.stagesList.push(log[0])
          this.changeTabValue()
        }
      })
    },
    // 获取Taskid,并找到这个所在的对象
    getTaskId (val) {
      let foundTask = this.stages.find(el => {
        return el.actNodeId == val
      });
      let fitterTask = this.stagesList.find(el => {
        return el.actNodeId == foundTask.actNodeId
      })
      // 没找到说明莫得重复就推到这个数组后面
      if (fitterTask == undefined) {
        this.stagesList.push(foundTask)
        this.findTaskIndex = this.stagesList.lastIndexOf(foundTask)
      } else {
        // 这里找到了返回index用于切换tab
        this.findTaskIndex = this.stagesList.findIndex(el => {
          return el.actNodeId == fitterTask.actNodeId
        })
      }
      this.tabvalue = this.findTaskIndex + ''
      this.stagesList.forEach((item, index) => {
        if (Number(this.tabvalue) === index) {
          if (item.status === 'IN_PROGRESS') {
            this.isClick = false
          }
          this.getlog(item, index)
        }
      })
    },
    handleClick () {
      this.isClick = true
      let num = 0
      this.pipelineOptions.forEach((item, index) => {
        if (item.value === this.value) {
          num = index
        }
      })
      if (num === 0) {
        this.stagesList = []
        this.$nextTick(() => {
          this.stagesList = this.copyLog
        })
      }
      this.stagesList.forEach((item, index) => {
        if (Number(this.tabvalue) === index) {
          if (item.status === 'IN_PROGRESS') {
            this.isClick = false
          }
          this.getlog(item, index)
        }
      })
    },
    // 展开收起
    getlog (item, index) {
      console.log(item)
      let urls = []
      if (item.stageFlowNodes && item.stageFlowNodes.length) {
        item.stageFlowNodes.forEach(d => {
          urls.push({ url: d._links.log.href })
        })
        this.$set(this.urldata, 'urls', urls)
        this.$set(this.urldata, 'jenkinsId', this.currentJenkinsId)
        axios.getstagelog(this.urldata).then(res => {
          var stagetext = ''
          res.data.data.forEach(item => {
            stagetext += item.text
          })
          this.$set(this.stagesList[index], 'stageNodes', stagetext)
        })
      }
    },
    // websocket接收数据
    handdleMsg (msg) {
      this.$global.ws.onmessage = res => {
        this.socketdata = JSON.parse(res.data)
        if (this.socketdata.name === 'releaseManage') {
          if (
            this.socketdata.releaseManage.releaseManageHis[0].manageId ===
            this.$route.query.manageId &&
            this.socketdata.releaseManage.releaseManageHis[0].hisId ===
            this.$route.query.hisId
          ) {
            this.socketdata.releaseManage.releaseManageHis[0].jobtaskBuiled.forEach(item => {
              this.pipelineOptions.forEach(d => {
                if (d.value === item.jobtaskId) {
                  d.builedId = item.builedId
                  d.jenkinsId = item.jenkinsId
                }
              })
            }
            )
            if (this.socketdata.releaseManage.releaseManageTask.length > 1) {
              this.collatingData(
                this.socketdata.releaseManage.releaseManageHis[0],
                this.socketdata.releaseManage.releaseManageHis[0].deployTime,
                this.socketdata.releaseManage.releaseManageTask,
                'ms'
              )
            } else if (this.socketdata.releaseManage.releaseManageTask.length == 1) {
              this.value = this.pipelineOptions[1].value
              this.builedId = this.pipelineOptions[1].builedId
              this.currentJenkinsId = this.pipelineOptions[1].jenkinsId
              let jobtaskBuiled = this.socketdata.releaseManage.releaseManageHis[0].jobtaskBuiled
              if (jobtaskBuiled && jobtaskBuiled.length) {
                this.$set(this.activityData, 'actXml', jobtaskBuiled[0].actXml)
                if (this.firstPush) {
                  this.firstPush = false
                  this.stages = []
                  this.stagesList = []
                  this.stages = jobtaskBuiled[0].jobTask.actParamList
                  this.stagesList.push(this.stages[0])
                }
              }
            }
          }
        }
        if (this.socketdata.jobId && this.socketdata.jobId === this.$route.query.jobId) {
          this.activityData = {}
          this.$set(this.activityData, 'actXml', this.socketdata.actXml)
          this.isShow = false
          if (
            this.socketdata.stages.stages &&
            typeof this.socketdata.stages.stages === 'string'
          ) {
            this.socketdata.stages.stages = common.evil(
              this.socketdata.stages.stages
            )
          }
          this.$set(
            this.logDetailData,
            'buildStatus',
            this.socketdata.buildStatus
          )
          this.$set(this.logDetailData, 'duration', this.socketdata.duration)
          let total = this.socketdata.stages.stageSize || 0
          let size = 0

          if (
            this.socketdata.stages.stages &&
            this.socketdata.stages.stages.length
          ) {
            this.socketdata.stages.stages.reverse().reverse()
            this.$set(
              this.activityData,
              'stages',
              this.socketdata.stages.stages
            )
          }
          this.stagesList = this.socketdata.stages.stages
          this.changeTabValue('ms')
          this.stagesList.forEach((item, index) => {
            if (item.status === 'SUCCESS') {
              size += 1
            }
          })
          this.step = (size / total) * 100
          this.stepName = this.stagesList[this.stagesList.length - 1].name
          setTimeout(() => {
            this.isShow = true
          }, 100)
        }
      }
    },
    collatingData (releaseManageHis, duration, releaseNodeparamHis, type) {
      // 多流水线进入任务。单条流水线默认显示第一条，并显示对应的流水线日志
      let stagesArr = []
      this.activityData = {}
      this.logDetailData = releaseManageHis
      this.logDetailData.duration = duration
      this.logDetailData.buildStatus = releaseManageHis.taskStatus
      this.value = releaseManageHis.manageId
      this.$set(this.activityData, 'actXml', releaseManageHis.actXml)

      if (releaseManageHis.jobtaskBuiled && releaseManageHis.jobtaskBuiled.length) {
        if (releaseNodeparamHis.length) {
          releaseNodeparamHis.forEach(item => {
            stagesArr.push({
              name: item.actNodeName,
              actNodeId: item.actNodeId
            })
          })
        }
        releaseManageHis.jobtaskBuiled.forEach((item, index) => {
          stagesArr[index].stageNodes = item.consoleLog
          stagesArr[index].status = item.buildStatus
        })
        this.activityData.stages = stagesArr
      }
      this.systemName = releaseManageHis.name
      let log = stagesArr
      this.isShow = true
      let total = Number(stagesArr.length) || 0
      let size = 0
      if (log && log.length) {
        log.forEach((item, index) => {
          if (item.status === 'SUCCESS') {
            size += 1
          }
        })
        this.step = (size / total) * 100
        this.stepName = log[size === 0 ? 0 : size - 1].name
      }
      this.stages = log
      this.stagesList = []
      this.stagesList.push(this.stages[0])
      this.copyLog = JSON.parse(JSON.stringify(log))
      this.changeTabValue(type)
    },
    // 返回图片地址
    returnImgSrc (status) {
      let imgSrc = ''
      if (status === 'SUCCESS') {
        imgSrc = require('../../../../static/img/status_succ.png')
      } else if (
        status === 'FAILURE' ||
        status === 'ABORTED' ||
        status === 'FAILED'
      ) {
        imgSrc = require('../../../../static/img/status_err.png')
      } else if (status === 'IN_PROGRESS' || status === 'building') {
        imgSrc = require('../../../../static/img/status_run.png')
      } else {
        imgSrc = require('../../../../static/img/status_wait.png')
      }
      return imgSrc
    },
    // 下载日志
    downlod () {
      var buildId = this.builedId
      this.$confirm('确认下载?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        window.open(
          axios.deliveryurl() + 'jobtask/downloadLog?builedId=' + buildId,
          '_self'
        )
      })
    },
    changeTabValue (type) {
      let noInprogress = true
      let showlast = true
      if (type) {
        if (this.isClick) {
          return
        }
        for (let i = 0; i < this.stagesList.length; i++) {
          if (
            this.stagesList[i].status === 'IN_PROGRESS' ||
            this.stagesList[i].status === 'building'
          ) {
            this.tabvalue = i + ''
            this.getlog(this.stagesList[i], i)
            showlast = false
          }
        }
        if (showlast) {
          this.tabvalue = this.stagesList.length - 1 + ''
          this.getlog(
            this.stagesList[this.stagesList.length - 1],
            this.stagesList.length - 1
          )
        }
      } else {
        if (this.stagesList && this.stagesList.length) {
          for (let j = 0; j < this.stagesList.length; j++) {
            if (
              this.stagesList[j].status === 'IN_PROGRESS' ||
              this.stagesList[j].status === 'building'
            ) {
              noInprogress = false
              this.tabvalue = j + ''
              this.getlog(this.stagesList[j], j)
              return
            }
          }
          if (noInprogress && this.tabvalue === '0') {
            this.getlog(this.stagesList[0], 0)
          } else {
            this.getlog(this.stagesList[this.tabvalue], this.tabvalue)
          }
        }
      }
    },
    //    跳转执行任务
    goExecute (e) {
      axios.buildJo(this.currentJobId).then(data => {
        if (data.data.code === 200) {
          this.buildId = data.data.data.builedId
          this.$router.push({
            path: '/AutomatedRelease/ExecuteTask',
            query: {
              type: '1',
              code: 3,
              jenkinsId: this.currentJenkinsId,
              builedId: this.buildId,
              jobId: this.currentJobId
            }
          })
        } else {
          this.$notify({
            title: '提示',
            message: data.data.message,
            type: 'error'
          })
        }
      })
    },
    //    终止任务执行
    stopJob (item) {
      axios.stopJob(this.currentJobId).then(data => {
        if (data.data.code === 200) {
          this.getJobbuildinfo()
          this.$notify({
            title: '提示',
            message: '请求成功！',
            type: 'waring'
          })
        }
      })
    }
  }
}
</script>
<style scoped>
.mian {
  padding: 10px;
}
.step {
  width: 30%;
  float: left;
  margin-top: 7px;
}
.top {
  position: relative;
  height: 40px;
  line-height: 40px;
  background: #fff;
  font-size: 14px;
}
.top .svg-icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 15px;
}
.clear {
  clear: both;
}
.logdetail {
  font-size: 14px;
}
.logcontainer {
  height: 40px;
  position: relative;
  line-height: 40px;
  /* background: red; */
  background: #eaeaea;
  border-bottom: 1px solid #e0e0e0;
}
.success {
  position: absolute;
  top: 10px;
  left: 20px;
}
.error {
  position: absolute;
  top: 10px;
  left: 60px;
}
.simgbox {
  float: left;
  width: 20px;
  height: 20px;
  margin: 10px 5px 0;
}
.xiala {
  position: absolute;
  right: 20px;
  top: 14px;
  height: 13px;
  width: 13px;
  cursor: pointer;
}
.information {
  position: absolute;
  left: 60px;
}
.shell {
  background: #585858;
  color: #fff;
}
.imgbox {
  width: 20px;
  height: 20px;
}
.left {
  float: right;
  height: 10px;
  width: 10px;
  margin: 15px 10px 0;
}
.ti {
  height: 10px;
  width: 10px;
  margin: 15px 10px 0;
}
.block-content {
  overflow: hidden;
  margin-top: 24px;
}
.execute-btns {
  padding: 20px 80px;
  text-align: right;
}
.runing {
  /* color: blue; */
  color: #ff9b00;
  background-color: rgba(255, 155, 0, 0.3);
  height: 30px;
  text-align: center;
  display: inline-block;
  line-height: 30px;
  /* background: #87CEFA; */
  width: 70px;
  border-radius: 4px;
}
.falie {
  color: red;
  height: 30px;
  text-align: center;
  display: inline-block;
  line-height: 30px;
  background: #f08080;
  width: 70px;
  border-radius: 4px;
}
.success2 {
  color: #49bc71;
  height: 30px;
  text-align: center;
  display: inline-block;
  line-height: 30px;
  background: #c8ebd4;
  width: 70px;
  border-radius: 4px;
}
.waiting {
  color: #999;
  height: 30px;
  text-align: center;
  display: inline-block;
  line-height: 30px;
  background: #f8f8f8;
  width: 70px;
  border-radius: 4px;
}
.downbtn {
  float: right;
  margin-bottom: 10px;
}
.consolespan {
  display: inline-block;
}
.el-dialog__body {
  padding-top: 0px !important;
  padding-bottom: 60px !important;
}
.logstyle {
  overflow-y: auto;
  height: 400px;
  background: #585858;
  color: #fff;
}

.logstyle img {
  margin-top: 90px;
}
</style>
