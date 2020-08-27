<template>
  <div class="add-deploy-manage">
    <div class="add-container aibms-color-bg non-border non-shadow">
      <h3 class="add-title white-color">新建备份方案</h3>
      <div class="form">
        <el-form
          :rules="rules"
          ref="form"
          :label-position="'left'"
          :model="data"
          label-width="130px"
        >
          <!-- <div>
            <span
              style="display:inline-block;color:red;float:left;line-height:40px;margin-right:5px;"
          >*</span>-->
          <el-form-item label="备份方案名称:" prop="name">
            <el-input placeholder="备份方案名称" style="width:632px" v-model="data.name"></el-input>
          </el-form-item>
          <!-- </div> -->
          <!-- <div>
            <span
              style="display:inline-block;color:red;float:left;line-height:40px;margin-right:5px;"
          >*</span>-->
          <el-form-item label="备份方案:" prop="deployPlanType">
            <el-select
              v-model="data.deployPlanType"
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
          <!-- </div>
          <div>
            <span
              style="display:inline-block;color:red;float:left;line-height:40px;margin-right:5px;"
          >*</span>-->
          <el-form-item label="业务系统:" prop="system">
            <el-select v-model="data.system" style="width:632px" @change="selectSystem">
              <el-option
                v-for="system in systemList"
                :key="system.systemId"
                :label="system.name"
                :value="system.systemId"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- </div>
          <div>
            <span
              style="display:inline-block;color:red;float:left;line-height:40px;margin-right:5px;"
          >*</span>-->
          <el-form-item label="选择节点:" prop="node">
            <el-input v-model="data.node" :style="{width: '632px',marginRight: '20px'}" disabled></el-input>
            <el-button type="primary" @click="toSelectNode">选择节点</el-button>
          </el-form-item>
          <!-- </div>
          <div>
            <span
              style="display:inline-block;color:red;float:left;line-height:40px;margin-right:5px;"
          >*</span>-->
          <el-form-item label="选择脚本:" prop="script">
            <el-input v-model="data.script" :style="{width: '632px',marginRight: '20px'}" disabled></el-input>
            <el-button type="primary" @click="toSelectScript">选择脚本</el-button>
          </el-form-item>
          <!-- </div> -->
          <div>
            <el-form-item>
              <el-button type="primary" @click="addbtn">确认新增</el-button>
              <el-button @click="cancel" class="nomal-button">取消</el-button>
            </el-form-item>
          </div>
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
import ScriptSelectDialog from '../DeployPlanManage/ScriptSelectDialog'
import NodeSelectDialog from '../DeployPlanManage/NodeSelectDialog'
import {
  initFileds,
  checkModification,
  onbeforeunload
} from '../../../utils/reload.js'
export default {
  data () {
    return {
      isbl: false,
      n: 0,
      scriptItem: {},
      nodeItem: {},
      data: {
        name: '',
        deployPlanType: '',
        system: '',
        script: '',
        node: ''
      },
      rules: {
        name: [
          { required: true, message: '备份管理方案名称不能为空～', trigger: 'blur' },
          { min: 2, max: 20, message: '备份管理方案名称长度为2到20', trigger: 'blur' }
        ],
        deployPlanType: [
          { required: true, message: '备份方案不能为空～', trigger: 'change' }
        ],
        system: [
          { required: true, message: '业务系统不能为空～', trigger: 'change' }
        ],
        script: [
          { required: true, message: '脚本不能为空～', trigger: 'blur' }
        ],
        node: [{ required: true, message: '节点不能为空～', trigger: 'blur' }]
      },
      systemParams: '',

      scriptSubFormData: {
        value: '',
        system: ''
      },
      validateSubFormData: {
        value: ''
      },
      scriptDialogVisible: false,
      nodeDialogVisible: false,
      systemList: [],
      systemTypes: [
        { label: 'f5发布', value: 0 },
        { label: '数据库发布', value: 1 },
        { label: '应用发布', value: 2 }
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
      ]
    }
  },
  methods: {
    a (state) {
      this.data.scriptDialogVisible = state
    },
    selectSystem (val) {
      this.data.script = ''
      this.data.node = ''
      this.data.systemParams = val
    },
    // 取消新增
    cancel () {
      this.$router.push({
        path: '/AutomatedRelease/backupManagement/BackspaceManagelist',
        query: { code: 3 }
      })
    },
    toSelectScript () {
      if (!this.data.system) {
        this.$notify({
          title: '提示',
          message: '请先选择业务系统！',
          type: 'warning'
        })
      } else {
        this.data.systemParams = this.data.system
        this.data.scriptDialogVisible = true
      }
    },
    toSelectNode () {
      if (!this.data.system) {
        this.$notify({
          title: '提示',
          message: '请先选择业务系统！',
          type: 'warning'
        })
      } else {
        this.data.systemParams = this.data.system
        this.data.nodeDialogVisible = true
      }
    },
    toSelectValidatePlan () {
      this.validateDialogVisible = true
    },
    // 选择业务系统
    getSysList () {
      let name = ''
      axios.getcigroupSystablist(name).then(res => {
        if (res.data.success) {
          this.data.systemList = res.data.data.result
        }
      })
    },
    // 选择脚本
    scriptSelectedHandle (data) {
      console.log(data)
      this.data.script = data.name
      this.data.scriptItem = data
    },
    // 选择节点
    nodeSelectedHandle (data) {
      this.data.node = data.name
      this.data.nodeItem = data
    },
    // 新增确认按钮
    addbtn () {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.n > 0) {
            return false
          }
          this.isbl = true

          axios.addBackPLan(this.data).then(res => {
            if (res.data.code == 200) {
              this.n++
              this.$notify({
                title: '提示',
                message: '新增成功～',
                type: 'success'
              })
              this.$router.push({
                path: '/AutomatedRelease/backupManagement/BackspaceManagelist',
                query: { code: 3 }
              })
            } else {
              this.isbl = false
              this.$notify({
                title: '提示',
                message: res.data.message,
                type: 'warning'
              })
            }
          })
        }
      })
      // let data = {
      //   name: this.data.name,
      //   backType: this.data.deployPlanType,
      //   systemId: this.data.system,
      //   fileId: this.data.script,
      //   nodeId: this.data.node
      // };
      // if (!this.data.name) {
      //   this.$notify({
      //     title: "提示",
      //     message: "备份管理方案名称不能为空～",
      //     type: "warning"
      //   });
      // } else if (this.data.name.length < 2 || this.data.name.length > 20) {
      //   this.$notify({
      //     title: "提示",
      //     message: "备份管理方案名称长度为2到20",
      //     type: "warning"
      //   });
      // } else if (this.data.deployPlanType == null) {
      //   this.$notify({
      //     title: "提示",
      //     message: "备份方案不能为空～",
      //     type: "warning"
      //   });
      // } else if (this.data.system == null) {
      //   this.$notify({
      //     title: "提示",
      //     message: "业务系统不能为空～",
      //     type: "warning"
      //   });
      // } else if (!this.data.node) {
      //   this.$notify({
      //     title: "提示",
      //     message: "节点不能为空～",
      //     type: "warning"
      //   });
      // } else if (!this.data.script) {
      //   this.$notify({
      //     title: "提示",
      //     message: "脚本不能为空～",
      //     type: "warning"
      //   });
      // } else {

      // }
    },
    // 取消新增

    selectScript () { },

    selectValidatePlan () { }
  },
  beforeRouteLeave (to, from, next) {
    let bl = checkModification(this.isbl)
    if (bl) {
      const answer = window.confirm(
        '页面相关数据还未保存，是否离开当前页面!'
      )
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
  mounted () {
    this.getSysList()
    onbeforeunload()
    initFileds()
  },
  beforeDestroy () { },
  destroyed () {
    window.onbeforeunload = null
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
