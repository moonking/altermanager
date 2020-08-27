<template>
  <div class="release-plan-add">
    <div class="release-all aibms-color-bg non-border non-shadow">
      <div class="release-title white-color">
        <span></span>新增发布
      </div>
      <div class="release-content">
        <el-form ref="planform" :model="plans" label-width="120px">
          <el-form-item label="计划名称: ">
            <el-input v-model="plans.name" class="inputwidth" style="width: 632px"></el-input>
          </el-form-item>
          <el-form-item label="系统： ">
            <el-select
              v-model="plans.system"
              placeholder="选择系统"
              class="inputwidth"
              @change="selectSystem"
              style="width: 632px"
            >
              <el-option
                v-for="item in systems"
                :key="item.systemId"
                :label="item.name"
                :value="item.systemId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="部署的任务： ">
            <el-select v-model="plans.deploytask" placeholder="选择要部署的任务" class="inputwidth" style="width: 632px">
              <!-- @change="selectDeploytask" -->
              <el-option
                v-for="item in deploytasks"
                :key="item.deploytaskId"
                :label="item.name"
                :value="item.deploytaskId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="计划发布时间： ">
            <!-- <el-date-picker type="date" placeholder="选择日期" v-model="plans.date"  class="inputwidth"> -->
            <!-- <span class="datelabel">日历</span> -->
            <el-date-picker
              style="width: 632px"
              v-model="plans.date"
              type="datetime"
              placeholder="选择日期时间"
              default-time="12:00:00"
              class="inputwidth"
            ></el-date-picker>
            <!-- </el-date-picker> -->
          </el-form-item>
          <el-form-item label="执行人： ">
            <el-select v-model="plans.handleperson" style="width: 632px" placeholder="执行人" class="inputwidth">
              <el-option
                v-for="item in handlepersons"
                :key="item.handlepersonId"
                :label="item.name"
                :value="item.handlepersonId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="请求人: ">
            <el-input style="width: 632px" v-model="plans.requestperson" placeholder="获取当前登录账号的用户名" class="inputwidth"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="submitbtn" type="primary" @click="onSubmit">确认</el-button>
            <el-button class="canclebtn nomal-button" @click="canclebtn">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import axios from '@/api';
export default {
  data () {
    return {
      plans: {
        name: '',
        system: '',
        deploytask: '',
        date: '',
        handleperson: '',
        requestperson: ''
      },
      systems: [],
      deploytasks: [],
      handlepersons: [],
      systemName: '',
      systemid: '',
      deploytaskName: ''
    }
  },
  created () {
    this.getTime()
    this.getSystems()
    // this.getDeployTask();
  },
  updated () {
    // this.getDeployTask();
  },
  methods: {
    // 获取所有系统
    getSystems () {
      let name = ''
      axios.getcigroupSystablist(name).then(res => {
        if (res.data.success) {
          this.systems = res.data.data.result
          console.log(this.systems)
        }
      })
    },
    // 获取所有部署任务
    getDeployTask () {
      let systemName = ''

      axios.searchDeploytask(systemName).then(res => {
        console.log('33333')
        if (res.data.status == 200) {
          this.deploytasks = res.data.data
        }
      })
    },
    // 提交数据
    onSubmit () {
      console.log('submit!')
    },
    // 取消新增
    canclebtn () {},
    // 获取当前时间
    getTime () {
      let time = new Date()
      this.plans.date = time
    },
    // 选择系统
    selectSystem (value) {
      this.plans.system = value
      this.systems.forEach(item => {
        if (item.systemId == value) {
          this.systemName = item.name
        }
      })
      this.getDeployTask()
    }
    // 选择部署任务
    // selectDeploytask(val){
    //     this.plans.deploytask = val;
    //     this.deploytasks.foreach(item =>{
    //         // if(this.item.)
    //     })
    // },
  }
}
</script>
<style scoped>
.release-plan-add {
  margin-top: 10px;
  margin-left: 10px;
}
.release-plan-add .release-all {
  width: 100%;
  background-color: #fff;
  padding-bottom: 60px;
  border-radius: 4px;
  box-shadow: 0 0 10px 0 #ddd;
}
.release-title {
  color: #585858;
  font-size: 16px;
  padding: 20px 0 0;
}
.release-title span {
  display: inline-block;
  width: 6px;
  border-radius: 10px;
  margin-right: 20px;
  height: 20px;
  background: #0280ff;
  vertical-align: middle;
}
.release-content {
  width: 60%;
  min-width: 640px;
  padding-left: 80px;
  margin-top: 10px;
}
.inputwidth {
  width: 60%;
}
.datelabel {
  float: right;
}
/* .submitbtn{
        margin-left:-10px;

        width:82px;
        height:35px;
    } */
/* .submitbtn span{
        line-height:35px;
    } */
.canclebtn {
  margin-left: 150px;
}
</style>
