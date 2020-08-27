<template>
  <div class="deploy">
    <div class="deploy-title deep-aibms-color-bg non-border non-shadow">
      <div style="    display: inline-block;width: 50%;">{{jobName}}</div>
      <div class="execute-btns" style="    display: inline-block;float: right;">
        <el-button
          type="primary"
          :disabled="socketdata.buildStatus === 'building'"
          @click="goExecute"
          size="small"
        >
          重新开始&nbsp;&nbsp;
          <i class="el-icon-refresh"></i>
        </el-button>
        <el-button
          type="danger"
          :disabled="socketdata.buildStatus !== 'building'"
          @click="stopJob"
          size="small"
        >
          终止&nbsp;&nbsp;
          <i class="el-icon-caret-right"></i>
        </el-button>
      </div>
    </div>
    <ul class="column special non-border">
      <li class="aibms-color-bg non-border">执行状态</li>
      <li class="aibms-color-bg non-border">执行次数</li>
      <li class="aibms-color-bg non-border">执行用户</li>
      <li class="aibms-color-bg non-border">启动时间</li>
      <li class="aibms-color-bg non-border">持续时间</li>
      <li class="aibms-color-bg non-border">操作</li>
    </ul>

    <el-collapse accordion @change="getstagelog" class="non-border">
      <el-collapse-item v-for="(item,index) in job" :key="index">
        <template slot="title">
          <ul class="column">
            <li>
              <!-- <img
                v-if="item.buildStatus == 'SUCCESS'"
                src="../../../../static/img/exec_success.png"
                alt
              />-->
              <icon-svg
                v-if="item.buildStatus == 'SUCCESS'"
                icon-class="zhengque"
                class="implement-right-icon"
              />
              <icon-svg
                v-else-if="item.buildStatus == 'FAILURE'||item.buildStatus == 'ABORTED'"
                icon-class="cuowu"
                class="error-right-icon"
              />
              <!--<i  style="font-size: 28px" v-else-if ="item.buildStatus == 'building'" class="el-icon-loading"></i>-->
              <img v-else src="../../../../static/img/task/20140524124238403.gif" alt />
            </li>
            <li>{{ item.builedNumber }}</li>
            <li>{{ item.createByName }}</li>
            <li>{{ item.createDate }}</li>
            <li>{{ item.duration | filterTime}}</li>
            <li>
              <!--<span @click.stop="stopJob(item)" v-if="item.buildStatus === 'building'">终止 <img  class="icon" src="../../../../static/img/stop.png" alt=""></span>-->
              <span @click="logDetailBtn(item.builedId,item)">查看详情</span>
            </li>
          </ul>
        </template>
        <div class="panel_block">
          <ul class="panel_block-info" v-for="(variable,index) in item.variableList" :key="index">
            <li>参数：{{ variable.name }}</li>
            <li>参数值：{{ variable.value }}</li>
            <li>类型：{{ variable.type }}</li>
            <li>参数说明: {{ variable.explain }}</li>
          </ul>
        </div>
      </el-collapse-item>
    </el-collapse>
    <div class="page-limit" style="text-align:center;margin-top:92px">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currPage"
        :page-sizes="[10,30,50]"
        layout="prev, pager, next, sizes, total, jumper"
        :total="total"
        v-if="total"
        style="margin-right:15px;cursor: pointer;"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import axios from '@/api';
import common from '@/utils/commonjs'
export default {
  name: 'DeployLog',
  data () {
    return {
      job: {
        name: null
      },
      currentJobId: null,
      variableList: [],
      currPage: 1,
      size: 10,
      size2: 1000,
      total: 0,
      socketdata: {},
      jobName: ''
    }
  },
  created () {
    this.currentJobId = this.$route.query.jobId
    this.job = {}
    this.getDeployLog()
    this.$nextTick(() => {
      this.handdleMsg('msg')
    })
  },
  filters: {
    filterTime (timeStr) {
      return common.timer(timeStr)
    }
  },
  methods: {
    // websocket接收数据
    handdleMsg (msg) {
      // console.log(this.$global.ws);
      // if (this.$global.ws && this.$global.ws.readyState == 1) {
      // console.log('发送信息', msg);
      //   this.$global.ws.send(msg);
      // }
      // let _this = this;
      // _this.$global.wspipeline.onmessage = function (res) {
      //   console.log(res)
      //   _this.isbl = false;
      //   this.socketdata = JSON.parse(res.data);
      //   if (
      //     this.socketdata.buildStatus != 'building' &&
      //     this.socketdata.jobId == this.$route.query.jobId
      //   ) {
      //     this.getDeployLog();
      //   }
      // };
    },
    // 分页
    handleCurrentChange (val) {
      this.currPage = val
      this.getDeployLog()
      // this.getBackspaceList();
    },
    handleSizeChange (val) {
      this.size = val
      this.getDeployLog()
      // this.getBackspaceList();
    },
    // 获取stage详情
    getstagelog (val) {
      console.log(val)
    },
    // 获取部署任务参数
    getNodeParam (index) {
      let data = {
        current: this.currPage,
        size: this.size2,
        jobId: this.currentJobId,
        actNodeId: ''
      }
      axios.getNodeParam(data).then(response => {
        if (response.data.code === 200) {
          let tmpArr = []
          response.data.data.records.forEach(item => {
            tmpArr = tmpArr.concat(common.evil(item.inputParam))
          })

          this.$set(this.job[index], 'variableList', tmpArr)
        } else {
          this.$notify({
            title: '提示',
            message: response.data.message,
            type: 'error'
          })
        }
      })
    },
    getDeployLog () {
      let data = {
        current: this.currPage,
        size: this.size,
        jobId: this.currentJobId
      }
      axios.getDeployLog(data).then(data => {
        console.log(data)
        if (data.data.code == 200) {
          this.job = {}
          this.job = data.data.data.records
          this.jobName = this.job[0].jobName
          this.job.forEach((item, index) => {
            this.getNodeParam(index)
          })
          this.total = parseInt(data.data.data.total)
        }
      })
    },
    //    执行任务
    goExecute (e) {
      axios.buildJob(this.currentJobId).then(data => {
        if (data.data.code == 200) {
          this.$notify({
            title: '开始执行',
            message: data.data.message,
            type: 'success'
          })
          this.getDeployLog()
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
        // console.log(data)
      })
    },
    // 跳转查看执行日志
    logDetailBtn (id, di) {
      console.log(id, di)
      this.$router.push({
        path: '/AutomatedRelease/logDetail',
        query: {
          jenkinsId: di.jenkinsId,
          code: 3,
          builedId: id,
          jobId: this.currentJobId,
          type: '1',
          plantype: '2',
          builedNumber: di.builedNumber
        }
      })
    }
  }
}
</script>

<style scoped>
.panel_block-info {
  display: flex;
  width: 100%;
  box-sizing: border-box;
  padding: 0 50px;
}
.panel_block-info li {
  flex: 1;
  line-height: 50px;
  text-align: center;
}
.column {
  display: flex;
  width: 100%;
  border-bottom: 1px solid #ccc;
}
.column img {
  height: 24px;
  top: 10px;
  position: relative;
}
.column img.icon {
  vertical-align: text-bottom;
  height: 16px;
  top: 0;
  margin-right: 8px;
}
.panel_block {
  /*border-top: 1px solid #ccc*/
}
.column.special {
  padding-right: 21px;
  box-sizing: border-box;
  margin-top: 30px;
}
.column li {
  flex: 1;
  text-align: center;
  line-height: 50px;
  border-right: 1px solid #ccc;
}
.column.special li {
  color: #909399;
  font-size: 14px;
  font-weight: 700;
  background: rgb(230, 230, 230);
}
.column li + li {
}
.block {
  padding: 20px 0;
  text-align: center;
}
.deploy {
  padding: 10px;
}
.deploy-title {
  color: #3e444a;
  border: 1px solid #f0f0f0;
  background: #ffffff;
  line-height: 40px;
  padding: 0 20px;
  box-shadow: 0 0 4px rgba(255, 255, 255, 0.16);
}
.deploy-waring {
  color: #3e444a;
  font-size: 14px;
  line-height: 40px;
  padding: 0 0 0 20px;
}
.deploy-waring img {
  vertical-align: text-bottom;
  margin-right: 10px;
}
span.deploy-btn {
  display: inline-block;
  background: #0066ff;
  border: 1px solid #0066ff;
  line-height: 24px;
  padding: 0 20px;
  border-radius: 5px;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  float: right;
  margin: 10px 3px;
}
</style>
