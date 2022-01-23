<template>
  <div class="aia-content">
    <!-- 筛选 -->

    <!-- 表格数据 -->
    <el-table
      :data="tableData"
      stripe
      style="width: 100%"
      height="82%"
    >
      <el-table-column prop="name" label="服务名称" />
      <el-table-column prop="platform" label="类型" />
      <el-table-column prop="address" label="地址" />
      <el-table-column prop="status" label="服务状态">
        <template v-slot="scope">
          <div>
           <icon-svg :icon-class="scope.row.status === 'UP' ?'success': 'error'" :class="scope.row.status === 'UP' ?'icon-success':'icon-error'"></icon-svg>
            <!-- <i
              :class="
                scope.row.status === 'UP' ? 'el-icon-success' : 'el-icon-error'
              "
              :style="{
                color: scope.row.status === 'UP' ? 'green' : 'red',
                fontSize: '20px',
              }"
            ></i> -->
          </div>
        </template>
      </el-table-column>

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
    tableData: [
      {
        name: 'AIBMS告警采集服务',
        platform: '后端模块',
        address: 'http://aibms-cn.aia.biz:8001/actuator/health',
        status: 'DOWN',
        aliasname: 'collector'
      },
      {
        name: 'AIBMS告警分析服务',
        platform: '后端模块',
        address: 'http://aibms-cn.aia.biz:8002/actuator/health',
        status: 'DOWN',
        aliasname: 'analyzer'
      },
      {
        name: 'AIBMS微服务网关',
        platform: '后端模块',
        address: 'http://aibms-cn.aia.biz:8075/actuator/health',
        status: 'DOWN',
        aliasname: 'zuul'
      },
      {
        name: 'AIBMS微服务注册中心',
        platform: '后端模块',
        address: 'http://aibms-cn.aia.biz:8076/actuator/health',
        status: 'DOWN',
        aliasname: 'eureka'
      },
      {
        name: 'AIBMS配置控制台',
        platform: '后端模块',
        address: 'http://aibms-cn.aia.biz:8086/actuator/health',
        status: 'DOWN',
        aliasname: 'console'
      },
      {
        name: 'AIBMS关联关系服务',
        platform: '后端模块',
        address: 'http://aibms-cn.aia.biz:8087/actuator/health',
        status: 'DOWN',
        aliasname: 'cmdb'
      }

    ],
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
    this.handleCheck()
    axios.getHealth().then(res => {
      const healthdata = this.tableData
      this.tableData.forEach((tabledata, index) => {
        healthdata[index].status = res.data.data[tabledata.aliasname]
      })
      this.tableData = healthdata
    })

    // let params = this.getParams()
    // this.getMonitorList(params)
  },
  methods: {
    handleCheck() {
      // this.tableData.forEach((data, index) => {
      //   const url = data.address
      //   this.$axios.get(url, {})
      //     .then((res) => {
      //       console.log(res.status)
      //       if (res.status == 200) {
      //         this.tableData[index].status = '1'
      //       }
      //     })
      //     .catch((error) => {
      //       this.tableData[index].status = '0'
      //     })
      //   console.log(this.tableData[index])
      // })

    },

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
    // 跳转至监控来源详情
    sourceDetail(row) {
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
    // handleCurrentChange() {
    //   this.getMonitorList()
    // },
    // 表格每页数量
    // handleSizeChange() {
    //   this.page.current = 1
    //   this.getMonitorList()
    // },
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
