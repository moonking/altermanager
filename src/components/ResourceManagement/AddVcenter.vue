<template>
    <div class="layout">
        <div class="form">
            <el-form :model="vcenter" :rules="ruleForm" ref="vcenter" label-width="100px" class="demo-ruleForm">
                <el-form-item label="IP" prop="ipAddress">
                    <el-input v-model="vcenter.ipAddress" placeholder="请输入IP地址"></el-input>
                </el-form-item>
                <el-form-item label="端口" prop="portNum">
                    <el-input v-model="vcenter.portNum"  placeholder="请输入端口号"></el-input>
                </el-form-item>
                <el-form-item label="用户名" prop="userName">
                    <el-input v-model="vcenter.userName" placeholder="请输入用户名"></el-input>
                </el-form-item>
                 <el-form-item label="密码" prop="password">
                    <el-input type='password' v-model="vcenter.password" placeholder="请输入密码"></el-input>
                </el-form-item>
                 <div class="btn">
                    <el-button type="primary btn-save"  @click='submit("vcenter")'>保存</el-button>
                    <el-button @click='cancel()'>取消</el-button>
                </div>
            </el-form>
        </div>

    </div>
</template>

<script>
import axios from '@/api';
export default {
  data () {
    // 校验IP地址
    let validateIP = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入IP地址'))
      } else {
        let ipReg = /^(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/g
        if (ipReg.test(value)) {
          callback()
        } else {
          callback(new Error('请输入正确的IP地址'))
        }
      }
    }
    // 校验端口号
    let validatePort = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入端口号'))
      } else {
        let portReg = /^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{4}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/
        if (portReg.test(value)) {
          callback()
        } else {
          callback(new Error('请输入正确的端口号'))
        }
      }
    }

    return {
      // 表单校验规则
      ruleForm: {
        ipAddress: [
          { required: true, message: '请输入IP地址', trigger: 'blur' },
          { validator: validateIP, trigger: 'blur' }
        ],
        portNum: [
          { required: true, message: '请输入端口号', trigger: 'blur' },
          { validator: validatePort, trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 40, message: '用户名长度不能小于2或大于40' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 2, max: 40, message: '密码长度不能小于2或大于40' }
        ]
      },
      // 要添加的vcenter
      vcenter: {
        ipAddress: '', // IP地址
        portNum: '', // 端口号
        userName: '', // 用户名
        password: '' // 密码
      },
      // 编辑时，当前vcenterid
      vcenterId: ''
    }
  },
  created () {
    let vcenterId = this.$route.query.vcenterId
    if (vcenterId) {
      // 获取当前vcenter详情
      this.vcenterId = vcenterId
      this._vcenterDetail()
    }
  },
  methods: {
    // 修改vcenter信息
    _updateVcenter () {
      axios.updateVcenter(this.vcenter).then(result => {
        if (result.data.code === 200) {
          this.$notify({
            title: '提示',
            message: '更新成功',
            duration: 2000,
            type: 'success'
          })
          this.$router.push({
            path: '/ResourceManagement/VcenterManage',
            query: {
              code: 5
            }
          })
        } else {
          this.$notify({
            title: '提示',
            message: result.data.message,
            duration: 2000,
            type: 'error'
          })
        }
      }).catch(e => {
        this.$notify({
          title: '提示',
          message: '查询详情出错',
          duration: 2000,
          type: 'error'
        })
      })
    },
    // 获取编辑的vcenter详情
    _vcenterDetail () {
      axios.vcenterDetail(this.vcenterId).then(result => {
        if (result.data.code === 200) {
          this.vcenter = result.data.data
        } else {
          this.$notify({
            title: '提示',
            message: result.data.message,
            duration: 2000,
            type: 'error'
          })
        }
      }).catch(e => {
        this.$notify({
          title: '提示',
          message: '查询详情出错',
          duration: 2000,
          type: 'error'
        })
      })
    },
    // 发送添加用户请求
    _addVcenter () {
      axios.addVcenter(this.vcenter).then(result => {
        if (result.data.code === 200) {
          this.$notify({
            title: '提示',
            message: 'vcenter添加成功',
            duration: 2000,
            type: 'success'
          })
          this.$router.push({
            path: '/ResourceManagement/VcenterManage',
            query: {
              code: 5
            }
          })
        } else {
          this.$notify({
            title: '提示',
            message: result.data.message,
            duration: 2000,
            type: 'error'
          })
        }
      }).catch(e => {
        this.$notify({
          title: '提示',
          message: '网络出错，请稍后重试！',
          duration: 2000,
          type: 'error'
        })
      })
    },
    // 新增vcenter
    submit (ruleForm) {
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          if (this.vcenterId) { this._updateVcenter() } else { this._addVcenter() }
        } else {
          return false
        }
      })
    },
    // 取消 跳转vcenter管理页面
    cancel () {
      this.$router.push({
        path: '/ResourceManagement/vcenterManage',
        query: {
          code: 5
        }
      })
    }
  }
}
</script>

<style lang="scss">
    .layout {
        background: #fff;
        padding: 20px 10px;
        margin: 10px;
        .form  {
            width: 40%;
            padding: 20px 0;
        }
        .btn {
            text-align: center;
            padding-left: 100px;
            padding: 30px 0 20px;
            .btn-save {
                margin-right: 200px;
            }
        }
    }
</style>
