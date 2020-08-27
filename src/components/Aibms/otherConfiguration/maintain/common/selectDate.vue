<template>
  <div class="select-content">
    <!-- 筛选 -->
    <el-form :inline="true" ref="dateFrom" :model="dateModel" label-width="100px">
      <el-form-item
        label="时间窗口："
        prop="daterange"
        :rules="[
          { required: true, message: '时间范围不能为空' }
        ]"
      >
        <el-date-picker
          v-model="dateModel.daterange"
          :disabled="readOnly"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="splitDate"
        />
      </el-form-item>
    </el-form>
    <p v-if="dateModel.daterange.length" class="tips">
      <i class="el-icon-warning" />
      提示信息：{{ mainHost }}等主机，在{{ startTime }}至{{ endTime }}，对{{ alarmType }}类型，取消告警通知。
    </p>
  </div>
</template>

<script>
export default {
  props: {
    startingTime: {
      type: String
    },
    endingTime: {
      type: String
    },
    readOnly: {
      required: true,
      default: false,
      type: Boolean
    }
  },
  watch: {
    startingTime (val, oldVal) {
      if (val.length) {
        if (this.$route.query.id) {
          this.dateModel.daterange.push(val)
          this.startTime = val
        }
      }
    },
    endingTime (val, oldVal) {
      if (val.length) {
        if (this.$route.query.id) {
          this.dateModel.daterange.push(val)
          this.endTime = val
        }
      }
    }
  },
  data: () => ({
    dateModel: {
      daterange: [],
      startTime: '',
      endTime: ''
    },
    mainHost: '',
    alarmType: '',
    startTime: '',
    endTime: ''
  }),
  methods: {
    addZero: num => ('00' + num).substr(('00' + num).length - 2, 2),
    dateFormat (date) {
      const year = date.getFullYear()
      const mouth = date.getMonth() + 1
      const dates = date.getDate()
      const hours = date.getHours()
      const minutes = date.getMinutes()
      const seconds = date.getSeconds()
      return year + '-' + this.addZero(mouth) +
        '-' + this.addZero(dates) + ' ' +
        this.addZero(hours) + ':' +
        this.addZero(minutes) + ':' +
        this.addZero(seconds)
    },
    splitDate() {
      this.startTime = this.dateModel.daterange != null ? this.dateFormat(this.dateModel.daterange[0]) : ''
      this.endTime = this.dateModel.daterange != null ? this.dateFormat(this.dateModel.daterange[1]) : ''
      console.log(this.mainHost,this.alarmType)
    }
  }
}
</script>

<style scoped>
.select-content {
  margin: 50px 20px 20px;
}
.tips {
  color: #fff;
  margin-bottom: 92px;
}
</style>