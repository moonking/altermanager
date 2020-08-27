<template>
  <div class="check-node">
    <div class="source-type-select white-color">
      <label>选择资源类型：</label>
      <el-radio-group v-model="radio" @change="ChangeType">
        <el-radio :label="1">OS</el-radio>
        <el-radio :label="2">中间件</el-radio>
        <el-radio :label="3">数据库</el-radio>
        <el-radio :label="4">网络设备</el-radio>
      </el-radio-group>
    </div>
    <div class="source-srarch" v-if="edit">
      <el-form :model="searchForm" class="search-box" :inline="true">
        <el-form-item>
          <el-select v-model="searchForm.env" filterable clearable placeholder="请选择所属环境">
            <el-option
              v-for="(env,index) in envList"
              :label="env.name"
              :value="env.environmentId"
              :key="index"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchForm.sourceName" placeholder="请输入资源名称" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchForm.ipAddress" placeholder="请输入IP地址" />
        </el-form-item>
        <el-form-item>
          <el-button class="cm-form-btn cm-search-btn" @click="searchNode">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="data-box">
      <el-table stripe :data="tableData" :header-cell-style="{background:'#f5f5f5'}" class="non-border">
        <el-table-column label="选择" align="center" v-if="edit" width="60px">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.checked" @change="handleCheckChange(scope.row)"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="资源名称" prop="name" />
        <el-table-column label="所属环境" prop="environmentName" v-if="radio !== 3" />
        <el-table-column label="IP地址" prop="ipAddress" />
        <el-table-column prop="portNum" label="端口号" v-if="radio === 3" />
        <el-table-column prop="instanceName" label="实例名称" v-if="radio === 3" />
        <el-table-column label="检测结果">
          <template slot-scope="scope">
            <span class="result-icon">
              <span v-if="edit">
                <img
                  v-if="scope.row.maResourcesStatus === 'SUCCESS'"
                  src="static/img/task/cg.png"
                  alt
                />
                <span v-else-if="scope.row.maResourcesStatus === 'FAILURE'">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :disabled="!scope.row.message"
                    :content="handleTip(scope.row.message)"
                    placement="top-start"
                  >
                    <img class="failed" src="static/img/task/sb.png" alt />
                  </el-tooltip>
                </span>
                <i v-else-if="scope.row.maResourcesStatus === 'building'" class="el-icon-loading"></i>
                <i v-else>-</i>
              </span>
              <span v-else>
                <img
                  v-if="scope.row.maResourcesStatus === 'SUCCESS'"
                  src="static/img/task/cg.png"
                  alt
                />
                <i v-else>-</i>
              </span>
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="block">
      <el-pagination
        v-if="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="pagesize"
        layout="prev, pager, next, jumper, sizes, total"
        style="cursor: pointer;text-align: center;margin-top: 20px;margin-right:10px"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import axios from '@/api';
export default {
  name: 'checkNode',
  data () {
    return {
      searchForm: {
        env: '',
        sourceName: '',
        ipAddress: ''
      },
      currentId: this.$route.query.id,
      name: this.$route.query.name,
      tableData: [],
      envList: [],
      pagesize: 10,
      page: 1,
      total: 0,
      radio: 1, // 类型切换
      checkArr: [] // 放置选中节点
    }
  },
  props: {
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    edit: {
      type: Boolean,
      default: false
    },
    selectData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  created () {
    this.getSourceList(this.$route.query.id, this.radio)
    this.getEnvList()
  },
  methods: {
    // 错误信息修改
    handleTip (msg) {
      return `错误原因：${msg}`
    },
    // 获取环境列表
    getEnvList () {
      axios.envtablist({}).then(res => {
        if (res.data.code === 200) {
          this.envList = res.data.data.result
        }
      })
    },
    // 选择类型
    ChangeType (val) {
      this.page = 1
      this.pagesize = 10
      this.getSourceList(this.currentId, val)
    },
    // 搜索类型下的节点
    searchNode () {
      let params = {
        current: this.page,
        size: this.pagesize,
        resourcesType: this.radio,
        toolsId: this.currentId,
        environmentId: this.searchForm.env,
        name: this.searchForm.sourceName,
        ipAddress: this.searchForm.ipAddress
      }
      this.getListFun(params)
    },
    // 选择操作
    handleCheckChange (val) {
      let state = this.checkArr.indexOf(val.resourcesId)
      if (val.checked) {
        this.$set(val, 'maResourcesStatus', 'building')
        if (state < 0) {
          this.checkArr.push(val.resourcesId)
        }
        let params = {
          'toolsId': this.currentId,
          'toolsName': this.name,
          'maResourseArray': new Array(val.resourcesId),
          'databaseType': this.radio === 3 ? val.databaseType : '',
          'resourseType': this.radio
        }
        let that = this
        axios.ToolkitStatus(params).then(res => {
          if (res.data.code === 200) {
            setTimeout(() => {
              that.$set(val, 'maResourcesStatus', 'SUCCESS')
            }, 500)
          } else {
            setTimeout(() => {
              that.$set(val, 'maResourcesStatus', 'FAILURE')
              that.$set(val, 'message', res.data.message)
              // that.$notify.error({
              //   title: '提示',
              //   message: `检查错误原因：${res.data.message}`,
              //   duration: 1000
              // });
            }, 600)
          }
        })
      } else {
        if (state > -1) {
          this.checkArr.splice(state, 1)
        }
      }
      this.$emit('update:selectData', this.checkArr)
    },
    // 处理环境数字和名称的转换
    handleEnv (row, column, cellValue, index) {
      if (row.env) {
        return row.env === 0 ? '生产' : row.env === 1 ? '准生产' : '开发'
      } else {
        return ''
      }
    },
    // size选择
    handleSizeChange (size) {
      this.pagesize = size
      this.searchNode()
    },
    // page切换
    handleCurrentChange (page) {
      this.page = page
      this.searchNode()
    },
    // 获取对应类型下的资源列表
    getSourceList (id, num) {
      let params = {
        current: this.page,
        size: this.pagesize,
        resourcesType: num,
        toolsId: id
      }
      this.getListFun(params)
    },
    // 获取列表
    getListFun (params) {
      axios.ToolkitDetail(params).then(res => {
        if (res.data.code === 200) {
          let data = res.data.data.records
          this.total = res.data.data.total * 1
          for (let k of data) {
            if (this.checkArr.indexOf(k.resourcesId) > -1) {
              k.checked = true
            } else {
              k.checked = false
            }
            if (k.maResourcesStatus === 'SUCCESS') {
              if (k.isChose === '1') {
                k.checked = true
              }
            } else {
              k.checked = false
            }
          }
          this.tableData = data
        } else {
          this.$notify({
            type: 'warning',
            title: '提示',
            message: res.data.message
          })
        }
      })
    }
  }
}
</script>
<style scoped>
.source-type-select,
.source-srarch,
.source-sraech > .search-box {
  width: 96%;
  margin: 20px auto;
}
.source-srarch {
  margin-bottom: 0 !important;
}
.el-table {
  width: 96%;
  margin: 0 auto 92px;
}
.result-icon {
  width: 30px;
  height: 30px;
}
.result-icon > span > img {
  width: 24px;
  height: 24px;
  vertical-align: middle;
  border-radius: 50%;
}
.failed {
  width: 24px;
  height: 24px;
  vertical-align: middle;
  border-radius: 50%;
}
</style>
