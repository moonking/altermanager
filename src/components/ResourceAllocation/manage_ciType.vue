<template>
  <div class="containBox aibms-color-bg">
    <div class="head">
      <el-row type="flex" :gutter="20" class="flexsty">
        <el-col :span="4">
          <el-input v-model="ciName" clearable placeholder="CI类型名称"></el-input>
        </el-col>
        <el-col :span="4">
          <el-select v-model="selectValue" placeholder="选择模板">
            <el-option label="选择模板" value></el-option>
            <el-option
              v-for="item in templates"
              :key="item.templateId"
              :label="item.name"
              :value="item.templateId"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="4" class="search-wrapper item-right">
          <el-button type="primary" icon="el-icon-search" @click="searchCitype">搜索</el-button>
          <!-- <el-button
            class="cm-form-btn cm-search-btn search"
            @click="searchCitype()"
            :style="{backgroundSize: '25%'}"
          >查找</el-button> -->
        </el-col>
      </el-row>
    </div>

    <el-row :gutter="20" class="content-wrapper">
      <el-col :span="6">
        <div class="fatherMenu1">
          <ul class="fatherMenu-ul">
            <!-- style="cursor:pointer;color:#fff;font-size:1.1rem;font-weight:bolder;background-color: #423be2;" -->
            <li class="lione" @click="newCreateCI">
              <!-- <el-button class="cm-form-btn cm-add-btn other" size="medium">
            新增分类
              </el-button>-->
             新增分类
            </li>
            <li
              v-for="(item,index) in ciNames"
              :key="item.cigroupId"
              class="li-item"
              :class="{highLight:item.addHighLight}"
            >
              <div
                style="width:75%;float:left;text-overflow: ellipsis; white-space: nowrap;overflow: hidden;"
                @click="getCiTypeId(index,item.cigroupId,item.name)"
                :title="item.name"
              >
                <span>{{item.name}}</span>
              </div>
              <el-tooltip class="item" effect="light" content="编辑" placement="top-start">
                <div style="width:10%;float:right;" class="editicon">
                  <span @click="getCiDetail(item.cigroupId)">
                    <icon-svg icon-class="edit" class="gray-icon-color" />
                  </span>
                </div>
              </el-tooltip>
            </li>
          </ul>
        </div>

        <div class="sonMenu">
          <ul class="sonMenu-ul">
            <li @click="showRightContent()" class="lione">新增CI类型</li>
            <li
              v-for="(ci) in cis"
              :key="ci.citypeId"
              @click="showCiDetail(ci.cigroupId,ci.citypeId)"
              :class="{activeColor:ci.active,selectedColor:ci.selected}"
              class="li-item"
            >
              <div class="iconImg_wrapper">
                <img
                  :src="ci.icon"
                  style="width:20px;height:20px;line-height:20px;margin-top: 10px;"
                />
              </div>
              <div
                :title="ci.name"
                style="text-align:left;float:right;width:80px;text-overflow: ellipsis; white-space: nowrap;overflow: hidden;display: inline-block;"
              >{{ci.name}}</div>
            </li>
          </ul>
        </div>
      </el-col>

      <el-col :span="3">&nbsp;</el-col>

      <!--编辑分类及删除分类的弹框-->
      <el-col :span="14" class="edit-content" v-if="confirmEdit">
        <el-row style="margin-bottom:4rem">
          <el-col :span="21">
            <el-row class="newCITitle" style="margin-left:5.5rem">
              <span>编辑分类</span>
            </el-row>
          </el-col>
          <el-col :span="3">
            <el-tooltip class="item" effect="light" content="删除" placement="top">
              <!-- <i
                class="el-icon-delete newCITitle deleteIcon"
                @click="showEditDelete"
                style="font-size:2rem;cursor:pointer;"
              ></i>-->
              <div @click="showEditDelete" class="delicon">
                <icon-svg icon-class="lajitong" class="gray-icon-color" />
              </div>
            </el-tooltip>
          </el-col>
        </el-row>
        <el-row style="margin-bottom:10rem">
          <el-col :span="4">&nbsp;</el-col>
          <el-col :span="5">
            <span style="color:red;font-size:1.2rem">*</span>
            <span style="font-size:1rem;">分类名称:</span>
          </el-col>
          <el-col :span="10">
            <el-input
              v-model="editCiName"
              autocomplete="off"
              maxlength="10"
              :input="editInputFun(editCiName)"
              @focus="focusEdit(editCiName)"
              @blur="blurEditCI($event)"
            ></el-input>
          </el-col>
          <el-col :span="2" style="margin-left:1rem;margin-top:0.7rem;">
            <span>{{editNumber}}</span>/
            <span :class="editNumber==10 ? 'redColor':''">{{editTotalNumber}}</span>
          </el-col>
          <el-col :span="1">
            <i class="el-icon-error mrgTop" v-if="showEditRedError"></i>
          </el-col>
        </el-row>
        <el-row v-if="showEditSaveBtn">
          <el-col :span="6">&nbsp;</el-col>
          <el-col :span="2">
            <el-button
              type="primary"
              @click="editCi(editcigroupId)"
            >保 存</el-button>
          </el-col>
          <el-col :span="8">&nbsp;</el-col>
          <el-col :span="2">
            <el-button
              class="nomal-button"
              @click="returnEdit()"
              id="cancelEdit"
            >取 消</el-button>
          </el-col>
        </el-row>
      </el-col>

      <!--编辑分类的删除弹框：-->
      <el-dialog
        center
        title
        :visible.sync="editDeleteDialogVisible"
        width="26%"
        :modal="false"
        style="margin-top:20vh;"
      >
        <p style="font-size:25px;font-weight:bolder;text-align:center;margin-bottom:1rem">确认删除？</p>

        <div class="confirmDeleteDialog-footer-wrapper">
          <span slot="footer" class="confirmDeleteDialog-footer">
            <el-button
              type="primary"
              @click="confirmEditDelete(editcigroupId)"
            >确 认</el-button>
            <el-button
              class="nomal-button"
              @click="editDeleteDialogVisible = false"
            >取 消</el-button>
          </span>
        </div>
      </el-dialog>

      <!--编辑删除异常的提示框：-->
      <el-dialog
        center
        title="提示"
        :visible.sync="editDeleteTitle"
        width="30%"
        :modal="false"
        style="margin-top:20vh"
      >
        <p style="font-size:1rem;font-weight:bolder;text-align:center;margin-bottom:1rem">无法删除该分类</p>
        <p style="text-align: center">当前分类有CI类型，删除其CI类型，才可以删除该分类</p>
        <div class="deleteDialog-footer-wrapper">
          <span slot="footer" class="deleteDialog-footer">
            <el-button @click="editDeleteTitle = false">知道了</el-button>
          </span>
        </div>
      </el-dialog>

      <!--新增CI类型的内容：-->
      <el-col :span="14" class="right-content white-color all-aibms-color-bg non-shadow non-border" v-if="showRight">
        <div :class="flag=='1' ? 'exceptStoreBtn':'exceptStoreBtnTotop'">
          <el-row class="newCITitle">
            <span>新增CI类型</span>
          </el-row>

          <!--名称-->
          <el-row class="newCIName">
            <el-form
              :model="ruleForm2"
              :rules="rules2"
              ref="ruleForm2"
              label-width="100px"
              class="demo-ruleForm"
            >
              <el-form-item label="名称" prop="newCI_input">
                <el-input
                  v-model="ruleForm2.newCI_input"
                  autocomplete="off"
                  maxlength="20"
                  @input="inputFun(ruleForm2.newCI_input)"
                  @blur="blurFun"
                ></el-input>
                <span>{{number}}</span>/
                <span :class="number==20 ? 'redColor':''">{{totalNumber}}</span>
              </el-form-item>
            </el-form>
          </el-row>
          <!-- <el-row class="newCIName">
            <el-col :span="5">&nbsp;</el-col>
            <el-col :span="2">
              <span style="color:red">*</span>
              <span style="font-size:0.9rem;">名称:</span>
            </el-col>
            <el-col :span="10">
              <el-input
                v-model="newCI_input"
                autocomplete="off"
                maxlength="20"
                @input="inputFun(newCI_input)"
                @blur="blurFun"
              ></el-input>
            </el-col>
            <el-col :span="2" style="margin-left:1rem;margin-top:0.7rem;">
              <span>{{number}}</span>/
              <span :class="number==20 ? 'redColor':''">{{totalNumber}}</span>
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="1">
              <i class="el-icon-error mrgTop" v-if="showRedIcon"></i>
              <i class="el-icon-success mrgTop" v-if="showSuccess"></i>
            </el-col>
          </el-row>-->
          <!--图标-->
          <el-row class="newIcon">
            <el-col :span="5">&nbsp;</el-col>
            <el-col :span="2">
              <span style="color:red">*</span>
              <span style="font-size:0.9rem;">图标:</span>
            </el-col>
            <el-col :span="3">
              <div class="newIconWrapper">
                <img :src="iconSrc" class="icons" />
              </div>
            </el-col>
            <el-col :span="3" class="button-wrapper">
              <el-button
                size="medium"
                @click="iconDialogVisible=true"
                style="font-size:0.95rem"
              >+选择图标</el-button>
            </el-col>
            <el-col :span="2">&nbsp;</el-col>
            <el-col :span="1">
              <i class="el-icon-error mrgTop" v-if="showRedError"></i>
              <i class="el-icon-success mrgTop" v-if="showIconSuccess"></i>
            </el-col>
          </el-row>

          <el-row style="margin-bottom:3rem;">
            <el-col :span="7">&nbsp;</el-col>
            <el-col :span="5">
              <span style="color:red;font-size:0.9rem" v-if="iconSrc==''">请选择一个图标</span>
            </el-col>
          </el-row>

          <!--模板：-->
          <el-row :gutter="5">
            <el-col :span="5">&nbsp;</el-col>
            <el-col :span="2">
              <span>&nbsp;</span>
              <span style="font-size:0.9rem;">模板:</span>
            </el-col>
            <el-col :span="7">
              <div style="height:2.3rem;border:1px solid lightgray" @click="focusFun()">
                <el-button v-if="templet">{{templet}}</el-button>
              </div>
            </el-col>
            <el-col :span="3" class="templet-wrapper">
              <el-button size="medium" @click="chooseTempletBtn()" style="font-size:0.95rem">+选择模板</el-button>
            </el-col>
            <el-col :span="2">&nbsp;</el-col>
            <el-col :span="5">
              <span style="color:#00A8E8;font-size:0.95rem;cursor: pointer;" @click="routeTo()">管理模板</span>
            </el-col>
          </el-row>

          <!--模板下拉的内容-->
          <transition name="fade">
            <el-row v-if="showTemplet">
              <el-col :span="7">&nbsp;</el-col>
              <el-col :span="10">
                <div class="down-wrapper">
                  <el-row style="margin-bottom:1rem">
                    <el-col :span="15">
                      <el-input v-model="templetInput"></el-input>
                    </el-col>
                    <el-col :span="2">&nbsp;</el-col>
                    <el-col :span="5" class="smallbtn-wrapper">
                      <el-button size="medium" @click="fuzzySearch">查找</el-button>
                    </el-col>
                  </el-row>
                  <!--图标的内容未添加-->
                  <el-row>
                    <el-col
                      :span="6"
                      v-for="(item,index) in templates"
                      :key="index"
                      style="margin-left:1rem;margin-bottom:1rem"
                    >
                      <el-button size="mini" @click="chooseTemplet(item)">{{item.name}}</el-button>
                    </el-col>
                  </el-row>
                </div>
              </el-col>
            </el-row>
          </transition>
          <el-row v-if="showSaveBtn" style="margin-top: 30px;">
            <el-col :span="6">&nbsp;</el-col>
            <el-col :span="2">
              <el-button
                type="primary"
                @click="submitCiItem(1)"
              >保 存</el-button>
            </el-col>
            <el-col :span="8">&nbsp;</el-col>
            <el-col :span="2">
              <el-button
                class="nomal-button"
                @click="returnNewciType()"
              >取 消</el-button>
            </el-col>
          </el-row>
        </div>
        <!--保存和取消-->
      </el-col>

      <!--CI类型详情：-->
      <el-col :span="14" class="ciDetail-wrapper non-shadow all-aibms-color-bg non-border white-color" v-if="ciTypeShow">
        <el-row>
          <el-col :span="21">
            <el-row class="newCITitle" style="margin-left:5.5rem">
              <span>类型详情</span>
            </el-row>
          </el-col>
          <el-col :span="3">
            <el-tooltip class="item" effect="light" content="删除" placement="top">
              <!-- <i
                class="el-icon-delete newCITitle deleteIcon"
                @click="confirmDeleteCiType"
                style="font-size:2rem;cursor:pointer"
              ></i>-->
              <div @click="confirmDeleteCiType" class="delicon">
                <icon-svg icon-class="lajitong" class="gray-icon-color" />
              </div>
            </el-tooltip>
          </el-col>
        </el-row>

        <el-row class="nameWrapper">
          <!-- 表单 -->
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="名称" prop="name">
              <el-input
                v-model="ruleForm.name"
                @input="getUpdateNum(ruleForm.name)"
                autocomplete="off"
                maxlength="20"
                @focus="focusUpdate"
                @blur="blurUpdate($event)"
              ></el-input>
              <span>{{updateCiTypeNum}}</span>/
              <span :class="updateCiTypeNum==20 ? 'redColor':''">{{updateCiTypeTotalNum}}</span>
            </el-form-item>
            <el-form-item label="分类" prop="classification">
              <el-select v-model="ruleForm.classification">
                <el-option
                  v-for="item in ciNames"
                  :key="item.citypeId"
                  :label="item.name"
                  :value="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <!-- 原表单 -->
          <!-- <el-col :span="5">&nbsp;</el-col>
          <el-col :span="2">
            <span style="color:red">*</span>
            <span style="font-size:0.9rem;">名称:</span>
          </el-col>
          <el-col :span="10">
            <el-input
              v-model="name"
              :input="getUpdateNum(name)"
              autocomplete="off"
              maxlength="20"
              @focus="focusUpdate"
              @blur="blurUpdate($event)"
            ></el-input>
          </el-col>-->
          <!-- <el-col :span="1">&nbsp;</el-col>
          <el-col :span="2">
            <span>{{updateCiTypeNum}}</span>/
            <span :class="updateCiTypeNum==20 ? 'redColor':''">{{updateCiTypeTotalNum}}</span>
          </el-col>-->

          <!-- <el-col :span="1">&nbsp;</el-col>
          <el-col :span="1">
            <i class="el-icon-error mrgTop" v-if="showRedError1"></i>
            <i class="el-icon-success mrgTop" v-if="showSuccess1"></i>
          </el-col>-->
        </el-row>

        <!-- <el-row class="classificationWrapper">
          <el-col :span="5">&nbsp;</el-col>
          <el-col :span="2">
            <span style="color:red">*</span>
            <span style="font-size:0.9rem;">分类:</span>
          </el-col>
          <el-col :span="10">
            <el-select v-model="classification" @focus="selected">
              <el-option
                v-for="item in ciNames"
                :key="item.citypeId"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="1">
            <i class="el-icon-error mrgTop" v-if="showRedError2"></i>
          </el-col>
        </el-row>-->

        <el-row class="detail-icon">
          <el-col :span="5">&nbsp;</el-col>
          <el-col :span="2">
            <span style="color:red">*</span>
            <span style="font-size:0.9rem;">图标:</span>
          </el-col>
          <el-col :span="3">
            <div style="width:3rem;height:3rem;">
              <img :src="ciIconVlue" alt style="width:25px" />
            </div>
          </el-col>
          <el-col :span="3" class="updateIconBtn">
            <el-button size="medium" @click="updateIcon()">修改图标</el-button>
          </el-col>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="1">
            <i class="el-icon-error mrgTop" v-if="showRedError3"></i>
          </el-col>
        </el-row>
        <!-- <el-row class="nameWrapper">

          <el-col :span="5">&nbsp;</el-col>
          <el-col :span="2">
            <span style="color:red">*</span>
            <span style="font-size:0.9rem;">模板:</span>
          </el-col>
          <el-col :span="10">
            <el-input  v-model="CItemplate" disabled></el-input>
          </el-col>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="2">
          </el-col>

          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="1">
          </el-col>
        </el-row>-->
        <el-row>
          <el-col :span="5">&nbsp;</el-col>
          <el-col :span="2">
            <span>&nbsp;</span>
            <span style="font-size:0.9rem;">模板:</span>
          </el-col>
          <el-col :span="7">
            <div style="height:2.3rem;border:1px solid lightgray" @click="focusFun()">
              <el-button v-if="templet">{{templet}}</el-button>
            </div>
          </el-col>
          <el-col :span="3" class="templet-wrapper">
            <el-button size="medium" @click="chooseTempletBtn()" style="font-size:0.95rem">+选择模板</el-button>
          </el-col>
          <el-col :span="2">&nbsp;</el-col>
          <el-col :span="5">
            <span style="color:#00A8E8;font-size:0.95rem;cursor: pointer;" @click="routeTo()">管理模板</span>
          </el-col>
        </el-row>
        <transition name="fade">
          <el-row v-if="showTemplet">
            <el-col :span="7">&nbsp;</el-col>
            <el-col :span="10">
              <div class="down-wrapper">
                <el-row style="margin-bottom:1rem">
                  <el-col :span="15">
                    <el-input v-model="templetInput"></el-input>
                  </el-col>
                  <el-col :span="2">&nbsp;</el-col>
                  <el-col :span="5" class="smallbtn-wrapper">
                    <el-button size="medium" @click="fuzzySearch">查找</el-button>
                  </el-col>
                </el-row>
                <!--图标的内容未添加-->
                <el-row>
                  <el-col
                    :span="6"
                    v-for="(item,index) in templates"
                    :key="index"
                    style="margin-left:1rem;margin-bottom:1rem"
                  >
                    <el-button size="mini" @click="chooseTemplet(item)">{{item.name}}</el-button>
                  </el-col>
                </el-row>
              </div>
            </el-col>
          </el-row>
        </transition>
        <!--保存和取消-->
        <el-row style="margin-top:7rem">
          <!-- <el-row style="margin-top:7rem" v-if="showDetailSaveBtn"> -->
          <el-col :span="6">&nbsp;</el-col>
          <el-col :span="2">
            <el-button
              type="primary"
              @click="submitUpdatedDetail()"
            >保 存</el-button>
          </el-col>
          <el-col :span="8">&nbsp;</el-col>
          <el-col :span="2">
            <el-button
              class="nomal-button"
              @click="returnBtn()"
              id="cancel"
            >取 消</el-button>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="1">&nbsp;</el-col>
    </el-row>
    <!--修改图标的弹框：-->
    <el-dialog
      center
      title
      :visible.sync="updateIconDialogVisible"
      width="40%"
      :modal="true"
      style="margin-top:20vh"
      @close="closeUpdateIconDialog"
    >
      <el-row style="margin-bottom:1rem">
        <el-col :span="15">
          <el-input v-model="updatedIcon" placeholder="图标名称"></el-input>
        </el-col>
        <el-col :span="2">&nbsp;</el-col>
        <el-col :span="5" class="smallbtn-wrapper">
          <el-button size="medium" @click="updateIcon_search()">搜索</el-button>
        </el-col>
      </el-row>
      <el-row class="icon-wrapper">
        <el-col
          :span="3"
          class="icon-border"
          v-for="(item,index) in allupdatedIcons"
          :key="index"
          :class="{'blueBorder':hoverUpdatedIndex==index}"
          style="line-height: 5.6rem"
        >
          <el-tooltip class="item" effect="dark" :content="item.tooltips" placement="top">
            <img
              class="addimg item-icons"
              :src="item.img"
              @mouseover="hoverUpdatedIndex=index"
              @click="getUpdatedIconName(item.tooltips,item.img)"
            />
          </el-tooltip>
        </el-col>
      </el-row>
    </el-dialog>

    <!--图标选择的弹框：-->
    <el-dialog
      center
      title
      :visible.sync="iconDialogVisible"
      width="40%"
      :modal="true"
      style="margin-top:20vh"
      @close="closeIconDialog"
    >
      <el-row style="margin-bottom:1rem">
        <el-col :span="15">
          <el-input v-model="icon" placeholder="图标名称"></el-input>
        </el-col>
        <el-col :span="2">&nbsp;</el-col>
        <el-col :span="5" class="smallbtn-wrapper">
          <el-button size="medium" @click="searchIcon()">搜索</el-button>
        </el-col>
      </el-row>

      <el-row class="icon-wrapper">
        <el-col
          :span="3"
          class="icon-border"
          v-for="(item,index) in allIcons"
          :key="index"
          :class="{'blueBorder':hoverIndex==index}"
          style="line-height: 5.6rem"
        >
          <el-tooltip class="item" effect="dark" :content="item.tooltips" placement="top">
            <img
              class="addimg"
              :src="item.img "
              @mouseover="hoverIndex=index"
              @click="getIconName(item.tooltips,item.img)"
            />
          </el-tooltip>
        </el-col>
      </el-row>
    </el-dialog>

    <!--新增分类的弹框：-->
    <el-dialog
      title="新增分类"
      :visible.sync="centerDialogVisible"
      :before-close="handleDialogClose"
      width="35%"
      style="margin-top:20vh"
      center
    >
      <el-form
        :model="ruleForm3"
        :rules="rules3"
        ref="ruleForm3"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称" prop="classifyName">
          <el-input
            v-model="ruleForm3.classifyName"
            @input="getcityNameLength(ruleForm3.classifyName)"
            autocomplete="off"
            maxlength="10"
          ></el-input>
          <span>{{citypeNum}}</span>/
          <span :class="citypeNum==10 ? 'redColor':''">{{citypeTotalNum}}</span>
        </el-form-item>
      </el-form>
      <!-- <div class="dialog-input-wrapper">
        <el-col :span="4" style="font-size:0.9rem;">分类名称:</el-col>
        <el-col :span="16">
          <el-input
            v-model="classifyName"
            :input="getcityNameLength(classifyName)"
            autocomplete="off"
            maxlength="10"
          ></el-input>
        </el-col>
        <el-col :span="1">&nbsp;</el-col>

        <el-col :span="3">
          <span>{{citypeNum}}</span>/
          <span :class="citypeNum==10 ? 'redColor':''">{{citypeTotalNum}}</span>
        </el-col>
      </div>-->
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="createNewType()"
        >确认新增</el-button>
        <el-button
          class="nomal-button"
          @click="cancelCreateNewType()"
        >取 消</el-button>
      </span>
    </el-dialog>

    <!--删除ci类型的提示-->
    <el-dialog
      center
      title="提示"
      :visible.sync="deleteDialogVisible"
      width="30%"
      :modal="false"
      style="margin-top:20vh"
    >
      <p style="font-size:1rem;font-weight:bolder;text-align:center;margin-bottom:1rem">无法删除该类型</p>
      <p style="text-align: center">当前类型下有CI项，删除其CI项，才可以删除该类型</p>
      <div class="deleteDialog-footer-wrapper">
        <span slot="footer" class="deleteDialog-footer">
          <el-button @click="deleteDialogVisible = false">知道了</el-button>
        </span>
      </div>
    </el-dialog>

    <!--确认是否删除弹框-->
    <el-dialog
      center
      title
      :visible.sync="confirmDeleteDialogVisible"
      width="26%"
      :modal="false"
      style="margin-top:20vh;"
    >
      <p style="font-size:25px;font-weight:bolder;text-align:center;margin-bottom:1rem">确认删除？</p>

      <div class="confirmDeleteDialog-footer-wrapper">
        <span slot="footer" class="confirmDeleteDialog-footer">
          <el-button style="background-color:#00A8E8;color:#fff" @click="deleteCiType()">确 认</el-button>
          <el-button
            style="color:#00A8E8;border:1px solid #00A8E8;"
            @click="confirmDeleteDialogVisible = false"
          >取 消</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from '@/api';
export default {
  data () {
    var validateloginName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入名称'))
      } else if (!/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(value)) {
        callback(new Error('名称不符合规范'))
      } else {
        callback()
      }
    }
    var validateNewName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('分类名称不能为空'))
      } else if (!/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(value)) {
        callback(new Error('名称只可以包含字母，数字，中文字符和下划线'))
      } else {
        callback()
      }
    }
    return {
      showEditRedError: false,
      showSuccess1: false,
      ciTypeColor: '#303133',
      addHighLight: false,
      flag: 0,
      editDeleteTitle: false,
      editDeleteDialogVisible: false,
      iscollapse: true,
      openeds: [],
      showEditSaveBtn: false,
      editNumber: 0,
      editTotalNumber: 10,
      editCiName: '',
      confirmEdit: false,
      activeIndex: '',
      confirmDeleteDialogVisible: false,
      deleteDialogVisible: false,
      showRedError1: false,
      showRedError2: false,
      showRedError3: false,
      updateCiTypeNum: 0,
      updateCiTypeTotalNum: 20,
      updatedIcons: [
        {
          img: 'static/img/ci/ciIcon1.png',
          tooltips: '虚拟机1',
          key: '0'
        },
        {
          img: 'static/img/ci/ciIcon2.png',
          tooltips: '服务器1',
          key: '1'
        },
        {
          img: 'static/img/ci/ciIcon3.png',
          tooltips: '物理机',
          key: '2'
        },
        {
          img: 'static/img/ci/ciIcon4.png',
          tooltips: '交换机',
          key: '3'
        },
        {
          img: 'static/img/ci/ciIcon5.png',
          tooltips: '路由器',
          key: '4'
        },
        { img: 'static/img/ci/icon/Ansible.png',
          tooltips: 'Ansible',
          key: '5' },
        { img: 'static/img/ci/icon/ApacheAnt.png',
          tooltips: 'ApacheAnt',
          key: '6' },
        { img: 'static/img/ci/icon/ApacheKafka.png',
          tooltips: 'ApacheKafka',
          key: '7' },
        { img: 'static/img/ci/icon/ApacheRocketMQ.png',
          tooltips: 'ApacheRocketMQ',
          key: '8' },
        { img: 'static/img/ci/icon/ApacheTomcat.png',
          tooltips: 'ApacheTomcat',
          key: '9' },
        { img: 'static/img/ci/icon/ArchLinux.png',
          tooltips: 'ArchLinux',
          key: '10' },
        { img: 'static/img/ci/icon/BashShell.png',
          tooltips: 'BashShell',
          key: '11' },
        { img: 'static/img/ci/icon/Bitbucket.png',
          tooltips: 'Bitbucket',
          key: '12' },
        { img: 'static/img/ci/icon/CentOS.png',
          tooltips: 'CentOS',
          key: '13' },
        { img: 'static/img/ci/icon/cipanio.png',
          tooltips: '磁盘io',
          key: '14' },
        { img: 'static/img/ci/icon/Codacy.png',
          tooltips: 'Codacy',
          key: '15' },
        { img: 'static/img/ci/icon/CVMbeifen.png',
          tooltips: 'CVM备份',
          key: '16' },
        { img: 'static/img/ci/icon/DATADOG.png',
          tooltips: 'DATADOG',
          key: '17' },
        { img: 'static/img/ci/icon/Debian.png',
          tooltips: 'Debian',
          key: '18' },
        { img: 'static/img/ci/icon/duankou.png',
          tooltips: '端口',
          key: '19' },
        { img: 'static/img/ci/icon/Dynatrace.png',
          tooltips: 'Dynatrace',
          key: '20' },
        { img: 'static/img/ci/icon/ElasticSearch.png',
          tooltips: 'Elastic Search',
          key: '21' },
        { img: 'static/img/ci/icon/erji-loudongsaomiaoguanli.png',
          tooltips: '二级-漏洞扫描',
          key: '22' },
        { img: 'static/img/ci/icon/fadianji-.png',
          tooltips: '发电机',
          key: '23' },
        { img: 'static/img/ci/icon/fanghuoqiang.png',
          tooltips: '防火墙',
          key: '24' },
        { img: 'static/img/ci/icon/FedoraLinux.png',
          tooltips: 'Fedora Linux',
          key: '25' },
        { img: 'static/img/ci/icon/Firewall.png',
          tooltips: 'Fire wall',
          key: '26' },
        { img: 'static/img/ci/icon/fit-desktop.png',
          tooltips: 'fit-desktop',
          key: '27' },
        { img: 'static/img/ci/icon/fuzaijunheng.png',
          tooltips: '负载均衡',
          key: '28' },
        { img: 'static/img/ci/icon/gaojingshezhi.png',
          tooltips: '告警设置',
          key: '29' },
        { img: 'static/img/ci/icon/Gateway.png',
          tooltips: 'Gateway',
          key: '30' },
        { img: 'static/img/ci/icon/Git.png', tooltips: 'Git', key: '31' },
        { img: 'static/img/ci/icon/Github.png',
          tooltips: 'Github',
          key: '32' },
        { img: 'static/img/ci/icon/Gitlab.png',
          tooltips: 'Gitlab',
          key: '33' },
        { img: 'static/img/ci/icon/gongzuozhannaguan.png',
          tooltips: '工作站纳管',
          key: '34' },
        { img: 'static/img/ci/icon/Gradle.png',
          tooltips: 'Gradle',
          key: '35' },
        { img: 'static/img/ci/icon/IBM.png', tooltips: 'IBM', key: '36' },
        { img: 'static/img/ci/icon/IncludeOS.png',
          tooltips: 'IncludeOS',
          key: '37' },
        { img: 'static/img/ci/icon/Intrusion-detection.png',
          tooltips: 'Intrusion-detection',
          key: '38' },
        { img: 'static/img/ci/icon/Jenkins.png',
          tooltips: 'Jenkins',
          key: '39' },
        { img: 'static/img/ci/icon/JFrog.png',
          tooltips: 'JFrog',
          key: '40' },
        { img: 'static/img/ci/icon/jiankongshezhi.png',
          tooltips: '监控设置',
          key: '41' },
        { img: 'static/img/ci/icon/jiankongzhanshi.png',
          tooltips: '监控展示',
          key: '42' },
        { img: 'static/img/ci/icon/jidinghe.png',
          tooltips: '机顶盒',
          key: '43' },
        { img: 'static/img/ci/icon/jiqun.png',
          tooltips: '集群',
          key: '44' },
        { img: 'static/img/ci/icon/jiqunchi.png',
          tooltips: '集群池',
          key: '45' },
        { img: 'static/img/ci/icon/jira.png',
          tooltips: 'jira',
          key: '46' },
        { img: 'static/img/ci/icon/keshihuaguanli.png',
          tooltips: '可视化管理',
          key: '47' },
        { img: 'static/img/ci/icon/Kibana.png',
          tooltips: 'Kibana',
          key: '48' },
        { img: 'static/img/ci/icon/kongtiao.png',
          tooltips: '空调',
          key: '49' },
        { img: 'static/img/ci/icon/Kubernetes.png',
          tooltips: 'Kubernetes',
          key: '50' },
        { img: 'static/img/ci/icon/Layer--switch.png',
          tooltips: 'Layer--switch',
          key: '51' },
        { img: 'static/img/ci/icon/Load-balancer.png',
          tooltips: 'Load-balancer',
          key: '52' },
        { img: 'static/img/ci/icon/MariaDB.png',
          tooltips: 'MariaDB',
          key: '53' },
        { img: 'static/img/ci/icon/mimacelve.png',
          tooltips: '密码策略',
          key: '54' },
        { img: 'static/img/ci/icon/MongoDB.png',
          tooltips: 'MongoDB',
          key: '55' },
        { img: 'static/img/ci/icon/MySQL.png',
          tooltips: 'MySQL',
          key: '56' },
        { img: 'static/img/ci/icon/NGINX.png',
          tooltips: 'NGINX',
          key: '57' },
        { img: 'static/img/ci/icon/OpenStack.png',
          tooltips: 'OpenStack',
          key: '58' },
        { img: 'static/img/ci/icon/OS_Windows.png',
          tooltips: 'OS_Windows',
          key: '59' },
        { img: 'static/img/ci/icon/Postgresql.png',
          tooltips: 'Postgresql',
          key: '60' },
        { img: 'static/img/ci/icon/Prometheus.png',
          tooltips: 'Prometheus',
          key: '61' },
        { img: 'static/img/ci/icon/Puppet.png',
          tooltips: 'Puppet',
          key: '62' },
        { img: 'static/img/ci/icon/qianzi.png',
          tooltips: '签字',
          key: '63' },
        { img: 'static/img/ci/icon/quanmianjiankong.png',
          tooltips: '全面监控',
          key: '64' },
        { img: 'static/img/ci/icon/quyu.png',
          tooltips: '区域',
          key: '65' },
        { img: 'static/img/ci/icon/Rabbitmq.png',
          tooltips: 'Rabbitmq',
          key: '66' },
        { img: 'static/img/ci/icon/Red-Hat.png',
          tooltips: 'Red-Hat',
          key: '67' },
        { img: 'static/img/ci/icon/Redis.png',
          tooltips: 'Redis',
          key: '68' },
        { img: 'static/img/ci/icon/rizhi.png',
          tooltips: '日志',
          key: '69' },
        { img: 'static/img/ci/icon/rongliangkuozhan.png',
          tooltips: '容量扩展',
          key: '70' },
        { img: 'static/img/ci/icon/Router.png',
          tooltips: 'Router',
          key: '71' },
        { img: 'static/img/ci/icon/ruanjiankuguanli.png',
          tooltips: '监控设置',
          key: '72' },
        { img: 'static/img/ci/icon/Saltstack.png',
          tooltips: 'Saltstack',
          key: '73' },
        { img: 'static/img/ci/icon/Server-blade.png',
          tooltips: 'Server-blade',
          key: '74' },
        { img: 'static/img/ci/icon/Server-rack.png',
          tooltips: 'Server-rack',
          key: '75' },
        { img: 'static/img/ci/icon/Server.png',
          tooltips: 'Server',
          key: '76' },
        { img: 'static/img/ci/icon/shangwanghangweiguanliruanjianjinyong.png',
          tooltips: '软件禁用',
          key: '77' },
        { img: 'static/img/ci/icon/shengjifuwu.png',
          tooltips: '升级服务',
          key: '78' },
        { img: 'static/img/ci/icon/shenji.png',
          tooltips: '审计',
          key: '79' },
        { img: 'static/img/ci/icon/shipinhuiyi-xianxingicon.png',
          tooltips: '视频会议',
          key: '80' },
        { img: 'static/img/ci/icon/shouzhuomian.png',
          tooltips: '瘦桌面',
          key: '81' },
        { img: 'static/img/ci/icon/shujufenxi-liuliangfenxi.png',
          tooltips: '流量分析',
          key: '82' },
        { img: 'static/img/ci/icon/Subversion.png',
          tooltips: 'Subversion',
          key: '83' },
        { img: 'static/img/ci/icon/Ubuntu.png',
          tooltips: 'Ubuntu',
          key: '84' },
        { img: 'static/img/ci/icon/Vpn-concentrator.png',
          tooltips: 'Vpn-concentrator',
          key: '85' },
        { img: 'static/img/ci/icon/Vpn-gateway.png',
          tooltips: 'Vpn-gateway',
          key: '86' },
        { img: 'static/img/ci/icon/vpn.png', tooltips: 'vpn', key: '87' },
        { img: 'static/img/ci/icon/wangguanzhuangtai.png',
          tooltips: '网管状态',
          key: '88' },
        { img: 'static/img/ci/icon/wangluoruqinfangyu.png',
          tooltips: '网络入侵防御',
          key: '89' },
        { img: 'static/img/ci/icon/webloudongjiance.png',
          tooltips: 'web漏洞检测',
          key: '90' },
        { img: 'static/img/ci/icon/wenjianfenfa.png',
          tooltips: '文件分发',
          key: '91' },
        { img: 'static/img/ci/icon/Workgroup-switch.png',
          tooltips: 'Workgroup-switch',
          key: '92' },
        { img: 'static/img/ci/icon/xiang_box.png',
          tooltips: '箱',
          key: '93' },
        { img: 'static/img/ci/icon/xianlu.png',
          tooltips: '线路',
          key: '94' },
        { img: 'static/img/ci/icon/xuniji.png',
          tooltips: '虚拟机',
          key: '95' },
        { img: 'static/img/ci/icon/yunanquan.png',
          tooltips: '云安全',
          key: '96' },
        { img: 'static/img/ci/icon/yunpan.png',
          tooltips: '云盘',
          key: '97' },
        { img: 'static/img/ci/icon/Zabbix.png',
          tooltips: 'Zabbix',
          key: '98' },
        { img: 'static/img/ci/icon/zhengshupeizhi.png',
          tooltips: '证书配置',
          key: '99' },
        { img: 'static/img/ci/icon/zhongduanguanli.png',
          tooltips: '终端管理',
          key: '100' },
        { img: 'static/img/ci/icon/zhuji.png',
          tooltips: '主机',
          key: '101' },
        { img: 'static/img/ci/icon/zhuomianchi.png',
          tooltips: '桌面池',
          key: '102' },
        { img: 'static/img/ci/icon/zhuomianguanli.png',
          tooltips: '桌面管理',
          key: '103' },
        { img: 'static/img/ci/icon/zidingyijiankong.png',
          tooltips: '自定义监控',
          key: '104' },
        { img: 'static/img/ci/icon/ziyuanshiyongtongji.png',
          tooltips: '资源使用统计',
          key: '105' }
      ],
      ciTypeShow: true,
      hoverUpdatedIndex: '-1',
      updatedIcon: '',
      showDetailSaveBtn: false,
      ciIconVlue: '',
      toggleArrowId: '-1',
      hoverIndex: '-1',
      citypeNum: 0,
      citypeTotalNum: 10,
      iconSrc: '',
      templates: [
        // { templatName: "网络" },
        // { templatName: "中间件" },
        // { templatName: "业务" },
        // { templatName: "虚拟化设备" }
      ],
      showIconSuccess: false,
      midIcon: '',
      updatedMIdIcon: '',
      showSuccess: false,
      showRedError: false,
      showRedIcon: false,
      showSaveBtn: false,
      rightArrow: false,
      leftArrow: true,
      detailIcon: '',
      ruleForm: {
        name: '',
        classification: ''
      },
      ruleForm2: {
        newCI_input: ''
      },
      ruleForm3: {
        classifyName: ''
      },
      rules2: {
        newCI_input: [
          { required: true, message: '名称不能为空', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ]
      },
      rules3: {
        classifyName: [
          { required: true, validator: validateNewName, trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ]
      },
      rules: {
        name: [
          { required: true, validator: validateloginName, trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        classification: [
          { required: true, message: '请选择分类', trigger: 'change' }
        ]
      },
      showDetail: true,
      showTemplet: false,
      icon: '',
      updateIconDialogVisible: false,
      iconDialogVisible: false,
      templet: '',
      templetInput: '',
      iconValue: '',
      newCI_Icon: '',
      number: 0,
      totalNumber: 20,
      showRight: false,
      ciDetail: false,
      centerDialogVisible: false,
      ciName: '',
      selectValue: '',
      options: [
        {
          value: 1,
          label: '基本资料'
        },
        {
          value: 2,
          label: '资源'
        }
      ],
      cis: [],
      ciNames: [],
      midCis: [],
      iconBorder: [],
      selectedciType: '',
      icons: [
        {
          img: 'static/img/ci/ciIcon1.png',
          tooltips: '虚拟机1',
          key: '0'
        },
        {
          img: 'static/img/ci/ciIcon2.png',
          tooltips: '服务器1',
          key: '1'
        },
        {
          img: 'static/img/ci/ciIcon3.png',
          tooltips: '物理机',
          key: '2'
        },
        {
          img: 'static/img/ci/ciIcon4.png',
          tooltips: '交换机',
          key: '3'
        },
        {
          img: 'static/img/ci/ciIcon5.png',
          tooltips: '路由器',
          key: '4'
        },
        { img: 'static/img/ci/icon/Ansible.png',
          tooltips: 'Ansible',
          key: '5' },
        { img: 'static/img/ci/icon/ApacheAnt.png',
          tooltips: 'ApacheAnt',
          key: '6' },
        { img: 'static/img/ci/icon/ApacheKafka.png',
          tooltips: 'ApacheKafka',
          key: '7' },
        { img: 'static/img/ci/icon/ApacheRocketMQ.png',
          tooltips: 'ApacheRocketMQ',
          key: '8' },
        { img: 'static/img/ci/icon/ApacheTomcat.png',
          tooltips: 'ApacheTomcat',
          key: '9' },
        { img: 'static/img/ci/icon/ArchLinux.png',
          tooltips: 'ArchLinux',
          key: '10' },
        { img: 'static/img/ci/icon/BashShell.png',
          tooltips: 'BashShell',
          key: '11' },
        { img: 'static/img/ci/icon/Bitbucket.png',
          tooltips: 'Bitbucket',
          key: '12' },
        { img: 'static/img/ci/icon/CentOS.png',
          tooltips: 'CentOS',
          key: '13' },
        { img: 'static/img/ci/icon/cipanio.png',
          tooltips: '磁盘io',
          key: '14' },
        { img: 'static/img/ci/icon/Codacy.png',
          tooltips: 'Codacy',
          key: '15' },
        { img: 'static/img/ci/icon/CVMbeifen.png',
          tooltips: 'CVM备份',
          key: '16' },
        { img: 'static/img/ci/icon/DATADOG.png',
          tooltips: 'DATADOG',
          key: '17' },
        { img: 'static/img/ci/icon/Debian.png',
          tooltips: 'Debian',
          key: '18' },
        { img: 'static/img/ci/icon/duankou.png',
          tooltips: '端口',
          key: '19' },
        { img: 'static/img/ci/icon/Dynatrace.png',
          tooltips: 'Dynatrace',
          key: '20' },
        { img: 'static/img/ci/icon/ElasticSearch.png',
          tooltips: 'Elastic Search',
          key: '21' },
        { img: 'static/img/ci/icon/erji-loudongsaomiaoguanli.png',
          tooltips: '二级-漏洞扫描',
          key: '22' },
        { img: 'static/img/ci/icon/fadianji-.png',
          tooltips: '发电机',
          key: '23' },
        { img: 'static/img/ci/icon/fanghuoqiang.png',
          tooltips: '防火墙',
          key: '24' },
        { img: 'static/img/ci/icon/FedoraLinux.png',
          tooltips: 'Fedora Linux',
          key: '25' },
        { img: 'static/img/ci/icon/Firewall.png',
          tooltips: 'Fire wall',
          key: '26' },
        { img: 'static/img/ci/icon/fit-desktop.png',
          tooltips: 'fit-desktop',
          key: '27' },
        { img: 'static/img/ci/icon/fuzaijunheng.png',
          tooltips: '负载均衡',
          key: '28' },
        { img: 'static/img/ci/icon/gaojingshezhi.png',
          tooltips: '告警设置',
          key: '29' },
        { img: 'static/img/ci/icon/Gateway.png',
          tooltips: 'Gateway',
          key: '30' },
        { img: 'static/img/ci/icon/Git.png', tooltips: 'Git', key: '31' },
        { img: 'static/img/ci/icon/Github.png',
          tooltips: 'Github',
          key: '32' },
        { img: 'static/img/ci/icon/Gitlab.png',
          tooltips: 'Gitlab',
          key: '33' },
        { img: 'static/img/ci/icon/gongzuozhannaguan.png',
          tooltips: '工作站纳管',
          key: '34' },
        { img: 'static/img/ci/icon/Gradle.png',
          tooltips: 'Gradle',
          key: '35' },
        { img: 'static/img/ci/icon/IBM.png', tooltips: 'IBM', key: '36' },
        { img: 'static/img/ci/icon/IncludeOS.png',
          tooltips: 'IncludeOS',
          key: '37' },
        { img: 'static/img/ci/icon/Intrusion-detection.png',
          tooltips: 'Intrusion-detection',
          key: '38' },
        { img: 'static/img/ci/icon/Jenkins.png',
          tooltips: 'Jenkins',
          key: '39' },
        { img: 'static/img/ci/icon/JFrog.png',
          tooltips: 'JFrog',
          key: '40' },
        { img: 'static/img/ci/icon/jiankongshezhi.png',
          tooltips: '监控设置',
          key: '41' },
        { img: 'static/img/ci/icon/jiankongzhanshi.png',
          tooltips: '监控展示',
          key: '42' },
        { img: 'static/img/ci/icon/jidinghe.png',
          tooltips: '机顶盒',
          key: '43' },
        { img: 'static/img/ci/icon/jiqun.png',
          tooltips: '集群',
          key: '44' },
        { img: 'static/img/ci/icon/jiqunchi.png',
          tooltips: '集群池',
          key: '45' },
        { img: 'static/img/ci/icon/jira.png',
          tooltips: 'jira',
          key: '46' },
        { img: 'static/img/ci/icon/keshihuaguanli.png',
          tooltips: '可视化管理',
          key: '47' },
        { img: 'static/img/ci/icon/Kibana.png',
          tooltips: 'Kibana',
          key: '48' },
        { img: 'static/img/ci/icon/kongtiao.png',
          tooltips: '空调',
          key: '49' },
        { img: 'static/img/ci/icon/Kubernetes.png',
          tooltips: 'Kubernetes',
          key: '50' },
        { img: 'static/img/ci/icon/Layer--switch.png',
          tooltips: 'Layer--switch',
          key: '51' },
        { img: 'static/img/ci/icon/Load-balancer.png',
          tooltips: 'Load-balancer',
          key: '52' },
        { img: 'static/img/ci/icon/MariaDB.png',
          tooltips: 'MariaDB',
          key: '53' },
        { img: 'static/img/ci/icon/mimacelve.png',
          tooltips: '密码策略',
          key: '54' },
        { img: 'static/img/ci/icon/MongoDB.png',
          tooltips: 'MongoDB',
          key: '55' },
        { img: 'static/img/ci/icon/MySQL.png',
          tooltips: 'MySQL',
          key: '56' },
        { img: 'static/img/ci/icon/NGINX.png',
          tooltips: 'NGINX',
          key: '57' },
        { img: 'static/img/ci/icon/OpenStack.png',
          tooltips: 'OpenStack',
          key: '58' },
        { img: 'static/img/ci/icon/OS_Windows.png',
          tooltips: 'OS_Windows',
          key: '59' },
        { img: 'static/img/ci/icon/Postgresql.png',
          tooltips: 'Postgresql',
          key: '60' },
        { img: 'static/img/ci/icon/Prometheus.png',
          tooltips: 'Prometheus',
          key: '61' },
        { img: 'static/img/ci/icon/Puppet.png',
          tooltips: 'Puppet',
          key: '62' },
        { img: 'static/img/ci/icon/qianzi.png',
          tooltips: '签字',
          key: '63' },
        { img: 'static/img/ci/icon/quanmianjiankong.png',
          tooltips: '全面监控',
          key: '64' },
        { img: 'static/img/ci/icon/quyu.png',
          tooltips: '区域',
          key: '65' },
        { img: 'static/img/ci/icon/Rabbitmq.png',
          tooltips: 'Rabbitmq',
          key: '66' },
        { img: 'static/img/ci/icon/Red-Hat.png',
          tooltips: 'Red-Hat',
          key: '67' },
        { img: 'static/img/ci/icon/Redis.png',
          tooltips: 'Redis',
          key: '68' },
        { img: 'static/img/ci/icon/rizhi.png',
          tooltips: '日志',
          key: '69' },
        { img: 'static/img/ci/icon/rongliangkuozhan.png',
          tooltips: '容量扩展',
          key: '70' },
        { img: 'static/img/ci/icon/Router.png',
          tooltips: 'Router',
          key: '71' },
        { img: 'static/img/ci/icon/ruanjiankuguanli.png',
          tooltips: '监控设置',
          key: '72' },
        { img: 'static/img/ci/icon/Saltstack.png',
          tooltips: 'Saltstack',
          key: '73' },
        { img: 'static/img/ci/icon/Server-blade.png',
          tooltips: 'Server-blade',
          key: '74' },
        { img: 'static/img/ci/icon/Server-rack.png',
          tooltips: 'Server-rack',
          key: '75' },
        { img: 'static/img/ci/icon/Server.png',
          tooltips: 'Server',
          key: '76' },
        { img: 'static/img/ci/icon/shangwanghangweiguanliruanjianjinyong.png',
          tooltips: '软件禁用',
          key: '77' },
        { img: 'static/img/ci/icon/shengjifuwu.png',
          tooltips: '升级服务',
          key: '78' },
        { img: 'static/img/ci/icon/shenji.png',
          tooltips: '审计',
          key: '79' },
        { img: 'static/img/ci/icon/shipinhuiyi-xianxingicon.png',
          tooltips: '视频会议',
          key: '80' },
        { img: 'static/img/ci/icon/shouzhuomian.png',
          tooltips: '瘦桌面',
          key: '81' },
        { img: 'static/img/ci/icon/shujufenxi-liuliangfenxi.png',
          tooltips: '流量分析',
          key: '82' },
        { img: 'static/img/ci/icon/Subversion.png',
          tooltips: 'Subversion',
          key: '83' },
        { img: 'static/img/ci/icon/Ubuntu.png',
          tooltips: 'Ubuntu',
          key: '84' },
        { img: 'static/img/ci/icon/Vpn-concentrator.png',
          tooltips: 'Vpn-concentrator',
          key: '85' },
        { img: 'static/img/ci/icon/Vpn-gateway.png',
          tooltips: 'Vpn-gateway',
          key: '86' },
        { img: 'static/img/ci/icon/vpn.png', tooltips: 'vpn', key: '87' },
        { img: 'static/img/ci/icon/wangguanzhuangtai.png',
          tooltips: '网管状态',
          key: '88' },
        { img: 'static/img/ci/icon/wangluoruqinfangyu.png',
          tooltips: '网络入侵防御',
          key: '89' },
        { img: 'static/img/ci/icon/webloudongjiance.png',
          tooltips: 'web漏洞检测',
          key: '90' },
        { img: 'static/img/ci/icon/wenjianfenfa.png',
          tooltips: '文件分发',
          key: '91' },
        { img: 'static/img/ci/icon/Workgroup-switch.png',
          tooltips: 'Workgroup-switch',
          key: '92' },
        { img: 'static/img/ci/icon/xiang_box.png',
          tooltips: '箱',
          key: '93' },
        { img: 'static/img/ci/icon/xianlu.png',
          tooltips: '线路',
          key: '94' },
        { img: 'static/img/ci/icon/xuniji.png',
          tooltips: '虚拟机',
          key: '95' },
        { img: 'static/img/ci/icon/yunanquan.png',
          tooltips: '云安全',
          key: '96' },
        { img: 'static/img/ci/icon/yunpan.png',
          tooltips: '云盘',
          key: '97' },
        { img: 'static/img/ci/icon/Zabbix.png',
          tooltips: 'Zabbix',
          key: '98' },
        { img: 'static/img/ci/icon/zhengshupeizhi.png',
          tooltips: '证书配置',
          key: '99' },
        { img: 'static/img/ci/icon/zhongduanguanli.png',
          tooltips: '终端管理',
          key: '100' },
        { img: 'static/img/ci/icon/zhuji.png',
          tooltips: '主机',
          key: '101' },
        { img: 'static/img/ci/icon/zhuomianchi.png',
          tooltips: '桌面池',
          key: '102' },
        { img: 'static/img/ci/icon/zhuomianguanli.png',
          tooltips: '桌面管理',
          key: '103' },
        { img: 'static/img/ci/icon/zidingyijiankong.png',
          tooltips: '自定义监控',
          key: '104' },
        { img: 'static/img/ci/icon/ziyuanshiyongtongji.png',
          tooltips: '资源使用统计',
          key: '105' }
      ],
      editcigroupId: '',
      newCitypeId: '',
      citypegroupId: '',
      citypeID: '',
      groupId: '',
      focusCitype: [],
      opens: ['0', '1', '2'],
      midIcons: [],
      allIcons: [
        {
          img: 'static/img/ci/ciIcon1.png',
          tooltips: '虚拟机1',
          key: '0'
        },
        {
          img: 'static/img/ci/ciIcon2.png',
          tooltips: '服务器1',
          key: '1'
        },
        {
          img: 'static/img/ci/ciIcon3.png',
          tooltips: '物理机',
          key: '2'
        },
        {
          img: 'static/img/ci/ciIcon4.png',
          tooltips: '交换机',
          key: '3'
        },
        {
          img: 'static/img/ci/ciIcon5.png',
          tooltips: '路由器',
          key: '4'
        },
        { img: 'static/img/ci/icon/Ansible.png',
          tooltips: 'Ansible',
          key: '5' },
        { img: 'static/img/ci/icon/ApacheAnt.png',
          tooltips: 'ApacheAnt',
          key: '6' },
        { img: 'static/img/ci/icon/ApacheKafka.png',
          tooltips: 'ApacheKafka',
          key: '7' },
        { img: 'static/img/ci/icon/ApacheRocketMQ.png',
          tooltips: 'ApacheRocketMQ',
          key: '8' },
        { img: 'static/img/ci/icon/ApacheTomcat.png',
          tooltips: 'ApacheTomcat',
          key: '9' },
        { img: 'static/img/ci/icon/ArchLinux.png',
          tooltips: 'ArchLinux',
          key: '10' },
        { img: 'static/img/ci/icon/BashShell.png',
          tooltips: 'BashShell',
          key: '11' },
        { img: 'static/img/ci/icon/Bitbucket.png',
          tooltips: 'Bitbucket',
          key: '12' },
        { img: 'static/img/ci/icon/CentOS.png',
          tooltips: 'CentOS',
          key: '13' },
        { img: 'static/img/ci/icon/cipanio.png',
          tooltips: '磁盘io',
          key: '14' },
        { img: 'static/img/ci/icon/Codacy.png',
          tooltips: 'Codacy',
          key: '15' },
        { img: 'static/img/ci/icon/CVMbeifen.png',
          tooltips: 'CVM备份',
          key: '16' },
        { img: 'static/img/ci/icon/DATADOG.png',
          tooltips: 'DATADOG',
          key: '17' },
        { img: 'static/img/ci/icon/Debian.png',
          tooltips: 'Debian',
          key: '18' },
        { img: 'static/img/ci/icon/duankou.png',
          tooltips: '端口',
          key: '19' },
        { img: 'static/img/ci/icon/Dynatrace.png',
          tooltips: 'Dynatrace',
          key: '20' },
        { img: 'static/img/ci/icon/ElasticSearch.png',
          tooltips: 'Elastic Search',
          key: '21' },
        { img: 'static/img/ci/icon/erji-loudongsaomiaoguanli.png',
          tooltips: '二级-漏洞扫描',
          key: '22' },
        { img: 'static/img/ci/icon/fadianji-.png',
          tooltips: '发电机',
          key: '23' },
        { img: 'static/img/ci/icon/fanghuoqiang.png',
          tooltips: '防火墙',
          key: '24' },
        { img: 'static/img/ci/icon/FedoraLinux.png',
          tooltips: 'Fedora Linux',
          key: '25' },
        { img: 'static/img/ci/icon/Firewall.png',
          tooltips: 'Fire wall',
          key: '26' },
        { img: 'static/img/ci/icon/fit-desktop.png',
          tooltips: 'fit-desktop',
          key: '27' },
        { img: 'static/img/ci/icon/fuzaijunheng.png',
          tooltips: '负载均衡',
          key: '28' },
        { img: 'static/img/ci/icon/gaojingshezhi.png',
          tooltips: '告警设置',
          key: '29' },
        { img: 'static/img/ci/icon/Gateway.png',
          tooltips: 'Gateway',
          key: '30' },
        { img: 'static/img/ci/icon/Git.png', tooltips: 'Git', key: '31' },
        { img: 'static/img/ci/icon/Github.png',
          tooltips: 'Github',
          key: '32' },
        { img: 'static/img/ci/icon/Gitlab.png',
          tooltips: 'Gitlab',
          key: '33' },
        { img: 'static/img/ci/icon/gongzuozhannaguan.png',
          tooltips: '工作站纳管',
          key: '34' },
        { img: 'static/img/ci/icon/Gradle.png',
          tooltips: 'Gradle',
          key: '35' },
        { img: 'static/img/ci/icon/IBM.png', tooltips: 'IBM', key: '36' },
        { img: 'static/img/ci/icon/IncludeOS.png',
          tooltips: 'IncludeOS',
          key: '37' },
        { img: 'static/img/ci/icon/Intrusion-detection.png',
          tooltips: 'Intrusion-detection',
          key: '38' },
        { img: 'static/img/ci/icon/Jenkins.png',
          tooltips: 'Jenkins',
          key: '39' },
        { img: 'static/img/ci/icon/JFrog.png',
          tooltips: 'JFrog',
          key: '40' },
        { img: 'static/img/ci/icon/jiankongshezhi.png',
          tooltips: '监控设置',
          key: '41' },
        { img: 'static/img/ci/icon/jiankongzhanshi.png',
          tooltips: '监控展示',
          key: '42' },
        { img: 'static/img/ci/icon/jidinghe.png',
          tooltips: '机顶盒',
          key: '43' },
        { img: 'static/img/ci/icon/jiqun.png',
          tooltips: '集群',
          key: '44' },
        { img: 'static/img/ci/icon/jiqunchi.png',
          tooltips: '集群池',
          key: '45' },
        { img: 'static/img/ci/icon/jira.png',
          tooltips: 'jira',
          key: '46' },
        { img: 'static/img/ci/icon/keshihuaguanli.png',
          tooltips: '可视化管理',
          key: '47' },
        { img: 'static/img/ci/icon/Kibana.png',
          tooltips: 'Kibana',
          key: '48' },
        { img: 'static/img/ci/icon/kongtiao.png',
          tooltips: '空调',
          key: '49' },
        { img: 'static/img/ci/icon/Kubernetes.png',
          tooltips: 'Kubernetes',
          key: '50' },
        { img: 'static/img/ci/icon/Layer--switch.png',
          tooltips: 'Layer--switch',
          key: '51' },
        { img: 'static/img/ci/icon/Load-balancer.png',
          tooltips: 'Load-balancer',
          key: '52' },
        { img: 'static/img/ci/icon/MariaDB.png',
          tooltips: 'MariaDB',
          key: '53' },
        { img: 'static/img/ci/icon/mimacelve.png',
          tooltips: '密码策略',
          key: '54' },
        { img: 'static/img/ci/icon/MongoDB.png',
          tooltips: 'MongoDB',
          key: '55' },
        { img: 'static/img/ci/icon/MySQL.png',
          tooltips: 'MySQL',
          key: '56' },
        { img: 'static/img/ci/icon/NGINX.png',
          tooltips: 'NGINX',
          key: '57' },
        { img: 'static/img/ci/icon/OpenStack.png',
          tooltips: 'OpenStack',
          key: '58' },
        { img: 'static/img/ci/icon/OS_Windows.png',
          tooltips: 'OS_Windows',
          key: '59' },
        { img: 'static/img/ci/icon/Postgresql.png',
          tooltips: 'Postgresql',
          key: '60' },
        { img: 'static/img/ci/icon/Prometheus.png',
          tooltips: 'Prometheus',
          key: '61' },
        { img: 'static/img/ci/icon/Puppet.png',
          tooltips: 'Puppet',
          key: '62' },
        { img: 'static/img/ci/icon/qianzi.png',
          tooltips: '签字',
          key: '63' },
        { img: 'static/img/ci/icon/quanmianjiankong.png',
          tooltips: '全面监控',
          key: '64' },
        { img: 'static/img/ci/icon/quyu.png',
          tooltips: '区域',
          key: '65' },
        { img: 'static/img/ci/icon/Rabbitmq.png',
          tooltips: 'Rabbitmq',
          key: '66' },
        { img: 'static/img/ci/icon/Red-Hat.png',
          tooltips: 'Red-Hat',
          key: '67' },
        { img: 'static/img/ci/icon/Redis.png',
          tooltips: 'Redis',
          key: '68' },
        { img: 'static/img/ci/icon/rizhi.png',
          tooltips: '日志',
          key: '69' },
        { img: 'static/img/ci/icon/rongliangkuozhan.png',
          tooltips: '容量扩展',
          key: '70' },
        { img: 'static/img/ci/icon/Router.png',
          tooltips: 'Router',
          key: '71' },
        { img: 'static/img/ci/icon/ruanjiankuguanli.png',
          tooltips: '监控设置',
          key: '72' },
        { img: 'static/img/ci/icon/Saltstack.png',
          tooltips: 'Saltstack',
          key: '73' },
        { img: 'static/img/ci/icon/Server-blade.png',
          tooltips: 'Server-blade',
          key: '74' },
        { img: 'static/img/ci/icon/Server-rack.png',
          tooltips: 'Server-rack',
          key: '75' },
        { img: 'static/img/ci/icon/Server.png',
          tooltips: 'Server',
          key: '76' },
        { img: 'static/img/ci/icon/shangwanghangweiguanliruanjianjinyong.png',
          tooltips: '软件禁用',
          key: '77' },
        { img: 'static/img/ci/icon/shengjifuwu.png',
          tooltips: '升级服务',
          key: '78' },
        { img: 'static/img/ci/icon/shenji.png',
          tooltips: '审计',
          key: '79' },
        { img: 'static/img/ci/icon/shipinhuiyi-xianxingicon.png',
          tooltips: '视频会议',
          key: '80' },
        { img: 'static/img/ci/icon/shouzhuomian.png',
          tooltips: '瘦桌面',
          key: '81' },
        { img: 'static/img/ci/icon/shujufenxi-liuliangfenxi.png',
          tooltips: '流量分析',
          key: '82' },
        { img: 'static/img/ci/icon/Subversion.png',
          tooltips: 'Subversion',
          key: '83' },
        { img: 'static/img/ci/icon/Ubuntu.png',
          tooltips: 'Ubuntu',
          key: '84' },
        { img: 'static/img/ci/icon/Vpn-concentrator.png',
          tooltips: 'Vpn-concentrator',
          key: '85' },
        { img: 'static/img/ci/icon/Vpn-gateway.png',
          tooltips: 'Vpn-gateway',
          key: '86' },
        { img: 'static/img/ci/icon/vpn.png', tooltips: 'vpn', key: '87' },
        { img: 'static/img/ci/icon/wangguanzhuangtai.png',
          tooltips: '网管状态',
          key: '88' },
        { img: 'static/img/ci/icon/wangluoruqinfangyu.png',
          tooltips: '网络入侵防御',
          key: '89' },
        { img: 'static/img/ci/icon/webloudongjiance.png',
          tooltips: 'web漏洞检测',
          key: '90' },
        { img: 'static/img/ci/icon/wenjianfenfa.png',
          tooltips: '文件分发',
          key: '91' },
        { img: 'static/img/ci/icon/Workgroup-switch.png',
          tooltips: 'Workgroup-switch',
          key: '92' },
        { img: 'static/img/ci/icon/xiang_box.png',
          tooltips: '箱',
          key: '93' },
        { img: 'static/img/ci/icon/xianlu.png',
          tooltips: '线路',
          key: '94' },
        { img: 'static/img/ci/icon/xuniji.png',
          tooltips: '虚拟机',
          key: '95' },
        { img: 'static/img/ci/icon/yunanquan.png',
          tooltips: '云安全',
          key: '96' },
        { img: 'static/img/ci/icon/yunpan.png',
          tooltips: '云盘',
          key: '97' },
        { img: 'static/img/ci/icon/Zabbix.png',
          tooltips: 'Zabbix',
          key: '98' },
        { img: 'static/img/ci/icon/zhengshupeizhi.png',
          tooltips: '证书配置',
          key: '99' },
        { img: 'static/img/ci/icon/zhongduanguanli.png',
          tooltips: '终端管理',
          key: '100' },
        { img: 'static/img/ci/icon/zhuji.png',
          tooltips: '主机',
          key: '101' },
        { img: 'static/img/ci/icon/zhuomianchi.png',
          tooltips: '桌面池',
          key: '102' },
        { img: 'static/img/ci/icon/zhuomianguanli.png',
          tooltips: '桌面管理',
          key: '103' },
        { img: 'static/img/ci/icon/zidingyijiankong.png',
          tooltips: '自定义监控',
          key: '104' },
        { img: 'static/img/ci/icon/ziyuanshiyongtongji.png',
          tooltips: '资源使用统计',
          key: '105' }
      ],
      allupdatedIcons: [
        {
          img: 'static/img/ci/ciIcon1.png',
          tooltips: '虚拟机1',
          key: '0'
        },
        {
          img: 'static/img/ci/ciIcon2.png',
          tooltips: '服务器1',
          key: '1'
        },
        {
          img: 'static/img/ci/ciIcon3.png',
          tooltips: '物理机',
          key: '2'
        },
        {
          img: 'static/img/ci/ciIcon4.png',
          tooltips: '交换机',
          key: '3'
        },
        {
          img: 'static/img/ci/ciIcon5.png',
          tooltips: '路由器',
          key: '4'
        },
        { img: 'static/img/ci/icon/Ansible.png',
          tooltips: 'Ansible',
          key: '5' },
        { img: 'static/img/ci/icon/ApacheAnt.png',
          tooltips: 'ApacheAnt',
          key: '6' },
        { img: 'static/img/ci/icon/ApacheKafka.png',
          tooltips: 'ApacheKafka',
          key: '7' },
        { img: 'static/img/ci/icon/ApacheRocketMQ.png',
          tooltips: 'ApacheRocketMQ',
          key: '8' },
        { img: 'static/img/ci/icon/ApacheTomcat.png',
          tooltips: 'ApacheTomcat',
          key: '9' },
        { img: 'static/img/ci/icon/ArchLinux.png',
          tooltips: 'ArchLinux',
          key: '10' },
        { img: 'static/img/ci/icon/BashShell.png',
          tooltips: 'BashShell',
          key: '11' },
        { img: 'static/img/ci/icon/Bitbucket.png',
          tooltips: 'Bitbucket',
          key: '12' },
        { img: 'static/img/ci/icon/CentOS.png',
          tooltips: 'CentOS',
          key: '13' },
        { img: 'static/img/ci/icon/cipanio.png',
          tooltips: '磁盘io',
          key: '14' },
        { img: 'static/img/ci/icon/Codacy.png',
          tooltips: 'Codacy',
          key: '15' },
        { img: 'static/img/ci/icon/CVMbeifen.png',
          tooltips: 'CVM备份',
          key: '16' },
        { img: 'static/img/ci/icon/DATADOG.png',
          tooltips: 'DATADOG',
          key: '17' },
        { img: 'static/img/ci/icon/Debian.png',
          tooltips: 'Debian',
          key: '18' },
        { img: 'static/img/ci/icon/duankou.png',
          tooltips: '端口',
          key: '19' },
        { img: 'static/img/ci/icon/Dynatrace.png',
          tooltips: 'Dynatrace',
          key: '20' },
        { img: 'static/img/ci/icon/ElasticSearch.png',
          tooltips: 'Elastic Search',
          key: '21' },
        { img: 'static/img/ci/icon/erji-loudongsaomiaoguanli.png',
          tooltips: '二级-漏洞扫描',
          key: '22' },
        { img: 'static/img/ci/icon/fadianji-.png',
          tooltips: '发电机',
          key: '23' },
        { img: 'static/img/ci/icon/fanghuoqiang.png',
          tooltips: '防火墙',
          key: '24' },
        { img: 'static/img/ci/icon/FedoraLinux.png',
          tooltips: 'Fedora Linux',
          key: '25' },
        { img: 'static/img/ci/icon/Firewall.png',
          tooltips: 'Fire wall',
          key: '26' },
        { img: 'static/img/ci/icon/fit-desktop.png',
          tooltips: 'fit-desktop',
          key: '27' },
        { img: 'static/img/ci/icon/fuzaijunheng.png',
          tooltips: '负载均衡',
          key: '28' },
        { img: 'static/img/ci/icon/gaojingshezhi.png',
          tooltips: '告警设置',
          key: '29' },
        { img: 'static/img/ci/icon/Gateway.png',
          tooltips: 'Gateway',
          key: '30' },
        { img: 'static/img/ci/icon/Git.png', tooltips: 'Git', key: '31' },
        { img: 'static/img/ci/icon/Github.png',
          tooltips: 'Github',
          key: '32' },
        { img: 'static/img/ci/icon/Gitlab.png',
          tooltips: 'Gitlab',
          key: '33' },
        { img: 'static/img/ci/icon/gongzuozhannaguan.png',
          tooltips: '工作站纳管',
          key: '34' },
        { img: 'static/img/ci/icon/Gradle.png',
          tooltips: 'Gradle',
          key: '35' },
        { img: 'static/img/ci/icon/IBM.png', tooltips: 'IBM', key: '36' },
        { img: 'static/img/ci/icon/IncludeOS.png',
          tooltips: 'IncludeOS',
          key: '37' },
        { img: 'static/img/ci/icon/Intrusion-detection.png',
          tooltips: 'Intrusion-detection',
          key: '38' },
        { img: 'static/img/ci/icon/Jenkins.png',
          tooltips: 'Jenkins',
          key: '39' },
        { img: 'static/img/ci/icon/JFrog.png',
          tooltips: 'JFrog',
          key: '40' },
        { img: 'static/img/ci/icon/jiankongshezhi.png',
          tooltips: '监控设置',
          key: '41' },
        { img: 'static/img/ci/icon/jiankongzhanshi.png',
          tooltips: '监控展示',
          key: '42' },
        { img: 'static/img/ci/icon/jidinghe.png',
          tooltips: '机顶盒',
          key: '43' },
        { img: 'static/img/ci/icon/jiqun.png',
          tooltips: '集群',
          key: '44' },
        { img: 'static/img/ci/icon/jiqunchi.png',
          tooltips: '集群池',
          key: '45' },
        { img: 'static/img/ci/icon/jira.png',
          tooltips: 'jira',
          key: '46' },
        { img: 'static/img/ci/icon/keshihuaguanli.png',
          tooltips: '可视化管理',
          key: '47' },
        { img: 'static/img/ci/icon/Kibana.png',
          tooltips: 'Kibana',
          key: '48' },
        { img: 'static/img/ci/icon/kongtiao.png',
          tooltips: '空调',
          key: '49' },
        { img: 'static/img/ci/icon/Kubernetes.png',
          tooltips: 'Kubernetes',
          key: '50' },
        { img: 'static/img/ci/icon/Layer--switch.png',
          tooltips: 'Layer--switch',
          key: '51' },
        { img: 'static/img/ci/icon/Load-balancer.png',
          tooltips: 'Load-balancer',
          key: '52' },
        { img: 'static/img/ci/icon/MariaDB.png',
          tooltips: 'MariaDB',
          key: '53' },
        { img: 'static/img/ci/icon/mimacelve.png',
          tooltips: '密码策略',
          key: '54' },
        { img: 'static/img/ci/icon/MongoDB.png',
          tooltips: 'MongoDB',
          key: '55' },
        { img: 'static/img/ci/icon/MySQL.png',
          tooltips: 'MySQL',
          key: '56' },
        { img: 'static/img/ci/icon/NGINX.png',
          tooltips: 'NGINX',
          key: '57' },
        { img: 'static/img/ci/icon/OpenStack.png',
          tooltips: 'OpenStack',
          key: '58' },
        { img: 'static/img/ci/icon/OS_Windows.png',
          tooltips: 'OS_Windows',
          key: '59' },
        { img: 'static/img/ci/icon/Postgresql.png',
          tooltips: 'Postgresql',
          key: '60' },
        { img: 'static/img/ci/icon/Prometheus.png',
          tooltips: 'Prometheus',
          key: '61' },
        { img: 'static/img/ci/icon/Puppet.png',
          tooltips: 'Puppet',
          key: '62' },
        { img: 'static/img/ci/icon/qianzi.png',
          tooltips: '签字',
          key: '63' },
        { img: 'static/img/ci/icon/quanmianjiankong.png',
          tooltips: '全面监控',
          key: '64' },
        { img: 'static/img/ci/icon/quyu.png',
          tooltips: '区域',
          key: '65' },
        { img: 'static/img/ci/icon/Rabbitmq.png',
          tooltips: 'Rabbitmq',
          key: '66' },
        { img: 'static/img/ci/icon/Red-Hat.png',
          tooltips: 'Red-Hat',
          key: '67' },
        { img: 'static/img/ci/icon/Redis.png',
          tooltips: 'Redis',
          key: '68' },
        { img: 'static/img/ci/icon/rizhi.png',
          tooltips: '日志',
          key: '69' },
        { img: 'static/img/ci/icon/rongliangkuozhan.png',
          tooltips: '容量扩展',
          key: '70' },
        { img: 'static/img/ci/icon/Router.png',
          tooltips: 'Router',
          key: '71' },
        { img: 'static/img/ci/icon/ruanjiankuguanli.png',
          tooltips: '监控设置',
          key: '72' },
        { img: 'static/img/ci/icon/Saltstack.png',
          tooltips: 'Saltstack',
          key: '73' },
        { img: 'static/img/ci/icon/Server-blade.png',
          tooltips: 'Server-blade',
          key: '74' },
        { img: 'static/img/ci/icon/Server-rack.png',
          tooltips: 'Server-rack',
          key: '75' },
        { img: 'static/img/ci/icon/Server.png',
          tooltips: 'Server',
          key: '76' },
        { img: 'static/img/ci/icon/shangwanghangweiguanliruanjianjinyong.png',
          tooltips: '软件禁用',
          key: '77' },
        { img: 'static/img/ci/icon/shengjifuwu.png',
          tooltips: '升级服务',
          key: '78' },
        { img: 'static/img/ci/icon/shenji.png',
          tooltips: '审计',
          key: '79' },
        { img: 'static/img/ci/icon/shipinhuiyi-xianxingicon.png',
          tooltips: '视频会议',
          key: '80' },
        { img: 'static/img/ci/icon/shouzhuomian.png',
          tooltips: '瘦桌面',
          key: '81' },
        { img: 'static/img/ci/icon/shujufenxi-liuliangfenxi.png',
          tooltips: '流量分析',
          key: '82' },
        { img: 'static/img/ci/icon/Subversion.png',
          tooltips: 'Subversion',
          key: '83' },
        { img: 'static/img/ci/icon/Ubuntu.png',
          tooltips: 'Ubuntu',
          key: '84' },
        { img: 'static/img/ci/icon/Vpn-concentrator.png',
          tooltips: 'Vpn-concentrator',
          key: '85' },
        { img: 'static/img/ci/icon/Vpn-gateway.png',
          tooltips: 'Vpn-gateway',
          key: '86' },
        { img: 'static/img/ci/icon/vpn.png', tooltips: 'vpn', key: '87' },
        { img: 'static/img/ci/icon/wangguanzhuangtai.png',
          tooltips: '网管状态',
          key: '88' },
        { img: 'static/img/ci/icon/wangluoruqinfangyu.png',
          tooltips: '网络入侵防御',
          key: '89' },
        { img: 'static/img/ci/icon/webloudongjiance.png',
          tooltips: 'web漏洞检测',
          key: '90' },
        { img: 'static/img/ci/icon/wenjianfenfa.png',
          tooltips: '文件分发',
          key: '91' },
        { img: 'static/img/ci/icon/Workgroup-switch.png',
          tooltips: 'Workgroup-switch',
          key: '92' },
        { img: 'static/img/ci/icon/xiang_box.png',
          tooltips: '箱',
          key: '93' },
        { img: 'static/img/ci/icon/xianlu.png',
          tooltips: '线路',
          key: '94' },
        { img: 'static/img/ci/icon/xuniji.png',
          tooltips: '虚拟机',
          key: '95' },
        { img: 'static/img/ci/icon/yunanquan.png',
          tooltips: '云安全',
          key: '96' },
        { img: 'static/img/ci/icon/yunpan.png',
          tooltips: '云盘',
          key: '97' },
        { img: 'static/img/ci/icon/Zabbix.png',
          tooltips: 'Zabbix',
          key: '98' },
        { img: 'static/img/ci/icon/zhengshupeizhi.png',
          tooltips: '证书配置',
          key: '99' },
        { img: 'static/img/ci/icon/zhongduanguanli.png',
          tooltips: '终端管理',
          key: '100' },
        { img: 'static/img/ci/icon/zhuji.png',
          tooltips: '主机',
          key: '101' },
        { img: 'static/img/ci/icon/zhuomianchi.png',
          tooltips: '桌面池',
          key: '102' },
        { img: 'static/img/ci/icon/zhuomianguanli.png',
          tooltips: '桌面管理',
          key: '103' },
        { img: 'static/img/ci/icon/zidingyijiankong.png',
          tooltips: '自定义监控',
          key: '104' },
        { img: 'static/img/ci/icon/ziyuanshiyongtongji.png',
          tooltips: '资源使用统计',
          key: '105' }
      ],
      midUpdateIcons: [],
      mateCis: [],
      enterValue: '',
      outValue: '',
      sameCigroupIds: [],
      selectedGroup: [],
      nowTemplateId: '',
      CItemplateId: '',
      CItemplate: '',
      putTempateId: ''
    }
  },
  methods: {
    routeTo () {
      this.$router.push({ path: '/ResourceAllocation/Template?code=2' })
    },
    // 模板模糊查询
    fuzzySearch () {
      let name = '',
        tepgroupId = ''
      this.templates = []
      axios.GetTemplateList(name, tepgroupId).then(res => {
        let tmpArr = res.data.data.result
        // this.templates =
        if (this.templetInput === '') {
          this.templates = res.data.data.result
        } else if (this.templetInput !== '') {
          tmpArr.forEach(item => {
            if (item.name.indexOf(this.templetInput) != -1) {
              this.templates.push(item)
            }
          })
        }
      })
    },

    cancelCreateNewType () {
      this.centerDialogVisible = false
      this.ruleForm3.classifyName = ''
      this.citypeNum = 0
    },
    // dialog关闭清除数据
    handleDialogClose () {
      this.$refs.ruleForm3.resetFields()
      this.centerDialogVisible = false
    },
    newCreateCI () {
      this.centerDialogVisible = true
      this.confirmEdit = false
      this.showRight = false
      this.ciDetail = false
    },
    closeIconDialog () {
      this.allIcons = this.icons
      this.icon = ''
    },
    closeUpdateIconDialog () {
      this.allupdatedIcons = this.updatedIcons
      this.updatedIcon = ''
    },
    editInputFun (value) {
      if (value) {
        this.editNumber = value.length
        //                    if(value.length<2){
        //                    this.showEditRedError=true;
        //                        this.$notify({
        //                            type: "error",
        //                            message: "名称字段至少需要2个以上字符"
        //                        });
        //                    }else{
        //                        this.showEditRedError=false;
        //                    }
      } else {
        this.editNumber = 0
      }
    },
    focusEdit (value) {
      if (value) {
        this.showEditSaveBtn = true
        this.showEditRedError = false
      }
    },
    blurEditCI (event) {
      if (this.editCiName.length < 2) {
        if (!event.relatedTarget && event.relatedTarget.id == 'cancelEdit') {
          this.showEditRedError = false
        } else {
          this.showEditRedError = true
          //   this.$notify({
          //   type: "error",
          //     message: "名称字段至少需要2个以上字符"
          //     });
        }
      } else if (this.editCiName.length >= 2) {
        this.showEditRedError = false
      }
    },
    // 获取ci分类详情：
    getCiDetail (cigroupID) {
      this.editcigroupId = cigroupID
      this.showEditSaveBtn = false
      this.showRight = false
      this.ciDetail = false
      this.confirmEdit = true
      this.ciTypeShow = false
      axios.ciDetail(cigroupID)
        .then(res => {
          if (res.data.code == 200) {
            this.editCiName = res.data.data.result.name
          }
        })
        .catch(() => {
          this.$notify({
            type: 'error',
            message: '获取ci分类详情失败'
          })
        })
    },
    // 编辑ci分类：
    editCi (value) {
      if (this.editCiName == '') {
        this.$notify({
          type: 'error',
          message: '名称不能为空'
        })
        this.showEditRedError = true
      } else if (this.editCiName != '' && this.editCiName.length < 2) {
        this.$notify({
          type: 'error',
          message: '名称字段至少需要2个以上字符'
        })
        this.showEditRedError = true
      } else {
        var reg = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/
        if (reg.test(this.editCiName)) {
          this.showEditRedError = false
          let data = { name: this.editCiName }
          axios.editCi(value, data)
            .then(res => {
              if (res.data.code == 200) {
                this.getCiTypeList()
                this.confirmEdit = false
                this.$notify({
                  type: 'success',
                  message: '修改成功'
                })
                this.ciTypeShow = true
                //                               this.showEditSaveBtn=true;
              } else if (res.data.code == 500) {
                this.$notify({
                  type: 'success',
                  message: res.data.message
                })
              }
            })
            .catch(() => {
              this.$notify({
                type: 'error',
                message: '编辑请求失败'
              })
            })
        }
        //                    else {
        //                        this.$notify({
        //                            type: "error",
        //                            message: "名称不符合规范"
        //                        });
        //                    }
      }
    },
    // 删除ci分类：
    confirmEditDelete (value) {
      this.editDeleteDialogVisible = false
      axios.deleteCi(value)
        .then(res => {
          if (res.data.code == 500) {
            this.$notify({
              type: 'error',
              message: res.data.message
            })
            this.editDeleteTitle = true
          } else {
            //                        let index2;

            let submenu2 = document.querySelector('.sonMenu')
            //                        let i2;
            this.ciNames.forEach((item, index, array) => {
              if (value == item.cigroupId) {
                //                                index1 =index;
                //                                i1 = (index1 + 1) * 62;
                //                                submenu1.style.top = i1 + 'px';
                submenu2.style.display = 'none'
                this.getCiItemList(this.selectedGroup)
              }
            })
            this.$notify({
              type: 'success',
              message: '删除成功'
            })
            this.getCiTypeList()
            this.confirmEdit = false
          }
        })
        .catch(() => {
          this.$notify({
            type: 'error',
            message: '删除失败'
          })
        })
    },
    returnEdit () {
      this.showEditSaveBtn = false
      this.showEditRedError = false
      this.getCiDetail(this.editcigroupId)
    },

    // 新增分类：
    createNewType () {
      this.$refs.ruleForm3.validate(valid => {
        if (valid) {
          // 检测ci名称是否已存在
          axios.checkCiName(this.ruleForm3.classifyName)
            .then(res => {
              if (!res.data.data.result) {
                this.centerDialogVisible = false
                let data = { name: this.ruleForm3.classifyName }
                axios.CreateNewType(data)
                  .then(res => {
                    if (res.data.code === 200) {
                      this.getCiTypeList()
                      this.$notify({
                        type: 'success',
                        message: '新增分类成功'
                      })
                      this.ruleForm3.classifyName = ''
                      this.citypeNum = 0
                    }
                  })
                  .catch(() => {
                    this.$notify({
                      type: 'error',
                      message: '新增失败'
                    })
                  })
              } else if (res.data.data.result) {
                this.centerDialogVisible = true
                this.$notify({
                  type: 'error',
                  message: '名称已存在'
                })
              }
            })
            .catch(() => {
              this.$notify({
                type: 'error',
                message: '检测失败'
              })
            })
        }
      })
      //      if (this.ruleForm3.classifyName == "") {
      //         this.centerDialogVisible = true;
      //        this.$notify({
      //         type: "error",
      //        message: "名称不能为空"
      //    });
      // } else if (this.ruleForm3.classifyName.length < 2) {
      //  this.centerDialogVisible = true;
      // this.$notify({
      //  type: "error",
      //  message: "名称字段至少需要2个以上字符"
      //        });
      //    } else {
      //     var reg = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
      //    if (reg.test(this.ruleForm3.classifyName)) {
      //
      //   } else {
      //    this.centerDialogVisible = true;
      //   this.$notify({
      //    type: "error",
      //   message: "名称只可以包含字母，数字，中文字符和下划线"
      //  });
      //  }
      //    }
    },
    // 获取ci分类列表：
    getCiTypeList () {
      let name = ''
      let templateId = ''
      axios.getCiTypeList(name, templateId)
        .then(res => {
          this.ciNames = res.data.data.result
        })
        .catch(() => {
          this.$notify({
            type: 'error',
            message: '获取ci分类列表失败'
          })
        })
    },
    // 数组去重：
    deleteSameData (arr) {
      var arr1 = []
      for (var i = 0; i < arr.length; i++) {
        if (arr1.indexOf(arr[i]) == -1) {
          arr1.push(arr[i])
        }
      }
      return arr1
    },
    // 获取ci类型列表：
    getCiItemList (value, n) {
      let name = ''
      if (n == 3) {
        name = this.ciName
      }
      let templateId = this.selectValue
      axios.getCiItemList(value, name, templateId)
        .then(res => {
          if (n == 3) {
            this.focusCitype = res.data.data.result
            this.sameCigroupIds = []
            this.focusCitype.forEach(item => {
              this.sameCigroupIds.push(item.cigroupId)
            })

            this.selectedGroup = this.deleteSameData(this.sameCigroupIds)
            if (this.selectedGroup.length == 1) {
              var index1
              let submenu1 = document.querySelector('.sonMenu')
              let i1

              this.ciNames.forEach((item, index, array) => {
                item.addHighLight = false
                if (item.cigroupId == this.selectedGroup) {
                  index1 = index
                  i1 = (index1 + 1) * 62
                  submenu1.style.top = i1 + 'px'
                  submenu1.style.display = 'block'
                  this.getCiItemList(this.selectedGroup)
                  this.confirmEdit = false
                  this.showRight = false
                  this.ciDetail = true
                  this.getCiTypeDetail(res.data.data.result[0].citypeId)
                }
              })
            }

            for (let n = 0; n < this.selectedGroup.length; n++) {
              for (let m = 0; m < this.ciNames.length; m++) {
                if (this.selectedGroup[n] == this.ciNames[m].cigroupId) {
                  this.ciNames[m].addHighLight = true
                }
              }
            }
          }
          this.cis = []
          // // console.log(res.data.data.result)
          let citypeArr = JSON.parse(JSON.stringify(res.data.data.result))
          // res.data.data.result.forEach(item => {
          // console.log(n);
          citypeArr.forEach((item, index) => {
            if (n === 0 && index === 0) {
              item.selected = true
            }
            if (item.cigroupId == value) {
              this.cis.push(item)
              if (item.name == this.ruleForm2.newCI_input) {
                this.newCitypeId = item.citypeId
              }
            }
          })

          if (this.ciName.length > 0) {
            this.changeColor(this.cis)
          }
          if (n == 1) {
            for (let t = 0; t < this.cis.length; t++) {
              if (this.ruleForm2.newCI_input == this.cis[t].name) {
                this.cis[t].selected = true
              } else {
                this.cis[t].selected = false
              }
            }
            this.getCiTypeDetail(this.newCitypeId)
          }
        })
        .catch(() => {
          this.$notify({
            type: 'error',
            message: '获取ci类型列表失败'
          })
        })
    },
    // 高亮显示：
    changeColor (cis) {
      this.mateCis = cis
      for (var i = 0; i < this.focusCitype.length; i++) {
        for (var j = 0; j < this.mateCis.length; j++) {
          if (this.focusCitype[i].citypeId == this.mateCis[j].citypeId) {
            this.mateCis[j].active = true
          }
        }
      }
    },
    // 新增ci类型：
    createNewCiItem (n) {
      // ci类型名称检测是否已存在
      axios.checkCiTyPeName(this.ruleForm2.newCI_input).then(res => {
        if (res.data.data.result) {
          this.$notify({
            type: 'error',
            message: '类型名称已存在'
          })
        } else {
          this.$refs.ruleForm2.validate(valid => {
            if (valid) {
              let data = {
                cigroupId: this.selectedciType,
                name: this.ruleForm2.newCI_input,
                icon: this.iconSrc,
                templateId: this.nowTemplateId
              }
              axios.createNewCiItem(data)
                .then(res => {
                  if (res.data.code == 200) {
                    this.getCiItemList(this.selectedciType, n)
                    this.$notify({
                      type: 'success',
                      message: '新增ci类型成功'
                    })
                    this.showRight = false
                    this.showSaveBtn = false
                    this.ciDetail = true
                    this.ciTypeShow = true
                  }
                })
                .catch(() => {
                  this.$notify({
                    type: 'error',
                    message: '新增ci类型失败'
                  })
                })
            }
          })
        }
      })
    },
    // 获取ci类型详情：
    getCiTypeDetail (citypeId) {
      axios.viewCiTypeDetail(citypeId)
        .then(res => {
          this.citypeID = res.data.data.result.citypeId
          this.ruleForm.name = res.data.data.result.name
          this.updateCiTypeNum = res.data.data.result.name.length
          this.ciIconVlue = res.data.data.result.icon
          console.log(res.data.data.result.icon)
          this.CItemplateId = res.data.data.result.templateId
          let name1 = '',
            tepgroupId1 = ''
          axios.GetTemplateList(name1, tepgroupId1).then(res => {
            let arr = res.data.data.result
            arr.forEach(item => {
              if (item.templateId == this.CItemplateId) {
                this.CItemplate = item.name
              }
            })
          })
          this.ciNames.forEach(item => {
            if (item.cigroupId == res.data.data.result.cigroupId) {
              this.ruleForm.classification = item.name
            }
          })
          let name2 = '',
            tepgroupId2 = ''
          axios.GetTemplateList(name2, tepgroupId2).then(res => {
            let arr = res.data.data.result
            arr.forEach(item => {
              if (item.templateId == this.CItemplateId) {
                this.templet = item.name
              }
            })
          })

          this.ruleForm2.newCI_input = ''
          this.showRedIcon = false
          this.iconSrc = ''
          this.showIconSuccess = false
          this.templet = ''
          this.showSuccess = false
          this.showRedError = false
          this.showSaveBtn = false
        })
        .catch(() => {
          this.$notify({
            type: 'error',
            message: '获取ci类型详情失败'
          })
        })
    },
    // 修改ci类型详情：
    submitUpdatedDetail () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.ciNames.forEach(item => {
            if (this.ruleForm.classification == item.name) {
              this.citypegroupId = item.cigroupId
            }
          })

          let data = {
            name: this.ruleForm.name,
            cigroupId: this.citypegroupId,
            icon: this.ciIconVlue,
            templateId: this.nowTemplateId
          }
          axios.updateCiTypeDetail(data, this.citypeID)
            .then(res => {
              if (res.data.code == 200) {
                this.$notify({
                  type: 'success',
                  message: '修改ci类型详情成功'
                })
                this.showDetailSaveBtn = false
                this.getCiItemList(this.selectedciType)
              }
            })
            .catch(() => {
              this.$notify({
                type: 'error',
                message: '修改ci类型详情失败'
              })
            })
        }
      })
      //  var reg = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
      //      if (this.ruleForm.name == "") {
      //       this.$notify({
      //         type: "error",
      //         message: "名称不能为空"
      //       });
      //       this.showRedError1 = true;
      //       return;
      //     } else if (this.ruleForm.name.length < 2) {
      //    this.showRedError1 = true;
      //   return;
      //  } else if (!reg.test(this.ruleForm.name)) {
      //   this.$notify({
      //   type: "error",
      //  message: "名称不符合规范"
      //       });
      //     this.showRedError1 = true;
      //   return;
      //      } else if (this.ciIconVlue == "") {
      //      this.$notify({
      //      type: "error",
      //    message: "图标不能为空"
      // });
      //     this.showRedError3 = true;
      //   return;
      // } else {

      // }
    },
    confirmDeleteCiType () {
      if (!this.ruleForm.name) {
        this.$notify({
          type: 'error',
          message: '请选择要删除的类型！'
        })
        return
      }
      this.confirmDeleteDialogVisible = true
    },
    // 删除ci类型：
    deleteCiType () {
      this.confirmDeleteDialogVisible = false
      axios.deleteCiType(this.citypeID)
        .then(res => {
          if (res.data.code == 200) {
            this.$notify({
              type: 'success',
              message: '删除成功'
            })
            this.ciDetail = false
            this.getCiItemList(this.selectedciType)
            this.ruleForm = {}
            this.ciTypeShow = false
          } else {
            this.$notify({
              type: 'error',
              message: res.data.message
            })
            this.deleteDialogVisible = true
          }
        })
        .catch(() => {
          this.$notify({
            type: 'error',
            message: '删除失败'
          })
        })
    },
    // 根据ci名称查询ciType
    searchCitype (cis) {
      var submenu = document.querySelector('.sonMenu')
      submenu.style.display = 'none'
      // getCiTypeList(name)
      //   .then(res => {
      //     this.ciNames = res.data.data.result;
      //   })
      //   .catch(() => {
      //     this.$notify({
      //       type: "error",
      //       message: "获取ci分类列表失败"
      //     });
      //   });
      let name = this.ciName
      let templateId = this.selectValue
      // name = this.ciName;
      // console.log(name, templateId);
      axios.getCiTypeList(name, templateId)
        .then(res => {
          // console.log(res);
          if (res.data.code === 200) {
            this.ciNames = res.data.data.result
            if (this.ciNames[0]) {
              // console.log(this.ciNames);
              this.getCiTypeId(
                0,
                this.ciNames[0].cigroupId,
                this.ciNames[0].name,
                0
              )
              let name1 = ''
              let templateId1 = this.selectValue
              axios.getCiItemList(this.ciNames[0].cigroupId, name1, templateId1).then(
                res => {
                  if (res.data.data.result[0]) {
                    let data = res.data.data.result[0]
                    this.citypeID = data.citypeId
                    // console.log(data);
                    this.ruleForm.name = data.name
                    this.ciNames.forEach(item => {
                      if (item.cigroupId == data.cigroupId) {
                        this.ruleForm.classification = item.name
                      }
                      this.ciIconVlue = data.icon
                      let name2 = '',
                        tepgroupId2 = ''
                      axios.GetTemplateList(name2, tepgroupId2).then(res => {
                        let arr = res.data.data.result
                        arr.forEach(item => {
                          if (item.templateId == data.templateId) {
                            this.templet = item.name
                          }
                        })
                      })
                    })
                  }
                }
              )
            } else {
              this.$notify({
                type: 'warning',
                message: '暂无数据！'
              })
              this.ruleForm.name = ''
              this.ruleForm.classification = ''
              this.ciIconVlue = ''
              this.templet = ''
            }
          }
          // this.focusCitype = res.data.data.result;
          // this.sameCigroupIds = [];
          // this.focusCitype.forEach(item => {
          //   this.sameCigroupIds.push(item.cigroupId);
          // });

          // this.selectedGroup = this.deleteSameData(this.sameCigroupIds);
          // if (this.selectedGroup.length == 1) {
          //   var index1;
          //   let submenu1 = document.querySelector(".sonMenu");
          //   let i1;

          //   this.ciNames.forEach((item, index, array) => {
          //     item.addHighLight = false;
          //     if (item.cigroupId == this.selectedGroup) {
          //       index1 = index;
          //       i1 = (index1 + 1) * 62;
          //       submenu1.style.top = i1 + "px";
          //       submenu1.style.display = "block";
          //       this.getCiItemList(this.selectedGroup);
          //       this.confirmEdit = false;
          //       this.showRight = false;
          //       this.ciDetail = true;
          //       this.getCiTypeDetail(res.data.data.result[0].citypeId);
          //     }
          //   });
          // }

          //   for (let n = 0; n < this.selectedGroup.length; n++) {
          //     for (let m = 0; m < this.ciNames.length; m++) {
          //       if (this.selectedGroup[n] == this.ciNames[m].cigroupId) {
          //         this.ciNames[m].addHighLight = true;
          //       }
          //     }
          //   }
          // this.cis = [];
          // res.data.data.result.forEach(item => {
          //   if (item.cigroupId == value) {
          //     this.cis.push(item);
          //     if (item.name == this.ruleForm2.newCI_input) {
          //       this.newCitypeId = item.citypeId;
          //     }
          //   }
          // });

          // if (this.ciName.length > 0) {
          //   this.changeColor(this.cis);
          // }
          // if (n == 1) {
          //   for (let t = 0; t < this.cis.length; t++) {
          //     if (this.ruleForm2.newCI_input == this.cis[t].name) {
          //       this.cis[t].selected = true;
          //     } else {
          //       this.cis[t].selected = false;
          //     }
          //   }
          //   this.getCiTypeDetail(this.newCitypeId);
          // }
        })
        .catch(() => {
          this.$notify({
            type: 'error',
            message: '获取ci类型列表失败'
          })
        })
    },
    // 模糊查询图标
    searchIcon () {
      this.midIcons = []
      this.allIcons = this.icons
      var reg = new RegExp(this.icon)
      this.allIcons.forEach(item => {
        if (item.tooltips.match(reg)) {
          this.midIcons.push(item)
        }
      })
      this.allIcons = this.midIcons
    },
    updateIcon_search () {
      this.midUpdateIcons = []
      this.allupdatedIcons = this.updatedIcons
      var reg = new RegExp(this.updatedIcon)
      this.allupdatedIcons.forEach(item => {
        if (item.tooltips.match(reg)) {
          this.midUpdateIcons.push(item)
        }
      })
      this.allupdatedIcons = this.midUpdateIcons
    },
    // selected() {
    //    this.showDetailSaveBtn = true;
    //  },
    updateIcon () {
      this.showDetailSaveBtn = true
      this.updateIconDialogVisible = true
      this.showRedError3 = false
    },
    submitCiItem (n) {
      if (this.iconSrc) {
        this.createNewCiItem(n)
      } else {
        this.$notify.error({
          title: '错误',
          message: '未添加图标！'
        })
      }
    },
    getCiTypeId (index, value, name, num) {
      this.confirmEdit = false
      this.showRight = false
      this.ciDetail = false
      for (let k = 0; k < this.ciNames.length; k++) {
        if (value == this.ciNames[k].cigroupId) {
          this.ciNames[k].addHighLight = true
        } else {
          this.ciNames[k].addHighLight = false
        }
      }

      var submenu = document.querySelector('.sonMenu')
      let i = (index + 1) * 62
      submenu.style.top = i + 'px'
      submenu.style.display = 'block'
      this.selectedciType = value
      this.activeIndex = this.selectedciType
      // let templateId = '';
      this.getCiItemList(value, num)
    },
    showRightContent () {
      this.confirmEdit = false
      this.showRight = true
      this.ciDetail = false
      this.templet = ''
      this.ciTypeShow = false
    },
    showCiDetail (groupId, value) {
      this.ciTypeShow = true
      // console.log(this.cis);
      for (let l = 0; l < this.cis.length; l++) {
        if (value == this.cis[l].citypeId) {
          this.cis[l].selected = true
        } else {
          this.cis[l].selected = false
        }
      }
      this.groupId = groupId
      this.citypeID = value
      this.getCiTypeDetail(value)
      this.showRight = false
      this.ciDetail = true
      this.confirmEdit = false
    },
    inputFun (value) {
      if (value) {
        this.number = value.length
      } else {
        this.number = 0
      }
    },
    getUpdateNum (value) {
      if (value) {
        this.updateCiTypeNum = value.length
        if (value.length >= 2) {
          this.showRedError1 = false
        }
        //                    this.showRedError1 = false;
      } else {
        this.updateCiTypeNum = 0
      }
    },
    blurUpdate (event) {
      // //                console.log(event.relatedTarget.id);
      if (this.ruleForm.name.length < 2) {
        if (event.relatedTarget) {
          if (event.relatedTarget.id == 'cancel') {
            this.showRedError1 = false
          } else {
            this.showRedError1 = true
            //   this.$notify({
            //      type: "error",
            //      message: "名称字段至少需要2个以上字符"
            //  });
          }
        }
      } else if (this.ruleForm.name.length >= 2) {
        this.showRedError1 = false
      }
    },
    focusUpdate () {
      this.showDetailSaveBtn = true
    },
    blurFun (event) {
      if (this.ruleForm2.newCI_input.length < 2) {
        this.showRedIcon = true
        this.showSuccess = false

        //  this.$notify({
        //    type: "error",
        //    message: "名称字段至少需要2个以上字符"
        //  });
      } else if (this.ruleForm2.newCI_input.length >= 2) {
        this.showSaveBtn = true
        this.showRedIcon = false
        this.showSuccess = true
      }
      // console.log('this.ruleForm2.newCI_input')
      //   console.log(this.ruleForm2.newCI_input)
      let regName = /^[-a-zA-Z0-9_.:@\u4e00-\u9fa5]+$/
      if (!regName.test(this.ruleForm2.newCI_input)) {
        console.log(this.ruleForm2.newCI_input)
        console.log('##############')
        this.showRedIcon = true
        this.showSuccess = false
        this.showSaveBtn = false
        this.$notify({
          title: '提示',
          message: '名称格式错误：请输入1~20位字符，可包含中文、字母、数字、点或下划线！',
          type: 'warning',
          duration: 1000
        })
      } else {
        this.showSaveBtn = true
        this.showRedIcon = false
        this.showSuccess = true
      }
    },
    focusFun () {
      if (this.newCI_Icon == '') {
        this.showRedError = true
      } else {
        this.showRedError = false
      }
    },
    // 选中图标过后的tooltip不能在搜索框中出现
    getIconName (tooltip, value) {
      //               this.icon=tooltip;
      this.midIcon = value
      this.confirmIcon(value)
    },
    getUpdatedIconName (tooltip, value) {
      //                this.updatedIcon=tooltip;
      this.updatedMIdIcon = value
      this.confirmUpdatedIcon(value)
    },
    confirmUpdatedIcon (value) {
      this.ciIconVlue = value
      this.updateIconDialogVisible = false
    },
    confirmIcon (value) {
      this.iconSrc = value
      if (this.iconSrc) {
        this.showSaveBtn = true
        this.showIconSuccess = true
        this.showRedError = false
      }
      this.iconDialogVisible = false
    },
    chooseTemplet (value) {
      this.nowTemplateId = value.templateId
      this.templet = value.name
      this.showTemplet = false
      this.showSaveBtn = true
    },
    getcityNameLength (value) {
      if (value) {
        this.citypeNum = value.length
      } else {
        this.citypeNum = 0
      }
    },
    returnBtn () {
      this.showDetailSaveBtn = false
      this.getCiTypeDetail(this.citypeID)
    },
    showEdit (value) {
      this.editcigroupId = value
      this.showRight = false
      this.ciDetail = false
      this.confirmEdit = true
    },
    returnNewciType () {
      this.showSaveBtn = false
      this.ruleForm2.newCI_input = ''
      this.number = 0
      this.iconSrc = ''
      this.templet = ''
      this.showSuccess = false
      this.showRedIcon = false
      this.showSaveBtn = false
      this.showIconSuccess = false
    },
    showEditDelete () {
      this.editDeleteDialogVisible = true
    },
    chooseTempletBtn () {
      this.showTemplet = !this.showTemplet
      this.GetTemplates()
      // this.templates
      this.flag = '1'
    },
    // 获取模板
    GetTemplates () {
      let name = '',
        tepgroupId = ''
      axios.GetTemplateList(name, tepgroupId).then(res => {
        this.templates = res.data.data.result
        // console.log(this.templates);
      })
    }
  },
  updated () { },

  mounted () {
    // this.getCiTypeList();
    this.GetTemplates()
    let obj = {
      name: '',
      templateId: ''
    }
    // let name = "";
    // let templateId = ""
    axios.getcigrouptablist(obj)
      .then(res => {
        this.ciNames = res.data.data.result
        // console.log(this.ciNames);
        if (this.ciNames[0]) {
          this.ciNames[0].addHighLight = true
          this.getCiTypeId(
            0,
            this.ciNames[0].cigroupId,
            this.ciNames[0].name,
            0
          )
          let name1 = ''
          let templateId1 = ''
          axios.getCiItemList(this.ciNames[0].cigroupId, name1, templateId1).then(
            res => {
              if (res.data.data.result[0]) {
                let data = res.data.data.result[0]
                this.citypeID = data.citypeId
                // console.log(data);
                this.ruleForm.name = data.name
                this.updateCiTypeNum = data.name.length
                this.ciNames.forEach(item => {
                  if (item.cigroupId == data.cigroupId) {
                    this.ruleForm.classification = item.name
                  }
                  this.ciIconVlue = data.icon
                  let name2 = '',
                    tepgroupId2 = ''
                  axios.GetTemplateList(name2, tepgroupId2).then(res => {
                    let arr = res.data.data.result
                    arr.forEach(item => {
                      if (item.templateId == data.templateId) {
                        this.templet = item.name
                      }
                    })
                  })
                })
              }
            }
          )
        }
      })
      .catch(() => {
        this.$notify({
          type: 'error',
          message: '获取ci分类列表失败'
        })
      })
  },
  watch: {
    $route (newPath, oldPath) {
      // console.log(newPath, oldPath);
      // //                console.log(this.$route);
    }
  }
}
</script>

<style scoped lang="scss">
.containBox {
  margin: 10px;
  padding: 20px;
  background-color: #fff;
  overflow: auto;
  min-height: 500px;
  .head {
    margin-bottom: 20px;
    .flexsty {
      align-items: center;
    }
  }
  .content-wrapper {
    .right-content {
      /*margin-left:10%;*/
      padding: 1rem 4rem;
      /*width: 57%;*/
      height: 35rem;
      background: white;
      border: 1px solid #e4dbdb;
      border-radius: 1%;
      box-shadow: 5px 5px 3px #eee;
      .newIcon {
        .button-wrapper {
          margin-left: 2rem;
        }
        .newIconWrapper {
          border: 1px solid lightgray;
          height: 4rem;
          text-align: center;
          line-height: 4rem;
          font-size: 2rem;
          .icons {
            margin-top: 9px;
            width: 25px;
          }
        }
      }
      .exceptStoreBtn {
        height: 40rem;
      }

      .exceptStoreBtnTotop {
        height: 28rem;
      }
    }
    .edit-content {
      /*margin-left:10%;*/
      padding: 1rem 4rem;
      /*width: 57%;*/
      height: 30rem;
      background: white;
      border: 1px solid #e4dbdb;
      border-radius: 1%;
      box-shadow: 5px 5px 3px #eee;
    }
    .ciDetail-wrapper {
      /*margin-left:10%;*/
      padding: 1rem 4rem;
      /*width: 57%;*/
      height: 40rem;
      background: white;
      border: 1px solid #e4dbdb;
      border-radius: 1%;
      box-shadow: 5px 5px 3px #eee;
      .detail-icon {
        .updateIconBtn {
          margin-left: 2rem;
          .el-button {
            background-color: #00A8E8;
            color: #fff;
          }
        }
      }
    }
    .sonMenu {
      position: absolute;
      left: 15%;
      top: 0;
      display: none;
      width: 12%;
      .sonMenu-ul {
        list-style: none;
        li {
          cursor: pointer;
          padding: 10px;
          height: 40px;
          line-height: 40px;
          text-align: center;
          border: 1px solid #e4dbdb;
          background: #fff;
          .iconImg_wrapper {
            width: 20px;
            height: 20px;
            display: inline-block;
            /*background-color: #00d1b2;*/
          }
        }
      }
    }
    .fatherMenu1 {
      width: 50%;
      .fatherMenu-ul {
        list-style: none;
        li {
          width: 85%;
          padding: 10px;
          height: 40px;
          line-height: 40px;
          text-align: center;
          border: 1px solid #e4dbdb;
          background: #fff;
          cursor: pointer;
        }
      }
    }
    .newCITitle {
      text-align: center;
      // font-size: 1.2rem;
      // padding-top: 1rem;
    }
    .li-item {
      font-size: 0.9rem;
      &:hover {
        font-weight: bold;
      }
      .editicon {
        img {
          height: 16px;
        }
      }
    }
    .lione {
      background: url("../../../static/img/icon/icon_add.png") no-repeat;
      background-position: 18px 21px;
      background-size: 16px 16px;
      background-color: #00A8E8!important;
      color: #fff;
      cursor: pointer;
      border: 1px solid #00A8E8 !important;
      border-bottom: 2px solid #00A8E8 !important;
    }
  }
  .delicon {
    font-size: 2rem;
    cursor: pointer;
    img {
      height: 24px;
      margin-top: 10px;
    }
  }
  .down-wrapper {
    height: 15rem;
    border: 1px solid lightgray;
    padding: 1rem;
  }
  .smallbtn-wrapper {
    button {
      background-color: #00A8E8;
      color: white;
      font-size: 1rem;
    }
  }
  .dialog-input-wrapper {
    margin-bottom: 2rem;
  }
  .icon-wrapper {
    padding: 1rem;
    border: 1px solid lightgray;
    height: 11rem;
    overflow-y: scroll;
    .icon-border {
      height: 4.3rem;
      border: 1px solid lightgray;
      border-radius: 50%;
      margin-left: 1rem;
      margin-bottom: 1rem;
      text-align: center;
      line-height: 6.5rem;
      .addimg {
        width: 35px;
      }
    }
  }
  .deleteDialog-footer-wrapper {
    margin-top: 2rem;
    text-align: center;
    .el-button {
      background-color: rgb(22, 155, 213);
      color: #fff;
    }
  }
  .confirmDeleteDialog-footer-wrapper {
    margin-top: 2rem;
    text-align: center;
    .confirmDeleteDialog-footer {
      .el-button:nth-child(1) {
        color: #fff;
      }
    }
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.4s ease;
  }

  .fade-enter,
  .fade-leave-to {
    transform: translateY(-5rem);
  }
  .el-menu--collapse {
    width: 222px !important;
  }
  .el-submenu__icon-arrow {
    display: block !important;
  }
  .el-menu--collapse {
    border: 1px solid #e4dbdb;
  }
  .el-icon-arrow-right {
    display: block !important;
  }
  .newCIName,
  .nameWrapper,
  .classificationWrapper {
    margin-top: 2rem;
    margin-bottom: 3rem;
  }
  .templet-wrapper .el-button,
  .button-wrapper .el-button {
    /* background: linear-gradient(
      left,
      #ff4b95 0%,
      #9f43bd 28%,
      #3e3be4 100%
    ) !important; */
    background-color: #00A8E8;
    color: white;
    font-size: 1.1rem;
  }
  .mrgTop {
    margin-top: 0.7rem;
  }
  .el-col-1 {
    .el-icon-error {
      color: red;
    }
    .el-icon-success {
      color: dodgerblue;
    }
  }
  .activeColor {
    /* color: rgb(7, 196, 168); */
    color: #00A8E8 !important;
    border: 1px solid #00A8E8 !important;
  }

  .selectedColor {
    /* color: rgb(7, 196, 168); */
    color: #00A8E8 !important;
    border: 1px solid #00A8E8 !important;
  }

  .highLight {
    /* color: rgb(7, 196, 168); */
    color: #00A8E8;
    // border: 1px solid #00A8E8 !important;
  }
  .blueBorder {
    border: 1px solid rgb(22, 155, 213);
  }

  .redColor {
    color: red;
  }
  .selectedColor {
    color: rgb(7, 196, 168);
  }
  .deleteIcon:hover {
    color: brown;
  }
  .addNewciType {
    cursor: pointer;
    color: rgb(66, 59, 226);
    &:hover {
      font-weight: bolder;
    }
  }
  .el-input {
    position: relative;
    font-size: 14px;
    display: inline-block;
    width: 70%;
  }
  .el-form-item {
    margin-bottom: 36px;
    width: 80%;
    margin-left: 13%;
  }
}
</style>
