<template>
  <div class="containBox aibms-role">
    <el-form :inline="true" v-model="formInline" class="demo-form-inline">
      <el-form-item>
        <el-input
          type="text"
          placeholder="业务系统名称"
          clearable
          v-model="searchSystemName"
        />
      </el-form-item>

      <el-form-item class="item-right overHideMargin">
        <el-button
          @click="allSystembtnde"
          icon="el-icon-close"
          class="nomal-button"
          >批量删除</el-button
        >
        <el-button @click="checkAll" v-if="delesteBtnSys">删除</el-button>
        <el-button @click="cancleall" v-if="cancleallBtn">取消</el-button>
        <el-button
          icon="el-icon-search"
          class="search-el-button margin-left-btn"
          @click="searchBtn"
          >查找</el-button
        >
        <el-button
          type="primary"
          icon="el-icon-plus"
          class="margin-left-btn"
          @click.prevent="addSystembtn"
          >新增</el-button
        >
      </el-form-item>
      <el-form-item class="form-btn"></el-form-item>
    </el-form>
    <el-table
      :data="systemListData"
      @row-click="systemDetail"
      stripe
      class="table-css non-border"
      style="width: 100%; font-size: 0.9rem"
      :header-cell-style="{ background: '#f5f5f5' }"
      @selection-change="handleSelectionChange"
      center="true"
      height="84%"
    >
      <el-table-column type="selection" v-if="allSysDeleteShow" />
      <el-table-column label="业务系统名称" prop="name" />
      <el-table-column label="英文缩写" prop="englishAbridge" />
      <el-table-column label="类型" prop="type" />
      <!-- <el-table-column label="url" prop="url" />
        <el-table-column label="代码库凭证" prop="vName" /> -->
      <el-table-column label="负责人" prop="opsPerson" />
      <!-- <el-table-column label="开发负责人" prop="devPerson" /> -->
      <!-- <el-table-column label="描述" prop="remarks" /> -->
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <div class="task-btn-box">
            <span
              class="special"
              @click.stop="getSystemDetail(scope.row.systemId)"
            >
              <el-tooltip
                class="item"
                effect="dark"
                content="编辑"
                placement="top-start"
              >
                <icon-svg icon-class="bianji" class="whiteness-icon-color" />
              </el-tooltip>
            </span>
            <span class="special" @click.stop="showOpen3(scope.row.systemId)">
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
          <!-- <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
              <el-button
                class="cm-form-btn cm-edit-btn-light"
                :style="{backgroundSize: '40%', backgroundPosition: 'center'}"
                @click="getSystemDetail(scope.row.systemId)"
              ></el-button>
            </el-tooltip>

            <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
              <el-button
                class="cm-form-btn cm-delete-btn-light"
                :style="{backgroundSize: '40%',backgroundPosition: 'center'}"
                @click="open3(scope.row.systemId)"
              ></el-button>
            </el-tooltip>-->
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="current"
        :page-sizes="[10, 30, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total "
        v-if="total&& total > 10"
        class="absolute-center"
        style="cursor: pointer"
      ></el-pagination>
    </div>
    <div class="clear"></div>
    <el-dialog
      center
      :visible.sync="dialogVisibleDelete"
      title="提示"
      width="300px"
    >
      <div :style="{ textAlign: 'center' }">
        <i class="el-icon-warning"></i>&nbsp;&nbsp;确定要删除该项吗？
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisibleDelete = false"
          >取 消</el-button
        >
        <el-button type="primary" size="mini" @click="open3">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      center
      :visible.sync="isDeleteAll"
      title="批量删除"
      width="300px"
    >
      <div :style="{ textAlign: 'center' }">
        <i class="el-icon-warning"></i>&nbsp;&nbsp;确定要删除这些项吗？
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          class="save-btn-margin-special"
          size="mini"
          @click="batchDeleteSys(tableChecked)"
          >确 定</el-button
        >
        <el-button size="mini" @click="isDeleteAll = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from '@/api';
export default {
  data() {
    // var validateurl = (rule, value, callback) => {
    //   if (value === '') {
    //     callback(new Error('请输入Url'));
    //   } else if (
    //     !/^((ht|f)tps?):\/\/([\w\-]+(\.[\w\-]+)*\/)*[\w\-]+(\.[\w\-]+)*\/?(\?([\w\-\.,@?^=%&:\/~\+#]*)+)?/.test(
    //       value
    //     )
    //   ) {
    //     callback(new Error('请输入正确的Url!'));
    //   } else {
    //     callback();
    //   }
    // };
    // var validatename = (rule, value, callback) => {
    //   if (value === '') {
    //     callback(new Error('请输入名称!'));
    //   } else if (
    //     !/^[0-9A-Za-z_\u4e00-\u9fa5]{2,10}$/.test(
    //       value
    //     )
    //   ) {
    //     callback(new Error('请输入正确的名称!'));
    //   } else {
    //     callback();
    //   }
    // };
    // var validategitsvn = (rule, value, callback) => {
    //   if (this.svngit == '') {
    //     callback(new Error('请选择代码库类型!'));
    //   } else {
    //     callback();
    //   }
    // };
    return {
      isDeleteAll: false,
      num: 0,
      cancleallBtn: false,
      allDeleteShow: false,
      editEnvData: {
        name: '',
        environmentType: '',
        remarks: ''
      },
      searchSystemName: '',
      systemName: '',
      envdata: {
        addEnvname: '',
        addenvironmentType: '',
        addEnvRemarks: ''
      },
      environmentType: '',
      // addenvironmentType: "",
      // addEnvRemarks: "",
      svngit: '',
      rules3: {
        addEnvname: [
          { required: true, message: '名称不能为空!', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        addenvironmentType: [
          { required: true, message: '环境必选！', trigger: 'change' }
        ]
      },
      rules4: {
        name: [
          { required: true, message: '名称不能为空!', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        environmentType: [
          { required: true, message: '环境不能为空!', trigger: 'change' }
        ]
      },
      activeName2: 'first',
      allSysDeleteShow: false,
      delesteBtnSys: false,
      tableChecked: [],
      voucherListData: [],
      options: [],
      formInline: '',
      delesteBtn: false,
      CiDataList: '',
      BatchDeleteShow: false,
      pageShow: true,
      pageShow1: true,
      total: 0,
      total1: 0,
      environment_type: '',
      name: '',
      envListData: [],
      current: 1,
      envcurrent: 1,
      size: 10,
      systemListData: [],
      envForm: {},

      // 删除弹窗
      dialogVisibleDelete: false,
      deleteSystemId: '',
      callNum: 0
    }
  },
  methods: {
    setSession() {
      if (this.callNum > 1) {
        const params = {
          name: this.searchSystemName,
          current: this.current,
          size: this.size
        }
        sessionStorage.setItem('search', JSON.stringify(params))
      }
    },
    getParams() {
      let params
      if (sessionStorage.getItem('search') !== null) {
        params = JSON.parse(sessionStorage.getItem('search'))
        const { name, current, size } = params
        this.searchSystemName = name
        this.current = current
        this.size = size
      }
      return params
    },
    checkAll() {
      this.isDeleteAll = true
    },
    // 业务系统列表
    getBsystemListData(params) {
      if (params === undefined) {
        params = {
          name: this.searchSystemName,
          current: this.current,
          size: this.size
        }
      }
      axios.getSystemList(params).then(res => {
        if (res.data.code == 200) {
          this.systemListData = res.data.data.result.records
          this.total = Number(res.data.data.result.total)
          console.log(this.total, typeof this.total)
          this.callNum++
          if (this.total == 0) {
            this.page = false
            this.pageShow = false
          } else {
            this.page = true
            this.pageShow = true
          }
        }
      })
    },
    getsvegit() {
      this.editBsystem.svngit = this.svngit
    },
    // 搜索业务系统
    searchBtn() {
      this.systemListData = []
      this.current = 1
      this.getBsystemListData()
    },
    systemDetail(row) {
      console.log(row)
      this.setSession()
      this.$router.push({
        path: '/ResourceAllocation/SystemPage/watch',
        query: {
          code: 1,
          id: row.systemId
        }
      })
    },
    // 新增业务系统按钮
    addSystembtn() {
      // this.addSystem = true;
      // this.systemDetail = false;
      // this.num = 0;
      this.$router.push({
        path: '/ResourceAllocation/SystemPage/create',
        query: {
          code: 1
        }
      })
    },
    // 获取业务系统详情
    getSystemDetail(systemId) {
      this.setSession()
      this.$router.push({
        path: '/ResourceAllocation/SystemPage/edit',
        query: {
          code: 1,
          id: systemId
        }
      })
      // this.systemDetail = true;
      // getSystemDetail(systemId).then(res => {
      //   if (res.data.code === 200) {
      //     this.editBsystem = res.data.data.result;
      // this.editBsystem.svngit = res.data.data.result.repoType==1?'Git':'Svn'
      //     this.svngit = res.data.data.result.repoType == 2 ? 'Git' : 'Svn';
      //   }
      // });
    },
    showOpen3(id) {
      this.dialogVisibleDelete = true
      this.deleteSystemId = id
    },
    // 业务系统删除
    open3() {
      axios.getSystemCancle(this.deleteSystemId).then(res => {
        if (res.data.code == 200) {
          this.$notify({
            type: 'success',
            message: '删除成功!'
          })
          this.getBsystemListData()
          this.dialogVisibleDelete = false
        } else {
          this.$notify({
            title: '提示',
            message: res.data.message,
            type: 'warning'
          })
        }
      })
    },
    // 多选删除
    handleSelectionChange(val) {
      this.tableChecked = val
    },
    // 业务系统批量删除
    allSystembtnde() {
      this.cancleallBtn = true
      this.delesteBtnSys = true
      this.allSysDeleteShow = true
    },
    // 取消业务系统批量删除
    cancleall() {
      this.cancleallBtn = false
      this.delesteBtnSys = false
      this.allSysDeleteShow = false
      this.delesteBtn = false
      this.BatchDeleteShow = false
    },
    // 确定业务系统批量删除
    batchDeleteSys(rows) {
      // console.log(rows);
      var ids = []
      rows.forEach(element => {
        ids.push(element.systemId)
      })
      var systemIDs = ids.join(',')

      if (systemIDs == '') {
        this.$notify({
          title: '提示',
          message: '请选择要删除的数据',
          type: 'warning'
        })
      } else {
        let that = this
        axios.allSysDataDelete(systemIDs)
          .then(function (res) {
            if (res.data.code == 200) {
              that.$notify({
                title: '提示',
                message: '删除成功',
                type: 'success'
              })
              that.delesteBtnSys = false
              that.allSysDeleteShow = false
              that.cancleallBtn = false
              that.getBsystemListData()
              this.isDeleteAll = false
            } else {
              that.$notify({
                title: '提示',
                message: res.data.message,
                type: 'warning'
              })
            }
          })
          .catch(function (err) {
            if (err) {
              return false
            }
            //  console.log(err);
          })
      }
    },
    // 下拉框凭证
    getVoucherData() {
      var name = ''
      var voucherType = '2'
      let that = this
      axios.getVoucherList(name, voucherType).then(function (res) {
        if (res.data.code == 200) {
          that.voucherListData = res.data.data.result
          // console.log(that.voucherListData);
        }
      })
    },

    // 环境列表
    getEnvListData(envsearchPage) {
      if (envsearchPage) {
        this.envcurrent = envsearchPage
      }
      let JobDto = {
        name: this.name, // 所属ci分类ID
        // environmentType: this.environmentType, //关键字
        current: this.envcurrent, // 当前页码
        size: this.size // 每页展示条数
      }

      axios.getEnvList(JobDto).then(res => {
        if (res.data.code == 200) {
          this.envListData = res.data.data.result.records
          this.total1 = Number(res.data.data.result.total)
          //  console.log(this.envListData);
          if (this.total1 == 0) {
            this.page = false
            this.pageShow1 = false
          } else {
            this.page = true
            this.pageShow1 = true
          }
        }
      })
    },
    // 分页

    handleSizeChange(val) {
      this.size = val
      this.getEnvListData()
      this.getBsystemListData()
    },
    handleSizeChangeenv(val) {
      this.size = val
      this.getEnvListData()
    },
    // 分页
    handleCurrentChange(val, page) {
      this.current = val
      this.size = 10
      this.getEnvListData()
      this.getBsystemListData()
    },
    handleCurrentChangeenv(val, page) {
      this.envcurrent = val
      this.size = 10
      this.getEnvListData()
    },
    // 查询环境列表
    getEnvBtn() {
      this.envListData = []
      var envsearchPage = 1
      this.getEnvListData(envsearchPage)
    },
    // 新增环境
    addEnvironment() {
      // this.addUser = true;
      // this.num = 0;
      this.$router.push({
        path: '/ResourceAllocation/EnvirmentPage/create',
        query: {
          code: 1
        }
      })
    },

    // 获取环境详情
    edit(userId) {
      this.$router.push({
        path: '/ResourceAllocation/EnvirmentPage/edit',
        query: {
          code: 1,
          id: userId
        }
      })
      // this.editEnvironmentbox = true;
      // let environmentId = userId;
      // getenvDataIm(environmentId).then(res => {
      //   if (res.data.code === 200) {
      //     this.editEnvData = res.data.data.result;
      //   }
      // });
    },
    // 点击删除
    open2(userId) {
      let environmentId = userId

      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          axios.envDataDelete(environmentId).then(res => {
            if (res.data.code == 200) {
              this.$notify({
                type: 'success',
                message: '删除成功!'
              })
              this.getEnvListData()
            } else {
              this.$notify({
                title: '提示',
                message: res.data.message,
                type: 'warning'
              })
            }
          })
        })
        .catch(() => {
          this.$notify({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    // 批量删除环境
    batchDelete(rows) {
      var ids = []
      rows.forEach(element => {
        ids.push(element.environmentId)
      })
      var environmentIds = ids.join(',')

      if (environmentIds == '') {
        this.$notify({
          title: '提示',
          message: '请选择要删除的数据',
          type: 'warning'
        })
      } else {
        this.$confirm('确定要删除选中的数据吗?', '提示')
          .then(() => {
            let that = this
            axios.allEnvDataDelete(environmentIds)
              .then(function (res) {
                if (res.data.code == 200) {
                  that.$notify({
                    title: '提示',
                    message: '删除成功',
                    type: 'success'
                  })
                  that.BatchDeleteShow = false
                  that.delesteBtn = false
                  that.cancleallBtn = false
                  that.getEnvListData()
                } else {
                  that.$notify({
                    title: '提示',
                    message: res.data.message,
                    type: 'warning'
                  })
                }
              })
              .catch(function (err) {
                if (err) {
                  return false
                }
                //  console.log(err);
              })
          })
          .catch(() => { })
      }
    },
    // 批量操作
    BatchDeletebtn() {
      this.cancleallBtn = true
      this.delesteBtn = true
      this.BatchDeleteShow = true
    }
  },
  mounted() {
    let params = this.getParams()
    this.getEnvListData()
    this.getBsystemListData(params)
    this.getVoucherData()
  }
}
</script>
<style scoped lang="scss">
.containBox {
  position: relative;
  padding: 10px;
  height: 91%;
  font-size: 1rem;
  .tabs-list {
    & /deep/ .el-tabs__header {
      margin: 0 !important;
      border-bottom: 4px solid;
      border-color: rgba(4, 28, 37, 0.7) !important;
    }
    & /deep/ .el-tabs__item {
      background-color: rgba(4, 28, 37, 0.3) !important;
      height: 35px !important;
      line-height: 35px !important;
      margin-right: 10px !important;
      border: 1px solid;
      border-color: transparent !important;
      &:hover {
        background: #00a8e8 !important;
        color: #fff !important;
      }
    }
    & /deep/ .is-active {
      background-color: #00a8e8 !important;
      color: #fff !important;
      border: 2px solid #00a8e8 !important;
      border-bottom: none !important;
      border-top-left-radius: 3px;
      border-top-right-radius: 3px;
    }
    & /deep/ .el-tabs__nav {
      border: 0 !important;
    }
    .tab-item {
      box-sizing: border-box;
      background-color: #fff;
      padding-bottom: 10px;
      .demo-form-inline {
        & /deep/ .overHideMargin {
          margin-right: 0 !important;
        }
        .form-btn {
          float: right;
        }
      }
      .table-css {
        margin-left: 2% !important;
        border: 1px solid #ebeef5;
      }
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
  .fatherMenu {
    margin: 6%;
    .fatherMenu-ul {
      width: 100%;
      list-style: none;
      height: 600px;
      overflow-y: auto;
      li {
        width: 80%;
        padding: 10px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        border: 1px solid #423be2;
        cursor: pointer;
      }
    }
  }
  .sonMenu {
    position: absolute;
    left: 15%;
    top: 0;
    display: none;
    width: 12%;
    .sonMenu-ul {
      list-style: none;
      li {
        cursor: pointer;
        padding: 10px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        border: 1px solid #e4dbdb;
      }
    }
  }
  .spanx {
    color: red;
  }
  .disinlne {
    display: inline-block;
  }
  .addSystem {
    width: 80%;
    margin: 0 6%;
    cursor: pointer;
    color: #fff;
    font-size: 0.8rem;
    line-height: 40px;
    text-align: center;
    border-radius: 6px;
    margin-bottom: 20px;
    font-weight: bolder;
    background-color: #423be2;
  }
  .selectedColor {
    color: rgb(7, 196, 168);
  }
  .li-item {
    font-size: 0.9rem;
    &:hover {
      font-weight: bold;
    }
  }
  .updateIconBtn {
    margin-left: 2rem;
    .el-button {
      background: linear-gradient(
        left,
        #ff4b95 0%,
        #9f43bd 28%,
        #3e3be4 100%
      ) !important;
      color: #fff;
    }
  }
  .deleteIcon:hover {
    color: brown;
  }
  .addNewciType {
    cursor: pointer;
    color: rgb(66, 59, 226);
    &:hover {
      font-weight: bolder;
    }
  }

  .el-table td {
    border-bottom: none;
  }
  .clear {
    clear: both;
  }
  .block {
    text-align: center;
  }
  .addbutton {
    background-color: #0280ff !important;
    height: 30px !important;
    padding: 5px 16px !important;
  }
}
.overHideMargin {
  margin-right: 0 !important;
  .search-el-button.el-button {
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
</style>
