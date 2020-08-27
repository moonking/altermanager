<template>
  <div class="p10">
    <div class="wrapper_pannel aibms-color-bg">
      <div class="block-item base-info">
        <!-- <div class="block-title" @click="switchBlock(1)">
          <div class="title-tips"></div>
          <h3>
            基本信息
            <i
              class="icons el-icon-arrow-right"
              :style="{transform: blockSwitch[1] ? 'rotate(90deg)' : 'rotate(0)',color:'#0066FF','margin-left':'10px'}"
            ></i>
          </h3>
        </div>-->
        <div class="item-block-title" @click="switchBlock(1)">
          <div class="item-block-title-mark"></div>
          <span class="item-block-title-font">基本信息</span>
          <i
            class="icons el-icon-arrow-right"
            :style="{transform: blockSwitch[1] ? 'rotate(90deg)' : 'rotate(0)'}"
          ></i>
        </div>
        <div class="block-content" :style="{height: blockSwitch[1] ? 'auto' : '0' }">
          <el-form
            :model="pipelineForm"
            label-width="70px"
            ref="form"
            label-position="right"
            :rules="pipelineFormRules"
          >
            <el-form-item label="名称：" prop="name">
              <el-input
                :disabled="$route.query.key=='detail'"
                maxlength="20"
                clearable
                v-model.trim="pipelineForm.name"
                placeholder="请输入操作流水线名称"
                :style=" {width: '280px'}"
              />
            </el-form-item>
            <el-form-item label="环境：" prop="env">
              <el-select
                :style="{width: '280px'}"
                v-model="envid"
                @change="getenvid"
                :disabled="$route.query.key=='detail'"
                placeholder="请选择所属环境"
              >
                <el-option
                  v-for="item in Envlist"
                  :label="item.label"
                  :value="item.value"
                  :key="item.value"
                />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="block-item task-process">
        <!-- <div class="block-title" @click="switchBlock(2)">
          <div class="title-tips"></div>
          <h3>
            任务流程设计
            <i
              class="icons el-icon-arrow-right"
              :style="{transform: blockSwitch[2] ? 'rotate(90deg)' : 'rotate(0)',color:'#0066FF','margin-left':'10px'}"
            ></i>
          </h3>
        </div>-->
        <div class="item-block-title" @click="switchBlock(2)">
          <div class="item-block-title-mark"></div>
          <span class="item-block-title-font">任务流程设计</span>
          <i
            class="icons el-icon-arrow-right"
            :style="{transform: blockSwitch[2] ? 'rotate(90deg)' : 'rotate(0)'}"
          ></i>
        </div>
        <div class="block-content" style="overflow: visible;">
          <div v-if="blockSwitch[2]" style="border: 1px solid #ccc;width: 98%;position: relative; ">
            <Workflow @confirm="getId" :activityData="activityData" />
          </div>
        </div>
      </div>

      <div class="op-btns" v-if="key !='detail' && key !='edit'">
        <el-button type="primary" @click="Newpipeline" :style="{marginRight: '60px'}">保存</el-button>
        <el-button type="primary" @click="CreatepipelineTemp" :style="{marginRight: '60px'}">另存为模板</el-button>

        <el-button @click="cancelAdd" class="nomal-button">取消</el-button>
      </div>

      <div class="op-btns" v-if="key =='edit'">
        <el-button type="primary" @click="editpipeline" :style="{marginRight: '60px'}">确定修改</el-button>
        <el-button type="primary" @click="CreatepipelineTemp" :style="{marginRight: '60px'}">另存为模板</el-button>
        <el-button @click="cancelAdd" class="nomal-button">取消</el-button>
      </div>
    </div>
    <el-dialog
      :visible.sync="isApproval"
      title="存为模板"
      center
      :before-close="handleDialogClose"
      width="1000px"
    >
      <Approval
        v-if="isApproval"
        :userdata="userlist"
        :pipename="pipelineForm.name"
        :environmentId="envid"
        :nodeParam="getNodeParam"
        :actXml="getActXml"
        :pipelineId="pipelineId"
        @ApprovalInfo="getApprovaldata"
      />
    </el-dialog>
  </div>
</template>
<script>
import Workflow from '../pipeline-workflow.vue'
import Approval from './Approval.vue'
import common from '@/utils/commonjs'
import axios from '@/api';
export default {
  data () {
    var validatetestenv = (rule, value, callback) => {
      if (!this.envid) {
        callback(new Error('请选择环境'))
      } else {
        callback()
      }
    }
    return {
      updateNum: '',
      ischangename: false,
      copyname: '',
      isApproval: false,
      blockSwitch: { '1': true, '2': false },
      pipelineId: '',
      tempId: '',
      activityData: {},
      pipelineForm: {},
      pipelineFormRules: {
        name: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
        env: [{ required: true, validator: validatetestenv, trigger: 'blur' }]
      },
      ischange: false,
      nodeParam: [],
      actXml: '',
      key: '',
      Envlist: [],
      envid: '',
      userlist: [],
      copyuserlist: []
    }
  },
  created () {
    this.getquery()
    this.getenvtablist()
    this.getuserlist()
  },
  watch: {},
  components: {
    Workflow,
    Approval
  },
  methods: {
    getenvid () {
      if (this.key === 'create') {
        this.$set(this.activityData, 'envid', this.envid)
      }
    },
    getApprovaldata (data) {
      if (data.isclose || data.approvalids.length > 0) {
        this.isApproval = false
      }
    },
    handleDialogClose () {
      this.isApproval = false
    },
    // 获取用户列表
    getuserlist () {
      axios.userList({
        condition: '',
        current: 1,
        online: false,
        roleIds: [],
        size: 10000,
        userStatus: ''
      })
        .then(res => {
          this.copyuserlist = res.data.data.result.records.concat()
          this.userlist = res.data.data.result.records
        })
        .catch()
    },
    // 获取路由参数
    getquery () {
      let query = this.$route.query

      if (query.key === 'edit') {
        this.key = 'edit'
      } else if (query.key === 'detail') {
        this.key = 'detail'
        this.blockSwitch[2] = false
      } else if (query.key === 'create') {
        this.key = 'create'
      }
      if (query.pipelineId && this.key !== 'create') {
        this.pipelineId = query.pipelineId
        this.getdetailpipeline()
      }
      if (query.tempId && this.key !== 'create') {
        this.tempId = query.tempId
        this.DeatilpipelineTemp()
      }
    },
    // 根据节点id查询节点详情
    getId (data) {
      this.ischange = true
      this.actXml = data.actXml
      this.nodeParam = data.nodeParam
      console.log(this.nodeParam)
    },

    switchBlock (index) {
      return (this.blockSwitch[index] = !this.blockSwitch[index])
    },

    // 新增流水线任务
    Newpipeline () {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (common.inspectNode(this.nodeParam)) {
            this.$notify({
              title: '提示',
              message: common.inspectNode(this.nodeParam),
              type: 'error'
            })
            return
          }
          let data = {
            name: this.pipelineForm.name,
            environmentId: this.envid,
            actXml: this.actXml,
            nodeParam: this.nodeParam
          }
          axios.createpipeline(data)
            .then(res => {
              if (res.data.code === 200) {
                this.$notify({
                  title: '提示',
                  message: '新增成功！',
                  type: 'success'
                })
                this.$router.push({
                  path: '/AutomaticOperation/OperatingPipeline',
                  query: {
                    code: 4
                  }
                })
              } else {
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
    // 另存为模板
    CreatepipelineTemp () {
      this.$refs.form.validate(valid => {
        // if (this.nodeParam) {
        //   this.nodeParam.forEach(item => {
        //     if (!item.businessType) {
        //       this.$notify({
        //         title: '提示',
        //         message: '请选择节点脚本！',
        //         type: 'error'
        //       });
        //       return false;
        //     }
        //   });
        // }
        if (valid) {
          this.userlist = []
          this.userlist = this.copyuserlist
          this.isApproval = true
        }
      })
    },
    // 查看公共模板详情
    DeatilpipelineTemp () {
      axios.deatilpipelineTemp(this.tempId)
        .then(res => {
          if (res.data.success) {
            this.$set(this.pipelineForm, 'name', res.data.data.name)
            this.envid = res.data.data.environmentId
            this.activityData.actXml = res.data.data.actXml
            this.activityData.nodeParam = res.data.data.tempNodeparams
          }
        })
        .catch()
    },
    // 修改流水线任务
    editpipeline () {
      this.$refs.form.validate(valid => {
        let data = {}
        if (this.pipelineForm.name !== this.copyname) {
          this.ischangename = true
        }
        data = {
          pipelineId: this.pipelineId,
          name: this.ischangename ? this.pipelineForm.name : '',
          environmentId: this.envid,
          actXml: this.ischange ? this.actXml : this.activityData.actXml,
          nodeParam: this.ischange
            ? this.nodeParam
            : this.activityData.nodeParam,
          updateNum: Number(this.updateNum)
        }
        if (common.inspectNode(data.nodeParam)) {
          this.$notify({
            title: '提示',
            message: common.inspectNode(data.nodeParam),
            type: 'error'
          })
          return
        }

        axios.updatepipeline(data)
          .then(res => {
            if (res.data.code === 200) {
              this.$notify({
                title: '提示',
                message: '修改成功！',
                type: 'success'
              })
              this.$router.push({
                path: '/AutomaticOperation/OperatingPipeline',
                query: {
                  code: 4
                }
              })
            } else {
              this.$notify({
                title: '错误',
                message: res.data.message,
                type: 'error'
              })
            }
          })
          .catch()
      })
    },
    // 查看流水线详情
    getdetailpipeline () {
      axios.detailpipeline(this.pipelineId)
        .then(res => {
          if (res.data.success) {
            this.copyname = res.data.data.name
            this.$set(this.pipelineForm, 'name', res.data.data.name)
            this.envid = res.data.data.environmentId
            this.activityData.actXml = res.data.data.actXml
            this.activityData.nodeParam = res.data.data.pipeLineNodeparams
            this.updateNum = res.data.data.updateNum
          }
        })
        .catch()
    },
    // 获取环境下来列表
    getenvtablist () {
      let data = {
        environmentType: '',
        name: ''
      }
      axios.envtablist(data)
        .then(res => {
          res.data.data.result.forEach(d => {
            this.Envlist.push({
              label: d.name,
              value: d.environmentId
            })
          })
        })
        .catch()
    },

    // 保存
    cancelAdd () {
      this.$router.push({
        path: '/AutomaticOperation/OperatingPipeline',
        query: { code: 4 }
      })
    }
  },
  computed: {
    getActXml () {
      if (this.$route.query.pipelineId) {
        return this.activityData.actXml
      } else {
        return this.actXml
      }
    },
    getNodeParam () {
      if (this.$route.query.pipelineId) {
        return this.activityData.nodeParam
      } else {
        return this.nodeParam
      }
    }
  }
}
</script>
<style scoped>
.buttons {
  bottom: 20px !important;
}
.wrapper_pannel {
  width: 100%;
  background-color: #fff;
  padding: 10px 0 60px;
  overflow: visible;
}
.item-block-title {
  margin-bottom: 20px;
}
.block-item {
  margin-bottom: 20px;
  /* height: 100%; */
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
.block-content {
  /* padding: 20px 0 20px 56px; */
  padding-left: 20px;
  overflow: hidden;
  /* overflow: visible; */
}
.op-btns {
  text-align: center;
}
.p10 {
  padding: 10px;
}
</style>
