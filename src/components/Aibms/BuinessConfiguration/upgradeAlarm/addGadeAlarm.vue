<template>
  <div class="add-source">
    <div class="content">
      <h3>基本信息</h3>
      <div class="form-area">
        <el-form
          :model="form"
          :label-position="labelPosition"
          label-width="100px"
          :rules="rules"
          :inline="true"
          ref="form"
        >
          <el-form-item label="名称：" prop="name">
            <el-input
              v-model="form.name"
              clearable
              style="width: 632px;"
              maxlength="20"
              :disabled="readOnly"
              placeholder="查询表单列表响应时间超时"
            />
          </el-form-item>
          <br />
          <el-form-item label="规则：" prop="period">
            <span class="wihte-color">若所选告警分类在过去&nbsp;</span>
            <el-input-number size="small" :disabled="readOnly" v-model="form.period" :min="1" />
            <span class="wihte-color">&nbsp;分钟内&nbsp;</span>
          </el-form-item>
          <el-form-item prop="ruleValue">
            <el-select
              v-model="form.ruleValue"
              :disabled="readOnly"
              style="width: 150px;"
              placeholder="请选择"
            >
              <el-option
                v-for="item in rulesType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <span class="wihte-color">&nbsp;&nbsp;告警&nbsp;</span>
          </el-form-item>
          <el-form-item prop="times">
            <el-input-number size="small" :disabled="readOnly" v-model="form.times" :min="1" />
            <span class="wihte-color">&nbsp;&nbsp;次，即升级至&nbsp;</span>
          </el-form-item>
          <el-form-item prop="alarmLevel">
            <el-select
              v-model="form.alarmLevel"
              :disabled="readOnly"
              style="width: 150px;"
              placeholder="请选择"
            >
              <el-option
                v-for="item in levelList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
                <span style="float: left">{{ item.label }}</span>
                <icon-svg
                  style=" font-size: 18px; vertical-align: sub; margin-left: 10px;"
                  icon-class="bj"
                  :class="item.label | iconLevelFilter"
                />
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <!-- 告警分类表单 -->
        <div class="alarm-class">
          <h4>
            告警分类：
            <icon-svg icon-class="lianjie" class="middle-operation-color" />
            <span  @click="openAlarmDialog" v-if="!readOnly">选择告警分类</span>
            <span class="match-type" v-else>匹配类型</span>
          </h4>
          <ul>
            <li v-for="(item,index) in checkedAlarmList" :key="index">
              <span>{{ item }}</span>
            </li>
          </ul>
        </div>
        <!-- 告警分类表单弹窗 -->
        <el-dialog title="选择告警分类" :visible.sync="dialogFormVisible" center>
          <el-form :model="alarmModel" ref="classForm" :inline="true">
            <el-form-item>
              <el-autocomplete
                v-model="alarmModel.alarmClass"
                clearable
                :fetch-suggestions="querySearch"
                :trigger-on-focus="false"
                class="inline-input"
                placeholder="请输入告警分类"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            </el-form-item>
            <br />
            <el-form-item>
              <el-checkbox
                :indeterminate="isIndeterminate"
                v-model="checkAll"
                @change="handleCheckAllChange"
              >全选</el-checkbox>
              <div style="margin: 15px 0;" />
              <el-checkbox-group v-model="checkedAlarms" @change="handleCheckedAlarmsChange">
                <el-checkbox
                  v-for="item in alarmOptions"
                  :label="item.name"
                  :key="item.iD"
                  :disabled="!item.active"
                >{{ item.name }}</el-checkbox>
              </el-checkbox-group>
              <!-- 分页 -->
              <el-pagination
                background
                v-if="totalSize"
                :current-page.sync="page.current"
                :page-size.sync="page.size"
                layout="total, prev, pager, next, jumper"
                :total="totalSize"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                style="margin-top:24px;text-align: center"
              />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="cancel" class="cancle-button">取 消</el-button>
            <el-button type="primary" @click="confimAlarm">确 定</el-button>
          </div>
        </el-dialog>
      </div>
      <div class="button-area" v-if="!readOnly">
        <el-button type="primary" @click="submitForm">保 存</el-button>
        <el-button @click="turnBack" class="cancle-button">取 消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/api'
const iconMap = {
  'S1': 's1-color',
  'S2': 's2-color',
  'S3': 's3-color',
  'S4': 's4-color'
}
export default {
  filters: {
    iconLevelFilter: level => iconMap[level]
  },
  data: () => ({
    labelPosition: 'right',
    readOnly: false,
    form: {
      name: '',
      period: '',
      ruleValue: '',
      times: '',
      alarmLevel: ''
    },
    alarmModel: {
      alarmClass: '',
      sourceValue: ''
    },
    rules: {
      name: [
        { required: true, message: '请输入名称', trigger: 'blur' }
      ],
      period: [
        { required: true, message: '请输入', trigger: 'blur' }
      ],
      ruleValue: [
        { required: true, message: '请选择', trigger: 'change' }
      ],
      times: [
        { required: true, message: '请输入', trigger: 'blur' }
      ],
      alarmLevel: [
        { required: true, message: '请选择', trigger: 'change' }
      ]
    },
    rulesType: [
      {
        value: '1',
        label: '累计'
      },
      {
        value: '2',
        label: '连续每分钟'
      }
    ],
    levelList: [
      {
        value: '1',
        label: 'S1'
      },
      {
        value: '2',
        label: 'S2'
      },
      {
        value: '3',
        label: 'S3'
      },
      {
        value: '4',
        label: 'S4'
      }
    ],
    alarmList: [],
    dialogFormVisible: false,
    checkAll: false,
    checkedAlarms: [],
    alarmOptions: [],
    checkedAlarmList: [],
    isIndeterminate: false,
    page: {
      current: 1,
      size: 20
    },
    totalSize: 0,
    editId: ''
  }),
  created () {
    this.getClassList()
    this.getAlarmDetail()
  },
  methods: {
    // 获取详情数据
    getAlarmDetail () {
      //  查看或编辑
      if (this.$route.query.id) {
        this.editId = this.$route.query.id
        if (this.$route.query.read) {
          this.$route.meta.title = '查看告警升级'
          this.readOnly = true
        } else {
          this.$route.meta.title = '编辑告警升级'
        }
        axios.getUpgradeDetail(this.$route.query.id).then(res => {
          if (res.data.success) {
            const resultData = res.data.data
            const { name, period, type, count, level, sorts } = resultData
            this.form.name = name
            this.form.period = period
            this.form.ruleValue = type + ''
            this.form.times = count
            this.form.alarmLevel = level
            this.checkedAlarms = sorts
            this.checkedAlarmList = sorts
            if (this.checkedAlarms.length) {
              this.classCheckStatus(this.checkedAlarms)
            }
          } else {
            this.$notify({
              title: '提示',
              type: 'error',
              message: res.message
            })
          }
        })
      } else {
        this.$route.meta.title = '新增告警升级'
      }
    },
    // 获取联想输入数据
    getClassList () {
      axios.geAlarmNameList().then(res => {
        if (res.data.success) {
          this.alarmList = res.data.data
        } else {
          this.$notify({
            title: '提示',
            type: 'error',
            message: res.message
          })
        }
      })
    },
    // 获取告警分类多选框数据
    getAlarmList () {
      // 新增和编辑状态下，调用不同接口
      if (!this.$route.query.id) {
        const params = {
          name: this.alarmModel.alarmClass,
          sources: '',
          current: this.page.current,
          size: this.page.size,
          // label: '',
          // level: '',
          label: [],
          level: this.form.alarmLevel
        }
        this.addOrUpgradeSort(params, axios.getAlarmList)
      } else if (!this.readOnly) {
        const params = {
          id: this.$route.query.id,
          name: this.alarmModel.alarmClass,
          current: this.page.current,
          level: this.form.alarmLevel,
          size: this.page.size
        }
        this.addOrUpgradeSort(params, axios.getUpgradeSort)
      }
    },
    // 获取新增和编辑数据
    addOrUpgradeSort (params, methods) {
      methods(params).then(res => {
        if (res.data.success) {
          this.alarmOptions = res.data.data.records
          this.totalSize = Number(res.data.data.total)
          if (this.checkedAlarms.length) {
            this.classCheckStatus(this.checkedAlarms)
          }
        } else {
          this.$notify({
            title: '提示',
            type: 'error',
            message: res.data.message
          })
        }
      })
    },
    // 分页
    handleCurrentChange () {
      this.getAlarmList()
    },
    // 表格每页数量
    handleSizeChange () {
      this.page.current = 1
      this.getAlarmList()
    },
    // 联想输入
    querySearch (queryString, cb) {
      const alarmClassList = this.alarmList
      const results = queryString ? alarmClassList.filter(this.createFilter(queryString)) : alarmClassList
      cb(results)
    },
    createFilter (queryString) {
      return (alarmList) => {
        return (alarmList.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    // 多选
    handleCheckAllChange (val) {
      let activeOptions = this.alarmOptions.filter(item => item.active === true)
      let copyType = val ? activeOptions.map(item => item.name) : []
      let delList = []
      let temporary = []
      if (copyType.length === 0) {
        delList = activeOptions.map(item => item.name)
        this.checkedAlarms.forEach(item => {
          if (!delList.includes(item)) {
            temporary.push(item)
          }
        });
        this.checkedAlarms = temporary
      } else {
        copyType.forEach(item => {
          if (!this.checkedAlarms.includes(item)) {
            this.checkedAlarms.push(item)
          }
        })
      }
      this.classCheckStatus(this.checkedAlarms)
    },
    handleCheckedAlarmsChange (value) {
      this.classCheckStatus(this.checkedAlarms)
    },
    // 分类勾选状态
    classCheckStatus (type) {
      let bl = true
      let num = 0
      let alarmOptionList = (this.alarmOptions.filter(item => item.active === true)).map(item => item.name)
      alarmOptionList.forEach(item => {
        if (!type.includes(item)) {
          bl = false
        } else {
          num++
        }
      });
      if (bl) {
        this.isIndeterminate = false
        this.checkAll = true
      } else {
        this.checkAll = false
        if (num < alarmOptionList.length && num > 0) {
          this.isIndeterminate = true
        } else if (num === 0) {
          this.isIndeterminate = false
        }
      }
    },
    // 搜索告警分类
    search () {
      this.getAlarmList()
    },
    confimAlarm () {
      this.dialogFormVisible = false
      this.checkedAlarmList = this.checkedAlarms
    },
    submitForm () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.checkedAlarms.length) {
            if (this.editId) {
              this.addOrEdit(axios.editUpgrade)
            } else {
              this.addOrEdit(axios.addUpgrade)
            }
          } else {
            this.$message.error('请至少选择一个告警分类')
          }
        } else {
          return false
        }
      })
    },
    addOrEdit (methods) {
      const params = {
        id: this.editId,
        name: this.form.name,
        period: this.form.period,
        type: this.form.ruleValue,
        count: this.form.times,
        level: this.form.alarmLevel,
        sort: this.checkedAlarms
      }
      methods(params).then(res => {
        if (res.data.success) {
          this.$notify.success({
            title: '提示',
            message: this.editId ? '修改成功' : '新增成功'
          })
          this.$refs['form'].resetFields()
          this.$router.push({
            path: '/Aibms/BuinessConfiguration/upgradeAlarm',
            query: {
              code: 8
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
    turnBack () {
      this.$router.back()
    },
    cancel () {
      this.dialogFormVisible = false
    },
    openAlarmDialog () {
      if (this.form.alarmLevel) {
        this.dialogFormVisible = true
        this.getAlarmList()
      } else {
        this.$notify({
          title: '警告',
          message: '请先配置升级规则',
          type: 'warning'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.add-source {
  padding: 10px;
  .content {
    width: 100%;
    background-color: rgba(4, 28, 37, 0.3);
    padding: 10px;
    overflow: visible;
    .form-area {
      margin: 10px;
      .wihte-color {
        color: #fff;
      }
      .alarm-class {
        h4 {
          font-size: 14px;
          font-weight: 500;
          margin-left: 20px;
          color: #fff;
          line-height: 40px;
          padding: 0 12px 0 0;
          box-sizing: border-box;
          cursor: pointer;
          span {
            color: #00a8e8;
          }
        }
        ul {
          margin: 20px auto;
          width: 800px;
          li {
            display: inline-block;
            margin-bottom: 20px;
            width: 25%;
            height: 40px;
            line-height: 40px;
            padding: 2px 25px;
            box-sizing: border-box;
            span {
              width: 100%;
              display: inline-block;
              background: #00A8E8;
              border-radius: 20px;
              text-align: center;
              color: #fff;
            }
          }
        }
      }
      .el-checkbox {
        min-width: 19%;
      }
    }
    h3 {
      position: relative;
      font-size: 16px;
      font-weight: 500;
      height: 24px;
      line-height: 24px;
      margin-left: 10px;
      color: #fff;
      span {
        margin-left: 5px;
        font-size: 14px;
        color: #00A8E8;
        cursor: pointer;
      }
      &:before {
        content: "";
        position: absolute;
        z-index: 1;
        left: -20px;
        top: -3px;
        width: 8px;
        border-radius: 4px;
        height: 30px;
        background: #00A8E8;
      }
    }
    .button-area {
      text-align: center;
    }
    .cancle-button {
      border: 1px solid #fff;
      color: #fff;
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
.s1-color {
  color: #ff0000 !important;
  fill: #ff0000 !important;
}
.s2-color {
  color: #ff9900 !important;
  fill: #ff9900 !important;
}
.s3-color {
  color: #ffcc00 !important;
  fill: #ffcc00 !important;
}
.s4-color {
  color: #ffff00 !important;
  fill: #ffff00 !important;
}
.s5-color {
  color: #ffff88 !important;
  fill: #ffff88 !important;
}
</style>
