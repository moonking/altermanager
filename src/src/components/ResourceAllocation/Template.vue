<template>
  <div class="contentBox1 aibms-template">
    <div
      id="invisibleCover"
      v-show="islabelName || singleLineInput || multiLineInput || pwdInput || numInput || selectInput || dateInput"
      @click="closeForm()"
    ></div>
    <div class="templateWrapper1">
      <div style="flex: 1;">
        <p>模板管理</p>
      </div>
      <div class="btns" style="flex-basis: 80%;">
        <el-button icon="el-icon-close" class="nomal-button" @click="deleteMore">批量删除</el-button>
        <el-button
          class="nomal-button"
          @click="saveDelete"
          v-if="!isdeleteMore"
        >删除</el-button>
        <el-button
          class="nomal-button"
          @click="cancleDelete"
          v-if="!isdeleteMore"
        >取消</el-button>
        <!-- <el-button
          class="cm-form-btn cm-delete-btn-light delbt"
          @click="deleteMore"
          v-if="isdeleteMore"
        >批量删除</el-button>-->
        <el-button
          icon="el-icon-search"
          class="nomal-button margin-left-btn"
          @click.stop="fuzzySearch"
        >查找</el-button>
        <el-button
          type="primary"
          icon="el-icon-plus"
          class="margin-left-btn"
          @click.prevent="dialogTableVisibleAdd=true"
        >新增</el-button>
      </div>
    </div>
    <div style="width: 100%;display: flex;flex-wrap: nowrap;" class="content-wrapper">
      <div class="left-side all-aibms-color-bg">
        <div class="left-side-title aibms-bg">
          <div class="search-form" style="width: 90%;margin-top: 15px;margin: auto;">
            <el-row :gutter="10">
              <el-col :span="17">
                <el-input
                  clearable
                  style="width: 100%;"
                  size="small"
                  class="serach-input"
                  v-model="searchSubarea"
                ></el-input>
              </el-col>
            </el-row>
          </div>
        </div>

        <div class="tree-wrapper" v-for="(ciType) in CITypeItems" :key="ciType.tepgroupId">
          <div class="tree-block">
            <div class="tree-block-title" :title="ciType.name">
              <i class="el-icon-caret-bottom iconStyle" v-show="ciType.ifShow"></i>
              <i class="el-icon-caret-right iconStyle" v-show="!ciType.ifShow"></i>
              <p
                style="display: inline-block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;width: 100px;"
                @click="clickCIType(ciType.tepgroupId)"
              >{{ciType.name}}</p>
              <i
                class="el-icon-circle-plus"
                style="position: absolute;right: 30px;"
                @click="addTemplate(ciType)"
              ></i>
              <i
                class="el-icon-edit"
                style="position: absolute;right: 10px;"
                @click="editClassify(ciType)"
              ></i>
            </div>

            <el-collapse-transition>
              <div v-show="ciType.ifShow">
                <div
                  style="display: flex;"
                  :class="{highLigtht:item.addHighLight}"
                  :title="item.name"
                  class="tree-block-item"
                  v-for="(item,index) in ciType.templateList"
                  :key="index"
                >
                  <el-checkbox
                    v-show="!isdeleteMore"
                    v-model="item.ifChecked"
                    @change="getTemplateId(item.ifChecked,item.templateId)"
                  ></el-checkbox>
                  <p
                    style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;width: 90px;"
                    @click="getCITypeItemDetail(item.templateId)"
                  >{{'&nbsp;&nbsp;'+item.name}}</p>
                  <!-- <i class="el-icon-edit" style="position: absolute;right: 38px;" @click="editTemplate(item.templateId)"></i> -->
                  <i
                    class="el-icon-edit"
                    style="position: absolute;right: 23px;"
                    @click="alertEdit(item)"
                  ></i>
                </div>
              </div>
            </el-collapse-transition>
          </div>
        </div>
      </div>
      <!-- 编辑、删除模板 -->
      <div class="editTemplateForm">
        <el-dialog
          title
          center
          width="35%"
          :visible.sync="dialogFormVisible"
          :modal-append-to-body="false"
        >
          <div style="font-size: 18px;margin-bottom: 30px;height: 30px;position: relative;">
            <span style="display: inline-block;height:30px;width: 10px;background-color: #423be2;"></span>
            <span style="position: absolute;top: 5px;left: 25px;">编辑模板</span>
            <!-- <i
              class="el-icon-delete"
              style="float: right;padding-right: 20px;"
              @click="deleteTemplate"
            ></i>-->
            <div @click="deleteTemplate" style="float: right;padding-right: 20px;" class="delicon">
              <icon-svg icon-class="lajitong" class="template-icon-size" />
            </div>
          </div>
          <el-form :model="temlateFrom">
            <el-form-item label="模板名称" label-width="120px">
              <el-input v-model="temlateFrom.name" autocomplete="off" maxlength="10"></el-input>
            </el-form-item>
            <el-form-item label="所在分类" label-width="120px">
              <el-select
                style="width: 100%;"
                v-model="temlateFrom.tepgroupId"
                placeholder="请选择所在分类"
              >
                <el-option
                  v-for="ciType in CITypeItems"
                  :key="ciType.tepgroupId"
                  :label="ciType.name"
                  :value="ciType.tepgroupId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button class="nomal-button" @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="editTemplate">确 定</el-button>
          </div>
        </el-dialog>
      </div>
      <!-- 新增模板 -->
      <div class="editTemplateForm">
        <el-dialog
          title
          center
          width="30%"
          :visible.sync="TemplateTableVisibleAdd"
          :modal-append-to-body="false"
        >
          <div style="font-size: 18px;margin-bottom: 30px;height: 30px;position: relative;">
            <p style="text-align: center;">新增模板</p>
          </div>
          <el-input v-model="NewTempalte" autocomplete="off" maxlength="10"></el-input>
          <div slot="footer" class="dialog-footer">
            <el-button class="nomal-button" @click="TemplateTableVisibleAdd = false">取 消</el-button>
            <el-button type="primary" @click="addClassifyBtn">确 定</el-button>
          </div>
        </el-dialog>
      </div>
      <!-- 新增分类 -->
      <div class="editTemplateForm">
        <el-dialog
          title
          center
          width="30%"
          :before-close="handleDialogClose"
          :visible.sync="dialogTableVisibleAdd"
          :modal-append-to-body="false"
        >
          <div style="font-size: 18px;margin-bottom: 30px;height: 30px;position: relative;">
            <p style="text-align: center;">新增分类</p>
          </div>
          <el-form ref="form" label-width="100px" :rules="rules" :model="Newclassdata">
            <el-form-item label="分类名称：" prop="NewClassify">
              <el-input v-model="Newclassdata.NewClassify" autocomplete="off" maxlength="10"></el-input>
            </el-form-item>
          </el-form>

          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="addClassify">确 定</el-button>
            <el-button class="nomal-button" @click="cancel">取 消</el-button>
          </div>
        </el-dialog>
      </div>
      <!-- 编辑分类 -->
      <div class="editTemplateForm">
        <el-dialog
          title
          center
          width="30%"
          :visible.sync="dialogTableVisible"
          :modal-append-to-body="false"
        >
          <div style="font-size: 18px;margin-bottom: 30px;height: 30px;position: relative;">
            <p style="text-align: center;">编辑分类</p>
            <!-- <i
              class="el-icon-delete"
              style="position: absolute;top: 5px;right: 25px;"
              @click="deleteClassify"
            ></i>-->
            <div
              @click="deleteClassify"
              style="position: absolute;top: 5px;right: 25px;"
              class="delicon"
            >
              <icon-svg icon-class="lajitong" class="template-icon-size" />
            </div>
          </div>
          <el-form :model="classifyForm">
            <el-form-item label>
              <el-input v-model="classifyForm.name" autocomplete="off" maxlength="10"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button class="nomal-button" @click="dialogTableVisible = false">取 消</el-button>
            <el-button type="primary" @click="editClassifyBtn">确 定</el-button>
          </div>
        </el-dialog>
      </div>
      <div class="right-content1">
        <!--    <div class="tabs-wrapper" v-show="templateId"> -->
        <div class="tabs-wrapper1 aibms-color-bg">
          <el-row type="flex" class="row-bg">
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
                          v-for="(domain1,domainIndex1) in subareaLabelName.extend"
                          :key="domainIndex1+domain1.label"
                        >
                          <el-form-item :label="domain1.label">
                            <el-col :span="20">
                              <el-input
                                v-if="domain1.type == 'singleLineInput' || domain1.type == 'optionsInputSys' || domain1.type == 'optionsInputEnv'"
                                v-model="domain1.defaultValue"
                                disabled
                              ></el-input>
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
                      v-for="(subarea,subareaIndex) in subareaGroups"
                      :key="subareaIndex+subarea.title"
                    >
                      <div class="subarea">
                        <div class="subareaHeader">
                          {{subarea.title}}
                          <!-- <i
                            class="el-icon-delete deleteSubarea"
                            @click="clickDeletSubarea(subareaIndex)"
                          ></i>-->
                          <div @click="clickDeletSubarea(subareaIndex)" class="delicon">
                            <icon-svg icon-class="lajitong" class="template-icon-size" />
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
                                  v-for="(domain,domainIndex) in subarea.extend"
                                  :key="domainIndex+domain.label"
                                >
                                  <el-form-item :label="domain.label" :key="domain.key">
                                    <el-col :span="20">
                                      <el-select
                                        style="width: 100%;"
                                        v-if="domain.type == 'credentialsSelect'"
                                        v-model="domain.defaultValue"
                                        placeholder="请选择"
                                        :clearable="true"
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
                                        v-else
                                        v-model="domain.defaultValue"
                                        @focus="getDomian(domain,domainIndex,subareaIndex)"
                                      ></el-input>
                                    </el-col>
                                    <!--<el-col :span="4">-->
                                    <!--<i-->
                                    <!--class="el-icon-delete deleteSubarea"-->
                                    <!--v-if="domain1.type == 'credentialsSelect'"-->
                                    <!--@click.prevent="deleteCredential"-->
                                    <!--&gt;</i>-->
                                    <!--</el-col>-->
                                    <el-col :span="4">
                                      <!-- <i
                                        class="el-icon-delete deleteSubarea"
                                        @click.prevent="removeDomain(domain,subareaIndex)"
                                      ></i>-->
                                      <div
                                        @click.prevent="removeDomain(domain,subareaIndex)"
                                        class="delicon"
                                      >
                                        <icon-svg icon-class="lajitong" class="template-icon-size" />
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
              <div class="btnGroup" v-if="noneChange" style="margin-bottom: 40px;">
                <el-row>
                  <el-col :span="6" :offset="2">
                    <!-- <button
                      style="width: 100%;height: 40px;background-color: #00A8E8;color: #fff;border:none;border-radius: 4px;"
                      @click="clickSubmit()"
                    >确定</button> -->
                    <el-button type="primary" @click="clickSubmit">确定</el-button>
                  </el-col>

                  <el-col :span="6" :offset="6">
                    <el-button class="nomal-button" @click="cancleChange">取消</el-button>
                    <!-- <button
                      @click="cancleChange()"
                    >取消</button> -->
                  </el-col>
                </el-row>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="type-tempalte">
                <!-- <div class="type-tempalte-title">
                  <span
                    style="font-size: 28px;line-height: 80px;display: inline-block;padding-left: 23px;"
                  >模板</span>
                  <span
                    style="font-size: 12px;
                        line-height: 80px;
                        display: inline-block;
                        float: right;
                        padding-right: 18px;
                        margin-right: 23px;
                        background-image: url('../../../static/img/icon_next.png');
                        background-repeat: no-repeat;
                        background-position: right center;
                        "
                  >基本信息</span>
                </div>-->
                <div class="type-tempalte-content">
                  <div class="addAttribute">添加属性</div>
                  <div
                    style="width: 95%;margin:auto;margin-top: 15px;"
                    @click="clickAttributeInput($event)"
                  >
                    <el-row class="inputGroup">
                      <el-col :span="12">
                        <div class="addSubarea">
                          <div class="addSubareaBtn" @click="clickAddSubArea($event)">
                            <el-button type="text">新增分区</el-button>
                          </div>
                        </div>
                      </el-col>
                      <el-col :span="12">
                        <div class="addSubarea">
                          <div class="addSubareaBtn" @click="clickAddCredentials($event)">
                            <el-button type="text">凭证属性</el-button>
                          </div>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row class="inputGroup">
                      <el-col :span="12">
                        <div
                          class="inputType"
                          style="background-image: url('../../../static/img/text1.png');"
                        >
                          <p class="inputTypeName">单行文本框 +</p>
                        </div>
                      </el-col>
                      <el-col :span="12">
                        <div
                          class="inputType"
                          style="background-image: url('../../../static/img/text2.png');"
                        >
                          <p class="inputTypeName">多行文本框 +</p>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row class="inputGroup">
                      <el-col :span="12">
                        <div
                          class="inputType"
                          style="background-image: url('../../../static/img/text3.png');"
                        >
                          <p class="inputTypeName">密码框 +</p>
                        </div>
                      </el-col>
                      <el-col :span="12">
                        <div
                          class="inputType"
                          style="background-image: url('../../../static/img/text4.png');"
                        >
                          <p class="inputTypeName">数字框 +</p>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row class="inputGroup">
                      <el-col :span="12">
                        <div
                          class="inputType"
                          style="background-image: url('../../../static/img/text5.png');"
                        >
                          <p class="inputTypeName">选择框 +</p>
                        </div>
                      </el-col>
                      <el-col :span="12">
                        <div
                          class="inputType"
                          style="background-image: url('../../../static/img/text6.png');"
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
          <!-- <el-tabs v-model="activeName" @tab-click="handleClick" v-show="citypeId">
            <el-tab-pane label="类型属性" name="first">

            </el-tab-pane>
            <el-tab-pane label="类型关系" name="second"></el-tab-pane>
          </el-tabs>-->
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
            <el-form ref="form" :model="form" style="width: 85%;margin: auto;">
              <div class="attributeItem">
                <p>
                  <span style="color: red">*</span>字段名
                </p>
                <el-input class="inputSize" v-model="form.label" maxlength="20"></el-input>
              </div>
              <div class="attributeItem">
                <p>默认值</p>
                <el-input v-model="form.defaultValue"></el-input>
              </div>
              <div class="attributeItem">
                <p>验证规则</p>
                <el-select style="width: 100%" v-model="form.rules">
                  <el-option label="无" value="0"></el-option>
                  <el-option label="URL" :value="JSON.stringify(urlRule)"></el-option>
                  <el-option label="IP地址" :value="JSON.stringify(IpRule)"></el-option>
                  <el-option label="子网掩码" :value="JSON.stringify(maskRule)"></el-option>
                  <el-option label="端口号" :value="JSON.stringify(portRule)"></el-option>
                  <el-option label="Email" :value="JSON.stringify(EmailRule)"></el-option>
                  <el-option label="手机号码" :value="JSON.stringify(phoneRule)"></el-option>
                </el-select>
              </div>
              <div class="attributeItem">
                <p>最小文本长度</p>
                <el-input
                  @keyup.native="proving"
                  v-model="form.minLength"
                  :disabled="form.rules === '' ? false : form.rules === '0' ? false : true"
                ></el-input>
              </div>
              <div class="attributeItem">
                <p>最大文本长度</p>
                <el-input
                  @keyup.native="proving"
                  v-model="form.maxLength"
                  :disabled="form.rules === '' ? false : form.rules === '0' ? false : true"
                ></el-input>
              </div>
              <div class="attributeItem">
                <el-checkbox label="必填" v-model="form.required"></el-checkbox>
                <el-checkbox label="只读" v-model="form.readOnly"></el-checkbox>
              </div>
              <p style="font-size: 12px;color: red" v-show="isRequiredInput">必填项不能为空</p>
              <p style="font-size: 12px;color: red" v-show="isErrorInput">最大文本长度和最小文本长度冲突</p>
            </el-form>
          </div>
        </div>
        <div class="editSubarea" v-show="multiLineInput">
          <div class="editTitle">编辑--多行文本框属性</div>
          <div class="subareaForm">
            <el-form ref="form" :model="form" style="width: 85%;margin: auto;">
              <div class="attributeItem">
                <p>
                  <span style="color: red">*</span>字段名
                </p>
                <el-input class="inputSize" v-model="form.label" maxlength="20"></el-input>
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
                  <el-option label="JSON" :value="JSON.stringify(jsonRule)"></el-option>
                </el-select>
              </div>
              <div class="attributeItem">
                <p>最小文本长度</p>
                <el-input @keyup.native="proving" v-model="form.minLength"></el-input>
              </div>
              <div class="attributeItem">
                <p>最大文本长度</p>
                <el-input @keyup.native="proving" v-model="form.maxLength"></el-input>
              </div>
              <div class="attributeItem">
                <el-checkbox label="必填" v-model="form.required"></el-checkbox>
                <el-checkbox label="只读" v-model="form.readOnly"></el-checkbox>
              </div>
              <p style="font-size: 12px;color: red" v-show="isRequiredInput">必填项不能为空</p>
              <p style="font-size: 12px;color: red" v-show="isErrorInput">最大文本长度和最小文本长度冲突</p>
            </el-form>
          </div>
        </div>
        <div class="editSubarea" v-show="pwdInput">
          <div class="editTitle">编辑--密码框属性</div>
          <div class="subareaForm">
            <el-form ref="form" :model="form" style="width: 85%;margin: auto;">
              <div class="attributeItem">
                <p>
                  <span style="color: red">*</span>字段名
                </p>
                <el-input class="inputSize" v-model="form.label" maxlength="20"></el-input>
              </div>
              <div class="attributeItem">
                <p>默认值</p>
                <el-input v-model="form.defaultValue"></el-input>
              </div>
              <div class="attributeItem">
                <p>验证器</p>
                <el-select style="width: 100%" v-model="form.verifier">
                  <el-option label="无" value="0"></el-option>
                  <el-option label="数字与字母组合" :value="JSON.stringify(dateAndCode)"></el-option>
                  <el-option label="数字或字母组合" :value="JSON.stringify(dateOrCode)"></el-option>
                  <el-option label="纯数字" :value="JSON.stringify(onlyDate)"></el-option>
                  <el-option label="纯字母" :value="JSON.stringify(onlyCode)"></el-option>
                </el-select>
              </div>
              <div class="attributeItem">
                <p>最小文本长度</p>
                <el-input @keyup.native="proving" v-model="form.minLength"></el-input>
              </div>
              <div class="attributeItem">
                <p>最大文本长度</p>
                <el-input @keyup.native="proving" v-model="form.maxLength"></el-input>
              </div>
              <div class="attributeItem">
                <el-checkbox label="必填" v-model="form.required"></el-checkbox>
                <el-checkbox label="只读" v-model="form.readOnly"></el-checkbox>
              </div>
              <p style="font-size: 12px;color: red" v-show="isRequiredInput">必填项不能为空</p>
              <p style="font-size: 12px;color: red" v-show="isErrorInput">最大文本长度和最小文本长度冲突</p>
            </el-form>
          </div>
        </div>
        <div class="editSubarea" v-show="numInput">
          <div class="editTitle">编辑--数字框属性</div>
          <div class="subareaForm">
            <el-form ref="form" :model="form" style="width: 85%;margin: auto;">
              <div class="attributeItem">
                <p>
                  <span style="color: red">*</span>字段名
                </p>
                <el-input class="inputSize" v-model="form.label" maxlength="20"></el-input>
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
                  <el-option label="非负数" :value="JSON.stringify(nonnegativeRule)"></el-option>
                  <el-option label="正整数" :value="JSON.stringify(positiveRule)"></el-option>
                </el-select>
              </div>
              <div class="attributeItem">
                <p>最小文本长度</p>
                <el-input @keyup.native="proving" v-model="form.minLength"></el-input>
              </div>
              <div class="attributeItem">
                <p>最大文本长度</p>
                <el-input @keyup.native="proving" v-model="form.maxLength"></el-input>
              </div>
              <div class="attributeItem">
                <el-checkbox label="必填" v-model="form.required"></el-checkbox>
                <el-checkbox label="只读" v-model="form.readOnly"></el-checkbox>
              </div>
              <p style="font-size: 12px;color: red" v-show="isRequiredInput">必填项不能为空</p>
              <p style="font-size: 12px;color: red" v-show="isErrorInput">最大文本长度和最小文本长度冲突</p>
            </el-form>
          </div>
        </div>
        <div class="editSubarea" v-show="selectInput">
          <div class="editTitle">编辑--选择框属性</div>
          <div class="subareaForm">
            <el-form
              ref="form"
              :model="form"
              style="width: 85%;margin: auto;"
              @submit.native.prevent
            >
              <div class="attributeItem">
                <p>
                  <span style="color: red">*</span>
                  字段名
                </p>
                <el-input class="inputSize" v-model="form.label" maxlength="20"></el-input>
              </div>
              <div class="attributeItem">
                <p>
                  <span style="color: red">*</span>
                  自定义选项
                </p>
                <el-button
                  size="mini"
                  v-for="(item,index) in form.defined"
                  @click="deleteItem(index)"
                  :key="index"
                >{{item}}</el-button>
                <el-input
                  style="margin-top: 8px;"
                  placeholder="输入后，点击回车"
                  v-model="definedItem"
                  @keyup.enter.native="addDefined()"
                ></el-input>
              </div>
              <div class="attributeItem">
                <el-checkbox label="多选" v-model="form.moreSelect"></el-checkbox>
                <el-checkbox label="必填" v-model="form.required"></el-checkbox>
                <!-- <el-checkbox label="只读" v-model="form.readOnly"></el-checkbox> -->
              </div>
              <p style="font-size: 12px;color: red" v-show="isRequiredInput">必填项不能为空</p>
            </el-form>
          </div>
        </div>
        <div class="editSubarea" v-show="dateInput">
          <div class="editTitle">编辑--时间日期框属性</div>
          <div class="subareaForm">
            <el-form ref="form" :model="form" style="width: 85%;margin: auto;">
              <div class="attributeItem">
                <p>
                  <span style="color: red">*</span>字段名
                </p>
                <el-input class="inputSize" v-model="form.label" maxlength="20"></el-input>
              </div>
              <div class="attributeItem">
                <p>默认值</p>
                <el-date-picker
                  v-model="form.defaultValue"
                  type="datetime"
                  placeholder="选择日期时间"
                  value-format="yyyy-MM-dd HH-mm-ss"
                  style="width: 100%"
                ></el-date-picker>
              </div>
              <div class="attributeItem">
                <el-checkbox label="仅日期" v-model="form.dateOnly" name="type"></el-checkbox>
                <br />
                <el-checkbox label="必填" v-model="form.required"></el-checkbox>
                <el-checkbox label="只读" v-model="form.readOnly"></el-checkbox>
              </div>
              <p style="font-size: 12px;color: red" v-show="isRequiredInput">必填项不能为空</p>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/api';
// import { initFileds, checkModification } from "../../utils/reload.js";
import draggable from 'vuedraggable';
export default {
  name: 'CIType',
  components: {
    draggable
  },
  data () {
    return {
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
      dialogFormVisible: false,
      dialogTableVisible: false,
      dialogTableVisibleAdd: false,
      TemplateTableVisibleAdd: false,
      form: {
        label: '',
        defaultValue: '',
        unit: '',
        rules: '',
        maxLength: '',
        minLength: '',
        readOnly: false,
        required: false,
        moreSelect: false,
        dataType: '',
        verifier: '',
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
      templateId: '',
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
      isdeleteMore: true,
      islabelName: false,
      copySubareaLabelName: '',
      delTemplateArr: [],
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
        正整数: '^[1-9]d*$'
      },
      jsonRule: {
        JSON: '^{[s*"w+":"w+",*s*]+}$'
      },
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
      temlateFrom: {},
      classifyForm: {},
      Newclassdata: {
        NewClassify: ''
      },
      rules: {
        NewClassify: [
          { required: true, message: '分类名称不能为空', trigger: 'blur' }
        ]
      },
      NewTempalte: '',
      addTemplateTepgroupId: ''
    };
  },
  methods: {
    handleDialogClose () {
      this.$refs.form.resetFields();
      this.dialogTableVisibleAdd = false;
    },
    // 新增分类
    addClassify () {
      this.$refs.form.validate(valid => {
        if (valid) {
          let obj = {
            name: this.Newclassdata.NewClassify
          };
          axios.PostClassify(obj).then(res => {
            if (res.data.code == 200) {
              this.GetClassifyFn();
              this.dialogTableVisibleAdd = false;
              this.Newclassdata.NewClassify = '';
            } else if (res.data.code == 500) {
              // this.$notify({
              //   title: '警告',
              //   message: res.data.message,
              //   type: 'warning'
              // });
            }
          });
        }
      });
    },
    cancel () {
      this.$refs.form.resetFields();
      this.dialogTableVisibleAdd = false;
    },
    // 新增模板
    addTemplate (ciType) {
      this.TemplateTableVisibleAdd = true;
      this.addTemplateTepgroupId = ciType.tepgroupId;
      // this.$prompt('', '新增模板', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   center: true,
      // }).then(({ value }) => {
      //   let obj = {
      //     name: value,
      //     tepgroupId: ciType.tepgroupId
      //   }
      //   axios.PostTemplate(obj).then(res=>{
      //     if(res.data.code == 200){
      //       this.GetClassifyFn();
      //     }else if(res.data.code == 500){
      //       this.$notify({
      //         title: '警告',
      //         message: res.data.message,
      //         type: 'warning'
      //       });
      //     }
      //   })
      // }).catch(() => {

      // });
    },
    addClassifyBtn () {
      let obj = {
        name: this.NewTempalte,
        tepgroupId: this.addTemplateTepgroupId
      };
      axios.PostTemplate(obj).then(res => {
        if (res.data.code == 200) {
          this.GetClassifyFn();
          this.TemplateTableVisibleAdd = false;
          this.NewTempalte = '';
          this.addTemplateTepgroupId = '';
        } else if (res.data.code == 500) {
          this.$notify({
            title: '警告',
            message: res.data.message,
            type: 'warning'
          });
        }
      });
    },
    // 删除分类
    deleteClassify () {
      console.log(this.classifyForm);
      axios.DeleteClassify(this.classifyForm.tepgroupId).then(res => {
        if (res.data.code === 500) {
          this.$notify({
            title: '警告',
            message: res.data.message,
            type: 'warning'
          });
        } else if (res.data.code === 200) {
          this.GetClassifyFn();
          this.dialogTableVisible = false;
        }
        console.log(res);
      });
    },
    // 修改分类名称
    editClassify (ciType) {
      this.dialogTableVisible = true;
      // this.classifyForm = ciType;
      this.classifyForm = JSON.parse(JSON.stringify(ciType));
      console.log(this.classifyForm);
      // this.$prompt('', '编辑分类', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   center: true,
      // }).then(({ value }) => {
      //   console.log(ciType.tepgroupId)
      //   let obj = {
      //     name: value,
      //   }
      //   EditClassify(ciType.tepgroupId,obj).then(res=>{
      //     if(res.data.code == 200){
      //       this.GetClassifyFn();
      //     }else if(res.data.code == 500){
      //       this.$notify({
      //         title: '警告',
      //         message: res.data.message,
      //         type: 'warning'
      //       });
      //     }
      //   })
      // }).catch(() => {

      // });
    },
    // 确认分类修改
    editClassifyBtn () {
      let obj = {
        name: this.classifyForm.name
      };
      axios.EditClassify(this.classifyForm.tepgroupId, obj).then(res => {
        console.log(res);
        if (res.data.code == 200) {
          this.GetClassifyFn();
          this.dialogTableVisible = false;
        } else if (res.data.code == 500) {
          this.$notify({
            title: '警告',
            message: res.data.message,
            type: 'warning'
          });
        }
      });
    },
    // 修改弹框
    alertEdit (template) {
      this.dialogFormVisible = true;
      this.temlateFrom = {
        name: template.name,
        tepgroupId: template.tepgroupId,
        templateId: template.templateId
      };
    },
    // 修改模板名称
    editTemplate () {
      let obj = {
        name: this.temlateFrom.name,
        tepgroupId: this.temlateFrom.tepgroupId
      };
      axios.EditTemplate(this.temlateFrom.templateId, obj).then(res => {
        if (res.data.code == 200) {
          this.dialogFormVisible = false;
          this.temlateFrom = {};
          this.GetClassifyFn();
        } else if (res.data.code == 500) {
          this.$notify({
            title: '警告',
            message: res.data.message,
            type: 'warning'
          });
        }
      });
    },
    // 删除模板
    deleteTemplate () {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let id = this.temlateFrom.templateId;
          axios.DeleteTemplate(id).then(res => {
            if (res.data.code == 200) {
              if (id == this.templateId) {
                this.templateId = '';
              }
              this.GetClassifyFn();
              this.temlateFrom = {};
              this.dialogFormVisible = false;
            } else if (res.data.code == 500) {
              this.$notify({
                title: '警告',
                message: res.data.message,
                type: 'warning'
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    // 点击分类
    clickCIType (id) {
      console.log(id);
      this.CITypeItems.forEach(item => {
        if (item.tepgroupId == id) {
          item.ifShow = !item.ifShow;
        }
      });
    },
    // 点击模板名，获取模板详细信息
    getCITypeItemDetail (templateId) {
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
      };
      this.subareaGroups = [];
      this.copySubareaLabelName = JSON.stringify(this.subareaLabelName);
      this.copyForm = '[]';
      // 点击高亮
      this.CITypeItems.forEach(citype => {
        citype.templateList.forEach(item => {
          if (item.templateId == templateId) {
            item.addHighLight = true;
          } else {
            item.addHighLight = false;
          }
        });
      });

      this.templateId = templateId;
      this.copyForm = '[]';
      this.noneChange = false;
      axios.templateDetail(templateId).then(res => {
        console.log(res);
        let data = res.data.data;
        if (data.result.extend) {
          // 如果extend值不空，把名称的分区提取出来。
          let extend = JSON.parse(data.result.extend);
          extend.forEach(item => {
            if (item.title === '名称') {
              // let tmpArr = new Array(item);
              this.subareaLabelName = item;
              this.copySubareaLabelName = JSON.stringify(this.subareaLabelName);
              // this.subareaLabelName.extend.type = "singleLineInput";
            } else {
              this.subareaGroups.push(item);
            }
          });

          this.copyForm = JSON.stringify(this.subareaGroups);
        } else {
          data.result.extend = [];
          this.subareaGroups = [];
        }
      });
    },
    // 批量删除
    deleteMore () {
      this.isdeleteMore = !this.isdeleteMore;
    },
    // 取消批量删除
    cancleDelete () {
      this.isdeleteMore = !this.isdeleteMore;
      this.delTemplateArr = [];
      this.CITypeItems.forEach((ciType, index) => {
        ciType.templateList.forEach((item, index) => {
          item.ifChecked = false;
        });
      });
    },
    // 模板复选框
    getTemplateId (ifChecked, id) {
      console.log(ifChecked, id);
      if (ifChecked) {
        let existIndex = this.delTemplateArr.findIndex((value, index, arr) => {
          return value === id;
        });
        console.log(existIndex);
        if (existIndex < 0) {
          this.delTemplateArr.push(id);
        }
      } else {
        let existIndex = this.delTemplateArr.findIndex((value, index, arr) => {
          return value === id;
        });
        console.log(existIndex);
        if (existIndex >= 0) {
          this.delTemplateArr.splice(existIndex, 1);
        }
      }
      console.log(this.delTemplateArr);
      // this.delTemplateArr
    },
    saveDelete () {
      if (this.delTemplateArr[0]) {
        let templateIds = this.delTemplateArr.join();
        axios.SaveDeleteMore(templateIds).then(res => {
          if (res.data.code == 200) {
            if (this.delTemplateArr.indexOf(this.templateId) != -1) {
              this.templateId = '';
            }
            this.GetClassifyFn();
            this.temlateFrom = {};
          } else if (res.data.code == 500) {
            this.$notify({
              title: '警告',
              message: res.data.message,
              type: 'warning'
            });
          }
        });
        this.isdeleteMore = !this.isdeleteMore;
        this.GetClassifyFn();
      }
    },
    onEnd () {
      if (this.copyForm != JSON.stringify(this.subareaGroups)) {
        this.noneChange = true;
      }
    },
    clickAddSubArea (e) {
      e.stopPropagation();
      if (this.templateId) {
        this.$prompt('', '新增分区', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValidator: val => {
            if (!val) {
              return '分区名不能为空';
            } else if (val.replace(/\s+/g, '') === '') {
              return '分区名不能为空';
            } else if (val.length < 2 || val.length > 20) {
              return '分区名应在2-20个字符之间';
            } else {
              let ifRepeat = this.subareaGroups.some(item => {
                return item.title === val;
              });
              if (ifRepeat || val === '名称') {
                return '分区名已存在';
              }
            }
          }
        })
          .then(({ value }) => {
            let obj = {
              title: value, // 分区名字
              extend: []
            };
            this.subareaGroups.push(obj);
            this.noneChange = true;
          })
          .catch(() => { });
      } else {
        this.$notify({
          title: '警告',
          message: '请先选择对应的模板类型！',
          type: 'warning'
        });
      }
    },
    clickAddCredentials (e) {
      e.stopPropagation();
      if (this.subareaGroups.length === 0) {
        this.$notify({
          title: '警告',
          message: '请先新增分区！',
          type: 'warning'
        });
        return;
      }
      let lastSubarea = this.subareaGroups[this.subareaGroups.length - 1];
      if (this.templateId) {
        if (this.subareaLabelName.extend.length > 3) {
          return;
        }
        let credential = {
          label: '凭证',
          defaultValue: '0',
          type: 'credentialsSelect'
        };
        lastSubarea.extend.push(credential);
        if (this.copySubareaLabelName == JSON.stringify(lastSubarea) && this.copyForm == JSON.stringify(this.subareaGroups)) {
          this.noneChange = false;
        } else {
          this.noneChange = true;
        }
      } else {
        this.$notify({
          title: '警告',
          message: '请先选择对应的模板类型！',
          type: 'warning'
        });
      }
    },
    changeCredential () {
      if (this.copySubareaLabelName !== JSON.stringify(this.subareaLabelName)) {
        this.noneChange = true;
      }
    },
    deleteCredential () {
      this.subareaLabelName.extend.pop();
      if (
        this.copySubareaLabelName != JSON.stringify(this.subareaLabelName) ||
        this.copyForm != JSON.stringify(this.subareaGroups)
      ) {
        this.noneChange = true;
      } else {
        this.noneChange = false;
      }
    },
    clickDeletSubarea (index) {
      this.subareaGroups.splice(index, 1);
      let subareaGroupsString = JSON.stringify(this.subareaGroups);
      if (
        this.copySubareaLabelName == JSON.stringify(this.subareaLabelName) &&
        this.copyForm == subareaGroupsString
      ) {
        this.noneChange = false;
      } else {
        this.noneChange = true;
      }
    },
    clickAttributeInput (e) {
      console.log(this.templateId);
      if (!this.templateId) {
        this.$notify({
          title: '警告',
          message: '请先选择对应的模板类型！',
          type: 'warning'
        });
        return;
      }
      if (this.subareaGroups.length === 0) {
        this.$notify({
          title: '警告',
          message: '请先新增分区！',
          type: 'warning'
        });
        return;
      }
      let inputType = e.target.innerHTML;
      // 获取subareaGroups最后一个index的值
      let lastSubarea = this.subareaGroups[this.subareaGroups.length - 1];
      if (inputType === '单行文本框 +') {
        // 弹出单行文本框的属性设置
        this.singleLineInput = true;

        lastSubarea.extend.push({
          inputType: '单行文本框',
          type: 'singleLineInput',
          defaultValue: '',
          key: Date.now()
        });
      } else if (inputType == '多行文本框 +') {
        this.multiLineInput = true;
        lastSubarea.extend.push({
          inputType: '多行文本框',
          type: 'multiLineInput',
          defaultValue: '',
          key: Date.now()
        });
      } else if (inputType == '密码框 +') {
        this.pwdInput = true;
        lastSubarea.extend.push({
          inputType: '密码框',
          type: 'pwdInput',
          defaultValue: '',
          key: Date.now()
        });
      } else if (inputType == '数字框 +') {
        this.numInput = true;
        lastSubarea.extend.push({
          inputType: '数字框',
          defaultValue: '',
          type: 'numInput',
          key: Date.now()
        });
      } else if (inputType == '选择框 +') {
        this.selectInput = true;
        lastSubarea.extend.push({
          inputType: '选择框',
          type: 'selectInput',
          defaultValue: '',
          key: Date.now()
        });
      } else if (inputType == '时间日期 +') {
        this.dateInput = true;
        lastSubarea.extend.push({
          inputType: '时间日期',
          type: 'dateInput',
          defaultValue: '',
          key: Date.now()
        });
      }
    },
    removeDomain (item, subareaIndex) {
      let editSubareaGroups = this.subareaGroups[subareaIndex];
      var index = editSubareaGroups.extend.indexOf(item);
      if (index !== -1) {
        editSubareaGroups.extend.splice(index, 1);
      }
      let subareaGroupsString = JSON.stringify(this.subareaGroups);
      if (
        this.copySubareaLabelName == JSON.stringify(this.subareaLabelName) &&
        this.copyForm == subareaGroupsString
      ) {
        this.noneChange = false;
      } else {
        this.noneChange = true;
      }
    },

    proving () {
      this.form.minLength = this.form.minLength.replace(/[^\d]/g, '');
      this.form.maxLength = this.form.maxLength.replace(/[^\d]/g, '');
      this.form.minLength = this.form.minLength.replace('.', '');
      this.form.maxLength = this.form.maxLength.replace('.', '');
    },

    // 关闭编辑弹框
    closeForm () {
      if (this.existedDomain !== '' && this.existedSubarea !== '') {
        let nowEditSubarea = this.subareaGroups[this.existedSubarea];
        let nowEditDomain = nowEditSubarea.extend[this.existedDomain];
        nowEditDomain.label = this.form.label;
        nowEditDomain.defaultValue = this.form.defaultValue;
        nowEditDomain.fieldName = this.form.fieldName;
        nowEditDomain.dataType = this.form.dataType;
        nowEditDomain.date = this.form.date;
        nowEditDomain.maxLength = this.form.maxLength;
        nowEditDomain.minLength = this.form.minLength;
        nowEditDomain.readOnly = this.form.readOnly;
        nowEditDomain.moreSelect = this.form.moreSelect;
        nowEditDomain.required = this.form.required;
        nowEditDomain.decimalPrecision = this.form.decimalPrecision;
        nowEditDomain.verifier = this.form.verifier;
        nowEditDomain.defined = this.form.defined;
        nowEditDomain.valid_id = this.form.valid_id;
        nowEditDomain.rules = this.form.rules;
        nowEditDomain.sort = this.form.sort;
        nowEditDomain.type = this.form.type;
        nowEditDomain.unit = this.form.unit;
        nowEditDomain.dateOnly = this.form.dateOnly;

        // 判断最大长度和最小长度是否冲突
        if (nowEditDomain.maxLength && nowEditDomain.minLength) {
          if (
            parseInt(nowEditDomain.maxLength) <
            parseInt(nowEditDomain.minLength)
          ) {
            this.isErrorInput = true;
            return;
          }
        }

        // 判断是否仅日期，如果是，则修改时间。
        if (nowEditDomain.dateOnly === true) {
          nowEditDomain.defaultValue = nowEditDomain.defaultValue.slice(0, 10);
        }
        // 判断选择必填时，必填项是否为空

        if (nowEditDomain.label === '' || nowEditDomain.label === undefined) {
          this.isRequiredInput = true;
          return;
        } else if (nowEditDomain.label.replace(/\s+/g, '') === '') {
          this.isRequiredInput = true;
          return;
        }
      } else {
        let originalForm = {
          label: '',
          defaultValue: '',
          unit: '',
          rules: '',
          maxLength: '',
          minLength: '',
          readOnly: false,
          required: false,
          moreSelect: false,
          dataType: '',
          verifier: '',
          defined: [],
          date: '',
          fieldName: '',
          decimalPrecision: '',
          valid_id: '',
          sort: '',
          type: '',
          dateOnly: false
        };
        if (JSON.stringify(this.form) === JSON.stringify(originalForm)) {
          let lastSubarea = this.subareaGroups[this.subareaGroups.length - 1];
          lastSubarea.extend.pop();
        } else {
          let lastSubarea = this.subareaGroups[this.subareaGroups.length - 1];
          let lastDomain = lastSubarea.extend[lastSubarea.extend.length - 1];
          lastDomain.date = this.form.date;
          lastDomain.label = this.form.label;
          lastDomain.defaultValue = this.form.defaultValue;
          lastDomain.fieldName = this.form.fieldName;
          lastDomain.dataType = this.form.dataType;
          lastDomain.maxLength = this.form.maxLength;
          lastDomain.minLength = this.form.minLength;
          lastDomain.readOnly = this.form.readOnly;
          lastDomain.moreSelect = this.form.moreSelect;
          lastDomain.required = this.form.required;
          lastDomain.decimalPrecision = this.form.decimalPrecision;
          lastDomain.verifier = this.form.verifier;
          lastDomain.defined = this.form.defined;
          lastDomain.valid_id = this.form.valid_id;
          lastDomain.rules = this.form.rules;
          lastDomain.sort = this.form.sort;
          lastDomain.unit = this.form.unit;
          lastDomain.dateOnly = this.form.dateOnly;

          // 判断最大长度和最小长度是否冲突
          if (lastDomain.maxLength && lastDomain.minLength) {
            if (
              parseInt(lastDomain.maxLength) <= parseInt(lastDomain.minLength)
            ) {
              this.isErrorInput = true;
              return;
            }
          }

          // 判断是否仅日期，如果是，则修改时间。
          if (lastDomain.dateOnly === true) {
            lastDomain.defaultValue = lastDomain.defaultValue.slice(0, 10);
          }
          // 判断选择必填时，必填项是否为空
          if (lastDomain.label === '' || lastDomain.label === undefined) {
            this.isRequiredInput = true;
            return;
          } else if (lastDomain.label.replace(/\s+/g, '') === '') {
            this.isRequiredInput = true;
            return;
          }
          if (lastDomain.type === 'selectInput') {
            if (lastDomain.defined[0] === undefined) {
              this.isRequiredInput = true;
              return;
            }
          }
        }
      }
      let subareaGroupsString = JSON.stringify(this.subareaGroups);
      if (
        this.copyForm == subareaGroupsString &&
        this.copySubareaLabelName == JSON.stringify(this.subareaLabelName)
      ) {
        this.noneChange = false;
      } else {
        this.noneChange = true;
      }
      this.existedSubarea = '';
      this.existedDomain = '';
      this.singleLineInput = false;
      this.multiLineInput = false;
      this.pwdInput = false;
      this.numInput = false;
      this.selectInput = false;
      this.dateInput = false;
      this.isRequiredInput = false;
      this.definedItem = '';
      this.isErrorInput = false;
      this.form = {
        label: '',
        defaultValue: '',
        unit: '',
        rules: '',
        maxLength: '',
        minLength: '',
        readOnly: false,
        required: false,
        moreSelect: false,
        dataType: '',
        verifier: '',
        defined: [],
        date: '',
        fieldName: '',
        decimalPrecision: '',
        valid_id: '',
        sort: '',
        type: '',
        dateOnly: false
      };
    },
    getDomian (domain, domainIndex, subareaIndex) {
      if (arguments.length === 2) {
        this.islabelName = true;
      } else {
        if (domain.type === 'singleLineInput') {
          this.singleLineInput = true;
        } else if (domain.type === 'multiLineInput') {
          this.multiLineInput = true;
        } else if (domain.type === 'pwdInput') {
          this.pwdInput = true;
        } else if (domain.type === 'numInput') {
          this.numInput = true;
        } else if (domain.type === 'selectInput') {
          this.selectInput = true;
        } else if (domain.type === 'dateInput') {
          this.dateInput = true;
        }
        this.form = JSON.parse(JSON.stringify(domain));
        this.existedSubarea = subareaIndex;
        this.existedDomain = domainIndex;
      }
    },
    addDefined () {
      console.log(this.definedItem);
      if (this.form.defined === undefined) {
        this.form.defined = [];
      }
      if (
        this.definedItem !== '' &&
        this.definedItem.replace(/\s+/g, '') !== ''
      ) {
        this.form.defined.push(this.definedItem);
        this.definedItem = '';
      }
    },
    deleteItem (index) {
      this.form.defined.splice(index, 1);
    },
    // 提交
    clickSubmit () {
      this.subareaGroups.forEach(subarea => {
        subarea.extend.forEach(item => {
          if (item.rules) {
            if (item.rules === JSON.stringify(this.urlRule)) {
              item.rules = 'URL';
              item.rulesrReg =
                '^((ht|f)tps?):\\/\\/([\\w\\-]+(\\.[\\w\\-]+)*\\/)*[\\w\\-]+(\\.[\\w\\-]+)*\\/?(\\?([\\w\\-\\.,@?^=%&:\\/~\\+#]*)+)?';
            } else if (item.rules === JSON.stringify(this.IpRule)) {
              item.rules = 'IP地址';
              item.rulesrReg =
                '^(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|[1-9])\\.' +
                '(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\.' +
                '(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\.' +
                '(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)$';
            } else if (item.rules === JSON.stringify(this.maskRule)) {
              item.rules = '子网掩码';
              item.rulesrReg =
                '^(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])(\\.(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])){3}$';
            } else if (item.rules === JSON.stringify(this.portRule)) {
              item.rules = '端口号';
              item.rulesrReg =
                '^([0-9]|[1-9]\\d{1,3}|[1-5]\\d{4}|6[0-4]\\d{4}|65[0-4]\\d{2}|655[0-2]\\d|6553[0-5])$';
            } else if (item.rules === JSON.stringify(this.EmailRule)) {
              item.rules = 'Email';
              item.rulesrReg =
                '^[A-Za-z0-9\\u4e00-\\u9fa5]+@[a-zA-Z0-9_-]+(\\.[a-zA-Z0-9_-]+)+$';
            } else if (item.rules === JSON.stringify(this.phoneRule)) {
              item.rules = '手机号码';
              item.rulesrReg =
                '^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\\d{8}$';
            } else if (item.rules === JSON.stringify(this.nonnegativeRule)) {
              item.rules = '非负数';
              item.rulesrReg = '^\\d+(\\.{0,1}\\d+){0,1}$';
            } else if (item.rules === JSON.stringify(this.positiveRule)) {
              item.rules = '正整数';
              item.rulesrReg = '^[0-9]*[1-9][0-9]*$';
            }
          }
          if (item.verifier) {
            if (item.verifier === JSON.stringify(this.dateAndCode)) {
              item.verifier = '数字与字母组合';
              item.verifierReg = '^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]+$';
            } else if (item.verifier === JSON.stringify(this.dateOrCode)) {
              item.verifier = '数字或字母组合';
              item.verifierReg = '^[A-Za-z0-9]+$';
            } else if (item.verifier === JSON.stringify(this.onlyDate)) {
              item.verifier = '纯数字';
              item.verifierReg = '^[0-9]+$';
            } else if (item.verifier === JSON.stringify(this.onlyCode)) {
              item.verifier = '纯字母';
              item.verifierReg = '^[A-Za-z]+$';
            }
          }
          if (item.dataType) {
            if (item.dataType === JSON.stringify(this.jsonRule)) {
              item.dataType = 'JSON';
              item.dataTypeReg = '^{[s*"w+":"w+",*s*]+}$';
            }
          }
        });
      });
      let copyArray = [...this.subareaGroups];
      copyArray.unshift(this.subareaLabelName);

      let data = {
        templateId: this.templateId,
        // "content": JSON.stringify(extend)
        content: copyArray
      };
      console.log(copyArray);
      if (copyArray[1] && copyArray[1].extend.length > 0) {
        copyArray[1].extend.forEach(item => {
          item.options = [];
        });
        for (let i = 0; i < copyArray[1].extend.length; i++) {
          if (
            copyArray[1].extend[i].defined &&
            copyArray[1].extend[i].defined.length > 0
          ) {
            for (let j = 0; j < copyArray[1].extend[i].defined.length; j++) {
              copyArray[1].extend[i].options.push({
                value: j,
                label: copyArray[1].extend[i].defined[j]
              });
            }
          }
        }
      }

      axios.putTemplateDetail(data).then(res => {
        console.log(res);
        if (res.data.code === 200) {
          console.log(copyArray);
          if (copyArray[1] && copyArray[1].extend.length > 0) {
            copyArray[1].extend.forEach(item => {
              item.options = [];
            });
          }
          this.copyForm = JSON.stringify(this.subareaGroups);
          this.copySubareaLabelName = JSON.stringify(this.subareaLabelName);
          this.noneChange = false;
        } else {
          this.$notify.error({
            title: '错误',
            message: '未保存成功！'
          });
        }
      });
    },
    cancleChange () {
      if (this.copyForm) {
        this.subareaGroups = JSON.parse(this.copyForm);
      } else {
        this.subareaGroups = [];
      }
      this.subareaLabelName = JSON.parse(this.copySubareaLabelName);
      this.noneChange = false;
    },
    // 模糊查询
    fuzzySearch () {
      let name = '';
      axios.GetClassify(name).then(res => {
        let data = res.data.data;
        let tmpCITypeItems = data.result;
        tmpCITypeItems.forEach((ciType, index) => {
          this.$set(ciType, 'ifShow', true);
          ciType.templateList.forEach((item, index) => {
            this.$set(item, 'addHighLight', false);
            this.$set(item, 'ifChecked', false);
          });
        });

        if (this.searchSubarea === '' || this.searchSubarea === undefined) {
          // this.GetClassifyFn();
          let name = '';
          axios.GetClassify(name).then(res => {
            this.CITypeItems = res.data.data.result;
            console.log(this.CITypeItems);
            this.CITypeItems.forEach((ciType, index) => {
              this.$set(ciType, 'ifShow', true);
              ciType.templateList.forEach((item, index) => {
                this.$set(item, 'addHighLight', false);
                this.$set(item, 'ifChecked', false);
              });
            });
            if (this.CITypeItems[0] && this.CITypeItems[0].templateList[0]) {
              this.getCITypeItemDetail(
                this.CITypeItems[0].templateList[0].templateId
              );
            }
          });
        } else {
          for (let i = 0; i < tmpCITypeItems.length;) {
            for (let j = 0; j < tmpCITypeItems[i].templateList.length;) {
              if (
                tmpCITypeItems[i].templateList[j].name.indexOf(
                  this.searchSubarea
                ) === -1
              ) {
                tmpCITypeItems[i].templateList.splice(j, 1);
              } else {
                j++;
              }
            }
            if (tmpCITypeItems[i].templateList.length === 0) {
              tmpCITypeItems.splice(i, 1);
            } else {
              i++;
            }
          }
          this.CITypeItems = tmpCITypeItems;
          if (this.CITypeItems[0] && this.CITypeItems[0].templateList[0]) {
            this.getCITypeItemDetail(
              this.CITypeItems[0].templateList[0].templateId
            );
          }
        }
      });
    },
    GetClassifyFn () {
      let name = '';
      axios.GetClassify(name).then(res => {
        this.CITypeItems = res.data.data.result;
        console.log(this.CITypeItems);
        this.CITypeItems.forEach((ciType, index) => {
          this.$set(ciType, 'ifShow', true);
          ciType.templateList.forEach((item, index) => {
            this.$set(item, 'addHighLight', false);
            this.$set(item, 'ifChecked', false);
          });
        });
      });
    }
  },
  mounted () {
    // initFileds();
    let name = '';
    axios.GetClassify(name).then(res => {
      this.CITypeItems = res.data.data.result;
      console.log(this.CITypeItems);
      this.CITypeItems.forEach((ciType, index) => {
        this.$set(ciType, 'ifShow', true);
        ciType.templateList.forEach((item, index) => {
          this.$set(item, 'addHighLight', false);
          this.$set(item, 'ifChecked', false);
        });
      });
      if (this.CITypeItems[0] && this.CITypeItems[0].templateList[0]) {
        this.getCITypeItemDetail(
          this.CITypeItems[0].templateList[0].templateId
        );
      }
    });
  }
};
</script>

<style scoped lang="scss">
.contentBox1 {
  margin: 10px;
  #invisibleCover {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 5;
  }
  .templateWrapper1 {
    width: 100%;
    display: flex;
    & > div > p {
      display: inline-block;
      background-color: #00A8E8;
      color: #fff;
      height: 40px;
      /* width: 120px; */
      width: 205px;
      text-align: center;
      line-height: 40px;
    }
    .btns {
      position: relative;
      text-align: right;
    }
  }
  .content-wrapper {
    .left-side {
      position: relative;
      flex: 0 0 205px;
      margin-right: 20px;
      background-color: #fff;
      text-align: center;
      .left-side-title {
        height: 60px;
        font-size: 20px;
        font-weight: bolder;
        line-height: 60px;
        margin-bottom: 15px;
        position: relative;
        cursor: pointer;
        /*border-bottom: 1px solid #ccc;*/
        background-color: #fefefe;
        text-align: left;
        /*padding-left: 10px;*/
        .search-form {
          .serach-input {
            width: 260px;
            height: 44px;
            margin-right: 20px;
          }
        }
      }
      .tree-wrapper {
        .tree-block-title {
          /* width: 74%; */
          width: 80%;
          margin-left: 15%;
          text-align: left;
          font-size: 16px;
          font-weight: bolder;
          line-height: 16px;
          margin-bottom: 20px;
          clear: both;
          cursor: pointer;
          color: #666;
          position: relative;
          .iconStyle {
            vertical-align: top;
          }
        }
        .tree-block-item {
          /* width: 77%; */
          width: 83%;
          float: right;
          text-align: left;
          height: 40px;
          font-size: 14px;
          line-height: 20px;
          color: #2a2f55;
          opacity: 0.8;
          cursor: pointer;
          position: relative;
          &:hover {
            font-weight: bold;
          }
        }
      }
    }
    .right-content1 {
      flex-basis: 100%;
      display: flex;
      flex-direction: column;
      .tabs-wrapper1 {
        padding-top: 20px;
        flex: 1;
        background-color: #fff;
        min-height: 500px;
        margin-top: 20px;
        .subarea {
          .subareaHeader {
            height: 40px;
            line-height: 40px;
            font-size: 18px;
            font-weight: bold;
            color: #00A8E8;
            padding-left: 20px;
            /* border-bottom: 2px solid #423be2; */
            border-bottom: 1px solid #00A8E8;
            /* padding-left: 30px; */
            margin-bottom: 20px;
            /* background-image: url("../../../static/img/icon_bt.png");
            background-repeat: no-repeat;
            background-position: left center; */
          }
          .deleteSubarea {
            float: right;
            margin-right: 20px;
            line-height: 40px;
          }
        }
        .type-tempalte {
          /*border: 1px solid #000;*/
          width: 100%;
          max-width: 370px;
          color: #fff;
          position: fixed;
          bottom: 0;
          right: 55px;
          .type-tempalte-title {
            height: 76px;
            margin-left: 35px;
            background-color: #423be2;
            border-radius: 6px;
          }
          .type-tempalte-content {
            position: relative;
            margin-left: 35px;
            margin-top: 35px;
            padding-bottom: 5px;
            border-radius: 6px;
            border: solid 1px #e9e9e9;
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
                  line-height: 93px;
                  min-height: 500px;
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
        z-index: 9;
        border-radius: 6px;
        border: 1px solid #ccc;
        box-shadow: -5px 5px 10px #aaa;
        padding-bottom: 20px;
        .editTitle {
          height: 50px;
          background-color: #00A8E8;
          border-radius: 6px 6px 0 0;
          color: #fff;
          text-indent: 1.5em;
          line-height: 50px;
          font-weight: bold;
        }
        .subareaForm {
          .attributeItem {
            margin-top: 10px;
            & > p {
              margin-bottom: 8px;
            }
          }
        }
      }
    }
  }
  .el-tabs__item {
    font-size: 18px;
    height: 60px;
    line-height: 80px;
    .el-tabs__item {
      .is-active {
        color: rgb(66, 59, 226);
      }
      &:hover {
        color: rgb(66, 59, 226);
      }
    }
  }
  .highLigtht {
    /* color: #409eff; */
    color: #00A8E8;
  }
  .left-arrow-icon {
    display: inline-block;
    position: absolute;
    top: 20px;
    right: 15px;
  }
  .el-tabs__nav-wrap::after {
    background-color: rgba(255, 255, 255, 0);
  }
  .el-button--text {
    color: #fff;
  }
  .el-button--text:hover {
    color: #fff;
  }
  .el-button--text:focus {
    color: #fff;
  }
  .el-tabs__active-bar {
    background: linear-gradient(left, #ff4b95 0%, #9f43bd 28%, #3e3be4 100%);
  }
  .delicon {
    font-size: 2rem;
    cursor: pointer;
    display: inline-block;
    margin-left: 10px;
    img {
      height: 18px;
      /* margin-top: 10px; */
    }
  }

  .addbt {
    position: absolute;
    right: 0px;
    top: -62%;
  }
  .delbt {
    position: absolute;
    right: 0px;
    top: 20%;
  }
  .delbt1 {
    position: absolute;
    right: 50px;
    top: 20%;
  }
  .delbt2 {
    position: absolute;
    right: 0px;
    top: 20%;
  }
}
</style>
