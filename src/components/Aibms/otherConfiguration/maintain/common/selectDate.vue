<template>
  <div class="select-content">
    <!-- 筛选 -->
    <el-form
      ref="dateFrom"
      :model="dateModel"
      label-width="160px"
      style="width: 80%"
    >
      <el-form-item
        label="时间周期："
        prop="daterange"
        :rules="[{ required: true, message: '时间范围不能为空' }]"
      >
        <el-date-picker
          v-model="dateModel.daterange"
          :disabled="readOnly"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="splitDate"
        />
      </el-form-item>
      <el-form-item
        label="维护时间："
        prop="timePicker"
        :rules="[{ required: true, message: '时间范围不能为空' }]"
      >
      <div style="font-size:0;">
        <el-time-select
          placeholder="起始时间"
          v-model="dateModel.startTime"
          :picker-options="{
            start: '00:00',
            step: '00:15',
            end: '23:59',
          }"
          @change="getPpickerTime"
        >
        </el-time-select>
        <el-time-select
          placeholder="结束时间"
          v-model="dateModel.endTime"
          :picker-options="{
            start: '00:00',
            step: '00:15',
            end: '23:59',
          }"
          @change="getPpickerTime"
        >
        </el-time-select>
        </div>
      </el-form-item>
    </el-form>
    <p
      v-if="dateModel.daterange.length && dateModel.endTime.length"
      class="tips font24 font-color"
    >
      <icon-svg icon-class="tips" />
      <!-- 提示信息：{{ mainHost }}等主机，在{{ startDay }}至{{ endDay }}，对{{
        alarmType
      }}类型，取消告警通知。 -->
      提示信息：在{{ startDay }} 至 {{ endDay }}，每天{{
        dateModel.startTime
      }}
      至 {{ tomorrow }}{{ dateModel.endTime }} , 取消告警通知。
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
    sTime: {
      type: String
    },
    eTime: {
      type: String
    },
    readOnly: {
      required: true,
      default: false,
      type: Boolean
    }
  },
  watch: {
    // 开始时间
    startingTime(val, oldVal) {
      if (val.length) {
        if (this.$route.query.id) {
          this.dateModel.daterange.push(val)
          this.startDay = val
        }
      }
    },
    // 结束时间
    endingTime(val, oldVal) {
      if (val.length) {
        if (this.$route.query.id) {
          this.dateModel.daterange.push(val)
          this.endDay = val
        }
      }
    },
    // 起始时间记录
    sTime(val, oldVal) {
      if (val.length) {
        if (this.$route.query.id) {
          this.dateModel.startTime = val
          this.dateModel.timePicker[0] = val
          this.startTime = val
        }
      }
    },
    // 结束时间记录
    eTime(val, oldVal) {
      if (val.length) {
        if (this.$route.query.id) {
          this.dateModel.endTime = val
          this.dateModel.timePicker[1] = val
          this.endTime = val
        }
      }
    }
  },
  data: () => ({
    dateModel: {
      daterange: [],
      timePicker: [],
      startDay: '',
      endDay: '',
      startTime: '',
      endTime: ''
    },
    mainHost: '',
    alarmType: '',
    startDay: '',
    endDay: '',
    startTime: '',
    endTime: '',
    tomorrow: ''
  }),
  methods: {
    // 对日期时间做分割判断
    getPpickerTime() {
      let startHour = this.dateModel.startTime.split(':')[0];
      let endHour = this.dateModel.endTime.split(':')[0]
      let startMinutes = this.dateModel.startTime.split(':')[1];
      let endMinutes = this.dateModel.endTime.split(':')[1]
      this.dateModel.timePicker[0] = this.dateModel.startTime
      this.dateModel.timePicker[1] = this.dateModel.endTime
      this.startTime = this.dateModel.startTime
      this.endTime = this.dateModel.endTime
      if (startHour > endHour) {
        this.tomorrow = '次日'
      } else if (startHour == endHour) {
        if (startMinutes > endMinutes) {
          this.tomorrow = '次日'
        } else {
          this.tomorrow = ''
        }
      } else {
        this.tomorrow = ''
      }
    },
    // 补零
    addZero: num => ('00' + num).substr(('00' + num).length - 2, 2),
    // 日期格式修改
    dateFormat(date) {
      const year = date.getFullYear()
      const mouth = date.getMonth() + 1
      const dates = date.getDate()
      // const hours = date.getHours()
      // const minutes = date.getMinutes()
      // const seconds = date.getSeconds()
      return year + '-' + this.addZero(mouth) +
        '-' + this.addZero(dates)
      // + ' ' +
      // this.addZero(hours) + ':' +
      // this.addZero(minutes) + ':' +
      // this.addZero(seconds)
    },
    // 日期格式分割
    splitDate() {
      this.startDay = this.dateModel.daterange != null ? this.dateFormat(this.dateModel.daterange[0]) : ''
      this.endDay = this.dateModel.daterange != null ? this.dateFormat(this.dateModel.daterange[1]) : ''
      console.log(this.mainHost, this.alarmType)
    }
  }
}
</script>

<style scoped>
.select-content {
  margin: 50px 0 20px;
}
.tips {
  /* color: #fff; */
  margin-bottom: 92px;
}
</style>
<style lang="scss" scope>
.el-date-editor.el-input{
  width: 49%;
  &+.el-date-editor.el-input{
    margin-left: 2%;
  }
}
</style>
