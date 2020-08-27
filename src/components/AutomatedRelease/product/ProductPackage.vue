<!--name: 'Warehouse'-->

<template>
  <div class="task-list aibms-role">
    <el-row>
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-form-item>
          <el-input placeholder="请输入文件名称" v-model="search.warehouseName"></el-input>
        </el-form-item>
        <el-form-item class="form-select">
          <el-select v-model="search.type" placeholder="请选择项目组编号" :clearable="true">
            <el-option
              v-for="type in warehouseTypes"
              :label="type.label"
              :value="type.value"
              :key="type.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="form-select">
          <el-select placeholder="请选择所属仓库" v-model="search.environmental" :clearable="true">
            <el-option
              v-for="environmental in environmentals"
              :label="environmental.label"
              :value="environmental.value"
              :key="environmental.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="item-right overHideMargin">
          <el-button icon="el-icon-search" class="nomal-button" @click="searchList">查找</el-button>
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
        stripe
        :data="warehouseList"
        style="width: 100%"
        :header-cell-style="{ background: '#f5f5f5' }"
      >
        <el-table-column prop="name" label="文件名"></el-table-column>
        <el-table-column prop="name" label="版本号"></el-table-column>
        <el-table-column prop="name" label="所属仓库"></el-table-column>
        <el-table-column prop="name" label="所属业务系统"></el-table-column>
        <el-table-column prop="name" label="上传时间"></el-table-column>
        <el-table-column align="center" prop="address" label="操作" width="330px">
          <template>
            <div class="task-btn-box">
              <span class="special" @click="goWarehouse('read')">
                <el-tooltip class="item" effect="dark" content="查看" placement="top-start">
                  <icon-svg icon-class="cha" class="whiteness-icon-color" />
                </el-tooltip>
              </span>

              <span class="special">
                <el-tooltip class="item" effect="dark" content="下载" placement="top-start">
                  <icon-svg icon-class="xiazai" class="whiteness-icon-color" />
                </el-tooltip>
              </span>
              <span class="special" @click="synchronous()">
                <el-tooltip class="item" effect="dark" content="同步" placement="top-start">
                  <icon-svg icon-class="yun" class="whiteness-icon-color" />
                </el-tooltip>
              </span>
              <span class="special" @click="deleteWarehouse()">
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
      <el-dialog center title="同步制品" :visible.sync="dialogVisible" width="30%">
        <el-form
          :model="ConfigurationPackage"
          ref="baseFormData"
          label-position="right"
          label-width="100px"
        >
          <el-form-item class="ConfigurationPackage-item" label="同步至：">
            <el-input placeholder="请选择仓库" style="min-width: 200px"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
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

      <el-dialog center :visible.sync="dialogVisibleDelete" title="提示" width="300px">
        <div :style="{textAlign: 'center'}">
          <i class="el-icon-warning"></i>&nbsp;&nbsp;确定要删除该制品包吗？
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button size="medium" @click="dialogVisibleDelete = false">取 消</el-button>
          <el-button type="primary" size="medium">确 定</el-button>
        </div>
      </el-dialog>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'ProductPackage',
  data () {
    return {
      dialogVisible: false,
      dialogVisibleDelete: false,
      search: {},
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
      warehouseList: [
        {
          name: 124,
          id: 1
        },
        {
          name: 123,
          id: 2
        },
        {
          name: 122,
          id: 3
        }
      ],
      total: 0
    }
  },
  created () {
    this.total = this.warehouseList.length
  },
  methods: {
    deleteWarehouse () {
      this.dialogVisibleDelete = true
      // this.$confirm('确认删除?', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // });
    },
    // 搜索列表
    searchList () { },
    // 分页
    handleCurrentChange (val) {
      this.search.current = val
    },
    handleSizeChange (val) {
      this.search.size = val
    },
    // 操作跳转
    goWarehouse (key) {
      this.$router.push({
        path: '/AutomatedRelease/ProductPackage/' + key,
        query: {
          code: 3
        }
      })
    },
    // 同步
    synchronous () {
      this.dialogVisible = true
    }
  }
}
</script>

<style scoped>
.block {
  padding: 20px;
  text-align: center;
}
.task-list {
  margin-top: 10px;
  padding: 0 10px;
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
