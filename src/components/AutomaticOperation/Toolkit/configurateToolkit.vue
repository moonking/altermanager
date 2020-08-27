<template>
  <div class="container configurate-toolkit non-shadow aibms-color-bg non-border">
    <div class="form-search white-color">
      <!-- <div class="block-title" @click="changeIconArrow(1)">
        <div class="title-tips"></div>
        <h3>
          基本信息
          <i
            class="icons el-icon-arrow-right"
            :style="{transform: blockCheck[1] ? 'rotate(90deg)':'rotate(0)'}"
          ></i>
        </h3>
      </div>-->
      <div class="item-block-title paddingTop" @click="changeIconArrow(1)">
        <div class="item-block-title-mark"></div>
        <span class="item-block-title-font">基本信息</span>
        <i
          class="icons el-icon-arrow-right"
          :style="{transform: blockCheck[1] ? 'rotate(90deg)' : 'rotate(0)'}"
        ></i>
      </div>
      <div class="info-title" :class="{clearHeight: !blockCheck[1]}">
        <label class="labtool">工具名称：</label>
        <el-input v-model="name" class="info-input" :disabled="true"></el-input>
      </div>
    </div>
    <div class="info-source">
      <!-- <div class="block-title" @click="changeIconArrow(2)">
        <div class="title-tips"></div>
        <h3>
          选择资源
          <i
            class="icons el-icon-arrow-right"
            :style="{transform: blockCheck[2] ? 'rotate(90deg)':'rotate(0)'}"
          ></i>
        </h3>
      </div>-->
      <div class="item-block-title paddingTop" @click="changeIconArrow(2)">
        <div class="item-block-title-mark"></div>
        <span class="item-block-title-font">基本信息</span>
        <i
          class="icons el-icon-arrow-right"
          :style="{transform: blockCheck[2] ? 'rotate(90deg)' : 'rotate(0)'}"
        ></i>
      </div>
      <div class="source-box" :class="{clearHeight: !blockCheck[2]}">
        <CheckNode :data="sourceData" :selectData.sync="selectData" :edit="status === 'set'" />
      </div>
    </div>
    <div class="save-btn" v-if="status === 'set'">
      <button class="deep" style="margin-right: 200px;" @click="confirm">确 定</button>
      <button class="isoutline nomal-button" @click="handleCancle">取 消</button>
    </div>
  </div>
</template>
<script>
import CheckNode from './CheckNode'
import axios from '@/api';
export default {
  name: 'configurateToolkit',
  data () {
    return {
      blockCheck: { '1': true, '2': true }, // 控制折叠
      sourceData: [
        {
          id: '1',
          env: 1,
          sourceName: '2005_tool',
          IPAddr: '10.130.101.223',
          result: 'success'
        }
      ],
      status: this.$route.params.status,
      currentId: this.$route.query.id,
      name: this.$route.query.name,
      selectData: [] // 选中数据存放
    }
  },
  components: {
    CheckNode
  },

  methods: {
    // 点击箭头的方法
    changeIconArrow (val) {
      this.blockCheck[val] = !this.blockCheck[val]
    },
    // 确认
    confirm () {
      let params = {
        toolsId: this.currentId,
        maResourseArray: this.selectData
      }
      axios.SaveToolkitConfig(params).then(res => {
        if (res.data.code === 200) {
          this.$notify({
            type: 'success',
            title: '提示',
            message: '保存成功'
          })
          this.$router.push({
            path: '/AutomaticOperation/Toolkit',
            query: {
              code: 4
            }
          })
        } else {
          this.$notify({
            type: 'error',
            title: '提示',
            message: res.data.message
          })
        }
      })
    },
    // 取消
    handleCancle () {
      this.$router.push({
        path: '/AutomaticOperation/Toolkit',
        query: {
          code: 4
        }
      })
    }
  }
}
</script>
<style scoped>
.configurate-toolkit {
  margin-left: 10px;
  padding: 0 !important;
}
.labtool {
  text-align: right;
  margin-left: -4px;
}
.info-title > label {
  width: 8%;
  display: inline-block;
}
.info-title > .info-input {
  width: 80%;
  display: inline-block;
}
.clearHeight {
  height: 0 !important;
  overflow: hidden;
  transition: height 0.3s;
}
.margin-bottom {
  margin-bottom: 20px;
}
.save-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 50px 0;
}
.pad {
  margin: 0 40px;
}
.block-title {
  position: relative;
  top: 0;
  left: 0;
  padding-left: 34px;
  cursor: pointer;
}
.block-title .title-tips {
  width: 8px;
  height: 100%;
  background-color: #0066ff;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 4px;
}
.icons {
  color: #0066ff;
  font-size: 20px;
  vertical-align: middle;
  margin-left: 4px;
}
.block-title > h3 {
  font-size: 16px;
  font-weight: normal;
  line-height: 32px;
}
</style>
