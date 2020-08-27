<template>
  <el-table :data="formatData" :row-style="showRow" v-bind="$attrs">
    <el-table-column v-if="columns.length===0" width="200" label="名称">
      <template slot-scope="scope">
        <span v-for="space in scope.row._level" :key="space" class="ms-tree-space"/>
        <span v-if="iconShow(0,scope.row)" class="tree-ctrl" @click="toggleExpanded(scope.$index)">
          <i v-if="!scope.row._expanded" class="el-icon-plus"/>
          <i v-else class="el-icon-minus"/>
        </span>
        <!-- <el-checkbox-group  class="disinlne"> -->
        <el-checkbox
          v-if="isshowcheck"
          v-model="scope.row.checked"
          @change="istruecheck($event,scope.row.checked,scope)"
        ></el-checkbox>
        <i v-if="scope.row.icon" class="fa" :class="scope.row.icon"></i>
        <!-- <el-checkbox v-model="scope.row.checked" @change='istruecheck()' ></el-checkbox> -->
        <!-- </el-checkbox-group > -->
        {{ scope.row.name }}
      </template>
    </el-table-column>
    <slot/>
  </el-table>
</template>

<script>
// import { menuList } from '@/api/user';
import treeToArray from './eval'
// import bus from '../common/bus';
export default {
  name: 'TreeTable',
  data () {
    return {
      isshowcheck: false,
      ischeck: false,
      num: 0,
      arrtypeid: [],
      allRoleData: [],
      count: [],
      copydata: []
    }
  },
  props: {
    /* eslint-disable */
    data: {
      type: [Array, Object],
      required: true
    },
    columns: {
      type: Array,
      default: () => []
    },
    menuListData: "",
    evalFunc: Function,
    evalArgs: Array,
    expandAll: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    // 格式化数据源
    formatData: function() {
      let tmp;
      if (!Array.isArray(this.data)) {
        tmp = [this.data];
      } else {
        tmp = this.data;
      }
      const func = this.evalFunc || treeToArray;
      const args = this.evalArgs
        ? Array.concat([tmp, this.expandAll], this.evalArgs)
        : [tmp, this.expandAll];
      return func.apply(null, args);
    }
  },
  methods: {
    //获取菜单列表
    // getMenuList() {
    //   menuList()
    //     .then(res => {
    //       this.menuListData = res.data.data.result;
    //       console.log(this.menuListData);
    //     })
    //     .catch();
    // },
    showRow: function(row) {
      // this.ifshowexpanded()
      const show = row.row.parent
        ? row.row.parent._expanded && row.row.parent._show
        : true;
      row.row._show = show;
      return show
        ? "animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;"
        : "display:none;";
    },
    // 切换下级是否展开
    toggleExpanded: function(trIndex) {
      const record = this.formatData[trIndex];
      record._expanded = !record._expanded;
    },
    // 图标显示
    iconShow(index, record) {
      return index === 0 && record.children && record.children.length > 0;
    },
    ifshowexpanded() {
      this.formatData.forEach(function(item) {
        // item._expanded = false;
        item.checked = false;
      });
    },
    getchildren(c, e) {
      c.forEach(item => {
        item.checked = e;
        if (item.children.length > 0) {
          this.getchildren(item.children, e);
        }
      });
    },
    getparent(p, e) {
      p.checked = e;
      if (p && !e) {
        p.children.forEach(function(item) {
          if (item.checked) {
            p.checked = true;
          }
        });
      }
      if (p.parent) {
        this.getparent(p.parent, e);
      }
    },
    //去重
    // uniq(array) {
    //   var temp = {},
    //     r = [],
    //     len = array.length,
    //     val,
    //     type;
    //   for (var i = 0; i < len; i++) {
    //     val = array[i];
    //     type = typeof val;
    //     if (!temp[val]) {
    //       temp[val] = [type];
    //       r.push(val);
    //     } else if (temp[val].indexOf(type) < 0) {
    //       temp[val].push(type);
    //       r.push(val);
    //     }
    //   }
    //   return r;
    // },


    // JSON的深拷贝
 deepClone(obj) {
    var type = Object.prototype.toString.call(obj);  //通过原型对象获取对象类型
    var newObj;
    if(type ==='[object Array]'){
        //数组
        newObj =[];
        if(obj.length >0){
            for(var x=0;x<obj.length;x++){
                newObj.push(this.deepClone(obj[x]));
            }
        }
    }else if(type==='[object Object]'){
        //对象
        newObj = {};
        for(var x in obj) {
            newObj[x] = this.deepClone(obj[x]);
        }
    }else{
        //基本类型和方法可以直接赋值
        newObj = obj;
    }
    return newObj;
 },

//勾选
    istruecheck(e, checked, sp) {
        // console.log(this.formatData)
        // console.log(typeof e);
        // console.log(checked,sp)
      let menuIds = "";
      // this.uniq(this.arrtypeid);
      if (e) {
        this.arrtypeid.push(sp.row.menuId);
      } else {
        this.arrtypeid.splice(this.arrtypeid.indexOf(sp.row.menuId), 1);
      }
      let _this = this;
//      if(e&&sp.row.menuType=='1'){
//        this.count.push(sp.row.menuId)
//      }else if(sp.row.menuType=='1'&&!e){
//        if(this.count.length>0){
//          this.count.forEach(item=>{
//                this.count.splice(this.count.indexOf(sp.row.menuId),1)
//          })
//        }
//      }
      // console.log(this.count);
      //   console.log(checked);
            this.$store.dispatch("getCheckValue", checked);

        // console.log(this.$store.state.checkValue);
//      if(sp.row.menuType=='1'&&this.count.length>1){
//          this.count.forEach(item=>{
//                this.count.splice(this.count.indexOf(sp.row.menuId),1)
//          })
////        sp.row.checked = false
//              this.$notify({
//                    title: "提示",
//                    message: '只能选择一个系统',
//                    type: "error"
//                  });
//                  return false
//      }
        
          if (sp.row.menuType == "1" && e) {
            if (sp.row.children && sp.row.children.length > 0) {
              sp.row.children.forEach(item => {
                item.checked = e;
                if (item.children && item.children.length > 0) {
                  _this.getchildren(item.children, e);
                }
              });
            }
            // this.formatData.forEach(function(item) {
            //   item.checked = e;
            // });
          } else if (sp.row.menuType == "1" && !e) {
            if (sp.row.children.length > 0) {
              sp.row.children.forEach(item => {
                item.checked = e;
                if (item.children.length > 0) {
                  _this.getchildren(item.children, e);
                }
              });
            }
            // this.formatData.forEach(function(item) {
            //   item.checked = e;
            // });
          } else if (sp.row.menuType != "1" && e) {
            if (e && sp.row.parent) {
              sp.row.parent.checked = e;
              if (sp.row.parent.parent) {
                this.getparent(sp.row.parent.parent, e);
              }
            }
            if (sp.row.children && sp.row.children.length > 0) {
              sp.row.children.forEach(item => {
                item.checked = e;
                if (item.children && item.children.length > 0) {
                  _this.getchildren(item.children, e);
                }
              });
            }
          } else if (sp.row.menuType != "1" && !e) {
            if (!e && sp.row.parent) {
              // console.log(sp.row.parent);
              sp.row.parent.checked = e;
              for (var i = 0; i < sp.row.parent.children.length; i++) {
                if (sp.row.parent.children[i].checked) {
                  sp.row.parent.checked = true;
                  break;
                }
              }

              if (sp.row.parent.parent) {
                this.getparent(sp.row.parent.parent, e);
              }
            }
            if (sp.row.children.length > 0) {
              sp.row.children.forEach(item => {
                item.checked = e;
                if (item.children.length > 0) {
                  _this.getchildren(item.children, e);
                }
              });
            }
          }
       
    
      this.formatData.forEach(function(item) {
        if (item.checked) {
          // _this.formatData[sp.$index].checked = true;
          menuIds += item.menuId + ",";
        }
      });
      // console.log(menuIds)
      this.$store.dispatch("GET_ID", menuIds);
      this.$store.dispatch("GET_TYPE2ID", this.arrtypeid);
      this.formatData.reverse().reverse();
      // console.log(this.formatData)
    },

  //角色 查看
  getlist(){
     if (
      this.$route.path == "/BasicManagement/role" 
    ){
    if(this.$store.state.view== 'view'){
      this.isshowcheck = false
      let n = this.formatData.length
      let s = this.noRoleData.length
      if (this.noRoleData.length > 0) {
        for (let i = 0; i < n; i++) {
          for (let j = 0; j <s ; j++) {
            if(this.formatData[i]){
                  if (this.formatData[i].menuId == this.noRoleData[j].menuId) {
                   this.formatData.splice(i,1)
              }
            }
             
          }
        }
      }
    }else{
       this.isshowcheck = true
      if (this.allRoleData.length > 0) {
        for (let i = 0; i < this.formatData.length; i++) {
          for (let j = 0; j < this.allRoleData.length; j++) {
            if(this.allRoleData.length>1){
               if (this.formatData[i].menuId == this.allRoleData[j].menuId) {
              this.formatData[i].checked = true;
            }
            }else if(this.allRoleData.length==1&&this.allRoleData[j].menuType=='1'){
                    if (this.formatData[i].menuId == this.allRoleData[j].menuId) {
              this.formatData[i].checked = true;
            }
            }
          }
        }
      }
    }
    }
       this.formatData.reverse().reverse();
    }
  },
  created () {
  },
  updated() {
    // console.log(this.$store.state.datas)
    this.ifshowexpanded();
        this.noRoleData = this.$store.state.nodata;
      this.allRoleData = this.$store.state.datas;
        if ( this.$route.path == "/BasicManagement/role" ){
      this.getlist()
    }else if(this.$route.path == "/BasicManagement/permissions"||this.$route.path == "/BasicManagement/addRole"){
      this.$store.dispatch('VIEW','')
    }
  },
  mounted() {
    // console.log('22222222')
    if(this.$route.path == "/BasicManagement/addRole"){
       this.isshowcheck = true
    }
  }
};
</script>
<style rel="stylesheet/css">
@keyframes treeTableShow {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@-webkit-keyframes treeTableShow {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>

<style lang="scss" rel="stylesheet/scss" scoped>
$color-blue: #00A8E8;
$space-width: 18px;
.ms-tree-space {
  position: relative;
  top: 1px;
  display: inline-block;
  font-style: normal;
  font-weight: 400;
  line-height: 1;
  width: $space-width;
  height: 14px;
  &::before {
    content: "";
  }
}
.disinlne {
  display: inline-block;
}
.processContainer {
  width: 100%;
  height: 100%;
}
table td {
  line-height: 26px;
}
.tree-ctrl {
  position: relative;
  cursor: pointer;
  color: $color-blue;
  margin-left: -$space-width;
}
</style>