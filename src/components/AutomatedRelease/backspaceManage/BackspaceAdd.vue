<template>
  <div class="backspace-layout">
    <div class="backspce-detail aibms-color-bg">
      <div class="backspace-title white-color" v-if="key==='edit'">
        <span></span> 修改回退方案
      </div>
      <div class="backspace-title white-color" v-else>
        <span></span> 新建回退方案
      </div>
      <div class="backspace-pannel">
        <el-form
          :model="data"
          :rules="rules"
          ref="ruleForm"
          label-width="130px"
          class="demo-ruleForm"
        >
          <el-form-item label="所属系统：" prop="systemId">
            <el-select style="width: 632px" v-model="data.systemId" placeholder="选择所需系统" @change="selectSystem">
              <el-option
                v-for="item in systemTypes"
                :key="item.value"
                :label="item.name"
                :value="item.systemId"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- <div class="form-item">
                        <label for="">所属系统：</label>
                        <el-row :gutter="20">
          <el-col :span='10'><div class="grid-content bg-purple">-->

          <!-- </div></el-col>
          </el-row>-->
          <!-- <el-row class="node-alert" :gutter="20" v-if="key!='edit'">
                        <img src="../../../../static/img/group_colse.png" alt="">必填项
          </el-row>-->
          <!-- </div> -->
          <!-- <div class="form-item">
                        <label for="">回退方案名称：</label>
                        <el-row :gutter="10">
          <el-col :span='8'><div class="grid-content bg-purple">-->
          <el-form-item label="回退方案名称：" prop="name" label-width="128px" style="    width: 27.4%;">
            <el-input v-model="data.name" style="width: 632px"></el-input>
          </el-form-item>
          <!-- </div></el-col>
          </el-row>-->
          <!-- <el-row class="node-alert" :gutter="20" v-if="key!='edit'">
                        <img src="../../../../static/img/group_colse.png" alt="">必填项且长度不能超过12位
          </el-row>-->
          <!-- </div> -->
          <!-- <div class="form-item">
                        <label for="">回退方案类型：</label>
                        <el-row :gutter="20">
          <el-col :span='10'><div class="grid-content bg-purple">-->
          <el-form-item label="回退方案类型：" prop="regeretPlanType" label-width="128px">
            <el-select style="width: 632px" v-model="data.regeretPlanType" placeholder="选择回退方案类型">
              <el-option
                v-for="item in backspaceTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- </div></el-col>
          </el-row>-->
          <!-- <el-row class="node-alert" :gutter="20" v-if="key!='edit'">
                        <img src="../../../../static/img/group_colse.png" alt="">必填项
          </el-row>-->
          <!-- </div> -->
          <!-- <div class="form-item">
                        <label for="">节点选择：</label>
                        <el-row :gutter="10">
          <el-col :gutter="10"><div class="grid-content bg-purple">-->
          <el-form-item label="节点选择：" prop="nodeName">
            <el-input style="width: 632px" clearable disabled v-model="data.nodeName"></el-input>
            <el-button :span="5" type="primary" @click="toSelectNode">选择</el-button>
          </el-form-item>
          <!-- </div></el-col>

          </el-row>-->
          <!-- <el-row class="node-alert" :gutter="20" v-if="key!='edit'">
                        <img src="../../../../static/img/group_colse.png" alt="">必填项
          </el-row>-->
          <!-- </div> -->
          <!-- <div class="form-item">
                        <label for="">脚本：</label>
                        <el-row :gutter="10">
          <el-col :gutter="10"><div class="grid-content bg-purple">-->
          <el-form-item label="脚本：" prop="fileName">
            <el-input style="width: 632px" clearable disabled v-model="data.fileName"></el-input>
            <el-button :span="5" type="primary" @click="selectScript">选择</el-button>
          </el-form-item>
          <!-- </div></el-col>

          </el-row>-->
          <!-- <el-row class="node-alert" :gutter="20"  v-if="key!='edit'">
                        <img src="../../../../static/img/group_colse.png" alt="">必填项
          </el-row>-->
          <!-- </div> -->
          <!-- <ScriptSelectDialog
                            @confirm="scriptSelectedHandle"
                            :dialogVisible.sync="scriptDialogVisible"
          />-->
        </el-form>
        <div class="form-item dialog-btn">
              <div class="grid-content bg-purple">
                <el-button
                  v-if="key==='edit'"
                  @click="modifybackspaceItem"
                  class="nomal-button"
                  type="primary"
                >修改</el-button>
                <el-button
                  v-else
                  @click="backspaceItemsubmit"
                  type="primary"
                  :disabled="isdisabled"
                >确认</el-button>
                <el-button @click="cancelDialog" class="nomal-button">取消</el-button>
              </div>
        </div>
      </div>
    </div>
    <node-select-dialog
      :systemParams="systemParams"
      @confirm="nodeSelectedHandle"
      :dialogVisible.sync="nodeDialogVisible"
    ></node-select-dialog>
    <script-select-dialog
      :systemParams="systemParams"
      @confirm="scriptSelectedHandle"
      :dialogVisible.sync="scriptDialogVisible"
    ></script-select-dialog>
  </div>
</template>

<script>
import axios from '@/api';
import ScriptSelectDialog from '../DeployPlanManage/ScriptSelectDialog.vue'
import NodeSelectDialog from '../DeployPlanManage/NodeSelectDialog.vue'
import {
  initFileds,
  checkModification,
  onbeforeunload
} from '../../../utils/reload.js'
export default {
  name: 'BackspaceAdd',
  data () {
    return {
      isbl: false,
      isShowDialogView: false,
      scriptDialogVisible: false,
      isShowDialog: false,
      systemTypes: [],
      data: {
        systemId: '',
        regeretPlanType: '',
        name: '',
        nodeName: '',
        fileName: ''
      },
      rules: {
        systemId: [
          { required: true, message: '请选择所属系统!', trigger: 'change' }
        ],
        regeretPlanType: [
          { required: true, message: '请选择回退方案类型!', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入回退方案名称!', trigger: 'blur' },
          { max: 20, message: '回退方案名称长度最多12位', trigger: 'blur' }
        ],
        nodeName: [{ required: true, message: '请选择节点!', trigger: 'blur' }],
        fileName: [{ required: true, message: '请选择脚本!', trigger: 'blur' }]
      },
      key: '',
      nodeDialogVisible: false,
      isdisabled: false,
      backspaceTypes: [
        { label: 'F5发布回退', value: '1' },
        { label: '数据库发布回退', value: '2' },
        { label: '应用发布回退', value: '3' }
      ],
      systemParams: ''
    }
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
  mounted () {
    onbeforeunload()
    initFileds()
  },
  created () {
    this.getSystemList()
    this.data = {}
    if (this.$route.query.key === 'edit') {
      let regretId = this.$route.query.id
      this.key = 'edit'
      axios.seeBackspacedetail(regretId).then(data => {
        if (data.data.code === 200) {
          this.data = data.data.data
          this.systemParams = this.data.systemId
        } else {
          this.$notify({
            title: '提示',
            message: data.data.message,
            type: 'error'
          })
        }
      })
    }
  },
  components: {
    ScriptSelectDialog: ScriptSelectDialog,
    NodeSelectDialog: NodeSelectDialog
  },
  methods: {
    selectSystem (val) {
      this.systemParams = val
      this.data.nodeName = ''
      this.data.fileName = ''
    },
    nodeSelectedHandle (data) {
      this.data.nodeName = data.name
      this.data.nodeId = data.nodeId
    },
    // 选择节点
    toSelectNode () {
      if (this.data.systemId) {
        this.nodeDialogVisible = true
      } else {
        this.$notify({
          title: '提示',
          message: '请先选择所属系统',
          type: 'warning'
        })
      }
    },
    // 选择脚本
    selectScript () {
      if (this.data.systemId) {
        this.scriptDialogVisible = true
      } else {
        this.$notify({
          title: '提示',
          message: '请先选择所属系统',
          type: 'warning'
        })
      }
    },
    editBackspaceItem () {
      axios.modifyBackspace(this.data).then(data => {
        if (data.data.code === 200) {
          this.$notify({
            title: '提示',
            message: '修改成功！',
            type: 'success'
          })
          this.$router.push({
            path: '/AutomatedRelease/BackspaceManage',
            query: { code: 3 }
          })
        } else {
          this.$notify({
            title: '提示',
            message: data.data.message,
            type: 'error'
          })
        }
      })
    },
    addBackspaceItem () {
      delete this.data.nodeName
      delete this.data.fileName
      this.isdisabled = true
      setTimeout(() => {
        this.isdisabled = false
      }, 1000)
      this.isbl = true
      axios.addBackspace(this.data).then(data => {
        if (data.data.code === 200) {
          this.$notify({
            title: '提示',
            message: '添加成功！',
            type: 'success'
          })

          this.$router.push({
            path: '/AutomatedRelease/BackspaceManage',
            query: { code: 3 }
          })
        } else {
          this.isbl = false
          this.$notify({
            title: '提示',
            message: data.data.message,
            type: 'error'
          })
        }
      })
    },
    // selectBackupHandle(data) {
    //     this.isShowDialogView = false;
    //     this.data.backId = data.backId;
    //     this.data.backName = data.name
    //
    // },
    selectBackupItem () {
      this.isShowDialogView = true
    },
    scriptSelectedHandle (data) {
      this.data.fileId = data.fileId
      this.data.fileName = data.name
    },

    getSystemList () {
      let name = ''
      axios.getcigroupSystablist(name).then(data => {
        if (data.data.code === 200) {
          this.systemTypes = data.data.data.result
        } else {
          this.$notify({
            title: '提示',
            message: data.data.message,
            type: 'error'
          })
        }
      })
    },
    cancelDialog () {
      this.$router.push({
        path: '/AutomatedRelease/BackspaceManage',
        query: { code: 3 }
      })
    },
    // 点击新增回退
    backspaceItemsubmit () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.addBackspaceItem()
        }
      })
      //   if (!this.data.systemId) {
      //     this.$notify({
      //       title: "提示",
      //       message: "请选择所属系统",
      //       type: "warning"
      //     });
      //   } else if (!this.data.name) {
      //     this.$notify({
      //       title: "提示",
      //       message: "请输入回退方案名称",
      //       type: "warning"
      //     });
      //   } else if (this.data.name.length > 12) {
      //     this.$notify({
      //       title: "提示",
      //       message: "回退方案名称长度最多12位",
      //       type: "warning"
      //     });
      //   } else if (!this.data.regeretPlanType) {
      //     this.$notify({
      //       title: "提示",
      //       message: "请选择回退方案类型",
      //       type: "warning"
      //     });
      //   } else if (!this.data.nodeName) {
      //     this.$notify({
      //       title: "提示",
      //       message: "请选择节点",
      //       type: "warning"
      //     });
      //   } else if (!this.data.fileName) {
      //     this.$notify({
      //       title: "提示",
      //       message: "请选择脚本",
      //       type: "warning"
      //     });
      //   } else {
      //     this.addBackspaceItem();
      //   }
    },
    // 点击修改按钮
    modifybackspaceItem () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.editBackspaceItem()
        }
      })
      //   if (!this.data.systemId) {
      //     this.$notify({
      //       title: "提示",
      //       message: "请选择所属系统",
      //       type: "warning"
      //     });
      //   } else if (!this.data.name) {
      //     this.$notify({
      //       title: "提示",
      //       message: "请输入回退方案名称",
      //       type: "warning"
      //     });
      //   } else if (this.data.name.length > 12) {
      //     this.$notify({
      //       title: "提示",
      //       message: "回退方案名称长度最多12位",
      //       type: "warning"
      //     });
      //   } else if (!this.data.regeretPlanType) {
      //     this.$notify({
      //       title: "提示",
      //       message: "请选择回退方案类型",
      //       type: "warning"
      //     });
      //   } else if (!this.data.nodeName) {
      //     this.$notify({
      //       title: "提示",
      //       message: "请选择节点",
      //       type: "warning"
      //     });
      //   } else if (!this.data.fileName) {
      //     this.$notify({
      //       title: "提示",
      //       message: "请选择脚本",
      //       type: "warning"
      //     });
      //   } else {
      //     this.editBackspaceItem();
      //   }
    }
  }
}
</script>

<style scoped>
.backspace-layout {
  margin-top: 10px;
}
.node-alert {
  padding: 4px 10px 8px;
  color: #ff0000;
  font-size: 12px;
}
.node-alert img {
  height: 14px;
  margin-right: 5px;
  vertical-align: text-bottom;
}
.form-item_w {
  width: 300px !important;
}

.backspace-pannel {
  padding: 20px 0 20px 0;
}
.backspce-detail {
  background: #fff;
}
.form-item {
  padding-left: 140px;
  position: relative;
  padding-top: 10px;
  min-height: 30px;
}
.form-item .el-input {
  width: 100%;
}
.form-item label {
  position: absolute;
  left: 0;
  top: 10px;
  width: 130px;
  text-align: right;
  line-height: 30px;
  font-size: 14px;
  color: #3e444a;
}
.get-title {
  font-size: 18px;
  font-weight: normal;
  padding-bottom: 10px;
  text-align: center;
}
.dialog-btn {
  padding: 20px 0;
  text-align: center;
}
.dialog-btn .btn-cancel {
  float: right;
}
.dialog-btn .btn-info {
}
.backspce-detail .close-btn {
  float: right;
}
.backspce-detail .el-tabs__item {
  padding: 0 20px;
  height: 40px !important;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  line-height: 40px !important;
  display: inline-block;
  list-style: none;
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  position: relative;
}
.backspce-detail .el-tabs__item.is-active {
  color: #00d1b2 !important;
}
.gap-item {
  margin-top: 10px;
}
.backspace-title {
  color: #585858;
  font-size: 14px;
  padding: 20px 0 0;
}
.backspace-title span {
  display: inline-block;
  width: 6px;
  border-radius: 10px;
  margin-right: 20px;
  height: 20px;
  background: #0280ff;
  vertical-align: middle;
}
</style>
