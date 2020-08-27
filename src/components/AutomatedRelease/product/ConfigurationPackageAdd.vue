<template>
  <div class="container refreshContainer aibms-color-bg non-border non-shadow white-color">
    <!-- <p
      class="mark-icon padding-title"
    >{{status === "read" ? "查看制品库" : status === 'create' ? "新增" : "编辑"}}</p>-->
    <div class="item-block-title paddingTop" @click="confController = !confController">
      <div class="item-block-title-mark"></div>
      <span
        class="item-block-title-font"
      >{{status === "read" ? "查看制品库" : status === 'create' ? "新增" : "编辑"}}</span>
      <i
        class="icons el-icon-arrow-right"
        :style="{transform: confController ? 'rotate(90deg)' : 'rotate(0)'}"
      ></i>
    </div>
    <el-form
      :model="ConfigurationPackage"
      ref="baseFormData"
      label-position="right"
      label-width="150px"
      :rules="rules"
      class="ml128 item-block-content"
      :style="{height: confController ? 'auto' : 0}"
    >
      <el-form-item class="ConfigurationPackage-item" label="所属业务系统：" prop="name">
        <el-input
          :disabled="status === 'read'"
          maxlength="20"
          v-model="ConfigurationPackage.name"
          placeholder="请输入所属业务系统"
          style="min-width: 632px"
        ></el-input>
      </el-form-item>
      <el-form-item class="ConfigurationPackage-item" label="所属仓库" prop="markName">
        <el-input
          :disabled="status === 'read'"
          maxlength="20"
          v-model="ConfigurationPackage.markName"
          placeholder="请输入所属仓库"
          style="min-width: 632px"
        ></el-input>
      </el-form-item>
      <el-form-item class="ConfigurationPackage-item" label="所属环境" prop="environmental">
        <el-select
          :disabled="status === 'read'"
          v-model="ConfigurationPackage.environmentalId"
          style="min-width: 632px"
          placeholder="请选择所属环境"
        >
          <el-option
            v-for="environmental in environmentals"
            :label="environmental.label"
            :value="environmental.value"
            :key="environmental.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="ConfigurationPackage-item" label="项目组编号：" prop="environmental">
        <el-input
          :disabled="status === 'read'"
          maxlength="20"
          v-model="ConfigurationPackage.markName"
          placeholder="请输入项目组编号"
          style="min-width: 632px"
        ></el-input>
      </el-form-item>
      <el-form-item class="ConfigurationPackage-item" label="制品编号：" prop="warehouseType">
        <el-input
          :disabled="status === 'read'"
          maxlength="20"
          v-model="ConfigurationPackage.markName"
          placeholder="请输入制品编号"
          style="min-width: 632px"
        ></el-input>
      </el-form-item>
      <el-form-item class="ConfigurationPackage-item" label="版本号：" prop="saveType">
        <el-input
          :disabled="status === 'read'"
          maxlength="20"
          v-model="ConfigurationPackage.markName"
          placeholder="请输入版本号"
          style="min-width: 632px"
        ></el-input>
      </el-form-item>
    </el-form>
    <div class="btn-group" v-if="status !== 'read'">
      <button class="cm-btn deep margin-right" @click="createWarehouse">确 定</button>
      <button class="cm-btn isoutline" @click="cancel">取 消</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WarehouseAdd',
  data () {
    return {
      status: 'read',
      ConfigurationPackage: {},
      confController: true,
      rules: {
        name: [{ required: true, message: '请输入仓库名称', trigger: 'blur' }],
        markName: [
          { required: true, message: '请输入备注名称', trigger: 'blur' }
        ],
        environmental: [
          { required: true, message: '请选择所属环境', trigger: 'change' }
        ],
        warehouseType: [
          { required: true, message: '请选择仓库类型', trigger: 'change' }
        ],

        saveType: [
          { required: true, message: '请选择存储类型', trigger: 'change' }
        ]
      },
      environmentals: [
        {
          value: 1,
          label: '环境1'
        },
        {
          value: 2,
          label: '环境2'
        },
        {
          value: 3,
          label: '环境3'
        }
      ],
      warehouseTypes: [
        {
          value: 1,
          label: '仓库'
        },
        {
          value: 2,
          label: '仓库1'
        },
        {
          value: 3,
          label: '仓库2'
        }
      ],
      saveTypes: [
        {
          value: 1,
          label: '类型1'
        },
        {
          value: 2,
          label: '类型2'
        },
        {
          value: 3,
          label: '类型3'
        }
      ]
    }
  },
  created () {
    this.status = this.$route.params.status
  },
  methods: {
    // 取消提交
    cancel () {
      this.ConfigurationPackage = {}
    },
    // 提交信息
    createWarehouse () { }
  }
}
</script>

<style scoped>
.ConfigurationPackage-item {
  display: block;
  width: 50%;
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
  margin-right: 632px;
}
.padding-title {
  padding-bottom: 20px;
  margin-top: 6px;
}
.ml128 {
  padding-left: 82px;
}
</style>
