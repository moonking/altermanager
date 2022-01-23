<template>
  <div class="contentBoxcitype aibms-ci">
    <div
      id="invisibleCover"
      v-show="
        islabelName ||
        singleLineInput ||
        multiLineInput ||
        pwdInput ||
        numInput ||
        selectInput ||
        dateInput
      "
      @click="closeForm()"
    ></div>
    <div class="left-side all-aibms-color-bg">
      <div class="left-side-title" @click="routeTo()">
        <i class="el-icon-setting"></i>
        <span>管理CI类型</span>
        <i class="el-icon-arrow-right left-arrow-icon"></i>
      </div>
      <div
        class="tree-wrapper"
        v-for="ciType in CITypeItems"
        :key="ciType.itemTpyeId"
      >
        <div class="tree-block">
          <div
            class="tree-block-title"
            @click="clickCIType(ciType.cigroupId)"
            :title="ciType.name"
          >
            <i
              class="el-icon-caret-bottom iconStyle"
              v-show="ciType.ifShow"
            ></i>
            <i
              class="el-icon-caret-right iconStyle"
              v-show="!ciType.ifShow"
            ></i>
            <p
              style="
                display: inline-block;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                width: 100px;
              "
            >
              {{ ciType.name }}
            </p>
          </div>
          <el-collapse-transition>
            <div v-show="ciType.ifShow">
              <div
                style="display: flex"
                :class="{ highLigtht: item.addHighLight }"
                :title="item.name"
                class="tree-block-item"
                v-for="(item, index) in ciType.citypeList"
                :key="index"
                @click="getCITypeItemDetail(item.citypeId, item)"
              >
                <img
                  style="width: 16px; height: 16px; align-items: center"
                  :src="'../../../' + item.icon"
                />
                <p
                  style="
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    width: 90px;
                  "
                >
                  {{ '&nbsp;&nbsp;' + item.name }}
                </p>
              </div>
            </div>
          </el-collapse-transition>
        </div>
      </div>
    </div>
    <div class="right-content">
      <div class="search-form">
        <el-input
          clearable
          class="search-input"
          v-model="searchSubarea"
          placeholder="CI类型名称"
        ></el-input>
        <el-button
          icon="el-icon-search"
          class="search-el-button item-right"
          @click="fuzzySearch"
          >查找</el-button
        >
      </div>
      <div class="tabs-wrapper noborder all-aibms-color-bg">
        <el-tabs
          v-model="activeName"
          @tab-click="handleClick"
          v-if="currentType.name"
        >
          <el-tab-pane label="类型属性" name="first"></el-tab-pane>
          <el-tab-pane label="类型关系" name="second"></el-tab-pane>

          <el-row type="flex" class="row-bg" v-if="visible">
            <el-col :span="12">
              <div class="type-msg">
                <!-- 名称输入框 单独一个分区-->
                <div>
                  <div class="subarea">
                    <div class="subareaContent">
                      <!-- 表单中input框的添加删除 -->
                      <el-form
                        :model="subareaLabelName"
                        ref="subareaLabelName"
                        label-width="100px"
                        class="demo-dynamic"
                      >
                        <div
                          v-for="(
                            domain1, domainIndex1
                          ) in subareaLabelName.extend"
                          :key="domainIndex1 + domain1.label"
                        >
                          <el-form-item :label="domain1.label">
                            <el-col :span="20">
                              <el-input
                                v-if="
                                  domain1.type == 'singleLineInput' ||
                                  domain1.type == 'optionsInputSys' ||
                                  domain1.type == 'optionsInputEnv'
                                "
                                v-model="domain1.defaultValue"
                                disabled
                              ></el-input>
                              <el-select
                                style="width: 100%"
                                v-if="domain1.type == 'credentialsSelect'"
                                v-model="domain1.defaultValue"
                                placeholder="请选择"
                                @change="changeCredential"
                              >
                                <el-option
                                  v-for="item in options"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value"
                                ></el-option>
                              </el-select>
                            </el-col>
                            <el-col :span="4">
                              <!-- <i
                                class="el-icon-delete deleteSubarea"
                                v-if="domain1.type == 'credentialsSelect'"
                                @click.prevent="deleteCredential"
                              ></i>-->
                              <div
                                v-if="domain1.type == 'credentialsSelect'"
                                @click.prevent="deleteCredential"
                                class="delicon"
                              >
                                <!-- <img src="../../../static/img/del_icon.png" alt> -->
                                <icon-svg
                                  icon-class="lajitong"
                                  class="template-icon-size"
                                />
                              </div>
                            </el-col>
                          </el-form-item>
                        </div>
                      </el-form>
                    </div>
                  </div>
                </div>

                <!-- 分区 -->
                <draggable v-model="subareaGroups" @end="onEnd">
                  <transition-group>
                    <div
                      v-for="(subarea, subareaIndex) in subareaGroups"
                      :key="subareaIndex + subarea.title"
                    >
                      <div class="subarea">
                        <div class="subareaHeader">
                          {{ subarea.title }}
                          <!-- <i
                            class="el-icon-delete deleteSubarea"
                            @click="clickDeletSubarea(subareaIndex)"
                          ></i>-->
                          <div
                            @click="clickDeletSubarea(subareaIndex)"
                            class="delicon"
                          >
                            <!-- <img src="../../../static/img/del_icon.png" alt /> -->
                            <icon-svg
                              icon-class="lajitong"
                              class="template-icon-size"
                            />
                          </div>
                        </div>
                        <div class="subareaContent">
                          <!-- 表单中input框的添加删除 -->
                          <el-form
                            :model="subarea"
                            ref="subarea"
                            label-width="100px"
                            class="demo-dynamic"
                          >
                            <draggable v-model="subarea.extend" @end="onEnd">
                              <transition-group>
                                <div
                                  v-for="(
                                    domain, domainIndex
                                  ) in subarea.extend"
                                  :key="domainIndex + domain.label"
                                >
                                  <el-form-item
                                    :label="domain.label"
                                    :key="domain.key"
                                  >
                                    <el-col :span="20">
                                      <el-select
                                        :clearable="true"
                                        style="width: 100%"
                                        aria-placeholder="请选择凭证"
                                        v-if="
                                          domain.type == 'credentialsSelect'
                                        "
                                        v-model="domain.defaultValue"
                                        placeholder="请选择"
                                        @change="changeCredential"
                                      >
                                        <el-option
                                          v-for="item in options"
                                          :key="item.value"
                                          :label="item.label"
                                          :value="item.value"
                                        ></el-option>
                                      </el-select>

                                      <el-input
                                        v-model="domain.defaultValue"
                                        v-else
                                        @focus="
                                          getDomian(
                                            domain,
                                            domainIndex,
                                            subareaIndex
                                          )
                                        "
                                      ></el-input>
                                    </el-col>
                                    <el-col :span="4">
                                      <!-- <i
                                        class="el-icon-delete deleteSubarea"
                                        @click.prevent="removeDomain(domain,subareaIndex)"
                                      ></i>-->
                                      <div
                                        @click.prevent="
                                          removeDomain(domain, subareaIndex)
                                        "
                                        class="delicon"
                                      >
                                        <!-- <img src="../../../static/img/del_icon.png" alt /> -->
                                        <icon-svg
                                          icon-class="lajitong"
                                          class="template-icon-size"
                                        />
                                      </div>
                                    </el-col>
                                  </el-form-item>
                                </div>
                              </transition-group>
                            </draggable>
                          </el-form>
                        </div>
                      </div>
                    </div>
                  </transition-group>
                </draggable>
              </div>
              <div
                class="btnGroup"
                v-if="noneChange"
                style="margin-bottom: 40px"
              >
                <el-row>
                  <el-col :span="6" :offset="2">
                    <el-button type="primary" @click="clickSubmit"
                      >确定</el-button
                    >
                  </el-col>

                  <el-col :span="6" :offset="6">
                    <el-button class="nomal-button" @click="cancleChange"
                      >取消</el-button
                    >
                  </el-col>
                </el-row>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="type-tempalte">
                <div class="type-tempalte-title">
                  <span
                    style="
                      font-size: 28px;
                      line-height: 80px;
                      display: inline-block;
                      padding-left: 23px;
                      float: left;
                    "
                    >模板</span
                  >
                  <span
                    style="
                      font-size: 12px;
                      line-height: 80px;
                      display: inline-block;
                      float: right;
                      padding-right: 18px;
                      margin-right: 23px;
                    "
                  >
                    基本信息
                    <icon-svg icon-class="duo" class="whiteness-icon-color" />
                  </span>
                </div>
                <div class="type-tempalte-content">
                  <div class="addAttribute">添加属性</div>
                  <div
                    style="width: 95%; margin: auto; margin-top: 15px"
                    @click="clickAttributeInput($event)"
                  >
                    <el-row class="inputGroup">
                      <el-col :span="12">
                        <div class="addSubarea">
                          <div
                            class="addSubareaBtn"
                            @click="clickAddSubArea($event)"
                          >
                            <el-button type="text">新增分区</el-button>
                          </div>
                        </div>
                      </el-col>
                      <el-col :span="12">
                        <div class="addSubarea">
                          <div
                            class="addSubareaBtn"
                            @click="clickAddCredentials($event)"
                          >
                            <el-button type="text">凭证属性</el-button>
                          </div>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row class="inputGroup">
                      <el-col :span="12">
                        <div
                          class="inputType"
                          style="
                            background-image: url('../../../static/img/text1.png');
                          "
                        >
                          <p class="inputTypeName">单行文本框 +</p>
                        </div>
                      </el-col>
                      <el-col :span="12">
                        <div
                          class="inputType"
                          style="
                            background-image: url('../../../static/img/text2.png');
                          "
                        >
                          <p class="inputTypeName">多行文本框 +</p>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row class="inputGroup">
                      <el-col :span="12">
                        <div
                          class="inputType"
                          style="
                            background-image: url('../../../static/img/text3.png');
                          "
                        >
                          <p class="inputTypeName">密码框 +</p>
                        </div>
                      </el-col>
                      <el-col :span="12">
                        <div
                          class="inputType"
                          style="
                            background-image: url('../../../static/img/text4.png');
                          "
                        >
                          <p class="inputTypeName">数字框 +</p>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row class="inputGroup">
                      <el-col :span="12">
                        <div
                          class="inputType"
                          style="
                            background-image: url('../../../static/img/text5.png');
                          "
                        >
                          <p class="inputTypeName">选择框 +</p>
                        </div>
                      </el-col>
                      <el-col :span="12">
                        <div
                          class="inputType"
                          style="
                            background-image: url('../../../static/img/text6.png');
                          "
                        >
                          <p class="inputTypeName">时间日期 +</p>
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>

          <el-row
            :gutter="6"
            v-else
            style="border: 1px solid #e0e0e0"
            class="row-content"
          >
            <el-col :span="17" @click.stop="clearAll">
              <app-chart
                style="width: 100%; height: 600px"
                :nodeTypeId="nodeTypeId"
                :chartType="chartType"
                @editType="editType"
                @deletetype="handleDeleteType"
              ></app-chart>
            </el-col>
            <el-col :span="7" class="content-wrapper">
              <div class="top-btn">
                <span
                  @click="addNewPre"
                  style="border-right: 1px solid #00a8e8"
                  :class="{ active: selectTab }"
                  >新增上层结构</span
                >
                <span @click="addNewNex" :class="{ active: !selectTab }"
                  >新增下层结构</span
                >
              </div>
              <div class="top-content">
                <el-form>
                  <el-form-item>
                    <el-popover
                      placement="bottom-end"
                      width="240"
                      trigger="manual"
                      v-model="visibedRelation"
                    >
                      <div class="gx-box">
                        <ul>
                          <li
                            v-for="tag in gxTagsList"
                            :key="tag.lab"
                            @click="getgxTag(tag.val)"
                          >
                            {{ tag.val }}
                          </li>
                        </ul>
                      </div>
                      <div
                        slot="reference"
                        class="box-font"
                        @click="clickRelation"
                      >
                        <p class="font-styles" v-if="gxTag">{{ gxTag }}</p>
                        <p class="font-styles" v-else>选择关系</p>
                      </div>
                    </el-popover>
                  </el-form-item>
                  <el-form-item>
                    <el-popover
                      placement="bottom-end"
                      width="240"
                      trigger="manual"
                      v-model="visibedCondition"
                    >
                      <div class="gx-box">
                        <ul>
                          <li
                            v-for="tag in tjTagsList"
                            :key="tag.lab"
                            @click="gettjTag(tag.val)"
                          >
                            {{ tag.val }}
                          </li>
                        </ul>
                      </div>
                      <div
                        slot="reference"
                        class="box-font"
                        @click="clickCondition"
                      >
                        <p class="font-styles" v-if="tjTag">{{ tjTag }}</p>
                        <p class="font-styles" v-else>选择对应条件</p>
                      </div>
                    </el-popover>
                  </el-form-item>
                  <el-form-item>
                    <el-popover
                      placement="bottom-end"
                      width="240"
                      trigger="manual"
                      v-model="visibed"
                    >
                      <div class="type-box">
                        <el-tree
                          :data="typeTagsList"
                          :highlight-current="true"
                          :props="defaultProps"
                          @node-click="handleNodeClick"
                        ></el-tree>
                      </div>
                      <div slot="reference" class="box-font" @click="clickBox">
                        <p class="font-styles" v-if="typeTag">{{ typeTag }}</p>
                        <p class="font-styles" v-else>选择CI类型</p>
                      </div>
                    </el-popover>
                  </el-form-item>
                </el-form>
              </div>
              <div style="text-align: center">
                <el-button type="primary" @click="confirm">确认</el-button>
                <el-button class="nomal-button" @click="cancleTag"
                  >取消</el-button
                >
              </div>
            </el-col>
          </el-row>
        </el-tabs>
      </div>
      <!-- 弹出表单 -->
      <!-- 名称input特用弹出框 -->
      <!-- <div class="editSubarea" v-show="islabelName">
        <div class="editTitle">编辑--名称</div>
        <div class="subareaForm">
          <el-form ref="form" :model="subareaLabelName.extend[0]" style="width: 85%;margin: auto;">
            <div class="attributeItem">
              <p>
                <span style="color: red">*</span>字段名
              </p>
              <el-input class="inputSize" v-model="subareaLabelName.extend[0].label" maxlength="20"></el-input>
            </div>
            <div class="attributeItem">
              <p>默认值</p>
              <el-input v-model="subareaLabelName.extend[0].defaultValue"></el-input>
            </div>
          </el-form>
        </div>
      </div>-->
      <div class="editSubarea" v-show="singleLineInput">
        <div class="editTitle">编辑--单行文本框属性</div>
        <div class="subareaForm">
          <el-form ref="form" :model="form" style="width: 85%; margin: auto">
            <div class="attributeItem">
              <p><span style="color: red">*</span>字段名</p>
              <el-input
                class="inputSize"
                v-model="form.label"
                maxlength="20"
              ></el-input>
            </div>
            <div class="attributeItem">
              <p>默认值</p>
              <el-input v-model="form.defaultValue"></el-input>
            </div>
            <div class="attributeItem">
              <p>验证规则</p>
              <el-select style="width: 100%" v-model="form.rules">
                <el-option label="无" value="0"></el-option>
                <el-option
                  label="URL"
                  :value="JSON.stringify(urlRule)"
                ></el-option>
                <el-option
                  label="IP地址"
                  :value="JSON.stringify(IpRule)"
                ></el-option>
                <el-option
                  label="子网掩码"
                  :value="JSON.stringify(maskRule)"
                ></el-option>
                <el-option
                  label="端口号"
                  :value="JSON.stringify(portRule)"
                ></el-option>
                <el-option
                  label="Email"
                  :value="JSON.stringify(EmailRule)"
                ></el-option>
                <el-option
                  label="手机号码"
                  :value="JSON.stringify(phoneRule)"
                ></el-option>
              </el-select>
            </div>
            <div class="attributeItem">
              <p>最小文本长度</p>
              <el-input
                @keyup.native="proving"
                v-model="form.minLength"
                :disabled="
                  form.rules === '' ? false : form.rules === '0' ? false : true
                "
              ></el-input>
            </div>
            <div class="attributeItem">
              <p>最大文本长度</p>
              <el-input
                @keyup.native="proving"
                v-model="form.maxLength"
                :disabled="
                  form.rules === '' ? false : form.rules === '0' ? false : true
                "
              ></el-input>
            </div>
            <div class="attributeItem">
              <el-checkbox  label="必填" v-model="form.required"></el-checkbox>
              <el-checkbox  label="只读" v-model="form.readOnly"></el-checkbox>
            </div>
            <p style="font-size: 12px; color: red" v-show="isRequiredInput">
              必填项不能为空
            </p>
            <p style="font-size: 12px; color: red" v-show="isErrorInput">
              最大文本长度和最小文本长度冲突
            </p>
          </el-form>
        </div>
      </div>
      <div class="editSubarea" v-show="multiLineInput">
        <div class="editTitle">编辑--多行文本框属性</div>
        <div class="subareaForm">
          <el-form ref="form" :model="form" style="width: 85%; margin: auto">
            <div class="attributeItem">
              <p><span style="color: red">*</span>字段名</p>
              <el-input
                class="inputSize"
                v-model="form.label"
                maxlength="20"
              ></el-input>
            </div>
            <div class="attributeItem">
              <p>默认值</p>
              <el-input v-model="form.defaultValue"></el-input>
            </div>
            <div class="attributeItem">
              <p>数据类型</p>
              <el-select style="width: 100%" v-model="form.dataType">
                <el-option label="无" value="0"></el-option>
                <el-option label="Plain Text" value="Plain Text"></el-option>
                <el-option label="JSON" value="JSON"></el-option>
              </el-select>
            </div>
            <div class="attributeItem">
              <p>最小文本长度</p>
              <el-input
                @keyup.native="proving"
                v-model="form.minLength"
              ></el-input>
            </div>
            <div class="attributeItem">
              <p>最大文本长度</p>
              <el-input
                @keyup.native="proving"
                v-model="form.maxLength"
              ></el-input>
            </div>
            <div class="attributeItem">
              <el-checkbox  label="必填" v-model="form.required"></el-checkbox>
              <el-checkbox  label="只读" v-model="form.readOnly"></el-checkbox>
            </div>
            <p style="font-size: 12px; color: red" v-show="isRequiredInput">
              必填项不能为空
            </p>
            <p style="font-size: 12px; color: red" v-show="isErrorInput">
              最大文本长度和最小文本长度冲突
            </p>
          </el-form>
        </div>
      </div>
      <div class="editSubarea" v-show="pwdInput">
        <div class="editTitle">编辑--密码框属性</div>
        <div class="subareaForm">
          <el-form ref="form" :model="form" style="width: 85%; margin: auto">
            <div class="attributeItem">
              <p><span style="color: red">*</span>字段名</p>
              <el-input
                class="inputSize"
                v-model="form.label"
                maxlength="20"
              ></el-input>
            </div>
            <div class="attributeItem">
              <p>默认值</p>
              <el-input v-model="form.defaultValue"></el-input>
            </div>
            <div class="attributeItem">
              <p>验证器</p>
              <el-select style="width: 100%" v-model="form.verifier">
                <el-option label="无" value="0"></el-option>
                <el-option
                  label="数字与字母组合"
                  :value="JSON.stringify(dateAndCode)"
                ></el-option>
                <el-option
                  label="数字或字母组合"
                  :value="JSON.stringify(dateOrCode)"
                ></el-option>
                <el-option
                  label="纯数字"
                  :value="JSON.stringify(onlyDate)"
                ></el-option>
                <el-option
                  label="纯字母"
                  :value="JSON.stringify(onlyCode)"
                ></el-option>
              </el-select>
            </div>
            <div class="attributeItem">
              <p>最小文本长度</p>
              <el-input
                @keyup.native="proving"
                v-model="form.minLength"
              ></el-input>
            </div>
            <div class="attributeItem">
              <p>最大文本长度</p>
              <el-input
                @keyup.native="proving"
                v-model="form.maxLength"
              ></el-input>
            </div>
            <div class="attributeItem">
              <el-checkbox  label="必填" v-model="form.required"></el-checkbox>
              <el-checkbox  label="只读" v-model="form.readOnly"></el-checkbox>
            </div>
            <p style="font-size: 12px; color: red" v-show="isRequiredInput">
              必填项不能为空
            </p>
            <p style="font-size: 12px; color: red" v-show="isErrorInput">
              最大文本长度和最小文本长度冲突
            </p>
          </el-form>
        </div>
      </div>
      <div class="editSubarea" v-show="numInput">
        <div class="editTitle">编辑--数字框属性</div>
        <div class="subareaForm">
          <el-form ref="form" :model="form" style="width: 85%; margin: auto">
            <div class="attributeItem">
              <p><span style="color: red">*</span>字段名</p>
              <el-input
                class="inputSize"
                v-model="form.label"
                maxlength="20"
              ></el-input>
            </div>
            <div class="attributeItem">
              <p>默认值</p>
              <el-input v-model="form.defaultValue"></el-input>
            </div>
            <div class="attributeItem">
              <p>单位</p>
              <el-input v-model="form.unit"></el-input>
            </div>
            <div class="attributeItem">
              <p>验证规则</p>
              <el-select style="width: 100%" v-model="form.rules">
                <el-option label="无" value="0"></el-option>
                <el-option
                  label="非负数"
                  :value="JSON.stringify(nonnegativeRule)"
                ></el-option>
                <el-option
                  label="正整数"
                  :value="JSON.stringify(positiveRule)"
                ></el-option>
              </el-select>
            </div>
            <div class="attributeItem">
              <p>最小文本长度</p>
              <el-input
                @keyup.native="proving"
                v-model="form.minLength"
              ></el-input>
            </div>
            <div class="attributeItem">
              <p>最大文本长度</p>
              <el-input
                @keyup.native="proving"
                v-model="form.maxLength"
              ></el-input>
            </div>
            <div class="attributeItem">
              <el-checkbox  label="必填" v-model="form.required"></el-checkbox>
              <el-checkbox  label="只读" v-model="form.readOnly"></el-checkbox>
            </div>
            <p style="font-size: 12px; color: red" v-show="isRequiredInput">
              必填项不能为空
            </p>
            <p style="font-size: 12px; color: red" v-show="isErrorInput">
              最大文本长度和最小文本长度冲突
            </p>
          </el-form>
        </div>
      </div>
      <div class="editSubarea" v-show="selectInput">
        <div class="editTitle">编辑--选择框属性</div>
        <div class="subareaForm">
          <el-form
            ref="form"
            :model="form"
            style="width: 85%; margin: auto"
            @submit.native.prevent
          >
            <div class="attributeItem">
              <p>
                <span style="color: red">*</span>
                字段名
              </p>
              <el-input
                class="inputSize"
                v-model="form.label"
                maxlength="20"
              ></el-input>
            </div>
            <div class="attributeItem">
              <p>
                <span style="color: red">*</span>
                自定义选项
              </p>
              <el-button
                size="mini"
                v-for="(item, index) in form.defined"
                @click="deleteItem(index)"
                :key="index"
                >{{ item }}</el-button
              >
              <el-input
                style="margin-top: 8px"
                placeholder="输入后，点击回车"
                v-model="definedItem"
                @keyup.enter.native="addDefined()"
              ></el-input>
            </div>
            <div class="attributeItem">
              <el-checkbox  label="多选" v-model="form.moreSelect"></el-checkbox>
              <el-checkbox  label="必填" v-model="form.required"></el-checkbox>
              <!-- <el-checkbox label="只读" v-model="form.readOnly"></el-checkbox> -->
            </div>
            <p style="font-size: 12px; color: red" v-show="isRequiredInput">
              必填项不能为空
            </p>
          </el-form>
        </div>
      </div>
      <div class="editSubarea" v-show="dateInput">
        <div class="editTitle">编辑--时间日期框属性</div>
        <div class="subareaForm">
          <el-form ref="form" :model="form" style="width: 85%; margin: auto">
            <div class="attributeItem">
              <p><span style="color: red">*</span>字段名</p>
              <el-input
                class="inputSize"
                v-model="form.label"
                maxlength="20"
              ></el-input>
            </div>
            <div class="attributeItem">
              <p>默认值</p>
              <el-date-picker
                v-model="form.defaultValue"
                type="datetime"
                placeholder="选择日期时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                style="width: 100%"
              ></el-date-picker>
            </div>
            <div class="attributeItem">
              <el-checkbox
                label="仅日期"
                v-model="form.dateOnly"
                name="type"
              ></el-checkbox>
              <br />
              <el-checkbox  label="必填" v-model="form.required"></el-checkbox>
              <el-checkbox  label="只读" v-model="form.readOnly"></el-checkbox>
            </div>
            <p style="font-size: 12px; color: red" v-show="isRequiredInput">
              必填项不能为空
            </p>
          </el-form>
        </div>
      </div>
    </div>

    <el-dialog
      title="编辑CI类型关系"
      :visible.sync="dialogFormVisible"
      center
      width="40%"
    >
      <el-row>
        <el-col :span="12" :offset="6">
          <el-form :model="form">
            <!-- <el-form-item label="层级结构" label-width="120">
              <el-select v-model="curOperation">
                <el-option label="上层" value="up"></el-option>
                <el-option label="下层" value="down"></el-option>
              </el-select>
            </el-form-item>-->
            <el-form-item label="关系" label-width="120">
              <el-select v-model="curLabel">
                <el-option
                  v-for="gx in gxTagsList"
                  :key="gx.lab"
                  :label="gx.val"
                  :value="gx.val"
                  >{{ gx.val }}</el-option
                >
              </el-select>
            </el-form-item>
            <el-form-item label="条件" label-width="120">
              <el-select v-model="curRelation">
                <el-option
                  v-for="tj in tjTagsList"
                  :key="tj.lab"
                  :label="tj.val"
                  :value="tj.val"
                  >{{ tj.val }}</el-option
                >
              </el-select>
            </el-form-item>
            <el-form-item label="层级" label-width="120">
              <el-select v-model="curTag">
                <el-option label="上层" value="up"></el-option>
                <el-option label="下层" value="down"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer dio-top">
        <el-button @click="handleCancle">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from '@/api'
// import { initFileds, checkModification } from "../../utils/reload.js";
import draggable from 'vuedraggable'
import chart from './CIchart.vue'
import Bus from '../common/bus.js'
import {
  initFileds,
  checkModification,
  onbeforeunload
} from '../../utils/reload.js'
export default {
  name: 'CIType',
  components: {
    draggable: draggable,
    'app-chart': chart
  },
  data() {
    return {
      visible: true,
      isbl: false,
      // 管理ci类型左边栏数据
      CITypeItems: [],
      // 标签页的默认active页
      activeName: 'first',
      showCIName: '',
      subareaGroups: [],
      showAddsubarea: false,
      singleLineInput: false,
      multiLineInput: false,
      pwdInput: false,
      numInput: false,
      selectInput: false,
      dateInput: false,
      form: {
        label: '',
        defaultValue: '',
        unit: '',
        rules: '0',
        maxLength: '',
        minLength: '',
        readOnly: false,
        required: false,
        moreSelect: false,
        dataType: '0',
        verifier: '0',
        defined: [],
        date: '',
        fieldName: '',
        decimalPrecision: '',
        valid_id: '',
        sort: '',
        type: '',
        dateOnly: false
      },
      existedDomain: '',
      existedSubarea: '',
      newArray: [],
      definedItem: '',
      noneChange: '',
      copyForm: '',
      citypeId: '',
      isRequiredInput: false,
      searchSubarea: '',
      isErrorInput: false,
      // 名称的分区
      subareaLabelName: {
        title: '名称',
        extend: [
          {
            label: '名称',
            defaultValue: '',
            type: 'singleLineInput'
          },
          {
            label: '业务组',
            defaultValue: '',
            type: 'optionsInputSys'
          },
          {
            label: '环境',
            defaultValue: '',
            type: 'optionsInputEnv'
          }
        ]
      },
      islabelName: false,
      copySubareaLabelName: '',
      urlRule: {
        URL:
          '^((ht|f)tps?)://([w-]+(.[w-]+)*/)*[w-]+(.[w-]+)*/?(?([w-.,@?^=%&:/~+#]*)+)?'
      },
      IpRule: {
        IP地址:
          '((1[0-9][0-9].)|(2[0-4][0-9].)|(25[0-5].)|([1-9][0-9].)|([0-9].)){3}((1[0-9][0-9])|(2[0-4][0-9])|(25[0-5])|([1-9][0-9])|([0-9]))'
      },
      maskRule: {
        子网掩码:
          '^(d{1,2}|1dd|2[0-4]d|25[0-5])(.(d{1,2}|1dd|2[0-4]d|25[0-5])){3}$'
      },
      portRule: {
        端口号:
          '^([0-9]|[1-9]d{1,3}|[1-5]d{4}|6[0-4]d{4}|65[0-4]d{2}|655[0-2]d|6553[0-5])$'
      },
      EmailRule: {
        Email: '^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$'
      },
      phoneRule: {
        手机号码:
          '^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])d{8}$'
      },
      dateAndCode: {
        数字与字母组合: '^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]+$'
      },
      dateOrCode: {
        数字或字母组合: '^[A-Za-z0-9]+$'
      },
      onlyDate: {
        纯数字: '^[0-9]+$'
      },
      onlyCode: {
        纯字母: '^[A-Za-z]+$'
      },
      nonnegativeRule: {
        非负数: '^d+(.{0,1}d+){0,1}$'
      },
      positiveRule: {
        正整数: '^[1-9]{1,}[\\d]*$'
      },
      jsonRule: {
        JSON: '^{[s*"w+":"w+",*s*]+}$'
      },
      gxTagsList: [
        {
          lab: 'gx-1',
          val: '运行'
        },
        {
          lab: 'gx-2',
          val: '连接'
        },
        {
          lab: 'gx-3',
          val: '依赖'
        },
        {
          lab: 'gx-4',
          val: '包含'
        },
        {
          lab: 'gx-5',
          val: '虚拟化'
        },
        {
          lab: 'gx-6',
          val: '管理'
        },
        {
          lab: 'gx-7',
          val: '安装'
        }
      ],
      tjTagsList: [
        {
          lab: 'tj-1',
          val: '一对一'
        },
        {
          lab: 'tj-2',
          val: '一对多'
        },
        {
          lab: 'tj-3',
          val: '多对一'
        },
        {
          lab: 'tj-4',
          val: '多对多'
        }
      ],
      typeTagsList: [],
      gxTag: '',
      tjTag: '',
      typeTag: '',
      currentType: '',
      checkType: '',
      operation: 'up',
      selectTab: true,
      visibed: false,
      visibedRelation: false,
      visibedCondition: false,
      relationOption: [],
      nodeList: [],
      nodeTypeId: '',
      chartType: '',
      options: [
        {
          value: '0',
          label: 'SSH凭证'
        },
        {
          value: '1',
          label: '应用系统凭证'
        },
        {
          value: '3',
          label: '数据库凭证'
        },
        {
          value: '2',
          label: '代码库凭证'
        }
      ],
      dialogFormVisible: false,
      curLabel: '',
      curRelation: '',
      curTag: '',
      curOperation: '',
      editCitype: '',
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  watch: {
    visible() {
      if (this.visible) {
        onbeforeunload()
      } else {
        window.onbeforeunload = null
      }
    }
  },
  created() { },
  beforeDestroy() {
    Bus.$off('getNewSource')
    // Bus.$off("deletetype");
  },
  methods: {
    handleDeleteType(val) {
      //  if(_this.currentType.citypeId != val){
      //   let idx = 0;
      //   JSON.parse(_this.currentType.relation).connect.map((item,index) => {
      //     if(item.ciitemId == val){
      //       idx = index;
      //     }
      //   })
      //   JSON.parse(_this.currentType.relation).connect.splice(idx,1);
      // }
    },
    editType(val) {
      if (this.currentType.citypeId != val) {
        axios.ciTypeDetail(this.currentType.citypeId).then((res) => {
          if (res) {
            if (res.data.success) {
              this.currentType = res.data.data.result
              JSON.parse(this.currentType.relation).connect.forEach((item) => {
                if (item.citypeId == val) {
                  this.curLabel = item.label
                  this.curRelation = item.relation
                  this.editCitype = item
                  this.curTag = item.tag
                  this.dialogFormVisible = true
                }
              })
            } else {
              this.$notify({
                title: '提示',
                message: res.data.message,
                type: 'warning'
              })
            }
          } else {
            this.$notify({
              type: 'error',
              message: '接口请求失败'
            })
          }
        })
      }
    },

    handleNodeClick(data) {
      this.checkType = data
      this.visibed = false
      this.typeTag = data.name
    },
    handleCancle() {
      this.dialogFormVisible = false
    },
    handleConfirm() {
      // axios.ciTypeDetail(citypeId).then(result => {
      //   let param = result.data.data.result;
      //   if(param.relation){}
      // })
      axios.ciTypeDetail(this.nodeTypeId).then((res) => {
        if (res) {
          this.currentType = res.data.data.result

          this.editCitype.label = this.curLabel
          this.editCitype.relation = this.curRelation
          this.editCitype.tag = this.curTag
          let idx
          let count = 0
          let data = JSON.parse(this.currentType.relation)
          for (let key in data.connect) {
            if (data.connect[key].citypeId == this.editCitype.citypeId) {
              idx = key
              count += 1
            }
          }
          // console.log(this.editCitype);
          if (count > 0) {
            data.connect.splice(idx, 1)
            data.connect.push(this.editCitype)
            let params = {
              citypeId: this.currentType.citypeId,
              icon: this.currentType.icon,
              name: this.currentType.name,
              relation: data
            }
            axios
              .updateCiTypeDetail(params, this.currentType.citypeId)
              .then((result) => {
                if (result.data.success) {
                  Bus.$emit('getNewSource', this.currentType.citypeId)
                  this.dialogFormVisible = false
                  this.updateSource(
                    this.editCitype.citypeId,
                    this.curLabel,
                    this.curRelation,
                    this.currentType.citypeId,
                    this.curTag
                  )
                } else {
                  this.$notify({
                    title: '提示',
                    message: '添加类型失败',
                    type: 'warning'
                  })
                }
              })
          }
        } else {
          this.$notify({
            type: 'error',
            message: '接口请求失败'
          })
        }
      })
    },
    updateSource(id, label, relation, source, curTag) {
      axios.ciTypeDetail(id).then((res) => {
        if (res) {
          if (res.data.success) {
            let data = res.data.data.result
            let curData = JSON.parse(data.relation)
            curData.connect.forEach((item) => {
              if (item.citypeId == source) {
                item.label = label
                item.relation = relation
                if (curTag === 'up') {
                  item.tag = 'down'
                } else if (curTag === 'down') {
                  item.tag = 'up'
                }
              }
            })
            let params = {
              citypeId: id,
              icon: data.icon,
              name: data.name,
              relation: curData
            }
            axios.updateCiTypeDetail(params, id).then((result) => {
              if (result) {
                if (result.data.success) {
                  // console.log('修改成功');
                } else {
                  this.$notify({
                    title: '提示',
                    message: '编辑类型失败',
                    type: 'warning'
                  })
                }
              } else {
                this.$notify({
                  type: 'error',
                  message: '接口请求失败'
                })
              }
            })
          }
        } else {
          this.$notify({
            type: 'error',
            message: '接口请求失败'
          })
        }
      })
    },
    clickRelation() {
      this.visibedRelation = !this.visibedRelation
    },
    clickCondition() {
      this.visibedCondition = !this.visibedCondition
    },
    clickBox() {
      this.visibed = !this.visibed
    },
    // 确认
    confirm() {
      let count = 0
      axios.ciTypeDetail(this.nodeTypeId).then((res) => {
        console.log('xxx')
        if (res) {
          console.log('yyy')
          this.currentType = res.data.data.result
          if (this.currentType.citypeId != this.checkType.citypeId) {
            if (this.currentType.relation) {
              if (this.gxTag) {
                if (this.tjTag) {
                  if (this.checkType) {
                    if (this.checkType.citypeId) {
                      let data = JSON.parse(this.currentType.relation)
                      if (data.connect) {
                        data.connect.forEach((item) => {
                          if (item.citypeId == this.checkType.citypeId) {
                            count += 1
                          }
                        })
                        if (count == 0) {
                          this.saveRelation(data)
                        } else {
                          this.$notify({
                            title: '提示',
                            message: '类型已存在',
                            type: 'warning'
                          })
                        }
                      } else {
                        this.saveRelation(data)
                      }
                    } else {
                      this.$notify({
                        title: '提示',
                        message: '请选择子项类型',
                        type: 'warning'
                      })
                    }
                  } else {
                    this.$notify({
                      title: '提示',
                      message: '请选择CI类型',
                      type: 'warning'
                    })
                  }
                } else {
                  this.$notify({
                    title: '提示',
                    message: '请选择条件',
                    type: 'warning'
                  })
                }
              } else {
                this.$notify({
                  title: '提示',
                  message: '请选择关系',
                  type: 'warning'
                })
              }
            } else {
              let connObj = {}
              connObj.citypeId = this.currentType.citypeId
              connObj.name = this.currentType.name
              connObj.icon = this.currentType.icon
              connObj.top = 44
              connObj.left = 50
              let connectArr = []
              let part
              if (this.operation == 'up') {
                part = {
                  citypeId: this.checkType.citypeId,
                  name: this.checkType.name,
                  top: 30,
                  left: 50,
                  tag: this.operation,
                  label: this.gxTag,
                  relation: this.tjTag,
                  icon: this.checkType.icon
                }
              } else {
                part = {
                  citypeId: this.checkType.citypeId,
                  name: this.checkType.name,
                  top: 70,
                  left: 50,
                  tag: this.operation,
                  label: this.gxTag,
                  relation: this.tjTag,
                  icon: this.checkType.icon
                }
              }

              connectArr.push(part)
              connObj.connect = connectArr

              axios.editCItypeRelation(connObj).then((result) => {
                if (result.data.success) {
                  this.updateRelation(this.checkType, this.gxTag, this.tjTag)
                  this.gxTag = ''
                  this.tjTag = ''
                  this.checkType = ''
                  this.typeTag = ''
                  Bus.$emit('getNewSource', this.currentType.citypeId)
                  axios.ciTypeDetail(this.currentType.citypeId).then((res) => {
                    if (res) {
                      this.currentType = res.data.data.result
                    }
                  })
                } else {
                  this.$notify({
                    title: '提示',
                    message: '添加类型失败',
                    type: 'warning'
                  })
                }
              })
            }
          } else {
            this.gxTag = ''
            this.tjTag = ''
            this.checkType = ''
            this.typeTag = ''
            this.$notify({
              title: '提示',
              message: '类型已存在',
              type: 'warning'
            })
          }
        }
      })
    },

    // 保存关系
    saveRelation(data) {
      let part = {}
      if (this.operation == 'up') {
        part = {
          citypeId: this.checkType.citypeId,
          top: 30,
          left: 50,
          tag: this.operation,
          label: this.gxTag,
          relation: this.tjTag,
          icon: this.checkType.icon
        }
      } else {
        part = {
          citypeId: this.checkType.citypeId,
          top: 70,
          left: 50,
          tag: this.operation,
          label: this.gxTag,
          relation: this.tjTag,
          icon: this.checkType.icon
        }
      }

      data.connect.push(part)
      if (data.top == 0 && data.left == 0) {
        data.top = 44
        data.left = 50
      }

      // this.getRelationList(this.currentType.citypeId)

      axios.editCItypeRelation(data).then((result) => {
        if (result) {
          if (result.data.success) {
            this.updateRelation(this.checkType, this.gxTag, this.tjTag)
            this.gxTag = ''
            this.tjTag = ''
            this.checkType = ''
            this.typeTag = ''
            Bus.$emit('getNewSource', this.currentType.citypeId)
          } else {
            this.$notify({
              title: '提示',
              message: '添加类型失败',
              type: 'warning'
            })
          }
        }
      })
    },

    // 关联项
    updateRelation(checkVal, label, relation) {
      axios.ciTypeDetail(checkVal.citypeId).then((res) => {
        if (res) {
          if (res.data.success) {
            let curData = res.data.data.result
            if (curData.relation) {
              let data = JSON.parse(curData.relation)
              let node = {
                citypeId: this.currentType.citypeId,
                top: '',
                left: '',
                tag: '',
                label: label,
                relation: relation,
                icon: this.currentType.icon
              }
              if (data.connect) {
                let count = 0
                data.connect.forEach((item) => {
                  if (item.citypeId == this.currentType.citypeId) {
                    count += 1
                  }
                })

                if (count == 0) {
                  if (this.operation == 'up') {
                    node.tag = 'down'
                    node.top = 70
                    node.left = 50
                  } else if (this.operation == 'down') {
                    node.tag = 'up'
                    node.top = 30
                    node.left = 50
                  }
                  data.connect.push(node)
                  let params = {
                    citypeId: checkVal.citypeId,
                    icon: checkVal.icon,
                    name: checkVal.name,
                    relation: data
                  }
                  axios
                    .updateCiTypeDetail(params, checkVal.citypeId)
                    .then((result) => {
                      if (result.data.success) {
                        // console.log('关系更新1')
                      }
                    })
                } else {
                  // this.$notify({
                  //   title: "提示",
                  //   message: "类型已存在",
                  //   type: "warning"
                  // });
                  // console.log('类型已存在')
                }
              } else {
                let conn = []
                if (this.operation == 'up') {
                  node.tag = 'down'
                  node.top = 70
                  node.left = 50
                } else if (this.operation == 'down') {
                  node.tag = 'up'
                  node.top = 30
                  node.left = 50
                }
                conn.push(node)
                data.connect = conn
                let params = {
                  citypeId: checkVal.citypeId,
                  icon: checkVal.icon,
                  name: checkVal.name,
                  relation: data
                }
                axios
                  .updateCiTypeDetail(params, checkVal.citypeId)
                  .then((result) => {
                    if (result.data.success) {
                      // console.log('关系更新2')
                    }
                  })
              }
            } else {
              let updateObj = {
                citypeId: checkVal.citypeId,
                top: 44,
                left: 50,
                connect: [],
                icon: checkVal.icon
              }

              let part = {
                citypeId: this.currentType.citypeId,
                top: '',
                left: '',
                tag: '',
                label: label,
                relation: relation,
                icon: this.currentType.icon
              }
              if (this.operation == 'up') {
                part.tag = 'down'
                part.top = 70
                part.left = 50
              } else if (this.operation == 'down') {
                part.tag = 'up'
                part.top = 30
                part.left = 50
              }
              updateObj.connect.push(part)
              let params = {
                citypeId: checkVal.citypeId,
                icon: checkVal.icon,
                name: checkVal.name,
                relation: updateObj
              }
              axios
                .updateCiTypeDetail(params, checkVal.citypeId)
                .then((result) => {
                  if (result.data.success) {
                    // console.log('关系更新3')
                  }
                })
            }
          }
        } else {
          this.$notify({
            type: 'error',
            message: '接口请求失败'
          })
        }
      })
    },

    // 取消
    cancleTag() {
      this.gxTag = ''
      this.tjTag = ''
      this.type = ''
    },
    // 点击每一条获取
    gettjTag(value) {
      this.visibedCondition = !this.visibedCondition
      this.tjTag = value
    },
    getgxTag(value) {
      this.visibedRelation = !this.visibedRelation
      this.gxTag = value
    },
    gettypeTag(value) {
      this.typeTag = value.name
      this.checkType = value
      this.visibed = false
    },
    // 获取CI类型列表
    getAllType() {
      this.typeTagsList = []
      let templateId = ''
      let name = ''
      // let cigroupId = "";
      axios.getCIList(name, templateId).then((result) => {
        if (result) {
          if (result.data.success) {
            let data = result.data.data.result
            if (data) {
              data.forEach((item) => {
                if (item.citypeId != this.currentType.citypeId) {
                  let node = {
                    name: item.name,
                    children: []
                  }
                  if (item.citypeList) {
                    item.citypeList.forEach((type) => {
                      if (type.citypeId != this.currentType.citypeId) {
                        node.children.push(type)
                      }
                    })
                  }
                  this.typeTagsList.push(node)
                }
              })
            }
          }
        } else {
          this.$notify({
            type: 'error',
            message: '接口请求失败'
          })
        }
      })
    },
    // 新增上层
    addNewPre() {
      this.selectTab = true
      this.operation = 'up'
    },
    // 新增下层
    addNewNex() {
      this.operation = 'down'
      this.selectTab = false
    },
    routeTo() {
      this.$router.push({ path: '/ResourceAllocation/manage_ciType?code=1' })
    },
    handleClick(tab, event) {
      if (tab.name == 'first') {
        this.visible = true
      } else if (tab.name == 'second') {
        this.visible = false
      }
    },
    clickCIType(id) {
      this.CITypeItems.forEach((item) => {
        if (item.cigroupId == id) {
          item.ifShow = !item.ifShow
        }
      })
    },
    getCITypeItemDetail(citypeId, value) {
      this.nodeTypeId = value.citypeId
      this.chartType = 'citype'
      this.visible = true
      this.activeName = 'first'
      // this.selectTab = false;
      this.currentType = value
      this.getAllType()
      this.subareaLabelName = {
        title: '名称',
        extend: [
          {
            label: '名称',
            defaultValue: '',
            type: 'singleLineInput'
          },
          {
            label: '业务组',
            defaultValue: '',
            type: 'optionsInputSys'
          },
          {
            label: '环境',
            defaultValue: '',
            type: 'optionsInputEnv'
          }
        ]
      }
      this.copySubareaLabelName = JSON.stringify(this.subareaLabelName)
      this.subareaGroups = []
      this.CITypeItems.forEach((citype) => {
        citype.citypeList.forEach((item) => {
          if (item.citypeId == citypeId) {
            item.addHighLight = true
          } else {
            item.addHighLight = false
          }
        })
      })

      this.citypeId = citypeId
      this.copyForm = '[]'
      this.noneChange = false
      axios.ciTypeDetail(citypeId).then((res) => {
        let data = res.data.data
        if (data.result.extend) {
          // 如果extend值不空，把名称的分区提取出来。
          let extend = JSON.parse(data.result.extend)
          extend.forEach((item) => {
            if (item.title === '名称') {
              // let tmpArr = new Array(item);
              this.subareaLabelName = item
              this.copySubareaLabelName = JSON.stringify(this.subareaLabelName)
              // this.subareaLabelName.extend.type = "singleLineInput";
            } else {
              this.subareaGroups.push(item)
            }
          })

          this.copyForm = JSON.stringify(this.subareaGroups)
        } else if (!data.result.extend && data.result.templateId) {
          axios.templateDetail(data.result.templateId).then((res1) => {
            if (res1.data.data.result.extend) {
              let extend = JSON.parse(res1.data.data.result.extend)
              extend.forEach((item) => {
                if (item.title === '名称') {
                  // let tmpArr = new Array(item);
                  this.subareaLabelName = item
                  this.copySubareaLabelName = JSON.stringify(
                    this.subareaLabelName
                  )
                  // this.subareaLabelName.extend.type = "singleLineInput";
                } else {
                  this.subareaGroups.push(item)
                }
              })

              this.copyForm = JSON.stringify(this.subareaGroups)
            }
          })
        } else {
          data.result.extend = []
          this.subareaGroups = []
        }
        onbeforeunload()
        initFileds()
      })
    },
    onEnd() {
      if (this.copyForm != JSON.stringify(this.subareaGroups)) {
        this.noneChange = true
      }
    },
    clickAddSubArea(e) {
      e.stopPropagation()
      if (this.citypeId) {
        this.$prompt('', '新增分区', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValidator: (val) => {
            if (!val) {
              return '分区名不能为空'
            } else if (val.replace(/\s+/g, '') === '') {
              return '分区名不能为空'
            } else if (val.length < 2 || val.length > 20) {
              return '分区名应在2-20个字符之间'
            } else {
              let ifRepeat = this.subareaGroups.some((item) => {
                return item.title === val
              })
              if (ifRepeat || val === '名称') {
                return '分区名已存在'
              }
            }
          }
        })
          .then(({ value }) => {
            let obj = {
              title: value, // 分区名字
              extend: []
            }
            this.subareaGroups.push(obj)
            this.noneChange = true
          })
          .catch(() => { })
      }
    },
    clickAddCredentials(e) {
      e.stopPropagation()
      if (this.subareaGroups.length === 0) {
        this.$notify({
          title: '警告',
          message: '请先新增分区！',
          type: 'warning'
        })
        return
      }
      let lastSubarea = this.subareaGroups[this.subareaGroups.length - 1]
      if (this.citypeId) {
        if (this.subareaLabelName.extend.length > 3) {
          return
        }
        let credential = {
          label: '凭证',
          defaultValue: '0',
          type: 'credentialsSelect'
        }
        lastSubarea.extend.push(credential)
        if (
          this.copySubareaLabelName == JSON.stringify(lastSubarea) &&
          this.copyForm == JSON.stringify(this.subareaGroups)
        ) {
          this.noneChange = false
        } else {
          this.noneChange = true
        }
      }
    },
    changeCredential() {
      if (this.copySubareaLabelName !== JSON.stringify(this.subareaLabelName)) {
        this.noneChange = true
      }
    },
    deleteCredential() {
      this.subareaLabelName.extend.pop()
      if (
        this.copySubareaLabelName != JSON.stringify(this.subareaLabelName) ||
        this.copyForm != JSON.stringify(this.subareaGroups)
      ) {
        this.noneChange = true
      } else {
        this.noneChange = false
      }
    },
    clickDeletSubarea(index) {
      this.subareaGroups.splice(index, 1)
      let subareaGroupsString = JSON.stringify(this.subareaGroups)
      if (
        this.copySubareaLabelName == JSON.stringify(this.subareaLabelName) &&
        this.copyForm == subareaGroupsString
      ) {
        this.noneChange = false
      } else {
        this.noneChange = true
      }
    },
    clickAttributeInput(e) {
      if (!this.citypeId) {
        this.$notify({
          title: '警告',
          message: '请先选择对应的CI类型！',
          type: 'warning'
        })
        return
      } else {
        if (this.subareaGroups.length === 0) {
          this.$notify({
            title: '警告',
            message: '请先新增分区！',
            type: 'warning'
          })
          return
        }
      }

      let inputType = e.target.innerHTML
      // 获取subareaGroups最后一个index的值
      let lastSubarea = this.subareaGroups[this.subareaGroups.length - 1]
      if (inputType === '单行文本框 +') {
        // 弹出单行文本框的属性设置
        this.singleLineInput = true

        lastSubarea.extend.push({
          inputType: '单行文本框',
          type: 'singleLineInput',
          defaultValue: '',
          rules: '0',
          key: Date.now()
        })
      } else if (inputType == '多行文本框 +') {
        this.multiLineInput = true
        lastSubarea.extend.push({
          inputType: '多行文本框',
          type: 'multiLineInput',
          defaultValue: '',
          dataType: '0',
          key: Date.now()
        })
      } else if (inputType == '密码框 +') {
        this.pwdInput = true
        lastSubarea.extend.push({
          inputType: '密码框',
          type: 'pwdInput',
          defaultValue: '',
          verifier: '0',
          key: Date.now()
        })
      } else if (inputType == '数字框 +') {
        this.numInput = true
        lastSubarea.extend.push({
          inputType: '数字框',
          defaultValue: '',
          rules: '0',
          type: 'numInput',
          key: Date.now()
        })
      } else if (inputType == '选择框 +') {
        this.selectInput = true
        lastSubarea.extend.push({
          inputType: '选择框',
          type: 'selectInput',
          defaultValue: '',
          key: Date.now()
        })
      } else if (inputType == '时间日期 +') {
        this.dateInput = true
        lastSubarea.extend.push({
          inputType: '时间日期',
          type: 'dateInput',
          defaultValue: '',
          key: Date.now()
        })
      }
    },
    removeDomain(item, subareaIndex) {
      let editSubareaGroups = this.subareaGroups[subareaIndex]
      var index = editSubareaGroups.extend.indexOf(item)
      if (index !== -1) {
        editSubareaGroups.extend.splice(index, 1)
      }
      let subareaGroupsString = JSON.stringify(this.subareaGroups)
      if (
        this.copySubareaLabelName == JSON.stringify(this.subareaLabelName) &&
        this.copyForm == subareaGroupsString
      ) {
        this.noneChange = false
      } else {
        this.noneChange = true
      }
    },

    proving() {
      this.form.minLength = this.form.minLength.replace(/[^\.\d]/g, '')
      this.form.maxLength = this.form.maxLength.replace(/[^\.\d]/g, '')
      this.form.minLength = this.form.minLength.replace('.', '')
      this.form.maxLength = this.form.maxLength.replace('.', '')
    },

    // 关闭编辑弹框
    closeForm() {
      if (this.existedDomain !== '' && this.existedSubarea !== '') {
        let nowEditSubarea = this.subareaGroups[this.existedSubarea]
        let nowEditDomain = nowEditSubarea.extend[this.existedDomain]
        nowEditDomain.label = this.form.label
        nowEditDomain.defaultValue = this.form.defaultValue
        nowEditDomain.fieldName = this.form.fieldName
        nowEditDomain.dataType = this.form.dataType
        nowEditDomain.date = this.form.date
        nowEditDomain.maxLength = this.form.maxLength
        nowEditDomain.minLength = this.form.minLength
        nowEditDomain.readOnly = this.form.readOnly
        nowEditDomain.moreSelect = this.form.moreSelect
        nowEditDomain.required = this.form.required
        nowEditDomain.decimalPrecision = this.form.decimalPrecision
        nowEditDomain.verifier = this.form.verifier
        nowEditDomain.defined = this.form.defined
        nowEditDomain.valid_id = this.form.valid_id
        nowEditDomain.rules = this.form.rules
        nowEditDomain.sort = this.form.sort
        nowEditDomain.type = this.form.type
        nowEditDomain.unit = this.form.unit
        nowEditDomain.dateOnly = this.form.dateOnly

        // 判断最大长度和最小长度是否冲突
        if (nowEditDomain.maxLength && nowEditDomain.minLength) {
          if (
            parseInt(nowEditDomain.maxLength) <
            parseInt(nowEditDomain.minLength)
          ) {
            this.isErrorInput = true
            return
          }
        }

        // 判断是否仅日期，如果是，则修改时间。
        if (nowEditDomain.dateOnly === true) {
          nowEditDomain.defaultValue = nowEditDomain.defaultValue.slice(0, 10)
        }
        // 判断选择必填时，必填项是否为空

        if (nowEditDomain.label === '' || nowEditDomain.label === undefined) {
          this.isRequiredInput = true
          return
        } else if (nowEditDomain.label.replace(/\s+/g, '') === '') {
          this.isRequiredInput = true
          return
        }
      } else {
        let originalForm = {
          label: '',
          defaultValue: '',
          unit: '',
          rules: '0',
          maxLength: '',
          minLength: '',
          readOnly: false,
          required: false,
          moreSelect: false,
          dataType: '0',
          verifier: '0',
          defined: [],
          date: '',
          fieldName: '',
          decimalPrecision: '',
          valid_id: '',
          sort: '',
          type: '',
          dateOnly: false
        }
        if (JSON.stringify(this.form) === JSON.stringify(originalForm)) {
          let lastSubarea = this.subareaGroups[this.subareaGroups.length - 1]
          lastSubarea.extend.pop()
        } else {
          let lastSubarea = this.subareaGroups[this.subareaGroups.length - 1]
          let lastDomain = lastSubarea.extend[lastSubarea.extend.length - 1]
          lastDomain.date = this.form.date
          lastDomain.label = this.form.label
          lastDomain.defaultValue = this.form.defaultValue
          lastDomain.fieldName = this.form.fieldName
          lastDomain.dataType = this.form.dataType
          lastDomain.maxLength = this.form.maxLength
          lastDomain.minLength = this.form.minLength
          lastDomain.readOnly = this.form.readOnly
          lastDomain.moreSelect = this.form.moreSelect
          lastDomain.required = this.form.required
          lastDomain.decimalPrecision = this.form.decimalPrecision
          lastDomain.verifier = this.form.verifier
          lastDomain.defined = this.form.defined
          lastDomain.valid_id = this.form.valid_id
          lastDomain.rules = this.form.rules
          lastDomain.sort = this.form.sort
          lastDomain.unit = this.form.unit
          lastDomain.dateOnly = this.form.dateOnly

          // 判断最大长度和最小长度是否冲突
          if (lastDomain.maxLength && lastDomain.minLength) {
            if (
              parseInt(lastDomain.maxLength) <= parseInt(lastDomain.minLength)
            ) {
              this.isErrorInput = true
              return
            }
          }

          // 判断是否仅日期，如果是，则修改时间。
          if (lastDomain.dateOnly === true) {
            lastDomain.defaultValue = lastDomain.defaultValue.slice(0, 10)
          }
          // 判断选择必填时，必填项是否为空
          if (lastDomain.label === '' || lastDomain.label === undefined) {
            this.isRequiredInput = true
            return
          } else if (lastDomain.label.replace(/\s+/g, '') === '') {
            this.isRequiredInput = true
            return
          }
          if (lastDomain.type === 'selectInput') {
            if (lastDomain.defined[0] === undefined) {
              this.isRequiredInput = true
              return
            }
          }
        }
      }
      let subareaGroupsString = JSON.stringify(this.subareaGroups)
      if (
        this.copyForm == subareaGroupsString &&
        this.copySubareaLabelName == JSON.stringify(this.subareaLabelName)
      ) {
        this.noneChange = false
      } else {
        this.noneChange = true
      }
      this.existedSubarea = ''
      this.existedDomain = ''
      this.singleLineInput = false
      this.multiLineInput = false
      this.pwdInput = false
      this.numInput = false
      this.selectInput = false
      this.dateInput = false
      this.isRequiredInput = false
      this.definedItem = ''
      this.isErrorInput = false
      this.form = {
        label: '',
        defaultValue: '',
        unit: '',
        rules: '0',
        maxLength: '',
        minLength: '',
        readOnly: false,
        required: false,
        moreSelect: false,
        dataType: '0',
        verifier: '0',
        defined: [],
        date: '',
        fieldName: '',
        decimalPrecision: '',
        valid_id: '',
        sort: '',
        type: '',
        dateOnly: false
      }
    },
    getDomian(domain, domainIndex, subareaIndex) {
      if (arguments.length === 2) {
        this.islabelName = true
      } else {
        if (domain.type === 'singleLineInput') {
          this.singleLineInput = true
        } else if (domain.type === 'multiLineInput') {
          this.multiLineInput = true
        } else if (domain.type === 'pwdInput') {
          this.pwdInput = true
        } else if (domain.type === 'numInput') {
          this.numInput = true
        } else if (domain.type === 'selectInput') {
          this.selectInput = true
        } else if (domain.type === 'dateInput') {
          this.dateInput = true
        }
        this.form = JSON.parse(JSON.stringify(domain))
        this.existedSubarea = subareaIndex
        this.existedDomain = domainIndex
      }
    },
    addDefined() {
      if (this.form.defined === undefined) {
        this.form.defined = []
      }
      if (
        this.definedItem !== '' &&
        this.definedItem.replace(/\s+/g, '') !== ''
      ) {
        this.form.defined.push(this.definedItem)
        this.definedItem = ''
      }
    },
    deleteItem(index) {
      this.form.defined.splice(index, 1)
    },
    // 提交
    clickSubmit() {
      this.subareaGroups.forEach((subarea) => {
        subarea.extend.forEach((item) => {
          if (item.rules != '0') {
            if (item.rules === JSON.stringify(this.urlRule)) {
              item.rules = 'URL'
              item.rulesrReg =
                '^((ht|f)tps?):\\/\\/([\\w\\-]+(\\.[\\w\\-]+)*\\/)*[\\w\\-]+(\\.[\\w\\-]+)*\\/?(\\?([\\w\\-\\.,@?^=%&:\\/~\\+#]*)+)?'
            } else if (item.rules === JSON.stringify(this.IpRule)) {
              item.rules = 'IP地址'
              item.rulesrReg =
                '^(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|[1-9])\\.' +
                '(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\.' +
                '(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\.' +
                '(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)$'
            } else if (item.rules === JSON.stringify(this.maskRule)) {
              item.rules = '子网掩码'
              item.rulesrReg =
                '^(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])(\\.(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])){3}$'
            } else if (item.rules === JSON.stringify(this.portRule)) {
              item.rules = '端口号'
              item.rulesrReg =
                '^([0-9]|[1-9]\\d{1,3}|[1-5]\\d{4}|6[0-4]\\d{4}|65[0-4]\\d{2}|655[0-2]\\d|6553[0-5])$'
            } else if (item.rules === JSON.stringify(this.EmailRule)) {
              item.rules = 'Email'
              item.rulesrReg =
                '^[A-Za-z0-9\\u4e00-\\u9fa5]+@[a-zA-Z0-9_-]+(\\.[a-zA-Z0-9_-]+)+$'
            } else if (item.rules === JSON.stringify(this.phoneRule)) {
              item.rules = '手机号码'
              item.rulesrReg =
                '^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\\d{8}$'
            } else if (item.rules === JSON.stringify(this.nonnegativeRule)) {
              item.rules = '非负数'
              item.rulesrReg = '^\\d+(\\.{0,1}\\d+){0,1}$'
            } else if (item.rules === JSON.stringify(this.positiveRule)) {
              item.rules = '正整数'
              item.rulesrReg = '^[0-9]*[1-9][0-9]*$'
            }
            // else if (item.rules === "(^[\-0-9][0-9]*(.[0-9]+)?)$"){
            //   item.rules = "0";
            //   item.rulesrReg = "(^[\-0-9][0-9]*(.[0-9]+)?)$";
            // }
            if (item.type === 'numInput' && item.rules === '0') {
              item.rules = '无'
              item.rulesrReg = '(^[-0-9][0-9]*(.[0-9]+)?)$'
            }
          }
          if (item.verifier != '0') {
            if (item.verifier === JSON.stringify(this.dateAndCode)) {
              item.verifier = '数字与字母组合'
              item.verifierReg = '^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]+$'
            } else if (item.verifier === JSON.stringify(this.dateOrCode)) {
              item.verifier = '数字或字母组合'
              item.verifierReg = '^[A-Za-z0-9]+$'
            } else if (item.verifier === JSON.stringify(this.onlyDate)) {
              item.verifier = '纯数字'
              item.verifierReg = '^[0-9]+$'
            } else if (item.verifier === JSON.stringify(this.onlyCode)) {
              item.verifier = '纯字母'
              item.verifierReg = '^[A-Za-z]+$'
            }
          }
          // if (item.dataType) {
          //   if (item.dataType === JSON.stringify(this.jsonRule)) {
          //     item.dataType = "JSON";
          //     item.dataTypeReg = '^{[s*"w+":"w+",*s*]+}$';
          //   }
          // }
        })
      })
      let copyArray = [...this.subareaGroups]
      copyArray.unshift(this.subareaLabelName)

      let data = {
        citypeId: this.citypeId,
        // "content": JSON.stringify(extend)
        content: copyArray
      }
      if (copyArray[1] && copyArray[1].extend.length > 0) {
        copyArray[1].extend.forEach((item) => {
          item.options = []
        })
        for (let i = 0; i < copyArray[1].extend.length; i++) {
          if (
            copyArray[1].extend[i].defined &&
            copyArray[1].extend[i].defined.length > 0
          ) {
            for (let j = 0; j < copyArray[1].extend[i].defined.length; j++) {
              copyArray[1].extend[i].options.push({
                value: j,
                label: copyArray[1].extend[i].defined[j]
              })
            }
          }
        }
      }
      this.isbl = true
      axios.putCItypeDetail(data).then((res) => {
        if (res.data.code === 200) {
          if (copyArray[1] && copyArray[1].extend.length > 0) {
            copyArray[1].extend.forEach((item) => {
              item.options = []
            })
          }
          this.copyForm = JSON.stringify(this.subareaGroups)
          this.copySubareaLabelName = JSON.stringify(this.subareaLabelName)
          this.noneChange = false
        } else {
          this.isbl = false
          this.$notify.error({
            title: '错误',
            message: '未保存成功！'
          })
        }
      })
    },
    cancleChange() {
      if (this.copyForm) {
        this.subareaGroups = JSON.parse(this.copyForm)
      } else {
        this.subareaGroups = []
      }
      this.subareaLabelName = JSON.parse(this.copySubareaLabelName)
      this.noneChange = false
    },
    // 模糊查询
    fuzzySearch() {
      let name = ''
      let templateId = ''
      axios.getCIList(name, templateId).then((res) => {
        let data = res.data.data
        let tmpCITypeItems = data.result
        tmpCITypeItems.forEach((ciType, index) => {
          this.$set(ciType, 'ifShow', true)
        })
        for (let i = 0; i < tmpCITypeItems.length;) {
          for (let j = 0; j < tmpCITypeItems[i].citypeList.length;) {
            if (
              tmpCITypeItems[i].citypeList[j].name.indexOf(
                this.searchSubarea
              ) === -1
            ) {
              tmpCITypeItems[i].citypeList.splice(j, 1)
            } else {
              j++
            }
          }
          if (tmpCITypeItems[i].citypeList.length === 0) {
            tmpCITypeItems.splice(i, 1)
          } else {
            i++
          }
        }
        this.CITypeItems = tmpCITypeItems
        this.subareaLabelName = {
          title: '名称',
          extend: [
            {
              label: '名称',
              defaultValue: '',
              type: 'singleLineInput'
            },
            {
              label: '业务组',
              defaultValue: '',
              type: 'optionsInputSys'
            },
            {
              label: '环境',
              defaultValue: '',
              type: 'optionsInputEnv'
            }
          ]
        }
        this.subareaGroups = []
      })
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.visible) {
      try {
        let bl = checkModification(this.isbl)
        if (bl) {
          const answer = window.confirm(
            '页面相关数据还未保存，是否离开当前页面!'
          )
          answer ? next() : next(false)
        }
      } catch (error) {
        next()
      }
    }
    next()
  },

  destroyed() {
    window.onbeforeunload = null
  },
  mounted() {
    let name = ''
    let templateId = ''
    axios.getCIList(name, templateId).then((res) => {
      let data = res.data.data
      this.CITypeItems = data.result
      this.CITypeItems.forEach((ciType, index) => {
        this.$set(ciType, 'ifShow', true)
        ciType.citypeList.forEach((item, index) => {
          this.$set(item, 'addHighLight', false)
        })
      })
      if (this.CITypeItems[0] && this.CITypeItems[0].citypeList[0]) {
        this.getCITypeItemDetail(
          this.CITypeItems[0].citypeList[0].citypeId,
          this.CITypeItems[0].citypeList[0]
        )
      }
    })
    let _this = this
    Bus.$on('clear', function () {
      _this.visibedRelation = false
      _this.visibedCondition = false
      _this.visibed = false
    })
  }
}
</script>

<style scoped lang="scss">
.contentBoxcitype {
  margin: 10px;
  display: flex;
  flex-wrap: nowrap;
  #invisibleCover {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 5;
  }
  .left-side {
    position: relative;
    flex: 1;
    margin-right: 20px;
    background-color: #fff;
    text-align: center;
    .left-side-title {
      height: 60px;
      font-size: 20px;
      font-weight: bolder;
      line-height: 60px;
      margin-bottom: 35px;
      position: relative;
      cursor: pointer;
      border-bottom: 1px solid #ccc;
      background-color: #fefefe;
      text-align: left;
      padding-left: 15%;
      .left-arrow-icon {
        display: inline-block;
        position: absolute;
        top: 20px;
        right: 15px;
      }
    }
    .tree-wrapper {
      .tree-block {
        .tree-block-title {
          width: 70%;
          margin-left: 15%;
          text-align: left;
          font-size: 16px;
          font-weight: bolder;
          line-height: 16px;
          margin-bottom: 20px;
          clear: both;
          cursor: pointer;
        }
        .iconStyle {
          vertical-align: top;
        }
        .tree-block-item {
          width: 77%;
          float: right;
          text-align: left;
          height: 40px;
          font-size: 14px;
          line-height: 20px;
          color: #2a2f55;
          /* color: #00A8E8; */
          opacity: 0.8;
          cursor: pointer;
          &:hover {
            font-weight: bold;
          }
        }
      }
    }
  }
  .right-content {
    flex-basis: 80%;
    display: flex;
    flex-direction: column;
    .search-form {
      margin-bottom: 20px;
      .search-input {
        width: 260px;
        height: 44px;
        margin-right: 20px;
      }
      .search-el-button {
        border: 1px solid #436382;
        color: #fff;
        &:hover {
          border: 1px solid #01aef1;
          color: #01aef1;
          background-color: #041c25;
        }
        &:focus {
          border: 1px solid #01aef1;
          color: #01aef1;
          background-color: #041c25;
        }
        &:active {
          background-color: #041c25;
          border: 1px solid #01aef1;
          color: #01aef1;
        }
      }
    }
    .tabs-wrapper {
      flex: 1;
      background-color: #fff;
      padding-left: 40px;
      min-height: 500px;
      .row-bg {
        .subareaHeader {
          height: 40px;
          line-height: 40px;
          font-size: 18px;
          font-weight: bold;
          color: #00a8e8;
          /* border-bottom: 2px solid #409eff; */
          border-bottom: 1px solid #00a8e8;
          /* padding-left: 30px; */
          margin-bottom: 10px;
          /* background-image: url("../../../static/img/icon_bt.png");
          background-repeat: no-repeat;
          background-position: left center; */
        }
        .deleteSubarea {
          float: right;
          margin-right: 20px;
          line-height: 40px;
        }
        .type-tempalte {
          /*border: 1px solid #000;*/
          width: 100%;
          max-width: 370px;
          color: #fff;
          position: fixed;
          bottom: 0px;
          right: 55px;
          z-index: 99;
          .type-tempalte-title {
            height: 76px;
            margin-left: 35px;
            /* background-color: #423be2; */
            background-color: #00a8e8;
            border-radius: 6px;
          }
          .type-tempalte-content {
            position: relative;
            margin-left: 35px;
            margin-top: 35px;
            padding-bottom: 5px;
            border-radius: 6px;
            border: solid 1px #e9e9e9;
            box-shadow: 0 3px 3px 0 #ccc;
            .addAttribute {
              height: 20px;
              width: 80px;
              text-align: center;
              line-height: 20px;
              color: #2a2f55;
              background: #fff;
              font-size: 16px;
              font-weight: bold;
              position: absolute;
              top: -10px;
              left: 10px;
            }
            .inputGroup {
              margin: 8px auto;
              .addSubarea {
                margin-top: 15px;
                cursor: pointer;
                .addSubareaBtn {
                  width: 85%;
                  height: 40px;
                  line-height: 40px;
                  text-align: center;
                  border-radius: 6px;
                  margin: auto;
                  margin-bottom: 6px;
                  font-weight: bolder;
                  /* background-color: #423be2; */
                  background-color: #0280ff;
                  cursor: pointer;
                }
              }
              .inputType {
                text-align: center;
                display: flex;
                height: 86px;
                background-size: 100% 100%;
                background-repeat: no-repeat;
                cursor: pointer;
                .inputTypeName {
                  width: 100%;
                  line-height: 90px;
                }
              }
            }
          }
        }
      }
      .row-content {
        .content-wrapper {
          padding: 20px;
          box-shadow: 0 0 8px #e0e0e0;
          .top-btn {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            /* border: 1px solid rgba(22, 155, 213, 1);
            color: rgba(22, 155, 213, 1); */
            border: 1px solid #00a8e8;
            color: #00a8e8;
            span {
              flex: 1;
              text-align: center;
              padding: 10px 0;
            }
          }
          .top-content {
            margin: 20px 0;
            .gx-box {
              color: #fff;
              ul {
                margin: 10px;
                li {
                  display: inline-block;
                  list-style-type: none;
                  padding: 5px 8px;
                  margin: 5px 5px;
                  background-color: #aeaeae;
                  color: #fff;
                  border-radius: 3px;
                  cursor: pointer;
                  font-size: 14px;
                }
              }
            }
            .box-font {
              height: 40px;
              cursor: pointer;
              /* border: 1px solid rgba(22, 155, 213, 1); */
              border: 1px solid #436382;
            }
            .font-styles {
              text-align: center;
              color: #afafaf;
            }
            .type-box {
              /deep/ ul {
                margin: 10px;
                li {
                  list-style-type: none;
                  cursor: pointer;
                  font-size: 12px;
                  padding: 5px 10px;
                  &:hover {
                    /* background: #409eff; */
                    background: #00a8e8;
                    color: #fff;
                  }
                }
              }
            }
          }
        }
      }
    }
    .editSubarea {
      width: 300px;
      /*height: 500px;*/
      background-color: #fff;
      position: fixed;
      bottom: 0;
      right: 18px;
      z-index: 1000;
      border-radius: 6px;
      border: 1px solid #ccc;
      box-shadow: -5px 5px 10px #aaa;
      padding-bottom: 20px;
      .editTitle {
        height: 50px;
        /* background-color: rgba(66, 59, 226, 0.8); */
        background-color: #00a8e8;
        border-radius: 6px 6px 0 0;
        color: #fff;
        text-indent: 1.5em;
        line-height: 50px;
        font-weight: bold;
        .subareaForm {
          .attributeItem {
            margin-top: 10px;
            p {
              margin-bottom: 8px;
            }
          }
        }
      }
    }
    .delicon {
      font-size: 2rem;
      cursor: pointer;
      display: inline-block;
      margin-left: 10px;
    }
    .noborder {
      .el-tabs__nav-wrap {
        .el-tabs__nav-wrap::after {
          content: '';
          background-color: transparent !important;
        }
      }
    }
  }
  .highLigtht {
    /* color: #409eff; */
    color: #00a8e8;
  }
  .el-tabs__item {
    font-size: 18px;
    height: 60px;
    line-height: 80px;
  }
  .el-tabs__nav-wrap::after {
    background-color: rgba(255, 255, 255, 0);
  }
  .el-button--text {
    color: #fff;
    &:hover {
      color: #fff;
    }
    &:focus {
      color: #fff;
    }
  }
  .el-tabs__item {
    .is-active {
      /* color: rgb(66, 59, 226); */
      color: #00a8e8 !important;
      /* background-color: #00A8E8!important; */
    }
    &:hover {
      /* color: rgb(66, 59, 226); */
      color: #00a8e8 !important;
    }
  }
  .el-tabs__active-bar {
    background: linear-gradient(left, #ff4b95 0%, #9f43bd 28%, #3e3be4 100%);
  }
  .active {
    /* background-color: rgba(22, 155, 213, 1); */
    background-color: #00a8e8;
    color: #fff;
  }
  .aLabel {
    background-color: #fff;
  }
}
</style>
<style>
.el-tabs__item.is-active {
  /* color: rgb(66, 59, 226); */
  color: #00a8e8 !important;
  /* background-color: #00A8E8!important; */
}
.el-tabs__item:hover {
  /* color: rgb(66, 59, 226); */
  color: #00a8e8 !important;
}
.el-tabs__active-bar {
  /* background: linear-gradient(left, #ff4b95 0%, #9f43bd 28%, #3e3be4 100%); */
  background: #00a8e8;
}
.gx-box ul li {
  display: inline-block;
  list-style-type: none;
  padding: 5px 8px;
  margin: 5px 5px;
  background-color: #aeaeae;
  color: #fff;
  border-radius: 3px;
  cursor: pointer;
  font-size: 14px;
}
.el-tree-node__content:hover {
  background: #00a8e8;
  color: #fff;
}
.el-tree-node:focus > .el-tree-node__content {
  background: #00a8e8;
  color: #fff;
}

</style>
