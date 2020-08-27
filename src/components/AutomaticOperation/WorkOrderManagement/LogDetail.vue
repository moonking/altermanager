<template>
  <div class="mian">
    <div class="top deep-aibms-color-bg">
      <img src="../../../../static/img/left.jpg" alt class="simgbox ti" />
      <div style="float:left;margin:0 10px;">
        <span style="margin-right:20px">{{logDetailData.name}}</span>
        <span v-if="logDetailData.runStatus =='SUCCESS'" class="success2">执行成功</span>
        <span
          v-if="logDetailData.runStatus =='FAILURE'||logDetailData.runStatus =='ABORTED'"
          class="falie"
        >执行失败</span>
        <span v-if="logDetailData.runStatus =='building'" class="runing">正在执行</span>
        <span v-if="logDetailData.runStatus =='PAUSED_PENDING_INPUT'" class="waiting">等待执行</span>
      </div>
      <div class="step" v-if="isshow">
        <StepProgress :present="step" :name="stepName"></StepProgress>
      </div>
      <div style="float:left;margin-left:20px;color:#777">
        <span>执行人：</span>
        <span>{{logDetailData.userName}}</span>
        <span style="margin-left:10px;display:inline-block">共执行时间：</span>
        <span>{{logDetailData.timeConsum}}s</span>
      </div>
      <img src="../../../../static/img/shouqi.jpg" alt class="simgbox left" />
      <div class="clear"></div>
    </div>
    <div class="block-content" style="overflow: visible;padding-left:0;position: relative;">
      <div v-if="isshowactivity" style="border: 1px solid #ccc;  " class="workfollow">
        <Workflow :activityData="activityData" />
      </div>
      <div class="execute-btn">
        <el-button type="primary" size="small" @click="DownloadLogInfo">控制台输出</el-button>
        <el-button
          type="primary"
          :disabled="logDetailData.runStatus === 'building'"
          @click="goExecute"
          size="small"
        >
          重新开始&nbsp;&nbsp;
          <i class="el-icon-refresh"></i>
        </el-button>
        <el-button
          type="danger"
          :disabled="logDetailData.runStatus !== 'building'"
          @click="stopJob"
          size="small"
        >
          终止&nbsp;&nbsp;
          <i class="el-icon-caret-right"></i>
        </el-button>
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
    <div class="logdetail">
      <ul>
        <li v-for="(item,index) in logList" :key="index">
          <div class="logcontainer" @click="showHide(item,index)">
            <img
              src="../../../../static/img/success.png"
              alt
              class="imgbox success"
              v-if="item.runStatus == 'SUCCESS'"
            />
            <img
              src="../../../../static/img/refuse.png"
              alt
              class="imgbox success"
              v-else-if="item.runStatus == 'FAILURE' || item.runStatus == 'ABORTED'"
            />
            <img
              src="../../../../static/img/run.jpg"
              alt
              class="imgbox success"
              v-else-if="item.runStatus == 'IN_PROGRESS'"
            />
            <img src="../../../../static/img/alert.png" alt class="imgbox success" v-else />
            <div class="information">
              <span>{{item.actNodeName}}</span>
            </div>
            <div class="clear"></div>
            <img src="../../../../static/img/shouqi.jpg" alt class="xiala close" v-if="!item.open" />
            <img src="../../../../static/img/zhankai.jpg" alt class="xiala" v-if="item.open" />
          </div>
          <div class="shell" v-if="item.open">
            <Terminal :printString="item.resStr" />
            <!-- <ul>
              <li v-for="(log, index) in item.resArr" :key="index">
                <h4>{{log.ipAddress}}</h4>
                <p v-html="log.runResult"></p>
              </li>
            </ul>-->
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import StepProgress from '../../AutomatedRelease/TaskDeployment/StepProgress'
import Workflow from '../pipeline-workflow'
import Terminal from '../../common/Terminal'
import axios from '@/api';
export default {
  data () {
    return {
      consoleData: '',
      centerDialogVisible: false,
      step: 0,
      stepName: '',
      businessId: '',
      logDetailData: {
        name: '',
        userName: '',
        runStatus: '',
        timeConsum: ''
      },
      systemName: '',
      logList: [],
      isshow: true,
      isshowactivity: true,
      activityData: {},
      detailData: [],
      actXml: ''
    }
  },
  props: {
    detailId: {
      type: String
    },
    source: {
      // 该字段标识是从来源 1--工单
      type: String
    }
  },
  components: {
    StepProgress,
    Workflow,
    Terminal
  },
  created () {
    if (this.source === '1') {
      this.workOrderDetail(this.detailId, this.source)
    }
    if (this.source === '3' || this.source === '4') {
      this.workOrderDetail2(this.detailId, this.source)
    }
  },
  mounted () {
    this.$global.wsdevops.onmessage = this.handleWebsocketData
  },
  methods: {
    // 查看日志
    DownloadLogInfo () {
      let data = {
        businessId: this.businessId,
        businessType: this.source === '1' ? 2 : this.source
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
            this.businessId +
            '&businessType=' +
            (this.source === '1' ? 2 : this.source),
            '_self'
          )
        })
        .catch(() => { })
    },
    // 终止执行
    // _stopExecuteWorkflow() {
    //   stopExecuteWorkflow(this.detailId).then(data => {

    //   })
    // },
    handleWebsocketData (msg) {
      const data = JSON.parse(msg.data) || {}
      const query = this.$route.query || {}
      const logId = query.logId || query.pipelineLogId || query.templateLogId
      const resultLog = data.nodeExecutLogList
      const nodes = data.jobNodeparams || data.pipeLineNodeparams
      let status = []
      let stepName = ''
      let resultArr = []
      let time = 0
      let obj = {}
      let size = 0
      if (logId && logId === data.logId) {
        let allCount = this.handleChildData(nodes, resultLog)

        this.handleStage(allCount, status, size, stepName, time, resultArr)
        // if (resultArr.length > 0) {
        //   this.$set(resultArr[0], 'open', true);
        // }
        obj['actXml'] = this.actXml
        obj['nodeParam'] = nodes
        obj['stages'] = resultLog.length > 0 ? status : status.slice(0, 1)
        this.logList = resultArr
        this.activityData = obj
        this.logDetailData.timeConsum = time
        this.stepName = stepName
        this.step = (parseInt(size) / parseInt(allCount.length)) * 100
      }
    },
    // 处理节点--多个资源的结果按照节点顺序处理
    handleChildData (nodes, resultLog) {
      let allCount = []
      for (let m of nodes) {
        let obj = {
          actNodeId: m.actNodeId,
          actNodeName: m.actNodeName,
          resArr: [],
          resNum: 0 // 根据该数值进行每个节点状态的判断
        }
        for (let n of resultLog) {
          if (m.actNodeId === n.actNodeId) {
            this.$set(n, 'actNodeName', m.actNodeName) // 获取名称并set
            obj.resArr.push(n)
            if (n.runStatus === 'SUCCESS') {
              obj.resNum += 1 // 成功时数值加 1
            } else if (n.runStatus === 'FAILURE') {
              obj.resNum += 0 // 失败时数值加 0
            } else if (n.runStatus === 'NOTEXECUTED') {
              obj.resNum += -100 // 关系不匹配
            } else {
              obj.resNum += 2 //  building状态时数值加 2
            }
          }
        }

        allCount.push(obj)
      }

      return allCount
    },
    // 根据处理好的节点信息来获得需要信息
    handleStage (allCount, status, size, stepName, time, resultArr) {
      for (let k of allCount) {
        let state =
          k.resNum === k.resArr.length && k.resArr.length !== 0
            ? 'SUCCESS'
            : k.resNum < k.resArr.length &&
              k.resArr.length !== 0 &&
              k.resNum >= 0
              ? 'FAILURE'
              : k.resNum < 0 && k.resArr.length !== 0
                ? 'NOTEXECUTED'
                : ''
        // 根据resNUm值来判断每个节点的状态
        let stage = {
          actNodeId: k.actNodeId,
          status: state
        }
        if (k.resArr.length > 0) {
          status.push(stage)
        }
        // 获取成功的总次数次数及每一步对应名称
        if (k.resNum === k.resArr.length && k.resArr.length > 0) {
          size++
          stepName = k.actNodeName
        }
        // 输出的控制，第一个及失败初始打开状态
        // if (state == 'SUCCESS') {
        //   this.$set(k, 'open', false);
        // } else if (state == 'FAILURE') {
        //   this.$set(k, 'open', true);
        // } else {
        this.$set(k, 'open', false)
        // }
        let newObj = {
          actNodeName: k.actNodeName,
          resArr: [],
          runStatus: state,
          open: k.open,
          resStr: ''
        }
        for (let op of k.resArr) {
          time += parseInt(op.timeConsum) // 获取总时长
          newObj.resArr.push(op)
          newObj.resStr += `[${op.ipAddress}]:\n${op.runResult} \n \n`
        }
        resultArr.push(newObj)
      }
    },
    // 工单详情
    workOrderDetail (id, source) {
      axios.getLogDetail(id).then(res => {
        if (res.data.code === 200) {
          let data = res.data.data
          this.handleCommonData(data, source)
        }
      })
    },
    // 流水线及模板详情
    workOrderDetail2 (id, source) {
      axios.getpipelineLogDetail(id, source).then(res => {
        if (res.data.code === 200) {
          let data = res.data.data
          this.handleCommonData(data, source)
        }
      })
    },
    // 数据处理
    handleCommonData (data, source) {
      let obj = {}
      let size = 0
      let jobs
      let stepName = ''
      // let time;
      let status = []
      let resultArr = []
      if (source === '1' || source === '3') {
        // 3是流水线  4是公共模板
        jobs = data.nodeparamLogs
        this.businessId = data.logId
      } else {
        jobs = data.pipeLineNodeparams
      }
      this.actXml = data.actXml
      for (let k in jobs) {
        let obj = {}
        let node = jobs[k].nodeResult
        let countNum = 0
        let allRes = {
          actNodeName: jobs[k].actNodeName,
          resArr: [],
          open: '',
          runStatus: '',
          resStr: ''
        }
        obj['actNodeId'] = jobs[k].actNodeId
        if (node.length > 0) {
          for (let n of node) {
            // time += parseInt(n.timeConsum);
            this.$set(n, 'actNodeName', jobs[k].actNodeName)
            if (n.runStatus === 'SUCCESS') {
              countNum += 1
            } else if (n.runStatus === 'FAILURE') {
              countNum += 0
            } else if (n.runStatus === 'NOTEXECUTED') {
              countNum += -100
            } else {
              countNum += 2
            }
            allRes.resStr += `[${n.ipAddress}]:\n${n.runResult} \n \n`
            allRes.resArr.push(n)
          }
          if (countNum === node.length && node.length !== 0) {
            obj['status'] = 'SUCCESS'
            allRes.runStatus = 'SUCCESS'
            size++
            stepName = jobs[k].actNodeName
          } else if (
            countNum < node.length &&
            node.length !== 0 &&
            countNum >= 0
          ) {
            obj['status'] = 'FAILURE'
            allRes.runStatus = 'FAILURE'
            // allRes.open = true;
          } else if (countNum < node.length && countNum < 0) {
            obj['status'] = 'NOTEXECUTED'
            allRes.runStatus = 'NOTEXECUTED'
            // allRes.open = true;
          }
          allRes.open = false
          status.push(obj)
        }
        // if (k == 0) {
        //   allRes.open = true;
        // }
        resultArr.push(allRes)
      }
      this.logList = resultArr
      obj['actXml'] = data.actXml
      obj['nodeParam'] = jobs
      obj['stages'] =
        data.runStatus === 'building' ? status.slice(0, 1) : status
      this.activityData = obj
      this.step = (size / jobs.length) * 100
      this.stepName = stepName
      this.logDetailData = data
      // this.logDetailData.timeConsum = time;
      if (data.runStatus === 'building') {
        this.logDetailData.timeConsum = 0
        this.stepName = ''
      }
    },
    showHide (list) {
      list.open = !list.open
    },
    //    执行任务
    goExecute (e) {
      axios.executeWorkflow({
        businessType: this.source === 3 ? 3 : this.source === 4 ? 4 : 2,
        businessId: this.logDetailData[this.source === 3 ? 'pipelineId' : this.source === 4 ? 'templateLogId' : 'jobId']
      }).then(res => {
        if (res.data.status && res.data.status.success) {
          let typeIdName =
            this.source === 3
              ? 'pipelineLogId'
              : this.source === 4
                ? 'templateLogId'
                : 'logId'
          this.$router.push({
            path:
              this.source === 3
                ? '/AutomaticOperation/ExecutePipeLine'
                : this.source === 4
                  ? '/AutomaticOperation/ExecuteTemplate'
                  : '/AutomaticOperation/ExecuteWorkOrder',
            query: {
              code: 4,
              [typeIdName]: res.data.logId
            }
          })
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
      axios.stopJob(this.currentJobId).then(data => {
        // console.log(data)
        if (data.data.code === 200) {
          this.getBuildDetail()
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
.clear {
  clear: both;
}
.logdetail {
  margin-top: 20px;
  font-size: 14px;
}
.logcontainer {
  height: 40px;
  position: relative;
  line-height: 40px;
  /* background: red; */
  background: #eaeaea;
  border-bottom: 1px solid #e0e0e0 !important;
}
.logcontainer:last-child {
  border: 0;
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
  height: 9px;
  width: 13px;
  cursor: pointer;
}
.information {
  position: absolute;
  left: 60px;
}
.shell {
  /* padding: 20px 30px;
  background: #585858; */
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
  margin-top: 20px;
}
.execute-btn {
  padding: 20px 0 20px 20px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
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
/* .workfollow {
  height: 300px !important;
  overflow: hidden;
}
.workfollow /deep/ .containers {
  margin-top: -90px !important;
} */
.close {
  width: 9px;
  height: 13px;
}
.downbtn {
  float: right;
  margin-bottom: 10px;
}
.consolespan {
  display: inline-block;
}
</style>
