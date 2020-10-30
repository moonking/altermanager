<template>
  <div class="operation-work-order">
    <div class="top-bar clear-fix">
      <div class="bar-left">
        <el-form :inline="true" :model="searchForm" class="demo-form-inline">
          <el-form-item>
            <el-input
              v-model="searchForm.name"
              placeholder="请输入工单名称"
              :style="{width: '180px'}"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="searchForm.applyStatus"
              clearable
              placeholder="选择审批状态"
              :style="{width: '180px'}"
            >
              <el-option
                v-for="item in approveStatusList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="searchForm.runStatus"
              clearable
              placeholder="选择工单状态"
              :style="{width: '180px'}"
            >
              <el-option
                v-for="item in workOrderStatusList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="searchForm.environmentId"
              clearable
              placeholder="选择所属环境"
              :style="{width: '180px'}"
            >
              <el-option
                v-for="item in environments"
                :key="item.environmentId"
                :label="item.name"
                :value="item.environmentId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="bar-right overHideMargin">
            <el-button icon="el-icon-search" class="nomal-button" @click="searchWorkOrders">查找</el-button>
            <el-button
              type="primary"
              icon="el-icon-plus"
              class="margin-left-btn"
              @click.prevent="addWorkOrder"
            >新增</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="table-content">
      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        empty-text="暂无数据"
        :header-cell-style="{ background: '#f5f5f5' }"
        @row-click="lookWorkOrder"
      >
        <el-table-column prop="name" label="工单名称" width="130"></el-table-column>
        <el-table-column prop="environmentName" label="所属环境" width="130"></el-table-column>
        <el-table-column prop="planStartTime" label="计划开始时间" width="160"></el-table-column>
        <el-table-column label="执行人" width="120">
          <template
            slot-scope="scope"
          >{{mapper(userList, 'userId', 'name')[scope.row.runUser] || ''}}</template>
        </el-table-column>
        <el-table-column prop="applyStatus" label="审批状态" width="120">
          <template
            slot-scope="scope"
          >{{mapper(approveStatusList, 'value', 'label')[scope.row.applyStatus] || ''}}</template>
        </el-table-column>
        <el-table-column prop="runStatus" label="工单状态" width="120">
          <template
            slot-scope="scope"
          >{{mapper(workOrderStatusList, 'value', 'label')[scope.row.runStatus] || ''}}</template>
        </el-table-column>
        <el-table-column label="实际完成时间" width="140">
          <template slot-scope="scope">{{scope.row.jobEndTime || '-' }}</template>
        </el-table-column>
        <el-table-column prop="address" label="操作" align="center">
          <template slot-scope="scope">
            <div class="btn-box">
              <span
                :class="['', {notClick:  !canExecute(scope.row)}]"
                @click.stop="executeWorkOrder(scope.row)"
              >执行</span>
              <span
                :class="['', {notClick: isApplyDisabled(scope.row.applyStatus)}]"
                @click.stop="approvalWorkOrder(scope.row)"
              >审批</span>
              <span @click.stop="click()">
                <el-dropdown trigger="click">
                  <span class="el-dropdown-link">更多</span>
                  <el-dropdown-menu slot="dropdown">
                    <!-- <el-dropdown-item  @click.native="lookWorkOrder(scope.row.jobId)">查看</el-dropdown-item> -->
                    <el-dropdown-item
                      @click.native="updateWorkOrder(scope.row.jobId, scope.row.applyStatus)"
                    >编辑</el-dropdown-item>
                    <el-dropdown-item @click.native="deleteWorkOrder(scope.row)">删除</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pager">
        <el-pagination
          @size-change="handlePaginationChange"
          @current-change="handlePaginationChange"
          :current-page.sync="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size.sync="pageSize"
          layout="prev, pager, next, sizes, total, jumper"
          :total="total"
        />
      </div>
    </div>
    <el-dialog :visible.sync="approveDialogVisible" title="发起审批" center>
      <div :style="{textAlign: 'center'}">该任务无审批流程，无法发起审批！</div>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          class="save-btn-margin-special"
          @click="updateWorkOrder(currentJob.jobId)"
        >立即添加</el-button>
        <el-button @click="cancelAddApproalUser">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="approveConfirmDialogVisible" title="发起审批" center>
      <div :style="{textAlign: 'center'}">
        <div class="dialog-wrapper">
          <span :style="{marginRight: '20px'}">审批流程:</span>
          <user-list-select :selectedList="getApproveList"></user-list-select>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary " class="save-btn-margin-special" @click="confirmApprove()">发起审批</el-button>
        <el-button @click="cancelApprove">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="timeoutDialogVisible" title="提示" center>
      <div :style="{textAlign: 'center'}">本任务设置的预计结束时间为：2019-04-04 07：00，若现在执行将于超时完成，请重新设置时间</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="timeoutDialogVisible = false" class="save-btn-margin-special">取 消</el-button>
        <el-button type="primary" @click="timeoutDialogVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="timebeforeDialogVisible" title="提示" center>
      <div :style="{textAlign: 'center'}">{{errorTimeText}}</div>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          class="save-btn-margin-special"
          @click="timebeforeDialogVisible = false"
        >确 定</el-button>
        <el-button @click="timebeforeDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog center :visible.sync="confirmDeleteDialogVisible" title="提示" width="300px">
      <div :style="{textAlign: 'center'}">
        <i class="el-icon-warning"></i>&nbsp;&nbsp;确定要删除该工单吗？
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          class="save-btn-margin-special"
          size="mini"
          @click="confirmDelete"
        >确 定</el-button>
        <el-button size="mini" @click="cancelDelete">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from '@/api';
import UserListSelect from '../../AutomatedRelease/ToolsManagement/UserListSelect'
export default {
  components: {
    UserListSelect
  },
  data () {
    return {
      // 搜索栏表单
      searchForm: {},
      // 环境列表
      environments: [],
      // 表格数据
      tableData: [],
      // 无审批流程对话框控制
      approveDialogVisible: false,
      // 发起审批确认对话框
      approveConfirmDialogVisible: false,
      // 超时提示对话框控制
      timeoutDialogVisible: false,
      // 时间未到提示对话框控制
      timebeforeDialogVisible: false,
      // 确认删除对话框控制
      confirmDeleteDialogVisible: false,
      // 非法时间提示文字
      errorTimeText: '',
      // 当前处理工单
      currentJob: '',
      // 分页组件相关属性
      currentPage: 1,
      pageSize: 10,
      total: 0,
      // 用户列表
      userList: [],
      // 审批状态列表
      approveStatusList: [{
        value: '0',
        label: '审批通过'
      }, {
        value: '4',
        label: '未审批'
      }, {
        value: '1',
        label: '审批失败'
      }, {
        value: '2',
        label: '审批中'
      }, {
        value: '3',
        label: '审批撤回'
      }],
      // 工单状态列表
      workOrderStatusList: [{
        value: 'NOTEXECUTED',
        label: '未执行'
      }, {
        value: 'building',
        label: '执行中'
      }, {
        value: 'SUCCESS',
        label: '执行成功'
      }, {
        value: 'FAILURE',
        label: '执行失败'
      }, {
        value: 'ABORTED',
        label: '手动结束'
      }]
    }
  },
  methods: {
    click () {

    },
    // 获取所有工单
    getAllWorkOrderList () {
      this.getWorkOrders()
        .then(this.responseHandle)
    },
    // 分页组件currentPage和pageSize改变时触发
    handlePaginationChange () {
      this.searchWorkOrders(this.currentPage)
    },
    /**
     * 依据搜索栏和分页组件数据条件搜索工单
     * @param {string} currentPage 指定搜索第几页,不指定时搜索第一页
     */
    searchWorkOrders (currentPage) {
      if (!(typeof currentPage === 'string' ||
        typeof currentPage === 'number')) {
        currentPage = 1
      }
      const form = this.searchForm
      let condition = {
        name: form.name || '',
        applyStatus: form.applyStatus || '5',
        runStatus: form.runStatus || '',
        environmentId: form.environmentId || '',
        current: currentPage,
        size: this.pageSize
      }
      this.getWorkOrders(condition)
        .then(this.responseHandle)
    },
    /**
     * 根据条件从后台获取工单列表
     * @param {string} condition 从后台获取工单数据时的查询条件
     * @return {Promise} 返回一个Promise对象, 包含后台响应数据
     */
    getWorkOrders (condition) {
      if (!condition) {
        condition = {
          name: '',
          applyStatus: '5',
          runStatus: '',
          environmentId: '',
          current: '1',
          size: '10'
        }
      }
      if (condition.applyStatus === '4') {
        condition.applyStatus = ''
      }
      return axios.getWorkOrderList(condition)
    },
    /**
     * 将数组映射为指定键值对map
     * @param {Array} list 待映射数组
     * @param {string} key 选取数组对象中需要映射的键
     * @param {string} value 可选，选区数组对象中需要映射的值，没有传入时value为整个对象
     * @return {Object} 返回映射后的对象
     */
    mapper (list, key, value) {
      let map = {}
      if (list && list.length) {
        for (let i = 0; i < list.length; i++) {
          const item = list[i]
          let mappingKey = item[key]
          let mappingValue = value ? item[value] : item
          map[mappingKey] = mappingValue
        }
      }
      return map
    },
    // 后台响应处理
    responseHandle (res) {
      if (res.data.success) {
        const total = res.data.data.total
        let data = res.data.data.records
        if (total === '') return
        this.total = parseInt(total)
        for (let i = 0; i < data.length; i++) {
          if (data[i].applyStatus === '') {
            data[i].applyStatus = '4'
          }
        }
        this.tableData = data
      } else {
        this.$notify.error({
          title: '提示',
          message: res.data.message ? res.data.message : '数据请求失败'
        })
      }
    },
    // 新增工单
    addWorkOrder () {
      this.goWorkOrderInfo({
        mode: 'create'
      })
    },
    // 删除工单
    deleteWorkOrder (job) {
      if (job.applyStatus === '2') {
        this.$notify.error({
          title: '提示',
          message: '不能删除正在审批中的工单！'
        })
        return
      }
      this.confirmDeleteDialogVisible = true
      this.currentJob = job
    },
    // 确认删除工单
    confirmDelete () {
      if (this.currentJob.jobId === '') {
        return
      }
      axios.deleteWorkOrder(this.currentJob.jobId)
        .then(res => {
          if (res.data.success) {
            this.getAllWorkOrderList()
            this.$notify.success({
              title: '提示',
              message: '删除成功!'
            })
          } else {
            this.$notify.error({
              title: '提示',
              message: res.data.message ? res.data.message : '删除失败！'
            })
          }
        })
      this.confirmDeleteDialogVisible = false
    },
    // 取消删除工单
    cancelDelete () {
      this.confirmDeleteDialogVisible = false
      this.currentJob = {}
    },
    // 查看工单
    lookWorkOrder (row) {
      if (row.jobId !== '') {
        this.goWorkOrderInfo({
          mode: 'read',
          workOrderId: row.jobId,
          key: 'detail'
        })
      }
    },
    // 修改工单
    updateWorkOrder (id, applyStatus) {
      if (applyStatus === '2') {
        this.$notify.error({
          title: '提示',
          message: '不能编辑正在审批中的工单！'
        })
        return
      }
      if (id !== '') {
        this.goWorkOrderInfo({
          mode: 'update',
          workOrderId: id,
          key: 'edit'
        })
      }
    },
    goWorkOrderInfo (query) {
      this.$router.push({
        path: '/AutomaticOperation/WorkOrderInfo',
        query: {
          code: query.code || '4',
          mode: query.mode || 'create',
          workOrderId: query.workOrderId || '',
          key: query.key
        }
      })
    },
    // 获取所有待选菜单列表信息
    getAllMenu () {
      return Promise.all([axios.userList({
        condition: '',
        current: 1,
        online: false,
        roleIds: [],
        size: 10000,
        userStatus: ''
      }), axios.envtablist()])
    },
    // 构建时请求数据转换
    buildRequestTransform (data) {
      const nodeParams = data.jobNodeparams || []
      let result = []
      if (nodeParams.length <= 0) {
        return
      }
      for (let i = 0; i < nodeParams.length; i++) {
        let obj = {
          actNodeId: nodeParams[i].actNodeId,
          businessId: data.jobId,
          businessName: data.name
        }
        result.push(obj)
      }
      return result
    },
    // 执行工单
    executeWorkOrder (workOrder) {
      if (workOrder.isExecuted) {
        return
      }
      workOrder.isExecuted = true
      // if
      if (!(this.excuteInfoValidte(workOrder))) {
        return
      }
      axios.executeWorkflow({
        businessType: '2',
        businessId: workOrder.jobId
      }).then(res => {
        if (res.data.status && res.data.status.success) {
          this.$router.push({
            path: '/AutomaticOperation/ExecuteWorkOrder',
            query: {
              code: 4,
              logId: res.data.logId
            }
          })
        } else {
          this.$notify({
            title: '错误',
            message: res.data.message,
            type: 'error'
          })
          // this.getpagepipeline()
        }
      })
    },
    excuteInfoValidte (workOrder) {
      const startTime = workOrder.planStartTime ? new Date(workOrder.planStartTime).getTime() : 0
      const endTime = workOrder.planEndTime ? new Date(workOrder.planEndTime).getTime() : 0
      const duration = workOrder.estDuration * 60000
      const current = new Date().getTime()
      let result = true
      // 未审批通过和已执行完成的不能执行
      if (workOrder.applyStatus !== '0') {
        this.errorTimeText = '审批未通过的工单不可执行'
        this.timebeforeDialogVisible = true
        result = false
        return
      }
      if (current < startTime) {
        this.errorTimeText = '本任务的计划开始时间未到，不可手动执行'
        this.timebeforeDialogVisible = true
        result = false
      } else if (current > endTime) {
        this.errorTimeText = '计划结束时间已到，不可执行'
        this.timebeforeDialogVisible = true
        result = false
      }
      if (duration > (endTime - current)) {
        this.errorTimeText = '本任务设置的预计结束时间为：' + workOrder.planEndTime + '，若现在执行将于超时完成，请重新设置时间'
        this.timebeforeDialogVisible = true
        result = false
      }
      return result
    },
    // 工单发起审批
    approvalWorkOrder (job) {
      const status = job.applyStatus
      if (this.isApplyDisabled(status)) {
        let msg = ''
        if (status === '0' || status === '2') msg = '您已发起了审批，不可重复提交'
        if (status === '1') msg = '您发起的审批未通过，请重新编辑再发起审批'
        this.$notify.error({
          title: '提示',
          message: msg
        })
        return
      }
      this.currentJob = job
      // 查看是否有审批流程， 没有则弹出对话框引导用户去添加审批人
      if (job.approvalids === '' || JSON.parse(job.approvalids).length === 0) {
        this.approveDialogVisible = true
        return
      }
      this.approveConfirmDialogVisible = true
    },
    confirmApprove () {
      const job = this.currentJob
      axios.OpsAuditLogaAdd({
        businessId: job.jobId,
        businessType: 3,
        version: job.jobVersion
      }).then(res => {
        if (res.data.success) {
          this.getAllWorkOrderList()
          this.$notify.success({
            title: '提示',
            message: '发起审批成功！'
          })
        }
      })
      this.approveConfirmDialogVisible = false
    },
    // 取消发起审批
    cancelApprove () {
      this.approveConfirmDialogVisible = false
      this.currentJob = {}
    },
    // 取消添加审批流程
    cancelAddApproalUser () {
      this.currentJob = {}
      this.approveDialogVisible = false
    },
    // 判断能否发起审批
    isApplyDisabled (applyStatus) {
      if (applyStatus === '4' || applyStatus === '3') {
        return false
      }
      return true
    },
    // 判断工单能否执行
    canExecute (workOrder) {
      if (workOrder.applyStatus === '0' && workOrder.applyStatus === workOrder.runLimit) {
        return true
      }
      return false
    },
    // 根据用户id获取用户所有信息
    getUserById (list) {
      let result = []
      const users = this.userList
      if (list && list.length) {
        for (let i = 0; i < list.length; i++) {
          let id = list[i].userId
          for (let j = 0; j < users.length; j++) {
            if (id === users[j].userId) {
              result.push(users[j])
            }
          }
        }
      }
      return result
    }
  },
  computed: {
    // 根据currentJob获取其中审批人列表信息
    getApproveList () {
      let result = []
      let approvalids = this.currentJob.approvalids
      if (approvalids && approvalids !== '') {
        result = JSON.parse(approvalids)
      }
      return this.getUserById(result)
    }
  },
  created () {
    this.getAllMenu()
      .then(res => {
        // 用户列表
        if (res[0].data.success) {
          this.userList = res[0].data.data.result.records
          // 工单列表
          this.getAllWorkOrderList()
        } else {
          this.$notify.error({
            title: '提示',
            message: res.data.messge || '用户列表获取失败'
          })
        }
        // 环境下拉选项列表
        if (res[1].data.success) {
          this.environments = res[1].data.data.result
        }
      })
  }
}
</script>
<style scoped>
.operation-work-order {
  padding-left: 10px;
  padding-top: 10px;
}
.bar-right {
  float: right;
}
.disabled {
  background: #e4e7ed !important;
  cursor: not-allowed !important;
  padding: 0 !important;
  margin: 0 !important;
}
.addbtn {
  position: absolute;
  right: 0px;
  float: right;
}
.select {
  background-color: #fff;
}
.addbutton {
  background-color: #0280ff !important;
}
.canClick {
  cursor: pointer !important;
}
.notClick {
  cursor: not-allowed !important;
  color: #c6c6c6 !important;
  /* background-color: #F0F0F0 !important; */
  /* border: 1px solid #666 !important; */
}
/* .notClick:hover{
  background-color: rgb(221, 221, 221) !important;
} */
.search-btn {
  border: 1px solid #666;
  background-color: #fff;
  text-align: center;
  color: #666;
  margin-right: 20px;
}
.search-btn:hover {
  border: 1px solid #0066ff;
  background-color: #0066ff;
  color: #fff;
}
.add-btn {
  color: #fff;
  background-color: #0066ff;
}
.add-btn:hover {
  background-color: #428dff;
}
.pager {
  margin: 30px auto;
  text-align: center;
}
.dialog-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
/* .btn-box{
  margin-right: 50px;
} */
.btn-box span {
  margin: 0 5px;
  cursor: pointer;
}
.btn-box span:hover {
  color: #0066ff;
}
.demo-form-inline /deep/ .overHideMargin {
  margin-right: 0 !important;
}
.el-pagination {
}
</style>
