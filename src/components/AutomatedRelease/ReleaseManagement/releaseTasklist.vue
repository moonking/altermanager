<template>
  <div class="cluster-manage">
    <div class="wrapper">
      <div class="operate-bar">
        <el-row :gutter="10">
          <el-col :span="3">
            <el-input
              v-model="name"
              placeholder="请输入发布任务名称"
              sortable
              clearable
            ></el-input>
          </el-col>
          <el-col :span="4">
            <el-input
              v-model="jobName"
              placeholder="请输入任务流水线名称"
              sortable
              clearable
            ></el-input>
          </el-col>
          <el-col :span="3">
            <el-select
              v-model="systemId"
              placeholder="选择所属系统"
              :clearable="true"
            >
              <el-option
                v-for="system in systemList"
                :label="system.name"
                :value="system.systemId"
                :key="system.systemId"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-select
              v-model="level"
              placeholder="请选择优先级"
              :clearable="true"
            >
              <el-option
                v-for="system in priorityList"
                :label="system.name"
                :value="system.level"
                :key="system.level"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-select
              v-model="taskStatus"
              placeholder="请选择发布状态"
              :clearable="true"
            >
              <el-option
                v-for="system in statusList"
                :label="system.name"
                :value="system.systemId"
                :key="system.systemId"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-select
              v-model="taskType"
              placeholder="请选择任务属性"
              :clearable="true"
            >
              <el-option
                v-for="system in attributeList"
                :label="system.name"
                :value="system.systemId"
                :key="system.systemId"
              ></el-option>
            </el-select>
          </el-col>
          <el-col
            :span="5"
            style="margin-top: 5px; text-align: right"
            class="item-right"
          >
            <el-button
              icon="el-icon-search"
              class="nomal-button"
              @click="search"
              >查找</el-button
            >
            <el-dropdown trigger="click">
              <el-button
                type="primary"
                icon="el-icon-plus"
                class="margin-left-btn"
              >
                新增
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <div @click="goAddTask">
                  <el-dropdown-item>部署任务</el-dropdown-item>
                </div>
                <div @click="goAddcreateTask">
                  <el-dropdown-item>构建任务</el-dropdown-item>
                </div>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
          <!-- <el-select @change="goAddTask" placeholder="+新增" v-model="addname" clearable>
              <el-option label="构建发布任务" value="1"></el-option>
              <el-option label="部署发布任务" value="2"></el-option>
          </el-select>-->
        </el-row>
      </div>
      <div class="cluster-list">
        <el-table
          stripe
          :data="tableData"
          style="width: 100%"
          :header-cell-style="{ background: '#f5f5f5' }"
          :expand-row-keys="expands"
          :row-key="getRowKeys"
          @expand-change="handleExpansion"
        >
          <el-table-column type="expand">
            <template slot-scope="scope">
              <ExpandLi
                :manageId="scope.row.manageId"
                @visibal="handleOpenJenkins"
              />
            </template>
          </el-table-column>
          <el-table-column label="发布任务名称" prop="name"></el-table-column>
          <el-table-column
            label="发布任务类型"
            prop="taskType"
            :formatter="formatPurposes"
          ></el-table-column>
          <el-table-column label="业务系统" prop="systemName"></el-table-column>
          <el-table-column label="优先级" min-width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.level === 4">高</span>
              <span v-if="scope.row.level === 1">最低</span>
              <span v-if="scope.row.level === 2">低</span>
              <span v-if="scope.row.level === 3">中</span>
              <span v-if="scope.row.level === 5">最高</span>
              <span v-if="scope.row.level === ''">-</span>
            </template>
          </el-table-column>
          <el-table-column label="执行人" prop="runUsersList"></el-table-column>
          <el-table-column
            label="负责人"
            prop="dutyUsersList"
          ></el-table-column>
          <el-table-column label="发布状态">
            <template slot-scope="scope">
              <span v-if="scope.row.taskStatus == 'FAILURE'" class="error"
                >失败</span
              >
              <span v-if="scope.row.taskStatus == 'NOTEXECUTED'">未发布</span>
              <span v-if="scope.row.taskStatus == 'building'" class="wraning"
                >发布中</span
              >
              <span v-if="scope.row.taskStatus == 'SUCCESS'" class="success"
                >成功</span
              >
              <span v-if="scope.row.taskStatus == 'ABORTED'" class="error"
                >手动结束</span
              >
            </template>
          </el-table-column>
          <!-- <el-table-column label="计划发布时间" prop="planEndTime" v-if="taskType == 1">
          </el-table-column>-->
          <el-table-column label="计划发布时间">
            <template slot-scope="scope">
              <span v-if="scope.row.taskType == 1">-</span>
              <span v-if="scope.row.taskType == 2">{{
                scope.row.planStartTime
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            prop="operate"
            width="255px"
          >
            <template slot-scope="scope">
              <div class="task-btn-box">
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="查看详情"
                  placement="top-start"
                >
                  <span
                    class="special"
                    @click="readJob(scope.row.manageId, scope.row.taskType)"
                  >
                    <icon-svg icon-class="chakan" />
                  </span>
                </el-tooltip>
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="修改"
                  placement="top-start"
                >
                  <span
                    class="special"
                    @click="
                      editJob(
                        scope.row.manageId,
                        scope.row.taskType,
                        scope.row.applyStatus,
                        scope.row.cronExpr
                      )
                    "
                  >
                    <icon-svg icon-class="bianji" />
                  </span>
                </el-tooltip>
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="删除"
                  placement="top-start"
                >
                  <span class="special" @click="deleteJob(scope.row)">
                    <icon-svg icon-class="shanchu" />
                  </span>
                </el-tooltip>
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="一键执行"
                  placement="top-start"
                >
                  <span
                    :class="
                      scope.row.taskStatus !== 'building'
                        ? 'canClick'
                        : 'notClick'
                    "
                    class="special"
                    @click="
                      tostart(
                        scope.row.manageId,
                        scope.row.taskType,
                        scope.row.applyStatus,
                        scope.row.taskStatus
                      )
                    "
                  >
                    <icon-svg
                      v-if="scope.row.taskStatus == 'building'"
                      icon-class="zhihang"
                    />
                    <icon-svg
                      v-else
                      icon-class="zhihang"
                      class="forbidden-icon-color"
                    />
                  </span>
                </el-tooltip>
                <el-tooltip
                  class="item special"
                  effect="dark"
                  content="审批"
                  placement="top-start"
                  v-if="scope.row.taskType === '2'"
                >
                  <span
                    :class="
                      !scope.row.appro && validateBtn(scope.row)
                        ? 'canClick'
                        : 'notClick'
                    "
                    class="special"
                    @click="openApproveDialog(scope.row)"
                  >
                    <icon-svg
                      icon-class="fabu"
                      v-if="!scope.row.appro && validateBtn(scope.row)"
                    />
                    <icon-svg
                      icon-class="fabu"
                      v-else
                      class="icon forbidden-icon-color"
                    />
                  </span>
                </el-tooltip>
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="执行日志"
                  placement="top-start"
                >
                  <span class="special" @click="goTaskLog(scope.row.manageId)">
                    <icon-svg icon-class="cha" />
                  </span>
                </el-tooltip>
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
      <el-dialog title="发起审批" :visible.sync="approveDialog" center>
        <div class="content-wrapper" v-if="hasApprove">
          <span style="margin-right: 20px">审批流程为：</span>
          <UserListSelect :selectedList="approveList" />
        </div>
        <div class="content-wrapper" v-else>
          <p class="font-block">该审批无审批流程，无法发起审批</p>
        </div>
        <div slot="footer" class="dialog-footer">
          <button
            class="cm-btn deep save-btn-margin-special"
            @click="handleApprove"
            v-if="hasApprove"
          >
            发起审批
          </button>
          <button
            class="cm-btn deep save-btn-margin-special"
            @click="goApprove"
            v-else
          >
            添加审批
          </button>
          <button class="cm-btn isoutline" @click="approveDialog = false">
            取 消
          </button>
        </div>
      </el-dialog>
      <el-dialog
        center
        title="删除提示"
        :visible.sync="confirmDeleteDialogVisible"
        width="25%"
      >
        <div style="text-align: center">
          <i class="el-icon-warning"></i> 确定要删除这个发布任务吗？
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button size="medium" @click="confirmDeleteDialogVisible = false"
            >取消</el-button
          >
          <el-button size="medium" type="primary" @click="confirmDelete"
            >确定</el-button
          >
        </div>
      </el-dialog>
      <el-dialog
        center
        title="编辑提示"
        :visible.sync="confirmCancelTimingDialogVisible"
        width="25%"
      >
        <span>
          <i class="el-icon-warning"></i> 该任务已经被定时，请先取消定时
        </span>
        <div slot="footer" class="dialog-footer">
          <el-button type="danger" @click="confirmCancelTiming"
            >去取消</el-button
          >
        </div>
      </el-dialog>
      <!-- 分页 -->
      <div
        class="block"
        style="text-align: center; width: 100%; padding: 92px 0 0"
      >
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currPage"
          :page-size="size"
          :page-sizes="[10, 30, 50]"
          layout="prev, pager, next, sizes, total, jumper"
          :total="total"
          v-if="total"
          style="cursor: pointer"
        ></el-pagination>
      </div>
    </div>
    <!-- jenkinsfile查看 -->
    <el-dialog title="jenkinsFile" :visible.sync="jenkinsVisable" width="30%">
      <span v-html="handleJenkinsFile"></span>
    </el-dialog>
    <!-- 发布任务弹框 -->
    <el-dialog
      :title="'发布' + releaseDialog.data.name"
      :visible.sync="releaseDialog.visible"
      center
      width="660px"
    >
      <div class="dialog-block">
        <div class="dialog-block-label">业务系统：</div>
        <div class="dialog-block-content system-name">
          {{ releaseDialog.data.systemName }}
        </div>
      </div>
      <div class="dialog-block">
        <div class="dialog-block-label">选择制品包：</div>
        <div class="dialog-block-content content-check-package">
          <el-form :model="releaseDialog.form">
            <!-- <el-form-item label="业务系统" prop="system">
              {{releaseDialog.form.systemName}}
              个险业务系统
            </el-form-item>-->
            <div
              class="check-block"
              v-for="pipeline in releaseDialog.data.nodeParamsVo"
              :key="pipeline.jobId"
            >
              <div class="pipeline-name">{{ pipeline.jobName }}</div>
              <el-form-item
                v-for="node in pipeline.actNodeparams"
                :key="node.actNodeId"
                :rules="[
                  { required: true, message: '请选择制品包', trigger: 'blur' },
                ]"
              >
                <span class="node-name">{{ node.actNodeName + '：' }}</span>
                <el-select
                  v-model="releaseDialog.form.systemId"
                  placeholder="请选择制品版本"
                  size="mini"
                >
                  <el-option
                    v-for="version in node.nexusVersion"
                    :label="version"
                    :value="version"
                    :key="version"
                  ></el-option>
                </el-select>
                <span class="package-name">{{ node.applicationName }}</span>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </div>
      <div slot="footer">
        <el-button type="primary">确认</el-button>
        <el-button>取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import UserListSelect from '../ToolsManagement/UserListSelect.vue'
import common from '@/utils/commonjs'
import { websocketurl } from '../../../config'
import axios from '@/api';
import ExpandLi from './ExpandLi'
export default {
  name: 'releaseTasklist',
  data() {
    return {
      isbl: false,
      dutyUsersList: '',
      runUsersList: '',
      clusterId: '',
      systemId: '',
      jobName: '',
      name: '',
      taskStatus: '',
      taskType: '',
      level: '',
      addname: '',
      userList: [],
      systemList: [],
      priorityList: [
        {
          name: '最低',
          level: '1'
        },
        {
          name: '低',
          level: '2'
        },
        {
          name: '中',
          level: '3'
        },
        {
          name: '高',
          level: '4'
        },
        {
          name: '最高',
          level: '5'
        }
      ],

      statusList: [
        {
          name: '未发布',
          systemId: 'null'
        },
        {
          name: '发布中',
          systemId: 'building'
        },
        {
          name: '成功',
          systemId: 'SUCCESS'
        },
        {
          name: '失败',
          systemId: 'FAILURE'
        },
        {
          name: '手动结束',
          systemId: 'ABORTED'
        }
      ],
      attributeList: [
        {
          name: '构建',
          systemId: '1'
        },
        {
          name: '部署',
          systemId: '2'
        }
      ],
      tableData: [],
      expands: [], // 展开行id的数组
      getRowKeys(row) {
        return row.id
      },
      nodeList: [],
      envList: [],

      purposesList: [
        { label: 'UAT', value: '1' },
        { label: 'SIT', value: '2' },
        { label: '灾备', value: '3' }
      ],
      // css
      alignCenterStyle: {
        'text-align': 'center'
      },
      // 分页数据
      page: 1,
      total: 1,
      currPage: 1,
      size: 10,
      clusterDescFormData: {},
      // ??
      clusterDialogVisible: false,
      dialogIsReadOnly: true,
      rules: {
        clusterName: [
          {
            required: true,
            message: '请填写集群编号/集群名称',
            trigger: 'blur'
          }
        ],
        system: [
          { required: true, message: '请选择业务系统', trigger: 'change' }
        ]
      },
      systemParams: '',
      currentId: '',
      hasApprove: false,
      approveDialog: false,
      manageId: '',
      version: '',
      // 确认删除弹框显示控制
      confirmDeleteDialogVisible: false,
      // 确认取消定时任务弹框显示控制
      confirmCancelTimingDialogVisible: false,
      // 待删除任务编号
      currentDeleteItemId: '',
      currentUserId: '',
      task: false,
      currentData: {},
      jenkinsVisable: false,
      jenkinsFile: '', // 存储jenkinsfile
      releaseDialog: {
        visible: false,
        data: {},
        form: {}
      },
      searchLog: {
        current: 1,
        size: 10,
        manageId: ''
      }
    }
  },
  components: {
    UserListSelect,
    ExpandLi
  },
  computed: {
    handleJenkinsFile() {
      if (this.jenkinsFile) {
        if (this.jenkinsFile === '-') {
          return '暂无jenkinsFile信息'
        } else {
          return this.jenkinsFile
        }
      }
    }
  },
  created() {
    this.currentUserId = localStorage.getItem('userId')
    this.getAllUsersList()
    this.getSystemList()
    this.getclusterList()
    this.handdleMsg()
  },
  mounted() {
    this.init()
  },
  beforeDestroy() {
    this.socket.onclose()
  },
  methods: {
    init: function () {
      if (typeof WebSocket === 'undefined') {
        alert('您的浏览器不支持socket')
      } else {
        // 实例化socket
        this.socket = new WebSocket(websocketurl)
        // 监听socket连接
        this.socket.onopen = this.open
        // 监听socket错误信息
        this.socket.onerror = this.error
        // 监听socket消息
        this.socket.onmessage = this.getMessage
        this.socket.onclose = this.close
      }
    },
    open: function (msg) {
      console.log('websocket已连接')
      // this.getMessage()
    },
    error: function () {
      console.log('连接错误')
    },
    getMessage: function (msg) {
      console.log('websocket start')
      let result = msg.data
      result = result ? JSON.parse(result) : ''
      if (result.length) {
        this.tableData.forEach((item, index) => {
          result.forEach(statusItem => {
            if (statusItem.manageId === item.manageId) {
              this.getclusterList()
            }
          })
        })
      }
    },
    send: function (params) {
      // this.socket.send(params)
    },
    close: function () {
      console.log('socket已经关闭')
    },

    // 查看执行日志
    goTaskLog(id) {
      this.$router.push({
        path: '/AutomatedRelease/releaseLog',
        query: {
          code: 3,
          id: id
        }
      })
    },
    // 判断并控制按钮的是否可点
    validateBtn(val) {
      let bool = false
      if (val.isUser) {
        if (val.applyStatus === '' || val.applyStatus === '3') {
          bool = true
        } else {
          bool = false
        }
      } else {
        bool = false
      }
      return bool
    },
    // 选择提示信息
    selectTip(val) {
      let str = ''
      if (val.applyStatus === '0') {
        str = '您已发起了审批，不可重复提交'
      } else if (val.applyStatus === '1') {
        str = '您发起的审批未通过，请重新编辑再发起审批'
      } else if (val.applyStatus === '2') {
        str = '您已发起了审批，不可重复提交'
      } else {
        if (!val.isUser) {
          str = '当前用户不是创建人，无法发起'
        }
      }
      return str
    },
    // 获取系统
    getSystemList() {
      let name = ''
      axios.getcigroupSystablist(name).then(res => {
        if (res.data.success) {
          this.systemList = res.data.data.result
        }
      })
    },

    // 查找
    search() {
      this.getclusterList()
    },
    // 获取用户列表
    getAllUsersList() {
      axios.userList({
        condition: '',
        current: 1,
        online: false,
        roleIds: [],
        size: 20,
        userStatus: ''
      }).then(res => {
        if (res.data.code === 200) {
          this.userList = res.data.data.result.records
          this.getclusterList(this.userList)
        }
      })
    },
    // 获取发布管理列表
    getclusterList(userList) {
      let data = {
        currPage: this.currPage,
        pageSize: this.size,
        name: this.name,
        systemId: this.systemId,
        jobName: this.jobName,
        level: parseInt(this.level),
        taskStatus: this.taskStatus,
        taskType: this.taskType
      }
      axios.getReleaseList(data).then(res => {
        // const userList = userList;
        if (res.data.code === 200) {
          this.tableData = res.data.data.rows
          let currentUser = localStorage.getItem('userId')
          this.total = parseInt(res.data.data.totalRows)
          this.tableData.forEach((item, index) => {
            item.id = index

            if (currentUser === item.createBy) {
              item.isUser = true
            } else {
              item.isUser = false
            }

            this.runUsersList = ''
            this.dutyUsersList = ''
            if (typeof item.runUsers === 'string') {
              item.runUsers = common.evil(item.runUsers)
            }
            if (typeof item.dutyUsers === 'string') {
              item.dutyUsers = common.evil(item.dutyUsers)
            }
            if (item.runUsers && item.runUsers.length > 0) {
              item.runUsers.forEach(a => {
                this.userList.forEach(user => {
                  if (a.userId === user.userId) {
                    a.name = user.name
                    //  a.photo = user.photo;
                  }
                })
                this.runUsersList += a.name + ' '
              })
              item.runUsersList = this.runUsersList
            }
            if (item.dutyUsers && item.dutyUsers.length > 0) {
              item.dutyUsers.forEach(a => {
                this.userList.forEach(user => {
                  if (a.userId === user.userId) {
                    a.name = user.name
                    //  a.photo = user.photo;
                  }
                })
                this.dutyUsersList += a.name + ' '
              })
              item.dutyUsersList = this.dutyUsersList
            }
          })
        }
      })
    },
    // 编辑
    editJob(manageId, taskType, status, cronExpr) {
      console.log(manageId, taskType, status, cronExpr)
      if (cronExpr !== '') {
        this.confirmCancelTimingDialogVisible = true
        return
      }
      if (status === '2' && taskType === '2') {
        this.$notify({
          type: 'error',
          message: '该任务正在审批，不能编辑，需先撤回才能操作'
        })
      } else {
        if (taskType === '1') {
          this.$router.push({
            path: '/AutomatedRelease/BuildReleaseTask/update',
            query: {
              code: 3,
              id: manageId
            }
          })
        } else if (taskType === '2') {
          this.$router.push({
            path: '/AutomatedRelease/DeployReleaseTask/update',
            query: {
              code: 3,
              id: manageId
            }
          })
        }
      }
    },
    // 新增
    goAddcreateTask() {
      this.$router.push({
        path: '/AutomatedRelease/BuildReleaseTask/create',
        query: {
          code: 3
        }
      })
    },
    goAddTask() {
      this.$router.push({
        path: '/AutomatedRelease/DeployReleaseTask/create',
        query: {
          code: 3
        }
      })
    },
    // 查看发布任务
    readJob(manageId, taskType) {
      if (taskType === '1') {
        this.$router.push({
          path: '/AutomatedRelease/BuildReleaseTask/read',
          query: {
            code: 3,
            id: manageId
          }
        })
      } else if (taskType === '2') {
        this.$router.push({
          path: '/AutomatedRelease/DeployReleaseTask/read',
          query: {
            code: 3,
            id: manageId
          }
        })
      }
    },
    // 删除
    deleteJob(data) {
      if (data.applyStatus === '2' && data.taskType === '2') {
        this.$notify({
          type: 'error',
          message: '该任务正在审批，不能删除，需先撤回操作'
        })
      } else {
        this.confirmDeleteDialogVisible = true
        this.currentDeleteItemId = data.manageId
      }
      if (data.taskStatus === 'building') {
        this.$notify({
          type: 'error',
          message: '该任务正在发布，不能删除'
        })
      }
    },
    // 确认删除
    confirmDelete() {
      const id = this.currentDeleteItemId
      axios.deleteReleaseTask(id).then(res => {
        if (res.data.success) {
          this.$notify.success({
            title: '提示',
            message: '删除成功！'
          })
          this.getclusterList()
        } else {
          this.$notify.error({
            title: '提示',
            message: res.data.message
          })
        }
      })
      this.confirmDeleteDialogVisible = false
    },
    confirmCancelTiming() {
      this.$router.push({
        path: '/AutomatedRelease/crontabList',
        query: {
          code: 3
        }
      })
    },
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
              if (item.manageId === socketdata.manageId) {
                _this.$set(_this.tableData[index], 'taskStatus', 'FAILURE')
              }
            })
          }
        }
      }
    },
    // 一件执行
    tostart(id, type, status, taskStatus) {
      if (taskStatus === 'building') {
        this.$notify({
          type: 'error',
          message: '该任务正在发布，不可操作!'
        })
        return
      }
      if (type === '2' && status === '0') {
        let startId = id
        if (this.isbl) {
          this.$notify({
            type: 'warning',
            message: '请勿重复提交！'
          })
          return
        }
        this.isbl = true
        setTimeout(() => {
          this.isbl = false
        }, 500)
        axios.releaseTasktoStart(startId).then(res => {
          if (res.data.code === 200) {
            this.$notify.success({
              title: '提示',
              message: '请求成功！'
            })
            this.searchLog.manageId = id
            axios.releaseLog(this.searchLog)
              .then(result => {
                if (result.data.code === 200) {
                  this.$router.push({
                    path: '/AutomatedRelease/logDetail',
                    query: {
                      manageId: id,
                      hisId: result.data.data.log.records[0].hisId,
                      code: 3,
                      type: 1,
                      plantype: 1
                    }
                  })
                }
              })
              .catch(err => {
                console.log(err)
              })
          } else {
            this.$notify({
              type: 'error',
              message: res.data.message
            })
          }
        })
      } else if (type !== '1') {
        this.$notify({
          type: 'error',
          message: '部署任务只有审核通过才可以一键执行'
        })
      }
      if (type === '1') {
        let startId = id
        // this.releaseDialog.visible = true
        axios.releaseTasktoStart(startId).then(res => {
          if (res.data.code === 200) {
            this.$notify.success({
              title: '提示',
              message: '请求成功！'
            })
            this.getclusterList()
          } else {
            this.$notify({
              type: 'error',
              message: res.data.message
            })
          }
        })
      }
    },
    // 查看审批人的信息
    openApproveDialog(tool) {
      this.currentData = tool
      let str = this.selectTip(tool)
      if (
        tool.applyStatus === '0' ||
        tool.applyStatus === '1' ||
        tool.applyStatus === '2'
      ) {
        this.$set(tool, 'appro', true)
        this.$notify({
          type: 'error',
          message: str
        })
      } else {
        if (tool.createBy === this.currentUserId) {
          this.$set(tool, 'appro', false)
          if (tool) {
            this.manageId = tool.manageId
            axios.manageApprove(tool.manageId).then(res => {
              this.approveDialog = true
              this.approvalids = true
              if (res.data.code === 200) {
                let data = JSON.parse(res.data.data.approvalids)
                this.version = res.data.data.version
                data.forEach(item => {
                  this.userList.forEach(user => {
                    if (item.userId === user.userId) {
                      item.name = user.name
                      item.photo = user.photo
                    }
                  })
                })
                this.approveList = data
                this.hasApprove = true
              } else {
                this.hasApprove = false
              }
            })
          } else {
            this.$set(tool, 'appro', false)
            this.$notify({
              type: 'error',
              message: '未获取到发布管理ID'
            })
          }
        } else {
          this.$notify({
            title: '提醒',
            message: str,
            type: 'warning'
          })
        }
      }
    },
    handleApprove() {
      let params = {
        businessType: 2,
        businessId: this.manageId,
        version: this.version
      }
      console.log(params)
      axios.auditLogaAdd(params).then(res => {
        if (res.data.success) {
          this.approveDialog = false
          this.$notify({
            type: 'success',
            message: '审批提交成功'
          })
          this.hasApprove = false
          this.approveList = []
          this.getclusterList(this.userList)
        } else {
          this.$notify({
            type: 'error',
            message: res.data.message
          })
        }
      })
    },
    // 跳转到编辑页添加审批人
    goApprove() {
      // console.log(this.taskType )
      this.editJob(
        this.currentData.manageId,
        this.currentData.taskType,
        this.currentData.applyStatus,
        this.currentData.cronExpr
      )
      // this.$router.push({
      //     path: '/AutomatedRelease/BuildReleaseTask/update',
      //     query: {
      //       code: 3,
      //       id: this.manageId
      //     }
      //   });
      // if (this.taskType === '1') {
      //   this.$router.push({
      //     path: '/AutomatedRelease/BuildReleaseTask/update',
      //     query: {
      //       code: 3,
      //       id: this.manageId
      //     }
      //   });
      // } else if (this.taskType === '2') {
      //   this.$router.push({
      //     path: '/AutomatedRelease/DeployReleaseTask/update',
      //     query: {
      //       code: 3,
      //       id: this.manageId
      //     }
      //   });
      // }
    },
    handleSizeChange(val) {
      this.size = val
      this.getclusterList()
    },
    handleCurrentChange(val) {
      this.currPage = val
      this.getclusterList()
    },
    handleWatch(row) {
      axios.clusterDetail(row.clusterId).then(res => {
        if (res.status === 200) {
          // 将 row中数据映射到对话框中
          this.clusterDescFormData = row
          // 显示dialog
          this.dialogIsReadOnly = true
          this.clusterDialogVisible = true
        }
      })
    },
    closeDialog() {
      this.clusterDialogVisible = false
    },
    handleEdit(row) {
      this.$router.push({
        path: '/AutomatedRelease/ResourceManagement/NewCluster',
        query: {
          code: 3,
          clusterId: row.clusterId
        }
      })
    },
    // 发起审批
    dialogCloseHandle() {
      this.$refs.clusterForm.clearValidate()
    },
    // 跳转查看执行
    logDetailBtn(id, di, jenkinsId) {
      this.$router.push({
        path: '/AutomatedRelease/logDetail',
        query: {
          code: 3,
          builedId: id,
          jobId: di,
          type: '1',
          plantype: '2',
          jenkinsId: jenkinsId
        }
      })
    },
    formatPurposes: function (row, column) {
      return row.taskType === '2' ? '部署' : '构建'
    },
    getRunPhase(item) {
      let result = []
      try {
        item.stages.forEach(node => {
          result.push(node.name)
        })
      } catch (err) {
        result = []
      }
      return result.join(',')
    },
    getRunStatus(item) {
      let result = ''
      switch (item) {
        case 'FAILURE':
          result = '失败'
          break
        case 'SUCCESS':
          result = '成功'
          break
        case 'building':
          result = '发布中'
          break
        default:
          result = '未发布'
          break
      }
      return result
    },
    // jenkins弹框控制
    handleOpenJenkins(file) {
      this.jenkinsVisable = true
      let str = file.replace(/\n/g, '<br />')
      let nstr = str.replace(/\t/g, '&nbsp;')
      this.jenkinsFile = nstr
    },
    // 根据执行状态改变颜色
    filterStatus(item) {
      let result = ''
      switch (item) {
        case 'FAILURE':
          result = 'error-tag'
          break
        case 'SUCCESS':
          result = 'success-tag'
          break
        case 'building':
          result = 'wraning-tag'
          break
        default:
          result = ''
          break
      }
      return result
    },
    // 列表展开显示流水线数据
    handleExpansion(row, expanded) {
      // if (expanded.length > 0) {
      // }
      // row.isOpen = !row.isOpen
    }
  }
}
</script>
<style scoped>
.cluster-manage {
  width: 100%;
  padding: 10px 0;
  box-sizing: border-box;
}
.cluster-list {
  padding: 0 5px;
}
.cluster-manage .wrapper {
  width: 100%;
}
.wrapper .operate-bar {
  margin-bottom: 20px;
  padding-left: 5px;
  padding-right: 5px;
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
  margin: 5px 0;
}
.task-btn-box span.special {
  /* border: 1px solid #777777; */
  cursor: pointer;
}
/* .task-btn-box span.special > img {
  width: 12px;
  height: 12px;
} */
.task-btn-box span img {
  height: 12px;
  /* margin-top: 2px; */
  padding: 5px 8px 6px 8px;
  margin-bottom: -6px;
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
/* .task-btn-box span.special {
} */
/* .task-btn-box span img {
  height: 12px;
  margin-top: 2px;
} */
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
.task-btn-box span.special:hover {
  background: #0066ff;
  /* color:#fff!important; */
}
.disabled {
  background: #e4e7ed !important;
  cursor: not-allowed !important;
  padding: 0 !important;
  margin: 0 !important;
}
.addbtn {
  position: absolute;
  right: 10px;
  top: 0;

  /* background-color: #0066ff; */
  /* color: #fff; */
  /* float: right; */
}
/* .titlesearch {
  margin-top: -5px;
} */
.select {
  background-color: #fff;
}
.canClick {
  cursor: pointer !important;
}
.notClick {
  cursor: not-allowed !important;
  background-color: #f0f0f0 !important;
  border: 1px solid #666 !important;
}
.notClick:hover {
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
.error {
  color: #f10;
}
.wraning {
  color: #e6a23c;
}
.success {
  color: #67c23a;
}
/*设置展开行的背景色*/
.el-table /deep/ .el-table__expanded-cell {
  background: #f5f7fa !important;
}
.dialog-block {
  display: flex;
  margin-bottom: 20px;
}
.dialog-block-label {
  width: 100px;
  /* margin-right: 16px; */
}
.system-name {
  font-size: 16px;
  font-weight: bold;
}
.dialog-block-content {
  flex-grow: 1;
}
/* .content-check-package {
  padding: 0 20px;
} */
.check-block {
  width: 100%;
  border-bottom: 1px solid #ddd;
  padding-bottom: 20px;
  margin-bottom: 20px;
}
.check-block:last-child {
  border-bottom: none;
}
.check-block:hover {
  /* box-shadow: 0 0 10px 0 #ddd; */
}
.check-block .pipeline-name {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
}
.check-block .node-name {
  display: inline-block;
  width: 60px;
  margin-right: 10px;
  color: #999;

  /* 超出省略 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: top;
}
.check-block .package-name {
  display: inline-block;
  max-width: 200px;
  margin-left: 20px;
  color: #999;
}
.check-block .el-form-item {
  margin-bottom: 10px;
}
</style>
