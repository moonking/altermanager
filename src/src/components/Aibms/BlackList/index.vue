<template>
  <div class="black-list">
    <el-form :model="form" label-width="80px" ref="form" :rules="formRules">
      <el-form-item label="业务系统" required prop="system">
        <el-select
          v-model="form.system"
          placeholder="请选择业务系统"
          @change="handleSelectChange"
          style="width: 380px"
        >
          <el-option
            :label="system.name"
            :value="system.systemId"
            v-for="system in systemList"
            :key="system.systemId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="黑名单">
        <div class="cilist-container">
          <span v-for="item in checkedCIs" :key="item" class="ci-item"
            >{{ item }}
            <i
              class="el-icon-delete"
              v-if="editStatus"
              @click="deleteCheckedCI(item)"
              style="cursor: pointer"
            ></i>
          </span>
          <div
            v-if="checkedCIs.length === 0"
            style="
              width: 200px;
              height: 40px;
              line-height: 40px;
              text-align: center;
              font-size: 14px;
            "
          >
            黑名单为空
          </div>
        </div>
      </el-form-item>
      <el-form-item label="选择类型" prop="type" v-if="editStatus">
        <el-select
          clearable
          v-model="form.type"
          style="width: 380px"
          placeholder="请选择标签"
          @change="handleTypeChange"
        >
          <el-option
            v-for="item in ciTypeList"
            :key="item.citypeId"
            :label="item.name"
            :value="item.citypeId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="选择CI项" prop="checkedCIs" v-if="editStatus">
        <el-select
          v-model="form.checkedCIs"
          filterable
          multiple
          collapse-tags
          placeholder="请选择"
          @change="checkCIChange"
          style="width: 380px"
        >
          <el-option
            v-for="item in ciList"
            :key="item.ciitemId"
            :label="item.name"
            :value="item.name"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="结果">
        <div class="choose-result"></div>
      </el-form-item> -->
      <el-form-item v-if="editStatus">
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button @click="cancelEdit" class="cancle-button">取消</el-button>
      </el-form-item>
      <el-form-item v-else>
        <el-button type="primary" @click="setEditStatus">编辑</el-button>
      </el-form-item>
    </el-form>
    <!-- <el-tabs v-model="activeTab" @click="handleTypeChange">
      <el-tab-pane :label="item.name" :name="'tab' + index" v-for="(item, index) in ciTypeList" :key="item.citypeId">
        <el-form>
          <el-form-item>
            <el-checkbox v-model="checked">备选项</el-checkbox>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs> -->
  </div>
</template>

<script>
import axios from '@/api'
export default {
  data() {
    return {
      checkedCIs: [],
      isIndeterminate: true,
      checkAll: false,
      form: {
        system: '',
        type: '',
        checkedCIs: []
      },
      activeTab: '',
      ciTypeList: [],
      ciList: [],
      formRules: {
        system: [{ required: true, message: '请选择业务系统', trigger: 'change' }]
        // type: [{required: true, message: '请选择类型', trigger: 'change'}],
        // checkedCIs: [{required: true, message: '请选择CI项', trigger: 'blur'}]
      },
      labelList: [
        { label: '交易类型', value: '1' },
        { label: '应用', value: '2' },
        { label: '服务', value: '3' },
        { label: '进程', value: '4' },
        { label: '主机', value: '5' }
      ],
      systemList: [],
      editStatus: false
    }
  },
  methods: {
    // 删除选中的ci
    deleteCheckedCI(ci) {
      const { checkedCIs } = this
      checkedCIs.forEach((item, index) => {
        if (ci === item) {
          this.checkedCIs.splice(index, 1)
        }
      })
    },
    // 添加选中项
    checkCIChange() {
      const checks = this.form.checkedCIs
      checks.forEach(item => {
        if (this.checkedCIs.indexOf(item) === -1) {
          console.log(true)
          this.checkedCIs.push(item)
        }
      })
    },
    // 获取CI项黑名单列表
    handleTypeChange() {
      const chooseType = this.form.type
      // const chooseType = this.activeTab
      console.log('test')
      axios.getCIBlackList(chooseType).then(res => {
        if (res.data.code === 200) {
          this.ciList = res.data.data
        }
      })
    },
    // 选择业务系统
    handleSelectChange(val) {
      this.form.type = ''
      this.form.checkedCIs = []
      this.getSystemBlackList(val)
    },
    // 关闭dialog
    cancelEdit() {
      this.editStatus = false
    },
    // 打开编辑dialog
    setEditStatus() {
      this.editStatus = true
    },
    // 业务系统详情
    getSystemBlackList(systemId) {
      const id = systemId || this.form.system
      axios.getSystemDetail(id).then(res => {
        const { code, data } = res.data
        if (code === 200 && data.result.blackList !== '') {
          this.checkedCIs = data.result.blackList.split(',')
        } else {
          this.checkedCIs = []
        }
      })
    },
    // 获取业务系统列表
    getSystemList() {
      // {"name":"系统名称","englishAbridge":"英文缩写","current":"当前页","size":"每页显示条数"}
      const data = {
        name: '',
        englishAbridge: '',
        current: 1,
        size: 100000
      }
      axios.getSystemList(data).then(res => {
        console.log(res)
        if (res.data.code === 200) {
          const systems = res.data.data.result.records
          this.systemList = systems
          // if (systems && systems.length > 0) {
          //   this.form.system = systems[0]
          // }
        }
      })
    },
    // 新增修改黑名单
    onSubmit() {
      const form = this.$refs.form
      form.validate().then(res => {
        if (res) {
          const blackList = this.checkedCIs.join(',')
          const data = {
            systemId: this.form.system,
            blackList
          }
          axios.updateBlackList(data).then(res => {
            if (res.data.code) {
              this.$notify({
                title: '提示',
                message: res.data.message,
                type: 'success'
              })
              this.editStatus = false
              this.form.type = ''
              this.form.checkedCIs = []
            }
          })
        }
      })
    },
    // 获取ci类型列表
    getCITypeList() {
      axios.getCiTList({
        name: '',
        templateId: '',
        cigroupId: ''
      }).then(res => {
        if (res.data.code === 200) {
          this.ciTypeList = res.data.data.result
          this.activeTab = this.ciTypeList[0].citypeId
        }
      })
    }
  },
  created() {
    this.getSystemList()
    this.getCITypeList()
  }
}
</script>

<style lang="scss" scoped>
.black-list {
  padding: 20px;
}
.choose-result {
  width: 600px;
  height: 200px;
  background-color: #041c2566;
}
.cilist-container {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  width: 900px;
  max-height: 300px;
  font-size: 12px;
  color: #ddd;
  overflow-y: auto;
}
.ci-item {
  height: 20px;
  line-height: 20px;
  display: block;
  margin-right: 6px;
  margin-bottom: 6px;
  border-radius: 2px;
  padding: 0 6px;
  background-color: #041c2566;
}
.ci-item:hover {
  background-color: #041c25e0;
  cursor: default;
}
.cancle-button {
  border: 1px solid #fff;
  color: #fff;
  &:hover {
    border: 1px solid #fff;
    color: #fff;
    background: transparent;
  }
  &:focus {
    color: #fff;
    background: transparent;
  }
  &:active {
    border: 1px solid #fff;
    background: transparent;
    color: #fff;
  }
}
</style>
