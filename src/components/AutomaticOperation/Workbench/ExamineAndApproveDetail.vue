<template>
  <div class="node-layout non-shadow aibms-color-bg">
    <div v-if="businessType == 3">
      <div class="panel-item paddingTop" v-for="(item,index) in titleList" :key="index">
        <!-- <div
          class="node-title"
          v-if="(index === 3 && releaseList.length) || index !== 3"
          @click="toggleTitle(index)"
        >
          <span></span>
          <h3>{{item.name}}</h3>
          <i :class="item.status ? 'el-icon-arrow-down icons':'el-icon-arrow-right icons'"></i>
        </div>-->
        <div
          class="item-block-title"
          v-if="(index === 3 && releaseList.length) || index !== 3"
          @click="toggleTitle(index)"
        >
          <div class="item-block-title-mark"></div>
          <span class="item-block-title-font">{{item.name}}</span>
          <i
            class="icons el-icon-arrow-right"
            :style="{transform :item.status ? 'rotate(90deg)' : 'rotate(0)'}"
          ></i>
        </div>
        <div class="panel-box" v-show="index === 0 && item.status" style="width:30%;">
          <el-form
            :model="baseInfoForm"
            label-width="110px"
            label-position="right"
            :disabled="true"
            ref="baseInfoForm"
            class="ml24"
          >
            <el-form-item label="工单名称：" prop="name">
              <el-input
                v-model="workDetail.name"
                :style="{width: '280px'}"
                :readonly="true"
                placeholder="输入工单名称"
              ></el-input>
            </el-form-item>
            <el-form-item label="所属环境：" prop="systemId">
              <el-input
                v-model="workDetail.environmentName"
                :style="{width: '280px'}"
                :readonly="true"
                placeholder="请选择所属环境"
              ></el-input>
            </el-form-item>
            <el-form-item label="执行人：" prop="name" class="w28ml20">
              <UnlineStep :stepData="runUser" />
            </el-form-item>
            <el-form-item label="计划发布时间：">
              <el-date-picker
                v-model="workDetail.planStartTime"
                type="datetime"
                :style="{width: '280px'}"
                format="yyyy-MM-dd HH:mm:ss"
                :disabled="true"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="请选择计划发布时间"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="预计执行时长：">
              <el-input
                v-model="workDetail.estDuration"
                :style="{width: '280px'}"
                :readonly="true"
                placeholder="请输入预计发布时长，单位min"
              ></el-input>
            </el-form-item>
            <el-form-item label="计划结束时间：">
              <el-date-picker
                v-model="workDetail.planEndTime"
                type="datetime"
                :style="{width: '280px'}"
                :disabled="true"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="请选择计划结束时间"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="描述：">
              <el-input
                type="textarea"
                v-model="workDetail.remarks"
                :disabled="true"
                :style="{width: '280px'}"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="panel-box" v-if="index === 1 && item.status" style="position: relative;">
          <div class="import-workflow">
            <!--<el-checkbox v-model="isImportWorkflow" :disabled="status === 'read'">导入操作流水线</el-checkbox>-->
            <!--<el-select-->
            <!--v-if="isImportWorkflow"-->
            <!--v-model="importedWorkflow"-->
            <!--@change="setWorkflowByImport"-->
            <!--placeholder="选择所属环境"-->
            <!--:style="{width: '240px'}">-->
            <!--<el-option-->
            <!--v-for="item in pipelineList"-->
            <!--:key="item.pipelineId"-->
            <!--:label="item.name"-->
            <!--:value="item.pipelineId">-->
            <!--</el-option>-->
            <!--</el-select>-->
          </div>
          <div class="work-flow-wrapper non-border">
            <work-flow :activityData="workflowData" @confirm="setWorkFlowData"></work-flow>
          </div>
        </div>

        <div
          class="panel-box"
          v-show="index === 2 && item.status && releaseList.length "
          style="width:90%;"
        >
          <el-form ref="ruleForm" label-width="150px" class="demo-ruleForm ml44">
            <el-form-item label="审批原由：" style="width:40%" prop="name" class="w28ml20">
              <el-input maxlength="40" :disabled="true" v-model="baseInfoForm.createdByName"></el-input>
            </el-form-item>
            <el-form-item label="审批人：" prop="name" class="w28ml20">
              <Step :stepData="releaseList" />
            </el-form-item>
            <el-form-item label="抄送人：" prop="name" class="w28ml20">
              <UnlineStep :stepData="workDetail.sends" />
            </el-form-item>
            <el-form-item
              v-if="currentAudit"
              label="是否通过："
              size="medium"
              prop="systemId"
              class="w28ml20"
            >
              <el-radio label="0" v-model="examineData.auditStatus">审批通过</el-radio>
              <el-radio label="1" v-model="examineData.auditStatus">审批不通过</el-radio>
            </el-form-item>
            <el-form-item v-if="currentAudit" label="审批意见：" prop="name" class="w28ml20">
              <!--<el-input type="textarea" resize="none"></el-input>-->
              <textarea
                class="form-text"
                v-model="examineData.auditText"
                name
                id
                cols="30"
                rows="10"
              ></textarea>
            </el-form-item>
            <div v-if="currentAudit" class="form-item dialog-btn">
              <el-col :span="10">
                <div class="grid-content bg-purple">
                  <button class="cm-btn deep" @click.prevent="executeExamine">保存</button>
                  <button class="cm-btn isoutline node-fr" @click.stop="handleBack">取消</button>
                </div>
              </el-col>
            </div>
          </el-form>
        </div>
      </div>
    </div>

    <div v-if="businessType == 2">
      <div class="panel-item paddingTop" v-for="(item,index) in titleList" :key="index">
        <!-- <div
          class="node-title"
          v-if="(index === 3 && releaseList.length) || index !== 3"
          @click="toggleTitle(index)"
        >
          <span></span>
          <h3>{{item.name}}</h3>
          <i :class="item.status ? 'el-icon-arrow-down icons':'el-icon-arrow-right icons'"></i>
        </div>-->
        <div
          class="item-block-title"
          v-if="(index === 3 && releaseList.length) || index !== 3"
          @click="toggleTitle(index)"
        >
          <div class="item-block-title-mark"></div>
          <span class="item-block-title-font">{{item.name}}</span>
          <i
            class="icons el-icon-arrow-right"
            :style="{transform: item.status ? 'rotate(90deg)' : 'rotate(0)'}"
          ></i>
        </div>
        <div class="panel-box" v-show="index === 0 && item.status" style="width:30%;">
          <el-form
            :model="baseInfoForm"
            label-width="110px"
            label-position="right"
            :disabled="true"
            ref="baseInfoForm"
            class="ml24"
          >
            <el-form-item label="名称：" prop="name">
              <el-input
                v-model="baseInfoForm.name"
                :style="{width: '280px'}"
                :readonly="true"
                placeholder="输入名称"
              ></el-input>
            </el-form-item>
            <el-form-item label="环境：" prop="systemId">
              <el-select
                v-model="baseInfoForm.environmentName"
                :style="{width: '280px'}"
                :disabled="true"
                placeholder="环境"
              >
                <el-option
                  v-for="(item, index) in systemList"
                  :key="index"
                  :label="item.name"
                  :value="item.systemId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div
          class="panel-box"
          v-if="index === 1 && item.status"
          style="padding:20px 40px 20px 114px;position: relative;"
        >
          <div class="work-flow-wrapper non-border">
            <work-flow :activityData="workflowData" @confirm="setWorkFlowData"></work-flow>
          </div>
        </div>
        <div
          class="panel-box"
          v-show="index === 2 && item.status && releaseList.length "
          style="width:90%;"
        >
          <el-form ref="ruleForm" label-width="150px" class="demo-ruleForm ml44">
            <el-form-item label="审批原由：" style="width:40%" prop="name" class="w28ml20">
              <el-input maxlength="40" :disabled="true" v-model="baseInfoForm.content"></el-input>
            </el-form-item>
            <el-form-item label="审批人：" prop="name" class="w28ml20">
              <Step :stepData="releaseList" />
            </el-form-item>
            <el-form-item label="抄送人：" prop="name" class="w28ml20">
              <UnlineStep :stepData="baseInfoForm.sends" />
            </el-form-item>
            <el-form-item
              v-if="currentAudit"
              label="是否通过："
              size="medium"
              prop="systemId"
              class="w28ml20"
            >
              <el-radio label="0" v-model="examineData.auditStatus">审批通过</el-radio>
              <el-radio label="1" v-model="examineData.auditStatus">审批不通过</el-radio>
            </el-form-item>
            <el-form-item v-if="currentAudit" label="审批意见：" prop="name" class="w28ml20">
              <!--<el-input type="textarea" resize="none"></el-input>-->
              <textarea
                class="form-text"
                v-model="examineData.auditText"
                name
                id
                cols="30"
                rows="10"
              ></textarea>
            </el-form-item>

            <div v-if="currentAudit" class="form-item dialog-btn">
              <el-col :span="10">
                <div class="grid-content bg-purple">
                  <button class="cm-btn deep" @click.prevent="executeExamine">保存</button>
                  <button class="cm-btn isoutline node-fr" @click.stop="handleBack">取消</button>
                </div>
              </el-col>
            </div>
          </el-form>
        </div>
      </div>
    </div>
    <div v-if="businessType == 1">
      <div class="panel-item paddingTop" v-for="(item,index) in titleList" :key="index">
        <!-- <div class="node-title" v-if="index < 5 || (index === 5 && currentAudit)"><span></span> {{item.name}} <i :class="item.status ? 'el-icon-arrow-down icons':'el-icon-arrow-right icons'" @click="toggleTitle(index)"></i></div> -->
        <!-- <div class="node-title" v-if="(index === 5&&  releaseList.length) || index !== 5">
          <span></span>
          <h3>{{item.name}}</h3>
          <i
            :class="item.status ? 'el-icon-arrow-down icons':'el-icon-arrow-right icons'"
            @click="toggleTitle(index)"
          ></i>
        </div>-->
        <div
          class="item-block-title"
          v-if="(index === 5&&  releaseList.length) || index !== 5"
          @click="toggleTitle(index)"
        >
          <div class="item-block-title-mark"></div>
          <span class="item-block-title-font">{{item.name}}</span>
          <i
            class="icons el-icon-arrow-right"
            :style="{transform :item.status ? 'rotate(90deg)' : 'rotate(0)'}"
          ></i>
        </div>
        <div class="panel-box" v-show="index === 0 && item.status" style="width:40%;padding: 20px">
          <el-form ref="ruleForm" label-width="150px" class="demo-ruleForm ml24">
            <el-form-item label="脚本名称：" prop="name" class="w28ml20">
              <el-input
                maxlength="40"
                v-model="detailData.name"
                disabled
                size="medium"
                placeholder="请输入脚本名称"
              ></el-input>
            </el-form-item>
            <el-form-item label="功能分类：" prop="name" class="w28ml20">
              <el-input maxlength="40" v-model="detailData.groupName" disabled size="medium"></el-input>
            </el-form-item>
            <el-form-item label="标签云：" prop="name" class="w28ml20">
              <el-tag
                class="tag-item"
                :key="tag.tagId"
                v-for="tag in detailData.tagId"
                :disable-transitions="false"
              >{{tag.name}}</el-tag>
              <!--<el-input maxlength="40" v-model="detailData.tagId" disabled size="medium"></el-input>-->
            </el-form-item>
            <el-form-item label="脚本内容：" prop="name" class="w28ml20">
              <el-input
                :rows="10"
                type="textarea"
                v-model="detailData.content"
                disabled
                size="medium"
              ></el-input>
            </el-form-item>
            <el-form-item label="脚本说明：" prop="name" class="w28ml20">
              <el-input maxlength="40" size="medium" disabled v-model="detailData.remarks"></el-input>
            </el-form-item>
            <el-form-item label="执行工具：" prop="name" class="w28ml20">
              <el-input maxlength="40" size="medium" disabled v-model="detailData.runTool"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="panel-box" v-show="index === 1 && item.status" style="width:90%;">
          <el-table
            :data="detailData.putList"
            stripe
            border
            style="width: 100%"
            :header-cell-style="{ background: '#f5f5f5' }"
          >
            <el-table-column align="center" prop="name" label="参数名" width="180"></el-table-column>
            <el-table-column align="center" prop="titleName" label="参数标题名称" width="180"></el-table-column>
            <el-table-column align="center" prop="paramValue" label="参数值"></el-table-column>
            <el-table-column align="center" prop="paramType" label="参数类型" width="180"></el-table-column>
            <el-table-column align="center" prop="remarks" label="参数说明"></el-table-column>
          </el-table>
        </div>
        <div class="panel-box" v-show="index === 2 && item.status" style="width:90%;">
          <el-table
            :data="detailData.outList"
            stripe
            border
            style="width: 100%"
            :header-cell-style="{ background: '#f5f5f5' }"
          >
            <el-table-column align="center" prop="name" label="参数名" width="180"></el-table-column>
            <el-table-column align="center" prop="titleName" label="参数标题名称" width="180"></el-table-column>
            <el-table-column align="center" prop="paramValue" label="参数值" width="180"></el-table-column>
            <el-table-column align="center" prop="paramType" label="参数类型"></el-table-column>
            <el-table-column align="center" prop="remarks" label="参数说明" width="180"></el-table-column>
          </el-table>
        </div>
        <div class="panel-box logInfo" v-show="index === 3 && item.status " style="width:90%;">
          <div class="block">
            <ul>
              <li class="timeline-item" v-for="(item,index) in logs" :key="index">
                <p>
                  <icon-svg icon-class="rili" class="gray-icon-color" />
                  <span>{{item.createDate.split(' ')[0]}}</span>
                </p>
                <ul class="list-box">
                  <li>
                    <span class="time">{{item.createDate.split(' ')[1]}}</span>
                    <img :src="item.photo" alt />
                    <span class="operation">
                      <label>操作人：</label>
                      <span>{{item.loginName}}</span>
                    </span>
                    <span class="code">
                      <label>版本号：</label>
                      <span
                        style="cursor: pointer"
                        @click="logDetail(item.logId,index)"
                      >{{item.logId}}</span>
                    </span>
                  </li>
                </ul>
              </li>
              <!-- <li class="timeline-item">
                              <p>
                                  <img src="../../../../static/img/icon/time.png" alt="">
                                  <span>2019-4-27</span>
                              </p>
                              <ul class="list-box">
                                  <li>
                                      <h4>更新 Github 模板</h4>
                                      <p>王小虎 提交于 2018/4/2 20:46</p>
                                  </li>
                              </ul>
              </li>-->
            </ul>
          </div>
        </div>
        <div class="panel-box" v-show="index === 4 && item.status" style="width:90%;">
          <el-form ref="ruleForm" label-width="150px" class="demo-ruleForm">
            <el-form-item label="审批人：" prop="name" class="w28ml20">
              <Step :stepData="releaseList" />
            </el-form-item>
            <el-form-item label="抄送人：" prop="name" class="w28ml20">
              <UnlineStep :stepData="detailData.sendcopyids" />
            </el-form-item>
            <el-form-item
              v-if="currentAudit"
              label="是否通过："
              size="medium"
              prop="systemId"
              class="w28ml20"
            >
              <el-radio label="0" v-model="examineData.auditStatus">审批通过</el-radio>
              <el-radio label="1" v-model="examineData.auditStatus">审批不通过</el-radio>
            </el-form-item>
            <el-form-item v-if="currentAudit" label="审批意见：" prop="name" class="w28ml20">
              <!--<el-input type="textarea" resize="none"></el-input>-->
              <textarea
                class="form-text"
                v-model="examineData.auditText"
                name
                id
                cols="30"
                rows="10"
              ></textarea>
            </el-form-item>
            <div v-if="currentAudit" class="form-item dialog-btn">
              <el-col :span="10">
                <div class="grid-content bg-purple">
                  <button class="cm-btn deep" @click.prevent="executeExamine">保存</button>
                  <button class="cm-btn isoutline node-fr" @click.stop="handleBack">取消</button>
                </div>
              </el-col>
            </div>
          </el-form>
        </div>
        <el-dialog title="日志详情" :visible.sync="dialogVisible" width="50%" center>
          <div class="panel-item">
            <div class="node-title">
              <span></span> 基本信息
            </div>
            <div class="panel-box" style="padding: 20px">
              <el-form ref="ruleForm" label-width="150px" class="demo-ruleForm">
                <el-form-item label="脚本名称：" prop="name" class="w28ml20">{{currentLog.name}}</el-form-item>
                <el-form-item label="功能分类：" prop="name" class="w28ml20">{{currentLog.groupName}}</el-form-item>
                <el-form-item label="标签云：" prop="name" class="w28ml20">
                  <el-tag
                    class="tag-item"
                    :key="tag.tagId"
                    v-for="tag in currentLog.tagId"
                    :disable-transitions="false"
                  >{{tag.name}}</el-tag>
                </el-form-item>
                <el-form-item label="脚本内容：" prop="name" class="w28ml20">
                  <editor
                    editorId="scriptEditor"
                    :readValue="currentLog.content"
                    :readOnly="true"
                    :initWidth="465"
                    :initHeight="380"
                  ></editor>
                </el-form-item>
                <el-form-item label="脚本说明：" prop="name" class="w28ml20">{{currentLog.remarks}}</el-form-item>
                <el-form-item label="执行工具：" prop="name" class="w28ml20">{{currentLog.runTool}}</el-form-item>
              </el-form>
            </div>
          </div>
          <div class="panel-item">
            <div class="node-title">
              <span></span> 输入参数
            </div>
            <div class="panel-box" style="width:100%;">
              <el-table
                :data="currentLog.putList"
                stripe
                border
                :header-cell-style="{ background: '#f5f5f5' }"
                style="width: 100%"
              >
                <el-table-column align="center" prop="name" label="参数名" width="180"></el-table-column>
                <el-table-column align="center" prop="titleName" label="参数标题名称" width="180"></el-table-column>
                <el-table-column align="center" prop="paramValue" label="参数值"></el-table-column>
                <el-table-column align="center" prop="paramType" label="参数类型" width="180"></el-table-column>
                <el-table-column align="center" prop="remarks" label="参数说明"></el-table-column>
              </el-table>
            </div>
          </div>
          <div class="panel-item">
            <div class="node-title">
              <span></span> 输出参数
            </div>
            <div class="panel-box" style="width:100%;padding: 20px 0">
              <el-table
                :data="currentLog.outList"
                stripe
                border
                :header-cell-style="{ background: '#f5f5f5' }"
                style="width: 100%"
              >
                <el-table-column align="center" prop="name" label="参数名" width="180"></el-table-column>
                <el-table-column align="center" prop="titleName" label="参数标题名称" width="180"></el-table-column>
                <el-table-column align="center" prop="paramValue" label="参数值" width="180"></el-table-column>
                <el-table-column align="center" prop="paramType" label="参数类型"></el-table-column>
                <el-table-column align="center" prop="remarks" label="参数说明" width="180"></el-table-column>
              </el-table>
            </div>
          </div>
          <div slot="footer" class="dialog-footer">
            <!-- <el-button type="primary">确 定</el-button> -->
            <el-button @click="dialogVisible = false">取 消</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import Step from './ReleaseStep.vue'
import UnlineStep from './UnlineStep.vue'
// import Workflow from '../ReleaseWorkflow.vue'
import Editor from '../../common/Editor.vue'
import TaskTimeline from './TaskTimeline'
import common from '@/utils/commonjs'
import WorkFlow from '../pipeline-workflow'
import axios from '@/api';
export default {
  name: 'ExamineAndApproveDetail',
  data () {
    return {
      runUser: [],
      dialogVisible: false,
      activityData: {},
      workflowData: {},
      examineData: {
        auditLogId: '',
        businessId: '',
        businessType: '',
        version: ''
      },
      detailData: {
        createdByName: '',
        createDate: '',
        updateDate: '',
        putList: [],
        outList: []
      },
      currentStage: 1,
      businessType: '',
      currentOrder: null,
      currentAudit: false,
      titleList: [
        {
          status: true,
          name: '基本信息'
        },
        {
          status: false,
          name: '任务线'
        },
        {
          status: false,
          name: '审批信息'
        },
        {
          status: false,
          name: '审批意见'
        }
      ],
      releaseList: [],
      systemTypes: [],
      value: '123',
      jobData: {},
      logs: [],
      currentLog: {},
      ApplyList: [],
      baseInfoForm: {}, // 发布任务表单
      selectedTasks: [],
      workDetail: {},
      // 优先级映射表
      priorityTypeList: [
        { id: 1, value: '最低' },
        { id: 2, value: '低' },
        { id: 3, value: '中' },
        { id: 4, value: '高' },
        { id: 5, value: '最高' }
      ],
      // 发布策略映射表
      releaseStrategyList: [
        { id: 1, name: '金丝雀发布' },
        { id: 2, name: '蓝绿发布' },
        { id: 3, name: '滚动发布' }
      ],
      systemList: []
    }
  },
  components: {
    Step,
    UnlineStep,
    WorkFlow,
    Editor,
    TaskTimeline
  },
  created () {
    let query = this.$route.query
    if (query.type == '0') {
      this.currentAudit = true
    } else {
      this.currentAudit = false
    }
    // let data = null;
    if (query.businessType === '1' && query.businessId) {
      this.titleList = [
        {
          status: true,
          name: '基本信息'
        },
        {
          status: false,
          name: '输入参数'
        },
        {
          status: false,
          name: '输出参数'
        },
        {
          status: false,
          name: '修改日志'
        },
        {
          status: true,
          name: '审批意见'
        }
      ]

      this.examineData.businessId = query.businessId
      this.examineData.businessType = query.businessType
      this.businessType = query.businessType
      this.businessId = query.businessId
      // 获取脚本详情
      this.OpsToolDetail(this.businessId, query)
    } else if (query.businessType === '2' && query.businessId) {
      this.titleList = [
        {
          status: true,
          name: '基本信息'
        },
        {
          status: false,
          name: '流程设计'
        },
        {
          status: false,
          name: '审批意见'
        }
      ]
      this.examineData.businessId = query.businessId
      this.examineData.businessType = query.businessType
      this.businessType = query.businessType
      // axios.getcigroupSystablist('').then(result => {
      //   console.log(result)
      //   if (result.data.code === 200) {
      //     this.systemList = result.data.data.result;
      //   }
      // });
      // 获取任务详情
      this.getJobDetail(query.businessId, query)
    } else if (query.businessType === '3' && query.businessId) {
      this.titleList = [
        {
          status: true,
          name: '基本信息'
        },
        {
          status: false,
          name: '操作步骤'
        },
        {
          status: true,
          name: '审批意见'
        }
      ]
      this.examineData.businessId = query.businessId
      this.examineData.businessType = query.businessType
      this.businessType = query.businessType
      axios.getcigroupSystablist('').then(result => {
        console.log(result)
        if (result.data.code === 200) {
          this.systemList = result.data.data.result
        }
      })
      // 获取工单详情
      this.getWorkerDetail(query.businessId, query)
    }
  },
  methods: {
    // 接受流程设计器子组件传递过来的工作流数据
    setWorkFlowData (data) {
      this.workflowData = data
    },
    // 获取工单详情
    getWorkerDetail (id, query) {
      axios.getWorkOrder(id).then(result => {
        if (result.data.code === 200) {
          console.log(result)
          this.workDetail = this.dataTransform(result.data.data)
          let option = {
            businessType: query.businessType,
            businessId: query.businessId,
            version: result.data.data.jobVersion
          }
          this.getRunUserInformation(this.workDetail.runUser)
          this.examineData.version = result.data.data.jobVersion
          // this.selectedTasks = this.workDetail.actXml;
          let approve = this.workDetail.approvalids
            ? this.handlePersonal(this.workDetail.approvalids)
            : []
          this.ApplyList = approve
          this.workDetail.approvalids = approve
          this.workDetail.sendcopyids = result.data.data.sendcopyids
            ? this.handlePersonal(result.data.data.sendcopyids)
            : []
          this.workflowData = {
            actXml: result.data.data.actXml,
            nodeParam:
              result.data.data.tempNodeparams || result.data.data.jobNodeparams
          }
          console.log(this.workflowData)

          this.opsGetAuditLogDetail(option)
        }
      })
    },
    // 取消按钮
    handleBack () {
      this.$router.push({
        path: '/AutomaticOperation/examineAndApprove',
        query: {
          code: 4
        }
      })
    },
    logDetail (id, index) {
      // axios.opsEditLogs(id).then(data => {
      //     console.log(data)
      // })
      this.dialogVisible = true
      this.currentLog = this.logs[index]
    },
    // 根据节点id查询节点详情
    getId (data) {
      this.actXml = data.actXml
      this.nodeParam = data.nodeParam
    },
    getJobDetail (id, query) {
      axios.deatilpipelineTemp(id).then(res => {
        if (res.data.code === 200) {
          let option = {
            businessType: query.businessType,
            businessId: query.businessId,
            version: 1
          }
          // 获取个人信息
          this.opsGetAuditLogDetail(option)

          this.examineData.version = res.data.data.tempVersion
          this.baseInfoForm = this.dataTransform(res.data.data)
          this.workflowData = {
            actXml: res.data.data.actXml,
            nodeParam: res.data.data.tempNodeparams
          }
          console.log(this.workflowData)

          // this.selectedTasks = this.baseInfoForm.jobList;
          if (query.type === 0) {
            this.currentAudit = true
          } else {
            this.currentAudit = false
          }
        }
      })
    },
    // 请求数据处理
    dataTransform (data) {
      let result = data
      let runUsers = data.runUsers ? JSON.parse(data.runUsers) : []
      let dutyUsers = data.dutyUsers ? JSON.parse(data.dutyUsers) : []
      let partUsers = data.partUsers ? JSON.parse(data.partUsers) : []
      let approves = data.approvalids ? JSON.parse(data.approvalids) : []
      let sends = data.sendcopyids ? JSON.parse(data.sendcopyids) : []
      let createBy = data.createBy
      result.createdByName = this.getCreateUser(createBy)
      result.runUsers =
        runUsers.length > 0 ? this.handlePersonal(runUsers) : []
      result.dutyUsers =
        dutyUsers.length > 0 ? this.handlePersonal(dutyUsers) : []
      result.partUsers =
        partUsers.length > 0 ? this.handlePersonal(partUsers) : []
      result.approves =
        approves.length > 0 ? this.handlePersonal(approves) : []
      result.sends = sends.length > 0 ? this.handlePersonal(sends) : []
      return result
    },
    // 切换小模块显示
    toggleTitle (index) {
      this.titleList[index].status = !this.titleList[index].status
    },
    executeExamine () {
      if (
        this.examineData.auditStatus === 1 &&
        (!this.examineData.auditText || !this.examineData.auditText.trim())
      ) {
        return this.$notify({
          title: '提示',
          message: '请输入拒绝理由！',
          type: 'error'
        })
      }
      this.opsGetAuditLogUpdate(this.examineData)
    },
    // 获取工具详情
    OpsToolDetail (id, query) {
      if (this.$route.query.logId) {
        this.currentAudit = false
        this.getLogDetail(id, query)
      } else {
        this.currentAudit = true
        this.getNomalDetail(id, query)
      }
    },
    // 获取版本号的详情
    getLogDetail (id, query) {
      axios.opsEditLogs(this.$route.query.logId).then(res => {
        if (res.data.result) {
          if (
            query.auditStatus === '0' ||
            query.auditStatus === '1' ||
            query.auditStatus === '3'
          ) {
            this.currentAudit = false
          } else {
            this.currentAudit = true
          }
          let data = res.data.result
          this.examineData.version = data.toolVersion
          let option = {
            businessType: query.businessType,
            businessId: query.businessId,
            version: data.toolVersion
          }
          // 获取个人信息
          this.opsGetAuditLogDetail(option)
          this.detailData = data
          this.handleParams(data.toolParams)
          if (data.tagId) {
            let tagId = JSON.parse(data.tagId)
            this.detailData.tagId = tagId
          } else {
            this.detailData.tagId = []
          }
          let approve = data.approvalids
            ? this.handlePersonal(data.approvalids)
            : []
          this.ApplyList = approve
          this.detailData.approvalids = approve
          this.detailData.sendcopyids = data.sendcopyids
            ? this.handlePersonal(data.sendcopyids)
            : []
          this.opsGetToolLog(id)

          this.getCreateUser(this.detailData.createBy)
        }
      })
    },

    // 获取正常详情
    getNomalDetail (id, query) {
      axios.OpsToolDetail(id).then(data => {
        if (data.data.result) {
          if (query.type === 0) {
            this.currentAudit = true
          } else {
            this.currentAudit = false
          }
          this.examineData.version = data.data.result.toolVersion
          let option = {
            businessType: query.businessType,
            businessId: query.businessId,
            version: data.data.result.toolVersion
          }
          // 获取个人信息
          this.opsGetAuditLogDetail(option)
          this.detailData = data.data.result
          this.detailData.putList = []
          this.detailData.outList = []
          if (
            data.data.result.applyStatus === '3' ||
            data.data.result.applyStatus === '1'
          ) {
            this.currentAudit = false
          }
          this.handleParams(data.data.param)
          if (typeof data.data.result.tagId === 'string') {
            data.data.result.tagId = common.evil(data.data.result.tagId)
          }
          this.detailData.tagId = data.data.result.tagId
          let approve = data.data.result.approvalids
            ? this.handlePersonal(data.data.result.approvalids)
            : []
          this.ApplyList = approve
          this.detailData.approvalids = approve
          this.detailData.sendcopyids = data.data.result.sendcopyids
            ? this.handlePersonal(data.data.result.sendcopyids)
            : []

          this.opsGetToolLog(id)

          this.getCreateUser(this.detailData.createBy)
        }
      })
    },

    // 处理审批人
    handlePersonal (personal) {
      let resultArr = []
      if (personal) {
        resultArr = personal
        if (Array.isArray(resultArr) || typeof resultArr === 'object') {
          resultArr.forEach((item, index) => {
            this.getApplyInformation(resultArr, item.userId, index)
          })
          // resultArr.map((item, index) => {
          //   this.getApplyInformation(resultArr, item.userId, index);
          // });
        } else if (typeof resultArr === 'string') {
          let arr = JSON.parse(resultArr)
          arr.forEach((item, index) => {
            this.getApplyInformation(resultArr, item.userId, index)
          })
          // arr.map((item, index) => {
          //   this.getApplyInformation(arr, item.userId, index);
          // });
          resultArr = arr
        } else {
          resultArr = []
        }
      } else {
        resultArr = []
      }
      return resultArr
    },
    // 处理参数
    handleParams (toolParams) {
      if (toolParams) {
        let params
        if (typeof toolParams === 'string') {
          params = common.evil(toolParams)
        } else {
          params = toolParams
        }

        let input = []
        let output = []
        params.forEach(item => {
          if (item !== null && item.paramNature === 1) {
            input.push(item)
          } else if (item !== null && item.paramNature === 2) {
            output.push(item)
          }
        })
        this.detailData.putList = input
        this.detailData.outList = output
      } else {
        this.detailData.putList = []
        this.detailData.outList = []
      }
    },
    // 获取审批日志详情
    opsGetToolLog (id) {
      axios.opsGetToolLog(id).then(data => {
        if (data.data.status.index === 200) {
          this.logs = data.data.result

          data.data.result.forEach((log, index) => {
            let toolParams = JSON.parse(log.toolParams)
            if (toolParams && toolParams.length) {
              log.toolParams = toolParams
              let putList = []
              let outList = []
              toolParams.forEach(item => {
                if (item !== null && item.paramNature === 1) {
                  putList.push(item)
                }
                if (item !== null && item.paramNature === 2) {
                  outList.push(item)
                }
              })
              this.$set(this.logs[index], 'putList', putList)
              this.$set(this.logs[index], 'outList', outList)
            } else {
              log.toolParams = []
            }
            if (typeof log.tagId === 'string') {
              log.tagId = common.evil(log.tagId)
            }
            this.logs[index].tagId = log.tagId
          })
        }
        // logs
      })
    },
    // 获取抄送人信息
    getBusyInformation (id, index) {
      axios.getImformation(id).then(data => {
        if (data.data.code === 200) {
          this.$set(
            this.jobData.sendcopyids[index - 1],
            'photo',
            data.data.data.result.photo
          )
          this.$set(
            this.jobData.sendcopyids[index - 1],
            'name',
            data.data.data.result.name
          )
        }
      })
    },
    // 获取审批人信息
    getApplyInformation (arr, id, index) {
      axios.getImformation(id).then(data => {
        if (data.data.code === 200) {
          let obj = {
            userId: id,
            order: index,
            photo: data.data.data.result.photo,
            name: data.data.data.result.name
          }
          this.$set(arr, index, obj)
        }
      })
    },
    // 获取创建用户
    getCreateUser (id) {
      axios.getImformation(id).then(res => {
        if (res && res.data.data.result) {
          this.currentUser = res.data.data.result
          if (this.$route.query.businessType === 2) {
            this.baseInfoForm.createdByName = this.currentUser.name
          } else {
            this.detailData.createdByName = this.currentUser.name
          }
        } else {
          this.$notify({
            title: '提示',
            message: res.data.message,
            type: 'error'
          })
        }
      })
    },

    // 获取抄送人信息
    getCopyInformation (id, index) {
      axios.getImformation(id).then(data => {
        if (data.data.code === 200) {
          this.$set(
            this.detailData.sendcopyids[index - 1],
            'photo',
            data.data.data.result.photo
          )
          this.$set(
            this.detailData.sendcopyids[index - 1],
            'name',
            data.data.data.result.name
          )
        }
      })
    },
    // 获取当前用户
    getCurrentUser () {
      let id = localStorage.getItem('userId')
      axios.getImformation(id).then(res => {
        if (res && res.data.data.result) {
          this.currentUser = res.data.data.result
          this.detailData.createdByName = this.currentUser.name
        } else {
          this.$notify({
            title: '提示',
            message: res.data.data.message,
            type: 'error'
          })
        }
      })
    },
    // 获取执行人个人信息
    getRunUserInformation (id) {
      axios.getImformation(id).then(data => {
        if (data.data.code === 200) {
          // if(user === 'getCurrentUser')
          // this.detailData.createdByName = data.data.data.result.name;
          let obj = {}
          obj.name = data.data.data.result.name
          obj.photo = data.data.data.result.photo
          this.runUser = [obj]
        }
      })
    },
    // 获取个人信息
    getImformation (id, index, user) {
      axios.getImformation(id).then(data => {
        if (data.data.code === 200) {
          // if(user === 'getCurrentUser')
          // this.detailData.createdByName = data.data.data.result.name;
          if (index || index === 0) {
            this.releaseList[index].auditByName = data.data.data.result.name
            this.$set(
              this.releaseList[index],
              'photo',
              data.data.data.result.photo
            )
          }
        }
      })
    },

    // 更新审批状态
    opsGetAuditLogUpdate (searchData) {
      axios.opsGetAuditLogUpdate(searchData).then(data => {
        if (data.data.code === 200) {
          // if(this.examineData.auditStatus){
          //     this.releaseList[this.currentOrder - 1].auditStatus = this.examineData.auditStatus;
          // }if(this.examineData.auditText){
          //     this.releaseList[this.currentOrder - 1].auditText = this.examineData.auditText;
          // }
          this.currentAudit = false
          this.$notify({
            title: '提示',
            message: '审批成功',
            type: 'success'
          })
          this.$router.push({
            path: '/AutomaticOperation/examineAndApprove',
            query: {
              code: 4
            }
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

    // 获取审批详情
    opsGetAuditLogDetail (searchData) {
      axios.opsGetAuditLogDetail(searchData).then(data => {
        if (this.$route.query.type === 0) {
          this.currentAudit = true
        } else {
          this.currentAudit = false
        }
        this.releaseList = data.data.data
        let id = localStorage.getItem('userId')
        data.data.data.forEach((data, index) => {
          if (data.auditBy === id) {
            if (index === 0 && this.releaseList[index].auditStatus === '') {
              this.currentAudit = true
              this.currentOrder = parseInt(data.approvaOrder)
              this.examineData.auditLogId = data.auditLogId
            } else if (
              this.releaseList[index - 1] &&
              this.releaseList[index - 1].auditStatus !== '' &&
              this.releaseList[index].auditStatus === ''
            ) {
              this.currentAudit = true
              this.currentOrder = parseInt(data.approvaOrder)
              this.examineData.auditLogId = data.auditLogId
            }
          }
          this.getImformation(data.auditBy, index)
        })
      })
    }
  }
}
</script>

<style scoped>
.work-flow-wrapper {
  border: 1px solid #eee;
  overflow: hidden;
}
.dialog-footer {
  text-align: center;
}
.title-info {
  background: #f0f0f0;
  line-height: 40px;
  color: #585858;
  display: flex;
  padding-right: 200px;
}
.title-info li {
  text-align: left;
  padding: 0 20px;
  font-size: 14px;
}
.icons {
  color: #00A8E8;
  font-size: 20px;
  vertical-align: middle;
  margin-left: 4px;
}
.tool-box ul {
  padding: 0 40px;
  max-height: 200px;
  overflow: auto;
}
.tool-box {
  border: 1px solid #c6c6c6;
  /*min-height: 200px;*/
  border-radius: 5px;
  width: 200%;
  padding: 10px;
}
.tool-box.special {
  border: none;
  padding-left: 0;
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
div.node-title:nth-child(1) {
  padding: 10px 0 0;
}
.node-layout {
  background: #fff;
  margin: 10px;
  padding-bottom: 20px;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.16);
}
.node-title {
  color: #585858;
  font-size: 14px;
  padding: 20px 0 0;
}
.node-title > h3 {
  font-size: 16px;
  display: inline-block;
  color: #000;
  font-weight: normal;
  line-height: 32px;
}
.node-title span {
  display: inline-block;
  width: 8px;
  border-radius: 4px;
  margin-right: 22px;
  height: 32px;
  background: #00A8E8;
  vertical-align: middle;
}
.node-pannel {
  padding: 0 26px;
}
.node-fr {
  float: right;
}
.logInfo .block {
  padding: 0 10%;
}
.logInfo .block .list-box > li {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.logInfo .block .list-box > li > img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.logInfo .block .timeline-item {
  padding: 10px;
}
.logInfo .block .timeline-item > p {
  padding: 10px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
.logInfo .block .timeline-item > p > img {
  width: 20px;
  height: 20px;
}
.logInfo .block .timeline-item > p > span {
  padding-left: 20px;
  font-size: 14px;
  color: #3e444a;
}
.logInfo .block .timeline-item > .list-box {
  width: 90%;
  margin-left: 20px;
  padding-left: 30px;
  border-left: 2px solid #707070;
}
.logInfo .block .timeline-item > .list-box > li {
  padding: 10px 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.logInfo .block .timeline-item > .list-box > li .time {
  font-size: 15px;
  color: #3e444a;
  padding: 0 20px;
}
.logInfo .block .timeline-item > .list-box > li > img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
.logInfo .block .timeline-item > .list-box > li .operation {
  padding: 0 30px 0 20px;
  font-size: 15px;
  color: #3e444a;
}
.logInfo .block .timeline-item > .list-box > li .code {
  font-size: 15px;
}
.logInfo .block .timeline-item > .list-box > li .code > span {
  color: #00A8E8;
}
.ml24 {
  padding-left: 24px;
}
/*.ml44 {
   padding-left: 44px;
}*/
</style>
