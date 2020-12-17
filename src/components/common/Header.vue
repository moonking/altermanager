<template>
  <div class="header">
    <!-- 折叠按钮 -->
    <!-- <div class="collapse-btn" >
    <div class="collapse-btn" @click="collapseChage"> </div>
      <i class="el-icon-menu" />
    </div> -->
    <div class="logo">
      <img src="../../assets/aia-logo.png" />
    </div>
    <ul class="mian_tab">
      <li
        v-for="(item, index) in tabData"
        :key="index"
        @click="navClick(item, index)"
        :class="{ 'active-nav': currentIndex == index }"
        style="position: relative"
      >
        <span v-if="item.bl">
          <!-- <span>
            <icon-svg :icon-class="item.className" class="white-icon-color" />
          </span> -->
          <span class="miantext" :id="index">{{ item.label }}</span>
          <div class="backcolor"></div>
        </span>
      </li>
    </ul>

    <div class="header-right">
      <div class="header-user-con">
        <!-- 全屏显示 -->
        <!-- <div class="btn-fullscreen" @click="handleFullScreen">
					<el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
						<i class="el-icon-rank"></i>
					</el-tooltip>
        </div> -->
        <!-- 消息中心 -->
        <!-- 用户头像 -->
        <div class="user-avator">
          <img :src="imgSrc" />
          <!-- {{this.$store.state.userPhoto}} -->
        </div>

        <!-- <li>
            <div class="btn-bell">
              <el-tooltip
                effect="dark"
                :content="message?`有${message}条未读消息`:`消息中心`"
                placement="bottom"
              >
                <router-link to="/tabs">
                  <i class="el-icon-bell" />
                </router-link>
              </el-tooltip>
              <span class="btn-bell-badge" v-if="message"></span>
            </div>
          </li> -->

        <el-dropdown class="user-name" trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
            {{ userName }}
            <i class="el-icon-caret-bottom"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item divided>
              <!-- <router-link to="/edit">编辑个人资料</router-link> -->
              <p @click="edit">编辑个人资料</p>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <p @click="ChangePasswordBtn">修改密码</p>
            </el-dropdown-item>
            <el-dropdown-item>
              <p @click="loginoutBtn">退出系统</p>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <!-- 用户名下拉菜单 -->
      </div>
      <!-- 编辑个人资料弹框 -->
      <el-dialog
        :visible="dialogFormVisible"
        size="tiny"
        :before-close="handleDialogClose"
        width="450px"
      >
        <div class="headportraitbox">
          <img :src="currentPic" alt />
          <i class="el-icon-edit kip" @click="togglebox"></i>
          <div class="mask"></div>
        </div>

        <transition name="fade">
          <ul class="imgBox" v-if="boxshow">
            <li
              v-for="(item, index) in list"
              v-on:click="switchPic(item.img)"
              :key="index"
            >
              <img :src="item.img" />
            </li>
          </ul>
        </transition>
        <el-form ref="form" label-width="100px">
          <el-form-item label="真实姓名：">
            <el-input
              v-model="personalData.name"
              disabled="disabled"
            ></el-input>
          </el-form-item>
          <el-form-item label="用户名：">
            <el-input
              v-model="personalData.loginName"
              disabled="disabled"
            ></el-input>
          </el-form-item>
          <el-form-item label="性别：">
            <el-radio label="0" v-model="personalData.sex">男</el-radio>
            <el-radio label="1" v-model="personalData.sex">女</el-radio>
          </el-form-item>
          <el-form-item label="手机号码：">
            <el-input v-model="personalData.mobile"></el-input>
          </el-form-item>
          <el-form-item label="E-mail：">
            <el-input v-model="personalData.email"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              :loading="editLoading"
              @click="changeImformationBtn(personalData.userId)"
              >确认修改</el-button
            >
            <el-button type="primary" @click="dialogFormVisible = false"
              >取消</el-button
            >
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 修改密码 -->
      <el-dialog
        title="修改密码"
        :visible="ChangePassword"
        size="tiny"
        :before-close="handleDialogClose"
        width="450px"
      >
        <el-form ref="form" :model="password" label-width="100px">
          <el-form-item label="原密码：" class="password-input">
            <el-input
              v-model="password.oldPwd"
              :type="registration_data1.pwdType"
            ></el-input>
            <span @click="changeType(1)" class="password-icon">
              <icon-svg
                :icon-class="registration_data1.className"
                class="eye1 gray-icon-color"
              />
            </span>
          </el-form-item>
          <el-form-item label="新密码：" class="password-input">
            <el-input
              v-model="password.newPwd"
              placeholder="6~16位字符，可包含数字、字母"
              :type="registration_data2.pwdType"
            ></el-input>
            <span @click="changeType(2)" class="password-icon">
              <icon-svg
                :icon-class="registration_data2.className"
                class="eye2 gray-icon-color"
              />
            </span>
          </el-form-item>
          <el-form-item label="确认密码：" class="password-input">
            <el-input
              v-model="password.rePwd"
              :type="registration_data3.pwdType"
            ></el-input>
            <span @click="changeType(3)" class="password-icon">
              <icon-svg
                :icon-class="registration_data3.className"
                class="eye3 gray-icon-color"
              />
            </span>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              :loading="editLoading"
              @click="changePasswordClick()"
              >确认修改</el-button
            >
            <el-button type="primary" @click="ChangePasswordCancle()"
              >取消</el-button
            >
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import bus from '../common/bus'
import axios from '@/api';
import { resourceManageWebsocketUrl } from '../../config'
export default {
  data() {
    return {
      // imgSrc:'',
      eye1: 'eye',
      eye2: 'eye',
      eye3: 'eye',
      personalData: '',
      boxshow: false,
      collapse: false,
      fullscreen: false,
      name: '',
      currentIndex: 0,
      message: 2,
      dialogFormVisible: false,
      ChangePassword: false,
      editLoading: false,
      currentPic: '',
      registration_data1: {
        pwdType: 'password',
        className: 'visible'
      },
      registration_data2: {
        pwdType: 'password',
        className: 'visible'
      },
      registration_data3: {
        pwdType: 'password',
        className: 'visible'
      },
      list: [
        {
          img: 'static/img/Fruit-1.png',
          key: '1'
        },
        {
          img: 'static/img/Fruit-2.png',
          key: '2'
        },
        {
          img: 'static/img/Fruit-3.png',
          key: '3'
        },

        {
          img: 'static/img/Fruit-4.png',
          key: '4'
        },
        {
          img: 'static/img/Fruit-5.png',
          key: '5'
        },
        {
          img: 'static/img/Fruit-6.png',
          key: '6'
        },
        {
          img: 'static/img/Fruit-7.png',
          key: '7'
        }
      ],
      password: {
        oldPwd: '',
        newPwd: '',
        rePwd: ''
      },
      form: {
        name: '',
        address: '',
        date: ''
      },
      img: {},
      tabData: [
        {
          className: 'caizhitihuan',
          label: '基础管理',
          link: '/BasicManagement/user',
          bl: true
        },
        {
          className: 'dashujuzhichi',
          label: '资源配置管理',
          link: '/ResourceAllocation/CIlistData',
          bl: true
        },
        {
          className: 'dapingmu',
          label: 'AIBMS',
          link: '/Aibms',
          bl: true
        }
        // {
        //   imgsrc: require("static/img/header/7.png"),
        //   label: "智能运维",
        //   link: "/Intelligent0peration"
        // }
      ]
    }
  },
  computed: {
    userName() {
      let userName = localStorage.getItem('')
      return userName || this.name
    },
    imgSrc() {
      return this.currentPic || this.$store.state.userPhoto
    }
  },
  methods: {
    init: function () {
      if (typeof (WebSocket) === 'undefined') {
        alert('您的浏览器不支持socket')
      } else {
        // 实例化socket
        this.socket = new WebSocket(resourceManageWebsocketUrl)
        // 监听socket连接
        this.socket.onopen = this.open
        // 监听socket错误信息
        this.socket.onerror = this.error
        // 监听socket消息
        this.socket.onmessage = this.getMessage
      }
    },
    open: function (msg) {
      console.log('websocket已连接')
      // this.getMessage()
    },
    error: function () {
      console.log('连接错误')
    },
    getMessage: function (msg) {
      if (msg) {
        let result = JSON.parse(msg.data)
        for (let key in result) {
          if (result[key].indexOf('!') > -1) {
            this.$notify({
              title: '提示',
              message: `${key}${result[key]}`,
              duration: 5000,
              type: 'error'
            })
          } else {
            setTimeout(() => {
              this.$notify({
                title: '提示',
                message: `${key}克隆成功！IP: ${result[key]}`,
                duration: 5000,
                type: 'success'
              })
            }, 1000)
          }
        }
      }
    },
    send: function (params) {
      // this.socket.send(params)
    },
    close: function () {
      console.log('socket已经关闭')
    },
    togglebox: function () {
      this.boxshow = !this.boxshow
    },
    // 显示隐藏密码
    changeType(id) {
      if (id == 1) {
        this.eye1 = 'eye'
        this.registration_data1.pwdType =
          this.registration_data1.pwdType === 'password' ? 'text' : 'password'
        this.registration_data1.className =
          this.registration_data1.className == 'visible'
            ? 'chakan'
            : 'visible'
      } else if (id == 2) {
        this.eye2 = 'eye'
        this.registration_data2.pwdType =
          this.registration_data2.pwdType === 'password' ? 'text' : 'password'
        this.registration_data2.className =
          this.registration_data2.className == 'visible'
            ? 'chakan'
            : 'visible'
      } else {
        this.eye3 = 'eye'
        this.registration_data3.pwdType =
          this.registration_data3.pwdType === 'password' ? 'text' : 'password'
        this.registration_data3.className =
          this.registration_data3.className == 'visible'
            ? 'chakan'
            : 'visible'
      }
    },
    // 切换图像
    switchPic(url) {
      this.currentPic = url
    },
    // 获取用户信息
    getImformationData() {
      let id = localStorage.getItem('userId')
      //   console.log(this.$route);
      if (id) {
        axios.getImformation(id).then(res => {
          if (res && res.data.data.result) {
            this.personalData = res.data.data.result
            this.name = this.personalData.loginName
            this.currentPic = this.personalData.photo
          }
        })
      }
    },
    // 编辑个人资料弹框
    edit() {
      this.dialogFormVisible = true
      this.getImformationData()
    },
    // 确认修改个人资料
    changeImformationBtn(userId) {
      var name = this.personalData.name
      var email = this.personalData.email
      var loginName = this.personalData.loginName
      var mobile = this.personalData.mobile
      var sex = this.personalData.sex
      var photo = this.currentPic
      if (mobile == '') {
        this.$notify({
          title: '提示',
          message: '电话号码不能为空',
          type: 'warning'
        })
      } else if (email == '') {
        this.$notify({
          title: '提示',
          message: '邮箱不能为空',
          type: 'warning'
        })
      } else if (!/^1[34578]\d{9}$/.test(mobile)) {
        this.$notify({
          title: '提示',
          message: '请输入正确的手机号码',
          type: 'warning'
        })
      } else if (
        !/^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g.test(
          email
        )
      ) {
        this.$notify({
          title: '提示',
          message: '请输入正确的email',
          type: 'warning'
        })
      } else {
        let id = userId
        let JobDto = {
          userId: id,
          email: email,
          loginName: loginName,
          mobile: mobile,
          name: name,
          photo: photo,
          remarks: mobile,
          sex: sex
        }
        axios.userChangeInfo(JobDto).then(res => {
          if (res.data.code == 200) {
            localStorage.setItem('userPhoto', JobDto.photo)
            this.$store.dispatch(
              'changeUserPic',
              localStorage.getItem('userPhoto')
            )
            this.$notify({
              title: '提示',
              message: '修改成功',
              type: 'success'
            })
            //              location.reload();
            this.dialogFormVisible = false
            this.getImformationData()
          } else {
            this.$notify({
              title: '提示',
              message: res.data.message,
              type: 'warning'
            })
          }
        })
      }
      //  this.dialogFormVisible = false;
    },
    // 退出系统
    loginoutBtn() {
      axios.LogOut().then(res => {
        if (!res) {
          return false
        }

        if (res.data.code == 200) {
          localStorage.removeItem('userId')
          localStorage.removeItem('userName')
          localStorage.removeItem('userPhoto')
          localStorage.removeItem('token')
          this.$router.push('/login')
        } else {
          this.$notify({
            title: '提示',
            message: res.data.message,
            type: 'error'
          })
        }
      })
    },
    // 修改密码
    ChangePasswordBtn() {
      this.ChangePassword = true
    },
    // 确认修改密码
    changePasswordClick() {
      var oldPwd = this.password.oldPwd
      var newPwd = this.password.newPwd
      var rePwd = this.password.rePwd
      if (oldPwd == '' || newPwd == '' || rePwd == '') {
        this.$notify({
          title: '提示',
          message: '所有的都为必填',
          type: 'warning'
        })
      } else if (newPwd != rePwd) {
        this.$notify({
          title: '提示',
          message: '密码不一致',
          type: 'warning'
        })
      } else if (oldPwd == rePwd || oldPwd == newPwd) {
        this.$notify({
          title: '提示',
          message: '新密码不能和原密码一致',
          type: 'warning'
        })
      } else if (!/(^[a-zA-Z\d]{6,16})$/g.test(newPwd)) {
        this.$notify({
          title: '提示',
          message: '6~16位字符，可包含数字、字母',
          type: 'warning'
        })
      } else {
        let userDto = {
          oldPwd: oldPwd,
          newPwd: newPwd,
          rePwd: rePwd
        }
        axios.changePassword(userDto.oldPwd, userDto.newPwd, userDto.rePwd)
          .then(res => {
            if (res.data.code == 200) {
              this.$notify({
                title: '提示',
                message: '修改密码成功',
                type: 'success'
              })
              this.password.oldPwd = ''
              this.password.newPwd = ''
              this.password.rePwd = ''
              this.ChangePassword = false
            } else {
              this.$notify({
                title: '提示',
                message: res.data.message,
                type: 'warning'
              })
            }
          })
          .catch(error => {
            if (error) {
              this.$notify({
                title: '提示',
                message: '原密码不正确',
                type: 'warning'
              })
            }
          })
      }
    },
    // 取消修改密码
    ChangePasswordCancle() {
      this.password.oldPwd = ''
      this.password.newPwd = ''
      this.password.rePwd = ''
      this.ChangePassword = false
    },
    handleDialogClose() {
      this.dialogFormVisible = false
      this.ChangePassword = false
    },
    // 用户名下拉菜单选择事件
    handleCommand(command) {
      if (command == 'loginout') {
        localStorage.removeItem('ms_username')
        this.$router.push('/login')
      }
    },

    // 点击切换页面
    navClick(item, index) {
      this.currentIndex = index
      this.$router.push({
        path: item.link,
        query: {
          code: this.currentIndex
        }
      })
      // if (allowList.indexOf(item.link) === -1 && item.link !== '/') {
      //   this.$router.push({
      //     path: '/Unauthorized',
      //     query: {
      //       code: this.currentIndex,
      //       system: item.label
      //     }
      //   });
      // } else {
      //   this.$router.push({
      //     path: item.link,
      //     query: {
      //       code: this.currentIndex,
      //       mode: 1
      //     }
      //   });
      // }
    },
    // 侧边栏折叠
    collapseChage() {
      this.collapse = !this.collapse
      bus.$emit('collapse', this.collapse)
    }
  },
  // updated () {
  //   this.imgSrc=localStorage.getItem('userPhoto');
  //   this.getImformationData();
  // },
  created() {
    bus.$on('startWebSocket', () => {
      this.init()
    })
    // this.getImformationData();
    // console.log(this.$router.current);
  },
  mounted() {
    this.currentPic = localStorage.getItem('userPhoto')
    this.getImformationData()
    if (document.body.clientWidth < 1500) {
      this.collapseChage()
    }
  },
  watch: {
    $route(newValue, oldValue) {
      this.dialogFormVisible = false
      this.currentIndex = this.$route.query.code
      this.getImformationData()
    }
  }
}
</script>
<style scoped>
html,
body {
  width: 100%;
  height: 100%;
}
@media (max-width: 1100px) {
  .miantext {
    display: none !important;
  }
}
.headportraitbox {
  height: 80px;
  width: 100%;
  position: relative;
  margin-bottom: 10px;
}
.headportraitbox img {
  position: absolute;
  top: 0;
  left: 40%;
  height: 80px;
  width: 80px;
  border-radius: 100%;
  border: 1px solid #ccc;
}
.mask {
  position: absolute;
  top: 0;
  left: 40%;
  height: 80px;
  width: 80px;
  border-radius: 100%;
  background: rgba(101, 101, 101, 0.6);
  opacity: 0;
}
.kip {
  position: absolute;
  bottom: 10px;
  left: 55%;
  z-index: 9999;
  border-radius: 100%;
  border: 1px solid #ccc;
  border: none;
}
.headportraitbox img:hover .mask {
  opacity: 1;
}

.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 72px;
  font-size: 22px;
  color: #fff;
  background: #10101d99;
}
.logo {
  height: 72px;
  line-height: 68px;
}
.logo > img {
  height: 60px;
  vertical-align: middle;
}
.password-input {
  position: relative;
}
.password-input .password-icon {
  position: absolute;
  right: 10px;
}

.collapse-btn {
  float: left;
  width: 5%;
  text-align: center;
  cursor: pointer;
  line-height: 72px;
}
.collapse-btn:hover {
  background: #0066ff;
}

.header .logo {
  float: left;
  width: 12%;
  margin-left: 34px;
  line-height: 68px;
}

.header-right {
  float: right;
  width: 10%;
}

.header-user-con {
  display: flex;
  height: 72px;
  align-items: center;
}

.btn-fullscreen {
  transform: rotate(45deg);
  margin-right: 5px;
  font-size: 24px;
}

.btn-bell,
.btn-fullscreen {
  position: relative;
  width: 30px;
  height: 20px;
  text-align: center;
  border-radius: 15px;
  cursor: pointer;
}

.btn-bell-badge {
  position: absolute;
  right: 0;
  top: -2px;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: #f56c6c;
  color: #fff;
}

.btn-bell .el-icon-bell {
  color: #fff;
  height: 15px;
  width: 15px;
}

.user-name {
  margin-left: 10px;
}

.user-avator {
  margin-left: 15px;
}

.user-avator img {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.el-dropdown-link {
  color: #fff;
  cursor: pointer;
}

.el-dropdown-menu__item {
  text-align: center;
}

.mian_tab {
  list-style: none;
  display: inline-block;
  line-height: 72px;
  width: 73%;
  white-space: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
}

.mian_tab li {
  float: left;
  padding-right: 1.3rem;
  font-size: 1rem;

  cursor: pointer;
}

.active-nav {
  color: #0066ff;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-active {
  opacity: 0;
}
.imgBox {
  width: 100%;
  height: 60px;
}
.imgBox li {
  list-style: none;
  float: left;
  width: 45px;
  height: 45px;
  border-radius: 100%;
  margin-right: 6px;
}
.imgBox li img {
  border-radius: 100%;
  width: 45px;
  height: 45px;
}
.eye {
  position: absolute;
  right: 10px;
  top: 10px;
  width: 20px;
  height: 20px;
  float: right;
}
.el-form-item {
  position: relative;
}
/* .backcolor {
  position: absolute;
  height: 10px;
  width: 85%;
  background: #0066ff;
  bottom: 30%;
} */
</style>
