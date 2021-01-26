<template>
  <div class="bg aibms-bg aibms-user aibms-role">
    <div class="search-bar">
      <el-form :inline="true" :model="formInline" class="search-inline-form">
        <el-form-item>
          <el-input
            v-model="formInline.user"
            placeholder="用户名/真实姓名/手机号码"
          />
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="formInline.role"
            placeholder="请选择角色"
            multiple
          >
            <el-option
              :label="item.name"
              :value="item.roleId"
              v-for="(item, index) in systemAllRoleList"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="formInline.status" placeholder="请选择状态">
            <el-option label="正常" value="0" />
            <el-option label="禁用" value="1" />
            <el-option label="锁定" value="2" />
            <el-option label="注销" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="formInline.radio">在线</el-checkbox>
        </el-form-item>
        <el-form-item style="margin-left: 30px">
          <!-- <i class="el-icon-menu" style="font-size:30px" @click="formChange"></i>
          <i class="el-icon-tickets" style="font-size:30px" @click="tableChange"></i>-->
          <ul class="tablist">
            <li :class="{ active: shows == 1 }" @click="formChange">名片</li>
            <li :class="{ active: shows == 2 }" @click="tableChange">列表</li>
          </ul>
        </el-form-item>
      </el-form>
      <el-form :inline="true" class="search-inline-btn">
        <el-form-item>
          <el-button
            icon="el-icon-search"
            class="common-btn-style search-el-button"
            @click="onSearchBtn"
            >查找</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-plus"
            class="common-btn-style margin-left-btn"
            @click.prevent="addUserBtn"
            >新增</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <!-- 表单 -->
    <div v-if="listForm">
      <div v-if="haveListData">
        <el-row :gutter="20" class="card-main">
          <el-col
            :span="6"
            class="userContainer"
            v-for="(item, index) in userDataList"
            :key="index"
          >
            <div>
              <div class="information">
                <div class="imgbox cantainerheader">
                  <img :src="item.photo" alt />
                  <div class="spanbox">{{ item.name }}</div>
                </div>
                <div class="databox">
                  <ul class="ullist">
                    <li class="editicon">
                      <!-- <span style="margin-left:50px">{{item.name}}</span> -->
                      <el-dropdown class="user-name" trigger="click">
                        <span class="el-dropdown-link">
                          <i class="el-icon-edit-outline"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <div
                            @click="showDetail(item.userId)"
                            style="width: 100%; height: 100%"
                          >
                            <el-dropdown-item divided>
                              <span>查看详情</span>
                            </el-dropdown-item>
                          </div>
                          <div
                            @click="changeDate(item.userId)"
                            style="width: 100%; height: 100%"
                          >
                            <el-dropdown-item divided>
                              <span>修改信息</span>
                            </el-dropdown-item>
                          </div>
                          <div
                            @click="open2(item.userId)"
                            style="width: 100%; height: 100%"
                          >
                            <el-dropdown-item divided command="loginout">
                              <span>删除该用户</span>
                            </el-dropdown-item>
                          </div>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </li>
                    <li class="userli clear-fix">
                      <icon-svg
                        icon-class="dizhi"
                        class="user-icon white-svg-icon"
                      />
                      <!-- <img class="svg-img" src="/static/img/task/telphone.svg" alt="" /> -->
                      <span class="text-overflow user-content-font">{{
                        item.loginName
                      }}</span>
                    </li>
                    <li class="userli clear-fix">
                      <icon-svg
                        icon-class="telphone"
                        class="user-icon white-svg-icon"
                      />
                      <span class="text-overflow user-content-font">{{
                        item.telephone
                      }}</span>
                    </li>
                    <li class="userli clear-fix">
                      <icon-svg
                        icon-class="shouji"
                        class="user-icon white-svg-icon"
                      />
                      <span class="text-overflow user-content-font">{{
                        item.mobile
                      }}</span>
                    </li>
                  </ul>
                  <div>
                    <!-- <el-row :gutter="20">
                  <el-col :span="6"></el-col>
                    </el-row>-->
                  </div>
                </div>
              </div>
              <!-- <div class="project">
        <p>参与的项目：</p>
        <span>12345</span>
              </div>-->
              <div class="systempermissions">
                <div class="systype">系统权限:</div>
                <div>
                  <ul>
                    <li
                      v-for="(item, index) in item.sysMenuList"
                      :key="index"
                      class="limitbg"
                    >
                      {{ item.name }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div v-if="noHaveListData" style="color: #909399; margin-top: 20px">
        <p style="text-align: center">暂无数据</p>
      </div>
    </div>

    <!-- 表格 -->
    <div class="table-area">
      <el-table
        :data="userDataList"
        style="background: #fff"
        stripe
        :header-cell-style="{ background: '#f5f5f5' }"
        v-if="listTable"
      >
        <el-table-column prop="loginName" label="用户名" />
        <el-table-column prop="name" label="真实姓名" />
        <el-table-column prop="mobile" label="手机号码" />
        <el-table-column prop="position" label="职位" />
        <el-table-column prop="roleNames" label="角色" />
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <div class="task-btn-box">
              <span class="special" @click="showDetail(scope.row.userId)">
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="查看详情"
                  placement="top-start"
                >
                  <icon-svg icon-class="chakan" class="whiteness-icon-color" />
                </el-tooltip>
              </span>
              <span class="special" @click="changeDate(scope.row.userId)">
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="编辑"
                  placement="top-start"
                >
                  <icon-svg icon-class="bianji" class="whiteness-icon-color" />
                </el-tooltip>
              </span>
              <span class="special" @click="open2(scope.row.userId)">
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="删除"
                  placement="top-start"
                >
                  <icon-svg icon-class="shanchu" class="whiteness-icon-color" />
                </el-tooltip>
              </span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 查看详情弹框 -->
    <el-dialog
      center
      :visible="DetailDate"
      size="tiny"
      :before-close="handleDialogClose"
      width="570px"
    >
      <div class="headportraitbox">
        <img :src="detailData.photo" alt />
        <div class="state" style="float: right; margin-right: 10px">
          <span>状态：</span>
          <el-select
            v-model="detailData.userStatus"
            style="width: 100px"
            disabled="disabled"
            clearable
          >
            <el-option label="正常" value="0"></el-option>
            <el-option label="禁用" value="1"></el-option>
            <el-option label="锁定" value="2"></el-option>
            <el-option label="注销" value="3"></el-option>
          </el-select>
        </div>
      </div>
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="用户名：">
          <el-input disabled="disabled" v-model="detailData.loginName" />
        </el-form-item>
        <el-form-item label="登录密码：">
          <el-input
            disabled="disabled"
            v-model="detailData.password"
            type="password"
          />
        </el-form-item>
        <el-form-item label="真实姓名：">
          <el-input disabled="disabled" v-model="detailData.name" />
        </el-form-item>
        <el-form-item label="性别：">
          <el-radio label="0" v-model="detailData.sex" disabled="disabled"
            >男</el-radio
          >
          <el-radio label="1" v-model="detailData.sex" disabled="disabled"
            >女</el-radio
          >
        </el-form-item>
        <el-form-item label="分机号：">
          <el-input disabled="disabled" v-model="detailData.telephone" />
        </el-form-item>
        <el-form-item label="手机号码：">
          <el-input disabled="disabled" v-model="detailData.mobile" />
        </el-form-item>
        <el-form-item label="E-mail：">
          <el-input disabled="disabled" v-model="detailData.email" />
        </el-form-item>
        <el-form-item label="注册时间：">
          <el-input disabled="disabled" v-model="detailData.createDate" />
        </el-form-item>
        <el-form-item label=" 职位：">
          <el-input disabled="disabled" v-model="detailData.position" />
        </el-form-item>
        <el-form-item label="默认用户：" prop="defaultUser">
          <el-switch
            size="large"
            v-model="detailData.defaultUser"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
        </el-form-item>
        <el-form-item label="角色：">
          <span
            v-for="(item, index) in detailData.roleList"
            :key="index"
            class="roleSpan"
            >{{ item.name }}</span
          >
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 修改信息 -->
    <el-dialog
      center
      :visible="editInformation"
      size="tiny"
      :before-close="handleDialogClose3"
      width="570px"
    >
      <div class="headportraitbox">
        <img :src="editCurrentPic" alt />
        <i class="el-icon-edit kip" @click="togglebox"></i>
        <div class="state" style="float: right; margin-right: 10px">
          <span>状态：</span>
          <el-select
            v-model="changeData.userStatus"
            style="width: 100px"
            clearable
          >
            <el-option label="正常" value="0"></el-option>
            <el-option label="禁用" value="1"></el-option>
            <el-option label="锁定" value="2"></el-option>
            <el-option label="注销" value="3"></el-option>
          </el-select>
        </div>
      </div>
      <transition name="fade">
        <ul class="imgBox" v-if="boxshow">
          <li
            v-for="(item, index) in list"
            @click="switchPic(item.img)"
            :key="index"
          >
            <img :src="item.img" />
          </li>
        </ul>
      </transition>
      <el-form
        ref="form2"
        label-width="100px"
        :rules="rules2"
        :model="changeData"
      >
        <el-form-item label="用户名：" prop="loginName">
          <el-input v-model="changeData.loginName" disabled="disabled" />
        </el-form-item>
        <el-form-item
          label="登录密码："
          style="position: relative"
          prop="password"
        >
          <el-input
            v-model="changeData.password"
            :type="registration_data.pwdType"
          />
          <span @click="changeType()">
            <icon-svg
              :icon-class="registration_data.className"
              class="eye gray-icon-color"
            />
          </span>
        </el-form-item>
        <el-form-item label="真实姓名：" prop="name">
          <el-input v-model="changeData.name" />
        </el-form-item>
        <el-form-item label="性别：" prop="sex" style="text-align: left">
          <el-radio label="0" v-model="changeData.sex">男</el-radio>
          <el-radio label="1" v-model="changeData.sex">女</el-radio>
        </el-form-item>
        <el-form-item label="分机号：">
          <el-input v-model="changeData.telephone" />
        </el-form-item>
        <el-form-item label="手机号码：" prop="mobile">
          <el-input v-model="changeData.mobile" />
        </el-form-item>
        <el-form-item label="E-mail：" prop="email">
          <el-input v-model="changeData.email" />
        </el-form-item>
        <el-form-item label=" 职位：" prop="position">
          <el-input v-model="changeData.position" />
        </el-form-item>
        <el-form-item label="默认用户：" prop="defaultUser">
          <el-switch
            size="large"
            v-model="changeData.defaultUser"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
        </el-form-item>
        <el-form-item label="角色：" style="text-align: left">
          <el-checkbox-group v-model="roleIdList">
            <el-checkbox
              :label="item.roleId"
              v-for="item in allRoleList"
              :key="item.roleId"
              >{{ item.name }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div class="text-center">
        <el-button
          :loading="editLoading"
          type="primary"
          @click="changeUserClicke(changeData.userId)"
          >确认修改</el-button
        >
        <el-button class="nomal-button" @click="editInformation = false"
          >取消</el-button
        >
      </div>
    </el-dialog>
    <!--新增用户  -->
    <el-dialog
      center
      :visible="addUser"
      size="tiny"
      :before-close="handleDialogClose2"
      width="570px"
    >
      <div class="headportraitbox">
        <img :src="currentPic" alt />
        <i class="el-icon-edit kip" @click="togglebox"></i>
        <div class="state" style="float: right; margin-right: 10px">
          <span>状态：</span>
          <el-select v-model="addUserList.userStatus" style="width: 100px">
            <el-option label="正常" value="0"></el-option>
            <el-option label="禁用" value="1"></el-option>
            <el-option label="锁定" value="2"></el-option>
            <el-option label="注销" value="3"></el-option>
          </el-select>
        </div>
      </div>
      <transition name="fade">
        <ul class="imgBox" v-if="boxshow">
          <li
            v-for="(item, index) in list"
            @click="switchPic(item.img)"
            :key="index"
          >
            <img :src="item.img" />
          </li>
        </ul>
      </transition>
      <el-form
        ref="form"
        label-width="100px"
        :model="addUserList"
        :rules="rules"
      >
        <div>
          <el-form-item
            label="用户名："
            class="disinlne input"
            prop="loginName"
          >
            <el-input v-model="addUserList.loginName" />
          </el-form-item>
        </div>
        <div>
          <el-form-item
            label="登录密码："
            style="position: relative"
            class="disinlne input"
            prop="password"
          >
            <el-input
              v-model="addUserList.password"
              :type="registration_data.pwdType"
            />
            <span @click="changeType()">
              <icon-svg
                :icon-class="registration_data.className"
                class="eye gray-icon-color"
              />
            </span>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="真实姓名：" prop="name" class="disinlne input">
            <el-input v-model="addUserList.name" />
          </el-form-item>
        </div>
        <div>
          <el-form-item label="性别：" class="disinlne input" prop="sex">
            <el-radio v-model="addUserList.sex" label="0">男</el-radio>
            <el-radio v-model="addUserList.sex" label="1">女</el-radio>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="分机号：" class="disinlne input">
            <el-input v-model="addUserList.telephone" />
          </el-form-item>
        </div>
        <div>
          <el-form-item label="手机号码：" prop="mobile" class="disinlne input">
            <el-input v-model="addUserList.mobile" />
          </el-form-item>
        </div>
        <div>
          <el-form-item label="E-mail：" prop="email" class="disinlne input">
            <el-input v-model="addUserList.email" />
          </el-form-item>
        </div>
        <div>
          <el-form-item label=" 职位：" prop="position" class="disinlne input">
            <el-input v-model="addUserList.position" />
          </el-form-item>
        </div>
        <div>
          <el-form-item label="默认用户：" prop="defaultUser">
            <el-switch
              size="large"
              v-model="addUserList.defaultUser"
              :active-value="1"
              :inactive-value="0"
            ></el-switch>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="角色：" class="disinlne input">
            <el-checkbox-group v-model="roleIdList">
              <el-checkbox
                :label="item.roleId"
                v-for="(item, index) in roleDataList"
                :key="index"
                >{{ item.name }}</el-checkbox
              >
            </el-checkbox-group>
          </el-form-item>
        </div>
      </el-form>
      <div class="text-center">
        <el-button
          :loading="editLoading"
          type="primary"
          @click="addUserClicke()"
          >确认新增</el-button
        >
        <el-button class="nomal-button" @click="noAddUser">取消</el-button>
      </div>
    </el-dialog>
    <!--  -->
    <!-- 分页功能 -->
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currPage"
        :page-sizes="[12, 30, 50]"
        layout="prev, pager, next, sizes, total, jumper"
        :total="total"
        v-if="page"
      ></el-pagination>
    </div>
    <!-- 删除组件 -->
    <deleteDialog ref="deleteDialog" @confim-delete="confirmDelete" />
  </div>
</template>
<script>
import axios from '@/api'
import deleteDialog from '../common/deleteDialog'
export default {
  name: 'MoreOperation',
  components: {
    deleteDialog
  },
  data() {
    var validateloginName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名'))
      } else if (
        !/^(?![0-9]+$)|(?![a-zA-Z]+$)[0-9A-Za-z_]{6,18}$/.test(value)
      ) {
        callback(
          new Error(
            '用户名为6~18位字符，只能包含字母、数字及，首位不能为下划线'
          )
        )
      } else {
        callback()
      }
    }
    var validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (!/^[0-9A-Za-z]{6,16}$/.test(value)) {
        callback(new Error('密码为6~16位字符，可包含数字、字母（区分大小写）'))
      } else {
        callback()
      }
    }
    var validateMobile = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入电话号码'))
      } else if (!/^1[34578]\d{9}$/.test(value)) {
        callback(new Error('请输入正确的手机号码'))
      } else {
        callback()
      }
    }
    var validateEmail = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入邮箱'))
      } else if (
        !/^([0-9A-Za-z\-_\\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g.test(
          value
        )
      ) {
        callback(new Error('请输入正确的email'))
      } else {
        callback()
      }
    }
    return {
      shows: 1,
      haveListData: true,
      noHaveListData: false,
      current: 1,
      size: 12,
      roleNames: [], // 表格角色
      allRoleList: [],
      roleList: [],
      checkedRole: '',
      roleDataList: '',
      userDataList: '',
      detailData: {},
      total: 0, // 页数
      page: true,
      userStatus: '',
      systemAllRoleList: '',
      editCurrentPic: '', // edit
      rules: {
        sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
        name: [{ required: true, message: '请输入真实姓名', trigger: 'blur' }],
        password: [
          { required: true, validator: validatePassword, trigger: 'blur' }
        ],
        loginName: [
          { required: true, validator: validateloginName, trigger: 'blur' }
        ],
        mobile: [
          { required: true, validator: validateMobile, trigger: 'blur' }
        ],
        postion: [{ required: true, message: '请输入职位', trigger: 'blur' }],
        email: [{ required: true, validator: validateEmail, trigger: 'blur' }]
      },
      rules2: {
        sex: [{ message: '请选择性别', trigger: 'change' }],
        name: [{ message: '请输入真实姓名', trigger: 'blur' }],
        password: [{ validator: validatePassword, trigger: 'blur' }],
        mobile: [{ validator: validateMobile, trigger: 'blur' }],
        postion: [{ message: '请输入职位', trigger: 'blur' }],
        email: [{ validator: validateEmail, trigger: 'blur' }]
      },
      changeData: {
        sex: '',
        name: '',
        password: '',
        loginName: '',
        mobile: '',
        telephone: '',
        address: '',
        postion: '',
        status: ''
      },
      addUserList: {
        userStatus: '0',
        sex: '',
        name: '',
        password: '',
        loginName: '',
        telephone: '',
        mobile: '',
        address: '',
        position: '',
        email: ''
      },
      boxshow: false,
      addUser: false,
      DetailDate: false,
      editInformation: false,
      listForm: true,
      listTable: false,
      editLoading: false,
      passChanged: false, // 标识密码是否修改
      currenUser: '', // 当前编辑的用户ID
      value: '',
      formInline: {
        user: '',
        role: '',
        status: '',
        radio: false
      },
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
        }
      ],
      form: {
        name: '',
        address: '',
        date: ''
      },
      tableData: [],

      currPage: 1,
      registration_data: {
        pwdType: 'password',
        className: 'visible'
      },
      // 角色id列表
      roleIdList: [],
      currentPic: 'static/img/Fruit-1.png',
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
        },
        {
          img: 'static/img/Fruit-8.png',
          key: '8'
        }
      ],
      currentDeleteItemId: -1
    }
  },
  methods: {
    // 切换图像
    switchPic(url) {
      this.currentPic = url
      this.editCurrentPic = url
    },
    // 显示隐藏密码
    changeType() {
      this.registration_data.pwdType =
        this.registration_data.pwdType === 'password' ? 'text' : 'password'
      this.registration_data.className =
        this.registration_data.className === 'visible'
          ? 'chakan'
          : 'visible'
    },
    // 查询用户
    onSearchBtn() {
      // console.log(this.formInline.role, this.formInline.status);
      // alert(this.formInline.radio);
      var searchPage = 1
      this.getUserList(searchPage)
    },
    // 获取用户列表
    getUserList(searchPage) {
      if (searchPage) {
        this.current = searchPage
      }
      let JobDto = {
        online: this.formInline.radio,
        condition: this.formInline.user, /// 姓名、手机、登录名
        roleIds: this.formInline.role, // 角色ID，多个用“,”隔开
        userStatus: this.formInline.status, // 用户状态  0正常 1禁用 2锁定 3注销
        current: this.current, // 当前页
        size: this.size // 每页显示条数
      }
      axios.userList(JobDto).then(res => {
        this.roleNames = []
        if (res.data.code === 200) {
          this.userDataList = res.data.data.result.records

          if (this.userDataList.length === 0) {
            this.noHaveListData = true
            this.haveListData = false
            this.page = false
          } else {
            this.page = true
            this.noHaveListData = false
            this.haveListData = true
            console.log(this.userDataList)
            this.total = parseInt(res.data.data.result.total)
            if (this.total === 0) {
              this.page = false
            }
            for (var i in this.userDataList) {
              this.roleNames = []
              for (var j in this.userDataList[i].roleList) {
                this.roleNames += this.userDataList[i].roleList[j].name + ' '
              }
              this.userDataList[i].roleNames = this.roleNames
            }
          }
        } else {
          this.$notify({
            title: '提示',
            message: res.data.message,
            type: 'success'
          })
        }
      })
    },
    // 获取系统的角色
    getSystemRole() {
      axios.getSystemRole().then(res => {
        this.systemAllRoleList = res.data.data.result
        //          console.log( this.systemAllRoleList);
      })
    },
    // 获取当前登录人的角色
    getRoleData() {
      axios.getNowreginRole().then(res => {
        this.roleDataList = res.data.data.result
      })
    },
    // 新增用户
    addUserBtn() {
      this.addUser = true
      this.getRoleData()
    },
    // 确定新增用户
    addUserClicke() {
      this.$refs.form.validate(valid => {
        if (valid) {
          var userStatus = this.addUserList.userStatus
          var email = this.addUserList.email
          var loginName = this.addUserList.loginName
          var mobile = this.addUserList.mobile
          var telephone = this.addUserList.telephone
          var name = this.addUserList.name
          var password = this.addUserList.password
          var photo = this.currentPic
          var position = this.addUserList.position
          var sex = this.addUserList.sex
          var defaultUser = this.addUserList.defaultUser

          let JobDto = {
            email: email,
            loginName: loginName,
            mobile: mobile,
            telephone: telephone,
            name: name,
            password: password,
            photo: photo,
            position: position,
            sex: sex,
            userStatus: userStatus,
            defaultUser
          }
          axios.addUserData(this.roleIdList.join(','), JobDto)
            .then(res => {
              if (res.data.code === 200) {
                this.$notify({
                  title: '提示',
                  message: res.data.message,
                  type: 'success'
                })
                this.userStatus = ''
                this.addUser = false
                this.noAddUser()
                this.getUserList()
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
                return false
              }
            })
          // }
        }
      })
    },
    // 取消新增用户
    noAddUser() {
      this.boxshow = false
      this.currentPic = 'static/img/Fruit-1.png'
      this.addUserList.userStatus = '0'
      this.addUser = false
      this.addUserList.email = ''
      this.addUserList.loginName = ''
      this.addUserList.mobile = ''
      this.addUserList.name = ''
      this.addUserList.telephone = ''
      this.addUserList.password = ''
      this.addUserList.position = ''
      this.addUserList.sex = ''
      this.roleIdList = []
    },
    // 修改图像
    togglebox() {
      this.boxshow = !this.boxshow
    },
    // 点击表单查看详情
    showDetail(userId) {
      //   console.log(userId);
      let id = userId
      axios.userDetail(id).then(res => {
        this.detailData = res.data.data.result
        this.editCurrentPic = res.data.data.result.photo
        this.DetailDate = true
      })
    },
    // 点击表单删除该用户
    open2(userId) {
      this.currentDeleteItemId = userId
      this.$refs.deleteDialog.confirmDeleteDialogVisible = true
    },
    confirmDelete() {
      const id = this.currentDeleteItemId
      axios.userDelete(id).then(res => {
        if (res.data.success) {
          this.$notify.success({
            title: '提示',
            message: '删除成功'
          })
          this.getUserList()
        } else {
          this.$notify.error({
            title: '提示',
            message: res.data.message
          })
        }
        this.$refs.deleteDialog.confirmDeleteDialogVisible = false
      }).catch(() => {
        this.$refs.deleteDialog.confirmDeleteDialogVisible = false
      })
    },
    // 点击表单修改信息
    changeDate(userId) {
      this.allRoleList = []
      this.roleList = []
      this.editInformation = true
      let id = userId

      axios.userDetail(id).then(res => {
        this.changeData = res.data.data.result
        this.editCurrentPic = res.data.data.result.photo
        for (var i in this.changeData.allRoleList) {
          // 需要将角色的id传入数组
          this.allRoleList.push(this.changeData.allRoleList[i])
          // this.allRoleList.push(this.changeData.allRoleList[i].name);
        }
        this.roleIdList = []
        for (var j in this.changeData.roleList) {
          this.roleIdList.push(this.changeData.roleList[j].roleId)
        }
      })
    },
    // 点击修改用户信息确认按钮
    changeUserClicke(userId) {
      this.currenUser = userId
      if (!this.passChanged) {
        this.handleChangeUserData()
      } else {
        this.$refs.form2.validate(valid => {
          if (valid) {
            this.handleChangeUserData()
          }
        })
      }
    },
    // 处理修改数据并发送修改请求
    handleChangeUserData() {
      var userStatus = this.changeData.userStatus
      var email = this.changeData.email
      var loginName = this.changeData.loginName
      var mobile = this.changeData.mobile
      var telephone = this.changeData.telephone
      var name = this.changeData.name
      var password = this.changeData.password
      var photo = this.editCurrentPic
      var position = this.changeData.position
      var sex = this.changeData.sex
      var defaultUser = this.changeData.defaultUser
      let JobDto = {
        userId: this.currenUser,
        email: email,
        loginName: loginName,
        mobile: mobile,
        telephone: telephone,
        name: name,
        password: password,
        photo: photo,
        position: position,
        sex: sex,
        userStatus: userStatus,
        defaultUser
      }
      // 判断修改的用户是不是当前用户,如果是当前用户，则将他的头像图片再localstorage重置
      if (JobDto.userId === localStorage.getItem('userId')) {
        localStorage.setItem('userPhoto', JobDto.photo)
        this.$store.dispatch(
          'changeUserPic',
          localStorage.getItem('userPhoto')
        )
      }
      axios.userChange(this.currenUser, this.roleIdList.join(','), JobDto).then(
        res => {
          if (res.data.code === 200) {
            this.$notify({
              title: '提示',
              message: '修改成功',
              type: 'success'
            })
            this.editInformation = false
            this.getUserList()
          } else {
            this.$notify({
              title: '提示',
              message: res.data.message,
              type: 'success'
            })
          }
        }
      )
    },
    // 去换表单表格
    formChange(index) {
      this.shows = 1
      this.listForm = true
      this.listTable = false
    },
    handleDialogClose() {
      this.DetailDate = false
      this.editInformation = false
      this.addUser = false
    },
    handleDialogClose2() {
      this.$refs.form.resetFields()
      this.DetailDate = false
      this.editInformation = false
      this.addUser = false
    },
    handleDialogClose3() {
      this.$refs.form2.resetFields()
      this.DetailDate = false
      this.editInformation = false
      this.addUser = false
    },
    tableChange(index) {
      this.shows = 2
      this.listForm = false
      this.listTable = true
    },

    handleSizeChange(val) {
      this.size = val
      this.getUserList()
    },
    // 分页
    handleCurrentChange(val, page) {
      this.current = val
      this.size = 12
      this.getUserList()
    }
  },
  mounted() {
    this.getUserList()
    this.getRoleData()
    this.getSystemRole()
  },
  created() {
    // var lett = this;
    // document.onkeydown = function(evt) {
    //   evt = evt ? evt : window.event ? window.event : "";
    //   var keyCode = evt.keyCode
    //     ? evt.keyCode
    //     : evt.which
    //     ? evt.which
    //     : evt.charCode;
    //   if (keyCode == 13) {
    //     lett.getUserList();
    //   }
    // };
  },
  watch: {
    $route(newValue, oldValue) {
      this.addUser = false
      this.DetailDate = false
      this.editInformation = false
    },
    'changeData.password': {
      handler(val, old) {
        if (val !== old && old !== '') {
          this.passChanged = true
        } else {
          this.passChanged = false
        }
      },
      deep: true
    }
  },
  computed: {}
}
</script>
<style scoped lang="scss">
.bg {
  margin: 10px;
  border-radius: 5px;
  background: #fff;
  .table-area {
    padding: 0 20px;
    .el-table {
      border: 1px solid #ccc;
    }
  }

  .tablist {
    width: 135px;
    height: 32px;
    text-align: center;
    color: #0066ff;
    li {
      list-style: none;
      float: left;
      font-size: 16px;
      width: 40px;
      height: 32px;
      line-height: 32px;
      border: 1px solid #0066ff;
      padding-left: 10px;
      padding-right: 10px;
      margin-top: 3px;
      cursor: pointer;
      /* background-color: #fff; */
      /* color:#0066ff !important; */
    }
  }
  .operationLog {
    height: 60px;
    line-height: 60px;
    padding-left: 20px;
    background: #cdefe7;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    font-size: 24px;
  }
  .el-form {
    margin: 0 40px 0 20px;
    text-align: left;
  }

  .table {
    width: 90%;
    margin: 10px auto;
  }

  .block {
    text-align: right;
    margin-right: 20px;
  }
  .card-main {
    padding: 0 20px;
  }
  .userContainer > div {
    font-size: 14px;
    border: 1px solid #eee;
    margin: 0 0 20px 0;
    border-radius: 4px;
    box-shadow: 0 5px 10px 0 #eee;

    .information {
      border-bottom: 1px solid #d3d3d3;
      height: 126px;
      position: relative;

      .imgbox {
        float: left;
        width: 60px;
        text-align: center;
        padding: 20px;
        padding-top: 20px;

        img {
          height: 52px;
          width: 52px;
          border-radius: 100%;
        }

        .spanbox {
          margin-top: 10px;
          word-wrap: break-word;
          word-break: normal;
        }
      }

      .databox {
        float: left;
        padding: 20px 0;

        .ullist {
          width: 100%;
          height: 100%;
          /* position: relative; */
          li {
            list-style: none;
            margin-top: 3px;

            .usericon {
              width: 19px;
              height: 21px;
              /* width: 23px;
              height: 23px; */
              background-size: cover;
              margin-right: 10px;
              vertical-align: middle;
            }
          }
          .editicon {
            position: absolute;
            top: 10px;
            right: 20px;

            .user-name {
              float: right;
              /* margin-right: 5px; */
              margin-top: -6px;
            }
          }

          .userli {
            position: relative;
            /* width: 190px; */
            height: 35px;
            overflow: hidden;
            /* padding-right: -10px; */
            margin-right: -15px;
            span,
            img {
              display: block;
              float: left;
            }
          }
        }

        span {
          /* position: absolute;
          top: 50%; */
          vertical-align: middle;
          margin-left: 15px;
          margin-bottom: 10px;
        }
      }

      .cantainerheader {
        position: relative;
      }
    }

    .systempermissions {
      height: 80px;
      // padding: 0 10px 10px;
      padding: 0px 5px 15px 5px;
      // float: left;
      /* margin-right: 5px; */
      // margin-top: -6px;
      .systype {
        margin-left: 4px;
        margin-top: 6px;
      }

      ul {
        li {
          float: left;
          list-style: none;
          height: 30px;
          line-height: 30px;
          margin: 4px;
          color: #a3a3a3;
          background-color: #e9e9e9;
          border-radius: 5px;
          padding-left: 5px;
          padding-right: 5px;
        }
      }
    }
  }

  .headportraitbox {
    height: 80px;
    line-height: 80px;
    width: 100%;
    position: relative;
    margin-bottom: 20px;
    img {
      position: absolute;
      top: 0;
      left: 40%;
      height: 80px;
      width: 80px;
      border-radius: 100%;
      border: 1px solid #ccc;
    }

    .kip {
      position: absolute;
      bottom: 10px;
      left: 52%;
      z-index: 9999;
      border-radius: 100%;
      border: 1px solid #ccc;
      border: none;
    }

    .disinlne {
      display: inline-block;
    }
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
    height: 60px;
    li {
      list-style: none;
      float: left;
      width: 55px;
      height: 55px;
      border-radius: 100%;
      margin-right: 8px;
      margin-bottom: 10px;

      img {
        border-radius: 100%;
        width: 55px;
        height: 55px;
      }
    }
  }

  .eye {
    position: absolute;
    right: 10px;
    top: 10px;
    width: 20px;
    height: 20px;
    float: right;
  }
  .roleSpan {
    display: inline-block;
    padding-right: 10px;
  }

  .el-checkbox {
    display: block !important;
    margin-left: 0 !important;
  }
  .online {
    display: inline-block;
    height: 10px;
    width: 10px;
    border-radius: 100%;
    background: rgb(51, 218, 193);
    position: absolute;
    bottom: 30%;
    right: 30%;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  .active {
    border: 1px solid #00a8e8;
    /* color: #0066ff; */
    color: #fff !important;
    background-color: #00a8e8;
    /* box-shadow: 1px 1px #aaa; */
  }

  .task-btn-box {
    /* padding: 10px; */
    text-align: center;
    span {
      display: inline-block;
      background: #fff;
      border: 1px solid #0066ff;
      line-height: 24px;
      padding: 0 4px;
      border-radius: 5px;
      color: #0066ff;
      font-size: 14px;
      margin-right: 12px;
      cursor: pointer;
      &.special {
        /* border: 1px solid #777777; */
        cursor: pointer;
      }
      &.special:hover {
        background: #0066ff;
        /* color:#fff!important; */
      }
      img {
        height: 12px;
        /* margin-top: 2px; */
        padding: 5px 8px 6px 8px;
        margin-bottom: -6px;
      }
    }
  }
}
// .el-form {
//   text-align: left;
// }

// .box {
//   margin: 20px;
// }

// .project {
//   border-bottom: 1px solid #ccc;
//   padding: 0px 5px 15px 5px;
//   padding: 10px;
//   span {
//     margin: 10px;
//   }
// }

// .changeimg img {
//   width: 50px;
//   height: 50px;
//   border-radius: 100%;
//   border: 1px solid #dddddd;
//   margin-bottom: 10px;
// }

// .spanx {
//   color: red;
// }
</style>
<style scoped lang="scss">
.search-bar {
  display: flex;
  justify-content: space-between;
}
.search-inline-form {
  flex: 1;
}
.search-inline-btn {
  margin: 0;
  width: 230px;
  vertical-align: middle;
}
.search-inline-btn {
  .search-el-button {
    border: 1px solid #fff;
    color: #fff;
    &:hover {
      border: 1px solid #01aef1;
      color: #01aef1;
      background-color: #041c25;
    }
    &:focus {
      border: 1px solid #01aef1;
      color: #01aef1;
      background-color: #041c25;
    }
    &:active {
      background-color: #041c25;
      border: 1px solid #01aef1;
      color: #01aef1;
    }
  }
}
.text-center {
  text-align: center;
}
</style>
