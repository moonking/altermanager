<template>
  <div class="execute-task">
    <div class="wrapper">
      <div class="info-bar deep-aibms-color-bg">
        <i class="last-task el-icon-arrow-left"></i>
        <div class="taskName">
          {{ build.jobName }}
          <i class="el-icon-time"></i>
        </div>
        <div class="execute-status">
          <span
            class="status-label"
            :class="build.buildStatus |getClass"
          >{{ build.buildStatus | getStatus}}</span>
          <div style="display: inline-block;width: 300px;vertical-align:middle;margin-left: 30px;">
            <StepProgress :present.sync="build.stageNumber" :name.sync="build.stageName"></StepProgress>
          </div>
        </div>
        <div class="execute-info">
          <span class="white-color">执行人：{{ build.createByName }}</span>
          <span class="white-color">总执行时间：{{ build.duration | filterTime}}</span>
        </div>
        <i class="next-task el-icon-arrow-right"></i>
      </div>
      <div class="execute-process deep-aibms-color-bg non-shadow">
        <div>
          <div v-if="isshowactivity" class="process-panel">
            <Workflow @confirm="getId" :activityData="activityData" />
          </div>
        </div>
        <div class="execute-btns">
          <el-button
            type="primary"
            :disabled="build.buildStatus === 'building'"
            @click="goExecute"
            size="small"
          >
            重新开始&nbsp;&nbsp;
            <i class="el-icon-refresh"></i>
          </el-button>
          <el-button
            type="danger"
            :disabled="build.buildStatus !== 'building'"
            @click="stopJob"
            size="small"
          >
            终止&nbsp;&nbsp;
            <i class="el-icon-caret-right"></i>
          </el-button>
        </div>
      </div>
      <div class="execute-desc">
        <el-tabs v-model="tabvalue" @tab-click="handleClick()">
          <el-tab-pane v-for="(item,index) in stages" :name="index+''" :key="index">
            <div slot="label">
              <span style="    padding: 0 10px;">
                <span style="    padding: 0px 10px 0 0;">{{item.name}}</span>
                <img
                  style="    width: 26px;vertical-align: middle;"
                  :src="returnImgSrc(item.status)"
                  alt
                />
              </span>
            </div>
            <div class="inner_content">
              <div ref="log" v-if="item.stageNodes&&item.stageNodes.length>0" class="logstyle">
                <Terminal :printString="item.stageNodes" />
              </div>
              <div v-if="!item.stageNodes" style="text-align: center;" class="logstyle">
                <img src="../../../../static/img/task/20140524124238403.gif" />
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
        <!-- <div
          class="logList"
          v-for="(item,index) in stages"
          :key="index">
          <div class="title" @click="openControler(item)">
            <span class="title-name">{{item.name}}</span>
            <span class=" icon-duo open-icon-style" :style="{transform: item.open ? 'rotate(90deg)' : 'rotate(0deg)'}"></span>
          </div>
          <div class="log-content" v-if="item.open">
            <Terminal :printString="item.stageNodes"/>
          </div>
        </div>-->
      </div>
    </div>
  </div>
</template>
<script>
import StepProgress from './StepProgress.vue';
import Workflow from '../ReleaseWorkflow.vue';
import common from '@/utils/commonjs';
import Terminal from '../../common/Terminal';
import axios from '@/api';
export default {
  name: 'ExecuteTask',
  data () {
    return {
      isclcik: false,
      tabvalue: '0',
      isbl: false,
      isshowactivity: false,
      job: {
        name: null
      },
      build: {},
      builedId: null,
      variableList: [],
      jobDetail: {},
      stages: [],
      activityData: {
        actXml: ''
      },
      urldata: {
        urls: []
      },
      timers2: '',
      currentJenkinsId: ''
    };
  },
  filters: {
    getStatus (val) {
      if (val === 'building' || !val) return '正在执行';
      else if (val === 'SUCCESS') return '执行成功';
      else return '执行失败';
    },
    getClass (val) {
      console.log(val);
      if (val === 'building' || !val) return 'building';
      else if (val === 'SUCCESS') return 'success';
      else return 'fail';
    },
    filterTime (timeStr) {
      return common.timer(timeStr);
    }
  },
  components: {
    StepProgress,
    Workflow,
    Terminal
  },
  created () {
    this.builedId = this.$route.query.builedId;
    this.currentJobId = this.$route.query.jobId;
    this.getJobDetail(1);
    this.currentJenkinsId = this.$route.query.jenkinsId;
  },
  methods: {
    // 返回图片地址
    returnImgSrc (status) {
      return status == 'SUCCESS'
        ? require('../../../../static/img/status_succ.png')
        : status == 'FAILURE' || status == 'ABORTED' || status == 'FAILED'
          ? require('../../../../static/img/status_err.png')
          : status == 'IN_PROGRESS' || status == 'building'
            ? require('../../../../static/img/status_run.png')
            : require('../../../../static/img/status_wait.png');
    },
    handleClick () {
      console.log(this.tabvalue, this.stages[this.tabvalue]);
      this.isclcik = true;
      this.stages.forEach((item, index) => {
        if (this.tabvalue == index) {
          if (item.status == 'IN_PROGRESS' || item.status == 'building') {
            this.isclcik = false;
          }
          this.getlog(item, index);
        }
      });
    },
    getlog (item, index) {
      console.log(item, index);
      let urls = [];
      if (item.stageFlowNodes && item.stageFlowNodes.length > 0) {
        item.stageFlowNodes.forEach(d => {
          urls.push({ url: d._links.log.href });
        });
        this.$set(this.urldata, 'urls', urls);
        this.$set(this.urldata, 'jenkinsId', this.currentJenkinsId);
        axios
          .getstagelog(this.urldata)
          .then(res => {
            console.log(res);
            var stagetext = '';
            res.data.data.forEach(item => {
              stagetext += item.text;
            });
            this.$set(this.stages[index], 'stageNodes', stagetext);
          })
          .catch();
      }
    },
    // websocketlog (item, index) {
    //   getwebstagelog(item)
    //     .then(res => {
    //       var stagetext2 = ''
    //       // this.stages[index].stageNodes = '';
    //       res.data.data.forEach(item => {
    //         // this.stages[index].stageNodes += item.text;
    //         stagetext2 += item.text
    //       });
    //       this.$set(this.stages[index], 'open', false);
    //       this.$set(this.stages[index], 'stageNodes', stagetext2);
    //     })
    //     .catch();
    // },
    getId () {},
    // 清除计时器
    // clearTimers() {
    //   if (this.timers2) {
    //     //如果定时器在运行则关闭
    //     clearInterval(this.timers2);
    //   }
    // },
    getBuildDetail () {
      axios.getBuildDetail(this.builedId).then(data => {
        if (data.data.code === 200) {
          this.build = data.data.data;

          if (this.build) {
            this.getJobDetail(2);
          }
        }
      });
    },
    // websocket接收数据
    handdleMsg (msg) {
      let _this = this;
      _this.$global.ws.onmessage = function (res) {
        console.log(res);
        let socketdata = JSON.parse(res.data).jobTask;
        console.log(socketdata);
        if (socketdata && socketdata.jobId == _this.$route.query.jobId) {
          _this.activityData = {};
          _this.isbl = false;
          _this.$set(_this.activityData, 'actXml', socketdata.actXml);
          let stages = [];
          for (let k of socketdata.stages.stages) {
            let obj = {
              actNodeId: k.actNodeId,
              status: k.status
            };
            stages.push(obj);
          }
          console.log(stages);
          _this.stages = socketdata.stages.stages;
          // _this.stages.forEach((item, index) => {
          //   _this.websocketlog(item, index)
          // })
          _this.changeTabValue('ms');
          let number = socketdata.stages.stageSize;

          _this.$set(_this.build, 'buildStatus', socketdata.buildStatus);
          _this.$set(_this.build, 'duration', socketdata.duration);

          if (socketdata.stages.stages && socketdata.stages.stages.length > 0) {
            _this.$set(_this.activityData, 'stages', stages);
            _this.$set(
              _this.build,
              'jobName',
              socketdata.stages.stages[socketdata.stages.stages.length - 1].name
            );
            _this.$set(
              _this.build,
              'stageName',
              socketdata.stages.stages[socketdata.stages.stages.length - 1].name
            );

            _this.$set(
              _this.build,
              'stageNumber',
              (socketdata.stages.stages.length / number) * 100
            );

            setTimeout(() => {
              _this.isbl = true;
            }, 100);
          } else {
            if (socketdata.actParamList.length > 0) {
              _this.$set(
                _this.build,
                'stageName',
                socketdata.actParamList[0].actNodeName
              );
              _this.$set(
                _this.build,
                'jobName',
                socketdata.stages.stages[socketdata.stages.stages.length - 1]
                  .name
              );
              _this.$set(_this.build, 'stageNumber', 0);
            }
          }
          setTimeout(() => {
            _this.isbl = true;
          }, 100);
        }
      };
    },
    changeTabValue (type) {
      let noInprogress = true;
      let showlast = true;
      if (type) {
        if (this.isclcik) {
          return;
        }
        if (showlast) {
          this.tabvalue = this.stages.length - 1 + '';
          this.getlog(
            this.stages[this.stages.length - 1],
            this.stages.length - 1
          );
        }
      } else {
        if (this.stages.length > 0) {
          for (var i = 0; i < this.stages.length; i++) {
            if (
              this.stages[i].status === 'IN_PROGRESS' ||
              this.stages[i].status === 'building'
            ) {
              noInprogress = false;
              this.tabvalue = i + '';
              this.getlog(this.stages[i], i);
              break;
            }
          }
          if (noInprogress && this.tabvalue == '0') {
            this.getlog(this.stages[0], 0);
            this.tabvalue = '0';
          }
        }
      }
    },
    // 查询执行任务详情
    getJobDetail (num) {
      axios.getJobDetail(this.currentJobId).then(response => {
        console.log(response);
        this.isbl = false;
        this.isshowactivity = false;
        if (response.data.status.index == 200) {
          this.jobDetail = response.data.jobInfo;
          this.build.createByName = this.jobDetail.createName;
          this.build.buildStatus = this.jobDetail.buildStatus;
          let number = this.jobDetail.stages.stageSize;

          if (response.data.xmlStr.length > 0) {
            this.isbl = true;
            this.isshowactivity = true;
            this.activityData.actXml = response.data.xmlStr;
          }
          this.build.stages = this.jobDetail.stages;
          let nodeList = this.jobDetail.actParamList;
          let stages = [],
            detailStages = [];
          // 判断是刚进入执行还是重新执行，对应进行状态处理
          if (num === 1) {
            detailStages = this.jobDetail.stages.stages;
          } else {
            detailStages = [];
          }
          if (detailStages && detailStages.length > 0) {
            for (let k of detailStages) {
              let obj = {
                actNodeId: k.actNodeId,
                status: k.status
              };
              stages.push(obj);
            }
            // this.activityData.stages = [{name:'Task_08d355r',status:'SUCCESS'},{name:'Task_1vhkewg',status:'FAILURE'}]
          } else {
            let obj = {
              actNodeId: nodeList[0].actNodeId,
              status: ''
            };
            stages.push(obj);
          }
          this.activityData.stages = stages;
          if (
            this.build &&
            this.build.stages.stages &&
            this.build.stages.stages.length > 0
          ) {
            let logs = this.build.stages.stages;
            logs.forEach(item => {
              this.$set(item, 'open', false);
            });
            this.stages = logs;
            this.$set(
              this.build,
              'stageName',
              this.build.stages.stages[this.build.stages.stages.length - 1].name
            );
            this.$set(
              this.build,
              'jobName',
              this.build.stages.stages[this.build.stages.stages.length - 1].name
            );
            this.$set(
              this.build,
              'stageNumber',
              (this.build.stages.stages.length / number) * 100
            );
          } else {
            if (this.jobDetail.actParamList.length > 0) {
              this.$set(
                this.build,
                'stageName',
                this.jobDetail.actParamList[0].actNodeName
              );
              this.$set(
                this.build,
                'jobName',
                this.jobDetail.actParamList[0].actNodeName
              );
              this.$set(this.build, 'stageNumber', 0);
            }
          }
          this.changeTabValue();
          this.$nextTick(() => {
            this.handdleMsg('msg');
          });
        } else {
          this.$notify({
            title: '提示',
            message: response.data.status.message,
            type: 'error'
          });
        }
      });
    },
    //    执行任务
    goExecute () {
      axios.buildJob(this.currentJobId).then(data => {
        if (data.data.code == 200) {
          this.builedId = data.data.data.builedId;
          this.getBuildDetail();
          this.stages = [];
        } else {
          this.$notify({
            title: '提示',
            message: data.data.message,
            type: 'error'
          });
        }
      });
    },
    //    终止任务执行
    stopJob (item) {
      axios.stopJob(this.currentJobId).then(data => {
        // console.log(data)
        if (data.data.code === 200) {
          this.getBuildDetail();
          this.$notify({
            title: '提示',
            message: '请求成功！',
            type: 'waring'
          });
        }
      });
    },
    // 控制日志的展开
    openControler (target) {
      target.open = !target.open;
    }
  }
};
</script>
<style scoped>
.execute-task {
  padding: 10px;
}
.execute-info .task-progress_circle {
  top: -12px !important;
}
.wrapper {
  width: 100%;
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
}
.process-panel {
  border: 1px solid #ccc;
  position: relative;
}
.execute-btns {
  padding: 20px 80px;
  text-align: right;
}
.execute-desc {
  background: #eaeaea;
  border-radius: 4px;
  margin-top: 10px;
}
.logList .title {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 28px;
  padding: 5px 0;
  border-bottom: 1px solid #e0e0e0;
}
.logList .title span {
  padding: 0 20px;
  color: #666;
}
.execute-desc .el-collapse-item__header {
  background-color: #ededed;
  padding: 0 20px;
  border: 1px solid #d8d8d8;
}
.execute-desc .el-collapse-item__content {
  background-color: #585858;
  color: #ddd;
  padding: 20px 80px;
}
.logstyle {
  overflow-y: auto;
  height: 400px;
  background: #585858;
  color: #fff;
}
</style>
