<template>
  <div class="temp">
    <div class="wrapper_pannel">
      <div class="block-item base-info">
        <div class="item-block-title" @click="switchBlock(1)">
          <div class="item-block-title-mark"></div>
          <span class="item-block-title-font">短信配置</span>
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
            :model="msgForm"
            label-width="160px"
            ref="smsForm"
            label-position="right"
            :rules="msgFormRules"
            style="width: 80%"
          >
            <el-form-item label="URL：" prop="apiUrl" style="display: block">
              <el-input
                clearable
                v-model.trim="msgForm.apiUrl"
                @blur="checkUrl"
                placeholder="请输入URL"
              />
            </el-form-item>
            <el-form-item
              label="模板类型："
              prop="noticeType"
              style="display: block"
            >
              <el-select
                v-model="msgForm.noticeType"
                clearable
                placeholder="请选择模板"
                :style="{ width: '100%' }"
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
            <!-- <el-form-item>
              <el-button type="primary" @click="handleTest">测试</el-button>
            </el-form-item> -->
            <!-- <el-form-item label="账号：" prop="accountNumber">
              <el-input
                maxlength="11"
                clearable
                v-model.trim="msgForm.accountNumber"
                placeholder="请输入账号"
                :style="{ width: '632px' }"
              />
            </el-form-item>
            <el-form-item label="密码：" prop="passWord">
              <el-input
                maxlength="20"
                show-password
                clearable
                v-model.trim="msgForm.passWord"
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
          <span class="item-block-title-font">短信模板</span>
          <i
            class="icons el-icon-arrow-right"
            :style="{
              transform: blockSwitch[2] ? 'rotate(90deg)' : 'rotate(0)',
            }"
          ></i>
        </div>
        <div class="block-content" style="overflow: visible">
          <div v-if="blockSwitch[2]">
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
              style="width: 80%"
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
              <el-form-item label="内容：" prop="content">
                <div>
                  <temp-config
                    :clickNum="clickMsgNum"
                    :StringList="StringList"
                    :placeholderText="
                      msgForm.noticeType === 'ALERT_AGGREGATION'
                        ? polymerization
                        : msgForm.noticeType === 'ALERT_STORM'
                        ? stormPlaceholder
                        : placeholderMsg
                    "
                    :inputH="8"
                    :textContent.sync="MsgText"
                    class="textarea-wrap"
                  />
                </div>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>

      <div class="op-btns">
        <el-button
          class="save-btn common-btn"
          @click="handleTest"
          >测试</el-button
        >
        <el-button
          class="save-btn common-btn"
          @click="submit"
          >保存</el-button
        >
      </div>
    </div>
    <el-dialog title="测试短信" :visible.sync="testDialogVisible" width="30%">
      <el-form :model="testForm" :rules="testFormRules" ref="testForm">
        <el-form-item prop="receiver" label="手机号">
          <el-input
            v-model="testForm.receiver"
            placeholder="请输入测试手机号"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="cancel-button" @click="testDialogVisible = false" size="small"
          >取 消</el-button
        >
        <el-button
          class="save-btn common-btn"
          @click="testMsg"
          :loading="isTesting"
          size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import TempConfig from './TemplateConfig';
import axios from '@/api';
export default {
  data() {
    // var validateMobile = (rule, value, callback) => {
    //   if (value === "") {
    //     callback(new Error("请输入手机号！"));
    //   } else if (!/^1[34578]\d{9}$/.test(value)) {
    //     callback(new Error("请输入正确的手机号码！"));
    //   } else {
    //     callback();
    //   }
    // };
    var validatecontent = (rule, value, callback) => {
      if (this.MsgText.content === '') {
        callback(new Error('请编写内容！'));
      } else {
        callback();
      }
    };
    return {
      typeList: [
        { value: 'ALERT', label: '普通模板' },
        { value: 'ALERT_UPGRADE', label: '升级模板' },
        { value: 'ALERT_AGGREGATION', label: '聚合模板' },
        { value: 'ALERT_STORM', label: '风暴模板' }
      ],
      firstUrl: '',
      isSubmit: false,
      isFirst: false,
      StringList: [],
      clickMsgNum: -1,
      blockSwitch: { 1: true, 2: false },
      placeholderMsg: '例如：您好，关于[[$DATE]]告警信息的邮件，请查阅',
      polymerization: '例如：您好，主机:[[$HOSTNAME]]###描述:[[$message]]###,ps:###里面的为聚合内容',
      stormPlaceholder: '例如：您好，主机：[[$host]]描述：[[$message]]告警持续时间：[[$duration]]告警发生次数：[[$times]]',
      msgForm: {
        apiUrl: '',
        noticeType: 'ALERT'
      },
      msgFormRules: {
        apiUrl: [{ required: true, message: '请输入url！', trigger: 'blur' }],
        noticeType: [{ required: true, message: '请选择模板类型！', trigger: 'change' }],
        // accountNumber: [
        //   { required: true, validator: validateMobile, trigger: "blur" }
        // ],
        accountNumber: [
          { required: true, message: '请输入账号！', trigger: 'blur' }
        ],
        passWord: [
          { required: true, message: '请输入密码！', trigger: 'blur' }
        ]
      },
      configForm: {
        variable: '',
        content: ''
      },
      configFormRules: {
        content: [
          { required: true, validator: validatecontent, trigger: 'blur' }
        ]
      },
      MsgText: { content: '' },
      id: '',
      testForm: {
        receiver: ''
      },
      testFormRules: {
        receiver: [
          { required: true, message: '手机号不能为空！', trigger: 'blur' },
          {
            pattern: /^1[34578]\d{9}$/,
            message: '请输入合法的手机号',
            trigger: 'blur'
          }
        ]
      },
      isTesting: false,
      testDialogVisible: false,
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
        },
        {
          noticeType: 'ALERT_STORM',
          subject: '',
          content: ''
        }
      ]
    };
  },
  created() {
    this.init();
  },
  watch: {
    // 短信文本监听
    MsgText: {
      handler(val) {
        this.handleContent(val)
      },
      deep: true
    }
  },
  methods: {
    // 判断是否第一次进入
    checkUrl() {
      if (!this.isFirst) {
        if (this.msgForm.apiUrl === this.firstUrl) {
          this.isSubmit = true
        } else {
          this.isSubmit = false
        }
      }
    },
    // 选择模板类型
    chooseType() {
      console.log(this.template, this.msgForm)
      this.template.forEach((item) => {
        if (item.noticeType === this.msgForm.noticeType) {
          this.MsgText.content = item.content
        }
      })
    },
    // 文本处理
    handleContent(val) {
      this.template.forEach((item) => {
        if (item.noticeType === this.msgForm.noticeType) {
          item.content = val.content
        }
      })
    },
    // 短信测试dialog打开
    handleTest() {
      this.$refs.smsForm.validate((valid) => {
        if (valid) {
          this.testDialogVisible = true;
        }
      });
    },
    init() {
      Promise.all([
        // 获取用户列表
        axios.userList({
          online: false,
          condition: '', /// 姓名、手机、登录名
          roleIds: [], // 角色id，多个用“,”隔开
          userStatus: '', // 用户状态  0正常 1禁用 2锁定 3注销
          current: 1, // 当前页
          size: 1000 // 每页显示条数
        }),
        // 短信配置详情
        axios.smsDetail()
      ]).then((res) => {
        console.log(res[1]);
        if (res[1].data.code === 200) {
          let smsData = res[1].data.data;
          let bl = false
          smsData.template.forEach((item) => {
            if (item.content) {
              bl = true
            }
            if (this.msgForm.noticeType === item.noticeType) {
              this.MsgText.content = item.content || '';
            }
          })
          if (!bl) {
            this.isFirst = true;
          } else {
            this.isSubmit = true
            this.firstUrl = smsData.config.apiUrl
          }
          this.formatData(JSON.stringify(smsData.params));
          this.msgForm.apiUrl = smsData.config.apiUrl || '';
          this.id = smsData.id || '';
          this.template = Object.assign(this.template, smsData.template)
          console.log(this.template)
        }
      });
    },
    // 选择参数
    chooseConfig(item, index) {
      this.clickMsgNum = index;
    },
    // 是否展开
    switchBlock(index) {
      return (this.blockSwitch[index] = !this.blockSwitch[index]);
    },
    // 修改数据格式
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
    // 第一次保存短信配置
    FirstSaveMsg() {
      let params = {
        id: this.id,
        type: 'sms',
        config: {
          apiUrl: this.msgForm.apiUrl
        },
        template: JSON.stringify(this.template)
      };
      axios.FirstSmsSave(params).then((res) => {
        if (res.data.code === 200) {
          this.$notify({
            title: '提示',
            message: '保存成功！',
            type: 'success'
          });
        } else {
          this.$notify({
            title: '提示',
            message: res.data.message,
            type: 'error'
          });
        }
      });
    },
    // 保存短信配置
    saveMsg() {
      let params = {
        id: this.id,
        type: 'sms',
        config: {
          apiUrl: this.msgForm.apiUrl
        },
        template: JSON.stringify(this.template)
      };
      axios.smsSave(params).then((res) => {
        if (res.data.code === 200) {
          this.$notify({
            title: '提示',
            message: '保存成功！',
            type: 'success'
          });
        } else {
          this.$notify({
            title: '提示',
            message: res.data.message,
            type: 'error'
          });
        }
      });
    },
    // 测试短信
    testMsg() {
      this.$refs.testForm.validate((valid) => {
        if (valid) {
          let params = {
            id: this.id,
            type: 'sms',
            config: {
              apiUrl: this.msgForm.apiUrl ||
                'https://oapi.dingtalk.com/robot/send?access_token=3686cdfea72acecf7b4703dfec556d4beb10e40122b6fa8d93d4cf8ddbd749e0'
            },
            template: JSON.stringify(this.template),
            receiver: this.testForm.receiver
          };
          this.isTesting = true;
          axios
            .testSms(params)
            .then((res) => {
              this.isTesting = false;
              if (res.data.code === 200) {
                this.isSubmit = true;
                this.testDialogVisible = false;
                this.$notify({
                  title: '提示',
                  message: '测试通过！',
                  type: 'success'
                });
              } else {
                this.$notify({
                  title: '提示',
                  message: '测试失败！',
                  type: 'error'
                });
              }
            })
            .catch(() => {
              this.isTesting = false;
            });
        }
      });
    },
    // 提交短信配置
    submit() {
      if (!this.isSubmit) {
        this.$notify({
          title: '提示',
          message: '请先通过短信测试！',
          type: 'warning'
        });
      } else {
        this.blockSwitch[1] = true
        this.blockSwitch[2] = true
        this.$nextTick(() => {
          Promise.all([
            this.$refs.smsForm.validate(),
            this.$refs.configform.validate()
          ]).then((res) => {
            if (res[0] && res[1]) {
              if (this.isFirst) {
                this.FirstSaveMsg();
              } else {
                this.saveMsg();
              }
            }
          });
        })
      }
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
  font-size:0;
}
.svg-img {
  height: 16px;
  vertical-align: middle;
}
.dialog-footer{
  font-size:0;
}
</style>
