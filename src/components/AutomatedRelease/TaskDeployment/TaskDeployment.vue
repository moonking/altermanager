<template>
  <div class="contentBoxtask">
    <div>
      <el-form :inline="true" style="padding: 0 10px 0 10px;">
        <el-form-item>
          <el-select clearable v-model="systemId" placeholder="请选择系统名称" class="select">
            <el-option
              v-for="item in systemListDrop"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-left: 30px;">
          <ul class="tablist">
            <li
              v-for="item in showItem"
              :key="item.id"
              :class="{'active' : currentItem === item.name}"
              @click="changeCurrentItem(item.name)"
            >{{item.label}}</li>
          </ul>
        </el-form-item>
        <el-form-item class="item-right">
          <el-dropdown trigger="click">
            <el-button type="primary" icon="el-icon-plus" class="common-btn-style margin-left-btn">
              新增
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <div @click="goAddTask">
                <el-dropdown-item>部署任务</el-dropdown-item>
              </div>
              <div @click="goAddcreateTask">
                <el-dropdown-item>构建任务</el-dropdown-item>
              </div>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>
      </el-form>
      <keep-alive>
        <component :is="currentItem" :systemId="systemId"></component>
      </keep-alive>
    </div>
  </div>
</template>
<script>
import axios from '@/api';
import TaskList from './components/TaskList'
import OperationSystem from './components/OperationSystem'
export default {
  data () {
    return {
      // 切换列表
      showItem: [
        {
          id: '1',
          name: 'TaskList',
          label: '流水线列表'
        },
        {
          id: '2',
          name: 'OperationSystem',
          label: '业务系统'
        }
      ],
      //  下拉系统列表
      systemListDrop: [],
      // 查询参数
      systemId: '',
      currentItem: 'TaskList'
    }
  },
  components: {
    TaskList,
    OperationSystem
  },
  created () {
    this.getcigroupSystablist()
  },
  methods: {
    // 切换显示
    changeCurrentItem (val) {
      this.currentItem = val
    },
    // 系统下拉列表
    getcigroupSystablist () {
      let name = ''
      axios.getcigroupSystablist(name)
        .then(res => {
          this.systemListDrop = []
          if (res.data.data.result.length > 0) {
            res.data.data.result.forEach(item => {
              this.systemListDrop.push({
                value: item.systemId,
                label: item.name
              })
            })
          }
        })
        .catch()
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
        query: { sysId: item.systemIds, code: 3 }
      })
    }
  }
}
</script>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-active {
  opacity: 0;
}
.tablist {
  height: 32px;
  text-align: center;
  color: #00A8E8;
}
.tablist li {
  list-style: none;
  float: left;
  font-size: 16px;
  padding: 0 20px;
  height: 32px;
  line-height: 32px;
  border: 1px solid #00A8E8;
  background-color: #fff;
  padding-left: 10px;
  padding-right: 10px;
  margin-top: 3px;
  cursor: pointer;
}
.active {
  border: 1px solid #00A8E8 !important;
  color: #fff !important;
  background-color: #00A8E8!important;
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
  padding-top: 10px;
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
.addbtn {
  position: absolute;
  right: 0px;
  top: 30%;
}
.addbutton {
  background-color: #0280ff !important;
}
</style>
