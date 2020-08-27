<template>
  <div class="dashboard">
    <el-row>
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-form-item class="form-select" style="margin-left: 10px">
          <el-select placeholder="请选择环境" v-model="search.environmental" :clearable="true">
            <el-option
              v-for="environmental in environmentals"
              :label="environmental.label"
              :value="environmental.value"
              :key="environmental.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="form-select">
          <el-select v-model="search.type" placeholder="选择需求类型" :clearable="true">
            <el-option
              v-for="type in warehouseTypes"
              :label="type.label"
              :value="type.value"
              :key="type.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-input placeholder="请输入标题" v-model="search.warehouseName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="请输入编号" v-model="search.warehouseName"></el-input>
        </el-form-item>
        <el-form-item class="item-right overHideMargin">
          <el-button icon="el-icon-search" class="nomal-button" @click="searchList">查找</el-button>
        </el-form-item>
        <!-- <el-button class="headerIcon addBtn" @click="goAddrelease">部署任务</el-button>
        <el-button class="headerIcon addBtn" @click="goAddTask">构建任务</el-button>-->
      </el-form>
    </el-row>
    <div style="padding:0 10px">
      <el-table :data="dataList" stripe style="width: 100%" :header-cell-style="{ background: '#f5f5f5' }">
        <el-table-column prop="id" label="编号"></el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column prop="type" label="类型">
          <template slot-scope="scope">
            <div>
              <span class="demand-type bug">{{ scope.row.type }}</span>
              <span class="demand-type require">{{ scope.row.type }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="发布状态"></el-table-column>
        <el-table-column prop="env" label="环境" width="200px">
          <template>
            <div class="demand-env">
              <span class="active">发布</span>
              <span class="active">STI</span>
              <span>UAT</span>
              <span class="active">生产</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="startTime" label="上线时间"></el-table-column>
        <el-table-column prop="operator" label="执行人"></el-table-column>
        <el-table-column align="center" prop="address" label="操作" width="330px">
          <template></template>
        </el-table-column>
        <div slot="empty">
          <div class="blank-page">
            <div class="imgdiv">
              <img src="../../../../static/img/blank-page.png" alt />
            </div>
            <p class="empty-text">暂无相关数据</p>
          </div>
        </div>
      </el-table>
    </div>
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
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DemandList',
  data () {
    return {
      total: 1,
      search: {},
      dataList: [
        {
          title: '个险业务系统保全模块需求',
          id: 'SHE-2012',
          type: 'bug',
          status: '发布成功',
          env: '开发',
          startTime: '2017-09-21 12：30',
          operator: 'jill'
        },
        {
          title: '个险业务系统保全模块需求',
          id: 'SHE-2012',
          type: 'bug',
          status: '发布成功',
          env: '开发',
          startTime: '2017-09-21 12：30',
          operator: 'jill'
        },
        {
          title: '个险业务系统保全模块需求',
          id: 'SHE-2012',
          type: '需求',
          status: '发布成功',
          env: '开发',
          startTime: '2017-09-21 12：30',
          operator: 'jill'
        }
      ],
      environmentals: [],
      warehouseTypes: []
    }
  },
  methods: {
    searchList () {},
    handleCurrentChange (val) {
      this.search.current = val
    },
    handleSizeChange (val) {
      this.search.size = val
    }
  }
}
</script>

<style lang="stylus" scoped>
.demand-env {
  display: flex;
  min-width: 0;

  span {
    flex: 1;
    border: 1px solid #C6C6C6;
    white-space: nowrap;
    padding: 0 5px;
    color: #C6C6C6;
  }

  span.active {
    border: 1px solid #49BC71;
    color: #49BC71;
  }

  span.active + span {
    border-left: none;
  }

  span.active + span.active {
    border-left: none;
  }

  span + span {
    border-left: none;
  }
}

.demand-type {
  display: inline-block;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 5px;
}

.demand-type.bug {
  color: #FF0000;
  background: rgba(255, 0, 0, 0.3);
}

.demand-type.require {
  color: #49BC71;
  background: rgba(73, 188, 113, 0.3);
}

.dashboard {
  padding: 10px 0 0 0;
}

.block {
  margin: 56px 0;
  text-align: center;
}
</style>
