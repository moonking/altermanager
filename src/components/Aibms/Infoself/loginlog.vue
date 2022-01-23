<template>
  <div class="aia-content">
    <!-- 筛选 -->
    <div class="search-bar">

    </div>
    <!-- 表格数据 -->
    <el-table
      :data="tableData"
      stripe
      height="86%"
      :header-cell-style="{ background: '#f5f5f5' }"
      style="width: 100%"
    >
      <el-table-column prop="loginName" label="登录用户名">
<!--        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="light"
            :content="scope.row.name"
            placement="top"
          >
            <span class="white-space">{{ scope.row.name }}</span>
          </el-tooltip>
        </template> -->
      </el-table-column>
      <el-table-column prop="ip" label="登录IP地址">
      </el-table-column>
      <el-table-column prop="message" label="操作动作" />
      <el-table-column prop="createtime" label="时间" />
      <template slot="empty">
        <div class="blank-page">
          <div class="img-content">
            <img src="../../../../static/img/blank-page.png" alt />
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

  </div>
</template>

<script>
import axios from '@/api'

export default {

  data: () => ({
    callNum: 0,
    classList: [],
    tableData: [],
    page: {
      current: 1,
      size: 10
    },
    totalSize: 0,
    confirmDeleteDialogVisible: false,
    currentDeleteItemId: -1
  }),
  created() {
    let params = this.getParams()
    // this.getClassList()
    this.getLoginlogList(params)
  },
  methods: {

    // 将search数据缓存至session
    setSession() {
      if (this.callNum > 0) {
        const params = {
          current: this.page.current,
          size: this.page.size
        }
        sessionStorage.setItem('search', JSON.stringify(params))
      }
    },
    getParams() {
      let params
      console.log(sessionStorage)
      if (sessionStorage.getItem('search') !== null) {
        params = JSON.parse(sessionStorage.getItem('search'))
        const { current, size } = params
        this.page.current = current
        this.page.size = size
      }
      return params
    },

    // 获取日志列表
    getLoginlogList(params) {
      if (params === undefined) {
        params = {
          current: this.page.current,
          size: this.page.size
        }
      }
      axios.getLoginlog(params).then(res => {
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
    // 分页
    handleCurrentChange() {
      this.getLoginlogList()
    },
    // 表格每页数量
    handleSizeChange() {
      this.page.current = 1
      this.getLoginlogList()
    },
    search() {
      this.page.current = 1
      this.getLoginlogList()
    },
    // 关闭删除dialog
    handleDelete(row) {
      this.currentDeleteItemId = row.iD
      this.confirmDeleteDialogVisible = true
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
  .search-type {
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
.white-space {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
