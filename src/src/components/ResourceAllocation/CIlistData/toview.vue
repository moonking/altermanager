<template>
  <div class="bg aibms-color-bg">
    <el-tabs type="card" @tab-click="handleSelect">
      <el-tab-pane label="基本信息"></el-tab-pane>
      <el-tab-pane label="关系结构"></el-tab-pane>
    </el-tabs>
    <div class="basicInformation" v-if="selectTab">
      <div class="main" v-for="(item,index) in toviewDatalist" :key="index">
        <div class="top deep-aibms-color-bg white-color">{{item.title}}</div>
        <div class="center">
          <ul class="white-color">
            <li v-for="(pl,index) in item.extend" :key="index">
              <div style="float:left;width:40%; text-align: left">{{pl.label}}:</div>
              <div style="float:left;width:60%; text-align: left" class="text-hidden">
                <span v-if="pl.type == 'pwdInput' && pl.defaultValue != ''">*********</span>
                <span v-else-if="pl.type == 'pwdInput' && pl.defaultValue == ''"></span>
                <!-- <span
                  v-else-if="pl.type == 'selectInput'  && !pl.moreSelect"
                >{{pl.defaultValue}}</span>-->
                <span v-else-if="pl.type == 'optionsInputSys'  && !pl.moreSelect">{{pl.name }}</span>
                <span
                  v-else-if="item.type == 'optionsInputEnv'  && !item.moreSelect"
                >{{item.defaultValue.split(',')[2]+'/'+item.defaultValue.split(',')[3] }}</span>
                <span v-else-if="pl.type == 'optionsInputEnv'  && !pl.moreSelect">{{pl.cname}}</span>
                <span
                  v-else-if="pl.type == 'dateInput' && pl.defaultValue != ''"
                >{{ pl.defaultValue | dateformat('YYYY-MM-DD HH:mm:ss')}}</span>
                <span v-else-if="pl.type == 'selectInput'">
                  <span
                    v-for="(a,index) in selectList.label"
                    :key="index"
                    style="display:inline-block;margin-left:5px;"
                  >{{a}}</span>
                </span>
                <span v-else-if="pl.type == 'credentialsSelect' ">
                  <!-- <span>{{credentials}}</span> -->
                  <span>{{pl.defaultValue}}</span>
                </span>
                <span v-else>{{pl.defaultValue}}</span>
              </div>
            </li>
          </ul>
        </div>
        <div class="clear"></div>
      </div>
    </div>
    <div class="relation-box aibms-bg" v-else>
      <div class="operation-box">
        <el-row class="box-row aibms-bg">
          <el-col :span="6" :offset="18">
            <span>展开层级：</span>
            <el-select v-model="value" placeholder="请选择">
              <el-option v-for="(item,index) in selectArr" :key="index" :label="item" :value="item"></el-option>
            </el-select>
          </el-col>
        </el-row>
      </div>
      <app-chart :nodeTypeId="nodeTypeId" :chartType="chartType"></app-chart>
    </div>
    <!-- <el-tab-pane label="操作记录">
        <div class="records">
          <div class="main">
            <div class="left">
              <p>2019-02-14</p >
              <p>12:20:00</p >
            </div>
            <div class="right">
              <div class="dot"></div>
              <ul>
                <li>
                  <span>张三</span>
                  <span style="color:#423be2">修改</span>
                </li>
                <li>
                  <span>地区</span>
                  <span>上海</span>
                  <span>》》</span>
                  <span>北京</span>
                </li>
                <li>
                  <span>ip地址：</span>
                  <span>112.334.4444</span>
                  <span>》》</span>
                  <span>123.4222.2223</span>
                </li>
              </ul>
            </div>
          </div>
          <div class="main">
            <div class="left">
              <p>2019-02-14</p >
              <p>12:20:00</p >
            </div>
            <div class="right">
              <div class="dot"></div>
              <ul>
                <li>
                  <span>张三</span>
                  <span>修改</span>
                </li>
                <li>
                  <span>地区</span>
                  <span>上海</span>
                  <span>》》</span>
                  <span>北京</span>
                </li>
                <li>
                  <span>ip地址：</span>
                  <span>112.334.4444</span>
                  <span>》》</span>
                  <span>123.4222.2223</span>
                </li>
              </ul>
            </div>
          </div>
          <div class="main">
            <div class="left">
              <p>2019-02-14</p >
              <p>12:20:00</p >
            </div>
            <div class="right">
              <div class="dot"></div>
              <ul>
                <li>
                  <span>张三</span>
                  <span>修改</span>
                </li>
                <li>
                  <span>地区</span>
                  <span>上海</span>
                  <span>》》</span>
                  <span>北京</span>
                </li>
                <li>
                  <span>ip地址：</span>
                  <span>112.334.4444</span>
                  <span>》》</span>
                  <span>123.4222.2223</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
    </el-tab-pane>-->
  </div>
</template>
<script>
import axios from '@/api';
import chart from '../CIchart'
export default {
  data () {
    return {
      toviewDatalist: '',
      selectArr: ['CI项', 'CI项属性'],
      value: 'CI项',
      selectTab: true,
      nodeTypeId: '',
      chartType: '',
      selectList: {
        label: []
      },
      credentials: ''
    }
  },
  created () { },
  components: {
    'app-chart': chart
  },
  methods: {
    toviewData () {
      let id = this.$route.query.ciitemId
      axios.CiDataDetail(id).then(res => {
        if (res.data.code === 200) {
          this.toviewDatalist = JSON.parse(res.data.data.result.content)
          console.log(this.toviewDatalist)
          for (var i = 0; i < this.toviewDatalist.length; i++) {
            for (var j = 0; j < this.toviewDatalist[i].extend.length; j++) {
              if (
                this.toviewDatalist[i].extend[j].moreSelect &&
                this.toviewDatalist[i].extend[j].type == 'selectInput' &&
                this.toviewDatalist[i].extend[j].type == 'credentialsSelect'
              ) {
                for (
                  var k = 0;
                  k < this.toviewDatalist[i].extend[j].defaultValue.length;
                  k++
                ) {
                  for (
                    var m = 0;
                    m < this.toviewDatalist[i].extend[j].options.length;
                    m++
                  ) {
                    if (
                      this.toviewDatalist[i].extend[j].defaultValue[k] ==
                      this.toviewDatalist[i].extend[j].options[m].value
                    ) {
                      this.selectList.label.push(
                        this.toviewDatalist[i].extend[j].options[m].label
                      )
                    }
                  }
                }
              }
              if (this.toviewDatalist[i].extend[j].label == '凭证') {
                delete this.toviewDatalist[i].extend[j].sshoptions
                this.setVounch(i, j)
              }
              if (this.toviewDatalist[i].extend[j].type == 'credentialsSelect') {
                if (this.toviewDatalist[i].extend[j].defaultValue == '-1') {
                  this.credentials = '选择凭证类型'
                }
                if (this.toviewDatalist[i].extend[j].defaultValue == '0') {
                  this.credentials = 'SSH凭证'
                }
                if (this.toviewDatalist[i].extend[j].defaultValue == '1') {
                  this.credentials = '应用系统凭证'
                }
                if (this.toviewDatalist[i].extend[j].defaultValue == '3') {
                  this.credentials = '数据库凭证'
                }
                if (this.toviewDatalist[i].extend[j].defaultValue == '2') {
                  this.credentials = '代码库凭证'
                }
              }
            }
          }
        }
      })
    },
    setVounch (i, j) {
      let m = i
      let o = j
      let name = ''
      let voucherType = ''
      let vid = this.toviewDatalist[m].extend[o].defaultValue
      axios.getVoucherList(name, voucherType)
        .then(res => {
          let filterData = res.data.data.result.filter(item => {
            if (item.voucherId == vid) {
              return item

              // for (var i = 0; i < _this.toviewDatalist.length; i++) {
              //     for (var j = 0; j < _this.toviewDatalist[i].extend.length; j++) {
              //         if(this.toviewDatalist[i].extend[j].label === "凭证"){
              //
              //
              //         }
              //     }
              // }
            }
          })
          if (filterData.length) {
            this.toviewDatalist[m].extend[o].name = ''
            this.toviewDatalist[m].extend[o].defaultValue = filterData[0].name
          }
        })
        .catch()
    },
    handleSelect (tab) {
      if (tab.label == '基本信息') {
        this.selectTab = true
      } else if (tab.label == '关系结构') {
        if (this.$route.query.code == 2) {
          this.nodeTypeId = this.$route.query.ciitemId
          this.chartType = 'ciitem'
        }
        this.selectTab = false
      }
    }
  },
  mounted () {
    this.toviewData()
  }
}
</script>
<style scoped lang="scss">
.bg {
  background: #fff;
  margin: 10px;
  padding: 10px;
  .el-tabs {
    margin: 10px;
    /deep/ .el-tabs__header {
      margin-bottom: 10px !important;
    }
  }
  .basicInformation {
    border: 1px solid #ccc;
    margin: 10px;
    .main {
      .top {
        line-height: 40px;
        border-bottom: 1px solid #ccc;
        background: #f5f5f5;
        text-indent: 24px;
      }
      .center {
        ul {
          min-height: 150px;
          padding: 20px;
          width: 80%;
          li {
            float: left;
            width: 45%;
            text-align: center;
            margin: 5px 5px;
          }
        }
      }
    }
  }
  .records {
    font-size: 14px;
    margin: 20px;
    .main {
      width: 50%;
      .left {
        text-align: right;
        width: 30%;
        float: left;
        height: 150px;
      }
      .right {
        position: relative;
        width: 65%;
        height: 150px;
        border-left: 5px solid #423be2;
        float: right;
        .dot {
          position: absolute;
          height: 20px;
          width: 20px;
          border-radius: 100%;
          background: #423be2;
          top: 0;
          left: -13px;
        }
        ul {
          margin-left: 20px;
          li {
            margin-bottom: 12px;
          }
        }
      }
    }
  }
  .relation-box {
    width: 100%;
    height: 600px;
    background-color: #fff;
    .operation-box {
      width: 100%;
      span{
        color: #fff;
      }
    }
  }
  .box-row {
    margin: 3px 10px;
    background-color: rgba(204, 204, 204, 1);
    font-size: 14px;
    padding: 5px 0;
  }
  ul {
    li {
      list-style: none;
    }
  }
  .clear {
    clear: both;
  }
}
.bg
  .el-tabs
  .el-tabs__header
  .el-tabs__nav-wrap
  .el-tabs__nav-scroll
  .el-tabs__nav
  .el-tabs__item {
  height: 0;
  line-height: 0;
}
.text-hidden {
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
</style>
