<template>
  <div class="deploy-plan-manage">
    <div class="wrapper">
      <div class="operate-bar">
        <el-form :inline="true" :model="formData">
          <el-form-item>
            <!-- <el-date-picker v-model="formData.deployPlanTime" placeholder="选择日期"></el-date-picker> -->
            <el-input v-model="formData.keyword" placeholder="输入方案名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="formData.PlanType" placeholder="部署方案类型" :clearable="true">
              <el-option
                v-for="(plan,index) in deployPlanTypes"
                :key="index"
                :value="plan.value"
                :label="plan.type"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="formData.systemId" :clearable="true" placeholder="选择业务系统">
              <el-option
                v-for="system in systemList"
                :key="system.systemId"
                :label="system.name"
                :value="system.systemId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="item-right">
            <el-button icon="el-icon-search" class="nomal-button" @click="search">查找</el-button>
            <el-button
              type="primary"
              icon="el-icon-plus"
              class="margin-left-btn"
              @click.prevent="toAddDeployPlan"
            >新增</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="deploy-plan-list">
        <el-table :data="deployPlanList" :header-cell-style="tableHeaderStyle">
          <el-table-column prop="name" label="部署方案名称" align="center"></el-table-column>
          <!-- <el-table-column prop="status" label="部署方案状态" align="center" width="140">
            <template slot-scope="scope">
              {{scope.row.status | filterStatus}}
            </template>
          </el-table-column>-->
          <el-table-column prop="nodeName" label="节点名称" align="center"></el-table-column>
          <el-table-column prop="planType" label="方案类型" align="center">
            <template slot-scope="scope">{{scope.row.planType | filterType}}</template>
          </el-table-column>
          <el-table-column prop="systemName" label="业务系统" align="center"></el-table-column>
          <el-table-column prop="createDate" label="创建部署方案时间" align="center"></el-table-column>
          <el-table-column prop="createName" label="操作人" align="center" width="100"></el-table-column>
          <el-table-column prop label="操作">
            <template slot-scope="scope">
              <el-button
                @click="handleWatch(scope.row)"
                size="mini"
                class="cm-form-btn cm-watch-btn btn-watch"
              ></el-button>
              <el-button
                @click="handleEdit(scope.row)"
                size="mini"
                class="cm-form-btn cm-edit-btn-light"
                :style="{backgroundSize: '50%', backgroundPosition: 'center'}"
              ></el-button>
              <el-button
                @click="handleDelete(scope.row)"
                size="mini"
                class="cm-form-btn cm-delete-btn-light"
                :style="{backgroundSize: '50%',backgroundPosition: 'center'}"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="block" style="text-align: center;width: 100%;padding: 92px 0 0;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currPage"
          :page-sizes="[10,30,50]"
          layout="prev, pager, next, sizes, total, jumper"
          :total="total"
          v-if="total"
          style="margin-right:15px;cursor: pointer;"
        ></el-pagination>
      </div>
    </div>
    <el-dialog
      center
      :title="deployPlanDescDialogTitle"
      :visible.sync="deployPlanDialogVisible"
      width="700px"
      @close="dialogCloseHandle"
    >
      <el-form
        ref="planForm"
        :model="deployDescFormData"
        label-position="right"
        :rules="rules"
        label-width="140px"
      >
        <el-form-item label="部署方案名称:" prop="name">
          <el-input
            v-model="deployDescFormData.name"
            :disabled="dialogIsReadOnly"
            :style="{width: '300px'}"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="部署方案编号:">
          <el-input
            v-model="deployDescFormData.planId"
            :disabled="true"
            :style="{width: '300px'}">
          </el-input>
        </el-form-item>-->
        <el-form-item label="部署方案类型" prop="planType">
          <el-select
            v-model="deployDescFormData.planType"
            placeholder="部署方案类型"
            :disabled="dialogIsReadOnly"
          >
            <el-option
              v-for="(plan,index) in deployPlanTypes"
              :key="index"
              :value="plan.value"
              :label="plan.type"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="任务类型:" prop="taskType">
          <div v-if="!dialogIsReadOnly">
            <el-radio v-model="deployDescFormData.taskType" label="0">常规任务</el-radio>
            <el-radio v-model="deployDescFormData.taskType" label="1">定时任务</el-radio>
          </div>
          <el-input v-model="deployDescFormData.taskType" :disabled="dialogIsReadOnly" v-else :style="{width: '300px',marginRight: '20px'}"></el-input>
        </el-form-item>-->
        <el-form-item label="业务系统:" prop="systemId">
          <el-select
            v-model="deployDescFormData.systemId"
            :disabled="dialogIsReadOnly"
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
        <el-form-item label="节点:" prop="nodeName">
          <el-input
            v-model="deployDescFormData.nodeName"
            :disabled="dialogIsReadOnly"
            :style="{width: '300px',marginRight: '20px'}"
          ></el-input>
          <el-button
            type="primary"
            size="small"
            v-if="!dialogIsReadOnly"
            @click="nodeDialogVisible=true"
          >选择</el-button>
        </el-form-item>
        <el-form-item label="脚本:" prop="scriptName">
          <el-input
            v-model="deployDescFormData.scriptName"
            :disabled="dialogIsReadOnly"
            :style="{width: '300px',marginRight: '20px'}"
          ></el-input>
          <el-button type="primary" size="small" v-if="!dialogIsReadOnly" @click="openDialog">选择</el-button>
        </el-form-item>
        <el-form-item label="脚本参数">
          <el-input
            v-model="deployDescFormData.scriptParam"
            :disabled="dialogIsReadOnly"
            :style="{width: '300px',marginRight: '20px'}"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="状态">
          <el-input v-model="deployDescFormData.statusDesc" :disabled="true" :style="{width: '300px',marginRight: '20px'}"></el-input>
        </el-form-item>-->
        <el-form-item label="描述:">
          <el-input
            type="textarea"
            rows="3"
            :disabled="dialogIsReadOnly"
            v-model="deployDescFormData.remarks"
            :style="{width: '300px'}"
          ></el-input>
        </el-form-item>
        <el-form-item label="创建时间:" v-if="dialogIsReadOnly">
          <el-input
            v-model="deployDescFormData.createDate"
            :disabled="dialogIsReadOnly"
            :style="{width: '300px',marginRight: '20px'}"
          ></el-input>
        </el-form-item>
        <el-form-item label="创建人:" v-if="dialogIsReadOnly">
          <el-input
            v-model="deployDescFormData.createName"
            :disabled="dialogIsReadOnly"
            :style="{width: '300px',marginRight: '20px'}"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="验证:">
          <el-input
            v-model="deployDescFormData.technologyId"
            :disabled="dialogIsReadOnly"
            :style="{width: '300px',marginRight: '20px'}">
          </el-input>
          <el-button type="primary" size="small" v-if="!dialogIsReadOnly" @click="validatePlanDialogVisible=true">选择</el-button>
        </el-form-item>-->
        <el-form-item v-if="!dialogIsReadOnly">
          <template>
            <el-button type="primary" @click="confirmEdit">确认</el-button>
            <el-button @click="closeDialog">取消</el-button>
          </template>
        </el-form-item>
      </el-form>
    </el-dialog>
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
export default {
  name: 'deployPlanMange',
  data () {
    return {
      formData: {
        deployPlanTime: '',
        keyword: '',
        PlanType: '',
        systemId: ''
      },
      deployPlanTypes: [
        {
          value: '1',
          type: 'F5部署'
        },
        {
          value: '2',
          type: '数据库部署'
        },
        {
          value: '3',
          type: '应用部署'
        }
      ],
      deployPlanList: [],
      //   {
      //   id: 0,
      //   name: 'fa发布部署',
      //   status: '待验证',
      //   type: 'F5发布',
      //   createTime: '2019-1-26',
      //   operatePeople: '周记',
      // },{
      //   id: 1,
      //   name: 'fa发布部署',
      //   status: '待验证',
      //   type: 'F5发布',
      //   createTime: '2019-1-26',
      //   operatePeople: '周记',
      // },{
      //   id: 2,
      //   name: 'fa发布部署',
      //   status: '待验证',
      //   type: 'F5发布',
      //   createTime: '2019-1-26',
      //   operatePeople: '周记',
      // }],
      alignCenterStyle: {
        'text-align': 'center'
      },
      tableHeaderStyle: {
        background: '#f5f5f5'
      },
      page: 1,
      total: 0,
      currPage: 1,
      size: 10,
      deployPlanDialogVisible: false,
      deployDescFormData: {},
      //   id: 'B20190101105144',
      //   deployPlanName: 'F5发布部署',
      //   taskType: 1,
      //   system: '金融业务系统',
      //   node: '152.78.woeladd',
      //   script: '152.78.woeladd',
      //   description: '测试描述'
      // },
      dialogIsReadOnly: true,
      scriptDialogVisible: false,
      nodeDialogVisible: false,
      validatePlanDialogVisible: false,
      currentNode: '',
      currentScript: '',
      systemList: [],
      rules: {
        name: [{ required: true, message: '请填写方案名称', trigger: 'blur' }],
        planType: [
          { required: true, message: '请选择方案类型', trigger: 'change' }
        ],
        taskType: [
          { required: true, message: '请选择任务类型', trigger: 'change' }
        ],
        systemId: [
          { required: true, message: '请选择业务系统', trigger: 'change' }
        ],
        nodeName: [{ required: true, message: '请选择节点', trigger: 'blur' }],
        scriptName: [{ required: true, message: '请选择脚本', trigger: 'blur' }]
      },
      systemParams: ''
    }
  },
  created () {
    this.getDeployPlanList()
    // this.getSysList();
  },
  filters: {
    filterStatus (val) {
      return val == 0 ? '待验证' : val == 1 ? '验证成功' : '验证失败' // 0 待验证   1 验证成功  2 验证失败
    },
    filterType (val) {
      if (val === '1') {
        return 'F5部署'
      } else if (val === '2') {
        return '数据库部署'
      } else if (val === '3') {
        return '应用部署'
      } else {
        return ''
      }
    }
  },
  methods: {
    openDialog () {
      if (this.systemParams) {
        this.scriptDialogVisible = true
      } else {
        this.$notify({ title: '提示', message: '请先选择业务系统' })
      }
    },
    selectSystem (val) {
      this.deployDescFormData.nodeName = ''
      this.deployDescFormData.nodeId = ''
      this.deployDescFormData.scriptName = ''
      this.deployDescFormData.fileId = ''
    },
    getSysList () {
      let name = ''
      axios.getcigroupSystablist(name).then(res => {
        if (res.data.success) {
          this.systemList = res.data.data.result
        }
      })
    },
    closeDialog () {
      this.deployPlanDialogVisible = false
    },
    search () {
      this.getDeployPlanList()
    },
    getDeployPlanList () {
      let params = {
        currentPage: this.currPage,
        pageSize: this.size,
        planType: this.formData.PlanType,
        planName: this.formData.keyword,
        createDate: this.formData.deployPlanTime,
        systemId: this.formData.systemId
      }
      axios.deployPlanList(params).then(res => {
        if (res.data.success) {
          this.deployPlanList = res.data.data.records
          console.log('this.deployPlanList:%o', this.deployPlanList)
          this.total = res.data.data.total * 1
        }
      })
    },
    handleSizeChange (val) {
      this.size = val

      this.getDeployPlanList()
    },
    handleCurrentChange (val) {
      this.currPage = val

      this.getDeployPlanList()
    },
    toAddDeployPlan () {
      this.$router.push({
        path: '/AutomatedRelease/DeployPlanManage/AddDeployPlan',
        query: {
          code: 3
        }
      })
    },
    handleWatch (row) {
      axios.scriptDetail(row.fileId).then(res => {
        if (res.status == 200) {
          // 将 row中数据映射到对话框中
          this.deployDescFormData = row
          this.deployDescFormData.scriptName = res.data.result.name
          const status =
            row.status == 0
              ? '待验证'
              : row.status == 1
                ? '验证成功'
                : '验证失败'
          this.deployDescFormData.statusDesc = status
          // 显示dialog
          this.dialogIsReadOnly = true
          this.deployPlanDialogVisible = true
        }
      })
    },
    handleEdit (row) {
      axios.deployPlanDetail(row.planId).then(res => {
        if (res.status == 200) {
          // 将 row中数据映射到对话框中
          axios.scriptDetail(res.data.data.fileId).then(resp => {
            console.log(resp)
            res.data.data.scriptName = resp.data.result.name
            this.deployDescFormData = res.data.data
            // this.deployDescFormData.nodeName = 'xxx'
            console.log('script name:' + this.deployDescFormData.scriptName)
          })
          // 显示dialog
          this.dialogIsReadOnly = false
          this.deployPlanDialogVisible = true
          this.systemParams = row.systemId
        }
      })
    },
    handleDelete (row) {
      const planId = row.planId || ''
      this.$confirm('确定要删除该部署方案吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.deployPlanList.map((value, index) => {
            if (value.planId === planId) {
              axios.deleteDeployPlan(planId).then(res => {
                if (res.data.success === true) {
                  this.getDeployPlanList()
                  this.$notify({
                    title: '提示',
                    message: '删除部署方案成功！'
                  })
                } else {
                  this.$notify({
                    title: '提示',
                    message: '删除部署方案失败！'
                  })
                }
              })
            }
          })
        })
        .catch(() => {
          this.$notify({ title: '提示', message: '删除已取消' })
        })
    },
    dialogCloseHandle () {
      this.$refs.planForm.clearValidate()
    },
    confirmEdit () {
      this.$refs.planForm.validate(valid => {
        if (valid) {
          let params = {
            planId: this.deployDescFormData.planId,
            name: this.deployDescFormData.name,
            nodeId: this.deployDescFormData.nodeId,
            nodeName: this.deployDescFormData.nodeName,
            planType: this.deployDescFormData.planType,
            remarks: this.deployDescFormData.remarks,
            fileId: this.deployDescFormData.fileId,
            scriptParam: this.deployDescFormData.scriptParam,
            systemId: this.deployDescFormData.systemId,
            taskType: this.deployDescFormData.taskType
          }
          axios.editDeployPlan(params).then(res => {
            if (res.data.success) {
              this.deployPlanDialogVisible = false
              this.$notify({
                title: '提示',
                message: '数据修改成功'
              })
              this.currPage = 1
              this.getDeployPlanList()
            } else {
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
    scriptSelectedHandle (data) {
      this.deployDescFormData.scriptName = data.name
      this.currentScript = data
      this.deployDescFormData.fileId = data.fileId
    },
    nodeSelectedHandle (data) {
      this.deployDescFormData.nodeName = data.name
      this.currentNode = data
      this.deployDescFormData.nodeId = data.nodeId
    },
    validateSelectedHandle () { }
  },
  computed: {
    deployPlanDescDialogTitle () {
      return (this.dialogIsReadOnly ? '查看' : '修改') + '部署方案'
    }
  },
  components: {
    ScriptSelectDialog,
    NodeSelectDialog,
    ValidatePlanSelectDialog
  }
}
</script>
<style scoped>
.deploy-plan-manage {
  width: 100%;
  padding: 10px 0;
  box-sizing: border-box;
}
.deploy-plan-manage .wrapper {
  width: 100%;
}
.wrapper .operate-bar {
  width: 100%;
  padding-left: 5px;
}
.wrapper .paging-area {
  margin-top: 40px;
  text-align: center;
}
.deploy-plan-list {
  padding: 0 5px;
}
.deploy-plan-list .btn-watch {
  color: #fff;
  background-color: #0280ff;
  background-size: 50%;
  background-position: center center;
}
.deploy-plan-list .btn-watch:hover {
  background-color: #196cbe;
}
.other {
  background-size: 12% !important;
}
</style>
