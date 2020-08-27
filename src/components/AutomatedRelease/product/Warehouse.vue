<!--name: 'Warehouse'-->

<template>
  <div class="task-list aibms-role">
    <el-row>
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-form-item class="form-select">
          <el-select v-model="search.productId" placeholder="请选择制品库" :clearable="true">
            <el-option
              v-for="product in productList"
              :label="product.name"
              :value="product.productId"
              :key="product.productId"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item style="margin-left: 15px">
          <el-input placeholder="请输入仓库名称" v-model="search.warehouseName"></el-input>
        </el-form-item> -->
        <!-- <el-form-item class="form-select">
          <el-select v-model="search.warehouseType" placeholder="请选择仓库类型" :clearable="true">
            <el-option
              v-for="type in warehouseTypes"
              :label="type.label"
              :value="type.value"
              :key="type.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="form-select">
          <el-select placeholder="请选择所属环境" v-model="search.environmentId" :clearable="true">
            <el-option
              v-for="environmental in environmentals"
              :label="environmental.label"
              :value="environmental.value"
              :key="environmental.value"
            ></el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item class="item-right overHideMargin">
          <!-- <el-button icon="el-icon-search" class="common-btn-style" @click="searchList">查找</el-button> -->
          <el-button
            type="primary"
            icon="el-icon-plus"
            class="margin-left-btn"
            @click.prevent="goWarehouse('create')"
          >新增</el-button>
        </el-form-item>
        <!-- <el-button class="headerIcon addBtn" @click="goAddrelease">部署任务</el-button>
        <el-button class="headerIcon addBtn" @click="goAddTask">构建任务</el-button>-->
      </el-form>
    </el-row>
    <el-row>
      <el-table
        :data="warehouseList"
        style="width: 100%"
        :header-cell-style="{ background: '#f5f5f5' }"
      >
        <el-table-column prop="name" label="仓库名称" />
        <el-table-column prop="type" label="仓库类型" />
        <!-- <el-table-column align="center" prop="name" label="策略"></el-table-column> -->
        <el-table-column prop="url" label="路径" />
        <el-table-column prop="format" label="存储库类型" />
        <el-table-column prop="environment" label="所属环境" width="100px" />
        <el-table-column align="center" label="操作" width="330px">
          <template slot-scope="scope">
            <div class="task-btn-box">
              <span class="special" @click="openWarehouse(scope.row.name)">
                <el-tooltip class="item" effect="dark" content="打开仓库" placement="top-start">
                  <icon-svg icon-class="wenjianjia1" class="whiteness-icon-color" />
                </el-tooltip>
              </span>
              <span class="special" @click="goWarehouse('read', scope.row.name)">
                <el-tooltip class="item" effect="dark" content="查看" placement="top-start">
                  <icon-svg icon-class="cha" class="whiteness-icon-color" />
                </el-tooltip>
              </span>

              <span class="special" @click="goWarehouse('edit', scope.row.name)">
                <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
                  <icon-svg icon-class="bianji" class="whiteness-icon-color" />
                </el-tooltip>
              </span>
              <span class="special" @click="deleteWarehouse(scope.row.name)">
                <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                  <icon-svg icon-class="shanchu" class="whiteness-icon-color" />
                </el-tooltip>
              </span>
            </div>
          </template>
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
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pager.current"
          :page-size="pager.size"
          :page-sizes="[10,30,50]"
          layout="prev, pager, next, sizes, total, jumper"
          :total="pager.total"
          v-if="pager.total"
          style="margin-right:15px;cursor: pointer;"
        ></el-pagination>
      </div>

      <el-dialog center :visible.sync="dialogVisibleDelete" title="提示" width="300px">
        <div :style="{textAlign: 'center'}">
          <i class="el-icon-warning"></i>&nbsp;&nbsp;确定要删除该仓库吗？
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button size="medium" @click="dialogVisibleDelete = false">取 消</el-button>
          <el-button type="primary" size="medium" @click="handleDeleteConfirm">确 定</el-button>
        </div>
      </el-dialog>
    </el-row>
  </div>
</template>

<script>
import axios from '@/api';
export default {
  name: 'Warehouse',
  data () {
    return {
      search: {},
      dialogVisibleDelete: false,
      environmentals: [
        {
          value: 1,
          label: '环境1'
        },
        {
          value: 2,
          label: '环境2'
        },
        {
          value: 3,
          label: '环境3'
        }
      ],
      warehouseTypes: [
        {
          value: 1,
          label: '仓库'
        },
        {
          value: 2,
          label: '仓库1'
        },
        {
          value: 3,
          label: '仓库2'
        }
      ],
      warehouseList: [],
      pager: {
        current: 1,
        size: 10,
        total: 0
      },
      productList: [],
      currentDeleteWarehouseName: ''
    }
  },
  created () {
    this.pager.total = this.warehouseList.length
    // 获取制品库列表
    this.getProductConfigList(true)
  },
  methods: {
    handleDeleteConfirm () {
      if (this.warehouseList.length === 1) {
        this.search = 1
      }
      axios.deleteWarehouse({
        productId: this.search.productId,
        warehouseName: this.currentDeleteWarehouseName
      }).then(res => {
        if (res.data.code === 200) {
          this.$message.success('删除成功！')
          this.getWarehousePage()
        } else {
          this.$message.error(res.data.message)
        }
      })
      this.dialogVisibleDelete = false
    },
    deleteWarehouse (warehouseName) {
      // this.$confirm('确认删除?', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // })
      this.dialogVisibleDelete = true
      this.currentDeleteWarehouseName = warehouseName
    },
    // 搜索列表
    searchList () {
      this.getWarehousePage()
    },
    // 分页
    handleCurrentChange (val) {
      this.pager.current = val
      this.getWarehousePage()
    },
    handleSizeChange (val) {
      this.pager.size = val
      this.getWarehousePage()
    },
    // 操作跳转
    goWarehouse (key, warehouseName) {
      this.$router.push({
        path: '/AutomatedRelease/warehouse/' + key,
        query: {
          code: 3,
          warehouseName: warehouseName,
          productId: this.search.productId
        }
      })
    },
    openWarehouse (warehouseName) {
      this.$router.push({
        path: '/AutomatedRelease/warehouseOpen',
        query: {
          code: 3,
          productId: this.search.productId,
          warehouseName: warehouseName
        }
      })
    },
    // 获取列表数据
    getWarehousePage () {
      const search = this.search
      const pager = this.pager
      axios.queryWarehousePage({
        warehouseName: search.warehouseName || '',
        warehouseType: search.warehouseType || '',
        environmentId: search.environmentId || '',
        productId: search.productId || '',
        current: pager.current || 1,
        size: pager.size || 10
      }).then(res => {
        if (res.data.code === 200) {
          this.warehouseList = this.warehouseDataProcess(res.data.data.records)
          this.pager.total = res.data.data.total
        }
      })
    },
    // 仓库列表接口返回数据处理
    warehouseDataProcess (data) {
      if (!data) return []
      let result = data
      result.forEach(warehouse => {
        if (!warehouse.environment) {
          warehouse.environment = '-'
        }
      })
      return result
    },
    // 获取制品库列表
    getProductConfigList (shouldSetDefaultValue) {
      axios.productConfigList({
        name: '',
        accountNumber: '',
        detectionStatus: '1',
        current: 0,
        size: 1000
      }).then(res => {
        if (res.data.code === 200) {
          this.productList = res.data.data.records
        }
        if (shouldSetDefaultValue) {
          this.$set(this.search, 'productId', this.productList[0].productId)
          // 获取仓库列表
          this.getWarehousePage()
        }
      })
    }
  }
}
</script>

<style scoped>
.block {
  padding: 92px 0 0 0;
  text-align: center;
}
.task-list {
  padding: 10px;
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
.blank-page .imgdiv {
  height: 200px;
  padding-top: 15px;
}
.blank-page .empty-text {
  font-size: 18px;
  height: 30px;
  line-height: 30px;
  margin-top: -30px;
  margin-bottom: 10px;
}
/*.task-btn-box span .open {*/
/*content: url("../../../../static/img/open_file.png");*/
/*background-repeat: no-repeat;*/
/*}*/
.demo-form-inline /deep/ .overHideMargin {
  margin-right: 0 !important;
}
</style>
