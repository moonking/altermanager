<template>
  <div class="license-info aibms-license">
    <div class="wrapper">
      <div class="company-name">{{licenseInfo.company}}</div>
      <div class="counts-block clear-fix">
        <div class="user-count count-item clear-fix">
          <div class="count-icon">
            <p>
              <i class="el-icon-user"></i>
            </p>
            <p>用户数量</p>
          </div>
          <div class="v-line"></div>
          <div class="count-text">
            <span>{{licenseInfo.allowPersonNum || ''}}</span>/人
          </div>
        </div>
        <div class="module-count count-item clear-fix">
          <div class="count-icon">
            <p>
              <i class="el-icon-set-up"></i>
            </p>
            <p>模块数量</p>
          </div>
          <div class="v-line"></div>
          <div class="count-text">
            <span>{{getModules.length}}</span>/个
          </div>
        </div>
      </div>
      <div class="detail-info">
        <ul>
          <li>
            <span class="lable">申请码</span>
            <span class="info">{{licenseInfo.macAddress}}</span>
          </li>
          <li>
            <span class="lable">申请时间</span>
            <span class="info">{{licenseInfo.createDate}}</span>
          </li>
          <li>
            <span class="lable">联系人</span>
            <span class="info">{{licenseInfo.linkman}}</span>
          </li>
          <li>
            <span class="lable">手机号</span>
            <span class="info">{{licenseInfo.mobile}}</span>
          </li>
          <li>
            <span class="lable">运维时间</span>
            <span class="info">{{licenseInfo.opeStartDate}} 至 {{licenseInfo.opeEndDate}}</span>
          </li>
          <li>
            <span class="lable">到期时间</span>
            <span class="info">{{getDeadline}}</span>
          </li>
          <li v-if="getModules.indexOf('delivery') !== -1">
            <span class="lable">并发发布计划数</span>
            <span class="info">{{licenseInfo.publishPlanNum}}</span>
          </li>
          <li v-if="getModules.indexOf('cmdb') !== -1">
            <span class="lable">业务系统数量</span>
            <span class="info">{{licenseInfo.systemNum}}</span>
          </li>
          <li>
            <span class="lable">支持模块</span>
            <span class="info">
              <el-tag
                v-for="(item, index) in getModules"
                :key="index"
                :style="{marginRight: '10px'}"
              >{{systemMapping[item]}}</el-tag>
            </span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import axios from '@/api';
export default {
  created () {
    // 获取License详情
    axios.getLicenseDetail()
      .then(res => {
        if (res.data.success) {
          this.licenseInfo = res.data.data.checkModel
          this.licenseInfo.notAfter = res.data.data.notAfter
        }
      })
  },
  data () {
    return {
      licenseInfo: {},
      systemMapping: {
        'bms': '基础管理',
        'cmdb': '资源配置管理',
        'delivery': '持续交付',
        'devops': 'devops'
      }
    }
  },
  computed: {
    getDeadline () {
      if (this.licenseInfo.foreverState === '1') {
        return '永久'
      }
      return this.licenseInfo.notAfter || ''
    },
    getModules () {
      let result = this.licenseInfo.allowModel
      return result ? result.split(',') : []
    }
  }
}
</script>
<style scoped lang="scss">
.license-info {
  margin: 10px;
  .wrapper {
    width: 100%;
    background-color: rgba(4, 28, 37, 0.3);
    border-radius: 3px;
    padding: 20px;
    box-sizing: border-box;
    .company-name {
      font-size: 28px;
      color: #fff;
      margin-bottom: 20px;
      border: 2px solid #c4dae2;
      padding-left: 20px;
      line-height: 80px;
      border-radius: 3px;
    }
    .counts-block {
      margin-bottom: 30px;
      .count-icon,
      .count-text {
        float: left;
        height: 100%;
      }
      .count-icon {
        width: 110px;
        height: 100%;
        font-size: 14px;
        text-align: center;
        color: #fff;
        p:first-child {
          height: 64px;
          line-height: 64px;
          padding-top: 14px;
          box-sizing: border-box;
        }
        p:nth-child(2) {
          height: 36px;
          line-height: 36px;
        }
        i {
          font-size: 48px;
          color: #fff;
        }
      }
      .count-text {
        width: 150px;
        text-align: center;
        color: #fff;
        font-size: 14px;
        span {
          line-height: 100px;
          font-size: 48px;
          color: #fff;
        }
      }
      .count-item {
        width: 300px;
        height: 100px;
        box-shadow: 0 0 20px #eee;
        border-radius: 5px;
        float: left;
      }
      .user-count {
        margin-right: 20px;
      }
      .v-line {
        margin-right: 24px;
        float: left;
        height: 60px;
        margin-top: 20px;
        border-left: 2px solid #eee;
      }
    }
    .detail-info {
      padding-left: 20px;
      .lable,
      .info {
        display: inline-block;
        height: 60px;
        line-height: 60px;
        color: #fff;
      }
      .lable {
        width: 160px;
        font-weight: bold;
      }
    }
  }
}
</style>
