<template>
  <div class="aia-content">
    <!-- 筛选 -->
    <div class="search-bar">
      <el-form :inline="true" :model="alarmModel" label-width="80px">
        <el-form-item>
          <el-input
            v-model="alarmModel.name"
            clearable
            placeholder="请输入名称"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="alarmModel.classification"
            clearable
            placeholder="请输入告警分类"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item class="search-source">
          <el-button icon="el-icon-search" @click.stop="search">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-form :inline="true" class="search-inline-btn">
        <el-form-item>
          <el-button type="primary" icon="el-icon-plus" @click="addXClassification">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 表格数据 -->
    <el-table
      @row-click="alarmDetail"
      :data="tableData"
      stripe
      :header-cell-style="{background:'#f5f5f5'}"
      style="width: 100%"
    >
      <el-table-column prop="name" label="名称" />
      <el-table-column label="告警升级规则">
        <template v-slot="scope">
          {{`${scope.row.categoryName}等告警分类在过去${scope.row.period}分钟内${scope.row.type}告警${scope.row.count}次，即升级为${scope.row.level}`}}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="operation" label="操作" width="150">
        <template v-slot="scope">
          <div class="task-btn-box">
            <el-link type="primary" :underline="false" @click.stop="handleEdit(scope.row)">编辑</el-link>
            <el-link type="primary" :underline="false" @click.stop="handleDelete(scope.row)">删除</el-link>
            <!-- <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
              <span class="special" @click.stop="handleEdit(scope.row)">
                <icon-svg icon-class="bianji" />
              </span>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
              <span class="special" @click.stop="handleDelete(scope.row)">
                <icon-svg icon-class="shanchu" />
              </span>
            </el-tooltip> -->
          </div>
        </template>
      </el-table-column>
      <template slot="empty">
        <div class="blank-page">
          <div class="img-content">
            <img src="../../../../../static/img/blank-page.png" alt />
          </div>
          <p class="empty-text">暂无相关数据</p>
        </div>
      </template>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      v-if="totalSize"
      :current-page.sync="page.current"
      :page-size.sync="page.size"
      :page-sizes="[10, 20, 30]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalSize"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      style="text-align:center;margin-top:92px"
    />
    <!-- 删除组件 -->
    <deleteDialog ref="deleteDialog" @confim-delete="confirmDelete" />
  </div>
</template>

<script>
import axios from '@/api'
import deleteDialog from '../../../common/deleteDialog'
export default {
  components: {
    deleteDialog
  },
  data: () => ({
    alarmModel: {
      name: '',
      classification: ''
    },
    tableData: [],
    page: {
      current: 1,
      size: 10
    },
    totalSize: 0,
    currentDeleteItemId: -1
  }),
  created () {
    this.getUpgradeList()
  },
  methods: {
    // 获取列表数据
    getUpgradeList () {
      const params = {
        name: this.alarmModel.name,
        sortName: this.alarmModel.classification,
        current: this.page.current,
        size: this.page.size
      }
      axios.getUpgradeList(params).then(res => {
        if (res.data.success) {
          this.tableData = res.data.data.records
          this.totalSize = Number(res.data.data.total)
        } else {
          this.$notify({
            title: '提示',
            type: 'error',
            message: res.data.message
          })
        }
      })
    },
    // 分页
    handleCurrentChange () {
      this.getUpgradeList()
    },
    // 表格每页数量
    handleSizeChange () {
      this.page.current = 1
      this.getUpgradeList()
    },
    // 详情
    alarmDetail (row) {
      this.$router.push({
        path: '/Aibms/BuinessConfiguration/addGadeAlarm',
        query: {
          code: 2,
          id: row.id,
          read: true
        }
      })
    },
    search () {
      this.getUpgradeList()
    },
    addXClassification () {
      this.$router.push({
        path: '/Aibms/BuinessConfiguration/addGadeAlarm',
        query: {
          code: 2
        }
      })
    },
    handleEdit (row) {
      this.$router.push({
        path: '/Aibms/BuinessConfiguration/addGadeAlarm',
        query: {
          code: 2,
          id: row.id
        }
      })
    },
    handleDelete (row) {
      this.currentDeleteItemId = row.id
      this.$refs.deleteDialog.confirmDeleteDialogVisible = true
    },
    confirmDelete () {
      const id = this.currentDeleteItemId
      axios.deleteUpgrade(id).then(res => {
        if (res.data.success) {
          this.$notify.success({
            title: '提示',
            message: '删除成功'
          })
          this.getUpgradeList()
        } else {
          this.$notify.error({
            title: '提示',
            message: res.data.message
          })
        }
        this.$refs.deleteDialog.confirmDeleteDialogVisible = false
      }).catch(() => {
        this.$refs.deleteDialog.confirmDeleteDialogVisible = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.aia-content {
  position: relative;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  .search-source {
    .el-button {
      border: 1px solid #fff;
      color: #fff;
      &:hover {
        border: 1px solid #01aef1;
        color: #01aef1;
        background-color: #041C25;
      }
      &:focus {
        border: 1px solid #01aef1;
        color: #01aef1;
        background-color: #041C25;
      }
      &:active {
        background-color: #041C25;
        border: 1px solid #01aef1;
        color: #01aef1;
      }
    }
  }
  .el-table thead tr th {
    background: rgb(245, 245, 245) !important;
  }
  .task-btn-box {
    text-align: center;
    .el-link {
      color: #fff;
    }
    // span {
    //   display: inline-block;
    //   background: #fff;
    //   border: 1px solid #0066ff;
    //   line-height: 24px;
    //   padding: 0 4px;
    //   border-radius: 5px;
    //   color: #0066ff;
    //   font-size: 14px;
    //   margin-right: 12px;
    //   cursor: pointer;
    //   margin: 5px 0;
    //   &:hover {
    //     background: #0066ff;
    //   }
    //   &:active {
    //     background: #0066ff;
    //     color: #fff;
    //   }
    // }
  }
  .blank-page {
    .img-content {
      height: 200px;
      padding-top: 15px;
    }
    .empty-text {
      font-size: 18px;
      height: 30px;
      line-height: 30px;
      margin-top: -30px;
      margin-bottom: 10px;
    }
  }
}
</style>
<style scoped>
.search-bar {
  display: flex;
  justify-content: space-between;
}
.search-inline-form {
  flex: 1;
}
.search-inline-btn {
  width: 100px;
}
</style>
