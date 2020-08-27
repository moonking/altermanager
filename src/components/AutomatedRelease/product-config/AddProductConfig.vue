<template>
  <div class="layout aibms-color-bg non-border non-shadow white-color">
    <div class="title">基本信息</div>
    <div class="form">
      <el-form :model="product" :rules="ruleForm" ref="product" label-width="100px">
        <el-form-item label="名称" prop="name">
          <el-input
            v-model="product.name"
            type="text"
            :minlength="2"
            :maxlength="32"
            show-word-limit
            placeholder="请输入名称, 2到32个字符"
            style="width: 632px"
          ></el-input>
        </el-form-item>
        <el-form-item label="URL" prop="baseurl">
          <el-input
            v-model="product.baseurl"
            placeholder="请输入URL"
            style="width: 632px"></el-input>
        </el-form-item>
        <el-form-item label="账号" prop="accountNumber">
          <el-input
            v-model="product.accountNumber"
            placeholder="请输入账号，4到32个字符"
            auto-complete="new-password"
            :minlength="4"
            :maxlength="32"
            show-word-limit
            style="width: 632px"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            v-model="product.password"
            auto-complete="new-password"
            placeholder="请输入密码，6到26个字符"
            :minlength="6"
            :maxlength="26"
            show-password
            style="width: 632px"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="btn">
        <el-button type="primary btn-save" @click="submit('product')">保存</el-button>
        <el-button @click="cancel" class="nomal-button">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/api';
export default {
  name: 'AddProductConfig',

  data () {
    // 校验URL
    let validateUrl = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入URL'))
      } else {
        let urlReg =
          '^((https|http|ftp|rtsp|mms)?://)' +
          "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" + // ftp的user@
          '(([0-9]{1,3}.){3}[0-9]{1,3}' + // IP形式的URL- 199.194.52.184
          '|' + // 允许IP和DOMAIN（域名）
          "([0-9a-z_!~*'()-]+.)*" + // 域名- www.
          '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].' + // 二级域名
          '[a-z]{2,6})' + // first level domain- .com or .museum
          '(:[0-9]{1,4})?' + // 端口- :80
          '((/?)|' + // a slash isn't required if there is no file name
          "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$"
        var re = new RegExp(urlReg)
        if (re.test(value)) {
          if (this.urlList.indexOf(value) === -1) {
            callback()
          } else {
            callback(new Error('URL重复！'))
          }
        } else {
          callback(new Error('请输入正确的URL'))
        }
      }
    }
    return {
      ruleForm: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 2, max: 32, message: '名称长度不能小于2或大于32' }
        ],
        baseurl: [
          { required: true, message: '请输入URL', trigger: 'blur' },
          { validator: validateUrl, trigger: 'blur' }
        ],
        accountNumber: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 4, max: 32, message: '账号长度不能小于4或大于32' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 26, message: '密码长度不能小于6或大于26' }
        ]
      },
      product: {
        productName: '',
        baseurl: '',
        name: '',
        password: ''
      },
      productId: '',
      urlList: [],
      /**
       * 组件当前状态
       * add  新增
       * edit 编辑
       */
      status: 'add'
    }
  },
  created () {
    let id = this.$route.params.id
    if (id) {
      this.status = 'edit'
      this.productId = id
      this.productDetail(this.productId)
    } else {
      this.status = 'add'
    }
    this.getUrlList()
  },
  methods: {
    //   获取Jenkins详情
    productDetail (productId) {
      axios.queryProductConfig(productId)
        .then(result => {
          if (result.data.code === 200) {
            this.product = result.data.data
          } else {
            this.$notify({
              title: '提示',
              message: result.data.message,
              duration: 2000,
              type: 'error'
            })
          }
        })
        .catch(e => {
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
      // 更新url列表，防止用户添加已存在的url
      axios.productConfigList({
        name: '',
        accountNumber: '',
        detectionStatus: '',
        current: 0,
        size: 10000
      }).then(res => {
        if (res.data.code === 200) {
          const records = res.data.data.records
          if (this.status === 'edit') {
            this.urlList = []
            records.forEach(config => {
              console.log(config.productId)
              console.log(this.productId)
              if (this.productId !== config.productId) {
                this.urlList.push(config.baseurl)
              }
            })
          } else {
            records.forEach(config => {
              this.urlList.push(config.baseurl)
            })
          }
        }
        // 重新校验表单
        this.$refs[ruleForm].validate(valid => {
          if (valid) {
            if (this.productId) {
              this.updateProductConfig()
            } else {
              this.addProductConfig()
            }
          } else {
            return false
          }
        })
      })
    },
    updateProductConfig () {
      axios.updateProductConfig(this.product)
        .then(result => {
          if (result.data.code === 200) {
            axios.detectionJenkins(this.productId).then(res => {
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
        })
        .catch(e => {
          this.$notify({
            title: '提示',
            message: '查询出错，请稍后重试',
            duration: 2000,
            type: 'error'
          })
        })
    },
    addProductConfig () {
      axios.addProductConfig(this.product)
        .then(result => {
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
        })
        .catch(e => {
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
        path: '/AutomatedRelease/productConfig',
        query: {
          code: 3
        }
      })
    },
    getUrlList () {
      axios.productConfigList({
        name: '',
        accountNumber: '',
        detectionStatus: '',
        current: 0,
        size: 10000
      }).then(res => {
        if (res.data.code === 200) {
          const records = res.data.data.records
          this.urlList = []
          if (this.status === 'edit') {
            records.forEach(config => {
              console.log(config.productId)
              console.log(this.productId)
              if (this.productId !== config.productId) {
                this.urlList.push(config.baseurl)
              }
            })
          } else {
            records.forEach(config => {
              this.urlList.push(config.baseurl)
            })
          }
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
  .title {
    position: relative;
    padding-left: 40px;
  }
  .title::before {
    content: '';
    width: 10px;
    height: 30px;
    background: #00A8E8;
    border-radius: 5px;
    position: absolute;
    left: 0;
    top: -5px;
  }

  .form {
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
