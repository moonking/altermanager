<template>
  <div class="add-deploy-task">
    <div class="wrapper_pannel aibms-color-bg">
      <div class="block-item base-info">
        <!-- <div class="block-title" @click="switchBlock(1)">
          <div class="title-tips"></div>
          <h3>
            基本信息
            <i
              class="icons el-icon-arrow-right"
              :style="{transform: blockSwitch[1] ? 'rotate(90deg)' : 'rotate(0)'}"
            ></i>
          </h3>
        </div>-->
        <div class="item-block-title paddingTop" @click="switchBlock(1)">
          <div class="item-block-title-mark"></div>
          <span class="item-block-title-font">基本信息</span>
          <i
            class="icons el-icon-arrow-right"
            :style="{transform: blockSwitch[1] ? 'rotate(90deg)' : 'rotate(0)'}"
          ></i>
        </div>
        <div class="block-content" :style="{height: blockSwitch[1] ? 'auto' : '0' }">
          <el-form
            :model="biFormData"
            label-width="140px"
            ref="form"
            label-position="right"
            :rules="biFormRules"
          >
            <el-form-item label="部署任务名称：" prop="name" v-if="task == '2'">
              <el-input
                :disabled="key === 'detail'"
                maxlength="20"
                v-model="biFormData.name"
                placeholder="请输入任务名称"
                :style=" {width: '280px'}"
              ></el-input>
            </el-form-item>
            <el-form-item label="构建任务名称：" prop="name" v-if="task == '1'">
              <el-input
                :disabled="key === 'detail'"
                maxlength="20"
                v-model="biFormData.name"
                placeholder="请输入任务名称"
                :style=" {width: '280px'}"
              ></el-input>
            </el-form-item>
            <el-form-item label="所属系统：" prop="systemId">
              <el-select
                :disabled="key === 'detail'"
                v-model="biFormData.systemId"
                :style="{width: '280px'}"
                @change="getNodeList"
              >
                <el-option
                  v-for="item in systemList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所属jenkins：" prop="jenkinsId">
              <el-select
                :disabled="key === 'detail'"
                v-model="biFormData.jenkinsId"
                :style="{width: '280px'}"
                clearable
              >
                <el-option
                  v-for="item in jenkinsList"
                  :key="item.jenkinsId"
                  :label="item.jenkinsName"
                  :value="item.jenkinsId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-radio
                :disabled="!biFormData.systemId || key === 'detail' "
                @change="changeDeployType"
                v-model="biFormData.deployType"
                label="0"
              >部署集群</el-radio>
              <el-radio
                :disabled="!biFormData.systemId || key === 'detail'"
                @change="changeDeployType"
                v-model="biFormData.deployType"
                label="1"
              >部署节点</el-radio>
            </el-form-item>
            <!-- <el-form-item
              label="选择集群"
              v-if="biFormData.deployType == 0 || biFormData.deployType == 1"
              prop="cluster"
               :rules="this.biFormData.deployType == 0?biFormData.clusterId:[{ required: false, message: '请选择集群', trigger: 'change' }]"
            >-->
            <el-form-item
              label="选择集群："
              v-if="biFormData.deployType == 0&& biFormData.deployType!= ''"
              prop="clusterone"
            >
              <el-select
                @change="changeCluster"
                :disabled="key === 'detail'"
                v-model="clusterID"
                :style="{width: '280px'}"
              >
                <el-option
                  v-for="(cluster, index) in clusterList"
                  :key="index"
                  :label="cluster.name"
                  :value="cluster.clusterId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="选择集群："
              v-if="biFormData.deployType == 1&& biFormData.deployType!= ''"
            >
              <el-select
                @change="changeCluster"
                :disabled="key === 'detail'"
                v-model="clusterID"
                :style="{width: '280px'}"
              >
                <el-option
                  v-for="(cluster, index) in clusterList"
                  :key="index"
                  :label="cluster.name"
                  :value="cluster.clusterId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="选择节点：" v-if="biFormData.deployType == '1'" prop="nodeId">
              <el-select :disabled="key === 'detail'" v-model="nodeID" :style="{width: '280px'}">
                <el-option
                  v-for="(node,index) in nodeList"
                  :key="index"
                  :label="node.label"
                  :value="node.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="任务测试节点：" prop="testNodeId">
              <el-select
                :disabled="key === 'detail'"
                v-model="testNodeID"
                :style="{width: '280px'}"
              >
                <!-- biFormData.testNodeId -->
                <el-option
                  v-for="(node, index) in testNodeList"
                  :key="index"
                  :label="node.label"
                  :value="node.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="任务超时时间：" prop="timeout">
              <el-input
                maxlength="20"
                :disabled="key === 'detail'"
                v-model="biFormData.timeOut"
                :style="{width: '280px'}"
              ></el-input>
            </el-form-item>
            <!-- <el-form-item label="邮件通知" prop="email">
              <el-input maxlength="20" :disabled="key === 'detail'" v-model="biFormData.email" :style="{width: '280px'}"></el-input>
            </el-form-item>-->
            <el-form-item label="描述：" prop="desc">
              <el-input
                maxlength="20"
                :disabled="key === 'detail'"
                v-model="biFormData.remarks"
                :style="{width: '280px'}"
              ></el-input>
            </el-form-item>
            <!-- <el-form-item label="执行用户" prop="executor">
              <el-select :disabled="key === 'detail'" multiple="multiple" @change="getExecUser"  v-model="biFormData.runUser" :style="{width: '280px'}">
                <el-option
                  v-for="(user, index) in dropUserList"
                  :key="index"
                  :label="user.userName"
                  :value="user.value"
                ></el-option>
              </el-select>
            </el-form-item>-->
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
              :style="{transform: blockSwitch[2] ? 'rotate(90deg)' : 'rotate(0)'}"
            ></i>
          </h3>
        </div>-->
        <div class="item-block-title paddingTop" @click="switchBlock(2)">
          <div class="item-block-title-mark"></div>
          <span class="item-block-title-font">任务流程设计</span>
          <i
            class="icons el-icon-arrow-right"
            :style="{transform: blockSwitch[2] ? 'rotate(90deg)' : 'rotate(0)'}"
          ></i>
        </div>
        <div class="block-content" style="overflow: visible">
          <div v-if="blockSwitch[2]" style="border: 1px solid #ccc;width: 96%;position: relative;">
            <Workflow @confirm="getId" :activityData="activityData" />
          </div>
        </div>
      </div>

      <div class="op-btns" v-if="key !='detail' && key !='edit'">
        <el-button type="primary" @click="addDeployTask" :style="{marginRight: '200px'}">保存</el-button>
        <el-button @click="cancelAdd" class="nomal-button">取消</el-button>
      </div>
      <div class="op-btns" v-if="key =='edit'">
        <el-button type="primary" @click="updateDeployTask" :style="{marginRight: '200px'}">确定修改</el-button>
        <el-button @click="cancelAdd" class="nomal-button">取消</el-button>
      </div>
    </div>
    <el-dialog center title="节点详情" :visible.sync="showNodeDialog"></el-dialog>
  </div>
</template>
<script>
import UserSelector from '../ToolsManagement/UserSelector'
import UserListSelect from '../ToolsManagement/UserListSelect'
import Workflow from '../ReleaseWorkflow.vue'
import common from '@/utils/commonjs'
import axios from '@/api';
export default {
  data () {
    var validatenodeId = (rule, value, callback) => {
      if (this.nodeID.length == 0) {
        callback(new Error('请选择节点'))
      } else {
        callback()
      }
    }
    var validatecluster = (rule, value, callback) => {
      if (this.clusterID.length == 0) {
        callback(new Error('请选择集群'))
      } else {
        callback()
      }
    }
    var validatetestnode = (rule, value, callback) => {
      if (this.testNodeID.length == 0) {
        callback(new Error('请选择测试节点'))
      } else {
        callback()
      }
    }
    return {
      blockSwitch: { '1': true, '2': false, '3': false },
      biFormData: {
        taskType: '1'
      },
      activityData: {},
      biFormRules: {
        name: [
          { required: true, message: '请输入部署任务名称', trigger: 'blur' }
        ],
        systemId: [
          { required: true, message: '请选择所属系统', trigger: 'change' }
        ],
        jenkinsId: [
          { required: true, message: '请选择所属jenkins', trigger: 'change' }
        ],
        testNodeId: [
          { required: true, validator: validatetestnode, trigger: 'change' }
        ],
        clusterone: [
          { required: true, validator: validatecluster, trigger: 'change' }
        ],
        // clustertwo: [{ required: false, message: '请选择集群', trigger: 'change' }],
        nodeId: [
          { required: true, validator: validatenodeId, trigger: 'change' }
        ]
        // approveSelect: [
        //   { required: true, message: '请选择审批人', trigger: 'change' }
        // ]
      },
      clusterID: '',
      nodeID: '',
      testNodeID: '',
      tpFormData: {},
      tpFormRules: [],
      systemList: [],
      clusterList: [],
      nodeList: [],
      testNodeList: [],
      // 候选用户列表
      userList: [],
      userLists: [],
      // 执行用户下拉列表
      dropUserList: [],
      // 审批列表
      approveList: [],
      // 抄送列表
      copyToList: [],
      // 控制显示节点详情对话框
      showNodeDialog: false,
      nodeParam: '',
      actXml: '',
      jobDetail: [],
      isEdit: true,
      key: null,
      tmpUser: [],
      plantype: '',
      tast: '',
      // jenkins存储
      jenkinsList: [
        {
          jenkinsId: 'a123223_hj3232',
          name: 'jenkins1'
        },
        {
          jenkinsId: 'a1265454b644',
          name: 'jenkins2'
        }
      ]
    }
  },
  created () {
    this.getcigroupSystablist()
    let query = this.$route.query

    if (this.$route.query.plantype) {
      this.plantype = this.$route.query.plantype
      this.task = this.$route.query.task
    }
    if (query.key === 'edit' && query.jobId) {
      this.currentJobId = query.jobId
      this.getJobDetail()
      this.key = 'edit'
    } else if (query.key === 'detail' && query.jobId) {
      this.currentJobId = query.jobId
      this.getJobDetail()
      this.key = 'detail'
      this.blockSwitch[2] = false
    }
    this.getJenkinsList()
  },
  methods: {
    // 获取jenkins列表
    getJenkinsList () {
      let params = {
        jenkinsName: '',
        name: '',
        current: '1',
        size: '5000',
        detectionStatus: '1'
      }
      axios.jenkinsList(params).then(res => {
        if (res.data.code === 200) {
          this.jenkinsList = res.data.data.records
        } else {
          this.$notify({
            title: '提示',
            type: 'error',
            message: '数据获取失败！'
          })
        }
      })
    },
    getExecUser (e) {
      this.tmpUser = []
      if (this.biFormData.runUser && this.biFormData.runUser.length) {
        this.dropUserList.forEach(item => {
          if (e.indexOf(item.value) > -1) {
            this.tmpUser.push({
              userName: item.userName,
              userId: item.value
            })
          }
        })
      }
    },
    changeCluster (e) {
      // console.log(e,this.biFormData.clusterId)
      this.nodeID = ''
      this.getNodeName()
    },
    // 修改部署方式 - 0集群 1节点
    changeDeployType (event) {
      // console.log(11)
      // this.clusterID = '';
      this.nodeID = ''
      if (event == 0) {
        this.getClusterDrop()
      } else if (event == 1) {
        // this.getNodeBySystemId();
        this.getNodeName()
      }
    },
    // 获取部署任务详情
    getJobDetail () {
      axios.getJobDetail(this.currentJobId).then(response => {
        if (response.data.status.index == 200) {
          let activeId = []
          response.data.jobInfo.actParamList.forEach(item => {
            activeId.push(item.actNodeId)
          })
          this.biFormData = response.data.jobInfo
          this.clusterID = response.data.jobInfo.clusterId
          this.nodeID = response.data.jobInfo.nodeId
          this.testNodeID = response.data.jobInfo.testNodeId
          this.activityData.actXml = response.data.xmlStr
          this.activityData.activeId = activeId
          this.actXml = response.data.xmlStr
          if (typeof this.biFormData.approvalids === 'string') {
            this.biFormData.approvalids = common.evil(
              response.data.jobInfo.approvalids
            )
          } else {
            this.biFormData.approvalids = response.data.jobInfo.approvalids
          }
          if (typeof this.biFormData.sendcopyids === 'string') {
            this.biFormData.sendcopyids = common.evil(
              response.data.jobInfo.sendcopyids
            )
          } else {
            this.biFormData.sendcopyids = response.data.jobInfo.sendcopyids
          }

          this.biFormData.xmlStr = response.data.xmlStr
          if (
            this.biFormData.approvalids &&
            this.biFormData.approvalids.length
          ) {
            this.biFormData.approvalids.forEach((item, index) => {
              this.getImformationCopy(item.userId, index)
            })
          }
          if (
            this.biFormData.approvalids &&
            this.biFormData.approvalids.length > 0
          ) {
            this.biFormData.approvalids.forEach((item, index) => {
              this.getImformation(item.userId, index)
            })
          }
          let runUser
          if (typeof response.data.jobInfo.runUser === 'string') {
            runUser = common.evil(response.data.jobInfo.sendcopyids)
          } else {
            runUser = response.data.jobInfo.runUser
          }

          if (runUser && runUser.length) {
            this.biFormData.runUser = runUser.map(item => {
              return item.userId
            })
          }
          if (response.data.jobInfo.sendcopyids) {
            if (typeof this.biFormData.sendcopyids === 'string') {
              this.biFormData.sendcopyids = common.evil(
                response.data.jobInfo.sendcopyids
              )
            } else {
              this.biFormData.sendcopyids = response.data.jobInfo.sendcopyids
            }

            this.biFormData.sendcopyids.forEach((item, index) => {
              this.getBusyInformation(item.userId, item.order)
            })
          }

          //  集群下拉
          this.getClusterDrop()
          //  节点下拉
          this.getNodeName()
          //  查询测试节点
          this.testNode()
        } else {
          this.$notify({
            title: '提示',
            message: response.data.message,
            type: 'error'
          })
        }
      })
    },

    // 查询用户详情
    getImformation (id, index) {
      axios.getImformation(id).then(data => {
        if (data.data.code === 200) {
          this.$set(
            this.biFormData.approvalids[index],
            'photo',
            data.data.data.result.photo
          )
          this.$set(
            this.biFormData.approvalids[index],
            'name',
            data.data.data.result.name
          )
        }
      })
    },
    // 查询用户详情
    getImformationCopy (id, index) {
      axios.getImformation(id).then(data => {
        if (data.data.code === 200) {
          this.$set(
            this.biFormData.approvalids[index],
            'photo',
            data.data.data.result.photo
          )
          this.$set(
            this.biFormData.approvalids[index],
            'name',
            data.data.data.result.name
          )
        }
      })
    },

    // 根据节点id查询节点详情
    getId (data) {
      this.actXml = data.actXml
      this.nodeParam = data.nodeParam
    },
    // 改变业务系统
    getNodeList () {
      this.nodeID = ''
      this.clusterID = ''
      this.testNodeID = ''
      // this.biFormData.clusterId = '';
      if (this.biFormData.systemId) {
        //    集群下拉
        this.getClusterDrop()
        //    节点下拉
        this.getNodeName()
        //  查询测试节点
        this.testNode()
      } else {
        this.nodeList = []
        this.testNodeList = []
        this.clusterList = []
        this.biFormData.testNode = ''
        this.biFormData.clustor = ''
        this.biFormData.clusterId = ''
        this.biFormData.nodeId = ''
      }
    },
    // 记录节点脚本版本
    gettoolVersionLog (toolId, versionLog) {
      let data = []
      let d = {}
      this.nodeParam.forEach(item => {
        // if (item.businessType == '1') {
        // }
        data.push({ toolId: item.businessId, versionLog: item.version })
      })
      d.toolArray = data
      axios.toolVersionLog(d).then(res => {
        // console.log(res);
      })
    },
    //  获取集群信息
    getClusterDrop () {
      let data = {
        purposes: this.task,
        systemId: this.biFormData.systemId
      }
      axios.getClusterDrop(data).then(res => {
        // this.clusterList = [];
        if (res.data.code === 200) {
          // console.log(res.data.result);
        }
        if (res.data.data.result) {
          this.clusterList = res.data.data.result

          // console.log(this.clusterList);
          //     res.data.data.result.forEach(item => {
          //     this.clusterList.push({
          //       value: item.clusterId,
          //       label: item.name
          //     });
          // });
        }

        // this.clusterList = res.data.data.result;
      })
    },
    // 系统下拉列表
    getcigroupSystablist () {
      let name = ''
      axios.getcigroupSystablist(name)
        .then(res => {
          this.systemList = []
          if (res.data.data.result.length > 0) {
            res.data.data.result.forEach(item => {
              this.systemList.push({ value: item.systemId, label: item.name })
            })
          }
        })
        .catch()
    },
    // 测试节点下拉
    testNode () {
      let name = ''
      this.nodeList = []
      axios.testNode(name, this.biFormData.systemId).then(data => {
        if (data.data.code === 200) {
          if (data.data.data.result) {
            // console.log(data.data.data.result)
            if (data.data.data.result.length) {
              this.testNodeList = data.data.data.result.map(item => {
                return {
                  value: item.nodeId,
                  label: item.name
                }
              })
            } else {
              // this.$notify({
              //     title: '提示',
              //     message: '该系统下没有测试节点，请重新选择所属系统',
              //     type: 'warning'
              // });
            }
          }
        } else {
          this.isEditTest = true
          this.$notify({
            title: '提示',
            message: data.data.message,
            type: 'error'
          })
        }
      })
    },
    //  根据系统id和集群id查询生产节点
    getNodeName () {
      this.biFormData.clusterId = this.clusterID
      let data = {
        systemId: this.biFormData.systemId,
        clusterId: this.biFormData.clusterId,
        purposes: '2',
        name: ''
      }
      axios.getNodeName(data).then(data => {
        if (data.data.code === 200) {
          // console.log(data.data.data.result);
          if (data.data.data.result) {
            // console.log()
            this.nodeList = data.data.data.result.map(item => {
              return {
                label: item.name,
                value: item.nodeId
              }
            })
            // console.log(this.nodeList )
            // data.data.data.result.forEach(item => {
            //   this.nodeList.push({
            //     label: item.name,
            //     value: item.nodeId
            //   });
            // });
            // this.nodeList = data.data.data.result;
          } else {
            // this.$notify({
            //     title: '提示',
            //     message: '该系统下没有节点，请重新选择',
            //     type: 'warning'
            // });
          }
        }
      })
    },

    switchBlock (index) {
      return (this.blockSwitch[index] = !this.blockSwitch[index])
    },

    deleteApproveSeleted (index) {
      this.approveList.splice(index, 1)
    },
    // 选择抄送
    deleteCopyToSeleted (index) {
      this.copyToList.splice(index, 1)
    },
    // 新增部署任务
    addDeployTask () {
      this.$refs.form.validate(valid => {
        //  if(!this.nodeParam){
        //        this.$notify({
        //   title: '提示',
        //   message: '请完成任务流程设计',
        //   type: 'error'
        // });
        //  }
        if (common.inspectNode(this.nodeParam, 'delivery')) {
          this.$notify({
            title: '提示',
            message: common.inspectNode(this.nodeParam, 'delivery'),
            type: 'error'
          })
          return
        }
        if (valid) {
          if (this.task == 1) {
            this.biFormData.taskType = '0'
          } else {
            this.biFormData.taskType = '1'
          }
          if (/^\s+$/gi.test(this.biFormData.name)) {
            this.$notify({
              title: '提示',
              message: '任务名称不能为全空格',
              type: 'warning'
            })
          }
          this.biFormData.clusterId = this.clusterID
          this.biFormData.nodeId = this.nodeID
          this.biFormData.testNodeId = this.testNodeID
          let data = {
            JobTask: this.biFormData,
            actXml: this.actXml,
            nodeParam: this.nodeParam
          }
          data.JobTask.runUser = this.tmpUser
          axios.addCreateJob(data)
            .then(response => {
              if (response.data.code === 200) {
                this.$router.back(-1)
                if (response) {
                  this.$notify({
                    title: '提示',
                    message: '添加成功',
                    type: 'success'
                  })
                }
                this.gettoolVersionLog()
              } else if (response.data.code === 500) {
                // console.log(response.data.message)
                this.$notify({
                  title: '提示',
                  message: response.data.message,
                  type: 'warning'
                })
              } else if (response.data.status.index == '407') {
                this.$notify({
                  title: '提示',
                  message: response.data.status.info,
                  type: 'warning'
                })
              }
            })
            .catch(err => {
              console.log(err)
            })
        }
      })
    },
    updateDeployTask () {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.task == 1) {
            this.biFormData.taskType = '0'
          } else {
            this.biFormData.taskType = '1'
          }
          if (common.inspectNode(this.nodeParam, 'delivery')) {
            this.$notify({
              title: '提示',
              message: common.inspectNode(this.nodeParam, 'delivery'),
              type: 'error'
            })
            return
          }
          if (/^\s+$/gi.test(this.biFormData.name)) {
            this.$notify({
              title: '提示',
              message: '任务名称不能为全空格',
              type: 'warning'
            })
          }
          this.biFormData.clusterId = this.clusterID
          this.biFormData.nodeId = this.nodeID
          this.biFormData.testNodeId = this.testNodeID
          let data = {
            JobTask: this.biFormData,
            actXml: this.actXml,
            nodeParam: this.nodeParam
          }
          data.JobTask.runUser = this.tmpUser
          axios.updateJob(this.currentJobId, data)
            .then(response => {
              if (response.data.code === 200) {
                this.$router.back(-1)
                if (response) {
                  this.$notify({
                    title: '提示',
                    message: '修改成功',
                    type: 'success'
                  })
                }
                this.gettoolVersionLog()
              } else {
                if (response) {
                  this.$notify({
                    title: '提示',
                    message: response.data.message,
                    type: 'warning'
                  })
                }
              }
            })
            .catch(err => {
              console.log(err)
            })
        }
      })
    },
    cancelAdd () {
      this.$router.push({
        path: '/AutomatedRelease/TaskDeployment',
        query: { code: 3 }
      })
    }
  },
  watch: {
    'biFormData.deployTarget': function (newVal, oldVal) {
      if (newVal === 'node') {
        this.biFormRules.clustor[0].required = false
      }
    }
  },
  components: {
    Workflow,
    UserSelector,
    UserListSelect
  }
}
</script>
<style scoped>
.buttons {
  bottom: 20px !important;
}
.add-deploy-task {
  padding: 10px;
}
.wrapper_pannel {
  width: 100%;
  background-color: #fff;
  padding: 10px 0 60px;
  overflow: visible;
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
.block-title > h3 {
  font-size: 16px;
  font-weight: normal;
  line-height: 32px;
}
div.block-content:nth-child(2) {
  padding-left: 128px;
}
.block-content {
  padding-left: 100px;
  overflow: hidden;
  /* overflow: visible; */
}
.op-btns {
  text-align: center;
}
.icons {
  color: #0066ff;
  font-size: 20px;
  vertical-align: middle;
  margin-left: 4px;
}
</style>
