<template>
  <div class="aia-content">
   <div class="wrapper-pannel">

    <el-form :model="configData" ref="configData" label-width="120px" label-position="left">

      <el-form-item label="新增业务系统"></el-form-item>

          <el-form-item prop="appname" label="业务系统名称">
<el-col :span="4">
        <el-input v-model="configData.appname"></el-input>
</el-col>
           </el-form-item>

      <el-form-item prop="ipaddress" label="IP地址">
<el-col :span="4">
        <el-input v-model="configData.ipaddress"></el-input>
</el-col>
      </el-form-item>

      <el-form-item prop="hostname" label="主机名">
        <el-col :span="4">
        <el-input v-model="configData.hostname"></el-input>
        </el-col>
      </el-form-item>

      <el-form-item prop="timelevel" label="运维级别">
        <el-col :span="4">
        <!-- <el-input v-model="configData.timelevel"></el-input> -->
          <el-select v-model="configData.timelevel" placeholder="请选择">
            <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"></el-option>
          </el-select>
        </el-col>
      </el-form-item>

    <el-form-item label="特殊时间周期设置" label-width="200px"></el-form-item>

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
      id: '',
      appname: '',
      hostname: '',
      ipaddress: '',
      timelevel: '',
      editonce: '',
      status: false,
      timelists: [{
        startTime: '',
        endTime: ''
      }]
    },
    options: [{
      value: '7*24',
      lable: '7*24'
    },
    {
      value: '5*8',
      label: '5*8'
    }]

  }),
  created() {
    this.init()
  },
  methods: {

    init() {
      console.log(this.$route.query.id)
      if (this.$route.query.id) {
      // 查看（只读状态）
        this.editId = this.$route.query.id
        // 获取告警详情
        axios.getSystemOne(this.editId).then(res => {
          if (res.data.success) {
            this.configData = res.data.data
            if (res.data.data.timelists == '') {
              this.configData.timelists = []
              this.configData.timelists.push({
                startTime: '',
                endTime: ''
              })
            }
          } else {
            this.$notify({
              title: '提示',
              type: 'error',
              message: res.data.message
            });
          }
        });
      }
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
      axios.addSystemOne(this.configData).then(res => {
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
