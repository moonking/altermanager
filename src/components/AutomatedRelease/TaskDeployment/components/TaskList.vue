<template>
  <div class="task-layout aibms-role">
    <div class="task-list">
      <div class="task-title">
        <div class="item-block-title">
          <div class="item-block-title-mark"></div>
          <span class="item-block-title-font white-color">部署任务</span>
        </div>
      </div>
      <el-row>
        <el-form :inline="true" :model="listSearchData" class="demo-form-inline">
          <el-form-item style="margin-left: 15px">
            <el-input placeholder="任务名称" v-model="listSearchData.jobName"></el-input>
          </el-form-item>
          <el-form-item class="form-select">
            <el-select v-model="listSearchData.tasktype" placeholder="选择任务类型" :clearable="true">
              <el-option
                v-for="tasks in taskType"
                :label="tasks.label"
                :value="tasks.value"
                :key="tasks.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="form-select">
            <el-select placeholder="选择状态" v-model="listSearchData.buildStatus" :clearable="true">
              <el-option
                v-for="status in buildStatus"
                :label="status.label"
                :value="status.value"
                :key="status.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="form-select">
            <el-date-picker
              v-model="listSearchData.date"
              type="date"
              placeholder="选择创建日期"
              style="width: 180px"
            ></el-date-picker>
          </el-form-item>
          <el-form-item class="item-right overHideMargin">
            <el-button icon="el-icon-search" class="nomal-button" @click="searchList">查找</el-button>
            <!-- <el-dropdown trigger="click">
              <el-button
                type="primary"
                icon="el-icon-plus"
                class="common-btn-style margin-left-btn"
              >新增<i class="el-icon-arrow-down el-icon--right"></i></el-button>
              <el-dropdown-menu slot="dropdown">
                <div @click="goAddTask">
                  <el-dropdown-item>部署任务</el-dropdown-item>
                </div>
                <div @click="goAddcreateTask">
                  <el-dropdown-item>构建任务</el-dropdown-item>
                </div>
              </el-dropdown-menu>
            </el-dropdown>-->
          </el-form-item>
          <!-- <el-button class="headerIcon addBtn" @click="goAddrelease">部署任务</el-button>
          <el-button class="headerIcon addBtn" @click="goAddTask">构建任务</el-button>-->
          <!-- <el-select
            @change="goAddTask"
            v-model="link"
            placeholder="+新增"
            clearable
            style="width:8%"
          >
            <el-option label="部署任务" value="1"></el-option>
            <el-option label="构建任务" value="2"></el-option>
          </el-select>-->
        </el-form>
      </el-row>
      <el-row>
        <el-table
          class="data-list"
          :data="taskList"
          stripe
          style="width: 100%"
          :header-cell-style="{ background: '#f5f5f5' }"
        >
          <el-table-column prop="name" label="任务名称"></el-table-column>
          <el-table-column prop="taskType" label="任务类型">
            <template slot-scope="scope">{{ scope.row.taskType | getType}}</template>
          </el-table-column>
          <el-table-column prop="healthyPrecent" label="健康率">
            <template slot-scope="scope">
              <div class="task-ratio health">
                <icon-svg
                  icon-class="jiankangshuai"
                  :class="chooseHealthIcon(scope.row.rateMap.successRate)"
                />
                <span
                  class="font-icon-style"
                  :class="ReturnLevel(scope.row.rateMap.health)"
                >{{ scope.row.rateMap.health || 0 }}%</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="rateMap.successRate" label="成功率">
            <template slot-scope="scope">
              <div class="task-ratio">
                <icon-svg
                  icon-class="chenggong"
                  :class="chooseSuccessIcon(scope.row.rateMap.successRate)"
                />
                <span
                  class="font-icon-style"
                  :class="ReturnLevel(scope.row.rateMap.successRate)"
                >{{ scope.row.rateMap.successRate }}%</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="avaTime" label="平均执行时间">
            <template slot-scope="scope">
              <div class="task-ratio-ohter time">
                <icon-svg icon-class="shijian" class="task-operation-color" />
                <span class="font-icon-style low">{{ scope.row.rateMap.avgtime }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="buildStatus" label="执行状态">
            <template slot-scope="scope">{{ scope.row.buildStatus | getStatus }}</template>
          </el-table-column>
          <el-table-column prop="executeLeve" label="执行阶段"></el-table-column>
          <el-table-column label="操作" width="330px">
            <template slot-scope="scope">
              <div class="task-btn-box">
                <span class="special" @click="readJob(scope.row.jobId,'detail',scope.row)">
                  <el-tooltip class="item" effect="dark" content="查看" placement="top-start">
                    <icon-svg icon-class="chakan" />
                  </el-tooltip>
                </span>
                <span
                  class="special"
                  @click="editJob(scope.row.jobId,'edit',scope.row.createBy,scope.row)"
                >
                  <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
                    <icon-svg icon-class="bianji" />
                  </el-tooltip>
                </span>
                <span class="special" @click="deleteJob(scope.row)">
                  <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                    <icon-svg icon-class="shanchu" />
                  </el-tooltip>
                </span>
                <span class="special normal-color" @click="goFastDeploy(scope.row)">
                  <el-tooltip class="item" effect="dark" content="测试执行" placement="top-start">
                    <icon-svg icon-class="zhihang" />
                  </el-tooltip>
                </span>
                <span
                  class="special"
                  @click="goDeployLog(scope.row.jobId)"
                  v-if="scope.row.buildStatus === 'building' || scope.row.buildStatus === 'SUCCESS' || scope.row.buildStatus === 'FAILURE'"
                >
                  <el-tooltip class="item" effect="dark" content="查看执行日志" placement="top-start">
                    <icon-svg icon-class="cha" />
                  </el-tooltip>
                </span>
                <span class="jobdisabled" v-else>
                  <el-tooltip class="item" effect="dark" content="查看执行日志" placement="top-start">
                    <icon-svg icon-class="cha" class="dis forbidden-icon-color" />
                  </el-tooltip>
                </span>
                <span class="special" @click="copyTask(scope.row)">
                  <el-tooltip
                    class="item normal-color"
                    effect="dark"
                    content="复制"
                    placement="top-start"
                  >
                    <icon-svg icon-class="fuzhi" />
                  </el-tooltip>
                </span>
              </div>
            </template>
          </el-table-column>
          <div slot="empty">
            <div class="blank-page">
              <div class="imgdiv">
                <img src="../../../../../static/img/blank-page.png" alt />
              </div>
              <p class="empty-text">暂无部署任务</p>
            </div>
          </div>
        </el-table>
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="listSearchData.current"
            :page-sizes="[10,30,50]"
            layout="prev, pager, next, sizes, total, jumper"
            :total="total"
            v-if="total"
            style="margin-right:15px;cursor: pointer;"
          ></el-pagination>
        </div>
      </el-row>
    </div>
    <!-- 发起审批弹框 -->
    <el-dialog title="发起审批" :visible.sync="dialogVisible" width="50%" center>
      <div v-if="!currentApplyList.length" style="text-align: center">该任务无审批流程，无法发起审批！</div>
      <div
        v-else-if="currentApplyList.length && (currentApplyStatus === '' || currentApplyStatus === null) "
      >
        <span style="line-height: 30px">该任务审批流程：</span>
        <div>
          <Step :stepData="currentApplyList" />
        </div>
      </div>
      <div v-else style="text-align: center">该任务{{currentApplyStatus | getApplyStatus}}，无法发起审批！</div>

      <div slot="footer" class="dialog-footer">
        <el-button
          v-if="currentApplyList.length && (currentApplyStatus === '' || currentApplyStatus === null)"
          type="primary"
          @click="addApplay()"
        >确 定</el-button>
        <el-button
          v-else-if="!currentApplyList.length"
          type="primary"
          @click="editJob(currentJobId)"
        >立即添加</el-button>

        <!--<el-button v-if="isStart" type="primary" @click="addApplay()">确 定</el-button>-->
        <!--<el-button v-else type="primary" @click="editJob(currentJobId,'edit')">立即添加</el-button>-->
        <el-button @click="dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 复制流水线的弹框 -->
    <el-dialog title="复制流水线" :visible.sync="copyDialog" width="50%" center>
      <el-form :rules="rules" label-width="100px" :model="newInfo">
        <el-form-item label="任务流水线：">
          <el-input v-model="job.name" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item prop="newName" label="复制为：">
          <el-input v-model="newInfo.newName" placeholder="请输入"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <button class="cm-btn deep" style="margin-right: 200px" @click="confirmCopy">确 定</button>
        <button class="cm-btn isoutline" @click="continueComf">继续编辑</button>
        <button class="cm-btn isoutline unColor" @click="handleCancle">取 消</button>
      </div>
    </el-dialog>

    <!--删除流水线的弹框  -->
    <el-dialog center :visible.sync="deleteVisable" title="删除提示" width="300px">
      <div :style="{textAlign: 'center'}">
        <i class="el-icon-warning"></i>&nbsp;&nbsp;是否删除该任务？
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="deleteVisable = false">取 消</el-button>
        <el-button size="medium" type="primary" @click="deleteJobSure">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import StepProgress from '../StepProgress.vue'
import Step from '../../workbench/ReleaseStep.vue'
import common from '@/utils/commonjs'
import axios from '@/api';
export default {
  name: 'TaskList',
  props: {
    systemId: {
      // 查询参数
      type: String,
      default: ''
    }
  },
  data () {
    return {
      pageSize: 2,
      copyList: {},
      oldName: true,
      websock: null,
      currentApplyStatus: '-1',
      total: 0,
      isStart: false,
      dialogVisible: false,
      copyVisible: false, // 复制流水线弹框
      // 审批流程
      currentApplyList: [],
      page: 1,
      link: '',
      //  今日部署任务
      todayTask: [],
      //  部署任务查询列表
      taskList: [],
      // 列表查询参数 -- 当前系统id 任务名称 执行状态 任务类型 执行阶段 当前页数 每页显示的条数
      listSearchData: {
        systemId: null,
        jobName: '',
        buildStatus: '',
        tasktype: '',
        plantype: '',
        // date: '',
        performing: '',
        current: 1,
        size: 10
      },
      currentJobId: null,
      // 列表状态选择
      buildStatus: [
        {
          label: '正在执行',
          value: '0'
        },
        {
          label: '执行失败',
          value: '1'
        },
        {
          label: '等待执行',
          value: '2'
        },
        {
          label: '执行成功',
          value: '3'
        }
      ],
      taskType: [
        {
          label: '构建任务',
          value: '0'
        },
        {
          label: '部署任务',
          value: '1'
        }
      ],
      performing: [
        {
          label: '构建',
          value: '0'
        },
        {
          label: '部署',
          value: '1'
        },
        {
          label: '验证',
          value: '2'
        },
        {
          label: '测试',
          value: '3'
        }
      ],
      currentUserId: '',
      currentApplyJobId: '',
      rules: {
        newName: [
          {
            required: true,
            message: '请填写新名称',
            trigger: 'blur'
          }
        ]
      },
      stepnum: false,
      job: {},
      newInfo: {
        newName: ''
      },
      copyDialog: false,
      deleteVisable: false,
      deleteJobId: ''
    }
  },
  components: {
    StepProgress,
    Step
  },
  created () {
    this.listSearchData.systemId = this.systemId
    this.currentUserId = localStorage.getItem('userId')
    this.findByPage()
  },
  watch: {
    systemId (val) {
      this.listSearchData.systemId = this.systemId
      this.currentUserId = localStorage.getItem('userId')
      this.findByPage()
    }
  },
  filters: {
    getType (val) {
      if (val == '0') {
        return '构建任务'
      } else if (val == '1') {
        return '部署任务'
      }
    },
    getStatus (val) {
      if (val === 'building') return '执行中'
      else if (val === 'SUCCESS') return '执行成功'
      else if (!val || val == 'NULL') return '-'
      else return '执行失败'
    },
    getStatusClass (val) {
      if (val === '执行失败') {
        return 'exec_filed'
      } else if (val === '等待执行') {
        return 'exec_wait'
      } else if (val === '执行成功') {
        return 'exec_success'
      } else if (val === '正在执行') {
        return 'exec'
      }
    },
    getApplyStatus (val) {
      if (val == '0') {
        return '审核通过'
      } else if (val == '1') {
        return '审核失败'
      } else if (val == '2') {
        return '审批中'
      } else if (val === '3') {
        return '审批撤回'
      } else {
        return '未审核'
      }
    }
  },
  methods: {
    // 根据健康的显示不同的等级
    ReturnLevel (level) {
      return level <= 40
        ? 'low'
        : level > 40 && level <= 70
          ? 'middle'
          : level > 70
            ? 'high'
            : 'low'
    },
    // 根据健康度显示不同颜色的图标
    chooseHealthIcon (health) {
      let className = ''
      if (health && health <= 40) {
        className = 'task-operation-color'
      } else if (health && health > 40 && health <= 70) {
        className = 'middle-operation-color'
      } else if (health && health > 70) {
        className = 'success-operation-color'
      } else {
        className = 'task-operation-color'
      }

      return className
    },
    // 根据成功率显示不同颜色的图标
    chooseSuccessIcon (success) {
      let className = ''
      if (success && success <= 40) {
        className = 'task-operation-color'
      } else if (success && success > 40 && success <= 90) {
        className = 'middle-operation-color'
      } else if (success && success > 90) {
        className = 'success-operation-color'
      } else {
        className = 'task-operation-color'
      }
      return className
    },
    // 继续编辑
    continueComf () {
      let option = {
        jobId: this.job.jobId,
        name: this.newInfo.newName
      }
      this.executeCopy(option, 1)
    },
    // 复制弹框取消
    handleCancle () {
      this.copyDialog = false
      this.newname = ''
    },
    // 复制保存
    confirmCopy () {
      let option = {
        jobId: this.job.jobId,
        name: this.newInfo.newName
      }
      this.executeCopy(option, 0)
    },
    executeCopy (option, str) {
      axios.copyTask(option.jobId, option.name).then(res => {
        if (res.data.code == 200) {
          let jobId = res.data.data.newJobId
          if (str === 1) {
            this.$router.push({
              path: '/AutomatedRelease/AddDeployTask',
              query: {
                code: 3,
                jobId: jobId,
                key: 'edit',
                type: '2',
                plantype: '2'
              }
            })
          } else {
            this.copyDialog = false
            this.$notify({
              type: 'success',
              message: res.data.message
            })
            this.listSearchData.current = 1
            this.findByPage()
          }
        } else {
          this.$notify({
            type: 'error',
            message: res.data.message
          })
        }
      })
    },
    // 复制流水线
    copyTask (row) {
      this.job = row
      this.copyDialog = true
    },
    // 取消复制流水线
    cancelCopy () {
      this.copyVisible = false
    },
    handdleMsg (msg) {
      let _this = this
      _this.$global.ws.onmessage = function (res) {
        let socketdata = JSON.parse(res.data)
        socketdata.stages.stages = common.evil(socketdata.stages.stages)
        //  let Num = 1;
        let step = 0
        let name = ''
        if (
          _this.system.todayjobs.records &&
          _this.system.todayjobs.records.length > 0
        ) {
          _this.system.todayjobs.records.forEach((item, index) => {
            if (item.jobId == socketdata.jobId) {
              if (socketdata.buildStatus === 'building') {
                _this.system.buildingCount = _this.system.buildingCount + 1
                _this.system.todayjobs.records[index].buildStatus = '正在执行'
                return false
              } else if (socketdata.buildStatus === 'SUCCESS') {
                _this.system.successCount++
                _this.system.buildingCount--
                _this.system.todayjobs.records[index].buildStatus = '执行成功'
              } else if (socketdata.buildStatus === 'FAILURE') {
                _this.system.failCount++
                _this.system.buildingCount--
                _this.system.todayjobs.records[index].buildStatus = '执行失败'
              }
              let total = socketdata.stages.stageSize || 0
              let size = 0
              if (socketdata.stages.stages) {
                socketdata.stages.stages.forEach((itemMin, index) => {
                  if (itemMin.status === 'SUCCESS') {
                    return (size += 1)
                  }
                })
              }

              step = (size / total) * 100
              let num = size - 1 || 0
              if (
                socketdata.stages.stages != '' &&
                socketdata.stages.stages[num]
              ) {
                name = socketdata.stages.stages[num].name
                _this.$set(
                  _this.system.todayjobs.records[index],
                  'stepName',
                  name
                )
                _this.$set(_this.system.todayjobs.records[index], 'step', step)
              } else {
                if (socketdata.actParamList.length > 0) {
                  _this.$set(
                    _this.system.todayjobs.records[index],
                    'stepName',
                    socketdata.actParamList[0].actNodeName
                  )
                  _this.$set(_this.system.todayjobs.records[index], 'step', 0)
                }
              }
            }
          })
        }
      }
    },

    // 发起审批
    addApplay () {
      let data = {
        businessId: this.currentJobId,
        businessType: 2
      }
      axios.addApplay(data).then(data => {
        if (data.data.code === 200) {
          this.$notify({
            title: '提示',
            message: '发起审批成功',
            type: 'success'
          })
          if (this.taskList && this.taskList.length) {
            this.taskList.forEach((item, index) => {
              if (item.jobId == this.currentApplyJobId) {
                this.$set(this.taskList[index], 'applyStatus', '2')
              }
            })
          }

          this.dialogVisible = false
        } else {
          this.$notify({
            title: '提示',
            message: data.data.message,
            type: 'error'
          })
        }
      })
    },
    // 删除部署任务
    deleteJob (item) {
      this.deleteVisable = true
      this.deleteJobId = item.jobId
      // let jobId = item.jobId
      // this.$confirm('确认删除?', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      //   deleteJob(jobId).then(res => {
      //     if (res.data.code === 200) {
      //       this.$notify({
      //         title: '提示',
      //         message: '删除成功！',
      //         type: 'success'
      //       })
      //       if (this.taskList.length <= 1 && this.listSearchData.current > 1) {
      //         this.listSearchData.current = this.listSearchData.current - 1
      //       }
      //       this.findByPage()
      //     } else {
      //       this.$notify({
      //         title: '错误',
      //         message: res.data.message,
      //         type: 'error'
      //       })
      //     }
      //   })
      // })
    },
    // 确认删除
    deleteJobSure () {
      axios.deleteJob(this.deleteJobId).then(res => {
        this.deleteVisable = false
        if (res.data.code === 200) {
          this.$notify({
            title: '提示',
            message: '删除成功！',
            type: 'success'
          })
          if (this.taskList.length <= 1 && this.listSearchData.current > 1) {
            this.listSearchData.current = this.listSearchData.current - 1
          }
          this.findByPage()
        } else {
          this.$notify({
            title: '错误',
            message: res.data.message,
            type: 'error'
          })
        }
      })
    },
    // 搜索列表
    searchList () {
      this.listSearchData.current = 1
      this.findByPage()
    },
    // 分页查询系统的部署任务
    findByPage () {
      axios.findBypage(this.listSearchData).then(data => {
        // console.log(data.data.data.records);
        if (data.data.code === 200) {
          this.taskList = data.data.data.records
          // console.log(this.taskList);
          this.taskList.forEach((item, index) => {
            if (item.stages) item.stages.stages = common.evil(item.stages.stages)
            if (
              item.stages.stages &&
              item.stages.stages[0] &&
              item.stages.stages[0].stages &&
              item.stages.stages[0].stages.length
            ) {
              // item.stages.stages = common.evil(item.stages.stages);
              let stageIndex = item.stages.stages[0].stages.length - 1
              this.$set(
                this.taskList[index],
                'executeLeve',
                item.stages.stages[0].stages[stageIndex].name
              )
            } else {
              this.$set(this.taskList[index], 'executeLeve', '-')
            }
          })
          // console.log(data.data.data);
          this.total = parseInt(data.data.data.total)
        } else {
          this.$notify({
            title: '提示',
            message: data.data.message,
            type: 'error'
          })
        }
      })
    },
    // 分页
    handleCurrentChange (val) {
      this.listSearchData.current = val
      this.findByPage()
    },
    handleSizeChange (val) {
      this.listSearchData.size = val
      this.findByPage()
    },

    // 发起审批
    startEx (data) {
      this.currentApplyStatus = data.applyStatus
      this.currentApplyJobId = data.jobId
      let order = common.evil(data.approvalids)
      this.currentJobId = data.jobId
      // console.log(data);
      if (order && order.length) {
        this.currentApplyList = order
        this.currentJobId = data.jobId
        order.forEach((item, index) => {
          this.getUserInfoById(item.userId, index)
        })
      } else {
        // this.isStart = false;
      }
      this.dialogVisible = true
    },
    // 根据id获取用户信息
    getUserInfoById (id, index) {
      axios.getImformation(id).then(res => {
        if (res.data.code === 200) {
          // this.currentApplyList[index] = {};
          // this.$set(this.currentApplyList[index],'auditStatus','');
          this.$set(
            this.currentApplyList[index],
            'photo',
            res.data.data.result.photo
          )
          this.$set(
            this.currentApplyList[index],
            'auditByName',
            res.data.data.result.name
          )
        }
      })
    },

    editJob (id, key, skip, row) {
      let approvalids = skip
      if (approvalids && approvalids.length) {
        if (approvalids === this.currentUserId) {
          this.$router.push({
            path: '/AutomatedRelease/AddDeployTask',
            query: {
              code: 3,
              jobId: id,
              key: key,
              type: '2',
              plantype: '2',
              task: Number(row.taskType) + 1
            }
          })
        } else {
          this.$notify({
            title: '提醒',
            message: '你不是当前任务的创建人，没有权限编辑当前任务',
            type: 'warning'
          })
        }
      }
    },
    // 查看部署任务
    readJob (id, key, row) {
      this.$router.push({
        path: '/AutomatedRelease/AddDeployTask',
        query: {
          code: 3,
          jobId: id,
          key: key,
          type: '1',
          plantype: '2',
          task: Number(row.taskType) + 1
        }
      })
    },

    // 跳转查看执行日志
    goDeployLog (id) {
      this.$router.push({
        path: '/AutomatedRelease/deployLog',
        query: {
          code: 3,
          jobId: id
        }
      })
    },
    // 跳转一键执行
    goFastDeploy (data) {
      if (this.currentUserId === data.createBy) {
        this.$router.push({
          path: '/AutomatedRelease/fastDeploy',
          query: {
            code: 3,
            jobId: data.jobId
          }
        })
      } else {
        this.$notify({
          title: '提醒',
          message: '你不是当前任务的创建人，没有权限执行当前任务',
          type: 'warning'
        })
      }
      // }
    },
    // 跳转新增部署任务
    // 跳转添加部署任务
    goAddTask () {
      this.$router.push({
        path: '/AutomatedRelease/AddDeployTask',
        query: { code: 3, plantype: '2', task: '2' }
      })
    },
    goAddcreateTask () {
      this.$router.push({
        path: '/AutomatedRelease/AddDeployTask',
        query: { code: 3, plantype: '2', task: '1' }
      })
    }
  }
}
</script>

<style scoped>
.dialog-footer {
  text-align: center;
}
.block {
  text-align: center;
  padding: 20px 0;
}
.task-btn-box {
  /* padding: 10px; */
  text-align: center;
}

.task-btn-box span {
  display: inline-block;
  background: #fff;
  border: 1px solid #0066ff;
  line-height: 24px;
  padding: 0 4px;
  border-radius: 5px;
  color: #0066ff;
  font-size: 14px;
  margin-right: 12px;
  cursor: pointer;
}
.task-btn-box span.special {
  /* border: 1px solid #777777; */
  cursor: pointer;
}
.task-btn-box span img {
  height: 12px;
  /* margin-top: 2px; */
  padding: 5px 8px 6px 8px;
  margin-bottom: -6px;
}
.task-btn-box .disabled {
  display: inline-block;
  font-size: 14px;
  margin-right: 12px;
  line-height: 24px;
  padding: 0 8px;
  border-radius: 5px;
}
/* .task-btn-box .default{
   background: url(../../../../../static/img/daily.png) center no-repeat;
} */
/* .task-btn-box .el-icon-my-daily {
  background: url(../../../../../static/img/daily.png) center no-repeat;
  background-size: cover;
}
.task-btn-box .el-icon-my-daily:before {
  visibility: hidden;
  font-size: 16px;
  content: "你";
} */
.task-btn-box span.active {
  /* background: #0066ff; */
  color: #fff;
  border: 1px solid #0066ff;
}
.task-btn-box span.text {
  background: #0066ff;
  color: #fff;
  border: 1px solid #0066ff;
}
/* .task-btn-box span.special {
  /* border: 1px solid #777777; */
/* cursor: pointer; */
/* }  */
.task-btn-box span.specials {
  border: 1px solid #777777;
  /* cursor: pointer; */
}
.task-btn-box .dis {
  cursor: not-allowed;
  /* background-color: #ccc; */
}
.task-btn-box .jobdisabled {
  cursor: not-allowed;
  background-color: #ddd;
  border: 1px solid #777777;
}
/* .task-btn-box span img {
  height: 12px;
  margin-top: 2px;
} */
.task-ratio {
  /* padding: 0 14px; */
  text-align: left;
  width: 130px;
}
.task-ratio img {
  vertical-align: middle;
  /* margin: 0 6px 0 16px; */
  height: 22px;
}
.task-ratio-ohter img {
  vertical-align: middle;
  margin-right: 6px;
  height: 22px;
}
.task-ratio.health {
  color: #49bc71;
}
.task-ratio.success {
  color: #0280ff;
}
.task-ratio-ohter.time {
  color: #ff9b00;
}
.task-layout {
  padding: 10px;
}
.task-item {
  background: #fff;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.08);
  border-radius: 5px;
  border: 1px solid #d3d3d3;
}
.node-title {
  color: #585858;
  font-size: 16px;
  line-height: 40px;
  padding: 0 10px 0;
  border-bottom: 1px solid #d3d3d3;
}
.node-title span.clo {
  display: inline-block;
  width: 6px;
  border-radius: 10px;
  margin-right: 20px;
  height: 20px;
  background: #0280ff;
  vertical-align: middle;
}
.task-title {
  color: #585858;
  font-size: 16px;
  line-height: 40px;
  margin-top: -6px;
}
.node-title span.count {
  margin-left: 10px;
}
.node-title .col-count {
  float: right;
  margin-left: 50px;
}
.node-title ul {
  display: flex;
}
.node-title ul li {
  flex: 1;
  padding-left: 15px;
  color: #848484;
  font-size: 14px;
}
.node-title ul li span {
  display: inline-block;
  width: 12px;
  height: 12px;
  margin-right: 3px;
}
span.exec_success {
  background: #0066ff;
}
span.exec {
  background: #ff9b00;
}
span.exec_filed {
  background: #ff0000;
}
span.exec_wait {
  background: #d3d3d3;
}
.task-item ul.task-step {
  padding: 15px;
}
.task-item ul.task-step li {
  border: 1px solid #d3d3d3;
  border-radius: 5px;
  padding: 10px;
  color: #777777;
  font-size: 14px;
  line-height: 30px;
  min-height: 70px;
}
.task-item ul.task-step li + li {
  margin-top: 15px;
}
.task-item ul.task-step li img {
  height: 16px;
  width: 16px;
  vertical-align: text-bottom;
  margin-left: 5px;
}
.task-item ul.task-step li .text-btn {
  line-height: 28px;
  padding: 0 10px;
  border-radius: 4px;
  font-size: 12px;
  display: inline-block;
  color: #fff;
}
.task-item .task_time {
  line-height: 30px;
}
.task-item .task_time-exec {
  padding-top: 30px;
  text-align: right;
  font-size: 12px;
}
.task_analysis {
  padding: 15px;
}
.task_analysis-item {
  text-align: center;
}
.task_analysis-item_title {
  text-align: center;
  font-size: 14px;
  color: #777777;
  line-height: 50px;
}
.task-exec_times {
  line-height: 100px;
  color: #777777;
  font-size: 14px;
}
.margin-right {
  margin-right: 40px;
}
.unColor {
  border-color: #777777;
  margin-left: -5px;
}
.task-btn-box span.special:hover {
  background: #0066ff;
}
.addbtn {
  position: absolute;
  right: 0px;
  top: 5%;
  /* background-color: #0066ff; */
  /* color: #fff; */
  /* float: right; */
}
/* .titlesearch { */
/* margin-top: -5px; */
/* } */
.select {
  background-color: #fff;
}
.addbutton {
  background-color: #0280ff !important;
  /* font-size: 16px; */
  /* background-image: url("../img/cdIcon/add.png"); */
}
.blank-page .imgdiv {
  height: 200px;
  padding-top: 15px;
}
.blank-page .empty-text {
  font-size: 18px;
  height: 30px;
  line-height: 30px;
  margin-top: -30px;
  margin-bottom: 10px;
}
.font-icon-style {
  font-weight: 600;
}
.low {
  color: #ffa367;
}
.middle {
  color: #0066ff;
}
.high {
  color: #49bc71;
}
.data-list
  /deep/
  .el-table__header-wrapper
  .el-table__header
  thead
  tr
  th:nth-of-type(8)
  div.cell {
  text-align: center;
}
.demo-form-inline /deep/ .overHideMargin {
  margin-right: 0 !important;
}
.flex-title {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
</style>
