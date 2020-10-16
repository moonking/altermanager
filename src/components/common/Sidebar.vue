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
        <template v-if="$route.query.code == 1">
          <template v-if="item.children">
            <el-submenu :index="item.href" :key="item.href">
              <template slot="title" id="submenu">
                <i class="sidebar-icon icon-caizhitihuan"></i>
                <span slot="title" style="color:#fff" id="parentmenu">{{ item.name }}</span>
              </template>
              <template v-for="subItem in item.children">
                <el-submenu
                  v-if="subItem.children.length > 0"
                  :index="subItem.href"
                  :key="subItem.menuId"
                >
                  <template slot="title">
                    <!-- <i class="nav-sub-icon iconfont" :class="subItem.icon"></i> -->
                    <span style="color: #fff;">{{ subItem.name }}</span>
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
                <el-menu-item v-else :index="subItem.href" :key="subItem.href" class="childermenu">
                  <!-- <i class="second-icon" :class="subItem.icon"></i> -->
                  {{ subItem.name }}
                </el-menu-item>
              </template>
            </el-submenu>
          </template>
          <template v-else>
            <el-menu-item :index="item.href" :key="item.index">
              <i class="fa" :class="[item.icon,{'isclick': item.isclick}]"></i>
              <span slot="title">{{ item.title }}</span>
            </el-menu-item>
          </template>
        </template>
      </template>
      <template v-for="item in sides.arr1">
        <template v-if="$route.query.code == 2">
          <template v-if="item.children">
            <el-submenu :index="item.href" :key="item.href">
              <template slot="title">
                <i class="sidebar-icon icon-dashujuzhichi"></i>
                <span slot="title" style="color:#fff">{{ item.name }}</span>
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
                <el-menu-item :index="subItem.href" :key="subItem.href" class="childermenu">
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
      <template v-for="item in AutomatedRelease">
        <template v-if="$route.query.code == 3">
          <template v-if="item.subs">
            <el-submenu :index="item.index" :key="item.index">
              <template slot="title">
                <i :class="item.icon"></i>
                <span slot="title" style="color:#fff">{{ item.title }}</span>
              </template>
              <template v-for="subItem in item.subs">
                <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                  <template slot="title">{{ subItem.title }}</template>
                  <el-menu-item
                    v-for="(threeItem,i) in subItem.subs"
                    :key="i"
                    :index="threeItem.index"
                  >
                    <i class="second-icon" :class="subItem.icon"></i>
                    {{ threeItem.title }}
                  </el-menu-item>
                </el-submenu>
                <el-menu-item
                  v-else
                  :index="subItem.index"
                  :key="subItem.index"
                  class="childermenu"
                >
                  <i class="second-icon" :class="subItem.icon"></i>
                  {{ subItem.title }}
                </el-menu-item>
              </template>
            </el-submenu>
          </template>
          <template v-else>
            <el-menu-item :index="item.index" :key="item.index">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.title }}</span>
            </el-menu-item>
          </template>
        </template>
      </template>
      <template v-for="item in AutomaticOperation">
        <template v-if="$route.query.code == 4">
          <template v-if="item.subs">
            <el-submenu :index="item.index" :key="item.index">
              <template slot="title">
                <i :class="item.icon"></i>
                <span slot="title" style="color:#fff">{{ item.title }}</span>
              </template>
              <template v-for="subItem in item.subs">
                <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                  <template slot="title">{{ subItem.title }}</template>
                  <el-menu-item
                    v-for="(threeItem,i) in subItem.subs"
                    :key="i"
                    :index="threeItem.index"
                  >
                    <i class="second-icon" :class="subItem.icon"></i>
                    {{ threeItem.title }}
                  </el-menu-item>
                </el-submenu>
                <el-menu-item
                  v-else
                  :index="subItem.index"
                  :key="subItem.index"
                  class="childermenu"
                >
                  <i class="second-icon" :class="subItem.icon"></i>
                  {{ subItem.title }}
                </el-menu-item>
              </template>
            </el-submenu>
          </template>
          <template v-else>
            <el-menu-item :index="item.index" :key="item.index">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.title }}</span>
            </el-menu-item>
          </template>
        </template>
      </template>
      <template v-for="item in ResourceManagement">
        <template v-if="$route.query.code == 5">
          <template v-if="item.subs">
            <el-submenu :index="item.index" :key="item.index">
              <template slot="title">
                <i :class="item.icon"></i>
                <span slot="title" style="color:#fff">{{ item.title }}</span>
              </template>
              <template v-for="subItem in item.subs">
                <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                  <template slot="title">{{ subItem.title }}</template>
                  <el-menu-item
                    v-for="(threeItem,i) in subItem.subs"
                    :key="i"
                    :index="threeItem.index"
                  >{{ threeItem.title }}</el-menu-item>
                </el-submenu>
                <el-menu-item
                  v-else
                  :index="subItem.index"
                  :key="subItem.index"
                  class="childermenu"
                >{{ subItem.title }}</el-menu-item>
              </template>
            </el-submenu>
          </template>
          <template v-else>
            <el-menu-item :index="item.index" :key="item.index">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.title }}</span>
            </el-menu-item>
          </template>
        </template>
      </template>
      <template v-for="item in AutomatedTest">
        <template v-if="$route.query.code == 6">
          <template v-if="item.subs">
            <el-submenu :index="item.index" :key="item.index">
              <template slot="title">
                <i :class="item.icon"></i>
                <span slot="title" style="color:#fff">{{ item.title }}</span>
              </template>
              <template v-for="subItem in item.subs">
                <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                  <template slot="title">{{ subItem.title }}</template>
                  <el-menu-item
                    v-for="(threeItem,i) in subItem.subs"
                    :key="i"
                    :index="threeItem.index"
                  >{{ threeItem.title }}</el-menu-item>
                </el-submenu>
                <el-menu-item
                  v-else
                  :index="subItem.index"
                  :key="subItem.index"
                  class="childermenu"
                >{{ subItem.title }}</el-menu-item>
              </template>
            </el-submenu>
          </template>
          <template v-else>
            <el-menu-item :index="item.index" :key="item.index">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.title }}</span>
            </el-menu-item>
          </template>
        </template>
      </template>
      <template v-for="item in ScreenMonitor">
        <template v-if="$route.query.code == 7">
          <template v-if="item.subs">
            <el-submenu :index="item.index" :key="item.index">
              <template slot="title">
                <i :class="item.icon"></i>
                <span slot="title" style="color:#fff">{{ item.title }}</span>
              </template>
              <template v-for="subItem in item.subs">
                <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                  <template slot="title">{{ subItem.title }}</template>
                  <el-menu-item
                    v-for="(threeItem,i) in subItem.subs"
                    :key="i"
                    :index="threeItem.index"
                  >{{ threeItem.title }}</el-menu-item>
                </el-submenu>
                <el-menu-item
                  v-else
                  :index="subItem.index"
                  :key="subItem.index"
                  class="childermenu"
                >{{ subItem.title }}</el-menu-item>
              </template>
            </el-submenu>
          </template>
          <template v-else>
            <el-menu-item :index="item.index" :key="item.index">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.title }}</span>
            </el-menu-item>
          </template>
        </template>
      </template>
      <!-- <template v-for="item in Intelligent0peration">
        <template v-if="$route.query.code == 8">
          <template v-if="item.subs">
            <el-submenu :index="item.index" :key="item.index">
              <template slot="title">
                <i :class="item.icon"></i>
                <span slot="title" style="color:#fff">{{ item.title }}</span>
              </template>
              <template v-for="subItem in item.subs">
                <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                  <template slot="title">{{ subItem.title }}</template>
                  <el-menu-item
                    v-for="(threeItem,i) in subItem.subs"
                    :key="i"
                    :index="threeItem.index"
                  >{{ threeItem.title }}</el-menu-item>
                </el-submenu>
                <el-menu-item
                  v-else
                  :index="subItem.index"
                  :key="subItem.index"
                  class="childermenu"
                >{{ subItem.title }}</el-menu-item>
              </template>
            </el-submenu>
          </template>
          <template v-else>
            <el-menu-item :index="item.index" :key="item.index">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.title }}</span>
            </el-menu-item>
          </template>
        </template>
      </template>-->
      <template v-for="item in AIA">
        <template v-if="$route.query.code == 8">
          <template v-if="item.subs">
            <el-submenu :index="item.index" :key="item.index">
              <template slot="title">
                <i :class="item.icon"></i>
                <span slot="title" style="color:#fff">{{ item.title }}</span>
              </template>
              <template v-for="subItem in item.subs">
                <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                  <template slot="title">{{ subItem.title }}</template>
                  <el-menu-item
                    v-for="(threeItem,i) in subItem.subs"
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
            <el-menu-item :index="item.index" :key="item.index">
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
  data () {
    return {
      currentIndex: [],
      currentActive: '',
      userId: '',
      collapse: false,
      siderListData: [],
      BasicManagementItems: [
        {
          icon: 'sidebar icon-caizhitihuan',
          index: '/BasicManagement/permissions?code=1',
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
          index: '/ResourceAllocation/organization?code=2',
          title: '资源配置管理',
          subs: [
            {
              index: '/ResourceAllocation/ResourceType?code=2',
              title: '资源类型管理'
            },
            {
              index: '/ResourceAllocation/CIlistData?code=2',
              title: 'CI列表'
            },
            {
              index: '/ResourceAllocation/manage_ciType?code=2',
              title: '管理CI类型'
            },
            {
              index: '/ResourceAllocation/creatci?code=2',
              title: '创建CI项'
            },
            {
              index: '/ResourceAllocation/Configuration?code=2',
              title: '应用配置'
            },
            {
              index: '/ResourceAllocation/ResourceAllocation?code=2',

              title: '资源配置管理'
            },
            {
              index: '/ResourceAllocation/ResourceTopology?code=2',

              title: '查询及资源拓扑'
            },
            {
              index: '/ResourceAllocation/CIType?code=2',
              title: 'CI类型'
            }
          ]
        },
        {
          icon: 'el-icon-lx-cascades',
          index: '/ResourceAllocation/Basicnformation?code=2',

          title: '基础信息',
          subs: [
            {
              index: '/ResourceAllocation/relation?code=2',

              title: '关系管理'
            },
            {
              index: '/ResourceAllocation/BusinessGroup?code=2',

              title: '业务组管理'
            },
            {
              index: '/ResourceAllocation/environment?code=2',

              title: '环境管理'
            }
          ]
        }
      ],
      AutomatedRelease: [
        {
          icon: 'sidebar-icon icon-gongzuotai',
          index: '1',
          title: '工作台',
          subs: [
            {
              index: '/AutomatedRelease?code=3&mode=1',
              title: '我的工作台'
            },
            {
              index: '/AutomatedRelease/examineAndApprove?code=3',
              title: '我的审批'
            }
          ]
        },

        {
          icon: 'sidebar-icon icon-zixitongyinyong ',
          index: '/AutomatedRelease/TaskDeployment?code=3',
          title: '任务流水线'
        },
        // {
        //   icon: 'sidebar-icon icon-ziyuanguanli',
        //   index: '/AutomatedRelease/demandManagement?code=3',
        //   title: '需求管理'
        // },

        {
          icon: 'sidebar-icon icon-quanbuxitong',
          index: '/AutomatedRelease/ToolsList?code=3',
          title: '脚本管理'
        },

        {
          icon: 'sidebar-icon icon-xitongshiticaozuobiaoshi',
          index: '/AutomatedRelease/releaseTasklist?code=3',
          title: '发布管理'
        },
        {
          icon: 'sidebar-icon icon-dingshifabu',
          index: '/AutomatedRelease/crontabList?code=3',
          title: '定时发布'
        },
        {
          icon: 'sidebar-icon icon-gongdanguanli',
          index: '2',
          title: '资源管理',
          subs: [
            {
              index: '/AutomatedRelease/NodeManage?code=3',
              title: '节点管理'
            },
            {
              index:
                '/AutomatedRelease/ResourceManagement/ClusterManage?code=3',
              title: '集群管理'
            }
          ]
        },
        // {
        //   icon: 'sidebar-icon icon-zhipinku',
        //   index: '########',
        //   title: '制品库',
        //   subs: [
        //     {
        //       index: '/AutomatedRelease/productPackage?code=3',
        //       title: '制品包管理'
        //     },
        //     {
        //       index: '/AutomatedRelease/configurationPackage?code=3',
        //       title: '配置包管理'
        //     },
        //     {
        //       index: '/AutomatedRelease/warehouse?code=3',
        //       title: '仓库管理'
        //     }
        //   ]
        // },
        {
          icon: 'sidebar-icon icon-zhipinku',
          index: '/AutomatedRelease/warehouse?code=3',
          title: '仓库管理'
        },
        {
          icon: 'sidebar-icon icon-zhipinku',
          index: '3',
          title: '配置管理',
          subs: [
            {
              index: '/AutomatedRelease/jenkinsConfig?code=3',
              title: 'Jenkins配置'
            },
            {
              index: '/AutomatedRelease/ProductConfig?code=3',
              title: '制品库配置'
            }
          ]
        }
      ],
      AutomaticOperation: [
        {
          icon: 'sidebar-icon icon-gongzuotai',
          index: '1',
          title: '工作台',
          subs: [
            {
              index: '/AutomaticOperation?code=4&mode=1',
              title: '我的工作台'
            },
            {
              index: '/AutomaticOperation/examineAndApprove?code=4',
              title: '我的审批'
            }
          ]
        },
        {
          icon: 'sidebar-icon icon-ziyuanguanli1',
          index: '2',
          title: '工单管理',
          subs: [
            {
              index: '/AutomaticOperation/OperationWorkOrder?code=4',
              title: '运维工单'
            },

            {
              index: '/AutomaticOperation/ExecutionLog?code=4',
              title: '执行日志'
            }
          ]
        },
        {
          icon: 'sidebar-icon icon-zixitongyinyong ',
          index: '3',
          title: '操作流水线管理',
          subs: [
            {
              index: '/AutomaticOperation/OperatingPipeline?code=4',
              title: '流水线管理'
            },

            {
              index: '/AutomaticOperation/PerformLog?code=4',
              title: '执行日志'
            }
          ]
        },
        {
          icon: 'sidebar-icon icon-ziyuanguanli',
          index: '/AutomaticOperation/ResourceManage?code=4',

          title: '资源管理'
        },
        {
          icon: 'sidebar-icon icon-gongdanguanli ',
          index: '/AutomaticOperation/Toolkit?code=4',

          title: '工具集管理'
        },
        {
          icon: 'sidebar-icon icon-quanbuxitong ',
          index: '/AutomaticOperation/ScriptList?code=4',

          title: '脚本管理'
        },
        {
          icon: 'sidebar-icon icon-dingshifabu ',
          index: '4',
          title: '健康管理',
          subs: [
            {
              index: '/AutomaticOperation/healthConfig?code=4',
              title: '健康配置'
            },
            {
              index: '/AutomaticOperation/healthIndex?code=4',
              title: '健康检查报告'
            }
          ]
        }
      ],
      ResourceManagement: [
        {
          icon: 'sidebar-icon icon-xitongyingyongfuwuqi',
          index: '/ResourceManagement/vcenterManage?code=5&mode=1',
          title: 'Vcenter管理'
        },
        {
          icon: 'sidebar-icon icon-gongzuotai ',
          index: '/ResourceManagement/hostManage?code=5',
          title: '主机管理'
        },
        {
          icon: 'sidebar-icon icon-ziyuanguanli1 ',
          index: '/ResourceManagement/instanceManage?code=5',
          title: '实例管理'
        },
        {
          icon: 'sidebar-icon icon-zixitongyinyong',
          index: '/ResourceManagement/templateManage?code=5',
          title: '模板管理'
        }
      ],
      AutomatedTest: [
        {
          icon: 'el-icon-menu',
          index: 'AutomatedTest',
          title: '自动化测试'
        }
      ],
      ScreenMonitor: [
        {
          icon: 'el-icon-service',
          index: '',
          title: '大屏监控',

          subs: [
            {
              index: '/ScreenMonitor/largeScreen?code=7',
              title: '大屏显示'
            },

            {
              index: '/ScreenMonitor/AlarmManagement?code=7',

              title: '告警管理'
            },
            {
              index: '/ScreenMonitor/BusinessTrack?code=7',

              title: '业务追踪'
            },
            {
              index: '/ScreenMonitor/MonitorConfiguration?code=7',

              title: '监控配置管理'
            }
          ]
        }
      ],
      Intelligent0peration: [
        {
          icon: 'el-icon-menu',
          index: 'Intelligent0peration',
          title: '智能运维',

          subs: [
            {
              index: '/Intelligent0peration/OperationalLog?code=6',
              title: '运维日志'
            },

            {
              index: '/Intelligent0peration/DataAcquisition?code=6',

              title: '数据采集配置'
            },
            {
              index: '/Intelligent0peration/RealTimeReports?code=6',

              title: '实时报表及仪表盘'
            },
            {
              index: '/Intelligent0peration/FailureAnalysis?code=6',

              title: '故障关联性分析'
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
              index: '/Aibms/businessPath?code=8',
              title: '监控来源'
            },
            {
              index: '/Aibms/blackList?code=8',
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
              index: '/Aibms/BuinessConfiguration/MonitoringSource?code=8',
              title: '监控来源'
            },
            {
              index: '/Aibms/BuinessConfiguration/alarmclassification?code=8',
              title: '告警分类'
            },
            {
              index: '/Aibms/Bconfiguration/Alarmrules?code=8',
              title: '告警规则'
            },
            {
              index: '/Aibms/BuinessConfiguration/upgradeAlarm?code=8',
              title: '告警升级'
            }
          ]
        },
        {
          icon: 'sidebar-icon icon-zhinengyunwei',
          index: '/Aibms/alarmnotice?code=8',
          title: '告警通知'
        },
        {
          icon: 'sidebar-icon icon-dianshangshujuhutong',
          index: '/Aibms/Transaction?code=8',
          title: '交易追踪'
        },
        {
          icon: 'sidebar-icon icon-quanbuxitong',
          index: '2',
          title: '其他配置',
          subs: [
            {
              index: '/Aibms/otherConfiguration/message?code=8',
              title: '短信配置'
            },
            {
              index: '/Aibms/otherConfiguration/email?code=8',
              title: '邮件配置'
            },
            {
              index: '/Aibms/otherConfiguration/maintain?code=8',
              title: '维护窗口'
            },
            {
              index: '/Aibms/otherConfiguration/timingList?code=8',
              title: '定时任务'
            }
          ]
        }
      ]
    };
  },
  computed: {
    sides () {
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
    getReturnSides (item) {
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
    getCurrentMune (code) {
      if (code === 1) {
        if (this.sides.arr) {
          let href = this.sides.arr[0].href;
          this.currentIndex = [href];
          this.currentActive = href;
        }
      } else if (code === 2) {
        if (this.sides.arr1) {
          let href = this.sides.arr1[0].href;
          this.currentIndex = [href];
          this.currentActive = href;
        }
      } else if (code === 3) {
        if (this.AutomatedRelease) {
          let index = this.AutomatedRelease[0].index;
          this.currentIndex = [index];
          this.currentActive = index;
        }
      } else if (code === 4) {
        if (this.AutomaticOperation) {
          let index = this.AutomaticOperation[0].index;
          this.currentIndex = [index];
          this.currentActive = index;
        }
      } else if (code === 5) {
        if (this.ResourceManagement) {
          let index = this.ResourceManagement[0].index;
          this.currentIndex = [index];
          this.currentActive = index;
        }
      } else if (code === 6) {
        if (this.AutomatedTest) {
          let index = this.AutomatedTest[0].index;
          this.currentIndex = [index];
          this.currentActive = index;
        }
      } else if (code === 7) {
        if (this.ScreenMonitor) {
          let index = this.ScreenMonitor[0].index;
          this.currentIndex = [index];
          this.currentActive = index;
        }
      } else if (code === 8) {
        if (this.AIA) {
          let index = this.AIA[0].index;
          this.currentIndex = [index];
          this.currentActive = index;
        }
      }
    },
    onRoutes (val) {
      return val;
    },
    clickParent (item, keyPath) {
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
    getLoginerMenu (userId) {
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
  created () {
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
  updated () {
    // console.log(this.$store.state.sides)
    // console.log(this.sides)
  }
};
</script>

<style scoped>
@import "../../../static/fonticon/font_sideBar/iconfont.css";
.sidebar {
  display: block;
  min-width: 200px;
  position: absolute;
  left: 0;
  top: 70px;
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
  background: #00A8E8;
  color: #fff;
}
.sidebar ul li.el-menu-item.is-active {
  background: #00A8E8;
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
  background: #00A8E8 !important;
}
.el-submenu .el-menu-item {
  padding-left: 65px !important;
}
.el-submenu__title {
  padding: 0 !important;
}
.el-submenu__title:hover {
  background-color: #00A8E8 !important;
}
.el-submenu__title:focus,
.el-submenu__title:hover {
  background-color: #00A8E8 !important;
}
.nav-sub-icon {
  color: #fff;
  font-size: 16px;
}
</style>

<style>
.el-menu--popup {
  background-color: #041c25e6 !important;
}
</style>
