<template>
  <div class="add-source">
    <div class="content">
      <h3>基本信息</h3>
      <div class="form-area">
        <el-form
          :model="form"
          :label-position="labelPosition"
          label-width="100px"
          :rules="rules"
          ref="form"
        >
          <el-form-item label="名称：" prop="name">
            <el-input
              v-model="form.name"
              clearable
              style="width: 632px;"
              placeholder="请输入名称"
            />
          </el-form-item>
          <el-form-item label="来源：" prop="source">
            <el-select
              v-model="form.source"
              clearable
              style="width: 632px;"
              placeholder="请选择来源"
            >
              <el-option
                v-for="item in source"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="地址：" prop="webAddress">
            <el-input
              v-model="form.webAddress"
              style="width: 632px;"
              clearable
              placeholder="请输入地址"
            />
          </el-form-item>
          <!-- <el-form-item>
            <el-radio v-model="userRadio" label="1">账号密码</el-radio>
            <el-radio v-model="userRadio" label="2">token</el-radio>
          </el-form-item>
          <el-form-item label="账号：" prop="account" v-if="userRadio==='1'">
            <el-input
              v-model="form.account"
              clearable
              style="width: 632px;"
              maxlength="20"
              placeholder="请输入账号"
            />
          </el-form-item>
          <el-form-item label="密码：" prop="password" v-if="userRadio==='1'">
            <el-input
              v-model="form.token"
              clearable
              style="width: 632px;"
              show-password
              maxlength="20"
              placeholder="请输入密码"
            />
          </el-form-item> -->
          <el-form-item label="token：" prop="token">
            <el-input
              v-model="form.token"
              clearable
              style="width: 632px;"
              maxlength="20"
              placeholder="请输入token"
            />
          </el-form-item>
        </el-form>
      </div>
      <h3>
        接口信息
        <span @click="handleCheck">
          <icon-svg icon-class="jiekou_jiance" class="check-interface" />检测
        </span>
      </h3>
      <div class="form-area">
        <el-form
          :model="InterfaceForm"
          ref="InterfaceForm"
          label-width="100px"
          id="api-items"
          class="interface-form"
        >
          <el-form-item
            v-for="(domain, index) in InterfaceForm.domains"
            :label="'接口信息:'"
            :key="domain.key"
            :prop="'domains.' + index + '.url'"
          >
            <el-input v-model="domain.url" @focus="clearIcon" class="interface-input" >
              <div  slot="prepend" >
                <el-select v-model="domain.method" placeholder="请求方式" style="width: 130px;margin-right: 16px">
                  <el-option :label="method.label" :value="method.value" v-for="method in methodList" :key="method.value"></el-option>
                  <!-- <el-option label="订单号" value="2"></el-option>
                  <el-option label="用户电话" value="3"></el-option> -->
                </el-select>
                <el-select v-model="domain.type" placeholder="接口类型" style="width: 130px">
                  <el-option :label="type.label" :value="type.value" v-for="type in apiTypes" :key="type.value"></el-option>
                  <!-- <el-option label="订单号" value="2"></el-option>
                  <el-option label="用户电话" value="3"></el-option> -->
                </el-select>
              </div>
              <!-- <el-select v-model="select" slot="append" placeholder="请求方式" style="width: 130px">
                <el-option label="餐厅名" value="1"></el-option>
                <el-option label="订单号" value="2"></el-option>
                <el-option label="用户电话" value="3"></el-option>
              </el-select> -->
            </el-input>
            <!-- 状态icon -->
            <i v-if="loadingStatus" class="status-icon el-icon-loading" />
            <i
              v-if="rightOrError"
              :class="[
              statusList[index].success ?
              'el-icon-circle-check'
              :'el-icon-circle-close'
              ]"
              class="status-icon"
            />
            <!-- 操作icon -->
            <i class="el-icon-circle-plus-outline" @click="addDomain" />
            <i class="el-icon-remove-outline" @click.prevent="removeDomain(domain)" />
            <i
              v-if="rightOrError"
              class="el-icon-warning-outline white-color"
              @click="getInterFaceDetail(index)"
            />
          </el-form-item>
        </el-form>
      </div>
      <div class="footer-area">
        <el-button type="primary" @click.stop="handleSave" style="margin-right: 100px">保存</el-button>
        <el-button @click="handleCancel" class="cancel-button">取消</el-button>
      </div>
      <!-- 删除提示 -->
      <el-dialog center title="删除提示" :visible.sync="confirmDeleteDialogVisible" width="25%">
        <div style="text-align: center">
          <i class="el-icon-warning" /> 确认删除？
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button size="medium" @click="confirmDeleteDialogVisible = false">取消</el-button>
          <el-button size="medium" type="primary" @click="confirmDelete">确定</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 接口信息diolog -->
    <el-dialog title="检测详情" :visible.sync="centerDialogVisible" width="30%" center>
      <span>{{ interfaceTxt }}</span>
    </el-dialog>
  </div>
</template>

<script>
import axios from '@/api';
import Sortable from 'sortablejs';
export default {
  data: () => ({
    apiTypes: [
      {
        label: 'ci项获取',
        value: 'ci',
      },
      {
        label: '交易追踪trans获取',
        value: 'trans',
      },
      {
        label: '告警信息获取',
        value: 'alert'
      }
    ],
    methodList: [
      {
        label: 'GET',
        value: 'GET'
      },
      {
        label: 'POST',
        value: 'POST'
      },
      {
        label: 'PUT',
        value: 'PUT'
      },
      {
        label: 'DELETE',
        value: 'DELETE'
      },
    ],
    labelPosition: 'right',
    source: [
      {
        id: 1,
        value: 'BPC',
        label: 'BPC'
      }, {
        id: 2,
        value: 'Dynatrace',
        label: 'Dynatrace'
      }, {
        id: 3,
        value: 'Prometheus',
        label: 'Prometheus'
      }
    ],
    form: {
      name: '',
      source: '',
      webAddress: '',
      account: '',
      password: '',
      token: ''
    },
    InterfaceForm: {
      domains: [{
        method: '',
        type: '',
        url: ''
      }]
    },
    rules: {
      webAddress: [
        { required: true, message: '请输入地址', trigger: 'blur' }
      ],
      account: [
        { required: true, message: '请输入账号', trigger: 'blur' },
        { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
      ],
      source: [
        { required: true, message: '请选择来源', trigger: 'change' }
      ],
      name: [
        { required: true, message: '请输入名称', trigger: 'blur' }
      ],
      token:  [
        { required: true, message: '请输入token', trigger: 'blur' }
      ]
    },
    confirmDeleteDialogVisible: false,
    deleteId: -1,
    interfaceList: [],
    editId: 0,
    interfaceTxt: '',
    centerDialogVisible: false,
    statusList: [],
    loadingStatus: false,
    rightOrError: false,
    testForm: {
      domains: [{
        value: ''
      }]
    },
    userRadio: '1'
  }),
  created() {
    if (this.$route.query.id) {
      this.editId = this.$route.query.id
      this.$route.meta.title = '编辑来源'
      axios.getMonitorDetail(this.editId).then(res => {
        if (res.data.success) {
          const sourceDetail = res.data.data
          const {
            address,
            name,
            token,
            platform,
            urls
          } = sourceDetail
          this.form.name = name
          this.form.source = platform
          this.form.webAddress = address
          // this.form.account = username
          // this.userRadio = username == ''? '2' : '1'
          // 判断是token还是用户密码
          // if (this.userRadio == '1') {
          //   this.form.account = username
          //   this.form.password = password
          // } else if (this.userRadio == '2') {
          //   this.form.token = password
          // }
          this.form.token = token
          this.InterfaceForm.domains = urls
          // if (urls && urls.length) {
          //   this.InterfaceForm.domains = []
          //   this.InterfaceForm.domains = urls.map(value => ({ value: value }))
          // }
        } else {
          this.$notify({
            title: '提示',
            type: 'error',
            message: res.data.message
          })
        }
      })
    } else {
      this.$route.meta.title = '新增来源'
    }
  },
  methods: {
    // 删除接口信息
    removeDomain(item) {
      const index = this.InterfaceForm.domains.indexOf(item)
      if (this.InterfaceForm.domains.length > 1 && index !== -1) {
        if (item.value) {
          this.confirmDeleteDialogVisible = true
          this.deleteId = index
        } else {
          this.InterfaceForm.domains.splice(index, 1)
        }
      }
    },
    clearIcon() {
      if (this.rightOrError) {
        this.rightOrError = false
      }
    },
    confirmDelete() {
      this.InterfaceForm.domains.splice(this.deleteId, 1)
      this.confirmDeleteDialogVisible = false
    },
    // 新增接口信息
    addDomain() {
      this.rightOrError = false
      this.InterfaceForm.domains.push({
        key: Date.now()
      });
    },
    // 接口检测
    handleCheck() {
      const params = {
        platform: this.form.source,
        address: this.form.webAddress,
        username: this.form.account,
        password: this.userRadio=='1'? this.form.password : this.form.token,
        urls: this.InterfaceForm.domains.map(item => item.url)
      }
      if (params.urls.indexOf('') != -1) {
        this.$message({
          showClose: true,
          message: '检测接口信息不能有空值',
          type: 'warning'
        })
      } else if (new Set(params.urls).size !== params.urls.length) {
        this.$message({
          showClose: true,
          message: '检测接口信息存在重复信息',
          type: 'warning'
        })
      } else {
        this.rightOrError = false
        this.loadingStatus = true
        axios.checkInterFace(params).then(res => {
          this.loadingStatus = false
          if (res.data.success) {
            this.rightOrError = true
            this.statusList = res.data.data
          } else {
            this.$notify({
              title: '提示',
              type: 'error',
              message: res.data.message
            })
          }
        })
      }
    },
    handleUrls (urls) {
      const result = []
      urls.forEach((url, index) => {
        result.push({
          method: url.method,
          url: url.url,
          type: url.type,
          sort: index
        })
      })
      return result
    },
    addOrEdit(methods) {
      const urls = this.handleUrls(this.InterfaceForm.domains)
      console.log(urls)
      const params = {
        id: this.editId,
        name: this.form.name,
        platform: this.form.source,
        address: this.form.webAddress,
        token: this.form.token,
        // username: this.form.account,
        // password: this.userRadio=='1'? this.form.password : this.form.token,
        urls
        // urls: [...new Set(this.InterfaceForm.domains.map(item => item.value))]
      }
      methods(params).then(res => {
        if (res.data.success) {
          this.$notify.success({
            title: '提示',
            message: res.data.message
          })
          this.$router.push({
            path: '/Aibms/BuinessConfiguration/MonitoringSource',
            query: {
              code: 8
            }
          })
        } else {
          this.$notify({
            title: '提示',
            type: 'error',
            message: res.data.message
          })
        }
      })
    },
    // 保存
    handleSave() {
      if (this.editId) {
        this.addOrEdit(axios.editMonitor)
      } else {
        this.addOrEdit(axios.addMonitor)
      }
    },
    // 离开页面
    handleLeave() {
      this.$refs['form'].resetFields()
      this.$refs['InterfaceForm'].resetFields()
      this.$router.back()
    },
    // 获取接口详情
    getInterFaceDetail(index) {
      this.centerDialogVisible = true
      this.interfaceTxt = this.statusList[index].text
    },
    // 取消，返回上级路由
    handleCancel() {
      let objArr = Object.values(this.form)
      let foundValues = objArr.find(el => el != '')
      if (foundValues || this.InterfaceForm.domains[0].value) {
        const answer = window.confirm(
          '页面相关数据还未保存，是否离开当前页面!'
        )
        if (answer) {
          this.handleLeave()
        }
      } else {
        this.handleLeave()
      }
    }
  },
  mounted () {
    const el = document.getElementById('api-items')
    const that = this
    const sortable = new Sortable.create(el, {
      onUpdate:function(event){
        let newIndex = event.newIndex,
          oldIndex = event.oldIndex,
          $li = el.children[newIndex],

          $oldLi = el.children[oldIndex]

        // 先删除移动的节点

        el.removeChild($li) 

        // 再插入移动的节点到原有节点，还原了移动的操作

        if(newIndex > oldIndex) {

          el.insertBefore($li,$oldLi)

        } else {

          el.insertBefore($li,$oldLi.nextSibling)

        }

        // 更新items数组

        let item = that.InterfaceForm.domains.splice(oldIndex,1)

        that.InterfaceForm.domains.splice(newIndex,0,item[0])

        // 下一个tick就会走patch更新

      }
    })
  }
}
</script>
<style lang="scss" scoped>
.add-source {
  padding: 10px;
  .content {
    width: 100%;
    background-color: rgba(4, 28, 37, 0.3);
    padding: 10px;
    overflow: visible;
    .form-area {
      margin: 10px;
      .interface-form {
        position: relative;
        .interface-input {
          width: 632px;
          margin-right: 10px;
          & /deep/ .el-input__inner {
            padding-right: 45px !important;
          }
        }
        .status-icon {
          position: absolute;
          left: 245px;
          top: 50%;
          transform: translateY(-50%);
        }
        i {
          color: #fff;
          font-size: 24px;
          vertical-align: middle;
          cursor: pointer;
        }
        .el-icon-loading {
          top: 25%;
          color: #666;
        }
        .el-icon-circle-check {
          color: #49bc71;
        }
        .el-icon-circle-close {
          color: #f56c6c;
        }
      }
    }
    h3 {
      position: relative;
      font-size: 16px;
      font-weight: 500;
      height: 24px;
      line-height: 24px;
      margin-left: 10px;
      color: #fff;
      span {
        margin-left: 5px;
        font-size: 14px;
        cursor: pointer;
        .check-interface {
          width: 1.3em;
          height: 1.3em;
          vertical-align: middle;
          margin-right: 2px;
        }
      }
      &:before {
        content: "";
        position: absolute;
        z-index: 1;
        left: -20px;
        top: -3px;
        width: 8px;
        border-radius: 4px;
        height: 30px;
        background: #00A8E8;
      }
    }
    .footer-area {
      text-align: center;
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
  }
}
</style>
<style>
.el-input-group__prepend {
  background-color: rgba(4, 28, 37, .4)!important;
}
</style>
