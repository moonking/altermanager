<template>
  <div class="add-release-task">
    <div class="container refreshContainer aibms-color-bg non-shadow non-border">
      <div class="base-info">
        <div class="item-block-title paddingTop" @click="switchBlock(1)">
          <div class="item-block-title-mark"></div>
          <span class="item-block-title-font">基本信息</span>
          <i
            class="icons el-icon-arrow-right"
            :style="{transform: blockSwitch[1] ? 'rotate(90deg)' : 'rotate(0)'}"
          ></i>
        </div>
        <div
          class="block-content item-block-content"
          :style="{height: blockSwitch[1] ? 'auto' : '0' }"
        >
          <el-form
            :model="baseInfoForm"
            label-width="140px"
            label-position="right"
            :disabled="status === 'read'"
            ref="baseInfoForm"
            :rules="baseInfoFormRules"
          >
            <el-form-item label="发布任务名称：" prop="name">
              <el-input v-model="baseInfoForm.name" :style="{width: '632px'}" placeholder="输入任务名称"></el-input>
            </el-form-item>
            <el-form-item label="所属环境：" prop="environmentId">
              <el-select
                v-model="baseInfoForm.environmentId"
                :style="{width: '632px'}"
                placeholder="请选择所属环境"
              >
                <el-option
                  v-for="(item,index) in envList"
                  :key="index"
                  :label="item.name"
                  :value="item.environmentId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所属业务系统：" prop="systemId">
              <el-select
                v-model="baseInfoForm.systemId"
                :style="{width: '632px'}"
                placeholder="请选择业务系统"
                @change="getPipelineList('change')"
              >
                <el-option
                  v-for="(item, index) in systemList"
                  :key="index"
                  :label="item.name"
                  :value="item.systemId"
                ></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="所需需求：" prop="demand">
              <el-select
                v-model="baseInfoForm.demand"
                @change="handleSelectDemand"
                :style="{width: '632px'}"
                @focus="handleFocusDemand"
                placeholder="请选择需求"
              >
                <el-option label="选择关联需求" value="1"></el-option>
                <el-option
                  v-for="(item,index) in demandList"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item label="优先级：" prop="priority">
              <el-select
                v-model="baseInfoForm.level"
                :style="{width: '632px'}"
                placeholder="请选择优先级"
              >
                <el-option
                  v-for="(item, index) in priorityTypeList"
                  :key="index"
                  :label="item.value"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="执行人：" prop="runUsers">
              <user-selector
                :selectedList.sync="baseInfoForm.runUsers"
                :candidates="userList"
                :isOrdered="false"
                :readonly="status === 'read'"
              ></user-selector>
            </el-form-item>
            <el-form-item label="负责人：">
              <user-selector
                :selectedList.sync="baseInfoForm.dutyUsers"
                :candidates="userList"
                :readonly="status === 'read'"
                :single="true"
              ></user-selector>
            </el-form-item>
            <el-form-item label="参与人：">
              <user-selector
                :selectedList.sync="baseInfoForm.partUsers"
                :readonly="status === 'read'"
                :isOrdered="false"
                :candidates="userList"
              ></user-selector>
            </el-form-item>
            <el-form-item label="描述：">
              <el-input type="textarea" v-model="baseInfoForm.remarks" :style="{width: '632px'}"></el-input>
            </el-form-item>
            <el-form-item label="任务流水线" class="pipe">
              <div style="border: 1px solid #ccc;width: 96%;position: relative;" v-if="hasXml">
                <Workflow
                  @confirm="getXml"
                  :isShowDialog.sync="isShowDialog"
                  :ID.sync="ID"
                  :activityData="activityData"
                  :actNodeName="actNodeName"
                  :isDisabled="status=='read'?true:false"
                />
              </div>
              <!-- <div class="select-task-btn" @click="selectTaskPipeline">
                <i class="el-icon-link" :style="{fontSize: '17px'}"></i>&nbsp;&nbsp;选择任务流水线
              </div>
              <div class="readonly-timeline">
                <task-timeline
                  :readonly="true"
                  :taskType="taskTypes.build"
                  :initReadingData="selectedTasks"
                ></task-timeline>
              </div>-->
            </el-form-item>
          </el-form>
          <div class="save-and-cancel dialog-footer-form" v-if="status !== 'read'">
            <el-button type="primary" @click="addBuildReleaseTask" style="margin-right:200px">保存</el-button>
            <el-button @click="handleCancel" class="nomal-button">取消</el-button>
          </div>
        </div>
      </div>
    </div>
    <!-- 流水线节点弹框 -->
    <release-workflow-dialog
      @confirm="getNodeParams"
      :systemId.sync="baseInfoForm.systemId"
      :ShowDialog.sync="ShowDialog"
      :pipelineList.sync="pipelineList"
      :ID.sync="ID"
      :status="status"
      :pipelineFormData="baseInfoForm.releaseNodeparams"
    />
    <!-- <el-dialog title="编辑节点" :visible.sync="showDialog" center :before-close="pipelineCancel">
      <el-form
        ref="pipelineForm"
        :model="pipelineForm"
        label-width="100px"
        :rules="pipelineFormRules"
      >
        <el-form-item label="节点名称: " class="disinlne" prop="jobTaskId">
          <el-select
            v-model="pipelineForm.jobTaskId"
            placeholder="请选择任务流水线"
            style="width:55%"
            filterable
            clearable
            :disabled="status === 'read'"
            @change="changeValue"
          >
            <el-option
              v-for="item in pipelineList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="disinlne" prop="checked">
          <el-checkbox v-model="pipelineForm.checked">是否为合并节点</el-checkbox>
        </el-form-item>
        <el-form-item label="任务依赖: " class="disinlne" prop="jobtaskStrategy">
          <el-select
            v-model="pipelineForm.jobtaskStrategy"
            placeholder="请选择任务依赖"
            style="width:55%"
            filterable
            clearable
            :disabled="status === 'read'"
          >
            <el-option
              v-for="item in jobtaskStrategyList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer-form" :style="{textAlign: 'center'}">
        <el-button type="primary" @click="getNodeParams" style="margin-right: 100px">确 定</el-button>
        <el-button @click="pipelineCancel">取 消</el-button>
      </div>
    </el-dialog>-->
    <el-dialog title="选择任务" width="70%" :visible.sync="selectTaskDialogVisible" center>
      <select-task
        :checkList.sync="selectedTasks"
        :systemId="this.baseInfoForm.systemId"
        :taskType="taskTypes.build"
      ></select-task>
      <div slot="footer" class="dialog-footer" :style="{textAlign: 'center',paddingBottom: '50px'}">
        <el-button type="primary" @click="confirmSelectedTasks" style="margin-right: 100px">确 定</el-button>
        <el-button @click="selectTaskDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="选择需求" :visible.sync="demandVisible" center width="60%">
      <el-form :model="searchOption" inline>
        <el-form-item>
          <el-select v-model="searchOption.environmentId" placeholder="请选择环境" style="width: 160px;">
            <el-option
              v-for="(item,index) in envList"
              :key="index"
              :label="item.name"
              :value="item.environmentId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchOption.type" placeholder="请选择类型" style="width: 160px;">
            <el-option
              v-for="(item,index) in typeList"
              :key="index"
              :label="item.name"
              :value="item.val"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchOption.title" placeholder="请输入标题" style="width: 160px;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchOption.number" placeholder="请输入编号" style="width: 160px;"></el-input>
        </el-form-item>
        <el-form-item class="item-right overHideMargin">
          <el-button icon="el-icon-search" class="common-btn-style" @click="searchDemand">查找</el-button>
        </el-form-item>
      </el-form>
      <div class="total-display">
        显示
        <input v-model="pageSize" class="dialog-size-input" />条数据
      </div>
      <el-table
        :data="allDemand"
        class="diaolog-border"
        :header-cell-style="{background:'#f5f5f5'}"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="编号" prop="number" align="center"></el-table-column>
        <el-table-column label="标题" prop="title" align="center"></el-table-column>
        <el-table-column label="类型" prop="type" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.type}}</span>
          </template>
        </el-table-column>
        <el-table-column label="发布状态" prop="status" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.status}}</span>
          </template>
        </el-table-column>
        <el-table-column label="阶段" prop="stages" align="center">
          <template slot-scope="scope">
            <div class="tag-box">
              <span
                class="stage-tag"
                v-for="(item,index) in scope.row.stages"
                :key="index"
                :class="fillterColor(item.status)"
              >{{item.name}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="上线时间" prop="time" align="center"></el-table-column>
        <el-table-column label="执行人" prop="person" align="center"></el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currPage"
        :page-sizes="[10, 30, 50]"
        :page-size="pageSize"
        layout="prev, pager, next, sizes, total, jumper"
        :total="total"
        v-if="total > 10"
        style="cursor: pointer;text-align: center;margin-top: 20px;"
      ></el-pagination>
      <span slot="footer" class="dialog-footer">
        <el-button
          class="cm-btn deep save-btn-margin-special"
          type="primary"
          @click="demandVisible = false"
        >确 定</el-button>
        <el-button class="cm-btn isoutline" @click="demandVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import UserSelector from '../ToolsManagement/UserSelector.vue'
import SelectTask from './SelectTask.vue'
import Workflow from '../../common/workflow.vue'
import ReleaseWorkflowDialog from '../release-workflow-dialog.vue'
import { demandList } from './util'
import axios from '@/api';
export default {
  created () {
    this.getAllSelectList().then(res => {
      if (res[0].data.success) {
        this.systemList = res[0].data.data.result
      }
      if (res[1].data.success) {
        this.userList = res[1].data.data.result.records
      }
      if (res[2] && res[2].data.success) {
        this.envList = res[2].data.data.result
      }
      console.log('****')
      console.log(this.status)
      // 组件除新增状态外，均需要根据任务id从后台获取任务信息
      if (this.status === 'read' || this.status === 'update') {
        this.fetchTaskData()
      }
    })
  },
  props: {
    /**
     * 组件状态 read查看 create新增 update更新
     * 通过路由注入
     */
    status: {
      type: String,
      default: 'read'
    }
  },
  data () {
    return {
      hasXml: true,
      NodeParams: [],
      actXml: '',
      nodeList: [],
      isShowDialog: false,
      ShowDialog: false,
      // // 依赖列表
      // jobtaskStrategyList: [
      //   {
      //     value: "success",
      //     label: "前置任务成功后执行"
      //   },
      //   {
      //     value: "failed",
      //     label: "前置任务失败后执行"
      //   },
      //   {
      //     value: "always",
      //     label: "前置任务执行后执行"
      //   }
      // ],
      pipelineList: [], // 流水线列表
      ID: '',
      activityData: {},
      actNodeName: '',
      pipelineFormRules: {},
      // 已选择任务流水线
      selectedTasks: [],
      // 业务系统待选列表
      systemList: [],
      // 用户待选列表
      userList: [],
      // 是否显示选择任务对话框
      selectTaskDialogVisible: false,
      // 基本信息表单
      baseInfoForm: {},
      blockSwitch: { '1': true }, // 控制块的显示
      baseInfoFormRules: {
        name: [
          { required: true, message: '请输入任务名称', trigger: 'blur' },
          {
            min: 2,
            max: 24,
            message: '任务名称长度为2到24个字符',
            trigger: 'blur'
          }
        ],
        environmentId: [
          { required: true, message: '请选择环境', trigger: 'change' }
        ],
        systemId: [
          { required: true, message: '请选择所属业务系统', trigger: 'blur' }
        ],
        runUsers: [{ required: true, message: '请选择执行人', trigger: 'blur' }]
      },
      // 优先级映射表
      priorityTypeList: [
        { id: 1, value: '最低' },
        { id: 2, value: '低' },
        { id: 3, value: '中' },
        { id: 4, value: '高' },
        { id: 5, value: '最高' }
      ],
      // 发布策略映射表
      releaseStrategyList: [
        { id: 1, name: '金丝雀发布' },
        { id: 2, name: '蓝绿发布' },
        { id: 3, name: '滚动发布' }
      ],
      // 任务类型映射
      taskTypes: {
        build: 'BuildCheckTaskList',
        deploy: 'DeployCheckTaskList'
      },
      // 环境列表
      envList: [],
      // 需求列表
      demandList: [],
      // 控制需求选择框
      demandVisible: false,
      // 类型选择数据
      typeList: [],
      // 查询条件
      searchOption: {},
      // 当前页数
      currPage: 1,
      // 需求列表每页展示的数量
      pageSize: 10,
      // 需求的总数
      total: 0
    }
  },
  methods: {
    // // 因为数据源是由接口请求而来，数据量过大时，render函数没有自动更新，需手动强制刷新
    // changeValue() {
    //   this.$forceUpdate();
    // },
    // pipelineCancel() {
    //   this.showDialog = false;
    //   this.$set(this.pipelineForm, "jobTaskId", "");
    //   this.$set(this.pipelineForm, "checked", false);
    //   this.$set(this.pipelineForm, "jobtaskStrategy", "");
    // },
    // 获取xml
    getXml (data) {
      this.actXml = data.actXml
      this.nodeList = data.nodeList
      this.checkNodeParams()
    },
    // // 转换node节点名称
    // returnNodeName() {
    //   let name = "";
    //   this.pipelineList.forEach(item => {
    //     if (this.pipelineForm.jobTaskId == item.value) {
    //       name = item.label;
    //     }
    //   });
    //   return name;
    // },
    checkNodeParams () {
      let copyeData = []
      this.nodeList.forEach(item => {
        this.NodeParams.forEach(d => {
          if (item.actNodeId == d.actNodeId) {
            copyeData.push(d)
          }
        })
      })
      this.NodeParams = copyeData
    },
    // 获取nodeparam
    getNodeParams (data) {
      this.NodeParams = data.NodeParams
      this.actNodeName = data.actNodeName
    },
    // 获取nodeparam
    // getNodeParams() {
    //   console.log(this.NodeParams, this.pipelineForm.jobtaskStrategy);
    //   this.actNodeName = this.returnNodeName(this.pipelineForm.jobTaskId);
    //   if (this.NodeParams.length > 0) {
    //     if (JSON.stringify(this.NodeParams).indexOf(this.ID) > -1) {
    //       this.NodeParams.forEach(item => {
    //         if (item.actNodeId == this.ID) {
    //           item.actNodeName = this.returnNodeName(
    //             this.pipelineForm.jobTaskId
    //           );
    //           item.jobTaskId = this.pipelineForm.jobTaskId;
    //           item.checked = this.pipelineForm.checked;
    //           item.jobtaskStrategy = this.pipelineForm.jobtaskStrategy;
    //         }
    //       });
    //     } else {
    //       this.NodeParams.push({
    //         actNodeName: this.returnNodeName(this.pipelineForm.jobTaskId),
    //         jobTaskId: this.pipelineForm.jobTaskId,
    //         checked: this.pipelineForm.checked,
    //         jobtaskStrategy: this.pipelineForm.jobtaskStrategy,
    //         actNodeId: this.ID
    //       });
    //     }
    //   } else {
    //     this.NodeParams.push({
    //       actNodeName: this.returnNodeName(this.pipelineForm.jobTaskId),
    //       jobTaskId: this.pipelineForm.jobTaskId,
    //       checked: this.pipelineForm.checked,
    //       jobtaskStrategy: this.pipelineForm.jobtaskStrategy,
    //       actNodeId: this.ID
    //     });
    //   }
    //   this.pipelineCancel();
    // },
    // 获取流水线
    getPipelineList (type) {
      this.pipelineList = []
      axios.findByStemId(this.baseInfoForm.systemId)
        .then(res => {
          if (res.data.code === 200) {
            res.data.data.forEach(item => {
              this.pipelineList.push({
                value: item.jobId,
                label: item.name
              })
            })
          }
          if (type == 'change') {
            this.activityData = {}
          }
        })
        .catch()
    },
    /**
     * 控制块的显示或隐藏
     */
    switchBlock (num) {
      this.blockSwitch[num] = !this.blockSwitch[num]
    },
    /**
     * 根据路由查询参数id
     * 从后台获取任务信息
     */
    fetchTaskData () {
      const id = this.$route.query.id
      this.hasXml = false
      axios.releaseTaskDetail(id)
        .then(res => {
          if (res.data.success) {
            this.baseInfoForm = this.dataTransform(res.data.data)
            this.activityData.actXml = res.data.data.actXml
            this.hasXml = true
            this.selectedTasks = []
            this.getPipelineList()
            // 任务流水线处理
            const pinelineTaskList = this.baseInfoForm.jobList
            for (let m = 0; m < pinelineTaskList.length; m++) {
              let obj = {
                jobTaskId: pinelineTaskList[m].jobId,
                jobTaskSort: m,
                jobtaskStrategy: pinelineTaskList[m].jobtaskStrategy,
                name: pinelineTaskList[m].name
              }
              this.selectedTasks.push(obj)
            }
          }
        })
        .catch(e => {
          this.$notify({
            title: '错误提示',
            message: '请选择业务系统后选择流水线',
            type: 'error'
          })
        })
    },
    /**
     * 后台数据格式转换
     */
    dataTransform (data) {
      console.log(data)
      console.log(typeof data.runUsers)
      const result = data
      let runUsers = data.runUsers ? JSON.parse(data.runUsers) : []
      let dutyUsers = data.dutyUsers ? JSON.parse(data.dutyUsers) : []
      let partUsers = data.partUsers ? JSON.parse(data.partUsers) : []
      for (let i = 0; i < runUsers.length; i++) {
        runUsers[i] = this.getUserInfoFromUserList(runUsers[i].userId)
      }
      for (let j = 0; j < dutyUsers.length; j++) {
        console.log(dutyUsers[j].userId)
        dutyUsers[j] = this.getUserInfoFromUserList(dutyUsers[j].userId)
      }
      for (let k = 0; k < partUsers.length; k++) {
        partUsers[k] = this.getUserInfoFromUserList(partUsers[k].userId)
      }
      result.runUsers = runUsers
      result.dutyUsers = dutyUsers
      result.partUsers = partUsers
      return result
    },
    /**
     * 后台传递前台数据处理
     * 传入用户信息只有id
     * 需根据id获取用户头像和名称展示
     */
    getUserInfoFromUserList (userId) {
      const userList = this.userList || []
      for (let i = 0; i < this.userList.length; i++) {
        if (userId === userList[i].userId) {
          return {
            userId: userId,
            name: userList[i].name,
            photo: userList[i].photo
          }
        }
      }
      return {}
    },
    /**
     * 获取当前页所有待选列表
     */
    getAllSelectList () {
      return Promise.all([
        axios.getcigroupSystablist(''),
        axios.userList({
          condition: '',
          current: 1,
          online: false,
          roleIds: [],
          size: 20,
          userStatus: ''
        }),
        axios.envtablist()
      ])
    },
    /**
     * 选择任务流水线
     */
    selectTaskPipeline () {
      if (!this.baseInfoForm.systemId) {
        this.$notify({
          title: '错误提示',
          message: '请选择业务系统后选择流水线',
          type: 'error'
        })
        return
      }
      this.$store.commit(
        'setBuildCheckTaskList',
        JSON.parse(JSON.stringify(this.selectedTasks))
      )
      this.selectTaskDialogVisible = true
    },
    /**
     * 确认任务流水线信息
     */
    confirmSelectedTasks () {
      this.selectedTasks = this.$store.state.tempBuildCheckTaskList
      this.selectTaskDialogVisible = false
    },
    /**
     * 添加构建任务
     */
    addBuildReleaseTask () {
      const data = JSON.parse(JSON.stringify(this.baseInfoForm))
      data.ReleaseManageTask = this.selectedTasks
      data.taskType = '1'
      data.runUsers = this.userInfoTransform(data.runUsers)
      data.dutyUsers = this.userInfoTransform(data.dutyUsers)
      data.partUsers = this.userInfoTransform(data.partUsers)
      data.actXml = this.actXml || data.actXml
      data.NodeParams = this.NodeParams || data.releaseNodeparams
      console.log(data)
      this.$refs.baseInfoForm
        .validate()
        .then(() => {
          if (this.status === 'update') {
            axios.updateReleaseTask(data).then(res => {
              if (res.data.success) {
                this.$notify.success({
                  title: '提示',
                  message: '更新成功！'
                })
                this.$router.push({
                  path: '/AutomatedRelease/releaseTasklist',
                  query: {
                    code: 3
                  }
                })
              } else {
                this.$notify.error({
                  title: '提示',
                  message: res.data.message
                })
              }
            })
          }
          if (this.status === 'create') {
            axios.addReleaseTask(data).then(res => {
              if (res.data.success) {
                this.baseInfoForm = {}
                this.$notify.success({
                  title: '提示',
                  message: '增加成功！'
                })
                this.$router.push({
                  path: '/AutomatedRelease/releaseTasklist',
                  query: {
                    code: 3
                  }
                })
              } else {
                this.$notify.error({
                  title: '提示',
                  message: res.data.message
                })
              }
            })
          }
        })
        .catch(() => {})
    },
    handleCancel () {
      this.$router.back()
    },
    /**
     * 传递给后台的用户信息转换
     * 剔除其他字段，只保留id
     */
    userInfoTransform (users) {
      const result = users && JSON.parse(JSON.stringify(users))
      if (result) {
        for (let i = 0; i < result.length; i++) {
          result[i] = {
            order: i + 1,
            userId: result[i].userId
          }
        }
      }
      return result
    },
    // 选择需求框获取焦点的处理
    handleFocusDemand () {
      if (this.demandList.length === 0) {
        this.demandVisible = true
        this.baseInfoForm.demand = ''
      }
    },
    // 选择需求框选择项时处理
    handleSelectDemand (val) {
      if (val === '1') {
        this.demandVisible = true
        this.baseInfoForm.demand = ''
      }
    },
    // 查询需求
    searchDemand () {},
    // 根据状态获取不同颜色表示
    fillterColor (val) {
      let fontColor = ''
      switch (val) {
        case 'success':
          fontColor = 'green'
          break
        case 'failed':
          fontColor = 'error'
          break
        case 'building':
          fontColor = 'warn'
          break
        default:
          fontColor = 'default'
          break
      }
      return fontColor
    },
    // size的切换
    handleSizeChange () {},
    // 页码的切换
    handleCurrentChange () {}
  },
  watch: {
    $route (val) {
      // 状态为新增时，重置表单数据
      if (val.params.status === 'create') {
        this.baseInfoForm = {}
        this.selectedTasks = []
      }
    },
    isShowDialog: {
      handler (newValue, oldValue) {
        if (newValue) {
          this.actNodeName = ''
        }
        this.ShowDialog = newValue
      },
      deep: true
    },
    ShowDialog: {
      handler (newValue, oldValue) {
        this.isShowDialog = newValue
      },
      deep: true
    }
  },
  computed: {
    allDemand () {
      return demandList
    }
  },
  components: {
    UserSelector,
    SelectTask,
    Workflow,
    ReleaseWorkflowDialog
  }
}
</script>
<style scoped>
.block-title {
  position: relative;
  top: 0;
  left: 0;
  padding-left: 34px;
  cursor: pointer;
}
.block-title .title-tips {
  width: 8px;
  height: 100%;
  background-color: #0066ff;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 4px;
}
.icons {
  color: #0066ff;
  font-size: 20px;
  vertical-align: middle;
  margin-left: 4px;
}
.block-title > h3 {
  font-size: 16px;
  font-weight: normal;
  line-height: 32px;
}
.title-tips {
  width: 6px;
  height: 100%;
  border-radius: 5px;
  background-color: #0066ff;
  position: absolute;
  top: 0;
  left: -30px;
}
.block-content {
  padding-left: 110px;
}
.readonly-timeline {
  width: 60%;
  padding-top: 40px;
}
.save-and-cancel {
  text-align: center;
  padding-bottom: 50px;
}
.select-task-btn {
  margin-bottom: 20px;
  cursor: pointer;
}
.select-task-btn:hover {
  color: #0066ff;
}
.dialog-size-input {
  width: 20px;
  color: #0066ff;
}
.total-display {
  text-align: right;
}
.diaolog-border {
  margin-top: 10px;
  border: 1px solid #d3d3d3 !important;
}
.tag-box {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
}
.stage-tag {
  padding: 0 5px;
  width: 36px;
  font-size: 16px;
  border-left: none !important;
}
.stage-tag:first-child {
  border-left-width: 1px !important;
  border-left-style: solid !important;
}
.green {
  color: #49bc71;
  border: 1px solid #49bc71;
}
.error {
  color: #ff0000;
  border: 1px solid #ff0000;
}
.warn {
  color: #ee9907;
  border: 1px solid #ee9907;
}
.default {
  color: #c6c6c6;
  border: 1px solid #c6c6c6;
}
.pipe /deep/ div.el-form-item__content {
  line-height: 0 !important;
  position: relative;
  font-size: 14px;
}
</style>
