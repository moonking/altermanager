<template>
  <div class="open-layout aibms-warehouse">
    <div class="open-title aibms-color-bg non-border non-shadow">
      <img src="../../../../static/img/warehouse_path.png" alt />
      {{ this.warehouseName }}
      <div
        class="btn-upload"
        v-if="(warehouseInfo.storageType === 'maven2' && warehouseInfo.warehouseType !== 'proxy') || warehouseInfo.storageType === 'npm'"
      >
        <el-button type="primary" @click="handleUpload">
          <i class="el-icon-upload"></i> 上传
        </el-button>
      </div>
    </div>
    <div class="open-panel">
      <div class="open-panel-dir aibms-color-bg non-border non-shadow">
        <el-input v-model="treeFilterData" placeholder="输入文件夹或文件名称, 按回车搜索" @change="searchPackage"></el-input>
        <el-tree
          :data="treeData"
          :props="defaultProps"
          node-key="id"
          accordion
          :load="loadNode"
          ref="tree"
          lazy
          @node-click="handleNodeClick"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>
              <i :class="setNodeIcon(node, data)"></i>
              &nbsp;{{ node.label }}
            </span>
          </span>
        </el-tree>
      </div>
      <div class="open-panel-content aibms-color-bg non-border non-shadow">
        <div class="content-wrapper" v-if="currentAssetInfo.name">
          <div class="open-panel-item">
            <label>所属仓库：</label>
            <div class="open-panel_item">{{ currentAssetInfo.repositoryName }}</div>
            <el-button type="text" @click="handleSyncPackge">
              <i class="el-icon-copy-document"></i> 同步
            </el-button>
          </div>
          <div class="open-panel-item">
            <label>名称：</label>
            <div class="open-panel_item">{{ currentAssetInfo.name }}</div>
          </div>
          <div class="open-panel-item">
            <label>路径：</label>
            <div class="open-panel_item">
              <a
                :download="currentAssetInfo.name"
                :href="assetDownloadUrl"
                target="_blank"
              >{{ currentAssetInfo.path }}</a>
            </div>
          </div>
          <div class="open-panel-item">
            <label>文件大小：</label>
            <div
              class="open-panel_item"
            >{{ this.getFileSize(currentAssetInfo.size / 1024 / 1024) + 'M'}}</div>
          </div>
          <div class="open-panel-item">
            <label>md5：</label>
            <div class="open-panel_item">{{ currentAssetInfo.attributes.checksum.md5 }}</div>
          </div>
          <div class="open-panel-item">
            <label>最后修改时间：</label>
            <div class="open-panel_item">{{ currentAssetInfo.attributes.content.last_modified }}</div>
          </div>
          <div
            class="open-panel-item"
            v-if="currentAssetInfo.attributes.maven2.asset_kind === 'ARTIFACT'"
          >
            <label>依赖类型：</label>
            <div class="open-panel_item">
              <div>Apache Maven</div>
            </div>
          </div>
          <div class="item_info">
            <icon-svg @click="copyMavenCode(assetMavenCode)" icon-class="fuzhi" class="copy-btn" />
            <!-- <img class="copy-btn" src="../../../../static/img/open_file_copy.png" alt="" @click="copyMavenCode(assetMavenCode)" > -->
            <pre><code>{{ assetMavenCode }}</code></pre>
          </div>
        </div>
        <div class="content-wrapper" v-else-if="currentComponentInfo.name">
          <div class="open-panel-item">
            <label>所属仓库：</label>
            <div class="open-panel_item">{{ currentComponentInfo.repositoryName }}</div>
            <el-popover width="160" v-model="deleteDialogVisible">
              <p :style="{height: '32px', lineHeight: '32px'}">确定要删除该制品包吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="deleteDialogVisible = false">取消</el-button>
                <el-button type="danger" size="mini" @click="confirmDeletePackage">确定</el-button>
              </div>
              <el-button class="btn-delete" type="text" slot="reference">
                <i class="el-icon-close"></i> 删除
              </el-button>
            </el-popover>
          </div>
          <div class="open-panel-item">
            <label>名称：</label>
            <div class="open-panel_item">{{ currentComponentInfo.name }}</div>
          </div>
          <div class="open-panel-item">
            <label>路径：</label>
            <div class="open-panel_item">{{ currentComponentInfo.group }}</div>
          </div>
          <div class="open-panel-item" v-if="currentComponentInfo.format === 'maven2'">
            <label>依赖类型：</label>
            <div class="open-panel_item">
              <div>Apache Maven</div>
            </div>
          </div>
          <div class="item_info">
            <icon-svg @click="copyMavenCode(assetMavenCode)" icon-class="fuzhi" class="copy-btn" />
            <pre><code>{{ componentMavenCode }}</code></pre>
          </div>
        </div>
        <div v-else :style="{color: '#fff'}">暂无数据</div>
      </div>
    </div>
    <el-dialog title="上传" center :visible.sync="uploadDialogVisible" width="35%">
      <el-form
        :model="uploadForm"
        label-width="100px"
        :rules="uploadFormRules"
        ref="uploadForm"
        label-position="left"
      >
        <el-form-item label="项目组编号:" prop="groupId" v-if="warehouseInfo.storageType === 'maven2'">
          <el-input v-model="uploadForm.groupId" minlength="1" maxlength="26" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="制品编号:" prop="artifactId" v-if="warehouseInfo.storageType === 'maven2'">
          <el-input v-model="uploadForm.artifactId" minlength="1" maxlength="26" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="版本号:" prop="version" v-if="warehouseInfo.storageType === 'maven2'">
          <el-input v-model="uploadForm.version" minlength="1" maxlength="26" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="上传文件:" prop="productPackge">
          <el-upload
            class="upload-demo"
            ref="upload"
            action="action"
            :on-change="handleFileChange"
            :file-list="uploadForm.productPackge"
            :on-exceed="handleExceed"
            :auto-upload="false"
            :limit="1"
            :http-request="uploadSectionFile"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="MD5码:" prop="md5">
          <el-input v-model="uploadForm.md5" maxlength="32" show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="uploadDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmUpload">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="同步" center :visible.sync="syncDialogVisible" width="35%">
      <el-form
        :model="syncForm"
        label-width="100px"
        :rules="syncFormRules"
        label-position="left"
        ref="syncForm"
      >
        <el-form-item label="同步至:" prop="warehouseId">
          <el-select v-model="syncForm.warehouseId" placeholder="请选择要同步的制品库">
            <el-option
              v-for="warehouse in warehouseList"
              :key="warehouse.name"
              :label="warehouse.name"
              :value="warehouse.name"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="uploadDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmSyncPackage">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from '@/api';
import { websocketurl } from '../../../config'
export default {
  name: 'warehouseOpen',
  data () {
    return {
      warehouseInfo: {},
      treeFilterData: '',
      treeData: [],
      // 删除提示框可见性
      deleteDialogVisible: false,
      defaultProps: {
        children: 'children',
        label: 'text',
        isLeaf: 'leaf'
      },
      search: {},
      warehouseTypes: [
        {
          value: 1,
          label: 'Apache Maven'
        },
        {
          value: 2,
          label: 'Apache Maven'
        },
        {
          value: 3,
          label: 'Apache Maven'
        }
      ],
      warehouseList: [],
      productId: '',
      warehouseName: '',
      // 上传弹出框控制显示变量
      uploadDialogVisible: false,
      // 上传表单数据
      uploadForm: {},
      uploadFormRules: {
        groupId: [
          { min: 1, max: 26, message: '字符数量在1到26个字符之间！', trigger: 'blur' }
        ],
        artifactId: [
          { min: 1, max: 26, message: '字符数量在1到26个字符之间！', trigger: 'blur' }
        ],
        version: [
          { min: 1, max: 26, message: '字符数量在1到26个字符之间！', trigger: 'blur' }
        ],
        productPackge: [{ required: true, message: '请选择要上传的文件！', trigger: 'blur' }],
        md5: [
          { required: true, message: 'MD5校验码不能为空！', trigger: 'blur' },
          { min: 32, max: 32, message: 'MD5码格式错误！', trigger: 'blur' }
        ]
      },
      // 上传文件列表
      fileList: [],
      currentAssetInfo: {},
      currentComponentInfo: {},

      // 同步
      syncDialogVisible: false,
      syncForm: {},
      syncFormRules: {
        warehouseId: [{ required: true, message: '请选择要同步的仓库', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 获取仓库信息
    getWarehouseInfo () {
      axios.queryWarehouse({
        productId: this.productId,
        warehouseName: this.warehouseName
      }).then(res => {
        if (res.data.code === 200) {
          this.warehouseInfo = res.data.data
        }
      })
    },
    // 获取仓库列表
    getWarehouseList () {
      axios.getWarehouseListOnSync({
        warehouseName: this.warehouseInfo.name || '',
        warehouseType: this.warehouseInfo.storageType || '',
        productId: this.productId
      }).then(res => {
        console.log(res)
        if (res.data.code === 200) {
          this.warehouseList = res.data.data
        }
      })
    },
    searchPackage () {
      axios.queryProductList({
        productId: this.productId,
        warehouseName: this.warehouseName,
        packageName: this.treeFilterData
      }).then(res => {
        console.log(res)
        if (res.data.code === 200) {
          this.treeData = this.resDataHanle(res.data.data)
        }
      })
    },
    handleUpload () {
      this.uploadDialogVisible = true
    },
    confirmUpload () {
      this.$refs.upload.submit()
    },
    handleNodeClick (data) {
      console.log(data)
      if (data.type === 'folder') return
      let id = ''
      let type = ''
      if (data.type === 'component') {
        id = data.componentId
        this.currentAssetInfo = {}
        type = 'readComponent'
      } else {
        id = data.assetId
        this.currentComponentInfo = {}
        type = 'readAsset'
      }
      this.getNexusAssetInfo(
        {
          productId: this.productId,
          warehouseName: this.warehouseName,
          nexusPackageId: id,
          getType: type
        },
        data.type === 'component'
      )
    },
    getNexusAssetInfo (data, isComponent) {
      axios.queryNexusAssetInfo(data).then(res => {
        let data = res.data
        if (isComponent) {
          this.currentComponentInfo = data
        } else {
          data.path = data.name
          let pathArr = data.name.split('/')
          data.name = pathArr[pathArr.length - 1]
          this.currentAssetInfo = data
        }
      })
    },
    getProductList (isLeaf) {
      axios.queryProductList({
        productId: this.productId,
        warehouseName: this.warehouseName
      }).then(res => {
        console.log(res)
        if (res.data.code === 200) {
          this.treeData = this.resDataHanle(res.data.data)
        }
      })
    },
    loadNode (node, resolve) {
      console.log(node)
      if (node.level === 0) {
        return resolve(this.treeData)
      } else {
        axios.queryProductList({
          productId: this.productId,
          warehouseName: this.warehouseName,
          nexusPath: node.data.id
        }).then(res => {
          if (res.data.code === 200) {
            resolve(this.resDataHanle(res.data.data))
          } else {
            resolve([])
          }
        })
      }
    },
    resDataHanle (data) {
      if (!data) return []
      data.forEach(item => {
        item.nodeId = item.id
      })
      return data
    },
    setNodeIcon (node, data) {
      console.log(data)
      const type = data.type
      switch (type) {
        case 'folder':
          if (node.expanded) {
            return 'el-icon-folder-opened'
          } else {
            return 'el-icon-folder'
          }
        case 'component':
          return 'el-icon-files'
        case 'asset':
          return 'el-icon-document'
        default:
          return 'el-icon-document-remove'
      }
    },
    // 上传文件
    uploadSectionFile (params) {
      let formData = JSON.parse(JSON.stringify(this.uploadForm))
      formData.productPackge = params.file
      let data = new FormData()
      data.append('productId', this.productId)
      data.append('warehouseName', this.warehouseName)
      data.append('warehouseType', this.warehouseInfo.storageType)
      data.append('artifactId', formData.artifactId || '')
      data.append('groupId', formData.groupId || '')
      data.append('version', formData.version || '')
      data.append('md5', formData.md5)
      data.append('productPackge', params.file)
      axios.addProductPackage(data).then(res => {
        if (!res) {
          this.listenWsData()
          return
        }
        if (res.data.code === 200) {
          this.$message.success(res.data.message)
          this.$refs.uploadForm.resetFields()
          console.log(1)
          this.getProductList()
        }
      })
      this.uploadDialogVisible = false
    },
    listenWsData () {
      let ws = new WebSocket(websocketurl)
      ws.onopen = res => {
        console.log('ws已连接')
      }
      ws.onmessage = res => {
        console.log(res)
        let result = JSON.parse(res.data)
        let data = result.data
        console.log(data)
        if (result.code === 200) {
          this.$notify({ title: '提示', message: result.message, type: 'success' })
          this.getProductList()
          console.log(1)
        } else {
          this.$notify({ title: '提示', message: data.result, type: 'error' })
          console.log(2)
        }
        ws.close()
      }
      ws.onclose = res => {
        console.log('ws已关闭')
      }
    },
    handleFileChange (files, fileList) {
      // this.fileList = fileList.slice(-1);
    },
    // 处理文件超过数量
    handleExceed (file, fileList) {
      // this.$refs.upload.clearFiles()
      // this.fileList = [file]
      this.$message.error('只能上传一个文件！')
    },
    // 确认删除制品包
    confirmDeletePackage () {
      const info = this.currentComponentInfo
      const nexusPackageId = info.id
      if (!nexusPackageId) {
        this.$message.error('操作异常，无法删除！')
      }
      axios.deleteNexusPackage({
        productId: this.productId,
        warehouseName: this.warehouseName,
        nexusPackageId: nexusPackageId,
        group: info.group,
        name: info.name,
        version: info.version,
        format: info.format
      }).then(res => {
        if (res.data.code === 200) {
          this.$message.success(res.data.message)
          // 重新获取新的仓库列表树
          this.getProductList()
          this.currentComponentInfo = {}
          this.currentAssetInfo = {}
        } else {
          this.$message.error(res.data.message)
        }
      })
      this.deleteDialogVisible = false
    },
    // 同步制品包
    handleSyncPackge () {
      console.log('test')
      this.getWarehouseList()
      this.syncDialogVisible = true
    },
    // 确认同步制品包
    confirmSyncPackage () {
      this.$refs.syncForm
        .validate()
        .then(res => {
          console.log(res)
          if (!res) return
          const warehouseName = this.syncForm.warehouseId
          let warehouseType = ''
          this.warehouseList.forEach(item => {
            if (item.name === warehouseName) {
              warehouseType = item.format
            }
          })
          axios.syncNexusPackage({
            productId: this.productId,
            repository: this.warehouseInfo.name,
            path: this.currentAssetInfo.path,
            groupId: this.currentAssetInfo.attributes.maven2.groupId,
            artifactId: this.currentAssetInfo.attributes.maven2.artifactId,
            version: this.currentAssetInfo.attributes.maven2.version,
            warehouseName: warehouseName,
            warehouseType: warehouseType
          }).then(res => {
            if (res.data.code === 200) {
              this.$message.success(res.data.message)
            } else {
              this.$message.error(res.data.message)
            }
          })
          this.syncDialogVisible = false
        })
        .catch(err => {
          console.log(err)
        })
    },
    copyMavenCode (value) {
      let textArea = document.createElement('textArea')
      textArea.value = value
      textArea.innerHTML = value
      document.body.appendChild(textArea)

      try {
        if (document.execCommand('Copy')) {
          this.$message.success('复制成功')
        } else {
          this.$message.success('复制失败！请手动复制！')
        }
      } catch (err) {
        this.$message.success('复制失败！请手动复制！')
      }
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
    },
    getFileSize (value) {
      var m = Math.pow(10, 2)
      return Math.floor(value * m) / m
    }
  },
  created () {
    console.log(this.$route)
    this.productId = this.$route.query.productId
    this.warehouseName = this.$route.query.warehouseName
    this.getWarehouseInfo()
    this.getProductList()
  },
  computed: {
    assetMavenCode () {
      const info = this.currentAssetInfo
      if (info.format !== 'maven2') return ''
      const mavenInfo = info.attributes.maven2
      return `<dependency>\n  <groupId>${mavenInfo.groupId}</groupId>\n  <artifactId>${mavenInfo.artifactId}</artifactId>\n  <version>${mavenInfo.version}</version>\n  <type>${mavenInfo.extension}</type>\n</dependency>`
    },
    componentMavenCode () {
      const info = this.currentComponentInfo
      if (info.format !== 'maven2') return ''
      return `<dependency>\n  <groupId>${info.group}</groupId>\n  <artifactId>${info.name}</artifactId>\n  <version>${info.version}</version>\n</dependency>`
    },
    assetDownloadUrl () {
      const asset = this.currentAssetInfo
      return `${asset.nexusUrl}/repository/${asset.repositoryName}/${asset.path}`
    }
  }
}
</script>

<style scoped>
.open-panel-item img {
  position: absolute;
  right: 20px;
  top: 0;
  width: 20px;
}
.item_info {
  position: relative;
  background: #f0f0f0;
  padding: 20px;
  line-height: 25px;
  margin-top: 10px;
}
.open-panel-item {
  display: flex;
  height: 36px;
  font-size: 14px;
  color: #585858;
  position: relative;
}
.open-panel-item label {
  width: 100px;
  text-align: right;
}
.open-panel-item .open-panel_item {
  flex: 1;
}
.open-panel-content-title {
}
.open-layout {
  padding: 10px;
}
.open-title {
  font-size: 18px;
  vertical-align: middle;
  line-height: 40px;
  box-shadow: 0 2px 4px #ccc;
  padding: 20px;
  background: #fff;
  border-radius: 3px;
}
.open-title img {
  width: 40px;
  vertical-align: middle;
  margin-right: 10px;
}
.btn-upload {
  float: right;
}
.open-panel-content-title {
  font-size: 16px;
  vertical-align: middle;
  line-height: 30px;
}
.open-panel-content-title img {
  width: 25px;
  vertical-align: middle;
  margin-right: 10px;
}
.open-panel {
  display: flex;
  padding-top: 20px;
}
.open-panel-dir,
.open-panel-content {
  padding: 20px;
  background: #fff;
  border-radius: 3px;
}
.open-panel-dir {
  width: 40%;
  margin-right: 20px;
}
.open-panel-content {
  flex: 1;
}
.item_info .copy-btn {
  position: absolute;
  right: 10px;
  top: 10px;
  width: 20px;
  cursor: pointer;
}
</style>
