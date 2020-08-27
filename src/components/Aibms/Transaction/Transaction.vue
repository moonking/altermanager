<template>
  <div class="aia-content">
    <!-- 筛选 -->
    <el-form :inline="true" ref="searchFrom" :model="searchFrom" label-width="80px">
      <el-form-item>
        <el-select clearable v-model="searchFrom.Bsystem" placeholder="请选择业务系统">
          <el-option
            v-for="item in systemList"
            :key="item.systemId"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select clearable v-model="searchFrom.Ttype" placeholder="请选择交易类型">
          <el-option
            v-for="item in typeList"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="searchFrom.searchTime"
          type="daterange"
          range-separator="至"
          start-placeholder="请输入开始日期"
          end-placeholder="请输入结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item class="search-form">
        <el-button icon="el-icon-search" @click="search">搜索</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格数据 -->
    <el-table
      :data="tableData"
      stripe
      :header-cell-style="{background:'#f5f5f5'}"
      @row-click="tDeatil"
      style="width: 100%"
    >
      <el-table-column prop="systemName" label="业务系统" />
      <el-table-column prop="businessType" label="交易类型" />
      <el-table-column prop="startTime" label="开始时间" />
      <el-table-column prop="duration" label="耗时">
        <template v-slot="scope">
          <span>{{scope.row.duration|filterTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="destIp" label="目标地址" />
      <el-table-column prop="srcIp" label="源地址" />
      <el-table-column prop="result" label="结果" />
      <el-table-column align="center" prop="operation" label="操作">
        <template v-slot="scope">
          <el-link
            :underline="false"
            type="primary"
            style="color: #fff"
            @click.stop="goDynatrace(scope.row.url)"
          >跳转Dynatrace</el-link>
        </template>
      </el-table-column>
      <template slot="empty">
        <div class="blank-page">
          <div class="img-content">
            <img src="../../../../static/img/blank-page.png" alt />
          </div>
          <p class="empty-text">暂无相关数据</p>
        </div>
      </template>
    </el-table>
    <!-- 交易详情 -->
    <el-dialog title="交易详情" :visible.sync="tDialog" width="50%" center>
      <el-form label-width="160px">
        <el-form-item :label="item.label+'：'" v-for="item in tDetail" :key="item.id">
          <label for>{{item.value}}</label>
        </el-form-item>
      </el-form>
    </el-dialog>
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
  </div>
</template>

<script>
import axios from '@/api';
import common from '@/utils/commonjs';
import moment from 'moment';
export default {
  data: () => ({
    tDialog: false,
    tDetail: { a: '友邦保险有限公司北京分公司', b: '投保建议书系统' },
    tableData: [],
    systemList: [],
    typeList: [],
    searchFrom: {
      Bsystem: '',
      Ttype: '',
      searchTime: []
    },
    page: {
      current: 1,
      size: 10
    },
    totalSize: 0
  }),
  filters: {
    filterTime (timeStr) {
      return common.timer(timeStr);
    }
  },
  created () {
    this.traceList()
    this.getTraceSystemList()
    this.getTraceTypeList()
  },
  methods: {
    // 获取下拉数据
    getTraceSystemList () {
      const data = {
        current: 1,
        name: '',
        size: 1000
      }
      axios.getSystemList(data).then(res => {
        if (res.data.success) {
          this.systemList = res.data.data.result.records.map(item => ({name: item.name,systemId:item.systemId}))
        } else {
          this.$notify.error({
            title: '提示',
            message: res.message
          })
        }
      })
    },
    getTraceTypeList () {
      axios.getTraceTypeList().then(res => {
        if (res.data.success) {
          this.typeList = res.data.data
        } else {
          this.$notify.error({
            title: '提示',
            message: res.message
          })
        }
      })
    },
    getTraceTypeList () { },
    // 跳转Dynatrace
    goDynatrace (url) {
      window.open(url, '_blank');
    },
    // 获取交易列表
    traceList () {
      let startTime =
        Array.isArray(this.searchFrom.searchTime) &&
          this.searchFrom.searchTime.length > 0
          ? moment(this.searchFrom.searchTime[0]).format('YYYY-MM-DD HH:mm:ss')
          : '';
      let endTime =
        Array.isArray(this.searchFrom.searchTime) &&
          this.searchFrom.searchTime.length > 0
          ? moment(this.searchFrom.searchTime[1]).format('YYYY-MM-DD HH:mm:ss')
          : '';

      let params = {
        systemName: this.searchFrom.Bsystem || '',
        type: this.searchFrom.Ttype || '',
        startTime: startTime,
        endTime: endTime,
        current: this.page.current,
        size: this.page.size
      };
      axios.traceList(params).then(res => {
        if (res.data.success) {
          this.tableData = res.data.data.records;
          this.totalSize = Number(res.data.data.total);
        }
      });
    },
    search () {
      this.page.current = 1;
      this.page.size = 10;
      this.traceList();
    },
    // 获取交易详情
    tDeatil (row) {
      this.tDialog = true;
      axios.traceDetails(row.iD).then(res => {
        if (res.data.success) {
          let result = JSON.parse(res.data.data);
          let objKeys = Object.keys(result);
          let objdata = [];
          objKeys.forEach((item, index) => {
            objdata.push({
              label: item,
              value: result[item]
            });
          });
          this.tDetail = objdata
        }
      });
    },
    // 分页
    handleCurrentChange () {
      this.traceList();
    },
    // 表格每页数量
    handleSizeChange () {
      this.page.current = 1;
      this.traceList();
    }
  }
};
</script>

<style lang="scss" scoped>
.aia-content {
  position: relative;
  width: 100%;
  padding: 10px 10px;
  box-sizing: border-box;
  .search-form {
    position: absolute;
    right:0;
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
    }
  }
}
.aia-content /deep/ .el-table__row {
  cursor: pointer !important;
}
</style>
