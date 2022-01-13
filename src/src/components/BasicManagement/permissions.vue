<template>
  <div class="bg aibms-color-bg aibms-permissions">
    <div class="tophead">
      <div class="topBox">
        <span class="title">系统列表</span>
        <el-button
          class="systemName nomal-button"
          v-for="(item, index) in syslistdata"
          :key="index"
          @click="delsys(item, index)"
          :class="{ active: active == index }"
          >{{ item.name }}</el-button
        >
      </div>
      <div class="addSystem item-right">
        <el-button
          type="primary"
          icon="el-icon-plus"
          class="common-btn-style"
          @click.prevent="addSystem"
          >新增系统</el-button
        >
      </div>
    </div>
    <div class="customBox">
      <el-row>
        <span class="custom-box-title">{{ sysname }}</span>
        <div class="item-right">
          <router-link
            :to="{
              path: '/BasicManagement/permissions/addSystem?code=0',
              query: { id: systemId },
            }"
          >
            <el-button
              type="primary"
              icon="el-icon-plus"
              class="common-btn-style"
              >新增</el-button
            >
          </router-link>
          <router-link
            :to="{
              path: '/BasicManagement/permissions/editSystem?code=0',
              query: { id: systemId },
            }"
          >
            <el-button type="primary" class="common-btn-style margin-left-btn">
              <i class="el-icon-edit-outline" style="margin-right: 10px"></i
              >修改
            </el-button>
          </router-link>

          <el-button
            icon="el-icon-close"
            class="common-btn-style margin-left-btn nomal-button"
            @click="DeleteSystem"
            >删除系统</el-button
          >
        </div>
      </el-row>
      <div class="table-area">
        <tree-table :data="menuListDtata" stripe>
          <el-table-column label="类型">
            <template slot-scope="scope">
              <el-button
                style="cursor: default"
                :type="
                  scope.row.menuType == '1'
                    ? 'primary'
                    : scope.row.menuType == '2'
                    ? 'success'
                    : scope.row.menuType == '3'
                    ? 'warning'
                    : 'info'
                "
                size="small"
                >{{
                  scope.row.menuType == "1"
                    ? "系统"
                    : scope.row.menuType == "2"
                    ? "菜单"
                    : scope.row.menuType == "3"
                    ? "按钮"
                    : "数据项"
                }}</el-button
              >
            </template>
          </el-table-column>
          <el-table-column label="权限标识">
            <template slot-scope="scope">
              <span>{{ scope.row.permission }}</span>
            </template>
          </el-table-column>
          <el-table-column label="链接地址" width="330">
            <template slot-scope="scope">
              <span>{{ scope.row.href }}</span>
            </template>
          </el-table-column>

          <el-table-column label="描述">
            <template slot-scope="scope">
              <span>{{ scope.row.remarks }}</span>
            </template>
          </el-table-column>
        </tree-table>
      </div>
    </div>
    <!-- 新增系统 -->
    <el-dialog
      center
      :visible="addSystemBox"
      title="新增系统"
      size="tiny"
      :before-close="handleDialogClose"
      width="630px"
    >
      <div class="headportraitbox">
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
          <div class>
            <el-form-item
              label="系统名称："
              prop="name"
              class="disinlne"
              style="width: 94%"
            >
              <el-input
                v-model="form.name"
                autocomplete="off"
                maxlength="10"
                :input="inputFun1(form.name)"
              ></el-input>
              <span>{{ menuNameLength1 }}</span
              >/
              <span :class="menuNameLength1 > 10 ? 'colorRed' : ''">{{
                totalNum1
              }}</span>
            </el-form-item>
          </div>
          <div>
            <el-form-item
              label="系统标识："
              prop="permission"
              class="disinlne"
              style="width: 94%"
            >
              <el-input
                v-model="form.permission"
                autocomplete="off"
                maxlength="30"
                :input="inputFun2(form.permission)"
              ></el-input>
              <span>{{ menuNameLength2 }}</span
              >/
              <span :class="menuNameLength2 > 30 ? 'colorRed' : ''">{{
                totalNum2
              }}</span>
            </el-form-item>
          </div>
          <div>
            <el-form-item
              label="系统地址："
              prop="href"
              class="disinlne"
              style="width: 94%"
            >
              <el-input
                v-model="form.href"
                autocomplete="off"
                maxlength="30"
                :input="inputFun4(form.href)"
              ></el-input>
              <span>{{ menuNameLength4 }}</span
              >/
              <span :class="menuNameLength4 > 30 ? 'colorRed' : ''">{{
                totalNum4
              }}</span>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="描述：" class="disinlne" style="width: 94%">
              <el-input
                v-model="form.remarks"
                type="textarea"
                autocomplete="off"
                maxlength="50"
                :input="inputFun3(form.remarks)"
              ></el-input>
              <span>{{ menuNameLength3 }}</span
              >/
              <span :class="menuNameLength3 > 50 ? 'colorRed' : ''">{{
                totalNum3
              }}</span>
            </el-form-item>
          </div>
          <div class="dai-save-btn">
            <el-button
              :loading="editLoading"
              type="primary"
              class="save-btn-margin-special"
              @click="addsysteam()"
              >保存</el-button
            >
            <el-button class="nomal-button" @click="addSystemBox = false"
              >取消</el-button
            >
          </div>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import treeTable from '../treeTable';
import axios from '@/api';
// import Cookie from 'js-cookie';
export default {
  name: 'MoreOperation',
  components: { treeTable },
  data() {
    return {
      rules: {
        name: [
          { required: true, message: '请输入系统名称！', trigger: 'blur' }
        ],
        permission: [
          { required: true, message: '请输入系统标识！', trigger: 'blur' }
        ],
        href: [
          { required: true, message: '请输入系统地址！', trigger: 'blur' }
        ]
      },
      active: 0,
      menuRemarksLength: 0,
      remarksTotalNum: 50,
      totalNum: 10,
      menuNameLength: 0,
      menuListDtata: [],
      syslist: [],
      syslistdata: [],
      systemId: '',
      firstMeunId: '',
      count: 0,
      addSystemBox: false,
      editLoading: false,
      sysname: '',
      delmenuid: '',
      menuNameLength1: 0,
      menuNameLength2: 0,
      menuNameLength3: 0,
      menuNameLength4: 0,
      totalNum1: 10,
      totalNum2: 30,
      totalNum3: 50,
      totalNum4: 30,
      menuForm: {},
      menuForm2: {},
      menuForm3: {},
      form: {
        name: '',
        permission: '',
        remarks: ''
        //        name: "",
        //        permission: "",
        //        remarks: ""
      },
      columns: [
        {
          text: '名称',
          value: 'name',
          width: 200,
          option: 'sonData1'
        },
        {
          text: '类型',
          value: 'typeName',
          option: 'sonData1',
          act: 'act'
        },
        {
          text: '权限标识'
        },
        {
          text: '链接地址'
        },
        {
          text: '描述'
        }
      ],
      data: {
        id: 1,
        event: '事件1',
        timeLine: 100,
        comment: '无',
        children: [
          {
            id: 2,
            event: '事件2',
            timeLine: 10,
            comment: '无'
          },
          {
            id: 3,
            event: '事件3',
            timeLine: 90,
            comment: '无',
            children: [
              {
                id: 4,
                event: '事件4',
                timeLine: 5,
                comment: '无'
              },
              {
                id: 5,
                event: '事件5',
                timeLine: 10,
                comment: '无'
              },
              {
                id: 6,
                event: '事件6',
                timeLine: 75,
                comment: '无'
              }
            ]
          }
        ]
      }
    };
  },
  methods: {
    // 数字监听
    inputFun(value) {
      if (value) {
        this.menuNameLength = value.length;
      } else {
        this.menuNameLength = 0;
      }
    },

    // 获取系统列表
    getMenuSysList() {
      axios.getMenuSysList().then((res) => {
        this.syslistdata = res.data.data.result;
        this.firstMeunId = this.syslistdata[0].menuId;
        // console.log(this.firstMeunId);
        // console.log(this.syslistdata);
        this.getMenuList(this.firstMeunId);
      });
    },
    // 获取菜单列表
    getMenuList(menuId) {
      let mId = '';
      if (menuId) {
        mId += 'menuId=' + menuId;
      }
      axios.menuList(mId).then((res) => {
        this.count++;
        this.menuListDtata = res.data.data.result;
        // console.log(this.menuListDtata);
        this.syslist = res.data.data.result;
        this.sysname = this.menuListDtata[0].name;
        this.systemId = this.menuListDtata[0].menuId;
      });
    },
    delsys(item, index) {
      this.active = index;
      this.delmenuid = item.menuId;
      this.getMenuList(item.menuId);
    },
    // 实时显示输入框已输入字数
    inputFun1(value) {
      if (value) {
        this.menuNameLength1 = value.length;
      }
    },
    // 实时显示输入框已输入字数
    inputFun2(value) {
      if (value) {
        this.menuNameLength2 = value.length;
      }
    },
    // 实时显示输入框已输入字数
    inputFun3(value) {
      if (value) {
        this.menuNameLength3 = value.length;
      }
    },
    // 实时显示输入框已输入字数
    inputFun4(value) {
      if (value) {
        this.menuNameLength4 = value.length;
      }
    },
    // 删除系统
    //   Delsysteam(){
    //  let typeIds = '';
    //     typeIds ='menuId=' + this.$store.state.typeIds.slice(0,this.$store.state.typeIds.length-1)
    //       axios.DelMenuItem(typeIds).then((res)=>{
    //           if (res.data.code == 200) {
    //             this.$message({
    //               type: "success",
    //               message: "删除成功!"
    //             });
    //             this.getMenuList();
    //           } else {
    //             this.$notify({
    //               title: "提示",
    //               message: res.data.message,
    //               type: "warning"
    //             });
    //           }
    //       }).catch()
    //   },
    // 数组处理
    uniq(array) {
      let temp = {};
      let r = [];
      let len = array.length;
      let val, type;
      for (let i = 0; i < len; i++) {
        val = array[i];
        type = typeof val;
        if (!temp[val]) {
          temp[val] = [type];
          r.push(val);
        } else if (temp[val].indexOf(type) < 0) {
          temp[val].push(type);
          r.push(val);
        }
      }
      return r;
    },
    // 删除系统
    DeleteSystem() {
      let typeIds = '';
      // this.uniq(this.$store.state.typeIds).forEach(function(item){
      //   typeIds+=item+','

      // })
      // typeIds =typeIds.slice(0,typeIds.length-1)

      if (!this.delmenuid || this.delmenuid === '' || this.delmenuid === null) {
        typeIds = this.systemId;
      } else {
        typeIds = this.delmenuid;
      }
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          axios
            .DelMenuItem(typeIds)
            .then((res) => {
              if (res.data.code === 200) {
                this.$notify({
                  type: 'success',
                  message: '删除成功!'
                });
                this.active = 0;
                this.delmenuid = '';
                this.delmenuid = null;
                this.getMenuList();
                this.getMenuSysList();
              } else {
                this.$notify({
                  title: '提示',
                  message: res.data.message,
                  type: 'warning'
                });
              }
            })
            .catch();
        })
        .catch(() => {
          this.$notify({
            type: 'info',
            message: '已取消删除'
          });
        });

      // this.$confirm(
      //   "若要删除系统，需却保该系统下无任何角色该系统下有5个角色，无法删除！",
      //   "提示",
      //   {
      //     confirmButtonText: "确定",
      //     cancelButtonText: "取消",
      //     type: "warning"
      //   }
      // )
      //   .then(() => {
      //   this.Delsysteam()
      //   })
      //   .catch(() => {
      //     this.$message({
      //       type: "info",
      //       message: "已取消删除"
      //     });
      //   });
    },

    // 新增系统
    addsysteam() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.form.menuType = '1';
          axios
            .AddMenuItem(this.form)
            .then((res) => {
              if (res.data.code === 200) {
                this.$notify({
                  type: 'success',
                  message: '添加成功!'
                });
                this.addSystemBox = false;
                this.getMenuSysList();
                this.getMenuSysList();
              } else if (res.data.code === 400) {
                this.$notify({
                  title: '提示',
                  message: res.data.message,
                  type: 'warning'
                });
              } else {
                this.$notify({
                  title: '提示',
                  message: res.data.message,
                  type: 'warning'
                });
              }
            })
            .catch();
        }
      });
      //      if (!this.form.name) {
      //      this.$notify({
      //      title: "提示",
      //    message: "请输入系统名称！",
      //  type: "warning"
      // });
      //        return false;
      //     } else if (!this.form.permission) {
      //       this.$notify({
      //        title: "提示",
      //       message: "请输入系统标识！",
      //      type: "warning"
      //   });
      //  return false;
      // } else if (!this.form.href) {
      //       this.$notify({
      //        title: "提示",
      //        message: "请输入系统地址！",
      //        type: "warning"
      //      });
      //   } else {

      //   }
    },
    addSystem() {
      this.form = {};
      this.addSystemBox = true;
    },

    handleClick(tab, event) {
      console.log(tab, event);
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    handleSelectionChange() {},
    // 查看用户
    showUser() {
      this.DetailDate = true;
    },
    // 添加用户
    shouwAddUser() {
      this.addUser = true;
    },
    //
    // 关闭
    handleDialogClose() {
      this.$refs.form.resetFields();
      this.addSystemBox = false;
      this.editInformation = false;
      this.addUser = false;
      this.toView = false;
    },

    // 点击表单删除该用户
    open2() {
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$notify({
            type: 'success',
            message: '删除成功!'
          });
        })
        .catch(() => {
          this.$notify({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    // 删除角色(无角色)
    deletUser() {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$notify({
            type: 'success',
            message: '删除成功!'
          });
        })
        .catch(() => {
          this.$notify({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    // 有角色
    alertUser() {
      this.$alert('这是一段内容', '标题名称', {
        confirmButtonText: '确定',
        callback: (action) => {
          this.$notify({
            type: 'info',
            message: `action: ${action}`
          });
        }
      });
    }
  },
  mounted() {
    this.getMenuSysList();
  },
  watch: {
    $route(newValue, oldValue) {
      this.addSystemBox = false;
    }
  }
};
</script>
<style scoped lang="scss">
.bg {
  margin: 10px 10px 0;
  background: #fff;
  border-radius: 5px;

  .tophead {
    overflow: hidden;
    .topBox {
      width: 70%;
      border: 1px solid #ccc;
      line-height: 60px;
      margin: 20px;
      float: left;
      .title {
        display: inline-block;
        height: 60px;
        background: #fff;
        padding: 0 10px;
      }
      .systemName {
        line-height: 24px;
        padding: 5px;
        border-radius: 4px;
        margin: 0 8px;
      }
    }
    .addSystem {
      line-height: 60px;
      margin: 20px;
    }
  }
  .el-textarea {
    display: inline-block;
    width: 85%;
    vertical-align: bottom;
    font-size: 14px;
  }
  .el-input {
    display: inline-block;
    width: 85%;
    vertical-align: bottom;
    font-size: 14px;
  }

  .curpoint {
    cursor: pointer;
  }
  .spanx {
    color: red;
  }
  .spanxs {
    color: #fff;
  }
  .headportraitbox {
    /* height: 280px; */
    line-height: 54px;
    width: 100%;
    position: relative;
    margin-bottom: 20px;
    .disinlne {
      display: inline-block;
    }
  }
  .lineh44 {
    height: 44px !important;
  }
  .el-row {
    margin: 20px;
    position: relative;
    .custom-box-title {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .el-col {
    line-height: 60px;
    text-align: center;
  }
  .txtcenter {
    margin-left: 99px;
  }

  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    border: 1px solid #ccc;
  }
  .grid-content {
    min-height: 60px;
  }
  .customBox {
    border: 1px solid #ccc;
    margin: 0 20px 20px 20px;
    .table-area {
      padding: 0 20px;
      .el-table {
        border: 1px solid #ccc;
      }
    }
  }
  .textcenter {
    text-align: center;
  }
  .active {
    background: #00a8e8 !important;
    border: 1px solid #00a8e8 !important;
    color: #fff;
  }
  .systemBox {
    .el-input {
      width: 84%;
    }
    .el-textarea {
      width: 84%;
    }
  }
}
</style>
