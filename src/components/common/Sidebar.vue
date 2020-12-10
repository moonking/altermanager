<template>
  <div class="sidebar">
    <el-menu
      :default-active="onRoutes($route.fullPath)"
      class="sidebar-el-menu"
      :collapse="collapse"
      :unique-opened="true"
      :default-openeds="currentIndex"
      :collapse-transition="false"
      @open="clickParent"
      router
    >
      <template v-for="item in sides.arr">
        <template v-if="$route.query.code == 0">
          <template v-if="item.children">
            <el-submenu :index="item.href" :key="item.href">
              <template slot="title" id="submenu">
                <i class="sidebar-icon icon-caizhitihuan"></i>
                <span slot="title" style="color: #fff" id="parentmenu">{{
                  item.name
                }}</span>
              </template>
              <template v-for="subItem in item.children">
                <el-submenu
                  v-if="subItem.children.length > 0"
                  :index="subItem.href"
                  :key="subItem.menuId"
                >
                  <template slot="title">
                    <!-- <i class="nav-sub-icon iconfont" :class="subItem.icon"></i> -->
                    <span style="color: #fff">{{ subItem.name }}</span>
                  </template>
                  <el-menu-item
                    class="childermenu"
                    v-for="threeItem in subItem.children"
                    :key="threeItem.menuId"
                    :index="threeItem.href"
                  >
                    <i class="second-icon"></i>
                    {{ threeItem.name }}
                  </el-menu-item>
                </el-submenu>
                <el-menu-item
                  v-else
                  :index="subItem.href"
                  :key="subItem.href"
                  class="childermenu"
                >
                  <!-- <i class="second-icon" :class="subItem.icon"></i> -->
                  {{ subItem.name }}
                </el-menu-item>
              </template>
            </el-submenu>
          </template>
          <template v-else>
            <el-menu-item :index="item.href" :key="item.index">
              <i class="fa" :class="[item.icon, { isclick: item.isclick }]"></i>
              <span slot="title">{{ item.title }}</span>
            </el-menu-item>
          </template>
        </template>
      </template>
      <template v-for="item in sides.arr1">
        <template v-if="$route.query.code == 1">
          <template v-if="item.children">
            <el-submenu :index="item.href" :key="item.href">
              <template slot="title">
                <i class="sidebar-icon icon-dashujuzhichi"></i>
                <span slot="title" style="color: #fff">{{ item.name }}</span>
              </template>
              <template v-for="subItem in item.children">
                <!--<el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">-->
                <!--<template slot="title">{{ subItem.title }}</template>-->
                <!--<el-menu-item-->
                <!--v-for="(threeItem,i) in subItem.subs"-->
                <!--:key="i"-->
                <!--:index="threeItem.index"-->
                <!--&gt;{{ threeItem.title }}</el-menu-item>-->
                <!--</el-submenu>-->
                <el-menu-item
                  :index="subItem.href"
                  :key="subItem.href"
                  class="childermenu"
                >
                  <!-- <i class="second-icon" :class="subItem.icon"></i> -->
                  {{ subItem.name }}
                </el-menu-item>
              </template>
            </el-submenu>
          </template>
          <template v-else>
            <el-menu-item :index="item.index" :key="item.href">
              <!-- <i :class="item.icon"></i> -->
              <span slot="title">{{ item.name }}</span>
            </el-menu-item>
          </template>
        </template>
      </template>
      <template v-for="item in AIA">
        <template v-if="$route.query.code == 2">
          <template v-if="item.subs && item.title !== '监控平台'">
            <el-submenu :index="item.index" :key="item.index">
              <template slot="title">
                <i :class="item.icon"></i>
                <span slot="title" style="color: #fff">{{ item.title }}</span>
              </template>
              <template v-for="subItem in item.subs">
                <el-submenu
                  v-if="subItem.subs"
                  :index="subItem.index"
                  :key="subItem.index"
                >
                  <template slot="title">{{ subItem.title }}</template>
                  <el-menu-item
                    v-for="(threeItem, i) in subItem.subs"
                    :key="i"
                    :index="threeItem.index"
                  >
                    <!-- <i class="second-icon" :class="subItem.icon"></i> -->
                    {{ threeItem.title }}
                  </el-menu-item>
                </el-submenu>
                <el-menu-item
                  v-else
                  :index="subItem.index"
                  :key="subItem.index"
                  class="childermenu"
                >
                  <!-- <i class="second-icon" :class="subItem.icon"></i> -->
                  {{ subItem.title }}
                </el-menu-item>
              </template>
            </el-submenu>
          </template>
          <template v-else>
            <el-submenu
              v-if="item.title == '监控平台'"
              :index="item.index"
              :key="item.index"
            >
              <template slot="title">
                <i :class="item.icon"></i>
                <span slot="title" style="color: #fff">{{ item.title }}</span>
              </template>
              <template v-for="subItem in item.subs">
                <el-submenu
                  v-if="subItem.subs"
                  :index="subItem.index"
                  :key="subItem.index"
                >
                  <template slot="title">{{ subItem.title }}</template>
                  <el-menu-item
                    v-for="(threeItem, i) in subItem.subs"
                    :key="i"
                    :index="threeItem.index"
                  >
                    <!-- <i class="second-icon" :class="subItem.icon"></i> -->
                    {{ threeItem.title }}
                  </el-menu-item>
                </el-submenu>
                <el-menu-item
                  v-else
                  :index="subItem.url"
                  :key="subItem.index"
                  class="childermenu"
                  @click="goOther(subItem.index)"
                >
                  <!-- <i class="second-icon" :class="subItem.icon"></i> -->
                  <span>{{ subItem.title }}</span>
                </el-menu-item>
              </template>
            </el-submenu>
            <el-menu-item v-else :index="item.index" :key="item.index">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.title }}</span>
            </el-menu-item>
          </template>
        </template>
      </template>
    </el-menu>
    <!-- <p style="margin-left:10px ;" v-if="!collapse">版本：Shepherd2.13.01</p> -->
  </div>
</template>

<script>
import bus from '../common/bus';
import axios from '@/api';
export default {
  data() {
    return {
      currentIndex: [],
      currentActive: '',
      userId: '',
      collapse: false,
      siderListData: [],
      BasicManagementItems: [
        {
          icon: 'sidebar icon-caizhitihuan',
          index: '/BasicManagement/permissions?code=0',
          title: '',
          subs: [
            { index: '1', title: '', subs: [] },
            { index: '2', title: '', subs: [] },
            {
              index: '3',
              title: '',
              subs: []
            }
          ]
        }
      ],
      ResourceAllocation: [
        {
          icon: 'el-icon-goods',
          index: '/ResourceAllocation/organization?code=1',
          title: '资源配置管理',
          subs: [
            {
              index: '/ResourceAllocation/ResourceType?code=1',
              title: '资源类型管理'
            },
            {
              index: '/ResourceAllocation/CIlistData?code=1',
              title: 'CI列表'
            },
            {
              index: '/ResourceAllocation/manage_ciType?code=1',
              title: '管理CI类型'
            },
            {
              index: '/ResourceAllocation/creatci?code=1',
              title: '创建CI项'
            },
            {
              index: '/ResourceAllocation/Configuration?code=1',
              title: '应用配置'
            },
            {
              index: '/ResourceAllocation/ResourceAllocation?code=1',

              title: '资源配置管理'
            },
            {
              index: '/ResourceAllocation/ResourceTopology?code=1',

              title: '查询及资源拓扑'
            },
            {
              index: '/ResourceAllocation/CIType?code=1',
              title: 'CI类型'
            }
          ]
        },
        {
          icon: 'el-icon-lx-cascades',
          index: '/ResourceAllocation/Basicnformation?code=1',

          title: '基础信息',
          subs: [
            {
              index: '/ResourceAllocation/relation?code=1',

              title: '关系管理'
            },
            {
              index: '/ResourceAllocation/BusinessGroup?code=1',

              title: '业务组管理'
            },
            {
              index: '/ResourceAllocation/environment?code=1',

              title: '环境管理'
            }
          ]
        }
      ],
      AIA: [
        {
          icon: 'sidebar-icon icon-zixitongyinyong ',
          index: '0',
          title: '业务路径',
          subs: [
            {
              index: '/Aibms/businessPath?code=2',
              title: '业务拓扑'
            },
            {
              index: '/Aibms/blackList?code=2',
              title: '黑名单'
            }
          ]
        },
        {
          icon: 'sidebar-icon icon-xitongyingyongfuwuqi',
          index: '1',
          title: '业务配置',
          subs: [
            {
              index: '/Aibms/BuinessConfiguration/MonitoringSource?code=2',
              title: '监控来源'
            },
            {
              index: '/Aibms/BuinessConfiguration/alarmclassification?code=2',
              title: '告警分类'
            },
            {
              index: '/Aibms/BuinessConfiguration/Alarmrules?code=2',
              title: '告警规则'
            },
            {
              index: '/Aibms/BuinessConfiguration/upgradeAlarm?code=2',
              title: '告警升级'
            }
          ]
        },
        {
          icon: 'sidebar-icon icon-zhinengyunwei',
          index: '/Aibms/alarmnotice?code=2',
          title: '告警通知'
        },
        {
          icon: 'sidebar-icon icon-dianshangshujuhutong',
          index: '/Aibms/Transaction?code=2',
          title: '交易追踪'
        },
        {
          icon: 'sidebar-icon icon-quanbuxitong',
          index: '2',
          title: '其他配置',
          subs: [
            {
              index: '/Aibms/otherConfiguration/message?code=2',
              title: '短信配置'
            },
            {
              index: '/Aibms/otherConfiguration/email?code=2',
              title: '邮件配置'
            },
            {
              index: '/Aibms/otherConfiguration/maintain?code=2',
              title: '维护窗口'
            },
            {
              index: '/Aibms/otherConfiguration/timingList?code=2',
              title: '定时任务'
            }
          ]
        },
        {
          icon: 'sidebar-icon icon-dapingmu',
          index: '3',
          title: '监控平台',
          subs: [
            {
              url: '/Aibms?code=2&type=Splunk',
              index: 'http://10.130.116.100:8000/zh-CN/account/login',
              title: 'Splunk'
            },
            {
              url: '/Aibms?code=2&type=BPC',
              index: 'https://10.130.182.223:8443/bpc',
              title: 'BPC'
            },
            {
              url: '/Aibms?code=2&type=NPM',
              index: 'https://10.130.182.222:8443/zh-hans/accounts/login',
              title: 'NPM'
            },
            {
              url: '/Aibms?code=2&type=Prometheus',
              index: 'http://cnzhaplpms040:3000/',
              title: 'Prometheus'
            },
            {
              url: '/Aibms?code=2&type=Oneagent',
              index: 'https://ugv140.dynatrace-managed.com/login',
              title: 'Oneagent'
            },
            {
              url: '/Aibms?code=2&type=Solarwind',
              index: 'http://10.130.182.254/Orion',
              title: 'Solarwind'
            }
          ]
        }
      ]
    };
  },
  computed: {
    sides() {
      if (this.$store.state.sides.arr) {
        this.$store.state.sides.arr.forEach(item => {
          this.getReturnSides(item);
        });
      }
      return this.$store.state.sides;
    }
  },
  watch: {
    $route: function (val, oldVal) {
      //  监听路由变化 - 默认左侧菜单栏展开
      if (oldVal.path.split('/')[1] != val.path.split('/')[1]) {
        let code = parseInt(val.query.code);
        this.getCurrentMune(code);
      }
    }
  },
  methods: {
    goOther(url) {
      window.open(url, '_blank');
    },
    getReturnSides(item) {
      if (item.children && item.children.length > 0) {
        item.children.forEach(d => {
          if (d.menuType === '3') {
            item.children = [];
            return;
          }
          this.getReturnSides(d);
        });
      }
    },
    //    默认左侧菜单栏展开
    getCurrentMune(code) {
      if (code === 0) {
        if (this.sides.arr) {
          let href = this.sides.arr[0].href;
          this.currentIndex = [href];
          this.currentActive = href;
        }
      } else if (code === 1) {
        if (this.sides.arr1) {
          let href = this.sides.arr1[0].href;
          this.currentIndex = [href];
          this.currentActive = href;
        }
      } else if (code === 2) {
        if (this.AIA) {
          let index = this.AIA[0].index;
          this.currentIndex = [index];
          this.currentActive = index;
        }
      }
    },
    onRoutes(val) {
      return val;
    },
    clickParent(item, keyPath) {
      // let last = item.split('&')[1];
      // item.isclick = true;
    },
    // getMenuLsit() {
    //   var token = this.$route.query.token;
    //   var userId = this.$route.query.userId;
    //   this.$axios({
    //     headers: {
    //       Authorization: "Bearer " + token
    //     },
    //     methods:ttp://10.217.27.72:8086/api/user/menu/" + userId
    //   })
    //     .then(response => {
    //       console.log(response.data.data.menus);
    //       var BasicManagementItems = response.data.data.menus;
    //     })
    //     .catch(function(err) {}); "GET",
    //     url: "h
    // },
    getLoginerMenu(userId) {
      //    默认左侧菜单栏展开
      let code = parseInt(this.$route.query.code);
      this.getCurrentMune(code);

      axios.getLoginMenu(userId).then(res => {
        // console.log(res.data.data.menus)

        let arr = {};
        if (res && res.status == '200') {
          // this.BasicManagementItems[0].title = res.data.data.menus[0].name;
          // this.BasicManagementItems[0].subs[0].title =
          //   res.data.data.menus[0].children[1].name;
          // this.BasicManagementItems[0].subs[1].title =
          //   res.data.data.menus[0].children[0].name;
          // this.BasicManagementItems[0].subs[2].title =
          //   res.data.data.menus[0].children[2].name;
          // this.BasicManagementItems[0].subs[0].index =
          //   res.data.data.menus[0].children[1].href;
          // this.BasicManagementItems[0].subs[1].index =
          //   res.data.data.menus[0].children[0].href;
          // this.BasicManagementItems[0].subs[2].index =
          //   res.data.data.menus[0].children[2].href;
          // arr.index = 0;
          this.siderListData = res.data.data.menus;
          if (
            this.siderListData.length == 1 &&
            this.siderListData[0].name == '基础管理'
          ) {
            arr.arr = this.siderListData.slice(0, 1);
            arr.arr1 = [];
          } else if (
            this.siderListData.length == 1 &&
            this.siderListData[0].name == '资源配置管理'
          ) {
            arr.arr = [];
            arr.arr1 = this.siderListData.slice(0, 1);
          } else if (this.siderListData.length > 1) {
            this.siderListData.forEach(item => {
              for (let key of item.children) {
                if (key.children.length > 0) {
                  let arr = [];
                  for (let menu of key.children) {
                    if (menu.menuType === '2') {
                      arr.push(menu);
                    }
                  }
                  this.$set(key, 'children', arr);
                }
              }
            });
            arr.arr = this.siderListData.slice(0, 1);
            arr.arr1 = this.siderListData.slice(1, 2);
          }
          // console.log(arr)
          this.$store.dispatch('GET_SIDE', arr);
        }
      });
    }
  },
  created() {
    this.userId = localStorage.getItem('userId');
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    this.getLoginerMenu(this.userId);
    bus.$on('collapse', msg => {
      this.collapse = msg;
    });
  },
  mounted: function () {
    // console.log(this.$route.query);
    // this.userId=localStorage.getItem("userId");
    // console.log(this.$store.state.sides)
    //   this.getMenuLsit();
  },
  updated() {
    // console.log(this.$store.state.sides)
    // console.log(this.sides)
  }
};
</script>

<style scoped>
@import '../../../static/fonticon/font_sideBar/iconfont.css';
.sidebar {
  display: block;
  min-width: 180px;
  position: absolute;
  left: 0;
  top: 72px;
  bottom: 0;
  /* background: rgba(4, 28, 37, 0.4); */
}
.el-menu {
  border-right: 1px solid transparent;
  background-color: rgba(4, 28, 37, 0.4);
}
.sidebar > ul {
  height: 100%;
}
.second-icon {
  width: 8px;
  height: 8px;
  border-radius: 10px;
  vertical-align: baseline !important;
  border: 2px solid #e8e8e8;
  display: inline-block;
  margin-right: 3px;
}
.sidebar ul li.childermenu.is-active {
  color: #ffffff;
}
.sidebar ul li.el-menu-item.childermenu {
  color: #e8e8e8;
}
.sidebar ul li.el-menu-item.childermenu.is-active .second-icon {
  border-color: #fff;
}
.sidebar ul li.el-menu-item.childermenu.is-active {
  background: #00a8e8;
  color: #fff;
}
.sidebar ul li.el-menu-item.is-active {
  background: #00a8e8;
  color: #fff;
}
.childermenu:hover {
  color: #fff !important;
}
.childermenu:hover .second-icon {
  border-color: #fff;
}
#parentmenu:hover {
  color: #fff !important;
  background: #00a8e8 !important;
}
.el-submenu .el-menu-item {
  padding-left: 58px !important;
}
.el-submenu__title {
  padding: 0 !important;
}
.el-submenu__title:hover {
  background-color: #00a8e8 !important;
}
.el-submenu__title:focus,
.el-submenu__title:hover {
  background-color: #00a8e8 !important;
}
.nav-sub-icon {
  color: #fff;
  font-size: 16px;
}
.el-menu--popup {
  background-color: #041c25e6 !important;
}
</style>
