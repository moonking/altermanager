<template>
  <div>
    <div class="container_header aibms-color-bg non-shadow">
      <div>
        <div style="clear:both">
          <span class="hname">
            <!-- C154 金融业务的构建 -->
            {{fullDisplayName}}
          </span>
          <span class="runbutton" @click="runagin">一键执行</span>
        </div>
        <div style="    margin-top: 10px;  padding-bottom: 10px;">
          <!-- <p  style="    color: #999;    font-size: 14px;" >本周平均执行时间：{{estimatedDuration | changetime}}</p> -->
          <p class="header_right">
            <span style="float: left;">
              <p style="float: left;color: #999;font-size: 14px;" class="white-color">平均执行时间：{{avgtime}}</p>
            </span>
            <span>
              <span style="color: #999;font-size: 14px;" class="white-color">
                <!-- <img class="iconimg" src="../../../../static/img/task/小齿轮.png" alt srcset /> -->
                <icon-svg icon-class="xiangmuguanli" class="already-finished-icon" />
                已构建{{allBuilds}}次
              </span>
              <span style="color:#999;font-size: 14px;" class="white-color">
                <icon-svg icon-class="zhengque" class="implement-right-icon" />
                <!-- <img class="iconimg" src="../../../../static/img/task/right.png" alt srcset /> -->
                成功{{successCount}}次
              </span>
              <span style="color:#999;font-size: 14px;" class="white-color">
                <icon-svg icon-class="cuowu" class="error-right-icon" />
                <!-- <img class="iconimg" src="../../../../static/img/task/wrong.png" alt srcset /> -->
                失败{{unsuccessCount}}次
              </span>
            </span>
          </p>
        </div>
      </div>
    </div>
    <div class="tabbtn">
      <span
        @click="PipelineBtn(index)"
        class="PipelineBtn"
        :class="idx == index?'btnactiveClick':'nomal-button'"
        v-for="(item ,index) in tabbtnlist"
        :key="item.id"
        style="margin-right:15px"
      >{{item.index}}</span>
    </div>
    <div class="center aibms-color-bg white-color non-shadow">
      <div class="main_box">
        <el-row :gutter="32">
          <el-col :span="21" class="demo-tabs-style1">
            <div class="pipleine_box" v-if="pipelinebox">
              <div
                class="status-wrapper margin-b14"
                v-for="(logitem,inde) in logList"
                :key="logitem.id"
              >
                <div class="top" @click="showlogsage(logitem,inde)">
                  <span
                    class="num"
                    :class="logitem.stats=='success'?'numactiv1':logitem.stats=='fail'?'numactiv2':logitem.stats=='running'?'numactiv3':''"
                  >#{{logitem.id}}</span>
                  <span style="color:#A5A5A5">{{logitem.deployTime}}</span>
                  <!-- <span style="color:#A5A5A5">脚本</span>
                  <span style="color:#89ae45">{{logitem.jobNumber}}</span>-->
                  <span style="display:inline-block;float:right;color:#ec1e35;margin-top:5px">
                    <img src="../../../../static/img/task/topbtn.png" alt srcset />
                  </span>
                  <!-- <span
                    style="display:inline-block;float:right;color:#fff"
                  >总耗时{{alltimes | changetime}}</span>-->
                  <span
                    style="display:inline-block;float:right;color:#FF9B00"
                    v-if="logitem.stats=='running'"
                  >正在执行</span>
                  <span
                    style="display:inline-block;float:right;color:#48BC73"
                    v-if="logitem.stats=='success'"
                  >执行成功</span>
                  <span
                    style="display:inline-block;float:right;color:#e71e30"
                    v-if="logitem.stats=='fail'"
                  >执行失败</span>
                </div>
                <!-- 步骤条 -->
                <div v-show="logitem.isExpand">
                  <div class="stepWrapper">
                    <ul>
                      <li v-for="(codes,index) in logitem.depdata" :key="index">
                        <span>{{codes.name}}</span>
                      </li>
                    </ul>
                    <ul>
                      <li
                        v-for="(codes,index) in logitem.depdata"
                        :key="codes.id"
                        :class="index==0&&codes.status=='SUCCESS'?['step1', {'active':true}]:index==0&&codes.status!='SUCCESS'&&codes.status!='IN_PROGRESS'?['step1', {'failActive':true}]:index==depdata.length-1&&codes.status=='SUCCESS'?['step5', {'active':true}]:index==depdata.length-1&&codes.status!='SUCCESS'?['step5', {'failActive':true}]:index>0&&index<depdata.length-1&&codes.status!='SUCCESS'?['step2', {'failActive':true}]:['step1', {'active':true}]"
                      >
                        <p>{{++index}}</p>
                      </li>
                      <!-- <li :class="['step2', {'active':  steps >= 2}]">
                        <p>2</p>
                      </li>
                      <li :class="['step3', {'active':  steps >= 3}]">
                        <p>3</p>
                      </li>
                      <li :class="['step4', {'active':  steps >= 4}]">
                        <p>4</p>
                      </li>
                      <li :class="['step5', {'active':  steps >= 5}]">
                        <p>5</p>
                      </li>-->
                    </ul>
                  </div>
                  <div v-for="(codes,index) in logitem.depdata" :key="codes.id">
                    <div @click.stop="startScriptExpand(index,inde)" class="shell-script-title">
                      <span class="shell-script-icon success" v-if="codes.status == 'SUCCESS'"></span>
                      <span class="shell-script-icon running" v-else-if="codes.status == ''"></span>
                      <span
                        class="shell-script-icon fail"
                        v-else-if="codes.status != 'SUCCESS'&&codes.status != 'IN_PROGRESS'"
                      ></span>
                      <span v-show="!codes.isStartExpand" class="icon-collapse"></span>
                      <span v-show="codes.isStartExpand" class="icon-collapse icon-expand"></span>
                      <div class="title-content">{{codes.name}}</div>
                      <div class="time">{{codes.durationMillis | changetime}}</div>
                    </div>
                    <div
                      v-show="codes.isStartExpand"
                      v-for="(item,indexs) in codes.stageFlowNodes"
                      :key="item.id"
                    >
                      <div class="shell-script-wrapper">
                        <div
                          class="shell-script-title small_title"
                          @click="showlogs(inde,index,indexs,item.id)"
                        >
                          <span v-show="item.isshowlogs" class="icon-collapse"></span>
                          <span v-show="!item.isshowlogs" class="icon-collapse icon-expand"></span>
                          <div class="title-content">{{item.name?item.name:'Logs'}}</div>
                          <div class="time">{{item.durationMillis | changetime}}</div>
                        </div>
                        <div>
                          <textarea
                            v-if="item.isshowlogs"
                            class="textareap"
                            disabled="disabled"
                            v-model="item.text"
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="pipleine_box pipleine_box2" v-if="pipelineScirptbox">
              <div
                v
                class="status-wrapper margin-b14"
                v-for="(item ,index) in allStagesList"
                :key="index"
              >
                <div class="top" @click="expanded(index)">
                  <span
                    class="num"
                    :class="item.buildStatus=='SUCCESS'?'numactiv1':item.buildStatus==''?'numactiv2':'numactiv3'"
                  >#{{item.builedNumber}}</span>
                  <span style="color:#A5A5A5">脚本内容</span>
                  <span style="color:#A5A5A5">{{item.createDate}}</span>
                  <span style="color:#89ae45">脚本</span>
                  <span style="color:#89ae45">{{item.fileName}}</span>
                  <span style="display:inline-block;float:right;color:#ec1e35;margin-top:5px">
                    <img src="../../../../static/img/task/topbtn.png" alt srcset />
                  </span>
                  <span
                    style="display:inline-block;float:right;color:#398fcc"
                    v-if="item.buildStatus=='SUCCESS'"
                  >执行成功</span>
                  <span
                    style="display:inline-block;float:right;color:#398fcc"
                    v-else-if="item.buildStatus==''"
                  >正在执行</span>

                  <span style="display:inline-block;float:right;color:#ec1e35" v-else>执行失败</span>
                </div>
                <textarea
                  class="textareap"
                  disabled="disabled"
                  v-if="item.showFlag"
                  v-model="item.scriptText"
                ></textarea>
              </div>
            </div>
          </el-col>
          <el-col :span="3" class="mian_box_right" v-if="boxright" style=" width: 140px;">
            <p style="color: #999;" class="white-color">
              <icon-svg icon-class="zhengque" class="implement-right-icon" />构建成功
            </p>
            <p style="color: #999;" class="white-color">
              <icon-svg icon-class="cuowu" class="error-right-icon" />构建失败
            </p>
            <p style="color: #999;" class="white-color">
              <icon-svg icon-class="loading" class="wait-right-icon" />等待执行
            </p>
            <p style="color: #999;" class="white-color">
              <icon-svg icon-class="loading" class="already-finished-icon" />正在执行
            </p>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
import axios from '@/api';
export default {
  data () {
    return {
      isdis: false,
      estimatedDuration: '',
      fullDisplayName: '',
      logList: [],
      filename: '',
      isA: false,
      isB: false,
      pipelinebox: true,
      pipelineScirptbox: false,
      imgSrc: 0,
      imgSrc1: 0,
      imgSrc2: 0,
      imgSrc3: 0,
      isup: true,
      boxright: true,
      scriptList: [],
      active: '2',
      idx: '0',
      tabbtnlist: [
        {
          index: '流水线',
          id: '0'
        },
        {
          index: '流水线脚本',
          id: '1'
        }
      ],
      // deployList: [],
      // isExpand: false,
      allBuilds: '',
      successCount: '',
      unsuccessCount: '',
      bl: false,
      timest: '',
      issuce: '',
      avgtime: '',
      // deployListconcant: [],
      startTime: '200ms',
      waitingTime: '253ms',
      endTime: '223ms',
      totalTime: '676ms',
      alltimes: '',
      // isStartExpand: false,
      isWaitingExpand: false,
      isEndExpand: false,
      id: '',
      deployTime: '',
      status: '',
      depdata: [],
      errorlist: [],
      steps: Number,
      allStagesList: '',
      clickShow: false
    }
  },
  props: {},
  computed: {},
  filters: {
    changetime (time) {
      return (time =
        time > 1000 ? Math.round((time / 1000) * 100) / 100 + 's' : time + 'ms')
    }
  },
  methods: {
    changeSrc () { },

    startScriptExpand (index, inde) {
      this.logList[inde].depdata[index].isStartExpand = !this.logList[inde]
        .depdata[index].isStartExpand
      console.log(this.logList[inde].depdata[index])
      this.logList.reverse().reverse()
    },
    showlogs (index, i, l, j) {
      this.logList[index].depdata[i].stageFlowNodes[l].isshowlogs = !this
        .logList[index].depdata[i].stageFlowNodes[l].isshowlogs
      // this.logList[index].forEach(function(item) {
      //   item.stageFlowNodes.forEach(function(item) {
      //     if (item.id == j) {
      //       item.isshowlogs = !item.isshowlogs;
      //     }
      //   });
      //   // item.stageFlowNodes = item.stageFlowNodes.reverse().reverse()
      // });
      this.logList.reverse().reverse()
    },
    waitingScriptExpand (index) {
      // this.logList[index].deployList
      this.deployList[index].isWaitingExpand = !this.deployList[index]
        .isWaitingExpand
    },
    endScriptExpand (index) {
      this.deployList[index].isEndExpand = !this.deployList[index].isEndExpand
    },
    runagin () {
      if (this.isdis) {
        this.$notify({
          title: '提示',
          message: '任务正在执行中',
          type: 'success'
        })
        return false
      }
      let jobId = this.$route.query.jobId
      let jobName = this.$route.query.jobName
      axios.buildJob(jobId, jobName)
        .then(res => {
          //  let buildNumber = Number(res.data.buildNumber);
          if (res.data.status.index == '200') {
            this.$notify({
              title: '提示',
              message: '操作成功',
              type: 'success'
            })

            this.$router.push({
              path: '/AutomatedRelease/TaskDeployment',
              query: { code: 3 }
            })
          } else {
            this.$notify({
              title: '提示',
              message: '操作失败',
              type: 'warning'
            })
          }
        })
        .catch(res => { })
    },
    restart (n) {
      // let data = {};
      // data.buildNumber = this.$route.query.buildNumber;
      // data.jobName = this.$route.query.jobName;
      // data.stageName = n;
      // this.$http({
      //   url: devHost.devHost + "/job/stage/restart",
      //   method: "get",
      //   params: data
      // }).then(res => {
      //   if (res.data.result) {
      //     alert("操作成功");
      //     this.$router.push({
      //       path: "/TaskManagement/TaskMangementList/TaskList/ViewLogMsg",
      //       query: {
      //         jobName: this.$route.query.jobName,
      //         buildNumber: res.data.buildNumber
      //       }
      //     });
      //     this.$router.go(0);
      //   } else {
      //     return false;
      //   }
      // });
    },
    // getvalue() {
    //   let myselect = document.getElementById("select2");
    //   var index = myselect.selectedIndex; // selectedIndex代表的是你所选中项的index
    //   console.log(myselect.options[index].value);
    //   if (
    //     myselect.options[index].value != "All" &&
    //     myselect.options[index].value != "Rebuild"
    //   ) {
    //     this.restart(myselect.options[index].value);
    //   } else {
    //     this.runagin();
    //   }
    // },
    getallStagesList () {
      let jobId = this.$route.query.jobId
      axios.getJobTaskBuiled(jobId)
        .then(res => {
          // console.log(res);
          this.allStagesList = res.data.result
          this.allStagesList.forEach(item => {
            item.showFlag = false
          })
        })
        .catch()
    },

    setintervalitem () {
      var t1 = window.setInterval(() => {
        this.getlogview2(t1)
      }, 18000)
    },
    showlogsage (item, index) {
      this.bl = !this.bl
      this.logList[index].isExpand = this.bl
      this.logList.reverse().reverse()
    },
    getlogview2 (t1) {
      let data = {
        jobName: this.$route.query.jobName,
        jobNumber: this.$route.query.jobNumber
      }
      axios.getJobLog(data).then(res => {
        console.log(res)
        if (t1) {
          this.depdata = this.scriptListconcant
        }
        this.fullDisplayName = res.data.jobName
        this.allBuilds = res.data.allBuilds
        this.successCount = res.data.successCount
        this.unsuccessCount = res.data.unsuccessCount
        this.avgtime = res.data.avgtime
        res.data.result.forEach((item, index) => {
          if (index == 0) {
            this.isdis = item.detail.building
          }
          console.log(item, index)
          this.logList[index] = item.stages
          this.logList[index].stats = item.detail.building
            ? 'running'
            : item.stages.status == 'SUCCESS'
              ? 'success'
              : 'fail'
          this.logList[index].isExpand = false
          this.logList[index].deployTime = this.moment(
            item.detail.timestamp
          ).format('YYYY-MM-DD HH:mm:ss')
          this.logList[index].scriptListconcant = item.stages.stages.concat()
          this.logList[index].depdata = item.stages.stages
          this.logList[index].depdata.forEach(function (item) {
            item.isStartExpand = false
            item.stageFlowNodes.forEach(function (item) {
              item.isshowlogs = false
            })
          })
        })
        if (!res.data.isBuilding) {
          window.clearInterval(t1)
        } else {
          this.setintervalitem()
        }
        this.logList.reverse().reverse()
      })
    },

    PipelineBtn (id) {
      this.idx = id
      if (id == '0') {
        this.pipelinebox = true
        this.pipelineScirptbox = false
        this.boxright = true
      }
      if (id == '1') {
        this.pipelinebox = false
        this.pipelineScirptbox = true
        this.boxright = false
      }
    },
    expanded (id) {
      this.allStagesList.forEach((item, index) => {
        if (id == index) {
          item.showFlag = !item.showFlag
        }
      })
      this.allStagesList.reverse().reverse()
    }
  },
  created () {
    this.getlogview2()
    this.getallStagesList()
  }
}
</script>
<style scoped  lang="scss">
.stepWrapper {
  width: 100%;
  padding: 40px;
  margin-top: 40px;
  ul {
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
  li {
    flex: 1;
    position: relative;
    text-align: center;
    z-index: 2;
    list-style: none;
    height: px2rem(38);
    position: relative;

    p {
      z-index: 3;
      display: inline-block;
      width: 25px;
      height: 25px;
      border-radius: 100%;
      text-align: center;
      font-size: 12px;
      line-height: 25px;
      background: #afc9d8;
      color: #fff;
      box-shadow: red;
      position: absolute;
      top: -10px;
      left: 84px;
      border: 4px solid #10182b;
    }
    span {
      position: absolute;
      width: 100%;
      height: 100%;
      top: px2rem(50);
      left: 0;
      top: -30px;
      text-align: center;
      font-size: 15px;
      color: #666;
    }
  }
  .step1:after {
    content: "";
    position: absolute;
    z-index: -1;
    top: 50%;
    left: 16%;
    margin-top: 2px;
    margin-left: -66px;
    margin-left: px2rem(10);
    width: 61%;
    height: 8px;
    background: #10182b;
  }

  .step1.active:after {
    background: #4d7bfe;
  }
  .step2:before {
    content: "";
    position: absolute;
    z-index: -1;
    top: 50%;
    right: 50%;
    margin-top: 2px;
    /* margin-left: 18px; */
    width: 70%;
    height: 8px;
    background: #10182b;
  }
  .step2:after {
    content: "";
    position: absolute;
    z-index: -1;
    top: 50%;
    left: 36%;
    margin-top: 2px;
    margin-left: px2rem(10);
    width: 50%;
    height: 8px;
    background: #10182b;
  }
  .step4:before {
    content: "";
    position: absolute;
    z-index: -1;
    top: 50%;
    right: 50%;
    margin-top: 2px;
    /* margin-left: 18px; */
    width: 70%;
    height: 8px;
    background: #10182b;
  }
  .step4:after {
    content: "";
    position: absolute;
    z-index: -1;
    top: 50%;
    left: 36%;
    margin-top: 2px;
    margin-left: px2rem(10);
    width: 50%;
    height: 8px;
    background: #10182b;
  }
  .step5:before {
    content: "";
    position: absolute;
    z-index: -1;
    top: 50%;
    right: 50%;
    margin-top: 2px;
    /* margin-left: 18px; */
    width: 70%;
    height: 8px;
    background: #10182b;
  }
  .small_title {
    padding-left: 10px;
  }
  .step3:before {
    content: "";
    position: absolute;
    z-index: -1;
    top: 50%;
    right: 50%;
    margin-top: 2px;
    /* margin-left: 18px; */
    width: 70%;
    height: 8px;
    background: #10182b;
  }
  .step3:after {
    content: "";
    position: absolute;
    z-index: -1;
    top: 50%;
    left: 36%;
    margin-top: 2px;
    margin-left: px2rem(10);
    width: 50%;
    height: 8px;
    background: #10182b;
  }
  .step2.active:after,
  .step2.active:before,
  .step3.active:before,
  .step4.active:before,
  .step5.active:before,
  .step3.active:after,
  .step4.active:after,
  .step5.active:after {
    background: #4d7bfe;
  }
  .step1.failActive:after,
  .step2.failActive:before,
  .step2.failActive:after,
  .step3.failActive:before,
  .step4.failActive:before,
  .step5.failActive:before,
  .step3.failActive:after,
  .step4.failActive:after {
    background: red;
  }

  .step1.active p,
  .step2.active p,
  .step3.active p,
  .step4.active p,
  .step5.active p {
    background: #4d7bfe;
  }
  .step1.failActive p,
  .step2.failActive p,
  .step3.failActive p,
  .step4.failActive p,
  .step5.failActive p {
    background: red;
  }
}
.container_header {
  width: auto;
  padding: 20px 20px 0px;
  color: #fff;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 1px 1px 1px #999;
  -webkit-box-shadow: #999 0px 0px 10px;
  -moz-box-shadow: #999 0px 0px 10px;
  box-shadow: #999 0px 0px 10px;
  margin: 10px 10px 0 10px;
}
.container_header .header_right {
  text-align: right;
}
.container_header .header_right span {
  display: inline-block;
  margin-right: 10px;
}
.center {
  background-color: #fff;
  overflow: auto;
  margin-left: 10px;
  margin-top: -2px;
  border-radius: 2px;
  box-shadow: 1px 1px 1px #999;
  -webkit-box-shadow: #999 0px 0px 10px;
  box-shadow: #999 0px 0px 10px;
}
.main_box {
  margin-bottom: 20px;
  margin: 0px 20px;
}
.demo-tabs-style1 > .ivu-tabs-card > .ivu-tabs-content {
  height: 120px;
  margin-top: -16px;
}
/* .ivu-tabs {
  background: #38383a;
} */
.demo-tabs-style1 > .ivu-tabs-card > .ivu-tabs-content > .ivu-tabs-tabpane {
  padding: 16px;
}

.demo-tabs-style1 > .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab {
  border-color: transparent;
}
.ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab {
  background: #3399ff;
  border: 1px solid #ccc;
}
.demo-tabs-style1 > .ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active {
}
.demo-tabs-style2 > .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab {
  border-radius: 0;
}
.demo-tabs-style2
  > .ivu-tabs.ivu-tabs-card
  > .ivu-tabs-bar
  .ivu-tabs-tab-active {
  border-top: 1px solid #3399ff;
}
.demo-tabs-style2
  > .ivu-tabs.ivu-tabs-card
  > .ivu-tabs-bar
  .ivu-tabs-tab-active:before {
  content: "";
  display: block;
  width: 100%;
  height: 1px;
  background: #3399ff;
  position: absolute;
  top: 0;
  left: 0;
}
.pipleine_box2 {
  width: 100%;
}
.pipleine_box {
  background-color: #1c2b4c;
}
.pipleine_box .top {
  height: 60px;
  background-color: #f0f0f0;
  line-height: 60px;
  border-bottom: 1px solid #f2f2f2;
}
.pipleine_box .top span {
  margin-right: 40px;
}
.pipleine_box .top .num {
  display: inline-block;
  text-align: center;
  height: 25px;
  width: 40px;
  line-height: 25px;

  color: #fff;
  border-radius: 6px;
  margin-left: 20px;
}
.numactiv1 {
  background: #48bc73;
}
.hname {
  color: #999;
  font-size: 18px;
  // margin-right: 20px;
  /* font-weight: 500; */
}
.numactiv2 {
  background: #e71e30;
}
.numactiv3 {
  background: #ff9b00;
}
.ivu-collapse-item {
  color: #fff;
}
.ivu-collapse-content {
  color: #515a6e;
  /* padding: 0 16px; */
  background: black !important;
  color: green;
  /* background-color: #fff; */
}
.ivu-collapse-content > .ivu-collapse-content-box {
  padding-top: 0px !important;
  padding-bottom: 0px !important;
}
.runbutton {
  height: 30px;
  display: inline-block;
  line-height: 30px;
  cursor: pointer;
  width: 100px;
  background-color: #00A8E8;
  border-radius: 3px;
  text-align: center;
}
.mian_box_right {
  color: #fff;
  margin-top: 10px;
  margin-bottom: 10px;
}
.mian_box_right img {
  height: 20px;
  width: 20px;
  margin-right: 10px;
}
.cursor {
  cursor: pointer;
}
.margin-b14 {
  margin-bottom: 14px;
}
.margin-l49 {
  margin-left: 49px !important;
}
.textareap {
  border: none;
  width: 100%;
  height: 200px;
  color: #009300;
  background: #000;
}
.contentBox {
  width: 98%;
  margin: auto;
  margin-top: 32px;
}

header {
  height: 55px;
  border: 1px solid #ddd;
  background: #fff;
}

.title {
  height: 20px;
  font-family: MicrosoftYaHei-Bold;
  font-size: 20px;
  font-weight: bolder;
  color: #333333;
  line-height: 55px;
  padding-left: 16px;
}

article {
  background: #fff;
  position: relative;
}

.article-total {
  position: absolute;
  height: 50px;
  top: 0px;
  right: 20px;
}

.article-total > button {
  height: 24px;
  border-radius: 12px;
  width: 100px;
  margin-top: 12px;
  margin-left: 5px;
}

.build {
  border: 1px solid #0055ff;
  background: #d7e5ff;
}

.successed {
  border: 1px solid #70d900;
  background: #ecffd7;
}

.failed {
  border: 1px solid #ff2837;
  background: #ffd7d7;
}

/*PIPELINE内容样式*/
.pipeline-header {
  height: 45px;
}

.run {
  color: #fff;
  display: inline-block;
  float: left;
  background-color: #3c67e0;
  width: 80px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  margin-top: 5px;
  margin-left: 16px;
}

.ivu-tabs {
  color: #999;
}

.ivu-tabs-nav-container {
  font-size: 16px;
  font-weight: bold;
  padding-top: 10px;
}

.pipeline-status-style {
  margin-right: 16px;
  padding-top: 12px;
}

.pipeline-status-style > li {
  float: right;
  list-style-type: none;
  font-size: 12px;
  padding-left: 18px;
  margin-left: 15px;
  background-size: contain;
  background-repeat: no-repeat;
}

.running {
  background-image: url("../../../../static/img/task/running.png");
}

.waiting {
  background-image: url("../../../../static/img/task/icon_wait_b.png");
}

.fail {
  background-image: url("../../../../static/img/task/fail.png");
}

.success {
  background-image: url("../../../../static/img/task/success.png");
}
.failedspan {
  background-image: url("../../../../static/img/task/icon_failure_b.png");
}
.pipeline-status-title {
  border-bottom: 1px solid #ddd;
}

.border-top-img {
  background-image: url("../../../../static/img/task/icon_being_c.png");
  background-size: contain;
  background-repeat: no-repeat;
}

.icon-status {
  display: inline-block;
  width: 40px;
  height: 50px;
  color: #fff;
  float: left;
  text-align: center;
  line-height: 30px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: 0 -5px;
}

.status-wrapper {
  margin-top: 10px;
  background-color: #fff;
  border: 2px solid #f0f0f0;
}

.icon-status-running {
  background-image: url("../../../../static/img/task/icon_being.png");
}
.iconimg {
  height: 20px;
  width: 20px;
  /* vertical-align: middle; */
  vertical-align: middle;
}
.icon-status-fail {
  background-image: url("../../../../static/img/task/icon_failure.png");
}

.icon-status-success {
  background-image: url("../../../../static/img/task/icon_succed.png");
}

.icon-status-waiting {
  background-image: url("../../../../static/img/task/icon_wait.png");
}

.pipeline-status {
  display: inline-block;
  color: #000;
  font-weight: bold;
  height: 50px;
  line-height: 50px;
}

.icon-down,
.icon-up {
  display: inline-block;
  height: 50px;
  width: 20px;
  margin-right: 20px;
  background-image: url("../../../../static/img/task/down.png");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
  float: right;
}

.icon-up {
  background-image: url("../../../../static/img/task/up.png");
}

.pipeline-status-content {
  height: 130px;
  background-color: #e8e8e8;
}

.shell-script-title {
  color: #666;
  height: 48px;
  border-bottom: 1px solid #4b576d;
}

.shell-script-icon,
.icon-collapse,
.title-content {
  height: 48px;
  color: #999;
  float: left;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
}

.shell-script-icon {
  width: 30px;
  margin-left: 15px;
}

.icon-collapse {
  width: 14px;
  margin-left: 18px;
  background-image: url("../../../../static/img/task/icon_Expand_pre.png");
}

.icon-expand {
  background-image: url("../../../../static/img/task/icon_Expand_nor.png");
}

.title-content {
  margin-left: 8px;
  line-height: 48px;
  font-weight: bold;
}

.time {
  float: right;
  line-height: 48px;
  padding-right: 20px;
}

/*步骤条*/
.el-steps {
  width: 90%;
  margin: auto;
  padding-top: 30px;
}

.running-step-start,
.running-step-waiting,
.running-step-end,
.fail-step-start,
.fail-step-waiting,
.fail-step-end,
.success-step-start,
.success-step-waiting,
.success-step-end,
.waiting-step-start,
.waiting-step-waiting,
.waiting-step-end {
  width: 24px;
  height: 24px;
  display: inline-block;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center center;
  background-image: url("../../../../static/img/task/icon_succed_b.png");
}

.waiting-step-start,
.waiting-step-waiting,
.waiting-step-end {
  background-image: url("../../../../static/img/task/icon_wait_b.png");
}

.running-step-end {
  background-image: url("../../../../static/img/task/icon_being_b.png");
}

.fail-step-waiting {
  background-image: url("../../../../static/img/task/icon_failure_b.png");
}

.fail-step-end {
  background-image: url("../../../../static/img/task/icon_wait_b.png");
}

.pipeline-status-content .el-steps .el-step .el-step__head.is-finish {
  color: #70d900 !important;
  border-color: #70d900 !important;
}

.pipeline-status-content .el-steps .el-step .el-step__title.is-finish {
  color: #000;
}

.pipeline-status-content .el-steps .el-step .el-step__description.is-finish {
  color: #999;
}

.pipeline-status-content
  > .el-steps
  > .el-step
  > .el-step__head
  > .el-step__icon {
  border: none !important;
  background-color: transparent !important;
}

.sec-btn-wrapper,
.table-wrapper {
  padding: 1.5%;
}

table.table {
  border: 1px solid #e4e7ed;
}

table.table th,
table.table td {
  padding: 1rem 2.6rem;
}

table.table tbody:last-child tr:last-child td:first-child {
  border-radius: 0 0 0 0;
}

table.table tbody:last-child tr:last-child td:last-child {
  border-radius: 0 0 0 0;
}

th,
td {
  border-bottom: 1px solid #f3f3f3;
}

.icon-label {
  display: inline-block;
  width: 2rem;
  height: 1rem;
  background: #6cec55;
  border-radius: 0.5rem 0.5rem 0.5rem 0.5rem;
  color: white;
  margin-right: 1%;
}

.editor {
  margin-bottom: 3%;
}

.ul-wrapper li:nth-child(1),
.ul-wrapper li:nth-child(2) {
  color: #000;
  font-weight: bold;
}

footer {
  background: #fff;
  display: grid;
  margin-top: 15px;
  margin-bottom: 0px;
  border: 1px solid #ddd;
  height: 80px;
}

.executeType-wrapper {
  padding: 1.5%;
}

.executeType1,
.executeType2,
.executeType3,
.executeType4 {
  width: 100%;
  border: 1px solid #ddd;
  height: 80px;
}

.progress {
  background-color: #eef7fc;
  width: 100%;
}

.progressbar.large {
  height: 1rem;
}

.executeType1 .triangle_wrapper {
  width: 32px;
  height: 40px;
  background-color: #4394e4;
  box-shadow: 0px 0px 0px 0px rgba(0, 85, 255, 0.34);
  margin-left: 2%;
  display: inline-block;
}

.executeType2 .triangle_wrapper {
  width: 32px;
  height: 40px;
  background-color: #ff4d5a;
  box-shadow: 0px 0px 0px 0px rgba(255, 77, 90, 0.34);
  margin-left: 2%;
  display: inline-block;
}

.executeType3 .triangle_wrapper {
  width: 32px;
  height: 40px;
  background-color: #70d900;
  box-shadow: 0px 0px 0px 0px rgba(112, 217, 0, 0.34);
  margin-left: 2%;
  display: inline-block;
}

.executeType4 .triangle_wrapper {
  width: 32px;
  height: 40px;
  background-color: #ff8402;
  box-shadow: 0px 0px 0px 0px rgba(255, 132, 2, 0.34);
  margin-left: 2%;
  display: inline-block;
}

.triangle_border_up {
  width: 0;
  height: 0;
  border-left: 16px solid transparent;
  border-right: 16px solid transparent;
  border-bottom: 22px solid white;
}

.ul-wrapper {
  list-style: none;
  margin-left: 7%;
  margin-top: -2%;
  width: 40%;
}

.ul-wrapper li {
  display: inline-block;
}

.executeType2 img,
.executeType1 img,
.executeType3 img,
.executeType4 img {
  margin-top: -2%;
  margin-left: 95%;
}

.page {
  margin: auto;
  line-height: 80px;
}
.tabbtn {
  height: 40px;
  line-height: 40px;
  margin: 10px;
}
.tabbtn .PipelineBtn {
  /* float: left; */
  cursor: pointer;
  display: inline-block;
  width: 100px;
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  border-radius: 4px;
  /* border-width: 0 22px 40px 22px; */
  /* border-style: none solid solid; */
  cursor: pointer;
  text-align: center;
}
.PipelineBtnscript {
  float: left;
  cursor: pointer;
  display: inline-block;
  width: 150px;
  height: 0;
  border-width: 0 22px 40px 22px;
  border-style: none solid solid;
  cursor: pointer;
  color: #627584;
}
.btnactive {
  color: #00A8E8;
  border: 1px solid #00A8E8;
  background-color: #fff;
  padding: -1px -1px 10px;
  height: 28px;
  line-height: 28px !important;
  height: 28px !important;
}
.btnactiveClick {
  color: #fff;
  background-color: #00A8E8;
}
</style>
