<template>
  <div class="cluster-manage">
    <div class="wrapper">
      <div class="operate-bar">
        <el-form inline :model="search" class="demo-form-inline">
          <el-form-item>
            <el-input v-model="search.name" placeholder="请输入发布任务名称" sortable clearable></el-input>
          </el-form-item>
          <el-form-item class="item-right overHideMargin">
            <el-button icon="el-icon-search" class="common-btn-style" @click="searchTask">查找</el-button>
            <el-button
              type="primary"
              icon="el-icon-plus"
              class="common-btn-style margin-left-btn"
              @click.prevent="addTask"
            >新增</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="cluster-list">
        <el-table
          class="data-list"
          :data="tableData"
          style="width: 100%"
          :header-cell-style="{ background: '#f5f5f5' }"
        >
          <el-table-column label="任务名称" prop="name"></el-table-column>
          <el-table-column label="请求地址" prop="url"></el-table-column>
          <el-table-column label="定时策略" prop="cronStrategy" :formatter="formatStrategy"></el-table-column>
          <el-table-column label="定时时间" prop="humanityTime"></el-table-column>
          <el-table-column label="操作" align="center" prop="operate" width="200px">
            <template slot-scope="scope">
              <div class="task-btn-box">
                <span class="special" @click="readJob(scope.row.iD, scope.row.taskType)">
                  <el-tooltip class="item" effect="dark" content="查看详情" placement="top-start">
                    <icon-svg icon-class="chakan" />
                  </el-tooltip>
                </span>
                <span
                  class="special"
                  @click="editJob(scope.row.iD, scope.row.taskType,scope.row.applyStatus)"
                >
                  <el-tooltip class="item" effect="dark" content="修改" placement="top-start">
                    <icon-svg icon-class="bianji" />
                  </el-tooltip>
                </span>
                <span
                  class="special"
                  :class="scope.row.conflict === 'building' ? 'notClick' : ''"
                  @click=" scope.row.conflict !== 'building' && deleteJob(scope.row.iD,scope.row.applyStatus,scope.row.taskType)"
                >
                  <el-tooltip class="item" effect="dark" content="取消发布" placement="top-start">
                    <icon-svg icon-class="jilu" />
                  </el-tooltip>
                </span>
              </div>
            </template>
          </el-table-column>
          <div slot="empty">
            <div class="blank-page">
              <div class="imgdiv">
                <img src="../../../../static/img/blank-page.png" alt />
              </div>
              <p class="empty-text">暂无相关数据</p>
            </div>
          </div>
        </el-table>
      </div>

      <el-dialog center title="取消发布提示" :visible.sync="confirmDeleteDialogVisible" width="25%">
        <div style="text-align: center">
          <i class="el-icon-warning"></i> 是否将该任务取消定时？
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button size="medium" @click="confirmDeleteDialogVisible = false">取消</el-button>
          <el-button size="medium" type="primary" @click="confirmDelete">确定</el-button>
        </span>
      </el-dialog>

      <!-- 分页 -->
      <div class="block" style="text-align: center;width: 100%;padding: 30px 0;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currPage"
          :page-size="size"
          :page-sizes="[10,30,50]"
          layout="prev, pager, next, sizes, total, jumper"
          :total="total"
          v-if="page"
          style="cursor: pointer;"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/api';
export default {
  name: 'CrontabList',
  data () {
    return {
      size: 10,
      page: 1,
      total: 1,
      currPage: 1,
      cancleId: '',
      search: {
        name: ''
      },
      statusList: [
        {
          name: '未发布',
          systemId: 'NOTEXECUTED',
          class: ''
        },
        {
          name: '发布中',
          systemId: 'building',
          class: 'wraning'
        },
        {
          name: '成功',
          systemId: 'SUCCESS',
          class: 'success'
        },
        {
          name: '失败',
          systemId: 'FAILURE',
          class: 'error'
        },
        {
          name: '手动结束',
          systemId: 'ABORTED',
          class: 'error'
        }
      ],
      tableData: [],
      confirmDeleteDialogVisible: false
    }
  },
  created () {
    this.getTimingList()
    this.handdleMsg()
  },
  methods: {
    // 跳转job详情
    // logDetailBtn (id, di, dd) {
    //   this.$router.push({
    //     path: '/AutomatedRelease/ExecuteTask',
    //     query: {
    //       code: 3,
    //       builedId: id,
    //       jobId: di,
    //       type: '1',
    //       plantype: '2'
    //     }
    //   })
    // },
    handdleMsg (msg) {
      let _this = this
      _this.$global.ws.onmessage = function (res) {
        if (res.data.length > 0) {
          let socketdata = JSON.parse(res.data)
          if (socketdata.manageId && socketdata[500]) {
            _this.$notify({
              type: 'error',
              message: socketdata[500]
            })
            _this.tableData.forEach((item, index) => {
              if (item.manageId == socketdata.manageId) {
                _this.$set(_this.tableData[index], 'taskStatus', 'FAILURE')
              }
            })
          }
        }
      }
    },
    formatStrategy (row, column) {
      if (row.cronStrategy === 'cycle') {
        return '周期性'
      } else if (row.cronStrategy === 'once') {
        return '一次性'
      } else if (row.cronStrategy === 'interval') {
        return '间隔性'
      } else {
        return '-'
      }
    },
    formatPurposes: function (row, column) {
      return row.taskType === '2' ? '部署' : '构建'
    },
    // 获取定时任务列表
    getTimingList () {
      let data = this.search
      console.log('test aa')
      data.current = this.currPage
      data.size = this.size
      console.log(data)
      axios.getTimingList(data).then(res => {
        if (res.data.code === 200) {
          this.tableData = res.data.data.records
          this.total = parseInt(res.data.data.total)
        } else {
          this.$notify({
            type: 'error',
            message: res.data.message
          })
        }
      })
    },
    // 搜索定时任务
    searchTask () {
      this.currPage = 1
      this.getTimingList()
    },
    deleteJob (id) {
      this.confirmDeleteDialogVisible = true
      this.cancleId = id
    },
    confirmDelete () {
      axios.deleteTimingTask(this.cancleId).then(res => {
        if (res.data.code === 200) {
          this.getTimingList()
          this.confirmDeleteDialogVisible = false
          this.$notify({
            type: 'success',
            message: res.data.message
          })
        } else {
          this.$notify({
            type: 'error',
            message: res.data.message
          })
        }
      })
    },
    // 添加定时任务
    addTask () {
      this.$router.push({
        query: {
          code: 8
        },
        path: '/Aibms/otherConfiguration/timing/create'
      })
    },
    readJob (id) {
      this.$router.push({
        query: {
          code: 8,
          manageId: id
        },
        path: '/Aibms/otherConfiguration/timing/read'
      })
    },
    editJob (id) {
      this.$router.push({
        query: {
          code: 8,
          manageId: id
        },
        path: '/Aibms/otherConfiguration/timing/edit'
      })
    },
    handleSizeChange (val) {
      this.size = val
      this.getTimingList()
    },
    handleCurrentChange (val) {
      this.currPage = val
      this.getTimingList()
    },
    getRunPhase (item) {
      let result = item.runPhase && JSON.parse(item.runPhase)
      try {
        result = result[0].stages[0].name
      } catch (err) {
        result = ''
      }
      return result || ''
    },
    // 将状态code转换
    filterStatus (state) {
      let current = {}
      this.statusList.forEach(item => {
        if (item.systemId === state) {
          current = item
        } else if (item.systemId === null && state === '') {
          current = item
        }
      })
      return current
    }
  },
  filters: {
    status (state) {
      if (state === 'FAILURE') {
        return '执行失败'
      } else if (!state || state === 'NOTEXECUTED') {
        return '未发布'
      } else if (state === 'building') {
        return '发布中'
      } else if (state === 'SUCCESS') {
        return '发布成功'
      } else if (state === 'ABORTED') {
        return '手动结束'
      } else {
        return '-'
      }
    }
  }
}
</script>

<style scoped>
.tab_box {
  display: flex;
  text-align: left;
}
.tab_box-item {
  min-width: 20%;
}
.cluster-manage {
  width: 100%;
  padding: 10px 0;
  box-sizing: border-box;
}
.cluster-manage .wrapper {
  width: 100%;
  padding-left: 5px;
}
.wrapper .operate-bar {
  width: 100%;
}
.wrapper .paging-area {
  margin-top: 40px;
  text-align: center;
}

.cluster-list .btn-watch {
  color: #fff;
  background-color: #0280ff;
  background-size: 50%;
  background-position: center center;
}
.cluster-list .btn-watch:hover {
  background-color: #196cbe;
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.other {
  background-size: 12% !important;
}
.active {
  background: #fff;
  color: #fff;
  border: 1px solid #0066ff;
}
.task-btn-box {
  padding: 10px;
}

.task-btn-box span {
  display: inline-block;
  background: #fff;
  border: 1px solid #0066ff;
  line-height: 24px;
  padding: 0 4px;
  border-radius: 5px;
  color: #0066ff;
  font-size: 14px;
  margin: 2px 2px;

  cursor: pointer;
}
.task-btn-box .disabled {
  display: inline-block;
  font-size: 14px;
  margin-right: 12px;
  line-height: 24px;
  padding: 0 8px;
  border-radius: 5px;
}
.task-btn-box span.active {
  background: #0066ff;
  color: #fff;
}
.task-btn-box span img {
  height: 12px;
  margin-top: 2px;
}
.jobskip {
  color: #0066ff;
  cursor: pointer;
  display: inline-block;
}
.content-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.notClick {
  cursor: not-allowed !important;
  background-color: rgb(221, 221, 221) !important;
}
.blank-page .imgdiv {
  height: 200px;
  padding-top: 15px;
}
.blank-page .empty-text {
  font-size: 18px;
  height: 30px;
  line-height: 30px;
  margin-top: -30px;
  margin-bottom: 10px;
}
.special {
  cursor: pointer;
}
*/ .error {
  color: #f10;
}
.wraning {
  color: #e6a23c;
}
.success {
  color: #67c23a;
}
.demo-form-inline /deep/ .overHideMargin {
  margin-right: 0 !important;
}
.data-list
  /deep/
  .el-table__header-wrapper
  .el-table__header
  thead
  tr
  th:nth-of-type(8)
  div.cell {
  text-align: center;
}
</style>
