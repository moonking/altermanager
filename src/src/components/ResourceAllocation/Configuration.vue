<template>
  <div class="bg">
    <el-form :inline="true" class="demo-form-inline" style="padding:40px 0 5px 26px">
      <el-form-item>
        <el-input v-model="Name" placeholder="名称" style="width:100%" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="sshid" placeholder="选择凭证类型" clearable>
          <el-option
            :label="item.name"
            :value="item.menuId"
            v-for="(item,index) in sshList"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="item-right">
        <!-- <el-button icon="el-icon-close" class="common-btn-style" @click="delVoucherLsit">批量删除</el-button> -->
        <el-button
          class="cm-form-btn"
          :style="{padding: '5px 8px'}"
          @click="delVoucherLsitCancleClick"
          v-if="allbtnClick"
        >删除</el-button>
        <el-button
          class="cm-form-btn"
          :style="{padding: '5px 8px'}"
          @click="delVoucherLsitCancle"
          v-if="cancelAllbtn"
        >取消</el-button>
        <el-button icon="el-icon-search" class="common-btn-style" @click="getVoucherLsit('s')">查找</el-button>
        <el-button
          type="primary"
          icon="el-icon-plus"
          class="common-btn-style margin-left-btn"
          @click.prevent="showdialog"
        >新增</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table
      :data="sshListData"
      border
      ref="multipleTable"
      @selection-change="handleSelectionChange"
      style="width: 95%;margin-left:2%"
      :header-cell-style="{ background: '#f5f5f5' }"
    >
      <el-table-column type="selection" width="55" v-if="allBtn"></el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="userName" label="用户名"></el-table-column>
      <el-table-column label="凭证类型">
        <template slot-scope="scope">
          <span v-if="scope.row.voucherType == 0">SSH凭证</span>
          <span v-if="scope.row.voucherType ==1">应用管理凭证</span>
          <span v-if="scope.row.voucherType ==2">代码库凭证</span>
          <span v-if="scope.row.voucherType ==3">数据库凭证</span>
        </template>
      </el-table-column>
      <el-table-column prop="remarks" label="描述"></el-table-column>
      <el-table-column prop="createDate" label="创建时间"></el-table-column>
      <el-table-column fixed="right" label="操作" width="180px">
        <template slot-scope="scope">
          <div class="task-btn-box">
            <span class="special" @click="ViewVoucher(scope.row)">
              <el-tooltip class="item" effect="dark" content="查看详情" placement="top-start">
                <icon-svg icon-class="chakan" />
              </el-tooltip>
            </span>
            <span class="special" @click="setVoucher(scope.row)">
              <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
                <icon-svg icon-class="bianji" />
              </el-tooltip>
            </span>
            <span class="special" @click="showDeletVoucher(scope.row.voucherId)">
              <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                <icon-svg icon-class="shanchu" />
              </el-tooltip>
            </span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="提示" :visible.sync="delSuccess" width="30%" center>
      <span>删除成功</span>
    </el-dialog>
    <!-- 查看 -->
    <!-- 修改 -->
    <!-- 删除 -->
    <!-- 有用户 -->
    <!-- 分页功能 -->
    <div class="block rolePaginate">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currPage"
        :page-sizes="[10,30,50]"
        :page-size="100"
        layout="prev, pager, next, sizes, total, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <el-dialog
      center
      :visible="addSystemBox"
      :title="savebutton?'修改凭证':showbutton?'新增凭证':'查看凭证'"
      size="tiny"
      :before-close="handleDialogClose"
      width="630px"
    >
      <div class="headportraitbox">
        <el-form ref="form" :model="form" label-width="100px" :rules="rules">
          <div>
            <el-form-item label="凭证类型: " class="disinlne" style="width:94%" prop="sshid2">
              <el-select
                v-model="sshid2"
                placeholder="选择凭证类型"
                clearable
                @change="getvtype"
                :disabled="!showbutton"
              >
                <!-- <el-option
                    :label="item.name"
                    :value="item.menuId"
                    v-for="(item,index) in sshList"
                    :key="index"
                ></el-option>-->
                <el-option
                  :label="item.name"
                  :value="item.menuId"
                  v-for="(item,index) in sshList"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="名称: " class="disinlne" style="width:94%" prop="name">
              <el-input
                :disabled="!showbutton"
                v-model="form.name"
                autocomplete="off"
                maxlength="20"
                @input="inputFun1(form.name)"
              ></el-input>
              <span>{{menuNameLength1}}</span>/
              <span :class="menuNameLength1>10?'colorRed':''">{{totalNum1}}</span>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="用户名: " class="disinlne" style="width:94%" prop="userName">
              <el-input
                :disabled="!showbutton"
                v-model="form.userName"
                autocomplete="off"
                maxlength="20"
                @input="inputFun2(form.userName)"
              ></el-input>
              <span>{{menuNameLength2}}</span>/
              <span :class="menuNameLength2>30?'colorRed':''">{{totalNum2}}</span>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="密码: " class="disinlne" style="width:94%" prop="password">
              <!-- <el-input
                v-model="form.paswd"
                autocomplete="off"
                :input="inputFun4(form.paswd)"
              ></el-input>-->
              <el-input
                :disabled="!showbutton"
                v-model="pwd"
                :type="registration_data.pwdType"
                @input="inputFun4(pwd)"
              ></el-input>
              <img :src="registration_data.src" @click="changeType()" class="seeimg" />
              <!-- <span>{{menuNameLength4}}</span>/
              <span :class="menuNameLength4>30?'colorRed':''">{{totalNum4}}</span>-->
            </el-form-item>
          </div>
          <div>
            <el-form-item label="描述: " class="disinlne" style="width:94%">
              <el-input
                v-model="form.remarks"
                autocomplete="off"
                @input="inputFun3(form.remarks)"
                :disabled="!showbutton"
              ></el-input>
              <!-- <span>{{menuNameLength3}}</span>/
              <span :class="menuNameLength3>50?'colorRed':''">{{totalNum3}}</span>-->
            </el-form-item>
          </div>
          <el-form-item class="marl txtcenter">
            <el-button
              v-show="isSave"
              :loading="editLoading"
              type="primary"
              @click="addVoucher('1')"
              style="margin-left: 16%;"
            >确认新增</el-button>
            <el-button
              v-show="!isSave"
              :loading="editLoading"
              type="primary"
              @click="addVoucher('2')"
              style="margin-left: 16%;"
            >保存</el-button>
            <el-button class="nomal-button" @click="cancel">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>

    <el-dialog center :visible.sync="dialogVisibleDelete" title="提示" width="300px">
      <div :style="{textAlign: 'center'}">
        <i class="el-icon-warning"></i>&nbsp;&nbsp;确定要删除该项吗？
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          class="save-btn-margin-special"
          size="mini"
          @click="deletVoucher"
        >确 定</el-button>
        <el-button size="mini" @click="dialogVisibleDelete = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from '@/api';
export default {
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
      if (this.sshid2 == '') {
        callback(new Error('请选择凭证类型!'))
      } else {
        callback()
      }
    }
    return {
      registration_data: {
        pwdType: 'password',
        src: require('static/img/colse.png')
      },
      rules: {
        name: [{ required: true, validator: validateName, trigger: 'blur' }],
        sshid2: [
          { required: true, validator: validatesshid2, trigger: 'change' }
        ],
        userName: [
          { required: true, message: '用户名不能为空!', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空！', trigger: 'blur' }
        ]
      },
      menuNameLength1: 0,
      menuNameLength2: 0,
      showbutton: false,
      vid: '',
      // menuNameLength3: 0,
      // menuNameLength4: 0,
      totalNum1: 20,
      totalNum2: 20,
      savebutton: false,
      // totalNum3: 50,
      // totalNum4: 30,
      editLoading: false,
      allbtnClick: false,
      Name: '',
      sshid: '',
      sshid2: '',
      currPage: 1,
      current: '1',
      delvoucheridlist: '',
      size: '10',
      total: null,
      addSystemBox: false,
      delSuccess: false,
      cancelAllbtn: false,
      allBtn: false,
      form: {},
      sshList: [
        { name: 'SSH凭证', menuId: '0' },
        { name: '应用管理凭证', menuId: '1' },
        { name: '代码库凭证', menuId: '2' },
        { name: '数据库凭证', menuId: '3' }
      ],
      sshListData: [],
      pwd: '',
      isSave: false,

      // 删除弹框
      dialogVisibleDelete: false,
      deleteVoucherId: ''
    }
  },
  watch: {},
  methods: {
    cancel () {
      this.pwd = this.form.password
      this.addSystemBox = false
      this.$refs.form.resetFields()
    },
    handleDialogClose () {
      this.$refs.form.resetFields()
      this.addSystemBox = false
      this.vid = ''
      this.addSystemBox = false
      this.savebutton = false
    },
    showdialog () {
      this.form.sshid2 = ''
      this.sshid2 = ''
      this.form = {}
      this.isSave = true
      this.showbutton = true
      this.pwd = ''
      this.menuNameLength1 = 0
      this.menuNameLength2 = 0
      this.addSystemBox = !this.addSystemBox
    },
    addVoucher (n) {
      if (n == '1') {
        this.form.password = this.pwd
        this.$refs.form.validate(valid => {
          if (valid) {
            this.form.voucherType = this.form.sshid2
            axios.addVoucher(this.form)
              .then(res => {
                if (res.data.success) {
                  this.addSystemBox = false
                  this.savebutton = false
                  this.$notify({
                    type: 'success',
                    message: '添加成功!'
                  })
                  this.getallvoucher()
                } else {
                  this.$notify({
                    type: 'warning',
                    message: res.data.message
                  })
                }
              })
              .catch()
          }
        })
      } else if (n == '2') {
        this.form.password = this.pwd
        this.$refs.form.validate(valid => {
          if (valid) {
            this.form.voucherType = this.form.sshid2
            axios.updateVoucher(this.form, this.vid)
              .then(res => {
                if (res.data.success) {
                  this.addSystemBox = false
                  this.savebutton = false
                  this.$notify({
                    type: 'success',
                    message: '修改成功!'
                  })
                  this.getallvoucher()
                } else {
                  this.$notify({
                    type: 'warning',
                    message: res.data.message
                  })
                }
              })
              .catch()
          }
        })
      }
    },
    changeType () {
      this.registration_data.pwdType =
        this.registration_data.pwdType === 'password' ? 'text' : 'password'
      this.registration_data.src =
        this.registration_data.src == require('static/img/eyes.png')
          ? require('static/img/colse.png')
          : require('static/img/eyes.png')
    },
    ViewVoucher (scope) {
      this.showbutton = false
      this.isSave = false
      // this.form = {}
      // this.form.voucherType =
      this.form.sshid2 = scope.voucherType
      this.sshid2 = scope.voucherType
      let data = {}
      data.voucherId = scope.voucherId
      axios.seeVoucher(data)
        .then(res => {
          if (res.data.success) {
            // this.form.sshid2 = res.data.data.result.voucherType;
            this.form.name = res.data.data.result.name
            this.form.userName = res.data.data.result.userName
            this.form.password = res.data.data.result.password
            this.pwd = this.form.password
            this.form.remarks = res.data.data.result.remarks
            this.menuNameLength1 = this.form.name.length
            this.menuNameLength2 = this.form.userName.length
          }
          this.addSystemBox = !this.addSystemBox
        })
        .catch()
    },
    getvtype () {
      this.form.sshid2 = this.sshid2
    },
    showDeletVoucher (id) {
      this.dialogVisibleDelete = true
      this.deleteVoucherId = id
    },
    deletVoucher () {
      axios.deleteVoucher(this.deleteVoucherId).then(res => {
        if (res.data.success) {
          this.addSystemBox = false
          this.$notify({
            type: 'success',
            message: '删除成功!'
          })
          this.getallvoucher()
          this.dialogVisibleDelete = false
        } else {
          this.$notify({
            title: '提示',
            message: res.data.message,
            type: 'warning'
          })
        }
      }).catch(e => {
        this.$notify({
          title: '提示',
          message: '删除出错',
          type: 'error'
        })
      })
    },
    setVoucher (scope) {
      this.isSave = false
      this.savebutton = true
      this.showbutton = true
      // this.form.voucherType =
      let data = {}
      this.form = {}
      this.vid = scope.voucherId
      this.form.sshid2 = scope.voucherType
      this.sshid2 = scope.voucherType
      data.voucherId = scope.voucherId
      axios.seeVoucher(data)
        .then(res => {
          // console.log(res);
          if (res.data.success) {
            // this.form.sshid2 = res.data.data.result.voucherType;
            this.form.name = res.data.data.result.name
            this.form.userName = res.data.data.result.userName
            this.form.password = res.data.data.result.password
            this.pwd = this.form.password
            this.form.remarks = res.data.data.result.remarks
            this.menuNameLength1 = this.form.name.length
            this.menuNameLength2 = this.form.userName.length
          }
          this.addSystemBox = !this.addSystemBox
        })
        .catch()
    },
    getVoucherLsit (n) {
      // let data = {}
      // data.name = this.Name
      // data.voucherType = this.sshid
      // data.current = this.current
      // data.size = this.size
      // searchVoucher(data).then(res=>{
      //   this.sshListData = res.data.data.result
      // }).catch()
      this.getallvoucher(n)
    },
    delVoucherLsitCancle () {
      this.allbtnClick = false
      this.allBtn = false
      this.cancelAllbtn = false
    },
    delVoucherLsit () {
      this.allBtn = true
      this.allbtnClick = true
      this.cancelAllbtn = true
    },
    delVoucherLsitCancleClick () {
      if (!this.delvoucheridlist) {
        this.$notify({
          title: '提示',
          message: '请选择要删除的数据',
          type: 'warning'
        })
      } else {
        this.$confirm('确定要删除选中的数据吗?', '提示')
          .then(() => {
            axios.deleteVoucherlist(this.delvoucheridlist)
              .then(res => {
                if (res.data.success) {
                  this.$notify({
                    type: 'success',
                    message: '批量删除成功!'
                  })
                  this.allBtn = false
                  this.allbtnClick = false
                  this.cancelAllbtn = false
                  this.getallvoucher()
                }
              })
              .catch()
          })
          .catch(() => {
            this.$notify({
              type: 'info',
              message: '已取消删除'
            })
          })
      }
    },
    inputFun1 (value) {
      if (value) {
        this.menuNameLength1 = value.length
      } else {
        this.menuNameLength1 = 0
      }
    },
    inputFun2 (value) {
      if (value) {
        this.menuNameLength2 = value.length
      } else {
        this.menuNameLength2 = 0
      }
    },
    inputFun3 (value) {
      if (value) {
        this.menuNameLength3 = value.length
      } else {
        this.menuNameLength3 = 0
      }
    },
    inputFun4 (value) {
      if (this.showbutton) {
        this.form.password = this.pwd
      }
      if (value) {
        this.menuNameLength4 = value.length
      } else {
        this.menuNameLength4 = 0
      }
    },
    handleSizeChange (val) {
      this.size = val
      this.getVoucherLsit()
    },
    getallvoucher (n) {
      if (n == 's') {
        this.current = 1
      }
      let data = {
        name: this.Name,
        voucherType: this.sshid,
        current: this.current,
        size: this.size
      }
      axios.voucherList(data)
        .then(res => {
          this.sshListData = res.data.data.result.records
          this.total = Number(res.data.data.result.total)
        })
        .catch()
    },
    handleCurrentChange (val, page) {
      this.current = val
      this.getVoucherLsit()
    },
    handleSelectionChange (val) {
      this.delvoucheridlist = ''
      val.forEach(item => {
        this.delvoucheridlist += item.voucherId + ','
      })
      this.delvoucheridlist = this.delvoucheridlist.slice(
        0,
        this.delvoucheridlist.length - 1
      )
    }
  },
  created () { },
  updated () { },
  mounted () {
    this.getallvoucher()
  }
}
</script>
<style scoped>
.bg {
  width: 100%;
  background: #fff;
  border-radius: 5px;
}
.el-input {
  width: 70%;
}
.rolePaginate /deep/ .el-pagination {
  text-align: center;
}
.spanx {
  color: red;
}
.spanxs {
  color: #fff;
}
.headportraitbox {
  height: 346px;
  line-height: 54px;
  width: 120%;
  position: relative;
  margin-bottom: 20px;
}
.disinlne {
  display: inline-block;
}
.seeimg {
  position: absolute;
  right: 175px;
  top: 10px;
  width: 20px;
  height: 20px;
  float: right;
}
.btn-watch {
  color: #fff;
  background-color: #0280ff;
  background-size: 50%;
  background-position: center center;
}
.task-btn-box {
  /* padding: 10px; */
  text-align: center;
}

.task-btn-box span {
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
}
.task-btn-box span.special {
  /* border: 1px solid #777777; */
  cursor: pointer;
}
.task-btn-box span img {
  height: 12px;
  /* margin-top: 2px; */
  padding: 5px 8px 6px 8px;
  margin-bottom: -6px;
}
.task-btn-box span.special:hover {
  background: #0066ff;
  /* color:#fff!important; */
}
</style>
