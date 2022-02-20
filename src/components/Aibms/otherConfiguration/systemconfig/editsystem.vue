<template>
  <div class="aia-content">

   <div class="wrapper-pannel">
   <h3>新增业务系统</h3>
    <el-form :model="configData" ref="configData" label-width="160px" label-position="right"  style="width:96%">

      <!-- <el-form-item label="新增业务系统"></el-form-item> -->

          <el-form-item prop="appname" label="业务系统名称">
<!-- <el-col :span="10"> -->
        <el-input v-model="configData.appname" style="width: 1100px"></el-input>
<!-- </el-col> -->
           </el-form-item>

      <el-form-item prop="ipaddress" label="IP地址">
<!-- <el-col :span="10"> -->
        <el-input v-model="configData.ipaddress" style="width: 1100px">></el-input>
<!-- </el-col> -->
      </el-form-item>

      <el-form-item prop="hostname" label="主机名">
        <!-- <el-col :span="10"> -->
        <el-input v-model="configData.hostname" style="width: 1100px">></el-input>
        <!-- </el-col> -->
      </el-form-item>

      <el-form-item prop="timelevel" label="运维级别">
        <!-- <el-col :span="10"> -->
        <!-- <el-input v-model="configData.timelevel"></el-input> -->
          <el-select v-model="configData.timelevel" placeholder="请选择" style="width: 1100px" :popper-append-to-body="false">
            <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"></el-option>
          </el-select>
        <!-- </el-col> -->
      </el-form-item>
  <h3>特殊时间周期设置</h3>
       <!-- <div class="font24 font-color" style="margin-top:-10px;margin-bottom:10px;">特殊时间周期设置</div> -->
      <el-form-item
      v-for="(timelist,index) in configData.timelists"
      :label="'时间周期' + String(Number(index)+1)"
      :key="timelist.key" >
          <el-date-picker
          v-model="timelist.startTime"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
         placeholder="选择开始日期"
         style="width: 500px">
         >
         </el-date-picker>

         <el-date-picker
          v-model="timelist.endTime"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
         placeholder="选择结束日期"
         style="width: 500px">
         >
         </el-date-picker>
            <i class="el-icon-circle-plus-outline add-icon-btn" @click="addList" />
            <i
                class="el-icon-remove-outline add-icon-btn"
                @click.prevent="removeList(timelist)"
              />
         <!-- <el-button @click="addList() "  type="primary" icon="el-icon-plus"></el-button> -->
         <!-- <el-button @click.prevent="removeList(timelist)" type="danger" icon="el-icon-delete"></el-button> -->
      </el-form-item>

      <el-form-item>
        <div class="operation-button">
        <!--  <el-button @click="prev" style="margin-right: 100px" type="primary" v-if="active === 1"
            >上一步</el-button
          > -->
          <!-- <el-button @click.stop="next" style="margin-right: 100px" type="primary" v-if="active === 0"
            >下一步</el-button
          > -->
          <el-button @click="save" class="save-btn common-btn"
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
  h3 {
      position: relative;
      margin-bottom:20px;
      font-size: 28px;
      font-weight: 500;
      height: 40px;
      line-height: 40px;
      margin-left: 10px;
      color: #BFF3FF;
      span {
        margin-left: 5px;
        font-size: 24px;
        cursor: pointer;
        color: #BFF3FF;
        font-weight: normal;
        .check-interface {
          width: 1.3em;
          height: 1.3em;
          font-size: 24px;
          vertical-align: middle;
          margin-right: 2px;
        }
      }
      &:before {
        content: '';
        position: absolute;
        z-index: 1;
        left: -30px;
        top: 10px;
        width: 18px;
        border-radius: 9px;
        height: 18px;
        background: #00E5FF;
      }
    }
  .wrapper-pannel {
    width: 100%;
    // background-color: rgba(4, 28, 37, 0.3);
    padding: 10px 0 60px;
    overflow: visible;
    .operation-button {
      margin-top: 12px;
      text-align: center;
      font-size:0;
      .el-button {
        // margin-right: 12px;
      }
      .cancel-button {
        // color: #fff;
        // border: 1px solid #436382;
        // &:hover {
        //   border: 1px solid #436382;
        //   color: #fff;
        //   background: transparent;
        // }
        // &:focus {
        //   color: #fff;
        //   background: transparent;
        // }
        // &:active {
        //   border: 1px solid #436382;
        //   background: transparent;
        //   color: #fff;
        // }
      }
    }
  }
}
.add-icon-btn{
  margin-top: 0;
}
</style>
