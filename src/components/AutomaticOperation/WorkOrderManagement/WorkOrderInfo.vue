<template>
  <div class="work-order-info aibms-color-bg non-shadow">
    <div class="block">
      <!-- <div class="block-title">
        <div class="title-tips"></div>
        <h3>
          基本信息
          <i
            :class="['icons','el-icon-arrow-right', {rotate90: !isfold.base}]"
            @click="isfold.base = !isfold.base"
          ></i>
        </h3>
      </div>-->
      <div class="item-block-title" @click="isfold.base = !isfold.base">
        <div class="item-block-title-mark"></div>
        <span class="item-block-title-font">基本信息</span>
        <i
          class="icons el-icon-arrow-right"
          :style="{transform: !isfold.base ? 'rotate(90deg)' : 'rotate(0)'}"
        ></i>
      </div>
      <div :class="['block-content',{height0: isfold.base}]">
        <el-form
          :model="formData"
          label-width="121px"
          :rules="formRules"
          ref="form"
          :disabled="status === 'read'"
        >
          <el-form-item label="工单名称：" prop="name">
            <el-input
              v-model="formData.name"
              placeholder="请输入工单名称"
              :style="{width: '240px'}"
              maxlength="20"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="所属环境：" prop="environmentId">
            <el-select
              v-model="formData.environmentId"
              placeholder="选择所属环境"
              :style="{width: '240px'}"
            >
              <el-option
                v-for="item in environments"
                :key="item.environmentId"
                :label="item.name"
                :value="item.environmentId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="执行人：" prop="runUser">
            <user-selector
              :candidates="userList"
              :selectedList.sync="formData.runUser"
              :single="true"
              :readonly="status === 'read'"
            />
          </el-form-item>
          <el-form-item label="计划发布时间：" prop="planStartTime">
            <el-date-picker
              v-model="formData.planStartTime"
              :picker-options="pickerOptionsStart"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="请选择计划发布时间"
              :style="{width: '240px'}"
            />
          </el-form-item>
          <el-form-item label="预计执行时长：" prop="estDuration">
            <el-input
              type="number"
              v-model="formData.estDuration"
              placeholder="请输入预计执行时长，单位min"
              :style="{width: '240px'}"
            />
          </el-form-item>
          <el-form-item label="计划结束时间：" prop="planEndTime">
            <el-date-picker
              v-model="formData.planEndTime"
              :picker-options="pickerOptionsEnd"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="请选择计划结束时间"
              :style="{width: '240px'}"
            />
          </el-form-item>
          <el-form-item label="描述：" prop="remarks">
            <el-input
              type="textarea"
              v-model="formData.remarks"
              placeholder="请输入描述信息"
              :style="{width: '240px'}"
            />
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="block" style="    position: relative;">
      <!-- <div class="block-title">
        <div class="title-tips"></div>
        <h3>
          操作步骤
          <i
            :class="['icons','el-icon-arrow-right', {rotate90: !isfold.workflow}]"
            @click="isfold.workflow = !isfold.workflow"
          ></i>
        </h3>
      </div>-->
      <div class="item-block-title" @click="isfold.workflow = !isfold.workflow">
        <div class="item-block-title-mark"></div>
        <span class="item-block-title-font">操作步骤</span>
        <i
          class="icons el-icon-arrow-right"
          :style="{transform: !isfold.workflow ? 'rotate(90deg)' : 'rotate(0)'}"
        ></i>
      </div>
      <div :class="['block-content',{height0: isfold.workflow}]">
        <div class="import-workflow">
          <el-checkbox v-model="isImportWorkflow" :disabled="status === 'read'">导入操作流水线</el-checkbox>
          <el-select
            v-if="isImportWorkflow"
            v-model="importedWorkflow"
            @change="setWorkflowByImport"
            clearable
            placeholder="选择所属环境"
            :style="{width: '240px'}"
          >
            <el-option
              v-for="item in pipelineList"
              :key="item.pipelineId"
              :label="item.name"
              :value="item.pipelineId"
            ></el-option>
          </el-select>
        </div>
        <div class="work-flow-wrapper">
          <work-flow :activityData="workflowData" @confirm="setWorkFlowData" v-if="showWorkflow"></work-flow>
        </div>
      </div>
    </div>
    <div class="block">
      <!-- <div class="block-title">
        <div class="title-tips"></div>
        <h3>
          审批设置
          <i
            :class="['icons','el-icon-arrow-right', {rotate90: !isfold.approval}]"
            @click="isfold.approval = !isfold.approval"
          ></i>
        </h3>
      </div>-->
      <div class="item-block-title" @click="isfold.approval = !isfold.approval">
        <div class="item-block-title-mark"></div>
        <span class="item-block-title-font">审批设置</span>
        <i
          class="icons el-icon-arrow-right"
          :style="{transform: !isfold.approval ? 'rotate(90deg)' : 'rotate(0)'}"
        ></i>
      </div>
      <div
        :class="['block-content',{height0: isfold.approval}]"
        style="padding: 20px 80px 20px 80px"
      >
        <el-form :model="formData" label-width="110px" :rules="rules">
          <el-form-item label="审批人：" prop="examName">
            <user-selector
              :candidates="userList"
              :selectedList.sync="formData.approvalids"
              :readonly="status === 'read'"
            ></user-selector>
          </el-form-item>
          <el-form-item label="抄送人：">
            <user-selector
              :candidates="userList"
              :selectedList.sync="formData.sendcopyids"
              :readonly="status === 'read'"
            ></user-selector>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="btns" v-if="status !== 'read'">
      <el-button type="primary" class="btn-save" style="margin-right: 200px" @click="saveHandle">保存</el-button>
      <el-button class="btn-cancel nomal-button" @click="goWorkOrderIndex">取消</el-button>
    </div>
  </div>
</template>
<script>
import UserSelector from '../../AutomatedRelease/ToolsManagement/UserSelector'
import WorkFlow from '../pipeline-workflow'
import axios from '@/api';
import common from '@/utils/commonjs'
export default {
  data () {
    function nameValidate (rule, value, callback) {
      let result = value.replace(/^\s*|\s*$/g, '')
      if (value !== '' && result === '') {
        return callback(new Error('无效的空格，请输入合法的工单名称'))
      }
      callback()
    }
    return {
      // 面板折叠控制
      isfold: { base: false, workflow: false, approval: false },
      formData: {},
      formRules: {
        name: [
          { required: true, message: '请输入工单名称', trigger: 'blur' },
          {
            min: 2,
            max: 20,
            message: '工单名称为2到20个字符',
            trigger: 'blur'
          },
          { validator: nameValidate, trigger: 'blur' }
        ],
        environmentId: [
          { required: true, message: '请选择环境', trigger: 'blur' }
        ],
        runUser: [
          { required: true, message: '请选择执行人', trigger: 'blur' },
          { type: 'array', message: '类型错误', trigger: 'change' }
        ],
        planStartTime: [
          { required: true, message: '请选择计划开始时间', trigger: 'blur' }
        ],
        planEndTime: [
          { required: true, message: '请选择计划结束时间', trigger: 'blur' }
        ],
        estDuration: [
          { required: true, message: '请输入预计执行时长', trigger: 'blur' }
        ]
      },
      rules: {
        examName: [{ required: true, message: '请选择审批人', trigger: 'blur' }]
      },
      // 环境列表
      environments: [],
      // 用户列表
      userList: [],
      // 流程设计器数据
      workflowData: {},
      // 是否显示流程设计器
      showWorkflow: true,
      // 当前组件状态：新增/修改/查询
      status: 'read',
      // 是否为导入操作流水线
      isImportWorkflow: false,
      // 导入的流水线
      importedWorkflow: {},
      // 流水线列表
      pipelineList: []
    }
  },
  methods: {
    // 接受流程设计器子组件传递过来的工作流数据
    setWorkFlowData (data) {
      this.workflowData = data
    },
    setWorkflowByImport () {
      const id = this.importedWorkflow
      if (!this.isImportWorkflow) {
        return
      }
      let query = JSON.parse(JSON.stringify(this.$route.query))
      console.log(query)
      if (!query.key) {
        query.key = 'edit'
        this.$router.push({
          path: '/AutomaticOperation/WorkOrderInfo',
          query: query
        })
        this.showWorkflow = false
        setTimeout(() => {
          this.showWorkflow = true
        }, 500)
      }
      console.log(this.$route.query)
      for (let i = 0; i < this.pipelineList.length; i++) {
        const pipeline = this.pipelineList[i]
        if (id === pipeline.pipelineId) {
          this.workflowData = {
            actXml: pipeline.actXml || '',
            nodeParam: pipeline.pipeLineNodeparams || [],
            isImported: true
          }
        }
      }
    },
    // 从实体类列表获取对应id列表
    getIdsfromEntityList (list, key) {
      let result = []
      for (let i = 0; i < list.length; i++) {
        result.push(list[i][key])
      }
      return result
    },
    // 从user实体对象获取userId
    getIdFromUser (userList) {
      let result = []
      for (let i = 0; i < userList.length; i++) {
        let user = {
          order: '' + (1 + i),
          userId: userList[i].userId
        }
        result.push(user)
      }
      return result
    },
    // 请求数据预处理
    requestPreprocessing () {
      let result = {}
      if (
        this.workflowData.nodeParam &&
        this.workflowData.nodeParam.length > 0
      ) {
        this.workflowData.nodeParam.forEach(item => {
          if (typeof item.resourcesIds === 'string') {
            item.multipleSelection = common.evil(item.resourcesIds)
            delete item.resourcesIds
          }
          item.resourcesradio =
            item.resourcesradio || Number(item.resourcesType)
        })
      }
      result.DevopsJob = JSON.parse(JSON.stringify(this.formData)) || ''
      result.DevopsJob.runUser = this.formData.runUser[0].userId
      const approvalids = result.DevopsJob.approvalids || []
      const sendcopyids = result.DevopsJob.sendcopyids || []
      // 审批人和抄送人处理 approvalids sendcopyids
      result.DevopsJob.approvalids = JSON.stringify(
        this.getIdFromUser(approvalids)
      )
      result.DevopsJob.sendcopyids = JSON.stringify(
        this.getIdFromUser(sendcopyids)
      )
      result.actXml = this.workflowData.actXml || ''
      result.nodeParam = this.workflowData.nodeParam || []
      return result
    },
    // 新增工单
    addWorkOrder () {
      // 表单验证
      this.$refs.form.validate().then(res => {
        // 数据预处理用于拼接正确的请求参数
        const data = this.requestPreprocessing()
        if (data.DevopsJob.approvalids === '[]') {
          this.$notify.error({
            title: '提示',
            message: '请选择审批人'
          })
        } else {
          if (common.inspectNode(data.nodeParam)) {
            this.$notify({
              title: '提示',
              message: common.inspectNode(data.nodeParam),
              type: 'error'
            })
            return
          }
          axios.addWorkOrder(data).then(res => {
            if (res.data.success) {
              this.$notify.success({
                title: '提示',
                message: '工单添加成功'
              })
              this.goWorkOrderIndex()
            } else {
              this.$notify.error({
                title: '提示',
                message: res.data.message ? res.data.message : '工单添加失败！'
              })
            }
          })
        }
      })
    },
    // 修改工单
    updateWorkOrder () {
      // 表单验证
      this.$refs.form.validate().then(res => {
        // 数据预处理用于拼接正确的请求参数
        const data = this.requestPreprocessing()
        if (common.inspectNode(data.nodeParam)) {
          this.$notify({
            title: '提示',
            message: common.inspectNode(data.nodeParam),
            type: 'error'
          })
          return
        }
        axios.updateWorkOrder(data).then(res => {
          if (res.data.success) {
            this.$notify.success({
              title: '提示',
              message: '修改工单成功'
            })
            this.goWorkOrderIndex()
          } else {
            this.$notify.error({
              title: '提示',
              message: res.data.message ? res.data.message : '修改工单失败！'
            })
          }
        })
      })
    },
    // 保存处理
    saveHandle () {
      if (this.status === 'create') {
        this.addWorkOrder()
      }
      if (this.status === 'update') {
        this.updateWorkOrder()
      }
      // 脚本版本记录
      const scripts = this.workflowData.nodeParam
      const condition = { toolArray: [] }
      if (scripts && scripts.length > 0) {
        scripts.forEach(element => {
          let obj = {
            toolId: element.toolId,
            versionLog: element.version
          }
          condition.toolArray.push(obj)
        })
        console.log(condition)
        axios.scriptVersionLog(condition).then(res => {
          console.log(res)
        })
      }
    },
    // 根据用户id获取用户所有信息
    getUserById (list) {
      let result = []
      if (list && list.length) {
        for (let i = 0; i < list.length; i++) {
          let id = list[i].userId
          for (let j = 0; j < this.userList.length; j++) {
            if (id === this.userList[j].userId) {
              result.push(this.userList[j])
            }
          }
        }
      }
      return result
    },
    // 后台数据转换
    responseDataTransform (data) {
      let result = data && JSON.parse(JSON.stringify(data))
      const list = this.userList
      // 执行人
      for (let i = 0; i < list.length; i++) {
        if (result.runUser === list[i].userId) {
          result.runUser = [list[i]]
        }
      }
      // 审批人
      result.approvalids =
        data.approvalids === ''
          ? []
          : this.getUserById(JSON.parse(data.approvalids))
      // 抄送人
      result.sendcopyids =
        data.sendcopyids === ''
          ? []
          : this.getUserById(JSON.parse(data.sendcopyids))
      // 流程设计器数据
      this.workflowData = {
        actXml: result.actXml,
        nodeParam: result.jobNodeparams,
        isImported: false
      }
      return result
    },
    // 获取所有待选下拉菜单信息，用户列表，环境列表, 流水线列表
    getAllMenu () {
      return Promise.all([
        axios.userList({
          condition: '',
          current: 1,
          online: false,
          roleIds: [],
          size: 10000,
          userStatus: ''
        }),
        axios.envtablist(),
        axios.pagepipeline({
          name: '',
          environmentId: '',
          current: '1',
          size: '1000000'
        })
      ])
    },
    getExtraTime (date) {
      if (!(date instanceof Date)) {
        return 0
      }
      return (
        date.getHours() * 3600 * 1000 +
        date.getMinutes() * 60 * 1000 +
        date.getSeconds() * 1000
      )
    },
    goWorkOrderIndex () {
      this.$router.push({
        path: '/AutomaticOperation/OperationWorkOrder',
        query: {
          code: 4
        }
      })
    }
  },
  components: {
    UserSelector,
    WorkFlow
  },
  computed: {
    pickerOptionsStart () {
      const currentDate = new Date().getTime()
      const endTime = this.formData.planEndTime
      const endExtraTime = this.getExtraTime(new Date(endTime))
      return {
        disabledDate: time => {
          if (this.formData.planEndTime === null) {
            return time.getTime() < currentDate - 1000 * 3600 * 24
          }
          // 若时间有误差，可加减一天
          return (
            time.getTime() >
            new Date(this.formData.planEndTime).getTime() - endExtraTime ||
            time.getTime() < currentDate - 1000 * 3600 * 24
          )
        }
      }
    },
    pickerOptionsEnd () {
      const currentDate = new Date().getTime()
      const startTime = this.formData.planStartTime
      const startExtraTime = this.getExtraTime(new Date(startTime))
      return {
        disabledDate: time => {
          if (this.formData.planStartTime === null) {
            return time.getTime() < new Date().getTime() - 1000 * 3600 * 24
          }
          return (
            time.getTime() <
            new Date(this.formData.planStartTime).getTime() -
            startExtraTime ||
            time.getTime() < currentDate - 1000 * 3600 * 24
          )
        }
      }
    }
  },
  watch: {
    formData (newValue, oldValue) { }
  },
  created () {
    // 根据路由信息设置组件当前状态：新增/修改/查看
    this.status = this.$route.query.mode ? this.$route.query.mode : 'create'
    this.getAllMenu().then(res => {
      if (res[0].data.success) {
        this.userList = res[0].data.data.result.records
        if (this.status === 'read' || this.status === 'update') {
          // 从后台根据路由中传入的workOrderId查询详细信息
          const id = this.$route.query.workOrderId
          axios.getWorkOrder(id).then(res => {
            if (res.data.success) {
              this.formData = this.responseDataTransform(res.data.data)
            }
          })
        }
        if (this.status === 'create') {
          this.formData = {}
        }
      }
      if (res[1].data.success) {
        this.environments = res[1].data.data.result
      }
      if (res[2].data.success) {
        this.pipelineList = res[2].data.data.records
      }
    })
  }
}
</script>
<style scoped>
.block {
  text-align: left;
  padding-top: 10px;
}
.work-order-info {
  margin: 10px;
  background-color: #fff;
  box-shadow: 0 0 5px 0 #ddd;
  padding-bottom: 40px;
}
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
.title-line {
  width: 3px;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #fff;
}
.title-icon {
  font-weight: bold;
  font-size: 18px;
  color: #0066ff;
  margin-left: 30px;
  position: relative;
  top: 3px;
}
.block-content {
  padding: 20px 80px 20px 20px;
  overflow: hidden;
}

.work-flow-wrapper {
  border: 1px solid #eee;
}
.btns {
  text-align: center;
}
.btn-save {
  margin-right: 40px;
}
.import-workflow {
  margin-bottom: 20px;
}
.height0 {
  height: 0 !important;
  padding: 0 !important;
}
.rotate90 {
  transform: rotateZ(90deg);
}
.pl32 {
  padding-left: 32px;
}
</style>
