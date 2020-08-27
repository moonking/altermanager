<template>
  <div class="add-deploy-manage">
    <div class="add-container non-shadow aibms-color-bg">
      <h3 class="add-title white-color">新增部署方案</h3>
      <div class="form">
        <el-form
          ref="planForm"
          :model="formData"
          :rules="rules"
          label-position="'right'"
          label-width="130px"
        >
          <el-form-item label="选择部署方案类型">
            <el-radio-group v-model="formData.deployPlanType">
              <el-radio :label="1">F5部署</el-radio>
              <el-radio :label="2">数据库部署</el-radio>
              <el-radio :label="3">应用部署</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="方案名称:" prop="name">
            <el-input
              v-model="formData.name"
              :style="{width: '300px',marginRight: '20px'}"
              maxlength="20"
              placeholder="方案名称不能超过20个字符"
            ></el-input>
          </el-form-item>
          <el-form-item label="业务系统:" prop="system">
            <el-select v-model="formData.system" @change="selectSystem">
              <el-option
                v-for="system in systemList"
                :key="system.systemId"
                :label="system.name"
                :value="system.systemId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择节点:" prop="node">
            <el-input
              v-model="formData.node"
              :disabled="true"
              :style="{width: '300px',marginRight: '20px'}"
            ></el-input>
            <el-button type="primary" @click="toSelectNode">选择节点</el-button>
          </el-form-item>
          <el-form-item label="选择脚本:" prop="script">
            <el-input
              v-model="formData.script"
              :disabled="true"
              :style="{width: '300px',marginRight: '20px'}"
            ></el-input>
            <el-button type="primary" @click="toSelectScript">选择脚本</el-button>
          </el-form-item>
          <el-form-item label="脚本参数:">
            <el-input
              v-model="formData.scriptParams"
              placeholder="示例：参数一  参数二（空格分隔）"
              :style="{width: '300px',marginRight: '20px'}"
            ></el-input>
          </el-form-item>
          <!-- <el-form-item label="任务类型:" prop="taskType">
            <el-radio-group v-model="formData.taskType">
              <el-radio :label="0">常规任务</el-radio>
              <el-radio :label="1">定时任务</el-radio>
            </el-radio-group>
          </el-form-item>-->
          <el-form-item label="添加描述:">
            <el-input
              type="textarea"
              v-model="formData.description"
              :rows="3"
              :style="{width: '300px'}"
            ></el-input>
          </el-form-item>
          <!-- <el-form-item label="科技验证:">
            <el-input
              v-model="formData.validatePlan"
              :style="{width: '300px',marginRight: '20px'}">
            </el-input>
            <el-button type="primary" @click="toSelectValidatePlan">选择</el-button>
          </el-form-item>-->
          <el-form-item>
            <el-button type="primary" @click="confirm">确认</el-button>
            <el-button @click="cancel" class="nomal-button">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <script-select-dialog
      :systemParams="systemParams"
      @confirm="scriptSelectedHandle"
      :dialogVisible.sync="scriptDialogVisible"
    ></script-select-dialog>
    <node-select-dialog
      :systemParams="systemParams"
      @confirm="nodeSelectedHandle"
      :dialogVisible.sync="nodeDialogVisible"
    ></node-select-dialog>
    <validate-plan-select-dialog
      @confirm="validateSelectedHandle"
      :dialogVisible.sync="validatePlanDialogVisible"
    ></validate-plan-select-dialog>
  </div>
</template>
<script>
import ScriptSelectDialog from './ScriptSelectDialog'
import NodeSelectDialog from './NodeSelectDialog'
import ValidatePlanSelectDialog from './ValidatePlanSelectDialog'
import axios from '@/api';
import {
  initFileds,
  checkModification,
  onbeforeunload
} from '../../../utils/reload.js'
export default {
  data () {
    return {
      isbl: false,
      formData: {
        deployPlanType: 1,
        name: '',
        script: '',
        scriptParams: '',
        system: '',
        node: '',
        taskType: 0,
        description: '',
        validatePlan: ''
      },
      scriptSubFormData: {
        value: '',
        system: ''
      },
      validateSubFormData: {
        value: ''
      },
      scriptDialogVisible: false,
      nodeDialogVisible: false,
      validatePlanDialogVisible: false,
      systemList: [
        // {
        //   type: 1,
        //   name: '个险业务系统'
        // },
        // {
        //   type: 2,
        //   name: '团险业务系统'
        // }
      ],
      scriptDialogTableData: [
        {
          id: 145,
          name: '152.78.woeladd',
          system: '大数据平台系统',
          script: 'siasloOperations-sit/7-dowasd.gy',
          scriptType: 'F5脚本',
          recentUpdate: '2019-1-15 12:15:36'
        },
        {
          id: 145,
          name: '152.78.woeladd',
          system: '大数据平台系统',
          script: 'siasloOperations-sit/7-dowasd.gy',
          scriptType: '数据库脚本',
          recentUpdate: '2019-1-15 12:15:36'
        }
      ],
      validateDialogTableData: [
        {
          id: 'Y2019110154414',
          name: '验证节点 152.78.woeladd',
          node: '152.78.woeladd',
          createTime: '2019-2-13 03:21:32'
        }
      ],
      scriptItem: {},
      nodeItem: {},
      rules: {
        name: [{ required: true, message: '请填写方案名称', trigger: 'blur' }],
        node: [{ required: true, message: '请选择节点', trigger: 'blur' }],
        taskType: [
          { required: true, message: '请选择任务类型', trigger: 'change' }
        ],
        system: [
          { required: true, message: '请选择业务系统', trigger: 'change' }
        ],
        script: [{ required: true, message: '请选择脚本', trigger: 'blur' }]
      },
      systemParams: ''
    }
  },
  mounted () {
    this.getSysList()
    onbeforeunload()
    initFileds()
  },
  beforeRouteLeave (to, from, next) {
    let bl = checkModification(this.isbl)
    if (bl) {
      const answer = window.confirm('页面相关数据还未保存，是否离开当前页面!')
      if (answer) {
        next()
      } else {
        // 不支持传递回调(因为this实例已经创建可以获取到，所以没必要)
        next(false)
      }
    } else {
      next()
    }
  },
  beforeDestroy () { },
  destroyed () {
    window.onbeforeunload = null
  },
  methods: {
    selectSystem (val) {
      this.formData.system = val
      this.systemParams = val

      this.formData.script = ''
      this.nodeItem = {}
      this.formData.node = ''
      this.scriptItem = {}
    },
    getSysList () {
      let name = ''
      axios.getcigroupSystablist(name).then(res => {
        if (res.data.success) {
          this.systemList = res.data.data.result
        }
      })
    },
    toSelectScript () {
      if (this.systemParams) {
        this.scriptDialogVisible = true
      } else {
        this.$notify({
          title: '提示',
          message: '请先选择业务系统'
        })
      }
    },
    toSelectNode () {
      if (this.systemParams) {
        this.nodeDialogVisible = true
      } else {
        this.$notify({
          title: '提示',
          message: '请先选择业务系统'
        })
      }
    },
    toSelectValidatePlan () {
      this.validatePlanDialogVisible = true
    },
    confirm () {
      this.$refs.planForm.validate(valid => {
        if (valid) {
          let params = {
            name: this.formData.name,
            nodeId: this.nodeItem.nodeId,
            nodeName: this.formData.node,
            planType: this.formData.deployPlanType,
            remarks: this.formData.description,
            fileId: this.scriptItem.fileId,
            scriptParam: this.formData.scriptParams,
            systemId: this.formData.system,
            taskType: this.formData.taskType
          }
          this.isbl = true

          axios.addDeployPlan(params).then(res => {
            if (res.data.success) {
              this.$refs.planForm.resetFields()
              this.$router.push({
                path: '/AutomatedRelease/DeployPlanManage?code=3'
              })
              this.$notify({
                title: '提示',
                message: '新增部署方案成功'
              })
            } else {
              this.isbl = false
              this.$notify({
                title: '提示',
                message: res.data.message
              })
            }
          })
        } else {
          return false
        }
      })
    },
    cancel () {
      this.$refs.planForm.resetFields()
      this.$router.push({
        path: '/AutomatedRelease/DeployPlanManage?code=3'
      })
    },
    scriptSelectedHandle (data) {
      this.formData.script = data.name
      this.scriptItem = data
    },
    nodeSelectedHandle (data) {
      this.formData.node = data.name
      this.nodeItem = data
    },
    validateSelectedHandle (data) { },
    selectValidatePlan () { }
  },
  components: {
    ScriptSelectDialog,
    NodeSelectDialog,
    ValidatePlanSelectDialog
  }
}
</script>
<style scoped>
.add-deploy-manage {
  padding: 10px;
}
.add-deploy-manage .add-container {
  width: 100%;
  padding-bottom: 60px;
  border-radius: 4px;
  box-shadow: 0 0 10px 0 #ddd;
  background-color: #fff;
}
.add-container .add-title {
  padding-top: 10px;
  padding-left: 20px;
  margin-bottom: 10px;
  border-left: 5px solid #0280ff;
  font-weight: normal;
  color: #707070;
}
.add-container .form {
  width: 60%;
  min-width: 640px;
  padding-left: 80px;
}
</style>
