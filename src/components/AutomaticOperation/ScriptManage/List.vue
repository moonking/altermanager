<template>
  <div class="container tool-list deep-aibms-color-bg white-color non-shadow non-border">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="filterKey" placeholder="按脚本名称搜索" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="filterType" placeholder="请选择功能分类" clearable>
          <el-option
            v-for="(type, index) in allTypeList"
            :label="type.name"
            :value="type.grouptagId"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="filterState" placeholder="请选择审批状态" clearable>
          <el-option
            v-for="(stat, index) in approveStates"
            :label="stat.message"
            :value="stat.code"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="item-temp overHideMargin">
        <el-button icon="el-icon-search" class="nomal-button" @click.stop="search">查找</el-button>
        <el-button
          type="primary"
          icon="el-icon-plus"
          class="margin-left-btn"
          @click.prevent="AddNewTool"
        >新增</el-button>
      </el-form-item>
    </el-form>
    <div class="info-box">
      <i class="el-icon-info white-color"></i>
      <span class="white-color">
        脚本总数：
        <span>{{ toolCountNum }}个</span>
      </span>
      <span class="white-color">
        可执行：
        <span>{{ toolRunNum }}个</span>
      </span>
    </div>
    <div class="container-wrapper">
      <div class="tabs-wrapper" @mouseleave.stop="hiddenIcon" v-if="!searchByname">
        <span
          class="tag-item system"
          v-if="!isSearch"
          :class="{ depp: tagsList.length < 1 }"
          @click="changeSysState"
        >系统默认</span>
        <div class="left-btn-box">
          <span class="swiper-button-prev left-loop"></span>
        </div>
        <div class="tabs-box-width" v-if="tagsList">
          <swiper :options="swiperOption">
            <!-- slides -->
            <swiper-slide
              class="tag-item"
              v-for="tag in tagsList"
              :key="tag.grouptagId"
              :class="{ depp: tag.isclick }"
              @click.native="changeBtnState(tag)"
            >
              <span @mouseenter.stop="showIconFun(tag)">{{ tag.name }}</span>
              <i
                v-if="tag.isShowIcon"
                class="el-icon-delete-solid deleteBtn"
                @click="deleteTypes(tag.grouptagId)"
              ></i>
              <i v-if="tag.isShowIcon" class="el-icon-edit editBtn" @click.stop="editTypeIcon(tag)"></i>
            </swiper-slide>
          </swiper>
        </div>
        <div class="right-btn-box">
          <span class="swiper-button-next right-loop"></span>
        </div>
        <span class="tag-item tag-item-other" @click="addNewTypeDialog">
          <icon-svg icon-class="wenjianjia" class="white-icon-color" />新增功能分类
        </span>
      </div>
      <div class="tagList-box aibms-bg" :class="{ more: isMore }" v-if="!isSys">
        <span @click="loadMore" class="more-btn">
          <span v-if="!isMore" class="white-color">
            更多标签
            <i class="el-icon-caret-right"></i>
          </span>
          <span v-else class="white-color">
            收起标签
            <i class="el-icon-caret-bottom"></i>
          </span>
        </span>
        <ul v-if="hasData">
          <li class="label-block" v-for="(tag, index) in allTags" :key="index">
            <div>
              <label>{{ tag.name }}</label>
            </div>
            <ul>
              <li
                v-for="(i, idx) in tag.groupOp"
                :key="idx"
                class="node-block"
                :class="{ search: i.clickState }"
                @click.stop="searchTag(i)"
              >{{ i.name }}</li>
            </ul>
          </li>
        </ul>
      </div>
      <div class="scriptList">
        <ul>
          <li
            class="deep-aibms-color-bg"
            @click.stop="goWatch(script.toolId)"
            v-for="script in scriptList"
            :key="script.toolId"
            @mouseenter="mouseEnter(script, 'other')"
            @mouseleave="mouseLeave(script, 'other')"
            :class="
              isSys
                ? 'none'
                : script.applyStatus === '0' && script.applyStatus != ''
                ? 'success'
                : 'error'
            "
          >
            <img v-if="isSys" :src="script.src" alt />
            <img v-else src="static/img/icon/tool.png" alt />
            <p class="name-limit">{{ script.name }}</p>
            <div class="marsk" v-if="script.toolId">
              <el-tooltip class="item" effect="dark" content="执行" placement="top-start">
                <span
                  class="iconfont icon-zhihang icon_png"
                  :class="
                    !script.excuteTip && validateBtn(script, 0)
                      ? 'canClick'
                      : 'notClick'
                  "
                  @click.stop="!script.excuteTip && goExecute(script)"
                ></span>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="审批" placement="top-start">
                <span
                  class="iconfont icon-fabu icon_png"
                  :class="
                    !script.approveTip && validateBtn(script, 1)
                      ? 'canClick'
                      : 'notClick'
                  "
                  @click.stop="!script.approveTip && openApproveDialog(script)"
                ></span>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
                <span
                  class="iconfont icon-bianji icon_png"
                  :class="
                    !script.editTip && validateBtn(script, 2)
                      ? 'canClick'
                      : 'notClick'
                  "
                  @click.stop="!script.editTip && goEdit(script)"
                ></span>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                <span
                  class="iconfont icon-lajitong icon_png"
                  :class="
                    !script.deleteTip && validateBtn(script, 3)
                      ? 'canClick'
                      : 'notClick'
                  "
                  @click.stop="!script.deleteTip && goDelete(script)"
                ></span>
              </el-tooltip>
            </div>
            <transition name="fade">
              <div class="demark all-aibms-color-bg non-shadow" v-if="script.moveItem">
                <p class="white-color">{{ script.name }}</p>
                <ul>
                  <li class="white-color">
                    <span>所属分类：</span>
                    <span v-if="script.groupName">{{ script.groupName }}</span>
                    <span v-else>{{ script.groupName }}</span>
                  </li>
                  <li class="white-color">
                    <span>创建者：</span>
                    <span>{{ script.createName }}</span>
                  </li>
                  <li class="white-color">
                    <span>脚本说明：</span>
                    <span>{{ script.remarks }}</span>
                  </li>
                </ul>
              </div>
            </transition>
          </li>
          <div class="clear"></div>
        </ul>
      </div>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currPage"
          :page-sizes="[10, 30, 50]"
          :page-size="pageSize"
          layout="prev, pager, next, sizes, total, jumper"
          :total="total"
          style="cursor: pointer;text-align: center;margin-top: 92px;"
        ></el-pagination>
      </div>
    </div>
    <el-dialog :title="title" :visible.sync="typeDialog" center width="30%">
      <el-form label-width="80px" style="padding-top: 30px;">
        <el-form-item label="分类名称">
          <el-input v-model="newTypeName" maxlength="20" placeholder="输入分类名称"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <button class="cm-btn deep margin-right" @click="confirmType">确 定</button>
        <button class="cm-btn isoutline" @click="handleCancle">取 消</button>
      </span>
    </el-dialog>
    <el-dialog title="发起审批" :visible.sync="approveDialog" center>
      <div class="content-wrapper" v-if="hasApprove">
        <span style="margin-right: 20px;">审批流程为：</span>
        <user-listselect :selectedList="approveList" />
      </div>
      <div class="content-wrapper" v-else>
        <p class="font-block">该审批无审批流程，无法发起审批</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <button
          class="cm-btn deep"
          style="margin-right: 200px"
          @click="handleApprove"
          v-if="hasApprove"
        >发起审批</button>
        <button class="cm-btn deep" style="margin-right: 200px" @click="goApprove" v-else>添加审批</button>
        <button class="cm-btn isoutline" @click="approveDialog = false">取 消</button>
      </span>
    </el-dialog>
    <!-- <el-dialog
      title="删除提示"
      :visible.sync="deleteVisable"
      width="30%"
      center
    >
      <p style="text-align: center;">
        <i class="el-icon-warning icon_warning"></i>
        <span>是否删除该脚本?</span>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteVisable = false">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </span>
    </el-dialog>-->
    <el-dialog center :visible.sync="deleteVisable" title="删除提示" width="300px">
      <div :style="{textAlign: 'center'}">
        <i class="el-icon-warning"></i>&nbsp;&nbsp;是否删除该脚本？
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          class="save-btn-margin-special"
          size="mini"
          @click="handleConfirm"
        >确 定</el-button>
        <el-button size="mini" @click="deleteVisable = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="删除提示" :visible.sync="deleteTypeVisable" width="30%" center>
      <p style="text-align: center;">
        <i class="el-icon-warning icon_warning"></i>
        <span>此操作将永久删除该功能标签, 是否继续?</span>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteTypeVisable = false">取 消</el-button>
        <el-button type="primary" @click="deleteTypeConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import axios from '@/api';
import 'swiper/dist/css/swiper.css'

import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
  name: 'tool-manage',
  data () {
    return {
      filterKey: '',
      filterType: '',
      allTypeList: [],
      tagsList: [],
      toolCountNum: '',
      toolRunNum: '',
      isSearch: false,
      isSys: false,
      deleteVisable: false, // 删除脚本弹框的控制
      deleteTypeVisable: false, // 删除类型弹窗控制
      typeId: '', // 选中的类型Id
      systemList: [
        {
          name: 'SVN代码获取',
          src: 'static/img/icon/setting.png',
          groupName: '系统默认',
          createName: '小小',
          remarks: '系统默认脚本',
          moveItem: false
        },
        {
          name: 'GIT代码获取',
          src: 'static/img/icon/setting.png',
          groupName: '系统默认',
          createName: '小小',
          remarks: '系统默认脚本',
          moveItem: false
        }
      ],
      isMore: false,
      allTagsList: [],
      allTags: [],
      hasData: false,
      typeDialog: false,
      title: '',
      dialogType: '',
      curType: '',
      newTypeName: '',
      hasApprove: false,
      scriptList: [],
      approveDialog: false,
      userList: [],
      currentUser: localStorage.getItem('userId'),
      currPage: 1,
      total: 0,
      pageSize: 10,
      checkVal: '',
      searchByname: false,
      approvaedDialog: false,
      approveStates: [
        { code: 0, message: '审核通过' },
        { code: 1, message: '审核失败' },
        { code: 'null', message: '未审核' },
        { code: 2, message: '审核中' }
      ],
      filterState: '',
      default: this.$route.query.default,
      currentId: '',
      currentScript: '', // 选中的脚本Id
      versions: '',
      swiperOption: {
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        },
        slidesPerView: 7,
        centeredSlides: false,
        slidesPerGroup: 1,
        slidesOffsetAfter: 500
      }
    }
  },
  components: {
    swiper,
    swiperSlide
  },

  mounted () {
    this.getAllType()
    this.getAllNum()
    this.getAllTagList()
    this.getAllUsersList()
    this.scriptList = this.systemList
  },
  methods: {
    validateBtn (script, btn) {
      let bol = true
      if (btn === 0) {
        if (script.isUser) {
          if (script.applyStatus !== '0') {
            bol = true
          } else {
            bol = false
          }
        } else {
          bol = false
        }
      } else {
        if (script.curUser) {
          if (btn === 1) {
            if (script.applyStatus === '' || script.applyStatus === '3') {
              bol = true
            } else {
              bol = false
            }
          } else if (btn === 2 || btn === 3) {
            if (script.applyStatus !== '2') {
              bol = true
            } else {
              bol = false
            }
          }
        } else {
          bol = false
        }
      }
      return bol
    },
    // 执行按钮的文字提示
    verdict (script) {
      let str
      if (!script.isUser) {
        str = '当前用户不是创建人，审批人中的任意一个，无法测试执行'
      } else {
        if (script.applyStatus === '0') {
          str = '审批通过后无法测试执行'
        }
      }
      return str
    },
    // 根据条件获得文字信息提示
    changeTip (script, val) {
      let str = ''
      if (!script.curUser) {
        if (val === 0) {
          str = '当前用户不是创建人，无法删除'
        } else {
          str = '当前用户不是创建人，无法编辑'
        }
      } else {
        if (script.applyStatus === '2') {
          str = '该脚本正在审批，请先撤回'
        }
      }
      return str
    },
    // 选择提示信息
    selectTip (val) {
      let str = ''
      if (!val.curUser) {
        str = '当前用户不是创建人，无法发起'
      } else {
        if (val.applyStatus === '0') {
          str = '您已发起了审批，不可重复提交'
        } else if (val.applyStatus === '1') {
          str = '您发起的审批未通过，请重新编辑再发起审批'
        } else if (val.applyStatus === '2') {
          str = '您已发起了审批，不可重复提交'
        }
      }
      return str
    },
    // 删除分类
    deleteTypes (id) {
      this.deleteTypeVisable = true
      this.typeId = id
    },
    // 查询
    search () {
      this.currPage = 1
      this.pageSize = 10
      this.isSearch = true
      this.isSys = false
      if (this.filterState === '') {
        if (this.filterKey && this.filterType == '') {
          this.searchByname = true
          this.searchOperation(5)
        } else if (this.filterKey == '' && this.filterType == '') {
          this.searchByname = false
          this.isSearch = false
          this.getAllType()
        } else {
          this.searchByname = false
          this.searchOperation(5)
        }
      } else {
        if (this.filterType) {
          this.isSearch = false
          this.searchByname = false
        } else {
          this.isSearch = true
          this.searchByname = true
        }
        if (this.filterState === 'null') {
          this.searchOperation('')
        } else {
          this.searchOperation(this.filterState)
        }
      }
    },

    searchOperation (str) {
      let params = {
        current: this.currPage,
        pageSize: this.pageSize,
        createDate: '',
        applyStatus: str,
        name: this.filterKey,
        groupId: this.filterType
      }
      axios.OpsFindByCondition(params).then(res => {
        if (res.data.code === 200) {
          this.total = parseInt(res.data.data.total)
          let data = res.data.data.records
          if (this.filterType) {
            for (let type of this.tagsList) {
              if (type.grouptagId === this.filterType) {
                type.isclick = true
              } else {
                type.isclick = false
              }
            }
          }

          let newData = this.operation(data)
          this.scriptList = newData
        }
      })
    },
    AddNewTool () {
      this.$router.push({
        path: '/AutomaticOperation/ScripOperate',
        query: {
          code: 4
        }
      })
    },
    handleCancle () {
      this.newTypeName = ''
      this.typeDialog = false
    },
    // 获取所有功能分类
    getAllType () {
      axios.OpsAllType().then(res => {
        if (res.data.function) {
          let data = res.data.function
          if (data.length) {
            this.isSys = false
            data.forEach(item => {
              item.isclick = false
              item.isShowIcon = false
            })
            if (this.default) {
              this.isSys = true
              this.scriptList = this.systemList
            } else {
              data[0].isclick = true
              let params = {
                tagType: data[0].tagType,
                grouptagId: data[0].grouptagId,
                current: this.currPage,
                pageSize: this.pageSize
              }
              this.checkVal = data[0]
              this.getScriptListById(params, 'all')
            }
          } else {
            data = []
          }

          this.tagsList = data
          this.allTypeList = data
        }
      })
    },
    getAllNum () {
      axios.OpsGetAllNumForTool().then(res => {
        if (res.data.code === 200) {
          this.toolCountNum = res.data.data.toolCountNum
          this.toolRunNum = res.data.data.toolRunNum
        }
      })
    },
    hiddenIcon () {
      for (let i of this.tagsList) {
        i.isShowIcon = false
      }
    },
    changeSysState () {
      this.currPage = 1
      this.pageSize = 10
      this.isSys = true
      for (let tag of this.tagsList) {
        tag.isclick = false
      }
      this.scriptList = this.systemList.slice(
        (this.currPage - 1) * this.pageSize,
        this.currPage * this.pageSize - 1
      )
      this.total = this.systemList.length
    },
    showIconFun (tag) {
      for (let i of this.tagsList) {
        if (i.grouptagId === tag.grouptagId) {
          i.isShowIcon = true
        } else {
          i.isShowIcon = false
        }
      }
    },
    editTypeIcon (tag) {
      this.curType = tag
      this.newTypeName = tag.name
      this.typeDialog = true
      this.title = '编辑功能标签'
      this.dialogType = 'edit'
    },
    addNewTypeDialog () {
      this.typeDialog = true
      this.title = '新增功能标签'
      this.dialogType = 'add'
    },
    changeBtnState (tag) {
      this.isSys = false
      this.checkVal = tag
      this.isSearch = false
      this.currPage = 1
      this.pageSize = 10
      for (let i of this.tagsList) {
        if (i.grouptagId === tag.grouptagId) {
          i.isclick = true
        } else {
          i.isclick = false
        }
      }

      for (let k of this.allTags) {
        for (let n of k.groupOp) {
          n.clickState = false
        }
      }

      let params = {
        tagType: tag.tagType,
        grouptagId: tag.grouptagId,
        current: this.currPage,
        pageSize: this.pageSize
      }
      this.getScriptListById(params, 'all')
    },
    loadMore () {
      this.allTags = []
      this.isMore = !this.isMore
      if (this.isMore === true) {
        this.allTags = this.allTagsList
      } else {
        this.allTags.push(this.allTagsList[0])
      }
    },
    getAllTagList () {
      axios.OpsTagsList().then(res => {
        console.log(res)
        if (res.data.code === 200) {
          let data = res.data.data.result
          if (data.length > 0) {
            for (let tag of data) {
              tag.isclcik = false
              for (let k of tag.groupOp) {
                k.clickState = false
              }
            }
            this.allTagsList = data
            this.allTags.push(data[0])
            this.hasData = true
          } else {
            this.hasData = false
          }
        } else {
          this.$notify({
            title: '提示',
            message: '数据请求失败'
          })
        }
      })
    },

    // 对应type下的标签查询对应type的脚本
    searchTag (i) {
      for (let tag in this.allTags) {
        for (let k in this.allTags[tag].groupOp) {
          if (this.allTags[tag].groupOp[k].grouptagId === i.grouptagId) {
            // k.clickState = true;
            this.$set(
              this.allTags[tag].groupOp[k],
              'clickState',
              !this.allTags[tag].groupOp[k].clickState
            )
          } else {
            this.$set(this.allTags[tag].groupOp[k], 'clickState', false)
          }
        }
      }
      let isTag = this.allTags.some(list => {
        return !!list.groupOp.some(tag => {
          return !!tag.clickState
        })
      })
      this.currPage = 1
      this.pageSize = 10
      let params = {
        tagType: 2,
        // grouptagId: i.grouptagId,
        current: this.currPage,
        pageSize: this.pageSize
      }
      if (isTag) {
        params.grouptagId = i.grouptagId
        this.getScriptListById(params, 'tag')
      } else {
        params.tagType = 1
        params.grouptagId = this.checkVal.grouptagId
        this.getScriptListById(params, 'all')
      }
    },
    // 跳转到编辑页添加审批人
    goApprove () {
      this.$router.push({
        path: '/AutomaticOperation/ScripOperate',
        query: {
          code: 4,
          toolId: this.currentId
        }
      })
    },
    goExecute (script) {
      let str = this.verdict(script)
      if (script.isUser) {
        if (script.applyStatus === '0') {
          this.$set(script, 'excuteTip', true)
          this.$notify({
            type: 'warning',
            message: str
          })
        } else {
          this.$set(script, 'excuteTip', false)
          this.$router.push({
            path: '/AutomaticOperation/ExcuteScript',
            query: {
              code: 4,
              toolId: script.toolId
            }
          })
        }
      } else {
        this.$set(script, 'excuteTip', true)
        this.$notify({
          type: 'warning',
          message: str
        })
      }
    },
    // 编辑操作
    goEdit (script) {
      let str = this.changeTip(script, 1)
      if (script.curUser) {
        if (script.applyStatus === '2') {
          this.$set(script, 'editTip', true)
          this.$confirm('当前脚本正在审批，撤回后编辑?', '提示', {
            confirmButtonText: '去撤回',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          })
            .then(() => {
              this.$router.push({
                path: '/AutomaticOperation/examineAndApprove',
                query: {
                  code: 4
                }
              })
            })
            .catch(() => {
              console.log('取消')
            })
        } else {
          this.$set(script, 'editTip', false)
          this.$router.push({
            path: '/AutomaticOperation/ScripOperate',
            query: {
              code: 4,
              toolId: script.toolId
            }
          })
        }
      } else {
        this.$set(script, 'editTip', true)
        this.$notify({
          type: 'warning',
          message: str
        })
      }
    },
    // 删除操作
    goDelete (script) {
      let str = this.changeTip(script, 0)
      if (script.curUser) {
        if (script.applyStatus === '2') {
          this.$set(script, 'deleteTip', true)
          this.$alert('该脚本正在审批，无法删除', '确认提示', {
            confirmButtonText: '确定',
            callback: action => {
              console.log('已取消')
            }
          })
        } else {
          this.currentScript = script.toolId
          this.deleteVisable = true
          // 改变点击时提示状态
          this.$set(script, 'deleteTip', false)
        }
      } else {
        this.$set(script, 'deleteTip', true)
        this.$notify({
          type: 'warning',
          message: str
        })
      }
    },
    // 查看跳转
    goWatch (id) {
      if (id) {
        this.$router.push({
          path: '/AutomaticOperation/WatchScript',
          query: {
            code: 4,
            toolId: id
          }
        })
      }
    },
    // 页数的切换
    handleCurrentChange (page) {
      this.currPage = page
      if (this.isSearch) {
        this.searchOperation()
      } else {
        if (this.isSys) {
          this.scriptList = this.systemList.slice(
            (page - 1) * this.pageSize,
            page * this.pageSize - 1
          )
        } else {
          let params = {
            tagType: this.checkVal.tagType,
            grouptagId: this.checkVal.grouptagId,
            current: this.currPage,
            pageSize: this.pageSize
          }
          this.getScriptListById(params, 'all')
        }
      }
    },
    // 页面size的切换
    handleSizeChange (val) {
      this.pageSize = val
      if (this.isSearch) {
        this.searchOperation()
      } else {
        if (this.isSys) {
          this.scriptList = this.systemList.slice(
            (this.currPage - 1) * this.pageSize,
            this.currPage * this.pageSize - 1
          )
        } else {
          let params = {
            tagType: this.checkVal.tagType,
            grouptagId: this.checkVal.grouptagId,
            current: this.currPage,
            pageSize: this.pageSize
          }
          this.getScriptListById(params, 'all')
        }
      }
    },
    // 提交审批
    handleApprove () {
      let params = {
        businessType: 1,
        businessId: this.currentId,
        version: this.versions
      }
      axios.OpsAuditLogaAdd(params).then(res => {
        if (res.data.code === 200) {
          this.approveDialog = false
          this.$notify({
            type: 'success',
            message: '审批提交成功'
          })
          this.hasApprove = false
          this.approveList = []
          this.changeBtnState(this.checkVal)
        } else {
          this.$notify({
            type: 'error',
            message: res.data.message
          })
        }
      })
    },
    // 审批弹窗
    openApproveDialog (tool) {
      let str = this.selectTip(tool)
      if (tool.isUser) {
        if (
          (tool.applyStatus === '' || tool.applyStatus === '3') &&
          tool.curUser
        ) {
          this.$set(tool, 'approveTip', false)
          this.currentId = tool.toolId
          this.versions = tool.toolVersion
          this.currentTool = tool
          let params = {
            approvalids: [],
            state: 1,
            toolId: tool.toolId
          }
          axios.OpsScriptApprove(params).then(res => {
            this.approveDialog = true
            if (res.data.result && res.data.result !== '[]') {
              let data = JSON.parse(res.data.result)
              data.forEach(item => {
                this.userList.forEach(user => {
                  if (item.userId === user.userId) {
                    item.name = user.name
                    item.photo = user.photo
                  }
                })
              })
              this.approveList = data
              this.hasApprove = true
            }
          })
        } else {
          this.$set(tool, 'approveTip', true)
          this.$notify({
            type: 'warning',
            message: str
          })
        }
      } else {
        this.$set(tool, 'approveTip', true)
        this.$notify({
          type: 'warning',
          message: str
        })
      }
    },
    // 添加分类或标签
    confirmType () {
      if (this.dialogType === 'add') {
        let params = {
          grouptagId: '',
          name: this.newTypeName,
          tagType: 1 // 1是分类 2是标签
        }
        axios.OpsAddNewType(params).then(res => {
          if (res.data.result) {
            this.getAllType()
            this.$notify({
              title: '提示',
              message: '添加成功'
            })
          } else {
            this.$notify({
              title: '提示',
              message: res.data.status.info
            })
          }
        })
      } else if (this.dialogType === 'edit') {
        let params = {
          grouptagId: this.curType.grouptagId,
          name: this.newTypeName
        }
        axios.OpsEditTypeOrTag(params).then(res => {
          if (res.data.status.index == 202) {
            this.getAllType()
            this.$notify({
              title: '提示',
              message: '修改成功'
            })
          } else {
            this.$notify({
              title: '提示',
              message: '修改失败'
            })
          }
        })
      }
      this.typeDialog = false
    },
    // 获取所有用户列表
    getAllUsersList () {
      axios.userList({
        condition: '',
        current: 1,
        online: false,
        roleIds: [],
        size: 20,
        userStatus: ''
      }).then(res => {
        if (res.data.code === 200) {
          this.userList = res.data.data.result.records
        }
      })
    },
    mouseEnter (value, str) {
      if (str === 'sys') {
        this.systemList.map(item => {
          if (item.scriptName === value.scriptName) {
            item.moveItem = true
          } else {
            item.moveItem = false
          }
        })
      } else if (str === 'other') {
        this.scriptList.forEach(item => {
          if (item.name === value.name) {
            item.moveItem = true
          } else {
            item.moveItem = false
          }
        })
      }
    },
    mouseLeave (value, str) {
      if (str === 'sys') {
        this.systemList.map(item => {
          item.moveItem = false
        })
      } else if (str === 'other') {
        this.scriptList.forEach(item => {
          item.moveItem = false
        })
      }
    },

    // 点击标签查询对应的脚本
    getScriptListById (option, str) {
      this.currentType = ''
      this.scriptList = []
      axios.OpsScriptListById(option).then(res => {
        if (res.data.code === 200) {
          this.total = parseInt(res.data.data.total)
          let data = res.data.data.records
          let newData = this.operation(data)
          if (str === 'tag') {
            let TypeOfTag = []
            for (let k of newData) {
              if (k.groupId === this.checkVal.grouptagId) {
                TypeOfTag.push(k)
              }
            }
            this.scriptList = TypeOfTag
            this.total = this.scriptList.length
          } else {
            this.scriptList = newData
          }
        }
      })
    },
    // 判断是否是创建人，审批人，抄送人
    operation (data) {
      data.forEach(item => {
        let userArr = []
        userArr.push(item.createBy)
        if (item.approvalids) {
          let approvalids = JSON.parse(item.approvalids)
          approvalids.forEach(it => {
            userArr.push(it.userId)
          })
        }
        let currentUser = localStorage.getItem('userId')
        if (currentUser === item.createBy) {
          item.curUser = true
        } else {
          item.curUser = false
        }
        if (userArr.indexOf(currentUser) > -1) {
          item.isUser = true
        } else {
          item.isUser = false
        }
        item.moveItem = false
      })

      return data
    },
    // 删除提示的确认
    handleConfirm () {
      // 删除请求
      axios.OpsDeleteTools(this.currentScript).then(res => {
        if (res.data.code === 200) {
          let params = {
            tagType: this.checkVal.tagType,
            grouptagId: this.checkVal.grouptagId,
            current: this.currPage,
            pageSize: this.pageSize
          }
          // 删除后刷新
          this.getScriptListById(params, 'all')
          this.$notify({
            type: 'success',
            message: '删除成功'
          })
        } else if (res.data.code === 500) {
          this.$message({
            type: 'success',
            message: res.data.message
          })
        } else {
          this.$notify({
            type: 'error',
            message: '删除失败'
          })
        }
        this.deleteVisable = false
      })
    },
    // 删除类型确认
    deleteTypeConfirm () {
      axios.OpsDeleteType(this.typeId).then(res => {
        if (res.data.code == 200) {
          this.$notify({
            type: 'success',
            message: '删除成功'
          })
          this.getAllType()
        } else {
          this.$notify({
            type: 'error',
            message: res.data.message
          })
        }
        this.deleteTypeVisable = false
      })
    }
  }
}
</script>
<style scoped>
.tool-list {
  padding: 20px;
  box-sizing: border-box;
  margin-top: 10px;
  margin-left: 10px;
}
.info-box {
  font-size: 15px;
  color: #898989;
}
.container-wrapper {
  padding: 20px 0;
}
.container-wrapper .tabs-wrapper {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-bottom: 3px solid #ececec;
  overflow: hidden;
}
.left-btn-box {
  position: relative;
  width: 24px;
  left: -20px;
}
.right-btn-box {
  position: relative;
  width: 24px;
}
.left-loop:focus,
.right-loop:focus {
  outline: none !important;
}
.tabs-box-width {
  width: 70%;
  height: 29px !important;
  overflow: hidden;
  margin-right: 20px;
  position: relative;
}
.tabs-box-width /deep/ .swiper-container {
  height: 100% !important;
}
.system {
  width: 8%;
}
.container-wrapper .tabs-wrapper .tabs-box-width .tag-item,
.container-wrapper .tabs-wrapper .tag-item {
  padding: 0 10px;
  width: 110px !important;
  line-height: 30px;
  margin-right: 20px;
  text-align: center;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  cursor: pointer;
  position: relative;
  font-size: 14px;
  color: #9d9d9d;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tag-item > span {
  vertical-align: middle;
  width: 100%;
  line-height: 30px;
}
.tag-item > .deleteBtn {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 100;
}
.tag-item > .editBtn {
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 10;
}
.tag-item-other {
  width: 120px !important;
  font-size: 13px;
  color: #fff !important;
  height: 30px;
  background-color: #00A8E8;
  border-top-left-radius: 14px !important;
  border-top-right-radius: 14px !important;
  border-radius: 14px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
}
.tag-item-other > img {
  width: 18px;
  height: 18px;
  vertical-align: middle;
}
.container-wrapper .tagList-box {
  min-height: 40px;
}
.container-wrapper .tagList-box > ul > .label-block {
  font-size: 15px;
}
.container-wrapper .tagList-box > ul > .label-block > div {
  padding: 10px 0;
}
.container-wrapper .tagList-box > ul > .label-block > div > label {
  padding-left: 10px;
  color: #585858;
}
.container-wrapper .tagList-box > .more-btn {
  padding: 5px;
  font-size: 14px;
  color: #979797;
  float: right;
  cursor: pointer;
}
.container-wrapper .tagList-box > ul > .label-block > ul > .node-block {
  padding: 6px 20px;
  text-align: center;
  display: inline-block;
  box-shadow: 0 0 8px #ccc;
  background-color: #fff;
  border-radius: 14px;
  margin: 6px 10px;
  font-size: 14px;
  color: #777;
  cursor: pointer;
}
.scriptList {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
}
.scriptList > ul {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
.scriptList > ul > li {
  background-color: #fff;
  display: flex;
  float: left;
  height: 140px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
  width: 16%;
  margin: 20px 0.8% 0 0.8%;
  border-radius: 6px;
  position: relative;
}
.scriptList > ul > li > span {
  color: #585858;
}
.scriptList > ul > li > img {
  padding-bottom: 10px;
  margin-top: 10px;
}
.scriptList > ul > li .marsk {
  position: absolute;
  top: 6px;
  right: 10px;
}
.scriptList > ul > li .marsk > img {
  width: 16px;
  height: 16px;
  cursor: pointer;
  margin-right: 3px;
}
.scriptList > ul > li .demark {
  position: absolute;
  bottom: -162px;
  left: 0;
  width: 105%;
  height: 120px;
  background-color: #fff;
  box-shadow: 0 0 5px #e0e0e0;
  border-radius: 5px;
  padding: 20px;
  font-size: 14px;
  color: #3e444a;
  z-index: 100;
}
.scriptList > ul > li .demark > p {
  padding: 10px 0;
  width: 86%;
  border-bottom: 1px solid #e5e5e5;
  font-size: 18px;
  color: #585858;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.scriptList > ul > li .demark > ul {
  padding: 0 20px;
}
.scriptList > ul > li .demark > ul > li {
  line-height: 26px;
  color: #3e444a;
  font-size: 12px;
}
.info-box {
  font-size: 15px;
  color: #898989;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
  -webkit-transition: all 0.5s ease;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
  transform: translateY(120px);
}
.depp {
  border-top: 2px solid #00A8E8 !important;
  border-left: 2px solid #00A8E8 !important;
  border-right: 2px solid #00A8E8 !important;
  color: #00A8E8 !important;
}
.more {
  background-color: #f7f7f7;
}
.margin-right {
  margin-right: 40px;
}
.pagination-box {
  display: block;
  min-height: 40px;
}
.font-block {
  font-size: 20px;
  color: #585858;
  font-weight: bold;
}
.success {
  border: 1px solid #67c23a;
}
.error {
  border: 1px solid #f56c6c;
}
.content-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.none {
  border: none;
}
.clear {
  clear: both;
}
.search {
  border: 1px solid #00A8E8;
  box-shadow: 0 0 6px #00A8E8 !important;
}
.canClick {
  color: #00A8E8;
  cursor: pointer !important;
}
.notClick {
  color: #777;
  cursor: not-allowed !important;
}
.icon_png {
  font-size: 20px !important;
}
.item-temp {
  float: right;
}
.addbutton {
  background-color: #0280ff !important;
}
.last-slide {
  border: none !important;
}
.name-limit {
  width: 90%;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.icon_warning {
  font-size: 24px;
  color: #e6a23c;
  vertical-align: middle;
}
.demo-form-inline {
  margin-right: 0 !important;
}
</style>
