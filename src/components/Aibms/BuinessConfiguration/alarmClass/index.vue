<template>
  <div class="aia-content">
    <!-- 筛选 -->
    <el-form :inline="true" :model="alarmModel" label-width="80px">
      <el-form-item>
        <el-autocomplete
          v-model="alarmModel.alarmClass"
          clearable
          :fetch-suggestions="querySearch"
          :trigger-on-focus="false"
          class="inline-input"
          placeholder="请输入告警分类"
        />
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="alarmModel.sourceValue"
          clearable
          placeholder="请选择来源"
        >
          <el-option
            v-for="item in sourceList"
            :key="item.id"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item class="search-type">
        <el-button icon="el-icon-search" @click="search">搜索</el-button>
      </el-form-item>
      <el-form-item class="add-type">
        <el-button type="primary" icon="el-icon-plus" @click="addType">新增</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格数据 -->
    <el-table
      :data="tableData"
      stripe
      @row-click="classDetail"
      :header-cell-style="{background:'#f5f5f5'}"
      style="width: 100%"
      >
      <el-table-column prop="name" label="分类名称" />
      <el-table-column prop="label" label="标签">
        <template slot-scope="scope">
          {{ scope.row.label | labelFilter }}
        </template>
      </el-table-column>
      <el-table-column prop="source" label="来源" />
      <el-table-column align="center" prop="operation" label="操作">
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
    <!-- 删除提示 -->
    <el-dialog center title="删除提示" :visible.sync="confirmDeleteDialogVisible" width="25%">
      <div style="text-align: center">
        <i class="el-icon-warning" /> 确认删除？
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" class="nomal-button" @click="confirmDeleteDialogVisible = false">取消</el-button>
        <el-button size="medium" type="primary" @click="confirmDelete">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from '@/api'
const labelMap = {
  '1': '业务',
  '2': '服务',
  '3': '网络',
  '4': '系统',
  '5': '应用'
}
export default {
  filters: {
    labelFilter: label => labelMap[label]
  },
  data: () => ({
    classList: [],
    sourceList: [
      {
        id: 1,
        value: 'BPC',
        label: 'BPC'
      }, {
        id: 2,
        value: 'Dynatrace',
        label: 'Dynatrace'
      }, {
        id: 3,
        value: 'Prometheus',
        label: 'Prometheus'
      }
    ],
    tableData: [],
    alarmModel: {
      alarmClass: '',
      sourceValue: ''
    },
    page: {
      current: 1,
      size: 10
    },
    totalSize: 0,
    confirmDeleteDialogVisible: false,
    currentDeleteItemId: -1
  }),
  created () {
    this.getClassList()
    this.getAlarmList()
  },
  methods: {
    getClassList () {
      axios.geAlarmNameList().then(res => {
        if (res.data.success) {
          this.classList = res.data.data
        } else {
          this.$notify({
            title: '提示',
            type: 'error',
            message: res.message
          })
        }
      })
    },
    // 联想输入
    querySearch (queryString, cb) {
      const alarmClassList = this.classList
      const results = queryString ? alarmClassList.filter(this.createFilter(queryString)) : alarmClassList
      cb(results)
    },
    createFilter (queryString) {
      return (classList) => {
        return (classList.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    getAlarmList () {
      const params = {
        name: this.alarmModel.alarmClass,
        source: this.alarmModel.sourceValue,
        label: '',
        current: this.page.current,
        size: this.page.size
      }
      axios.getAlarmList(params).then(res => {
        if (res.data.success) {
          this.tableData = res.data.data.records
          this.totalSize = Number(res.data.data.total)
        } else {
          this.$notify({
            title: '提示',
            type: 'error',
            message: res.message
          })
        }
      })
    },
    // 分页
    handleCurrentChange () {
      this.getAlarmList()
    },
    // 表格每页数量
    handleSizeChange () {
      this.page.current = 1
      this.getAlarmList()
    },
    search () {
      this.getAlarmList()
    },
    addType () {
      this.$router.push({
        path: '/Aibms/BuinessConfiguration/addClass',
        query: {
          code: 8
        }
      })
    },
    handleEdit (row) {
      this.$router.push({
        path: '/Aibms/BuinessConfiguration/addClass',
        query: {
          code: 8,
          id: row.iD
        }
      })
    },
    handleDelete (row) {
      this.currentDeleteItemId = row.iD
      this.confirmDeleteDialogVisible = true
    },
    confirmDelete () {
      const id = this.currentDeleteItemId
      axios.deleteAlarm(id).then(res => {
        if (res.data.success) {
          this.$notify.success({
            title: '提示',
            message: res.data.message
          })
          this.getAlarmList()
        } else {
          this.$notify.error({
            title: '提示',
            message: res.data.message
          })
        }
      })
      this.confirmDeleteDialogVisible = false
    },
    classDetail (row) {
      this.$router.push({
        path: '/Aibms/BuinessConfiguration/addClass',
        query: {
          code: 8,
          id: row.iD,
          read: true
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.aia-content {
  position: relative;
  width: 100%;
  padding: 10px 0;
  box-sizing: border-box;
  .search-type {
    .el-button {
      border: 1px solid #fff;
      color: #fff;
      &:hover {
        border: 1px solid #fff;
        color: #fff;
        background: transparent;
      }
      &:focus {
        color: #fff;
        background: transparent;
      }
      &:active {
        border: 1px solid #fff;
        background: transparent;
        color: #fff;
      }
    }
  }
  .add-type {
    position: absolute;
    right: -10px;
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
      color: #fff;
    }
  }
}
</style>
