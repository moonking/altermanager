<template>
  <div class="aia-content">
<!--    <selectDate
      :startingTime="startDay"
      :endingTime="endDay"
      :sTime="startTime"
      :eTime="endTime"
      :readOnly="readOnly"
      ref="selectDate"
      v-show="active === 1"
    /> -->
    <div class="wrapper-pannel">
      <el-form :model="sourceForm" :rules="ruleForm" ref="sourceForm" label-width="160px">
        <el-form-item style="width: 100%" label="告警来源：" prop="source">
          <el-select  v-model="sourceForm.source" placeholder="请选择告警来源">
            <el-option v-for="item in sourcedata"
                    :key="item.id"
                    :label="item.label"
                    :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <select-date :startingTime="startDay"
      :endingTime="endDay"
      :sTime="startTime"
      :eTime="endTime"
      :readOnly="readOnly"
      ref="selectDate"></select-date>

      <div class="operation-button">
      <!--  <el-button @click="prev" style="margin-right: 100px" type="primary" v-if="active === 1"
          >上一步</el-button
        > -->
        <!-- <el-button @click.stop="next" style="margin-right: 100px" type="primary" v-if="active === 0"
          >下一步</el-button
        > -->
        <el-button @click="save" class="save-btn common-btn">保存</el-button
        >
        <el-button @click="cancel"  class="cancel-button">取消</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
// import selectHost from './common/selectHost'
import selectDate from './common/selectDate'
import selectCategory from './common/selectCategory'
import axios from '@/api'
export default {
  components: {
    // selectHost,
    selectDate,
    selectCategory
  },
  data: () => ({
    sourcedata: [
      {
        id: 1,
        value: 'BPC',
        label: 'BPC'
      }, {
        id: 2,
        value: 'Dynatrace',
        label: 'Dynatrace'
      }, {
        id: 3,
        value: 'Prometheus',
        label: 'Prometheus'
      },
      {
        id: 4,
        value: 'ARMS',
        label: 'ARMS'
      },
      {
        id: 5,
        value: 'Splunk',
        label: 'Splunk'
      }
    ],
    ruleForm: {
      source: [
        {
          required: true, message: '请您选择告警来源', trigger: 'change'}]
    },
    sourceForm: {
      source: ''
    },
    active: 0,
    editId: '',
    checkedTableData: [],
    checkedLabels: [],
    endTime: '',
    startTime: '',
    sortList: [],
    readOnly: false,
    startDay: '',
    endDay: ''
  }),
  created() {
    this.getMaintenanceDetail()
  },
  methods: {
    // 获取维护窗口详情
    getMaintenanceDetail() {
      //  查看或编辑
      if (this.$route.query.id) {
        this.editId = this.$route.query.id
        if (this.$route.query.read) {
          this.$route.meta.title = '查看维护窗口'
          this.readOnly = true
        } else {
          this.$route.meta.title = '编辑维护窗口'
        }
        axios.getMaintenanceDetail(this.$route.query.id).then(res => {
          if (res.data.success) {
            const resultData = res.data.data
            const { code, startDay, endDay, startTime, endTime } = resultData
            this.sourceForm.source = code
            this.startDay = startDay
            this.endDay = endDay
            this.startTime = startTime
            this.endTime = endTime
          } else {
            this.$notify.error({
              title: '提示',
              message: res.data.message
            })
          }
        })
      } else {
        this.$route.meta.title = '新增维护窗口'
      }
    },
    // 新增或修改维护窗口
    addOrEdit(methods) {
      const params = {
        id: this.editId,
        // systemList: this.$refs.selectHost.hostList,
        // sortIds: this.$refs.selectCategory.checkedCategory,
        code: this.sourceForm.source,
        startDay: this.$refs.selectDate.startDay,
        endDay: this.$refs.selectDate.endDay,
        startTime: this.$refs.selectDate.startTime,
        endTime: this.$refs.selectDate.endTime
      }
      methods(params).then(res => {
        if (res.data.success) {
          this.$notify.success({
            title: '提示',
            message: this.editId ? '修改成功' : '新增成功'
          })
          this.$router.push({
            path: '/Aibms/otherConfiguration/maintain',
            query: {
              code: 2
            }
          })
        } else {
          this.$notify({
            title: '提示',
            type: 'error',
            message: res.data.message
          })
        }
      })
    },
    // 保存新增或修改维护窗口
    save() {
      this.$refs.selectDate.$refs['dateFrom'].validate((valid) => {
        if (valid) {
          if (this.editId) {
            this.addOrEdit(axios.updateMaintenance)
          } else {
            this.addOrEdit(axios.addMaintenance)
          }
        } else {
          return false
        }
      })
    },
    // 跳转至维护窗口列表
    cancel() {
      this.$router.replace({
        path: '/Aibms/otherConfiguration/maintain',
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
    // background-color: rgba(4, 28, 37, 0.3);
    padding: 10px 0 60px;
    overflow: visible;
    .operation-button {
      margin-top: 12px;
      font-size: 0;
      text-align: center;
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
</style>
