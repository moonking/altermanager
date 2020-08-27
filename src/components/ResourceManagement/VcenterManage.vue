<template>
  <div class="task-list">
    <el-row>
      <el-form :inline="true" :model="search" class="form-area">
        <el-form-item>
          <el-input placeholder="请输入IP" v-model="search.ipAddress" clearable />
        </el-form-item>
        <el-form-item class="operation-form">
          <el-button icon="el-icon-search" class="search-button" @click="searchList">搜索</el-button>
          <el-button
            icon="el-icon-plus"
            type="primary"
            class="add-form"
            @click="goAddHost"
          >添加</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row class="group-btn">
      <!-- <div class="btn">
        <el-dropdown>
          <span class="el-dropdown-link">
            批量操作<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>上线</el-dropdown-item>
            <el-dropdown-item>下线</el-dropdown-item>
            <el-dropdown-item>关机</el-dropdown-item>
            <el-dropdown-item>重启</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>-->
      <!-- <p style="float: right;padding-right: 10px;color: #888888">上次同步时间：2019-03-05 12：30</p> -->
    </el-row>
    <el-row>
      <el-table :data="vcenters" style="width: 100%" :header-cell-style="{ background: '#f5f5f5' }">
        <el-table-column type="selection" width="55" style="text-align: center" />
        <el-table-column prop="ipAddress" label="ip" />
        <el-table-column prop="portNum" label="端口号" />
        <el-table-column prop="userName" label="用户名" />
        <el-table-column prop="userName" label="密码">
          <template>
            <div>.......</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="330px">
          <template slot-scope="scope">
            <div class="task-btn-box">
              <span class="special" @click="editVcenter(scope.row.vcenterId)">
                <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
                  <icon-svg icon-class="bianji" />
                </el-tooltip>
              </span>
              <span class="special" @click="confirmDelete(scope.row.vcenterId)">
                <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                  <icon-svg icon-class="shanchu" />
                </el-tooltip>
              </span>
            </div>
          </template>
        </el-table-column>
        <div slot="empty">
          <div class="blank-page">
            <div class="imgdiv">
              <img src="../../../static/img/blank-page.png" alt />
            </div>
            <p class="empty-text">暂无相关数据</p>
          </div>
        </div>
      </el-table>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="search.current"
          :page-sizes="[10,30,50]"
          layout="prev, pager, next, sizes, total, jumper"
          :total="total"
          v-if="total"
          style="margin-right:15px;cursor: pointer;"
        />
      </div>
    </el-row>
  </div>
</template>

<script>
import axios from '@/api';
export default {
  name: 'HostManage',
  data () {
    return {
      dialogVisible: false,
      search: {
        ipAddress: '',
        current: 1,
        size: 10
      },
      vcenters: [],
      total: 0,
      hostList: []
    }
  },
  created() {
    // 获取vcenter列表
    this._vcenterList()
  },
  methods: {
    // 关键字搜索
    searchList() {
      this.search.current = 1
      this._vcenterList()
    },
    // 跳转编辑Vcenter
    editVcenter(id) {
      this.$router.push({
        path: '/ResourceManagement/editVcenter',
        query: {
          vcenterId: id,
          code: 5
        }
      })
    },
    // 获取vcenter列表
    _vcenterList() {
      axios.vcenterList(this.search).then(result => {
        if (result.data.code === 200) {
          this.vcenters = result.data.data.records
          this.total = result.data.data.total
        } else {
          this.$notify({
            title: '提示',
            message: result.data.message,
            duration: 2000,
            type: 'error'
          })
        }
      }).catch(e => {
        this.$notify({
          title: '提示',
          message: e.data.message,
          duration: 2000,
          type: 'error'
        })
      })
    },
    //  添加vcenter
    goAddHost() {
      console.log('**************************')
      this.$router.push({
        path: '/ResourceManagement/addVcenter',
        query: {
          code: 5
        }
      })
    },
    // 请求删除当前vcenter
    _deleteVcenter(vcenterId) {
      axios.deleteVcenter(vcenterId).then(result => {
        if (result.data.code === 200) {
          this.$notify({
            title: '提示',
            message: '已删除',
            duration: 2000,
            type: 'error'
          })

          if (this.search.current > 1 && this.vcenters.length === 0) {
            this.search.current -= 1
          }

          this._vcenterList()
        } else {
          this.$notify({
            title: '提示',
            message: result.data.message,
            duration: 2000,
            type: 'error'
          })
        }
      }).catch(e => {
        this.$notify({
          title: '提示',
          message: '删除失败',
          duration: 2000,
          type: 'error'
        })
      })
    },
    confirmDelete(vcenterId) {
      this.$confirm(`确认删除?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(result => {
        this._deleteVcenter(vcenterId)
      }).catch(e => {

      })
    },
    // 分页
    handleCurrentChange(val) {
      this.search.current = val
      this._vcenterList()
    },
    handleSizeChange(val) {
      this.search.size = val
      this._vcenterList()
    }

  }
}
</script>

<style lang="scss" scoped>
.blank-page .imgdiv {
  height: 200px;
  padding-top: 15px;
}
.form-area {
  position: relative;
}
.form-area .operation-form {
  position: absolute;
  right: -10px;
}
.form-area .search-button {
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
.form-area .add-form {
  position: absolute;
  right: 0;
  top: -55px;
}
.blank-page .empty-text {
  font-size: 18px;
  height: 30px;
  line-height: 30px;
  margin-top: -30px;
  margin-bottom: 10px;
  color: #fff;
}
.task-list {
  padding: 10px;
  margin-top: 58px;
}
/* .group-btn {
  padding: 5px;
  height: 40px;
}
.group-btn .btn {
  float: left;
  position: relative;
} */

.block {
  padding: 20px;
  text-align: center;
}
.task-btn-box span {
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
}
.task-btn-box span img {
  height: 12px;
  /* margin-top: 2px; */
  padding: 5px 8px 6px 8px;
  margin-bottom: -6px;
}
.task-btn-box span.special:hover {
  background: #0066ff;
  /* color:#fff!important; */
}
.task-btn-box span:hover {
  background: #0066ff;
}
</style>
