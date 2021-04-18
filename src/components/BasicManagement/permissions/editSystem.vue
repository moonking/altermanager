<template>
  <div class="bg aibms-color-bg">
    <div class="title aibms-bg white-color">修改系统权限信息</div>
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
        <el-table-column label="操作" width="230px;">
          <template slot-scope="scope">
            <el-button
              :type="
                scope.row.menuType == '1'
                  ? 'primary'
                  : scope.row.menuType == '2'
                  ? 'success'
                  : 'warning'
              "
              plain
              size="small"
              @click="modifyItem(scope.row)"
              >{{
                scope.row.menuType == '1'
                  ? '修改系统'
                  : scope.row.menuType == '2'
                  ? '修改子菜单'
                  : '修改'
              }}</el-button
            >
            <!--   <el-dialog title="修改系统基本信息" :visible.sync="dialogFormVisible1" :modal="false"> -->
            <el-dialog
              center
              title="修改系统基本信息"
              :visible.sync="dialogFormVisible1"
              :before-close="handleDialogClose"
            >
              <el-form :model="menuForm" ref="form" :rules="rules">
                <div>
                  <el-form-item
                    label="系统名称"
                    prop="name"
                    :label-width="formLabelWidth"
                    style="width: 96%"
                    class="disinlne"
                  >
                    <el-input
                      v-model="menuForm.name"
                      autocomplete="off"
                      maxlength="10"
                      :input="inputFun(menuForm.name)"
                    ></el-input>
                    <span>{{ menuNameLength }}</span
                    >/
                    <span>{{ totalNum }}</span>
                  </el-form-item>
                </div>
                <div>
                  <el-form-item
                    label="系统标识"
                    prop="permission"
                    :label-width="formLabelWidth"
                    style="width: 96%"
                    class="disinlne"
                  >
                    <el-input
                      v-model="menuForm.permission"
                      disabled="disabled"
                      autocomplete="off"
                    ></el-input>
                  </el-form-item>
                </div>
                <div>
                  <el-form-item
                    label="系统地址"
                    prop="href"
                    :label-width="formLabelWidth"
                    style="width: 96%"
                    class="disinlne"
                  >
                    <el-input
                      v-model="menuForm.href"
                      autocomplete="off"
                    ></el-input>
                  </el-form-item>
                </div>
                <el-form-item
                  label="系统描述"
                  :label-width="formLabelWidth"
                  style="width: 96%"
                >
                  <el-input
                    v-model="menuForm.remarks"
                    autocomplete="off"
                    maxlength="50"
                    :input="inputFun1(menuForm.remarks)"
                  ></el-input>
                  <span>{{ sysDesLength }}</span
                  >/
                  <span>{{ sysTotalNum }}</span>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer txtcenter">
                <el-button type="primary" @click="saveSys(menuForm)"
                  >保存</el-button
                >
                <el-button @click="cancle()">取 消</el-button>
              </div>
            </el-dialog>
            <!-- <el-dialog title="新增菜单" :visible.sync="dialogFormVisible2" :modal="false"> -->
            <el-dialog
              center
              title="修改菜单"
              :visible.sync="dialogFormVisible2"
              :before-close="handleDialogClose2"
            >
              <el-form :model="menuForm" ref="form2" :rules="rules2">
                <div>
                  <el-form-item
                    label="菜单名称"
                    :label-width="formLabelWidth"
                    prop="name"
                    style="width: 96%"
                    class="disinlne"
                  >
                    <el-input
                      v-model="menuForm.name"
                      autocomplete="off"
                      maxlength="10"
                    ></el-input>
                    <span>{{ menuNameLength }}</span
                    >/
                    <span>{{ totalNum }}</span>
                  </el-form-item>
                </div>
                <div>
                  <el-form-item
                    label="菜单标识"
                    prop="permission"
                    :label-width="formLabelWidth"
                    style="width: 96%"
                    class="disinlne"
                  >
                    <el-input
                      v-model="menuForm.permission"
                      disabled="disabled"
                      autocomplete="off"
                    ></el-input>
                  </el-form-item>
                </div>
                <div>
                  <el-form-item
                    label="菜单地址"
                    prop="href"
                    :label-width="formLabelWidth"
                    style="width: 96%"
                    class="disinlne"
                  >
                    <el-input
                      v-model="menuForm.href"
                      autocomplete="off"
                    ></el-input>
                  </el-form-item>
                </div>
                <el-form-item label="菜单图标" :label-width="formLabelWidth">
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
              </el-form>
              <div slot="footer" class="dialog-footer txtcenter">
                <el-button type="primary" @click="saveMenu(menuForm)"
                  >保存</el-button
                >
                <el-button @click="cancle()">取 消</el-button>
              </div>
            </el-dialog>
            <!-- <el-dialog title="修改按钮" :visible.sync="dialogFormVisible3" :modal="false"> -->
            <el-dialog
              center
              title="修改按钮"
              :visible.sync="dialogFormVisible3"
              :before-close="handleDialogClose3"
            >
              <el-form :model="menuForm" ref="form3" :rules="rules3">
                <div>
                  <el-form-item
                    label="按钮名称"
                    :label-width="formLabelWidth"
                    style="width: 96%"
                    class="disinlne"
                    prop="name"
                  >
                    <el-input
                      v-model="menuForm.name"
                      autocomplete="off"
                      maxlength="10"
                    ></el-input>
                    <span>{{ menuNameLength }}</span
                    >/
                    <span>{{ totalNum }}</span>
                  </el-form-item>
                </div>
                <div>
                  <span class="spanx disinlne mgr40">*</span>
                  <el-form-item
                    label="按钮标识"
                    :label-width="formLabelWidth"
                    style="width: 96%"
                    class="disinlne"
                  >
                    <el-input
                      disabled="disabled"
                      v-model="menuForm.permission"
                      autocomplete="off"
                    ></el-input>
                  </el-form-item>
                </div>
                <div>
                  <el-form-item
                    label="跳转地址"
                    :label-width="formLabelWidth"
                    style="width: 96%"
                    class="disinlne"
                    prop="href"
                  >
                    <el-input
                      v-model="menuForm.href"
                      autocomplete="off"
                    ></el-input>
                  </el-form-item>
                </div>
              </el-form>
              <div slot="footer" class="dialog-footer txtcenter">
                <el-button type="primary" @click="saveBtn(menuForm)"
                  >保存</el-button
                >
                <el-button @click="cancle()">取 消</el-button>
              </div>
            </el-dialog>
            <el-button
              :type="scope.row.menuType == '2' ? 'success' : 'warning'"
              plain
              size="small"
              v-if="scope.row.menuType != '1'"
              @click="deleteMenu(scope.row.menuId, scope.row)"
              >{{
                scope.row.menuType == '2' ? '删除子菜单' : '删除'
              }}</el-button
            >
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
    <div class="footer"></div>

    <!-- 新增系统 -->
  </div>
</template>
<script>
import treeTable from '../../treeTable'
import router from '../../../router'
import { icons } from '../../../utils/Icons' // 引入图标x
import axios from '@/api';
export default {
  name: 'MoreOperation',
  components: { treeTable },
  data() {
    return {
      rules: {
        name: [
          { required: true, message: '请输入系统名称！', trigger: 'blur' }
        ],
        href: [{ required: true, message: '请输入系统地址！', trigger: 'blur' }]
      },
      rules2: {
        name: [
          { required: true, message: '请输入菜单名称！', trigger: 'blur' }
        ],
        href: [{ required: true, message: '请输入菜单地址！', trigger: 'blur' }]
      },
      rules3: {
        name: [
          { required: true, message: '请输入按钮名称！', trigger: 'blur' }
        ],
        href: [{ required: true, message: '请输入按钮地址！', trigger: 'blur' }]
      },
      editLoading: false,
      systemId: '',
      oldname: '',
      apipath: [],
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
      data: [
        {
          type: 0,
          id: '1',
          description: '基础管理',
          sonData1: [
            {
              type: 2,
              description: '系统',
              parentId: '6',
              id: '7'
            }
          ],
          children: [
            {
              type: 1,
              id: 6,
              description: '角色管理',
              parentId: '-1',
              checked: false,
              selectchecked: ['7'],
              checkAll: false,
              isIndeterminate: false,
              sonData1: [
                {
                  type: 3,
                  description: '菜单',
                  parentId: '6',
                  checked: false,
                  id: '7'
                }
              ],
              children: [
                {
                  type: 1,
                  id: 6,
                  description: '批量删除',
                  parentId: '-1',
                  checked: false,
                  selectchecked: ['7'],
                  checkAll: false,
                  isIndeterminate: false,
                  sonData1: [
                    {
                      type: 4,
                      description: '按钮',
                      parentId: '6',
                      checked: false,
                      id: '7'
                    }
                  ]
                },
                {
                  type: 1,
                  id: 6,
                  description: '添加',
                  parentId: '-1',
                  checked: false,
                  selectchecked: ['7'],
                  checkAll: false,
                  isIndeterminate: false,
                  sonData1: [
                    {
                      type: 4,
                      description: '按钮',
                      parentId: '6',
                      checked: false,
                      id: '7'
                    }
                  ]
                },
                {
                  type: 1,
                  id: 6,
                  description: '修改',
                  parentId: '-1',
                  checked: false,
                  selectchecked: ['7'],
                  checkAll: false,
                  isIndeterminate: false,
                  sonData1: [
                    {
                      type: 4,
                      description: '按钮',
                      parentId: '6',
                      checked: false,
                      id: '7'
                    }
                  ]
                }
              ]
            },
            {
              type: 1,
              id: 6,
              description: '用户管理',
              parentId: '-1',
              checked: false,
              selectchecked: ['7'],
              checkAll: false,
              isIndeterminate: false,
              sonData1: [
                {
                  type: 3,
                  description: '菜单',
                  parentId: '6',
                  checked: false,
                  id: '7'
                }
              ]
            },
            {
              type: 1,
              id: 6,
              description: '角色管理',
              parentId: '-1',
              checked: false,
              selectchecked: ['7'],
              checkAll: false,
              isIndeterminate: false,
              sonData1: [
                {
                  type: 3,
                  description: '菜单',
                  parentId: '6',
                  checked: false,
                  id: '7'
                }
              ]
            }
          ]
        }
      ],
      editedName: '',
      userId: '',
      menuListData: [],
      dialogFormVisible2: false,
      dialogFormVisible3: false,
      dialogFormVisible1: false,
      formLabelWidth: '120px',
      menuName: '',
      menuNameLength: 0,
      sysDesLength: 0,
      totalNum: 10,
      sysTotalNum: 50,
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
      selectedIcon: '',
      menuForm: ''
    }
  },
  computed: {
    iconList() {
      let icon = icons.map(item => item.split('-')[1])
      return icon;
    }
  },
  methods: {
    // 获取权限
    getAuth(data) {
      let opt = []
      data.forEach(val => {
        opt.push(val.id)
        if (val.children) {
          val.children.forEach(el => {
            console.log(val.id)
            if (el.selectchecked.length) {
              opt.push(el.id)
              opt.push(el.selectchecked)
            }
          })
        }
      })
    },

    handleClick(tab, event) {
      console.log(tab, event)
    },
    // 分页
    handleCurrentChange(val) {
      this.currentRow = val
    },
    handleSelectionChange() { },
    // 查看用户
    showUser() {
      this.DetailDate = true
    },
    // 添加用户
    shouwAddUser() {
      this.addUser = true
    },

    // 关闭
    handleDialogClose() {
      this.$refs.form.resetFields()
      this.dialogFormVisible1 = false
      this.addSystemBox = false
      this.editInformation = false
      this.addUser = false
      this.toView = false
    },
    // 关闭
    handleDialogClose2() {
      this.$refs.form2.resetFields()
      this.dialogFormVisible2 = false
      this.addSystemBox = false
      this.editInformation = false
      this.addUser = false
      this.toView = false
    },
    // 关闭
    handleDialogClose3() {
      this.$refs.form3.resetFields()
      this.dialogFormVisible3 = false
      this.addSystemBox = false
      this.editInformation = false
      this.addUser = false
      this.toView = false
    },
    // 遍历循环该menuTpye中首项和尾项的，设置不显示
    loopMenu(menuArr) {
      menuArr.forEach(item => {
        if (item.children[0]) {
          item.children[0].first = true
          let length = item.children.length
          item.children[length - 1].last = true
          this.loopMenu(item.children)
        }
      })
    },

    // 获取菜单列表
    getMenuList() {
      let systemId = this.$route.query.id
      this.systemId = 'menuId=' + systemId
      axios.menuList(this.systemId)
        .then(res => {
          this.menuListData = res.data.data.result // 获取数据
          console.log(this.menuListData)
          // 判断数据项的第一位和最后一位。让其上移或下移不显示
          this.menuListData[0].first = true
          let length1 = this.menuListData.length
          this.menuListData[length1 - 1].last = true
          let menulistArr = []
          for (let i in this.menuListData) {
            menulistArr.push(this.menuListData[i])
          }
          this.loopMenu(menulistArr)
          console.log(this.$store.state.sides)
        })
        .catch()
    },
    // 判断点击按钮，来显示对应的弹出框（子菜单，系统，按钮）
    modifyItem(menuRow) {
      if (menuRow.menuType === '2') {
        this.dialogFormVisible2 = true
      } else if (menuRow.menuType === '3') {
        this.dialogFormVisible3 = true
      } else if (menuRow.menuType === '1') {
        this.dialogFormVisible1 = true
      }
      // this.selectedIcon = menuRow.icon
      this.menuForm = {
        href: menuRow.href,
        icon: menuRow.icon,
        menuId: menuRow.menuId,
        menuType: menuRow.menuType,
        name: menuRow.name,
        parentId: menuRow.parentId,
        permission: menuRow.permission,
        remarks: menuRow.remarks,
        sort: menuRow.sort
      }
      this.menuNameLength = this.menuForm.name.length
      this.sysDesLength = this.menuForm.remarks.length
      this.oldname = menuRow.name
    },
    // 删除
    deleteMenu(menuId, row) {
      console.log(menuId)
      this.$confirm('此删除操作将被保存, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          axios.DelMenuItem(menuId).then(res => {
            console.log(res)
            //    this.$message({
            //     type: 'success',
            //     message: '删除成功!'
            // });
            // this.getMenuList();
            if (res.data.code === 200) {
              this.$notify({
                title: '提示',
                message: '删除成功',
                type: 'success'
              })
              this.getMenuList()
            } else {
              this.$notify({
                title: '提示',
                message: res.data.message,
                type: 'error'
              })
            }
          })
        })
        .catch(() => { })
    },
    // 选择图标
    selectIcon(menu, icon) {
      menu.icon = icon
    },
    // 修改按钮保存
    saveBtn(menu) {
      this.$refs.form3.validate(valid => {
        if (valid) {
          this.dialogFormVisible3 = false
          axios.updateMenuItem(menu.menuId, menu)
            .then(res => {
              if (res.data.code === 200) {
                this.$notify({
                  title: '提示',
                  message: '修改成功',
                  type: 'success'
                })

                this.getMenuList()
              } else {
                this.$notify({
                  title: '提示',
                  message: res.data.message,
                  type: 'error'
                })
              }
            })
            .catch()
        }
      })
    },
    // 修改菜单保存
    saveMenu(menu) {
      this.$refs.form2.validate(valid => {
        if (valid) {
          axios.updateMenuItem(menu.menuId, menu)
            .then(res => {
              if (res.data.code === 200) {
                this.$notify({
                  title: '提示',
                  message: '修改成功',
                  type: 'success'
                })
                this.dialogFormVisible2 = false
                this.getMenuList()
                this.userId = localStorage.getItem('userId')
                this.getLoginerMenu(this.userId)

                this.editedName = menu.name
                this.$store.dispatch('editMenu', this.editedName)
                // console.log(menu.name);
                // console.log( this.$store.state.menuName);
                let arr = this.$store.state.sides
                arr.newname = menu.name
                arr.oldname = this.oldname
                // console.log(arr)
                this.$store.dispatch('GET_SIDE', arr)
              } else if (res.data.code === 400) {
                this.$notify({
                  title: '提示',
                  message: res.data.message,
                  type: 'warning'
                })
                return false
              } else {
                this.$notify({
                  title: '提示',
                  message: res.data.message,
                  type: 'error'
                })
                return false
              }
            })
            .catch()
        }
      })
      //   if (menu.name.length == 0 || menu.href.length == 0) {
      //    this.$notify({
      //        title: "提示",
      //        message: "菜单名称或者菜单地址不能为空",
      //        type: "warning"
      //      });
      //       return;
      //     }
    },
    //   getnewtags(){
    //       for(var i = 0 ;i<router.options.routes.length;i++){
    //                   for(var j = 0 ;j<this.apipath.length;j++){
    //                       if(router.options.routes[i].path == this.apipath[j].path){
    //                           router.options.routes[i].meta.title=this.apipath[j].name
    //                       }
    //                   }
    //               }
    // },
    // 递归添加路径和名称
    getcpath(item) {
      item.forEach(item => {
        if (item.href.indexOf('?') > -1) {
          this.apipath.push({ path: item.href.split('?')[0], name: item.name })
        } else {
          this.apipath.push({ path: item.href, name: item.name })
        }
        if (item.children && item.children.length > 0) {
          this.getcpath(item.children)
        }
      })
    },
    // 递归选择登录目录
    getLoginerMenu(userId) {
      let payload = {}
      axios.getLoginMenu(userId).then(res => {
        res.data.data.menus.forEach(item => {
          if (item.href.indexOf('?') > -1) {
            this.apipath.push({
              path: item.href.split('?')[0],
              name: item.name
            })
          } else {
            this.apipath.push({ path: item.href, name: item.name })
          }
          if (item.children && item.children.length > 0) {
            this.getcpath(item.children)
          }
        })
        payload.router = router.options.routes
        payload.path = this.apipath
        payload.href = this.menuForm.href
        payload.name = this.menuForm.name
        // console.log(payload);
        if (res.status === '200') {
          this.$store.dispatch('GET_TAGSLIST', payload)
        }
      })
    },
    // 修改系统保存
    saveSys(menu) {
      // console.log(this.$store.state.sides,menu.name)
      // console.log(this.$store.state.sides.arr[0])
      this.$refs.form.validate(valid => {
        if (valid) {
          axios.updateMenuItem(menu.menuId, menu)
            .then(res => {
              // console.log(res);
              if (res.data.code === 200) {
                this.$notify({
                  title: '提示',
                  message: '修改成功',
                  type: 'success'
                })
                this.dialogFormVisible1 = false
                this.getMenuList()
                this.userId = localStorage.getItem('userId')
                this.getLoginerMenu(this.userId)
                let arr = this.$store.state.sides
                arr.newname = menu.name
                arr.oldname = this.oldname
                this.$store.dispatch('GET_SIDE', arr)
              } else if (res.data.code === 400) {
                this.$notify({
                  title: '提示',
                  message: res.data.message,
                  type: 'warning'
                })
                return false
              } else {
                this.$notify({
                  title: '提示',
                  message: res.data.message,
                  type: 'error'
                })
                return false
              }
            })
            .catch()
        }
      })
      //   if (
      //       (menu.name.length == 0 && menu.href.length == 0) ||
      //        (menu.name.length == 0 && menu.href.length != 0)
      //      ) {
      //        this.$notify({
      //         title: "提示",
      //         message: "系统名称不能为空",
      //         type: "warning"
      //        });
      //       return false;
      //     }
      //     if (menu.href.length == 0 && menu.name.length != 0) {
      //       this.$notify({
      //         title: "提示",
      //        message: "系统地址不能为空",
      //       type: "warning"
      //    });
      //      return false;
      //  }
    },
    // 关闭
    cancle() {
      this.dialogFormVisible2 = false
      this.dialogFormVisible3 = false
      this.dialogFormVisible1 = false
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
            }
            axios.moveItem(params).then(res => {
              // console.log(res)
              if (res.status === 200) {
                this.getMenuList()
              } else {
                this.$notify({
                  title: '提示',
                  message: res.data.message,
                  type: 'error'
                })
              }
            })
          }
        }
      })
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
            }
            axios.moveItem(params).then(res => {
              if (res.status === 200) {
                this.getMenuList()
              } else {
                this.$notify({
                  title: '提示',
                  message: res.data.message,
                  type: 'error'
                })
              }
            })
          }
        }
      })
    },
    // 点击上移
    upMove(menu) {
      console.log(menu)
      if (menu.parent) {
        let parentArr = menu.parent.children
        this.upMoveApi(menu, parentArr)
      } else {
        let parentArr = this.menuListData
        this.upMoveApi(menu, parentArr)
      }
    },
    // 点击下移
    downMove(menu) {
      if (menu.parent) {
        let parentArr = menu.parent.children
        let parentArrLen = parentArr.length
        this.downMoveApi(menu, parentArr, parentArrLen)
      } else {
        let parentArr = this.menuListData
        let parentArrLen = parentArr.length
        this.downMoveApi(menu, parentArr, parentArrLen)
      }
    },
    // 系统名称，菜单名称，按钮名称字数显示
    inputFun(value) {
      if (value) {
        this.menuNameLength = value.length
      }
    },
    // 系统描述字数显示
    inputFun1(value) {
      if (value) {
        this.sysDesLength = value.length
      } else {
        this.sysDesLength = 0
      }
    }
  },
  mounted() {
    this.getMenuList()
  },
  watch: {
    $route(newValue, oldValue) {
      this.dialogFormVisible1 = false
      this.dialogFormVisible2 = false
      this.dialogFormVisible3 = false
    }
  }
}
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
    text-indent: 24px;
  }
  .customBox {
    border: 1px solid #ccc;
    margin: 20px;
  }

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
  .el-row {
    margin: 20px;
    width: 80%;
  }
  .el-col {
    line-height: 60px;
    text-align: center;
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
  .addSystem {
    line-height: 60px;
    margin: 20px;
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
  /*treetable中上移下移居中*/
  .el-table_1_column_5 {
    text-align: center;
  }
  .el-input {
    width: 80%;
  }
  .mgr40 {
    margin-right: -40px;
    margin-left: 32px;
  }
  .disinlne {
    display: inline-block;
  }
  .spanx {
    color: red;
  }
  .txtcenter {
    text-align: center !important;
  }
}

// .top {
//   overflow: hidden;
// }
// .topBox {
//   width: 70%;
//   border: 1px solid #ccc;
//   line-height: 60px;
//   margin: 20px;
//   float: left;
//   .title {
//     display: inline-block;
//     height: 60px;
//     background: #ccc;
//     padding: 0 10px;
//   }
// }
// .systemName {
//   line-height: 40px;
//   padding: 5px;
//   border: 1px solid #ccc;
//   border-radius: 4px;
//   margin: 0 8px;
// }

// .informationBox {
//   width: 40%;
//   margin: 20px;
// }
</style>
