<template>
  <div>
    <!-- 流水线节点弹框 -->
    <el-dialog title="编辑节点" :visible.sync="isShow" center :before-close="pipelineCancel">
      <el-form
        ref="pipelineForm"
        :model="pipelineForm"
        label-width="100px"
        :inline="true"
        :rules="pipelineFormRules"
      >
        <el-form-item label="节点名称: " class="disinlne display-form" prop="actNodeJobId">
          <el-select
            v-model="pipelineForm.actNodeJobId"
            placeholder="请选择任务流水线"
            style="width:100%"
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
        <el-form-item class="disinlne display-form checkbox-form" prop="checked">
          <el-checkbox :disabled="status === 'read'" v-model="pipelineForm.checked">是否为合并节点</el-checkbox>
        </el-form-item>
        <el-form-item label="任务依赖: " class="disinlne display-form" prop="jobtaskStrategy">
          <el-select
            v-model="pipelineForm.jobtaskStrategy"
            placeholder="请选择任务依赖"
            style="width:100%"
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
        <!-- <el-form-item label="参数初始化: " class="disinlne" prop="jobtaskStrategy">
          <el-select
            v-model="pipelineForm.jobtaskStrategy"
            placeholder="请选择制品库"
            style="width:30%"
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
          <el-select
            v-model="pipelineForm.jobtaskStrategy"
            placeholder="请选择仓库"
            style="width:30%"
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
          <el-select
            v-model="pipelineForm.jobtaskStrategy"
            placeholder="请选择应用"
            style="width:30%"
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
        <el-form-item label="清除空间: " class="disinlne" prop="jobtaskStrategy">
          <el-select
            v-model="pipelineForm.jobtaskStrategy"
            placeholder="请选择制品库"
            style="width:30%"
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
          <el-select
            v-model="pipelineForm.jobtaskStrategy"
            placeholder="请选择仓库"
            style="width:30%"
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
          <el-select
            v-model="pipelineForm.jobtaskStrategy"
            placeholder="请选择应用"
            style="width:30%"
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
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer-form" :style="{textAlign: 'center'}">
        <el-button type="primary" @click="getNodeParams" style="margin-right: 100px">确 定</el-button>
        <el-button @click="pipelineCancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from '@/api';
export default {
  name: 'WorkflowDialog',
  props: {
    // 业务系统id
    systemId: {
      type: String,
      default: () => {
        return ''
      }
    },
    ShowDialog: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    // 任务列表
    pipelineList: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 这是节点id
    ID: {
      type: String,
      default: () => {
        return ''
      }
    },
    status: {
      type: String,
      default: () => {
        return ''
      }
    },
    // 弹出框数据
    pipelineFormData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      // 流水线信息
      pipelineForm: {
        actNodeName: '',
        checked: false,
        jobtaskStrategy: '',
        actNodeJobId: ''
      },
      // 制品库列表信息
      search: {
        name: '',
        accountNumber: '',
        detectionStatus: '',
        current: 0,
        size: 10
      },
      // 是否显示弹窗
      isShow: false,
      actNodeName: '',
      pipelineFormRules: {},
      // 制品库列表
      productWarehouse: [],
      // 仓库列表
      warehouse: [],
      // 应用列表
      appList: [],
      // 依赖列表
      jobtaskStrategyList: [
        {
          value: 'success',
          label: '前置任务成功后执行'
        },
        {
          value: 'failed',
          label: '前置任务失败后执行'
        },
        {
          value: 'always',
          label: '前置任务执行后执行'
        }
      ]
    }
  },
  watch: {
    ShowDialog: {
      handler (newValue, oldValue) {
        this.isShow = newValue
        if (newValue) {
          if (JSON.stringify(this.pipelineFormData).indexOf(this.ID) > -1) {
            this.pipelineFormData.forEach(item => {
              if (item.actNodeId == this.ID) {
                this.$set(this.pipelineForm, 'actNodeJobId', item.jobTaskId)
                this.$set(this.pipelineForm, 'checked', item.checked)
                this.$set(
                  this.pipelineForm,
                  'jobtaskStrategy',
                  item.jobtaskStrategy
                )
                if (!item.jobTaskId) {
                  this.pipelineForm.actNodeJobId = ''
                }
              }
            })
          } else {
            this.pipelineForm.actNodeJobId = ''
          }
          if (!this.systemId) {
            this.$notify({
              title: '错误提示',
              message: '请选择业务系统后选择流水线',
              type: 'error'
            })
          }
        }
      },
      deep: true
    }
  },
  methods: {
    // 因为数据源是由接口请求而来，数据量过大时，render函数没有自动更新，需手动强制刷新
    changeValue () {
      this.$forceUpdate()
    },
    pipelineCancel () {
      this.isShow = false
      this.$emit('update:ShowDialog', this.isShow)
      this.$set(this.pipelineForm, 'actNodeJobId', '')
      this.$set(this.pipelineForm, 'checked', false)
      this.$set(this.pipelineForm, 'jobtaskStrategy', '')
    },
    // 转换node节点名称
    returnNodeName () {
      let name = ''
      this.pipelineList.forEach(item => {
        if (this.pipelineForm.actNodeJobId == item.value) {
          name = item.label
        }
      })
      return name
    },
    // 获取nodeparam
    getNodeParams () {
      this.actNodeName = this.returnNodeName(this.pipelineForm.actNodeJobId)
      if (this.pipelineFormData.length > 0) {
        if (JSON.stringify(this.pipelineFormData).indexOf(this.ID) > -1) {
          this.pipelineFormData.forEach(item => {
            if (item.actNodeId == this.ID) {
              item.actNodeName = this.returnNodeName(
                this.pipelineForm.actNodeJobId
              )
              item.jobTaskId = this.pipelineForm.actNodeJobId
              item.checked = this.pipelineForm.checked
              item.jobtaskStrategy = this.pipelineForm.jobtaskStrategy
            }
          })
        } else {
          this.pipelineFormData.push({
            actNodeName: this.returnNodeName(this.pipelineForm.actNodeJobId),
            jobTaskId: this.pipelineForm.actNodeJobId,
            checked: this.pipelineForm.checked,
            jobtaskStrategy: this.pipelineForm.jobtaskStrategy,
            actNodeId: this.ID
          })
        }
      } else {
        this.pipelineFormData.push({
          actNodeName: this.returnNodeName(this.pipelineForm.actNodeJobId),
          jobTaskId: this.pipelineForm.actNodeJobId,
          checked: this.pipelineForm.checked,
          jobtaskStrategy: this.pipelineForm.jobtaskStrategy,
          actNodeId: this.ID
        })
      }
      let data = {
        actNodeName: this.actNodeName,
        NodeParams: this.pipelineFormData
      }
      console.log(data)
      this.$emit('confirm', data)
      this.pipelineCancel()
    },
    //  获取制品库配置列表
    getProductConfigList () {
      axios.productConfigList(this.search)
        .then(result => {
          if (result.data.code === 200) {
            let list = result.data.data.records
            list.forEach(config => {
              config.isDetecting = false
            })
          } else {
            this.$notify({
              title: '提示',
              message: result.data.message,
              duration: 2000,
              type: 'error'
            })
          }
        })
        .catch(e => {
          this.$notify({
            title: '提示',
            message: '查询出错，请稍后重试',
            duration: 2000,
            type: 'error'
          })
        })
    }
  },
  mounted () {
    this.getProductConfigList()
  }
}
</script>

<style lang="scss" >
.display-form {
  width: 100% !important;
  .el-form-item__content {
    width: 80% !important;
  }
}
.checkbox-form {
  padding-left: 100px !important;
}
.m-l-100 {
  margin-left: 100px;
  position: relative;
  label {
    position: absolute;
    left: -88px;
  }
  .clear-space {
    left: -70px;
  }
}
.inline-form {
  width: 28% !important;
  margin-right: 0 !important;
  .el-form-item__content {
    width: 100% !important;
  }
}
</style>
