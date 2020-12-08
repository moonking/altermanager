<template>
  <div class="cronPage">
    <div
      class="item-block-title paddingTop"
      @click="openController = !openController"
    >
      <div class="item-block-title-mark"></div>
      <span class="item-block-title-font" style="color: #fff">
        {{
          status === 'read'
            ? '查看定时任务'
            : status === 'create'
            ? '新增定时任务'
            : '编辑定时任务'
        }}
      </span>
      <i
        class="icons el-icon-arrow-right"
        :style="{ transform: openController ? 'rotate(90deg)' : 'rotate(0)' }"
      ></i>
    </div>
    <div v-if="openController">
      <!-- <el-form label-width="140px" class="form-search" :inline="true">
        <el-form-item label="发布任务类型：">
          <el-select
            v-model="taskType"
            placeholder="请选择发布任务类型"
            @change="chooseTaskType"
            :disabled="status === 'read'"
            clearable
          >
            <el-option label="构建" value="1"></el-option>
            <el-option label="部署" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发布任务: ">
          <el-select
            v-model="taskItem"
            placeholder="请选择发布任务"
            :disabled="status === 'read'"
            clearable
            @change="chooseCodition"
          >
            <el-option
              v-for="(task, index) in taskList"
              :label="task.name"
              :value="task.manageId"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form> -->
      <el-form label-width="140px">
        <el-form-item label="任务名称：">
          <el-input
            :disabled="status === 'read' || taskType === '2'"
            v-model="name"
            :style="{ width: '460px' }"
          ></el-input>
        </el-form-item>
        <el-form-item label="发起地址：">
          <el-input
            :disabled="status === 'read' || taskType === '2'"
            v-model="url"
            @blur="getUrl"
            :style="{ width: '460px' }"
          ></el-input>
          <el-select
            v-if="relation"
            class="select-item"
            v-model="relationType"
            placeholder="请选择类型"
            :disabled="status === 'read'"
            @change="getUrlRelation()"
          >
            <el-option label="day" value="day"></el-option>
            <el-option label="hour" value="hour"></el-option>
          </el-select>
          <el-input-number
            v-if="relation"
            v-model="relationNum"
            :disabled="status === 'read'"
            controls-position="right"
            @change="getUrlRelation()"
            :min="0"
            :max="30"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="定时策略：">
          <el-radio-group
            v-model="radio"
            :disabled="status === 'read' || taskType === '2'"
          >
            <el-radio :label="1">周期性任务</el-radio>
            <el-radio :label="2">一次性任务</el-radio>
            <el-radio :label="3">间隔性任务</el-radio>
          </el-radio-group>
        </el-form-item>
        <form label-width="140px" v-if="radio === 1">
          <el-form-item label="选择周期范围：">
            <el-date-picker
              v-model="startDate"
              type="date"
              :disabled="status === 'read'"
              clearable
              @clear="handleClearDate(1)"
              :picker-options="startPickOptions"
              placeholder="开始日期（yyyy-MM-dd）"
            ></el-date-picker>
            <span>至</span>
            <el-date-picker
              v-model="endDate"
              type="date"
              :disabled="status === 'read'"
              clearable
              @clear="handleClearDate(2)"
              :picker-options="endPickOptions"
              placeholder="结束日期（yyyy-MM-dd）"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="执行单位：">
            <div class="display-box">
              <el-select
                class="select-item"
                v-model="excute"
                placeholder="请选择执行方式"
                :disabled="status === 'read'"
                clearable
                @clear="handleClearType"
              >
                <el-option label="按周执行" value="1"></el-option>
                <el-option label="按日执行" value="2"></el-option>
                <!-- <el-option label="按时执行" value="3"></el-option>
                <el-option label="按分钟执行" value="4"></el-option> -->
              </el-select>
              <el-input
                class="input-item"
                v-if="excute == 1"
                v-model="rangWeek"
                :disabled="status === 'read'"
                placeholder="请输入星期几（1-7）,多选格式: 1,2,3"
              ></el-input>
              <el-input
                class="input-item"
                v-if="excute == 2"
                v-model="rangDay"
                :disabled="status === 'read'"
                placeholder="请输入日（1-31）,多选格式: 1,2,3"
              ></el-input>
              <!-- <el-input
                class="input-item"
                v-if="excute == 2"
                v-model="rangDay"
                :disabled="status === 'read'"
                placeholder="请输入小时（0-23）,多选格式: 0,1,2,3"
              ></el-input>
              <el-input
                class="input-item"
                v-if="excute == 2"
                v-model="rangDay"
                :disabled="status === 'read'"
                placeholder="请输入小时（0-23）,多选格式: 0,1,2,3"
              ></el-input> -->
            </div>
          </el-form-item>
          <el-form-item label="执行时间：">
            <el-time-picker
              :disabled="status === 'read'"
              clearable
              @clear="handleClearTime(1)"
              :picker-options="{
                format: 'HH:mm',
              }"
              format="HH:mm"
              value-format="HH:mm"
              v-model="rangTime"
              placeholder="HH:mm"
            ></el-time-picker>
          </el-form-item>
          <el-form-item>
            <div class="icon-tip">
              <icon-svg icon-class="jinggao" class="gray-icon-color" />
              <div class="cont-tip">
                <span>若不填写执行时间，系统将会默认在00：00执行</span>
              </div>
            </div>
          </el-form-item>
          <el-form-item class="result-str">{{ str }}</el-form-item>
        </form>
        <form label-width="140" v-if="radio === 2">
          <el-form-item>
            <el-date-picker
              class="date-item"
              v-model="onceDate"
              type="date"
              :disabled="status === 'read' || taskType === '2'"
              :picker-options="pickOptions"
              clearable
              @clear="handleClearDate(3)"
              placeholder="选择日期"
            ></el-date-picker>
            <el-time-picker
              class="date-item"
              :disabled="status === 'read' || taskType === '2'"
              clearable
              @clear="handleClearTime(2)"
              v-model="onceTime"
              :picker-options="{
                format: 'HH:mm',
              }"
              value-format="HH:mm"
              placeholder="选择时间"
            ></el-time-picker>
          </el-form-item>
          <el-form-item class="result-str">{{ onceStr }}</el-form-item>
        </form>
        <el-form
          :model="intervalForm"
          label-width="140"
          v-if="radio === 3"
          :rules="intervalFormRules"
          ref="intervalForm"
          style="margin-left: 20px"
        >
          <el-form-item class="result-str" style="margin-left: 120px">
            <!-- 从
              <el-input v-model="intervalForm.startTime" type="number" style="width: 100px" @input="maxLimit"></el-input>
              <el-select style="width: 100px" v-model="intervalForm.timeType">
                <el-option label="秒" value="1"></el-option>
                <el-option label="分钟" value="2"></el-option>
                <el-option label="小时" value="3"></el-option>
              </el-select>
              开始， -->
            每
            <el-input
              v-model="intervalForm.interval"
              type="number"
              style="width: 100px"
              min="0"
              :disabled="status === 'read'"
            ></el-input>
            <!-- <el-select style="width: 100px" v-model="intervalForm.timeType">
                <el-option label="秒" value="1"></el-option>
                <el-option label="分钟" value="2"></el-option>
                <el-option label="小时" value="3"></el-option>
              </el-select> -->
            分钟执行一次
          </el-form-item>
          <el-form-item
            class="result-str"
            label="持续告警设置："
            prop="keepAlert"
          >
            当critical级别告警已经持续
            <el-input
              :disabled="status === 'read'"
              v-model="intervalForm.keepAlert"
              placeholder="请输入"
              :style="{ width: '100px' }"
            ></el-input>
            <!-- <el-select
              v-model="intervalForm.keepAlert"
              placeholder="请选择"
              :style="{ width: '100px' }"
            >
              <el-option
                v-for="item in alertTimeArr"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select> -->
            分钟并且未确认，则下次告警分别在
            <el-input
              v-for="(item, index) in alertTimeList"
              :key="index"
              :disabled="status === 'read'"
              v-model="item.value"
              placeholder="请输入"
              :style="{ width: '100px' }"
            ></el-input>
            <!-- <el-select
              v-for="(item, index) in alertTimeList"
              :key="index"
              v-model="item.value"
              placeholder="请选择"
              :style="{ width: '100px' }"
            >
              <el-option
                v-for="item in alertTimeArr"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select> -->
            分钟后。
          </el-form-item>
        </el-form>
      </el-form>
    </div>
    <div class="footer-area">
      <el-button
        type="primary"
        v-if="status !== 'read'"
        style="margin-right: 100px"
        @click.stop="confirmCrontab"
        >保存</el-button
      >
      <el-button @click="cancelConfirm" class="cancel-button">取消</el-button>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import axios from '@/api';
export default {
  name: 'crontabPage',
  data() {
    var validateAlertTime = (rule, value, callback) => {
      if (value !== '' && this.alertTimeList[0].value === '') {
        callback(new Error('请输入下次告警时间！'));
      } else {
        callback();
      }
    };
    return {
      code: '',
      name: '',
      url: '',
      taskType: '',
      taskItem: '',
      radio: 1, // 策略单选控制
      excute: '', // 执行方式
      rangWeek: '', // 填写周数
      rangTime: '', // 选择时间
      rangDay: '', // 填写天数
      onceDate: '',
      onceTime: '',
      str: '', // 周期执行的信息
      onceStr: '', // 一次执行的信息
      startDate: '',
      endDate: '',
      cronObj: {
        second: '',
        minute: '',
        hour: '',
        day: '',
        month: '',
        week: '',
        year: ''
      },
      intervalFormRules: {
        keepAlert: [{ validator: validateAlertTime, trigger: 'blur' }]
      },
      alertTimeList: [
        {
          key: 'alertAfterOne',
          value: ''
        },
        {
          key: 'alertAfterTwo',
          value: ''
        },
        {
          key: 'alertAfterThree',
          value: ''
        },
        {
          key: 'alertAfterFour',
          value: ''
        },
        {
          key: 'alertAfterFive',
          value: ''
        }
      ],
      // alertTimeArr: [
      //   {
      //     value: '5',
      //     label: '5'
      //   },
      //   {
      //     value: '10',
      //     label: '10'
      //   },
      //   {
      //     value: '15',
      //     label: '15'
      //   },
      //   {
      //     value: '20',
      //     label: '20'
      //   },
      //   {
      //     value: '25',
      //     label: '25'
      //   }
      // ],
      alert: false,
      weekAlert: false,
      status: this.$route.params.status,
      taskList: [],
      openController: true, // 控制展开或收缩
      intervalForm: {
        startTime: 0,
        timeType: '1',
        interval: 0,
        keepAlert: ''
      },
      relationNum: '',
      relationType: '',
      copyUrl: ''
    }
  },
  computed: {
    alertTimeArr() {
      // eslint-disable-next-line no-unused-vars
      if (this.intervalForm.interval === 0) return
      let arr = []
      for (let i = 1; i < 6; i++) {
        arr.push(
          {
            value: i * this.intervalForm.interval,
            label: i * this.intervalForm.interval
          }
        )
      }
      return arr
    },
    relation() {
      // eslint-disable-next-line no-unused-vars
      let bl = this.url.includes('/mysql/dump')
      return bl
    },
    endPickOptions() {
      return {
        disabledDate: time => {
          if (this.startDate) {
            return time.getTime() < moment(this.startDate).valueOf()
          } else {
            return time.getTime() < moment().valueOf() - 1000 * 60 * 60 * 24
          }
        }
      }
    },
    startPickOptions() {
      return {
        disabledDate: time => {
          if (this.endDate) {
            return (
              time.getTime() >
              moment(this.endDate).valueOf() - 1000 * 60 * 60 * 24
            )
          } else {
            return time.getTime() < moment().valueOf() - 1000 * 60 * 60 * 24
          }
        }
      }
    },
    pickOptions() {
      return {
        disabledDate(time) {
          return time.getTime() < moment().valueOf() - 1000 * 60 * 60 * 24
        }
      }
    }
  },
  created() {
    if (
      this.$route.params.status === 'read' ||
      this.$route.params.status === 'edit'
    ) {
      this.fetchDetail(this.$route.query.manageId)
    }
  },
  watch: {
    /**
     * 监听周期的输入
     * 对值进行验证和处理
     */
    rangWeek: {
      handler(val) {
        this.inputWeek(val)
      },
      deep: true
    },
    /**
     * 监听天数的输入
     */
    rangDay: {
      handler(val) {
        this.inputDay(val)
      },
      deep: true
    },
    /**
     * 监听时间的选择
     */
    rangTime: {
      handler(val) {
        this.selectRangTime(val)
      },
      deep: true
    },
    /**
     * 周期执行中 开始时间的选择
     */
    startDate: {
      handler(val) {
        this.getStartDate(val)
      },
      deep: true
    },
    /**
     * 周期执行中，结束时间的选择
     */
    endDate: {
      handler(val) {
        this.getEndDate(val)
      },
      deep: true
    },
    /**
     * 一次执行中，日期选择
     */
    onceDate: {
      handler(val) {
        this.chooseOnceDate(val)
      },
      deep: true
    },
    /**
     * 一次执行中，时间的选择
     */
    onceTime: {
      handler(val) {
        this.chooseOnceTime(val)
      },
      deep: true
    }
  },
  methods: {
    getUrl() {
      this.copyUrl = this.url
    },
    // 拼接url
    getUrlRelation() {
      let strList = this.copyUrl.split('/')
      let length = strList.length
      strList[length] = this.relationType
      strList[length + 1] = this.relationNum
      this.url = strList.join('/')
    },
    maxLimit(val) {
      const typeMaxCountMap = {
        '1': 60,
        '2': 60,
        '3': 24
      }
      const time = typeMaxCountMap[this.intervalForm.timeType]
      this.intervalForm.startTime = val > time ? time : val
    },
    // 清空日期的选择
    handleClearDate(num) {
      if (num === 1) {
        this.startDate = ''
      } else if (num === 2) {
        this.endDate = ''
      } else {
        this.onceDate = ''
      }
    },
    // 清空时间选择
    handleClearTime(num) {
      if (num === 1) {
        this.rangTime = ''
      } else {
        this.onceTime = ''
      }
    },
    //  清空执行方式的下拉框
    handleClearType() {
      this.alert = false
      this.weekAlert = false
      this.rangWeek = ''
      this.rangDay = ''
      this.relationNum = ''
      this.relationType = ''
    },
    // 判断时间的有效性
    verdictDate(date) {
      let curDate
      if (date) {
        let curTimeStamp = +new Date()
        let argTimeStamp = +new Date(date)
        if (argTimeStamp - curTimeStamp >= 0) {
          curDate = true
        } else {
          curDate = false
        }
      } else {
        curDate = false
      }
      return curDate
    },
    // 获取详情
    fetchDetail(id) {
      axios.getTimingTaskDetail(id).then(res => {
        if (res.data.code === 200) {
          let data = res.data.data
          let strList
          // this.chooseTaskType(data.taskType)
          // this.taskType = data.taskType
          this.name = data.name
          this.url = data.url
          this.code = data.code
          if (this.relation) {
            strList = this.url.split('/')
            let length = strList.length
            this.relationType = strList[length - 2]
            this.relationNum = strList[length - 1]
            this.copyUrl = strList.slice(0, 5).join('/')
          }

          this.taskItem = data.manageId
          this.handleCronExpr(
            data.cronExpr,
            data.timePoint,
            data.humanityTime,
            data.cronStrategy,
            data.stormConfig
          )
        } else {
          this.$notify({
            type: 'error',
            message: res.data.message
          })
        }
      })
    },
    // 处理cron 表达式
    handleCronExpr(cron, timePoint, humanityTime, cronStrategy, stormConfig) {
      let cronArr = cron.split(' ')
      // 判断是一次还是周期
      if (cronStrategy === 'once') {
        this.radio = 2
        this.onceStr = humanityTime
        this.onceDate = timePoint
        this.cronObj.year = cronArr[6]
        this.cronObj.month = cronArr[4]
        this.cronObj.day = cronArr[3]
        let hour = this.handleTime(cronArr[2])
        let minute = this.handleTime(cronArr[1])
        this.cronObj.hour = cronArr[2]
        this.cronObj.minute = cronArr[1]
        this.onceTime = `${hour}:${minute}`
      } else if (cronStrategy === 'cycle') {
        this.radio = 1
        this.str = humanityTime
        let DateStr = timePoint.split(' ')
        if (cronArr[6]) {
          // 年
          this.cronObj.year = cronArr[6]
        }
        if (cronArr[4] !== '*') {
          // 月
          this.cronObj.month = cronArr[4]
        }
        if (cronArr[2] !== '*') {
          // 时
          this.cronObj.hour = cronArr[2]
        }
        if (cronArr[1] !== '*') {
          // 分
          this.cronObj.minute = cronArr[1]
        }
        // 日期回显
        this.startDate = DateStr[0]
        this.endDate = DateStr[DateStr.length - 1]
        if (cronArr[3] !== '?' && cronArr[3] !== '*') {
          // 判断表达式中日是否存在
          this.excute = '2'
          this.rangDay = cronArr[3]
          this.cronObj.day = cronArr[3]
        } else if (cronArr[5] !== '?' && cronArr[5] !== '*') {
          // 判断表达式中周是否存在
          this.excute = '1'
          let week = this.handleReleaseWeek(cronArr[5])
          this.rangWeek = week.showWeek
          this.cronObj.week = week.cronWeek
        }
        if (cronArr[2] !== '*') {
          // 时间选择的回显
          let hour = this.handleTime(cronArr[2])
          let minute = this.handleTime(cronArr[1])
          this.rangTime = `${hour}:${minute}`
        }
      } else if (cronStrategy === 'interval') {
        this.radio = 3
        this.intervalForm.interval = cronArr[1].split('/')[1]
        this.alertTimeList.forEach((item) => {
          item.value = stormConfig[item.key]
        })
        this.intervalForm.keepAlert = stormConfig.keepAlert
      }
    },
    // 一次执行的操作
    handleOnceCron(time, condition) {
      let year, month, day, hour, minute, second
      let date = new Date(time)
      year = date.getFullYear()
      month = date.getMonth() + 1
      day = date.getDate()
      hour = date.getHours()
      minute = date.getMinutes()
      second = date.getSeconds()
      if (condition === 1) {
        // condition 1--获取文字信息  2--获取cron表达式
        let str = `将在${year}年${month}月${day}日 ${hour}小时${minute}分${second}秒时执行`
        return str
      } else {
        let cron = `${second} ${minute} ${hour} ${day} ${month} ? ${year}-${year}`
        return cron
      }
    },
    // 时间判断
    handleTime(time) {
      let cur = ''
      if (time * 1 < 10) {
        cur = `0${time}`
      } else {
        cur = time
      }

      return cur
    },
    chooseOnceDate(val) {
      this.onceDate = val
      let year = this.handleOnceYear(val, '')
      if (this.onceTime) {
        this.onceStr = `${year} ${this.onceTime}执行`
      } else {
        this.onceStr = `${year} 00:00执行`
      }
    },
    chooseOnceTime(val) {
      let year = this.handleOnceYear(this.onceDate, '')
      if (val) {
        // this.onceTime = val;
        // let hour = val.split(":")[0];
        // let minute = val.split(":")[1];
        this.onceStr = `${year} ${val}执行`
      } else {
        this.onceStr = `${year} 00:00 执行`
      }
    },
    handleOnceYear(val) {
      let date
      if (val) {
        date = new Date(val)
      } else {
        date = new Date()
      }
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let day = date.getDate()

      return (this.str = `将在${year}年${month}月${day}号`)
    },
    // 执行策略的选择
    chooseCodition(val) {
      if (this.taskType === '2') {
        for (let key of this.taskList) {
          if (key.manageId === val) {
            if (key.planStartTime) {
              this.onceStr = this.handleOnceCron(key.planStartTime, 1)
              let timeArr = key.planStartTime.split(' ')
              this.onceDate = timeArr[0]
              this.onceTime = timeArr[timeArr.length - 1]
            } else {
              this.onceDate = ''
              this.onceTime = ''
              this.onceStr = ''
            }
          }
        }
      }
    },
    // 任务类型的下拉框操作
    chooseTaskType(val) {
      if (val === '') {
        this.taskList = []
        return
      }
      this.taskList = []
      this.taskItem = ''
      axios.cronTask(val).then(result => {
        if (result.data.code === 200) {
          this.taskList = result.data.data.result
        }
      })
      if (val === '2') {
        this.radio = 2
      } else {
        this.radio = 1
      }
    },
    // 选择开始日期的下拉框
    getStartDate(val) {
      let year = this.formatYear(val, this.endDate)
      this.handleDateForCron(year)
    },
    // 选择结束日期的下拉框
    getEndDate(val) {
      let year = this.formatYear(this.startDate, val)
      this.handleDateForCron(year)
    },
    // 处理开始时间和结束时间的判断
    handleDateForCron(year) {
      if (this.rangTime) {
        if (this.rangWeek) {
          let week = this.formatWeek(this.rangWeek * 1)
          this.str = `${year}, 每周${week} ${this.rangTime} 执行`
        } else if (this.rangDay) {
          this.str = `${year}, 每月${this.rangDay}号 ${this.rangTime} 执行`
        } else {
          this.str = `${year}, 每天 ${this.rangTime} 执行`
        }
      } else {
        if (this.rangWeek) {
          let week = this.handleWeeks()
          this.str = `${year}, 每周${week.length > 0 ? week.join(',') : ''
            } 00:00 执行`
        } else if (this.rangDay) {
          this.str = `${year}, 每月${this.rangDay}号 00:00 执行`
        } else {
          this.str = `${year}, 每天 00:00 执行`
        }
      }
    },

    // 确认按钮保存操作
    confirmCrontab() {
      if (!this.name) {
        this.$notify({
          type: 'warning',
          title: '提示',
          message: '请填写任务名称！'
        })
        return
      }
      let cron = []
      const radio = this.radio
      if (radio === 1) {
        console.log(this.alert, this.weekAlert)
        // 将存储好的cron需求元素合并成cron表达式
        if (this.alert || this.weekAlert) {
          if (this.cronObj.year) {
            cron.unshift(this.cronObj.year)
          }
          cron.unshift(
            this.cronObj.day ? '?' : this.cronObj.week ? this.cronObj.week : '?'
          )

          cron.unshift(this.cronObj.month ? this.cronObj.month : '*')

          cron.unshift(
            this.cronObj.week ? '?' : this.cronObj.day ? this.cronObj.day : '*'
          )
          cron.unshift(this.cronObj.hour ? this.cronObj.hour : 0)
          cron.unshift(this.cronObj.minute ? this.cronObj.minute : 0)
          cron.unshift(this.cronObj.second ? this.cronObj.second : 0)
          let cronStr = cron.join(' ')
          let params = {
            // code: this.taskItem,
            cronExpr: cronStr,
            humanityTime: this.str,
            timePoint: `${moment(this.startDate).format('YYYY-MM-DD')} ${moment(
              this.endDate
            ).format('YYYY-MM-DD')}`,
            cronStrategy: 'cycle',
            name: this.name,
            url: this.url
          }
          if (this.status === 'create') {
            params.id = 0
            this.saveCronTask(params)
          } else {
            params.id = this.$route.query.manageId
            params.code = this.code
            this.editCronTask(params)
          }
        } else {
          this.$notify({
            type: 'warning',
            title: '提示',
            message: '日期或周数不正确'
          })
        }
      } else if (radio === 2) {
        if (this.onceDate && this.onceTime) {
          let fullDate = `${moment(this.onceDate).format('YYYY-MM-DD')} ${this.onceTime
            }`
          let validate = this.verdictDate(fullDate)
          let cronStr = this.handleOnceCron(fullDate, 2)
          let params = {
            manageId: this.taskItem,
            cronExpr: cronStr,
            humanityTime: this.onceStr,
            timePoint: `${moment(this.onceDate).format('YYYY-MM-DD')}`,
            cronStrategy: 'once',
            name: this.name,
            url: this.url
          }
          if (validate) {
            if (this.status === 'create') {
              params.id = 0
              this.saveCronTask(params)
            } else {
              params.id = this.$route.query.manageId
              params.code = this.code
              this.editCronTask(params)
            }
          } else {
            this.$notify({
              type: 'warning',
              title: '提示',
              message:
                '当前发布时间已过期，发布时间必须大于当前时间，请前往发布管理修改'
            })
          }
        } else {
          this.$notify({
            type: 'error',
            message: '确保定时时间完整！'
          })
        }
      } else if (radio === 3) {
        const interval = this.intervalForm.interval
        let cronStr = this.handleIntervalCron(interval)
        let stormConfig = {}
        stormConfig.dimension = interval
        stormConfig.keepAlert = this.intervalForm.keepAlert
        this.alertTimeList.forEach((item) => {
          stormConfig[item.key] = item.value
        })
        let params = {
          manageId: this.taskItem,
          name: this.name,
          url: this.url,
          cronExpr: cronStr,
          humanityTime: `每${interval}分钟执行一次`,
          timePoint: '',
          cronStrategy: 'interval',
          stormConfig: stormConfig
        }
        if (this.status === 'create') {
          params.id = 0
          this.saveCronTask(params)
        } else {
          params.id = this.$route.query.manageId
          params.code = this.code
          this.editCronTask(params)
        }
      }
    },
    handleIntervalCron(interval) {
      return `0 0/${interval} * * * ?`
    },
    saveCronTask(params) {
      axios.addTimingTask(params).then(result => {
        if (result.data.code === 200) {
          this.$notify({
            type: 'success',
            message: '新增成功'
          })
          this.$router.push({
            path: '/Aibms/otherConfiguration/timingList',
            query: {
              code: 2
            }
          })
        } else {
          this.$notify({
            type: 'error',
            message: result.data.message
          })
        }
      })
    },
    // 取消按钮操作
    cancelConfirm() {
      this.$router.push({
        path: '/Aibms/otherConfiguration/timingList',
        query: {
          code: 2
        }
      })
    },
    // 按周执行的转换
    inputWeek(val) {
      let reg1 = /(\d+)(,[\d]*)*$/
      let reg2 = /^[\d]+$/
      let dataSource
      let weekStr = ''
      let year = this.formatYear(this.startDate, this.endDate)
      if (val !== '' && val) {
        let isRepeat = this.handleJudgeRepeat(val)
        if (isRepeat) {
          this.weekAlert = false
          weekStr = '输入数值中存在重复值！'
        } else {
          this.weekAlert = true
          weekStr = ''
        }
        if (this.weekAlert) {
          // 对输入数字的验证
          if (val.indexOf(',') > -1) {
            dataSource = this.handleMatchVal(val, reg1)
          } else {
            // 只有单个值时的处理
            dataSource = this.handleSingleVal(val, reg2)
          }
          // 判断是否正确来进行后续操作
          this.handleJudge(
            year,
            dataSource.newStr,
            dataSource.stringCode,
            dataSource.weekArr,
            dataSource.weekStr
          )
        } else {
          this.$notify({
            type: 'warning',
            title: '提示',
            message: weekStr
          })
        }
      } else {
        this.cronObj.week = ''
        if (this.rangTime) {
          this.str = `${year}, 每天 ${this.rangTime} 执行`
        } else {
          this.str = `${year}, 每天 00:00 执行`
        }
      }
    },
    // 校验重复
    handleJudgeRepeat(val) {
      let hash = {}
      let temp = val.split(',')
      let newTemp = temp.filter(item => item)
      for (let i in newTemp) {
        if (hash[newTemp[i]]) {
          hash[newTemp[i]] += 1
        } else {
          hash[newTemp[i]] = 1
        }
      }
      let repeatState = Object.values(hash)
      let status = repeatState.some(item => {
        return item > 1
      })
      return status
    },
    // 多个数值验证
    handleMatchVal(val, reg1) {
      let weekStr = '',
        newStr = [],
        weekArr = []
      if (reg1.test(val)) {
        let strArr = val.split(',')
        let newStrArr = strArr.filter(item => item)
        for (let k of newStrArr) {
          if (parseInt(k) > 0 && parseInt(k) <= 7) {
            // 根据输入的星期数来转换  西方周日为开始 例如：1-7 周一数字应为2 1代表周日
            newStr.push(k * 1 + 1 <= 7 ? k * 1 + 1 : 1)
            weekArr.push(this.formatWeek(k * 1))
            this.weekAlert = true
          } else {
            this.weekAlert = false
            weekStr = '星期数必须在1-7以内'
          }
        }
      } else {
        this.weekAlert = false
        weekStr = '周期输入格式有误！'
      }
      return {
        weekStr: weekStr,
        weekArr: weekArr,
        newStr: newStr
      }
    },
    // 只有单个值时的处理
    handleSingleVal(val, reg2) {
      let weekStr = '',
        weekArr = [],
        stringCode = ''
      if (reg2.test(val)) {
        if (parseInt(val) > 0 && parseInt(val) <= 7) {
          weekArr.push(this.formatWeek(val * 1))
          stringCode = Number(val) + 1 <= 7 ? Number(val) + 1 : 1
          this.weekAlert = true
        } else {
          this.weekAlert = false
          weekStr = '星期数必须在1-7以内'
        }
      } else {
        this.weekAlert = false
        weekStr = '周期输入格式有误！'
      }
      return {
        weekStr: weekStr,
        weekArr: weekArr,
        stringCode: stringCode
      }
    },
    // 判断是否正确来进行后续操作
    handleJudge(year, newStr, stringCode, weekArr, weekStr) {
      if (this.weekAlert) {
        // 选择周期后天数不能选择
        this.cronObj.week = newStr ? newStr.join(',') : stringCode
        this.cronObj.day = ''
        // 判断年有没有选择
        if (this.rangTime) {
          this.str = `${year}, 每周${weekArr.join(',')} ${this.rangTime} 执行`
        } else {
          this.str = `${year}, 每周${weekArr.join(',')} 的 00:00 执行`
        }
      } else {
        this.$notify({
          type: 'warning',
          title: '提示',
          message: weekStr
        })
      }
    },
    // 按天执行的转换
    inputDay(val) {
      let reg1 = /(\d+)(,[\d]*)*$/
      let reg2 = /^[\d]+$/
      let dataSource
      let alertStr = ''
      let year = this.formatYear(this.startDate, this.endDate)
      if (val !== '' && val) {
        let isRepeat = this.handleJudgeRepeat(val)

        if (isRepeat) {
          this.alert = false
          alertStr = '输入数值中存在重复值！'
        } else {
          this.alert = true
          alertStr = ''
        }
        if (this.alert) {
          // 输入的验证
          if (val.indexOf(',') > -1) {
            // 天数的多个数值的验证处理
            dataSource = this.handleMoreDay(val, reg1)
          } else {
            // 天数的单个数值的验证处理
            dataSource = this.handleSingleDay(val, reg2)
          }
          // 判断输入的正确与否
          this.handleDayOutput(
            dataSource.newStr,
            dataSource.stringCode,
            year,
            val,
            dataSource.alertStr
          )
        } else {
          this.$notify({
            type: 'warning',
            title: '提示',
            message: alertStr
          })
        }
      } else {
        this.cronObj.day = ''
        if (this.rangTime) {
          this.str = `${year}, 每天 ${this.rangTime} 执行`
        } else {
          this.str = `${year}, 每天 00:00 执行`
        }
      }
    },
    // 多个天数的验证处理
    handleMoreDay(val, reg1) {
      let alertStr = '',
        newStr = []
      if (reg1.test(val)) {
        let strArr = val.split(',')
        let newStore = strArr.filter(item => item)
        for (let k of newStore) {
          if (k && parseInt(k) > 0 && parseInt(k) < 31) {
            newStr.push(k)
            this.alert = true
          } else {
            this.alert = false
            alertStr = '每个数值必须在1-31之间！'
          }
        }
      } else {
        this.alert = false
        alertStr = '输入格式错误,输入必须为数字，多个数字逗号分隔'
      }
      return {
        alertStr: alertStr,
        newStr: newStr
      }
    },
    // 单个天数的验证处理
    handleSingleDay(val, reg2) {
      let alertStr = '',
        stringCode = ''
      if (reg2.test(val)) {
        if (parseInt(val) > 0 && parseInt(val) < 31) {
          stringCode = val
          this.alert = true
        } else {
          this.alert = false
          alertStr = '数值必须在1-31之间！'
        }
      } else {
        this.alert = false
        alertStr = '输入不正确，输入必须为数字，请确认输入！'
      }
      return {
        alertStr: alertStr,
        stringCode: stringCode
      }
    },
    // 判断天数的正确与否后输出
    handleDayOutput(newStr, stringCode, year, val, alertStr) {
      if (this.alert) {
        // 天数选择后周期不能选择
        this.cronObj.day = newStr ? newStr.join(',') : stringCode
        this.cronObj.week = ''
        // 判断年有没有选择
        if (this.rangTime) {
          this.str = `${year}, 每月${val}号 ${this.rangTime} 执行`
        } else {
          this.str = `${year}, 每月${val}号 的 00:00 执行`
        }
      } else {
        this.$notify({
          type: 'warning',
          title: '提示',
          message: alertStr
        })
      }
    },
    // 时间选择后的转换
    selectRangTime(val) {
      let year = this.formatYear(this.startDate, this.endDate)
      if (val) {
        // 处理成小时，分钟
        let time = val.split(':')
        let hour = time[0]
        let minute = time[time.length - 1]
        this.cronObj.hour = parseInt(hour)
        this.cronObj.minute = minute * 1
        if (this.rangWeek) {
          let week = this.handleWeeks()
          this.str = `${year}, 每周${week.length > 0 ? week.join(',') : ''
            } ${val} 执行`
        } else if (this.rangDay) {
          this.str = `${year}, 每月${this.rangDay}号 ${val} 执行`
        } else {
          this.str = `${year}, 每天 ${val} 执行`
        }
      } else {
        this.cronObj.hour = ''
        this.cronObj.minute = ''
        if (this.rangWeek) {
          let week = this.handleWeeks()
          this.str = `${year}, 每周${week.length > 0 ? week.join(',') : ''
            } 00:00 执行`
        } else if (this.rangDay) {
          this.str = `${year}, 每月${this.rangDay}号 00:00 执行`
        } else {
          this.str = `${year}, 每天 00:00 执行`
        }
      }
    },
    // 多数的处理
    handleWeeks() {
      let week = []
      if (this.rangWeek.indexOf(',') > -1) {
        let strArr = this.rangWeek.split(',')
        for (let k of strArr) {
          week.push(this.formatWeek(k * 1))
        }
      } else {
        week.push(this.formatWeek(this.rangWeek * 1))
      }
      return week
    },
    // 星期数转换
    formatWeek(val) {
      let week = ''
      switch (val) {
        case 1:
          week = '星期一'
          break
        case 2:
          week = '星期二'
          break
        case 3:
          week = '星期三'
          break
        case 4:
          week = '星期四'
          break
        case 5:
          week = '星期五'
          break
        case 6:
          week = '星期六'
          break
        case 7:
          week = '星期日'
          break
      }
      return week
    },
    // 判断日期并处理
    formatYear(start, end) {
      let rang = ''
      let startYear = ''
      let endYear = ''
      let startMonth = ''
      let endMonth = ''
      let startDay = ''
      let endDay = ''
      if (start) {
        startYear = new Date(start).getFullYear()
        startMonth = new Date(start).getMonth() + 1
        startDay = new Date(start).getDate()
      }
      if (end) {
        endYear = new Date(end).getFullYear()
        endMonth = new Date(end).getMonth() + 1
        endDay = new Date(end).getDate()
      }
      // 开始日期和结束日期都选择时判断处理
      if (startYear && endYear) {
        rang = `${startYear}年${startMonth}月${startDay}日至${endYear}年${endMonth}月${endDay}日`
        if (endYear * 1 - startYear * 1 === 0) {
          let month = this.handleMonth(startMonth, endMonth, endDay)
          this.cronObj.month = month
          this.cronObj.year = `${startYear}-${endYear}`
        } else if (endYear * 1 - startYear * 1 > 0) {
          let month = this.handleMonth(startMonth, endMonth, endDay)
          this.cronObj.month = month
          this.cronObj.year = `${startYear}-${endYear}`
        } else {
          this.$notify({
            type: 'warning',
            title: '提示',
            message: '选择时间不正确'
          })
        }
      } else if (startYear || endYear) {
        rang = `从${startYear || endYear}年${startMonth ||
          endMonth}月${startDay || endDay}号开始`
      } else {
        rang = `从${moment().format('YYYY-MM-DD')}开始`
      }
      return rang
    },
    // 处理月份
    handleMonth(startMonth, endMonth, endDay) {
      let result,
        endNum = 0
      let start, end
      if (startMonth) {
        start = startMonth * 1
      }
      if (endMonth) {
        end = endMonth * 1
      }
      if (start < end) {
        let monthArr = []
        if (this.cronObj.day) {
          if (parseInt(this.cronObj.day) <= endDay) {
            endNum = end
          } else {
            endNum = end - 1
          }
        } else {
          endNum = end
        }
        for (let i = start; i <= endNum; i++) {
          monthArr.push(i)
        }
        result = monthArr.join(',')
      } else if (start > end) {
        let monthArr = []
        if (this.cronObj.day) {
          if (this.cronObj.day > endDay) {
            endNum = end - 1
          }
        } else {
          endNum = end
        }
        for (let i = start; i <= 12; i++) {
          monthArr.push(i)
        }
        for (let j = 1; j <= endNum; j++) {
          monthArr.push(j)
        }
        result = monthArr.join(',')
      } else {
        result = `${start}`
      }

      return result
    },
    // 编辑定时任务
    editCronTask(params) {
      axios.updateTimingTask(params).then(res => {
        if (res.data.code === 200) {
          this.$notify({
            type: 'success',
            message: '修改成功'
          })
          this.$router.push({
            path: '/Aibms/otherConfiguration/timingList',
            query: {
              code: 2
            }
          })
        } else {
          this.$notify({
            type: 'error',
            message: res.data.message
          })
        }
      })
    },
    // 反解周数 对应的需要减一来显示普遍认识的星期数
    handleReleaseWeek(val) {
      if (val) {
        if (val.indexOf(',') > -1) {
          let cronWeek = val.split(',')
          let showWeek = []
          cronWeek.forEach(item => {
            if (item !== '1') {
              showWeek.push((parseInt(item) - 1).toString())
            } else {
              showWeek.push(7)
            }
          })
          return {
            cronWeek: cronWeek,
            showWeek: showWeek.join(',')
          }
        } else if (val.indexOf('#') > -1) {
          let strArr = val.split('#')
          return {
            cronWeek: strArr[1] * 1,
            showWeek: (parseInt(strArr[1]) === 1
              ? 7
              : parseInt(strArr[1]) - 1
            ).toString()
          }
        } else {
          return {
            cronWeek: val,
            showWeek: parseInt(val) === 1 ? 7 : (parseInt(val) - 1).toString()
          }
        }
      } else {
        return ''
      }
    }
  }
}
</script>

<style scoped  lang="scss">
.display-box {
  display: flex;
  flex-direction: row;
}
.select-item {
  width: 170px;
  margin-right: 20px;
}
.input-item {
  width: 270px;
}
.inline-form {
  padding-left: 10%;
}
.icon-tip > img {
  display: inline-block;
  vertical-align: middle;
}
.cont-tip {
  background-image: url('../../../../static/img/icon/bg_tip.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 96%;
  width: 60%;
  display: inline-block;
  vertical-align: middle;
}
.cont-tip > span {
  margin-left: 34px;
  font-size: 14px;
  color: #3e444a;
}
.btn-group {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 20px 0 50px;
  width: 80%;
}
.margin-right {
  margin-right: 20%;
}
.date-item {
  width: 140px;
}
.cronPage {
  padding: 0;
  background-color: rgba(4, 28, 37, 0.3);
  margin: 10px;
}
.headtitle {
  padding: 10px 0;
}
.p18 {
  padding-top: 14px;
}
.form-search {
  padding: 20px 0 0 128px;
}
.ml128 {
  margin-left: 128px;
}
.result-str {
  color: #fff;
}
.footer-area {
  text-align: center;
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
</style>
