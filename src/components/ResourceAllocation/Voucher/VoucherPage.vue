<template>
  <div class="container non-border voucherPage refreshContainer aibms-color-bg">
    <!-- <p class="mark-icon">
      {{status === 'create' ? "新增凭证" : status === 'edit' ? "编辑凭证" : "查看凭证"}}
    </p>-->
    <div class="item-block-title" @click="voucherController = !voucherController">
      <div class="item-block-title-mark"></div>
      <span
        class="item-block-title-font"
      >{{status === 'create' ? "新增凭证" : status === 'edit' ? "编辑凭证" : "查看凭证"}}</span>
      <i
        class="icons el-icon-arrow-right"
        :style="{transform: voucherController ? 'rotate(90deg)' : 'rotate(0)'}"
      ></i>
    </div>
    <el-form
      ref="form"
      :model="form"
      label-width="100px"
      :rules="rules"
      class="item-block-content white-color"
      :style="{height: voucherController ? 'auto' : 0}"
    >
      <el-row>
        <el-col :span="14">
          <el-form-item label="凭证类型: " prop="voucherType">
            <el-select
              v-model="form.voucherType"
              placeholder="选择凭证类型"
              clearable
              :disabled="status === 'watch'"
              style="width: 632px"
            >
              <el-option
                :label="item.name"
                :value="item.menuId"
                v-for="(item,index) in sshList"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="14">
          <el-form-item label="名称: " prop="name">
            <el-input
              v-model="form.name"
              autocomplete="off"
              :disabled="status === 'watch'"
              maxlength="20"
              style="width: 632px"
              @input="inputFun1(form.name)"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :offset="1" :span="5" style="text-align: left;padding-top: 8px;">
          <span>{{menuNameLength1}}</span>/
          <span :class="menuNameLength1>20?'colorRed':''">{{totalNum1}}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="14">
          <el-form-item label="用户名: " prop="userName">
            <el-input
              :disabled="status === 'watch'"
              v-model="form.userName"
              autocomplete="off"
              maxlength="20"
              style="width: 632px"
              @input="inputFun2(form.userName)"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :offset="1" :span="5" style="text-align: left;padding-top: 8px;">
          <span>{{menuNameLength2}}</span>/
          <span :class="menuNameLength2>30?'colorRed':''">{{totalNum2}}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="14">
          <el-form-item label="密码:" prop="password">
            <el-input
              :disabled="status === 'watch'"
              v-model="form.password"
              :type="registration_data.pwdType"
              @input="inputFun4(form.password)"
              style="width: 632px"
              class="password-input"
            ></el-input>
            <!-- <img :src="registration_data.src" @click="changeType()" class="seeimg"> -->
            <span class="password-icon" @click="changeType()">
              <icon-svg :icon-class="registration_data.className" class="eye gray-icon-color" />
            </span>
          </el-form-item>
        </el-col>
        <el-col :offset="1" :span="5" style="text-align: left;padding-top: 8px;">
          <span>{{menuNameLength4}}</span>/
          <span :class="menuNameLength4>30?'colorRed':''">{{totalNum4}}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="14">
          <el-form-item label="描述: ">
            <el-input
              v-model="form.remarks"
              autocomplete="off"
              @input="inputFun3(form.remarks)"
              :disabled="status === 'watch'"
              style="width: 632px"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :offset="1" :span="5" style="text-align: left;padding-top: 8px;">
          <span>{{menuNameLength3}}</span>/
          <span :class="menuNameLength3>100?'colorRed':''">{{totalNum3}}</span>
        </el-col>
      </el-row>
    </el-form>
    <div class="footer">
      <el-button
        v-if="status === 'create'"
        size="medium"
        type="primary"
        @click="addVoucher"
        class="save-btn-margin-special"
      >确认</el-button>
      <el-button
        v-if="status === 'edit'"
        size="medium"
        type="primary"
        @click="addVoucher('2')"
        class="save-btn-margin-special"
      >保存</el-button>
      <el-button class="nomal-button" size="medium" @click="cancel">取消</el-button>
    </div>
  </div>
</template>
<script>
import axios from '@/api';
export default {
  name: 'VoucherPage',
  data () {
    var validateName = (rule, value, callback) => {
      if (value === '' || !value) {
        callback(new Error('名称不能为空'))
      } else if (
        value &&
        ((value.length > 0 && value.length < 2) || value.length > 20)
      ) {
        callback(new Error('名称的长度为2到20!'))
      } else {
        callback()
      }
    }
    var validatesshid2 = (rule, value, callback) => {
      if (value === '' || !value) {
        callback(new Error('请选择凭证类型!'))
      } else {
        callback()
      }
    }
    return {
      form: {
        voucherType: '',
        name: '',
        userName: '',
        password: '',
        remarks: ''
      },
      menuNameLength1: 0,
      menuNameLength2: 0,
      menuNameLength3: 0,
      menuNameLength4: 0,
      totalNum1: 20,
      totalNum2: 20,
      totalNum3: 100,
      totalNum4: 30,
      voucherController: true, // 控制展开或收缩
      status: this.$route.params.status,
      registration_data: {
        pwdType: 'password',
        className: 'visible'
      },
      sshList: [
        { name: 'SSH凭证', menuId: '0' },
        { name: '应用管理凭证', menuId: '1' },
        { name: '代码库凭证', menuId: '2' },
        { name: '数据库凭证', menuId: '3' }
      ],
      rules: {
        name: [{ required: true, validator: validateName, trigger: 'blur' }],
        voucherType: [
          { required: true, validator: validatesshid2, trigger: 'change' }
        ],
        userName: [
          { required: true, message: '用户名不能为空!', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空！', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    if (this.$route.query.id) {
      this.ViewVoucher(this.$route.query.id)
    }
  },
  methods: {
    // 新增或编辑凭证
    addVoucher (num) {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (num && num === '2') {
            axios.updateVoucher(this.form, this.$route.query.id).then(res => {
              if (res.data.success) {
                this.$notify({
                  type: 'success',
                  message: '修改成功!'
                })
                this.cancel()
              } else {
                this.$notify({
                  type: 'warning',
                  message: res.data.message
                })
              }
            })
          } else {
            axios.addVoucher(this.form).then(res => {
              if (res.data.success) {
                this.$notify({
                  type: 'success',
                  message: '添加成功!'
                })
                this.cancel()
              } else {
                this.$notify({
                  type: 'warning',
                  message: res.data.message
                })
              }
            })
          }
        }
      })
    },
    // 名称长度
    inputFun1 (value) {
      if (value) {
        this.menuNameLength1 = value.length
      } else {
        this.menuNameLength1 = 0
      }
    },
    // 用户名长度
    inputFun2 (value) {
      if (value) {
        this.menuNameLength2 = value.length
      } else {
        this.menuNameLength2 = 0
      }
    },
    // 描述长度
    inputFun3 (value) {
      if (value) {
        this.menuNameLength3 = value.length
      } else {
        this.menuNameLength3 = 0
      }
    },
    // 密码长度
    inputFun4 (value) {
      if (value) {
        this.menuNameLength4 = value.length
      } else {
        this.menuNameLength4 = 0
      }
    },
    // 查看按钮切换
    changeType () {
      this.registration_data.pwdType =
        this.registration_data.pwdType === 'password' ? 'text' : 'password'
      this.registration_data.className =
        this.registration_data.className === 'visible'
          ? 'chakan'
          : 'visible'
    },
    // 取消按钮
    cancel () {
      this.$router.push({
        path: '/ResourceAllocation/Configuration',
        query: {
          code: 2
        }
      })
    },
    // 查看详情
    ViewVoucher (id) {
      axios.seeVoucher(id).then(res => {
        if (res.data.success) {
          this.form = res.data.data.result
          this.inputFun1(this.form.name)
          this.inputFun2(this.form.userName)
          this.inputFun3(this.form.remarks)
          this.inputFun4(this.form.password)
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
.voucherPage {
  margin: 10px;
  padding-top: 10px!important;
  .item-block-title {
    margin-bottom: 20px;
    .icons {
      color: #00A8E8!important;
    }
  }
  .colorRed {
    color: #f00;
  }
  .password-icon {
    position: absolute;
    right: 10px;
    top: 2px;
  }
  .txtcenter {
    display: flex;
    justify-content: space-around;
    flex-direction: row;
    align-items: center;
  }
  .disinlne {
    display: inline-block;
  }
  .seeimg {
    position: absolute;
    right: 10px;
    top: 12px;
    width: 20px;
    height: 16px;
    float: right;
  }
  .footer {
    padding: 0 20px 20px;
    text-align: center;
  }
}
</style>
