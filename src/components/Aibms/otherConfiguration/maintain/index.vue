<template>
  <div class="aia-content">
    <!-- 筛选 -->
    <div class="search-bar">
      <el-form
        :inline="true"
        ref="searchFrom"
        :model="searchFrom"
        label-width="80px"
        class="search-inline-form"
      >
       <!-- <el-form-item>
          <el-input
            v-model="searchFrom.ipAddress"
            clearable
            placeholder="请输入IP地址"
            style="width: 200px"
          />
        </el-form-item> -->
        <!-- <el-form-item>
          <el-select
            clearable
            v-model="searchFrom.businessValue"
            placeholder="请选择业务系统"
          >
            <el-option
              v-for="item in businessList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="search-rule">
          <el-button icon="el-icon-search" @click="search">搜索</el-button>
        </el-form-item> -->
      </el-form>
      <el-form :inline="true" class="search-inline-btn">
        <el-form-item>
          <el-button class="save-btn common-btn" icon="el-icon-plus" @click="addRule"
            >新增</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <!-- 表格数据 -->
    <el-table
      :data="tableData"
      stripe
      :header-cell-style="{ background: '#f5f5f5' }"
      @row-click="maintainDeatil"
      style="width: 100%"
      height="86%"
    >
      <el-table-column label="告警来源">
        <template v-slot="scope">
          <!-- {{ scope.row.ips.filter((item) => item).join(',') }} -->
          {{ scope.row.code }}
        </template>
      </el-table-column>
      <el-table-column label="时间窗口">
        <template v-slot="scope">
          {{ scope.row.startTime }} ~ {{ scope.row.endTime }}
        </template>
      </el-table-column>
      <el-table-column label="周期">
        <template v-slot="scope">
          {{ scope.row.startDay }} ~ {{ scope.row.endDay }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="operation" label="操作">
        <template v-slot="scope">
          <div class="rule-box" @click.stop="openRule(scope.row)">
            <!-- <el-switch size="large" v-model="scope.row.status" /> -->
            <icon-svg
              icon-class="open"
              style="font-size: 24px; margin-left: 10px;vertical-align: middle;"
              :style="{color: scope.row.status == 1?'#00E5FF':'#434C5D'}"
            />
          </div>
          <div class="task-btn-box">
            <el-link :underline="false" class="el-icon-edit-outline" @click.stop="handleEdit(scope.row)"
              ></el-link
            >
            <el-link :underline="false" class="el-icon-close" @click.stop="handleDelete(scope.row)"
              ></el-link
            >
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
      v-if="totalSize && totalSize > 12"
      :current-page.sync="page.current"
      :page-size.sync="page.size"
      :page-sizes="[12, 20, 30]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalSize"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      class="absolute-center"
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
    tableData: [],
    businessList: [],
    searchFrom: {
      businessValue: '',
      ipAddress: ''
    },
    page: {
      current: 1,
      size: 12
    },
    totalSize: 0,
    currentDeleteItemId: -1,
    callNum: 0
  }),
  created() {
    let params = this.getParams()
    this.getMaintenanceList(params)
    // this.getBusinessList()
  },
  methods: {
    // 将查询的数据储存在session中
    setSession() {
      if (this.callNum > 1) {
        const params = {
          current: this.page.current,
          size: this.page.size
        }
        sessionStorage.setItem('search', JSON.stringify(params))
      }
    },
    // 将储存在session中的数据取出回显
    getParams() {
      let params
      if (sessionStorage.getItem('search') !== null) {
        params = JSON.parse(sessionStorage.getItem('search'))
        const { current, size } = params
        this.page.current = current
        this.page.size = size
      }
      return params
    },
    // 维护窗口列表
    getMaintenanceList(params) {
      if (params === undefined) {
        params = {
          current: this.page.current,
          size: this.page.size
        }
      }
      axios.getMaintenanceList(params).then(res => {
        if (res.data.success) {
          this.tableData = res.data.data.records
          this.totalSize = Number(res.data.data.total)
          this.callNum++
        } else {
          this.$notify.error({
            title: '提示',
            message: res.data.message
          })
        }
      })
    },
    // 获取业务系统下拉框列表
    getBusinessList() {
      const params = {
        name: '',
        ipAddress: '',
        current: 1,
        size: 1000
      }
      axios.getSystemList(params).then(res => {
        if (res.data.success) {
          // this.businessList = res.data.data.result.records
          this.businessList = [...new Set(res.data.data.result.records.map(item => item.name))]
        } else {
          this.$notify.error({
            title: '提示',
            message: res.data.message
          })
        }
      })
    },
    // 搜索
    search() {
      this.page.current = 1
      this.getMaintenanceList()
    },
    // 跳转至修改维持窗口
    handleEdit(row) {
      this.setSession()
      this.$router.push({
        path: '/Aibms/otherConfiguration/addMaintain',
        query: {
          code: 2,
          id: row.id
        }
      });
    },
    // 跳转至新增维护窗口
    addRule() {
      this.$router.push({
        path: '/Aibms/otherConfiguration/addMaintain',
        query: {
          code: 2
        }
      });
    },
    //  开启/关闭维护窗口
    openRule(scope) {
      const params = {
        id: scope.id,
        status: scope.status == 1 ? 0 : 1
      }
      axios.editMaintenance(params).then(res => {
        if (res.data.success) {
          this.$notify({
            title: '提示',
            message: scope.status ? '维护已开启！' : '维护已关闭!',
            type: 'success'
          })
        } else {
          this.$notify.error({
            title: '提示',
            message: res.data.message
          })
        }
      })
    },
    // 跳转至维护窗口详情
    maintainDeatil(row) {
      this.setSession()
      this.$router.push({
        path: '/Aibms/otherConfiguration/addMaintain',
        query: {
          code: 2,
          id: row.id,
          read: true
        }
      });
    },
    // 分页
    handleCurrentChange() {
      this.getMaintenanceList()
    },
    // 表格每页数量
    handleSizeChange() {
      this.page.current = 1
      this.getMaintenanceList()
    },
    // 打开删除dialog
    handleDelete(row) {
      this.currentDeleteItemId = row.id
      this.$refs.deleteDialog.confirmDeleteDialogVisible = true
    },
    // 删除选择
    confirmDelete() {
      const id = this.currentDeleteItemId
      // 删除维护窗口
      axios.deleteMaintenance(id).then(res => {
        if (res.data.success) {
          this.$notify.success({
            title: '提示',
            message: '删除成功'
          })
        } else {
          this.$notify.error({
            title: '提示',
            message: res.data.message
          })
        }
        this.getMaintenanceList()
        this.$refs.deleteDialog.confirmDeleteDialogVisible = false
      }).catch(() => {
        this.getMaintenanceList()
        this.$refs.deleteDialog.confirmDeleteDialogVisible = false
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.aia-content {
  position: relative;
  width: 100%;
  height: 94%;
  padding: 10px 10px;
  box-sizing: border-box;
  .search-rule {
    .el-button {
      border: 1px solid #436382;
      color: #fff;
      &:link {
        border: 1px solid #436382;
        color: #fff;
      }
      &:visited {
        border: 1px solid #436382;
        color: #fff;
        background-color: transparent !important;
      }
      &:hover {
        background-color: #041c25;
        border: 1px solid #01aef1;
        color: #01aef1;
      }
      &:active {
        border: 1px solid #436382;
        color: #fff;
      }
    }
  }
  .img {
    img {
      width: 20px;
      vertical-align: text-bottom;
      margin-left: 10px;
    }
  }
  .rule-box {
    display: inline-block;
  }
  .task-btn-box {
    text-align: center;
    display: inline-block;
    .el-link {
      // color: #fff;
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
      margin: 5px 0;
      &:hover {
        background: #0066ff;
      }
      &:active {
        background: #0066ff;
        color: #fff;
      }
    }
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
      color: #fff;
    }
  }
}

.s1-color {
  color: #ff0000 !important;
  fill: #ff0000 !important;
}
.s2-color {
  color: #ff9900 !important;
  fill: #ff9900 !important;
}
.s3-color {
  color: #ffcc00 !important;
  fill: #ffcc00 !important;
}
.s4-color {
  color: #ffff00 !important;
  fill: #ffff00 !important;
}
.s5-color {
  color: #ffff88 !important;
  fill: #ffff88 !important;
}
.aia-content /deep/ .el-table__row {
  cursor: pointer !important;
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
  /* width: 100px; */
}
</style>
