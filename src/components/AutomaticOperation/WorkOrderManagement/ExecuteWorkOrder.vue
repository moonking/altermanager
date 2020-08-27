<template>
  <div class="execute-task">
    <div class="execute-task-wrapper">
      <div class="info-bar deep-aibms-color-bg">
        <i class="last-task el-icon-arrow-left"></i>
        <div class="taskName">
          {{ build.name }}
          <i class="el-icon-time"></i>
        </div>
        <div class="execute-status">
          <span class="status-label" :class="build.runStatus | getClass">
            {{
            build.runStatus | getStatus
            }}
          </span>
          <div style="display: inline-block;width: 300px;vertical-align:middle;margin-left: 30px;">
            <StepProgress :present.sync="build.step" :name.sync="build.stageName" />
          </div>
        </div>
        <div class="execute-info">
          <span>执行人：{{ build.userName }}</span>
          <span>总执行时间：{{ build.timeConsum }} s</span>
        </div>
        <i class="next-task el-icon-arrow-right"></i>
      </div>
      <div class="execute-process deep-aibms-color-bg">
        <div class="execute-process-wapper" style="    position: relative">
          <div v-if="isshowactivity" class="process-panel">
            <Workflow :activityData="activityData" />
          </div>
        </div>
        <div class="execute-btns">
          <el-button type="primary" size="small" @click="DownloadLogInfo">控制台输出</el-button>
          <el-button
            type="primary"
            :disabled="build.runStatus === 'building'"
            @click="goExecute"
            size="small"
          >
            重新开始&nbsp;&nbsp;
            <i class="el-icon-refresh"></i>
          </el-button>
          <el-button
            type="danger"
            :disabled="build.runStatus !== 'building'"
            @click="stopJob"
            size="small"
          >
            终止&nbsp;&nbsp;
            <i class="el-icon-caret-right"></i>
          </el-button>
        </div>
      </div>
      <div class="execute-desc">
        <div class="logList" v-for="(item, index) in stages" :key="index">
          <div class="title" @click="openControler(item)">
            <span>
              <!-- <img
                src="../../../../static/img/success.png"
                alt
                class="imgbox"
                v-if="item.status == 'SUCCESS'"
              />-->
              <icon-svg
                v-if="item.status == 'SUCCESS'"
                class="success-operation-color"
                icon-class="zhengque"
              />
              <icon-svg
                v-else-if="item.status == 'FAILURE' || item.runStatus == 'ABORTED'"
                class="task-operation-color"
                icon-class="cuowu"
              />
              <icon-svg
                class="middle-operation-color"
                v-else-if="item.status == 'IN_PROGRESS'"
                icon-class="gengduo"
              />
              <icon-svg v-else icon-class="jinggao" class="gray-icon-color" />
              <span class="title-name">{{ item.name }}</span>
            </span>
            <span
              class="iconfont icon-duo open-icon-style"
              :style="{
                transform: item.open ? 'rotate(90deg)' : 'rotate(0deg)'
              }"
            ></span>
          </div>
          <div class="log-content" v-if="item.open">
            <Terminal :printString="item.stageNodes" />
          </div>
        </div>

        <!-- <el-collapse>
          <el-collapse-item
            v-for="(item,index) in stages"
            :key="index"
          >
            <template slot="title">{{item.name}}</template>
            <div>
              <Terminal v-if="item.stageNodes" :printString="item.stageNodes"/>
            </div>
          </el-collapse-item>
        </el-collapse>-->
      </div>
    </div>
    <el-dialog title="控制台输出" :visible.sync="centerDialogVisible" width="50%" center>
      <el-button
        icon="el-icon-download"
        type="primary"
        size="small"
        @click="downlod()"
        class="downbtn"
      >下载日志</el-button>
      <span class="consolespan" v-html="consoleData"></span>
    </el-dialog>
  </div>
</template>
<script>
import StepProgress from '../../AutomatedRelease/TaskDeployment/StepProgress'
import Workflow from '../pipeline-workflow'
import Terminal from '../../common/Terminal'
import axios from '@/api';
export default {
  name: 'ExecuteTask',
  data () {
    return {
      isbl: false,
      isshowactivity: false,
      job: {
        name: null
      },
      build: {},
      builedId: null,
      buildType: 2,
      buildEntityId: '',
      buildProcInsId: '',
      variableList: [],
      jobDetail: {},
      stages: [],
      activityData: {
        actXml: '',
        nodeParam: '',
        stages: []
      },
      logList: [],
      urldata: {
        urls: []
      },
      timers2: '',
      consoleData: '', // 控制台弹框内的输出
      centerDialogVisible: false, // 控制台弹框的控制
      query: {}
    }
  },
  filters: {
    getStatus (val) {
      if (val === 'building') return '正在执行'
      else if (val === 'SUCCESS') return '执行成功'
      else if (!val) return '等待执行'
      else return '执行失败'
    },
    getClass (val) {
      if (val === 'building') return 'building'
      else if (val === 'SUCCESS') return 'success'
      else if (!val) return 'wait'
      else return 'fail'
    }
  },
  components: {
    StepProgress,
    Workflow,
    Terminal
  },
  watch: {
    $route: {
      handler (val) {
        this.query = val.query
      }
    }
  },
  created () {
    this.query = this.$route.query
    this.getBuildDetail()
  },
  methods: {
    // 查看日志
    DownloadLogInfo () {
      let data = {
        businessId: this.builedId,
        businessType: this.buildType
      }
      axios.downloadLogInfo(data).then(res => {
        this.consoleData = res.data.data
        this.centerDialogVisible = true
      })
    },
    // 下载日志
    downlod () {
      // var buildId = this.$route.query.builedId;
      this.$confirm('确认下载?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          window.open(
            axios.DevopsUrl() +
            'tool/downloadLog?businessId=' +
            this.builedId +
            '&businessType=' +
            this.buildType,
            '_self'
          )
        })
        .catch(() => { })
    },
    // 获取详情
    getBuildDetail () {
      const query = this.query || {}
      this.buildType = query.logId ? 2 : query.pipelineLogId ? 3 : 4
      if (query.pipelineLogId || query.templateLogId) {
        let buildType = query.pipelineLogId ? 3 : 4
        this.builedId = query.pipelineLogId || query.templateLogId
        axios.getpipelineLogDetail(this.builedId, buildType).then(res => {
          if (res.data.success) {
            this.isshowactivity = true
            this.build = res.data.data
            this.build.timeConsum = 0
            // if (res.data.data.runStatus !== "building") {
            //   this.$router.push({
            //     path: "/AutomaticOperation/LogDetail",
            //     query: {
            //       code: 4,
            //       type: buildType,
            //       logId: res.data.data.logId,
            //       key: "detail"
            //     }
            //   });
            //   return;
            // }
            this.initDataHandle(res)
            if (res.data.data.runStatus !== 'building') {
              this.$nextTick(() => {
                this.$global.wsdevops.onmessage = this.websocketDataHandle
              })
            }
          }
        })
      } else if (query.logId && query.logId !== '') {
        this.builedId = query.logId
        axios.getLogDetail(this.builedId).then(res => {
          if (res.data.success) {
            this.isshowactivity = true
            this.build = res.data.data
            this.build.timeConsum = 0
            // if (res.data.data.runStatus !== "building") {
            //   this.$router.push({
            //     path: "/AutomaticOperation/LogDetail",
            //     query: {
            //       code: 4,
            //       type: 1,
            //       logId: res.data.data.logId,
            //       key: "detail"
            //     }
            //   });
            //   return;
            // }
            this.initDataHandle(res)
            if (res.data.data.runStatus !== 'building') {
              this.$nextTick(() => {
                this.$global.wsdevops.onmessage = this.websocketDataHandle
              })
            }
          }
        })
      }
    },
    initDataHandle (res) {
      let query = this.$route.query || {}
      if (res && res.data && res.data.data) {
        let workflowData = {}
        let size = 0
        let stepName
        let status = []
        let resultArr = []
        let data = res.data.data
        let nodeparams =
          (query.templateLogId
            ? data.pipeLineNodeparams
            : data.nodeparamLogs) || []
        this.buildEntityId = query.logId
          ? data.jobId
          : query.pipelineLogId
            ? data.pipelineId
            : data.tempId
        this.buildProcInsId = data.procInsId
        for (let k of nodeparams) {
          let obj = {}
          let info
          obj['actNodeId'] = k.actNodeId
          if (data.runStatus !== 'building') {
            info = this.handleNodeInfo(k)
            obj['status'] = info.status
            let log = {
              open: false,
              stageNodes: info.log,
              status: info.status,
              name: k.actNodeName
            }
            resultArr.push(log)
            if (info.status === 'SUCCESS') {
              stepName = k.actNodeName
              size++
            }
          } else {
            obj['status'] = ''
          }
          status.push(obj)
        }
        this.stages = resultArr
        workflowData['actXml'] = data.actXml
        workflowData['nodeParam'] = nodeparams
        if (data.runStatus === 'building') {
          let initStatus = {
            actNodeId: nodeparams.sort((prev, next) => prev.sort - next.sort)[0]
              .actNodeId,
            status: 'building'
          }
          status = [initStatus]
        }

        workflowData['stages'] = status
        this.activityData = workflowData
        this.build.step = (size / nodeparams.length) * 100
        // this.build.stageName = this.getSortedNodeParam()[0].actNodeName;
        this.build.stageName =
          stepName || this.getSortedNodeParam()[0].actNodeName
      }
    },
    getInitNodeStatusList () {
      const stages = JSON.parse(JSON.stringify(this.activityData.nodeParam))
      stages.sort((prev, next) => prev.sort - next.sort)
      let result = []
      for (let i = 0; i < stages.length; i++) {
        let obj = {
          actNodeId: stages[i].actNodeId,
          status: stages[i].runStatus
        }
        result.push(obj)
      }
      return result
    },
    setWorkflowStage (list) {
      if (!(list && list.length)) {
        return
      }
      list = list.filter(item => {
        return item !== null && item.actNodeId
      })
      // 获取流水线节点状态初始化列表
      let initList = this.getInitNodeStatusList()
      list.forEach(node => {
        initList.forEach(item => {
          // if (!(item.actNodeId) && item.logId) {
          // }
          if (item.actNodeId === node.actNodeId && item.status !== 'FAILURE') {
            item.status = node.runStatus
          }
        })
      })
      return initList.splice(0, list.length)
    },
    // 设置执行日志
    setExecuteLog (list) {
      let result = []
      let nodeParams = this.activityData.nodeParam
      let exceptionLog = {}
      for (let i = 0; i < list.length; i++) {
        let stage = { name: '', stageNodes: '' }
        if (!list[i].actNodeId) {
          exceptionLog = {
            name: '执行终止',
            stageNodes: list[i].runStatus || ''
          }
          continue
        }
        let isExist = false
        for (let j = 0; j < nodeParams.length; j++) {
          if (list[i].actNodeId === nodeParams[j].actNodeId) {
            stage = {
              name: nodeParams[j].actNodeName,
              actNodeId: list[i].actNodeId,
              sort: nodeParams[j].sort,
              open: false,
              stageNodes:
                (list[i].ipAddress ? list[i].ipAddress + ': \n' : '') +
                (list[i].runResult || '') +
                '\n'
            }
          }
        }
        result.forEach(item => {
          if (item.actNodeId === stage.actNodeId) {
            isExist = true
            item.stageNodes += stage.stageNodes
          }
        })
        if (!isExist) {
          result.push(stage)
        }
        isExist = false
      }
      result.sort((prev, next) => prev.sort - next.sort)
      exceptionLog.name && result.push(exceptionLog)
      return result
    },
    // 设置当前执行步骤名称
    setCurrentStepName (list) {
      let nodes = this.activityData.nodeParam
      // let size = 0
      let count = 0
      if (list.length === 0) {
        this.build.stageName = this.getSortedNodeParam()[0].actNodeName
        return
      }
      for (let i = list.length - 1; i >= 0; i--) {
        for (let j = 0; j < nodes.length; j++) {
          if (list[i].actNodeId === nodes[j].actNodeId) {
            if (list[i].runStatus === 'SUCCESS') {
              this.build.stageName =
                j + 1 < nodes.length
                  ? nodes[j + 1].actNodeName
                  : nodes[nodes.length - 1].actNodeName
              // size = nodes[j].sort
              count += 1
            }
          }
        }
      }
      this.build.step = (count / nodes.length) * 100
    },
    // 获取排序后nodeParam
    getSortedNodeParam () {
      return this.activityData.nodeParam.sort(
        (prev, next) => prev.sort - next.sort
      )
    },
    websocketDataHandle (res) {
      const data = JSON.parse(res.data) || {}
      const query = this.$route.query || {}
      const logId = query.logId || query.pipelineLogId || query.templateLogId
      let resultLog = data.nodeExecutLogList
      resultLog = resultLog.filter(item => item !== null)
      if (logId && logId === data.logId) {
        for (let i = 0; i < resultLog.length; i++) {
          if (!(resultLog[i] && resultLog[i].actNodeId)) {
            continue
          }
          // 设置时间
          if (resultLog[i].runStatus === 'SUCCESS') {
            let existStages = this.activityData.stages
            for (let j = 0; j < existStages.length; j++) {
              if (
                existStages[j].actNodeId === resultLog[i].actNodeId &&
                !(
                  existStages[j].status === 'SUCCESS' ||
                  existStages[j].status === 'FAILURE'
                )
              ) {
                this.build.timeConsum += Number(resultLog[i].timeConsum)
              }
            }
          }
          // 更新执行步骤进度条
          // if (resultLog[i].runStatus === 'SUCCESS') {
          //   let nodeParams = this.getSortedNodeParam()
          //   for (let j = 0; j < nodeParams.length; j++) {
          //     if (resultLog[i].actNodeId === nodeParams[j].actNodeId) {

          //     }
          //   }
          // }
        }
        // 设置执行步骤
        let status = this.setWorkflowStage(resultLog) || []
        // 设置每个节点执行状态
        if (status.length !== 0) {
          this.activityData.stages = status
        }
        // 应用当前ws推送的 stepName
        this.setCurrentStepName(resultLog)
        // 更新执行日志
        this.stages = this.setExecuteLog(resultLog)
        // 设置当前执行进度
        // this.build.step = (size / nodes.length) * 100
        // 更新流水线状态
        if (data.runStatus === 'SUCCESS' || data.runStatus === 'FAILURE') {
          // this.build.timeConsum = time
          this.build.runStatus = data.runStatus
        }
      }
      // this.$set(this.workflowData, 'stages', status.length ? status : [])
    },
    //    执行任务
    goExecute (e) {
      axios.executeWorkflow({
        businessType: this.buildType + '',
        businessId: this.buildEntityId
      }).then(res => {
        if (res.data.status && res.data.status.success) {
          let typeIdName =
            this.buildType === 2
              ? 'logId'
              : this.buildType === 3
                ? 'pipelineLogId'
                : 'templateLogId'
          let routerQuery = {
            code: 4,
            [typeIdName]: res.data.logId,
            key: 'detail'
          }
          this.$router.replace({
            path: '/AutomaticOperation/ExecuteWorkOrder',
            query: routerQuery
          })
          this.query = routerQuery
          this.getBuildDetail()
          this.stages = []
          this.build = {}
        } else {
          this.$notify({
            title: '错误',
            message: res.data.message,
            type: 'error'
          })
        }
      })
    },
    //    终止任务执行
    stopJob (item) {
      axios.stopExecuteWorkflow(this.buildProcInsId).then(res => {
        console.log(res)
      })
      // stopExecuting(this.currentJobId).then(data => {
      //   if (data.data.code === 200) {
      //     this.getBuildDetail();
      //     this.$notify({
      //       title: '提示',
      //       message: '请求成功！',
      //       type: 'waring'
      //     });
      //   }
      // });
    },
    // 点击展开
    openControler (ele) {
      ele.open = !ele.open
    },
    // 处理进入时的状态及日志信息
    handleNodeInfo (info) {
      let status
      let log = ''
      for (let k of info.nodeResult) {
        status = k.runStatus
        log += `[${k.ipAddress}] ${k.runResult} \r\n`
      }
      return {
        status,
        log
      }
    }
  }
}
</script>
<style scoped>
.execute-task {
  padding: 10px;
}
.execute-info .task-progress_circle {
  top: -12px !important;
}
.execute-task-wrapper {
  width: 100%;
  overflow: visible;
}
.info-bar {
  width: 100%;
  height: 48px;
  line-height: 48px;
  padding: 0 20px;
  background-color: #fff;
  box-sizing: border-box;
  color: #666;
  margin-bottom: 20px;
}
.last-task,
.taskName,
.execute-status,
.execute-info {
  float: left;
  margin-right: 20px;
}
.next-task {
  float: right;
}
.last-task,
.next-task {
  display: block;
  line-height: 48px;
  font-size: 18px;
  cursor: pointer;
}
.last-task:hover,
.next-task:hover {
  color: #409eff;
}
.taskName {
  margin-right: 40px;
}
.execute-status {
  margin-right: 60px;
}
.execute-status .status-label {
  display: inline-block;
  font-size: 14px;
  color: #999;
  vertical-align: middle;
}
.execute-status .status-label {
  width: 58px;
  height: 20px;
  line-height: 20px;
  text-align: center;

  color: #fff;
  border-radius: 2px;
  font-size: 12px;
}
.execute-status .status-label.success {
  /* background-color: rgba(0, 102, 255, 0.3);
    color: #0066ff; */
  background-color: #c8ebd4;
  color: #49bc71;
}
.execute-status .status-label.fail {
  background-color: rgba(255, 0, 0, 0.3);
  color: #ff0000;
}
.execute-status .status-label.building {
  background-color: rgba(255, 155, 0, 0.3);
  color: #ff9b00;
}
.execute-status .status-label.wait {
  background-color: rgba(211, 211, 211, 0.3);
  color: #d3d3d3;
}
.execute-status .excute-bar {
  width: 260px;
  height: 6px;
  background-color: #f1f1f1;
  border-radius: 3px;
  margin-left: 10px;
  position: relative;
  top: 0;
  left: 0;
}
.excute-bar .dot {
  display: block;
  width: 10px;
  height: 10px;
  background-color: rgb(14, 167, 60);
  border-radius: 50%;
  position: absolute;
  top: -2px;
  right: 0;
}
.execute-info {
  font-size: 14px;
  color: #999;
}
.execute-info > span {
  margin-right: 10px;
}
.execute-process {
  background-color: #fff;
  margin: 0 auto;
}
.execute-process-wrapper {
  margin: 0 auto;
}
.process-panel {
  border: 1px solid #ccc;
}
.execute-btns {
  padding: 20px;
  text-align: right;
}
.execute-desc {
  background: #eaeaea;
  border-radius: 4px;
  margin-top: 10px;
}
.open-icon-style {
  color: #777;
}
.logList .title {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 28px;
  padding: 5px 0;
  border-bottom: 1px solid #e0e0e0 !important;
}
.logList .title:last-child {
  border: 0;
}
.logList .title span {
  padding: 0 20px;
  color: #666;
}
</style>
<style>
.execute-desc .el-collapse-item__header {
  background-color: #ededed;
  padding: 0 20px;
  border: 1px solid #d8d8d8;
}
.execute-desc .el-collapse-item__content {
  /* background-color: #585858;
  color: #ddd; */
  min-height: 40px;
  padding: 10px;
}
.execute-result {
  white-space: pre-wrap;
}
.downbtn {
  float: right;
  margin-bottom: 10px;
}
.imgbox {
  width: 20px;
  height: 20px;
  vertical-align: middle;
}
</style>
