<template>
  <div class="bg aibms-role">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="Name" placeholder="名称" style="width:100%" clearable></el-input>
      </el-form-item>
      <el-select v-model="sshid" placeholder="选择凭证类型" clearable>
        <el-option
          :label="item.name"
          :value="item.menuId"
          v-for="(item,index) in sshList"
          :key="index"
        ></el-option>
      </el-select>
      <el-form-item class="item-right overHideMargin">
        <el-button icon="el-icon-close" class="nomal-button" @click="delVoucherLsit">批量删除</el-button>
        <!-- <el-button
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
        >取消</el-button>-->
        <el-button icon="el-icon-search" class="nomal-button" @click="getVoucherLsit('s')">查找</el-button>
        <el-button
          type="primary"
          icon="el-icon-plus"
          class="margin-left-btn"
          @click.prevent="showdialog"
        >新增</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table
      :data="sshListData"
      ref="multipleTable"
      stripe
      :header-cell-style="{background:'#f5f5f5'}"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="60" align="center" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="userName" label="用户名" />
      <el-table-column label="凭证类型">
        <template slot-scope="scope">
          <span v-if="scope.row.voucherType == 0">SSH凭证</span>
          <span v-if="scope.row.voucherType ==1">应用管理凭证</span>
          <span v-if="scope.row.voucherType ==2">代码库凭证</span>
          <span v-if="scope.row.voucherType ==3">数据库凭证</span>
        </template>
      </el-table-column>
      <el-table-column prop="remarks" label="描述" />
      <el-table-column prop="createDate" label="创建时间" />
      <el-table-column label="操作" width="180px" align="center">
        <template slot-scope="scope">
          <div class="task-btn-box">
            <span class="special" @click="ViewVoucher(scope.row.voucherId)">
              <el-tooltip class="item" effect="dark" content="查看详情" placement="top-start">
                <icon-svg icon-class="chakan" class="whiteness-icon-color" />
              </el-tooltip>
            </span>
            <span class="special" @click="setVoucher(scope.row.voucherId)">
              <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
                <icon-svg icon-class="bianji" class="whiteness-icon-color" />
              </el-tooltip>
            </span>
            <span class="special" @click="showDeletVoucher(scope.row.voucherId)">
              <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                <icon-svg icon-class="shanchu" class="whiteness-icon-color" />
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
    <div class="block rolePaginate" style="margin-top: 92px;">
      <el-pagination
        v-if="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currPage"
        :page-sizes="[10,30,50]"
        :page-size="100"
        layout="prev, pager, next, sizes, total, jumper"
        :total="total"
      />
    </div>
    <el-dialog center :visible.sync="isSureBatch" title="批量删除" width="300px">
      <div :style="{textAlign: 'center'}">
        <i class="el-icon-warning"></i>&nbsp;&nbsp;确定要删除这些CI项吗？
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="isSureBatch = false">取 消</el-button>
        <el-button type="primary" size="mini" @click="delVoucherLsitCancle">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog center :visible.sync="dialogVisibleDelete" title="提示" width="300px">
      <div :style="{textAlign: 'center'}">
        <i class="el-icon-warning"></i>&nbsp;&nbsp;确定要删除该项吗？
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisibleDelete = false">取 消</el-button>
        <el-button type="primary" size="mini" @click="deletVoucher">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from '@/api';
export default {
  data () {
    return {
      isSureBatch: false,
      vid: '',
      totalNum1: 20,
      totalNum2: 20,
      // totalNum3: 50,
      // totalNum4: 30,
      allbtnClick: false,
      Name: '',
      sshid: '',
      sshid2: '',
      currPage: 1,
      current: '1',
      delvoucheridlist: '',
      size: '10',
      total: null,
      delSuccess: false,
      cancelAllbtn: false,
      sshList: [
        { name: 'SSH凭证', menuId: '0' },
        { name: '应用管理凭证', menuId: '1' },
        { name: '代码库凭证', menuId: '2' },
        { name: '数据库凭证', menuId: '3' }
      ],
      sshListData: [],

      dialogVisibleDelete: false,
      deleteVoucherId: ''
    }
  },
  watch: {},
  methods: {
    showdialog () {
      this.$router.push({
        path: '/ResourceAllocation/VoucherPage/create',
        query: {
          code: 1
        }
      })
    },
    ViewVoucher (voucherId) {
      this.$router.push({
        path: '/ResourceAllocation/VoucherPage/watch',
        query: {
          code: 1,
          id: voucherId
        }
      })
    },
    getvtype () {
      // console.log(this.form.sshid2);
      this.form.sshid2 = this.sshid2
      // this.sshList.forEach((item)=>{
      //   if(item.menuId==this.form.voucherType){
      //     this.form.voucherType == item.name
      //   }
      // })
      // console.log(this.form);
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
    setVoucher (voucherId) {
      this.$router.push({
        path: '/ResourceAllocation/VoucherPage/edit',
        query: {
          code: 1,
          id: voucherId
        }
      })
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
      axios.deleteVoucherlist(this.delvoucheridlist)
        .then(res => {
          this.isSureBatch = false
          if (res.data.success) {
            this.$notify({
              type: 'success',
              message: '批量删除成功!'
            })
            this.getallvoucher()
          }
        })
        .catch()
    },
    delVoucherLsit () {
      if (!this.delvoucheridlist) {
        this.$notify({
          title: '提示',
          message: '请选择要删除的数据',
          type: 'warning'
        })
      } else {
        this.isSureBatch = true
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
<style scoped lang="scss">
.bg {
  border-radius: 5px;
  padding: 10px;
  .rolePaginate {
    & /deep/ .el-pagination {
      text-align: center;
    }
  }
  .demo-form-inline {
    & /deep/ .overHideMargin {
      margin-right: 0 !important;
    }
    .form-btn {
      float: right;
    }
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
  .addbutton {
    background-color: #0280ff !important;
    height: 30px !important;
    padding: 5px 16px !important;
  }
  .el-input {
    width: 70%;
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
  .seeimg {
    position: absolute;
    right: 175px;
    top: 10px;
    width: 20px;
    height: 20px;
    float: right;
  }
  .disinlne {
    display: inline-block;
  }
  .btn-watch {
    color: #fff;
    background-color: #0280ff;
    background-size: 50%;
    background-position: center center;
  }
}
</style>
