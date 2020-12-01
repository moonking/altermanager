<template>
  <div class="bg">
    <el-form
      :inline="true"
      class="demo-form-inline"
      style="padding: 20px 20px 0 20px"
    >
      <el-form-item>
        <el-input
          v-model="depName"
          placeholder="输入部门名称过滤搜索"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item class="item-right margin-zero">
        <el-button
          icon="el-icon-refresh"
          class="search-el-button"
          @click="getDeptTree"
          >刷新</el-button
        >
        <el-button
          type="primary"
          icon="el-icon-plus"
          class="margin-left-btn"
          @click="newDepartment"
          >新增</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <!-- <el-table
      :data="roleListData"
      border
      style="width: 95%;margin-left:2%"
      :header-cell-style="{ background: '#f5f5f5' }">
      <el-table-column prop="name" label="部门名称" align="center"></el-table-column>
      <el-table-column prop="sysName" label="所属系统" align="center"></el-table-column>
      <el-table-column prop="description" label="部门说明" align="center"></el-table-column>
      <el-table-column prop="permission" label="部门标识" align="center"></el-table-column>
      <el-table-column prop="createDate" label="创建时间" align="center"></el-table-column>
      <el-table-column fixed="right" label="操作" width="200px" align="center">
        <template slot-scope="scope">
          <div class="task-btn-box">
            <span class="special" @click="readDepartment(scope.row.roleId,scope.row)">
              <el-tooltip class="item" effect="dark" content="查看" placement="top-start">
                <img class="see" src="../../../../static/img/seeblue.png" alt />
              </el-tooltip>
            </span>
            <span class="special" @click="editDepartment(scope.row.roleId,scope.row)">
              <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
                <img class="edit" src="../../../../static/img/editblue.png" alt />
              </el-tooltip>
            </span>
            <span class="special" @click="deletDepartment(scope.row.roleId)">
              <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                <img class="del" src="../../../../static/img/delblue.png" alt />
              </el-tooltip>
            </span>
          </div>
        </template>
      </el-table-column>
    </el-table>-->
    <!-- <el-input
      placeholder="输入关键字进行过滤"
      v-model="filterText">
    </el-input>-->
    <div class="tree-wrapper">
      <el-tree
        :data="deptTree"
        node-key="value"
        default-expand-all
        :expand-on-click-node="false"
        :filter-node-method="filterNode"
        ref="tree"
      >
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span>
            <el-button
              type="text"
              size="mini"
              @click="() => handleAddChildDept(data.value)"
              >添加子部门</el-button
            >
            <el-button
              type="text"
              size="mini"
              @click="() => handleEditDept(data.value)"
              >编辑</el-button
            >
            <el-button
              type="text"
              size="mini"
              @click="() => handleDeleteDept(data.value)"
              >删除</el-button
            >
          </span>
        </span>
      </el-tree>
    </div>
    <!-- 添加部门 -->
    <el-dialog
      center
      :visible="deptInfoDialogVisible"
      size="tiny"
      :before-close="handleDialogClose"
      :title="deptDialogTitle"
    >
      <el-form :model="form" :rules="formRules" ref="form">
        <el-form-item label="部门名称" label-width="120px" prop="name">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="父级部门"
          label-width="120px"
          prop="parentId"
          v-if="shouldShowParentId"
        >
          <!-- <el-select v-model="form.parentId" placeholder="请选择父级部门">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>-->
          <el-cascader
            v-model="form.parentId"
            :options="deptTree"
            :props="{ checkStrictly: true }"
            :disabled="operateStatus === 'read' || isAddChild"
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item
          label="部门负责人"
          label-width="120px"
          prop="masterUserId"
        >
          <user-selector
            :selectedList.sync="form.masterUserId"
            :readonly="operateStatus === 'read'"
            :candidates="userList"
            :single="true"
          ></user-selector>
        </el-form-item>
        <el-form-item label="中文简称" label-width="120px" prop="shortName">
          <el-input v-model="form.shortName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="英文简称" label-width="120px" prop="enShortName">
          <el-input v-model="form.enShortName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="备注" label-width="120px" prop="remarks">
          <el-input tyep="textarea" v-model="form.remarks" autocomplete="off" />
        </el-form-item>
        <el-form-item label="是否启用" label-width="120px" prop="useable">
          <el-switch v-model="form.useable" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="nomal-button" @click="deptInfoDialogVisible = false"
          >取 消</el-button
        >
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="addSuccess" width="30%" center>
      <span>添加成功</span>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="delSuccess" width="30%" center>
      <span>删除成功</span>
    </el-dialog>
    <el-dialog
      title="确认删除"
      :visible.sync="deleteConfirmDialogVisible"
      width="30%"
      center
    >
      <span>
        <i class="el-icon-warning" :style="{ color: '#E6A23C' }"></i>
        该操作会同时删除该改部门下所有子部门，确定要删除吗？
      </span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deleteConfirmDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmDeleteDept">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分页功能 -->
    <div class="block rolePaginate">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currPage"
        :page-sizes="[10, 30, 50]"
        :page-size="100"
        layout="prev, pager, next, sizes, total, jumper"
        :total="total"
        style="text-align: center"
      />
    </div>
  </div>
</template>
<script>
import UserSelector from './UserSelector'
import axios from '@/api'
export default {
  name: 'Department',
  components: {
    UserSelector
  },
  data() {
    return {
      current: '1',
      size: '10',
      currPage: 1,
      total: 0,
      delSuccess: false,
      addSuccess: false,
      deptInfoDialogVisible: false,
      roleListData: [],
      depName: '',
      // 部门信息表单
      form: {
        name: '',
        parentId: [],
        departMaster: [],
        shortName: '',
        enShortName: '',
        remarks: '',
        useable: false
      },
      // 表单校验规则
      formRules: {
        name: [
          { required: true, message: '请输入部门名称', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        parentId: [
          {
            type: 'array',
            required: true,
            message: '请选择父级部门',
            trigger: 'change'
          }
        ],
        masterUserId: [
          {
            type: 'array',
            required: true,
            message: '请选择部门负责人',
            trigger: 'blur'
          }
        ],
        shortName: [{ min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }]

      },
      // 系统当前的用户列表
      userList: [],
      // 部门树状结构列表
      deptTree: [],
      /**
       * 操作状态，用来辨别当前是新增部门，编辑部门还是查看部门详情
       * read   查看部门详情
       * add    新增部门
       * edit   编辑部门
       * ==============
       * 默认为查看状态
       * ==============
       */
      operateStatus: 'edit',
      // 删除部门二次提示框
      deleteConfirmDialogVisible: false,
      // 当前列表中想要删除的部门唯一编号
      currentDeleteDeptId: '',
      isAddChild: false
    };
  },
  methods: {
    // 获取列表
    getRoleLsit(x) {
      if (x === 1) {
        this.current = 1;
      }
    },
    // 获取系统列表:
    getMenuDepartmentList() { },
    // 部门新增
    newDepartment() {
      this.operateStatus = 'add'
      this.deptInfoDialogVisible = true;
    },
    // 部门-查看
    readDepartment() { },
    // 部门-修改
    editDepartment(id) { },
    // 部门-删除
    deletDepartment(id) {
      // let JobDto = {
      //   current: 1,
      //   size: '10',
      //   roleId: id
      // };
    },
    // 关闭
    handleDialogClose() {
      this.deptInfoDialogVisible = false;
    },
    handleSizeChange(val) {
      this.size = val;
      this.getRoleLsit();
    },
    handleCurrentChange(val, page) {
      this.current = val;
      this.size = 10;
      this.getRoleLsit();
    },
    // 获取树状结构部门数据
    getDeptTree() {
      axios.queryDeptTree().then(res => {
        // console.log(res);
        if (res.data.code === 200) {
          this.deptTree = res.data.data.result
        }
      });
    },
    // 处理新增和编辑弹框确定按钮
    handleSubmit() {
      const that = this;
      this.$refs.form.validate().then(res => {
        if (res) {
          const data = JSON.parse(JSON.stringify(that.form));
          const status = this.operateStatus
          data.parentId = data.parentId[data.parentId.length - 1];
          data.masterUserId = data.masterUserId[0].userId;
          if (status === 'add') {
            this.addDept(data)
          } else if (status === 'edit') {
            this.updateDept(data)
          }
        }
      });
    },
    // 处理添加子部门
    handleAddChildDept(deptId) {
      this.isAddChild = true
      this.operateStatus = 'add'
      // 获取该部门数据
      axios.queryDept(deptId).then(res => {
        if (res.data.code === 200) {
          this.$message.success(res.data.message)
          this.deptInfoDialogVisible = true
          // 将得到的部门数据填充到表单显示
          this.$nextTick(() => {
            let ids = this.responseDeptDataTransform(res.data.data).parentId
            ids.push(deptId)
            console.log(ids)
            this.form.parentId = ids || []
          })
        }
      })
    },
    // 处理删除部门事件
    handleDeleteDept(deptId) {
      this.deleteConfirmDialogVisible = true
      this.currentDeleteDeptId = deptId
    },
    // 处理部门编辑事件
    handleEditDept(deptId) {
      // 获取该部门数据
      this.operateStatus = 'edit'
      axios.queryDept(deptId).then(res => {
        if (res.data.code === 200) {
          this.$message.success(res.data.message)
          console.log(this.$refs.form)
          this.deptInfoDialogVisible = true
          console.log(this.$refs.form)
          // 将得到的部门数据填充到表单显示
          // setTimeout(() => {
          //   this.form = this.responseDeptDataTransform(res.data.data)
          // }, 5000)
          // this.form = this.responseDeptDataTransform(res.data.data)
          this.$nextTick(() => {
            this.form = this.responseDeptDataTransform(res.data.data)
            console.log(this.$refs.form)
          })
        }
      })
    },
    responseDeptDataTransform(data) {
      let result = data || {}
      // 父级部门数据结构转换
      let ids = data.parentIds
      let parentIds = ids ? ids.substr(0, ids.length - 1).split(',') : []
      if (parentIds[0] === '0') {
        parentIds.shift()
      }
      console.log(parentIds)
      result.parentId = parentIds
      // 部门负责人数据结构转换
      result.masterUserId = [this.getUserInfoById(data.masterUserId)]
      return result
    },
    getUserInfoById(userId) {
      let result
      this.userList.forEach(user => {
        if (user.userId === userId) {
          result = user
        }
      })
      return result
    },
    // 新增部门
    addDept(data) {
      axios.addDept(data).then(res => {
        console.log(res);
        if (res.data.code === 200) {
          this.$message.success(res.data.message)
          this.deptInfoDialogVisible = false
          // 重置表单
          this.$refs.form.resetFields()
          this.form.parentId = []
          // 刷新列表数据
          this.getDeptTree()
        } else {
          this.$message.error(res.data.message)
        }
      });
    },
    // 修改部门
    updateDept(data) {
      axios.updateDept(data).then(res => {
        if (res.data.code === 200) {
          this.$message.success(res.data.message)
          // 关闭对话框
          this.deptInfoDialogVisible = false
          // 重置表单
          this.$refs.form.resetFields()
          // 刷新列表数据
          this.getDeptTree()
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 删除部门
    confirmDeleteDept() {
      axios.deleteDept(this.currentDeleteDeptId).then(res => {
        if (res && res.data && res.data.code === 200) {
          this.$message.success('删除成功!')
          // 刷新列表数据
          this.getDeptTree()
        } else {
          this.$message.success(res.data.message)
        }
        // 关闭确认对话框
        this.deleteConfirmDialogVisible = false
      })
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    }
  },
  computed: {
    deptDialogTitle() {
      const status = this.operateStatus
      if (status === 'read') {
        return '部门信息'
      } else if (status === 'edit') {
        return '编辑部门'
      } else {
        return '添加部门'
      }
    },
    shouldShowParentId() {
      const status = this.operateStatus
      if (this.deptTree.length <= 0) {
        return false
      }
      if (status === 'edit') {
        if (this.form.parentId.length === 0) {
          return false
        }
      }
      return true
    }
  },
  created() {
    // 获取系统当前用户列表
    axios.userList({
      condition: '',
      current: 1,
      online: false,
      roleIds: [],
      size: 20,
      userStatus: ''
    }).then(res => {
      console.log(res.data);
      if (res && res.data && res.data.code === 200) {
        this.userList = res.data.data.result.records;
      }
    });
    // 获取系统树状列表
    this.getDeptTree()
  },
  mounted() {
    this.getRoleLsit();
  },
  watch: {
    deptInfoDialogVisible(newValue) {
      if (newValue) {
        this.getDeptTree()
      } else {
        this.$refs.form.resetFields()
        this.form.masterUserId = []
        this.form.parentId = []
        console.log('重置表单')
        this.isAddChild = false
      }
    },
    depName(val) {
      this.$refs.tree.filter(val);
    }
  }
};
</script>
<style scoped lang="scss">
.bg {
  padding-bottom: 50px;
  margin: 10px;
  background: rgba(4, 28, 37, 0.3);
  border-radius: 5px;
  .el-tree {
    background: none;
    color: #fff;
    .el-tree-node__expand-icon {
      color: #fff;
    }
  }
  .el-input {
    width: 70%;
  }

  .txtcenter {
    text-align: center;
  }
  .mgt-20 {
    margin-top: 20px;
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
      /* padding: 0 8px; */
      border-radius: 5px;
      color: #0066ff;
      font-size: 14px;
      margin-right: 12px;
      cursor: pointer;

      img {
        height: 12px;
        padding: 5px 8px 6px 8px;
        margin-bottom: -6px;
      }
      &.special:hover {
        background: #0066ff;
      }
    }
  }
}
.item-right {
  margin: 0 !important;
  .search-el-button {
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
.tree-wrapper {
  padding: 0 20px;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.block {
  margin-top: 20px;
  position: relative;
}
</style>
