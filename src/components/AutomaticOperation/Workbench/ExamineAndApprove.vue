<template>
  <div class="panel">
    <el-tabs v-model="pageStates" @tab-click="getList">
      <el-tab-pane label="待审批" name="0">
        <el-form :inline="true" class="demo-form-inline clear-fix">
          <el-form-item style="width:10%">
            <el-select
              placeholder="选择类型"
              size="medium"
              v-model="searchDataWait.businessType"
              clearable
            >
              <el-option
                :label="type.label"
                :value="type.value"
                v-for="type in taskTypes"
                :key="type.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item style="width:10%">
            <el-select
              placeholder="选择审批人"
              size="medium"
              v-model="searchDataWait.createBy"
              clearable
            >
              <el-option
                :label="type.name"
                :value="type.userId"
                v-for="type in userList"
                :key="type.userId"
              />
            </el-select>
          </el-form-item>
          <el-form-item style="width:15%">
            <el-input
              type="text"
              size="medium"
              v-model="searchDataWait.businessName"
              placeholder="请输入工单名称"
              clearable
            />
          </el-form-item>
          <el-form-item class="searbtn overHideMargin">
            <el-button
              icon="el-icon-search"
              class="nomal-button"
              @click.prevent="searchWait(1)"
            >查找</el-button>
          </el-form-item>
        </el-form>
        <el-table
          :data="examineListWait"
          style="width: 100%"
          @row-click="goDetail"
          :header-cell-style="{ background: '#f5f5f5' }"
        >
          <el-table-column prop="businessType" label="类型" width="180">
            <template slot-scope="scope">{{ scope.row.businessType | getType}}</template>
          </el-table-column>
          <el-table-column prop="businessName" label="名称" width="180" />
          <el-table-column prop="createByName" label="申请人" width="180" />
          <el-table-column prop="createDate" label="审批发起时间" width="180" />
          <el-table-column prop="updateDate" label="最近修改时间" />
          <el-table-column prop="auditStatus" label="审批状态">
            <template slot-scope="scope">
              <span class="cursor-status">{{ scope.row.applyStatus | getStatus}}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <div class="task-btn-box">
                <span class="special" @click="goDetail(scope.row, 0)">
                  <el-tooltip class="item" effect="dark" content="查看详情" placement="top-start">
                    <img class="see" src="../../../../static/img/seeblue.png" alt />
                  </el-tooltip>
                </span>
          </div>-->
          <!-- <el-button @click="seeStart(scope.row.id)">查看</el-button> -->
          <!-- <el-button type="primary" size="mini" class="seebtn" @click="goDetail(scope.row, 0)">查看</el-button> -->
          <!-- </template>
          </el-table-column>-->
        </el-table>
        <div class="block">
          <el-pagination
            @size-change="handleWaitSizeChange"
            @current-change="handleWaitCurrentChange"
            :current-page="searchDataWait.current"
            :page-sizes="[10,30,50]"
            layout="prev, pager, next, sizes, total, jumper"
            :total="searchDataWait.total"
            v-if="searchDataWait.page"
            style="margin-right:15px;margin-top:92px;cursor: pointer;"
          />
        </div>
      </el-tab-pane>
      <el-tab-pane label="已审批" name="1">
        <el-form :inline="true" class="demo-form-inline clear-fix">
          <el-form-item style="width:10%">
            <el-select placeholder="选择类型" v-model="searchData.businessType" size="medium" clearable>
              <el-option
                :label="type.label"
                :value="type.value"
                v-for="type in taskTypes"
                :key="type.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item style="width:10%">
            <el-select
              placeholder="选择审批结果"
              v-model="searchData.auditStatus"
              size="medium"
              clearable
            >
              <el-option
                :label="sys.label"
                :value="sys.status"
                v-for="sys in examineResult"
                :key="sys.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item style="width:15%">
            <el-input
              type="text"
              size="medium"
              v-model="searchData.businessName"
              placeholder="请输入任务名称"
              clearable
            />
          </el-form-item>
          <el-form-item class="searbtn overHideMargin">
            <el-button
              icon="el-icon-search"
              class="nomal-button"
              @click.prevent="searchokList(1)"
            >查找</el-button>
          </el-form-item>
        </el-form>
        <el-table
          :data="examineList"
          style="width: 100%"
          @row-click="goDetail"
          :header-cell-style="{ background: '#f5f5f5' }"
        >
          <el-table-column prop="businessType" label="类型" width="180">
            <template slot-scope="scope">{{ scope.row.businessType | getType}}</template>
          </el-table-column>
          <el-table-column prop="businessName" label="任务名称" width="180" />
          <el-table-column prop="createByName" label="申请人" width="180" />
          <el-table-column prop="createDate" label="审批发起时间" width="180" />
          <el-table-column prop="updateDate" label="最近修改时间" />
          <el-table-column prop="auditStatus" label="审批状态">
            <template slot-scope="scope">
              <span class="cursor-status">{{ scope.row.auditStatus | getStatus}}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <div class="task-btn-box">
                <span class="special" @click="goDetail(scope.row, 1)">
                  <el-tooltip class="item" effect="dark" content="查看详情" placement="top-start">
                    <img class="see" src="../../../../static/img/seeblue.png" alt />
                  </el-tooltip>
                </span>
          </div>-->
          <!-- <el-button @click="seeStart(scope.row.id)">查看</el-button> -->
          <!-- <el-button type="primary" size="mini" class="seebtn" @click="goDetail(scope.row, 1)">查看</el-button> -->
          <!-- </template>
          </el-table-column>-->
        </el-table>
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="searchData.current"
            :page-sizes="[10,30,50]"
            layout="prev, pager, next, sizes, total, jumper"
            :total="searchData.total"
            v-if="searchData.page"
            style="margin-right:15px;margin-top:92px;cursor: pointer;"
          ></el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="我发起的" name="2">
        <el-form :inline="true" class="demo-form-inline clear-fix">
          <el-form-item style="width:10%">
            <el-select placeholder="选择类型" size="medium" v-model="startData.businessType" clearable>
              <el-option
                :label="type.label"
                :value="type.value"
                v-for="type in taskTypes"
                :key="type.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item style="width:20%">
            <el-input
              type="text"
              size="medium"
              v-model="startData.businessName"
              placeholder="请输入脚本/发布任务名称"
              clearable
            />
          </el-form-item>
          <el-form-item class="searbtn overHideMargin">
            <el-button
              icon="el-icon-search"
              class="nomal-button"
              @click.prevent="searchStart(1)"
            >查找</el-button>
          </el-form-item>
        </el-form>
        <el-table
          :data="startList"
          style="width: 100%"
          @row-click="goDetail"
          :header-cell-style="{ background: '#f5f5f5' }"
        >
          <el-table-column prop="businessType" label="类型" width="180">
            <template slot-scope="scope">{{ scope.row.businessType | getType}}</template>
          </el-table-column>
          <el-table-column prop="businessName" label="任务名称" />
          <el-table-column prop="createByName" label="申请人" />
          <el-table-column prop="createDate" label="审批发起时间" />
          <el-table-column prop="updateDate" label="最近修改时间" />
          <el-table-column prop="auditStatus" label="审批状态">
            <template slot-scope="scope">
              <span class="cursor-status">{{ scope.row.applyStatus | getStatus}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="150">
            <template slot-scope="scope">
              <div class="btn-box">
                <span
                  class="disabled"
                  v-if="scope.row.applyStatus !== '2'"
                  @click.stop="recall()"
                >撤回</span>
                <span
                  v-else
                  @click.stop="confirmRecallStart(scope.row.businessId,scope.row.businessType)"
                >撤回</span>
              </div>
              <!-- <div class="task-btn-box"> -->
              <!-- <span class="special" @click="goDetail(scope.row, 2)">
                  <el-tooltip class="item" effect="dark" content="查看详情" placement="top-start">
                    <img class="see" src="../../../../static/img/seeblue.png" alt />
                  </el-tooltip>
              </span>-->
              <!-- <span class="disabled" v-if="scope.row.applyStatus !== '2'">
                  <el-tooltip class="item" effect="dark" content="撤回" placement="top-start">
                    <img src="../../../../static/img/recallblue.png" alt />
                  </el-tooltip>
                </span>
                <span
                  class="special"
                  v-else
                  @click.stop="confirmRecallStart(scope.row.businessId,scope.row.businessType)"
                >
                  <el-tooltip class="item" effect="dark" content="撤回" placement="top-start">
                    <img class="recal" src="../../../../static/img/recallblue.png" alt />
                  </el-tooltip>
                </span>
              </div>-->

              <!-- <el-button @click="seeStart(scope.row.id)">查看</el-button> -->
              <!-- <el-button type="primary" size="mini" @click="goDetail(scope.row, 2)">查看</el-button> -->
              <!-- <el-button
                type="primary"
                size="mini"
                @click.stop="confirmRecallStart(scope.row.businessId,scope.row.businessType)"
                :disabled="scope.row.applyStatus !== '2'"
              >撤回</el-button>-->
            </template>
          </el-table-column>
        </el-table>

        <div class="block">
          <el-pagination
            @size-change="handleStartSizeChange"
            @current-change="handleStartCurrentChange"
            :current-page="startData.current"
            :page-sizes="[10,30,50]"
            layout="prev, pager, next, sizes, total, jumper"
            :total="startData.total"
            v-if="startData.page"
            style="margin-right:15px;margin-top:92px;cursor: pointer;"
          ></el-pagination>
        </div>
      </el-tab-pane>

      <el-tab-pane label="抄送我的" name="3">
        <el-form :inline="true" class="demo-form-inline clear-fix">
          <el-form-item style="width:10%">
            <el-select placeholder="选择类型" size="medium" v-model="sendData.businessType" clearable>
              <el-option
                :label="type.label"
                :value="type.value"
                v-for="type in taskTypes"
                :key="type.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item style="width:10%">
            <el-select placeholder="选择申请人" size="medium" v-model="sendData.name" clearable>
              <!-- <el-option
                :label="apply.label"
                :value="apply.value"
                v-for="apply in applyUserList"
                :key="apply.value"
              ></el-option>-->
              <el-option
                :label="type.name"
                :value="type.userId"
                v-for="type in userList"
                :key="type.userId"
              />
            </el-select>
          </el-form-item>
          <el-form-item style="width:20%">
            <el-input
              type="text"
              size="medium"
              v-model="sendData.businessName"
              placeholder="请输入脚本/发布任务名称"
              clearable
            />
          </el-form-item>
          <el-form-item class="searbtn overHideMargin">
            <el-button
              icon="el-icon-search"
              class="nomal-button"
              @click.prevent="searchSend(1)"
            >查找</el-button>
          </el-form-item>
        </el-form>
        <el-table
          :data="sendList"
          style="width: 100%"
          @row-click="goDetail"
          :header-cell-style="{ background: '#f5f5f5' }"
        >
          <el-table-column prop="businessType" label="类型" width="180">
            <template slot-scope="scope">{{ scope.row.businessType | getType}}</template>
          </el-table-column>
          <el-table-column prop="businessName" label="名称" width="180" />
          <el-table-column prop="createByName" label="申请人" width="180" />
          <el-table-column prop="createDate" label="审批发起时间" width="180" />
          <el-table-column prop="updateDate" label="最近修改时间" />
          <el-table-column prop="auditStatus" label="审批状态">
            <template slot-scope="scope">
              <span class="cursor-status">{{ scope.row.applyStatus | getStatus}}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <div class="task-btn-box">
                <span class="special" @click="goDetail(scope.row, 3)">
                  <el-tooltip class="item" effect="dark" content="查看详情" placement="top-start">
                    <img class="see" src="../../../../static/img/seeblue.png" alt />
                  </el-tooltip>
                </span>
          </div>-->
          <!-- <el-button @click="seeSend(scope.row.id)">查看</el-button> -->
          <!-- <el-button type="primary" size="mini" class="seebtn" @click="goDetail(scope.row, 3)">查看</el-button> -->
          <!-- </template>
          </el-table-column>-->
        </el-table>

        <div class="block">
          <el-pagination
            @size-change="handleSendSizeChange"
            @current-change="handleSendCurrentChange"
            :current-page="sendData.current"
            :page-sizes="[10,30,50]"
            layout="prev, pager, next, sizes, total, jumper"
            :total="sendData.total"
            v-if="sendData.page"
            style="margin-right:15px;margin-top:92px;cursor: pointer;"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-dialog center title="撤回确认" :visible.sync="confirmRecallStartDialogVisible" width="20%">
      <span>确定要撤回审批吗？</span>
      <div slot="footer" class="dialog-footer">
        <el-button class="nomal-button" @click="confirmRecallStartDialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="recallStart()" size="mini">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from '@/api';
export default {
  name: 'ExamineAndApprove',
  data () {
    return {
      pageStates: '0',
      searchData: {
        page: false,
        total: 0,
        current: 1,
        size: 10
      },
      searchDataWait: {
        page: false,
        total: 0,
        current: 1,
        size: 10
      },
      startData: {
        page: false,
        total: 0,
        current: 1,
        size: 10
      },
      sendData: {
        page: false,
        total: 0,
        current: 1,
        size: 10
      },
      examineListWait: [],
      examineList: [],
      startList: [], // 我发起的数据
      sendList: [], // 抄送我的数据
      taskTypes: [
        {
          value: '2',
          label: '操作流水线'
        },
        {
          value: '1',
          label: '脚本'
        }, {
          value: '3',
          label: '运维工单'
        }
      ],
      // 申请人列表
      applyUserList: [],
      // 审批结果 0-通过 1-失败
      examineResult: [
        {
          status: '0',
          label: '通过'
        },
        {
          status: '1',
          label: '不通过'
        }
      ],
      userList: [],
      confirmRecallStartDialogVisible: false,
      currentRecallStart: {}
    }
  },
  filters: {
    getStatus (val) {
      console.log(val)
      if (val === '0') {
        console.log('sdf')
        return '通过'
      } else if (val === '1') {
        return '不通过'
      } else if (val === '2') {
        return '审批中'
      } else if (val === '3') {
        return '审批撤回'
      } else {
        return '未审核'
      }
    },
    getType (buType) {
      if (buType === '1') {
        return '脚本'
      } else if (buType === '2') {
        return '操作流水线'
      } else if (buType === '3') {
        return '运维工单'
      }
    }
  },
  created () {
    this.searchWait(1)
    this.getUserList()
  },
  methods: {
    recall () { },
    // 获取我发起的列表
    searchStart (val) {
      this.getStartList(val)
    },
    // 查看我发起的
    seeStart (id) { },
    // 撤回我发起的
    recallStart () {
      const data = {
        businessId: this.currentRecallStart.id,
        businessType: this.currentRecallStart.type
      }
      axios.devRecallAuditLog(data).then(res => {
        // 若撤回成功给出提示，并重新获取我发起的审批列表数据
        if (res.data.success) {
          this.$notify({
            title: '标题名称',
            message: '撤回成功',
            type: 'success'
          })
        }
        this.getStartList(1)
      })
      this.confirmRecallStartDialogVisible = false
    },
    // 确认撤回
    confirmRecallStart (id, type) {
      this.confirmRecallStartDialogVisible = true
      this.currentRecallStart.id = id
      this.currentRecallStart.type = type
    },
    // 获取抄送我的列表
    searchSend (val) {
      this.getSendList(val)
    },
    // 查看抄送我的
    seeSend () { },
    // 获取审批列表
    getList () {
      if (this.pageStates === '0') {
        this.searchWait(1)
      } else if (this.pageStates === '1') {
        this.searchokList(1)
      } else if (this.pageStates === '2') {
        this.getStartList(1)
      } else {
        this.getSendList(1)
      }
    },
    // 获取用户列表
    getUserList () {
      axios.getapproverlist().then(data => {
        if (data.status === 200) this.userList = data.data.data
      })
    },
    // 获取待审批列表
    searchWait (val) {
      this.searchDataWait.pageStates = this.pageStates
      this.searchDataWait.current = val
      delete this.searchDataWait.total
      delete this.searchDataWait.page
      axios.devAuditLogList(this.searchDataWait).then(data => {
        if (data.data.code === 200) {
          this.examineListWait = data.data.data.records
          this.searchDataWait.total = parseInt(data.data.data.total)
          if (this.searchDataWait.total > 0) this.searchDataWait.page = true
        } else {
          this.$notify({
            title: '提示',
            message: data.data.message,
            type: 'error'
          })
        }
      })
    },

    // 获取我的已审批列表
    searchokList (val) {
      this.searchData.pageStates = 1
      this.searchData.current = val
      delete this.searchData.total
      axios.devAuditLogList(this.searchData)
        .then(data => {
          if (data.data.code === 200) {
            this.examineList = data.data.data.records
            // console.log(this.examineList);
            this.searchData.total = parseInt(data.data.data.total)
            if (this.searchData.total > 0) this.searchData.page = true
          } else {
            this.$notify({
              title: '提示',
              message: data.data.message,
              type: 'error'
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 获取我发起的列表
    getStartList (val) {
      this.startData.pageStates = 2
      this.startData.current = val
      delete this.startData.total
      axios.devAuditLogList(this.startData)
        .then(data => {
          if (data.data.code === 200) {
            this.startList = data.data.data.records
            // console.log(this.startList);
            this.startData.total = parseInt(data.data.data.total)
            // console.log(data.data.data.total);
            if (this.startData.total > 0) this.startData.page = true
          } else {
            this.$notify({
              title: '提示',
              message: data.data.message,
              type: 'error'
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 获取抄送我的列表
    getSendList (val) {
      this.sendData.pageStates = 3
      this.sendData.current = val
      delete this.sendData.total
      axios.devAuditLogList(this.sendData)
        .then(data => {
          if (data.data.code === 200) {
            this.sendList = data.data.data.records
            this.sendData.total = parseInt(data.data.data.total)
            // console.log(data.data.data.total);
            if (this.sendData.total > 0) this.sendData.page = true
          } else {
            this.$notify({
              title: '提示',
              message: data.data.message,
              type: 'error'
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 待审批分页
    handleWaitSizeChange (val) {
      this.searchDataWait.size = val
      this.searchWait()
    },
    // 分页
    handleWaitCurrentChange (val) {
      this.searchDataWait.current = val
      this.searchWait(val)
    },
    // 已审批分页
    handleSizeChange (val) {
      this.searchData.size = val
      this.searchokList(val)
    },
    // 分页
    handleCurrentChange (val) {
      this.searchData.current = val
      this.searchokList(val)
    },
    // 我发起的分页
    handleStartSizeChange (val) {
      this.startData.size = val
      this.searchStart(val)
    },
    // 分页
    handleStartCurrentChange (val) {
      this.startData.current = val
      this.searchStart(val)
    },
    // 抄送我的分页
    handleSendSizeChange (val) {
      this.sendData.size = val
      this.searchSend(val)
    },
    // 分页
    handleSendCurrentChange (val) {
      this.sendData.current = val
      this.searchSend(val)
    },
    // 跳转详情
    goDetail (row) {
      this.$router.push({
        path: '/AutomaticOperation/examineAndApproveDetail',
        query: {
          code: 4,
          businessId: row.businessId,
          businessType: row.businessType,
          type: Number(this.pageStates) + 1,
          plantype: '2',
          logId: row.logId,
          key: 'detail',
          auditStatus: row.auditStatus
            ? row.auditStatus
            : row.applyStatus
              ? row.applyStatus
              : ''
        }
      })
    }
  }
}
</script>

<style scoped>
.cursor-status {
  cursor: pointer;
}
.cursor-status:hover {
  color: #1e90ff;
}
.panel {
  padding: 0px 10px 10px 10px;
}
.block {
  text-align: center;
  margin: 20px auto;
}
.seebtn {
  border-radius: 5px;
}
.el-button--primary {
  border-radius: 15px;
}
.task-btn-box .disabled {
  cursor: not-allowed;
  background-color: #ddd;
  border: 1px solid #777777;
}
.task-btn-box {
  /* padding: 10px; */
  text-align: center;
}

.task-btn-box span {
  display: inline-block;
  background: #fff;
  border: 1px solid #0066ff;
  line-height: 24px;
  /* padding: 0 8px; */
  border-radius: 5px;
  color: #0066ff;
  font-size: 14px;
  margin-right: 12px;
  cursor: pointer;
}
.task-btn-box span.special {
  /* border: 1px solid #777777; */
  cursor: pointer;
}
.task-btn-box span img {
  height: 12px;
  /* margin-top: 2px; */
  padding: 5px 8px 6px 8px;
  margin-bottom: -6px;
}
.task-btn-box span.special:hover {
  background: #0066ff;
  /* color:#fff!important; */
}
.btn-box span {
  margin: 0 5px;
  cursor: pointer;
}
.btn-box span:hover {
  color: #0066ff;
}
.btn-box .disabled {
  cursor: not-allowed !important;
  color: #c6c6c6 !important;
}
.searbtn {
  float: right;
}
.demo-form-inline /deep/ .overHideMargin {
  margin-right: 0 !important;
}
</style>
