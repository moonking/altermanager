<template>
    <div class="layout aibms-color-bg non-border non-shadow white-color">
        <div class="title">
            基本信息
        </div>
        <div class="form">
            <el-form :model="jenkins" :rules="ruleForm"  ref="jenkins" label-width="100px">
                <el-form-item label="名称" prop="jenkinsName">
                    <el-input v-model="jenkins.jenkinsName"  placeholder="请输入名称" style="width: 632px"></el-input>
                </el-form-item>
                <el-form-item label="URL" prop="baseurl">
                    <el-input v-model="jenkins.baseurl" placeholder="请输入URL" style="width: 632px"></el-input>
                </el-form-item>
                 <el-form-item label="账号" prop="name">
                    <el-input v-model="jenkins.name" placeholder="请输入账号" style="width: 632px"></el-input>
                </el-form-item>
                 <el-form-item label="密码" prop="password">
                    <el-input v-model="jenkins.password" placeholder="请输入密码" style="width: 632px"></el-input>
                </el-form-item>

            </el-form>
            <div class="btn">
                <el-button type="primary btn-save"  @click='submit("jenkins")'>保存</el-button>
                <el-button class="nomal-button"  @click='cancel()'>取消</el-button>
            </div>
        </div>

    </div>
</template>

<script>
import axios from '@/api';
export default {
  name: 'AddJenkinsConfig',

  data () {
    // 校验URL
    let validateUrl = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入URL'))
      } else {
        let urlReg = '^((https|http|ftp|rtsp|mms)?://)' +
                    '?(([0-9a-z_!~*\'().&=+$%-]+: )?[0-9a-z_!~*\'().&=+$%-]+@)?' + // ftp的user@
                    '(([0-9]{1,3}.){3}[0-9]{1,3}' + // IP形式的URL- 199.194.52.184
                    '|' + // 允许IP和DOMAIN（域名）
                    '([0-9a-z_!~*\'()-]+.)*' + // 域名- www.
                    '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].' + // 二级域名
                    '[a-z]{2,6})' + // first level domain- .com or .museum
                    '(:[0-9]{1,4})?' + // 端口- :80
                    '((/?)|' + // a slash isn't required if there is no file name
                    '(/[0-9a-z_!~*\'().;?:@&=+$,%#-]+)+/?)$'
        var re = new RegExp(urlReg)
        if (re.test(value)) {
          callback()
        } else {
          callback(new Error('请输入正确的URL'))
        }
      }
    }
    return {
      ruleForm: {
        jenkinsName: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 2, max: 40, message: '名称长度不能小于2或大于40' }
        ],
        baseurl: [
          { required: true, message: '请输入URL', trigger: 'blur' },
          { validator: validateUrl, trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 2, max: 40, message: '账号长度不能小于2或大于40' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 2, max: 40, message: '密码长度不能小于6或大于40' }
        ]
      },
      jenkins: {
        jenkinsName: '',
        baseurl: '',
        name: '',
        password: ''
      },
      jenkinsId: ''
    }
  },
  created () {
    let id = this.$route.params.id
    if (id) {
      this.jenkinsId = id
      this._JenkinsDetail(this.jenkinsId)
    }
  },
  methods: {
    //   获取Jenkins详情
    _JenkinsDetail (jenkinsId) {
      axios.JenkinsDetail(jenkinsId).then(result => {
        if (result.data.code === 200) {
          this.jenkins = result.data.data
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
          message: '查询出错，请稍后重试',
          duration: 2000,
          type: 'error'
        })
      })
    },
    //   提交
    submit (ruleForm) {
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          if (this.jenkinsId) {
            this._updateJenkins()
          } else {
            this._addJenkins()
          }
        } else {
          return false
        }
      })
    },
    _updateJenkins () {
      axios.updateJenkins(this.jenkins).then(result => {
        if (result.data.code === 200) {
          this.$notify({
            title: '提示',
            message: '修改可能会影响调用该Jenkins的流水线，请谨慎操作',
            duration: 2000,
            type: 'warning'
          })
          axios.detectionJenkins(this.jenkinsId).then(res => {
            if (res.data.code === 200) {
              console.log(res.data.data.result)
            }
          })
          setTimeout(() => {
            this.$notify({
              title: '提示',
              message: '编辑成功',
              duration: 3000,
              type: 'success'
            })
            this.cancel()
          }, 1000)
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
          message: '查询出错，请稍后重试',
          duration: 2000,
          type: 'error'
        })
      })
    },
    _addJenkins () {
      axios.addJenkins(this.jenkins).then(result => {
        if (result.data.code === 200) {
          this.$notify({
            title: '提示',
            message: '添加成功',
            duration: 2000,
            type: 'success'
          })
          this.cancel()
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
          message: '查询出错，请稍后重试',
          duration: 2000,
          type: 'error'
        })
      })
    },
    cancel () {
      this.$router.push({
        path: '/AutomatedRelease/jenkinsConfig',
        query: {
          code: 3
        }
      })
    }
  }
}
</script>

<style lang="scss">
    .layout {
        background: #fff;
        padding: 20px 0;
        margin: 10px;
        box-shadow: 0 3px 4px #ccc;
        .title{
            position: relative;
            padding-left: 40px;
        }
        .title::before {
            content: "";
            width: 10px;
            height: 30px;
            background: #00A8E8;
            border-radius: 5px;
            position: absolute;
            left: 0;
            top: -5px;
        }

        .form  {
            width: 40%;
            padding: 20px 100px;
        }
        .btn {
            text-align: center;
            padding-left: 100px;
            padding: 90px 0;
            .btn-save {
                margin-right: 200px;
            }
        }
        .item-special {
           width: 25%;
        }
        .item-icon {
            margin: 0 8px;
        }
    }
</style>
