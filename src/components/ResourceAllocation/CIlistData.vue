<template>
  <div class="bg aibms-ci-list aibms-role">
    <el-form type="flex" v-model="formInline" class="demo-form-inline">
      <!--一级菜单-->
      <el-form-item style="width:13%">
        <el-cascader
          placeholder="选择CI类型"
          expand-trigger="hover"
          :options="options"
          v-model="selectedOptions2"
          @change="handleChange"
          clearable
        ></el-cascader>
      </el-form-item>
      <el-form-item style="width:11%">
        <el-select placeholder="选择业务组" v-model="systemId" clearable>
          <el-option
            :label="sys.name"
            :value="sys.systemId"
            v-for="sys in systemList"
            :key="sys.systemId"
          ></el-option>
        </el-select>
      </el-form-item>
      <!--<el-form-item style="width:10%">
        <el-select placeholder="选择关联层数" clearable>
          <el-option>11111</el-option>
        </el-select>
      </el-form-item>-->

      <!-- v-if="selectSource" -->
      <el-form-item style="width:12%">
        <el-select v-model="dataFrom" placeholder="选择数据来源" clearable>
          <el-option label="Promtheus" value="1"></el-option>
          <el-option label="Dynatrace" value="2"></el-option>
          <el-option label="BPC" value="3"></el-option>
        </el-select>
      </el-form-item>

      <!-- <el-form-item style="width:10%" v-if="selectEnv">
        <el-select placeholder="选择环境" clearable v-model="environment">
          <el-option label="测试环境" value="1"></el-option>
          <el-option label="预生产环境" value="2"></el-option>
          <el-option label="生产环境" value="3"></el-option>
        </el-select>
      </el-form-item>-->

      <!-- v-if="selectKeys" -->
      <el-form-item style="width:15%">
        <el-input type="text" placeholder="CI项名称/关键字" clearable v-model="keyword" />
      </el-form-item>
      <!-- <el-form-item style="width:7%">
        <el-button
          class="cm-form-btn cm-add-btn other"
          @click="selectSource=!selectSource,selectKeys=!selectKeys "
      >更多检索</el-button>-->

      <!-- <el-select
          v-model="filterList"
          multiple
          collapse-tags
          class="item-select"
          style="margin-left: 20px;"
          placeholder="请选择显示项"
        >
          <el-option v-for="(item,index) in selectArr" :key="index" :label="item" :value="item"></el-option>
      </el-select>-->
      <!-- </el-form-item> -->
      <el-form-item class="item-right overHideMargin">
        <el-button icon="el-icon-search" class="nomal-button" @click.stop="search">查找</el-button>
        <!-- <el-dropdown trigger="click">
          <el-button icon="el-icon-plus" class="margin-left-btn">
            新增
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <div @click="getFromExcel">
              <el-dropdown-item>导&nbsp;&nbsp;入</el-dropdown-item>
            </div>
          </el-dropdown-menu>
        </el-dropdown> -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          class="margin-left-btn"
          @click.prevent="addCidata"
        >新增ci项</el-button>
      </el-form-item>
      <!-- <el-form-item style="width:7%"> -->
      <!-- <el-select   @change="getFromExcel" placeholder="新增" clearable>
          <el-option label="导入" value="1"></el-option>
      </el-select>-->
      <!-- <el-dropdown  class="addbtn"  trigger="click">
           <el-button class="cm-form-btn cm-add-btn other">
            新增<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
            <el-dropdown-menu slot="dropdown">
              <div  @click="getFromExcel"><el-dropdown-item>导&nbsp;&nbsp;入</el-dropdown-item></div>
            </el-dropdown-menu>
         </el-dropdown>
      </el-form-item>-->
      <!-- <el-form-item>
         <div style="    display: inline-block;" @click="getselect('2','1')">
           <span class="iconfont">&#xe604;</span>
              <img src="../../../static/img/icon/CSV.svg" title="导出为CSV格式" style="cursor: pointer; width: 36px;">
         </div>
           <div style="    display: inline-block;"  @click="getselect('2','2')">
              <span class="iconfont">&#xe605;</span>
               <img src="../../../static/img/icon/excel.svg" title="导出为EXCEL格式" style="    cursor: pointer; width: 38px; margin-bottom: 3px;">
         </div>
           <div style="    display: inline-block;"  @click="getselect('2','3')">
              <span class="iconfont">&#xe60b;</span>
               <img src="../../../static/img/icon/pdf.svg" title="导出为PDF格式" style="cursor: pointer; width: 30px; margin-bottom: 3px;">
         </div>
      </el-form-item>-->
      <!-- <el-form-item>
        <el-button class="cm-form-btn cm-add-btn other" @click="addCidata()">新增ci项</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          class="cm-form-btn"
          @click="BatchDeletebtn"
          :style="{padding: '5px 7px',cursor: 'pointer'}"
        >批量操作</el-button>
      </el-form-item>

      <el-form-item>
        <el-button
          @click="batchDelete(tableChecked)"
          v-if="delesteBtn"
          class="cm-form-btn"
          :style="{padding: '5px 8px'}"
        >删除</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          v-if="delesteBtn"
          class="cm-form-btn"
          :style="{padding: '5px 8px'}"
          @click="delesteBtn = false,BatchDeleteShow = false,delesteBtn = false"
        >取消</el-button>
      </el-form-item>-->
    </el-form>

    <div class="content-wrapper">
      <!-- <el-button :type="bgColor == 0 ? 'primary' : ''" @click="checkBtn">基本信息</el-button> -->
      <!-- <el-button :type="bgColor == 1 ? 'primary' : ''" @click="checkChart">关系结构</el-button> -->
      <ul class="tablist">
        <li :class="{active:shows==1}" @click="checkBtn">基本信息</li>
        <li :class="{active:shows==2}" @click="checkChart">关系结构</li>
      </ul>
      <!-- <el-button class="cm-form-btn cm-add-btn other" @click="addCidata()">新增ci项</el-button> -->
      <!-- <div @click="BatchDeletebtn" class="special"  style="border:1px solid #707070;height:30px;display:inline-block;padding:3px"> -->
      <!-- <span class="special" @click="BatchDeletebtn" style=""> -->
      <!-- <img style="height:12px;padding: 5px 8px 6px 8px;margin-bottom: -6px;" src="../../../static/img/delblue.png" alt>批量删除 -->
      <!-- </span> -->
      <!-- </div> -->
      <!-- <img class="delimg" src="../../../static/img/cdIcon/del-dark.png"> -->
      <!-- <ul class="tablist deltab" style="width:120px">
        <li class="listli" @click="BatchDeletebtn">
          <span>批量删除</span>
        </li>
      </ul>-->
      <!-- <li :class="{active:shows==2}"  @click="checkChart">关系结构</li> -->
      <el-button
        @click="BatchDeletebtn"
        class="delete-button"
        type="primary"
        size="small"
        icon="el-icon-close"
      >批量删除</el-button>
      <!-- <span
        class="cm-form-btn cm-delete-btn-light other"
        @click="BatchDeletebtn"
        :style="{padding: '5px 7px',cursor: 'pointer'}"
      >批量删除</span>-->
      <!-- <el-button
        class="cm-form-btn cm-delete-btn-light other"
        @click="BatchDeletebtn"
        :style="{padding: '5px 7px',cursor: 'pointer'}"
      >批量删除</el-button>-->

      <el-button
        @click="batchDelete(tableChecked)"
        v-if="delesteBtn"
        class="cm-form-btn"
        :style="{padding: '5px 8px'}"
      >删除</el-button>

      <el-button
        v-if="delesteBtn"
        class="cm-form-btn"
        :style="{padding: '5px 8px'}"
        @click="delesteBtn = false,BatchDeleteShow = false,delesteBtn = false"
      >取消</el-button>
      <!-- <div class="divicon icons"> -->
      <div class="divicon">
        <!-- <el-dropdown trigger="click">
          <el-button size="small" class="normal-button">
            导出为
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <div style="display: inline-block;" @click="getselect('2','1')">导出为CSV格式</div>
            </el-dropdown-item>
            <el-dropdown-item>
              <div style="display: inline-block;" @click="getselect('2','2')">导出为EXCEL格式</div>
            </el-dropdown-item>
            <el-dropdown-item>
              <div style="display: inline-block;" @click="getselect('2','3')">导出为PDF格式</div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown> -->
        <!-- <div style="    display: inline-block;" @click="getselect('2','1')"> -->
        <!-- <span class="iconfont" title="导出为CSV格式">&#xe604;</span> -->
        <!-- <img src="../../../static/img/icon/CSV.svg" title="导出为CSV格式" style="cursor: pointer; width: 36px;"> -->
        <!-- </div> -->
        <!-- <div style="    display: inline-block;" @click="getselect('2','2')"> -->
        <!-- <span class="iconfont" title="导出为EXCEL格式">&#xe605;</span> -->
        <!-- <img src="../../../static/img/icon/excel.svg" title="导出为EXCEL格式" style="    cursor: pointer; width: 38px; margin-bottom: 3px;"> -->
        <!-- </div> -->
        <!-- <div style="    display: inline-block;" @click="getselect('2','3')"> -->
        <!-- <span class="iconfont" title="导出为PDF格式">&#xe60b;</span> -->
        <!-- <img src="../../../static/img/icon/pdf.svg" title="导出为PDF格式" style="cursor: pointer; width: 30px; margin-bottom: 3px;"> -->
        <!-- </div> -->
      </div>

      <div style="width: 160px;  display: inline-block; position: relative;  left: 1%;">
        <!-- <el-select
          id="sel"
          @change="getselect('2')"
          @visible-change="visiblesel"
          v-model="sshid"
          placeholder="选择导出格式"
          clearable
        >
          <el-option
            :label="item.name"
            :value="item.id"
            v-for="(item,index) in typeList"
            :key="index"
          ></el-option>
        </el-select>-->
      </div>
      <div class="list-box" style="margin-top:20px">
        <div v-if="changeTab">
          <el-table
            :data="CiDataList"
            stripe
            @selection-change="handleSelectionChange"
            class="table-wrapper"
          >
            <el-table-column type="selection" align="center" />
            <el-table-column label="名称">
              <template slot-scope="scope">
                <span v-html="scope.row.name"></span>
              </template>
            </el-table-column>
            <el-table-column prop="citypeName" label="CI类型" />
            <el-table-column label="数据来源">
              <template slot-scope="scope">
                <span v-if="scope.row.dataFrom==1">手动添加</span>
                <span v-if="scope.row.dataFrom==2">导入</span>
                <span v-if="scope.row.dataFrom==3">服务器获取</span>
              </template>
            </el-table-column>
            <el-table-column label="环境">
              <template slot-scope="scope">
                <span>{{scope.row.Envname}}</span>
              </template>
            </el-table-column>
            <el-table-column label="业务系统">
              <template slot-scope="scope">
                <span>{{scope.row.sName}}</span>
              </template>
            </el-table-column>
            <el-table-column label="关键字">
              <template slot-scope="scope">
                <div v-if="scope.row.keywords ==''">
                  <span>无</span>
                </div>
                <div v-if="scope.row.keywords !=''">
                  <!-- <span v-for="(item,index) in results" :key="index" v-html="item.defaultValue"></span> -->
                  <span
                    v-for="(item,index) in scope.row.keywords"
                    :key="index"
                    v-html="item.label+':' +item.defaultValue + '</br>'"
                  ></span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="200px">
              <template slot-scope="scope">
                <div class="task-btn-box">
                  <span class="special" @click="toview(scope.row.ciitemId)">
                    <el-tooltip class="item" effect="dark" content="查看详情" placement="top-start">
                      <icon-svg icon-class="chakan" class="whiteness-icon-color " />
                    </el-tooltip>
                  </span>
                  <span class="special" @click="edit(scope.row.ciitemId)">
                    <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
                      <icon-svg icon-class="bianji" class="whiteness-icon-color " />
                    </el-tooltip>
                  </span>
                  <span class="special" @click="showOpen2(scope.row.ciitemId,'1')">
                    <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                      <icon-svg icon-class="shanchu" class="whiteness-icon-color " />
                    </el-tooltip>
                  </span>
                </div>
                <!-- <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
                  <el-button
                    @click="edit(scope.row.ciitemId)"
                    class="cm-form-btn cm-edit-btn-light"
                    :style="{backgroundSize: '40%', backgroundPosition: 'center'}"
                  ></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="查看" placement="top-start">
                  <el-button
                    class="cm-form-btn cm-watch-btn btn-watch"
                    @click="toview(scope.row.ciitemId)"
                    :style="{backgroundSize: '50%', backgroundPosition: 'center'}"
                  ></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                  <el-button
                    class="cm-form-btn cm-delete-btn-light"
                    :style="{backgroundSize: '40%',backgroundPosition: 'center'}"
                    @click="open2(scope.row.ciitemId,'1')"
                  ></el-button>
                </el-tooltip>-->
              </template>
            </el-table-column>
          </el-table>

          <div class="block">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currPage"
              :page-sizes="[10,30,50]"
              layout="prev, pager, next, sizes, total, jumper"
              :total="total"
              v-if="page"
            ></el-pagination>
          </div>
          <el-dialog :visible.sync="centerDialogVisible" width="25%" center>
            <div style="width:100%;text-align:center">
              <h3>确认删除</h3>
            </div>

            <span slot="footer" class="dialog-footer">
              <el-button @click="centerDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="deleteData(item.ciitemId)">确 定</el-button>
            </span>
          </el-dialog>
        </div>
      </div>
      <div class="box-chart aibms-color-bg" v-if="!changeTab">
        <div class="box-title">
          <el-row
            class="aibms-color-bg white-color"
            style="margin: 5px 10px;font-size: 14px;padding: 5px 0;"
          >
            <el-col :span="10">
              <el-row>
                <el-col :span="6" style="text-align:center;margin-top:4px;">
                  <span>设置展开层级：</span>
                </el-col>
                <el-col :span="10">
                  <el-input
                    v-model="level"
                    placeholder="输入展开层数"
                    size="mini"
                    @keyup.enter.native="handleEnter && canClick"
                  ></el-input>
                </el-col>
                <el-col :span="4" :offset="1">
                  <el-button
                    type="primary"
                    @click="handleEnter"
                    :disabled="!canClick"
                    size="mini"
                  >查询</el-button>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
        <CIListchart :selectOption="selectOption" @clear="hanldeStatus" />
      </div>
    </div>
    <el-dialog center :visible.sync="isSureBatch" title="批量删除" width="300px">
      <div :style="{textAlign: 'center'}">
        <i class="el-icon-warning"></i>&nbsp;&nbsp;确定要删除这些CI项吗？
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="isSureBatch = false">取 消</el-button>
        <el-button type="primary" size="mini" @click="sureBatch">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog center :visible.sync="dialogVisibleDelete" title="提示" width="300px">
      <div :style="{textAlign: 'center'}">
        <i class="el-icon-warning"></i>&nbsp;&nbsp;确定要删除该CI项吗？
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisibleDelete = false">取 消</el-button>
        <el-button type="primary" size="mini" @click="deleteCI">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from '@/api'
import CIListchart from './CIListchart.vue'
import Bus from '../common/bus.js'
export default {
  data () {
    return {
      isSureBatch: false,
      shows: 1,
      selectSource: false,
      selectKeys: false,
      results: '',
      delesteBtn: false,
      dataFrom: '',
      environment: '',
      page: true,
      name: '',
      keyword: '',
      EnvtablistData: [],
      tableChecked: [],
      ids: [],
      CiDataList: [],
      centerDialogVisible: false,
      changeData: '',
      BatchDeleteShow: false,
      formInline: '',
      activeName: 'first',
      citypeId: '',
      CiTypeDataList: '',
      childrenList: [],
      typeList: [
        { name: '导出为CSV格式', id: '1' },
        { name: '导出为EXCEL格式', id: '2' },
        { name: '导出为PDF格式', id: '3' }
      ],
      sshid: '',
      defaultParams: {
        label: 'name',
        value: 'cigroupId',
        children: 'children'
      },
      options: [],
      selectedOptions2: [],
      value5: '',
      currPage: 1,
      total: 0,
      current: 1,
      size: 10,
      bgColor: 0,
      changeTab: true,
      selectList: [1, 2, 3],
      value: 'CI项',
      selectArr: ['数据来源', 'CI类型', '业务系统', '关键字'],
      filterList: ['数据来源', 'CI类型', '关键字', '业务系统'],
      envitState: true,
      sourceState: true,
      CItype: true,
      keys: false,
      selectOption: {},
      systemId: '',
      systemList: [],
      copyid: '',
      level: 2,
      canClick: true,

      // 删除CI项弹框是否显示
      dialogVisibleDelete: false,
      deleteCiId: ''
    }
  },
  mounted () {
    this.getCiDataList()
    this.getCiTypeList()
  },
  components: {
    CIListchart
  },

  computed: {

  },
  methods: {
    // 查询按钮状态控制
    hanldeStatus (val) {
      this.canClick = val
    },
    // 选择层数
    handleEnter () {
      this.canClick = false
      let params = {
        level: this.level,
        citypeId: this.selectedOptions2[1] ? this.selectedOptions2[1] : '',
        dataFrom: this.dataFrom,
        environment: this.environment,
        keyword: this.keyword,
        systemId: this.systemId
      }
      Bus.$emit('drawAgin', params)
    },
    // 所有业务组
    getAllSystem () {
      let name = ''
      axios.getcigroupSystablist(name).then(res => {
        if (res.data.data.result) {
          this.systemList = res.data.data.result
        }
      })
    },
    // 拉聚焦
    visiblesel (val) {
      if (!val) {
        this.copyid = this.sshid
      } else if (val) {
        this.sshid = ''
      }
    },
    // 下拉选中
    getselect (n, b) {
      if (n == '2') {
        if (b == '2') {
          if (!this.selectedOptions2[1]) {
            this.$notify({
              type: 'warning',
              message: '请选择CI类型！'
            })
            return false
          }
          // if (!this.keyword) {
          //   this.$notify({
          //     type: "warning",
          //     message: "请输入CI项名称！"
          //   });
          //   return false;
          // }
          // console.dir(
          //   axios.ciBaseUrl() +
          //     "file/ciitem/excelFile?citypeId=" +
          //     this.selectedOptions2[1] +
          //     "&keyword=" +
          //     this.keyword
          // );
          window.open(
            axios.ciBaseUrl() + 'file/ciitem/excelFile?citypeId=' + this.selectedOptions2[1] + '&keyword=' + this.keyword, '_self'
          )
          //  console.log( this.selectedOptions2[1],this.dataFrom,this.environment,this.keyword)
        }
      } else {
        return false
      }
    },

    // 按钮切换
    checkBtn () {
      // this.bgColor = 0
      this.shows = 1
      this.changeTab = true
      this.getCiDataList()
    },
    checkChart () {
      // this.bgColor = 1
      this.shows = 2
      this.changeTab = false

      if (this.selectedOptions2) {
        this.selectOption = {
          citypeId: this.selectedOptions2[1],
          dataFrom: this.dataFrom,
          environment: this.environment,
          keyword: this.keyword,
          systemId: this.systemId,
          level: this.level
        }
      } else {
        this.selectOption = {
          citypeId: '',
          dataFrom: this.dataFrom,
          environment: this.environment,
          keyword: this.keyword,
          systemId: this.systemId,
          level: this.level
        }
      }
    },
    // 新增
    addCidata () {
      this.$router.push({
        path: '/ResourceAllocation/creatci?code=2'
      })
    }, // 点击编辑
    edit (id) {
      let ciitemId = id

      this.$router.push({
        path: '/ResourceAllocation/CIlistData/edit?code=2',
        query: { ciitemId: ciitemId }
      })
    },
    // 点击查看
    toview (id) {
      let ciitemId = id

      this.$router.push({
        path: '/ResourceAllocation/CIlistData/toview?code=2',
        query: { ciitemId: ciitemId }
      })
    },
    showOpen2 (id, index) {
      this.dialogVisibleDelete = true
      this.deleteCiId = id
    },
    // 点击删除
    // open2 (id, n) {
    //   checkdelCiDelete(id).then(res => {
    //     // console.log(res)
    //     if (res.data.code === 200) {
    //       this.$confirm('确认删除?', '提示', {
    //         confirmButtonText: '确定',
    //         cancelButtonText: '取消',
    //         type: 'warning'
    //       })
    //         .then(() => {
    //           this.deleteCI(id);
    //         })
    //         .catch(() => {
    //           this.$notify({
    //             type: 'info',
    //             message: '已取消删除'
    //           });
    //         });
    //     } else if (res.data.code === 500) {
    //       this.$confirm(res.data.message, '提示', {
    //         confirmButtonText: '确定',
    //         cancelButtonText: '取消',
    //         type: 'warning'
    //       })
    //         .then(() => {
    //           this.deleteCI(id);
    //         })
    //         .catch(() => {
    //           this.$notify({
    //             type: 'info',
    //             message: '已取消删除'
    //           });
    //         });
    //     }
    //   });
    // },

    // 删除
    deleteCI () {
      axios.CiDataDelete(this.deleteCiId).then(res => {
        if (res) {
          if (res.data.code === 200) {
            this.$notify({
              type: 'success',
              message: '删除成功!'
            })
            this.getCiDataList()
          } else {
            this.$notify({
              title: '提示',
              message: res.data.message,
              type: 'warning'
            })
          }
          this.dialogVisibleDelete = false
        } else {
          this.$notify({
            type: 'error',
            message: '接口请求失败'
          })
        }
      })
    },

    // 批量删除
    BatchDeletebtn () {
      if (this.tableChecked.length === 0) {
        this.$notify({
          title: '提示',
          message: '请选择要删除的数据',
          type: 'warning'
        })
      } else {
        this.isSureBatch = true
      }
      // this.BatchDeleteShow = true;
      // this.delesteBtn = true;
    },
    sureBatch () {
      this.batchDelete(this.tableChecked)
    },
    handleSelectionChange (val) {
      this.tableChecked = val
    },
    batchDelete (rows) {
      var ids = []
      rows.forEach(element => {
        ids.push(element.ciitemId)
      })
      var ciitemIds = ids.join(',')
      if (ciitemIds) {
        axios.allCiDataDelete(ciitemIds)
          .then((res) => {
            if (res) {
              if (res.data.code == 200) {
                this.$notify({
                  title: '提示',
                  message: '删除成功',
                  type: 'success'
                })
                this.BatchDeleteShow = false
                this.delesteBtn = false
                this.getCiDataList(1)
                this.isSureBatch = false
              } else {
                // console.log(111);
                this.$notify({
                  title: '提示',
                  message: res.data.message,
                  type: 'warning'
                })
              }
            } else {
              this.$notify({
                type: 'error',
                message: '接口请求失败'
              })
            }
          }).catch(e => {
            this.$notify({
              type: 'error',
              message: '接口请求失败'
            })
          })
      }
    },
    handleChange (value) {
      this.citypeId = value[1]
    },
    // 分页

    handleSizeChange (val) {
      this.size = val
      this.getCiDataList()
    },
    // 分页
    handleCurrentChange (val, page) {
      this.current = val

      this.size = 10
      this.getCiDataList()
    },

    // 获取ci类型列表
    getCiTypeList () {
      var name = ''
      let templateId = ''
      var newoptions = []
      axios.getCIList(name, templateId).then(res => {
        // console.log(res)
        if (res) {
          if (res.data.code == 200) {
            // console.log(res.data)
            this.options = res.data.data.result
            this.area = this.options.map(v => {
              this.childrenList = [] // 每个分组下要初始化
              this.children = v.citypeList.map(vv => {
                var newtype = { value: vv.citypeId, label: vv.name }
                this.childrenList.push(newtype)
              })
              var newoption = {
                value: v.cigroupId,
                label: v.name,
                children: this.childrenList
              }
              newoptions.push(newoption)
            })
            this.options = newoptions

            // console.log(this.area);
          }
        } else {
          this.$notify({
            type: 'error',
            message: '接口请求失败'
          })
        }
      })
    },
    // 环境下拉
    getenvtablist () {
      this.EnvtablistData = []
      let data = {
        environmentType: '',
        name: ''
      }
      axios.envtablist(data)
        .then(res => {
          if (res.data.success) {
            // console.log(res);
            //  this.options.forEach((item)=>{
            //   if(val[0]==item.value){
            //     item.children=[]
            res.data.data.result.forEach(d => {
              this.EnvtablistData.push({
                label: d.name,
                value: d.environmentId
              })
            })
            //   }
            // })
            // this.options.reverse().reverse()
          }

          this.CiDataList.forEach(item => {
            this.EnvtablistData.forEach(Env => {
              if (Env.value == item.environmentId) {
                item.Envname = Env.label
              }
            })
          })
          this.CiDataList.reverse().reverse()
        })
        .catch()
      // this.EnvtablistData.forEach((item)=>{
      //       this.options.push({label:item.label,value:item.value,children:[]})
      //     })
    },
    getFromExcel () {
      this.$router.push({
        path: '/ResourceAllocation/Excel',
        query: { code: 2 }
      })
    },
    // 获取列表
    getCiDataList (searchPage) {
      if (searchPage) {
        this.current = searchPage
      }
      let JobDto = {
        citypeId: this.citypeId, // 所属ci分类ID
        keyword: this.keyword, // 关键字
        dataFrom: this.dataFrom, // 数据来源   1手动添加 2导入 3服务器获取
        environment: this.environment, // 环境     1测试环境 2预生产环境 3生产环境
        current: this.current, // 当前页码
        size: this.size, // 每页展示条数
        systemId: this.systemId // 业务组
      }
      axios.getCiDataList(JobDto).then(res => {
        if (res) {
          if (res.data.code == 200) {
            this.CiDataList = res.data.data.result.records
            this.changeColor(res.data.data.result.records)
            this.total = parseInt(res.data.data.result.total)

            if (this.total == 0) {
              this.page = false
            } else {
              this.page = true
            }

            this.getenvtablist()
          }
        } else {
          this.$notify({
            type: 'error',
            message: '接口请求失败'
          })
        }
      })
    },
    // 高亮显示
    changeColor (resultsList) {
      resultsList.map((item, index) => {
        if (this.keyword && this.keyword.length > 0) {
          // 匹配关键字正则
          // console.log(this.keyword);
          let replaceReg = new RegExp(this.keyword, 'g')

          // 高亮替换v-html值
          let replaceString =
            "<span style='color:red'>" + this.keyword + '</span>'
          if (item.keywords.length > 0) {
            // 名称
            var rename = item.name.replace(replaceReg, replaceString)
            resultsList[index].name = rename

            // 关键字
            var keywordsStr = JSON.stringify(item.keywords)
            var replaceStr = keywordsStr.replace(replaceReg, replaceString)
            resultsList[index].keywords = JSON.parse(replaceStr)
          }
        }
      })
      this.results = []
      this.results = resultsList
    },
    brightenKeyword (val, keyword) {
      val = val + ''
      if (val.indexOf(keyword) !== -1 && keyword !== '') {
        return val.replace(
          keyword,
          '<font color="#409EFF">' + keyword + '</font>'
        )
      } else {
        return val
      }
    },
    // 搜索
    search () {
      this.CiDataList = []
      var searchPage = 1
      this.getCiDataList(searchPage)
      if (this.selectedOptions2) {
        this.selectOption = {
          citypeId: this.selectedOptions2[1],
          dataFrom: this.dataFrom,
          keyword: this.keyword,
          systemId: this.systemId,
          level: this.level
        }
      } else {
        this.selectOption = {
          citypeId: '',
          dataFrom: this.dataFrom,
          environment: this.environment,
          keyword: this.keyword,
          systemId: this.systemId,
          level: this.level
        }
      }

      Bus.$emit('drawAgin', this.selectOption)
      this.selectOption = {}
    }
  },
  watch: {},
  created () {
    this.getAllSystem()
    // var lett = this;
    // document.onkeydown = function(evt) {
    //   evt = evt ? evt : window.event ? window.event : "";
    //   var keyCode = evt.keyCode
    //     ? evt.keyCode
    //     : evt.which
    //     ? evt.which
    //     : evt.charCode;
    //   if (keyCode == 13) {
    //     lett.getCiDataList();
    //   }
    // };
  },
  destroyed () {
    Bus.$off('drawAgin')
  }
}
</script>
<style scoped lang="scss">
.bg {
  border-radius: 5px;
  /* padding-bottom: 30px; */
  padding: 10px;
  .demo-form-inline {
    position: relative;
    align-items: center;
    .ciadd {
      position: absolute;
      right: 0px;
      top: -18px;
      /* float: right; */
    }
    .el-form-item {
      display: inline-block;
      margin-right: 10px;
      vertical-align: center;
    }
    & /deep/ .overHideMargin {
      margin-right: 0 !important;
    }
  }
  .content-wrapper {
    position: relative;
    .tablist {
      width: 220px;
      text-align: center;
      color: #a1a1a2;
      display: inline-block;
      margin-top: 20px;
      li {
        display: inline-block;
        list-style: none;
        font-size: 16px;
        width: 80px;
        height: 32px;
        line-height: 32px;
        border: 1px solid #e5e5e5;
        padding-left: 10px;
        padding-right: 10px;
        cursor: pointer;
        border-radius: 3px;
        /* background-color: #fff; */
        /* color:#0066ff !important; */
      }
      .listli {
        text-align: center;
        /* padding-right: -10px!important; */
        width: 80px !important;
        span {
          margin-left: 12px !important;
        }
        &:hover {
          color: #0066ff;
          border: 1px solid #0066ff;
        }
      }
    }
    .delete-button {
      position: absolute;
      right: 0px;
      top: 20px;
    }
    .divicon {
      display: inline-block;
      /* line-height: 47px; */
      /* position: relative; */
      width: 10%;
      /* position: relative; */
      margin-left: 5px;
      /* top: 5px; */
      position: absolute;
      right: 75px;
      top: 20px;
    }
    .list-box {
      .table-wrapper {
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
              &:hover {
                background: #0066ff;
                /* color:#fff!important; */
              }
            }
            img {
              height: 12px;
              /* margin-top: 2px; */
              padding: 5px 8px 6px 8px;
              margin-bottom: -6px;
            }
          }
        }
      }
      .block {
        position: relative;
        text-align: center;
        width: 100%;
        padding: 20px 0;
        height: 32px;
        line-height: 32px;
        .el-pagination {
          margin-top: 92px;
          cursor: pointer;
        }
      }
    }
    .box-chart {
      width: 100%;
      height: 600px;
      background-color: #fff;
      .box-title {
        width: 100%;
        padding-top: 10px;
        .el-select {
          width: 80px !important;
          font-size: 14px;
          & /deep/ .el-input__inner {
            height: 30px !important;
            line-height: 30px !important;
          }
        }
      }
    }
    .deltab {
      position: absolute;
      right: -16px;
    }
  }
  .active {
    border: 1px solid #0066ff !important;
    /* color: #0066ff; */
    color: #0066ff !important;
    /* background-color: #0066ff; */
    /* box-shadow: 1px 1px #aaa; */
  }
  @font-face {
    font-family: "iconfont";
    src: url("../../../static/fonticon/font_qf3tvk3arrs/iconfont.eot");
    src: url("../../../static/fonticon/font_qf3tvk3arrs/iconfont.eot?#iefix")
        format("embedded-opentype"),
      url("../../../static/fonticon/font_qf3tvk3arrs/iconfont.woff2")
        format("woff2"),
      url("../../../static/fonticon/font_qf3tvk3arrs/iconfont.woff")
        format("woff"),
      url("../../../static/fonticon/font_qf3tvk3arrs/iconfont.ttf")
        format("truetype"),
      url("../../../static/fonticon/font_qf3tvk3arrs/iconfont.svg#iconfont")
        format("svg");
  }
  .iconfont {
    font-family: "iconfont" !important;
    font-size: 26px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  .icons {
    div {
      &:nth-child(1) {
        span {
          cursor: pointer;
          color: #45b058;
          &:link {
            color: #45b058;
            text-decoration: underline;
          }
          &:hover {
            color: #00ff00;
            text-decoration: none;
          }
          &:active {
            color: #006400;
            text-decoration: none;
          }
          &:visited {
            color: #45b058;
            text-decoration: none;
          }
        }
      }
      &:nth-child(2) {
        span {
          cursor: pointer;
          color: #ffc35e;
          &:link {
            color: #ffc35e;
            text-decoration: underline;
          }
          &:visited {
            color: #ffc35e;
            text-decoration: none;
          }
          &:active {
            color: #ff8c00;
            text-decoration: none;
          }
          &:hover {
            color: #ffd700;
            text-decoration: none;
          }
        }
      }
      &:nth-child(3) {
        span {
          cursor: pointer;
          color: #8c181a;
          &:link {
            color: #8c181a;
            text-decoration: underline;
          }
          &:visited {
            color: #8c181a;
            text-decoration: none;
          }
          &:hover {
            color: #ff0000;
            text-decoration: none;
          }
          &:active {
            color: #800000;
            text-decoration: none;
          }
        }
      }
    }
  }
  .search-text {
    color: red;
  }

  .el-form-item {
    margin-bottom: 0;
  }
  .btn-watch:hover {
    color: #fff;
    background-color: #0280ff;
    background-size: 50%;
    background-position: center center;
  }
}
</style>
