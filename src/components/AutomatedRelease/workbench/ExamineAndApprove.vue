<template>
  <div class="panel aibms-role">
    <el-tabs v-model="pageStates" @tab-click="getList">
      <el-tab-pane label="待审批" name="0">
        <el-form
          :inline="true"
          class="demo-form-inline"
          style="padding:0 0 5px 0;margin-bottom: -10px;"
        >
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
              ></el-option>
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
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="width:15%">
            <el-input
              type="text"
              size="medium"
              v-model="searchDataWait.businessName"
              placeholder="请输入任务名称"
              clearable
            />
          </el-form-item>
          <el-form-item class="item-right overHideMargin">
            <el-button icon="el-icon-search" class="nomal-button" @click="searchWait(1)">查找</el-button>
          </el-form-item>
        </el-form>
        <el-table
          :data="examineListWait"
          stripe
          empty-text="暂无数据"
          :header-cell-style="{ background: '#f5f5f5' }"
          style="width: 100%"
        >
          <el-table-column prop="businessType" label="类型" width="180">
            <template slot-scope="scope">{{ scope.row.businessType | getType}}</template>
          </el-table-column>
          <el-table-column prop="businessName" label="名称" width="180"></el-table-column>
          <el-table-column prop="createByName" label="申请人" width="180"></el-table-column>
          <el-table-column prop="createDate" label="审批发起时间" width="180"></el-table-column>
          <el-table-column prop="updateDate" label="最近修改时间"></el-table-column>
          <el-table-column prop="auditStatus" label="审批状态">
            <template slot-scope="scope">{{ scope.row.applyStatus | getStatus}}</template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <div class="task-btn-box">
                <span class="special" @click="goDetail(scope.row, 0)">
                  <el-tooltip class="item" effect="dark" content="查看详情" placement="top-start">
                    <icon-svg icon-class="chakan" class="whiteness-icon-color" />
                  </el-tooltip>
                </span>
              </div>
              <!-- <el-button @click="seeStart(scope.row.id)">查看</el-button> -->
              <!-- <el-button type="primary" size="mini" class="seebtn" @click="goDetail(scope.row, 0)">查看</el-button> -->
            </template>
          </el-table-column>
          <div slot="empty">
            <div class="blank-page">
              <div class="imgdiv">
                <img src="../../../../static/img/blank-page.png" alt />
              </div>
              <p class="empty-text">暂无待审批的数据</p>
            </div>
          </div>
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
            style="margin-right:15px;cursor: pointer;"
          ></el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="已审批" name="1">
        <el-form
          :inline="true"
          class="demo-form-inline"
          style="padding:0 0 5px 0;margin-bottom: -10px;"
        >
          <el-form-item style="width:10%">
            <el-select placeholder="选择类型" v-model="searchData.businessType" size="medium" clearable>
              <el-option
                :label="type.label"
                :value="type.value"
                v-for="type in taskTypes"
                :key="type.value"
              ></el-option>
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
              ></el-option>
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
          <el-form-item class="item-right overHideMargin">
            <el-button icon="el-icon-search" class="nomal-button" @click="searchokList(1)">查找</el-button>
          </el-form-item>
        </el-form>
        <el-table
          :data="examineList"
          stripe
          style="width: 100%"
          :header-cell-style="{ background: '#f5f5f5' }"
        >
          <el-table-column prop="businessType" label="类型" width="180">
            <template slot-scope="scope">{{ scope.row.businessType | getType}}</template>
          </el-table-column>
          <el-table-column prop="businessName" label="任务名称" width="180"></el-table-column>
          <el-table-column prop="createByName" label="申请人" width="180"></el-table-column>
          <el-table-column prop="createDate" label="审批发起时间" width="180"></el-table-column>
          <el-table-column prop="updateDate" label="最近修改时间"></el-table-column>
          <el-table-column prop="auditStatus" label="审批状态">
            <template slot-scope="scope">{{ scope.row.auditStatus | getStatus}}</template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <div class="task-btn-box">
                <span class="special" @click="goDetail(scope.row, 1)">
                  <el-tooltip class="item" effect="dark" content="查看详情" placement="top-start">
                    <icon-svg icon-class="chakan" class="whiteness-icon-color" />
                  </el-tooltip>
                </span>
              </div>
              <!-- <el-button @click="seeStart(scope.row.id)">查看</el-button> -->
              <!-- <el-button type="primary" size="mini" class="seebtn" @click="goDetail(scope.row, 1)">查看</el-button> -->
            </template>
          </el-table-column>
          <div slot="empty">
            <div class="blank-page">
              <div class="imgdiv">
                <img src="../../../../static/img/blank-page.png" alt />
              </div>
              <p class="empty-text">暂无已审批的数据</p>
            </div>
          </div>
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
            style="margin-right:15px;cursor: pointer;"
          ></el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="我发起的" name="2">
        <el-form
          :inline="true"
          class="demo-form-inline"
          style="padding:0 0 5px 0;margin-bottom: -10px;"
        >
          <el-form-item style="width:10%">
            <el-select placeholder="选择类型" size="medium" v-model="startData.businessType" clearable>
              <el-option
                :label="type.label"
                :value="type.value"
                v-for="type in taskTypes"
                :key="type.value"
              ></el-option>
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
          <el-form-item class="item-right overHideMargin">
            <el-button icon="el-icon-search" class="nomal-button" @click="searchStart(1)">查找</el-button>
          </el-form-item>
        </el-form>
        <el-table
          :data="startList"
          stripe
          style="width: 100%"
          :header-cell-style="{ background: '#f5f5f5' }"
        >
          <el-table-column prop="businessType" label="类型" width="180">
            <template slot-scope="scope">{{ scope.row.businessType | getType}}</template>
          </el-table-column>
          <el-table-column prop="businessName" label="任务名称" width="180"></el-table-column>
          <el-table-column prop="createByName" label="申请人"></el-table-column>
          <el-table-column prop="createDate" label="审批发起时间"></el-table-column>
          <el-table-column prop="updateDate" label="最近修改时间"></el-table-column>
          <el-table-column prop="auditStatus" label="审批状态">
            <template slot-scope="scope">{{ scope.row.applyStatus | getStatus}}</template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="150">
            <template slot-scope="scope">
              <div class="task-btn-box">
                <span class="special" @click="goDetail(scope.row, 2)">
                  <el-tooltip class="item" effect="dark" content="查看详情" placement="top-start">
                    <icon-svg icon-class="chakan" class="whiteness-icon-color" />
                  </el-tooltip>
                </span>
                <span class="disabled" v-if="scope.row.applyStatus !== '2'">
                  <el-tooltip
                    class="item dis forbidden-icon-color"
                    effect="dark"
                    content="撤回"
                    placement="top-start"
                  >
                    <icon-svg icon-class="chehui" />
                  </el-tooltip>
                </span>
                <span
                  class="special"
                  v-else
                  @click.stop="confirmRecallStart(scope.row.businessId,scope.row.businessType)"
                >
                  <el-tooltip class="item" effect="dark" content="撤回" placement="top-start">
                    <icon-svg icon-class="chehui" />
                  </el-tooltip>
                </span>
              </div>

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
          <div slot="empty">
            <div class="blank-page">
              <div class="imgdiv">
                <img src="../../../../static/img/blank-page.png" alt />
              </div>
              <p class="empty-text">暂无我发起的数据</p>
            </div>
          </div>
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
            style="margin-right:15px;cursor: pointer;"
          ></el-pagination>
        </div>
      </el-tab-pane>

      <el-tab-pane label="抄送我的" name="3">
        <el-form
          :inline="true"
          class="demo-form-inline"
          style="padding:0 0 5px 0;margin-bottom: -10px;"
        >
          <el-form-item style="width:10%">
            <el-select placeholder="选择类型" size="medium" v-model="sendData.businessType" clearable>
              <el-option
                :label="type.label"
                :value="type.value"
                v-for="type in taskTypes"
                :key="type.value"
              ></el-option>
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
              ></el-option>
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
          <el-form-item class="item-right overHideMargin">
            <el-button icon="el-icon-search" class="nomal-button" @click="searchSend(1)">查找</el-button>
          </el-form-item>
        </el-form>
        <el-table
          :data="sendList"
          stripe
          style="width: 100%"
          :header-cell-style="{ background: '#f5f5f5' }"
        >
          <el-table-column prop="businessType" label="类型" width="180">
            <template slot-scope="scope">{{ scope.row.businessType | getType}}</template>
          </el-table-column>
          <el-table-column prop="businessName" label="名称" width="180"></el-table-column>
          <el-table-column prop="createByName" label="申请人" width="180"></el-table-column>
          <el-table-column prop="createDate" label="审批发起时间" width="180"></el-table-column>
          <el-table-column prop="updateDate" label="最近修改时间"></el-table-column>
          <el-table-column prop="auditStatus" label="审批状态">
            <template slot-scope="scope">{{ scope.row.applyStatus | getStatus}}</template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <div class="task-btn-box">
                <span class="special" @click="goDetail(scope.row, 3)">
                  <el-tooltip class="item" effect="dark" content="查看详情" placement="top-start">
                    <icon-svg icon-class="chakan" class="whiteness-icon-color"/>
                  </el-tooltip>
                </span>
              </div>
              <!-- <el-button @click="seeSend(scope.row.id)">查看</el-button> -->
              <!-- <el-button type="primary" size="mini" class="seebtn" @click="goDetail(scope.row, 3)">查看</el-button> -->
            </template>
          </el-table-column>
          <div slot="empty">
            <div class="blank-page">
              <div class="imgdiv">
                <img src="../../../../static/img/blank-page.png" alt />
              </div>
              <p class="empty-text">暂无抄送我的数据</p>
            </div>
          </div>
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
            style="margin-right:15px;cursor: pointer;"
          ></el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-dialog center title="撤回确认" :visible.sync="confirmRecallStartDialogVisible" width="20%">
      <span>确定要撤回审批吗？</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="confirmRecallStartDialogVisible = false" size="mini">取 消</el-button>
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
          label: '任务'
        },
        {
          value: '1',
          label: '脚本'
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
      if (val == '0') {
        return '通过'
      } else if (val == '1') {
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
      if (buType == '1') {
        return '脚本'
      } else if (buType == '2') {
        return '任务'
      }
    }
  },
  created () {
    this.searchWait(1)
    this.getUserList()
  },
  methods: {
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
      axios.recallAuditLog(data).then(res => {
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
    // seeSend () {},
    // 获取审批列表
    getList () {
      if (this.pageStates == '0') {
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
      this.searchDataWait.pageStates = 0
      this.searchDataWait.current = val
      axios.getAuditLogList(this.searchDataWait).then(data => {
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
      axios.getAuditLogList(this.searchData)
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
      axios.getAuditLogList(this.startData)
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
      axios.getAuditLogList(this.sendData)
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
    goDetail (event, str) {
      this.$router.push({
        path: '/AutomatedRelease/examineAndApproveDetail',
        query: {
          code: 3,
          businessId: event.businessId,
          businessType: event.businessType,
          type: str,
          plantype: '2',
          logId: event.logId,
          auditStatus: event.auditStatus
            ? event.auditStatus
            : event.applyStatus
              ? event.applyStatus
              : ''
        }
      })
    }
  }
}
</script>

<style scoped>
.panel {
  padding: 10px;
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
  padding: 0 4px;
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
.demo-form-inline /deep/ .overHideMargin {
  margin-right: 0 !important;
}
</style>
