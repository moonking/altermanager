<template>
  <div class="node-layout aibms-color-bg non-border non-shadow">
    <div class="node-title white-color">
      <span class="cursorp"></span>基本信息
      <i
        :class="isfirst ? 'el-icon-arrow-down icons':'el-icon-arrow-right icons'"
        @click="isfirst=!isfirst"
      ></i>

      <div class="panel-box" v-if="isfirst" style="width:30%;padding: 20px">
        <el-form
          ref="ruleForm"
          label-width="150px"
          class="demo-ruleForm"
          :model="ruleForm"
          :rules="rules"
        >
          <el-form-item label="方案名称：" class="w28ml20" prop="SchemeName">
            <el-input
              maxlength="20"
              :disabled="$route.query.type=='1'"
              v-model="SchemeName"
              placeholder="请输入方案名称"
              style="width: 632px"
            ></el-input>
          </el-form-item>
          <el-form-item label="节点类型：" class="w28ml20" prop="value2">
            <el-select
              style="width: 632px"
              :disabled="$route.query.type=='1'"
              clearable
              v-model="value2"
              placeholder="请选择节点类型"
            >
              <el-option
                v-for="(item,index)  in systemTypes"
                :key="index"
                :label="item.name"
                :value="item.systemId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="说明：" class="w28ml20">
            <el-input type="textarea" :disabled="$route.query.type=='1'" v-model="remarks" style="width: 632px"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div class="node-title cursorp white-color">
      <span class="cursorp"></span>流程设计
      <i
        :class="issecond ? 'el-icon-arrow-down icons':'el-icon-arrow-right icons'"
        @click="issecond=!issecond"
      ></i>
      <Workflow v-if="issecond" @confirm="getId" :activityData="activityData" style="margin: 20px" />
      <div style="text-align: center;margin-top:20px" v-if="$route.query.type!='1'">
        <el-button
          :loading="editLoading"
          type="primary"
          @click="addactive"
        >{{!$route.query.type?'确认新增':$route.query.type=='1'?'确定':'保存'}}</el-button>
        <el-button
          :loading="editLoading"
          class="nomal-button"
          @click="cancelactive"
          style="margin-left: 16%;"
        >取消</el-button>
      </div>
    </div>

    <!-- <div class="node-title"><span></span>设置参数
            <i :class="isthree ? 'el-icon-arrow-down icons':'el-icon-arrow-right icons'" @click="isthree=!isthree"></i>
                 <div class="panel-item" v-if="isthree"     >
                <div class="node-title"><span style="visibility: hidden"></span> 设置参数</div>
                <div class="panel-box" style="width:80%;padding: 20px">
                    <el-table

                            :data="tableData"
                            stripe
                            border
                            style="width: 100%">
                        <el-table-column
                                align="center"
                                prop="date"
                                label="日期"
                                width="180">
                        </el-table-column>
                        <el-table-column
                                align="center"
                                prop="name"
                                label="姓名"
                                width="180">
                        </el-table-column>
                        <el-table-column
                                align="center"
                                prop="address"
                                label="地址">
                        </el-table-column>
                    </el-table>
                </div>
            </div>
    </div>-->

    <!-- <div class="panel-box"   style="width:30%;padding: 20px">
                <el-form
                        ref="ruleForm"
                        label-width="150px"
                        class="demo-ruleForm"
                >
                    <el-form-item label="流程名称："  class="w28ml20">
                        <el-input maxlength="40" size="medium" placeholder="请输入流程名称"></el-input>
                    </el-form-item>
                    <el-form-item label="流程步骤类型：" size="medium"  class="w28ml20">
                        <el-radio label="1">工具</el-radio>
                        <el-radio label="2">流水线</el-radio>
                        <el-radio label="2">审批</el-radio>
                    </el-form-item>
                    <el-form-item label="执行用户："  class="w28ml20">
                        <el-input maxlength="40" placeholder="执行用户"></el-input>
                    </el-form-item>
                    <el-form-item size="medium"   class="w28ml20">
                        <el-radio label="1">失败退出</el-radio>
                        <div class="tool-box" style="width: 200%;padding: 10px;">
                            <el-row>
                                <el-col :span="14"  style="border-radius: 5px 0 0 5px !important;">
                                    <el-input  placeholder="请输入内容"></el-input>
                                </el-col>
                                <el-col :span="10">
                                    <el-select    placeholder="请选择" v-model="value3">
                                        <el-option label="餐厅名" value="1"></el-option>
                                        <el-option label="订单号" value="2"></el-option>
                                        <el-option label="用户电话" value="3"></el-option>
                                    </el-select>
                                </el-col>
                                <ul>
                                    <li>cat</li>
                                    <li>cat</li>
                                    <li>cat</li>
                                    <li>cat</li>
                                    <li>cat</li>
                                    <li>cat</li>
                                    <li>cat</li>
                                </ul>

                            </el-row>
                        </div>
                    </el-form-item>
                </el-form>
    </div>-->

    <!-- <Workflow  v-show="index === 1 && item.status"    @confirm="getId"/> -->
  </div>
</template>

<script>
import Workflow from './ReleaseWorkflow.vue'
import axios from '@/api';
export default {
  name: 'ExamineAndApproveDetail',
  data () {
    // var validateSchemeName = (rule, value, callback) => {
    //   if (this.SchemeName == '') {
    //     callback(new Error('请输入方案名称'));
    //   } else {
    //     callback();
    //   }
    // };
    // var validatevalue2 = (rule, value, callback) => {
    //   if (value2 == '') {
    //     callback(new Error('请选择节点类型'));
    //   } else {
    //     callback();
    //   }
    // };
    return {
      ruleForm: {
        SchemeName: '',
        value2: ''
      },
      rules: {
        SchemeName: [
          { required: true, message: '请输入方案名称', trigger: 'blur' }
        ],
        value2: [
          { required: true, message: '请选择节点类型', trigger: 'change' }
        ]
      },
      SchemeName: '',
      editLoading: false,
      isfirst: false,
      issecond: false,
      isthree: false,
      activityData: {},
      remarks: '',
      releaseList: [
        {
          name: 'jill',
          auditText: '123',
          auditStatus: 'OK',
          proStarttime: '2018-09-03',
          photo: '../../../../static/img/Fruit-1.png'
        },
        {
          name: 'jill',
          auditText: '123',
          auditStatus: 'OK',
          proStarttime: '2018-09-03',
          photo: '../../../../static/img/Fruit-1.png'
        },
        {
          name: 'jill',
          auditText: '123',
          auditStatus: 'OK',
          proStarttime: '2018-09-03',
          photo: '../../../../static/img/Fruit-1.png'
        },
        {
          name: 'jill',
          auditText: '123',
          auditStatus: 'OK',
          proStarttime: '2018-09-03',
          photo: '../../../../static/img/Fruit-1.png'
        }
      ],
      systemTypes: [
        {
          name: 'F5',
          systemId: '1'
        },
        {
          name: '数据库',
          systemId: '2'
        },
        {
          name: '服务器',
          systemId: '3'
        }
      ],
      value: '',
      value2: '',
      value3: '',
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: ' 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: ' 1517 弄'
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: ' 1519 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: ' 1516 弄'
        }
      ],
      options: [
        {
          value: '选项1',
          label: '黄金糕'
        },
        {
          value: '选项2',
          label: '双皮奶'
        },
        {
          value: '选项3',
          label: '蚵仔煎'
        },
        {
          value: '选项4',
          label: '龙须面'
        },
        {
          value: '选项5',
          label: '北京烤鸭'
        }
      ]
    }
  },
  watch: {
    SchemeName () {
      this.ruleForm.SchemeName = this.SchemeName
    },
    value2 () {
      this.ruleForm.value2 = this.value2
    }
  },
  components: {
    Workflow: Workflow
  },
  methods: {
    getId (data) {
      this.activityData = data
    },
    toggleTitle (index) {
      this.titleList[index].status = !this.titleList[index].status
    },
    getnodeListprod () {
      axios.nodeListprod()
        .then(res => {
          // console.log(res);
        })
        .catch()
    },
    // 根据节点id查询节点内容   plantype 1:方案 ，2: 任务
    // 获取任务节点信息
    getnodeinfo () {
      // plantype 1:方案 ，2: 任务  protype 方案类型 1,备份 2,部署 3,验证 4,回退
      let data = {}
      // console.log(this.activityData)
      data.jobId = this.$route.query.jobId
      // data.jobId = "a9cc6ba765f44e97b85a7eafa7e71f95";
      data.actNodeId = this.ID
      axios.nodeinfo(data)
        .then(res => {
          // console.log(res)
          res.data.data.forEach(item => {
            if (this.ID == item.actNodeId) {
              this.form.name = item.actNodeName
              this.isbl = item.isExit
              this.form.isbl = item.isExit
              this.form.resource =
                item.businessType == '1'
                  ? '脚本'
                  : item.businessType == '2'
                    ? '方案'
                    : item.businessType == '3'
                      ? '人工判断'
                      : ''
              if (item.businessType == '1') {
                this.options.forEach(t => {
                  if (t.children.length > 0) {
                    t.children.forEach(d => {
                      if (d.toolId == item.businessId) {
                        this.pipeline[0] = t.value
                        this.pipeline[1] = item.businessId
                        this.getselectvalue1()
                        // console.log(this.options2)
                      }
                    })
                  }
                })
              }
              if (item.businessType == '2') {
                this.options2.forEach(t => {
                  if (t.children.length > 0) {
                    t.children.forEach(d => {
                      if (d.value == item.businessId) {
                        this.programmes[0] = t.value
                        this.programmes[1] = item.businessId
                        this.handleChange()
                      }
                    })
                  }
                })
              }
              if (item.businessType == '3') {
                this.judgementlist.forEach(t => {
                  if (t.value == item.businessId) {
                    this.judgement = item.businessId
                    this.form.judgements = item.businessId
                  }
                })
              }
              // console.log(this.options)
            }
          })
        })
        .catch()
    },
    // 获取方案节点信息
    getActParams () {
      // plantype 1:方案 ，2: 任务  protype 方案类型 1,备份 2,部署 3,验证 4,回退
      let data = {}
      data.planId = this.$route.query.planId
      data.actNodeId = this.ID
      axios.getActParam(data)
        .then(res => {
          // console.log(res);
          res.data.data.planToolsList.forEach(item => {
            if (this.ID == item.actNodeId) {
              this.form.name = item.actNodeName
              this.isbl = item.isExit
              this.form.isbl = item.isExit
              this.form.resource = '脚本'
              this.options.forEach(t => {
                if (t.children.length > 0) {
                  t.children.forEach(d => {
                    if (d.toolId == item.toolId) {
                      this.pipeline[0] = t.value
                      this.pipeline[1] = item.toolId
                      this.getselectvalue1()
                      // console.log(this.options2)
                    }
                  })
                }
              })
              // console.log(this.options)
            }
          })
        })
        .catch()
    },
    // 提交
    addactive () {
      // plantype 1:方案 ，2: 任务  protype 方案类型 1,备份 2,部署 3,验证 4,回退

      if (this.$route.query.type == '1') {
        if (this.$route.query.protype == '1') {
          this.$router.push({
            path: '/AutomatedRelease/BackspaceManage',
            query: { code: 3 }
          })
        }
        if (this.$route.query.protype == '2') {
          this.$router.push({
            path: '/AutomatedRelease/Deploy',
            query: { code: 3 }
          })
        }
        if (this.$route.query.protype == '3') {
          this.$router.push({
            path: '/AutomatedRelease/Technology',
            query: { code: 3 }
          })
        }
        if (this.$route.query.protype == '4') {
          this.$router.push({
            path: '/AutomatedRelease/backupManagement',
            query: { code: 3 }
          })
        }
        return false
      }

      this.$refs.ruleForm.validate(valid => {
        console.log(this.activityData)
        if (!this.$route.query.type) {
          if (!this.activityData.actXml || !this.activityData.nodeParam) {
            this.$notify({
              title: '提示',
              message: '流程节点不能为空！',
              type: 'error'
            })
            return false
          } else {
            this.activityData.nodeParam.forEach(item => {
              if (!item.toolId) {
                this.$notify({
                  title: '提示',
                  message: '请选择节点脚本！',
                  type: 'error'
                })
                return false
              }
            })
          }
        } else {
          if (this.activityData.nodeParam) {
            if (this.$route.query.plantype == '1') {
              this.getActParams()
            } else if (this.$route.query.plantype == '2') {
              this.getnodeinfo()
            }
          }
          // console.log(this.activityData.actXml,this.activityData.nodeParam)
        }

        let data = {
          plan: {
            name: this.SchemeName,
            nodeType: this.value2,
            remarks: this.remarks,
            planType: this.$route.query.protype
          },
          actXml: this.activityData.actXml,
          nodeParam: this.activityData.nodeParam
        }
        if (!this.$route.query.type) {
          axios.createPlan(data)
            .then(res => {
              if (res.data.success) {
                this.$notify({
                  title: '提示',
                  message: '新增成功！',
                  type: 'success'
                })
                if (this.$route.query.protype == '1') {
                  this.$router.push({
                    path: '/AutomatedRelease/BackspaceManage',
                    query: { code: 3 }
                  })
                }
                if (this.$route.query.protype == '2') {
                  this.$router.push({
                    path: '/AutomatedRelease/Deploy',
                    query: { code: 3 }
                  })
                }
                if (this.$route.query.protype == '3') {
                  this.$router.push({
                    path: '/AutomatedRelease/Technology',
                    query: { code: 3 }
                  })
                }
                if (this.$route.query.protype == '4') {
                  this.$router.push({
                    path: '/AutomatedRelease/backupManagement',
                    query: { code: 3 }
                  })
                }
              } else {
                if (res.data.message == '方案名称不能重复！') {
                  this.$notify({
                    title: '提示',
                    message: res.data.message,
                    type: 'error'
                  })
                }
              }
            })
            .catch()
        } else {
          data.plan.planId = this.$route.query.planId
          axios.editDeployPlan(data)
            .then(res => {
              if (res.data.success) {
                this.$notify({
                  title: '提示',
                  message: '修改成功！',
                  type: 'success'
                })
                if (this.$route.query.protype == '1') {
                  this.$router.push({
                    path: '/AutomatedRelease/BackspaceManage',
                    query: { code: 3 }
                  })
                }
                if (this.$route.query.protype == '2') {
                  this.$router.push({
                    path: '/AutomatedRelease/Deploy',
                    query: { code: 3 }
                  })
                }
                if (this.$route.query.protype == '3') {
                  this.$router.push({
                    path: '/AutomatedRelease/Technology',
                    query: { code: 3 }
                  })
                }
                if (this.$route.query.protype == '4') {
                  this.$router.push({
                    path: '/AutomatedRelease/backupManagement',
                    query: { code: 3 }
                  })
                }
              } else {
                if (res.data.message == '方案名称不能重复！') {
                  this.$notify({
                    title: '提示',
                    message: res.data.message,
                    type: 'error'
                  })
                }
              }
            })
            .catch()
        }
      })
    },
    // 获取方案详情
    getdeployPlanDetail () {
      // 节点类型  节点类型 1,F5 2,数据库 3,服务器\"
      let planId = this.$route.query.planId
      axios.deployPlanDetail(planId)
        .then(res => {
          console.log(res)
          this.SchemeName = res.data.data.planModel.planName
          this.value2 =
            res.data.data.planModel.nodeType == '1'
              ? 'F5'
              : res.data.data.planModel.nodeType == '2'
                ? '数据库'
                : '服务器'
          this.remarks = res.data.data.planModel.remarks
          this.activityData.actXml = res.data.data.actXml
          this.isfirst = true
          this.issecond = true
        })
        .catch()
    },
    cancelactive () {
      if (this.$route.query.protype == '1') {
        this.$router.push({
          path: '/AutomatedRelease/BackspaceManage',
          query: { code: 3 }
        })
      }
      if (this.$route.query.protype == '2') {
        this.$router.push({
          path: '/AutomatedRelease/Deploy',
          query: { code: 3 }
        })
      }
      if (this.$route.query.protype == '3') {
        this.$router.push({
          path: '/AutomatedRelease/Technology',
          query: { code: 3 }
        })
      }
      if (this.$route.query.protype == '4') {
        this.$router.push({
          path: '/AutomatedRelease/backupManagement',
          query: { code: 3 }
        })
      }
    }
  },
  mounted () {
    if (this.$route.query.planId) {
      this.activityData.planId = this.$route.query.planId
      this.getdeployPlanDetail()
    } else {
      this.isfirst = true
      this.issecond = true
    }
    this.getnodeListprod()
  }
}
</script>

<style scoped>
.icons {
  color: #0066ff;
  font-size: 14px;
}
.tool-box ul {
  padding: 0 40px;
  max-height: 200px;
  overflow: auto;
}
.tool-box ul li {
}
.tool-box {
  border: 1px solid #c6c6c6;
  min-height: 200px;
  border-radius: 5px;
}
.form-text {
  width: 60%;
  resize: none;
  padding: 10px;
  border-radius: 5px;
  outline: none;
  border: 1px solid #ccc;
  box-sizing: border-box;
  resize: none;
}
.form-item {
  padding-left: 140px;
  position: relative;
  padding-top: 10px;
  min-height: 30px;
  margin-bottom: 10px;
}
.form-item label {
  position: absolute;
  left: 0;
  top: 10px;
  line-height: 30px;
  width: 130px;
  font-size: 14px;
  text-align: right;
}
.dialog-btn {
  overflow: hidden;
  padding: 30px 0 30px 140px;
}
.dialog-btn .btn-cancel {
  float: right;
}
.node-layout {
  background: #fff;
  padding-bottom: 20px;
  margin: 10px 10px 20px 10px;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.16);
}
.node-title {
  color: #585858;
  font-size: 16px;
  padding: 20px 0 0;
}
.node-title span {
  display: inline-block;
  width: 6px;
  border-radius: 10px;
  margin-right: 20px;
  height: 20px;
  background: #0280ff;
  vertical-align: middle;
}
.node-pannel {
  padding: 0 26px;
}
.node-fr {
  float: right;
}
.content {
  width: auto;
  height: 100%;
  padding: 10px;
  overflow-y: scroll;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.cursorp {
  cursor: pointer;
}
</style>
