<template>
  <div class="aia-content">
    <div class="wrapper-pannel">
      <el-steps :active="active" align-center>
        <el-step
          v-for="item in stepList"
          :key="item.value"
          :title="item.label"
        />
      </el-steps>
      <selectHost
        v-if="checkedTableData.length > 0 && $route.query.id"
        :checkedTableData="checkedTableData"
        :readOnly="readOnly"
        ref="selectHost"
        v-show="active === 0"
      />
      <selectHost
        v-if="!$route.query.id"
        :checkedTableData="checkedTableData"
        :readOnly="readOnly"
        ref="selectHost"
        v-show="active === 0"
      />
      <!-- <selectCategory
      ref="selectCategory"
      :checkedLabels="checkedLabels"
      :sortList="sortList"
      :readOnly="readOnly"
      v-show="active === 1" /> -->
      <selectDate
        :startingTime="startDay"
        :endingTime="endDay"
        :sTime="startTime"
        :eTime="endTime"
        :readOnly="readOnly"
        ref="selectDate"
        v-show="active === 1"
      />
      <div class="operation-button">
        <el-button @click="prev" type="primary" v-if="active === 1"
          >上一步</el-button
        >
        <el-button @click.stop="next" type="primary" v-if="active === 0"
          >下一步</el-button
        >
        <el-button @click="save" type="primary" v-if="active === 1 && !readOnly"
          >保存</el-button
        >
        <el-button @click="cancel" v-if="!readOnly" class="cancel-button"
          >取消</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import selectHost from './common/selectHost'
import selectDate from './common/selectDate'
import selectCategory from './common/selectCategory'
import axios from '@/api'
export default {
  components: {
    selectHost,
    selectDate,
    selectCategory
  },
  data: () => ({
    stepList: [
      { value: 1, label: '选择主机' },
      // { value: 2, label: '选择告警分类' },
      { value: 2, label: '选择时间窗口' }
    ],
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
            const { systemList, startDay, endDay, startTime, endTime, categoryList, labels } = resultData

            systemList.forEach((item) => { item.bl = true })
            this.checkedTableData = systemList
            this.checkedLabels = labels
            this.startDay = startDay
            this.endDay = endDay
            this.startTime = startTime
            this.endTime = endTime
            this.sortList = categoryList
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
    prev() {
      this.active--
    },
    next() {
      if (this.active === 0) {
        if (this.$refs.selectHost.hostList.length) {
          this.active++
          this.$refs.selectDate.mainHost = this.$refs.selectHost.hostList[0].hosts
        } else {
          this.$message.error('请选择主机')
        }
      }
      //  else if (this.active === 1 && this.$refs.selectCategory) {
      //   if (this.$refs.selectCategory.checkedCategory.length) {
      //     this.active++
      //     this.$refs.selectDate.alarmType = this.$refs.selectCategory.checkedClass
      //   } else {
      //     this.$message.error('请选择告警分类')
      //   }
      // }
    },
    addOrEdit(methods) {
      const params = {
        id: this.editId,
        systemList: this.$refs.selectHost.hostList,
        // sortIds: this.$refs.selectCategory.checkedCategory,
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
