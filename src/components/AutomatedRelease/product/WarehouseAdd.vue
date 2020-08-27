<template>
  <div class="container refreshContainer aibms-color-bg non-border">
    <!-- <p
      class="mark-icon padding-title"
    >{{status === "read" ? "查看仓库" : status === 'create' ? "新增仓库" : "编辑仓库"}}</p>-->
    <div class="item-block-title paddingTop" @click="wareController = !wareController">
      <div class="item-block-title-mark"></div>
      <span
        class="item-block-title-font"
      >{{status === "read" ? "查看仓库" : status === 'create' ? "新增仓库" : "编辑仓库"}}</span>
      <i
        class="icons el-icon-arrow-right"
        :style="{transform: wareController ? 'rotate(90deg)' : 'rotate(0)'}"
      ></i>
    </div>
    <el-form
      :model="warehouse"
      :inline="true"
      :rules="rules"
      class="ml114 item-block-content"
      label-width="90px"
      ref="warehouse"
      :style="{height: wareController ? 'auto' : 0}"
    >
      <el-form-item class="warehouse-item" label="制品库" prop="productId">
        <el-select
          :disabled="status === 'read' || status === 'edit'"
          v-model="warehouse.productId"
          style="min-width:632px"
          placeholder="请选择制品库"
          @change="handleSelectedProductChange"
        >
          <el-option
            v-for="prod in productList"
            :label="prod.name"
            :value="prod.productId"
            :key="prod.productId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="warehouse-item" label="仓库名称" prop="name">
        <el-input
          :disabled="status === 'read' || status === 'edit'"
          maxlength="20"
          v-model="warehouse.name"
          placeholder="请输入仓库名称,只能输入字母数字和特殊字符_-$@"
          style="min-width:632px"
        ></el-input>
      </el-form-item>
      <el-form-item
        class="warehouse-item"
        label="备注名称"
        prop="remarksName"
        v-if="!(status === 'edit' && !warehouse.environmentId)"
      >
        <el-input
          :disabled="status === 'read' || status === 'edit'"
          maxlength="20"
          v-model="warehouse.remarksName"
          placeholder="请输入备注名称"
          style="min-width:632px"
        ></el-input>
      </el-form-item>
      <el-form-item
        class="warehouse-item"
        label="所属环境"
        prop="environmentId"
        v-if="!(status === 'edit' && !warehouse.environmentId)"
      >
        <el-select
          :disabled="status === 'read' || status === 'edit'"
          v-model="warehouse.environmentId"
          style="min-width:632px"
          placeholder="请选择所属环境"
        >
          <el-option
            v-for="env in envList"
            :label="env.name"
            :value="env.environmentId"
            :key="env.environmentId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="warehouse-item" label="仓库类型" prop="warehouseType">
        <el-select
          :disabled="status === 'read' || status === 'edit'"
          v-model="warehouse.warehouseType"
          style="min-width:632px"
          placeholder="请选择仓库类型"
        >
          <el-option
            v-for="type in warehouseTypes"
            :label="type.label"
            :value="type.value"
            :key="type.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="warehouse-item" label="存储类型" prop="storageType">
        <el-select
          :disabled="status === 'read' || status === 'edit'"
          v-model="warehouse.storageType"
          style="min-width:632px"
          placeholder="请选择存储类型"
          @change="handleStorageTypeChange"
        >
          <el-option
            v-for="saveType in saveTypes"
            :key="saveType.value"
            :label="saveType.label"
            :value="saveType.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        class="warehouse-item"
        label="端口号"
        prop="port"
        v-if="warehouse.storageType === 'docker'"
      >
        <el-input
          :disabled="status === 'read'"
          v-model="warehouse.port"
          style="min-width:632px"
          placeholder="请输入端口号"
          type="number"
        ></el-input>
      </el-form-item>
      <el-form-item
        class="warehouse-item"
        label="代理地址"
        prop="proxyUrl"
        v-if="warehouse.warehouseType === 'proxy'"
      >
        <el-input
          :disabled="status === 'read'"
          v-model="warehouse.proxyUrl"
          style="min-width:632px"
          placeholder="请输入代理地址url"
        ></el-input>
      </el-form-item>
      <el-form-item
        class="warehouse-item"
        label="策略"
        prop="strategy"
        v-if="warehouse.warehouseType === 'hosted' && warehouse.storageType === 'maven2'"
      >
        <el-select
          :disabled="status === 'read'"
          v-model="warehouse.strategy"
          style="min-width:632px"
          placeholder="请选择策略类型"
        >
          <el-option
            v-for="strategy in strategies"
            :label="strategy.label"
            :value="strategy.value"
            :key="strategy.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        class="warehouse-item"
        label="选择仓库"
        prop="warehouseGroup"
        v-if="warehouse.warehouseType === 'group'"
      >
        <el-transfer
          v-model="warehouse.warehouseGroup"
          :data="groupWarehouseList"
          :props="{ key: 'name', label: 'name' }"
          filterable
          filter-placeholder="输入制品库名称搜索"
          :titles="['可选仓库', '已选仓库']"
          style="min-width:632px"
        ></el-transfer>
      </el-form-item>
    </el-form>
    <div class="btn-group">
      <button class="cm-btn deep margin-right" @click="submit" v-if="status !== 'read'">确 定</button>
      <button class="cm-btn isoutline" @click="cancel">取 消</button>
    </div>
  </div>
</template>

<script>
import axios from '@/api';
export default {
  name: 'WarehouseAdd',
  data () {
    let nameValidator = (rule, value, callback) => {
      let reg = /[^\w\d_\-$@]/
      if (reg.test(value)) {
        return callback(new Error('不能输入非法字符!'))
      } else {
        return callback()
      }
    }
    return {
      status: 'read',
      wareController: true,
      warehouse: {},
      rules: {
        productId: [
          { required: true, message: '请选择制品库', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入仓库名称', trigger: 'blur' },
          { validator: nameValidator, trigger: 'blur' }
        ],
        remarksName: [
          { required: true, message: '请输入备注名称', trigger: 'blur' }
        ],
        environmentId: [
          { required: true, message: '请选择所属环境', trigger: 'blur' }
        ],
        warehouseType: [
          { required: true, message: '请选择仓库类型', trigger: 'change' }
        ],
        storageType: [
          { required: true, message: '请选择存储类型', trigger: 'change' }
        ],
        port: [{ required: true, message: '请输入端口号', trigger: 'blur' }],
        proxyUrl: [
          { required: true, message: '请输入代理地址', trigger: 'blur' }
        ],
        strategy: [
          { required: true, message: '请选择策略', trigger: 'change' }
        ],
        group: [
          {
            type: 'array',
            required: true,
            message: '请选择仓库',
            trigger: 'change'
          }
        ]
      },
      warehouseTypes: [
        {
          value: 'proxy',
          label: 'proxy'
        },
        {
          value: 'hosted',
          label: 'hosted'
        },
        {
          value: 'group',
          label: 'group'
        }
      ],
      saveTypes: [
        {
          value: 'pypi',
          label: 'pypi'
        },
        {
          value: 'npm',
          label: 'npm'
        },
        {
          value: 'docker',
          label: 'docker'
        },
        {
          value: 'maven2',
          label: 'maven2'
        }
      ],
      strategies: [
        {
          value: 'RELEASE',
          label: 'RELEASE'
        },
        {
          value: 'SNAPSHOT',
          label: 'SNAPSHOT'
        }
      ],
      // 环境列表
      envList: [],
      // 制品库列表
      productList: [],
      // 可选仓库列表
      groupWarehouseList: [],
      // 当前仓库编号
      warehouseName: '',
      productId: ''
    }
  },
  created () {
    this.getEnvList()
    this.getProductConfigList()
    this.status = this.$route.params.status
    if (this.status === 'read' || this.status === 'edit') {
      this.warehouseName = this.$route.query.warehouseName
      this.productId = this.$route.query.productId
      this.getWarehouseInfo()
    }
  },
  methods: {
    // 取消提交
    cancel () {
      this.warehouse = {}
      this.jumpToWarehouseList()
    },
    // 提交信息
    submit () {
      let data = JSON.parse(JSON.stringify(this.warehouse))
      data.warehouseGroup = this.groupDataTransform(data.warehouseGroup)
      this.$refs.warehouse.validate().then(res => {
        if (res) {
          if (this.status === 'edit') {
            this.editWarehouse(data)
          } else {
            this.addWarehouse(data)
          }
        }
      })
    },
    // 新增仓库
    addWarehouse (data) {
      axios.addWarehouse(data).then(res => {
        console.log(res)
        if (res.data.code === 200) {
          this.$notify.success(res.data.message)
          this.jumpToWarehouseList()
        } else {
          this.$notify.error(res.data.message)
        }
      })
    },
    // 编辑仓库
    editWarehouse (data) {
      axios.updateWarehouse(data).then(res => {
        if (res.data.code === 200) {
          this.$notify.success(res.data.message)
          this.jumpToWarehouseList()
        } else {
          this.$notify.error(res.data.message)
        }
      })
    },
    // 处理所选制品库变更时
    handleSelectedProductChange () {
      this.getGroupWarehouseList()
    },
    // 处理所选存储类型变更时
    handleStorageTypeChange () {
      this.getGroupWarehouseList()
    },
    // 获取环境列表
    getEnvList () {
      axios.envtablist().then(res => {
        if (res.data.code === 200) {
          this.envList = res.data.data.result
        }
      })
    },
    // 获取制品库列表
    getProductConfigList () {
      axios.productConfigList({
        name: '',
        accountNumber: '',
        detectionStatus: '1',
        current: 0,
        size: 1000
      }).then(res => {
        if (res.data.code === 200) {
          this.productList = res.data.data.records
        }
      })
    },
    // 获取可选仓库列表
    getGroupWarehouseList () {
      let data = {
        productId: this.warehouse.productId,
        storageType: this.warehouse.storageType
      }
      console.log(data)
      axios.queryWarehouseList(data).then(res => {
        if (res.data.code === 200) {
          if (this.status === 'read') {
            res.data.data.forEach(item => {
              item.disabled = true
            })
          }
          this.groupWarehouseList = res.data.data
        }
      })
    },
    // 获取仓库详细
    getWarehouseInfo () {
      axios.queryWarehouse({
        productId: this.productId,
        warehouseName: this.warehouseName
      }).then(res => {
        console.log(res)
        const data = res.data.data
        this.resDataHandler(data)
        if (data.warehouseType === 'group') {
          this.getGroupWarehouseList()
        }
      })
    },
    resDataHandler (data) {
      // let warehouse = this.warehouse
      if (!data) return {}
      data.warehouseGroup = this.groupDataRevert(data.warehouseGroup)
      this.warehouse = data
      // warehouse.productId = data.productId
      // warehouse.name = data.name
      // warehouse.remarksName = data.remarksName
      // warehouse.environmentId =
    },
    // group数据转换
    groupDataTransform (data) {
      let result = '['
      if (data) {
        data.forEach((item, index) => {
          if (index === 0) {
            result = result + "'" + item + "'"
          } else {
            result = result + ",'" + item + "'"
          }
        })
      }
      return result + ']'
    },
    groupDataRevert (data) {
      let strLength = data.length
      let str = data.substring(1, strLength - 1)
      console.log(str)
      str = str.replace(/\s*/g, '')
      return str.split(',')
    },
    jumpToWarehouseList () {
      this.$router.push({
        path: '/AutomatedRelease/warehouse',
        query: {
          code: 3
        }
      })
    }
  }
}
</script>

<style scoped>
.warehouse-item {
  display: block;
  width: 80%;
}
.warehouse-item input,
.warehouse-item select {
  width: 100%;
}

.icon-tip > img {
  display: inline-block;
  vertical-align: middle;
}

.cont-tip > span {
  margin-left: 34px;
  font-size: 14px;
  color: #3e444a;
}
.btn-group {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 30px 0 20px;
}
.margin-right {
  margin-right: 200px;
}
.padding-title {
  padding-bottom: 20px;
  margin-top: 6px;
}
.ml114 {
  padding-left: 114px;
}
</style>
