<template>
  <div class="bg aibms-role">
    <el-form
      :inline="true"
      :model="formInline"
      class="demo-form-inline"
      style="padding: 20px 20px 0 20px"
    >
      <el-form-item>
        <el-input
          v-model="roleName"
          placeholder="角色名称"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item>
        <el-select v-model="menuId" placeholder="请选择所属系统" clearable>
          <el-option
            :label="item.name"
            :value="item.menuId"
            v-for="(item, index) in menuSysList"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="item-right">
        <el-button
          icon="el-icon-search"
          class="common-btn-style search-el-button"
          @click="getRoleLsit(1)"
          >查找</el-button
        >
        <router-link to="/BasicManagement/addRole?code=0">
          <el-button
            type="primary"
            icon="el-icon-plus"
            class="common-btn-style margin-left-btn"
            >新增</el-button
          >
        </router-link>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table :data="roleListData" stripe height="84%" style="padding: 0 20px">
      <el-table-column prop="name" label="角色名称" />
      <el-table-column prop="sysName" label="所属系统" />
      <el-table-column prop="description" label="角色说明" />
      <el-table-column prop="permission" label="角色标识" />
      <el-table-column prop="createDate" label="创建时间" />
      <el-table-column label="用户操作" width="200px" align="center">
        <template slot-scope="scope">
          <div class="task-btn-box">
            <span class="special" @click="showUser(scope.row.roleId)">
              <el-tooltip
                class="item"
                effect="dark"
                content="查看用户"
                placement="top-start"
              >
                <icon-svg icon-class="chakan" class="whiteness-icon-color" />
              </el-tooltip>
            </span>
            <span class="special" @click="shouwAddUser(scope.row.roleId)">
              <el-tooltip
                class="item"
                effect="dark"
                content="添加用户"
                placement="top-start"
              >
                <icon-svg icon-class="jia" class="whiteness-icon-color" />
              </el-tooltip>
            </span>
            <span class="special" @click="deleteRoleUser(scope.row.roleId)">
              <el-tooltip
                class="item"
                effect="dark"
                content="删除用户"
                placement="top-start"
              >
                <icon-svg icon-class="shanchu" class="whiteness-icon-color" />
              </el-tooltip>
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="角色操作" width="200px" align="center">
        <template slot-scope="scope">
          <div class="task-btn-box">
            <span
              class="special"
              @click="roleViewBtn(scope.row.roleId, scope.row)"
            >
              <el-tooltip
                class="item"
                effect="dark"
                content="查看"
                placement="top-start"
              >
                <icon-svg icon-class="chakan" class="whiteness-icon-color" />
              </el-tooltip>
            </span>
            <span
              class="special"
              @click="roleClickBtn(scope.row.roleId, scope.row)"
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
            <span class="special" @click="deletUser(scope.row.roleId)">
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
        </template>
      </el-table-column>
    </el-table>
    <!-- 查看用户 -->
    <el-dialog
      center
      :visible="DetailDate"
      size="tiny"
      :before-close="handleDialogClose"
      title="查看用户"
    >
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item>
          <el-input
            v-model="roleDetail"
            placeholder="用户名/真实姓名/手机号码"
          ></el-input>
        </el-form-item>
        <el-form-item label="职位：">
          <el-input v-model="rolePosition"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="lookFor()">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="userData" style="width: 100%">
        <el-table-column prop="name" label="真实姓名" />
        <el-table-column prop="mobile" label="手机号" />
        <el-table-column prop="roleLists" label="已拥有角色" width="200px" />
        <el-table-column prop="position" label="职位" />
      </el-table>
      <div class="block">
        <el-pagination
          v-if="userPag"
          @size-change="handleUserSizeChange"
          @current-change="handleUserCurrentChange"
          :current-page="currPage"
          :page-sizes="[10, 30, 50]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="userTotal"
          style="text-align: center"
        />
      </div>
    </el-dialog>
    <!-- 添加用户 -->
    <el-dialog
      center
      :visible="addUser"
      size="tiny"
      :before-close="handleDialogClose"
      title="添加用户"
    >
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item>
          <el-input
            v-model="addRoleDetail"
            placeholder="用户名/真实姓名/手机号码"
          />
        </el-form-item>
        <el-form-item label="职位：">
          <el-input v-model="addRolePosition" />
        </el-form-item>
        <el-form-item>
          <el-button class="nomal-button" @click="addLookFor">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addAllRole">批量添加</el-button>
        </el-form-item>
      </el-form>
      <el-table
        ref="multipleTable"
        :data="addUserData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        @select-all="addSelectedAll"
        @select="addSelectedRows"
      >
        <el-table-column type="selection" />
        <el-table-column label="真实姓名" prop="name">
          <!--<template slot-scope="scope">{{ scope.row.date }}</template>-->
        </el-table-column>
        <el-table-column prop="addRoleLists" label="已拥有角色" width="200px" />
        <el-table-column prop="position" label="职位" show-overflow-tooltip />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              @click="addroleUser(scope.row.userId)"
              >添加</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          v-if="addPag"
          @size-change="handleAddSizeChange"
          @current-change="handleAddCurrentChange"
          :current-page="currPage"
          :page-sizes="[10, 30, 50]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="addTotal"
        />
      </div>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="addSuccess" width="30%" center>
      <span>添加成功</span>
    </el-dialog>

    <!-- 删除用户 -->
    <el-dialog
      center
      :visible="deleteUser"
      size="tiny"
      :before-close="handleDialogClose"
      title="删除用户"
    >
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item>
          <el-input
            v-model="delRoleDetail"
            placeholder="用户名/真实姓名/手机号码"
          />
        </el-form-item>
        <el-form-item label="职位：">
          <el-input v-model="delRolePosition" />
        </el-form-item>
        <el-form-item>
          <el-button class="nomal-button" @click="delLookFor">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="deleteAllSelected"
            >批量删除</el-button
          >
        </el-form-item>
      </el-form>
      <el-table
        ref="multipleTable"
        :data="delUserData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        @select-all="delSelectedAll"
        @select="selectedRows"
      >
        <el-table-column type="selection" />
        <el-table-column label="真实姓名" prop="name">
          <!--<template slot-scope="scope">{{ scope.row.date }}</template>-->
        </el-table-column>
        <el-table-column prop="delRoleLists" label="已拥有角色" width="200px" />
        <el-table-column prop="position" label="职位" show-overflow-tooltip />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              @click="deleteSelected(scope.row.userId)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          @size-change="handleDelSizeChange"
          @current-change="handleDelCurrentChange"
          :current-page="currPage"
          :page-sizes="[10, 30, 50]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="delTotal"
          v-if="delPag"
        ></el-pagination>
      </div>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="delSuccess" width="30%" center>
      <span>删除成功</span>
    </el-dialog>
    <!-- 查看 -->
    <el-dialog
      center
      :visible="toView"
      size="tiny"
      :before-close="handleDialogClose"
    >
      <el-tabs v-model="activeName" @tab-click="handleClick" width="500px">
        <el-tab-pane label="角色信息" name="first" style="width: 50%">
          <el-form ref="form" :model="roleNameViewData" label-width="100px">
            <el-form-item label="角色名称：">
              <el-input
                v-model="roleNameViewData.name"
                disabled="disabled"
              ></el-input>
            </el-form-item>
            <el-form-item label="角色标识：">
              <el-input
                v-model="roleNameViewData.permission"
                disabled="disabled"
              ></el-input>
            </el-form-item>
            <el-form-item label="角色说明：">
              <el-input
                v-model="roleNameViewData.description"
                disabled="disabled"
              ></el-input>
            </el-form-item>
            <el-form-item label="创建人：">
              <el-input
                v-model="roleNameViewData.createName"
                disabled="disabled"
              ></el-input>
            </el-form-item>
            <el-form-item label="创建时间：">
              <el-input
                v-model="roleNameViewData.createDate"
                disabled="disabled"
              ></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="权限信息" name="second">
          <el-button class="systemName active">{{ selectedSysName }}</el-button>
          <tree-table
            :data="menuListData"
            class="treebox"
            border
            :header-cell-style="{ background: '#f5f5f5' }"
          >
            <el-table-column label="类型">
              <template slot-scope="scope">
                <el-button
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
                  style="cursor: default"
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
            <el-table-column label="描述" width="230px;">
              <template slot-scope="scope">
                <span>{{ scope.row.remarks }}</span>
              </template>
            </el-table-column>
          </tree-table>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <!-- 修改 -->
    <el-dialog
      center
      :visible="editView"
      size="tiny"
      :before-close="handleDialogClose"
    >
      <el-tabs v-model="editActiveName" @tab-click="handleClick" width="500px">
        <el-tab-pane label="修改基本信息" name="first">
          <el-form ref="form" :model="roleNameViewData" label-width="100px">
            <el-form-item label="角色名称：">
              <el-input
                v-model="roleNameViewData.name"
                autocomplete="off"
                maxlength="10"
                :input="inputFun(roleNameViewData.name)"
              ></el-input>
              <span>{{ menuNameLength }}</span
              >/
              <span>{{ totalNum }}</span>
            </el-form-item>
            <el-form-item label="角色标识：">
              <el-input
                v-model="roleNameViewData.permission"
                disabled="disabled"
              ></el-input>
            </el-form-item>
            <el-form-item label="角色说明：">
              <el-input v-model="roleNameViewData.description"></el-input>
            </el-form-item>
            <el-form-item></el-form-item>
          </el-form>
          <div class="txtcenter">
            <el-button
              :loading="editLoading"
              type="primary"
              @click="clickBtnChange(roleNameViewData.roleId)"
              >确认修改</el-button
            >
            <el-button type="primary" @click="editView = false">取消</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="修改权限信息" name="second">
          <el-button
            class="systemName"
            v-for="(item, index) in syslistdata"
            :key="index"
            @click="editsys(item, index)"
            :class="{ active: active == index }"
            >{{ item.name }}</el-button
          >
          <!-- <el-button type="primary">基础系统</el-button> -->
          <tree-table :data="menuListData" class="treebox">
            <el-table-column label="类型">
              <template slot-scope="scope">
                <el-button
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
                  style="cursor: default"
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

            <el-table-column label="描述" width="230px;">
              <template slot-scope="scope">
                <span>{{ scope.row.remarks }}</span>
              </template>
            </el-table-column>
            <!--<el-table-column label="位置修改"></el-table-column>-->
          </tree-table>
          <div class="txtcenter mgt-20">
            <el-button
              :loading="editLoading"
              type="primary"
              @click="clickBtnChange(roleNameViewData.roleId)"
              >确认修改</el-button
            >
            <el-button type="primary" @click="editView = false">取消</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <!-- 删除 -->
    <!-- 有用户 -->
    <!-- 分页功能 -->
    <el-pagination
      class="absolute-center"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currPage"
      :page-sizes="[10, 30, 50]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      style="bottom: 10px"
    ></el-pagination>
  </div>
</template>
<script>
import axios from '@/api';
// import Cookie from 'js-cookie';
import treeTable from '../treeTable'
// import bus from '../common/bus.js';
export default {
  name: 'MoreOperation',
  components: { treeTable },
  data() {
    return {
      activeIndex: '',
      selectedSysName: '',
      menuNameLength: 0,
      totalNum: 10,
      delPag: true,
      addPag: true,
      userPag: true,
      menuSysList: '',
      addSuccess: false,
      delSuccess: false,
      delRolePosition: '',
      delRoleDetail: '',
      addRoleDetail: '',
      addRolePosition: '',
      rolePosition: '',
      roleDetail: '',
      menuId: '',
      roleName: '',
      roleLists: [],
      addRoleLists: [],
      menuListData: [],
      columns: [
        {
          text: '名称',
          value: 'event'
        },
        {
          text: '类型',
          type: 'button',
          value: 'id'
        },
        {
          text: '权限标识',
          value: 'timeLine'
        },
        {
          text: '描述',
          value: 'comment'
        }
      ],
      data: [
        {
          id: 1,
          event: 'jina',
          timeLine: '',
          comment: '',
          children: [
            {
              id: 2,
              event: '事ssss件2',
              timeLine: '',
              comment: '',
              children: [
                {
                  id: 2,
                  event: '事件2',
                  timeLine: '',
                  comment: ''
                }
              ]
            },
            {
              id: 3,
              event: '事件3',
              timeLine: '',
              comment: ''
            }
          ]
        }
      ],
      delUserData: [],
      delRoleLists: [],
      delRoleId: '',
      userIds: [],
      addRoleId: '',
      roleId: '',
      activeName: 'first',
      editActiveName: 'first',
      boxshow: false,
      checked: '',
      DetailDate: false,
      editInformation: false,
      addUser: false,
      deleteUser: false,
      toView: false,
      editView: false,
      listForm: true,
      listTable: false,
      editLoading: false,
      value: '',
      formInline: {
        user: '',
        region: 1,
        radio: ''
      },
      form: {
        name: '',
        address: '',
        date: ''
      },
      delmenuid: '',
      active: 0,
      systemId: '',
      count: 0,
      addUserData: [],
      userData: [],
      roleListData: [],
      current: '1',
      size: '10',
      userCurrent: '1',
      userSize: '10',
      addCurrent: '1',
      addSize: '10',
      delCurrent: '1',
      delSize: '10',
      currPage: 1,
      total: 0,
      userTotal: 0,
      addTotal: 0,
      delTotal: 0,
      expandAll: false,
      roleNameViewData: {},
      sysname: '',
      allRoleData: '',
      delSelectionLength: '',
      addSelectionLength: '',
      syslistdata: [],
      firstMeunId: '',
      roleMenuId: [],
      btnIndex: ''
      //        addSelected:'',
      //        delSelected:''
    }
  },
  methods: {
    // 切换系统按钮：
    delsys(item, index) {
      this.active = index
      this.delmenuid = item.menuId
      this.getMenuList(item.menuId)
    },
    editsys(item, index) {
      this.active = index
      this.delmenuid = item.menuId
      this.getMenuList(item.menuId)
    },
    addSelectedRows(selection, row) {
      this.addSelectionLength = selection.length
      // console.log(this.addSelectionLength);
    },
    selectedRows(selection, row) {
      this.delSelectionLength = selection.length
      // console.log(this.delSelectionLength);
    },
    addSelectedAll(selection) {
      this.addSelectionLength = selection.length
      if (selection !== '') {
        this.addCurrent = this.addCurrent - 1
      }
    },
    delSelectedAll(selection) {
      this.delSelectionLength = selection.length
      if (selection !== '') {
        this.delCurrent = this.delCurrent - 1
      }
    },
    // 角色名称字数限制：
    inputFun(value) {
      if (value) {
        this.menuNameLength = value.length
      }
    },
    // 获取系统列表
    //    getMenuSysListData() {
    //      getMenuSysList().then(res => {
    //          this.menuSysList = res.data.data.result;
    //      });
    //    },
    // 获取列表
    getRoleLsit(x) {
      if (x === 1) {
        this.current = 1
      }
      let JobDto = {
        current: this.current,
        size: this.size,
        name: this.roleName ? this.roleName : '',
        menuId: this.menuId ? this.menuId : ''
      }
      axios.roleList(JobDto).then(res => {
        //        console.log(res);
        this.roleListData = res.data.data.result.records
        this.total = Number(res.data.data.result.total)
      })
    },
    handleClick(tab, event) {
      // if(this.editActiveName=='second'||this.activeName=='second'){
      //         this.getMenuList(this.roleNameViewData.menuId);
      // }
    },
    handleSelectionChange(val) {
      //        this.selected=val;
      //        console.log(this.selected);
      this.userIds = []
      for (var i = 0; i < val.length; i++) {
        this.userIds.push(val[i].userId)
      }
      this.userIds = this.userIds.join(',')
    },
    getAuth(data) {
      let opt = []
      data.forEach(val => {
        opt.push(val.id)
        if (val.children) {
          val.children.forEach(el => {
            if (el.selectchecked.length) {
              opt.push(el.id)
              opt.push(el.selectchecked)
            }
          })
        }
      })
    },
    // 获取菜单列表
    getMenuList(menuId) {
      let mId = ''
      if (menuId) {
        mId += 'menuId=' + menuId
      }
      axios.menuList(mId).then(res => {
        this.count++
        this.menuListData = res.data.data.result
        this.syslist = res.data.data.result
        this.sysname = this.menuListData[0].name
        this.systemId = this.menuListData[0].menuId
      })
    },
    // 删除用户
    delLookFor() {
      this.deleteRoleUser(this.delRoleId)
    },
    // 查询
    addLookFor() {
      this.shouwAddUser(this.addRoleId)
    },
    // 用户查询
    lookFor() {
      this.showUser(this.roleId)
    },
    // 查看用户
    showUser(roleId, n) {
      this.userCurrent = 1
      if (n) {
        this.userCurrent = n
      }
      this.DetailDate = true
      this.roleId = roleId
      let JobDto = {
        current: this.userCurrent,
        size: this.userSize,
        condition: this.roleDetail ? this.roleDetail : '',
        roleId: this.roleId,
        position: this.rolePosition ? this.rolePosition : ''
      }
      axios.getUsersInRole(JobDto)
        .then(res => {
          this.userData = res.data.data.result.records
          this.userTotal = Number(res.data.data.result.total)
          if (this.userTotal === 0) {
            this.userPag = false
          } else {
            this.userPag = true
          }
          for (var i in this.userData) {
            this.roleLists = []
            for (var j in this.userData[i].roleList) {
              this.roleLists += this.userData[i].roleList[j].name + ' '
            }
            this.userData[i].roleLists = this.roleLists
          }
        })
        .catch()
      this.roleDetail = ''
      this.rolePosition = ''
    },
    // 查看用户列表分页
    handleUserSizeChange(val) {
      this.userSize = val
      this.showUser(this.roleId)
    },
    handleUserCurrentChange(val, page) {
      this.userCurrent = val
      this.userSize = page
      this.showUser(this.roleId, val)
    },
    // 添加用户(用户列表)
    shouwAddUser(roleId, n) {
      this.addCurrent = 1
      if (n) {
        this.addCurrent = n
      }
      this.addUser = true
      this.addRoleId = roleId
      // console.log(roleId);
      let JobDto = {
        current: this.addCurrent,
        size: this.addSize,
        condition: this.addRoleDetail ? this.addRoleDetail : '',
        roleId: this.addRoleId,
        position: this.addRolePosition ? this.addRolePosition : ''
      }
      axios.getUsersNotRole(JobDto)
        .then(res => {
          // console.log(res);
          this.addUserData = res.data.data.result.records
          this.addTotal = Number(res.data.data.result.total)
          if (this.addTotal === 0) {
            this.addPag = false
          } else {
            this.addPag = true
          }
          for (var i in this.addUserData) {
            this.addRoleLists = []
            for (var j in this.addUserData[i].roleList) {
              this.addRoleLists += this.addUserData[i].roleList[j].name + ' '
            }
            this.addUserData[i].addRoleLists = this.addRoleLists
          }
        })
        .catch()
      this.addRoleDetail = ''
      this.addRolePosition = ''
    },
    // 添加用户（批量提交）
    addAllRole() {
      if (this.addSelectionLength === 0) {
        this.$notify({
          title: '提示',
          message: '未选中任何项',
          type: 'warning'
        })
        return
      }
      axios.submitAddUser(this.addRoleId, this.userIds).then(res => {
        console.log(res.status, this.userIds)
        if (res.status === 200 && this.userIds !== '') {
          this.$notify({
            title: '提示',
            message: '添加成功',
            type: 'success'
          })
          this.shouwAddUser(this.addRoleId, this.addCurrent)
        } else {
          this.$notify({
            title: '提示',
            message: res.data.message,
            type: 'warning'
          })
        }
      })
      // this.addUser = false
    },
    // 添加用户（提交）
    addroleUser(userId) {
      axios.submitAddUser(this.addRoleId, userId).then(res => {
        if (res.status === '200') {
          // console.log(res);
          this.$notify({
            title: '提示',
            message: '添加成功',
            type: 'success'
          })
          this.shouwAddUser(this.addRoleId)
        } else {
          this.$notify({
            title: '提示',
            message: res.data.message,
            type: 'warning'
          })
        }
      })
    },
    // 添加用户列表分页
    handleAddSizeChange(val) {
      this.addSize = val
      this.shouwAddUser(this.addRoleId)
    },
    handleAddCurrentChange(val, page) {
      this.addCurrent = val
      this.addSize = page
      this.shouwAddUser(this.addRoleId, val)
    },
    // 删除用户(用户列表)
    deleteRoleUser(roleId, n) {
      this.delCurrent = 1
      if (n) {
        this.delCurrent = n
      }
      this.deleteUser = true
      this.delRoleId = roleId
      let JobDto = {
        current: this.delCurrent,
        size: this.delSize,
        condition: this.delRoleDetail ? this.delRoleDetail : '',
        roleId: this.delRoleId,
        position: this.delRolePosition ? this.delRolePosition : ''
      }
      axios.getUsersInRole(JobDto)
        .then(res => {
          this.delUserData = res.data.data.result.records
          this.delTotal = Number(res.data.data.result.total)
          if (this.delTotal === 0) {
            this.delPag = false
          } else {
            this.delPag = true
          }
          for (var i in this.delUserData) {
            this.delRoleLists = []
            for (var j in this.delUserData[i].roleList) {
              this.delRoleLists += this.delUserData[i].roleList[j].name + ' '
            }
            this.delUserData[i].delRoleLists = this.delRoleLists
          }
        })
        .catch()
    },
    // 删除用户列表分页
    handleDelSizeChange(val) {
      this.delSize = val
      this.deleteRoleUser(this.delRoleId)
    },
    handleDelCurrentChange(val, page) {
      this.delCurrent = val
      this.delSize = page
      this.deleteRoleUser(this.delRoleId, val)
    },
    // 删除用户（批量选中删除）
    deleteAllSelected() {
      if (this.delSelectionLength === 0) {
        this.$notify({
          title: '提示',
          message: '未选中任何项',
          type: 'warning'
        })
        return
      }
      axios.deleteRoleUsers(this.delRoleId, this.userIds).then(res => {
        if (res.status === 200 && this.userIds !== '') {
          // console.log(res);
          this.$notify({
            title: '提示',
            message: '删除成功',
            type: 'success'
          })
          this.deleteRoleUser(this.delRoleId, this.delCurrent)
        } else {
          this.$notify({
            title: '提示',
            message: res.data.message,
            type: 'warning'
          })
        }
        // this.deleteUser = false
      })
    },
    // 删除用户（选中删除）
    deleteSelected(userId) {
      axios.deleteRoleUsers(this.delRoleId, userId).then(res => {
        if (res.status === '200') {
          // console.log(res);
          this.$notify({
            title: '提示',
            message: '删除成功',
            type: 'success'
          })
          this.deleteRoleUser(this.delRoleId)
        } else {
          this.$notify({
            title: '提示',
            message: res.data.message,
            type: 'warning'
          })
        }
      })
    },
    // 获取系统列表:
    getMenuSysList() {
      axios.getMenuSysList().then(res => {
        this.syslistdata = res.data.data.result
        this.menuSysList = res.data.data.result
        this.firstMeunId = this.syslistdata[0].menuId
        //              console.log(this.firstMeunId);
        //              console.log(this.syslistdata);
        //   this.getMenuList(this.firstMeunId);
      })
    },
    // 角色名称——查看
    roleViewBtn(id, sp) {
      this.activeName = 'first'
      this.$store.dispatch('VIEW', 'view')
      var roleId = id
      this.toView = true
      axios.roleDetail(roleId).then(res => {
        console.log(res)
        // 获取当前系统的名称。
        this.selectedSysName = res.data.data.result.sysName
        this.active = this.activeIndex
        this.roleNameViewData = res.data.data.result
        this.getMenuList(this.roleNameViewData.menuId)
        this.menuListData = res.data.data.result.allMenuList

        if (this.menuListData.length > 0) {
          this.sysname = this.menuListData[0].name
        }
        this.sysname = ''
        this.$store.dispatch('GET_DATA', res.data.data.result.roleMenuList)
        this.$store.dispatch(
          'GET_NODATA',
          res.data.data.result.roleNotMenuList
        )
      })
    },
    recursionMethon() { },
    // 角色操作-修改
    roleClickBtn(id, sp) {
      this.editActiveName = 'first'
      this.$store.dispatch('VIEW', 'set')
      this.editView = true
      var roleId = id
      axios.roleDetail(roleId).then(res => {
        console.log(res)
        // 获取当前系统的名称
        let btnSysName = res.data.data.result.sysName
        this.active = this.syslistdata.findIndex(item => {
          return item.name === btnSysName
        })
        this.roleNameViewData = res.data.data.result
        this.getMenuList(this.roleNameViewData.menuId)
        this.menuListData = res.data.data.result.allMenuList

        this.$store.dispatch('GET_DATA', res.data.data.result.roleMenuList)
      })
    },
    // 角色名称——修改——确认修改
    clickBtnChange(id) {
      // var roleId = id;
      this.menuIds = this.$store.state.menuIds.slice(
        0,
        this.$store.state.menuIds.length - 1
      )
      // console.log(this.menuIds )
      // if(!this.menuIds){
      //   this.menuIds = this.syslistdata[this.active].menuId;
      // }
      let JobDto = {
        name: this.roleNameViewData.name,
        permission: this.roleNameViewData.permission,
        description: this.roleNameViewData.description,
        useable: 1
      }
      // console.log(this.menuIds, this.systemId)
      // return false;
      axios.changeRoleDetail(id, this.menuIds, JobDto, this.systemId).then(res => {
        // console.log(res);
        this.editActiveName = 'first'
        if (res.data.code === 200) {
          this.$notify({
            title: '提示',
            message: res.data.message,
            type: 'success'
          })
          this.editView = false
          this.getRoleLsit()
          this.active = 0
        } else {
          this.$notify({
            title: '提示',
            message: res.data.message,
            type: 'warning'
          })
        }
      })
    },
    // 角色名称-删除
    deletUser(id) {
      // 先判断改角色下面是否有用户，如果存在用户，则无法删除
      let JobDto = {
        current: 1,
        size: '10',
        roleId: id
      }
      axios.getUsersInRole(JobDto)
        .then(res => {
          let userArr = res.data.data.result.records
          if (userArr[0]) {
            this.$notify({
              type: 'warning',
              message: '该角色下存在用户，删除失败!'
            })
          } else {
            var roleId = id
            this.$confirm('确认删除', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
              .then(() => {
                axios.deleteRole(roleId).then(res => {
                  if (res.data.code === 200) {
                    this.$notify({
                      type: 'success',
                      message: '删除成功!'
                    })
                    this.getRoleLsit()
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
          }
        })
        .catch()

      // 删除判断
    },
    // 关闭
    handleDialogClose() {
      this.active = 0
      this.DetailDate = false
      this.editInformation = false
      this.addUser = false
      this.toView = false
      this.editView = false
      this.deleteUser = false
    },
    // 修改图像
    togglebox() {
      this.boxshow = !this.boxshow
    },
    // 点击表单查看详情
    showDetail() {
      this.DetailDate = true
    },

    // 有角色
    alertUser() {
      this.$alert('这是一段内容', '标题名称', {
        confirmButtonText: '确定',
        callback: action => {
          this.$notify({
            type: 'info',
            message: `action: ${action}`
          })
        }
      })
    },
    // 点击表单修改信息
    changeDate() {
      this.editInformation = true
    },
    // 去换表单表格
    formChange() {
      this.listForm = true
      this.listTable = false
    },
    tableChange() {
      this.listForm = false
      this.listTable = true
    },
    onSubmit() {
      // console.log("submit!");
    },
    handleSizeChange(val) {
      this.size = val
      this.getRoleLsit()
    },
    handleCurrentChange(val, page) {
      // console.log(val);
      this.current = val
      this.size = 10
      this.getRoleLsit()
    }
  },
  created() {
    // console.log(this.$route);

    // var lett = this;
    // document.onkeydown = function(evt) {
    //   evt = evt ? evt : window.event ? window.event : "";
    //   var keyCode = evt.keyCode
    //     ? evt.keyCode
    //     : evt.which
    //     ? evt.which
    //     : evt.charCode;
    //   if (keyCode == 13) {
    //     lett.getRoleLsit();
    //   }
    // };
  },
  updated() { },
  mounted() {
    //  this.getMenuList();
    this.getRoleLsit()
    this.getMenuSysList()
  },
  watch: {
    $route(newValue, oldValue) {
      this.DetailDate = false
      this.addUser = false
      this.deleteUser = false
      this.toView = false
      this.editView = false
      this.deletUser = false
    }
  }
}
</script>
<style scoped lang="scss">
.bg {
  position: relative;
  height: 84%;
  margin: 10px;
  background: rgba(4, 28, 37, 0.3);
  border-radius: 5px;
  padding-bottom: 50px;
  .el-tabs__item {
    color: #fff;
  }
  .block {
    text-align: center;
    margin-top: 20px;
  }
  .el-input {
    width: 70%;
  }
  .item-right {
    margin: 0 !important;
    .search-el-button {
      border: 1px solid #fff;
      color: #fff;
      &:link {
        border: 1px solid #fff;
        color: #fff;
      }
      &:visited {
        border: 1px solid #fff;
        color: #fff;
        background-color: transparent !important;
      }
      &:hover {
        background-color: #041c25;
        border: 1px solid #01aef1;
        color: #01aef1;
      }
      &:active {
        border: 1px solid #fff;
        color: #fff;
      }
    }
  }

  .txtcenter {
    text-align: center;
  }
  .mgt-20 {
    margin-top: 20px;
  }
  .rolePaginate {
    position: relative;
    text-align: center;
  }
  .systemName {
    line-height: 24px;
    padding: 5px;
    border-radius: 4px;
    margin: 5px 8px;
  }
  .active {
    background: #00d1b2;
    border: 1px solid #00d1b2;
    color: #fff;
  }

  .task-btn-box {
    text-align: center;

    .special {
      cursor: pointer;
    }
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

      img {
        height: 12px;
        /* margin-top: 2px; */
        padding: 5px 8px 6px 8px;
        margin-bottom: -6px;
      }
      &.special:hover {
        background: #0066ff;
      }
    }
  }
}
</style>
