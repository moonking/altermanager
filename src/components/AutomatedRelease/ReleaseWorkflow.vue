/* eslint-disable indent */
<template>
  <div class="containers" ref="content">
    <div id="div2">
      <div class="canvas" ref="canvas"></div>
      <div
        id="js-properties-panel"
        style="opacity: 0;z-index: -10;height: 0; overflow: hidden;width: 300px;left: 70%;"
        class="panel"
      ></div>
      <div id="div1"></div>
      <div id="bottom">↓</div>
    </div>
    <div id="js-properties-panel" class="panel"></div>
    <ul class="buttons" v-show="false">
      <li>下载</li>
      <li>
        <a ref="saveDiagram" href="javascript:" title="download BPMN diagram">BPMN diagram</a>
      </li>
      <li>
        <a ref="saveSvg" href="javascript:" title="download as SVG image">SVG image</a>
      </li>
    </ul>
    <el-dialog
      :visible="addSystemBox && !isShowApproval"
      title="编辑节点"
      size="tiny"
      center
      :before-close="handleDialogClose"
      width="850px"
    >
      <div class="headportraitbox">
        <el-form ref="form" :model="form" label-width="100px" :rules="rules">
          <el-form-item label="节点名称: " class="disinlne" prop="name">
            <el-input
              style="width:55%"
              v-model="form.name"
              autocomplete="off"
              maxlength="20"
              :disabled="$route.query.type=='1'"
            />
          </el-form-item>
          <el-form-item label="节点类型: " class="disinlne" prop="resource">
            <el-radio-group
              v-model="form.resource"
              @change="gettype"
              :disabled="$route.query.type=='1'"
            >
              <el-radio label="脚本" />
              <el-radio label="人工判断" v-if="plantype=='2'" />
              <el-radio label="获取制品" v-if="$route.query.task!=1" />
              <el-radio label="上传制品" v-if="$route.query.task==1" />
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="项目组编号: "
            class="disinlne"
            prop="teamId"
            v-if="form.resource == '上传制品'&&$route.query.task=='1'"
          >
            <el-input
              style="width:55%"
              v-model="form.teamId"
              autocomplete="off"
              placeholder="请输入项目组编号"
              maxlength="20"
              :disabled="$route.query.type=='1'"
            />
          </el-form-item>
          <el-form-item
            label="制品编号: "
            class="disinlne"
            prop="nexusPackageId"
            v-if="form.resource == '上传制品'&&$route.query.task=='1'"
          >
            <el-input
              style="width:55%"
              v-model="form.nexusPackageId"
              autocomplete="off"
              placeholder="请输入制品编号"
              maxlength="20"
              :disabled="$route.query.type=='1'"
            />
          </el-form-item>
          <el-form-item
            label="版本号: "
            class="disinlne"
            prop="nexusVersion"
            v-if="form.resource == '上传制品'&&$route.query.task=='1'"
          >
            <el-input
              style="width:55%"
              v-model="form.nexusVersion"
              autocomplete="off"
              placeholder="请输入版本号"
              maxlength="20"
              :disabled="$route.query.type=='1'"
            />
          </el-form-item>
          <el-form-item
            label="路径: "
            class="disinlne"
            v-if="form.resource == '上传制品'&&$route.query.task=='1'"
          >
            <el-input
              style="width:55%"
              v-model="form.nexusPath"
              autocomplete="off"
              placeholder="请输入发布机上的制品文件路径"
              maxlength="20"
              :disabled="$route.query.type=='1'"
            />
          </el-form-item>
          <el-form-item
            label="仓库: "
            class="disinlne"
            v-if="form.resource == '上传制品'&&$route.query.task=='1'"
          >
            <el-select
              v-model="form.nexusID"
              placeholder="请选择制品库"
              clearable
              @change="getProduct"
              style="width:21%"
              :disabled="$route.query.type=='1'"
            >
              <el-option
                :label="item.name"
                :value="item.productId"
                v-for="(item,index) in productList"
                :key="index"
              />
            </el-select>
            <el-select
              v-model="form.warehouseName"
              placeholder="请选择仓库"
              clearable
              @change="getWarehouse"
              style="width:33%"
              :disabled="$route.query.type=='1'"
            >
              <el-option
                :label="item.name"
                :value="item.name"
                v-for="(item,index) in warehouseList"
                :key="index"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="选择审批人: "
            class="disinlne"
            v-if="form.resource == '人工判断'"
            prop="judgements"
          >
            <el-select
              v-model="judgement"
              placeholder="请选择判断人"
              style="width:55%"
              filterable
              clearable
              @change="getSelectJudgement"
              :disabled="$route.query.type=='1'"
            >
              <el-option
                v-for="item in judgementList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <div class="f12" v-if="isshowtx">系统将会自动发送邮件提醒</div>
          </el-form-item>
          <el-form-item
            label="选择脚本: "
            class="disinlne"
            v-if="form.resource == '脚本'"
            prop="pipevalue"
          >
            <el-cascader
              v-if="$route.query.type!='1'"
              placeholder="请选择脚本"
              :disabled="$route.query.type=='1'"
              clearable
              style="width:55%"
              :options="options"
              v-model="pipeline"
              @change="getSelectScript"
            />
            <el-cascader
              v-if="pipeline.length>0&&pipeline[1].length>0&&$route.query.type=='1'"
              placeholder="请选择脚本"
              :disabled="$route.query.type=='1'"
              clearable
              style="width:55%"
              :options="options"
              v-model="pipeline"
              @change="getSelectScript"
            />
            <div class="f12" v-if="isMust">下方表格参数值为必填时请填写</div>
          </el-form-item>
          <el-form-item
            label="参数值: "
            style="margin-right: 20px;"
            v-if="form.resource == '脚本'&&(pipeline.length && pipeline[1].length)"
          >
            <el-table
              :data="tableData"
              style="width: 100%"
              max-height="300"
              :header-cell-style="{ background: '#f5f5f5' }"
            >
              <el-table-column prop="name" label="参数名" width="120"></el-table-column>
              <el-table-column prop="titleName" label="参数标题名称" width="120"></el-table-column>
              <el-table-column label="参数类型" width="120">
                <template slot-scope="scope">{{ scope.row.paramType | typeStatusFilter }}</template>
              </el-table-column>
              <el-table-column prop="remarks" label="参数说明" width="120"></el-table-column>
              <el-table-column label="参数值">
                <template slot-scope="scope">
                  <el-tooltip
                    class="item"
                    effect="light"
                    :content="scope.row.paramValue"
                    placement="right"
                  >
                    <el-input
                      :disabled="$route.query.type=='1'"
                      size="mini"
                      v-model="scope.row.paramValue"
                    ></el-input>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column label="是否必填" width="120">
                <template slot-scope="scope">{{scope.isEmpty?'是':'否'}}</template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <div
            class="marl txtcenter"
            style="margin-left:0;    text-align: center; "
            v-if="$route.query.type!='1'"
          >
            <el-button :loading="editLoading" type="primary" @click="sure">保存</el-button>
            <el-button type="primary" class="margin-l100" @click="cancel">取消</el-button>
          </div>
        </el-form>
      </div>
    </el-dialog>
    <el-dialog
      :visible="isShowJudge"
      title="编辑节点"
      size="tiny"
      center
      :before-close="handleDialogCloseJudge"
      width="630px"
    >
      <div class="headportraitbox">
        <el-form ref="formJudge" :model="formJudge" label-width="100px" :rules="rulesJudge">
          <el-form-item label="节点名称: " class="disinlne" style="width:62.5%" prop="name">
            <el-input
              v-model="formJudge.name"
              @focus="getInputName"
              placeholder="请为该节点设置名称yes"
              autocomplete="off"
              maxlength="20"
            ></el-input>
          </el-form-item>
          <el-form-item label="判断: " class="disinlne" style="width:62.5%" prop="judge">
            <el-input
              v-model="formJudge.judge"
              @focus="getInputjudge"
              placeholder="输入格式为：$(a>1)"
              autocomplete="off"
              maxlength="20"
            ></el-input>
          </el-form-item>
          <div class="marl txtcenter" style="text-align: center;">
            <el-button :loading="editLoading" type="primary" @click="sureJudge">保存</el-button>
            <el-button type="primary" class="margin-l100" @click="cancelJudge">取消</el-button>
          </div>
        </el-form>
      </div>
    </el-dialog>
    <!-- 流水线节点弹框 -->
    <release-workflow-dialog
      :systemId.sync="sysId"
      :ShowDialog.sync="ShowDialog"
      :pipelineList="pipelineList"
      :ID.sync="ID"
      :status="'read'"
      :pipelineFormData="releaseNodeparams"
    />
    <el-dialog
      :visible="isShowApproval"
      title="人工判断"
      size="tiny"
      center
      :before-close="handleDialogCloseApproval"
      width="630px"
    >
      <div class="headportraitbox">
        <el-form ref="form3" :model="form3" label-width="100px" :rules="rulesApproval">
          <el-form-item label="审批结果: " class="disinlne" style="width:62.5%" prop="radio">
            <el-radio-group v-model="form3.radio">
              <el-radio :label="0">继续执行</el-radio>
              <el-radio :label="1">终止任务</el-radio>
            </el-radio-group>
          </el-form-item>
          <div class="marl txtcenter" style="text-align: center;">
            <el-button :loading="editLoading" type="primary" @click="sureApproval">确认</el-button>
            <el-button type="primary" class="margin-l100" @click="cancelApproval">取消</el-button>
          </div>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 引入相关的依赖
// import BpmnViewer from 'bpmn-js'
import BpmnModeler from 'bpmn-js/lib/Modeler';
import propertiesPanelModule from 'bpmn-js-properties-panel';
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda';
import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda';
import common from '@/utils/commonjs';
import ReleaseWorkflowDialog from './release-workflow-dialog.vue';
import axios from '@/api';

export default {
  name: 'workflow',
  components: {
    ReleaseWorkflowDialog
  },
  props: {
    sysId: {
      type: String,
      default: () => {
        return '';
      }
    },
    pipelineList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    currentJobId: {
      type: String,
      default: () => {
        return '';
      }
    },
    builedId: {
      type: String,
      default: () => {
        return '';
      }
    },
    planType: {
      type: String,
      default: () => {
        return '';
      }
    },
    /* 可清空选项 */
    clearable: {
      type: Boolean,
      default: () => {
        return true;
      }
    },
    activityData: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data () {
    var validatejudgements = (rule, value, callback) => {
      if (this.judgement == '') {
        callback(new Error('请选择判断人'));
      } else {
        callback();
      }
    };
    var validatepipevalue = (rule, value, callback) => {
      if (this.pipeline.length == 0) {
        callback(new Error('请选择脚本'));
      } else {
        callback();
      }
    };
    var validateprogramme = (rule, value, callback) => {
      if (this.programmes.length == 0) {
        callback(new Error('请选择部署方案'));
      } else {
        callback();
      }
    };
    return {
      ShowDialog: false,
      idLists: [],
      nodeParam: [],
      name: '',
      idList: '',
      // bpmn建模器
      bpmnModeler: null,
      container: null,
      canvas: null,
      xmlStr: null,
      addSystemBox: false,
      isShowApproval: false,
      isShowJudge: false,
      isshowtx: true,
      isMust: false,
      ischange: false,
      ischange2: false,
      ischange3: false,
      pipeline: ['', ''],
      planList: [],
      type: '',
      isArray: false,
      isbl: '',
      Symbolvalue: '',
      rvalue: '',
      revalue: '',
      judgement: '',
      editLoading: false,
      form: {
        name: '',
        isbl: '',
        resource: '',
        pipevalue: '',
        judgements: '',
        programme: '',
        nexusPackageId: '',
        nexusVersion: '',
        nexusPath: '',
        nexusID: '',
        teamId: '',
        warehouseName: ''
      },
      productList: [],
      warehouseList: [],
      formJudge: {
        name: '',
        judge: ''
      },
      form3: {
        radio: ''
      },
      pipelist: [
        { name: '流水线1', Id: '0' },
        { name: '流水线2', Id: '1' }
      ],
      judge: [
        { name: '返回值', Id: '0' },
        { name: '输出参数', Id: '1' }
      ],
      judge2: [
        { name: '=', Id: '0' },
        { name: '!=', Id: '1' },
        { name: '>', Id: '2' },
        { name: '<', Id: '3' }
      ],
      rules: {
        name: [
          { required: true, message: '节点名称不能为空!', trigger: 'blur' }
        ],
        resource: [
          { required: true, message: '请选择节点类型!', trigger: 'change' }
        ],
        pipevalue: [
          { required: true, validator: validatepipevalue, trigger: 'change' }
        ],
        judgements: [
          { required: true, validator: validatejudgements, trigger: 'change' }
        ],
        programme: [
          { required: true, validator: validateprogramme, trigger: 'change' }
        ],
        nexusPackageId: [
          { required: true, message: '制品编号不能为空！', trigger: 'lur' }
        ],
        nexusVersion: [
          { required: true, message: '版本号不能为空！', trigger: 'blur' }
        ],
        teamId: [
          { required: true, message: '项目组编号不能为空！', trigger: 'blur' }
        ]
      },
      rulesJudge: {
        name: [
          { required: true, message: '节点名称不能为空!', trigger: 'change' }
        ],
        judge: [
          { required: true, message: '请输入判断规则!', trigger: 'change' }
        ]
      },
      rulesApproval: {
        radio: [
          { required: true, message: '审批结果不能为空!', trigger: 'change' }
        ]
      },
      valueTitle: '',
      defaultExpandedKey: [],
      judgementList: [],
      programmes: [],
      options: [],
      options2: [
        {
          value: '1', // ID字段名
          label: '备份', // 显示名称
          children: []
        },
        {
          value: '2', // ID字段名
          label: '部署', // 显示名称
          children: []
        },
        {
          value: '3', // ID字段名
          label: '验证', // 显示名称
          children: []
        },
        {
          value: '4', // ID字段名
          label: '回退', // 显示名称
          children: []
        }
      ],
      ID: '',
      tableData: [],
      bpmnXmlStr: '',
      oDiv: null,
      oDiv2: null,
      right: null,
      bottom: null,
      mouseStart: {},
      divStart: {},
      rightStart: {},
      bottomStart: {},
      releaseNodeparams: [],
      clickTimer: null
    };
  },
  filters: {
    typeStatusFilter: status => {
      const typeListMap = {
        '0': '字符',
        '1': '布尔',
        '2': '等号连接参数',
        '3': '位置参数'
      };
      return typeListMap[status];
    }
  },
  created () {
    // console.log(this.$route.query.type)
  },
  computed: {
    plantype: {
      get: function () {
        return this.planType || this.$route.query.plantype;
      },
      set: function (val) {
        this.plantype = val;
        return val;
      }
    }
  },
  mounted () {
    this.type = this.$route.query.type;
    this.getallapi();
    this.Drag();
    // this.initHandle()
    this.Rendering();
    if (this.type == 2) {
      this.getallnodeParams();
    }
    this.createNewDiagram(this.bpmnModeler);
  },
  methods: {
    // 清除双击输入框
    clearInput () {
      // 这里处理双击产生的元素
      setTimeout(() => {
        let editContent = document.getElementsByClassName('djs-direct-editing-content')
        let editBackground = document.getElementsByClassName('djs-direct-editing-parent')[0]
        if (editContent) editContent[0].setAttribute('contenteditable', false)
        if (editBackground) editBackground.setAttribute('class', 'reset-conent')
      }, 0);
    },
    //  获取制品库列表
    getProductConfigList () {
      axios
        .productConfigList({
          name: '',
          accountNumber: '',
          detectionStatus: '1',
          current: 0,
          size: 1000
        })
        .then(res => {
          if (res.data.code === 200) {
            this.productList = res.data.data.records;
          }
        });
    },
    getProduct () {
      this.form.warehouseName = '';
      this.getWarehousePage();
    },
    //  获取仓库列表
    getWarehousePage () {
      axios
        .queryWarehousePage({
          warehouseName: '',
          warehouseType: '',
          environmentId: '',
          productId: this.form.nexusID,
          current: 1,
          size: 10000
        })
        .then(res => {
          console.log(res);
          if (res.data.code === 200) {
            this.warehouseList = res.data.data.records;
          }
        });
    },
    getWarehouse () {},
    // 删除左侧不用图标
    deleteimg () {
      document.getElementsByClassName('bjs-powered-by')[0].style.display =
        'none';
      if (document.getElementsByClassName('djs-palette-entries')[0]) {
        let entrieslist = document.getElementsByClassName(
          'djs-palette-entries'
        )[0].childNodes;

        for (let i = 0; i < entrieslist.length; i++) {
          if (i == 0) {
            entrieslist[i].childNodes[0].setAttribute('title', '移动');
            entrieslist[i].childNodes[3].setAttribute('title', '连接');
            entrieslist[i].childNodes[1].style.display = 'none';
            entrieslist[i].childNodes[2].style.display = 'none';
          }
          if (i == 1) {
            entrieslist[i].childNodes[0].setAttribute('title', '开始');
            entrieslist[i].childNodes[1].style.display = 'none';
            entrieslist[i].childNodes[2].style.display = 'block';
            entrieslist[i].childNodes[2].setAttribute('title', '结束');
          }
          if (i == 2) {
            entrieslist[i].childNodes[0].setAttribute('title', '并行网关');
          }
          if (i == 3) {
            entrieslist[i].childNodes[0].setAttribute('title', '任务');
            entrieslist[i].childNodes[1].style.display = 'none';
          }
          if (i > 3) {
            entrieslist[i].style.display = 'none';
          }
        }
      }
    },
    // 初始化状态图标
    setImageStages () {
      let stagedomlist = document.getElementsByClassName('djs-element'),
        imgUrl = [
          '../../../static/img/exec_success.png',
          '../../../static/img/exec_fail.png',
          '../../../static/img/task/20140524124238403.gif',
          '../../../static/img/t_question.png'
        ];
      for (let i = 0; i < stagedomlist.length; i++) {
        for (let j = 0; j < imgUrl.length; j++) {
          if (
            stagedomlist[i].getAttribute('data-element-id').indexOf('Task') >
              -1 &&
            stagedomlist[i].children[0].children.length < 6
          ) {
            let xmlns = 'http://www.w3.org/2000/svg',
              svgimg = document.createElementNS(xmlns, 'image');
            svgimg.setAttributeNS(null, 'x', 35);
            svgimg.setAttributeNS(null, 'y', 50);
            svgimg.setAttributeNS(null, 'height', '30px');
            svgimg.setAttributeNS(null, 'width', '30px');
            svgimg.setAttributeNS(null, 'display', 'none');
            svgimg.href.baseVal =
              j === 0
                ? require('../../../static/img/exec_success.png')
                : j === 1
                  ? require('../../../static/img/exec_fail.png')
                  : j === 2
                    ? require('../../../static/img/task/20140524124238403.gif')
                    : '../../../static/img/t_question.png';
            stagedomlist[i].childNodes[0].appendChild(svgimg);
          }
        }
      }
      this.viewxmlstages();
    },
    // xml状态显示
    viewxmlstages () {
      if (
        this.activityData &&
        this.activityData.stages &&
        this.activityData.stages.length > 0
      ) {
        let stagedomlist = document.getElementsByClassName('djs-element');
        for (var i = 0; i < stagedomlist.length; i++) {
          for (var j = 0; j < this.activityData.stages.length; j++) {
            if (
              this.activityData.stages[j].actNodeId ==
              stagedomlist[i].getAttribute('data-element-id')
            ) {
              if (this.activityData.stages[j].status == 'SUCCESS') {
                stagedomlist[i].childNodes[0].childNodes[0].style.stroke =
                  '#49BC71';
                for (
                  let k = 0;
                  k < stagedomlist[i].childNodes[0].childNodes.length;
                  k++
                ) {
                  if (k > 1) {
                    if (k == 2) {
                      stagedomlist[i].childNodes[0].childNodes[k].setAttributeNS(null, 'display', 'black');
                    } else {
                      stagedomlist[i].childNodes[0].childNodes[k].setAttributeNS(null, 'display', 'none');
                    }
                  }
                }
              } else if (
                this.activityData.stages[j].status == 'FAILURE' ||
                this.activityData.stages[j].status == 'FAILED' ||
                this.activityData.stages[j].status == 'ABORTED'
              ) {
                stagedomlist[i].childNodes[0].childNodes[0].style.stroke =
                  'red';
                for (
                  let k = 0;
                  k < stagedomlist[i].childNodes[0].childNodes.length;
                  k++
                ) {
                  if (k > 1) {
                    if (k == 3) {
                      stagedomlist[i].childNodes[0].childNodes[k].setAttributeNS(null, 'display', 'black');
                    } else {
                      stagedomlist[i].childNodes[0].childNodes[k].setAttributeNS(null, 'display', 'none');
                    }
                  }
                }
              } else if (this.activityData.stages[j].status == 'UNKNOWN') {
                for (
                  let k = 0;
                  k < stagedomlist[i].childNodes[0].childNodes.length;
                  k++
                ) {
                  if (k > 1) {
                    if (k == 5) {
                      stagedomlist[i].childNodes[0].childNodes[k].setAttributeNS(null, 'display', 'black');
                    } else {
                      stagedomlist[i].childNodes[0].childNodes[k].setAttributeNS(null, 'display', 'none');
                    }
                  }
                }
              } else if (this.activityData.stages[j].status == 'NOTEXECUTED') {
                stagedomlist[i].childNodes[0].childNodes[0].style.fill =
                  '#F2F2F2';
              } else if (
                this.activityData.stages[j].status == 'building' ||
                this.activityData.stages[j].status === 'IN_PROGRESS'
              ) {
                for (
                  let k = 0;
                  k < stagedomlist[i].childNodes[0].childNodes.length;
                  k++
                ) {
                  if (k > 1) {
                    if (k == 4) {
                      stagedomlist[i].childNodes[0].childNodes[k].setAttributeNS(null, 'display', 'black');
                    } else {
                      stagedomlist[i].childNodes[0].childNodes[k].setAttributeNS(null, 'display', 'none');
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    createNewDiagram (n, newxml) {
      //  type 类型 1 : 查看 ， 2 : 编辑
      if (newxml) {
        n.importXML(newxml, function (err) {
          if (err) {
            console.log(err);
          }
        });
      } else {
        let _this = this;
        if (this.activityData && this.activityData.actXml) {
          this.bpmnXmlStr = this.activityData.actXml;
        } else {
          this.bpmnXmlStr =
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd" id="sample-diagram" targetNamespace="http://bpmn.io/schema/bpmn">\n' +
            '  <bpmn2:process id="Process_1" isExecutable="false">\n' +
            '    <bpmn2:startEvent id="StartEvent_1"/>\n' +
            '  </bpmn2:process>\n' +
            '  <bpmndi:BPMNDiagram id="BPMNDiagram_1">\n' +
            '    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">\n' +
            '      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">\n' +
            '        <dc:Bounds height="36.0" width="36.0" x="200.0" y="150.0"/>\n' +
            '      </bpmndi:BPMNShape>\n' +
            '    </bpmndi:BPMNPlane>\n' +
            '  </bpmndi:BPMNDiagram>\n' +
            '</bpmn2:definitions>';
        }
        // 将字符串转换成图显示出来
        n.importXML(this.bpmnXmlStr, function (err) {
          if (err) {
            // console.error(err);
          }
          _this.deleteimg();
          _this.setImageStages();
          if (_this.type === '1') {
            let domList = document.getElementsByClassName('djs-shape');
            for (let dom of domList) {
              dom.onmouseenter = function () {
                // 如果时详情则不显示右侧的工具
                let spaceNode = document.querySelector('.djs-context-pad');
                let bettwonNode = document.querySelector(
                  '.djs-overlay-container'
                );
                if (spaceNode && spaceNode !== '') {
                  spaceNode.style.display = 'none';
                }
                if (bettwonNode && bettwonNode !== '') {
                  bettwonNode.style.display = 'none';
                }
              };
            }
          }
          _this.getReturnData();
          if (
            _this.$route.query.type != '1' &&
            _this.$route.query.type != '2'
          ) {
            let startnode = document.getElementsByClassName('layer-base')[0]
              .children[0].children[0].children[1];
            startnode.onclick = function (e) {
              _this.getsvgchildrennode(1);
            };
          }
        });
      }
    },
    // 绑定事件已经回显数据
    getReturnData () {
      let _this = this;
      if (this.type == '2' || this.type == '1') {
        if (this.type == '1') {
          document.getElementsByClassName('djs-palette')[0].style.display =
            'none';
        }
        // let glist = document.getElementsByClassName('layer-base')[0]
        // glist.onclick = event => {
        //   this.clearInput()
        // }
        // 单击事件
        const eventBus = this.bpmnModeler.get('eventBus');
        eventBus.on('element.click', event => {
          clearInterval(this.clickTimer);
          this.clickTimer = setTimeout(() => {
            if (event.element.type === 'bpmn:Task') {
              this.$emit('task-id', event.element.id);
            }
          }, 300);
        });

        // 监听双击事件，这里做dialog
        eventBus.on('element.dblclick', event => {
          clearInterval(this.clickTimer);
          if (event.element.type === 'bpmn:Task') {
            this.clearInput();
            this.ID = event.element.id;
            let id = this.ID;
            if (this.nodeParam.length) {
              if (this.idList.indexOf(id) == -1) {
                this.addSystemBox = true;
              } else {
                let array = [];
                this.isArray = false;
                this.nodeParam.forEach(d => {
                  array.push(d.actNodeId);
                });
                array.forEach(t => {
                  if (t == id) {
                    this.isArray = true;
                  }
                });
                if (this.isArray) {
                  this.nodeParam.forEach(item => {
                    if (id == item.actNodeId) {
                      this.form.name = item.actNodeName;
                      this.isbl = item.isExit == '1' ? '是' : '否';
                      this.form.isbl = item.isExit == '1' ? '是' : '否';
                      if (this.plantype == '1') {
                        this.form.resource = '脚本';
                        this.options.forEach(t => {
                          if (t.children.length) {
                            t.children.forEach(d => {
                              if (d.toolId == item.toolId) {
                                this.pipeline[0] = t.value;
                                this.pipeline[1] = item.toolId;
                              }
                            });
                          }
                        });
                        this.getActParams();
                      } else if (_this.plantype == '2') {
                        this.form.resource =
                          item.businessType == '1'
                            ? '脚本'
                            : item.businessType == '2'
                              ? '人工判断'
                              : item.businessType == '3'
                                ? '获取制品'
                                : item.businessType == '4'
                                  ? '上传制品'
                                  : '';
                        if (_this.type == '2') {
                          this.getscriptdata(id);
                        } else {
                          this.getNodeParams();
                        }
                      }
                    }
                  });
                } else {
                  if (this.plantype == '1') {
                    this.getActParams();
                  } else if (this.plantype == '2') {
                    if (this.type == '2') {
                      this.addSystemBox = true;
                    } else {
                      this.getNodeParams();
                    }
                  }
                }
              }
            } else {
              if (this.plantype == '1') {
                this.getActParams();
              } else if (this.plantype == '2') {
                if (this.type == '2') {
                  this.addSystemBox = true;
                } else {
                  this.getNodeParams();
                }
              }
            }
          }
        });
      }
    },
    // 获取点击后的子节点
    getsvgchildrennode (n) {
      let _this = this;
      if (n == 1) {
        setTimeout(() => {
          let djsnode = document.getElementsByClassName('djs-context-pad')[0];
          djsnode.onclick = function (e) {
            _this.getsvgchildrennode(2);
          };
        }, 100);
      }

      if (n == 2) {
        setTimeout(() => {
          let glist = document.getElementsByClassName('layer-base')[0];
          glist.onclick = function (event) {
            this.isMust = false;
            setTimeout(() => {
              if (
                document.getElementById('camunda-id').value.indexOf('Task') > -1
              ) {
                _this.ID = document.getElementById('camunda-id').value;
                if (_this.nodeParam.length) {
                  // console.log(_this.nodeParam);
                  _this.nodeParam.forEach(item => {
                    if (_this.ID == item.actNodeId) {
                      _this.form.name = item.actNodeName;
                      _this.isbl = item.isExit;
                      _this.form.isbl = item.isExit;
                      if (_this.plantype == '1') {
                        if (item.inputParam) {
                          item.inputParam.forEach(d => {
                            _this.tableData.push({
                              name: d.name,
                              paramValue: d.value,
                              paramType: d.type,
                              remarks: d.explain,
                              titleName: d.titleName,
                              isEmpty: d.isEmpty == '1' ? '是' : '否'
                            });
                          });
                        }
                        _this.form.resource = '脚本';
                        if (item.toolId) {
                          _this.options.forEach(t => {
                            if (t.children.length > 0) {
                              t.children.forEach(d => {
                                if (d.toolId == item.toolId) {
                                  _this.pipeline[0] = t.value;
                                  _this.pipeline[1] = item.toolId;
                                }
                              });
                            }
                          });
                        }
                      } else if (_this.plantype == '2') {
                        if (item.businessType) {
                          _this.form.resource =
                            item.businessType == '1'
                              ? '脚本'
                              : item.businessType == '2'
                                ? '人工判断'
                                : item.businessType == '3'
                                  ? '获取制品'
                                  : item.businessType == '4'
                                    ? '上传制品'
                                    : '';
                          _this.getDialogData(item);
                        }
                      }
                    }
                  });
                }

                _this.addSystemBox = true;
              } else if (_this.ID.indexOf('ExclusiveGateway') > -1) {
                _this.idLists.push();
              }
            }, 100);
          };
        }, 200);
      }
    },
    // 下载为SVG格式,done是个函数，调用的时候传入的
    saveSVG (done) {
      // 把传入的done再传给bpmn原型的saveSVG函数调用
      this.bpmnModeler.saveSVG(done);
    },
    // 下载为SVG格式,done是个函数，调用的时候传入的
    saveDiagram (done) {
      // 把传入的done再传给bpmn原型的saveXML函数调用
      this.bpmnModeler.saveXML({ format: true }, function (err, xml) {
        done(err, xml);
      });
    },
    // 当图发生改变的时候会调用这个函数，这个data就是图的xml
    setEncoded (link, name, data) {
      if (this.$route.query.type != '1' && this.$route.query.type != '2') {
        this.getsvgchildrennode(2);
      }
      // 把xml转换为URI，下载要用到的
      const encodedData = encodeURIComponent(data);
      // 获取到图的xml，保存就是把这个xml提交给后台
      this.xmlStr = data;
      // 下载图的具体操作,改变a的属性，className令a标签可点击，href令能下载，download是下载的文件的名字
      if (data) {
        link.className = 'active';
        link.href = 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData;
        link.download = name;
      }
      // 这里对nodeParam做删除筛选
      let copyarray = [];
      let editdata = '';
      if (data.indexOf('definitions') > -1) {
        let xmlarrary = data.split('process')[1].split('task id="');
        xmlarrary.forEach(item => {
          if (item.indexOf('Task') > -1) {
            let splitarray = item.split('"');
            this.nodeParam.forEach(d => {
              if (d.actNodeId == splitarray[0]) {
                copyarray.push(d);
              }
            });

            if (
              (splitarray[0].indexOf('Task') > -1 &&
                JSON.stringify(copyarray).indexOf(splitarray[0]) == -1) ||
              (copyarray.length == 0 && splitarray[0].indexOf('Task') > -1)
            ) {
              copyarray.push({
                actNodeId: splitarray[0],
                actNodeName:
                  splitarray.length >= 3 && splitarray[1].indexOf('name') > -1
                    ? splitarray[2]
                    : ''
              });
            }
            this.idList = '';
            copyarray.forEach(d => {
              this.idList += d.actNodeId + '';
              if (d.actNodeId == splitarray[0]) {
                d.actNodeName =
                  splitarray.length >= 3 && splitarray[1].indexOf('name') > -1
                    ? splitarray[2]
                    : '';
              }
            });
          }
        });
        this.nodeParam = copyarray;
        editdata = {
          actXml: this.xmlStr,
          nodeParam: copyarray
        };

        this.$emit('confirm', editdata);
        this.viewxmlstages();
      }
    },
    handleDialogClose () {
      for (let key in this.form) {
        this.form[key] = '';
      }
      if (this.$route.query.type != '1' && this.$route.query.type != '2') {
        if (!this.idList) {
          this.idList += this.ID + '';
        } else {
          if (this.idList.indexOf(this.ID) == -1) {
            this.idList += this.ID + '';
          }
        }

        this.isbl = '';
        this.pipeline = ['', ''];
        this.isshowtx = true;
        this.tableData = [];
        this.addSystemBox = false;
        this.isMust = false;

        if (this.nodeParam.length == 0) {
          this.nodeParam.push({
            actNodeId: this.ID
          });
        } else if (this.nodeParam.length > 0) {
          if (JSON.stringify(this.nodeParam).indexOf(this.ID) == -1) {
            this.nodeParam.push({
              actNodeId: this.ID
            });
          }
          // console.log( this.nodeParam)
        }
      } else {
        this.isbl = '';
        this.judgement = '';
        this.programmes = [];
        this.pipeline = ['', ''];
        this.isshowtx = true;
        this.tableData = [];
        this.addSystemBox = false;
        this.isMust = false;
        // this.$nextTick(() => {
        //   this.$refs.form.resetFields();
        // });
      }
    },
    handleDialogCloseJudge () {
      this.Symbolvalue = '';
      this.rvalue = '';
      this.revalue = '';
      this.isShowJudge = false;
      this.tableData = [];
      this.isMust = false;
      this.$refs.formJudge.resetFields();
    },
    handleDialogCloseApproval () {
      this.form3.radio = '';
      this.isShowApproval = false;
      this.isMust = false;
      this.$refs.form3.resetFields();
    },
    getSelectScript () {
      this.ischange = true;
      this.tableData = [];
      axios
        .toolDetail(this.pipeline[1])
        .then(res => {
          if (res.data.data.dlvParam && res.data.data.dlvParam.length > 0) {
            res.data.data.dlvParam.forEach(item => {
              this.tableData.push({
                name: item.name, // 参数名
                remarks: item.remarks, // 参数说明
                paramType: item.paramType, // 参数类型
                titleName: item.titleName, // 参数标题名称
                isEmpty: item.isEmpty == '1' ? '是' : '否', // 是否必填
                paramValue: item.paramValue // 参数值
              });
            });
          }
        })
        .catch();
      // this.form.pipevalue = this.pipeline[1];
    },
    getSelectJudgement () {
      this.ischange3 = true;
      this.form.judgements = this.judgement;
    },
    // 初始化值
    // initHandle() {
    // this.$refs.selectTree.setCurrentKey('1'); // 设置默认选中
    // if (this.valueId) {
    //           console.log(this.$refs.selectTree.getNode(
    //     this.valueId
    //   ))
    //   this.valueTitle = this.$refs.selectTree.getNode(
    //     this.valueId
    //   ).data.title; // 初始化显示
    //   console.log(this.valueTitle)
    // this.$refs.selectTree.setCurrentKey(1); // 设置默认选中
    // this.defaultExpandedKey = []; // 设置默认展开
    // }
    // },
    gettype () {
      if (this.form.resource != '人工判断') {
        this.isMust = true;
      } else {
        this.isMust = false;
        this.isshowtx = true;
      }
      this.judgement = '';
      this.pipeline = ['', ''];
      this.programmes = ['', ''];
      this.tableData = [];
    },
    cancel () {
      if (!this.idList) {
        this.idList += this.ID + '';
      } else {
        if (this.idList.indexOf(this.ID) == -1) {
          this.idList += this.ID + '';
        }
      }
      this.addSystemBox = false;
      if (document.getElementById('camunda-name').innerHTML) {
        if (this.nodeParam.length == 0) {
          this.nodeParam.push({
            actNodeId: this.ID
          });
        } else if (this.nodeParam.length > 0) {
          if (JSON.stringify(this.nodeParam).indexOf(this.ID) == -1) {
            this.nodeParam.push({
              actNodeId: this.ID
            });
          }
          // console.log( this.nodeParam)
        }

        this.isbl = '';
        this.judgement = '';
        this.programmes = [];
        this.pipeline = ['', ''];
      }
      for (let key in this.form) {
        this.form[key] = '';
      }
      this.isMust = false;
      this.isshowtx = true;
      this.tableData = [];
      // this.$nextTick(() => {
      //   this.$refs.form.resetFields();
      // });
    },
    cancelJudge () {
      this.isShowJudge = false;
      this.isMust = false;
      this.$refs.formJudge.resetFields();
      this.tableData = [];
    },
    cancelApproval () {
      this.form3.radio = '';
      this.isShowApproval = false;
      this.isMust = false;
      this.tableData = [];
      this.$refs.form3.resetFields();
    },
    getInputName () {
      let namedom = document.getElementById('camunda-name');
      if (namedom.addEventListener) {
        // 所有主流浏览器，除了 IE 8 及更早 IE版本
        namedom.addEventListener('focus', element => {
          var range, selection, pos;
          pos = element.srcElement.innerHTML.length;
          if (document.createRange) {
            // Firefox, Chrome, Opera, Safari, IE 9+
            range = document.createRange(); // 创建一个选中区域
            range.selectNodeContents(element.srcElement); // 选中节点的内容
            if (element.srcElement.innerHTML.length > 0) {
              range.setStart(element.srcElement.childNodes[0], pos); // 设置光标起始为指定位置
            }
            range.collapse(true); // 设置选中区域为一个点
            selection = window.getSelection(); // 获取当前选中区域
            selection.removeAllRanges(); // 移出所有的选中范围
            selection.addRange(range); // 添加新建的范围
          } else if (document.selection) {
            // IE 8 and lower
            range = document.body.createTextRange(); // Create a range (a range is a like the selection but invisible)
            range.moveToElementText(element); // Select the entire contents of the element with the range
            range.collapse(false); // collapse the range to the end point. false means collapse to end rather than the start
            range.select(); // Select the range (make it the visible selection
          }
        });
      } else if (namedom.attachEvent) {
        // IE 8 及更早 IE 版本
        namedom.attachEvent('focus', element => {
          var range, selection, pos;
          pos = element.srcElement.innerHTML.length;
          if (document.createRange) {
            // Firefox, Chrome, Opera, Safari, IE 9+
            range = document.createRange(); // 创建一个选中区域
            range.selectNodeContents(element.srcElement); // 选中节点的内容
            if (element.srcElement.innerHTML.length > 0) {
              range.setStart(element.srcElement.childNodes[0], pos); // 设置光标起始为指定位置
            }
            range.collapse(true); // 设置选中区域为一个点
            selection = window.getSelection(); // 获取当前选中区域
            selection.removeAllRanges(); // 移出所有的选中范围
            selection.addRange(range); // 添加新建的范围
          } else if (document.selection) {
            // IE 8 and lower
            range = document.body.createTextRange(); // Create a range (a range is a like the selection but invisible)
            range.moveToElementText(element); // Select the entire contents of the element with the range
            range.collapse(false); // collapse the range to the end point. false means collapse to end rather than the start
            range.select(); // Select the range (make it the visible selection
          }
        });
      }
      namedom.focus();

      if (namedom.addEventListener) {
        // 所有主流浏览器，除了 IE 8 及更早 IE版本
        namedom.addEventListener('input', () => {
          this.formJudge.name = namedom.innerHTML;
        });
      } else if (namedom.attachEvent) {
        // IE 8 及更早 IE 版本
        namedom.attachEvent('input', () => {
          this.formJudge.name = namedom.innerHTML;
        });
      }
    },
    getInputjudge () {
      document.getElementById('cam-condition').parentNode.className =
        'bpp-field-wrapper';
      document.getElementById('cam-condition-type')[0].selected = true;
      let rloedom = document.getElementById('cam-condition');

      rloedom.focus();
      if (rloedom.addEventListener) {
        // 所有主流浏览器，除了 IE 8 及更早 IE版本
        rloedom.addEventListener('input', () => {
          this.formJudge.judge = rloedom.value;
        });
      } else if (rloedom.attachEvent) {
        // IE 8 及更早 IE 版本
        rloedom.attachEvent('input', () => {
          this.formJudge.judge = rloedom.value;
        });
      }
    },
    // 返回节点类型  1 是脚本， 2 是方案 3 是 人工判断 4是上传制品
    getReturnNodeType () {
      let businessId = '',
        businessType = '';

      if (this.form.resource == '脚本') {
        businessId = this.pipeline[1];
        businessType = '1';
      }
      // if (this.form.resource == "方案") {
      //   businessId = this.programmes[1];
      //   businessType = "2";
      // }
      if (this.form.resource == '人工判断') {
        businessId = this.judgement;
        businessType = '2';
      }
      if (this.form.resource == '获取制品') {
        businessId = '';
        businessType = '3';
      }
      if (this.form.resource == '上传制品') {
        businessId = '';
        businessType = '4';
      }
      return {
        businessId: businessId,
        businessType: businessType
      };
    },
    sure () {
      let data = {};
      if (this.pipeline[0] == '' && this.pipeline[1] == '') {
        this.pipeline = [];
      }
      if (this.type == 1) {
        if (!this.ischange) {
          this.pipeline = ['', ''];
        }
        if (!this.ischange2) {
          this.programmes = [];
        }
        if (!this.ischange3) {
          this.judgement = '';
        }
      }

      this.$refs.form.validate(valid => {
        // plantype 1:方案 ，2: 任务
        if (valid) {
          //  console.log(this.nodeParam)
          var id = document.getElementById('camunda-id').value;
          var istrue = false;
          var inputParam = [];
          var businessTypeData = '';
          if (this.nodeParam.length == 0) {
            this.tableData.forEach((item, index) => {
              //   console.log(item)
              if (
                this.plantype == '2' &&
                item.isEmpty == '是' &&
                !item.paramValue
              ) {
                istrue = true;
              }
              inputParam.push({
                order: index + 1,
                name: item.name,
                value: item.paramValue,
                type: item.paramType,
                explain: item.remarks,
                titleName: item.titleName,
                isEmpty: item.isEmpty == '是' ? '1' : '0'
              });
            });
            if (istrue) {
              this.$notify({
                title: '提示',
                message: '表格中必填为是时，参数值不能为空！',
                type: 'error'
              });
              return false;
            }
            if (this.plantype == '1') {
              this.nodeParam.push({
                actNodeName: this.form.name,
                actNodeId: id,
                toolId: this.pipeline[1],
                version: this.getversion(this.pipeline[1]),
                isExit: this.form.isbl,
                inputParam: inputParam,
                nexusInfo: ''
              });
            } else if (this.plantype == '2') {
              businessTypeData = this.getReturnNodeType();
              this.nodeParam.push({
                actNodeName: this.form.name,
                actNodeId: id,
                businessType: businessTypeData.businessType,
                businessId: businessTypeData.businessId,
                version:
                  this.form.resource == '脚本'
                    ? this.getversion(businessTypeData.businessId)
                    : '',
                isExit: this.form.isbl,
                inputParam: inputParam,
                nexusInfo: {
                  teamId: this.form.teamId,
                  nexusPackageId: this.form.nexusPackageId,
                  nexusVersion: this.form.nexusVersion,
                  nexusPath: this.form.nexusPath,
                  nexusID: this.form.nexusID,
                  warehouseName: this.form.warehouseName
                }
              });
            }
          } else {
            if (this.plantype == '1') {
              this.tableData.forEach((item, index) => {
                inputParam.push({
                  order: index + 1,
                  name: item.name,
                  value: item.paramValue,
                  type: item.paramType,
                  explain: item.remarks,
                  titleName: item.titleName,
                  isEmpty: item.isEmpty == '是' ? '1' : '0'
                });
              });
              if (this.idList.indexOf(id) > -1) {
                for (var i = 0; i < this.nodeParam.length; i++) {
                  if (this.nodeParam[i].actNodeId == id) {
                    this.nodeParam[i].actNodeName = this.form.name;
                    this.nodeParam[i].actNodeId = id;
                    this.nodeParam[i].toolId = this.pipeline[1];
                    this.nodeParam[i].version = this.getversion(
                      this.pipeline[1]
                    );
                    this.nodeParam[i].nexusInfo = '';
                    this.nodeParam[i].isExit = this.form.isbl;
                    this.nodeParam[i].inputParam = inputParam;
                  }
                }
              } else {
                let array = {};
                array.actNodeName = this.form.name;
                array.actNodeId = id;
                array.toolId = this.pipeline[1];
                array.version = this.getversion(this.pipeline[1]);
                array.isExit = this.form.isbl;
                array.inputParam = inputParam;
                array.nexusInfo = '';
                this.nodeParam.push(array);
              }
            } else if (this.plantype == '2') {
              this.tableData.forEach((item, index) => {
                if (
                  this.plantype == '2' &&
                  item.isEmpty == '是' &&
                  !item.paramValue
                ) {
                  istrue = true;
                }
                inputParam.push({
                  order: index + 1,
                  name: item.name,
                  value: item.paramValue,
                  type: item.paramType,
                  explain: item.remarks,
                  titleName: item.titleName,
                  isEmpty: item.isEmpty == '是' ? '1' : '0'
                });
              });
              if (istrue) {
                this.$notify({
                  title: '提示',
                  message: '表格中必填为是时，参数值不能为空！',
                  type: 'error'
                });
                return false;
              }
              businessTypeData = this.getReturnNodeType();
              if (this.idList.indexOf(id) > -1) {
                this.nodeParam.forEach(item => {
                  if (item.actNodeId == id) {
                    item.actNodeName = this.form.name;
                    item.actNodeId = id;
                    item.businessType = businessTypeData.businessType;
                    item.businessId = businessTypeData.businessId;
                    item.nexusInfo = '';
                    item.version =
                      this.form.resource == '脚本'
                        ? this.getversion(this.pipeline[1])
                        : '';
                    item.isExit = this.form.isbl;
                    item.inputParam = inputParam;
                    item.nexusInfo = {
                      teamId: this.form.teamId,
                      nexusPackageId: this.form.nexusPackageId,
                      nexusVersion: this.form.nexusVersion,
                      nexusPath: this.form.nexusPath,
                      nexusID: this.form.nexusID,
                      warehouseName: this.form.warehouseName
                    };
                  }
                });
              } else {
                let array = {};
                array.actNodeName = this.form.name;
                array.actNodeId = id;
                array.businessType = businessTypeData.businessType;
                array.businessId = businessTypeData.businessId;
                array.version =
                  this.form.resource == '脚本'
                    ? this.getversion(this.pipeline[1])
                    : '';
                array.isExit = this.form.isbl;
                array.nexusInfo = '';
                array.inputParam = inputParam;
                array.nexusInfo = {
                  teamId: this.form.teamId,
                  nexusPackageId: this.form.nexusPackageId,
                  nexusVersion: this.form.nexusVersion,
                  nexusPath: this.form.nexusPath,
                  nexusID: this.form.nexusID,
                  warehouseName: this.form.warehouseName
                };
                this.nodeParam.push(array);
              }
            }
          }

          this.idList = '';
          this.isMust = false;
          this.nodeParam.forEach(item => {
            this.idList += item.actNodeId + '';
          });
          if (this.xmlStr) {
            this.xmlStr = common.setxmlname(this.xmlStr, id, this.form.name);
            this.createNewDiagram(this.bpmnModeler, this.xmlStr);
          } else if (this.activityData.actXml) {
            this.activityData.actXml = common.setxmlname(
              this.activityData.actXml,
              id,
              this.form.name
            );
            this.createNewDiagram(this.bpmnModeler, this.activityData.actXml);
          }

          data = {
            actXml: this.xmlStr || this.activityData.actXml,
            nodeParam: this.nodeParam
          };
          // console.log(data);
          this.$emit('confirm', data);
          this.cancel();

          // this.$set(this.form, "name", "");
          // this.$set(this.form, "isbl", "");
          // this.$set(this.form, "pipevalue", "");
          // this.$set(this.form, "resource", "");
          this.pipeline = [];
          this.isbl = '';
          this.tableData = [];
        }
      });
    },
    sureJudge () {
      this.$refs.formJudge.validate(valid => {
        if (valid) {
          let Id = document.getElementById('camunda-id').value;
          this.nodeParam.push({
            actNodeName: this.formJudge.name,
            actNodeId: Id
          });
        }
      });
      this.cancelJudge();
    },
    sureApproval () {
      this.$refs.form3.validate(valid => {
        if (valid) {
          let data = {
            input: this.form3.radio == 0 ? 'proceedEmpty' : 'abort',
            jobId: this.currentJobId,
            jobNumber: this.$route.query.builedNumber
          };
          axios.getmanualaudit(data).then(res => {
            // console.log(res)
            if (res.data.success) {
              this.$notify({
                title: '提示',
                message: res.data.message,
                type: 'success'
              });
              this.cancelApproval();
            }
          });
          // console.log(this.form3);
        }
      });
    },

    // 获取版本号
    getversion (id) {
      var version;
      // console.log(this.options);
      this.options.forEach(item => {
        if (item.children.length > 0) {
          item.children.forEach(d => {
            if (d.toolId == id) {
              version = d.toolVersion;
            }
          });
        }
      });
      return version;
    },
    // 渲染
    Rendering () {
      // 获取到属性ref为“content”的dom节点
      this.container = this.$refs.content;
      // 获取到属性ref为“canvas”的dom节点
      const canvas = this.$refs.canvas;

      // 建模，官方文档这里讲的很详细
      this.bpmnModeler = new BpmnModeler({
        container: canvas,
        // 添加控制板
        propertiesPanel: {
          parent: '#js-properties-panel'
        },
        additionalModules: [
          // 左边工具栏以及节点
          propertiesProviderModule,
          // 右边的工具栏
          propertiesPanelModule
        ],
        moddleExtensions: {
          camunda: camundaModdleDescriptor
        }
      });

      // 下载画图
      let _this = this;
      // 获取a标签dom节点
      const downloadLink = this.$refs.saveDiagram;
      const downloadSvgLink = this.$refs.saveSvg;
      // 给图绑定事件，当图有发生改变就会触发这个事件
      this.bpmnModeler.on('commandStack.changed', function () {
        _this.saveSVG(function (err, svg) {
          _this.setEncoded(downloadSvgLink, 'diagram.svg', err ? null : svg);
        });

        _this.saveDiagram(function (err, xml) {
          _this.setEncoded(downloadLink, 'diagram.bpmn', err ? null : xml);
        });
      });
    },
    // 获取用户列表
    getAllroleList () {
      axios
        .AllroleList()
        .then(res => {
          res.data.data.forEach(item => {
            this.judgementList.push({
              value: item.userId,
              label: item.loginName
            });
          });
        })
        .catch();
    },
    // 获取所有脚本
    getallsrcipt () {
      axios
        .allsrcipt()
        .then(res => {
          // console.log(res);
          let copydata = [];
          res.data.result.forEach(item => {
            if (this.type == '1' || this.type == '2') {
              if (item.toolsUpdateOp.length > 0) {
                item.toolsUpdateOp.forEach(d => {
                  item.toolsOp.push(d);
                });
              }
            }

            if (item.toolsOp.length > 0) {
              copydata.push({
                value: item.grouptagId,
                label: item.name,
                children: item.toolsOp
              });
            } else {
              copydata.push({
                value: item.grouptagId,
                label: item.name,
                children: []
              });
            }
          });
          copydata.forEach(item => {
            if (item.children.length > 0) {
              item.children.forEach(d => {
                d.value = d.toolId;
                d.label = d.name;
              });
            }
          });
          this.options = copydata;
        })
        .catch();
    },
    // 获取方案节点信息
    getActParams () {
      // plantype 1:方案 ，2: 任务  protype 方案类型 1,备份 2,部署 3,验证 4,回退
      let data;
      if (this.$route.query.hisId && this.$route.query.manageId) {
        data = {
          manageId: this.$route.query.manageId,
          hisId: this.$route.query.hisId,
          actNodeId: this.ID
        };
        axios
          .releaseNodeparam(data)
          .then(res => {
            this.releaseNodeparams = res.data.data.npdeparam;
            this.ShowDialog = true;
          })
          .catch();
      } else {
        data = {
          planId: this.$route.query.planId,
          actNodeId: this.ID
        };
        axios
          .getActParam(data)
          .then(res => {
            res.data.data.planToolsList.forEach(item => {
              if (this.ID == item.actNodeId) {
                if (typeof item.inputParam === 'string') {
                  item.inputParam = common.evil(item.inputParam);
                }
                item.inputParam.forEach(d => {
                  this.tableData.push({
                    name: d.name,
                    paramValue: d.value,
                    paramType: d.type,
                    remarks: d.explain,
                    titleName: d.titleName,
                    isEmpty: d.isEmpty == '是' ? '1' : '0'
                  });
                });
                this.form.name = item.actNodeName;
                this.isbl = item.isExit;
                this.form.isbl = item.isExit;
                this.form.resource = '脚本';
                this.options.forEach(t => {
                  if (t.children.length > 0) {
                    t.children.forEach(d => {
                      if (d.toolId == item.toolId) {
                        this.pipeline[0] = t.value;
                        this.pipeline[1] = item.toolId;

                        // console.log(this.options2)
                      }
                    });
                  }
                });
                // console.log(this.options)
              }
            });
          })
          .catch();
      }
    },
    // 获取全部节点初始数据
    getallnodeParams () {
      this.activityData.activeId.forEach(item => {
        this.getNodeParams(item);
      });
    },
    // 编辑脚本回填
    getscriptdata (id) {
      this.pipeline = [];
      this.nodeParam.forEach(item => {
        if (id == item.actNodeId) {
          this.getDialogData(item);
        }
      });
      this.addSystemBox = true;
    },
    // 获取任务节点信息
    getNodeParams (id) {
      let data = {};
      this.idList += id;
      // plantype 1:方案 ，2: 任务  protype 方案类型 1,备份 2,部署 3,验证 4,回退

      // console.log(this.activityData)
      data.jobId = this.currentJobId;
      if (this.builedId) {
        data.builedId = this.builedId;
      }
      // data.jobId = "a9cc6ba765f44e97b85a7eafa7e71f95";
      data.actNodeId = id || this.ID;
      data.current = 1;
      data.size = 1000;
      axios
        .getNodeParam(data)
        .then(res => {
          if (res.data.data.records[0].businessType == '3') {
            if (
              res.data.data.records[0].stages.stage &&
              res.data.data.records[0].stages.stage.status ==
                'PAUSED_PENDING_INPUT'
            ) {
              this.isShowApproval = true;
              return false;
            } else {
              this.isShowApproval = false;
            }
          }
          if (id) {
            res.data.data.records.forEach(item => {
              if (id == item.actNodeId) {
                // var businessId = '';
                // var businessType = '';
                this.nodeParam.push({
                  actNodeName: item.actNodeName,
                  actNodeId: item.actNodeId,
                  businessType: item.businessType,
                  businessId: item.businessId,
                  version: item.version,
                  isExit: !item.isExit ? 0 : item.isExit,
                  inputParam: item.inputParam,
                  nexusInfo: item.nexusInfo
                });
              }
            });
          } else {
            res.data.data.records.forEach(item => {
              if (this.ID == item.actNodeId) {
                this.form.name = item.actNodeName;
                this.isbl = item.isExit;
                this.form.isbl = item.isExit;
                this.form.resource =
                  item.businessType == '1'
                    ? '脚本'
                    : item.businessType == '2'
                      ? '人工判断'
                      : item.businessType == '3'
                        ? '获取制品'
                        : item.businessType == '4'
                          ? '上传制品'
                          : '';
                this.getDialogData(item);
              }
            });
            this.addSystemBox = true;
          }
        })
        .catch();
    },
    //  返回弹框数据
    getDialogData (item) {
      if (item.businessType == '1') {
        if (typeof item.inputParam === 'string') {
          item.inputParam = common.evil(item.inputParam);
        }
        item.inputParam.forEach(d => {
          this.tableData.push({
            name: d.name,
            paramValue: d.value,
            paramType: d.type,
            remarks: d.explain,
            titleName: d.titleName,
            isEmpty: d.isEmpty == '1' ? '是' : '否'
          });
        });
        this.options.forEach(t => {
          if (t.children && t.children.length > 0) {
            t.children.forEach(d => {
              if (d.toolId == item.businessId) {
                this.pipeline[0] = t.value;
                this.pipeline[1] = item.businessId;
              }
            });
          }
        });
      }
      if (item.businessType == '2') {
        if (this.judgementList.length) {
          this.judgementList.forEach(t => {
            if (t.value == item.businessId) {
              this.judgement = item.businessId;
              this.form.judgements = item.businessId;
            }
          });
        }
      }
      if (item.businessType == '4') {
        if (typeof item.nexusInfo === 'string') {
          item.nexusInfo = JSON.parse(item.nexusInfo);
        }
        this.form.teamId = item.nexusInfo.teamId;
        this.form.nexusPackageId = item.nexusInfo.nexusPackageId;
        this.form.nexusVersion = item.nexusInfo.nexusVersion;
        this.form.nexusPath = item.nexusInfo.nexusPath;
        this.form.nexusID = item.nexusInfo.nexusID;
        this.form.warehouseName = item.nexusInfo.warehouseName;
      }
    },
    getallapi () {
      this.getAllroleList();
      this.getallsrcipt();
      this.getProductConfigList();
    },
    Drag () {
      let _this = this;
      _this.oDiv = document.getElementById('div1');
      _this.oDiv2 = document.getElementById('div2');
      _this.right = document.getElementById('right');
      _this.bottom = document.getElementById('bottom');

      // 往下拽
      _this.bottom.onmousedown = function (ev) {
        var oEvent = ev || event;
        _this.mouseStart.x = oEvent.clientX;
        _this.mouseStart.y = oEvent.clientY;
        _this.bottomStart.y = _this.bottom.offsetTop;
        if (_this.bottom.setCapture) {
          _this.bottom.onmousemove = _this.doDrag;
          _this.bottom.onmouseup = _this.stopDrag;
          _this.bottom.setCapture();
        } else {
          document.addEventListener('mousemove', _this.doDrag, true);
          document.addEventListener('mouseup', _this.stopDrag, true);
        }
      };
    },
    doDrag (ev) {
      var oEvent = ev || event;
      var t = oEvent.clientY - this.mouseStart.y + this.bottomStart.y;
      var h = t + this.oDiv.offsetHeight;

      if (h < this.oDiv.offsetHeight) {
        h = this.oDiv.offsetHeight;
      } else if (
        h >
        document.documentElement.clientHeight - this.oDiv2.offsetTop
      ) {
        h = document.documentElement.clientHeight - this.oDiv2.offsetTop - 2;
      }
      this.oDiv2.style.height = h + 'px';
    },
    stopDrag () {
      if (this.bottom.releaseCapture) {
        this.bottom.onmousemove = null;
        this.bottom.onmouseup = null;
        this.bottom.releaseCapture();
      } else {
        document.removeEventListener('mousemove', this.doDrag, true);
        document.removeEventListener('mouseup', this.stopDrag, true);
      }
    }
  },
  watch: {
    activityData: {
      handler (newValue, oldValue) {
        this.createNewDiagram(this.bpmnModeler);
      },
      deep: true
    }
  }
};
</script>

<style lang="scss" >
/*左边工具栏以及编辑节点的样式*/
@import "bpmn-js/dist/assets/diagram-js.css";
@import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
@import "bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css";
@import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
/*右边工具栏样式*/
@import "bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css";
.containers {
  background-color: #ffffff;
}
.canvas {
  width: 100%;
  height: 100%;
}

.buttons {
  position: absolute;
  left: 20px;
  bottom: 30px;
  & > li {
    display: inline-block;
    margin: 5px;
    & > a {
      color: #999;
      background: #eee;
      cursor: not-allowed;
      padding: 8px;
      border: 1px solid #ccc;
      &.active {
        color: #333;
        background: #fff;
        cursor: pointer;
      }
    }
  }
}
.el-scrollbar .el-scrollbar__view .el-select-dropdown__item {
  height: auto;
  padding: 0;
}
ul li span.el-select-dropdown__item.selected {
  font-weight: normal;
}
ul li.el-select-dropdown__item span {
  margin-left: 14px;
}
ul li.el-select-dropdown__item span.el-tree-node__label {
  margin-left: 0;
}
ul li >>> .el-tree .el-tree-node__content {
  height: auto;
}
.el-tree-node__label {
  font-weight: normal;
}
.el-tree >>> .is-current .el-tree-node__label {
  color: #409eff;
  font-weight: 700;
}
.el-tree >>> .is-current .el-tree-node__children .el-tree-node__label {
  color: #606266;
  font-weight: normal;
}
.f12 {
  font-size: 12px;
}
#div2 {
  position: relative;
  height: 300px;
}
#div1 {
  width: 15px;
  height: 15px;
  position: absolute;
  right: 0px;
  bottom: 0px;
  cursor: nw-resize;
  overflow: hidden;
  font-size: 12px;
  text-align: center;
  line-height: 15px;
  float: right;
  z-index: 3;
}
#bottom {
  width: 100%;
  text-align: center;
  height: 15px;
  position: absolute;
  left: 0;
  bottom: 0;
  line-height: 10px;
  cursor: n-resize;
  overflow: hidden;
  opacity: 1;
  z-index: 1;
}
.margin-l100 {
  margin-left: 100px !important;
}
.reset-conent {
  background-color: none !important;
  background: none !important;
  border: none !important;
}
</style>
