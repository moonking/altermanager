<template>
  <div class="bg aibms-bg aibms-color-bg">
    <div class="headerTop">角色说明</div>
    <el-form
      :model="ruleForm2"
      :rules="rules"
      ref="ruleForm2"
      label-width="100px"
      class="demo-ruleForm"
    >
      <div>
        <el-form-item label="角色名称" prop="name" class="disinlne">
          <el-input
            v-model="ruleForm2.name"
            autocomplete="off"
            maxlength="10"
            style="width:400px"
            :input="inputFun(ruleForm2.name)"
          ></el-input>
          <span>{{roleNameLength}}</span>/
          <span>{{totalNum}}</span>
        </el-form-item>
      </div>
      <div>
        <el-form-item label="角色标识" prop="permission" class="disinlne">
          <el-input
            v-model="ruleForm2.permission"
            autocomplete="off"
            maxlength="30"
            style="width:400px"
            :input="inputFun2(ruleForm2.permission)"
          ></el-input>
          <span>{{rolePermissionLength}}</span>/
          <span>{{totalNum1}}</span>
        </el-form-item>
      </div>
      <div>
        <el-form-item label="角色说明" class="disinlne">
          <el-input
            type="textarea"
            v-model="ruleForm2.description"
            style="width:400px"
            autocomplete="off"
            maxlength="50"
            :input="inputFun1(ruleForm2.description)"
          ></el-input>
          <span>{{roleDescriptionLength}}</span>/
          <span>{{descriptionTotalNum}}</span>
        </el-form-item>
      </div>
      <!-- <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm2')">提交</el-button>
        <el-button @click="resetForm('ruleForm2')">重置</el-button>
      </el-form-item>-->
    </el-form>
    <div class="headerTop">选择系统——设置权限</div>
    <div class="sysNameBtn">
      <el-button
        class="systemName nomal-button"
        v-for="(item,index) in syslistdata"
        :key="index"
        @click="delsys(item,index)"
        :class="{active : active == index}"
      >{{item.name}}</el-button>
    </div>
    <tree-table
      :data="menuListData"
      class="treebox"
      stripe
      :header-cell-style="{ background: '#f5f5f5' }"
    >
      <el-table-column label="类型">
        <template slot-scope="scope">
          <el-button
            style="cursor:default;"
            :type="scope.row.menuType=='1'?'primary':scope.row.menuType=='2'?'success':scope.row.menuType=='3'?'warning':'info'"
            size="small"
          >{{scope.row.menuType=='1'?'系统':scope.row.menuType=='2'?'菜单':scope.row.menuType=='3'?'按钮':'数据项'}}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="权限标识">
        <template slot-scope="scope">
          <!-- <el-tooltip :content="scope.row.timeLine+'ms'" effect="dark" placement="left"> -->
          <!-- <div class="processContainer">
            <div
              :style="{ width:scope.row._width * 500+'px',
                          background:scope.row._width>0.5?'rgba(233,0,0,.5)':'rgba(0,0,233,0.5)',
                          marginLeft:scope.row._marginLeft * 500+'px' }"
              class="process"
            >
              <span style="display:inline-block"/>
            </div>
          </div>-->
          <span>{{scope.row.permission}}</span>
          <!-- </el-tooltip> -->
        </template>
      </el-table-column>
      <!-- <el-table-column label="链接地址">
        <template slot-scope="scope">
          <el-button type="text" @click="message(scope.row)">点击</el-button>
        </template>
      </el-table-column>-->
      <el-table-column label="描述">
        <template slot-scope="scope">
          <span>{{scope.row.remarks}}</span>
        </template>
      </el-table-column>
    </tree-table>
    <div class="footer">
      <el-button class="save-btn-margin" type="primary" @click="submitForm">确认新增</el-button>
      <el-button class="nomal-button" @click="resetForm">取消</el-button>
    </div>
  </div>
</template>
<script>
import treeTable from '../treeTable'
import axios from '@/api'
import {
  initFileds,
  checkModification,
  onbeforeunload
} from '../../utils/reload.js'

// import bus from '../common/bus';
// import Cookie from 'js-cookie';
export default {
  components: { treeTable },
  data () {
    return {
      isbl: false,
      rules: {
        name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        permission: [
          { required: true, message: '请输入角色标识', trigger: 'blur' }
        ]
      },
      rolePermissionLength: 0,
      totalNum1: 30,
      systemId: '',
      firstMeunId: '',
      count: 0,
      syslistdata: [],
      delmenuid: '',
      active: 0,
      roleDescriptionLength: 0,
      descriptionTotalNum: 50,
      roleNameLength: 0,
      totalNum: 10,
      menuIds: '',
      menuListData: [],
      ruleForm2: {
        name: '',
        description: '',
        permission: '',
        useable: 1
      },
      menuNameLength: 0,
      saveMenuList: []
    }
  },
  methods: {
    inputFun (value) {
      if (value) {
        this.roleNameLength = value.length
      } else {
        this.roleNameLength = 0
      }
    },
    inputFun1 (value) {
      if (value) {
        this.roleDescriptionLength = value.length
      } else {
        this.roleDescriptionLength = 0
      }
    },
    inputFun2 (value) {
      if (value) {
        this.rolePermissionLength = value.length
      } else {
        this.rolePermissionLength = 0
      }
    },
    delsys (item, index) {
      // console.log(this.$store.state.checkValue);
      if (this.$store.state.checkValue) {
        this.$notify({
          title: '提示',
          message: '只能选择一个系统',
          type: 'error'
        })
        return false
      }
      //          if(this.$store.state.checkValue){
      //              this.checkValue=this.$store.state.checkValue;
      //              this.$store.state.checkValue=!this.$store.state.checkValue;
      //          }
      //          console.log(this.$store.state.checkValue);
      this.active = index
      this.delmenuid = item.menuId
      this.getMenuList(item.menuId)
    },
    // 获取系统列表
    getMenuSysList () {
      axios.getMenuSysList().then(res => {
        this.syslistdata = res.data.data.result
        this.firstMeunId = this.syslistdata[0].menuId
        // console.log(this.firstMeunId);
        // console.log(this.syslistdata);
        this.getMenuList(this.firstMeunId)
      })
    },
    // 获取菜单列表
    getMenuList (menuId) {
      let mId = ''
      if (menuId) {
        mId += 'menuId=' + menuId
      }
      this.$store.dispatch('mId', mId)
      // console.log(this.$store.state.mId);
      axios.menuList(mId).then(res => {
        // console.log(this.checkValue);
        // console.log(mId);
        this.count++
        this.menuListData = res.data.data.result
        //              console.log(this.menuListData);
        //              this.syslist = res.data.data.result;
        this.sysname = this.menuListData[0].name
        this.systemId = this.menuListData[0].menuId
        onbeforeunload()
        initFileds()
      })
    },
    //    //获取菜单列表
    //    getMenuList(){
    //      axios.menuList().then((res)=>{
    //         this.menuListData = res.data.data.result;
    //          console.log(this.menuListData);
    //      }).catch()
    //    },

    //    确定新增
    submitForm () {
      this.$refs.ruleForm2.validate(valid => {
        if (valid) {
          // let isbltxt = false;
          // let checktxt = false;
          // if (
          // this.ruleForm2.name.length == 0 ||
          // this.ruleForm2.permission.length == 0
          // ) {
          // isbltxt = true;
          // }

          // if (isbltxt) {
          // this.$notify({
          // title: "提示",
          // message: "角色名称或角色标识不能为空！",
          // type: "error"
          // });
          // return false;
          // } else if (this.ruleForm2.name == this.ruleForm2.permission) {
          // this.$notify({
          // title: "提示",
          // message: "角色名称和角色标识不能相同！",
          // type: "error"
          // });
          // return false;
          // }

          if (
            this.$store.state.menuIds.slice(0, this.menuIds.length - 1) === '' ||
            this.menuIds === ''
          ) {
            this.menuIds = 'menuIds=' + this.$store.state.menuIds
            this.menuId = 'menuId=' + this.systemId
          } else {
            this.menuIds =
              'menuIds=' +
              this.$store.state.menuIds.slice(0, this.menuIds.length - 1)
            this.menuId = 'menuId=' + this.$store.state.menuIds.split(',')[0]
          }

          axios.addRole(this.menuIds, this.menuId, this.ruleForm2).then(res => {
            this.isbl = true

            if (res.data.code === 200) {
              // console.log(res);
              this.$notify({
                type: 'success',
                message: '添加成功!'
              })
              this.menuIds = ''
              this.menuId = ''
              // this.$store.state.menuIds.slice(0, this.menuIds.length - 1) == '';
              this.$store.state.checkValue = false
              this.$router.push({
                path: '/BasicManagement/role',
                query: {
                  code: 1
                }
              })
            } else {
              this.isbl = false
              this.$notify({
                title: '提示',
                message: res.data.message,
                type: 'warning'
              })
            }
          })
        }
      })

      // let inputcheck = document.getElementsByTagName('input')
      // inputcheck.forEach(function(item){
      //   if(item.checked){

      //   }else{

      //   }
      // })
    },
    setaddRole () {
      axios.addRole().then(res => {
        // console.log(res)
      })
    },
    // 表格折叠
    getAuth (data) {
      let opt = []
      data.forEach(val => {
        opt.push(val.id)
        if (val.children) {
          val.children.forEach(el => {
            // console.log(val.id);
            if (el.selectchecked.length) {
              opt.push(el.id)
              opt.push(el.selectchecked)
            }
          })
        }
      })
    },
    // 取消
    resetForm () {
      this.ruleForm2 = ''
      this.$router.push({
        path: '/BasicManagement/role?code=1',
        query: {}
      })
    }
  },
  beforeRouteLeave (to, from, next) {
    let bl = checkModification(this.isbl)
    if (bl) {
      const answer = window.confirm(
        '页面相关数据还未保存，是否离开当前页面!'
      )
      if (answer) {
        next()
      } else {
        // 不支持传递回调(因为this实例已经创建可以获取到，所以没必要)
        next(false)
      }
    } else {
      next()
    }
  },
  beforeDestroy () { },
  destroyed () {
    window.onbeforeunload = null
  },
  created () {
    this.$store.dispatch('GET_DATA', [])
  },
  mounted () {
    this.getMenuList()
    this.getMenuSysList()
  },
  computed: {

    checkValue () {
      return this.$store.state.checkValue
    }
  }
}
</script>
<style scoped lang="scss">
.bg {
  margin: 10px;
  border-radius: 5px;
  background: #fff;

  .spanx {
    color: red;
  }

  .el-table_1_column_2 {
    div {
      text-align: center;
    }
  }
  .warning {
    background-color: rgba(230, 162, 60, 0.1);
    border-color: rgba(230, 162, 60, 0.2);
    color: #e6a23c;
  }
  .success {
    background-color: rgba(103, 194, 58, 0.1);
    border-color: rgba(103, 194, 58, 0.2);
    color: #67c23a;
  }
  .headerTop {
    height: 60px;
    line-height: 60px;
    background: #e6e3e3;
    text-indent: 20px;
    font-size: 16px;
    width: 100%;
  }
  .demo-ruleForm {
    padding: 20px;
    .disinlne {
      display: inline-block;
    }
  }
  .footer {
    width: 80%;
    text-align: center;
    padding: 30px 0 20px;
  }
  .treebox {
    width: 80%;
    margin: 20px;
  }
  .disinlne {
    label {
      text-align: center;
    }
  }
  .active {
    background: #00A8E8!important;
    border: 1px solid #00A8E8!important;
    color: #fff;
  }
  .sysNameBtn {
    padding-top: 10px;
    padding-left: 12px;
    .systemName {
      line-height: 24px;
      padding: 5px;
      border-radius: 4px;
      margin: 0 8px;
    }
  }
}
</style>
