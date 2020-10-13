<template>
  <div class="login-wrap" @keydown.enter="submitForm">
    <div class="ms-login">
      <div class="ms-title">欢迎登录AI·BMS</div>
      <el-form
        ref="form"
        :model="form"
        label-width="70px"
        style="padding: 15px 40px 0 15px"
      >
        <el-form-item label="用户名">
          <el-input v-model="form.loginName"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="验证码" v-show="kaptchaShow">
          <el-input
            v-model="form.kaptcha"
            style="width: 50%; display: block; float: left"
          ></el-input>
          <img
            :src="form.img_src"
            id="kaptcha"
            width="42%"
            height="100%"
            style="float: right"
            @click="changeImg"
          />
        </el-form-item>
        <el-form-item label="登录方式">
          <el-radio-group v-model="form.loginType">
            <el-radio :label="'0'">普通登录</el-radio>
            <el-radio :label="'1'">LDAP登录</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <p class="notice" v-if="noticeError">
        您的密码已输入错误超过三次！若密码输入错误超过五次，您的账号将被锁定
      </p>
      <p class="notice" v-if="noticeLock">
        您的账号已被锁定，当日无法登录平台，请联系管理员为您解锁
      </p>
      <div class="login-btn">
        <el-button
          style="background: #0066ff; color: #fff"
          @click="submitForm()"
          >登录</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import axios from "@/api";
// import Cookie from 'js-cookie';
export default {
  data() {
    return {
      dialogFormVisible: false,
      noticeError: false,
      noticeLock: false,
      kaptchaShow: false,
      form: {
        loginType: "0",
        loginName: "",
        password: "",
        img_src: axios.baseurl() + "kaptcha",
        kaptcha: "",
      },
      systemMapping: {
        bms: "/BasicManagement",
        cmdb: "/ResourceAllocation",
        delivery: "/AutomatedRelease",
        autotest: "/",
        devops: "/AutomaticOperation",
        monitoring: "/",
        aiops: "/",
      },
    };
  },

  methods: {
    submitForm() {
      let username = this.form.loginName;
      let password = this.form.password;
      let kaptcha = this.form.kaptcha;
      let loginType = this.form.loginType;
      if (
        username == "" ||
        password == "" ||
        password == null ||
        username == null ||
        username == undefined ||
        password == undefined
      ) {
        this.$notify({
          title: "提示",
          message: "请输入账户名和密码",
          type: "warning",
        });
      } else {
        axios.userlogin(username, password, kaptcha, loginType).then((res) => {
          console.log(res);
          var loginData = res.data;
          if (loginData.data.kaptcha) {
            this.kaptchaShow = true;
          }
          // if (loginData.code == 500) {
          //   this.$notify({
          //     title: "提示",
          //     message: loginData.message,
          //     type: "warning"
          //   });
          // }
          if (loginData.code == 200) {
            localStorage.setItem("token", loginData.data.token);
            localStorage.setItem("userId", loginData.data.user.userId);
            localStorage.setItem(
              "verify",
              JSON.stringify(loginData.data.verify)
            );
            localStorage.setItem(
              "allowList",
              JSON.stringify(this.parseVerify(loginData.data.verify))
            );
            localStorage.setItem("sessionId", loginData.data.sessionId);
            // localStorage.setItem('shiroCookie', )
            // const verify = {
            //   code: 200,
            //   message: '已授权',
            //   models: ['bms']

            // }
            // localStorage.setItem('allowList',JSON.stringify(this.parseVerify(verify)))
            this.$router.push({
              path: "/",
              query: {
                userId: loginData.data.user.userId,
              },
            });

            localStorage.setItem("userName", loginData.data.user.loginName);
            localStorage.setItem("userPhoto", loginData.data.user.photo);
            localStorage.setItem("bl", "false");
          } else {
            this.$notify({
              title: "提示",
              message: loginData.message,
              type: "warning",
            });
          }
        });
      }
    },
    changeImg() {
      this.form.img_src =
        axios.baseurl() + "kaptcha?" + Math.floor(Math.random() * 100);
    },
    parseVerify(verify) {
      if (!verify) {
        verify = {};
      }
      const models = verify.models || [];
      let result = [];
      if (models) {
        for (let i = 0; i < models.length; i++) {
          result.push(this.systemMapping[models[i]]);
        }
      }
      return result;
    },
  },
  created() {
    // if (this.$route.path == "/login") {
    //   var lett = this;
    //   document.onkeydown = function(evt) {
    //     evt = evt ? evt : window.event ? window.event : "";
    //     var keyCode = evt.keyCode
    //       ? evt.keyCode
    //       : evt.which
    //       ? evt.which
    //       : evt.charCode;
    //     if (keyCode == 13) {
    //       lett.submitForm();
    //     }
    //   };
    // }
  },
  mounted() {
    this.changeImg();
  },
};
</script>

<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url(../../assets/login-bg.jpg);
  background-size: 100%;
}

.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: #0066ff;
  border-bottom: 1px solid #ddd;
}

.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 400px;
  margin: -190px 0 0 -175px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.3);
  overflow: hidden;
}

.ms-content {
  padding: 30px 30px;
}

.login-btn {
  text-align: center;
}

.login-btn button {
  width: 50%;
  height: 36px;
  margin-bottom: 20px;
}

.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: #fff;
}

.notice {
  color: red;
  font-size: 12px;
  margin: 0 15px;
}
</style>
