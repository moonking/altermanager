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
              transform: blockSwitch[1] ? 'rotate(90deg)' : 'rotate(0)'
            }"
          ></i>
        </div>
        <div class="block-content" :style="{ height: blockSwitch[1] ? 'auto' : '0' }">
          <el-form
            :model="msgForm"
            label-width="100px"
            ref="smsForm"
            inline
            label-position="right"
            :rules="msgFormRules">
            <el-form-item label="URL：" prop="apiUrl">
              <el-input
                clearable
                v-model.trim="msgForm.apiUrl"
                placeholder="请输入URL"
                :style="{ width: '500px' }"
              />
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
              transform: blockSwitch[2] ? 'rotate(90deg)' : 'rotate(0)'
            }"
          ></i>
        </div>
        <div class="block-content" style="overflow: visible;">
          <div v-if="blockSwitch[2]">
            <div class="button-var">
              <div>变量声明：点击这些变量,即可在输入框中使用</div>
            </div>
            <el-form
              :model="configForm"
              label-width="100px"
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
                  >{{ item.value }}:{{ item.name }}</el-button>
                </div>
              </el-form-item>
              <el-form-item label="内容：" prop="content">
                <div>
                  <temp-config
                    :clickNum="clickMsgNum"
                    :StringList="StringList"
                    :placeholderText="placeholderMsg"
                    :inputH="8"
                    :textContent.sync="MsgText"
                  />
                </div>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>

      <div class="op-btns">
        <el-button type="primary" @click="handleTest" :style="{ marginRight: '60px' }">测试</el-button>
        <el-button type="primary" @click="submit" :style="{ marginRight: '60px' }">保存</el-button>
      </div>
    </div>
    <el-dialog
      title="测试短信"
      :visible.sync="testDialogVisible"
      width="30%">
      <el-form :model="testForm" :rules="testFormRules" ref="testForm">
        <el-form-item prop="receiver" label="手机号">
          <el-input v-model="testForm.receiver" placeholder="请输入测试手机号"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="testDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="testMsg" :loading="isTesting" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import TempConfig from './TemplateConfig';
import axios from '@/api';
export default {
  data () {
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
      isSubmit: false,
      isFirst: false,
      StringList: [],
      clickMsgNum: -1,
      blockSwitch: { '1': true, '2': false },
      placeholderMsg: '例如：您好，关于[[$DATE]]告警信息的邮件，请查阅',
      msgForm: {
        apiUrl: ''
      },
      msgFormRules: {
        apiUrl: [{ required: true, message: '请输入url！', trigger: 'blur' }],
        // accountNumber: [
        //   { required: true, validator: validateMobile, trigger: "blur" }
        // ],
        accountNumber: [
          { required: true, message: '请输入账号！', trigger: 'blur' }
        ],
        passWord: [{ required: true, message: '请输入密码！', trigger: 'blur' }]
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
      ID: '',
      testForm: {
        receiver: ''
      },
      testFormRules: {
        receiver: [
          {required: true, message: '手机号不能为空！', trigger: 'blur'},
          {pattern: /^1[34578]\d{9}$/, message: '请输入合法的手机号', trigger: 'blur'}
        ]
      },
      isTesting: false,
      testDialogVisible: false
    };
  },
  created () {
    this.init();
  },
  methods: {
    handleTest () {
      this.$refs.smsForm.validate(valid => {
        if (valid) {
          this.testDialogVisible = true
        }
      })
    },
    init () {
      Promise.all([
        axios.userList({
          online: false,
          condition: '', /// 姓名、手机、登录名
          roleIds: [], // 角色ID，多个用“,”隔开
          userStatus: '', // 用户状态  0正常 1禁用 2锁定 3注销
          current: 1, // 当前页
          size: 1000 // 每页显示条数
        }),
        axios.smsDetail()
      ]).then(res => {
        console.log(res[0]);
        if (res[1].data.code === 200) {
          let smsData = res[1].data.data;
          if (!smsData.smsContent) {
            this.isFirst = true;
          }
          this.formatData(JSON.stringify(smsData.varible));
          this.msgForm.apiUrl = smsData.apiUrl || '';
          this.MsgText.content = smsData.smsContent || '';
          this.ID = smsData.iD || '';
        }
      });
    },
    chooseConfig (item, index) {
      this.clickMsgNum = index;
    },
    switchBlock (index) {
      return (this.blockSwitch[index] = !this.blockSwitch[index]);
    },
    formatData (str) {
      let arr = [];
      arr = str
        .slice(1, -1)
        .replace(/\"/g, '')
        .split(',');
      arr.forEach(item => {
        let team = item.split(':');
        this.StringList.push({
          value: '$' + team[0],
          name: team[1]
        });
      });
    },
    FirstSaveMsg () {
      let params = {
        ID: this.ID,
        apiUrl: this.msgForm.apiUrl,
        smsContent: this.MsgText.content
      };
      axios.FirstSmsSave(params).then(res => {
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
    saveMsg () {
      let params = {
        ID: this.ID,
        apiUrl: this.msgForm.apiUrl,
        smsContent: this.MsgText.content
      };
      axios.smsSave(params).then(res => {
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
    testMsg () {
      this.$refs.testForm.validate(valid => {
        if (valid) {
          let params = {
            // ID: this.ID,
            apiUrl:
              this.msgForm.apiUrl ||
              'https://oapi.dingtalk.com/robot/send?access_token=3686cdfea72acecf7b4703dfec556d4beb10e40122b6fa8d93d4cf8ddbd749e0',
            // accountNumber: this.msgForm.accountNumber,
            // passWord: this.msgForm.passWord,
            smsContent: this.MsgText.content || 'testMsg',
            receiver: this.testForm.receiver
          };
          this.isTesting = true
          axios.testSms(params).then(res => {
            this.isTesting = false
            if (res.data.code === 200) {
              this.isSubmit = true;
              this.testDialogVisible = false
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
          }).catch(() => {
            this.isTesting = false
          })
        }
      });
    },
    submit () {
      if (!this.isSubmit) {
        this.$notify({
          title: '提示',
          message: '请先通过短信测试！',
          type: 'warning'
        });
      } else {
        Promise.all([
          this.$refs.smsForm.validate(),
          this.$refs.configform.validate()
        ]).then(res => {
          if (res[0] && res[1]) {
            if (this.isFirst) {
              this.FirstSaveMsg();
            } else {
              this.saveMsg();
            }
          }
        });
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
  .wrapper_pannel {
    width: 100%;
    background-color: rgba(4, 28, 37, 0.3);
    padding: 10px 0 60px;
    overflow: visible;
    .block-item {
      margin-bottom: 20px;
      .item-block-title {
        margin-bottom: 20px;
        .item-block-title-mark {
          background: #00A8E8;
        }
        .item-block-title-font {
          color: #fff;
        }
      }
      .block-content {
        /* padding: 20px 0 20px 56px; */
        padding-left: 20px;
        overflow: hidden;
        /* overflow: visible; */
        .button-var {
          width: 60%;
          .el-button {
            border: 1px solid #00A8E8;
            color: #fff;
            background: #00A8E8;
            &:hover {
              border: 1px solid #00A8E8;
              color: #fff;
              background: #00A8E8;
            }
            &:focus {
              color: #fff;
              background: #00A8E8;
            }
            &:active {
              border: 1px solid #00A8E8;
              background: #00A8E8;
              color: #fff;
            }
          }
          div {
            margin-left: 90px;
            margin-bottom: 20px;
            font-size: 12px;
            color: #fff;
          }
        }
      }
    }
  }
}
.icons {
  color: #00A8E8;
  font-size: 20px;
  vertical-align: middle;
  margin-left: 4px;
}
.op-btns {
  text-align: center;
}
</style>
