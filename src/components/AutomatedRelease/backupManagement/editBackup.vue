<template>
  <div class="add-deploy-manage">
    <div class="add-container non-shadow aibms-color-bg white-color">
      <h3 class="add-title white-color">编辑备份方案</h3>
      <div class="form">
        <el-form
          :label-position="'left'"
          label-width="130px"
          :rules="rules"
          ref="form"
          :model="backupDetailData"
        >
          <el-form-item label="备份方案名称:" prop="name">
            <el-input placeholder="备份方案名称" style="width:632px" v-model="backupDetailData.name"></el-input>
          </el-form-item>
          <el-form-item label="备份方案:" prop="backType">
            <el-select
              v-model="backupDetailData.backType"
              placeholder="备份方案选择"
              clearable
              style="width:632px"
            >
              <el-option
                v-for="plan in systemTypes"
                :key="plan.id"
                :value="plan.value"
                :label="plan.label"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="业务系统:" prop="systemName">
            <el-select
              v-model="backupDetailData.systemName"
              style="width:632px"
              placeholder="选择所属系统"
              @change="selectSystem"
            >
              <el-option
                v-for="system in systemList"
                :key="system.systemId"
                :label="system.name"
                :value="system.systemId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择节点:" prop="nodeId">
            <el-input
              v-model="backupDetailData.nodeId"
              :style="{width: '632px',marginRight: '20px'}"
              disabled
            ></el-input>
            <el-button type="primary" @click="toSelectNode">选择节点</el-button>
          </el-form-item>
          <el-form-item label="选择脚本:" prop="fileId">
            <el-input
              v-model="backupDetailData.fileId"
              :style="{width: '632px',marginRight: '20px'}"
              disabled
            ></el-input>
            <el-button type="primary" @click="toSelectScript">选择脚本</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="editBtn">确认修改</el-button>
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
  </div>
</template>
<script>
import axios from '@/api';
import ScriptSelectDialog from '../DeployPlanManage/ScriptSelectDialog.vue'
import NodeSelectDialog from '../DeployPlanManage/NodeSelectDialog.vue'
export default {
  data () {
    return {
      backupDetailData: {
        name: '',
        backType: '',
        systemName: '',
        nodeId: '',
        fileId: ''
      },
      rules: {
        name: [
          { required: true, message: '备份管理方案名称不能为空～', trigger: 'blur' },
          { min: 2, max: 20, message: '备份管理方案名称长度为2到20', trigger: 'blur' }
        ],
        backType: [
          { required: true, message: '备份方案不能为空～', trigger: 'change' }
        ],
        systemName: [
          { required: true, message: '业务系统不能为空～', trigger: 'change' }
        ],
        fileId: [
          { required: true, message: '脚本不能为空～', trigger: 'blur' }
        ],
        nodeId: [{ required: true, message: '节点不能为空～', trigger: 'blur' }]
      },
      scriptSubFormData: {
        value: '',
        system: ''
      },
      validateSubFormData: {
        value: ''
      },
      systemParams: '',
      scriptDialogVisible: false,
      nodeDialogVisible: false,
      validateDialogVisible: false,
      scriptItem: {},
      nodeItem: {},

      systemList: [],
      systemTypes: [
        { label: 'f5发布', value: '0' },
        { label: '数据库发布', value: '1' },
        { label: '应用发布', value: '2' }
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
      sysid: { id: '' }
    }
  },
  methods: {
    selectSystem (val) {
      this.backupDetailData.fileId = ''
      this.backupDetailData.nodeId = ''
      this.systemParams = val
    },
    // 选择业务系统
    getSysList () {
      let name = ''
      axios.getcigroupSystablist(name).then(res => {
        if (res.data.success) {
          this.systemList = res.data.data.result
        }
      })
    },
    selectSysName (val) {
      console.log(val)
      this.backupDetailData.systemId = val
      this.systemList.forEach(item => {
        if (item.backType == val) {
          this.backTypeName = item.name
        }
      })
    },

    selectTypeName (val) {
      this.backupDetailData.systemId = val
      this.systemList.forEach(item => {
        if (item.systemId == val) {
          this.systemName = item.name
        }
      })
    },
    // 选择脚本
    scriptSelectedHandle (data) {
      console.log(data)
      this.backupDetailData.fileId = data.name
      console.log(data.name)
      this.scriptItem = data
    },
    // 选择节点
    nodeSelectedHandle (data) {
      this.backupDetailData.nodeId = data.name
      this.nodeItem = data
    },
    // 获取详情
    getDetailData () {
      this.backPlanId = this.$route.query.backId
      axios.backupDetail(this.backPlanId).then(res => {
        this.backupDetailData = res.data.data
        this.systemParams = this.backupDetailData.systemId
        console.log(res.data.data)
      })
    },
    // 确定修改详情
    editBtn () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.backPlanId = this.$route.query.backId
          let data = {
            name: this.backupDetailData.name,
            backType: this.backupDetailData.backType,
            systemId: this.backupDetailData.systemId,
            fileId: this.backupDetailData.fileId,
            nodeId: this.backupDetailData.nodeId
          }
          axios.backupEdit(data, this.backPlanId).then(res => {
            if (res.data.code == 200) {
              this.$notify({
                title: '提示',
                message: '修改成功～',
                type: 'success'
              })
              this.$router.push({
                path: '/AutomatedRelease/backupManagement/BackspaceManagelist',
                query: { code: 3 }
              })
            } else {
              this.$notify({
                title: '提示',
                message: res.data.message,
                type: 'warning'
              })
            }
          })
        }
      })

      // if (!this.backupDetailData.name) {
      //   this.$notify({
      //     title: "提示",
      //     message: "备份管理方案名称不能为空～",
      //     type: "warning"
      //   });
      // } else if (
      //   this.backupDetailData.name.length < 2 ||
      //   this.backupDetailData.name.length > 20
      // ) {
      //   this.$notify({
      //     title: "提示",
      //     message: "备份管理方案名称长度为2到20",
      //     type: "warning"
      //   });
      // } else if (this.backupDetailData.backType == null) {
      //   this.$notify({
      //     title: "提示",
      //     message: "备份方案不能为空～",
      //     type: "warning"
      //   });
      // } else if (this.backupDetailData.systemId == null) {
      //   this.$notify({
      //     title: "提示",
      //     message: "业务系统不能为空～",
      //     type: "warning"
      //   });
      // } else if (!this.backupDetailData.fileId) {
      //   this.$notify({
      //     title: "提示",
      //     message: "节点不能为空～",
      //     type: "warning"
      //   });
      // } else if (!this.backupDetailData.nodeId) {
      //   this.$notify({
      //     title: "提示",
      //     message: "脚本不能为空～",
      //     type: "warning"
      //   });
      // } else {

      // }
    },
    // 取消修改
    cancel () {
      this.$router.push({
        path: '/AutomatedRelease/backupManagement/BackspaceManagelist',
        query: { code: 3 }
      })
    },
    a (state) {
      this.scriptDialogVisible = state
    },
    toSelectScript () {
      if (!this.backupDetailData.systemName) {
        this.$notify({
          title: '提示',
          message: '请先选择业务系统！',
          type: 'warning'
        })
      } else {
        // this.systemParams = this.backupDetailData.systemName;
        this.scriptDialogVisible = true
      }
    },
    toSelectNode () {
      if (!this.backupDetailData.systemName) {
        this.$notify({
          title: '提示',
          message: '请先选择业务系统！',
          type: 'warning'
        })
      } else {
        // this.systemParams = this.backupDetailData.systemName;
        this.nodeDialogVisible = true
      }
    },
    toSelectValidatePlan () {
      this.validateDialogVisible = true
    },
    confirm () { }
  },
  mounted () {
    this.getDetailData()
    this.getSysList()
  },
  created () {
    this.getDetailData()
    this.getSysList()
  },

  components: {
    ScriptSelectDialog,
    NodeSelectDialog
  }
}
</script>
<style scoped>
.add-deploy-manage {
  width: 100%;
  margin-top: 10px;
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
  margin-bottom: 30px;
  border-left: 5px solid #0280ff;
  font-weight: normal;
  color: #707070;
}
.add-container .form {
  min-width: 640px;
  padding-left: 80px;
}
</style>
