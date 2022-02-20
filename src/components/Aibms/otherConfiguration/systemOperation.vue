<template>
  <div class="aia-content">
    <div class="search-bar t-box-between">
      <div class="t-box">
        <div class="search-inline-input">
          <el-input v-model="searchText" placeholder="模糊搜索" class="w274" @change=search></el-input>

        </div>

      <el-button icon="el-icon-edit" class="search-icon search-btn" @click="dialogVsible = true">特定配置</el-button>

      <el-dialog title="批量设置特殊时间区间" :visible.sync="dialogVsible">
        <el-form :model="configData" ref="configData" >
          <el-form-item label="选中的对象个数">
            <el-col :span="4">
               <el-input v-model="selectData.length" :disabled="true"></el-input>
            </el-col>

          </el-form-item>
          <el-form-item
          v-for="(timelist,index) in configData.timelists"
          :label="'时间周期' + String(Number(index)+1)"
          :key="timelist.key" >
              <el-date-picker
              v-model="timelist.startTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
             placeholder="选择开始日期">
             </el-date-picker>

             <el-date-picker
              v-model="timelist.endTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
             placeholder="选择结束日期">
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
              <el-button @click="saveSystemConfig" class="common-btn save-btn" type="primary"
                >提交</el-button
              >
            </div>
          </el-form-item>

        </el-form>
      </el-dialog>

      <el-button icon="el-icon-edit" class="search-icon search-btn" @click="level1">7*24</el-button>
       <el-button icon="el-icon-edit" class="search-icon search-btn" @click="leve2">5*8</el-button>
       </div>
       <div class="t-box">
        <el-button @click="addSystem() " class="common-btn" icon="el-icon-plus">批量导入</el-button>
        <el-button @click="addOneSystem() "  class="save-btn common-btn" icon="el-icon-plus">新增</el-button>
      </div>
<!--      <el-form :inline="true" class="search-inline-btn">
        <el-form-item class="search-button">
          <el-button icon="el-icon-search" @click="search" class="search-icon"
            >搜索</el-button
          >
        </el-form-item>
      </el-form> -->
    </div>
    <!-- 表格 -->
    <el-table
      stripe
      ref="filterTable"
      :data="tableData"
      style="width: 100%"
      height="86%"
      @select="choose"
      @select-all="choose"
    >
      <el-table-column align="center" type="selection" width="80">
      </el-table-column>

      <el-table-column align="center" prop="appname" label="业务系统名称" >
      </el-table-column>

      <el-table-column
        prop="hostname"
        label="主机名"
        min-width="80%"
        show-overflow-tooltip
      >
      </el-table-column>

      <el-table-column align="center" prop="ipaddress" label="IP地址" show-overflow-tooltip >
           </el-table-column>

      <el-table-column align="center" prop="timelevel" label="运维级别" show-overflow-tooltip >
           </el-table-column>
      <el-table-column align="center" prop="editonce" label="特殊配置"  show-overflow-tooltip >
      </el-table-column>
      <el-table-column align="center"prop="openswitch" label="特殊配置开关"  show-overflow-tooltip >
          <template v-slot="scope">
          <div class="rule-box" @click.stop="openRule(scope.row)">
            <!-- <el-switch size="large" v-model="scope.row.status" /> -->
            <icon-svg
              icon-class="open"
              style="font-size: 24px; margin-left: 10px;vertical-align: middle;"
              :style="{color: scope.row.status == 1?'#00E5FF':'#434C5D'}"
            />
          </div>

        </template>
      </el-table-column>

      <el-table-column align="center" prop="operation" label="操作">
        <template v-slot="scope">
          <div class="task-btn-box">
            <el-link
              type="primary"
              :underline="false"
              class="el-icon-edit-outline"
              @click.stop="handleEdit(scope.row)"
              ></el-link
            >
            <el-link
              type="primary"
              :underline="false"
              class="el-icon-close"
              @click.stop="handleDelete(scope.row)"
              ></el-link
            >
          </div>
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
      v-if="totalSize && totalSize > 12"
      :current-page.sync="page.current"
      :page-size.sync="page.size"
      :page-sizes="[12, 20, 30]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalSize"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      class="absolute-center"
    />
    <!-- 删除组件 -->
    <deleteDialog ref="deleteDialog" @confim-delete="confirmDelete" />
  </div>
</template>

<script>
// 告警通知主页
import axios from '@/api'
import moment from 'moment';
import common from '@/utils/commonjs';
import deleteDialog from '../../common/deleteDialog'

export default {
  components: {
    deleteDialog
  },

  data: () => ({

    searchText: '',
    currentDeleteItemId: -1,
    dialogVsible: false,
    configData: {
      timelists: [{
        startTime: '',
        endTime: ''
      }]
    },
    tableData: [
      {
        id: '1',
        appname: 'IB',
        hostname: 'localhost01',
        ipaddress: '10.10.10.10',
        timelevel: '7*24',
        editonce: 'yes',
        status: false

      },
      { id: '2',
        appname: 'SIS',
        hostname: 'localhost02',
        ipaddress: '10.10.10.11',
        timelevel: '7*24',
        editonce: 'yes',
        status: false

      },
      { id: '3',
        appname: 'AIBMS',
        hostname: 'localhost03',
        ipaddress: '10.10.10.13',
        timelevel: '5*8',
        editonce: 'no',
        status: true

      }

    ],
    selectData: [],

    totalSize: 0,
    page: {
      current: 1,
      size: 12
    },
    startTime: '',
    endTime: '',
    businessList: [],
    callNum: 0,
    selectArr: []
  }),
  created() {
    let params = this.getParams()
    this.SystemList(params)
    // let params = this.getParams() // 获取缓存的数据，回填到search中
    // this.getAlarmList(params) // 获取列表数据
    // // this.getTopologyList() // 获取拓扑下拉框
    // // this.getlabelList() // 获取标签下拉框数据
    // this.getBusinessList() // 获取业务系统下拉框数据
  },
  methods: {

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
    // 选中业务系统
    choose(val, row) {
      this.selectData = []
      val.forEach((data, index) => {
        this.selectData.push(val[index].code)
      })
    },
    // handleSelectionChange(val, row) {
    //   console.log(val, row)
    // },
    addSystem() {
      this.$router.push({
        path: '/Aibms/otherConfiguration/systemOperation/addsystem',
        query: {
          code: 2
        }
      });
    },

    editonce(param) {

    },
    level1() {
      this.$router.push({
        path: '/Aibms/otherConfiguration/systemOperation/level1',
        query: {
          code: 2
        }
      });
    },

    leve2() {
      this.$router.push({
        path: '/Aibms/otherConfiguration/systemOperation/level2',
        query: {
          code: 2
        }
      });
    },

    setSession() {
      if (this.callNum > 1) {
        const params = {
          keywords: this.searchText,
          current: this.page.current,
          size: this.page.size
        }
        sessionStorage.setItem('search', JSON.stringify(params))
      }
    },
    // 从session中拿取缓存的数据
    getParams() {
      let params
      if (sessionStorage.getItem('search') !== null) {
        params = JSON.parse(sessionStorage.getItem('search'))
        const { keywords, current, size } = params
        this.searchText = keywords
        this.page.current = current
        this.page.size = size
      }
      return params
    },
    // 系统列表
    SystemList(params) {
      if (params === undefined) {
        params = {
          keywords: this.searchText,
          current: this.page.current,
          size: this.page.size
        }
      }
      axios.getSystemList(params).then(res => {
        if (res.data.success == true) {
          this.tableData = res.data.data.records
          this.totalSize = Number(res.data.data.total)
          this.callNum++
        }
      })
    },

    // 打开删除dialog
    handleDelete(row) {
      this.currentDeleteItemId = row.code
      this.$refs.deleteDialog.confirmDeleteDialogVisible = true
    },
    // 删除选择
    confirmDelete() {
      const id = this.currentDeleteItemId
      // 删除system窗口
      axios.deleteSystem(id).then(res => {
        if (res.data.success) {
          this.$notify.success({
            title: '提示',
            message: '删除成功'
          })
        } else {
          this.$notify.error({
            title: '提示',
            message: res.data.message
          })
        }
        this.SystemList()
        this.$refs.deleteDialog.confirmDeleteDialogVisible = false
      }).catch(() => {
        this.SystemList()
        this.$refs.deleteDialog.confirmDeleteDialogVisible = false
      })
    },

    search() {
      this.page.current = 1
      const params = {
        keywords: this.searchText,
        current: this.page.current,
        size: this.page.size
      }
      this.SystemList(params)
    },
    // 跳转至修改系统窗口
    handleEdit(row) {
      // this.setSession()
      this.$router.push({
        path: '/Aibms/otherConfiguration/systemOperation/editsystem',
        query: {
          code: 2,
          id: row.code
        }
      });
    },
    // 跳转至新增系统窗口
    addOneSystem() {
      this.$router.push({
        path: '/Aibms/otherConfiguration/systemOperation/editsystem',
        query: {
          code: 2
        }
      });
    },

    //  开启/关闭特殊配置功能
    openRule(scope) {
      // const params = {
      //   id: scope.id,
      //   status: scope.status
      // }
      console.log(scope)
      axios.systemStatusSwitch(scope.code, scope.status == 1 ? 0 : 1).then(res => {
        if (res.data.success) {
          scope.status = !scope.status
          this.$notify({
            title: '提示',
            message: scope.status ? '已开启！' : '已关闭!',
            type: 'success'
          })
        } else {
          this.$notify.error({
            title: '提示',
            message: res.data.message
          })
        }
      })
    },

    // 批量修改特殊配置
    saveSystemConfig() {
      const params = {
        codeList: this.selectData,
        editonce: 'yes',
        status: true,
        timelists: this.configData.timelists
      }
      axios.updatesystemForBatch(params).then(res => {
        if (res.data.success) {
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
    },

    // 分页
    handleCurrentChange() {
      this.SystemList()
    },
    // 表格每页数量
    handleSizeChange() {
      this.page.current = 1
      this.SystemList()
    },
    // 将查询数据放在session中
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

    // 补零
    addZero: num => ('00' + num).substr(('00' + num).length - 2, 2),
    // 时间处理
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
    // 时间分割
    splitDate() {
      this.startTime = this.alarmModel.alarmDate != null ? this.dateFormat(new Date(this.alarmModel.alarmDate[0])) : ''
      this.endTime = this.alarmModel.alarmDate != null ? this.dateFormat(new Date(this.alarmModel.alarmDate[1])) : ''
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
      border: 1px solid #436382;
      color: #fff;
      &:link {
        border: 1px solid #436382;
        color: #fff;
      }
      &:visited {
        border: 1px solid #436382;
        color: #fff;
        background-color: transparent !important;
      }
      &:hover {
        background-color: #041c25;
        border: 1px solid #01aef1;
        color: #01aef1;
      }
      &:active {
        border: 1px solid #436382;
        color: #fff;
      }
    }
  }
  .el-link {
    // color: #fff !important;
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
    margin-left: 28px;
    // border: 1px solid #436382;
    // color: #fff;
    // &:hover {
    //   background: #0066ff;
    //   border: 1px solid #0066ff;
    // }
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
  margin-bottom:24px;
  /* justify-content: space-between; */
}
.search-inline-form {
  flex: 1;
}
.search-inline-btn {
  width: 100px;
}
.search-inline-input {
  /* width: 200px; */
}
</style>
<style>
.notify-style {
  width: 360px;
  height: 160px;
  background-color: #161616b3;
  border-radius: 5px;
  border: none;
  color: #fff;
  box-shadow: 0 0 10px #000;
}
.notify-title {
  font-size: 14px;
  font-weight: bold;
  color: #fff;
  padding-bottom: 10px;
  border-bottom: 1px dashed #ddd;
}
.notify-content {
  margin-top: 16px;
  font-size: 14px;
  color: #fff;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
.notify-item {
  margin-bottom: 4px;
}
.notify-item:last-child {
  margin-bottom: 0;
}
.add-icon-btn{
  margin-top: 0;
}
</style>
