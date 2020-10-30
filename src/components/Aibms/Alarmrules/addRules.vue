<template>
  <div class="aia-content">
    <div class="wrapper_pannel">
      <div v-if="status === 'edit'" class="wrapper-title">编辑告警规则</div>
      <div v-if="status === 'create'" class="wrapper-title">新增告警规则</div>
      <el-steps class="steps-alert" :active="active" align-center>
        <el-step title="告警分类" @click.native="isActive(0)" />
        <el-step title="告警规则" @click.native="isActive(1)" />
      </el-steps>
      <el-form
        v-if="active === 0"
        class="content-form"
        ref="typesForm"
        :model="typesForm"
        label-width="100px"
        :rules="typesFormRules"
      >
        <el-form-item label="名称：" prop="rulesName">
          <el-input
            :disabled="status === 'read'"
            v-model.trim="typesForm.rulesName"
            clearable
            maxlength="20"
            placeholder="请输入名称"
            :style="{ width: '632px' }"
          />
        </el-form-item>
        <el-form-item label="选择标签：" prop="label">
          <el-select
            @change="chooseLabel"
            :disabled="status === 'read'"
            clearable
            v-model="typesForm.label"
            placeholder="请选择标签"
            :style="{ width: '632px' }"
          >
            <el-option
              v-for="item in labelList"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="选择分类：" prop="type">
          <span class="tips cursor" v-if="classList.length === 0">请先选择标签</span>
          <el-row v-else :gutter="20">
            <el-col :span="2">
              <el-checkbox
                :disabled="status === 'read'"
                :indeterminate="isIndeterminate"
                v-model="checkAll"
                @change="handleCheckAllChange"
                >全选</el-checkbox
              >
            </el-col>
            <el-col :span="20">
              <el-checkbox-group
                v-model="typesForm.type"
                @change="handlecheckedClassChange"
              >
                <el-checkbox
                  v-for="item in classList"
                  :disabled="
                    status === 'read' ||
                    (status !== 'read' &&
                      item.belongRule &&
                      !isOwner(item.code))
                  "
                  :label="item.code"
                  :key="item.code"
                  >{{ item.name }}</el-checkbox
                >
              </el-checkbox-group>
            </el-col>
          </el-row>
        </el-form-item>
        <!-- 分页 -->
        <el-pagination
          v-if="totalSize"
          :current-page.sync="page.current"
          :page-size.sync="page.size"
          :page-sizes="[10, 20, 30, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalSize"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          style="text-align: center; margin: 92px 0"
        />
      </el-form>
      <el-form
        v-if="active === 1"
        class="content-form"
        ref="rulesForm"
        :model="rulesForm"
        label-width="100px"
        :rules="rulesFormRules"
      >
        <el-form-item label="级别：" prop="level">
          <el-select
            v-model="rulesForm.level"
            :disabled="status === 'read'"
            clearable
            placeholder="请选择级别"
          >
            <el-option
              v-for="item in levelList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
              <span style="float: left">{{ item.label }}</span>
              <icon-svg
                style="font-size: 18px; vertical-align: sub; margin-left: 10px"
                icon-class="bj"
                :class="item.value | iconLevelFilter"
              />
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="通知人员：">
          <div class="notice" @click="showDialog()">
            <i class="el-icon-link"></i>
            <span>选择通知人员</span>
          </div>
        </el-form-item>
        <el-form-item v-if="noticeInform.length > 0">
          <!-- 通知人员展示 -->
          <el-table
            height="420"
            :data="noticeInform"
            tooltip-effect="dark"
            style="width: 90%"
            header-align="center"
          >
            <el-table-column
              align="center"
              prop="name"
              label="姓名"
              width="100"
            ></el-table-column>
            <el-table-column
              align="center"
              prop="phone"
              label="手机号"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              align="center"
              prop="email"
              label="邮箱"
              show-overflow-tooltip
              width="220"
            ></el-table-column>
            <el-table-column
              align="center"
              prop="department"
              label="部门-职位"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column align="center" label="通知方式" width="165">
              <template slot-scope="scope">
                <span>{{ scope.row.checkList | filterNotice }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <div class="op-btns">
        <el-button type="primary" v-if="active === 1" @click="isActive(0)"
          >上一步</el-button
        >
        <el-button type="primary" v-if="active !== 1" @click="isActive(1)"
          >下一步</el-button
        >
        <el-button
          type="primary"
          v-if="active === 1 && status !== 'read'"
          @click="saveAlarm"
          >保存</el-button
        >
        <el-button @click="cancel" class="cancel-button">取消</el-button>
      </div>
      <!-- 选择通知人员 -->
      <el-dialog
        class="tips-dialog"
        title="选择通知人员"
        :visible.sync="tipsDialog"
        width="90%"
        :before-close="handleDialogClose"
      >
        <el-form
          class="tips-form"
          label-width="124px"
          :model="tipsForm"
          ref="tipsForm"
          label-position="left"
        >
          <el-form-item label="方式：">
            <el-radio-group v-model="tipsForm.mode" @change="changeNotice">
              <el-radio :label="1">角色</el-radio>
              <el-radio :label="2">自定义</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="tipsForm.mode === 1" label="角色：" prop="role">
            <el-select
              @change="chooseRole"
              clearable
              multiple
              v-model="tipsForm.role"
              placeholder="请选择角色"
              :style="{ width: '280px' }"
            >
              <el-option
                v-for="item in roleList"
                :key="item.id"
                :label="item.name"
                :value="item.roleId"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="tipsForm.mode === 1"
            label="人员及通知方式："
          ></el-form-item>
          <el-tabs
            v-if="tipsForm.mode === 1"
            v-model="activeName"
            @tab-click="handleClick"
          >
            <el-tab-pane
              v-for="item in tabsList"
              :label="item.label"
              :name="item.value"
              :key="item.value"
            >
              <el-table
                stripe
                v-if="item.tipsTableData"
                :data="item.tipsTableData"
                tooltip-effect="dark"
                ref="multipleTable"
                style="width: 100%"
                header-align="center"
                :row-class-name="tableRowClassName"
                @select="chooseOne"
                @select-all="handleSelectionChange"
              >
                <el-table-column
                  align="center"
                  type="selection"
                  :selectable="checkboxT"
                  width="55"
                ></el-table-column>
                <el-table-column
                  align="center"
                  prop="name"
                  label="姓名"
                  width="100"
                ></el-table-column>
                <el-table-column
                  align="center"
                  prop="phone"
                  label="手机号"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                  align="center"
                  prop="email"
                  label="邮箱"
                  show-overflow-tooltip
                  width="220"
                ></el-table-column>
                <el-table-column
                  align="center"
                  prop="department"
                  label="部门-职位"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column align="center" label="通知方式" width="165">
                  <template slot-scope="scope">
                    <el-checkbox-group
                      v-model="scope.row.checkList"
                      @change="checkSmsEmail(scope)"
                    >
                      <el-checkbox :disabled="status === 'read'" label="email"
                        >邮件</el-checkbox
                      >
                      <el-checkbox :disabled="status === 'read'" label="message"
                        >短信</el-checkbox
                      >
                    </el-checkbox-group>
                  </template>
                </el-table-column>
              </el-table>
              <!-- 选择通知人员分页 -->
              <el-pagination
                v-if="item.tipsTotalSize"
                background
                :current-page.sync="item.tipsPage.current"
                :page-size.sync="item.tipsPage.size"
                :page-sizes="[10, 20, 30]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="item.tipsTotalSize"
                @size-change="handleSizeChangeTips(item)"
                @current-change="handleCurrentChangeTips(item)"
                style="text-align: right; margin-top: 24px"
              />
            </el-tab-pane>
          </el-tabs>
        </el-form>
        <!-- 自定义 -->
        <div v-if="tipsForm.mode !== 1" class="custom-tips-form">
          <el-form
            ref="customFrom"
            :rules="customRules"
            class="custom-from"
            label-position="left"
            :inline="true"
            v-for="(item, index) in customFromList"
            :model="item"
            label-width="124px"
            :key="item.id"
          >
            <el-form-item prop="name" label="人员名称：">
              <el-input
                :disabled="status === 'read'"
                v-model.trim="item.name"
                clearable
                placeholder="请输入通知人姓名"
                maxlength="20"
                style="width: 180px"
              />
            </el-form-item>
            <el-form-item label="通知方式：" label-width="82px">
              <el-select
                :disabled="status === 'read'"
                clearable
                multiple
                v-model="item.checkList"
                placeholder="请选择通知方式"
              >
                <el-option
                  v-for="item in noticeList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              prop="phone"
              label="手机号码："
              v-if="item.checkList.includes('message')"
              label-width="94px"
            >
              <el-input
                maxlength="11"
                :disabled="status === 'read'"
                v-model="item.phone"
                clearable
                placeholder="请输入手机号码"
                style="width: 180px"
              />
            </el-form-item>
            <el-form-item
              prop="email"
              label="邮件地址："
              v-if="item.checkList.includes('email')"
              label-width="94px"
            >
              <el-input
                :disabled="status === 'read'"
                v-model="item.email"
                clearable
                placeholder="请输入邮箱地址"
                style="width: 180px"
              />
            </el-form-item>
            <span class="more-span" v-if="status !== 'read'">
              <i class="el-icon-circle-plus-outline" @click="addCustom" />
              <i class="el-icon-remove-outline" @click="removeCustom(index)" />
            </span>
          </el-form>
        </div>
        <div class="op-btns">
          <el-button type="primary" @click="saveTips">确定</el-button>
          <el-button @click="handleDialogClose" class="cancel-button"
            >取消</el-button
          >
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import axios from '@/api';
export default {
  data() {
    var validateMobile = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入手机号！'));
      } else if (!/^1[3456789]\d{9}$/.test(value)) {
        callback(new Error('请输入正确的手机号码！'));
      } else {
        callback();
      }
    };
    return {
      ownerTypes: [],
      // 通知方式
      noticeList: [
        {
          value: 'message',
          label: '短信通知'
        },
        {
          value: 'email',
          label: '邮件通知'
        }
      ],
      // 自定义from
      customFromList: [
        {
          name: '',
          checkList: [],
          email: '',
          phone: ''
        }
      ],
      tabsList: [],
      activeName: '',
      // 通知人员==选择角色
      roleList: [],
      // 通知人员from
      tipsForm: {
        role: [],
        mode: 1 // 默认是角色
      },
      // 通知人员弹框
      tipsDialog: false,
      // 告警分类from
      typesForm: {
        rulesName: '',
        label: '',
        type: []
      },
      // 告警规则from
      rulesForm: {
        level: ''
      },
      levelList: [
        {
          value: '1',
          label: 'critical'
        },
        {
          value: '2',
          label: 'warning'
        },
        {
          value: '3',
          label: 'information'
        }
        // {
        //   value: '4',
        //   label: 'S4'
        // },
        // {
        //   value: '5',
        //   label: 'S5'
        // }
      ],
      labelList: [
        { label: '交易类型', value: '1' },
        { label: '应用', value: '2' },
        { label: '服务', value: '3' },
        { label: '进程', value: '4' },
        { label: '主机', value: '5' }
      ],
      rulesFormRules: {
        level: [{ required: true, message: '请选择级别！', trigger: 'change' }]
      },
      typesFormRules: {
        rulesName: [
          { required: true, message: '请输入名称！', trigger: 'blur' }
        ],
        label: [{ required: true, message: '请选择标签！', trigger: 'change' }],
        type: [
          {
            type: 'array',
            required: true,
            message: '请选择分类！',
            trigger: 'change'
          }
        ]
      },
      customRules: {
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }
        ],
        phone: [{ required: true, validator: validateMobile, trigger: 'blur' }]
      },
      checkAll: false,
      classList: [],
      isIndeterminate: false,
      active: 0,
      // 分页
      page: {
        current: 1,
        size: 10
      },
      totalSize: 0,
      // // 通知人员分页
      // tipsPage: {
      //   current: 1,
      //   size: 10
      // },
      // tipsTotalSize: 0,
      // 通知人员展示
      noticeInform: [],
      allNotice: [],
      status: '',
      ruleId: '',
      classAllList: [],
      noticeId: 0,
      TemporaryAdd: [], // 临时添加的通知人员
      TemporaryCancel: [] // 临时取消的通知人员
    };
  },
  filters: {
    filterNotice(objArray) {
      return objArray
        .join(',')
        .replace(/message/, '短信')
        .replace(/email/, '邮件');
    },
    iconLevelFilter: (level) => {
      const iconMap = {
        1: 's1-color',
        2: 's2-color',
        3: 's3-color',
        4: 's4-color',
        5: 's5-color'
      };
      return iconMap[level];
    }
  },
  created() {
    this.init();
  },
  methods: {
    // 数据加载
    init() {
      this.getSystemRole();
      this.status = this.$route.params.status;
      if (this.status != 'create') {
        this.ruleId = this.$route.query.ruleId;
        this.alarmRuleDetails();
        this.checkboxT();
      }
    },
    showDialog() {
      this.tipsDialog = true;
      this.$nextTick(() => {
        this.chooseRole();
        // this.echoCustom();
      });
    },
    // 回显自定义信息
    echoCustom() {
      let customArray = [];
      this.noticeInform.forEach((item) => {
        if (item.custom) {
          customArray.push(item);
        }
      });
      this.customFromList = customArray;
    },
    // 隐藏table全选框
    hiddenCheck() {
      // var style =
      //   ".tips-dialog /deep/ thead .el-checkbox:nth-child(1) {display:none}";
      // var ele = document.createElement("style");
      // ele.innerHTML = style;
      // document.getElementsByTagName("head")[0].appendChild(ele);
      // console.log(document.getElementsByClassName("el-table_1_column_1")[0].childNodes)
      if (this.status === 'read') {
        if (
          document.getElementsByClassName('el-table-column--selection').length >
          0
        ) {
          document.getElementsByClassName(
            'el-table-column--selection'
          )[0].childNodes[0].style.display = 'none';
        }
      } else {
        if (
          document.getElementsByClassName('el-table-column--selection').length >
          0
        ) {
          document.getElementsByClassName(
            'el-table-column--selection'
          )[0].childNodes[0].style.display = 'block';
        }
      }
    },
    // 是否禁用table选框
    checkboxT(row, index) {
      return this.status !== 'read';
    },
    isOwner(code) {
      return this.ownerTypes.indexOf(code) !== -1;
    },
    // 获取规则详情
    alarmRuleDetails() {
      axios.alarmRuleDetails(this.ruleId).then((res) => {
        if (res.data.code === 200) {
          let query = res.data.data;
          let notify = JSON.parse(query.notifyPersonnel);
          const { iD, level, name, label, categoryCode } = query;
          this.typesForm.rulesName = name;
          this.typesForm.label = label;
          this.typesForm.type = JSON.parse(categoryCode).categoryCode.split(
            ','
          );
          this.ownerTypes = JSON.parse(categoryCode).categoryCode.split(',');
          this.rulesForm.level = level;
          this.noticeId = iD;
          this.chooseLabel(true);
          this.tipsForm.mode = notify[0].methodToInforme;
          if (notify[0].userList.length) {
            this.tipsForm.role = notify[0].roles;
            this.allNotice = notify[0].userList;
            notify[0].userList.forEach((item) => {
              this.getInform(item.selectedArray);
            });
          }
          if (notify[1].userList.length > 0) {
            notify[1].userList.forEach((item) => {
              item.custom = true;
            });
            this.customFromList = notify[1].userList;
            this.getInform(notify[1].userList);
          }
        }
      });
    },
    // 展示通知人信息
    getInform(item) {
      item.forEach((res) => {
        this.noticeInform.push(res);
      });
    },
    getEnableClassList(classList) {
      return classList.filter(
        (item) =>
          !item.belongRule ||
          (item.belongRule && this.ownerTypes.indexOf(item.code) !== -1)
      );
    },
    // 分类勾选状态
    classCheckStatus(type) {
      let bl = true;
      let num = 0;
      let codeList = this.classList
        .filter((item) => item.level !== '')
        .map((item) => item.code);
      codeList.forEach((item) => {
        if (!type.includes(item)) {
          bl = false;
        } else {
          num++;
        }
      });
      if (bl) {
        this.isIndeterminate = false;
        this.checkAll = true;
      } else {
        this.checkAll = false;
        if (num < codeList.length && num > 0) {
          this.isIndeterminate = true;
        } else if (num === 0) {
          this.isIndeterminate = false;
        }
      }
    },
    // 选择标签--展示分类
    chooseLabel(first) {
      this.checkAll = false;
      this.isIndeterminate = false;
      let params = {
        name: '',
        sources: '',
        label: this.typesForm.label,
        current: this.page.current,
        size: this.page.size
      };
      axios.getAlarmList(params).then((res) => {
        if (res.data.code === 200) {
          this.classList = res.data.data.records;
          this.totalSize = Number(res.data.data.total);

          if (!(first === true)) {
            this.typesForm.type = [];
          }
          const checkedLength = this.typesForm.type.length;
          this.checkAll = checkedLength === this.classList.length;
          this.isIndeterminate = !(
            checkedLength === 0 || checkedLength === this.classList.length
          );

          // const enabledList = this.getEnableClassList(this.classList)
          // const checkeds = this.typesForm.type
          // let checkedsCount = 0
          // enabledList.forEach(item => {
          //   if (checkeds.indexOf(item.code) !== -1) {
          //     checkedsCount++
          //   }
          // })
          // const enabledLength = enabledList.length
          // console.log('checkedsCount: ', checkedsCount)
          // console.log('enabledLength: ', enabledLength)
          // if (checkedsCount === enabledLength) {
          //   this.checkAll = true
          //   this.isIndeterminate = false
          // } else if (checkedsCount === 0) {
          //   this.checkAll = false
          //   this.isIndeterminate = false
          // } else if (checkedsCount > 0 && checkedsCount < enabledLength) {
          //   this.checkAll = false
          //   this.isIndeterminate = true
          // }
        }
      });
    },
    // 获取用户列表
    getUserList(item) {
      let JobDto = {
        online: false,
        condition: '', /// 姓名、手机、登录名
        roleIds: [item.value], // 角色ID，多个用“,”隔开
        userStatus: '', // 用户状态  0正常 1禁用 2锁定 3注销
        current: item.tipsPage.current, // 当前页
        size: item.tipsPage.size // 每页显示条数
      };
      axios.userList(JobDto).then((res) => {
        if (res.data.code === 200) {
          let copyTipsTableData = [];
          res.data.data.result.records.forEach((result) => {
            copyTipsTableData.push({
              name: result.name,
              phone: result.mobile,
              email: result.email,
              department: result.position,
              checkList: [],
              userId: result.userId
            });
          });
          item.tipsTotalSize = Number(res.data.data.result.total);
          item.tipsTableData = copyTipsTableData;
          this.$nextTick(() => {
            if (this.allNotice.length) {
              this.AutoSelect();
            }
          });
        }
      });
    },
    // 获取系统的角色
    getSystemRole() {
      axios.getSystemRole().then((res) => {
        this.roleList = res.data.data.result;
      });
    },
    // 选择管理人员通知方式 邮件 / 短信
    checkSmsEmail(scope) {
      // console.log(scope);
      let valArr = [];
      let TemporaryArray = [];
      this.tabsList.forEach((item, index) => {
        this.allNotice.forEach((row, NoticeIndex) => {
          if (item.value === this.activeName && row.value === this.activeName) {
            if (scope.row.checkList.length === 0) {
              if (this.TemporaryCancel.length > 0) {
                TemporaryArray = this.TemporaryCancel.map((val) => val.userId);
                if (!TemporaryArray.includes(scope.row.userId)) {
                  this.TemporaryCancel.push(scope.row);
                }
              } else {
                this.TemporaryCancel.push(scope.row);
              }
              row.selectedArray.forEach((result, resultIndex) => {
                if (result.userId === scope.row.userId) {
                  this.allNotice[NoticeIndex].selectedArray.splice(
                    resultIndex,
                    1
                  );
                }
              });
              scope.row.isSelect = false;
              this.$refs.multipleTable[index].toggleRowSelection(
                item.tipsTableData[scope.$index],
                false
              );
            } else {
              valArr = row.selectedArray.map((val) => val.userId);
              if (!valArr.includes(scope.row.userId)) {
                if (this.TemporaryAdd.length > 0) {
                  TemporaryArray = this.TemporaryAdd.map((val) => val.userId);
                  if (!TemporaryArray.includes(scope.row.userId)) {
                    this.TemporaryAdd.push(scope.row);
                  }
                } else if (this.TemporaryAdd.length === 0) {
                  this.TemporaryAdd.push(scope.row);
                }
                row.selectedArray.push(scope.row);
              } else {
                if (scope.row.checkList.length === 2) {
                  row.selectedArray.forEach((result) => {
                    if (result.userId === scope.row.userId) {
                      result.checkList = scope.row.checkList;
                    }
                  });
                }
              }
              scope.row.isSelect = true;
              this.$refs.multipleTable[index].toggleRowSelection(
                item.tipsTableData[scope.$index],
                true
              );
            }
          }
        });
      });
    },
    // 保存历史的数据
    SaveHdata() {
      let objArray = [];
      let copyObjArray = [];
      let copyAllNotice = [];
      let copyRoleList = JSON.parse(JSON.stringify(this.roleList));
      copyRoleList.forEach((item) => {
        if (this.tipsForm.role.includes(item.roleId)) {
          objArray.push({
            value: item.roleId,
            label: item.name
          });
        }
      });
      copyObjArray = JSON.parse(JSON.stringify(objArray)).map(
        (item) => item.value
      );
      if (this.allNotice.length === 0) {
        this.allNotice = JSON.parse(JSON.stringify(objArray));
        this.allNotice.forEach((item) => {
          item.selectedArray = [];
        });
      } else {
        copyAllNotice = JSON.parse(JSON.stringify(this.allNotice)).map(
          (item) => item.value
        );
        this.allNotice.forEach((item, index) => {
          if (!copyObjArray.includes(item.value)) {
            this.allNotice.splice(index, 1);
          }
        });
        objArray.forEach((item) => {
          if (!copyAllNotice.includes(item.value)) {
            this.allNotice.push({
              value: item.value,
              label: item.label,
              selectedArray: []
            });
          }
        });
      }
      return objArray;
    },
    // 选择角色
    chooseRole() {
      let array = this.SaveHdata();
      if (array.length > 0) {
        let resultArray = [];
        // 这里初始化分页脚码
        array.forEach((item) => {
          item.tipsPage = {
            current: 1,
            size: 10
          };
          item.tipsTotalSize = 0;
          resultArray.push(
            axios.userList({
              online: false,
              condition: '', /// 姓名、手机、登录名
              roleIds: [item.value], // 角色ID，多个用“,”隔开
              userStatus: '', // 用户状态  0正常 1禁用 2锁定 3注销
              current: item.tipsPage.current, // 当前页
              size: item.tipsPage.size // 每页显示条数
            })
          );
        });

        Promise.all(resultArray).then((res) => {
          array.forEach((item, index) => {
            if (!item.tipsTableData) {
              item.tipsTableData = [];
              if (res[index].data.code === 200) {
                item.tipsTotalSize = Number(res[index].data.data.result.total);
                res[index].data.data.result.records.forEach((result) => {
                  item.tipsTableData.push({
                    name: result.name,
                    phone: result.mobile,
                    email: result.email,
                    department: result.position,
                    checkList: [],
                    userId: result.userId,
                    isSelect: false
                  });
                });
              }
            }
          });

          this.tabsList = array;
          this.activeName = this.tipsForm.role[0];
          this.$nextTick(() => {
            if (this.allNotice.length > 0) {
              this.AutoSelect();
            }
          });
        });
      } else {
        this.tabsList = [];
      }
    },

    // 根据历史自动选中
    AutoSelect() {
      // console.log(this.tabsList, this.allNotice);
      this.tabsList.forEach((item, index) => {
        if (item.value === this.activeName) {
          item.tipsTableData.forEach((result, resultIndex) => {
            this.allNotice.forEach((res) => {
              res.selectedArray.forEach((data) => {
                if (result.userId === data.userId) {
                  result.checkList = data.checkList;
                  result.isSelect = true;
                  if (this.tipsForm.mode === 1) {
                    this.$refs.multipleTable[index].toggleRowSelection(
                      result,
                      true
                    );
                  }
                }
              });
            });
          });
        }
      });
      this.hiddenCheck();
    },
    // 通知人员选中一个
    chooseOne(val, row) {
      // console.log(val, row);
      let isSelect = false;
      let TemporaryArray = [];
      val.forEach((item) => {
        if (item.index === row.index) {
          isSelect = true;
        }
      });
      if (isSelect) {
        row.isSelect = true;
        row.checkList = ['email', 'message'];
        // 对选择项做记录--选中添加
        this.allNotice.forEach((item) => {
          if (this.activeName === item.value) {
            item.selectedArray.push(row);
          }
        });
        if (this.TemporaryAdd.length > 0) {
          TemporaryArray = this.TemporaryAdd.map((val) => val.userId);
          if (!TemporaryArray.includes(row.userId)) {
            this.TemporaryAdd.push(row);
          }
        } else {
          this.TemporaryAdd.push(row);
        }
      } else {
        this.tabsList.forEach((item) => {
          if (item.value === this.activeName) {
            item.tipsTableData[row.index].checkList = [];
            item.tipsTableData[row.index].isSelect = false;
          }
        });
        // 对选择项做记录--取消选中则删除
        this.allNotice.forEach((item) => {
          if (this.activeName === item.value) {
            item.selectedArray.forEach((res, index) => {
              if (res.userId === row.userId) {
                item.selectedArray.splice(index, 1);
              }
            });
          }
        });
        if (this.TemporaryCancel.length > 0) {
          TemporaryArray = this.TemporaryCancel.map((val) => val.userId);
          if (!TemporaryArray.includes(row.userId)) {
            this.TemporaryCancel.push(row);
          }
        } else {
          this.TemporaryCancel.push(row);
        }
      }
      // console.log(this.allNotice);
    },
    // 通知人员全选
    handleSelectionChange(val) {
      // console.log(val);
      let uncheckList = [];
      let TemporaryArray = [];
      this.tabsList.forEach((item) => {
        if (item.value === this.activeName) {
          item.tipsTableData.forEach((row) => {
            if (val.length === 0) {
              row.checkList = [];
              row.isSelect = false;
              if (this.TemporaryCancel.length > 0) {
                TemporaryArray = this.TemporaryCancel.map((val) => val.userId);
                if (!TemporaryArray.includes(row.userId)) {
                  this.TemporaryCancel.push(row);
                }
              } else {
                this.TemporaryCancel.push(row);
              }
            } else {
              row.checkList = ['email', 'message'];
              row.isSelect = true;
              if (this.TemporaryAdd.length > 0) {
                TemporaryArray = this.TemporaryAdd.map((val) => val.userId);
                if (!TemporaryArray.includes(row.userId)) {
                  this.TemporaryAdd.push(row);
                }
              } else {
                this.TemporaryAdd.push(row);
              }
            }
          });
        }
      });

      // 全选--添加记录
      if (val.length > 0) {
        this.allNotice.forEach((item) => {
          if (this.activeName === item.value) {
            uncheckList = item.selectedArray.map((val) => val.userId);
            val.forEach((res) => {
              if (!uncheckList.includes(res.userId)) {
                item.selectedArray.push(res);
              }
            });
          }
        });
      }
      // 取消全选--修改记录
      if (val.length === 0) {
        this.tabsList.forEach((item) => {
          if (this.activeName === item.value) {
            uncheckList = item.tipsTableData.map((val) => val.userId);
          }
        });
        this.allNotice.forEach((item, index) => {
          if (this.activeName === item.value) {
            item.selectedArray.forEach((res) => {
              if (uncheckList.includes(res.userId)) {
                item.selectedArray.splice(index, 1);
              }
            });
          }
        });
      }
      // console.log(this.allNotice);
    },
    tableRowClassName(row) {
      // 设置row对象的index
      row.row.index = row.rowIndex;
    },
    // dialong radio切换
    changeNotice() {
      if (this.tipsForm.mode === 1) {
        this.$nextTick(() => {
          if (this.allNotice.length > 0) {
            this.AutoSelect();
          }
        });
      }
      // 清除dialog数据
      // this.tipsForm.role = [];
      // this.tabsList = [];
      // this.customFromList = [
      //   {
      //     name: "",
      //     checkList: [],
      //     email: "",
      //     phone: ""
      //   }
      // ];
    },
    handleCheckAllChange(val) {
      const { classList } = this;
      // const checkedLength = this.typesForm.type.length
      const codes = classList
        .filter(
          (item) =>
            !item.belongRule ||
            (item.belongRule && this.ownerTypes.indexOf(item.code) !== -1)
        )
        .map((item) => item.code);

      // const temp = JSON.parse(JSON.stringify(checked))
      // console.log(temp)
      // if (checkedLength === codes.length) {
      //   this.checkAll = true
      //   this.isIndeterminate = false
      // } else if (checkedLength === 0) {
      //   this.checkAll = false
      //   this.isIndeterminate = false
      // }
      console.log('val: ', val);
      this.typesForm.type = val ? codes : [];
      this.isIndeterminate = false;
      // codes.forEach(code => {
      //   if (val) {
      //     // 已经选择
      //     if (checked.indexOf(code) === -1) {
      //       console.log('push')
      //       temp.push(code)
      //     }
      //   } else {
      //     // 已经选择
      //     if (checked.indexOf(code) !== -1) {
      //       temp.forEach((tempCode, index) => {
      //         if (tempCode === code) {
      //           temp.splice(index, 1)
      //         }
      //       })
      //     }
      //   }
      // })
      // this.typesForm.type = temp
      // this.isIndeterminate = false
    },
    handlecheckedClassChange(value) {
      const list = this.classList.filter(
        (item) =>
          !item.belongRule ||
          (item.belongRule && this.ownerTypes.indexOf(item.code) !== -1)
      );
      // let allCheckeds = this.typesForm.type
      // let checkedCount = 0
      // list.forEach(item => {
      //   if (allCheckeds.indexOf(item.code) !== -1) {
      //     checkedCount++
      //   }
      // })
      const checkedCount = this.typesForm.type.length;
      console.log('checkedCount: ', checkedCount);
      console.log('list.length: ', list.length);
      this.checkAll = checkedCount === list.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < list.length;
      // this.classCheckStatus(this.typesForm.type)
    },
    // hisClassAllList() {
    //   if (this.typesForm.type.length > 0) {
    //     this.typesForm.type.forEach(item => {
    //       this.classAllList.push(item);
    //     });
    //   }
    //   this.classAllList = new Set(this.classAllList)
    //   this.chooseLabel();
    // },
    handleClick(tab) {
      this.AutoSelect();
    },
    isActive(num) {
      if (num === 1) {
        if (this.$refs.typesForm) {
          this.$refs.typesForm.validate((valid) => {
            if (valid) {
              this.active = num;
            } else {
              this.$notify({
                title: '提示',
                message: '请填写完整！',
                type: 'warning'
              });
            }
          });
          return;
        }
      }
      this.active = num;
    },
    // 新增告警规则
    saveAlarm() {
      let notifyPersonnel = [];
      notifyPersonnel = [
        {
          methodToInforme: 1,
          roles: this.tipsForm.role,
          userList: this.allNotice
        },
        {
          methodToInforme: 2,
          roles: '',
          userList: this.customFromList
        }
      ];
      if (this.noticeInform.length === 0) {
        this.$notify({
          title: '提示',
          message: '请选择通知人员！',
          type: 'warning'
        });
        return;
      }
      let params = {
        ID: this.noticeId,
        name: this.typesForm.rulesName,
        label: this.typesForm.label,
        categoryCode: { categoryCode: this.typesForm.type.join(',') },
        level: this.rulesForm.level,
        notifyPersonnel: notifyPersonnel
      };
      if (this.status === 'create') {
        this.alarmRuleSave(params);
      } else if (this.status === 'edit') {
        this.alarmRuleUpdate(params);
      }
    },
    // 编辑告警规则
    alarmRuleUpdate(params) {
      axios.alarmRuleUpdate(params).then((res) => {
        if (res.data.code === 200) {
          this.$notify({
            title: '提示',
            message: '编辑成功！',
            type: 'success'
          });
          this.$router.push({
            path: '/Aibms/Bconfiguration/Alarmrules',
            query: {
              code: 8
            }
          });
        } else if (res.data.code === 0) {
          this.$notify({
            title: '提示',
            message: res.data.message,
            type: 'error'
          });
        }
      });
    },
    // 新增保存告警规则
    alarmRuleSave(params) {
      axios.alarmRuleSave(params).then((res) => {
        if (res.data.code === 200) {
          this.$notify({
            title: '提示',
            message: '保存成功！',
            type: 'success'
          });
          this.$router.push({
            path: '/Aibms/Bconfiguration/Alarmrules',
            query: {
              code: 8
            }
          });
        } else if (res.data.code === 0) {
          this.$notify({
            title: '提示',
            message: res.data.message,
            type: 'error'
          });
        }
      });
    },
    // dialog关闭
    cancel() {
      this.$router.push({
        path: '/Aibms/Bconfiguration/Alarmrules',
        query: {
          code: 8
        }
      });
    },
    // dialog保存
    saveTips() {
      if (this.tipsForm.mode === 1) {
        this.noticeInform = [];
        this.tabsList.forEach((item) => {
          this.allNotice.forEach((res) => {
            if (item.value === res.value) {
              res.selectedArray.forEach((row) => {
                item.tipsTableData.forEach((result) => {
                  if (row.userId === result.userId) {
                    row.checkList = result.checkList;
                  }
                });
              });
            }
          });
        });
        this.allNotice.forEach((item) => {
          item.selectedArray.forEach((row) => {
            this.noticeInform.push(row);
          });
        });
        this.tipsDialog = false;
      } else {
        // 自定义
        let promiseTmp = [];
        if (this.$refs.customFrom) {
          this.$refs.customFrom.forEach((item) => {
            promiseTmp.push(item.validate());
          });
        }
        Promise.all(promiseTmp)
          .then(() => {
            this.tipsDialog = false;
            this.customFromList.forEach((item) => {
              item.department = '-';
              item.custom = true;
              this.noticeInform.push(item);
            });
            // this.noticeInform = this.customFromList;
          })
          .catch((err) => {
            return err;
          });
      }
      console.log(this.noticeInform);
      this.TemporaryCancel = [];
      this.TemporaryAdd = [];
    },
    // 对dialog操作做恢复
    resetTips() {
      // console.log(this.TemporaryCancel, this.TemporaryAdd);
      // console.log(this.tabsList, this.allNotice);
      this.tabsList.forEach((item) => {
        item.tipsTableData.forEach((row) => {
          this.noticeInform.forEach((result) => {
            if (row.userId === result.userId) {
              row.checkList = result.checkList;
            }
          });
          if (this.TemporaryCancel.length > 0) {
            this.TemporaryCancel.forEach((arr) => {
              if (arr.userId === row.userId) {
                row.checkList = ['email', 'message'];
                row.isSelect = true;
              }
            });
          }
          if (this.TemporaryAdd.length > 0) {
            this.TemporaryAdd.forEach((arr) => {
              if (arr.userId === row.userId) {
                // console.log(arr.userId, row.userId);
                row.checkList = [];
                row.isSelect = false;
              }
            });
          }
        });
      });
      // console.log(this.tabsList, this.allNotice, this.noticeInform);
      if (this.allNotice.length > 0) {
        this.allNotice.forEach((item, index) => {
          item.selectedArray = [];
          this.tabsList.forEach((row) => {
            if (item.label === row.label) {
              row.tipsTableData.forEach((tips) => {
                if (tips.isSelect) {
                  item.selectedArray.push(tips);
                }
              });
            }
          });
        });
      }
      this.echoCustom();
    },
    // dialog关闭
    handleDialogClose() {
      // 清除dialog数据
      this.resetTips();
      this.tipsDialog = false;
      this.TemporaryCancel = [];
      this.TemporaryAdd = [];
      // if (this.tipsForm.mode !== 1) {
      //   this.tipsForm.mode = 1;
      //   this.changeNotice();
      // }
      // this.$refs.tipsForm.resetFields();
    },
    // 分页
    handleCurrentChange() {
      // this.hisClassAllList();
      this.chooseLabel();
    },
    // 表格每页数量
    handleSizeChange() {
      this.page.current = 1;
      // this.hisClassAllList();
      this.chooseLabel();
    },
    // 通知人员分页
    handleCurrentChangeTips(item) {
      this.getUserList(item);
    },
    // 表格每页数量
    handleSizeChangeTips(item) {
      item.tipsPage.current = 1;
      this.getUserList(item);
    },
    // 新增一条自定义通知人员
    addCustom() {
      this.customFromList.push({
        name: '',
        checkList: [],
        email: '',
        phone: ''
      });
    },
    // 删除一条自定义通知人员
    removeCustom(index) {
      if (this.customFromList.length === 1) return;
      this.customFromList.splice(index, 1);
    }
  }
};
</script>

<style lang="scss" scoped>
.aia-content {
  position: relative;
  width: 100%;
  padding: 10px 10px;
  box-sizing: border-box;
  .wrapper_pannel {
    width: 100%;
    background-color: rgba(4, 28, 37, 0.3);
    padding: 10px 0 60px;
    overflow: visible;
    .custom-tips-form {
      height: 500px;
      overflow-y: auto;
      .custom-from {
        padding: 0 20px;
        .more-span {
          line-height: 40px;
          i {
            color: #00a8e8;
            font-size: 24px;
            vertical-align: middle;
            cursor: pointer;
          }
        }
      }
    }

    .tips-form {
      padding: 0 20px;
    }
    .content-form {
      margin-left: 20px;
      .tips {
        font-size: 12px;
        color: #999;
      }
      .notice {
        color: #409eff;
        width: 120px;
        cursor: pointer;
        span {
          font-size: 12px;
        }
      }
    }
    .steps-alert {
      width: 60%;
      margin: 124px auto 114px;
    }
    .op-btns {
      text-align: center;
    }
  }
  .cancel-button {
    border: 1px solid #fff;
    color: #fff;
    &:hover {
      border: 1px solid #fff;
      color: #fff;
      background: transparent;
    }
    &:focus {
      color: #fff;
      background: transparent;
    }
    &:active {
      border: 1px solid #fff;
      background: transparent;
      color: #fff;
    }
  }
}
.s1-color {
  color: #ff0000 !important;
  fill: #ff0000 !important;
}
.s2-color {
  color: #ff9900 !important;
  fill: #ff9900 !important;
}
.s3-color {
  color: #ffcc00 !important;
  fill: #ffcc00 !important;
}
.s4-color {
  color: #ffff00 !important;
  fill: #ffff00 !important;
}
.s5-color {
  color: #ffff88 !important;
  fill: #ffff88 !important;
}
.aia-content /deep/ .el-dialog__header {
  padding: 20px 20px 10px;
  border-bottom: 1px solid #dcdcdc;
}
.wrapper-title {
  font-size: 18px;
  color: #fff;

  padding-left: 20px;
}
</style>
