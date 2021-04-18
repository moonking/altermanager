<template>
  <div class="bg">
    <el-row :gutter="0">
      <el-col :span="6" v-for="item in dataStatistics" :key="item.id">
        <div class="grid-content">
          <div class="img">
            <img :src="item.url" />
          </div>
          <div class="descWrapper">
            <div class="imgDesc">{{item.desc}}</div>
            <dir class="imgNum">{{item.num}}</dir>
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="table">
      <div class="main-table">
        <div class="tableTitle">
          <div class="logTitle">用户操作记录</div>
          <a class="moreData" @click="navClick()">查看更多</a>
        </div>
        <div v-if="!tableData" class="noData">没有操作记录</div>

        <el-table
          v-if="tableData"
          :data="tableData"
          stripe
          style="width: 100%"
          :show-header="false"
          :header-cell-style="{ background: '#f5f5f5' }"
        >
          <el-table-column prop="operationLog" min-width="400px"></el-table-column>
          <el-table-column prop="date" align="right"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dataStatistics: [
        {
          id: '001',
          url: 'static/img/icon/tuanduiguanli.svg',
          desc: '用户数量',
          num: 18
        },
        {
          id: '002',
          url: 'static/img/icon/55.svg',
          desc: '当前在线人数',
          num: 5
        },
        {
          id: '003',
          url: 'static/img/icon/jiaose.svg',
          desc: '平台角色总数',
          num: 10
        },
        {
          id: '004',
          url: 'static/img/icon/xitongguanli.svg',
          desc: '平台系统总数',
          num: 5
        }
      ],
      tableData: [
        {
          date: '2016-05-02',
          operationLog: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          operationLog: '上海市普陀区金沙江路 1517 弄'
        },
        {
          date: '2016-05-01',
          operationLog: '上海市普陀区金沙江路 1519 弄'
        },
        {
          date: '2016-05-03',
          operationLog: '上海市普陀区金沙江路 1516 弄'
        },
        {
          date: '2016-05-02',
          operationLog: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          operationLog: '上海市普陀区金沙江路 1517 弄'
        },
        {
          date: '2016-05-01',
          operationLog: '上海市普陀区金沙江路 1519 弄'
        },
        {
          date: '2016-05-03',
          operationLog: '上海市普陀区金沙江路 1516 弄'
        },
        {
          date: '2016-05-02',
          operationLog: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          operationLog: '上海市普陀区金沙江路 1517 弄'
        },
        {
          date: '2016-05-01',
          operationLog: '上海市普陀区金沙江路 1519 弄'
        },
        {
          date: '2016-05-03',
          operationLog: '上海市普陀区金沙江路 1516 弄'
        },
        {
          date: '2016-05-02',
          operationLog: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          operationLog: '上海市普陀区金沙江路 1517 弄'
        },
        {
          date: '2016-05-01',
          operationLog: '上海市普陀区金沙江路 1519 弄'
        },
        {
          date: '2016-05-03',
          operationLog: '上海市普陀区金沙江路 1516 弄'
        },
        {
          date: '2016-05-02',
          operationLog: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          operationLog: '上海市普陀区金沙江路 1517 弄'
        },
        {
          date: '2016-05-01',
          operationLog: '上海市普陀区金沙江路 1519 弄'
        },
        {
          date: '2016-05-03',
          operationLog: '上海市普陀区金沙江路 1516 弄'
        },
        {
          date: '2016-05-02',
          operationLog: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          operationLog: '上海市普陀区金沙江路 1517 弄'
        },
        {
          date: '2016-05-01',
          operationLog: '上海市普陀区金沙江路 1519 弄'
        },
        {
          date: '2016-05-03',
          operationLog: '上海市普陀区金沙江路 1516 弄'
        },
        {
          date: '2016-05-02',
          operationLog: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          operationLog: '上海市普陀区金沙江路 1517 弄'
        },
        {
          date: '2016-05-01',
          operationLog: '上海市普陀区金沙江路 1519 弄'
        },
        {
          date: '2016-05-03',
          operationLog: '上海市普陀区金沙江路 1516 弄'
        },
        {
          date: '2016-05-02',
          operationLog: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          operationLog: '上海市普陀区金沙江路 1517 弄'
        },
        {
          date: '2016-05-01',
          operationLog: '上海市普陀区金沙江路 1519 弄'
        },
        {
          date: '2016-05-03',
          operationLog: '上海市普陀区金沙江路 1516 弄'
        }
      ]
    }
  },
  methods: {
    // 跳转操作记录
    navClick () {
      console.log(this.$route.path)
      this.$router.push({
        path: this.$route.path + '/moreOperation',
        query: {
          code: 0
        }
      })
    }
  },
  mounted () {
    this.tableData =
      this.tableData.length > 20 ? this.tableData.slice(0, 20) : this.tableData
  }
}
</script>

<style scoped lang="scss">
.bg {
  margin: 10px;
  float: left;
  background: rgba(4, 28, 37, 0.3);
  border-radius: 5px;
  .el-table {
    border: 1px solid #ccc;
  }

  .el-row {
    padding: 0 10px;
    .el-col {
      display: flex;

      .grid-content {
        border: 1px solid #fff;
        margin: 20px auto;
        width: 90%;

        .img {
          padding: 10px 10px 10px 20px;
          float: left;
        }
        .descWrapper {
          padding: 10px;
          float: left;
          flex: 1;

          .imgDesc {
            color: #07c4a8;
            font-weight: bolder;
            text-align: center;
            min-width: 96px;
          }
          .imgNum {
            padding-top: 5px;
            text-align: center;
            font-size: 30px;
            color: #fff;
          }
        }
      }
    }
  }

  /*表格*/
  .table {
    .main-table {
      padding: 0 25px;
    }

    .tableTitle {
      float: left;
      width: 100%;
      height: 35px;
      line-height: 35px;
      background: rgba(4, 28, 37, .5);
      color: #fff;
      z-index: 9;

      .logTitle {
        float: left;
        margin-left: 10px;
      }
      .moreData {
        float: right;
        margin-right: 10px;
      }
    }

    .noData {
      float: left;
      margin-left: 10px;
      margin-top: 30px;
    }
    .el-table {
      position: relative;
      border: none;
    }
  }
}
</style>
