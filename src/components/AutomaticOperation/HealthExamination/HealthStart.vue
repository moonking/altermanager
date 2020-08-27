<template>
  <div class="layout">
    <div class="panel">
      <div class="item" v-for="(item,index) in osInfo" :key="index">
        <div v-if="item.isTrueStandard && (item.resourcesType == 1)" class="main aibms-color-bg">
          <div class="section" @click="goDetail(item.resourcesType)" style="cursor: pointer">
            <img :src="item.icon" alt />
            <p>{{ item.resourcesType | getName }}</p>
          </div>
          <div class="section">
            <div class="btn-box">
              <span class="let-check" @click="_checkImmediately(item.resourcesType)">立即检查</span>
              <el-switch
                size="large"
                :disabled="isCheck"
                @change="_healthyIsUp(item.resourcesType,item.timingStatus,index)"
                v-model="item.timingStatus"
              ></el-switch>
            </div>
            <el-form size="mini" ref="form" label-width="120px" class="white-color">
              <el-form-item label="报告总数：">{{item | getTotal}}</el-form-item>
              <el-form-item label="检查时间：">{{ item.testTime }}</el-form-item>
              <el-form-item label="健康个数：">{{ item.successCount }}</el-form-item>
              <el-form-item label="不健康个数：">{{ item.failcount }}</el-form-item>
            </el-form>
          </div>
          <div class="section">
            <el-progress :stroke-width="10" type="circle" :percentage="item.present"></el-progress>
            <p>{{ item.resourcesType | getName }}</p>
          </div>
        </div>
        <!-- <div v-else class="main special">
          <div class="section">
            <p style="text-align: left">{{ item.resourcesType | getName }}</p>
          </div>
          <div class="section">
            <img src="../../../../static/img/icon_none.png" alt />
            <p>
              当前资源类型未进行配置，
              <span @click="goConfig(item.resourcesType)">去配置</span>
            </p>
          </div>
        </div>-->
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/api';
export default {
  name: 'HealthStart.vue',
  data () {
    return {
      loading: false,
      osInfo: [],
      form: {},
      isCheck: false
    }
  },
  filters: {
    getName (value) {
      switch (value) {
        case value == 1:
          return 'OS'
        case value == 2:
          return '中间件'
        case value == 3:
          return '数据库'
        case value == 4:
          return '网络设备'
      }
    },
    getIcon (value) {
      switch (value) {
        case value == 1:
          return '../../../../static/img/icon_os.png'
        case value == 2:
          return '../../../../static/img/icon_bigDatd.png'
        case value == 3:
          return '../../../../static/img/icon_center.png'
        case value == 4:
          return '../../../../static/img/icon_net.png'
      }
    },
    getTotal (value) {
      return parseInt(value.successCount) + parseInt(value.failcount)
    }
  },
  mounted () {
    this._healthySourceTotal()
  },
  methods: {
    //  是否开启健康检查
    _healthyIsUp (resourcesType, isTrueFalse, index) {
      isTrueFalse = isTrueFalse ? 0 : 1
      let params = {
        resourcesType: resourcesType,
        isTrueFalse: isTrueFalse
      }
      axios.healthyIsUp(params).then(result => {
        if (result.data.code === 200) {
          this.$notify({
            title: '提示',
            message: result.data.message,
            duration: 2000,
            type: 'success'
          })
        } else {
          this.$set(
            this.osInfo[index],
            isTrueFalse,
            !this.osInfo[index].isTrueFalse
          )
          this.$notify({
            title: '提示',
            message: result.data.message,
            duration: 2000,
            type: 'error'
          })
        }
      })
    },
    //  立即检查
    _checkImmediately (resourcesType) {
      axios.checkImmediately(resourcesType).then(result => {
        if (result.data.code === 200) {
          this.openFullScreen()
        } else {
          this.$notify({
            title: '提示',
            message: '检查出错，请稍后重试！',
            duration: 2000,
            type: 'error'
          })
        }
      })
    },
    //  健康统计
    _healthySourceTotal () {
      axios.healthySourceTotal().then(result => {
        if (result.data.code === 200) {
          this.osInfo = result.data.data
          // let parseInt = 0
          this.osInfo.forEach((item, index) => {
            item.isTrueStandard = parseInt(item.isTrueStandard) || 0
            if (item.successCount || item.failcount) {
              let present = ((parseInt(item.successCount) / (parseInt(item.successCount) + parseInt(item.failcount))) * 100).toFixed(2)
              if (parseInt(item.successCount) + parseInt(item.failcount) <= 0) {
                this.$set(this.osInfo[index], 'present', 0)
              } else {
                this.$set(this.osInfo[index], 'present', parseFloat(present))
              }
            }

            if (item.timingStatus == 0) {
              item.timingStatus = true
            } else if (item.timingStatus == 1) {
              item.timingStatus = false
            }
            if (item.resourcesType == 1) {
              this.$set(
                this.osInfo[index],
                'icon',
                '../../../../static/img/icon_os.png'
              )
            } else if (item.resourcesType == 2) {
              this.$set(
                this.osInfo[index],
                'icon',
                '../../../../static/img/icon_os.png'
                // '../../../../static/img/icon_bigDatd.png'
              )
            } else if (item.resourcesType == 3) {
              this.$set(
                this.osInfo[index],
                'icon',
                '../../../../static/img/icon_center.png'
              )
            } else if (item.resourcesType == 4) {
              this.$set(
                this.osInfo[index],
                'icon',
                '../../../../static/img/icon_net.png'
              )
            }
          })
        } else {
          this.$notify({
            title: '提示',
            message: '查询出错，请稍后重试！',
            duration: 2000,
            type: 'error'
          })
        }
      })
    },
    openFullScreen () {
      const loading = this.$loading({
        lock: true,
        text: '拼命检查中，1分钟后可查看报告',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      setTimeout(() => {
        loading.close()
        this._healthySourceTotal()
      }, 5000)
    },
    //  点击配置
    goConfig (value) {
      this.$router.push({
        path: '/AutomaticOperation/healthConfig',
        query: {
          code: 4,
          type: value
        }
      })
    },
    //  查看检查详情
    goDetail (value) {
      this.$router.push({
        path: '/AutomaticOperation/healthResult',
        query: {
          code: 4,
          type: value
        }
      })
    }
  }
}
</script>

<style scoped lang="stylus">
.let-check {
  border: 1px solid #1e90ff;
  color: #1e90ff;
  display: inline-block;
  padding: 0 5px;
  line-height: 20px;
  font-size: 10px;
  border-radius: 20px;
  margin-right: 5px;
  margin-left: 2em;
  cursor: pointer;
}

.layout {
  color: rgba(119, 119, 119, 1);

  .panel {
    display: flex;
    flex-wrap: wrap;

    .item {
      width: 45%;
      box-sizing: border-box;
      padding: 10px;

      .main {
        background: #fff;
        box-shadow: 0 0 4px #ccc;
        display: flex;
        padding: 20px;
        border-radius: 5px;
        min-height: 255px;

        .section {
          padding: 0 10px;

          .btn {
            margin-right: 10px;
          }

          .btn-box {
            padding-bottom: 30px;
          }
        }

        .section:nth-child(1) {
          font-size: 14px;

          img {
            width: 60px;
          }

          p {
            padding-top: 10px;
            text-align: center;
          }
        }

        .section:nth-child(2) {
          flex: 1;
        }

        .section:nth-child(3) {
          text-align: center;
          padding-top: 80px;

          p {
            color: #ABABAB;
            padding-top: 10px;
          }
        }
      }

      .main.special {
        display: block;
        text-align: left;

        .section:nth-of-type(1) {
          text-align: left;
        }

        .section:nth-of-type(2) {
          text-align: center;

          p {
            line-height: 30px;

            span {
              color: #1e90ff;
              cursor: pointer;
            }
          }

          img {
            width: 150px;
          }
        }
      }
    }
  }
}
</style>
