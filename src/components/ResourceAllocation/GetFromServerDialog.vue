<template>
  <div class="dialog-layout aibms-dialog" v-if="isShowDialog">
    <div class="dialog-mask"></div>
    <div class="dialog-detail">
      <h2 class="get-title" v-if="key == 'add'">
        新建任务
        <i class="el-icon-close close-btn" @click="checkSlide"></i>
      </h2>
      <h2 class="get-title" v-if="key == 'edit'">
        修改任务
        <i class="el-icon-close close-btn" @click="checkSlide"></i>
      </h2>
      <h2 class="get-title" v-if="key == 'detail'">
        查看任务
        <i class="el-icon-close close-btn" @click="checkSlide"></i>
      </h2>
      <form class="dialog-form">
        <div class="form-item">
          <label for>获取方式：</label>
          <el-row :gutter="20">
            <el-col :span="15">
              <div class="grid-content bg-purple">
                <el-select
                  style="width: 100%"
                  :disabled="!isEditAble"
                  v-model="data.taskType"
                  placeholder="请选择获取方式"
                >
                  <el-option
                    v-for="(item,index)  in sourceType"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
            </el-col>
          </el-row>
        </div>
        <!-- <div class="form-item" v-if="data.taskType == 2">
          <label for>请输入URL：</label>
          <el-row :gutter="20">
            <el-col :span="15">
              <div class="grid-content bg-purple">
                <el-input :disabled="!isEditAble" v-model="data.url" placeholder="请输入URL"></el-input>
              </div>
            </el-col>
          </el-row>
        </div> -->
        <div class="form-item">
          <label for>请选择URL：</label>
          <el-row :gutter="20">
            <el-col :span="15">
              <div class="grid-content bg-purple">
                <el-select :disabled="!isEditAble" v-model="data.url" placeholder="请选择URL">
                  <el-option
                    v-for="source in monitorSourceList"
                    :label="source.name"
                    :value="source.code"
                    :key="source.id"></el-option>
                </el-select>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="form-item">
          <label for>任务名称：</label>
          <el-row :gutter="20">
            <el-col :span="15">
              <div class="grid-content bg-purple">
                <el-input :disabled="!isEditAble" v-model="data.name" placeholder="请输入任务名称"></el-input>
              </div>
            </el-col>
          </el-row>
        </div>
        <!-- <div class="form-item" v-if="data.taskType != 3">
          <label for>选择CI类型：</label>
          <el-row :gutter="20">
            <el-col :span="15">
              <div class="grid-content bg-purple">
                <el-cascader
                  style="width: 100%"
                  :disabled="!isEditAble"
                  placeholder="选择Ci类型"
                  expand-trigger="hover"
                  :options="options"
                  v-model="data.ciType"
                  @change="handleChange"
                  clearable
                ></el-cascader>
              </div>
            </el-col>
          </el-row>
        </div> -->
        <div class="form-item">
          <label for>选择环境：</label>
          <el-row :gutter="20">
            <el-col :span="15">
              <div class="grid-content bg-purple">
                <el-select
                  style="width: 100%"
                  :disabled="!isEditAble"
                  v-model="data.environmentId"
                  placeholder="请选择环境"
                >
                  <el-option
                    v-for="(item,index) in eveList"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
            </el-col>
          </el-row>
        </div>
        <!-- <div class="form-item" v-if="data.taskType != 3">
          <label for>ip：</label>
          <el-row :gutter="20">
            <el-col :span="15">
              <div class="grid-content bg-purple">
                <el-input :disabled="!isEditAble" v-model="data.ip" placeholder="请输入ip地址或多网段以';'分隔"></el-input>
              </div>
            </el-col>
          </el-row>
        </div> -->
        <!-- <div class="form-item" v-if="data.taskType != 3">
          <label for>端口号：</label>
          <el-row :gutter="20">
            <el-col :span="15">
              <div class="grid-content bg-purple">
                <el-input :disabled="!isEditAble" v-model="data.port" placeholder="请输入端口号"></el-input>
              </div>
            </el-col>
          </el-row>
        </div> -->
        <!-- <div class="form-item" v-if="data.taskType != 3">
          <label for>选择凭证：</label>
          <el-row :gutter="20">
            <el-col :span="15">
              <div class="grid-content bg-purple">
                <el-cascader
                  style="width: 100%"
                  :disabled="!isEditAble"
                  placeholder="请选择凭证"
                  expand-trigger="hover"
                  :options="sshList"
                  v-model="data.com"
                  @change="handleVoucher"
                  clearable
                ></el-cascader>
              </div>
            </el-col>
          </el-row>
        </div> -->
        <!-- <div class="form-item">
          <label for>执行方式：</label>
          <el-tabs v-model="data.runType" type="card" :gutter="20">
            <el-tab-pane
              v-if="(data.runType === '1' && key==='detail') || key!=='detail'"
              label="单次执行"
              name="1"
            >
              <el-row :gutter="20">
                <el-col :span="15">
                  <div class="grid-content bg-purple">
                    <el-date-picker
                      width="100%"
                      :disabled="!isEditAble"
                      v-model="onceDate"
                      type="datetime"
                      @change="limitDate"
                      :default-value="onceDate"
                      :picker-options="pickerOptions"
                      placeholder="选择日期时间"
                    ></el-date-picker>
                  </div>
                </el-col>
              </el-row>
            </el-tab-pane>
            <el-tab-pane
              v-if="(data.runType === '2' && key==='detail') || key!=='detail'"
              label="周期执行"
              name="2"
            >
              <el-row :gutter="20">
                <el-col :span="15">
                  <div class="grid-content bg-purple">
                    <el-date-picker
                      width="100%"
                      :disabled="!isEditAble"
                      v-model="timeRange"
                      type="daterange"
                      :picker-options="pickerOptions"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                    ></el-date-picker>
                  </div>
                </el-col>
              </el-row>

              <div class="gap-item">
                <el-row :gutter="20">
                  <el-col :span="10">
                    <div class="grid-content bg-purple">
                      <el-select v-model="week" :disabled="!isEditAble">
                        <el-option
                          width="100%"
                          v-for="(item,index) in weeks"
                          :key="index"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </div>
                  </el-col>
                  <el-col :span="10">
                    <div class="grid-content bg-purple">
                      <el-time-picker
                        width="100%"
                        :disabled="!isEditAble"
                        v-model="taskStartDate"
                        placeholder="任意时间点"
                      ></el-time-picker>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-tab-pane>
            <el-tab-pane
              v-if="(data.runType === '3' && key==='detail') || key!=='detail'"
              label="轮循"
              name="3"
            >
              <div class="gap-item">
                <el-row :gutter="20">
                  <el-col :span="10">
                    <div class="grid-content bg-purple">
                      <el-select v-model="taskLoopMinu" :disabled="!isEditAble">
                        <el-option
                          v-for="(item,index) in rangeTime"
                          :key="index"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </div>
                  </el-col>
                  <el-col :span="10">
                    <div class="grid-content bg-purple">
                      <el-date-picker
                        :disabled="!isEditAble"
                        type="datetime"
                        v-model="loopTime"
                        @change="limitLoopDate"
                        :default-value="loopTime"
                        :picker-options="pickerOptions"
                        placeholder="选择开始时间"
                      ></el-date-picker>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div> -->
      </form>
      <div class="form-item dialog-btn" v-if="key != 'detail'">
        <el-col :span="20">
          <div class="grid-content bg-purple">
            <el-button @click="confirmData" class="btn-info" type="primary">保存</el-button>
            <el-button @click="checkSlide" class="btn-cancel nomal-button">取消</el-button>
          </div>
        </el-col>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/api';
import moment from 'moment'
export default {
  name: 'GetFromServerDialog',
  data () {
    return {
      // 监控来源列表
      monitorSourceList: [],
      timeRange: '',
      sshList: [
        { label: 'SSH凭证', value: '0', children: [] },
        { label: '应用管理凭证', value: '1', children: [] },
        { label: '代码库凭证', value: '2', children: [] },
        { label: '数据库凭证', value: '3', children: [] }
      ],
      options: [],
      eveList: [
        { label: '测试环境', value: '1' },
        { label: '预生产环境', value: '2' },
        { label: '生产环境', value: '3' }
      ],
      sourceType: [
        { label: 'Prometheus', value: '1' },
        { label: 'Dynatrace', value: '2' },
        { label: 'BPC', value: '3' }
      ],
      voucherList: [],
      isEditAble: true,
      ciTypeList: [],
      rangeTime: [
        { label: '5分钟', value: '5' },
        { label: '10分钟', value: '10' },
        { label: '20分钟', value: '20' }
      ],
      isShowDialog: false,
      data: {
        environmentId: '',
        ip: '',
        port: ''
      },
      key: '',
      taskLoopMinu: '',
      taskStartDate: '',
      loopTime: moment(new Date().getTime() - 3 * 60 * 1000).format(
        'YYYY-MM-DD HH:mm:ss'
      ),
      onceDate: moment(new Date().getTime() - 3 * 60 * 1000).format(
        'YYYY-MM-DD HH:mm:ss'
      ),
      weeks: [
        { label: '每天执行', value: '1' },
        { label: '每三天执行', value: '3' },
        { label: '每五天执行', value: '5' }
      ],
      week: '',
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      }
    }
  },
  created () {
    // 获取ci类型列表
    this.getCiList()
    // 获取凭证下拉列表
    this.getVoucherList()
    // 获取监控来源列表
    this.getMonitorSourceList()
  },
  methods: {
    // 获取监控来源列表
    getMonitorSourceList () {
      const params = {
        current: 1,
        size: 1000000,
        platform: '',
        address: ''
      }
      axios.getMonitorList(params).then(res => {
        if (res.data.success) {
          this.monitorSourceList = res.data.data.records
        } else {
          this.$notify({
            title: '提示',
            type: 'error',
            message: res.message
          })
        }
      })
    },
    confirmData () {
      let data = this.data
      let TmpIpArr = []
      let ipReg = /^(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/
      if (data.ip) {
        if (this.data.ip.trim().indexOf(';')) {
          let ipTmp = this.data.ip.split(';')
          TmpIpArr = ipTmp.filter(item => {
            if (!ipReg.test(item.trim())) {
              return item
            }
          })
        } else if (!ipReg.test(data.ip.trim())) {
          TmpIpArr = [this.data.ip]
        }
      }
      console.log(TmpIpArr)
      if (!data.taskType) {
        this.$notify({
          title: '提示',
          message: '请选择获取方式',
          type: 'warning'
        })
      } else if (
        data.taskType === 'zabbix' &&
        (!data.url || !data.url.trim())
      ) {
        this.$notify({
          title: '提示',
          message: '请输入url',
          type: 'warning'
        })
      } else if (
        data.taskType === 'zabbix' &&
        data.url.trim() &&
        !/^((ht|f)tps?):\/\/([\w\-]+(\.[\w\-]+)*\/)*[\w\-]+(\.[\w\-]+)*\/?(\?([\w\-\.,@?^=%&:\/~\+#]*)+)?/.test(
          data.url.trim()
        )
      ) {
        this.$notify({
          title: '提示',
          message: '请输入正确的url',
          type: 'warning'
        })
      } else if (!data.name || !data.name.trim()) {
        this.$notify({
          title: '提示',
          message: '请输入任务名称',
          type: 'warning'
        })
      } else if (data.taskType !== '3' && !data.environmentId) {
        this.$notify({
          title: '提示',
          message: '请选择选择环境',
          type: 'warning'
        })
      } else if (data.name.length < 2 || data.name.length > 40) {
        this.$notify({
          title: '提示',
          message: '任务名称长度不能小于2,或大于40',
          type: 'warning'
        })
      } else if (data.runType == 1) {
        if (!this.onceDate) {
          this.$notify({
            title: '提示',
            message: '请选择开始执行时间！',
            type: 'warning'
          })
        } else {
          this.data.taskStartDate = moment(this.onceDate).toISOString()
          delete this.data.taskStartWeek
          delete this.data.taskEndDate
          delete this.data.taskStartHms
          delete this.data.taskLoopMinu
          delete this.data.loopTime
          delete data.com
          delete data.ciType
          this.operateData()
        }
      } else if (data.runType == 2) {
        if (!this.timeRange) {
          this.$notify({
            title: '提示',
            message: '请选择执行周期',
            type: 'warning'
          })
        } else if (!this.week) {
          this.$notify({
            title: '提示',
            message: '请选择重复执行日期',
            type: 'warning'
          })
        } else if (!this.taskStartDate) {
          this.$notify({
            title: '提示',
            message: '请选择开始执行时间',
            type: 'warning'
          })
        } else {
          this.taskStartDate = moment(this.taskStartDate).format('HH:mm:ss')
          this.data.taskStartWeek = this.week
          this.data.taskStartDate = moment(this.timeRange[0]).toISOString()
          this.data.taskEndDate = moment(this.timeRange[1]).toISOString()
          this.data.taskStartHms = this.taskStartDate

          delete this.data.taskLoopMinu
          delete this.data.loopTime

          delete data.com
          delete data.ciType

          this.operateData()
        }
      } else if (data.runType == 3) {
        if (!this.taskLoopMinu) {
          this.$notify({
            title: '提示',
            message: '请选择轮循时间间隔',
            type: 'warning'
          })
        } else if (!this.loopTime) {
          this.$notify({
            title: '提示',
            message: '请选择开始执行时间',
            type: 'warning'
          })
        } else {
          this.data.taskLoopMinu = this.taskLoopMinu
          this.data.loopTime = moment(this.loopTime).toISOString()

          delete this.data.taskStartWeek
          delete this.data.taskEndDate
          delete this.data.taskStartDate
          delete this.data.taskStartHms

          delete data.com
          delete data.ciType

          this.operateData()
        }
      } else {
        delete data.com
        delete data.ciType

        this.operateData()
      }
    },

    operateData () {
      if (this.key === 'add') {
        this.saveData()
      } else if (this.key === 'edit') {
        this.editData()
      }
    },
    saveData () {
      let _this = this
      axios.addTask(this.data).then(res => {
        if (res.data.code == 200) {
          _this.checkSlide()
          _this.$emit('getTaskList')
        } else {
          _this.$notify({
            title: '提示',
            message: res.data.message,
            type: 'warning'
          })
        }
      })
    },
    editData () {
      let _this = this
      axios.editTask(this.data.citaskId, this.data).then(res => {
        if (res.data.code === 200) {
          _this.checkSlide()
          _this.$emit('getTaskList')
        } else {
          _this.$notify({
            title: '提示',
            message: res.data.message,
            type: 'warning'
          })
        }
      })
    },
    limitDate () {
      if (new Date(this.onceDate).getTime() < new Date().getTime()) {
        this.$notify({
          title: '提示',
          message: '任务开始执行时间不能小于当前时间！',
          type: 'warning'
        })
        this.onceDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    limitLoopDate () {
      if (new Date(this.loopTime).getTime() < new Date().getTime()) {
        this.$notify({
          title: '提示',
          message: '任务开始执行时间不能小于当前时间！',
          type: 'warning'
        })
        this.loopTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    getTaskDetail (id) {
      let _this = this
      axios.getTaskDetail(id).then(res => {
        if (res.data.code === 200) {
          _this.data = res.data.data.result

          _this.$set(
            _this.data,
            'environmentId',
            res.data.data.result.environmentId
          )

          if (_this.data.runType == 1) {
            _this.onceDate = _this.data.taskStartDate
          } else if (_this.data.runType == 2) {
            _this.week = _this.data.taskStartWeek
            _this.timeRange = [
              moment(_this.data.taskStartDate).format('YYYY-MM-DD'),
              moment(_this.data.taskEndDate).format('YYYY-MM-DD')
            ]
            if (
              _this.data.taskStartHms &&
              this.data.taskStartHms !== 'Invalid date'
            ) {
              _this.taskStartDate =
                moment(new Date()).format('YYYY-MM-DD') +
                ' ' +
                _this.data.taskStartHms
            } else {
              _this.taskStartDate = ''
            }
          } else if (_this.data.runType == 3) {
            _this.taskLoopMinu = _this.data.taskLoopMinu
            _this.loopTime = moment(_this.data.loopTime).format(
              'YYYY-MM-DD HH:mm:ss'
            )
          }
          _this.getCiList()
          _this.getVoucherList()
        } else {
          _this.$notify({
            title: '提示',
            message: '数据请求错误！',
            type: 'error'
          })
        }
      })
    },
    handleChange (value) {
      this.data.citypeId = value[1]
    },
    handleVoucher (value) {
      this.data.voucherId = value[1]
    },
    openDialog (id, key) {
      this.isShowDialog = true
      this.isEditAble = true
      if (key === 'detail') {
        this.isEditAble = false
      } else if (key === 'add') {
        this.data = {}
        // this.data.runType = '1'
      }

      if (key !== 'add') {
        this.getTaskDetail(id)
      }
      this.key = key
    },
    // 获取凭证列表
    getVoucherList () {
      this.sshList = [
        { label: 'SSH凭证', value: '0', children: [] },
        { label: '应用管理凭证', value: '1', children: [] },
        { label: '代码库凭证', value: '2', children: [] },
        { label: '数据库凭证', value: '3', children: [] }
      ]
      let voucherId = ''
      let voucherType = ''
      let _this = this
      let com = this.data.voucherId
      axios.getVoucherList(voucherId, voucherType).then(function (res) {
        if (res.data.code == 200) {
          if (res.data.data.result && res.data.data.result.length) {
            let voucherList = res.data.data.result
            _this.sshList.forEach(item => {
              voucherList.forEach(itemChild => {
                if (itemChild.voucherType === item.value) {
                  let obj = {}
                  obj.label = itemChild.name
                  obj.value = itemChild.voucherId
                  item.children.push(obj)
                  if (com === itemChild.voucherId) {
                    _this.data.com = [item.value, itemChild.voucherId]
                  }
                }
              })
            })
          }
        }
      })
    },
    // 获取ci类型列表
    getCiList () {
      var name = ''
      let templateId = ''
      var newoptions = []
      let ciTypeId = this.data.citypeId
      let _this = this
      axios.getCIList(name, templateId).then(res => {
        if (res.data.code == 200) {
          this.options = res.data.data.result
          this.area = this.options.map(v => {
            this.childrenList = [] // 每个分组下要初始化
            this.children = v.citypeList.map(vv => {
              var newtype = { value: vv.citypeId, label: vv.name }

              if (vv.citypeId === ciTypeId) {
                _this.data.ciType = [v.cigroupId, ciTypeId]
              }
              this.childrenList.push(newtype)
            })
            var newoption = {
              value: v.cigroupId,
              label: v.name,
              children: this.childrenList
            }
            newoptions.push(newoption)
          })
          this.options = newoptions
        }
      })
    },
    checkSlide () {
      this.isShowDialog = false
    }
  }
}
</script>

<style scoped>
.dialog-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99;
  background: rgba(0, 0, 0, 0.4);
}
.dialog-form {
  max-height: 400px;
  overflow-y: auto;
  overflow-x: hidden;
}
.dialog-detail {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
  background: #fff;
  padding: 15px 15px 15px 50px;
  width: 50%;
  /*max-height: 300px;*/
}
.form-item {
  padding-left: 100px;
  position: relative;
  padding-top: 10px;
  min-height: 30px;
}
.form-item .el-input {
  width: 100%;
}
.form-item label {
  position: absolute;
  left: 0;
  top: 10px;
  line-height: 30px;
  text-align: left;
}
.get-title {
  font-size: 18px;
  font-weight: normal;
  padding-bottom: 10px;
  text-align: center;
}
.dialog-btn {
  padding: 20px 0 40px;
  text-align: center
}
.dialog-btn .btn-info {
  margin-right: 100px;
}

.dialog-detail .close-btn {
  float: right;
}
.dialog-detail .el-tabs__item {
  padding: 0 20px;
  height: 40px !important;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  line-height: 40px !important;
  display: inline-block;
  list-style: none;
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  position: relative;
}
.dialog-detail .el-tabs__item.is-active {
  color: #00d1b2 !important;
}
.gap-item {
  margin-top: 10px;
}
</style>
