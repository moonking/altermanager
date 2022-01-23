<template>
  <div class="temp">
    <div class="wrapper_pannel">
      <!-- 告警信息 -->
      <div class="block-item">
        <div class="item-block-title" @click="switchBlock(1)">
          <span class="item-block-title-font">告警信息</span>
          <i
            class="icons el-icon-arrow-right"
            :style="{
              transform: blockSwitch[1] ? 'rotate(90deg)' : 'rotate(0)',
            }"
          />
        </div>
        <div
          class="block-content"
          v-show="blockSwitch[1]"
          style="overflow: visible"
        >
          <el-form
            :model="alarmForm"
            label-width="100px"
            ref="alarmform"
            label-position="right"
            style="width: 700px"
          >
            <el-form-item label="级别：">
              <el-input
                v-model="alarmForm.level"
                :disabled="true"
              />
            </el-form-item>
            <el-form-item label="对象：">
              <el-input
                v-model="alarmForm.object"
                :disabled="true"
              />
            </el-form-item>
            <el-form-item label="时间：">
              <el-input
                v-model="alarmForm.date"
                :disabled="true"
              />
            </el-form-item>
            <el-form-item label="详情：">
              <el-input
                v-model="alarmForm.detail"
                :disabled="true"
                type="textarea"
                autosize
              />
            </el-form-item>
            <el-form-item label="状态：">
              <el-select
                v-model="alarmForm.status"
                @change="confirm"
                placeholder="请确认您已接收告警"
                :disabled="alarmForm.status == '1'"
              >
                <el-option label="已收到" value="1" />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="block-item">
        <div class="item-block-title" @click="switchBlock(2)">
          <span class="item-block-title-font">通知信息</span>
          <i
            class="icons el-icon-arrow-right"
            :style="{
              transform: blockSwitch[2] ? 'rotate(90deg)' : 'rotate(0)',
            }"
          />
        </div>
        <div
          class="block-content notice-table"
          v-show="blockSwitch[2]"
          style="overflow: visible"
        >
          <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column prop="name" label="通知人" />
            <el-table-column prop="type" label="通知方式" />
            <el-table-column prop="status" label="通知状态" />
          </el-table>
        </div>
      </div>
      <div class="block-item">
        <div class="item-block-title" @click="switchBlock(3)">
          <span class="item-block-title-font">去重记录</span>
          <i
            class="icons el-icon-arrow-right"
            :style="{
              transform: blockSwitch[3] ? 'rotate(90deg)' : 'rotate(0)',
            }"
          />
        </div>
        <div
          class="block-content"
          v-show="blockSwitch[3]"
          style="overflow: visible"
        >
          <ul>
            <li v-for="item in alarmInfoList" :key="item.id">
              <p class="new-set-text">
                <span>{{ item.platform }}</span>
                {{ item.address }}
                {{ item.startTime }}
                {{ item.desc }}
              </p>
            </li>
          </ul>
        </div>
      </div>
      <div class="block-item">
        <div class="item-block-title" @click="switchBlock(4)">
          <span class="item-block-title-font">升级规则</span>
          <i
            class="icons el-icon-arrow-right"
            :style="{
              transform: blockSwitch[4] ? 'rotate(90deg)' : 'rotate(0)',
            }"
          />
        </div>
        <div
          class="block-content"
          v-show="blockSwitch[4]"
          style="overflow: visible"
        >
          <span class="upgrade" v-if="alertUpgradeRepDTO">
            {{
              `${alertUpgradeRepDTO.categoryName}等告警分类在过去${alertUpgradeRepDTO.period}分钟内${alertUpgradeRepDTO.type}告警${alertUpgradeRepDTO.count}次，即升级为${UpgradeLevel}`
            }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/api'
const levelMap = {
  '1': 'critical',
  '2': 'warning',
  '3': 'information'
}
export default {
  data: () => ({
    alarmForm: {
      level: '',
      object: '',
      date: '',
      detail: '',
      status: ''
    },
    alertUpgradeRepDTO: '',
    blockSwitch: { '1': true, '2': false, '3': false, '4': false },
    tableData: [],
    alarmInfoList: []
  }),
  created() {
    this.getNoticeDetail()
  },
  computed: {
    UpgradeLevel() {
      var Level
      switch (this.alertUpgradeRepDTO.level) {
        case '1':
          Level = 'critical'
          break;
        case '2':
          Level = 'error'
          break;
        case '3':
          Level = 'warning'
          break;
        default:
          break;
      }

      return Level
    }
  },
  methods: {
    LevelFilter: level => levelMap[level],
    // 查询告警通知详情
    getNoticeDetail() {
      axios.getNoticeDetail(this.$route.query.id).then(res => {
        if (res.data.success) {
          const alarmDetail = res.data.data
          const {
            level,
            alarmAddress,
            startTime,
            description,
            userList,
            status,
            alarmInfoList,
            oldLevel,
            alertUpgradeRepDTO
          } = alarmDetail
          this.alertUpgradeRepDTO = alertUpgradeRepDTO
          this.alarmForm.level = oldLevel ? `${this.LevelFilter(level)} → ${this.LevelFilter(oldLevel)}` : this.LevelFilter(level)
          this.alarmForm.object = alarmAddress
          this.alarmForm.date = startTime
          this.alarmForm.status = status == '0' ? '' : status
          this.alarmForm.detail = description
          this.tableData = userList || []
          this.alarmInfoList = alarmInfoList
        } else {
          this.$notify({
            title: '提示',
            type: 'error',
            message: res.data.message
          })
        }
      })
    },
    // 是否展开
    switchBlock(index) {
      // eslint-disable-next-line no-return-assign
      return this.blockSwitch[index] = !this.blockSwitch[index]
    },
    // 修改告警通知
    confirm() {
      if (this.alarmForm.status == '1') {
        const params = {
          id: this.$route.query.id,
          status: '1'
        };
        axios.editNoticeStatus(params).then(res => {
          if (res.data.success) {
            this.$notify.success({
              title: '提示',
              message: '修改成功'
            });
          } else {
            this.$notify.error({
              title: '提示',
              message: '修改失败'
            });
          }
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.temp {
  margin: 10px;
  .wrapper_pannel {
    width: 100%;
    // background-color: rgba(4, 28, 37, 0.3);
    padding: 10px 0 60px;
    overflow: visible;
    .block-item {
      margin-bottom: 20px;
      .item-block-title {
        margin-bottom: 20px;
        cursor: pointer;
        .item-block-title-font {
          position: relative;
          margin-left: 18px;
          height: 40px;
          line-height: 40px;
          font-size: 28px;
          font-weight: 500;
          color: #fff;
          &:before {
            content: '';
            position: absolute;
            z-index: 1;
            left: -30px;
            top: 10px;
            width: 18px;
            border-radius: 9px;
            height: 18px;
            background: #00E5FF;
          }
        }
      }
      .notice-table {
        width: 80%;
      }
      .block-content {
        padding-left: 20px;
        overflow: hidden;
        .upgrade {
          color: #fff;
        }
        li {
          margin-bottom: 5px;
          padding-right: 20px;
          .new-set-text {
            height: 60px;
            line-height: 40px;
            padding-bottom: 5px;
            // border-bottom: 1px solid #041c25;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            color: #BFF3FF;
            font-size: 20px;
            span {
              display: inline-block;
              width: 96px;
              height: 40px;
              margin: 3px 20px 0 3px;
              // box-shadow: 0px 0px 7px 0px rgba(255, 255, 255, 0.9);
              color: #00E5FF;
              background: #041c25;
              border-radius: 5px;
              text-align: center;
              border:1px solid #436382;
            }
          }
        }
      }
    }
  }
}
</style>
