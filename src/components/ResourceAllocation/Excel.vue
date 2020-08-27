<template>
  <div class="bg aibms-color-bg">
    <div class="cometitle"></div>
    <el-row>
      <el-col>
        <div class="grid-content bg-purple" style=" margin-top: 16px;">
          <!-- <span class="bluespan"></span>选择CI类型 -->
          <div class="item-block-title paddingTop" @click="changeState(1)">
            <div class="item-block-title-mark"></div>
            <span class="item-block-title-font">选择CI类型</span>
            <i
              class="icons el-icon-arrow-right"
              :style="{transform: excelStatus[1] ? 'rotate(90deg)' : 'rotate(0)'}"
            ></i>
          </div>
          <el-form
            label="设置CI类型"
            class="form-style item-block-content white-color"
            :style="{height: excelStatus[1] ? 'auto' : 0}"
          >
            <span class="red">*</span>
            <span style="    margin: 0 40px 0 10px;">CI类型:</span>
            <el-select v-model="sshid" placeholder="请选择要下载的CI类型模板" clearable>
              <el-option
                :label="item.name"
                :value="item.citypeId"
                v-for="(item,index) in CIList"
                :key="index"
              ></el-option>
            </el-select>
            <el-button
              type="primary"
              style="margin-left: 22px; "
              @click="getexcelmodel"
            >下载模板</el-button>
          </el-form>
        </div>
      </el-col>
      <!-- <el-col :span="12">
        <div class="grid-content bg-purple-light">
          <span style="    line-height: 40px;  font-size: 22px;">设置环境</span>
          <el-form label="设置环境" style="padding-top: 30px; padding-bottom: 30px;">
            <el-select v-model="sshid2" placeholder="选择CI类型" clearable style="margin-left: 82px;">
              <el-option
                :label="item.name"
                :value="item.envId"
                v-for="(item,index) in envlist"
                :key="index"
              ></el-option>
            </el-select>
          </el-form>
        </div>
      </el-col>-->
    </el-row>
    <el-row>
      <el-col>
        <div class="grid-content bg-purple">
          <!-- <span class="bluespan"></span>上传文件 -->
          <div class="item-block-title paddingTop" @click="changeState(2)">
            <div class="item-block-title-mark"></div>
            <span class="item-block-title-font white-color">上传文件</span>
            <i
              class="icons el-icon-arrow-right"
              :style="{transform: excelStatus[2] ? 'rotate(90deg)' : 'rotate(0)'}"
            ></i>
          </div>
          <el-form
            label="设置CI类型"
            :style="{height: excelStatus[2] ? 'auto' : 0}"
            class="form-style upload item-block-content"
          >
            <el-form-item>
              <span class="red">*</span>
              <span style="margin: 0 24px 0 10px;" class="white-color">导入格式:</span>
              <el-select v-model="sshidtype" placeholder="请选择导入格式" clearable>
                <el-option
                  :label="item.name"
                  :value="item.citypeId"
                  v-for="(item,index) in CIListtype"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-upload
                class="upload-demo"
                ref="upload"
                action="https://jsonplaceholder.typicode.com/posts/"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :file-list="fileList"
                :auto-upload="false"
              >
                <el-button slot="trigger" type="primary">上传</el-button>
                <el-button class="posa" type="primary" @click="submitUpload">开始导入</el-button>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
        <!-- <div class="grid-content bg-purple-dark">
          <span class="bluespan"></span>上传文件
          <el-upload
            style="padding-left: 82px;
    padding-top: 24px;
        width: 352px;"
            class="upload-demo"
            ref="upload"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="fileList"
            :auto-upload="false"
          >
            <el-button slot="trigger" size="small" type="primary">选择上传</el-button>
            <el-button class="posa" size="small" type="primary" @click="submitUpload">开始导入</el-button>
          </el-upload>
        </div>-->
      </el-col>
      <!-- <el-col :span="12">
        <div class="grid-content bg-purple-dark">
          <el-button type="primary" style="margin-top: 56px;" @click="upload()">确认导入</el-button>
        </div>
      </el-col>-->
    </el-row>

    <!-- <el-form label="上传进度" style="padding-top: 30px; padding-bottom: 30px;">
      <el-table
        :data="excellist"
        border
        ref="multipleTable"
        @selection-change="handleSelectionChange"
        style="    width: 88%;margin-left:92px"
      >
        <el-table-column prop="name" label="文件名"></el-table-column>
        <el-table-column prop="size" label="文件大小"></el-table-column>
        <el-table-column prop="status" label="执行状态"></el-table-column>
      </el-table>
    </el-form>-->
    <!-- <div class="result"> -->
    <!-- <span class="bluespan"></span>导入结果 -->
    <div class="item-block-title paddingTop" @click="changeState(3)">
      <div class="item-block-title-mark"></div>
      <span class="item-block-title-font">导入结果</span>
      <i
        class="icons el-icon-arrow-right"
        :style="{transform: excelStatus[3] ? 'rotate(90deg)' : 'rotate(0)'}"
      ></i>
    </div>
    <el-form
      label="执行结果"
      class="form-style item-block-content"
      :style="{height: excelStatus[3] ? 'auto' : 0}"
    >
      <el-row style="padding-left: 10px;">
        <!-- <el-col> -->
        <el-col v-if="snum+fnum+unum>0">
          <el-form>
            <!-- <div
              style="text-indent: 9%; font-size: 34px; font-weight: 600;margin-bottom: 22px; color: #00FF00;"
            >导入成功</div>-->
            <span style="    margin-left: 20%;">
              本次导入总计:
              <span style="font-size: 18px;  color: #3E444A;">{{snum+fnum+unum}} 条,</span>
              <span style="font-size: 18px;  color: #00FF00;">成功: {{snum}} 条,</span>
              <span
                v-if="this.updateNum != 0"
                style="font-size: 18px;  color: #1E90FF;"
              >已覆盖: {{unum}} 条,</span>
              <span style="font-size: 18px;  color: #DC143C;">失败: {{fnum}} 条</span>
            </span>
          </el-form>
        </el-col>
        <el-col v-if="unum>0">
          <div style="    margin-left: 20%;">
            本次覆盖数据名称有:
            <span style="font-size: 18px;">{{this.ciName}}</span>
            <!-- <span v-for=""></span> -->
          </div>
        </el-col>
      </el-row>
    </el-form>
    <!-- </div> -->
  </div>
</template>

<script>
import axios from '@/api';
export default {
  data () {
    return {
      sshid: '',
      excelStatus: { '1': true, '2': true, '3': true }, // 控制块
      successNum: 0,
      failureNum: 0,
      updateNum: 0,
      sshid2: '',
      CIList: [],
      filedataList: [],
      envlist: [],
      fileList: [],
      filedata: null,
      excellist: [],
      resid: '',
      sysData: {},
      sshidtype: '',
      ciName: [],
      CIListtype: [
        {
          name: 'CSV',
          citypeId: '1'
        },
        {
          name: 'Excel',
          citypeId: '2'
        },
        {
          name: 'PDF',
          citypeId: '3'
        }
      ]
      //  fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}]
    }
  },
  computed: {
    snum: function () {
      return this.successNum
    },
    fnum: function () {
      return this.failureNum
    },
    unum: function () {
      return this.updateNum
    }
  },
  methods: {
    // 点击标签显示或隐藏
    changeState (num) {
      this.excelStatus[num] = !this.excelStatus[num]
    },
    submitUpload () {
      this.upload()
      this.$refs.upload.submit()
    },
    // handleRemove(file, fileList) {
    //   console.log(file, fileList);
    // },
    // handlePreview(file) {
    //   console.log(file);
    // }
    handleSelectionChange (val) {
      // console.log(val);
    },
    // 环境下拉列表
    envtablist () {
      let data = {
        name: '',
        environmentType: ''
      }
      axios.envtablist(data)
        .then(res => {
          // console.log(res)
          res.data.data.result.forEach(item => {
            this.envlist.push({ name: item.name, envId: item.environmentId })
          })
        })
        .catch()
    },
    // 拉取excel模板
    getexcelmodel () {
      // console.log(this.sshid)
      if (!this.sshid) {
        this.$notify({
          type: 'warning',
          message: '请选择CI类型！'
        })
        return false
      }
      window.open(
        axios.ciBaseUrl() + 'file/excelExportTemplate/' + this.sshid,
        '_self'
      )
    },
    //  submitUpload() {
    //     this.$refs.upload.submit();
    //   },
    beforeUpload (file) {
      // console.log(file)
      // 这里是重点，将文件转化为formdata数据上传
      //   let fd = new FormData()
      //   fd.append('file', file)
      //  this.filedata = fd
    },
    // 脚本上传
    upload () {
      let AUTH_TOKEN = (function () {
        return localStorage.getItem('token')
      })()
      var instance = this.$axios.create({})
      instance.defaults.headers.common['Authorization'] =
        'Bearer ' + AUTH_TOKEN
      var fd = new FormData()
      let files

      this.$refs.upload.uploadFiles.forEach(item => {
        //  console.log(item)
        if (this.resid == item.uid) {
          files = item.raw
          //  console.log(item)
        }
      })
      // console.log(files);
      if (!files) {
        this.$notify({
          title: '提示',
          message: '请选择要导入的文件',
          type: 'warning'
        })
        return false
      }
      fd.append('file', files)
      let config = {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
      // console.log(fd)
      //  console.log(  this.filedata)
      // 第一次导入判断
      this.$axios
        .post(axios.ciBaseUrl() + 'api/ciitem/import/excel/0', fd, config)
        .then(res => {
          console.log(res.data)
          if (res.data.data && res.data.data.updateNum == 0) {
            // console.log(res.data);
            this.$notify({
              title: '提示',
              message: '导入成功',
              type: 'success'
            })
            this.excellist.push({
              name: files.name,
              size: (files.size / 1024).toFixed(2) + 'M',
              status: '上传成功'
            })
            this.successNum = Number(res.data.data.successNum)
            this.failureNum = Number(res.data.data.failureNum)
          } else if (res.data.code != 500 && res.data.updateNum != 0) {
            // axios.CiDataDetail(res.data.ciitemId).then(data =>{
            //   if(data.data.code == 200){
            //     console.log(data.data.data.result.name)
            //     this.ciName = data.data.data.result.name;
            // 有覆盖数据判断
            this.$confirm('确认覆盖' + res.data.updateNum + '条数据？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$axios.post(axios.ciBaseUrl() + 'api/ciitem/import/excel/1', fd, config)
                .then(res => {
                  if (res.data.success) {
                    // console.log(res.data);
                    this.$notify({
                      title: '提示',
                      message: '导入成功',
                      type: 'success'
                    })
                    this.ciIdList = res.data.data.ciIdList
                    // console.log(this.ciIdList)
                    this.excellist.push({
                      name: files.name,
                      size: (files.size / 1024).toFixed(2) + 'M',
                      status: '上传成功'
                    })
                    this.successNum = Number(res.data.data.successNum)
                    this.failureNum = Number(res.data.data.failureNum)
                    this.updateNum = Number(res.data.data.updateNum)
                    for (var i = 0; i < this.ciIdList.length; i++) {
                      axios.CiDataDetail(this.ciIdList[i]).then(data => {
                        if (data.data.code == 200) {
                          this.ciName.push(data.data.data.result.name)
                          //  console.log(this.ciName)
                        }
                      })
                    }
                  }
                })
            })
            // }
            // })
          } else {
            this.$notify({
              title: '提示',
              message: res.data.message,
              type: 'warning'
            })
          }
        })
    },
    getwidth () {
      var x = document.getElementsByClassName('el-upload')
      x[0].style.width = '80px'
      x[0].style.height = '33px'
      x[0].style.border = 'none'
      x[0].style.position = 'relative'
      x[0].style.left = '567px'
    },
    handleRemove (file, fileList) {
      // console.log(file, fileList);
    },
    handlePreview (file) {
      // console.log(file)
      this.resid = file.uid
      // console.log(file);
    },
    handleExceed (files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      )
    },
    // beforeRemove(file, fileList) {
    //   return this.$confirm(`确定移除 ${ file.name }？`);
    // },
    getcitypelist () {
      let data = {}
      data.cigroupId = ''
      data.name = ''
      data.templateId = ''
      axios.getCiTList(data)
        .then(res => {
          // console.log(res);
          res.data.data.result.forEach(item => {
            this.CIList.push({ name: item.name, citypeId: item.citypeId })
          })
        })
        .catch()
    }
  },
  created () { },
  updated () { },
  mounted () {
    this.getcitypelist()
    this.getwidth()
    this.envtablist()
  }
}
</script>
<style scoped>
.bg {
  margin: 10px;
  background: #fff;
  border-radius: 5px;
  padding-bottom: 30px;
}
.item-block-title > .icons {
  color: #00A8E8;
}
.el-upload--text {
  color: #97a8be;
  font-size: 14px;
  text-align: center;
}
.upload-demo /deep/ .el-upload--text {
  background-color: transparent!important;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  left: 0 !important;
  height: auto !important;
  box-sizing: border-box;
  text-align: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.el-upload {
  display: inline-block;
  text-align: center;
  cursor: pointer;
  outline: 0;
}
.bluespan {
  display: inline-block;
  width: 6px;
  border-radius: 10px;
  margin-right: 10px;
  height: 20px;
  background: #0280ff;
  vertical-align: middle;
}
.red {
  color: red;
}
.upload {
  position: relative;
}

.posa {
  position: relative;
  left: 50px;
  top: -16px;
}
.butstyle {
  width: 80px;
  height: 33px;
  border: none;
  position: relative;
  left: 567px;
  top: 18px;
}
.result {
  margin-top: 80px;
}
.cometitle {
  font-size: 22px;
  text-align: center;
}
.form-style {
  padding: 0 20px;
}
</style>
