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
          >
            <el-form-item label="级别：">
              <el-input
                v-model="alarmForm.level"
                :disabled="true"
                style="width: 280px"
              />
            </el-form-item>
            <el-form-item label="对象：">
              <el-input
                v-model="alarmForm.object"
                :disabled="true"
                style="width: 280px"
              />
            </el-form-item>
            <el-form-item label="时间：">
              <el-input
                v-model="alarmForm.date"
                :disabled="true"
                style="width: 280px"
              />
            </el-form-item>
            <el-form-item label="详情：">
              <el-input
                v-model="alarmForm.detail"
                :disabled="true"
                type="textarea"
                autosize
                style="width: 280px"
              />
            </el-form-item>
            <el-form-item label="状态：">
              <el-select
                v-model="alarmForm.status"
                @change="confirm"
                style="width: 280px"
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
          <span class="upgrade">
            test规则等告警分类在过去2分钟内累计告警5次，即升级为S1
          </span>
          <!-- <span>
            {{
              `${scope.row.categoryName}等告警分类在过去${scope.row.period}分钟内${scope.row.type}告警${scope.row.count}次，即升级为${scope.row.level}`
            }}
          </span> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/api'
export default {
  data: () => ({
    alarmForm: {
      level: '',
      object: '',
      date: '',
      detail: '',
      status: ''
    },
    blockSwitch: { '1': true, '2': false, '3': false, '4': false },
    tableData: [],
    alarmInfoList: []
  }),
  created() {
    this.getNoticeDetail()
  },
  methods: {
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
            alarmInfoList
          } = alarmDetail
          this.alarmForm.level = level
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
    switchBlock(index) {
      // eslint-disable-next-line no-return-assign
      return this.blockSwitch[index] = !this.blockSwitch[index]
    },
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
  .wrapper_pannel {
    width: 100%;
    background-color: rgba(4, 28, 37, 0.3);
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
          height: 24px;
          line-height: 24px;
          font-size: 16px;
          font-weight: 500;
          color: #fff;
          &:before {
            content: '';
            position: absolute;
            z-index: 1;
            left: -18px;
            top: -3px;
            width: 8px;
            border-radius: 4px;
            height: 30px;
            background: #0066ff;
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
            height: 30px;
            line-height: 30px;
            padding-bottom: 5px;
            border-bottom: 1px solid #041c25;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            color: #fff;
            span {
              display: inline-block;
              width: 96px;
              margin: 3px 20px 0 3px;
              box-shadow: 0px 0px 7px 0px rgba(255, 255, 255, 0.9);
              color: #0066ff;
              background: #041c25;
              border-radius: 5px;
              text-align: center;
            }
          }
        }
      }
    }
  }
}
</style>
