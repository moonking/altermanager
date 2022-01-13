<template>
  <div class="aia-content">
   <div class="wrapper-pannel">

    <el-form :model="configData" ref="configData" >

      <el-form-item label="5*8小时常规配置"></el-form-item>
      <el-form-item prop="timezone" label="时间区间">
        <el-time-select placeholder="起始时间" v-model="configData.startTime" :picker-options="{
          start: '00:00',
          step:'00:30',
          end:'24:00'
        }"></el-time-select>

        <el-time-select placeholder="结束时间" v-model="configData.endTime" :picker-options="{
          start: '00:00',
          step:'00:30',
          end:'24:00'
        }"></el-time-select>

      </el-form-item>

      <el-form-item label="告警方式">
        <el-checkbox v-model="configData.email">邮件</el-checkbox>
        <el-checkbox v-model="configData.sms">短信</el-checkbox>
      </el-form-item>

    <el-form-item label="特殊时间周期设置:       (该周期为静默期,不发送任何告警通知)"></el-form-item>

      <el-form-item
      v-for="(timelist,index) in configData.timelists"
      :label="'时间周期' + String(Number(index)+1)"
      :key="timelist.key" >
          <el-date-picker
          v-model="timelist.startTime"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
         placeholder="选择开始日期">
         </el-date-picker>

         <el-date-picker
          v-model="timelist.endTime"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
         placeholder="选择结束日期">
         </el-date-picker>
         <el-button @click="addList() "  type="primary" icon="el-icon-plus"></el-button>
         <el-button @click.prevent="removeList(timelist)" type="danger" icon="el-icon-delete"></el-button>
      </el-form-item>

      <el-form-item>
        <div class="operation-button">
        <!--  <el-button @click="prev" style="margin-right: 100px" type="primary" v-if="active === 1"
            >上一步</el-button
          > -->
          <!-- <el-button @click.stop="next" style="margin-right: 100px" type="primary" v-if="active === 0"
            >下一步</el-button
          > -->
          <el-button @click="save" style="margin-right: 100px" type="primary"
            >保存</el-button
          >
          <el-button @click="cancel"  class="cancel-button"
            >取消</el-button
          >
        </div>
      </el-form-item>

    </el-form>

    </div>
  </div>
</template>

<script>
// import selectHost from './common/selectHost'
import selectDate from '../maintain/common/selectDate'
import axios from '@/api'
export default {
  components: {
    selectDate
  },

  data: () => ({
    configData: {
      code: '5',
      level: '5*8',
      startTime: '',
      endTime: '',
      email: true,
      sms: true,
      timelists: [{
        startTime: '',
        endTime: ''
      }]
    }

  }),
  created() {
    this.getConfig()
  },
  methods: {

    getConfig() {
      axios.getSystemLevel('5').then(res => {
        if (res.data.success == true) {
          this.configData = res.data.data
          if (this.configData.timelists.length == 0) {
            this.configData.timelists.push({startTime: '', endTime: ''})
          }
          console.log(this.configData)
        }
      })
    },

    removeList(item) {
      var index = this.configData.timelists.indexOf(item)
      if (index !== -1) {
        this.configData.timelists.splice(index, 1)
      }
    },

    addList() {
      this.configData.timelists.push({
        startTime: '',
        endTime: ''
      })
    },

    // 保存新增或修改维护窗口
    save() {
      axios.configSystemLevel(this.configData).then(res => {
        if (res.data.success == true) {
          this.$notify({
            title: '提示',
            message: '保存成功',
            type: 'success'
          })
        } else {
          this.$notify.error({
            title: '提示',
            message: res.data.message
          })
        }
      })
      // this.$refs.selectDate.$refs['dateFrom'].validate((valid) => {
      //   if (valid) {
      //     if (this.editId) {
      //       this.addOrEdit(axios.updateMaintenance)
      //     } else {
      //       this.addOrEdit(axios.addMaintenance)
      //     }
      //   } else {
      //     return false
      //   }
      // })

      console.log(this.configData)
    },
    // 跳转至前页
    cancel() {
      this.$router.replace({
        path: '/Aibms/otherConfiguration/systemOperation',
        query: { code: 2 }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.aia-content {
  position: relative;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  .wrapper-pannel {
    width: 100%;
    background-color: rgba(4, 28, 37, 0.3);
    padding: 10px 0 60px;
    overflow: visible;
    .operation-button {
      margin-top: 12px;
      text-align: center;
      .el-button {
        margin-right: 12px;
      }
      .cancel-button {
        color: #fff;
        border: 1px solid #fff;
        &:hover {
          border: 1px solid #fff;
          color: #fff;
          background: transparent;
        }
        &:focus {
          color: #fff;
          background: transparent;
        }
        &:active {
          border: 1px solid #fff;
          background: transparent;
          color: #fff;
        }
      }
    }
  }
}
</style>
