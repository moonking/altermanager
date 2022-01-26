<template>
  <div class="bg aibms-bg aibms-role">
    <el-form :inline="true" class="demo-form-inline">
      <!-- <el-select v-model="sshid" placeholder="选择CI类型" clearable>
        <el-option
          :label="item.name"
          :value="item.citypeId"
          v-for="(item,index) in CIList"
          :key="index"
        ></el-option>
      </el-select>-->
      <el-cascader
        class="select-tag margin-right20"
        placeholder="选择CI类型"
        expand-trigger="hover"
        :options="options2"
        v-model="sshid"
        @change="handleChange"
        clearable
      />
      <el-select
        v-model="sshid2"
        class="select-tag margin-right20"
        placeholder="选择关系"
        clearable
      >
        <el-option
          :label="item.name"
          :value="item.id"
          v-for="(item, index) in List"
          :key="index"
        ></el-option>
      </el-select>
      <el-form-item class="item-right">
        <el-button
          icon="el-icon-delete"
          class="nomal-button"
          @click="dellistRelation"
          >批量删除</el-button
        >
        <el-button
          icon="el-icon-search"
          class="search-el-button margin-left-btn"
          @click="searchShip"
          >查找</el-button
        >
        <el-button
          type="primary"
          icon="el-icon-plus"
          class="margin-left-btn"
          @click.prevent="showdialog"
          >新增</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table
      :data="sshListData"
      ref="multipleTable"
      stripe
      height="84%"
      @selection-change="handleSelectionChange"
      :header-cell-style="{ background: '#f5f5f5' }"
    >
      <el-table-column type="selection" width="80" align="center" />
      <el-table-column label="CI类型-属性">
        <template slot-scope="scope">
          <div v-html="scope.row.fromAttrLabel"></div>
        </template>
      </el-table-column>
      <el-table-column prop="relationType" label="关系" />
      <el-table-column label="CI类型-属性">
        <template slot-scope="scope">
          <div v-html="scope.row.toAttrLabel"></div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180px" align="center">
        <template slot-scope="scope">
          <div class="task-btn-box">
            <span class="special" @click="viewRelation(scope.row.cirelationId)">
              <el-tooltip
                class="item"
                effect="dark"
                content="查看详情"
                placement="top-start"
              >
                <icon-svg icon-class="chakan" class="whiteness-icon-color" />
              </el-tooltip>
            </span>
            <span class="special" @click="setRelation(scope.row.cirelationId)">
              <el-tooltip
                class="item"
                effect="dark"
                content="编辑"
                placement="top-start"
              >
                <icon-svg icon-class="bianji" class="whiteness-icon-color" />
              </el-tooltip>
            </span>
            <span
              class="special"
              @click="deletRelation(scope.row.cirelationId)"
            >
              <el-tooltip
                class="item"
                effect="dark"
                content="删除"
                placement="top-start"
              >
                <icon-svg icon-class="shanchu" class="whiteness-icon-color" />
              </el-tooltip>
            </span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="提示" :visible.sync="delSuccess" width="30%" center>
      <span>删除成功</span>
    </el-dialog>
    <!-- 查看 -->
    <!-- 修改 -->
    <!-- 删除 -->
    <!-- 有用户 -->
    <!-- 分页功能 -->
    <el-pagination
      v-if="total && total > 10"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="current"
      :page-sizes="[10, 30, 50]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      class="absolute-center"
    />

    <el-dialog
      center
      :visible.sync="dialogVisibleDelete"
      title="提示"
      width="300px"
    >
      <div :style="{ textAlign: 'center' }">
        <i class="el-icon-warning"></i
        >&nbsp;&nbsp;此次删除将影响相关CI类型之间的关系，是否确认删除？
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisibleDelete = false"
          >取 消</el-button
        >
        <el-button type="primary" size="mini" @click="sureDeleteRelation"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <el-dialog
      center
      :visible.sync="isDeleteAll"
      title="批量删除"
      width="300px"
    >
      <div :style="{ textAlign: 'center' }">
        <i class="el-icon-warning"></i
        >&nbsp;&nbsp;此次删除将影响相关CI类型之间的关系，是否确认删除？
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="isDeleteAll = false">取 消</el-button>
        <el-button type="primary" size="mini" @click="delVoucherLsitCancleClick"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from '@/api';
export default {
  data() {
    return {
      isDeleteAll: false,
      isshowerr1: false,
      isshowerr2: false,
      isshowerr3: false,
      menuNameLength1: 0,
      menuNameLength2: 0,
      showbutton: false,
      // menuNameLength3: 0,
      // menuNameLength4: 0,
      totalNum1: 20,
      totalNum2: 20,
      // totalNum3: 50,
      // totalNum4: 30,
      editLoading: false,
      childrenList: [],
      defaultParams: {
        label: 'name',
        value: 'cigroupId',
        children: 'children'
      },
      Name: '',
      num: 0,
      sshid: [],
      sshid2: '',
      sshid3: '',
      cirelationId: '',
      Cirelation: ['', '', ''],
      Cirelation2: ['', '', ''],
      citieslist: [],
      options: [],
      options2: [],
      // props: {
      //   value: 'label',
      //   children: 'cities'
      // },
      current: '1',
      delrelationidlist: '',
      size: '10',
      copylist: [],
      total: null,
      delSuccess: false,
      List: [
        { name: '运行', id: '1' },
        { name: '连接', id: '2' },
        { name: '依赖', id: '3' },
        { name: '包含', id: '4' },
        { name: '虚拟化', id: '5' },
        { name: '管理', id: '6' },
        { name: '运行于', id: '7' },
        { name: '被连接', id: '8' },
        { name: '被依赖', id: '9' },
        { name: '被包含', id: '10' },
        { name: '被虚拟化', id: '11' },
        { name: '被管理', id: '12' }
      ],
      CIList: [],
      sshListData: [],

      // 删除弹框是否显示
      dialogVisibleDelete: false,
      deleteCiRelationshipId: '',
      callNum: 0
    };
  },
  watch: {},
  methods: {
    searchShip() {
      this.current = 1
      this.getrelationlist()
    },
    setSession() {
      if (this.callNum > 1) {
        const params = {
          citypeId: this.sshid[1],
          relatype: this.sshid2,
          current: this.current,
          size: this.size,
          sshid: this.sshid
        }
        sessionStorage.setItem('search', JSON.stringify(params))
      }
    },
    getParams() {
      let params
      if (sessionStorage.getItem('search') !== null) {
        params = JSON.parse(sessionStorage.getItem('search'))
        const { citypeId, relatype, current, size, sshid } = params
        this.sshid[1] = citypeId
        this.sshid2 = relatype
        this.current = current
        this.size = size
        this.sshid = sshid
      }
      return params
    },
    setRelation(cirelationId) {
      this.setSession()
      this.$router.push({
        path: '/ResourceAllocation/CIrelationPage/edit',
        query: {
          code: 1,
          id: cirelationId
        }
      })
    },
    dellistRelation(scope) {
      if (!this.delrelationidlist) {
        this.$notify({
          title: '提示',
          message: '请选择要删除的数据',
          type: 'warning'
        });
      } else {
        this.isDeleteAll = true
      }
      // console.log(this.delrelationidlist);
      // dellistRelation(this.delrelationidlist)
      //   .then(res => {
      //     if (res.data.success) {
      //       this.$notify({
      //         type: "success",
      //         message: "批量删除成功!"
      //       });
      //       this.getrelationlist();
      //     }
      //   })
      //   .catch();
    },
    viewRelation(cirelationId) {
      this.setSession()
      this.$router.push({
        path: '/ResourceAllocation/CIrelationPage/watch',
        query: {
          code: 1,
          id: cirelationId
        }
      })
    },
    showDeleteRelation(id) {
      this.dialogVisibleDelete = true;
      this.deleteCiRelationshipId = id;
    },
    deletRelation(id) {
      // console.log(scope);
      axios.delCIRelation(id)
        .then(res => {
          if (res.data.code == 500) {
            // let msg = res.data.message
            this.showDeleteRelation(id)
          }
        })
        .catch();
    },
    sureDeleteRelation() {
      axios.deletRelation(this.deleteCiRelationshipId)
        .then(res => {
          if (res.data.success) {
            this.addSystemBox = false;
            this.$notify({
              title: '提示',
              type: 'success',
              message: '删除成功!'
            });
            this.getrelationlist();
            this.dialogVisibleDelete = false;
          }
        })
        .catch();
    },
    getcitypelist() {
      var name = '';
      let templateId = '';
      var newoptions = [];
      axios.getCIList(name, templateId).then(res => {
        if (res.data.code == 200) {
          this.options2 = res.data.data.result
          this.area = this.options2.map(v => {
            this.childrenList = []; // 每个分组下要初始化
            this.children = v.citypeList.map(vv => {
              var newtype = { value: vv.citypeId, label: vv.name };
              this.childrenList.push(newtype);
            });
            var newoption = {
              value: v.cigroupId,
              label: v.name,
              children: this.childrenList
            };
            newoptions.push(newoption);
          });
          this.options2 = newoptions;

          // console.log(this.area);
        }
      });
    },
    handleChange(value) { },
    showdialog() {
      // this.num = 0
      // this.sshid3 = ''
      // this.Cirelation = ['', '', '']
      // this.Cirelation2 = ['', '', '']
      // this.form = {}
      // this.showbutton = true
      // this.addSystemBox = !this.addSystemBox;
      this.$router.push({
        path: '/ResourceAllocation/CIrelationPage/create',
        query: {
          code: 1
        }
      })
    },
    // changeType () {
    //   this.registration_data.pwdType =
    //     this.registration_data.pwdType === 'password' ? 'text' : 'password';
    //   this.registration_data.src =
    //     this.registration_data.src == require('static/img/eyes.png')
    //       ? require('static/img/colse.png')
    //       : require('static/img/eyes.png');
    // },
    delVoucherLsitCancleClick() {
      axios.delCIRelation(this.delrelationidlist)
        .then(res => {
          if (res.data.code == 500) {
            axios.dellistRelation(this.delrelationidlist)
              .then(res => {
                if (res.data.success) {
                  this.$notify({
                    title: '提示',
                    type: 'success',
                    message: '批量删除成功!'
                  });
                  this.getrelationlist();

                  this.isDeleteAll = false
                }
              })
              .catch(e => {
                this.$notify({
                  title: '提示',
                  type: 'error',
                  message: '删除失败!'
                });
              });
            // let msg = res.data.message
            // let msg = '此次删除将影响相关CI类型之间的关系，是否确认删除？';
            // this.$confirm(msg, '提示')
            //   .then(() => {

            //   })
            //   .catch(() => {
            //     this.$notify({
            //       type: 'info',
            //       message: '已取消删除'
            //     });
            //   });
          }
        })
        .catch();
    },
    inputFun1(value) {
      if (value) {
        this.menuNameLength1 = value.length;
      }
    },
    inputFun2(value) {
      if (value) {
        this.menuNameLength2 = value.length;
      }
    },
    inputFun3(value) {
      if (value) {
        this.menuNameLength3 = value.length;
      }
    },
    inputFun4(value) {
      if (value) {
        this.menuNameLength4 = value.length;
      }
    },
    handleSizeChange(val) {
      this.size = val;
      this.getrelationlist();
    },
    getrelationlist(params) {
      this.copylist = [];
      if (params === undefined) {
        params = {
          citypeId: this.sshid[1],
          relatype: this.sshid2,
          current: this.current,
          size: this.size
        }
      }
      console.log(params)
      axios.getrelationlist(params)
        .then(res => {
          if (res.data.success) {
            this.callNum++
            res.data.data.result.records.forEach(item => {
              //          {name:"运行",id:"1"},
              // {name:"连接",id:"2"},
              // {name:"依赖",id:"3"},
              // {name:"包含",id:"4"},
              // {name:"虚拟化",id:"5"},
              // {name:"管理",id:"6"},
              // {name:"运行了",id:"7"},
              // {name:"被连接",id:"8"},
              // {name:"被依赖",id:"9"},
              // {name:"被包含",id:"10"},
              // {name:"被虚拟化",id:"11"},
              // {name:"被管理",id:"12"},
              let a = '';
              switch (item.relationType) {
                case '1':
                  a = '运行';
                  break;
                case '2':
                  a = '连接';
                  break;
                case '3':
                  a = '依赖';
                  break;
                case '4':
                  a = '包含';
                  break;
                case '5':
                  a = '虚拟化';
                  break;
                case '6':
                  a = '管理';
                  break;
                case '7':
                  a = '运行于';
                  break;
                case '8':
                  a = '被连接';
                  break;
                case '9':
                  a = '被依赖';
                  break;
                case '10':
                  a = '被包含';
                  break;
                case '11':
                  a = '被虚拟化';
                  break;
                default:
                  a = '被管理';
              }
              let iconfromString =
                "<img src='" +
                item.fromTypeIcon +
                "' style='vertical-align: middle; width: 20px;  height: 20px;padding-right: 10px;'>"
              let icontoString =
                "<img src='" +
                item.toTypeIcon +
                "' style='vertical-align: middle; width: 20px;  height: 20px;padding-right: 10px;'>"
              this.copylist.push({
                fromAttrLabel:
                  iconfromString +
                  item.fromTypeName +
                  ' - ' +
                  item.fromAttrLabel,
                toAttrLabel:
                  icontoString + item.toTypeName + ' - ' + item.toAttrLabel,
                relationType: a,
                cirelationId: item.cirelationId
              });
            });

            this.sshListData = this.copylist;
            this.total = Number(res.data.data.result.total);
          }
        })
        .catch();
    },
    handleCurrentChange(val, page) {
      // console.log(val, page)
      this.current = val
      this.getrelationlist()
    },
    handleSelectionChange(val) {
      this.delrelationidlist = ''
      val.forEach(item => {
        this.delrelationidlist += item.cirelationId + ',';
      });
      this.delrelationidlist = this.delrelationidlist.slice(
        0,
        this.delrelationidlist.length - 1
      )
      // console.log(this.delrelationidlist)
    },
    // 获取CI类型属性
    getCIList() {
      let name = '';
      let templateId = '';
      axios.getCIList(name, templateId).then(res => {
        //  console.log(res)
        this.citieslist = res.data.data.result;
        res.data.data.result.forEach(item => {
          this.options.push({
            value: item.cigroupId,
            label: item.name,
            cigroupId: item.cigroupId,
            children: []
          });
        });
        for (var j = 0; j < res.data.data.result.length; j++) {
          for (var i = 0; i < this.options.length; i++) {
            if (
              this.options[i].cigroupId == res.data.data.result[j].cigroupId &&
              res.data.data.result[j].citypeList.length > 0
            ) {
              for (
                var k = 0;
                k < res.data.data.result[j].citypeList.length;
                k++
              ) {
                this.options[i].children.push({
                  value: res.data.data.result[j].citypeList[k].citypeId,
                  label: res.data.data.result[j].citypeList[k].name,
                  citypeId: res.data.data.result[j].citypeList[k].citypeId,
                  children: []
                });
                // console.log(JSON.parse(res.data.data.result[j].citypeList[k].extend))
                // if(JSON.parse(res.data.data.result[j].citypeList[k].extend).length>0){
                //        for(var l = 0;l<JSON.parse(res.data.data.result[j].citypeList[k].extend).length;l++){

                //     for(var p = 0;p<this.options[i].children.length;p++){
                // //           if(this.options[i].children[p].citypeId==res.data.data.result[j].citypeList[k].citypeId){
                // //             this.options[i].children[p].children.push({label:res.data.data.result[j].citypeList[k].extend[l].label,type:res.data.data.result[j].citypeList[k].extend[l].type})
                // //           }
                //        }
                //     }
                // //     // this.options[i].children.children.push()
                // }
              }
            }
          }
        }
        let a;
        this.options.forEach(item => {
          // console.log(item)
          item.children.forEach(item2 => {
            for (var i = 0; i < res.data.data.result.length; i++) {
              for (
                var j = 0;
                j < res.data.data.result[i].citypeList.length;
                j++
              ) {
                // console.log(item2.citypeId ==res.data.data.result[i].citypeList[j].citypeId )
                if (
                  item2.citypeId ==
                  res.data.data.result[i].citypeList[j].citypeId
                ) {
                  // console.log(res.data.data.result[i].citypeList[j].extend)
                  if (
                    res.data.data.result[i].citypeList[j].extend.length == 0
                  ) {
                    res.data.data.result[i].citypeList[j].extend = [
                      {
                        extend: [
                          {
                            defaultValue: '',
                            label: '名称',
                            type: 'singleLineInput'
                          },
                          {
                            defaultValue: '',
                            label: '业务组',
                            type: 'optionsInputSys'
                          },
                          {
                            defaultValue: '',
                            label: '环境',
                            type: 'optionsInputEnv'
                          }
                        ]
                      }
                    ];
                  }
                  if (res.data.data.result[i].citypeList[j].extend.length > 0) {
                    if (
                      typeof res.data.data.result[i].citypeList[j].extend !==
                      'string'
                    ) {
                      a = res.data.data.result[i].citypeList[j].extend;
                    } else {
                      a = JSON.parse(
                        res.data.data.result[i].citypeList[j].extend
                      );
                    }

                    if (a.length > 0) {
                      a.forEach(item3 => {
                        // console.log(item3)
                        if (item3.extend.length > 0) {
                          item3.extend.forEach(item4 => {
                            item2.children.push({
                              value: item4.label + ',' + item4.type,
                              label: item4.label,
                              type: item4.type
                            });
                          });
                        }

                        // for(var k =0;k<item3.extend.length;k++){
                        //   console.log(item3.extend[k])
                        //    item2.children.push({label:item3[k].label,type:item3[k].type})
                        // }
                      });
                    }
                  }
                }
              }
            }
          });
        });
      });
      //  console.log(this.options)
    }
  },
  created() { },
  updated() { },
  mounted() {
    let params = this.getParams()
    this.getrelationlist(params)
    this.getcitypelist()
    this.getCIList()
  }
};
</script>
<style scoped lang="scss">
.bg {
  position: relative;
  height: 90%;
  padding: 10px;
  .rolePaginate {
    & /deep/ .el-pagination {
      text-align: center;
    }
  }
  .demo-form-inline {
    & /deep/ .el-form-item {
      margin-right: 0 !important;
    }
    .el-cascader {
      display: inline-block;
      position: relative;
      font-size: 14px;
      line-height: 40px;
      width: 300px;
    }
    .select-tag {
      width: 200px !important;
    }
    .margin-right20 {
      margin-right: 20px;
    }
  }
  .el-input {
    width: 70%;
  }
  .spanx {
    color: red;
  }
  .spanxs {
    color: #fff;
  }
  .disinlne {
    display: inline-block;
  }
  .headportraitbox {
    height: 220px;
    line-height: 54px;
    width: 120%;
    position: relative;
    margin-bottom: 20px;
  }
  .seeimg {
    position: absolute;
    right: 175px;
    top: 10px;
    width: 20px;
    height: 20px;
    float: right;
  }
  .btn-watch {
    color: #fff;
    background-color: #0280ff;
    background-size: 50%;
    background-position: center center;
  }
  .waringstyle {
    color: #f56c6c;
    font-size: 12px;
    line-height: 1;
    padding-top: 4px;
    position: absolute;
    top: 100%;
    left: 0px;
  }
  .task-btn-box {
    /* padding: 10px; */
    text-align: center;
    span {
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
      &.special {
        /* border: 1px solid #777777; */
        cursor: pointer;
      }
      &.special:hover {
        background: #0066ff;
        /* color:#fff!important; */
      }
      img {
        height: 12px;
        /* margin-top: 2px; */
        padding: 5px 8px 6px 8px;
        margin-bottom: -6px;
      }
    }
  }
  .el-button--medium {
    padding: 8px 20px !important;
  }
  .addbutton {
    background-color: #0280ff !important;
  }
  .btn-form-item {
    float: right;
    margin-right: 0;
  }
}
.search-el-button {
  border: 1px solid #436382;
  color: #fff;
  &:hover {
    border: 1px solid #01aef1;
    color: #01aef1;
    background-color: #041c25;
  }
  &:focus {
    border: 1px solid #01aef1;
    color: #01aef1;
    background-color: #041c25;
  }
  &:active {
    background-color: #041c25;
    border: 1px solid #01aef1;
    color: #01aef1;
  }
}
</style>
