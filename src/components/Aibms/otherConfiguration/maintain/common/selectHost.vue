<template>
  <div class="select-content">
    <!-- 筛选 -->
    <el-form
      :inline="true"
      ref="searchFrom"
      :model="searchFrom"
      label-width="80px"
      v-if="!readOnly"
    >
      <el-form-item>
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
      <el-form-item>
        <el-input
          v-model="searchFrom.ipAddress"
          clearable
          placeholder="请输入主机名"
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" class="search-icon" @click="search"
          >搜索</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 表格数据 -->
    <el-table
      :data="tableData"
      ref="dataTable"
      stripe
      :header-cell-style="{ background: '#f5f5f5' }"
      @select-all="handleSelectionChange"
      @select="handleSelectionChange"
    >
      <el-table-column
        v-if="!readOnly"
        type="selection"
        width="55"
        :selectable="checkSelectable"
      />
      <!-- <el-table-column prop="name" label="业务系统" /> -->
      <el-table-column prop="hosts" label="主机" />
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
      style="text-align: center; margin: 92px 0"
    />
  </div>
</template>

<script>
import axios from '@/api'
export default {
  props: {
    checkedTableData: {
      type: Array
    },
    readOnly: {
      required: true,
      default: false,
      type: Boolean
    }
  },
  watch: {
    // 获取勾选数据
    checkedTableData(val, oldVal) {
      if (val.length) {
        if (this.$route.query.id) {
          this.hostList = val
          this.returnSelect()
          if (this.readOnly) {
            this.tableData = val
          }
        }
      }
    }
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
      size: 10
    },
    totalSize: 0,
    hostList: [],
    checkedHostList: [],
    firstLoad: true
  }),
  created() {
    if (this.$route.query.id) {
      if (!this.readOnly) {
        this.getHostTableData()
      }
    } else {
      this.getHostTableData()
    }
  },
  methods: {
    checkSelectable(row) {
      return !row.belongOps
    },
    returnSelect() {
      setTimeout(() => {
        this.$nextTick(() => {
          this.hostList.forEach(result => {
            this.tableData.forEach((row, index) => {
              if (row.systemId === result.systemId && row.ciitemId === result.ciitemId) {
                this.$refs.dataTable.toggleRowSelection(this.tableData[index], true)
              }
            })
          })
        })
      }, 300)
    },
    search() {
      this.getHostTableData()
    },
    getHostTableData() {
      const params = {
        name: this.searchFrom.businessValue,
        ipAddress: this.searchFrom.ipAddress,
        current: this.page.current,
        size: this.page.size
      }
      axios.getCiSystemList(params).then(res => {
        if (res.data.success) {
          this.tableData = res.data.data.records
          this.totalSize = Number(res.data.data.total)
          // 获取下拉列表的数据
          if (this.firstLoad) {
            this.businessList = [...new Set(res.data.data.records.map(item => item.name))]
            this.firstLoad = false
          }
        } else {
          this.$notify.error({
            title: '提示',
            message: res.data.message
          })
        }
      })
      this.returnSelect()
    },
    handleSelectionChange(val) {
      this.hostList = val
    },
    // 分页
    handleCurrentChange() {
      this.getHostTableData()
    },
    // 表格每页数量
    handleSizeChange() {
      this.page.current = 1
      this.getHostTableData()
    }
  }
}
</script>

<style lang="scss" scoped>
.select-content {
  margin: 50px 20px 20px;
}
.search-icon {
  color: #fff;
  border: 1px solid #fff;
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
</style>
