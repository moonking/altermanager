<template>
  <div class="cluster-manage">
    <div class="wrapper">
      <div class="operate-bar">
        <el-form inline :model="search" class="demo-form-inline">
          <el-form-item>
            <el-input
              v-model="search.name"
              placeholder="请输入发布任务名称"
              sortable
              class="w366"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item class="item-right overHideMargin">
            <el-button
              icon="el-icon-plus"
              class="common-btn save-btn"
              @click.prevent="addTask"
              >新增</el-button
            >
          </el-form-item>
          <el-form-item class="item-right">
            <el-button
              icon="el-icon-search"
              class="search-btn"
              @click="searchTask"
              >查找</el-button
            >
          </el-form-item>
        </el-form>
      </div>
        <el-table
          stripe
          height="74%"
          @row-click="readJob"
          class="data-list"
          :data="tableData"
          style="width: 100%"
          :header-cell-style="{ background: '#f5f5f5' }"
        >
          <el-table-column label="任务名称" prop="name"></el-table-column>
          <el-table-column label="请求地址" prop="url" show-overflow-tooltip></el-table-column>
          <el-table-column
            label="定时策略"
            prop="cronStrategy"
            :formatter="formatStrategy"
          ></el-table-column>
          <el-table-column
            label="定时时间"
            prop="humanityTime"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            label="操作"
            align="center"
            prop="operate"
            width="200px"
          >
            <template slot-scope="scope">
              <div class="task-btn-box">
                <el-link
                  :underline="false"
                  class="el-icon-edit-outline"
                  @click.stop="
                    editJob(
                      scope.row.iD,
                      scope.row.taskType,
                      scope.row.applyStatus
                    )
                  "
                  ></el-link
                >
                <el-link
                  :underline="false"
                  class="el-icon-close"
                  @click.stop="
                    scope.row.conflict !== 'building' &&
                      deleteJob(
                        scope.row.iD,
                        scope.row.applyStatus,
                        scope.row.taskType
                      )
                  "
                  >取消发布</el-link
                >
                <!-- <span
                  class="special"
                  @click="readJob(scope.row.iD, scope.row.taskType)"
                >
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="查看详情"
                    placement="top-start"
                  >
                    <icon-svg icon-class="chakan" />
                  </el-tooltip>
                </span>
                <span
                  class="special"
                  @click="
                    editJob(
                      scope.row.iD,
                      scope.row.taskType,
                      scope.row.applyStatus
                    )
                  "
                >
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="修改"
                    placement="top-start"
                  >
                    <icon-svg icon-class="bianji" />
                  </el-tooltip>
                </span>
                <span
                  class="special"
                  :class="scope.row.conflict === 'building' ? 'notClick' : ''"
                  @click="
                    scope.row.conflict !== 'building' &&
                      deleteJob(
                        scope.row.iD,
                        scope.row.applyStatus,
                        scope.row.taskType
                      )
                  "
                >
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="取消发布"
                    placement="top-start"
                  >
                    <icon-svg icon-class="jilu" />
                  </el-tooltip>
                </span> -->
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

      <el-dialog
        center
        title="取消发布提示"
        :visible.sync="confirmDeleteDialogVisible"
        width="25%"
      >
        <div style="text-align: center">
          <i class="el-icon-warning"></i> 是否将该任务取消定时？
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button size="medium" @click="confirmDeleteDialogVisible = false"
            >取消</el-button
          >
          <el-button size="medium" type="primary" @click="confirmDelete"
            >确定</el-button
          >
        </span>
      </el-dialog>
    </div>
    <!-- 分页 -->
    <el-pagination
      v-if="total && total > 10"
      :current-page="currPage"
      :page-size="size"
      :page-sizes="[10, 20, 30]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      style="cursor: pointer"
      class="absolute-center"
    />
  </div>
</template>

<script>
import axios from '@/api';
export default {
  name: 'CrontabList',
  data() {
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
      confirmDeleteDialogVisible: false,
      callNum: 0
    }
  },
  created() {
    let params = this.getParams()
    this.getTimingList(params)
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
    // search数据缓存
    setSession() {
      if (this.callNum > 1) {
        const params = {
          name: this.search.name,
          current: this.currPage,
          size: this.size
        }
        sessionStorage.setItem('search', JSON.stringify(params))
      }
    },
    // search数据回显
    getParams() {
      let params
      if (sessionStorage.getItem('search') !== null) {
        params = JSON.parse(sessionStorage.getItem('search'))
        const { name, current, size } = params
        this.search.name = name
        this.currPage = current
        this.size = size
      }
      return params
    },
    // websocket数据处理 状态处理
    handdleMsg(msg) {
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
    // 定时策略选择
    formatStrategy(row, column) {
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
    // formatPurposes: function (row, column) {
    //   return row.taskType === '2' ? '部署' : '构建'
    // },
    // 获取定时任务列表
    getTimingList(params) {
      if (params === undefined) {
        params = {
          name: this.search.name,
          current: this.currPage,
          size: this.size
        }
      }
      axios.getTimingList(params).then(res => {
        if (res.data.code === 200) {
          this.tableData = res.data.data.records
          this.total = parseInt(res.data.data.total)
          this.callNum++
        } else {
          this.$notify({
            type: 'error',
            message: res.data.message
          })
        }
      })
    },
    // 搜索定时任务
    searchTask() {
      this.currPage = 1
      this.getTimingList()
    },
    // 删除任务dialog显示
    deleteJob(id) {
      this.confirmDeleteDialogVisible = true
      this.cancleId = id
    },
    // 是否删除
    confirmDelete() {
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
    addTask() {
      this.$router.push({
        query: {
          code: 2
        },
        path: '/Aibms/otherConfiguration/timing/create'
      })
    },
    // 跳转至定时任务详情
    readJob(row) {
      this.setSession()
      this.$router.push({
        query: {
          code: 2,
          manageId: row.iD
        },
        path: '/Aibms/otherConfiguration/timing/read'
      })
    },
    // 修改定时任务
    editJob(id) {
      this.setSession()
      this.$router.push({
        query: {
          code: 2,
          manageId: id
        },
        path: '/Aibms/otherConfiguration/timing/edit'
      })
    },
    // 翻页
    handleSizeChange(val) {
      this.size = val
      this.getTimingList()
    },
    // 分页
    handleCurrentChange(val) {
      this.currPage = val
      this.getTimingList()
    },
    getRunPhase(item) {
      let result = item.runPhase && JSON.parse(item.runPhase)
      try {
        result = result[0].stages[0].name
      } catch (err) {
        result = ''
      }
      return result || ''
    },
    // 将状态code转换
    filterStatus(state) {
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
    status(state) {
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

<style scoped lang="scss">
.tab_box {
  display: flex;
  text-align: left;
}
.tab_box-item {
  min-width: 20%;
}
.cluster-manage {
  position: relative;
  width: 100%;
  height: 94%;
  padding: 10px 10px;
  box-sizing: border-box;
}
.cluster-manage .wrapper {
  width: 100%;
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
  text-align: center;
  display: inline-block;
}
.el-link {
  // color: #fff;
}
/* .task-btn-box span {
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
} */
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
.error {
  color: #f10;
}
.wraning {
  color: #e6a23c;
}
.success {
  color: #67c23a;
}
.overHideMargin {
  margin-left: 20px;
  // .el-button {
  //   border: 1px solid #436382;
  //   color: #fff;
  //   &:hover {
  //     border: 1px solid #01aef1;
  //     color: #01aef1;
  //     background-color: #041c25;
  //   }
  //   &:focus {
  //     border: 1px solid #01aef1;
  //     color: #01aef1;
  //     background-color: #041c25;
  //   }
  //   &:active {
  //     background-color: #041c25;
  //     border: 1px solid #01aef1;
  //     color: #01aef1;
  //   }
  // }
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
