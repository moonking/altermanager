<template>
  <div class="link-topology-tooltip">
    <!-- <div class="tooltip-title">
      <span  class="node-name"><i class="el-icon-s-help"></i> test title</span>
    </div> -->
    <div class="tooltip-title" v-if="alertInfo">
      <span  class="node-name"><i class="el-icon-s-help"></i> {{alertInfo.name}}</span>
    </div>
    <!-- <div class="tooltip-content">
      <div class="alert-item">
        <div class="alert-info">
          <i class="el-icon-message-solid" :style="{color: getLevelColor(1), marginRight: '10px'}"></i>CPU使用率过高
        </div>
        <div class="alert-time">14:01:28</div>
      </div>
    </div> -->
    <div class="tooltip-content" v-if="alertInfo && alertInfo.alerts.length > 0">
      <div class="alert-item" v-for="alert in alertInfo.alerts" :key="alert.ciitemId">
        <div class="alert-info">
          <i class="el-icon-message-solid" :style="{color: getLevelColor(alert.level), marginRight: '10px'}"></i>{{alert.alertMessage}}
        </div>
        <div class="alert-time">{{alert.alertTime.split(' ')[1]}}</div>
      </div>
    </div>
    <div class="hidden-block" v-else>没有告警信息</div>
  </div>
</template>

<script>
export default {
  props: {
    // tooltip 信息
    alerts: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    alerts (value) {
      // console.log('value: ', value)
    }
  },
  data () {
    return {
      alertList: [
        {
          id: '0abbfs',
          info: '响应时间异常',
          level: 1,
          time: '16:46:05'
        },
        {
          id: 'afg341',
          info: '非法数据格式，解析错误,请稍后重试',
          level: 2,
          time: '13:01:28'
        },
        {
          id: 'qptpo9',
          info: '服务器异常',
          level: 3,
          time: '09:11:09'
        }
      ],
      colorMap: {
        '1': '#ff0000',
        '2': '#ff9900',
        '3': '#ffcc00',
        '4': '#ffff00',
        '5': '#ffff88'
      }
    }
  },
  methods: {
    // 获取不同等级的颜色
    getLevelColor (level) {
      const { colorMap } = this
      level = level + ''
      return colorMap[level] || colorMap['1']
    }
  },
  computed: {
    // 告警详情展示
    alertInfo () {
      const { alerts } = this
      const result = alerts ? alerts.businessData : null
      return result
    }
  }
}
</script>

<style scoped>
.hidden-block {
  width: 280px;
  height: 104px;
  line-height: 104px;
  color: #999;
  font-size: 16px;
  text-align: center;
}
.link-topology-tooltip {
  width: 280px;
  height: 145px;
  padding: 0 20px;
  background-color: rgba(22, 22, 22, 0.7);
}
.tooltip-title {
  width: 100%;
  height: 40px;

  display: flex;
  justify-content: space-between;

  line-height: 40px;
  font-size: 14px;
  color: #555;

  border-bottom: 1px dashed #999;

  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.node-name {
  color: #fff;
  font-weight: bold;
}
.tooltip-content {
  width: 100%;
  height: 84px;
  padding: 10px 0;

  overflow-y: auto;
}
.alert-item {
  width: 100%;
  height: 28px;

  display: flex;

  line-height: 28px;
  font-size: 14px;
  color: #fff;

  cursor: default;
}
.alert-info {
  flex: 1;
  max-width: 210px;

  /* 文本超出省略 */
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.alert-time {
  width: 60px;
  margin-left: 10px;
  color: #fff;
  text-align: right;
}
</style>
