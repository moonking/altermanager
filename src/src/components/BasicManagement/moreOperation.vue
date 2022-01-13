<template>
  <div class="bg">
    <div class="operationLog">用户操作记录</div>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="操作人">
        <el-input v-model="formInline.user" placeholder="姓名/手机号码"></el-input>
      </el-form-item>
      <el-form-item label="操作时间">
        <el-select v-model="formInline.region" placeholder="活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="操作内容">
        <el-input v-model="formInline.user"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查找</el-button>
      </el-form-item>
    </el-form>
    <div class="table">
      <div v-if="!tableData" class="noData">没有操作记录</div>
      <el-table
        v-if="tableData"
        :data="tableData"
        stripe
        style="width: 100%"
        :header-cell-style="{ background: '#f5f5f5' }"
      >
        <el-table-column prop="operator" label="操作人"></el-table-column>
        <el-table-column prop="phoneNum" label="手机号码"></el-table-column>
        <el-table-column prop="roles" label="所拥有的角色" min-width="200px"></el-table-column>
        <el-table-column prop="operationLog" label="操作内容" min-width="300px"></el-table-column>
        <el-table-column prop="date" label="操作时间" sortable></el-table-column>
      </el-table>
    </div>
    <!-- 分页功能 -->
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-sizes="[20, 50, 100]"
        :page-size="100"
        layout="sizes, prev, next, jumper, total"
        :total="400"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  name: 'MoreOperation',
  data () {
    return {
      formInline: {
        user: '',
        region: ''
      },
      tableData: [
        {
          operator: '小王',
          phoneNum: '999999999',
          roles: '管理员，超级管理员，超超超级管理员',
          date: '2016-05-02',
          operationLog: '上海市普陀区金沙江路 1518 弄'
        }, {
          operator: '小王',
          phoneNum: '999999999',
          roles: '管理员，超级管理员，超超超级管理员',
          date: '2016-05-02',
          operationLog: '上海市普陀区金沙江路 1518 弄'
        }, {
          operator: '小王',
          phoneNum: '999999999',
          roles: '管理员，超级管理员，超超超级管理员',
          date: '2016-05-02',
          operationLog: '上海市普陀区金沙江路 1518 弄'
        }, {
          operator: '小王',
          phoneNum: '999999999',
          roles: '管理员，超级管理员，超超超级管理员',
          date: '2016-05-02',
          operationLog: '上海市普陀区金沙江路 1518 弄'
        }, {
          operator: '小王',
          phoneNum: '999999999',
          roles: '管理员，超级管理员，超超超级管理员',
          date: '2016-05-02',
          operationLog: '上海市普陀区金沙江路 1518 弄'
        }, {
          operator: '小王',
          phoneNum: '999999999',
          roles: '管理员，超级管理员，超超超级管理员',
          date: '2016-05-02',
          operationLog: '上海市普陀区金沙江路 1518 弄'
        }, {
          operator: '小王',
          phoneNum: '999999999',
          roles: '管理员，超级管理员，超超超级管理员',
          date: '2016-05-02',
          operationLog: '上海市普陀区金沙江路 1518 弄'
        }, {
          operator: '小王',
          phoneNum: '999999999',
          roles: '管理员，超级管理员，超超超级管理员',
          date: '2016-05-02',
          operationLog: '上海市普陀区金沙江路 1518 弄'
        }, {
          operator: '小王',
          phoneNum: '999999999',
          roles: '管理员，超级管理员，超超超级管理员',
          date: '2016-05-02',
          operationLog: '上海市普陀区金沙江路 1518 弄'
        }, {
          operator: '小王',
          phoneNum: '999999999',
          roles: '管理员，超级管理员，超超超级管理员',
          date: '2016-05-02',
          operationLog: '上海市普陀区金沙江路 1518 弄'
        }, {
          operator: '小王',
          phoneNum: '999999999',
          roles: '管理员，超级管理员，超超超级管理员',
          date: '2016-05-02',
          operationLog: '上海市普陀区金沙江路 1518 弄'
        }, {
          operator: '小王',
          phoneNum: '999999999',
          roles: '管理员，超级管理员，超超超级管理员',
          date: '2016-05-02',
          operationLog: '上海市普陀区金沙江路 1518 弄'
        }, {
          operator: '小王',
          phoneNum: '999999999',
          roles: '管理员，超级管理员，超超超级管理员',
          date: '2016-05-02',
          operationLog: '上海市普陀区金沙江路 1518 弄'
        }, {
          operator: '小王',
          phoneNum: '999999999',
          roles: '管理员，超级管理员，超超超级管理员',
          date: '2016-05-02',
          operationLog: '上海市普陀区金沙江路 1518 弄'
        }, {
          operator: '小王',
          phoneNum: '999999999',
          roles: '管理员，超级管理员，超超超级管理员',
          date: '2016-05-02',
          operationLog: '上海市普陀区金沙江路 1518 弄'
        }, {
          operator: '小王',
          phoneNum: '999999999',
          roles: '管理员，超级管理员，超超超级管理员',
          date: '2016-05-02',
          operationLog: '上海市普陀区金沙江路 1518 弄'
        }, {
          operator: '小王',
          phoneNum: '999999999',
          roles: '管理员，超级管理员，超超超级管理员',
          date: '2016-05-02',
          operationLog: '上海市普陀区金沙江路 1518 弄'
        }, {
          operator: '小王',
          phoneNum: '999999999',
          roles: '管理员，超级管理员，超超超级管理员',
          date: '2016-05-02',
          operationLog: '上海市普陀区金沙江路 1518 弄'
        }, {
          operator: '小王',
          phoneNum: '999999999',
          roles: '管理员，超级管理员，超超超级管理员',
          date: '2016-05-02',
          operationLog: '上海市普陀区金沙江路 1518 弄'
        }, {
          operator: '小王',
          phoneNum: '999999999',
          roles: '管理员，超级管理员，超超超级管理员',
          date: '2016-05-02',
          operationLog: '上海市普陀区金沙江路 1518 弄'
        }, {
          operator: '小王',
          phoneNum: '999999999',
          roles: '管理员，超级管理员，超超超级管理员',
          date: '2016-05-02',
          operationLog: '上海市普陀区金沙江路 1518 弄'
        }, {
          operator: '小王',
          phoneNum: '999999999',
          roles: '管理员，超级管理员，超超超级管理员',
          date: '2016-05-02',
          operationLog: '上海市普陀区金沙江路 1518 弄'
        }, {
          operator: '小王',
          phoneNum: '999999999',
          roles: '管理员，超级管理员，超超超级管理员',
          date: '2016-05-02',
          operationLog: '上海市普陀区金沙江路 1518 弄'
        }, {
          operator: '小王',
          phoneNum: '999999999',
          roles: '管理员，超级管理员，超超超级管理员',
          date: '2016-05-02',
          operationLog: '上海市普陀区金沙江路 1518 弄'
        }, {
          operator: '小王',
          phoneNum: '999999999',
          roles: '管理员，超级管理员，超超超级管理员',
          date: '2016-05-02',
          operationLog: '上海市普陀区金沙江路 1518 弄'
        }, {
          operator: '小王',
          phoneNum: '999999999',
          roles: '管理员，超级管理员，超超超级管理员',
          date: '2016-05-02',
          operationLog: '上海市普陀区金沙江路 1518 弄'
        }, {
          operator: '小王',
          phoneNum: '999999999',
          roles: '管理员，超级管理员，超超超级管理员',
          date: '2016-05-02',
          operationLog: '上海市普陀区金沙江路 1518 弄'
        }, {
          operator: '小王',
          phoneNum: '999999999',
          roles: '管理员，超级管理员，超超超级管理员',
          date: '2016-05-02',
          operationLog: '上海市普陀区金沙江路 1518 弄'
        }, {
          operator: '小王',
          phoneNum: '999999999',
          roles: '管理员，超级管理员，超超超级管理员',
          date: '2016-05-02',
          operationLog: '上海市普陀区金沙江路 1518 弄'
        }, {
          operator: '小王',
          phoneNum: '999999999',
          roles: '管理员，超级管理员，超超超级管理员',
          date: '2016-05-02',
          operationLog: '上海市普陀区金沙江路 1518 弄'
        }
      ],
      currentPage4: 4
    }
  },
  methods: {
    onSubmit () {
      console.log('submit!')
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
    }

  }
}
</script>
<style scoped>
.bg {
  margin: 10px;
  background: none;
  border-radius: 5px;
}
.operationLog {
  height: 60px;
  line-height: 60px;
  padding-left: 20px;
  color: #fff;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  font-size: 24px;
}
.el-form {
  margin: 20px 20px 0;
  text-align: center;
}
.table {
  padding: 0 20px 20px;
}
.block {
  text-align: right;
  margin-right: 40px;
  margin-top: 20px;
}
.el-form {
  text-align: left;
  /* padding: 20px 0 0 40px; */
}
</style>
