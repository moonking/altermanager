<template>
  <div class="contentBoxtask">
    <div>
      <main>
        <div class="mainBody">
          <el-row :gutter="20">
            <el-col :span="12" v-for="(tasks,index) in systemList" :key="tasks.id">
              <div class="sys_item">
                <div class="topTitle">
                  <span>{{tasks.sysName}}</span>
                  <el-button
                    icon="el-icon-search"
                    class="headerIcon searchBtn seebtn"
                    @click="getDeployList(tasks)"
                  >查看</el-button>
                </div>
                <div class="divLeft">
                  <div style="height: 36px; line-height: 36px;  color: #777;">
                    <span style="margin-left: 20px;font-size: 14px;">任务总数 {{tasks.taskCount}}</span>
                    <span style="margin-left: 42px;font-size: 14px;">今日部署任务 {{tasks.dayCount}}</span>
                  </div>
                  <div>
                    <el-col :span="15">
                      <div class="exec_result">
                        <span class="runstyle2">正在执行</span>
                        <span class="numberstyle">{{tasks.building}}</span>
                      </div>
                      <div class="exec_result">
                        <span class="wating2">等待执行</span>
                        <span class="numberstyle">{{tasks.wateCount}}</span>
                      </div>
                      <div class="exec_result">
                        <span class="faile2">执行失败</span>
                        <span class="numberstyle">{{tasks.errorCount}}</span>
                      </div>
                      <div class="exec_result">
                        <span class="success2">执行成功</span>
                        <span class="numberstyle">{{tasks.succeCount}}</span>
                      </div>
                    </el-col>
                    <el-col :span="9">
                      <div class="textc">
                        <el-progress
                          class="mt20"
                          type="circle"
                          :percentage="tasks.successRate"
                          color="#20A5F9"
                        ></el-progress>
                        <div class="lefttask">任务部署成功率</div>
                        <el-select
                          @change="getTimeSysDetail(tasks,index)"
                          v-model="tasks.value"
                          placeholder="最近"
                          style="margin: 10px 0;  width: 90%;"
                        >
                          <el-option
                            v-for="item in timeInterval"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          ></el-option>
                        </el-select>
                      </div>
                    </el-col>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </main>
    </div>
  </div>
</template>
<script>
import axios from '@/api';
export default {
  name: 'OperationSystem',
  props: {
    systemId: {
      // 查询参数
      type: String,
      default: ''
    }
  },
  data () {
    return {
      // 查询时间间隔
      timeInterval: [
        {
          value: '1',
          label: '当日'
        },
        {
          value: '2',
          label: '最近一周'
        },
        {
          value: '3',
          label: '最近一个月'
        },
        {
          value: '4',
          label: '最近半年'
        }
      ],
      searchData: {
        issaerch: false,
        datetype: '1',
        systemIds: []
      },
      // 系统列表
      systemList: [],
      //  下拉系统列表
      systemListDrop: [],
      link: ''
    }
  },

  watch: {
    systemId (val) {
      this.searchData.systemIds = this.systemId
      this.getSysList()
    }
  },
  created () {
    this.searchData.systemIds = this.systemId
    this.getSysList()
  },
  methods: {
    //  查询系统列表
    getSysList () {
      if (this.searchData.systemIds) {
        this.searchData.issaerch = true
      } else {
        this.searchData.issaerch = false
      }
      let searchData = this.searchData
      axios.getsyslist(
        searchData.datetype,
        searchData.systemIds,
        searchData.issaerch
      ).then(data => {
        if (data.data.status.index == 200) {
          this.systemList = data.data.Org
          this.systemList.forEach(item => {
            item.successRate = parseInt(item.successRate)
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
    // 获取单个系统不同时间范围的部署情况
    getTimeSysDetail (task, index) {
      this.$set(this.systemList[index], 'value', task.value)
      let datetype = task.value
      let systemIds = task.systemId
      let issaerch = true
      axios.getsyslist(datetype, systemIds, issaerch).then(data => {
        if (data.data.status.index == 200) {
          this.systemList.splice(index, 1, data.data.Org[0])
          this.$set(
            this.systemList[index],
            'successRate',
            parseInt(data.data.Org[0].successRate)
          )
          this.$set(this.systemList[index], 'value', task.value)
        } else {
          this.$notify({
            title: '提示',
            message: data.data.message,
            type: 'error'
          })
        }
      })
    },
    // 跳转添加部署任务
    goAddTask () {
      this.$router.push({
        path: '/AutomatedRelease/AddDeployTask',
        query: { code: 3, plantype: '2', task: '2' }
      })
    },
    goAddcreateTask () {
      this.$router.push({
        path: '/AutomatedRelease/AddDeployTask',
        query: { code: 3, plantype: '2', task: '1' }
      })
    },
    //  查看任务部署详情
    getDeployList (item) {
      this.$router.push({
        path: '/AutomatedRelease/taskDeploymentList',
        query: { sysId: item.systemId, code: 3 }
      })
    }
  }
}
</script>
<style scoped>
.tablist {
  height: 32px;
  text-align: center;
  color: #0066ff;
}
.tablist li {
  list-style: none;
  float: left;
  font-size: 16px;
  padding: 0 20px;
  height: 32px;
  line-height: 32px;
  border: 1px solid #0066ff;
  padding-left: 10px;
  padding-right: 10px;
  margin-top: 3px;
  cursor: pointer;
}
.active {
  border: 1px solid #0066ff !important;
  color: #fff !important;
  background-color: #0066ff;
}
#input-test::-webkit-input-placeholder {
  color: red;
}
#input-text::-moz-placeholder {
  color: red;
}
#input-text:-ms-input-placeholder {
  color: red;
}
.exec_result {
  margin-top: 20px;
  font-size: 14px;
}
.contentBoxtask {
  width: auto;
  margin: auto;
  background-image: inherit;
}
header {
  height: 88px;
  position: relative;
}
.headerIcon {
  padding: 10px 10px 10px 10px;
  height: 36px;
  background-repeat: no-repeat;
  background-size: 60% 60%;
  background-position: -2px;
  margin-top: 26px;
  margin-left: 8px;
  border: 1px solid #707070;
  font-size: 14px;
}
.seebtn {
  position: absolute;
  right: 18px;
  margin-top: 10px;
  border: 1px solid #707070;
}
.searchBtn {
  display: inline-block;
}
.searchBtn img {
  height: 14px;
  width: 14px;
}
.searchBtn div {
  font-size: 14px !important;
  margin-left: 5px;
  float: right;
}
main .mainBody {
  margin: 0 40px;
}
main .divLeft {
  border-top: 0;
  padding-bottom: 10px;
  background-color: #fff;
  position: relative;
  overflow: hidden;
}
main .topTitle {
  position: relative;
  height: 55px;
  color: #b6b6b6;
  border-radius: 3px;
  line-height: 55px;
  border-bottom: 2px solid #d3d3d3;
  background-color: #fff;
  font-size: 25px;
  padding-left: 18px;
  background-repeat: no-repeat;
  background-size: 35px 35px;
  background-position: 0px 10px;
}
main .topTitle span {
  color: #777;
  font-size: 18px;
}
main .sys_item {
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.08);
  border-radius: 5px;
  border: 1px solid #d3d3d3;
  margin-bottom: 20px;
}
.tasklist {
  border: 2px solid #f2f2f2;
  margin-left: 12px;
  margin-bottom: 15px;
}
.tasknamecolor {
  font-size: 14px;
  color: #b6b6b6;
}
.taskcolor {
  font-size: 14px;
  color: #b6b6b6;
}
.auto80 {
  width: 80%;
  margin: 0px auto;
}
.lineh36 {
  line-height: 36px;
}
.flr {
  float: right;
}
.bor2 {
  border: 2px solid #f2f2f2;
}
.textc {
  text-align: center;
}
.mt20 {
  margin-top: 20px;
}
.lefttask {
  font-size: 14px;
  margin: 10px 0;
}
.runstyle {
  margin-left: 19px;
  padding-top: 10px;
  display: inline-block;
  color: #ff9a00;
}
.runstyle2 {
  margin-left: 12px;
  padding: 3px 5px;
  display: inline-block;
  background-color: #ffeccf;
  color: #ff9a00;
}
.wating2 {
  margin-left: 12px;
  padding: 3px 5px;
  display: inline-block;
  background-color: #e7e7e7;
  color: #b9b9b9;
}
.success2 {
  margin-left: 12px;
  padding: 3px 5px;
  display: inline-block;
  background-color: #d1e5fd;
  color: #0166ff;
}
.faile2 {
  margin-left: 12px;
  padding: 3px 5px;
  display: inline-block;
  background-color: #f9dee3;
  color: #f14c6f;
}
.numberstyle {
  margin-right: 40px;
  color: rgb(102, 102, 102);
  margin-left: 10px;
}
.probot {
  width: 58%;
  display: inline-block;
  margin: 0px auto;
}
.select {
  background-color: #fff;
}
.addbutton {
  background-color: #0280ff !important;
}
</style>
