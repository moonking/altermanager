<template>
  <div class="add-source">
    <div class="content">
      <h3>基本信息</h3>
      <div class="form-area">
        <el-form
          :model="form"
          :label-position="labelPosition"
          label-width="120px"
          :rules="rules"
          ref="form"
        >
          <el-form-item label="名称：" prop="name">
            <el-input
              :disabled="$route.query.status === 'read'"
              v-model="form.name"
              clearable
              style="width: 632px"
              placeholder="请输入名称"
            />
          </el-form-item>
          <el-form-item label="来源：" prop="source">
            <el-select
              :disabled="$route.query.status === 'read'"
              v-model="form.source"
              clearable
              style="width: 632px"
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
              :disabled="$route.query.status === 'read'"
              v-model="form.webAddress"
              style="width: 632px"
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
              :disabled="$route.query.status === 'read'"
              v-model="form.token"
              clearable
              style="width: 632px"
              placeholder="请输入token"
            />
          </el-form-item>
        </el-form>
      </div>
      <h3>
        接口信息
        <span @click="handleCheck" v-if="!loadingStatus">
          <icon-svg icon-class="jiekou_jiance" class="check-interface" />检测
        </span>
      </h3>
      <div class="form-area">
        <el-form
          :model="InterfaceForm"
          ref="InterfaceForm"
          label-width="120px"
          id="api-items"
          class="interface-form"
        >
          <el-form-item
            v-for="(domain, index) in InterfaceForm.domains"
            :label="'接口信息:'"
            :key="domain.key"
            :prop="'domains.' + index + '.url'"
          >
            <el-input
              :disabled="$route.query.status === 'read'"
              v-model="domain.url"
              @focus="clearIcon"
              class="interface-input"
            >
              <div slot="prepend">
                <el-select
                  :disabled="$route.query.status === 'read'"
                  v-model="domain.method"
                  placeholder="请求方式"
                  style="width: 160px; margin-right: 16px"
                >
                  <el-option
                    :label="method.label"
                    :value="method.value"
                    v-for="method in methodList"
                    :key="method.value"
                  ></el-option>
                  <!-- <el-option label="订单号" value="2"></el-option>
                  <el-option label="用户电话" value="3"></el-option> -->
                </el-select>
                <el-select
                  :disabled="$route.query.status === 'read'"
                  v-model="domain.type"
                  placeholder="接口类型"
                  style="width: 240px"
                >
                  <el-option
                    :label="type.label"
                    :value="type.value"
                    v-for="type in apiTypes"
                    :key="type.value"
                  ></el-option>
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
              v-else
              :class="{
                'el-icon-circle-check': domain.checkStatus === 'success',
                'el-icon-circle-close': domain.checkStatus === 'failed',
              }"
              class="status-icon"
            />
            <!-- 操作icon -->
            <span v-if="!loadingStatus">
              <i class="el-icon-circle-plus-outline add-icon-btn" @click="addDomain" />
              <i
                class="el-icon-remove-outline add-icon-btn"
                @click.prevent="removeDomain(domain)"
              />
            </span>
            <i
              v-if="rightOrError"
              class="el-icon-warning-outline add-icon-btn"
              @click="getInterFaceDetail(domain.url)"
            />
          </el-form-item>
        </el-form>
      </div>
      <div class="footer-area">
        <el-button
          type="primary"
          class="save-btn common-btn"
          v-if="$route.query.status !== 'read'"
          @click.stop="handleSave"
          >保存</el-button
        >
        <el-button @click="handleCancel" class="cancel-button">取消</el-button>
      </div>
      <!-- 删除提示 -->
      <el-dialog
        center
        title="删除提示"
        :visible.sync="confirmDeleteDialogVisible"
        width="500px"
        class="common-dialog"
      >
        <div style="text-align: center">
          <i class="el-icon-warning" /> 确认删除？
        </div>
        <div slot="footer" class="dialog-footer common-dailog-footer">
          <el-button size="medium" class="cancel-button" @click="confirmDeleteDialogVisible = false"
            >取消</el-button
          >
          <el-button size="medium" class="save-btn common-btn" type="primary" @click="confirmDelete"
            >确定</el-button
          >
        </div>
      </el-dialog>
    </div>
    <!-- 接口信息diolog -->
    <el-dialog
      title="检测详情"
      :visible.sync="centerDialogVisible"
      width="50%"
      center
      class="dialog-detail"
    >
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
        value: 'ci'
      },
      {
        label: '交易追踪trans获取',
        value: 'trans'
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
      }
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
      },
	  {
	    id: 4,
	    value: 'ARMS',
	    label: 'ARMS'
	  },
	  {
	    id: 5,
	    value: 'Splunk',
	    label: 'Splunk'
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
        url: '',
        checkStatus: ''
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
      ]
      // token: [
      //   { required: true, message: '请输入token', trigger: 'blur' }
      // ]
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
      if (this.$route.query.status === 'read') {
        this.$route.meta.title = '查看来源'
      } else {
        this.$route.meta.title = '编辑来源'
      }
      //  查询监控来源详情
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
      if (this.$route.query.status === 'read') return
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
    // 清除error标记
    clearIcon() {
      if (this.rightOrError) {
        this.rightOrError = false
      }
    },
    // 关闭删除dialog
    confirmDelete() {
      this.InterfaceForm.domains.splice(this.deleteId, 1)
      this.confirmDeleteDialogVisible = false
    },
    // 新增接口信息
    addDomain() {
      if (this.$route.query.status === 'read') return
      this.rightOrError = false
      this.InterfaceForm.domains.push({
        key: Date.now()
      });
    },
    // 接口检测
    handleCheck() {
      // const params = {
      //   platform: this.form.source,
      //   address: this.form.webAddress,
      //   token: this.form.token,
      //   urls: this.InterfaceForm.domains
      // }
      const domains = this.InterfaceForm.domains
      const urlList = domains.map(domain => domain.url)
      if (urlList.indexOf('') !== -1) {
        this.$message({
          showClose: true,
          message: '检测接口信息不能有空值',
          type: 'warning'
        })
      } else if (new Set(urlList).size !== urlList.length) {
        this.$message({
          showClose: true,
          message: '检测接口信息存在重复信息',
          type: 'warning'
        })
      } else {
        this.rightOrError = false
        this.loadingStatus = true
        // axios.checkInterFace(params).then(res => {
        //   this.loadingStatus = false
        //   const data = res.data.data
        //   if (res.data.success) {
        //     this.rightOrError = true
        //     this.statusList = res.data.data
        //     data.forEach(item => {
        //       domains.forEach(domain => {
        //         if (domain.url === item.key) {
        //           domain.checkStatus = item.success ? 'success' : 'failed'
        //         }
        //       })
        //     })
        //   } else {
        //     this.$notify({
        //       title: '提示',
        //       type: 'error',
        //       message: res.data.message
        //     })
        //   }
        // }).catch(err => {
        //   this.loadingStatus = false
        //   this.rightOrError = true
        //   this.$notify({
        //     title: '提示',
        //     type: 'error',
        //     message: err
        //   })
        // })
        const apis = []
        this.InterfaceForm.domains.forEach((domain, index) => {
          const param = {
            platform: this.form.source,
            address: this.form.webAddress,
            token: this.form.token,
            urls: [this.InterfaceForm.domains[index]]
          }
          apis.push(this.checkUrl(param))
        })
        Promise.all(apis).then(resList => {
          this.loadingStatus = false
          this.rightOrError = true
          resList.forEach(res => {
            this.handleResponse(res)
          })
        }).catch(err => {
          this.loadingStatus = false
          this.rightOrError = true
          this.$notify({
            title: '提示',
            type: 'error',
            message: err
          })
        })
      }
    },
    // 处理返回值，添加状态
    handleResponse(res) {
      const domains = this.InterfaceForm.domains
      const data = res.data.data
      const list = this.statusList
      this.statusList = list.concat(data)
      if (res.data.code === 200) {
        data.forEach(item => {
          domains.forEach(domain => {
            if (domain.url === item.key) {
              domain.checkStatus = item.success ? 'success' : 'failed'
            }
          })
        })
      }
    },
    // 返回url检测结果
    checkUrl(params) {
      return axios.checkInterFace(params)
    },
    // 过滤url
    handleUrls(urls) {
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
    // 添加或修改监控来源
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
              code: 2
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
    getInterFaceDetail(url) {
      this.centerDialogVisible = true
      const index = this.statusList.map(item => item.key).indexOf(url)
      this.interfaceTxt = index !== -1 ? this.statusList[index].text : ''
    },
    // 取消，返回上级路由
    handleCancel() {
      this.handleLeave()
      // let objArr = Object.values(this.form)
      // let foundValues = objArr.find(el => el != '')
      // if (foundValues || this.InterfaceForm.domains[0].value) {
      //   const answer = window.confirm(
      //     '页面相关数据还未保存，是否离开当前页面!'
      //   )
      //   if (answer) {
      //     this.handleLeave()
      //   }
      // } else {
      //   this.handleLeave()
      // }
    }
  },
  mounted() {
    const el = document.getElementById('api-items')
    const that = this
    // 排序组件调用
    const sortable = new Sortable.create(el, {
      onUpdate: function (event) {
        let newIndex = event.newIndex,
          oldIndex = event.oldIndex,
          $li = el.children[newIndex],

          $oldLi = el.children[oldIndex]

        // 先删除移动的节点

        el.removeChild($li)

        // 再插入移动的节点到原有节点，还原了移动的操作

        if (newIndex > oldIndex) {
          el.insertBefore($li, $oldLi)
        } else {
          el.insertBefore($li, $oldLi.nextSibling)
        }

        // 更新items数组

        let item = that.InterfaceForm.domains.splice(oldIndex, 1)

        that.InterfaceForm.domains.splice(newIndex, 0, item[0])

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
    // background-color: rgba(4, 28, 37, 0.3);
    padding: 10px;
    overflow: visible;
    .form-area {
      margin: 10px;
      .interface-form {
        position: relative;
        .interface-input {
          width: 680px;
          margin-right: 10px;
          & /deep/ .el-input__inner {
            padding-right: 45px !important;
          }
        }
        .status-icon {
          position: absolute;
          left: 600px;
          top: 50%;
          transform: translateY(-50%);
        }
        i {
          // margin-top: 10px;
          // color: #00E5FF;
          // font-size: 46px;
          // vertical-align: middle;
          // cursor: pointer;
          // font-weight: 100;

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
      font-size: 28px;
      font-weight: 500;
      height: 40px;
      line-height: 40px;
      margin-left: 10px;
      color: #BFF3FF;
      span {
        margin-left: 5px;
        font-size: 24px;
        cursor: pointer;
        color: #BFF3FF;
        font-weight: normal;
        .check-interface {
          width: 1.3em;
          height: 1.3em;
          font-size: 24px;
          vertical-align: middle;
          margin-right: 2px;
        }
      }
      &:before {
        content: '';
        position: absolute;
        z-index: 1;
        left: -30px;
        top: 10px;
        width: 18px;
        border-radius: 9px;
        height: 18px;
        background: #00E5FF;
      }
    }
    .footer-area {
      margin-top: 90px;
      text-align: center;
      font-size: 0;
      // .save-btn{
      //   width: 148px;
      //   height: 68px;
      // }
      // .cancel-button {
      //   margin-left: 0;
      //   width: 148px;
      //   height: 68px;
      //   color: #0092AB;
      //   font-size: 24px;
      //   background: rgba(2, 32, 55, 0.5);
      //   border-radius: 5px;
      //   border: 2px solid #436382;
      //   &:hover {
      //     border: 1px solid #436382;
      //     color: #fff;
      //     background: transparent;
      //   }
      //   &:focus {
      //     color: #fff;
      //     background: transparent;
      //   }
      //   &:active {
      //     border: 1px solid #436382;
      //     background: transparent;
      //     color: #fff;
      //   }
      // }
    }
  }
}
.dialog-detail /deep/ .el-dialog__body {
  height: 500px;
  overflow-y: auto;
}
.interface-form /deep/ .el-input-group__prepend {
  background-color: rgba(4, 28, 37, 0.4) !important;
}
</style>
