<template>
  <div class="temp">
    <div class="wrapper_pannel">
      <div class="block-item base-info">
        <div class="item-block-title" @click="switchBlock(1)">
          <div class="item-block-title-mark"></div>
          <span class="item-block-title-font">邮箱配置</span>
          <i
            class="icons el-icon-arrow-right"
            :style="{
              transform: blockSwitch[1] ? 'rotate(90deg)' : 'rotate(0)',
            }"
          ></i>
        </div>
        <div
          class="block-content"
          :style="{ height: blockSwitch[1] ? 'auto' : '0' }"
        >
          <el-form
            :model="emailForm"
            label-width="160px"
            ref="mailform"
            label-position="right"
            :rules="emailFormRules"
          >
            <el-form-item label="IP：" prop="ip">
              <el-input
                maxlength="20"
                clearable
                v-model.trim="emailForm.ip"
                placeholder="请输入IP"
                :style="{ width: '632px' }"
              />
            </el-form-item>
            <el-form-item label="端口：" prop="port">
              <el-input
                maxlength="20"
                clearable
                v-model.trim="emailForm.port"
                placeholder="请输入端口"
                :style="{ width: '632px' }"
              />
            </el-form-item>
            <el-form-item label="邮箱：" prop="accountNumber">
              <el-input
                clearable
                v-model.trim="emailForm.accountNumber"
                placeholder="请输入账号"
                :style="{ width: '632px' }"
              />
            </el-form-item>
            <el-form-item
              label="模板类型："
              prop="noticeType"
              style="display: block"
            >
              <el-select
                v-model="emailForm.noticeType"
                clearable
                placeholder="请选择模板"
                :style="{ width: '200px' }"
                @change="chooseType"
              >
                <el-option
                  v-for="item in typeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="密码：" prop="password">
              <el-input
                maxlength="20"
                show-password
                clearable
                v-model.trim="emailForm.password"
                placeholder="请输入密码"
                :style="{ width: '632px' }"
              />
            </el-form-item> -->
          </el-form>
        </div>
      </div>
      <div class="block-item task-process">
        <div class="item-block-title" @click="switchBlock(2)">
          <div class="item-block-title-mark"></div>
          <span class="item-block-title-font">邮箱模板</span>
          <i
            class="icons el-icon-arrow-right"
            :style="{
              transform: blockSwitch[2] ? 'rotate(90deg)' : 'rotate(0)',
            }"
          ></i>
        </div>
        <div class="block-content" style="overflow: visible">
          <div v-show="blockSwitch[2]">
            <div class="button-var">
              <div class="font24 font-color">
                <icon-svg
                  icon-class="tips"
                />
                <!-- <img class="svg-img" src="/static/img/task/tips.svg" alt="" /> -->
                <span> 变量声明：点击这些变量,即可在输入框中使用</span>
              </div>
            </div>
            <el-form
              :model="configForm"
              label-width="160px"
              ref="configform"
              label-position="right"
              :rules="configFormRules"
            >
              <el-form-item label="变量：">
                <div class="button-var">
                  <el-button
                    v-for="(item, index) in StringList"
                    :key="index"
                    @click="chooseConfig(item, index)"
                    size="small"
                    style="font-family: 'PingFang SC'"
                    >{{ item.value }}:{{ item.name }}</el-button
                  >
                </div>
              </el-form-item>
              <el-form-item label="邮件主题：" prop="theme">
                <div @click="chooseCont(0)">
                  <temp-config
                    :clickNum="clickThemeNum"
                    :StringList="StringList"
                    :placeholderText="placeholderTheme"
                    :inputH="3"
                    :textContent.sync="ThemeText"
                  />
                </div>
              </el-form-item>
              <el-form-item label="内容：" prop="content">
                <div @click="chooseCont(1)">
                  <temp-config
                    :clickNum="clickContentNum"
                    :StringList="StringList"
                    :placeholderText="
                      emailForm.noticeType !== 'ALERT_AGGREGATION'
                        ? placeholderContent
                        : polymerization
                    "
                    :inputH="8"
                    :textContent.sync="ContentText"
                  />
                </div>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>

      <div class="op-btns">
        <el-button
          @click="handleTest"
          class="save-btn common-btn"
          >测试</el-button
        >
        <el-button
          @click="saveEmail"
           class="save-btn common-btn"
          >保存</el-button
        >
      </div>
    </div>
    <el-dialog title="测试邮箱" :visible.sync="testDialogVisible" width="30%">
      <el-form :model="testForm" :rules="testFormRules" ref="testForm">
        <el-form-item prop="receiver" label="邮箱">
          <el-input
            v-model="testForm.receiver"
            placeholder="请输入测试邮箱"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="cancel-button" @click="testDialogVisible = false" size="small"
          >取 消</el-button
        >
        <el-button
          class="save-btn common-btn"
          @click="testEmail"
          :loading="isTesting"
          size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from '@/api';
import TempConfig from './TemplateConfig';
export default {
  data() {
    var validateEmail = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入邮箱'));
      } else if (
        !/^([0-9A-Za-z\-_\\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g.test(
          value
        )
      ) {
        callback(new Error('请输入正确的email'));
      } else {
        callback();
      }
    };
    var validateTheme = (rule, value, callback) => {
      if (this.ThemeText.content === '') {
        callback(new Error('请输入邮件主题！'));
      } else {
        callback();
      }
    };
    var validateContent = (rule, value, callback) => {
      if (this.ContentText.content === '') {
        callback(new Error('请编写内容！'));
      } else {
        callback();
      }
    };
    return {
      typeList: [
        { value: 'ALERT', label: '普通模板' },
        { value: 'ALERT_UPGRADE', label: '升级模板' },
        { value: 'ALERT_AGGREGATION', label: '聚合模板' }
      ],
      testForm: {
        receiver: ''
      },
      testFormRules: {
        receiver: [
          { required: true, message: '邮箱账号不能为空！', trigger: 'blur' },
          {
            pattern: /^([0-9A-Za-z\-_\\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g,
            message: '请输入合法的邮箱！',
            trigger: 'blur'
          }
        ]
      },
      testDialogVisible: false,
      isTesting: false,
      StringList: [],
      clickThemeNum: -1,
      clickContentNum: -1,
      clickContent: 0,
      blockSwitch: { 1: true, 2: false },
      placeholderTheme: '例如：您好，关于[[$DATE]]告警信息的邮件，请查阅',
      placeholderContent:
        '请输入内容，例如\nDear[[$NAME]]\n[[$HOSTNAME]]发出告警 [[$A_CLASS]]，详情为[[$MESSAGE]]，告警来源为[[$M_SOURCE]]',
      polymerization: '请输入内容，例如\nDear[[$NAME]]\n[[$HOSTNAME]] ###描述:[[$message]]###,ps:###里面的为聚合内容',
      emailForm: {
        ip: '',
        port: '',
        accountNumber: '',
        password: '',
        noticeType: 'ALERT'
      },
      emailFormRules: {
        ip: [{ required: true, message: '请输入IP！', trigger: 'blur' }],
        port: [{ required: true, message: '请输入端口！', trigger: 'blur' }],
        accountNumber: [
          { required: true, validator: validateEmail, trigger: 'blur' }
          // { required: true, message: "请输入账号！", trigger: "blur" }
        ],
        password: [
          { required: true, message: '请输入密码！', trigger: 'blur' }
        ],
        noticeType: [{ required: true, message: '请选择模板类型！', trigger: 'change' }]
      },
      configForm: {
        variable: '',
        theme: '',
        content: ''
      },
      configFormRules: {
        theme: [
          { required: true, validator: validateTheme, trigger: 'change' }
        ],
        content: [
          { required: true, validator: validateContent, trigger: 'change' }
        ]
      },
      ThemeText: { content: '' },
      ContentText: { content: '' },
      template: [
        {
          noticeType: 'ALERT',
          subject: '',
          content: ''
        },
        {
          noticeType: 'ALERT_UPGRADE',
          subject: '',
          content: ''
        },
        {
          noticeType: 'ALERT_AGGREGATION',
          subject: '',
          content: ''
        }
      ]
    };
  },
  watch: {
    // 文本内容监听
    ContentText: {
      handler(val) {
        this.handleContent(val)
      },
      deep: true
    },
    // 主题监听
    ThemeText: {
      handler(val) {
        this.handleTheme(val)
      },
      deep: true
    }
  },
  created() {
    this.init();
  },
  methods: {
    // 选择类型
    chooseType() {
      this.template.forEach((item) => {
        if (item.noticeType === this.emailForm.noticeType) {
          this.ThemeText.content = item.subject
          this.ContentText.content = item.content
        }
      })
    },
    // 本文内容显示
    handleContent(val) {
      this.template.forEach((item) => {
        if (item.noticeType === this.emailForm.noticeType) {
          item.content = val.content
        }
      })
    },
    // 主题内容显示
    handleTheme(val) {
      this.template.forEach((item) => {
        if (item.noticeType === this.emailForm.noticeType) {
          item.subject = val.content
        }
      })
    },
    // 邮件模板配置校验
    handleTest() {
      Promise.all([
        this.$refs.mailform.validate(),
        this.$refs.configform.validate()
      ])
        .then((res) => {
          if (res[0] && res[1]) {
            this.testDialogVisible = true;
          } else {
            this.$notify({
              title: '提示',
              type: 'error',
              message: '配置或模板校验失败，请检查输入！'
            });
          }
        })
        .catch((err) => {
          console.log(err);
          this.$notify({
            title: '提示',
            type: 'error',
            message: '配置或模板校验失败，请检查输入！'
          });
        });
    },
    init() {
      // 获取用户列表
      Promise.all([
        axios.userList({
          online: false,
          condition: '', /// 姓名、手机、登录名
          roleIds: [], // 角色id，多个用“,”隔开
          userStatus: '', // 用户状态  0正常 1禁用 2锁定 3注销
          current: 1, // 当前页
          size: 1000 // 每页显示条数
        }),
        // 获取邮件配置
        axios.emailConfig()
      ]).then((res) => {
        console.log(res[0]);
        if (res[1].data.code === 200) {
          let emailData = res[1].data.data;
          this.formatData(JSON.stringify(emailData.params));
          this.emailForm.ip = emailData.config.hostIp || '';
          this.emailForm.port = emailData.config.hostPost || '';
          this.emailForm.accountNumber = emailData.config.emailUser || '';
          this.id = emailData.id || '';
          this.template = emailData.template || []
          emailData.template.forEach((item) => {
            if (this.emailForm.noticeType === item.noticeType) {
              this.ThemeText.content = item.subject || '';
              this.ContentText.content = item.content || '';
            }
          })
        }
      });
    },
    // 选择变量
    chooseConfig(item, index) {
      if (this.clickContent === 0) {
        this.clickThemeNum = index;
      } else {
        this.clickContentNum = index;
      }
      //   item.isClick = !item.isClick;
    },
    // 数据格式解析
    formatData(str) {
      let arr = [];
      arr = str.slice(1, -1).replace(/\"/g, '').split(',');
      arr.forEach((item) => {
        let team = item.split(':');
        this.StringList.push({
          value: '$' + team[0],
          name: team[1]
        });
      });
    },
    // 主题或文本储存
    chooseCont(val) {
      this.clickContent = val;
    },
    // 配置选择
    switchBlock(index) {
      return (this.blockSwitch[index] = !this.blockSwitch[index]);
    },
    // 保存邮箱配置
    saveEmail() {
      Promise.all([
        this.$refs.mailform.validate(),
        this.$refs.configform.validate()
      ]).then((res) => {
        if (res[0] && res[1]) {
          let params = {
            id: this.id,
            config: {
              hostIp: this.emailForm.ip,
              hostPost: this.emailForm.port,
              emailUser: this.emailForm.accountNumber
            },
            type: 'email',
            template: JSON.stringify(this.template)
          };
          axios.saveEmailConfig(params).then((res) => {
            if (res.data.code === 200) {
              this.$notify({
                title: '提示',
                message: '保存成功！',
                type: 'success'
              });
            } else if (res.data.code === 400) {
              this.$notify({
                title: '提示',
                message: res.data.message,
                type: 'error'
              });
            }
          });
        }
      });
    },
    // 邮箱测试
    testEmail() {
      this.$refs.testForm.validate((valid) => {
        if (valid) {
          let params = {
            id: this.id,
            config: {
              hostIp: this.emailForm.ip,
              hostPost: this.emailForm.port,
              emailUser: this.emailForm.accountNumber
            },
            receiver: this.testForm.receiver,
            type: 'email',
            template: JSON.stringify(this.template)
          };
          this.isTesting = true;
          axios
            .testEmailConfig(params)
            .then((res) => {
              console.log(res);
              this.isTesting = false;
              if (res.data.code === 200) {
                this.$notify({
                  title: '提示',
                  message: '测试通过！',
                  type: 'success'
                });
              } else if (res.data.code === 400) {
                this.$notify({
                  title: '提示',
                  message: res.data.message,
                  type: 'error'
                });
              }
            })
            .catch(() => {
              this.isTesting = false;
            });
        }
      });
    }
  },
  components: {
    TempConfig
  }
};
</script>

<style lang="scss" scoped>
.temp {
  margin: 10px;
  .wrapper_pannel {
    width: 100%;
    // background-color: rgba(4, 28, 37, 0.3);
    padding: 10px 0 60px;
    overflow: visible;
    .block-item {
      margin-bottom: 20px;
      .item-block-title {
        margin-bottom: 20px;
        // .item-block-title-mark {
        //   background: #00a8e8;
        // }
        // .item-block-title-font {
        //   color: #fff;
        // }
      }
      .block-content {
        /* padding: 20px 0 20px 56px; */
        padding-left: 20px;
        overflow: hidden;
        /* overflow: visible; */
        .button-var {
          width: 60%;
          .el-button {
            margin-left: 0 !important;
            margin-right: 10px !important;
            border: 1px solid #00a8e8;
            color: #fff;
            background: #00a8e8;
            &:hover {
              border: 1px solid #00a8e8;
              color: #fff;
              background: #00a8e8;
            }
            &:focus {
              color: #fff;
              background: #00a8e8;
            }
            &:active {
              border: 1px solid #00a8e8;
              background: #00a8e8;
              color: #fff;
            }
          }
          div {
            margin-left: 44px;
            margin-bottom: 20px;
            // font-size: 12px;
            // color: #fff;
          }
        }
      }
    }
  }
}
.icons {
  color: #00a8e8;
  font-size: 20px;
  vertical-align: middle;
  margin-left: 4px;
}
.op-btns {
  text-align: center;
  font-size: 0;
}
.svg-img{
  height: 16px;
  vertical-align: middle;
}
.dialog-footer{
  font-size: 0;
}
</style>
