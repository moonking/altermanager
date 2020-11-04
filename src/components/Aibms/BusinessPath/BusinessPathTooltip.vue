<template>
  <div class="business-path-tooltip">
    <div class="tooltip-title">
      <span><i class="el-icon-s-data"></i> 链路层级统计</span>
      <el-button size="mini" type="text" @click="goSystemEdit"
        >去配置</el-button
      >
    </div>
    <div class="tooltip-content">
      <div
        class="transaction level-item"
        v-for="alert in alertList"
        :key="alert.name"
      >
        <div class="level-item-count">{{ alert.name }}: {{ alert.num }}</div>
        <div class="alert-count">
          {{ alert.alertName }}: {{ alert.alertNum }}
        </div>
      </div>
    </div>
    <div class="tooltip-title">
      <span><i class="el-icon-user-solid"></i> 维护人员</span>
    </div>
    <div class="tooltip-operate-user">
      <div class="user-info">
        <!-- <div class="user-item user-name">用户名: vince</div> -->
        <div class="user-item user-name">
          姓名:
          {{
            Object.keys(alerts).length > 0
              ? alerts.businessData.opsPerson.name
              : ''
          }}
        </div>
        <div class="user-item user-phone">
          手机号：{{
            Object.keys(alerts).length > 0
              ? alerts.businessData.opsPerson.phone
              : ''
          }}
        </div>
        <div class="user-item user-email">
          邮箱：{{
            Object.keys(alerts).length > 0
              ? alerts.businessData.opsPerson.email
              : ''
          }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // tooltip信息
    alerts: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    return {}
  },
  methods: {
    goSystemEdit() {
      const { alerts } = this
      this.$router.push({
        path: '/ResourceAllocation/SystemPage/edit',
        query: {
          code: 2,
          id: alerts.id
        }
      })
    }
  },
  watch: {
    alerts(value) {
      console.log('new tooltip value: ', value)
    }
  },
  computed: {
    alertList() {
      const { alerts } = this
      console.log(alerts)
      let alertList = []
      try {
        alertList = alerts.businessData.hierarchicalCount.systemLinkLevelList
      } catch (error) {
        console.log('data error!')
      }
      return alertList
    }
  },
  created() {
    console.log(this.alerts)
  }
}
</script>

<style scoped>
.business-path-tooltip {
  width: 300px;
  padding: 0 20px;
  background-color: rgba(22, 22, 22, 0.7);
  box-shadow: 0 0 10px #000;
  border-radius: 5px;
}
.tooltip-title {
  width: 100%;
  height: 40px;

  display: flex;
  justify-content: space-between;

  font-weight: bold;
  line-height: 40px;
  font-size: 14px;
  color: #fff;

  border-bottom: 1px dashed #999;
}
.tooltip-content {
  width: 100%;
  height: 124px;
  padding: 10px 0;
  /* margin-bottom: 10px; */

  overflow-y: auto;

  /* border-bottom: 1px dashed #999; */
}
.level-item {
  width: 100%;
  height: 24px;

  display: flex;

  line-height: 24px;
  font-size: 14px;
  color: #fff;
}
.level-item-count,
.alert-count {
  flex: 1;
}
.tooltip-operate-user {
  padding: 10px 0;
}
.user-info {
  display: flex;
  flex-wrap: wrap;
}
.user-item {
  width: 50%;
  height: 24px;
  line-height: 24px;
  font-size: 14px;
  color: #fff;
}
.user-email {
  width: 100%;
}
</style>
