<template>
  <div class="bg aibms-color-bg">
    <div class="title aibms-bg white-color">新增权限信息</div>
    <div class="customBox non-border">
      <tree-table
        :data="menuListData"
        class="treebox"
        stripe
        :header-cell-style="{ background: '#f5f5f5' }"
      >
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
                scope.row.menuType == '1'
                  ? '系统'
                  : scope.row.menuType == '2'
                  ? '菜单'
                  : scope.row.menuType == '3'
                  ? '按钮'
                  : '数据项'
              }}</el-button
            >
          </template>
        </el-table-column>
        <el-table-column label="权限标识">
          <template slot-scope="scope">
            <span>{{ scope.row.permission }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="260px;">
          <template slot-scope="scope">
            <el-button
              :type="'success'"
              plain
              size="small"
              @click="modifyItem(1, scope.row)"
              v-if="scope.row.menuType == '1' || scope.row.menuType == '2'"
              >{{ '新增子菜单' }}</el-button
            >
            <el-button
              :type="'warning'"
              plain
              size="small"
              @click="modifyItem(2, scope.row)"
              v-if="scope.row.menuType == '2'"
              >{{ '新增按钮' }}</el-button
            >
            <!-- 新增子菜单弹出框 -->
            <!-- <el-dialog title="新增菜单" :visible.sync="dialogFormVisible2" :modal="false"> -->
            <el-dialog
              center
              title="新增菜单"
              size="tiny"
              :visible.sync="dialogFormVisible2"
              :before-close="handleDialogClose"
            >
              <el-form :model="menuForm" ref="form" :rules="rules">
                <div>
                  <el-form-item
                    prop="name"
                    label="菜单名称"
                    :label-width="formLabelWidth"
                    class="disinlne"
                    style="width: 100%"
                  >
                    <el-input
                      v-model="menuForm.name"
                      autocomplete="off"
                      maxlength="10"
                      :input="inputFun(menuForm.name)"
                    ></el-input>
                    <span>{{ menuNameLength }}</span
                    >/
                    <span :class="menuNameLength > 10 ? 'colorRed' : ''">{{
                      totalNum
                    }}</span>
                  </el-form-item>
                </div>
                <div>
                  <el-form-item
                    prop="permission"
                    label="菜单标识"
                    :label-width="formLabelWidth"
                    class="disinlne"
                    style="width: 100%"
                  >
                    <el-input
                      v-model="menuForm.permission"
                      maxlength="30"
                      autocomplete="off"
                      :input="inputFun1(menuForm.permission)"
                    ></el-input>
                    <span>{{ menuPermissionLength }}</span
                    >/
                    <span
                      :class="menuPermissionLength > 30 ? 'colorRed' : ''"
                      >{{ permissionTotalNum }}</span
                    >
                  </el-form-item>
                </div>
                <div>
                  <el-form-item
                    label="菜单地址"
                    prop="href"
                    :label-width="formLabelWidth"
                    class="disinlne"
                    style="width: 100%"
                  >
                    <el-input
                      v-model="menuForm.href"
                      autocomplete="off"
                    ></el-input>
                  </el-form-item>
                </div>
                <div>
                  <el-form-item
                    label="菜单图标"
                    :label-width="formLabelWidth"
                    class="disinlne"
                    style="width: 96%"
                  >
                    <div>
                      <icon-svg
                        class="iconfont"
                        :icon-class="menuForm.icon"
                        style="font-size: 20px; margin-left: 8px"
                      ></icon-svg>
                    </div>
                    <div class="block-icon-box">
                      <span
                        v-for="(icon, index) in iconList"
                        @click="selectIcon(menuForm, iconList[index])"
                        :key="index"
                      >
                        <icon-svg
                          :icon-class="iconList[index]"
                          class="block-icon-item iconfont"
                        />
                      </span>

                      <!-- <i
                        v-for="(icon, index) in iconList"
                        class="block-icon-item iconfont"
                        :class="iconList[index]"
                        :key="index"
                        @click="selectIcon(menuForm, iconList[index])"
                      ></i> -->
                    </div>
                  </el-form-item>
                </div>
              </el-form>
              <div slot="footer" class="dialog-footer txtcenter">
                <el-button type="primary" @click="saveMenu(menuForm)"
                  >保存</el-button
                >
                <el-button @click="cancle()">取 消</el-button>
              </div>
            </el-dialog>
            <!-- 新建按钮弹出框 -->
            <el-dialog
              center
              :visible.sync="dialogFormVisible3"
              :before-close="handleDialogClose2"
            >
              <!-- <el-dialog :visible.sync="dialogFormVisible3" :modal="false"> -->
              <el-tabs
                v-model="activeName2"
                type="card"
                @tab-click="handleClick"
              >
                <el-tab-pane label="新增按钮" name="first">
                  <el-form :model="menuForm2" ref="form2" :rules="rules2">
                    <div>
                      <el-form-item
                        label="按钮名称"
                        prop="name"
                        class="disinlne"
                        style="width: 90%"
                      >
                        <el-input
                          v-model="menuForm2.name"
                          autocomplete="off"
                          maxlength="10"
                          style="width: 400px"
                          :input="inputFun2(menuForm2.name)"
                        ></el-input>
                        <span>{{ btnNameLength }}</span
                        >/
                        <span :class="btnNameLength > 10 ? 'colorRed' : ''">{{
                          btnTotalNum
                        }}</span>
                      </el-form-item>
                    </div>
                    <div>
                      <el-form-item
                        label="按钮标识"
                        prop="permission"
                        class="disinlne"
                        style="width: 90%"
                      >
                        <el-input
                          v-model="menuForm2.permission"
                          autocomplete="off"
                          maxlength="30"
                          :input="inputFun3(menuForm2.permission)"
                          style="width: 400px"
                        ></el-input>
                        <span>{{ btnPermissionLength }}</span
                        >/
                        <span
                          :class="btnPermissionLength > 30 ? 'colorRed' : ''"
                          >{{ btnPermissionTotalNum }}</span
                        >
                      </el-form-item>
                    </div>
                    <div>
                      <el-form-item
                        label="跳转地址"
                        prop="pass"
                        class="disinlne mrg"
                        style="width: 90%"
                      >
                        <el-input
                          v-model="menuForm2.href"
                          autocomplete="off"
                          maxlength="30"
                          style="width: 400px"
                        ></el-input>
                      </el-form-item>
                    </div>
                    <div class="dialog-footer txtcenter">
                      <el-button type="primary" @click="saveBtn(menuForm2, 'n')"
                        >保存</el-button
                      >
                      <el-button @click="cancle()">取 消</el-button>
                    </div>
                  </el-form>
                </el-tab-pane>
                <!-- <el-tab-pane label="新增数据项" name="second">
                      <el-form :model="menuForm" >
                  <div style="width:80%" class="mgr44">
                <span class="spanx disinlne">*</span>
                      <el-form-item label="数据项名称" prop="pass" class="disinlne" style="width:90%" >
                        <el-input   v-model="menuForm3.name" autocomplete="off" maxlength='10' style="width:400px"></el-input>
                      </el-form-item>
                    </div>
                    <div style="width:80%" class="mgr44">
                <span class="spanx disinlne">*</span>
                      <el-form-item label="数据项标识" prop="pass" class="disinlne" style="width:90%" >
                        <el-input   v-model="menuForm3.permission" autocomplete="off" maxlength='30' style="width:400px"></el-input>
                      </el-form-item>
                    </div>
                     <div class="dialog-footer txtcenter">
                  <el-button type="primary" @click="saveBtn(menuForm3,'s')">保存</el-button>
                  <el-button @click="cancle()">取 消</el-button>
                </div>
                </el-form>

                </el-tab-pane>-->
              </el-tabs>
            </el-dialog>
            <!-- <el-button
              :type="scope.row.menuType=='2'?'success':'warning'"
              plain
              size="small"
              v-if="scope.row.menuType != '1'"
              @click="deleteMenu(scope.row.menuId,scope.row)">
                {{scope.row.menuType=='2'?'删除子菜单':'删除'}}
            </el-button>-->
          </template>
        </el-table-column>
        <el-table-column label="位置修改">
          <template slot-scope="scope">
            <el-button
              class="nomal-button"
              v-if="!scope.row.first"
              @click="upMove(scope.row)"
              >上移</el-button
            >
            <el-button
              class="nomal-button"
              v-if="!scope.row.last"
              @click="downMove(scope.row)"
              >下移</el-button
            >
          </template>
        </el-table-column>
      </tree-table>
    </div>
    <!-- 新增系统 -->
  </div>
</template>
<script>
import treeTable from '../../treeTable';
import axios from '@/api';
import { icons } from '../../../utils/Icons'; // 引入图标
export default {
  name: 'MoreOperation',
  components: { treeTable },
  data() {
    return {
      //        btnNullNotice:false,
      //        nullNotice:false,\
      rules: {
        name: [
          { required: true, message: '请输入系统名称！', trigger: 'blur' }
        ],
        permission: [
          { required: true, message: '请输入系统标识！', trigger: 'blur' }
        ],
        href: [{ required: true, message: '请输入系统地址！', trigger: 'blur' }]
      },
      rules2: {
        name: [
          { required: true, message: '请输入按钮名称！', trigger: 'blur' }
        ],
        permission: [
          { required: true, message: '请输入按钮标识！', trigger: 'blur' }
        ],
        pass: [{ required: true, message: '请输入跳转地址！', trigger: 'blur' }]
      },
      btnPermissionLength: 0,
      btnPermissionTotalNum: 30,
      btnNameLength: 0,
      btnTotalNum: 10,
      menuPermissionLength: 0,
      permissionTotalNum: 30,
      activeName2: 'first',
      editLoading: false,
      form: {
        name: '',
        address: '',
        date: ''
      },
      columns: [
        {
          text: '名称',
          value: 'description',
          width: 200,
          option: 'sonData1'
        },
        {
          text: '类型',
          value: 'sonData1',
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

      menuListData: [],
      // 菜单弹出框(menuType=2)
      dialogFormVisible2: false,
      // 按钮弹出框(menuType=3)
      dialogFormVisible3: false,
      formLabelWidth: '120px',
      menuNameLength: 0,
      totalNum: 10,
      // 图标选择
      // menuIcons: [
      //   'fa-address-card',
      //   'fa-address-book-o',
      //   'fa-address-book',
      //   'fa-address-card-o',
      //   'fa-anchor',
      //   'fa-archive',
      //   'fa-area-chart',
      //   'fa-bank',
      //   'fa-bell',
      //   'fa-briefcase',
      //   'fa-calendar-o',
      //   'fa-check-square-o',
      //   'fa-check',
      //   'fa-check-square',
      //   'fa-check-circle-o',
      //   'fa-clock-o',
      //   'fa-ban',
      //   'fa-bar-chart',
      //   'fa-bars',
      //   'fa-book',
      //   'fa-bookmark',
      //   'fa-bookmark-o',
      //   'fa-bug',
      //   'fa-bullseye'
      // ],
      menuForm: {},
      menuForm2: {},
      menuForm3: {}
    };
  },
  computed: {
    iconList() {
      let icon = icons.map(item => item.split('-')[1])
      return icon;
    }
  },
  methods: {
    getAuth(data) {
      let opt = [];
      data.forEach(val => {
        opt.push(val.id);
        if (val.children) {
          val.children.forEach(el => {
            console.log(val.id);
            if (el.selectchecked.length) {
              opt.push(el.id);
              opt.push(el.selectchecked);
            }
          });
        }
      });
    },

    handleClick(tab, event) {
      console.log(tab, event);
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    handleSelectionChange() { },
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
      this.dialogFormVisible2 = false;
      this.addSystemBox = false;
      this.editInformation = false;
      this.addUser = false;
      this.toView = false;
    },
    handleDialogClose2() {
      this.$refs.form2.resetFields();
      this.dialogFormVisible3 = false;
      this.addSystemBox = false;
      this.editInformation = false;
      this.addUser = false;
      this.toView = false;
    },
    // 获取菜单列表
    getMenuList() {
      let systemId = this.$route.query.id;
      this.systemId = 'menuId=' + systemId;
      console.log(systemId);
      axios.menuList(this.systemId)
        .then(res => {
          res.data.data.result.forEach(item => {
            if (item.menuId === systemId) {
              this.menuListData = res.data.data.result;
            }
          });
          console.log(this.menuListData);
          this.menuListData[0].first = true;
          let length1 = this.menuListData.length;
          this.menuListData[length1 - 1].last = true;
          let menulistArr = [];
          for (let i in this.menuListData) {
            menulistArr.push(this.menuListData[i]);
          }
          this.loopMenu(menulistArr);
        })
        .catch();
    },
    // 修改菜单
    modifyItem(n, sp) {
      this.menuForm = {
        href: '',
        icon: '',
        permission: '',
        name: '',
        parentId: '',
        menuType: '2'
      };
      this.menuForm2 = {
        href: '',
        name: '',
        permission: '',
        parentId: '',
        menuType: '3'
      };
      this.menuForm3 = {
        name: '',
        menuType: '4',
        parentId: '',
        permission: ''
      };
      console.log(sp);
      if (n === 1) {
        this.dialogFormVisible2 = true;
        this.menuForm.parentId = sp.menuId;
      } else if (n === 2) {
        this.dialogFormVisible3 = true;
        this.menuForm2.parentId = sp.menuId;
        this.menuForm3.parentId = sp.menuId;
      }
      // this.selectedIcon = menuRow.icon
    },
    // 选择图标
    selectIcon(menu, icon) {
      console.log(menu, icon)
      menu.icon = icon;
    },
    // 修改后保存-按钮
    saveBtn(menu, n) {
      if (menu.name.length === 0) {
        this.$notify({
          title: '提示',
          message: '按钮名称不能为空',
          type: 'warning'
        });
      } else if (menu.href.length === 0) {
        this.$notify({
          title: '提示',
          message: '跳转地址不能为空',
          type: 'warning'
        });
      } else if (menu.permission.length === 0) {
        this.$notify({
          title: '提示',
          message: '按钮标识不能为空',
          type: 'warning'
        });
      } else {
        if (n === 'n') {
          axios.AddMenuItem(menu)
            .then(res => {
              if (res.data.code === 200) {
                this.$notify({
                  title: '提示',
                  message: '添加成功',
                  type: 'success'
                });
                this.dialogFormVisible3 = false;
                this.getMenuList();
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
                  type: 'error'
                });
              }
              this.getMenuList();
            })
            .catch();
        } else if (n === 's') {
          axios.AddMenuItem(menu)
            .then(res => {
              if (res.data.code === 200) {
                this.$notify({
                  title: '提示',
                  message: '添加成功',
                  type: 'success'
                });
                this.dialogFormVisible3 = false;
                this.getMenuList();
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
                  type: 'error'
                });
              }
            })
            .catch();
        }
      }
    },
    // 修改后保存-菜单
    saveMenu(menu) {
      this.$refs.form.validate(valid => {
        if (valid) {
          axios.AddMenuItem(menu)
            .then(res => {
              if (res.data.code === 200) {
                this.$notify({
                  title: '提示',
                  message: '添加成功',
                  type: 'success'
                });
                this.dialogFormVisible2 = false;
                this.getMenuList();
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
                  type: 'error'
                });
              }
            })
            .catch();
        }
      });
      //    if (menu.name == "") {
      //       this.$notify({
      //        title: "提示",
      //        message: "菜单名称不能为空",
      ///        type: "warning"
      //      });
      //    } else if (menu.permission == "") {
      //      this.$notify({
      //       title: "提示",
      //         message: "菜单标识不能为空",
      //        type: "warning"
      //      });
      //    } else if (menu.href == "") {
      //      this.$notify({
      //       title: "提示",
      //        message: "菜单地址不能为空",
      //       type: "warning"
      //      });
      //    } else if (menu.icon == "") {
      //       this.$notify({
      //         title: "提示",
      //       message: "菜单图标不能为空",
      //         type: "warning"
      //      });
      //    } else {

      //  }
    },
    // 修改取消
    cancle() {
      this.dialogFormVisible2 = false;
      this.dialogFormVisible3 = false;
    },
    // 实时显示输入框已输入字数
    inputFun(value) {
      if (value) {
        this.menuNameLength = value.length;
      } else {
        this.menuNameLength = 0;
      }
    },
    inputFun1(value) {
      if (value) {
        this.menuPermissionLength = value.length;
      } else {
        this.menuPermissionLength = 0;
      }
    },
    inputFun2(value) {
      if (value) {
        this.btnNameLength = value.length;
      } else {
        this.btnNameLength = 0;
      }
    },

    inputFun3(value) {
      if (value) {
        this.btnPermissionLength = value.length;
      } else {
        this.btnPermissionLength = 0;
      }
    },

    loopMenu(menuArr) {
      menuArr.forEach(item => {
        if (item.children[0]) {
          item.children[0].first = true;
          let length = item.children.length;
          item.children[length - 1].last = true;
          this.loopMenu(item.children);
        }
      });
    },
    // 上移操作处理，调用接口
    upMoveApi(menu, parentArr) {
      parentArr.forEach((item, index) => {
        if (item.menuId === menu.menuId) {
          if (index !== 0) {
            // index为0时，不能上移
            let params = {
              menuId1: menu.menuId,
              sort1: parentArr[index - 1].sort,
              // "name": menu.name,
              menuId2: parentArr[index - 1].menuId,
              sort2: menu.sort
              // "name2": parentArr[index-1].name,
            };
            axios.moveItem(params).then(res => {
              console.log(res);
              if (res.status === 200) {
                this.getMenuList();
              } else {
                this.$notify({
                  title: '提示',
                  message: res.data.message,
                  type: 'error'
                });
              }
            });
          }
        }
      });
    },
    // 下移操作处理，调用接口
    downMoveApi(menu, parentArr, parentArrLen) {
      parentArr.forEach((item, index) => {
        if (item.menuId === menu.menuId) {
          if (index !== parentArrLen - 1) {
            // 如果是数组中最后一位，则不可以下移
            let params = {
              menuId1: menu.menuId,
              sort1: parentArr[index + 1].sort,
              // "name": menu.name,
              menuId2: parentArr[index + 1].menuId,
              sort2: menu.sort
              // "name2": parentArr[index+1].name,
            };
            axios.moveItem(params).then(res => {
              if (res.status === 200) {
                this.getMenuList();
              } else {
                this.$notify({
                  title: '提示',
                  message: res.data.message,
                  type: 'error'
                });
              }
            });
          }
        }
      });
    },
    upMove(menu) {
      console.log(menu);
      if (menu.parent) {
        let parentArr = menu.parent.children;
        this.upMoveApi(menu, parentArr);
      } else {
        let parentArr = this.menuListData;
        this.upMoveApi(menu, parentArr);
      }
    },
    // 点击下移
    downMove(menu) {
      if (menu.parent) {
        let parentArr = menu.parent.children;
        let parentArrLen = parentArr.length;
        this.downMoveApi(menu, parentArr, parentArrLen);
      } else {
        let parentArr = this.menuListData;
        let parentArrLen = parentArr.length;
        this.downMoveApi(menu, parentArr, parentArrLen);
      }
    }
  },
  mounted() {
    this.getMenuList();
  },
  watch: {
    $route(newValue, oldValue) {
      this.dialogFormVisible2 = false;
      this.dialogFormVisible3 = false;
    }
  }
};
</script>
<style scoped lang="scss">
.bg {
  margin: 10px;
  background: #fff;
  border-radius: 5px;

  .title {
    height: 60px;
    line-height: 60px;
    background: #d3dce6;
    text-indent: 30px;
  }
  .customBox {
    border: 1px solid #ccc;
    margin: 20px;
  }

  .topBox {
    width: 70%;
    border: 1px solid #ccc;
    line-height: 60px;
    margin: 20px;
    float: left;
    .title {
      display: inline-block;
      height: 60px;
      background: #ccc;
      padding: 0 10px;
    }
  }
  .mgl44 {
    margin-left: 44px;
  }
  .mgr40 {
    margin-right: -40px;
  }
  .el-input {
    position: relative;
    font-size: 14px;
    display: inline-block;
    width: 90%;
  }
  .disinlne {
    display: inline-block;

    .block-icon-box {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: flex-start;
      align-items: center;
      .block-icon-item {
        font-size: 18px;
        margin: 3px 8px;
      }
    }
  }
  .el-row {
    margin: 20px;
    width: 80%;
  }
  .el-col {
    line-height: 60px;
    text-align: center;
  }
  .footer {
    text-align: right;
    width: 80%;
    margin-bottom: 60px;
  }
  .colorRed {
    color: red;
  }
  .fa {
    margin: 10px;
  }
  .txtcenter {
    text-align: center !important;
  }
}

// .bg-purple {
//   background: #d3dce6;
// }
// .bg-purple-light {
//   border: 1px solid #ccc;
// }
// .grid-content {
//   min-height: 60px;
// }

// .top {
//   overflow: hidden;
// }
// .systemName {
//   line-height: 40px;
//   padding: 5px;
//   border: 1px solid #ccc;
//   border-radius: 4px;
//   margin: 0 8px;
// }
// .addSystem {
//   line-height: 60px;
//   margin: 20px;
// }
// .informationBox {
//   width: 40%;
//   margin: 20px;
// }
</style>
