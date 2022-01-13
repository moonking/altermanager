<template>
  <div class="select-content">
    <el-form ref="classFrom" :model="classFrom" :rules="rules" label-width="100px">
      <el-form-item label="选择标签：" prop="checkedLabelList">
        <el-checkbox-group v-model="classFrom.checkedLabelList" @change="getNewLabelList">
          <el-checkbox
          v-for="item in labelList"
          :key="item.value"
          :label="item.value"
          :disabled="readOnly"
          border
          >
          {{ item.label }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="选择分类："
        v-model="classFrom.checkedCategoryList"
        v-if="classFrom.checkedLabelList.length"
        prop="classList"
        >
        <el-checkbox
          :indeterminate="isIndeterminate"
          v-model="checkAll"
          :disabled="readOnly"
          @change="handleCheckAllChange"
        >全选</el-checkbox>
        <div style="margin: 15px 0;" />
        <el-checkbox-group v-model="checkedCategory" @change="handleCheckedCategoryChange">
          <el-checkbox
            v-for="item in categoryList"
            :label="item.iD"
            :disabled="readOnly"
            :key="item.iD"
          >
            {{ item.name }}
          </el-checkbox>
        </el-checkbox-group>
        <!-- 分页 -->
        <el-pagination
          v-if="totalSize"
          :current-page.sync="page.current"
          :page-size.sync="page.size"
          layout="total, prev, pager, next, jumper"
          :total="totalSize"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          style="margin:92px 100px 92px 0;text-align: center"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from '@/api'
export default {
  props: {
    checkedLabels: {
      type: Array
    },
    sortList: {
      type: Array
    },
    readOnly: {
      required: true,
      default: false,
      type: Boolean
    }
  },
  watch: {
    checkedLabels (val, oldVal) {
      if (val.length) {
        if (this.$route.query.id) {
          this.classFrom.checkedLabelList = val
          this.getAlarmList()
        }
      }
    },
    sortList (val, oldVal) {
      if (val.length) {
        if (this.$route.query.id) {
          this.checkedCategory = val.map(item => Number(item.iD))
          this.classCheckStatus(this.checkedCategory)
        }
      }
    }
  },
  data: () => ({
    labelList: [
      { value: 1, label: '交易类型' },
      { value: 2, label: '应用' },
      { value: 3, label: '服务' },
      { value: 4, label: '进程' },
      { value: 5, label: '主机' }
    ],
    checkAll: false,
    checkedCategory: [],
    categoryList: [],
    isIndeterminate: true,
    classFrom: {
      checkedLabelList: [],
      checkedCategoryList: []
    },
    page: {
      current: 1,
      size: 20
    },
    totalSize: 0,
    rules: {
      checkedLabelList: [
        { type: 'array', required: true, message: '请至少选择一种标签', trigger: 'change' }
      ]
    },
    checkedClass: ''
  }),
  created () {
    // this.getlabelList()
  },
  methods: {
    // getlabelList () {
    //   axios.getlabelList().then(res => {
    //     if (res.data.success) {
    //       this.labelList = res.data.data
    //     } else {
    //       this.$notify.error({
    //         title: '提示',
    //         message: res.data.message
    //       })
    //     }
    //   })
    // },
    // 获取告警分类列表
    getAlarmList () {
      const params = {
        name: '',
        sources: '',
        current: this.page.current,
        label: this.classFrom.checkedLabelList,
        size: this.page.size
      }
      axios.getAlarmList(params).then(res => {
        if (res.data.success) {
          this.categoryList = res.data.data.records
          this.totalSize = Number(res.data.data.total)
          const categoryTemp = this.categoryList.map(val => val.iD)
          const temp = []
          this.checkedCategory.forEach(item => {
            if (categoryTemp.indexOf(item) !== -1) {
              temp.push(item)
            }
          })
          this.checkedCategory = temp
          if (this.checkedCategory.length) {
            this.classCheckStatus(this.checkedCategory)
          }
        } else {
          this.$notify({
            title: '提示',
            type: 'error',
            message: res.message
          })
        }
      })
    },
    // 获取告警分类列表
    getNewLabelList () {
      this.getAlarmList()
    },
    // 分页
    handleCurrentChange () {
      this.getAlarmList()
    },
    // 表格每页数量
    handleSizeChange () {
      this.page.current = 1
      this.getAlarmList()
    },
    // 全选
    handleCheckAllChange (val) {
      let copyType = val ? this.categoryList.map(val => val.iD) : []
      let delList = []
      let temporary = []
      if (copyType.length === 0) {
        delList = this.categoryList.map(val => val.iD)
        this.checkedCategory.forEach(item => {
          if (!delList.includes(item)) {
            temporary.push(item)
          }
        });
        // this.checkedCategory = temporary
      } else {
        copyType.forEach(item => {
          if (!this.checkedCategory.includes(item)) {
            this.checkedCategory.push(item)
          }
        });
      }
      this.classCheckStatus(this.checkedCategory)
    },
    // 单选
    handleCheckedCategoryChange (value) {
      this.classCheckStatus(this.checkedCategory)
    },
    // 分类勾选状态
    classCheckStatus (type) {
      let bl = true
      let num = 0
      let alarmOptionList = this.categoryList.map(val => val.iD)
      // 用于第三个组件显示id对应的类型
      const findId = this.categoryList.find(el => el.iD === type[0])
      if (findId != undefined) {
        this.checkedClass = findId.name
      }
      alarmOptionList.forEach(item => {
        if (!type.includes(item)) {
          bl = false
        } else {
          num++
        }
      });
      if (bl) {
        this.isIndeterminate = false
        this.checkAll = true
      } else {
        this.checkAll = false
        if (num < alarmOptionList.length && num > 0) {
          this.isIndeterminate = true
        } else if (num === 0) {
          this.isIndeterminate = false
        }
      }
    }
  }
}
</script>

<style scoped>
.select-content {
  margin: 50px 20px 20px;
}
</style>
