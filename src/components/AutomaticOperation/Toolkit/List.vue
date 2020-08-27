<template>
  <div class="toolkit">
    <el-table
    :data="tableData"
    stripe
    @row-click="goWatch"
    :header-cell-style="{ background: '#f5f5f5' }"
    >
      <el-table-column label="名称" prop="name" />
      <el-table-column label="操作" align="center" width="240px">
        <template slot-scope="scope">
          <div class="btn-box">
            <span @click.stop="goSet(scope.row.toolsId, scope.row.name)">编辑</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        v-if="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currPage"
        :page-sizes="[10,30,50]"
        layout="prev, pager, next, sizes, total, jumper"
        :total="total"
        style="text-align: center;cursor: pointer;"
      />
    </div>
  </div>
</template>
<script>
import axios from '@/api';
export default {
  name: 'toolkit',
  data () {
    return {
      tableData: [],
      currPage: 1,
      total: 0
    }
  },
  created () {
    this.getToolkitList()
  },
  methods: {
    tableRowClassName ({ row, rowIndex }) {
      if (rowIndex % 2 === 0) {
        return 'double-class'
      } else {
        return 'single-class'
      }
    },
    handleSizeChange (size) {

    },
    handleCurrentChange (page) {

    },
    goSet (id, name) {
      this.$router.push({
        path: '/AutomaticOperation/SetToolkit/set',
        query: {
          code: 4,
          id: id,
          name: name
        }
      })
    },
    goWatch (row) {
      this.$router.push({
        path: '/AutomaticOperation/SetToolkit/watch',
        query: {
          code: 4,
          id: row.toolsId,
          name: row.name
        }
      })
    },
    // 获取工具集列表
    getToolkitList () {
      axios.OpsToolkitList().then(res => {
        if (res.data.code === 200) {
          this.tableData = res.data.data
        }
      })
    }
  }
}
</script>
<style scoped>
.toolkit {
  margin: 10px;
}
.el-table /deep/ .single-class {
  background: #fcfcfc !important;
}

.el-table /deep/ .double-class {
  background: #f5f5f5 !important;
}
.block {
  margin-top: 92px;
}
.task-btn-box span {
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
.btn-box span {
  margin: 0 5px;
  cursor: pointer;
}
.btn-box span:hover {
  color: #0066ff;
}
</style>
