<template>
  <div class="layout hiddenBg aibms-auto">
    <div class="layout-panel aibms-color-bg non-shadow">
      <div class="layout-item">
        <div class="item-block-title paddingTop" @click="closeBlock(1)">
          <div class="item-block-title-mark"></div>
          <span class="item-block-title-font">检查项配置</span>
          <i
            class="icons el-icon-arrow-right"
            :style="{transform: blockSwitch[1] ? 'rotate(90deg)' : 'rotate(0)'}"
          ></i>
        </div>
        <el-form
          ref="form"
          :rules="rules"
          label-width="110px"
          class="form"
          :model="form[0]"
          :style="{height: blockSwitch[1] ? 'auto' : 0}"
        >
          <el-form-item aria-required="true" prop="resourcesType" label="配置项：">
            <ul>
              <li
                class="key-item"
                v-for="(key,index) in resourcesTypes"
                :key="index"
                :class="index == (0) ? 'actives':'actives-not'"
              >
                <span>{{ key.name }}</span>
              </li>
            </ul>
          </el-form-item>
          <el-form-item aria-required="true" prop="resourcesType" label="配置方案：">
            <ul>
              <li
                class="key-item"
                v-for="(key,index) in plans"
                :key="index"
                :class="plan == (index + 1) ? 'active':''"
              >
                <span @click="changePlan(index)">{{ key.name }}</span>
              </li>
            </ul>
          </el-form-item>
          <div v-for="(formItem,formIndex) in form" :key="formIndex">
            <el-form-item
              required
              :rules="{ validator: checkStands,  trigger:  [ 'change'],index:formIndex }"
              prop="maCheckTermName"
              label="检测项："
            >
              <el-input
                disabled
                v-model="formItem.maCheckTermName"
                :clearable="true"
                size="small"
                style="width: 200px"
                placeholder="请输入检测项"
              ></el-input>
              <i
                style="cursor: not-allowed"
                v-if="formIndex === form.length - 1 "
                @click="changeAddItem(formIndex)"
                class="el-icon-circle-plus-outline icon white-color"
              ></i>
              <i
                style="cursor: not-allowed"
                v-if="formIndex === form.length - 1 && formIndex !== 0"
                @click="removeItem(formIndex)"
                class="el-icon-remove-outline icon"
              ></i>
            </el-form-item>
            <el-form-item
              label="检查标准："
              v-for="(item,index) in formItem.checkStandardArray"
              :key="index"
              :prop="index === 0 ? 'checkStandardArray': ''"
            >
              <el-input
                disabled
                v-if="index === 0"
                v-model="item.standardName"
                :clearable="true"
                size="small"
                style="width: 200px"
                placeholder="请输入检查子项"
              ></el-input>
              <el-input
                disabled
                v-else
                v-model="item.standardName"
                :clearable="true"
                size="small"
                style="width: 200px"
                placeholder="请输入检查子项"
              ></el-input>
              <el-select
                disabled
                v-model="item.checkRool"
                :clearable="true"
                size="small"
                style="width: 200px"
                placeholder="请选择规则"
              >
                <el-option label=">" value=">"></el-option>
                <el-option label="<" value="<"></el-option>
                <el-option label="=" value="="></el-option>
                <el-option label="存在" value="exit"></el-option>
              </el-select>
              <el-input-number
                disabled
                v-model="item.checkNumber"
                :clearable="true"
                size="small"
                style="width: 100px"
                controls-position="right"
              ></el-input-number>
              <i
                style="cursor: not-allowed"
                v-if="index === formItem.checkStandardArray.length - 1 "
                @click="changeAddChild(formIndex, index)"
                class="el-icon-circle-plus-outline icon white-color"
              ></i>
              <i
                style="cursor: not-allowed"
                v-if="index === formItem.checkStandardArray.length - 1 && index !== 0"
                @click="removeChild(formIndex, index)"
                class="el-icon-remove-outline icon white-color"
              ></i>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div class="layout-item">
        <div class="item-block-title paddingTop" @click="closeBlock(2)">
          <div class="item-block-title-mark"></div>
          <span class="item-block-title-font">新增定时任务</span>
          <i
            class="icons el-icon-arrow-right"
            :style="{transform: blockSwitch[2] ? 'rotate(90deg)' : 'rotate(0)'}"
          ></i>
        </div>
        <el-form
          class="form white-color"
          label-width="120px"
          style="margin-left:20px; overflow: hidden;"
          :style="{height: blockSwitch[2] ? 'auto' : 0}"
        >
          <el-form-item label="选择周期范围：">
            <el-date-picker
              v-model="startDate"
              type="date"
              size="small"
              :disabled="status === 'read'"
              clearable
              :picker-options="startPickOptions"
              @change="getStartDate"
              placeholder="开始日期（yyyy-MM-dd）"
            ></el-date-picker>
            <span>至</span>
            <el-date-picker
              v-model="endDate"
              type="date"
              size="small"
              :disabled="status === 'read'"
              clearable
              :picker-options="endPickOptions"
              @change="getEndDate"
              placeholder="结束日期（yyyy-MM-dd）"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="执行单位：">
            <div class="display-box">
              <el-select
                size="small"
                class="select-item"
                v-model="excute"
                placeholder="请选择执行方式"
                :disabled="status === 'read'"
                clearable
                @clear="clearInput"
              >
                <el-option label="按周执行" value="1"></el-option>
                <el-option label="按日执行" value="2"></el-option>
              </el-select>
              <el-input
                class="input-item"
                v-if="excute == 1"
                v-model="rangWeek"
                :disabled="status === 'read'"
                size="small"
                placeholder="请输入星期几（1-7）,多选格式: 1,2,3"
              ></el-input>
              <el-input
                class="input-item"
                v-if="excute == 2"
                v-model="rangDay"
                size="small"
                :disabled="status === 'read'"
                placeholder="请输入日（1-31）,多选格式: 1,2,3"
              ></el-input>
            </div>
          </el-form-item>
          <el-form-item label="执行时间：">
            <el-time-picker
              @change="selectRangTime"
              :disabled="status === 'read'"
              clearable
              size="small"
              :picker-options="{
                format: 'HH:mm'
              }"
              value-format="HH:mm"
              format="HH:mm"
              v-model="rangTime"
              placeholder="HH:mm"
            ></el-time-picker>
          </el-form-item>
          <el-form-item>
            <div class="icon-tip">
              <div class="cont-tip white-color">
                <!-- <img src="../../../../static/img/icon/tip.png" alt /> -->
                <icon-svg icon-class="jinggao" class="whiteness-icon-color" />
                <span>如果没有输入执行时间，系统默认00：00执行</span>
              </div>
            </div>
          </el-form-item>
          <el-form-item>
            <span class="output-str">{{str}}</span>
          </el-form-item>

          <el-form-item class="btn-item">
            <el-button type="primary" style="margin-right: 200px;" @click="confirmCron">保存</el-button>
            <el-button class="nomal-button">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/api';
import moment from 'moment'
export default {
  name: 'HealthConfig',
  data () {
    let checkName = (rule, value, callback) => {
      if (!value[0].standardName) {
        callback(new Error('检查标准不能为空'))
      } else {
        callback()
      }
    }
    return {
      str: '',
      resourcesType: 1,
      startDate: '',
      endDate: '',
      excute: '',
      rangWeek: '',
      rangTime: '',
      status: '',
      rangDay: '', // 填写时间
      blockSwitch: { '1': true, '2': true }, // 控制每个块的展开和收缩
      cronObj: {
        second: '',
        minute: '',
        hour: '',
        day: '',
        month: '',
        week: '',
        year: '',
        order: ''
      },
      alert: true,
      weekAlert: true,
      resourcesTypes: [
        {
          name: 'OS',
          value: 1
        },
        {
          name: '中间件',
          value: 2
        },
        {
          name: '数据库',
          value: 3
        },
        {
          name: '网络设备',
          value: 4
        }
      ],
      plans: [
        {
          name: '方案1',
          value: 1
        },
        {
          name: '方案2',
          value: 2
        }
      ],
      plan: 1,
      isAddItem: false,
      isAddChild: false,
      form: [
        {
          maCheckTermName: '',
          checkStandardArray: [
            {
              standardName: '',
              checkRool: '',
              checkNumber: 1
            }
          ]
        }
      ],
      tabPosition: 'top',
      rules: {
        configItem: [{ required: true, trigger: 'blur' }],
        maCheckTermName: [],
        checkStandardArray: [
          { type: 'array', validator: checkName, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    let resourcesType = this.$route.query.type
    if (resourcesType) {
      this.resourcesType = parseInt(resourcesType)
    }
    this.backHealthyRule('init')
  },
  computed: {
    endPickOptions () {
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
    startPickOptions () {
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
    pickOptions () {
      return {
        disabledDate (time) {
          return time.getTime() < moment().valueOf() - 1000 * 60 * 60 * 24
        }
      }
    }
  },
  watch: {
    // 监听开始时间的选择
    startDate: {
      handler (val) {
        this.getStartDate(val)
      },
      deep: true
    },
    // 监听结束时间的选择
    endDate: {
      handler (val) {
        this.getEndDate(val)
      },
      deep: true
    },
    // 监听周的输入
    rangWeek: {
      handler (val) {
        this.inputWeek(val)
      },
      deep: true
    },
    // 监听天数的输入
    rangDay: {
      handler (val) {
        this.inputDay(val)
      },
      deep: true
    },
    // 监听时间的输入
    rangTime: {
      handler (val) {
        this.selectRangTime(val)
      },
      deep: true
    }
  },
  methods: {
    changePlan (index) {
      this.plan = index + 1
      this.resourcesType = index + 1
      this.backHealthyRule()
      // this.backHealthyRule()
    },
    clearInput () {
      this.rangWeek = ''
      this.rangDay = ''
      // if (this.excute == 1) {
      //   this.rangWeek = "";
      // } else {
      //   this.rangDay = "";
      // }
    },
    checkStands (rule, value, callback) {
      let currentIndex = rule.index
      let arr = []
      this.form.forEach((item, indexItem) => {
        if (currentIndex !== indexItem) {
          arr.push(item.maCheckTermName)
        }
      })
      if (callback) {
        if (this.form[currentIndex].maCheckTermName === '') {
          callback(new Error('请输入检查项'))
        } else if (
          arr.indexOf(this.form[currentIndex].maCheckTermName) !== -1
        ) {
          callback(new Error('检测项名称不能相同！'))
        } else {
          callback()
        }
      }
    },
    // 解析cor表达式
    handleCronExpr (cron, timePoint, humanityTime) {
      let cronArr = cron.split(' ')
      this.str = humanityTime
      let DateStr = timePoint.split(' ')
      // 年
      if (cronArr[6]) {
        this.cronObj.year = cronArr[6]
      }
      // 月
      if (cronArr[4] !== '*') {
        this.cronObj.month = cronArr[4]
      }
      // 时
      if (cronArr[2] !== '*') {
        this.cronObj.hour = cronArr[2]
      }
      // 分
      if (cronArr[1] !== '*') {
        this.cronObj.minute = cronArr[1]
      }
      // 日期
      this.startDate = DateStr[0]
      this.endDate = DateStr[DateStr.length - 1]
      // 天数及周期的处理
      if (cronArr[3] !== '?' && cronArr[3] !== '*') {
        this.excute = '2'
        this.rangDay = cronArr[3]
        this.cronObj.day = cronArr[3]
      } else if (cronArr[5] !== '?' && cronArr[5] !== '*') {
        this.excute = '1'
        let week = this.handleReleaseWeek(cronArr[5])
        this.rangWeek = week.showWeek
        this.cronObj.week = week.cronWeek
      }
      // 时间的回显
      if (cronArr[2] !== '*') {
        let hour = this.handleTime(cronArr[2])
        let minute = this.handleTime(cronArr[1])
        this.rangTime = `${hour}:${minute}`
      }
    },
    // 时间判断
    handleTime (time) {
      let cur = ''
      if (parseInt(time) < 10) {
        cur = `0${time}`
      } else {
        cur = parseInt(time)
      }

      return cur
    },
    // 反解周数
    handleReleaseWeek (val) {
      if (val) {
        if (val.indexOf(',') > -1) {
          let cronWeek = val.split(',')
          let showWeek = []
          cronWeek.forEach(item => {
            if (item !== '1') {
              showWeek.push(parseInt(item) - 1)
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
            showWeek: parseInt(strArr[1]) === 1 ? 7 : parseInt(strArr[1]) - 1
          }
        } else {
          return {
            cronWeek: val * 1,
            showWeek: parseInt(val) === 1 ? 7 : parseInt(val) - 1
          }
        }
      } else {
        return ''
      }
    },
    //
    backHealthyRule (init) {
      let param = 'default'
      if (init) {
        param = 'default'
        // this.resourcesType = 'default'
      } else {
        param = this.resourcesType + ''
      }
      axios.getHealthyRule(param).then(result => {
        if (result.data.code === 200) {
          let info = result.data.data
          let data = info.maCheckTermsList
          let sourceType = info.maCheckTermsList[0].disposeId || 1
          this.handleCronExpr(info.cronExpr, info.timePoint, info.humanityTime)
          let tmp = []
          let form = []
          this.resourcesType = sourceType
          this.plan = sourceType
          data.forEach((item, index) => {
            if (index === 0) {
              tmp.push(item.name)
              let obj = {
                maCheckTermName: item.name,
                checkStandardArray: item.checkStandardList
              }
              form.push(obj)
            } else {
              let itemIndex = tmp.indexOf(item.name)
              if (itemIndex > -1) {
                form[itemIndex].checkStandardArray = form[itemIndex].checkStandardArray.concat(item.checkStandardList)
              } else {
                tmp.push(item.name)
                let obj = {
                  maCheckTermName: item.name,
                  checkStandardArray: item.checkStandardList
                }
                form.push(obj)
              }
            }
          })

          form.forEach((item, index) => {
            item.checkStandardArray.forEach((minItem, minIndex) => {
              this.$set(
                item.checkStandardArray[minIndex],
                'standardName',
                minItem.name
              )
            })
          })

          if (form.length === 0) {
            form = [
              {
                maCheckTermName: '',
                checkStandardArray: [
                  {
                    standardName: '',
                    checkRool: '',
                    checkNumber: 1
                  }
                ]
              }
            ]
          }

          this.form = form
        } else {
          this.$notify({
            title: '提示',
            message: '网络出错，请稍后重试！',
            duration: 2000,
            type: 'error'
          })
        }
      })
    },
    //  第添加子项
    changeAddChild (formIndex) {
      // this.form[formIndex].checkStandardArray.push({
      //   standardName: '',
      //   checkRool: '',
      //   checkNumber: 1
      // })
    },
    // 第删除子项
    removeChild (formIndex, index) {
      // this.form[formIndex].checkStandardArray.splice(index, 1)
    },
    // 添加大项
    changeAddItem () {
      // this.form.push({
      //   maCheckTermName: '',
      //   checkStandardArray: [
      //     {
      //       standardName: '',
      //       checkRool: '',
      //       checkNumber: 1
      //     }]
      // })
    },
    // 删除大项
    removeItem (formIndex) {
      // this.form.splice(formIndex, 1)
    },

    // 保存按钮
    confirmCron () {
      this.$refs.form.validate(valid => {
        if (valid) {
          let cron = []
          // this.cronObj = {};
          // this.startDate ='';
          // this.endDate = '';
          // this.rangWeek = '';
          // this.rangDay = '';
          // this.excute = '';
          // this.str = ''

          if (this.alert && this.weekAlert) {
            if (this.cronObj.year) {
              cron.unshift(this.cronObj.year)
            }
            cron.unshift(
              this.cronObj.day
                ? '?'
                : this.cronObj.week
                  ? this.cronObj.week
                  : '?'
            )

            cron.unshift(this.cronObj.month ? this.cronObj.month : '*')

            cron.unshift(
              this.cronObj.week
                ? '?'
                : this.cronObj.day
                  ? this.cronObj.day
                  : '*'
            )
            cron.unshift(this.cronObj.hour ? this.cronObj.hour : 0)
            cron.unshift(this.cronObj.minute ? this.cronObj.minute : 0)
            cron.unshift(this.cronObj.second ? this.cronObj.second : 0)
            let cronStr = cron.join(' ')
            // let params = {
            //   manageId: this.taskItem,
            //   cronExpr: cronStr,
            //   humanityTime: this.str,
            //   timePoint: `${moment(this.startDate).format('YYYY-MM-DD')} ${moment(this.endDate).format('YYYY-MM-DD')}`,
            //   cronStrategy: 'cycle'
            // };

            let query = {
              resourcesType: this.resourcesType,
              checkStandardArray: [],
              maCheckTermArray: [],
              cronExpr: cronStr,
              humanityTime: this.str,
              remarks: 'default',
              timePoint: `${moment(this.startDate).format(
                'YYYY-MM-DD'
              )} ${moment(this.endDate).format('YYYY-MM-DD')}`
            }
            this.form.forEach(item => {
              query.maCheckTermArray.push({
                maCheckTermName: item.maCheckTermName
              })

              item.checkStandardArray.forEach(itemMin => {
                query.checkStandardArray.push({
                  maCheckTermName: item.maCheckTermName,
                  standardName: itemMin.standardName,
                  checkRool: itemMin.checkRool,
                  checkNumber: itemMin.checkNumber
                })
              })
            })

            axios.healthyRule(query).then(result => {
              if (result.data.code === 200) {
                this.$notify({
                  title: '提示',
                  message: '保存成功！',
                  duration: 2000,
                  type: 'success'
                })

                // this.$router.push({
                //   path: '/AutomaticOperation/healthIndex',
                //   query: {
                //     code: 4
                //   }
                // })
              } else {
                this.$notify({
                  title: '提示',
                  message: result.data.message,
                  duration: 2000,
                  type: 'error'
                })
              }
            })

            if (this.status === 'create') {
              // this.saveCronTask(params);
            } else {
              // this.editCronTask(params);
            }
          } else {
            this.$notify({
              type: 'warning',
              title: '提示',
              message: '日期或周数不正确'
            })
          }
        } else {
          this.$notify({
            type: 'error',
            title: '提示',
            message: '表单数据填写错误'
          })
        }
      })
    },
    // 选择开始日期的下拉框
    getStartDate (val) {
      let year = this.formatYear(val, this.endDate)
      this.handleDateForCron(year)
    },
    // 选择结束日期的下拉框
    getEndDate (val) {
      let year = this.formatYear(this.startDate, val)
      this.handleDateForCron(year)
    },
    // 处理开始时间和结束时间的判断
    handleDateForCron (year) {
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
          this.str = `${year}, 每周${
            week.length > 0 ? week.join(',') : ''
          } 00:00 执行`
        } else if (this.rangDay) {
          this.str = `${year}, 每月${this.rangDay}号 00:00 执行`
        } else {
          this.str = `${year}, 每天 00:00 执行`
        }
      }
    },
    // 星期数转换
    formatWeek (val) {
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
    // 按周执行的转换
    inputWeek (val) {
      let weekStr = ''
      let reg1 = /(\d+)(,[\d]*)*$/
      let reg2 = /^[\d]+$/
      let dataSource
      let year = this.formatYear(this.startDate, this.endDate)
      if (val) {
        if (val.indexOf(',')) {
          let tmp = val.split(',')
          let tmpArr = []
          let newTmp = tmp.filter(item => item)
          let someRepeat = newTmp.some((item, index) => {
            if (index === 0) {
              tmpArr.push(item)
            } else {
              if (tmpArr.indexOf(item) > -1) {
                return true
              } else {
                tmpArr.push(item)
              }
            }
          })
          if (someRepeat) {
            this.weekAlert = false
            weekStr = '星期数不可重复'
          } else {
            this.weekAlert = true
          }
        } else {
          this.weekAlert = true
        }

        if (this.weekAlert) {
          // 对输入数字的验证
          if (val.indexOf(',') > -1) {
            // 多个周数的处理
            dataSource = this.handleMoreWeek(val, reg1)
          } else {
            // 单个周数的处理
            dataSource = this.handleSingleWeek(val, reg2)
          }
          // 判断是否正确后处理输出
          this.handleWeekOutput(
            dataSource.newStr,
            dataSource.stringCode,
            year,
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
        this.cronObj.day = ''
        if (this.rangTime) {
          this.str = `${year}, 每天 ${this.rangTime} 执行`
        } else {
          this.str = `${year}, 每天 00:00 执行`
        }
      }
    },
    // 多个周数的处理
    handleMoreWeek (val, reg1) {
      let weekStr = '',
        weekArr = [],
        newStr = []
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
    // 单个周数的处理
    handleSingleWeek (val, reg2) {
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
    // 判断后处理输出提示
    handleWeekOutput (newStr, stringCode, year, weekArr, weekStr) {
      if (this.weekAlert) {
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
    inputDay (val) {
      let reg1 = /(\d+)(,[\d]*)*$/
      let reg2 = /^[\d]+$/
      let dataSource
      let alertStr = ''
      let year = this.formatYear(this.startDate, this.endDate)
      if (val) {
        if (val.indexOf(',')) {
          let tmp = val.split(',')
          let tmpArr = []
          let newTmp = tmp.filter(item => item)
          let someRepeat = newTmp.some((item, index) => {
            if (index === 0) {
              tmpArr.push(item)
            } else {
              if (tmpArr.indexOf(item) > -1) {
                return true
              } else {
                tmpArr.push(item)
              }
            }
          })
          if (someRepeat) {
            this.alert = false
            alertStr = '填写日期中不可重复'
          } else {
            this.alert = true
            alertStr = ''
          }
        } else {
          this.alert = true
        }

        if (this.alert) {
          // 输入的验证
          if (val.indexOf(',') > -1) {
            // 多个天数的处理
            dataSource = this.handleMoreDay(val, reg1)
          } else {
            // 单个天数的处理
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
        this.cronObj.week = ''
        if (this.rangTime) {
          this.str = `${year}, 每天 ${this.rangTime} 执行`
        } else {
          this.str = `${year}, 每天 00:00 执行`
        }
      }
    },
    // 多个天数的处理
    handleMoreDay (val, reg1) {
      let alertStr = '',
        newStr = []
      if (reg1.test(val)) {
        let strArr = val.split(',')
        let newStrArr = strArr.filter(item => item)
        for (let k of newStrArr) {
          if (k && (parseInt(k) > 0 && parseInt(k) <= 31)) {
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
    // 单个天数的处理
    handleSingleDay (val, reg2) {
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
    // 判断天数是否正确后处理
    handleDayOutput (newStr, stringCode, year, val, alertStr) {
      if (this.alert) {
        this.cronObj.day = newStr ? newStr.join(',') : stringCode
        this.cronObj.week = ''
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
    selectRangTime (val) {
      let year = this.formatYear(this.startDate, this.endDate)
      let week = this.handleWeeks()
      if (val) {
        let time = val.split(':')
        let hour = time[0]
        let minute = time[time.length - 1]
        this.cronObj.hour = parseInt(hour)
        this.cronObj.minute = minute * 1
        if (this.rangWeek) {
          this.str = `${year}, 每周${
            week.length > 0 ? week.join(',') : ''
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
          this.str = `${year}, 每周${
            week.length > 0 ? week.join(',') : ''
          } 00:00 执行`
        } else if (this.rangDay) {
          this.str = `${year}, 每月${this.rangDay}号 00:00 执行`
        } else {
          this.str = `${year}, 每天 00:00 执行`
        }
      }
    },
    // 多数的处理
    handleWeeks () {
      let week = []
      if (this.rangWeek) {
        if (this.rangWeek.indexOf(',') > -1) {
          let strArr = this.rangWeek.split(',')
          for (let k of strArr) {
            week.push(this.formatWeek(k * 1))
          }
        } else {
          week.push(this.formatWeek(this.rangWeek * 1))
        }
      }
      return week
    },
    // 判断时间并处理
    formatYear (start, end) {
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

      if (startYear && endYear) {
        rang = `${startYear}年${startMonth}月${startDay}日至${endYear}年${endMonth}月${endDay}日`
        if (endYear * 1 - startYear * 1 === 0) {
          let month = this.handleMonth(startMonth, endMonth, 1, endDay)
          this.cronObj.month = month
          this.cronObj.year = `${startYear}`
        } else if (endYear * 1 - startYear * 1 > 0) {
          let month = this.handleMonth(startMonth, endMonth, 1, endDay)
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
    handleMonth (startMonth, endMonth, num, endDay) {
      let result,
        endNum = 0
      let start, end
      if (startMonth) {
        start = startMonth * 1
      }
      if (endMonth) {
        end = endMonth * 1
      }
      if (num === 0) {
        if (start < end) {
          let monthArr = []
          for (let i = start; i <= end; i++) {
            monthArr.push(i)
          }
          result = monthArr.join(',')
        } else if (start === end) {
          result = `${start}`
        } else {
          this.$notify({
            type: 'warning',
            title: '提示',
            message: '选择时间不正确'
          })
        }
      } else {
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
      }

      return result
    },
    //  选择配置类型
    changeKey (index) {
      // this.resourcesType = index + 1;
      // this.backHealthyRule()
    },
    // 点击图标切换展开收缩
    closeBlock (num) {
      this.blockSwitch[num] = !this.blockSwitch[num]
    }
  }
}
</script>

<style lang="stylus" scoped >
.btn-item {
  padding: 30px 0 50px;
}
.item-block-title > .icons {
  color: #00A8E8
}
.cont-tip {
  display: inline-block;
  color: #696e73;
  width: 100%;
}

.cont-tip span {
  font-size: 14px;
}

.output-str {
  font-size: 16px;
}

.input-item {
  width: 270px;
  white-space: word-break;
}

.key-item {
  border: 1px solid #0066ff;
  color: #0066ff;
  display: inline-block;
  line-height: 28px;
  width: 80px;
  text-align: center;
  margin: 0 5px;
  border-radius: 5px;
  cursor: pointer;
}

li.key-item:nth-child(1) {
  margin: 0 5px 0 0;
}

.key-item.active {
  background: #0066ff;
  color: #fff;
}

.key-item.actives {
  background: #0066ff;
  color: #fff;
}

.key-item.actives-not {
  cursor: not-allowed;
}

.icon {
  font-size: 24px;
  cursor: pointer;
  color: rgba(0, 102, 255, 1);
}

.icon:nth-of-type(1) {
  margin: 0 8px 0 20px;
}

.layout {
  padding: 12px;

  .layout-panel {
    padding-top: 10px;
    background: #fff;
    box-shadow: 0 0 4px #ccc;
    border-radius: 5px;

    .title {
      font-size: 14px;
      color: #585858;

      span {
        background: #0066ff;
        display: inline-block;
        width: 8px;
        height: 30px;
        vertical-align: middle;
        border-radius: 5px;
        margin-right: 10px;
      }
    }

    .form {
      width: 60%;
      margin-left: 20px;
      overflow: hidden;
    }
  }
}

.hiddenBg {
  background: none !important;
}
</style>
