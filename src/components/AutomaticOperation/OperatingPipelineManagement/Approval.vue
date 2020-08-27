<template>
  <div>
    <!-- 审批信息 -->
    <div class="approve-info">
      <div class="block-content">
        <el-form
          ref="form"
          :model="baseInfoForm"
          :rules="baseInfoFormRules"
          label-width="110px"
          label-position="right"
        >
          <el-form-item style="margin-left: -68px;">
            <div class="icon-tip">
              <icon-svg icon-class="jinggao" class="gray-icon-color" />
              <div class="cont-tip">
                <span>保存为模板需要先发起审批，请先设置审批流程</span>
              </div>
            </div>
          </el-form-item>
          <el-form-item v-if="!pipename" label="流水线名称:" prop="tempname">
            <el-input
              maxlength="20"
              autocomplete="off"
              clearable
              v-model="baseInfoForm.tempname"
              placeholder="请输入模板名称"
              :style=" {width: '280px'}"
            ></el-input>
          </el-form-item>
          <el-form-item label="审批人:" prop="approvalids">
            <user-selector :selectedList.sync="baseInfoForm.approvalids" :candidates="userdata"></user-selector>
          </el-form-item>
          <el-form-item label="抄送人:">
            <user-selector :selectedList.sync="baseInfoForm.sendcopyids" :candidates="userdata"></user-selector>
          </el-form-item>
          <el-form-item label="审批原由:">
            <el-input
              autocomplete="off"
              clearable
              v-model="baseInfoForm.Reasons"
              placeholder="将私有操作流水线保存为公共模版"
              :style=" {width: '370px'}"
            ></el-input>
          </el-form-item>
          <el-form-item style="    margin-left: -110px;">
            <div class="op-btns">
              <el-button type="primary" @click="save" :style="{marginRight: '60px'}">发起审批</el-button>
              <el-button @click="cancel">取消</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import UserSelector from '../../AutomatedRelease/ToolsManagement/UserSelector.vue'
import axios from '@/api';
import common from '@/utils/commonjs'
export default {
  created () { },
  props: {
    pipename: {
      type: String,
      default: ''
    },
    environmentId: {
      type: String,
      default: ''
    },
    nodeParam: {
      type: Array,
      default: () => {
        return []
      }
    },
    approvalsNum: {
      type: String,
      default: ''
    },
    pipelineId: {
      type: String,
      default: ''
    },
    actXml: {
      type: String,
      default: ''
    },
    userdata: {
      type: Array,
      default: () => {
        return []
      }
    }
  },

  data () {
    var validateapprovalids = (rule, value, callback) => {
      if (!this.baseInfoForm.approvalids || this.baseInfoForm.approvalids.length === 0) {
        callback(new Error('请选择审批人！'))
      } else {
        callback()
      }
    }
    return {
      // 基本信息表单
      baseInfoForm: {
        isclose: false
      },
      baseInfoFormRules: {
        approvalids: [
          { required: true, validator: validateapprovalids, trigger: 'blur' }
        ],
        tempname: [
          { required: true, message: '请输入模板名称', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    save () {
      this.$refs.form.validate(valid => {
        if (valid) {
          if ((this.baseInfoForm.approvalids && this.baseInfoForm.approvalids.length === 0) || !this.baseInfoForm.approvalids) {
            return
          }
          let useridlist = []
          this.baseInfoForm.approvalids.forEach((item, index) => {
            useridlist.push({ order: index + 1, userId: item.userId })
          })
          this.nodeParam.forEach((item) => {
            if (item.resourcesIds) {
              item.multipleSelection = item.resourcesIds
              delete item.resourcesIds
            }
          })
          if (common.inspectNode(this.nodeParam)) {
            this.$notify({
              title: '提示',
              message: common.inspectNode(this.nodeParam),
              type: 'error'
            })
            return
          }
          this.$emit('ApprovalInfo', this.baseInfoForm)
          let data = {
            PipelineTemp: {
              name: this.pipename || this.baseInfoForm.tempname,
              environmentId: this.environmentId,
              approvalids: useridlist,
              sendcopyids: this.baseInfoForm.sendcopyids,
              content: this.baseInfoForm.Reasons
            },
            approvalsNum: !this.approvalsNum ? 0 : Number(this.approvalsNum),
            pipelineId: this.pipelineId,
            actXml: this.actXml,
            nodeParam: this.nodeParam
          }
          // 创建后 由后端去发起审批
          axios.createpipelineTemp(data)
            .then(res => {
              if (res.data.code === 200) {
                this.$notify({
                  title: '提示',
                  message: '审批发起成功！',
                  type: 'success'
                })
                if (this.$route.query.key) {
                  this.$router.push({
                    path: '/AutomaticOperation/OperatingPipeline',
                    query: {
                      code: 4
                    }
                  })
                }

                this.cancel()
              } else {
                this.$set(this.baseInfoForm, 'isclose', false)
                this.$notify({
                  title: '错误',
                  message: res.data.message,
                  type: 'error'
                })
              }
            })
            .catch()
        }
      })
    },
    cancel () {
      this.baseInfoForm = {}
      this.$set(this.baseInfoForm, 'isclose', true)
      this.$refs.form.resetFields()
      this.$emit('ApprovalInfo', this.baseInfoForm)
    }
  },
  computed: {},
  watch: {
  },
  components: {
    UserSelector
  },
  mounted () {
  }
}
</script>
<style scoped>
.block-title {
  font-size: 18px;
  margin-bottom: 20px;
  position: relative;
  top: 0;
  left: 0;
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
  padding-left: 54px;
}
.select-task-btn {
  margin-bottom: 20px;
  cursor: pointer;
}
.select-task-btn:hover {
  color: #0066ff;
}
.readonly-timeline {
  width: 60%;
}
.save-and-cancel {
  text-align: center;
}

.icon-tip > img {
  display: inline-block;
  vertical-align: middle;
}
.cont-tip {
  background-image: url("../../../../static/img/icon/bg_tip.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 96%;
  width: 45%;
  display: inline-block;
  vertical-align: middle;
}
.cont-tip > span {
  margin-left: 34px;
  font-size: 14px;
  color: #3e444a;
}
.op-btns {
  text-align: center;
}
</style>
