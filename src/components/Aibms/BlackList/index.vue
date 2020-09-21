<template>
  <div class="black-list">
    <el-form :model="form" label-width="80px" ref="form" :rules="formRules">
      <el-form-item label="业务系统" style="width: 240px;" required prop="system">
        <el-select v-model="form.system" placeholder="请选择业务系统" @change="handleSelectChange">
          <el-option :label="system.name" :value="system.systemId" v-for="system in systemList" :key="system.systemId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="黑名单" style="width: 640px;">
        <el-input
          :disabled="!editStatus"
          type="textarea"
          :rows="6"
          v-model="form.blackList"
          placeholder="输入ci项名称，换行分割ci项"></el-input>
      </el-form-item>
      <el-form-item v-if="editStatus">
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button @click="cancelEdit">取消</el-button>
      </el-form-item>
      <el-form-item v-else>
        <el-button type="primary" @click="setEditStatus">编辑</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from '@/api'
export default {
  data () {
    return {
      form: {
        system: '',
        blackList: ''
      },
      formRules: {
        system: [{required: true, message: '请选择业务系统', trigger: 'change'}]
      },
      systemList: [],
      editStatus: false
    }
  },
  methods: {
    handleSelectChange (val) {
      this.getSystemBlackList(val)
    },
    cancelEdit () {
      this.editStatus = false
    },
    setEditStatus () {
      this.editStatus = true
    },
    getSystemBlackList (systemId) {
      const id = systemId || this.form.system
      axios.getSystemDetail(id).then(res => {
        if (res.data.code === 200) {
          this.form.blackList = res.data.data.result.blackList
        }
      })
    },
    getSystemList () {
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
    onSubmit () {
      const form = this.$refs.form
      form.validate().then(res => {
        if (res) {
          const data = {
            systemId: this.form.system,
            blackList: this.form.blackList
          }
          axios.updateBlackList(data).then(res => {
            if (res.data.code) {
              this.$notify({
                title: '提示',
                message: res.data.message,
                type: 'success'
              })
              this.editStatus = false
            }
          })
        }
      })
    }
  },
  created () {
    this.getSystemList()
  }
}
</script>

<style>
.black-list {
  padding: 20px;
}
</style>
