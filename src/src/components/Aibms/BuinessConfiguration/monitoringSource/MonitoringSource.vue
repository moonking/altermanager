<template>
  <div class="aia-content">
    <!-- 筛选 -->
    <div class="search-bar">
      <el-form
        :inline="true"
        :model="sourceModel"
        label-width="80px"
        class="search-inline-form"
      >
        <el-form-item>
          <el-input
            v-model="sourceModel.webAdress"
            clearable
            placeholder="请输入地址"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="sourceModel.sourceValue"
            clearable
            placeholder="请选择来源"
          >
            <el-option
              v-for="item in source"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="search-source">
          <el-button
            icon="el-icon-search"
            class="search-icon"
            @click.stop="search"
            >搜索</el-button
          >
        </el-form-item>
      </el-form>
      <el-form :inline="true" class="search-inline-btn">
        <el-form-item>
          <el-button type="primary" icon="el-icon-plus" @click="addSource"
            >新增</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <!-- 表格数据 -->
    <el-table
      :data="tableData"
      stripe
      style="width: 100%"
      height="82%"
      @row-click="sourceDetail"
    >
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="platform" label="来源" />
      <el-table-column prop="address" label="地址" show-overflow-tooltip />
      <el-table-column prop="status" label="状态">
        <template v-slot="scope">
          <div>
            <i
              :class="
                scope.row.status === '1' ? 'el-icon-success' : 'el-icon-error'
              "
              :style="{
                color: scope.row.status === '1' ? 'green' : 'red',
                fontSize: '20px',
              }"
            ></i>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="operation" label="操作">
        <template v-slot="scope">
          <div class="task-btn-box">
            <el-link
              type="primary"
              :underline="false"
              @click.stop="handleEdit(scope.row)"
              >编辑</el-link
            >
            <el-link
              type="primary"
              :underline="false"
              @click.stop="handleDelete(scope.row)"
              >删除</el-link
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
      v-if="totalSize && totalSize > 10"
      :current-page.sync="page.current"
      :page-size.sync="page.size"
      :page-sizes="[10, 20, 30]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalSize"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      class="absolute-center"
    />
    <!-- 删除提示 -->
    <el-dialog
      center
      title="删除提示"
      :visible.sync="confirmDeleteDialogVisible"
      width="25%"
    >
      <div style="text-align: center">
        <i class="el-icon-warning" /> 确认删除？
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button
          size="medium"
          class="nomal-button"
          @click="confirmDeleteDialogVisible = false"
          >取消</el-button
        >
        <el-button size="medium" type="primary" @click="confirmDelete"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from '@/api'
export default {
  data: () => ({
    source: [
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
      }, {
        id: 4,
        value: 'Splunk',
        label: 'Splunk'
      }, {
        id: 5,
        value: 'ARMS',
        label: 'ARMS'
      }
    ],
    tableData: [],
    sourceModel: {
      sourceValue: '',
      webAdress: ''
    },
    confirmDeleteDialogVisible: false,
    currentDeleteItemId: -1,
    page: {
      current: 1,
      size: 10
    },
    totalSize: 0,
    callNum: 0
  }),
  created() {
    let params = this.getParams()
    this.getMonitorList(params)
  },
  methods: {
    // 将search信息缓存至session
    setSession() {
      if (this.callNum > 1) {
        const params = {
          current: this.page.current,
          size: this.page.size,
          platform: this.sourceModel.sourceValue,
          address: this.sourceModel.webAdress
        }
        sessionStorage.setItem('search', JSON.stringify(params))
      }
    },
    // 将缓存在session的信息回显至search
    getParams() {
      let params
      if (sessionStorage.getItem('search') !== null) {
        params = JSON.parse(sessionStorage.getItem('search'))
        const { current, size, platform, address } = params
        this.sourceModel.sourceValue = platform
        this.sourceModel.webAdress = address
        this.page.current = current
        this.page.size = size
      }
      return params
    },
    //  获取监控来源列表
    getMonitorList(params) {
      if (params === undefined) {
        params = {
          current: this.page.current,
          size: this.page.size,
          platform: this.sourceModel.sourceValue,
          address: this.sourceModel.webAdress
        }
      }

      axios.getMonitorList(params).then(res => {
        if (res.data.success) {
          this.tableData = res.data.data.records
          this.totalSize = Number(res.data.data.total)
          this.callNum++
        } else {
          this.$notify({
            title: '提示',
            type: 'error',
            message: res.message
          })
        }
      })
    },
    // 搜索
    search() {
      this.page.current = 1
      this.getMonitorList()
    },
    // 跳转至监控来源详情
    sourceDetail(row) {
      this.setSession()
      this.$router.push({
        path: '/Aibms/BuinessConfiguration/addSource',
        query: {
          status: 'read',
          code: 2,
          id: row.id
        }
      })
    },
    // 跳转到详情页面
    handleEdit(row) {
      this.setSession()
      this.$router.push({
        path: '/Aibms/BuinessConfiguration/addSource',
        query: {
          code: 2,
          id: row.id
        }
      })
    },
    // 关闭删除dialog
    handleDelete(row) {
      this.currentDeleteItemId = row.id
      this.confirmDeleteDialogVisible = true
    },
    // 跳转到新增页面
    addSource() {
      this.$router.push({
        path: '/Aibms/BuinessConfiguration/addSource',
        query: {
          code: 2
        }
      })
    },
    // 分页
    handleCurrentChange() {
      this.getMonitorList()
    },
    // 表格每页数量
    handleSizeChange() {
      this.page.current = 1
      this.getMonitorList()
    },
    //  删除监控来源
    confirmDelete() {
      const id = this.currentDeleteItemId
      axios.deleteMonitor(id).then(res => {
        if (res.data.success) {
          this.$notify.success({
            title: '提示',
            message: res.data.message
          })
          this.getMonitorList()
        } else {
          this.$notify.error({
            title: '提示',
            message: res.data.message
          })
        }
      })
      this.confirmDeleteDialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.aia-content {
  position: relative;
  width: 100%;
  height: 94%;
  padding: 10px 10px;
  box-sizing: border-box;
  .search-source {
    .el-button {
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
<style>
.notify-style {
  width: 360px;
  height: 160px;
  background-color: #161616b3;
  border-radius: 5px;
  border: none;
  color: #fff;
  box-shadow: 0 0 10px #000;
}
.notify-title {
  font-size: 14px;
  font-weight: bold;
  color: #fff;
  padding-bottom: 10px;
  border-bottom: 1px dashed #ddd;
}
.notify-content {
  margin-top: 16px;
  font-size: 14px;
  color: #fff;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
.notify-item {
  margin-bottom: 4px;
}
.notify-item:last-child {
  margin-bottom: 0;
}
</style>
