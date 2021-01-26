<template>
  <div class="aia-content">
    <div class="search-bar">
      <el-form :inline="true" :model="alarmModel" class="search-inline-form">
        <el-form-item>
          <el-select
            v-model="alarmModel.systemValue"
            clearable
            placeholder="请选择业务系统"
            style="width: 150px"
          >
            <el-option
              v-for="item in businessList"
              :key="item.systemId"
              :label="item.name"
              :value="item.systemId"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="alarmModel.topologyValue"
            clearable
            placeholder="请选择标签"
            style="width: 150px"
          >
            <el-option
              v-for="item in topologyList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="alarmModel.origin"
            clearable
            placeholder="请选择来源"
            style="width: 150px"
          >
            <el-option
              v-for="item in originList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="alarmModel.upgradeValue"
            clearable
            placeholder="是否为升级告警"
            style="width: 150px"
          >
            <el-option
              v-for="item in upgradeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="alarmModel.alarmDate"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="splitDate"
          />
        </el-form-item>
        <el-form-item class="search-button">
          <el-button @click="batchHandle" class="search-icon"
            >批量处理</el-button
          >
        </el-form-item>
        <!-- <el-form-item>
          <el-select v-model="alarmModel.labelValue" clearable placeholder="请选择标签">
            <el-option
              v-for="item in labelList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item> -->
      </el-form>
      <el-form :inline="true" class="search-inline-btn">
        <el-form-item class="search-button">
          <el-button icon="el-icon-search" @click="search" class="search-icon"
            >搜索</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <!-- 表格 -->
    <el-table
      stripe
      ref="filterTable"
      :data="tableData"
      @row-click="noticeDetail"
      style="width: 100%"
      height="82%"
      @select="choose"
      @select-all="choose"
    >
      <el-table-column type="selection" :selectable="checkSelection" width="55">
      </el-table-column>
      <el-table-column
        prop="level"
        label="级别"
        :filters="levelFilters"
        :filter-method="filterLevel"
      >
        <template slot="header">
          级别
          <icon-svg icon-class="loudou" class="gray-icon-color header-icon" />
        </template>
        <template v-slot="scope">
          <icon-svg
            icon-class="bj"
            :class="scope.row.level | iconLevelFilter"
          />
          <span>{{ scope.row.level | LevelFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="level" label="原级别">
        <template v-slot="scope">
          <div v-if="scope.row.oldLevel">
            <icon-svg
              icon-class="bj"
              :class="scope.row.oldLevel | iconLevelFilter"
            />
            <span>{{ scope.row.oldLevel | LevelFilter }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="platform" label="来源" />
      <el-table-column prop="alarmAddress" label="告警对象" min-width="80%" show-overflow-tooltip/>
      <el-table-column prop="alarmType" label="类型" />
      <el-table-column prop="startTime" label="开始时间" width="230" />
      <el-table-column label="状态" width="90">
        <template v-slot="scope">
          <span>{{ scope.row.status === '1' ? '已收到' : '-' }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="交易追踪">
        <template v-slot="scope">
          <el-link
            v-if="scope.row.platform === 'BPC'"
            :underline="false"
            @click.stop="hadleTrack(scope.row)"
            >交易</el-link
          >
        </template>
      </el-table-column> -->
      <template slot="empty">
        <div class="blank-page">
          <div class="img-content">
            <img src="../../../../static/img/blank-page.png" alt />
          </div>
          <p class="empty-text">暂无相关数据</p>
        </div>
      </template>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      v-if="totalSize && totalSize > 10"
      :current-page.sync="page.current"
      :page-size.sync="page.size"
      :page-sizes="[10, 20, 30]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalSize"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      class="absolute-center"
    />
  </div>
</template>

<script>
import axios from '@/api'
const iconMap = {
  '1': 's1-color',
  '2': 's2-color',
  '3': 's3-color'
  // 'S4': 's4-color',
  // 'S5': 's5-color'
};
const levelMap = {
  '1': 'critical',
  '2': 'warning',
  '3': 'information'
}
export default {
  filters: {
    iconLevelFilter: level => iconMap[level],
    LevelFilter: level => levelMap[level]
  },
  data: () => ({
    originList: [
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
      }
    ],
    alarmModel: {
      systemValue: '',
      topologyValue: '',
      upgradeValue: '',
      origin: '',
      alarmDate: [],
      labelValue: ''
    },
    upgradeList: [
      { value: '0', label: '全部' },
      { value: '1', label: '已升级' },
      { value: '2', label: '未升级' }
    ],
    topologyList: [
      { value: '1', label: '交易类型' },
      { value: '2', label: '应用' },
      { value: '3', label: '服务' },
      { value: '4', label: '进程' },
      { value: '5', label: '主机' }
    ],
    labelList: [
      { value: '1', label: '交易类型' },
      { value: '2', label: '应用' },
      { value: '3', label: '服务' },
      { value: '4', label: '进程' },
      { value: '5', label: '主机' }
    ],
    tableData: [],
    levelFilters: [
      { text: 'critical', value: '1' },
      { text: 'warning', value: '2' },
      { text: 'information', value: '3' }
    ],
    totalSize: 0,
    page: {
      current: 1,
      size: 10
    },
    startTime: '',
    endTime: '',
    businessList: [],
    callNum: 0,
    selectArr: []
  }),
  created() {
    let params = this.getParams()
    this.getAlarmList(params) // 获取列表数据
    // this.getTopologyList() // 获取拓扑下拉框
    // this.getlabelList() // 获取标签下拉框数据
    this.getBusinessList() // 获取业务系统下拉框数据
  },
  methods: {
    choose(val, row) {
      this.selectArr = val.map(item => item.code)
    },
    // handleSelectionChange(val, row) {
    //   console.log(val, row)
    // },
    batchHandle() {
      const num = this.selectArr.length
      if (num === 0) {
        this.$notify.warning({
          title: '提示',
          message: '请勾选要确认的告警！'
        })
      } else {
        axios.batchHandleNotice(this.selectArr).then(res => {
          if (res.data.success) {
            this.getAlarmList()
            this.$notify.success({
              title: '提示',
              message: `成功批量处理告警${num}条`
            })
          }
        })
      }
    },
    checkSelection(row, index) {
      return row.status === '0'
    },
    setSession() {
      if (this.callNum > 1) {
        const params = {
          system: this.alarmModel.systemValue,
          topology: this.alarmModel.topologyValue,
          upgrade: this.alarmModel.upgradeValue,
          platform: this.alarmModel.origin,
          label: this.alarmModel.labelValue,
          alarmDate: this.alarmModel.alarmDate,
          startTime: this.startTime,
          endTime: this.endTime,
          current: this.page.current,
          size: this.page.size
        }
        sessionStorage.setItem('search', JSON.stringify(params))
      }
    },
    getParams() {
      let params
      if (sessionStorage.getItem('search') !== null) {
        params = JSON.parse(sessionStorage.getItem('search'))
        const { system, topology, upgrade, platform, label, alarmDate, current, size } = params
        this.alarmModel.alarmDate = alarmDate
        this.splitDate()
        this.alarmModel.systemValue = system
        this.alarmModel.topologyValue = topology
        this.alarmModel.upgradeValue = upgrade
        this.alarmModel.origin = platform
        this.alarmModel.labelValue = label
        this.page.current = current
        this.page.size = size
      }
      return params
    },
    getBusinessList() {
      const params = {
        name: '',
        ipAddress: '',
        current: 1,
        size: 1000
      }
      axios.getSystemList(params).then(res => {
        if (res.data.success) {
          this.businessList = res.data.data.result.records.map(item => ({ name: item.name, systemId: item.systemId }))
        } else {
          this.$notify.error({
            title: '提示',
            message: res.data.message
          })
        }
      })
    },
    getTopologyList() {
      axios.getCiTypeListFirst('', '').then(res => {
        if (res.data.success) {
          this.topologyList = res.data.data.result.map(item => item.name)
        } else {
          this.$notify.error({
            title: '提示',
            message: res.data.message
          })
        }
      })
    },
    getlabelList() {
      axios.getlabelList().then(res => {
        if (res.data.success) {
          this.labelList = res.data.data
        } else {
          this.$notify.error({
            title: '提示',
            message: res.data.message
          })
        }
      })
    },
    getAlarmList(params) {
      if (params === undefined) {
        params = {
          system: this.alarmModel.systemValue,
          topology: this.alarmModel.topologyValue,
          upgrade: this.alarmModel.upgradeValue,
          platform: this.alarmModel.origin,
          label: this.alarmModel.labelValue,
          startTime: this.startTime,
          endTime: this.endTime,
          current: this.page.current,
          size: this.page.size
        }
      }
      axios.getNoticeList(params).then(res => {
        if (res.data.success) {
          this.tableData = res.data.data.records
          this.totalSize = Number(res.data.data.total)
          this.callNum++
          let bl = res.data.data.records.some((item) => {
            return item.status === '0'
          })
          if (!bl) {
            document.getElementsByClassName(
              'el-table-column--selection'
            )[0].childNodes[0].style.display = 'none';
          } else {
            document.getElementsByClassName(
              'el-table-column--selection'
            )[0].childNodes[0].style.display = 'block';
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
    addZero: num => ('00' + num).substr(('00' + num).length - 2, 2),
    dateFormat(date) {
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
      this.startTime = this.alarmModel.alarmDate != null ? this.dateFormat(new Date(this.alarmModel.alarmDate[0])) : ''
      this.endTime = this.alarmModel.alarmDate != null ? this.dateFormat(new Date(this.alarmModel.alarmDate[1])) : ''
    },
    // 分页
    handleCurrentChange() {
      this.getAlarmList()
    },
    // 表格每页数量
    handleSizeChange() {
      this.page.current = 1
      this.getAlarmList()
    },
    search() {
      this.page.current = 1
      this.getAlarmList()
    },
    hadleTrack(row) {
      console.log(row)
      this.$router.push({
        path: '/Aibms/Transaction',
        query: {
          code: 2
        }
      })
    },
    filterLevel(value, row) {
      return row.level === value
    },
    noticeDetail(row) {
      this.setSession()
      this.$router.push({
        path: '/Aibms/alarmnotice/alarmnoticeDetail',
        query: {
          code: 2,
          id: row.code
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.aia-content {
  position: relative;
  width: 100%;
  height: 94%;
  padding: 10px 10px;
  box-sizing: border-box;
  .search-button {
    .el-button {
      border: 1px solid #fff;
      color: #fff;
      &:link {
        border: 1px solid #fff;
        color: #fff;
      }
      &:visited {
        border: 1px solid #fff;
        color: #fff;
        background-color: transparent !important;
      }
      &:hover {
        background-color: #041c25;
        border: 1px solid #01aef1;
        color: #01aef1;
      }
      &:active {
        border: 1px solid #fff;
        color: #fff;
      }
    }
  }
  .el-link {
    color: #fff !important;
  }
  .header-icon {
    cursor: pointer;
  }
  .el-table--enable-row-hover .el-table__body tr:hover > td {
    cursor: pointer !important;
    background: #041c25;
    opacity: 70%;
  }
  .el-table__column-filter-trigger i {
    display: none;
  }
  .search-icon {
    border: 1px solid #fff;
    color: #fff;
    &:hover {
      background: #0066ff;
      border: 1px solid #0066ff;
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
  .blank-page {
    .img-content {
      height: 200px;
      padding-top: 15px;
    }
    .empty-text {
      font-size: 18px;
      height: 30px;
      line-height: 30px;
      margin-top: -30px;
      margin-bottom: 10px;
      color: #fff;
    }
  }
}
</style>
<style scoped>
.search-bar {
  display: flex;
  justify-content: space-between;
}
.search-inline-form {
  flex: 1;
}
.search-inline-btn {
  width: 100px;
}
</style>
